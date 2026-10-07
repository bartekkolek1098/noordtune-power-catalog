import {customerProfile} from "./customer-profile.ts";
import {findCatalogMatch} from "../data/catalog.ts";
import {assessVehicleAccess, resolveStageQuote, type QuoteResolution} from "../data/pricing.ts";
import {resolveRdwTuningEstimate} from "./rdw-tuning-estimate.ts";
import {getComparableSourceStage1, type SimilarStage1Comparison} from "./rdw-source-comparison.ts";
import {resolveDetailsAction} from "./details-action.ts";
import {engineCatalog} from "../data/catalog.ts";
import {firstAdmissionYear, parseRdwDate} from "./rdw-date.ts";

const VEHICLE_RESOURCE = "m9d7-ebf2";
const FUEL_RESOURCE = "8ys7-d773";
const RDW_BASE_URL = "https://opendata.rdw.nl/resource";

export type RdwVehicleRow = {
  kenteken?: string;
  voertuigsoort?: string;
  merk?: string;
  handelsbenaming?: string;
  inrichting?: string;
  aantal_cilinders?: string;
  cilinderinhoud?: string;
  massa_ledig_voertuig?: string;
  massa_rijklaar?: string;
  toegestane_maximum_massa_voertuig?: string;
  technische_max_massa_voertuig?: string;
  maximum_massa_samenstelling?: string;
  maximum_massa_trekken_ongeremd?: string;
  aanhangwagen_middenas_geremd?: string;
  laadvermogen?: string;
  wielbasis?: string;
  hoogte_voertuig?: string;
  aantal_wielen?: string;
  europese_voertuigcategorie?: string;
  type_gasinstallatie?: string;
  typegoedkeuringsnummer?: string;
  openstaande_terugroepactie_indicator?: string;
  tellerstandoordeel?: string;
  jaar_laatste_registratie_tellerstand?: string;
  datum_eerste_toelating_dt?: string;
  datum_eerste_toelating?: string;
  datum_eerste_tenaamstelling_in_nederland_dt?: string;
  datum_eerste_tenaamstelling_in_nederland?: string;
  vervaldatum_apk_dt?: string;
  vervaldatum_apk?: string;
  eerste_kleur?: string;
  aantal_deuren?: string;
  aantal_zitplaatsen?: string;
  maximale_constructiesnelheid?: string;
  lengte?: string;
  breedte?: string;
  type?: string;
  variant?: string;
  uitvoering?: string;
};

export type RdwFuelRow = {
  kenteken?: string;
  brandstof_omschrijving?: string;
  co2_uitstoot_gecombineerd?: string;
  emissiecode_omschrijving?: string;
  nettomaximumvermogen?: string;
  uitlaatemissieniveau?: string;
  brandstofverbruik_gecombineerd?: string;
};

export type RdwLookupResult = {
  source: "RDW Open Data";
  retrievedAt: string;
  cached: boolean;
  cacheTtlSeconds: number;
  vehicle: {
    plate: string;
    make: string;
    model: string;
    version?: string;
    type?: string;
    variant?: string;
    execution?: string;
    vehicleType?: string;
    body?: string;
    color?: string;
    doors?: number | null;
    seats?: number | null;
    fuel?: string;
    fuels: string[];
    engine: {
      cylinders?: number | null;
      displacementCc?: number | null;
      powerKw?: number | null;
      powerHp?: number | null;
    };
    dimensions: {
      lengthCm?: number | null;
      widthCm?: number | null;
      heightCm?: number | null;
      wheelbaseCm?: number | null;
      weightKg?: number | null;
      runningWeightKg?: number | null;
    };
    weights: {
      maximumPermittedKg?: number | null;
      technicalMaximumKg?: number | null;
      combinedMaximumKg?: number | null;
      payloadKg?: number | null;
      brakedTrailerKg?: number | null;
      unbrakedTrailerKg?: number | null;
    };
    approval: {
      europeanCategory?: string;
      approvalNumber?: string;
      gasInstallationType?: string;
      wheels?: number | null;
      recallIndicator?: string;
    };
    odometer: {
      assessment?: string;
      assessmentYear?: number | null;
    };
    performance: {
      topSpeedKmh?: number | null;
    };
    emissions: {
      co2Gkm?: number | null;
      euroClass?: string;
      exhaustLevel?: string;
    };
    registration: {
      firstAdmission?: string;
      firstAdmissionYear?: number;
      firstRegistrationNl?: string;
      apkExpiry?: string;
    };
  };
  // Only the identity assessment summary crosses the API boundary. Candidate
  // arrays and rejected canonical vehicles are never browser DTOs.
  tuningMatch: Pick<ReturnType<typeof findCatalogMatch>, "status" | "reasonCodes">;
  tuningEstimate: ReturnType<typeof resolveRdwTuningEstimate>;
  /** Similar sourced applications, NEVER numeric output attributed to this vehicle. */
  comparison?: SimilarStage1Comparison;
  tuningQuote: QuoteResolution;
  raw?: {
    vehicle: RdwVehicleRow;
    fuels: RdwFuelRow[];
  };
};

