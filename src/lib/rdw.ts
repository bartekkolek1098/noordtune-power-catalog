import "server-only";

import {createHash} from "node:crypto";
import {findCatalogMatch} from "@/data/catalog";
import {
  buildPurchaseSignals,
  getApkFacts,
  getDaysBetweenFirstAdmissionAndNlRegistration,
  getDaysSince,
  isLikelyImported
} from "@/lib/rdw-signals";
import {
  attachPlateToRdwCore,
  toPlateFreeRdwCore,
  type RdwLookupCore
} from "@/lib/rdw-cache-core";
import type {
  RdwApkDefectItem,
  RdwFuelEnvironment,
  RdwLookupResult,
  RdwRecallItem,
  RdwSourceAvailability,
  RdwSourceKey,
  RdwSourceStatus
} from "@/lib/rdw-types";

export type {RdwLookupResult} from "@/lib/rdw-types";

const RDW_BASE_URL = "https://opendata.rdw.nl/resource";
const MAX_CACHE_ENTRIES = 250;
const APK_HISTORY_QUERY_LIMIT = 24;
const APK_HISTORY_PUBLIC_LIMIT = 12;
const RECALL_STATUS_LIMIT = 20;
const RECALL_DETAILS_LIMIT = 20;
const DEFECT_REFERENCE_LIMIT = 100;

export const rdwDatasets = {
  vehicle: {id: "m9d7-ebf2", label: "Open Data RDW: Gekentekende_voertuigen"},
  fuel: {id: "8ys7-d773", label: "Open Data RDW: Gekentekende_voertuigen_brandstof"},
  "recall-status": {id: "t49b-isb7", label: "Open Data RDW: Terugroep_actie_status"},
  "recall-details": {id: "j9yg-7rg9", label: "Open Data RDW: Terugroep_actie"},
  "apk-defects": {id: "a34c-vvps", label: "Open Data RDW: Geconstateerde Gebreken"},
  "defect-reference": {id: "hx2c-gt7k", label: "Open Data RDW: Gebreken"}
} as const satisfies Record<RdwSourceKey, {id: string; label: string}>;

type RdwVehicleRow = {
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
  datum_tenaamstelling?: string;
  datum_tenaamstelling_dt?: string;
  datum_eerste_toelating?: string;
  datum_eerste_toelating_dt?: string;
  datum_eerste_tenaamstelling_in_nederland?: string;
  datum_eerste_tenaamstelling_in_nederland_dt?: string;
  vervaldatum_apk?: string;
  vervaldatum_apk_dt?: string;
  catalogusprijs?: string;
  bruto_bpm?: string;
  wam_verzekerd?: string;
  export_indicator?: string;
  openstaande_terugroepactie_indicator?: string;
  taxi_indicator?: string;
  wacht_op_keuren?: string;
  jaar_laatste_registratie_tellerstand?: string;
  tellerstandoordeel?: string;
  code_toelichting_tellerstandoordeel?: string;
  tenaamstellen_mogelijk?: string;
  maximum_massa_trekken_ongeremd?: string;
  maximum_trekken_massa_geremd?: string;
  laadvermogen?: string;
  eerste_kleur?: string;
  tweede_kleur?: string;
  aantal_zitplaatsen?: string;
  aantal_deuren?: string;
  maximale_constructiesnelheid?: string;
  lengte?: string;
  breedte?: string;
  type?: string;
  variant?: string;
  uitvoering?: string;
};

type RdwFuelRow = {
  kenteken?: string;
  brandstof_volgnummer?: string;
  brandstof_omschrijving?: string;
  brandstofverbruik_gecombineerd?: string;
  brandstof_verbruik_gecombineerd_wltp?: string;
  emissie_co2_gecombineerd_wltp?: string;
  co2_uitstoot_gecombineerd?: string;
  emissiecode_omschrijving?: string;
  uitlaatemissieniveau?: string;
  nettomaximumvermogen?: string;
  elektrisch_verbruik_enkel_elektrisch_wltp?: string;
  actie_radius_enkel_elektrisch_wltp?: string;
  actieradius?: string;
  klasse_hybride_elektrisch_voertuig?: string;
};

