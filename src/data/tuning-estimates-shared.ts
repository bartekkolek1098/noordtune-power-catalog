import type {EngineVariant, FuelType, StageDefinition, StageName} from "./catalog-shared.ts";
import type {CatalogMatchInput} from "./catalog-matching.ts";
import type {RuntimeCommercialIdentity} from "./runtime-pricing.ts";
import type {StageScope, StageComparison} from "../lib/stage-presentation.ts";
import type {DetailsAction} from "../lib/details-action.ts";
import {getPublicCatalogTruthGrade} from "./catalog-truth-grades.ts";

export type EstimateStage = Omit<StageDefinition, "powerHp" | "torqueNm" | "price" | "sourcePrice" | "quote"> & {
  powerHp?: number;
  torqueNm?: number;
  provenance?: "reviewed" | "reference" | "canonical-estimated" | "generic-indicative" | "multi-source" | "single-source";
  approximate?: boolean;
  customHardware?: boolean;
  hardwareScopeApproved?: boolean;
  sourceConfidence?: "multi-source" | "single-source" | "canonical-existing" | "generic-fallback";
  sourceProfileId?: string;
  resolutionLevel?: 1 | 2 | 3 | 4;
  powerRangeHp?: [number, number];
  torqueRangeNm?: [number, number];
  customerScope?: StageScope;
  comparison?: StageComparison;
  evidenceSourceIds?: string[];
  planningBasis?: {power: {raw: [number, number]; rounded: [number, number]; clamped: boolean}; torque?: {raw: [number, number]; rounded: [number, number]; clamped: boolean}};
  genericCategory?: "turbo-diesel" | "turbo-petrol" | "naturally-aspirated" | "unknown-aspiration";
  genericScenario?: "standard-range" | "strong-stage1-conditional";
};

export type EstimateSourceReference = {
  title: string;
  url?: string;
  scope: string;
  retrievedAt?: string;
  sourceType: "existing-catalog" | "manufacturer" | "tuner" | "heuristic";
  retrievalMethod?: "page" | "search-index";
};

/** A peak-value catalog illustration, never identification of an installed ECU or a dyno run. */
export type TuningEstimateProfile = Pick<EngineVariant,
  "options" | "gearbox" | "serviceCompatibility" | "recommendedPackage" | "ecuSupport" | "ecuType"
  | "transmissionSupport" | "tcuSupport" | "generation" | "version" | "yearRange" | "configurationNote"
> & {
  id: string;
  vehicleId?: string;
  /** Reviewed commercial assignment only; never a source identity or public page link. */
  pricingProfileId?: string;
  brand: string;
  model: string;
  engine: string;
  fuel: FuelType;
  stockPowerHp: number;
  stockTorqueNm?: number;
  stages: EstimateStage[];
  provenance: "existing-catalog" | "tuner-reference" | "canonical-estimated" | "generic-indicative" | "sourced-profile";
  coverageClass?: "A" | "B" | "C" | "D" | "E";
  sourceConfidence?: "multi-source" | "single-source" | "canonical-existing" | "generic-fallback";
  resolutionLevel?: 1 | 2 | 3 | 4;
  runtimeCommercialIdentity?: RuntimeCommercialIdentity;
  sourceReferences: EstimateSourceReference[];
  conditions: string[];
  conditionCodes?: string[];
  verificationRequired: true;
};

export type EstimateResolution = {
  coverageClass?: "A" | "B" | "C" | "D" | "E";
  status: "applicable" | "conditional" | "unavailable";
  resolutionLevel?: 1 | 2 | 3 | 4;
  profile?: TuningEstimateProfile;
  reasonCodes: string[];
  detailsAction?: DetailsAction;
  diagnostics?: {
    referenceTechnicalProfiles: number;
    publicTechnicalProfiles: number;
    canonicalShortlisted: number;
    canonicalCompatible: number;
    canonicalTechnicalProfiles: number;
  };
};

/** A registration year can exclude a source model-year scope, never confirm it. */
function scopeStageToRegistration(stage: EstimateStage, year?: number): EstimateStage {
  const range = stage.referenceYearRange;
  if (!range || (year !== undefined && year >= range[0] && year <= range[1])) return stage;
  return {...stage, powerHp: undefined, torqueNm: undefined, powerRangeHp: undefined, torqueRangeNm: undefined,
    approximate: false, provenance: "reviewed", quoteRequired: true, customHardware: false,
    hardwareRequired: false, customerScope: {fuelRon: [], hardware: []},
    customerNote: {
      nl: `${stage.name}-referentie alleen voor modeljaar ${range[0]}–${range[1]}. De registratie bevestigt die uitvoering niet; toepasselijke waarden en prijs na voertuigidentificatie.`,
      en: `${stage.name} reference only for model years ${range[0]}–${range[1]}. Registration does not confirm that configuration; applicable output and price follow vehicle identification.`,
      pl: `Referencja ${stage.name} tylko dla roczników modelowych ${range[0]}–${range[1]}. Rejestracja nie potwierdza wersji; parametry i cena po identyfikacji auta.`
    }};
}

