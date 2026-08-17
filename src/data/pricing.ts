export type PricingV2StageTierId =
  | "stage1-standard"
  | "stage1-advanced"
  | "stage1-modern"
  | "stage2-standard"
  | "stage2-advanced"
  | "stage2-performance"
  | "stage3-standard"
  | "stage3-advanced"
  | "stage3-performance";

export const pricingV2StageTierIds: readonly PricingV2StageTierId[] = [
  "stage1-standard",
  "stage1-advanced",
  "stage1-modern",
  "stage2-standard",
  "stage2-advanced",
  "stage2-performance",
  "stage3-standard",
  "stage3-advanced",
  "stage3-performance"
];

export type PricingTierId =
  | PricingV2StageTierId
  | "tcu-standard"
  | "diagnostics"
  | "log-analysis"
  | "custom-service"
  // Legacy IDs remain defined for canonical records and historical reports only.
  | "stage1-modern-ecu"
  | "stage1-bench"
  | "stage3-custom";

export type PricingTierDefinition = {
  id: PricingTierId;
  label: string;
  priceFrom: number | null;
  currency: "EUR";
  note: string;
  visible: boolean;
};

export const pricingTiers = [
  {
    id: "stage1-standard",
    label: "Stage 1 standard",
    priceFrom: 299,
    currency: "EUR",
    note: "Pricing V2 public from-price; vehicle confirmation remains required.",
    visible: true
  },
  {
    id: "stage1-advanced",
    label: "Stage 1 advanced",
    priceFrom: 349,
    currency: "EUR",
    note: "Pricing V2 public from-price; the label does not imply an ECU access method.",
    visible: true
  },
  {
    id: "stage1-modern",
    label: "Stage 1 modern",
    priceFrom: 399,
    currency: "EUR",
    note: "Pricing V2 public from-price; the label does not imply an ECU access method.",
    visible: true
  },
  {
    id: "stage2-standard",
    label: "Stage 2 standard",
    priceFrom: 449,
    currency: "EUR",
    note: "Pricing V2 public from-price; hardware and vehicle condition must be confirmed.",
    visible: true
  },
  {
    id: "stage2-advanced",
    label: "Stage 2 advanced",
    priceFrom: 499,
    currency: "EUR",
    note: "Pricing V2 public from-price; hardware and vehicle condition must be confirmed.",
    visible: true
  },
  {
    id: "stage2-performance",
    label: "Stage 2 performance",
    priceFrom: 549,
    currency: "EUR",
    note: "Pricing V2 public from-price; hardware and vehicle condition must be confirmed.",
    visible: true
  },
  {
    id: "stage3-standard",
    label: "Stage 3+ standard",
    priceFrom: 699,
    currency: "EUR",
    note: "Pricing V2 public from-price; final custom scope is confirmed before tuning.",
    visible: true
  },
  {
    id: "stage3-advanced",
    label: "Stage 3+ advanced",
    priceFrom: 849,
    currency: "EUR",
    note: "Pricing V2 public from-price; final custom scope is confirmed before tuning.",
    visible: true
  },
  {
    id: "stage3-performance",
    label: "Stage 3+ performance",
    priceFrom: 999,
    currency: "EUR",
    note: "Pricing V2 public from-price; final custom scope is confirmed before tuning.",
    visible: true
  },
  {
    id: "tcu-standard",
    label: "DSG / ZF / TCU standard",
    priceFrom: 249,
    currency: "EUR",
    note: "Pricing V2 public from-price; exact transmission and TCU support require confirmation.",
    visible: true
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    priceFrom: null,
    currency: "EUR",
    note: "No standalone public price is currently defined.",
    visible: false
  },
  {
    id: "log-analysis",
    label: "Log analysis",
    priceFrom: null,
    currency: "EUR",
    note: "No standalone public price is currently defined.",
    visible: false
  },
  {
    id: "custom-service",
    label: "Custom service",
    priceFrom: null,
    currency: "EUR",
    note: "Quote-only tier for work that requires manual scope confirmation.",
    visible: false
  },
  {
    id: "stage1-modern-ecu",
    label: "Legacy Stage 1 group C",
    priceFrom: 339,
    currency: "EUR",
    note: "Historical canonical reference only; never exposed as a public access-method claim.",
    visible: false
  },
  {
    id: "stage1-bench",
    label: "Legacy Stage 1 group B",
    priceFrom: 305,
    currency: "EUR",
    note: "Historical canonical reference only; never exposed as a public access-method claim.",
    visible: false
  },
  {
    id: "stage3-custom",
    label: "Legacy Stage 3+ custom",
    priceFrom: 679,
    currency: "EUR",
    note: "Historical canonical reference only; public curated vehicles use Pricing V2 tiers.",
    visible: false
  }
] as const satisfies readonly PricingTierDefinition[];

export const pricingTierById = Object.fromEntries(
  pricingTiers.map((tier) => [tier.id, tier])
) as Record<PricingTierId, PricingTierDefinition>;

export function getPricingTier(id: PricingTierId | undefined) {
  return id ? pricingTierById[id] : undefined;
}

type PublicStageName = "Stage 1" | "Stage 2" | "Stage 3+";

export type PublicVehiclePricingAssignment = Record<
  PublicStageName,
  PricingV2StageTierId
>;