type RdwRecallStatusRow = {
  kenteken?: string;
  referentiecode_rdw?: string;
  code_status?: string;
  status?: string;
};

type RdwRecallDetailRow = {
  referentiecode_rdw?: string;
  referentiecode_producent?: string;
  omschrijving_defect?: string;
  beschrijving_van_het_herstel?: string;
  meer_informatie_op_internet?: string;
};

type RdwApkDefectRow = {
  meld_datum_door_keuringsinstantie?: string;
  meld_datum_door_keuringsinstantie_dt?: string;
  gebrek_identificatie?: string;
  aantal_gebreken_geconstateerd?: string;
  soort_erkenning_omschrijving?: string;
};

type RdwDefectReferenceRow = {
  gebrek_identificatie?: string;
  gebrek_omschrijving?: string;
  ingangsdatum_gebrek_dt?: string;
};

type InternalRdwSourceStatus = RdwSourceStatus & {durationMs: number};
type SourceResult<T> = {rows: T[]; status: InternalRdwSourceStatus};
type CacheEntry = {expiresAt: number; result: RdwLookupCore};
type RdwQuery = {
  filters?: Record<string, string>;
  limit: number;
  order?: string;
  select: readonly string[];
  where?: string;
};

const vehicleFields = [
  "kenteken", "voertuigsoort", "merk", "handelsbenaming", "inrichting",
  "aantal_cilinders", "cilinderinhoud", "massa_ledig_voertuig", "massa_rijklaar",
  "toegestane_maximum_massa_voertuig", "datum_tenaamstelling",
  "datum_tenaamstelling_dt", "datum_eerste_toelating", "datum_eerste_toelating_dt",
  "datum_eerste_tenaamstelling_in_nederland",
  "datum_eerste_tenaamstelling_in_nederland_dt", "vervaldatum_apk",
  "vervaldatum_apk_dt", "catalogusprijs", "bruto_bpm", "wam_verzekerd",
  "export_indicator", "openstaande_terugroepactie_indicator", "taxi_indicator",
  "wacht_op_keuren", "jaar_laatste_registratie_tellerstand", "tellerstandoordeel",
  "code_toelichting_tellerstandoordeel", "tenaamstellen_mogelijk",
  "maximum_massa_trekken_ongeremd", "maximum_trekken_massa_geremd",
  "laadvermogen", "eerste_kleur", "tweede_kleur", "aantal_zitplaatsen",
  "aantal_deuren", "maximale_constructiesnelheid", "lengte", "breedte", "type",
  "variant", "uitvoering"
] as const;

const fuelFields = [
  "kenteken", "brandstof_volgnummer", "brandstof_omschrijving",
  "brandstofverbruik_gecombineerd", "brandstof_verbruik_gecombineerd_wltp",
  "emissie_co2_gecombineerd_wltp", "co2_uitstoot_gecombineerd",
  "emissiecode_omschrijving", "uitlaatemissieniveau", "nettomaximumvermogen",
  "elektrisch_verbruik_enkel_elektrisch_wltp", "actie_radius_enkel_elektrisch_wltp",
  "actieradius", "klasse_hybride_elektrisch_voertuig"
] as const;

const memoryCache = new Map<string, CacheEntry>();
const inFlightLookups = new Map<string, Promise<RdwLookupCore | null>>();

export const __rdwTestHooks = {
  clearMemoryState() {
    memoryCache.clear();
    inFlightLookups.clear();
  },
  serializedCacheValues() {
    return JSON.stringify(Array.from(memoryCache.values(), (entry) => entry.result));
  }
};

