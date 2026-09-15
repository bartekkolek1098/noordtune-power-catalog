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

export type PublicStageName = "Stage 1" | "Stage 2" | "Stage 3+";

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

export type QuoteVehicle = {
  id?: string;
  brand?: string;
  make?: string;
  model?: string;
  engine?: string;
  version?: string;
  generation?: string;
  ecuType?: string;
  ecuSupport?: {family?: string};
  publicationSource?: "existing-curated" | "canonical-publication";
};
type PublicPricingVehicle = QuoteVehicle & {id: string};
type PublicPricingStage = {
  name: PublicStageName;
  price?: number;
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
  const quote = resolveStageQuote(vehicle, stage);
  return quote.kind === "from" ? quote.amountCents / 100 : undefined;
}

export type CatalogMatchStatus = "catalog-match" | "ambiguous" | "conflict" | "no-match";
export type AccessEvidence = {
  // A catalog label or tool support list does not identify the installed ECU.
  applicability: "identified-vehicle";
  reference: string;
  identifiedEcu: string;
};
export type AccessAssessment =
  | {
      status: "confirmed-standard" | "confirmed-bench" | "confirmed-unlock-required";
      evidence: AccessEvidence;
    }
  | {
      status: "possible-unlock-review" | "unknown";
      reasonCode: string;
      scenario?: "bmw-unlock-review";
    };

export type QuoteResolution =
  | {
      kind: "from";
      amountCents: number;
      currency: "EUR";
      taxBasis: "inclusive";
      policyId: string;
      confirmationRequired: boolean;
    }
  | {
      kind: "on-request";
      currency: "EUR";
      reasonCode: string;
      conditionalBudgetFromCents?: number;
    };

export type QuoteContext = {
  matchStatus?: CatalogMatchStatus;
  access?: AccessAssessment;
  // Explicit curated applicability is required before canonical aliases can use a policy.
  configurationReviewed?: boolean;
};

// Only these existing records have a reviewed model-engine relationship. The other
// public assignments originated in generated templates: publication is not review.
const reviewedPublicConfigurationIds = new Set([
  "vw-golf-20-tsi-ea888",
  "bmw-320d-b47",
  "audi-a3-20-tdi",
  "mercedes-a45-amg-m133",
  "bmw-x3-e83-20d",
  "volvo-xc60-d5",
  "ford-focus-st-20-ecoboost"
]);

/** Review triggers express uncertainty; they never confirm an ECU or lock state. */
export function assessVehicleAccess(vehicle?: QuoteVehicle | null): AccessAssessment {
  const make = (vehicle?.brand ?? vehicle?.make ?? "").trim().toUpperCase();
  const identity = [vehicle?.model, vehicle?.engine, vehicle?.version, vehicle?.generation]
    .filter(Boolean).join(" ");
  const ecuFamily = [vehicle?.ecuType, vehicle?.ecuSupport?.family].filter(Boolean).join(" ");
  const publicId = vehicle?.id ? resolvePublicPricingVehicleId(vehicle.id) : undefined;
  // These records explicitly list mixed MD1/MG1 families in curated-technical.ts.
  // Keep the small policy list client-safe; no canonical database import is needed.
  const reviewedBmwFamilies = new Set([
    "bmw-320d-b47",
    "bmw-1-series-f20-f21-118i",
    "bmw-1-series-f20-f21-118d",
    "bmw-1-series-f20-f21-120d",
    "bmw-3-series-f30-f31-318d",
    "bmw-3-series-f30-f31-330d",
    "bmw-5-series-f10-f11-520d",
    "bmw-3-series-g20-g21-320i"
  ]);
  const isBmw = make === "BMW" || (publicId?.startsWith("bmw-") ?? false);
  if (
    isBmw && (
      (publicId !== undefined && reviewedBmwFamilies.has(publicId)) ||
      /\b128\s*ti\b|\bF40\b|\bG(?:20|21|30|31|42)\b/i.test(identity) ||
      /\b(?:MD1|MG1)[A-Z0-9]*\b/i.test(ecuFamily)
    )
  ) {
    return {
      status: "possible-unlock-review",
      reasonCode: "bmw-identity-or-mixed-ecu-family-review",
      scenario: "bmw-unlock-review"
    };
  }
  return {status: "unknown", reasonCode: "installed-ecu-not-identified"};
}

function applicableAccessEvidence(access: AccessAssessment) {
  return "evidence" in access &&
    access.evidence?.applicability === "identified-vehicle" &&
    Boolean(access.evidence.reference?.trim()) &&
    Boolean(access.evidence.identifiedEcu?.trim());
}

