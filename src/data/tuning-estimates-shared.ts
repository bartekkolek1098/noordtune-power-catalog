import type {EngineVariant, FuelType, StageDefinition, StageName} from "./catalog-shared.ts";

export type EstimateStage = Omit<StageDefinition, "powerHp" | "torqueNm" | "price" | "sourcePrice" | "quote"> & {
  powerHp?: number;
  torqueNm?: number;
};

export type EstimateSourceReference = {
  title: string;
  url?: string;
  scope: string;
  retrievedAt?: string;
  sourceType: "existing-catalog" | "manufacturer" | "tuner";
  retrievalMethod?: "page" | "search-index";
};

/** A peak-value catalog illustration, never identification of an installed ECU or a dyno run. */
export type TuningEstimateProfile = Pick<EngineVariant,
  "options" | "gearbox" | "serviceCompatibility" | "recommendedPackage" | "ecuSupport" | "ecuType"
  | "transmissionSupport" | "tcuSupport" | "generation" | "version" | "yearRange"
> & {
  id: string;
  vehicleId?: string;
  brand: string;
  model: string;
  engine: string;
  fuel: FuelType;
  stockPowerHp: number;
  stockTorqueNm?: number;
  stages: EstimateStage[];
  provenance: "existing-catalog" | "tuner-reference";
  sourceReferences: EstimateSourceReference[];
  conditions: string[];
  conditionCodes?: string[];
  verificationRequired: true;
};

export type EstimateResolution = {
  status: "applicable" | "conditional" | "unavailable";
  profile?: TuningEstimateProfile;
  reasonCodes: string[];
};

/** Client-safe adapter; receives one selected vehicle, never imports the catalog. */
export function getCatalogEstimateProfile(vehicle: EngineVariant): TuningEstimateProfile {
  const is320iSource = vehicle.id === "bmw-3-series-g20-g21-320i";
  const is118iSource = vehicle.id === "bmw-1-series-f20-f21-118i";
  return {
    id: vehicle.id,
    vehicleId: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    engine: vehicle.engine,
    fuel: vehicle.fuel,
    generation: vehicle.generation,
    version: vehicle.version,
    yearRange: vehicle.yearRange,
    stockPowerHp: vehicle.stockPowerHp,
    stockTorqueNm: vehicle.stockTorqueNm,
    stages: vehicle.stages.map(({name, powerHp, torqueNm, requirements, packageItems,
      confidenceLevel, recommendedUse, hardwareRequired, tcuRecommended, logCheckRecommended, notes}) => ({
      name, powerHp, torqueNm, requirements, packageItems: [...packageItems],
      confidenceLevel: confidenceLevel ?? "estimated", recommendedUse, hardwareRequired,
      tcuRecommended, logCheckRecommended, notes: notes ? [...notes] : undefined
    })),
    options: [...vehicle.options],
    gearbox: vehicle.gearbox,
    serviceCompatibility: vehicle.serviceCompatibility,
    recommendedPackage: vehicle.recommendedPackage,
    ecuType: vehicle.ecuType,
    ecuSupport: vehicle.ecuSupport,
    transmissionSupport: vehicle.transmissionSupport,
    tcuSupport: vehicle.tcuSupport,
    provenance: "existing-catalog",
    sourceReferences: [{
      title: "NoordTune existing public catalog",
      sourceType: "existing-catalog",
      scope: `${vehicle.brand} ${vehicle.model}, ${vehicle.engine}, ${vehicle.yearRange}; existing source peak values, including estimated/generated provenance. Source ${vehicle.sourceCanonicalId ?? vehicle.id}.`
    }, ...(is320iSource ? [{
      title: "BMW 3 Series Touring manufacturer specifications (2019)",
      url: "https://www.press.bmwgroup.com/poland/article/attachment/T0297058PL/432766",
      sourceType: "manufacturer" as const,
      retrievedAt: "2026-09-15",
      retrievalMethod: "search-index" as const,
      scope: "G20/G21 320i 1998 cc / 184 hp manufacturer specification lists 300 Nm. Existing catalog stock torque 270 Nm is retained pending a separate source-data correction."
    }] : []), ...(is118iSource ? [{
      title: "BMW 118i engine transition in summer 2015",
      url: "https://www.press.bmwgroup.com/poland/article/detail/T0221323PL/zmiany-specyfikacyjne-w-modelach-bmw-w-lecie-2015?language=pl",
      sourceType: "manufacturer" as const,
      retrievedAt: "2026-09-15",
      retrievalMethod: "search-index" as const,
      scope: "BMW introduces a three-cylinder 136 hp 118i from July 2015. This catalog profile comes from a 2016 template and is scoped to the 1499 cc configuration; it does not establish tuning figures for the earlier same-power 1598 cc engine."
    }, {
      title: "BMW 1 Series manufacturer specifications, March 2015",
      url: "https://www.press.bmwgroup.com/slovak/article/attachment/T0206606SK/298406",
      sourceType: "manufacturer" as const,
      retrievedAt: "2026-09-15",
      retrievalMethod: "search-index" as const,
      scope: "Earlier 118i: 1598 cc / four cylinders / 136 hp. Equal stock power does not make this engine equivalent to the later 1499 cc configuration."
    }] : [])],
    conditions: [
      "Existing catalog estimates; exact engine/ECU, software, transmission, vehicle condition and applicable hardware require confirmation before work.",
      ...(is320iSource ? ["The retained catalog stock torque is 270 Nm; the manufacturer lists 300 Nm for G20/G21 320i. Source torque and derived gains require review before a separate source correction."] : []),
      ...(is118iSource ? ["This 2016-source 118i estimate is scoped to 1499 cc. The earlier 1598 cc / 136 hp engine is not equivalent and requires its own tuning reference."] : [])
    ],
    conditionCodes: [
      ...(is320iSource ? ["SOURCE_STOCK_TORQUE_DISCREPANCY"] : []),
      ...(is118iSource ? ["ENGINE_DISPLACEMENT_SCOPE_1499"] : [])
    ],
    verificationRequired: true
  };
}

export function unavailableEstimateStage(name: StageName): EstimateStage {
  return {
    name,
    requirements: "No applicable published output reference; scope to be confirmed.",
    packageItems: [],
    confidenceLevel: "estimated",
    hardwareRequired: name !== "Stage 1",
    notes: ["No power or torque values have been invented for this Stage."]
  };
}
