import type {EngineVariant} from "./catalog-shared.ts";
import {serviceOptions} from "./catalog-shared.ts";
import {assessCatalogMatch, type CatalogMatchInput} from "./catalog-matching.ts";
import {
  getCatalogEstimateProfile, unavailableEstimateStage,
  type EstimateResolution, type EstimateSourceReference, type TuningEstimateProfile
} from "./tuning-estimates-shared.ts";

const RETRIEVED_AT = "2026-09-15";
function source(title: string, url: string, scope: string, sourceType: "manufacturer" | "tuner", retrievalMethod: "page" | "search-index" = "page"): EstimateSourceReference {
  return {title, url, scope, sourceType, retrievedAt: RETRIEVED_AT, retrievalMethod};
}

export const tuningReferenceSources = {
  bmwStock: source("BMW: The new BMW 128ti", "https://www.press.bmwgroup.com/united-kingdom/article/detail/T0318330EN_GB/the-new-bmw-128ti", "Manufacturer stock specification: 128ti, four-cylinder 2.0 petrol, 265 hp and 400 Nm; November 2020 launch.", "manufacturer"),
  bmwStage1: source("Mosselman: BMW 128ti F40 265hp", "https://www.mosselmanturbo.com/nl/bmw-128ti-f40-265hp", "Tuner-published Stage 1 peak estimate: 310 pk / 480 Nm on RON98. Stock 265 hp / 400 Nm / 195 kW. Not a NoordTune measurement. Stage 2 is intentionally omitted: source headline and body disagree about torque.", "tuner"),
  customStock: source("Ford Transit Custom manufacturer brochure", "https://www.ford.ie/content/dam/guxeu/ie/Documents/Brochures/CVs/BRO-New_transit_custom.pdf", "2.0 EcoBlue 105 PS / 77 kW stock variant: 360 Nm. Manufacturer brochure; exact installed variant and production date still require confirmation.", "manufacturer", "search-index"),
  customStage1: source("BR-Performance: Transit Custom 2.0 EcoBlue 105", "https://www.br-performance.be/fr-be/reprogrammation/1-voitures/23-ford/12695-transit-custom/14309-i-facelift-2-2019-2022/23049-2-0-ecoblue/", "Transit Custom I Facelift 2 (2019–2022), 2.0 EcoBlue: stock 105 ch / 360 Nm; Stage 1 190 ch / 440 Nm. Tuner-published peak estimate only; software scope, vehicle/hardware condition to confirm. No source price, guarantee, image or dyno curve adopted.", "tuner", "search-index"),
  connectStock: source("Ford: New Transit Connect 1.5 TDCi powertrains (2015)", "https://media.ford.com/content/fordmedia/feu/gb/en/news/2015/06/01/ford-delivers-class-leading-fuel-efficiency--segment-first-techn.html", "Manufacturer: 1.5 TDCi ECOnetic 100 PS / 250 Nm introduced summer 2015; replaces the earlier 1.6 TDCi configuration.", "manufacturer", "search-index"),
  connectStage1: source("BR-Performance: Transit Connect II 1.5 TDCi 100", "https://www.br-performance.be/nl-be/chiptuning/1-wagens/23-ford/12693-transit-connect/14273-ii-2013-2018/22985-1-5-tdci/", "Transit Connect II 1.5 TDCi (2015–2018), pre-facelift: stock 100 pk / 250 Nm; Stage 1 125 pk / 330 Nm. This reference does not establish EcoBlue output.", "tuner", "search-index"),
  connectTransition: source("Ford: New Transit Connect EcoBlue powertrains (2018)", "https://media.ford.com/content/fordmedia/feu/gb/en/news/2018/07/06/new-ford-transit-connect-cuts-fuel-bills-for-operators-by-up-to-.html", "Ford introduces the new 1.5 EcoBlue 75/100/120 PS Connect in mid-2018. A 2018 first-registration date plus 1499 cc / 100 pk does not establish pre-facelift TDCi versus EcoBlue.", "manufacturer", "search-index")
};