/** Single commercial policy for server DTOs and every client price surface. */
export function resolveStageQuote(
  vehicle: QuoteVehicle | null | undefined,
  stage: {name: PublicStageName} | undefined,
  context: QuoteContext = {}
): QuoteResolution {
  const identityAccess = assessVehicleAccess(vehicle);
  const access = context.access && context.access.status !== "unknown"
    ? context.access
    : identityAccess;
  const conditionalBudget = access.status === "possible-unlock-review" &&
    access.scenario === "bmw-unlock-review" && stage?.name === "Stage 1"
      ? {conditionalBudgetFromCents: 70000}
      : {};
  const request = (reasonCode: string): QuoteResolution => ({
    kind: "on-request", currency: "EUR", reasonCode, ...conditionalBudget
  });

  if (!stage) return request("approved-stage-policy-unavailable");

  if (context.matchStatus === "conflict" || context.matchStatus === "ambiguous") {
    return request(`catalog-${context.matchStatus}`);
  }
  if (access.status.startsWith("confirmed-") && !applicableAccessEvidence(access)) {
    return request("access-confirmation-evidence-missing");
  }
  if (access.status === "confirmed-unlock-required") {
    // There is currently no approved unlock-inclusive total. Never use a standard tier.
    return request("unlock-inclusive-policy-unavailable");
  }
  if (access.status === "possible-unlock-review") {
    return request("ecu-access-review");
  }
  if (context.matchStatus === "no-match" || context.configurationReviewed === false) {
    return request(context.matchStatus === "no-match" ? "catalog-no-match" : "configuration-unreviewed");
  }

  const publicId = vehicle?.id ? resolvePublicPricingVehicleId(vehicle.id) : undefined;
  const isDirectAssignment = publicId !== undefined && vehicle?.id === publicId;
  if (!publicId || (!isDirectAssignment && context.configurationReviewed !== true)) {
    return request("configuration-unmapped-or-generated");
  }
  if (!reviewedPublicConfigurationIds.has(publicId) && context.configurationReviewed !== true) {
    return request("generated-configuration-unreviewed");
  }
  const tierId = publicVehiclePricingAssignments[publicId]?.[stage.name];
  const tier = getPricingTier(tierId);
  if (!tier?.visible || tier.priceFrom === null || tier.priceFrom === undefined) {
    return request("approved-stage-policy-unavailable");
  }
  return {
    kind: "from",
    amountCents: Math.round(tier.priceFrom * 100),
    currency: "EUR",
    taxBasis: "inclusive",
    policyId: `pricing-v2:${publicId}:${tierId}`,
    confirmationRequired: true
  };
}

/** Options are included only when a numeric base exists; a subtotal is never a quote. */
export function addQuoteOptions(quote: QuoteResolution, optionsCents: number): QuoteResolution {
  if (!Number.isSafeInteger(optionsCents) || optionsCents < 0) {
    throw new RangeError("Option prices must be non-negative integer cents.");
  }
  if (quote.kind === "on-request") return quote;
  const amountCents = quote.amountCents + optionsCents;
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new RangeError("A public quote must be a positive safe integer in cents.");
  }
  return {...quote, amountCents};
}

type QuoteLocale = "nl" | "en" | "pl";
export function formatQuote(quote: QuoteResolution, locale: QuoteLocale, includeFrom = true) {
  if (quote.kind === "on-request") {
    return {nl: "Prijs op aanvraag", en: "Price on request", pl: "Wycena indywidualna"}[locale];
  }
  const value = new Intl.NumberFormat(
    {nl: "nl-NL", en: "en-US", pl: "pl-PL"}[locale],
    {style: "currency", currency: quote.currency,
      minimumFractionDigits: quote.amountCents % 100 === 0 ? 0 : 2,
      maximumFractionDigits: quote.amountCents % 100 === 0 ? 0 : 2}
  ).format(quote.amountCents / 100);
  return includeFrom ? `${{nl: "Vanaf", en: "From", pl: "Od"}[locale]} ${value}` : value;
}

export function conditionalBudgetNote(quote: QuoteResolution, locale: QuoteLocale) {
  if (quote.kind !== "on-request" || quote.conditionalBudgetFromCents === undefined) return undefined;
  const amount = new Intl.NumberFormat(
    {nl: "nl-NL", en: "en-US", pl: "pl-PL"}[locale],
    {style: "currency", currency: "EUR", maximumFractionDigits: 0}
  ).format(quote.conditionalBudgetFromCents / 100);
  return {
    nl: `Als ECU-unlock nodig is, indicatief Stage 1-budget vanaf ${amount}. Definitieve offerte na ECU-identificatie.`,
    en: `If ECU unlocking is required, indicative Stage 1 budget from ${amount}. Final quotation after ECU identification.`,
    pl: `Jeśli konieczne jest odblokowanie ECU, orientacyjny budżet Stage 1 od ${amount}. Ostateczna wycena po identyfikacji ECU.`
  }[locale];
}

export function formatAccessAssessment(access: AccessAssessment, locale: QuoteLocale) {
  const descriptions: Record<AccessAssessment["status"], Record<QuoteLocale, string>> = {
    unknown: {nl: "ECU/toegang te bevestigen", en: "ECU/access to be confirmed", pl: "ECU/dostęp do potwierdzenia"},
    "possible-unlock-review": {nl: "ECU/toegang controleren; mogelijke unlock is niet bevestigd", en: "ECU/access review; possible unlocking is unconfirmed", pl: "Weryfikacja ECU/dostępu; możliwa potrzeba odblokowania nie jest potwierdzona"},
    "confirmed-standard": {nl: "Standaardtoegang bevestigd voor geïdentificeerde ECU", en: "Standard access confirmed for identified ECU", pl: "Standardowy dostęp potwierdzony dla zidentyfikowanego ECU"},
    "confirmed-bench": {nl: "Bench-toegang bevestigd voor geïdentificeerde ECU", en: "Bench access confirmed for identified ECU", pl: "Dostęp bench potwierdzony dla zidentyfikowanego ECU"},
    "confirmed-unlock-required": {nl: "Unlock vereist voor geïdentificeerde ECU", en: "Unlock required for identified ECU", pl: "Odblokowanie wymagane dla zidentyfikowanego ECU"}
  };
  return descriptions[access.status][locale];
}

export function getPublicServicePrice(service: {
  price: number;
  pricingTier?: PricingTierId;
}) {
  const tier = getPricingTier(service.pricingTier);

  return tier?.visible && tier.priceFrom !== null ? tier.priceFrom : service.price;
}
