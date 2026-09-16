/** Server dataset facts. UI imports of these definitions must be type-only. */
export type SourceProvider = "vtech" | "shiftech" | "br-performance" | "celtic-tuning" | "unlimited-tuning" | "mosselman" | "manufacturer" | "other";
export type ResearchStage = {powerHp: number; torqueNm?: number; conditions?: string[]};
export type ResearchIdentity = {
  brand: string;
  modelFamily: string;
  generation: string;
  aliases?: string[];
  yearFrom: number;
  yearTo?: number;
  fuel: "Petrol" | "Diesel";
  aspiration?: "turbo" | "supercharged" | "naturally-aspirated";
  engineMarketingName: string;
  engineFamily?: string;
  engineCodes?: string[];
  displacementCc: number;
  displacementPrecision: "exact" | "nominal";
  cylinders?: number;
  stockPowerHp: number;
  stockTorqueNm?: number;
  powerUnit: "PS" | "bhp";
  torqueUnit?: "Nm" | "lb-ft";
  gearbox?: string;
  ecuFamily?: string;
  electrification?: "none" | "mild-hybrid" | "hybrid" | "unknown";
};
export type SourceObservation = {
  id: string;
  provider: SourceProvider;
  sourceName: string;
  url: string;
  retrievedAt: string;
  status: "retrieved" | "blocked" | "unavailable";
  retrievalMethod: "page" | "public-json" | "search-index";
  httpStatus?: number;
  contentSha256?: string;
  /** Only retrieved page/public JSON observations can supply accepted tuning facts. */
  identity?: ResearchIdentity;
  /** Facts retained when missing scope prevents accepting a complete profile. */
  unresolvedIdentity?: Partial<ResearchIdentity>;
  stages?: {stage1?: ResearchStage; stage2?: ResearchStage; stage3?: ResearchStage};
  /** Different hardware/package classes never become ordinary remap consensus votes. */
  packages?: {name: string; kind: "external-module"; powerGainHp?: number; torqueGainNm?: number; tunedPowerHp?: number; tunedTorqueNm?: number}[];
  conditions?: string[];
  notes?: string[];
  /** Factual applicability notes only; never copy provider marketing prose. */
  applicability?: string[];
  /** Manually reviewed counterpart relationship; raw identity remains unchanged. */
  consensusGroup?: string;
  supportingUrls?: string[];
  stockValidation?: {sourceId: string; fields: string[]};
};
export type StageSourceValue = ResearchStage & {sourceId: string; provider: SourceProvider; powerUnit: "PS"; torqueUnit: "Nm"};
export type ProfileStage = {
  selectedPowerHp: number;
  selectedTorqueNm?: number;
  sourceValues: StageSourceValue[];
  confidence: "multi-source" | "single-source";
  sourceAgreement: "strong" | "acceptable" | "conflict";
  ownerReviewRequired: boolean;
  conditions: string[];
};
export type SourcedTuningProfile = Omit<ResearchIdentity, "powerUnit" | "torqueUnit"> & {
  id: string;
  sourceIds: string[];
  sourceUrls: string[];
  retrievedAt: string;
  lastReviewedAt: string;
  reviewStatus: "source-reviewed" | "owner-review-required" | "noordtune-approved";
  ownerReviewRequired: boolean;
  stockSourceQuality: "manufacturer" | "multi-source" | "single-source";
  stage1: ProfileStage;
  stage2?: ProfileStage;
  stage3?: ProfileStage;
  stage1SourceCount: number;
  stage2SourceCount: number;
  stage3SourceCount: number;
  conditions: string[];
  notes: string[];
  generationScopeSource?: {url: string; retrievedAt: string; method: "successor-generation-start"};
};