export function normalizeKenteken(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function isValidKenteken(value: string) {
  return /^[A-Z0-9]{6}$/.test(value);
}

export async function lookupRdwVehicle(input: string): Promise<RdwLookupResult | null> {
  const plate = normalizeKenteken(input);

  if (!isValidKenteken(plate)) {
    throw new RdwLookupError("INVALID_PLATE", "Invalid Dutch license plate.");
  }

  const ttl = getCacheTtl();
  const cacheKey = createHash("sha256").update(plate).digest("hex");
  const now = Date.now();
  pruneMemoryCache(now);
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return attachPlateToRdwCore(cached.result, plate, true);
  }

  const inFlight = inFlightLookups.get(cacheKey);

  if (inFlight) {
    const result = await inFlight;
    return result ? attachPlateToRdwCore(result, plate, false) : null;
  }

  const lookup = fetchAndBuildResult(plate).then((result) =>
    result ? toPlateFreeRdwCore(result) : null
  );
  inFlightLookups.set(cacheKey, lookup);

  try {
    const result = await lookup;

    if (result) {
      setMemoryCache(cacheKey, result, ttl);
    }

    return result ? attachPlateToRdwCore(result, plate, false) : null;
  } finally {
    inFlightLookups.delete(cacheKey);
  }
}

