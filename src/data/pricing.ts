import {classifyRuntimePricing, type RuntimeCommercialIdentity, type RuntimePricingCategory} from "./runtime-pricing.ts";

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
  vehicleId?: string;
  pricingProfileId?: string;
  brand?: string;
  make?: string;
  model?: string;
  engine?: string;
  version?: string;
  generation?: string;
  ecuType?: string;
  ecuSupport?: {family?: string};
  publicationSource?: "existing-curated" | "canonical-publication";
  runtimeCommercialIdentity?: RuntimeCommercialIdentity;
};
type PublicPricingVehicle = QuoteVehicle & {id: string};
type PublicPricingStage = {
  name: PublicStageName;
  customHardware?: boolean;
  hardwareScopeApproved?: boolean;
  price?: number;
  pricingTier?: PricingTierId;
  sourcePrice?: number;
};

export function resolvePublicPricingVehicleId(vehicleId: string) {
  if (Object.hasOwn(publicVehiclePricingAssignments, vehicleId)) return vehicleId;
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

/** Historical Pricing V2 assignment retained for source audits; not the draft resolver. */
export function getPublicStagePricingTier(vehicle: PublicPricingVehicle, stage: PublicPricingStage) {
  const publicVehicleId = resolvePublicPricingVehicleId(vehicle.vehicleId ?? vehicle.id);
  return publicVehicleId ? publicVehiclePricingAssignments[publicVehicleId]?.[stage.name] : undefined;
}

export function getPublicStagePrice(vehicle: PublicPricingVehicle, stage: PublicPricingStage) {
  const quote = resolveStageQuote(vehicle, stage);
  return quote.kind === "from" ? quote.amountCents / 100 : undefined;
}

export type CatalogMatchStatus = "catalog-match" | "ambiguous" | "conflict" | "no-match";
export type AccessEvidence = {
  applicability: "identified-vehicle";
  reference: string;
  identifiedEcu: string;
};
export type AccessAssessment =
  | {status: "confirmed-standard" | "confirmed-bench" | "confirmed-unlock-required"; evidence: AccessEvidence}
  | {status: "possible-unlock-review" | "unknown"; reasonCode: string; scenario?: "bmw-unlock-review"};

export type DraftPricingCategory = RuntimePricingCategory | "contemporary-standard" | "advanced-unlock";
export type QuoteScope = "family-software" | "vehicle-software" | "advanced-unlock-package";
export type QuoteResolution =
  | {
      kind: "from";
      indicative: true;
      status: "draft-local-owner-review";
      amountCents: number;
      currency: "EUR";
      taxBasis: "inclusive";
      policyId: string;
      pricingCategory: DraftPricingCategory;
      scope: QuoteScope;
      stageName: PublicStageName;
      confirmationRequired: true;
    }
  | {kind: "on-request"; currency: "EUR"; reasonCode: string; conditionalBudgetFromCents?: number};

export type QuoteContext = {
  /** Match assessment is independent: missing exact confirmation does not remove a scoped estimate. */
  matchStatus?: CatalogMatchStatus;
  access?: AccessAssessment;
  configurationReviewed?: boolean;
  estimateApplicable?: boolean;
  identityConflict?: boolean;
  scope?: "family" | "vehicle";
};

export type DraftPricingAssignment = {
  category: DraftPricingCategory;
  reason: string;
  stageAmountsCents: Partial<Record<PublicStageName, number>>;
};
const draftCategoryAmounts: Record<DraftPricingCategory, Partial<Record<PublicStageName, number>>> = {
  "classic-standard-diesel": {"Stage 1": 29900, "Stage 2": 44900, "Stage 3+": 69900},
  // Preserved individual public/reference proposals; never a generic runtime fallback.
  "contemporary-standard": {"Stage 1": 44900, "Stage 2": 54900, "Stage 3+": 84900},
  "standard-2010s": {"Stage 1": 39900, "Stage 2": 54900, "Stage 3+": 79900},
  "modern-standard": {"Stage 1": 44900, "Stage 2": 59900, "Stage 3+": 89900},
  "higher-complexity": {"Stage 1": 54900, "Stage 2": 69900, "Stage 3+": 99900},
  "advanced-unlock": {"Stage 1": 70000}
};
function draftAssignment(category: DraftPricingCategory, reason: string): DraftPricingAssignment {
  return {category, reason, stageAmountsCents: draftCategoryAmounts[category]};
}
function referenceAssignment(category: DraftPricingCategory, reason: string): DraftPricingAssignment {
  return {category, reason, stageAmountsCents: {"Stage 1": draftCategoryAmounts[category]["Stage 1"]}};
}

/** Explicit LOCAL proposals. These categories are commercial scopes, not ECU-access diagnoses.
 * Stage 2/3 cover software calibration only; hardware and any advanced unlock are additional.
 * No canonical record, source price, measured figure, or service price is changed here.
 */
export const draftVehiclePricingAssignments: Record<string, DraftPricingAssignment> = {
  "vw-golf-20-tsi-ea888": draftAssignment("contemporary-standard", "Golf 7 GTI EA888: explicitly scoped standard performance-road-car software calibration."),
  "bmw-320d-b47": draftAssignment("contemporary-standard", "F30/F31 B47 320d: family software starting scenario; mixed ECU labels require identification, not suppression."),
  "audi-a3-20-tdi": draftAssignment("contemporary-standard", "A3 8V 2.0 TDI: explicitly scoped contemporary diesel calibration."),
  "mercedes-a45-amg-m133": draftAssignment("higher-complexity", "A45 AMG M133: explicitly assigned high-output performance calibration scope."),
  "bmw-x3-e83-20d": draftAssignment("classic-standard-diesel", "X3 E83 2.0d: individually assigned established EDC16-family diesel calibration; the category does not prove physical ECU access."),
  "volvo-xc60-d5": draftAssignment("contemporary-standard", "XC60 D5: individually scoped multi-cylinder road-diesel calibration."),
  "ford-focus-st-20-ecoboost": draftAssignment("contemporary-standard", "Manual Focus ST 2.0 EcoBoost: standard road-performance software scope; no TCU included."),
  "bmw-1-series-f20-f21-118i": draftAssignment("contemporary-standard", "F20/F21 118i: explicit family software scope despite estimated source provenance."),
  "bmw-1-series-f20-f21-118d": draftAssignment("contemporary-standard", "F20/F21 118d: explicit family diesel software scope; physical ECU still checked."),
  "bmw-1-series-f20-f21-120d": draftAssignment("contemporary-standard", "F20/F21 120d: explicit family diesel software scope; physical ECU still checked."),
  "bmw-3-series-f30-f31-318d": draftAssignment("contemporary-standard", "F30/F31 318d: explicit family diesel calibration proposal."),
  "bmw-3-series-f30-f31-330d": draftAssignment("higher-complexity", "F30/F31 330d: individually assigned six-cylinder high-torque calibration scope."),
  "bmw-5-series-f10-f11-520d": draftAssignment("contemporary-standard", "F10/F11 520d: explicit family diesel calibration proposal."),
  "bmw-3-series-g20-g21-320i": draftAssignment("higher-complexity", "G20/G21 320i: individually assigned newer-platform calibration scope; advanced unlock not included in family software price."),
  "volkswagen-golf-7-16-tdi": draftAssignment("contemporary-standard", "Golf 7 1.6 TDI: explicit model-engine software scenario."),
  "volkswagen-golf-7-20-tdi": draftAssignment("contemporary-standard", "Golf 7 2.0 TDI: explicit model-engine software scenario."),
  "volkswagen-golf-7-r-20-tsi": draftAssignment("higher-complexity", "Golf 7 R 2.0 TSI: individually assigned high-output all-wheel-drive performance calibration scope."),
  "volkswagen-passat-b8-20-tdi": draftAssignment("contemporary-standard", "Passat B8 2.0 TDI: explicit model-engine software proposal."),
  "audi-a3-8v-16-tdi": draftAssignment("contemporary-standard", "A3 8V 1.6 TDI: explicit model-engine software proposal."),
  "audi-a4-b9-20-tdi-190": draftAssignment("contemporary-standard", "A4 B9 2.0 TDI 190: explicit model-engine software proposal."),
  "audi-a4-b9-20-tfsi": draftAssignment("contemporary-standard", "A4 B9 2.0 TFSI: explicit model-engine software proposal."),
  "audi-a6-c7-30-tdi-272": draftAssignment("higher-complexity", "A6 C7 3.0 TDI 272: individually assigned six-cylinder high-torque calibration scope."),
  "skoda-octavia-5e-20-tdi-150": draftAssignment("contemporary-standard", "Octavia 5E 2.0 TDI 150: explicit model-engine software proposal."),
  "seat-leon-cupra-5f-20-tsi-300": draftAssignment("higher-complexity", "Leon Cupra 300: individually assigned high-output performance calibration scope."),
  "ref-bmw-128ti-f40-265": referenceAssignment("advanced-unlock", "BMW 128ti F40: explicit conditional Stage 1 plus advanced-unlock package budget; no installed lock or final total is asserted."),
  "ref-ford-transit-custom-20-ecoblue-105": referenceAssignment("higher-complexity", "Transit Custom 2.0 EcoBlue 105: explicitly assigned commercial-vehicle and torque-management calibration scope; SID211 is not inferred."),
  "ref-ford-transit-connect-15-tdci-100": referenceAssignment("contemporary-standard", "Transit Connect 1.5 TDCi 100: scoped to the sourced TDCi configuration; late-registration engine generation must be checked.")
};

/** Family labels may trigger a check; they never establish the installed ECU or a lock. */
export function assessVehicleAccess(vehicle?: QuoteVehicle | null): AccessAssessment {
  const publicId = vehicle?.pricingProfileId ?? vehicle?.vehicleId ?? (vehicle?.id ? resolvePublicPricingVehicleId(vehicle.id) : undefined);
  const make = (vehicle?.brand ?? vehicle?.make ?? "").trim().toUpperCase();
  const identity = [vehicle?.model, vehicle?.engine, vehicle?.version, vehicle?.generation].filter(Boolean).join(" ");
  const family = [vehicle?.ecuType, vehicle?.ecuSupport?.family].filter(Boolean).join(" ");
  const mixedBmwIds = ["bmw-320d-b47", "bmw-1-series-f20-f21-118i", "bmw-1-series-f20-f21-118d", "bmw-1-series-f20-f21-120d", "bmw-3-series-f30-f31-318d", "bmw-3-series-f30-f31-330d", "bmw-5-series-f10-f11-520d", "bmw-3-series-g20-g21-320i"];
  const bmw = make === "BMW" || publicId?.startsWith("bmw-") || vehicle?.id === "ref-bmw-128ti-f40-265";
  if (bmw && (mixedBmwIds.includes(publicId ?? "") || vehicle?.id === "ref-bmw-128ti-f40-265" || /\b128\s*ti\b|\bF40\b|\bG(?:20|21|30|31|42)\b/i.test(identity) || /\b(?:MD1|MG1)[A-Z0-9]*\b/i.test(family))) {
    return {status: "possible-unlock-review", reasonCode: "bmw-identity-or-mixed-ecu-family-review", scenario: "bmw-unlock-review"};
  }
  return {status: "unknown", reasonCode: "installed-ecu-not-identified"};
}
function applicableAccessEvidence(access: AccessAssessment) {
  return "evidence" in access && access.evidence?.applicability === "identified-vehicle" && Boolean(access.evidence.reference?.trim()) && Boolean(access.evidence.identifiedEcu?.trim());
}

/** Independent commercial estimate. Callers pass a compatible profile, never a rejected candidate. */
export function resolveStageQuote(vehicle: QuoteVehicle | null | undefined, stage: {name: PublicStageName; customHardware?: boolean; hardwareScopeApproved?: boolean} | undefined, context: QuoteContext = {}): QuoteResolution {
  const request = (reasonCode: string): QuoteResolution => ({kind: "on-request", currency: "EUR", reasonCode});
  if (!stage) return request("stage-scope-unavailable");
  if (stage.customHardware) return request("custom-hardware-scope-unassigned");
  if (context.identityConflict) return request("incompatible-profile-identity");
  if (context.estimateApplicable === false) return request("applicable-commercial-profile-unavailable");
  if (vehicle?.runtimeCommercialIdentity?.workScope === "custom") return request("custom-runtime-work-scope-unassigned");
  if (stage.name === "Stage 3+" && vehicle?.runtimeCommercialIdentity && stage.hardwareScopeApproved !== true) return request("stage3-hardware-scope-unapproved");
  const id = vehicle?.pricingProfileId ?? vehicle?.vehicleId ?? vehicle?.id;
  const assignmentId = id && Object.hasOwn(draftVehiclePricingAssignments, id) ? id : id ? resolvePublicPricingVehicleId(id) : undefined;
  const explicitAssignment = assignmentId ? draftVehiclePricingAssignments[assignmentId] : undefined;
  const runtimeIdentity = classifyRuntimePricing(vehicle?.runtimeCommercialIdentity);
  const runtime = !explicitAssignment ? runtimeIdentity : undefined;
  const assignment = explicitAssignment ?? (runtime ? draftAssignment(runtime.category, runtime.reason) : undefined);
  if (!assignment) return request("commercial-scenario-unassigned");
  const access = context.access ?? assessVehicleAccess(vehicle);
  if (access.status.startsWith("confirmed-") && !applicableAccessEvidence(access)) return request("access-confirmation-evidence-missing");
  const reference = assignmentId?.startsWith("ref-") ?? false;
  const scope = context.scope ?? (reference || runtime ? "vehicle" : "family");
  const actualUnlock = access.status === "confirmed-unlock-required";
  const possibleVehicleUnlock = scope === "vehicle" && access.status === "possible-unlock-review";
  // The package proposal is scoped to the listed modern/mixed-family BMW review
  // scenarios. A newly reported lock on a classic or unrelated ECU is unscoped.
  const identityAccess = assessVehicleAccess(vehicle);
  const bmwScenario = identityAccess.status === "possible-unlock-review" && identityAccess.scenario === "bmw-unlock-review";
  const advanced = assignment.category === "advanced-unlock" || ((actualUnlock || possibleVehicleUnlock) && bmwScenario);
  if ((actualUnlock || possibleVehicleUnlock) && !advanced) return request("unlock-package-scope-unassigned");
  if (advanced && stage.name !== "Stage 1") return request("advanced-unlock-higher-stage-scope-unassigned");
  // Runtime references keep their explicit commercial category. Missing software
  // amounts can use that category's schedule, independently of technical provenance.
  // Manual references have no runtime marker; advanced unlock was guarded above.
  const runtimeReferenceFill = !advanced && reference && Boolean(runtimeIdentity)
    && assignment.stageAmountsCents[stage.name] === undefined;
  const amountCents = advanced ? 70000 : assignment.stageAmountsCents[stage.name]
    ?? (runtimeReferenceFill ? draftCategoryAmounts[assignment.category][stage.name] : undefined);
  if (amountCents === undefined) return request("stage-scope-unavailable");
  return {
    kind: "from", indicative: true, status: "draft-local-owner-review", amountCents,
    currency: "EUR", taxBasis: "inclusive", policyId: runtime
      ? `draft-runtime-v1:${runtime.ruleId}:${advanced ? "advanced-unlock" : assignment.category}:${stage.name}`
      : runtimeReferenceFill ? `draft-runtime-v1:reference-category:${assignmentId}:${assignment.category}:${stage.name}`
      : `draft-local-v1:${assignmentId}:${advanced ? "advanced-unlock" : assignment.category}:${stage.name}`,
    pricingCategory: advanced ? "advanced-unlock" : assignment.category,
    scope: advanced ? "advanced-unlock-package" : scope === "family" ? "family-software" : "vehicle-software",
    stageName: stage.name, confirmationRequired: true
  };
}

/** Selected options are added once to numeric base budgets; a subtotal is never an on-request total. */
export function addQuoteOptions(quote: QuoteResolution, optionsCents: number): QuoteResolution {
  if (!Number.isSafeInteger(optionsCents) || optionsCents < 0) throw new RangeError("Option prices must be non-negative integer cents.");
  if (quote.kind === "on-request") return quote;
  const amountCents = quote.amountCents + optionsCents;
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) throw new RangeError("A public quote must be a positive safe integer in cents.");
  return {...quote, amountCents};
}

