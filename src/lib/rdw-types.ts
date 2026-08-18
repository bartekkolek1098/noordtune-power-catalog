import type {EngineVariant} from "@/data/catalog-shared";

export type RdwSourceAvailability =
  | "available"
  | "unavailable"
  | "partial"
  | "not-applicable";

export type RdwSourceKey =
  | "vehicle"
  | "fuel"
  | "recall-status"
  | "recall-details"
  | "apk-defects"
  | "defect-reference";

export type RdwSourceStatus = {
  source: RdwSourceKey;
  datasetId: string;
  label: string;
  status: RdwSourceAvailability;
  rowCount: number;
};

export type PurchaseSignalLevel = "positive" | "attention" | "check-required";

export type PurchaseSignalCode =
  | "apk-valid"
  | "apk-expiring"
  | "apk-expired"
  | "apk-unknown"
  | "odometer-logical"
  | "odometer-illogical"
  | "odometer-unknown"
  | "recall-clear"
  | "recall-open"
  | "recall-unknown"
  | "transfer-possible"
  | "transfer-blocked"
  | "exported"
  | "waiting-for-inspection"
  | "wam-uninsured"
  | "likely-import"
  | "recent-transfer"
  | "taxi-indicator";

export type PurchaseSignal = {
  code: PurchaseSignalCode;
  level: PurchaseSignalLevel;
  value?: string | number | boolean | null;
  date?: string;
  days?: number;
};

export type RdwRecallItem = {
  referenceCode: string;
  producerReference?: string;
  status: string;
  defectDescription?: string;
  remedyDescription?: string;
  informationUrl?: string;
};

export type RdwApkDefectItem = {
  inspectionDate: string;
  defectCode: string;
  description?: string;
  count: number;
  inspectionType?: string;
};

export type RdwFuelEnvironment = {
  fuel?: string;
  powerKw?: number | null;
  combinedConsumption?: number | null;
  combinedConsumptionWltp?: number | null;
  co2CombinedGkm?: number | null;
  co2CombinedWltpGkm?: number | null;
  emissionClass?: string;
  exhaustEmissionLevel?: string;
  electricConsumptionWltp?: number | null;
  electricRangeWltpKm?: number | null;
  rangeKm?: number | null;
  hybridClass?: string;
};

export type RdwLookupResult = {
  source: "RDW Open Data";
  cached: boolean;
  fetchedAt: string;
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
    secondColor?: string;
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
  ownershipRegistration: {
    currentRegistrationDate?: string;
    firstAdmission?: string;
    firstRegistrationNl?: string;
    transferPossible: boolean | null;
    exportIndicator: boolean | null;
    waitingForInspection: boolean | null;
    taxiIndicator: boolean | null;
    likelyImported: boolean | null;
    daysBetweenFirstAdmissionAndNlRegistration: number | null;
    daysSinceLastRegistration: number | null;
  };
  roadworthiness: {
    apkExpiry?: string;
    status: "valid" | "expiring-soon" | "expired" | "unknown";
    daysUntilExpiry: number | null;
  };
  odometer: {
    judgement?: string;
    explanationCode?: string;
    lastRegistrationYear?: number | null;
  };
  insurance: {
    wamInsured: boolean | null;
  };
  recalls: {
    status: "open" | "clear" | "unknown";
    openIndicator: boolean | null;
    openCount: number | null;
    detailsAvailable: boolean;
    items: RdwRecallItem[];
  };
  apkHistory: {
    items: RdwApkDefectItem[];
    returnedRows: number;
    maximumRows: number;
  };
  purchaseSignals: PurchaseSignal[];
  financial: {
    catalogPriceEur?: number | null;
    grossBpmEur?: number | null;
  };
  towing: {
    unbrakedKg?: number | null;
    brakedKg?: number | null;
    payloadKg?: number | null;
    runningWeightKg?: number | null;
  };
  environment: {
    fuels: RdwFuelEnvironment[];
  };
  sourceStatus: RdwSourceStatus[];
  tuningMatch: {
    confidence: number;
    variant: EngineVariant;
  } | null;
};