async function fetchAndBuildResult(plate: string) {
  const baseResults = await Promise.allSettled([
    fetchSource<RdwVehicleRow>("vehicle", {filters: {kenteken: plate}, limit: 1, select: vehicleFields}),
    fetchSource<RdwFuelRow>("fuel", {
      filters: {kenteken: plate}, limit: 5, order: "brandstof_volgnummer ASC", select: fuelFields
    }),
    fetchSource<RdwRecallStatusRow>("recall-status", {
      filters: {kenteken: plate}, limit: RECALL_STATUS_LIMIT,
      select: ["kenteken", "referentiecode_rdw", "code_status", "status"]
    }),
    fetchSource<RdwApkDefectRow>("apk-defects", {
      filters: {kenteken: plate}, limit: APK_HISTORY_QUERY_LIMIT,
      order: "meld_datum_door_keuringsinstantie_dt DESC",
      select: ["meld_datum_door_keuringsinstantie", "meld_datum_door_keuringsinstantie_dt",
        "gebrek_identificatie", "aantal_gebreken_geconstateerd", "soort_erkenning_omschrijving"]
    })
  ]);
  const vehicleResult = settledSource(baseResults[0], "vehicle");

  if (vehicleResult.status.status === "unavailable") {
    throw new RdwLookupError("RDW_UNAVAILABLE", "RDW vehicle data is unavailable.");
  }

  const vehicle = vehicleResult.rows[0];

  if (!vehicle) {
    return null;
  }

  const fuelResult = settledSource(baseResults[1], "fuel");
  const recallStatusResult = settledSource(baseResults[2], "recall-status");
  const apkDefectResult = settledSource(baseResults[3], "apk-defects");
  const fuels = fuelResult.rows;
  const openRecallRows = recallStatusResult.rows.filter(isOpenRecall);
  const recallCodes = uniqueStrings(openRecallRows.map((row) => cleanText(row.referentiecode_rdw)))
    .slice(0, RECALL_DETAILS_LIMIT);
  const defectCodes = uniqueStrings(apkDefectResult.rows.map((row) => cleanText(row.gebrek_identificatie)));
  const detailResults = await Promise.allSettled([
    recallCodes.length > 0
      ? fetchSource<RdwRecallDetailRow>("recall-details", {
          limit: RECALL_DETAILS_LIMIT,
          select: ["referentiecode_rdw", "referentiecode_producent", "omschrijving_defect",
            "beschrijving_van_het_herstel", "meer_informatie_op_internet"],
          where: whereIn("referentiecode_rdw", recallCodes)
        })
      : Promise.resolve(notApplicableSource<RdwRecallDetailRow>("recall-details")),
    defectCodes.length > 0
      ? fetchSource<RdwDefectReferenceRow>("defect-reference", {
          limit: DEFECT_REFERENCE_LIMIT, order: "ingangsdatum_gebrek_dt DESC",
          select: ["gebrek_identificatie", "gebrek_omschrijving", "ingangsdatum_gebrek_dt"],
          where: whereIn("gebrek_identificatie", defectCodes)
        })
      : Promise.resolve(notApplicableSource<RdwDefectReferenceRow>("defect-reference"))
  ]);
  const recallDetailResult = settledSource(detailResults[0], "recall-details");
  const defectReferenceResult = settledSource(detailResults[1], "defect-reference");
  const sourceStatus = [
    vehicleResult.status,
    fuelResult.status,
    recallStatusResult.status,
    adjustDetailStatus(recallDetailResult, recallCodes),
    apkDefectResult.status,
    adjustDetailStatus(defectReferenceResult, defectCodes)
  ];
  const firstAdmission = toIsoDate(vehicle.datum_eerste_toelating_dt ?? vehicle.datum_eerste_toelating);
  const firstRegistrationNl = toIsoDate(
    vehicle.datum_eerste_tenaamstelling_in_nederland_dt ?? vehicle.datum_eerste_tenaamstelling_in_nederland
  );
  const currentRegistrationDate = toIsoDate(vehicle.datum_tenaamstelling_dt ?? vehicle.datum_tenaamstelling);
  const apkExpiry = toIsoDate(vehicle.vervaldatum_apk_dt ?? vehicle.vervaldatum_apk);
  const roadworthiness = {apkExpiry, ...getApkFacts(apkExpiry)};
  const ownershipRegistration: RdwLookupResult["ownershipRegistration"] = {
    currentRegistrationDate,
    firstAdmission,
    firstRegistrationNl,
    transferPossible: toOfficialBoolean(vehicle.tenaamstellen_mogelijk),
    exportIndicator: toOfficialBoolean(vehicle.export_indicator),
    waitingForInspection: toOfficialBoolean(vehicle.wacht_op_keuren),
    taxiIndicator: toOfficialBoolean(vehicle.taxi_indicator),
    likelyImported: isLikelyImported(firstAdmission, firstRegistrationNl),
    daysBetweenFirstAdmissionAndNlRegistration:
      getDaysBetweenFirstAdmissionAndNlRegistration(firstAdmission, firstRegistrationNl),
    daysSinceLastRegistration: getDaysSince(currentRegistrationDate)
  };
  const insurance = {wamInsured: toOfficialBoolean(vehicle.wam_verzekerd)};
  const odometer = {
    judgement: displayText(vehicle.tellerstandoordeel),
    explanationCode: displayText(vehicle.code_toelichting_tellerstandoordeel),
    lastRegistrationYear: toNumber(vehicle.jaar_laatste_registratie_tellerstand)
  };
  const openIndicator = toOfficialBoolean(vehicle.openstaande_terugroepactie_indicator);
  const hasOpenRecallRows = openRecallRows.length > 0;
  const recallStatus: RdwLookupResult["recalls"]["status"] =
    openIndicator === true || hasOpenRecallRows
      ? "open"
      : openIndicator === false && recallStatusResult.status.status === "available"
        ? "clear"
        : "unknown";
  const recalls: RdwLookupResult["recalls"] = {
    status: recallStatus,
    openIndicator,
    openCount:
      recallCodes.length > 0
        ? recallCodes.length
        : recallStatus === "clear"
          ? 0
          : null,
    detailsAvailable:
      recallStatus === "clear" ||
      (recallStatus === "open" &&
        hasOpenRecallRows &&
        recallDetailResult.status.status !== "unavailable"),
    items: buildRecallItems(openRecallRows, recallDetailResult.rows)
  };
  const apkHistoryItems = buildApkHistory(apkDefectResult.rows, defectReferenceResult.rows);
  const powerKw = firstNumber(fuels.map((fuel) => fuel.nettomaximumvermogen));
  const fuelDescriptions = fuels.map((fuel) => titleCase(fuel.brandstof_omschrijving))
    .filter((value): value is string => Boolean(value));
  const result: RdwLookupResult = {
    source: "RDW Open Data",
    cached: false,
    fetchedAt: new Date().toISOString(),
    vehicle: {
      plate,
      make: titleCase(vehicle.merk) ?? "Onbekend",
      model: titleCase(vehicle.handelsbenaming) ?? "Onbekend model",
      version: titleCase(vehicle.inrichting),
      type: cleanText(vehicle.type),
      variant: cleanText(vehicle.variant),
      execution: cleanText(vehicle.uitvoering),
      vehicleType: titleCase(vehicle.voertuigsoort),
      body: titleCase(vehicle.inrichting),
      color: titleCase(vehicle.eerste_kleur),
      secondColor: titleCase(vehicle.tweede_kleur),
      doors: toNumber(vehicle.aantal_deuren),
      seats: toNumber(vehicle.aantal_zitplaatsen),
      fuel: fuelDescriptions[0],
      fuels: fuelDescriptions,
      engine: {
        cylinders: toNumber(vehicle.aantal_cilinders),
        displacementCc: toNumber(vehicle.cilinderinhoud),
        powerKw,
        powerHp: powerKw !== null ? Math.round(powerKw * 1.35962) : null
      },
      dimensions: {
        lengthCm: toNumber(vehicle.lengte), widthCm: toNumber(vehicle.breedte),
        weightKg: toNumber(vehicle.massa_ledig_voertuig), runningWeightKg: toNumber(vehicle.massa_rijklaar)
      },
      performance: {topSpeedKmh: toNumber(vehicle.maximale_constructiesnelheid)},
      emissions: {
        co2Gkm: firstNumber(fuels.map((fuel) => fuel.co2_uitstoot_gecombineerd)),
        euroClass: cleanText(fuels[0]?.emissiecode_omschrijving),
        exhaustLevel: cleanText(fuels[0]?.uitlaatemissieniveau)
      },
      registration: {firstAdmission, firstRegistrationNl, apkExpiry}
    },
    ownershipRegistration,
    roadworthiness,
    odometer,
    insurance,
    recalls,
    apkHistory: {items: apkHistoryItems, returnedRows: apkHistoryItems.length, maximumRows: APK_HISTORY_PUBLIC_LIMIT},
    purchaseSignals: [],
    financial: {catalogPriceEur: toNumber(vehicle.catalogusprijs), grossBpmEur: toNumber(vehicle.bruto_bpm)},
    towing: {
      unbrakedKg: toNumber(vehicle.maximum_massa_trekken_ongeremd),
      brakedKg: toNumber(vehicle.maximum_trekken_massa_geremd),
      payloadKg: toNumber(vehicle.laadvermogen),
      runningWeightKg: toNumber(vehicle.massa_rijklaar)
    },
    environment: {fuels: fuels.map(toFuelEnvironment)},
    sourceStatus: sourceStatus.map(stripInternalSourceTiming),
    tuningMatch: null
  };

  result.purchaseSignals = buildPurchaseSignals({
    insurance, odometer, ownershipRegistration, recalls, roadworthiness
  });
  result.tuningMatch = findCatalogMatch({
    make: result.vehicle.make,
    model: result.vehicle.model,
    fuel: result.vehicle.fuel,
    powerHp: result.vehicle.engine.powerHp
  });

  return result;
}