function reference(input: {
  id: string; brand: string; model: string; engine: string; generation: string; yearRange: string;
  fuel: "Petrol" | "Diesel"; stockPowerHp: number; stockTorqueNm: number; powerHp: number; torqueNm: number;
  sourceReferences: EstimateSourceReference[]; requirements: string; conditions?: string[];
}): TuningEstimateProfile {
  return {
    id: input.id, brand: input.brand, model: input.model, engine: input.engine,
    generation: input.generation, version: "Published Stage 1 reference", yearRange: input.yearRange,
    fuel: input.fuel, stockPowerHp: input.stockPowerHp, stockTorqueNm: input.stockTorqueNm,
    stages: [{
      name: "Stage 1", powerHp: input.powerHp, torqueNm: input.torqueNm,
      requirements: input.requirements, packageItems: ["Vehicle-specific software scope and diagnostic checks before work"],
      confidenceLevel: "estimated", recommendedUse: "daily", hardwareRequired: false,
      tcuRecommended: false, logCheckRecommended: true,
      notes: ["Independent tuner-published peak estimate; actual outcome depends on the vehicle and fuel. Not a NoordTune dyno result."]
    }, unavailableEstimateStage("Stage 2"), unavailableEstimateStage("Stage 3+")],
    // Use existing option filtering; unknown transmission never creates TCU eligibility.
    options: serviceOptions.filter((option) => !option.requiresGearbox && (!option.fuels || option.fuels.includes(input.fuel))).map((option) => option.id),
    ecuType: "To be identified", ecuSupport: {status: "manual-review"},
    transmissionSupport: {status: "manual-review"},
    recommendedPackage: {stage: "Stage 1", recommendedOptionIds: [], verificationRequired: true},
    provenance: "tuner-reference", sourceReferences: input.sourceReferences,
    conditions: [input.requirements, ...(input.conditions ?? []), "ECU/access and vehicle condition must be checked before execution; published peak values are indicative."],
    verificationRequired: true
  };
}

/** A tiny reference layer, separate from canonical records and public SEO publication. */
export const tuningReferenceProfiles: readonly TuningEstimateProfile[] = [
  reference({
    id: "ref-bmw-128ti-f40-265", brand: "BMW", model: "128ti", engine: "2.0 petrol (1998 cc)",
    generation: "F40", yearRange: "2020–2024", fuel: "Petrol", stockPowerHp: 265, stockTorqueNm: 400,
    powerHp: 310, torqueNm: 480, requirements: "RON98 petrol; confirm vehicle condition and ECU access before work.",
    sourceReferences: [tuningReferenceSources.bmwStock, tuningReferenceSources.bmwStage1]
  }),
  reference({
    id: "ref-ford-transit-custom-20-ecoblue-105", brand: "Ford", model: "Transit Custom", engine: "2.0 EcoBlue (1995 cc)",
    generation: "Mk1 (I facelift 2)", yearRange: "2019–2022", fuel: "Diesel", stockPowerHp: 105, stockTorqueNm: 360,
    powerHp: 190, torqueNm: 440, requirements: "2.0 EcoBlue 105 PS diesel, reference generation 2019–2022; original hardware/software scope and condition to confirm.",
    sourceReferences: [tuningReferenceSources.customStock, tuningReferenceSources.customStage1]
  }),
  reference({
    id: "ref-ford-transit-connect-15-tdci-100", brand: "Ford", model: "Transit Connect", engine: "1.5 TDCi pre-facelift reference (1499 cc)",
    generation: "Mk2 (II pre-facelift)", yearRange: "2015–2018", fuel: "Diesel", stockPowerHp: 100, stockTorqueNm: 250,
    powerHp: 125, torqueNm: 330, requirements: "Only for the pre-facelift 1.5 TDCi 100 PS diesel; confirm engine generation before applying these figures. This is not an EcoBlue estimate.",
    sourceReferences: [tuningReferenceSources.connectStock, tuningReferenceSources.connectStage1, tuningReferenceSources.connectTransition],
    conditions: ["A 2018 first registration does not resolve the TDCi/EcoBlue engine change; identify the engine family from vehicle documentation or an engine inspection."]
  })
];

export type EstimateMatchInput = CatalogMatchInput & {
  /** Explicit model/engine evidence; an opaque registry variant is not decoded speculatively. */
  engineGenerationEvidence?: {family: "tdci-pre-facelift" | "ecoblue"; sourceReference: string};
};

function referenceCandidate(profile: TuningEstimateProfile): EngineVariant {
  return {
    ...profile,
    years: profile.yearRange.split("–").length === 2
      ? Array.from({length: Number(profile.yearRange.split("–")[1]) - Number(profile.yearRange.split("–")[0]) + 1}, (_, i) => Number(profile.yearRange.split("–")[0]) + i)
      : [],
    stockTorqueNm: profile.stockTorqueNm!,
    // Matching uses identity/stock facts only; commercial prices are never synthesized.
    stages: [],
    image: "", tags: []
  };
}

