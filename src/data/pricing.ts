export type PricingTierId =
  | "stage1-standard"
  | "stage1-modern-ecu"
  | "stage1-bench"
  | "stage2-standard"
  | "stage3-custom"
  | "tcu-standard"
  | "diagnostics"
  | "log-analysis"
  | "custom-service";

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
    priceFrom: 269,
    currency: "EUR",
    note: "Existing standard Stage 1 from-price; vehicle confirmation remains required.",
    visible: true
  },
  {
    id: "stage1-modern-ecu",
    label: "Stage 1 modern ECU",
    priceFrom: 339,
    currency: "EUR",
    note: "Reserved for a verified modern-ECU pricing assignment.",
    visible: true
  },
  {
    id: "stage1-bench",
    label: "Stage 1 bench",
    priceFrom: 305,
    currency: "EUR",
    note: "Reserved for a verified bench-work pricing assignment.",
    visible: true
  },
  {
    id: "stage2-standard",
    label: "Stage 2 standard",
    priceFrom: 399,
    currency: "EUR",
    note: "Existing standard Stage 2 from-price; hardware must be confirmed.",
    visible: true
  },
  {
    id: "stage3-custom",
    label: "Stage 3+ custom",
    priceFrom: 679,
    currency: "EUR",
    note: "Existing Stage 3+ from-price; final scope and quote are always custom.",
    visible: true
  },
  {
    id: "tcu-standard",
    label: "DSG / TCU standard",
    priceFrom: 239,
    currency: "EUR",
    note: "Matches the existing gearbox service from-price.",
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
  }
] as const satisfies readonly PricingTierDefinition[];

export const pricingTierById = Object.fromEntries(
  pricingTiers.map((tier) => [tier.id, tier])
) as Record<PricingTierId, PricingTierDefinition>;

export function getPricingTier(id: PricingTierId | undefined) {
  return id ? pricingTierById[id] : undefined;
}