async function fetchSource<T>(source: RdwSourceKey, query: RdwQuery): Promise<SourceResult<T>> {
  const startedAt = Date.now();
  const rows = await fetchRdwRows<T>(rdwDatasets[source].id, query);
  return {rows, status: sourceStatus(source, "available", rows.length, Date.now() - startedAt)};
}

async function fetchRdwRows<T>(resource: string, query: RdwQuery): Promise<T[]> {
  const url = new URL(`${RDW_BASE_URL}/${resource}.json`);
  url.searchParams.set("$limit", String(Math.max(1, Math.min(100, Math.floor(query.limit)))));
  url.searchParams.set("$select", query.select.join(","));

  for (const [field, value] of Object.entries(query.filters ?? {})) {
    url.searchParams.set(field, value);
  }

  if (query.order) url.searchParams.set("$order", query.order);
  if (query.where) url.searchParams.set("$where", query.where);

  const headers: HeadersInit = {Accept: "application/json"};
  if (process.env.RDW_APP_TOKEN) headers["X-App-Token"] = process.env.RDW_APP_TOKEN;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getRequestTimeoutMs());

    try {
      const response = await fetch(url, {cache: "no-store", headers, signal: controller.signal});
      if (!response.ok) {
        throw new RdwLookupError("RDW_UNAVAILABLE", `RDW resource ${resource} returned ${response.status}.`);
      }
      const payload: unknown = await response.json();
      if (!Array.isArray(payload)) {
        throw new RdwLookupError("RDW_UNAVAILABLE", "RDW returned an invalid payload.");
      }
      return payload as T[];
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      clearTimeout(timeout);
    }
  }

  if (lastError instanceof RdwLookupError) throw lastError;
  throw new RdwLookupError("RDW_UNAVAILABLE", `RDW resource ${resource} timed out.`);
}

