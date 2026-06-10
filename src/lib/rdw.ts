import {findCatalogMatch} from "@/data/catalog";

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
  datum_eerste_toelating_dt?: string;
  datum_eerste_tenaamstelling_in_nederland_dt?: string;
  vervaldatum_apk_dt?: string;
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
};

export type RdwLookupResult = {
  source: "RDW Open Data";
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
      weightKg?: number | null;
      runningWeightKg?: number | null;
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
      firstRegistrationNl?: string;
      apkExpiry?: string;
    };
  };
  tuningMatch: ReturnType<typeof findCatalogMatch>;
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

  const powerKw = firstNumber(fuels.map((fuel) => fuel.nettomaximumvermogen));
  const fuelDescriptions = fuels
    .map((fuel) => fuel.brandstof_omschrijving)
    .filter(Boolean) as string[];

  const result: RdwLookupResult = {
    source: "RDW Open Data",
    cached: false,
    cacheTtlSeconds: ttl,
    vehicle: {
      plate,
      make: titleCase(vehicle.merk) ?? "Onbekend",
      model: titleCase(vehicle.handelsbenaming) ?? "Onbekend model",
      version: titleCase(vehicle.inrichting),
      type: vehicle.type,
      variant: vehicle.variant,
      execution: vehicle.uitvoering,
      vehicleType: titleCase(vehicle.voertuigsoort),
      body: titleCase(vehicle.inrichting),
      color: titleCase(vehicle.eerste_kleur),
      doors: toNumber(vehicle.aantal_deuren),
      seats: toNumber(vehicle.aantal_zitplaatsen),
      fuel: fuelDescriptions[0],
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
        weightKg: toNumber(vehicle.massa_ledig_voertuig),
        runningWeightKg: toNumber(vehicle.massa_rijklaar)
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
        firstAdmission: toIsoDate(vehicle.datum_eerste_toelating_dt),
        firstRegistrationNl: toIsoDate(
          vehicle.datum_eerste_tenaamstelling_in_nederland_dt
        ),
        apkExpiry: toIsoDate(vehicle.vervaldatum_apk_dt)
      }
    },
    tuningMatch: null,
    raw: {
      vehicle,
      fuels
    }
  };

  result.tuningMatch = findCatalogMatch({
    make: result.vehicle.make,
    model: result.vehicle.model,
    fuel: result.vehicle.fuel,
    powerHp: result.vehicle.engine.powerHp
  });

  memoryCache.set(plate, {
    expiresAt: Date.now() + ttl * 1000,
    result
  });

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

  const headers: HeadersInit = {
    Accept: "application/json"
  };

  if (process.env.RDW_APP_TOKEN) {
    headers["X-App-Token"] = process.env.RDW_APP_TOKEN;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: getCacheTtl()
    }
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

function toIsoDate(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value.slice(0, 10);
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
  constructor(
    public code: "INVALID_PLATE" | "RDW_UNAVAILABLE",
    message: string
  ) {
    super(message);
  }
}