const referenceDisplacements: Record<string, readonly number[]> = {
  "ref-bmw-128ti-f40-265": [1998],
  "ref-ford-transit-custom-20-ecoblue-105": [1995],
  "ref-ford-transit-connect-15-tdci-100": [1499]
};

// Narrow only ambiguous existing labels. These are applicability constraints, not changes
// to source tuning figures or new physical ECU claims. The 118i source is a 2016 template;
// it does not establish the earlier 1598 cc / same-power engine's tuning potential.
const publicDisplacementScopes: Record<string, readonly number[]> = {
  "bmw-1-series-f20-f21-118i": [1499],
  "bmw-1-series-f20-f21-118d": [1995],
  "bmw-1-series-f20-f21-120d": [1995],
  "bmw-3-series-f30-f31-318d": [1995],
  "bmw-3-series-f30-f31-330d": [2993],
  "bmw-5-series-f10-f11-520d": [1995],
  "bmw-3-series-g20-g21-320i": [1998]
};

function incompleteIdentity(reasons: readonly string[]) {
  return reasons.some((code) => ["MISSING_MAKE_OR_MODEL", "MISSING_FUEL", "UNKNOWN_FUEL", "MISSING_POWER", "UNKNOWN_POWER_UNIT", "MISSING_DISPLACEMENT"].includes(code));
}

export function resolveTuningEstimate(input: EstimateMatchInput, publicVehicles: readonly EngineVariant[]): EstimateResolution {
  const eligible: {profile: TuningEstimateProfile; reasons: string[]}[] = [];
  const rejected: string[] = [];
  const profiles = [
    ...tuningReferenceProfiles.map((profile) => ({profile, vehicle: referenceCandidate(profile), displacementCc: referenceDisplacements[profile.id]})),
    ...publicVehicles.map((vehicle) => ({profile: getCatalogEstimateProfile(vehicle), vehicle, displacementCc: publicDisplacementScopes[vehicle.id]}))
  ];
  for (const entry of profiles) {
    const assessment = assessCatalogMatch(input, [{variant: entry.vehicle, applicability: "reviewed", displacementCc: entry.displacementCc}]);
    if (!assessment.candidates.length) {
      rejected.push(...assessment.reasonCodes);
      continue;
    }
    const reasons = assessment.candidates[0].reasonCodes.filter((code) => code !== "GENERATED_APPLICABILITY_UNREVIEWED");
    if (incompleteIdentity(reasons)) { rejected.push(...reasons); continue; }
    if (entry.profile.id === "ref-ford-transit-connect-15-tdci-100") {
      const evidence = input.engineGenerationEvidence;
      const text = [input.model, input.type, input.variant, input.execution].filter(Boolean).join(" ");
      if (/ecoblue/i.test(text) || (evidence?.sourceReference.trim() && evidence.family === "ecoblue")) {
        rejected.push("CONNECT_ECOBLUE_REFERENCE_UNAVAILABLE");
        continue;
      }
      const identifiedTdci = evidence?.sourceReference.trim() && evidence.family === "tdci-pre-facelift";
      if (!identifiedTdci) reasons.push("CONNECT_ENGINE_GENERATION_REVIEW" as never);
    }
    if (entry.profile.id === "bmw-1-series-f20-f21-118i") reasons.push("CATALOG_DISPLACEMENT_UNRESOLVED");
    eligible.push({profile: entry.profile, reasons});
  }
  // Collapse repeated source/year copies only when identity, generation, stock and tuned
  // values agree. A second non-equivalent output configuration still needs selection.
  const unique = new Map<string, typeof eligible[number]>();
  for (const item of eligible) {
    const p = item.profile;
    const key = JSON.stringify([p.brand.toLowerCase(), p.model.toLowerCase(), p.engine.toLowerCase(), p.generation, p.fuel, p.stockPowerHp, p.stockTorqueNm, p.gearbox, p.stages.map((s) => [s.name, s.powerHp, s.torqueNm])]);
    if (!unique.has(key)) unique.set(key, item);
  }
  if (unique.size !== 1) return {status: "unavailable", reasonCodes: unique.size ? ["MULTIPLE_ESTIMATE_CONFIGURATIONS"] : [...new Set(["NO_APPLICABLE_TUNING_PROFILE", ...rejected])].filter((reason) => reason !== "NO_MODEL_FAMILY")};
  const match = [...unique.values()][0];
  const conditional = match.reasons.length > 0;
  return {
    status: conditional ? "conditional" : "applicable", profile: match.profile,
    reasonCodes: conditional ? [...new Set(match.reasons)] : ["APPLICABLE_CATALOG_ESTIMATE"]
  };
}