function settledSource<T>(result: PromiseSettledResult<SourceResult<T>>, source: RdwSourceKey): SourceResult<T> {
  return result.status === "fulfilled"
    ? result.value
    : {rows: [], status: sourceStatus(source, "unavailable", 0, 0)};
}

function notApplicableSource<T>(source: RdwSourceKey): SourceResult<T> {
  return {rows: [], status: sourceStatus(source, "not-applicable", 0, 0)};
}

function adjustDetailStatus<T>(result: SourceResult<T>, requestedCodes: string[]) {
  if (result.status.status !== "available" || requestedCodes.length === 0) return result.status;
  return result.rows.length < requestedCodes.length
    ? {...result.status, status: "partial" as const}
    : result.status;
}

function sourceStatus(
  source: RdwSourceKey,
  status: RdwSourceAvailability,
  rowCount: number,
  durationMs: number
): InternalRdwSourceStatus {
  return {source, datasetId: rdwDatasets[source].id, label: rdwDatasets[source].label, status, rowCount, durationMs};
}

function stripInternalSourceTiming(status: InternalRdwSourceStatus): RdwSourceStatus {
  const {durationMs, ...publicStatus} = status;
  void durationMs;
  return publicStatus;
}

function buildRecallItems(rows: RdwRecallStatusRow[], detailRows: RdwRecallDetailRow[]): RdwRecallItem[] {
  const details = new Map(
    detailRows.map((row) => [cleanText(row.referentiecode_rdw), row] as const)
      .filter((entry): entry is readonly [string, RdwRecallDetailRow] => Boolean(entry[0]))
  );
  const seen = new Set<string>();

  return rows.flatMap((row) => {
    const referenceCode = cleanText(row.referentiecode_rdw);
    if (!referenceCode || seen.has(referenceCode)) return [];
    seen.add(referenceCode);
    const detail = details.get(referenceCode);
    return [{
      referenceCode,
      producerReference: cleanText(detail?.referentiecode_producent),
      status: cleanText(row.status) ?? cleanText(row.code_status) ?? "Open",
      defectDescription: cleanText(detail?.omschrijving_defect),
      remedyDescription: cleanText(detail?.beschrijving_van_het_herstel),
      informationUrl: safeHttpUrl(detail?.meer_informatie_op_internet)
    }];
  });
}

function buildApkHistory(rows: RdwApkDefectRow[], referenceRows: RdwDefectReferenceRow[]): RdwApkDefectItem[] {
  const descriptions = new Map<string, string>();
  for (const row of referenceRows) {
    const code = cleanText(row.gebrek_identificatie);
    const description = cleanText(row.gebrek_omschrijving);
    if (code && description && !descriptions.has(code)) descriptions.set(code, description);
  }

  return rows.slice(0, APK_HISTORY_PUBLIC_LIMIT).flatMap((row) => {
    const inspectionDate = toIsoDate(
      row.meld_datum_door_keuringsinstantie_dt ?? row.meld_datum_door_keuringsinstantie
    );
    const defectCode = cleanText(row.gebrek_identificatie);
    if (!inspectionDate || !defectCode) return [];
    return [{
      inspectionDate,
      defectCode,
      description: descriptions.get(defectCode),
      count: toNumber(row.aantal_gebreken_geconstateerd) ?? 1,
      inspectionType: cleanText(row.soort_erkenning_omschrijving)
    }];
  });
}