const normalizeIdentityFact = (value?: string | null) => (value ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function containsMarker(value: string, markers?: readonly string[]) {
  return !markers?.length || markers.some(marker => value.includes(normalizeIdentityFact(marker)));
}

function transmissionFamilies(value?: string) {
  const normalized = normalizeIdentityFact(value);
  const result = new Set<"manual" | "dsg6" | "automatic8">();
  if (/\b(?:manual|handbak|mmt6|6mt|six speed manual|6 speed manual)\b/.test(normalized)) result.add("manual");
  if (/\b(?:dq250|dsg6|6 dsg|6 speed dsg|six speed dsg)\b/.test(normalized)) result.add("dsg6");
  if (/\b(?:8hp|zf8|steptronic|8 speed|eight speed|8 traps|achttraps)\b/.test(normalized)) result.add("automatic8");
  return result;
}

function registrationYear(input: CatalogMatchInput) {
  if (input.firstRegistrationYear && Number.isInteger(input.firstRegistrationYear)) return input.firstRegistrationYear;
  const value = input.firstRegistrationDate;
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? Number(value.slice(0, 4)) : undefined;
}

function withholdIdentityScopedStage(stage: EstimateStage, label: {nl: string; en: string; pl: string}): EstimateStage {
  return {...stage, powerHp: undefined, torqueNm: undefined, powerRangeHp: undefined, torqueRangeNm: undefined,
    approximate: false, provenance: "reviewed", quoteRequired: true, customHardware: false,
    hardwareRequired: false, tcuRecommended: false, customerScope: {fuelRon: [], hardware: []},
    customerNote: {
      nl: `${stage.name}-waarden en prijs gelden alleen voor de bevestigde ${label.nl}. De beschikbare voertuiggegevens bewijzen dit scope nog niet; eerst identificeren.`,
      en: `${stage.name} output and price apply only to the confirmed ${label.en}. The available vehicle data do not yet prove this scope; identify it first.`,
      pl: `Parametry i cena ${stage.name} dotyczą tylko potwierdzonego zakresu: ${label.pl}. Dostępne dane auta jeszcze go nie potwierdzają; najpierw identyfikacja.`
    }};
}

function scopeStageToIdentity(stage: EstimateStage, source: StageDefinition, input: CatalogMatchInput): EstimateStage {
  const dated = scopeStageToRegistration(stage, registrationYear(input));
  const scope = source.identityScope;
  if (!scope || dated.quoteRequired) return dated;
  const year = registrationYear(input);
  const generation = normalizeIdentityFact([input.generationEvidence, input.model, input.type, input.variant, input.execution].filter(Boolean).join(" "));
  const engine = normalizeIdentityFact([input.engineFamily, input.model, input.type, input.variant, input.execution].filter(Boolean).join(" "));
  const emissions = normalizeIdentityFact(input.emissionsConfiguration);
  const fuelGrade = normalizeIdentityFact(input.fuelGrade);
  const market = normalizeIdentityFact(input.market);
  const body = normalizeIdentityFact(input.bodyStyle);
  const drivetrain = normalizeIdentityFact(input.drivetrain);
  const transmission = transmissionFamilies(input.transmission);
  const match = (!scope.yearRange || (year !== undefined && year >= scope.yearRange[0] && year <= scope.yearRange[1]))
    && (scope.stockTorqueNm === undefined || input.stockTorqueNm === scope.stockTorqueNm)
    && (scope.displacementCc === undefined || input.displacementCc === scope.displacementCc)
    && containsMarker(generation, scope.generationMarkers)
    && containsMarker(engine, scope.engineFamilyMarkers)
    && (!scope.transmissionFamilies?.length || scope.transmissionFamilies.some(value => transmission.has(value)))
    && containsMarker(emissions, scope.emissionsMarkers)
    && containsMarker(fuelGrade, scope.fuelGradeMarkers)
    && (!scope.excludedFuelGradeMarkers?.some(marker => fuelGrade.includes(normalizeIdentityFact(marker))))
    && (scope.fuelRonMin === undefined || (input.fuelRon !== undefined && input.fuelRon !== null && input.fuelRon >= scope.fuelRonMin))
    && containsMarker(market, scope.marketMarkers)
    && containsMarker(body, scope.bodyStyleMarkers)
    && containsMarker(drivetrain, scope.drivetrainMarkers);
  return match ? dated : withholdIdentityScopedStage(dated, scope.label);
}

function applyTransmissionIdentity(profile: TuningEstimateProfile, input: CatalogMatchInput): TuningEstimateProfile {
  const families = transmissionFamilies(input.transmission);
  const baseCompatibility = profile.serviceCompatibility ?? {};
  if (families.has("manual")) return {...profile, gearbox: "Manual",
    tcuSupport: {status: "manual-review", basis: "unconfirmed"},
    serviceCompatibility: {...baseCompatibility, gearbox: {status: "not-applicable", note: "Confirmed manual scope; no TCU tuning product."}}};
  const automatic = families.has("dsg6") ? "DSG" : families.has("automatic8") ? "ZF" : undefined;
  if (automatic && profile.tcuSupport?.basis === "documented-application") return {...profile, gearbox: automatic,
    serviceCompatibility: {...baseCompatibility, gearbox: {status: "conditional", note: "Automatic transmission family supplied; identify the exact gearbox and TCU before offering tuning."}}};
  if (!automatic) return {...profile, gearbox: undefined,
    serviceCompatibility: {...baseCompatibility, gearbox: {status: "manual-review", note: "Installed transmission not identified; TCU eligibility requires separate evidence."}}};
  return profile;
}

/** Client-safe adapter; receives one selected vehicle, never imports the catalog. */
export function getCatalogEstimateProfile(vehicle: EngineVariant): TuningEstimateProfile {
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
    configurationNote: vehicle.configurationNote,
    stages: vehicle.stages.map(({name, powerHp, torqueNm, requirements, packageItems,
      confidenceLevel, recommendedUse, hardwareRequired, tcuRecommended, logCheckRecommended, notes, customerScope, comparison,
      powerRangeHp, torqueRangeNm, provenance, approximate, customHardware, hardwareScopeApproved, quoteRequired, customerNote, referenceYearRange}) => ({
      name, powerHp, torqueNm, requirements, customerScope, comparison, packageItems: [...packageItems],
      confidenceLevel: confidenceLevel ?? "estimated", recommendedUse, hardwareRequired,
      tcuRecommended, logCheckRecommended, notes: notes ? [...notes] : undefined,
      powerRangeHp, torqueRangeNm, provenance, approximate, customHardware, hardwareScopeApproved, quoteRequired,
      ...(customerNote ? {customerNote} : {}), ...(referenceYearRange ? {referenceYearRange} : {})
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
    coverageClass: getPublicCatalogTruthGrade(vehicle.id),
    sourceReferences: vehicle.outputReferences ?? [{
      title: "NoordTune existing public catalog",
      sourceType: "existing-catalog",
      scope: `${vehicle.brand} ${vehicle.model}, ${vehicle.engine}, ${vehicle.yearRange}; existing source peak values, including estimated/generated provenance. Source ${vehicle.sourceCanonicalId ?? vehicle.id}.`
    }, ...(is118iSource ? [{
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
      ...(is118iSource ? ["This 2016-source 118i estimate is scoped to 1499 cc. The earlier 1598 cc / 136 hp engine is not equivalent and requires its own tuning reference."] : [])
    ],
    conditionCodes: [
      ...(is118iSource ? ["ENGINE_DISPLACEMENT_SCOPE_1499"] : [])
    ],
    verificationRequired: true
  };
}

/** Registration narrows applicability without changing the selected public-page reference. */
export function getCatalogEstimateProfileForRegistration(vehicle: EngineVariant, year?: number): TuningEstimateProfile {
  return getCatalogEstimateProfileForIdentity(vehicle, {firstRegistrationYear: year});
}

/** Runtime adapter: retain a reviewed numeric Stage only when all required
 * non-registration facts in its truth-overlay scope are explicitly present.
 */
export function getCatalogEstimateProfileForIdentity(vehicle: EngineVariant, input: CatalogMatchInput): TuningEstimateProfile {
  const profile = getCatalogEstimateProfile(vehicle);
  return applyTransmissionIdentity({...profile,
    stages: profile.stages.map((stage, index) => scopeStageToIdentity(stage, vehicle.stages[index], input))}, input);
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