const standardAssignment: PublicVehiclePricingAssignment = {
  "Stage 1": "stage1-standard",
  "Stage 2": "stage2-standard",
  "Stage 3+": "stage3-standard"
};

const advancedAssignment: PublicVehiclePricingAssignment = {
  "Stage 1": "stage1-advanced",
  "Stage 2": "stage2-advanced",
  "Stage 3+": "stage3-advanced"
};

const performanceAssignment: PublicVehiclePricingAssignment = {
  "Stage 1": "stage1-modern",
  "Stage 2": "stage2-performance",
  "Stage 3+": "stage3-performance"
};

// Deliberate Pricing V2 assignments for the 24 intentionally public vehicles.
export const publicVehiclePricingAssignments: Record<
  string,
  PublicVehiclePricingAssignment
> = {
  "vw-golf-20-tsi-ea888": advancedAssignment,
  "bmw-320d-b47": standardAssignment,
  "audi-a3-20-tdi": standardAssignment,
  "mercedes-a45-amg-m133": performanceAssignment,
  "bmw-x3-e83-20d": standardAssignment,
  "volvo-xc60-d5": advancedAssignment,
  "ford-focus-st-20-ecoboost": advancedAssignment,
  "bmw-1-series-f20-f21-118i": standardAssignment,
  "bmw-1-series-f20-f21-118d": standardAssignment,
  "bmw-1-series-f20-f21-120d": standardAssignment,
  "bmw-3-series-f30-f31-318d": standardAssignment,
  "bmw-3-series-f30-f31-330d": standardAssignment,
  "bmw-5-series-f10-f11-520d": standardAssignment,
  "bmw-3-series-g20-g21-320i": standardAssignment,
  "volkswagen-golf-7-16-tdi": standardAssignment,
  "volkswagen-golf-7-20-tdi": standardAssignment,
  "volkswagen-golf-7-r-20-tsi": performanceAssignment,
  "volkswagen-passat-b8-20-tdi": standardAssignment,
  "audi-a3-8v-16-tdi": standardAssignment,
  "audi-a4-b9-20-tdi-190": standardAssignment,
  "audi-a4-b9-20-tfsi": standardAssignment,
  "audi-a6-c7-30-tdi-272": standardAssignment,
  "skoda-octavia-5e-20-tdi-150": standardAssignment,
  "seat-leon-cupra-5f-20-tsi-300": performanceAssignment
};

// Hashed aliases keep canonical source IDs out of the browser bundle.
const publicPricingVehicleAliasHashes: Record<number, string> = {
  3792304146: "bmw-1-series-f20-f21-118i",
  970918314: "bmw-1-series-f20-f21-118d",
  1906924721: "bmw-1-series-f20-f21-120d",
  115478322: "bmw-3-series-f30-f31-318d",
  581113352: "bmw-3-series-f30-f31-330d",
  3616316905: "bmw-5-series-f10-f11-520d",
  2254637240: "bmw-3-series-g20-g21-320i",
  872259443: "volkswagen-golf-7-16-tdi",
  3524889184: "volkswagen-golf-7-20-tdi",
  1497817231: "volkswagen-golf-7-r-20-tsi",
  2105162706: "volkswagen-passat-b8-20-tdi",
  2552848245: "audi-a3-8v-16-tdi",
  1060989926: "audi-a4-b9-20-tdi-190",
  1524959642: "audi-a4-b9-20-tfsi",
  3425820745: "audi-a6-c7-30-tdi-272",
  105473315: "skoda-octavia-5e-20-tdi-150",
  3996373311: "seat-leon-cupra-5f-20-tsi-300"
};

export const pricingV2LegacyMigration: Record<
  PublicStageName,
  Partial<Record<number, PricingV2StageTierId>>
> = {
  "Stage 1": {
    269: "stage1-standard",
    305: "stage1-advanced",
    339: "stage1-modern"
  },
  "Stage 2": {
    399: "stage2-standard",
    439: "stage2-advanced",
    509: "stage2-performance"
  },
  "Stage 3+": {
    679: "stage3-standard",
    799: "stage3-advanced",
    949: "stage3-performance"
  }
};

type PublicPricingVehicle = {id: string};
type PublicPricingStage = {
  name: PublicStageName;
  price: number;
  pricingTier?: PricingTierId;
  sourcePrice?: number;
};

export function resolvePublicPricingVehicleId(vehicleId: string) {
  if (publicVehiclePricingAssignments[vehicleId]) {
    return vehicleId;
  }

  return publicPricingVehicleAliasHashes[hashVehicleId(vehicleId)];
}

function hashVehicleId(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function getPublicStagePricingTier(
  vehicle: PublicPricingVehicle,
  stage: PublicPricingStage
) {
  const publicVehicleId = resolvePublicPricingVehicleId(vehicle.id);

  return publicVehicleId
    ? publicVehiclePricingAssignments[publicVehicleId]?.[stage.name]
    : undefined;
}

export function getPublicStagePrice(
  vehicle: PublicPricingVehicle,
  stage: PublicPricingStage
) {
  const tierId = getPublicStagePricingTier(vehicle, stage);
  const tier = getPricingTier(tierId);

  return tier?.priceFrom ?? stage.price;
}

export function getPublicServicePrice(service: {
  price: number;
  pricingTier?: PricingTierId;
}) {
  const tier = getPricingTier(service.pricingTier);

  return tier?.visible && tier.priceFrom !== null ? tier.priceFrom : service.price;
}