function toFuelEnvironment(row: RdwFuelRow): RdwFuelEnvironment {
  return {
    fuel: titleCase(row.brandstof_omschrijving),
    powerKw: toNumber(row.nettomaximumvermogen),
    combinedConsumption: toNumber(row.brandstofverbruik_gecombineerd),
    combinedConsumptionWltp: toNumber(row.brandstof_verbruik_gecombineerd_wltp),
    co2CombinedGkm: toNumber(row.co2_uitstoot_gecombineerd),
    co2CombinedWltpGkm: toNumber(row.emissie_co2_gecombineerd_wltp),
    emissionClass: cleanText(row.emissiecode_omschrijving),
    exhaustEmissionLevel: cleanText(row.uitlaatemissieniveau),
    electricConsumptionWltp: toNumber(row.elektrisch_verbruik_enkel_elektrisch_wltp),
    electricRangeWltpKm: toNumber(row.actie_radius_enkel_elektrisch_wltp),
    rangeKm: toNumber(row.actieradius),
    hybridClass: cleanText(row.klasse_hybride_elektrisch_voertuig)
  };
}

function isOpenRecall(row: RdwRecallStatusRow) {
  const code = cleanText(row.code_status)?.toUpperCase();
  const status = cleanText(row.status)?.toLocaleLowerCase("nl-NL");
  return code === "O" || status?.includes("openstaande terugroepactie") === true;
}

function whereIn(field: string, values: string[]) {
  return `${field} in (${values.map((value) => `'${value.replaceAll("'", "''")}'`).join(",")})`;
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function toOfficialBoolean(value: string | undefined) {
  const normalized = cleanText(value)?.toLocaleLowerCase("nl-NL");
  if (!normalized || normalized.includes("geen verstrekking") || normalized === "n.v.t.") return null;
  if (["ja", "j", "yes", "y", "1"].includes(normalized)) return true;
  if (["nee", "n", "no", "0"].includes(normalized)) return false;
  return null;
}

function toNumber(value: string | undefined) {
  const normalized = cleanText(value);
  if (!normalized) return null;
  const parsed = Number(normalized.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function firstNumber(values: Array<string | undefined>) {
  for (const value of values) {
    const number = toNumber(value);
    if (number !== null) return number;
  }
  return null;
}

function toIsoDate(value: string | undefined) {
  const normalized = cleanText(value);
  if (!normalized) return undefined;
  const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(normalized);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;
  return /^(\d{4}-\d{2}-\d{2})/.exec(normalized)?.[1];
}

function cleanText(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || ["n.v.t.", "niet van toepassing"].includes(normalized.toLocaleLowerCase("nl-NL"))) return undefined;
  return normalized;
}

function displayText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function titleCase(value: string | undefined) {
  const normalized = cleanText(value);
  if (!normalized) return undefined;
  return normalized.toLowerCase().split(/\s+/).filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function safeHttpUrl(value: string | undefined) {
  const normalized = cleanText(value);
  if (!normalized) return undefined;
  try {
    const url = new URL(normalized);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function getCacheTtl() {
  const value = Number(process.env.RDW_CACHE_TTL_SECONDS ?? 21600);
  return Number.isFinite(value) && value > 0 ? value : 21600;
}

function getRequestTimeoutMs() {
  const value = Number(process.env.RDW_REQUEST_TIMEOUT_MS ?? 5000);
  return Number.isFinite(value) && value >= 500 ? value : 5000;
}

function pruneMemoryCache(now = Date.now()) {
  for (const [key, entry] of memoryCache) if (entry.expiresAt <= now) memoryCache.delete(key);
}

function setMemoryCache(key: string, result: RdwLookupCore, ttl: number) {
  pruneMemoryCache();
  if (memoryCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = memoryCache.keys().next().value as string | undefined;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, {expiresAt: Date.now() + ttl * 1000, result});
}

export class RdwLookupError extends Error {
  constructor(public code: "INVALID_PLATE" | "RDW_UNAVAILABLE", message: string) {
    super(message);
  }
}