type QuoteLocale = "nl" | "en" | "pl";
export function formatQuote(quote: QuoteResolution, locale: QuoteLocale, includeFrom = true) {
  if (quote.kind === "on-request") return {nl: "Prijs op aanvraag", en: "Price on request", pl: "Wycena indywidualna"}[locale];
  const value = new Intl.NumberFormat({nl: "nl-NL", en: "en-US", pl: "pl-PL"}[locale], {
    style: "currency", currency: quote.currency, minimumFractionDigits: quote.amountCents % 100 === 0 ? 0 : 2, maximumFractionDigits: quote.amountCents % 100 === 0 ? 0 : 2
  }).format(quote.amountCents / 100);
  return includeFrom ? `${{nl: "Indicatief vanaf", en: "Indicative from", pl: "Orientacyjnie od"}[locale]} ${value}` : value;
}

export function formatQuoteScope(quote: QuoteResolution, locale: QuoteLocale) {
  if (quote.kind !== "from") return undefined;
  if (quote.scope === "advanced-unlock-package") return {
    nl: "Indicatieve Stage 1-pakketbegroting voor het scenario met geavanceerde ECU-unlock; definitieve scope en prijs na identificatie. Geen automatische toeslag.",
    en: "Indicative Stage 1 package budget for the advanced ECU-unlock scenario; final scope and price after identification. No automatic surcharge.",
    pl: "Orientacyjny budżet pakietu Stage 1 dla scenariusza zaawansowanego odblokowania ECU; zakres i cena po identyfikacji. Bez automatycznej dopłaty."
  }[locale];
  const family = quote.scope === "family-software";
  return {
    nl: `${family ? "Vanafprijs voor de voordeligste passende configuratie binnen deze modelfamilie. " : "Indicatie voor het gekozen voertuigprofiel. "}Softwarekalibratie; benodigde hardware en geavanceerde ECU-unlock apart te beoordelen. ECU-controle vóór uitvoering.`,
    en: `${family ? "Starting price for the least expensive applicable configuration in this model family. " : "Estimate for the selected vehicle profile. "}Software calibration; required hardware and advanced ECU unlocking assessed separately. ECU check before work.`,
    pl: `${family ? "Cena od dla najtańszej odpowiedniej konfiguracji tej rodziny modelowej. " : "Wycena dla wybranego profilu pojazdu. "}Kalibracja oprogramowania; wymagany sprzęt i zaawansowane odblokowanie ECU do osobnej oceny. Kontrola ECU przed pracą.`
  }[locale];
}

export function conditionalBudgetNote(quote: QuoteResolution, locale: QuoteLocale) {
  if (quote.kind === "from" && quote.scope === "advanced-unlock-package") return {
    nl: "Budget voor het scenario waarin ECU-unlock nodig is; dit bevestigt geen vergrendelde ECU.",
    en: "Budget for the scenario where ECU unlocking is needed; this does not confirm a locked ECU.",
    pl: "Budżet dla scenariusza wymagającego odblokowania ECU; nie potwierdza blokady ECU."
  }[locale];
  return undefined;
}

export function formatAccessAssessment(access: AccessAssessment, locale: QuoteLocale) {
  const descriptions: Record<AccessAssessment["status"], Record<QuoteLocale, string>> = {
    unknown: {nl: "ECU-controle vóór uitvoering", en: "ECU check before work", pl: "Kontrola ECU przed wykonaniem"},
    "possible-unlock-review": {nl: "ECU-controle vóór uitvoering; eventuele unlock te bevestigen", en: "ECU check before work; any unlocking to be confirmed", pl: "Kontrola ECU przed wykonaniem; ewentualne odblokowanie do potwierdzenia"},
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