type CacheEntry = {
  expiresAt: number;
  result: RdwLookupResult;
};

const memoryCache = new Map<string, CacheEntry>();

export function normalizeKenteken(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function isValidKenteken(value: string) {
  return /^[A-Z0-9]{6}$/.test(value);
}

export async function lookupRdwVehicle(
  input: string
): Promise<RdwLookupResult | null> {
  const plate = normalizeKenteken(input);

  if (!isValidKenteken(plate)) {
    throw new RdwLookupError("INVALID_PLATE", "Invalid Dutch license plate.");
  }

  const ttl = getCacheTtl();
  const cached = memoryCache.get(plate);

  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.result,
      cached: true
    };
  }

  const [vehicles, fuels] = await Promise.all([
    fetchRdwRows<RdwVehicleRow>(VEHICLE_RESOURCE, plate, 1),
    fetchRdwRows<RdwFuelRow>(FUEL_RESOURCE, plate, 5)
  ]);

  const vehicle = vehicles[0];

  if (!vehicle) {
    return null;
  }

  const result = normalizeRdwVehicle(vehicle, fuels, plate, ttl);

  memoryCache.set(plate, {
    expiresAt: Date.now() + ttl * 1000,
    result
  });

  return result;
}

/** Pure normalization also used by sanitized executable regression fixtures. */
export function normalizeRdwVehicle(vehicle: RdwVehicleRow, fuels: RdwFuelRow[], plate: string, ttl = 172800): RdwLookupResult {
  // Multiple power rows do not establish a hybrid's combined system output.
  const powers = fuels.map((row) => toNumber(row.nettomaximumvermogen)).filter((value): value is number => value !== null && value > 0);
  const powerKw = powers.length === 1 ? powers[0] : null;
  const fuelDescriptions = fuels
    .map((fuel) => fuel.brandstof_omschrijving)
    .filter(Boolean) as string[];
  const firstAdmission = parseRdwDate(vehicle.datum_eerste_toelating_dt) ?? parseRdwDate(vehicle.datum_eerste_toelating);
  const identityInput = {
    make: vehicle.merk, model: vehicle.handelsbenaming,
    fuel: fuelDescriptions.join(" / "),
    registeredPower: powerKw === null ? undefined : {value: powerKw, unit: "kW" as const},
    displacementCc: toNumber(vehicle.cilinderinhoud),
    firstRegistrationDate: firstAdmission,
    firstRegistrationYear: firstAdmissionYear(firstAdmission),
    type: vehicle.type, variant: vehicle.variant, execution: vehicle.uitvoering,
    cylinders: toNumber(vehicle.aantal_cilinders)
  };
  const assessment = findCatalogMatch(identityInput);
  const tuningMatch = {status: assessment.status, reasonCodes: assessment.reasonCodes};
  const tuningEstimate = resolveRdwTuningEstimate(identityInput);
  tuningEstimate.detailsAction = resolveDetailsAction(tuningEstimate.profile, engineCatalog);
  if (tuningEstimate.profile) tuningEstimate.profile = customerProfile({...tuningEstimate.profile, conditionCodes: [...new Set([...(tuningEstimate.profile.conditionCodes ?? []), ...tuningEstimate.reasonCodes])]});
  const publicStage1 = tuningEstimate.profile?.stages.find(stage=>stage.name==="Stage 1");
  const hasScopedStage1 = publicStage1 && (publicStage1.powerHp!==undefined || publicStage1.powerRangeHp!==undefined);
  const comparison = !hasScopedStage1 ? getComparableSourceStage1(identityInput) : undefined;
  const quoteIdentity = tuningEstimate.profile ?? identityInput;
  const tuningQuote = resolveStageQuote(quoteIdentity, tuningEstimate.profile?.stages[0], {
    estimateApplicable: Boolean(tuningEstimate.profile), scope: "vehicle",
    access: assessVehicleAccess(quoteIdentity)
  });

  const result: RdwLookupResult = {
    source: "RDW Open Data",
    retrievedAt: new Date().toISOString(),
    cached: false,
    cacheTtlSeconds: ttl,
    vehicle: {
      plate,
      make: vehicle.merk?.trim() || "Onbekend",
      model: vehicle.handelsbenaming?.trim() || "Onbekend model",
      version: titleCase(vehicle.inrichting),
      type: vehicle.type,
      variant: vehicle.variant,
      execution: vehicle.uitvoering,
      vehicleType: titleCase(vehicle.voertuigsoort),
      body: titleCase(vehicle.inrichting),
      color: titleCase(vehicle.eerste_kleur),
      doors: toNumber(vehicle.aantal_deuren),
      seats: toNumber(vehicle.aantal_zitplaatsen),
      fuel: fuelDescriptions.join(" / ") || undefined,
      fuels: fuelDescriptions,
      engine: {
        cylinders: toNumber(vehicle.aantal_cilinders),
        displacementCc: toNumber(vehicle.cilinderinhoud),
        powerKw,
        powerHp: powerKw ? Math.round(powerKw * 1.35962) : null
      },
      dimensions: {
        lengthCm: toNumber(vehicle.lengte),
        widthCm: toNumber(vehicle.breedte),
        heightCm: toNumber(vehicle.hoogte_voertuig),
        wheelbaseCm: toNumber(vehicle.wielbasis),
        weightKg: toNumber(vehicle.massa_ledig_voertuig),
        runningWeightKg: toNumber(vehicle.massa_rijklaar)
      },
      weights: {
        maximumPermittedKg: toNumber(vehicle.toegestane_maximum_massa_voertuig),
        technicalMaximumKg: toNumber(vehicle.technische_max_massa_voertuig),
        combinedMaximumKg: toNumber(vehicle.maximum_massa_samenstelling),
        payloadKg: toNumber(vehicle.laadvermogen),
        brakedTrailerKg: toNumber(vehicle.aanhangwagen_middenas_geremd),
        unbrakedTrailerKg: toNumber(vehicle.maximum_massa_trekken_ongeremd)
      },
      approval: {
        europeanCategory: vehicle.europese_voertuigcategorie,
        approvalNumber: vehicle.typegoedkeuringsnummer,
        gasInstallationType: vehicle.type_gasinstallatie,
        wheels: toNumber(vehicle.aantal_wielen),
        recallIndicator: vehicle.openstaande_terugroepactie_indicator
      },
      odometer: {
        assessment: vehicle.tellerstandoordeel,
        assessmentYear: toNumber(vehicle.jaar_laatste_registratie_tellerstand)
      },
      performance: {
        topSpeedKmh: toNumber(vehicle.maximale_constructiesnelheid)
      },
      emissions: {
        co2Gkm: firstNumber(fuels.map((fuel) => fuel.co2_uitstoot_gecombineerd)),
        euroClass: fuels[0]?.emissiecode_omschrijving,
        exhaustLevel: fuels[0]?.uitlaatemissieniveau
      },
      registration: {
        firstAdmission,
        firstAdmissionYear: firstAdmissionYear(firstAdmission),
        firstRegistrationNl: parseRdwDate(vehicle.datum_eerste_tenaamstelling_in_nederland_dt) ?? parseRdwDate(vehicle.datum_eerste_tenaamstelling_in_nederland),
        apkExpiry: parseRdwDate(vehicle.vervaldatum_apk_dt) ?? parseRdwDate(vehicle.vervaldatum_apk)
      }
    },
    tuningMatch,
    tuningEstimate,
    ...(comparison ? {comparison}:{}),
    tuningQuote,
    raw: {
      vehicle,
      fuels
    }
  };

  return result;
}

async function fetchRdwRows<T>(
  resource: string,
  plate: string,
  limit: number
): Promise<T[]> {
  const url = new URL(`${RDW_BASE_URL}/${resource}.json`);
  url.searchParams.set("kenteken", plate);
  url.searchParams.set("$limit", String(limit));
  url.searchParams.set("$select", resource === VEHICLE_RESOURCE
    ? "merk,handelsbenaming,inrichting,voertuigsoort,aantal_cilinders,cilinderinhoud,massa_ledig_voertuig,massa_rijklaar,toegestane_maximum_massa_voertuig,technische_max_massa_voertuig,maximum_massa_samenstelling,maximum_massa_trekken_ongeremd,aanhangwagen_middenas_geremd,laadvermogen,wielbasis,hoogte_voertuig,aantal_wielen,europese_voertuigcategorie,type_gasinstallatie,typegoedkeuringsnummer,openstaande_terugroepactie_indicator,tellerstandoordeel,jaar_laatste_registratie_tellerstand,datum_eerste_toelating_dt,datum_eerste_toelating,datum_eerste_tenaamstelling_in_nederland_dt,datum_eerste_tenaamstelling_in_nederland,vervaldatum_apk_dt,vervaldatum_apk,eerste_kleur,aantal_deuren,aantal_zitplaatsen,maximale_constructiesnelheid,lengte,breedte,type,variant,uitvoering"
    : "brandstof_omschrijving,nettomaximumvermogen,co2_uitstoot_gecombineerd,emissiecode_omschrijving,uitlaatemissieniveau");

  const headers: HeadersInit = {
    Accept: "application/json"
  };

  if (process.env.RDW_APP_TOKEN) {
    headers["X-App-Token"] = process.env.RDW_APP_TOKEN;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new RdwLookupError(
      "RDW_UNAVAILABLE",
      `RDW returned ${response.status}`
    );
  }

  return (await response.json()) as T[];
}

function getCacheTtl() {
  const value = Number(process.env.RDW_CACHE_TTL_SECONDS ?? 172800);
  return Number.isFinite(value) && value > 0 ? value : 172800;
}

function toNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function firstNumber(values: Array<string | undefined>) {
  for (const value of values) {
    const parsed = toNumber(value);

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function titleCase(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export class RdwLookupError extends Error {
  public code: "INVALID_PLATE" | "RDW_UNAVAILABLE";
  constructor(
    code: "INVALID_PLATE" | "RDW_UNAVAILABLE",
    message: string
  ) {
    super(message);
    this.code = code;
  }
}
