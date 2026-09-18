// SERVER BOUNDARY: only the RDW server adapter and Node QA import this module.
// The node: built-in makes accidental client bundling fail; unlike `server-only`,
// it also supports the repository's dependency-free executable Node tests.
import {createHash} from "node:crypto";
import {engineCatalog, vehicleDatabase} from "../data/catalog.ts";
import {serviceOptions, type EngineVariant, type StageName} from "../data/catalog-shared.ts";
import {assessCatalogMatch, nominalEngineDisplacements, nominalDisplacementMatches,
  normalizeCatalogFuel, registeredPowerToMetricHp} from "../data/catalog-matching.ts";
import {tuningReferenceProfiles, type EstimateMatchInput} from "../data/tuning-estimates.ts";
import {getCatalogEstimateProfile, type EstimateResolution, type EstimateStage,
  type TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import {genericTuningHeuristics, strongStage1ScenarioStockWidths, type GenericEstimateCategory} from "../data/tuning-heuristics.ts";
import {connectStage1Comparison} from "../data/tuning-reference-research.ts";
import {sourcedTuningProfiles, tuningProfileSources} from "../data/tuning-profiles/index.ts";
import type {SourcedTuningProfile} from "../data/tuning-profiles/schema.ts";
import {matchSourcedProfile, sourceRegistrationYear} from "./sourced-tuning-match.ts";
import {hasUnsupportedSourcedPowertrain} from "./sourced-powertrain.ts";

export type RuntimeEstimateSources = {
  references?: readonly TuningEstimateProfile[];
  publicVehicles?: readonly EngineVariant[];
  canonicalVehicles?: readonly EngineVariant[];
  sourcedProfiles?: readonly SourcedTuningProfile[];
};
type Eligible = {profile: TuningEstimateProfile; reasons: string[]; level: 1 | 2 | 3};
const stageNames: StageName[] = ["Stage 1", "Stage 2", "Stage 3+"];
const normalize = (value?: string) => (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function makeKey(value?: string) {
  const key = normalize(value);
  return ({vw: "volkswagen", mercedes: "mercedes benz", alfa: "alfa romeo", "bmw mini": "mini"} as Record<string, string>)[key] ?? key;
}

export function customHardwareStage(): EstimateStage {
  return {name: "Stage 3+", customHardware: true, hardwareRequired: true,
    requirements: "Individual hardware and calibration scope required before quoting output.", packageItems: [], confidenceLevel: "estimated", logCheckRecommended: true,
    notes: ["No applicable published or owner-approved hardware profile. No numerical output is assigned."]};
}

function supportedStage(stage?: EstimateStage): stage is EstimateStage {
  return Boolean(stage && !stage.customHardware && ((Number.isFinite(stage.powerHp) && stage.powerHp! > 0)
    || (stage.powerRangeHp?.length === 2 && stage.powerRangeHp.every(value => Number.isFinite(value) && value > 0))));
}

function applicableReferences(input: EstimateMatchInput, references: readonly TuningEstimateProfile[]) {
  const year = firstAdmissionYear(input);
  return references.filter(profile => year !== undefined && years(profile).includes(year)
    && generationCompatible(profile, {generation: [input.model, input.type, input.variant, input.execution].filter(Boolean).join(" "), version: ""}));
}

function referenceStage(stage: EstimateStage): EstimateStage {
  // Preserve the existing conditional Connect indication; its comparison interval
  // is not proof that an unidentified transition-year vehicle has either engine.
  return stage.sourceProfileId === "ref-ford-transit-connect-15-tdci-100" && stage.powerRangeHp
    ? {...stage, approximate: true, powerHp: stage.powerRangeHp[0], torqueNm: stage.torqueRangeNm?.[0] ?? stage.torqueNm,
      powerRangeHp: undefined, torqueRangeNm: undefined, sourceConfidence: "single-source"}
    : {...stage, sourceConfidence: "single-source", ...(stage.name === "Stage 3+" ? {hardwareRequired: true} : {})};
}

/** Resolve each stage independently: retained reference, compatible source,
 * reviewed/public or canonical estimate, then the existing conditional policy. */
export function resolveRdwTuningEstimate(input: EstimateMatchInput, sources: RuntimeEstimateSources = {}): EstimateResolution {
  if(hasUnsupportedSourcedPowertrain(input))return {status:"unavailable",coverageClass:"E",reasonCodes:["UNSUPPORTED_POWERTRAIN_ESTIMATE","MANUFACTURER_ELECTRIFIED_APPLICATION"]};
  const references = applicableReferences(input, sources.references ?? tuningReferenceProfiles);
  const retained = references.length ? resolveLegacyRdwTuningEstimate(input, {...sources, references, publicVehicles: [], canonicalVehicles: []}) : undefined;
  const retainedStages = retained?.profile?.stages.filter(stage => stage.provenance === "reference" && supportedStage(stage)) ?? [];
  const match = matchSourcedProfile(input, sources.sourcedProfiles ?? sourcedTuningProfiles);
  const source = match.profile;
  if (!source) {
    const fallback = resolveLegacyRdwTuningEstimate(input, {...sources, references});
    if (!fallback.profile) return {...fallback, coverageClass: "E"};
    // The release correction narrows technical reference eligibility, not the
    // existing commercial software schedule. Preserve that assignment separately
    // when a previously priced reference is now outside its technical period.
    const commercialReferences = collapse((sources.references ?? tuningReferenceProfiles).flatMap((profile): Eligible[] => {
      const reasons = eligibleReasons(input, referenceVehicle(profile), 1);
      return reasons ? [{profile, reasons, level: 1}] : [];
    }));
    const pricingProfileId = commercialReferences.length === 1 ? commercialReferences[0].profile.id : fallback.profile.pricingProfileId;
    const coverageClass = fallback.resolutionLevel === 4 ? "D" : "C";
    const sourceConfidence: NonNullable<EstimateStage["sourceConfidence"]> = coverageClass === "D" ? "generic-fallback" : "canonical-existing";
    // Older generated Stage 3 values do not establish an approved hardware setup.
    const stages = fallback.profile.stages.map(stage => stage.provenance === "reference" && supportedStage(stage) ? referenceStage(stage)
      : stage.name === "Stage 3+" ? customHardwareStage()
      : {...stage, sourceConfidence});
    return {...fallback, coverageClass, reasonCodes: [...new Set([...fallback.reasonCodes, ...match.reasonCodes])],
      profile: {...fallback.profile, pricingProfileId, coverageClass, sourceConfidence, stages}};
  }
  // C consistently denotes the retained layer, including when a lower-priority
  // dataset profile also matches. Coverage is reported from the winning Stage 1.
  const referenceWinsStage1 = retainedStages.some(stage => stage.name === "Stage 1");
  const coverageClass = referenceWinsStage1 ? "C" : source.reviewStatus === "noordtune-approved" || source.stage1.confidence === "multi-source" ? "A" : "B";
  const sourceConfidence = referenceWinsStage1 ? "single-source" : source.stage1.confidence;
  const power = registeredPowerToMetricHp(input)!;
  const stages: EstimateStage[] = [];
  for (const [key, name] of [["stage1", "Stage 1"], ["stage2", "Stage 2"], ["stage3", "Stage 3+"]] as const) {
    const reference = retainedStages.find(stage => stage.name === name);
    const facts = source[key];
    if (reference) stages.push(referenceStage(reference));
    else if (facts) stages.push({name, powerHp: facts.selectedPowerHp, torqueNm: facts.selectedTorqueNm, approximate: true,
      provenance: facts.confidence, sourceConfidence: facts.confidence, sourceProfileId: source.id,
      resolutionLevel: facts.confidence === "multi-source" ? 1 : 2, confidenceLevel: "estimated",
      requirements: name === "Stage 1" ? "Confirm engine configuration, fuel, condition and ECU access before calibration."
        : "Published hardware-dependent reference; the applicable hardware and calibration must be confirmed.",
      packageItems: [], hardwareRequired: name !== "Stage 1", tcuRecommended: false, logCheckRecommended: true,
      notes: [...facts.conditions, "External source research; not a measured NoordTune result."]});
    else if (name === "Stage 3+") stages.push(customHardwareStage());
    else {
      const legacy = resolveLegacyRdwTuningEstimate(input, {...sources, references: []}).profile?.stages.find(stage => stage.name === "Stage 2");
      stages.push(legacy && ["reviewed", "canonical-estimated"].includes(legacy.provenance ?? "") && supportedStage(legacy) ? {...legacy, sourceConfidence: "canonical-existing"}
        : genericStage(name, power, source.stockTorqueNm,
          source.aspiration === "naturally-aspirated" ? "naturally-aspirated" : source.fuel === "Diesel" ? "turbo-diesel" : source.aspiration === "turbo" ? "turbo-petrol" : "unknown-aspiration", stages[0], stages[0]));
    }
  }
  const conditionCodes = [...new Set([
    ...source.conditions.filter(condition => /^[A-Z][A-Z0-9_]+$/.test(condition)),
    ...(source.ownerReviewRequired ? ["SOURCE_OWNER_REVIEW_REQUIRED"] : []),
    ...([source.stage1, source.stage2, source.stage3].some(stage => stage?.sourceAgreement === "conflict") ? ["SOURCE_CONSENSUS_CONFLICT"] : []),
    ...(stages.some(stage => stage.provenance === "generic-indicative") ? ["GENERIC_INDICATIVE_STAGE_FALLBACK"] : []),
    ...(source.brand === "Ford" && source.modelFamily === "Transit Custom" && source.stockPowerHp === 105 ? ["NOORDTUNE_TARGET_REVIEW_REQUIRED"] : [])
  ])];
  const profile: TuningEstimateProfile = {
    id: source.id, brand: source.brand, model: source.modelFamily, engine: source.engineMarketingName,
    pricingProfileId: resolveSourcedPricingProfileId(input, source),
    generation: source.generation, version: source.generation, yearRange: `${source.yearFrom}${source.yearTo ? `–${source.yearTo}` : "+"}`,
    fuel: source.fuel, stockPowerHp: source.stockPowerHp, stockTorqueNm: source.stockTorqueNm, stages,
    provenance: "sourced-profile", coverageClass, sourceConfidence, resolutionLevel: coverageClass === "A" ? 1 : 2,
    runtimeCommercialIdentity: {status: "resolved-compatible", make: input.make!, model: input.model!, fuel: source.fuel,
      registeredPowerHp: power, displacementCc: input.displacementCc, firstAdmissionYear: sourceRegistrationYear(input), cylinders: input.cylinders},
    options: serviceOptions.filter(option => !option.requiresGearbox && (!option.fuels || option.fuels.includes(source.fuel))).map(option => option.id),
    ecuType: source.ecuFamily ? `${source.ecuFamily} (source reference; installed ECU unconfirmed)` : "To be identified",
    ecuSupport: {status: "manual-review"}, transmissionSupport: {status: "manual-review"}, tcuSupport: {status: "manual-review"},
    sourceReferences: tuningProfileSources.filter(item => source.sourceIds.includes(item.id)).map(item => ({
      title: item.sourceName, url: item.url, retrievedAt: item.retrievedAt, sourceType: "tuner" as const,
      retrievalMethod: "page" as const, scope: `${source.brand} ${source.modelFamily}; ${source.engineMarketingName}; ${source.generation}. External published facts, not NoordTune measurements.`})),
    conditions: [...source.conditions, "Published model/engine indication. Exact vehicle, fuel, hardware, transmission and ECU access require verification."],
    conditionCodes, recommendedPackage: {stage: "Stage 1", recommendedOptionIds: [], verificationRequired: true}, verificationRequired: true
  };
  if (retainedStages.length && retained?.profile) {
    const reference = retained.profile;
    if (referenceWinsStage1) {
      // Commercial assignment remains independent of which technical stage wins.
      Object.assign(profile, {id: reference.id, brand: reference.brand, model: reference.model,
        engine: reference.engine, generation: reference.generation, version: reference.version,
        yearRange: reference.yearRange, stockTorqueNm: reference.stockTorqueNm,
        provenance: reference.provenance, resolutionLevel: 1});
    }
    profile.sourceReferences = [...new Map([...reference.sourceReferences.filter(item => item.sourceType !== "heuristic"), ...profile.sourceReferences]
      .map(item => [JSON.stringify(item), item])).values()];
    profile.conditions = [...new Set([...reference.conditions.filter(text => !text.startsWith("Generic Stages")), ...profile.conditions])];
    profile.conditionCodes = [...new Set([...(reference.conditionCodes ?? []).filter(code => !code.startsWith("GENERIC_") && code !== "STRONG_STAGE1_REFERENCE_SCENARIO"), ...conditionCodes])];
  }
  return {status: "conditional", coverageClass, resolutionLevel: profile.resolutionLevel, profile,
    reasonCodes: [...new Set([...match.reasonCodes, ...(retainedStages.length ? (retained?.reasonCodes ?? []).filter(code => !code.startsWith("GENERIC_") && !["STRONG_STAGE1_REFERENCE_SCENARIO", "ASPIRATION_UNCONFIRMED_CONSERVATIVE_ESTIMATE"].includes(code)) : []), ...conditionCodes])]};
}

// Existing public applicability restrictions, independent of estimated provenance.
const displacementScopes: Record<string, readonly number[]> = {
  "ref-bmw-128ti-f40-265": [1998], "ref-ford-transit-custom-20-ecoblue-105": [1995],
  "ref-ford-transit-connect-15-tdci-100": [1499], "bmw-1-series-f20-f21-118i": [1499],
  "bmw-1-series-f20-f21-118d": [1995], "bmw-1-series-f20-f21-120d": [1995],
  "bmw-3-series-f30-f31-318d": [1995], "bmw-3-series-f30-f31-330d": [2993],
  "bmw-5-series-f10-f11-520d": [1995], "bmw-3-series-g20-g21-320i": [1998]
};
function years(profile: TuningEstimateProfile) {
  const range = profile.yearRange.match(/\d{4}/g)?.map(Number) ?? [];
  return range.length > 1 ? Array.from({length: Math.max(0, range[1] - range[0] + 1)}, (_, index) => range[0] + index) : range;
}
function firstAdmissionYear(input: EstimateMatchInput) {
  if (input.firstRegistrationYear && Number.isInteger(input.firstRegistrationYear)) return input.firstRegistrationYear;
  const date = input.firstRegistrationDate;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? parsed.getUTCFullYear() : undefined;
}
function referenceVehicle(profile: TuningEstimateProfile): EngineVariant {
  return {...profile, years: years(profile), stockTorqueNm: profile.stockTorqueNm ?? 0, stages: [], image: "", tags: []};
}
function engineFamily(text: string) {
  if (/\becoblue\b/i.test(text)) return "ecoblue";
  if (/\btdci\b/i.test(text)) return "tdci";
  return text.match(/\b(?:[BMN][134567][0478])\b/i)?.[0].toLowerCase();
}
function identityEngineFamily(input: EstimateMatchInput) {
  if (input.engineGenerationEvidence?.sourceReference.trim()) return input.engineGenerationEvidence.family === "ecoblue" ? "ecoblue" : "tdci";
  return engineFamily([input.model, input.type, input.variant, input.execution].filter(Boolean).join(" "));
}
function familyCompatible(input: EstimateMatchInput, vehicle: Pick<EngineVariant, "engine" | "model">, primary?: TuningEstimateProfile) {
  const expected = identityEngineFamily(input) ?? (primary && engineFamily(primary.engine));
  const candidate = engineFamily(`${vehicle.model} ${vehicle.engine}`);
  return !expected || !candidate || expected === candidate;
}
function generationCompatible(vehicle: Pick<EngineVariant, "generation" | "version">, primary?: Pick<TuningEstimateProfile, "generation" | "version">) {
  const tokens = (text: string): string[] => normalize(text).match(/\b(?:[efg]\d{2,3}|[wcra]\d{3}|mk\s?\d|8[plvy]|b[5-9])\b/g) ?? [];
  const expected = primary ? tokens(`${primary.generation ?? ""} ${primary.version}`) : [];
  const actual = tokens(`${vehicle.generation ?? ""} ${vehicle.version}`);
  return !expected.length || !actual.length || expected.some((token) => actual.includes(token));
}

function eligibleReasons(input: EstimateMatchInput, vehicle: EngineVariant, level: 1 | 2 | 3): string[] | undefined {
  const assessment = assessCatalogMatch(input, [{variant: vehicle, applicability: "reviewed", displacementCc: displacementScopes[vehicle.id]}]);
  if (!assessment.candidates.length || !familyCompatible(input, vehicle)) return undefined;
  const reasons: string[] = assessment.candidates[0].reasonCodes;
  if (reasons.some((code) => ["MISSING_MAKE_OR_MODEL", "MISSING_FUEL", "UNKNOWN_FUEL", "MISSING_POWER", "UNKNOWN_POWER_UNIT", "MISSING_DISPLACEMENT"].includes(code))) return undefined;
  // A coarse 2.0/3.0 template cannot identify which displacement owns its figures.
  if (level === 3 && reasons.includes("CATALOG_DISPLACEMENT_UNRESOLVED")) return undefined;
  if (vehicle.id === "ref-ford-transit-connect-15-tdci-100" && identityEngineFamily(input) !== "tdci") reasons.push("CONNECT_ENGINE_GENERATION_REVIEW");
  return reasons;
}

/** Source pages sometimes name a generation by its release year. These aliases
 * are restricted to the reviewed commercial configuration, never a global year
 * decoder. Both source and public year scopes still have to cover admission. */
const commercialGenerationAliases: Record<string, readonly string[]> = {
  "ref-ford-transit-connect-15-tdci-100": ["2016"],
  "ref-ford-transit-custom-20-ecoblue-105": ["2017"],
  "skoda-octavia-5e-20-tdi-150": ["2013", "2017"]
};
// The newly researched source must name the applicable family for public BMW
// entries whose older engine label is coarse. This scopes the commercial link;
// it neither rewrites the public engine label nor identifies an installed ECU.
const commercialSourceFamilies: Record<string, string> = {
  "ref-bmw-128ti-f40-265": "b48",
  "bmw-1-series-f20-f21-118i": "b38",
  "bmw-1-series-f20-f21-118d": "b47",
  "bmw-1-series-f20-f21-120d": "b47",
  "bmw-3-series-f30-f31-318d": "b47",
  "bmw-3-series-f30-f31-330d": "n57",
  "bmw-5-series-f10-f11-520d": "b47",
  "bmw-3-series-g20-g21-320i": "b48"
};
function commercialGenerationTokens(value: string, brand: string, model: string) {
  const roman: Record<string, string> = {i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6", vii: "7", viii: "8"};
  const text = normalize(value).replace(/\bmk\s*([ivx]+)\b/g, (_match, number: string) => "mk" + (roman[number] ?? number));
  if (makeKey(brand) === "volkswagen" && /\bgolf\b/i.test(model)) {
    const generation = text.match(/\bgolf\s*([5-8])\b/)?.[1] ?? roman[text.match(/^([ivx]+)\b/)?.[1] ?? ""];
    if (generation) return ["golf" + generation];
  }
  return text.match(/\b(?:[efg]\d{2,3}|[wcra]\d{3}|mk\s?\d|8[plvy]|[bc][5-9]|5[ef])\b/g)?.map(token => token.replace(" ", "")) ?? [text];
}
function commercialModel(value: string, brand: string) {
  // Public A45 and source A-Class 45 denote the same explicitly numbered model.
  return makeKey(brand) === "mercedes benz"
    ? value.replace(/^([abces])[-\s]*(?:class|klasse)\s+(\d{2,3})\b/i, "$1$2") : value;
}
function commercialEngineFamily(value: string) {
  const text = normalize(value);
  if (/\becoblue\b/.test(text)) return "ecoblue";
  return text.match(/\b(?:tdci|ecoboost|[bmn][134567][0478]|m1\d{2}|ea\d{3})\b/)?.[0];
}

/** Preserve a reviewed price assignment when technical provenance improves.
 * Only 24 trusted public identities and three references are considered. No
 * canonical scan, source ID rewrite, ECU identification or SEO link is involved. */
export function resolveSourcedPricingProfileId(input: EstimateMatchInput, source: SourcedTuningProfile): string | undefined {
  if (!matchSourcedProfile(input, [source]).profile) return undefined;
  const year = sourceRegistrationYear(input)!;
  const sourceFamily = commercialEngineFamily([source.engineFamily, source.engineMarketingName].join(" "));
  const sourceInput: EstimateMatchInput = {
    make: source.brand, model: commercialModel(source.modelFamily + " " + source.engineMarketingName, source.brand),
    fuel: source.fuel, powerHp: source.stockPowerHp, displacementCc: input.displacementCc,
    firstRegistrationYear: year, type: source.generation, variant: source.engineFamily,
    cylinders: source.cylinders, engineGenerationEvidence: input.engineGenerationEvidence
  };
  const registeredInput = {...input, model: commercialModel(input.model ?? "", input.make ?? "")};
  const candidates = [...engineCatalog, ...tuningReferenceProfiles.map(referenceVehicle)].filter(vehicle => {
    // Admission outside the retained configuration's period must not inherit its
    // assignment even though the broader estimate matcher allows manual review.
    if (!vehicle.years.includes(year) || Math.abs(source.stockPowerHp - vehicle.stockPowerHp) > .51) return false;
    const registeredReasons = eligibleReasons(registeredInput, vehicle, 2);
    const sourceReasons = eligibleReasons(sourceInput, vehicle, 2);
    if (!registeredReasons || !sourceReasons) return false;
    if ([...registeredReasons, ...sourceReasons].some(reason => ["CATALOG_DISPLACEMENT_UNRESOLVED", "REGISTRATION_OUTSIDE_CATALOG_PERIOD", "MISSING_REGISTRATION_YEAR"].includes(reason))) return false;
    const expectedFamily = commercialEngineFamily(vehicle.engine);
    if (expectedFamily && sourceFamily && expectedFamily !== sourceFamily) return false;
    if (commercialSourceFamilies[vehicle.id] && commercialSourceFamilies[vehicle.id] !== sourceFamily) return false;
    // Connect TDCi/EcoBlue are distinct engines at equal displacement and power.
    if (vehicle.id.startsWith("ref-ford-transit-") && expectedFamily !== sourceFamily) return false;
    const sourceGenerations = commercialGenerationTokens(source.generation, source.brand, source.modelFamily);
    const expectedGenerations = commercialGenerationTokens(vehicle.generation ?? vehicle.version, vehicle.brand, vehicle.model);
    return sourceGenerations.some(generation => expectedGenerations.includes(generation))
      || (commercialGenerationAliases[vehicle.id]?.includes(normalize(source.generation)) ?? false);
  });
  const ids = [...new Set(candidates.map(vehicle => vehicle.id))];
  return ids.length === 1 ? ids[0] : undefined;
}
function technicalKey(profile: TuningEstimateProfile) {
  return JSON.stringify([makeKey(profile.brand), normalize(profile.model), normalize(profile.engine), profile.fuel,
    nominalEngineDisplacements(profile.engine), profile.stockPowerHp, profile.stockTorqueNm,
    profile.stages.map((stage) => [stage.name, stage.powerHp, stage.torqueNm])]);
}
function collapse(entries: Eligible[]) {
  const groups = new Map<string, Eligible>();
  for (const entry of entries.sort((a, b) => a.profile.id.localeCompare(b.profile.id))) {
    const key = technicalKey(entry.profile);
    const prior = groups.get(key);
    if (!prior || entry.reasons.length < prior.reasons.length) groups.set(key, entry);
  }
  return [...groups.values()];
}

function canonicalProfile(vehicle: EngineVariant): TuningEstimateProfile {
  const profile = getCatalogEstimateProfile(vehicle);
  return {...profile, vehicleId: undefined, resolutionLevel: 3, provenance: "canonical-estimated",
    ecuType: "To be identified", ecuSupport: {status: "manual-review"},
    transmissionSupport: {status: "manual-review"}, tcuSupport: {status: "manual-review"},
    // A generated gearbox label is not identification of the installed transmission.
    gearbox: undefined,
    options: profile.options.filter((id) => serviceOptions.some((option) => option.id === id && !option.requiresGearbox && (!option.fuels || option.fuels.includes(profile.fuel)))),
    recommendedPackage: {stage: "Stage 1", recommendedOptionIds: [], verificationRequired: true},
    sourceReferences: [{title: "NoordTune canonical catalog indication", sourceType: "existing-catalog", scope: `${vehicle.brand} ${vehicle.model}; ${vehicle.engine}; equivalent year copies grouped. Estimated template values, source ${vehicle.id}.`}],
    conditions: ["Conditional canonical catalog indication. Engine, software, ECU access, transmission, hardware and vehicle condition require workshop verification. This is not a measured NoordTune result."],
    conditionCodes: ["CANONICAL_ESTIMATE_VERIFICATION_REQUIRED"]};
}

/** Cheap identity shortlist before profiles are constructed. The full dataset never leaves this module. */
const canonicalIndexes=new WeakMap<readonly EngineVariant[],{length:number;byMakeFuel:Map<string,EngineVariant[]>}>();
function shortlist(input: EstimateMatchInput, catalog: readonly EngineVariant[]) {
  const make = makeKey(input.make);
  const fuel = normalizeCatalogFuel(input.fuel);
  const power = registeredPowerToMetricHp(input)!;
  let index=canonicalIndexes.get(catalog);
  if(!index||index.length!==catalog.length){
    index={length:catalog.length,byMakeFuel:new Map()};
    for(const vehicle of catalog){const key=makeKey(vehicle.brand)+"|"+vehicle.fuel,list=index.byMakeFuel.get(key)??[];list.push(vehicle);index.byMakeFuel.set(key,list);}
    canonicalIndexes.set(catalog,index);
  }
  return (index.byMakeFuel.get(make+"|"+fuel)??[]).filter((vehicle) => {
    if (makeKey(vehicle.brand) !== make || vehicle.fuel !== fuel || Math.abs(vehicle.stockPowerHp - power) > 3) return false;
    const nominal = nominalEngineDisplacements(vehicle.engine);
    return nominal.length === 1 && (!input.displacementCc || nominalDisplacementMatches(input.displacementCc, nominal[0]));
  });
}
function aspirationCategory(input: EstimateMatchInput, profiles: readonly TuningEstimateProfile[]): GenericEstimateCategory {
  const text = [input.model, ...profiles.map((profile) => profile.engine)].filter(Boolean).join(" ");
  const fuel = normalizeCatalogFuel(input.fuel);
  // The retained BMW manufacturer reference explicitly identifies TwinPower Turbo.
  if (fuel === "Petrol" && profiles.some((profile) => profile.id === "ref-bmw-128ti-f40-265")) return "turbo-petrol";
  if (/naturally aspirated|atmospheric|atmosferisch/i.test(text)) return "naturally-aspirated";
  if (fuel === "Diesel" && /turbo|\b(?:TDI|TDCi|EcoBlue|CDI|CDTi|dCi|HDi|BlueHDi|CRDi|JTD|MultiJet)\b/i.test(text)) return "turbo-diesel";
  if (fuel === "Petrol" && /turbo|\b(?:TSI|TFSI|EcoBoost|TCe|T-Jet|THP|T-GDI)\b/i.test(text)) return "turbo-petrol";
  return "unknown-aspiration";
}
function stagePowerRange(stage?: EstimateStage): [number, number] | undefined {
  return stage?.powerRangeHp ?? (stage?.powerHp ? [stage.powerHp, stage.powerHp] : undefined);
}
function stageTorqueRange(stage?: EstimateStage): [number, number] | undefined {
  return stage?.torqueRangeNm ?? (stage?.torqueNm ? [stage.torqueNm, stage.torqueNm] : undefined);
}
function roundedMonotonicRange(range: readonly [number, number], prior?: readonly [number, number]): [number, number] {
  const lower = Math.max(5, Math.floor((range[0] + 1e-8) / 5) * 5, prior ? Math.ceil((prior[0] - 1e-8) / 5) * 5 : 0);
  const upper = Math.max(lower, Math.ceil((range[1] - 1e-8) / 5) * 5, prior ? Math.ceil((prior[1] - 1e-8) / 5) * 5 : 0);
  return [lower, upper];
}
function genericStage(name: StageName, stockPower: number, stockTorque: number | undefined, category: GenericEstimateCategory, prior?: EstimateStage, sourcedStage1?: EstimateStage): EstimateStage {
  const policy = genericTuningHeuristics[category][name];
  // RDW-to-pk conversion is displayed at whole pk; do not let sub-pk conversion
  // noise shift an indicative five-pk endpoint or trigger a de-rating scenario.
  const planningStockPower = Math.round(stockPower);
  const sourceRange = stagePowerRange(sourcedStage1);
  const scenarioWidth = strongStage1ScenarioStockWidths[name];
  const normalStage2Upper = Math.ceil(planningStockPower * genericTuningHeuristics[category]["Stage 2"].powerFactorRange[1] / 5) * 5;
  const strongSource = sourceRange && scenarioWidth !== undefined
    && sourceRange[0] > normalStage2Upper + 3;
  const rawPowerRange: [number, number] = strongSource ? [sourceRange[0], sourceRange[1] + planningStockPower * scenarioWidth]
    : [planningStockPower * policy.powerFactorRange[0], planningStockPower * policy.powerFactorRange[1]];
  const powerRangeHp = roundedMonotonicRange(rawPowerRange, stagePowerRange(prior));
  const torqueRangeNm = stockTorque && stockTorque > 0
    ? roundedMonotonicRange([stockTorque * policy.torqueFactorRange[0], stockTorque * policy.torqueFactorRange[1]], stageTorqueRange(prior)) : undefined;
  return {name, powerRangeHp, torqueRangeNm, provenance: "generic-indicative", resolutionLevel: 4,
    sourceProfileId: `heuristic-v2:${category}`, genericCategory: category,
    genericScenario: strongSource ? "strong-stage1-conditional" : "standard-range",
    requirements: name === "Stage 1" ? "Generic indicative software scenario; confirm engine, aspiration, ECU access and condition before work." : "Generic indicative hardware and calibration scenario; compatible hardware and workshop validation required.",
    packageItems: [], confidenceLevel: "estimated", hardwareRequired: name !== "Stage 1", logCheckRecommended: true,
    notes: ["Rounded local planning range, not a model-specific tune or measured result. Each range starts from registered stock power; earlier bounds prevent regression without multiplying a previous Stage.",
      ...(strongSource ? ["The sourced Stage 1 exceeds the normal generic Stage 2 band. This may reflect a factory-de-rated configuration, but hardware equivalence is unconfirmed. Later bands are broad conditional scenarios based on the same fixed source interval, not approved NoordTune targets."] : []),
      ...(torqueRangeNm ? ["Torque is a broad estimated range based on compatible source stock torque, with nondecreasing bounds; it is not an exact torque measurement."] : ["No defensible stock torque source: torque is intentionally unspecified."])]};
}

/** Resolve one compact runtime profile. Publication, pricing and ECU confirmation do not gate power estimates. */
export function resolveLegacyRdwTuningEstimate(input: EstimateMatchInput, sources: RuntimeEstimateSources = {}): EstimateResolution {
  if (typeof window !== "undefined") throw new Error("RDW tuning estimate resolution is server-only.");
  const power = registeredPowerToMetricHp(input);
  const fuel = normalizeCatalogFuel(input.fuel);
  const invalid = [
    ...(!input.make?.trim() || !input.model?.trim() ? ["MISSING_MAKE_OR_MODEL"] : []),
    ...(!power ? ["MISSING_OR_INVALID_REGISTERED_POWER"] : []),
    ...(!fuel ? ["UNKNOWN_OR_CONFLICTING_POWERTRAIN"] : []),
    ...(fuel === "Hybrid" || fuel === "Electric" ? ["UNSUPPORTED_POWERTRAIN_ESTIMATE"] : []),
    ...(input.displacementCc !== undefined && input.displacementCc !== null && (!Number.isFinite(input.displacementCc) || input.displacementCc <= 0) ? ["INVALID_DISPLACEMENT"] : [])
  ];
  if (invalid.length || !power || !fuel) return {status: "unavailable", reasonCodes: invalid};
  const reasons: string[] = [];
  const referenceEntries = (sources.references ?? tuningReferenceProfiles).flatMap((profile): Eligible[] => {
    const match = eligibleReasons(input, referenceVehicle(profile), 1);
    if (!match) return [];
    let runtimeProfile = profile.id === "ref-ford-transit-connect-15-tdci-100" ? {...profile,
      stages: profile.stages.map((stage) => stage.name === "Stage 1" ? {...stage,
        powerRangeHp: connectStage1Comparison.powerRangeHp, torqueRangeNm: connectStage1Comparison.torqueRangeNm} : stage),
      sourceReferences: connectStage1Comparison.sourceReferences,
      conditions: [...profile.conditions, ...connectStage1Comparison.conditions]
    } : profile;
    if (profile.id === "ref-ford-transit-custom-20-ecoblue-105") {
      match.push("NOORDTUNE_TARGET_REVIEW_REQUIRED");
      runtimeProfile = {...runtimeProfile,
        conditionCodes: [...(runtimeProfile.conditionCodes ?? []), "NOORDTUNE_TARGET_REVIEW_REQUIRED"],
        conditions: [...runtimeProfile.conditions, "The external 190 pk / 440 Nm Stage 1 reference is not an approved or preferred NoordTune target. Owner review is required; workshop experience includes more conservative configurations for this family."]};
    }
    return [{profile: runtimeProfile, reasons: match, level: 1}];
  });
  const referenceGroups = collapse(referenceEntries);
  const primaryReference = referenceGroups.length === 1 ? referenceGroups[0] : undefined;
  if (referenceGroups.length > 1) reasons.push("MULTIPLE_REFERENCE_TECHNICAL_PROFILES");
  const publicEntries = (sources.publicVehicles ?? engineCatalog).flatMap((vehicle): Eligible[] => {
    if (!familyCompatible(input, vehicle, primaryReference?.profile) || !generationCompatible(vehicle, primaryReference?.profile)) return [];
    const match = eligibleReasons(input, vehicle, 2);
    return match ? [{profile: getCatalogEstimateProfile(vehicle), reasons: match, level: 2}] : [];
  });
  const publicGroups = collapse(publicEntries);
  const primaryPublic = publicGroups.length === 1 ? publicGroups[0] : undefined;
  if (publicGroups.length > 1) reasons.push("MULTIPLE_PUBLIC_TECHNICAL_PROFILES");
  const highPriority = primaryReference ?? primaryPublic;
  // Evaluate identities first. Build compact profiles only for technically compatible records.
  const canonicalShortlist = shortlist(input, sources.canonicalVehicles ?? vehicleDatabase);
  const compatibleCanonical = canonicalShortlist.flatMap((vehicle) => {
    if (!familyCompatible(input, vehicle, highPriority?.profile) || !generationCompatible(vehicle, highPriority?.profile)) return [];
    const match = eligibleReasons(input, vehicle, 3);
    return match ? [{vehicle, reasons: match}] : [];
  });
  const canonicalGroups = collapse(compatibleCanonical.map(({vehicle, reasons: match}) => ({profile: canonicalProfile(vehicle), reasons: match, level: 3})));
  const primaryCanonical = canonicalGroups.length === 1 ? canonicalGroups[0] : undefined;
  if (canonicalGroups.length > 1) reasons.push("MULTIPLE_CANONICAL_TECHNICAL_PROFILES");
  if (compatibleCanonical.length > canonicalGroups.length) reasons.push("EQUIVALENT_CANONICAL_DUPLICATES_COLLAPSED");
  const selected = [primaryReference, primaryPublic, primaryCanonical].filter((item): item is Eligible => Boolean(item));
  const primary = selected.at(0);
  const level = primary?.level ?? 4;
  const category = aspirationCategory(input, selected.map((entry) => entry.profile));
  const profileId = `rdw-generic-${createHash("sha256").update(JSON.stringify([makeKey(input.make), normalize(input.model), fuel, input.displacementCc, power])).digest("hex").slice(0, 12)}`;
  const base: TuningEstimateProfile = primary?.profile ?? {
    id: profileId, brand: input.make!.trim(), model: input.model!.trim(),
    engine: input.displacementCc ? `${input.displacementCc} cc ${fuel}` : fuel,
    yearRange: String(input.firstRegistrationYear ?? input.firstRegistrationDate?.slice(0, 4) ?? ""), version: "RDW generic indication",
    fuel, stockPowerHp: Math.round(power), stages: [], options: serviceOptions.filter((option) => !option.requiresGearbox && (!option.fuels || option.fuels.includes(fuel))).map((option) => option.id),
    ecuType: "To be identified", ecuSupport: {status: "manual-review"}, transmissionSupport: {status: "manual-review"},
    provenance: "generic-indicative", sourceReferences: [], conditions: [], conditionCodes: [], verificationRequired: true
  };
  const stages: EstimateStage[] = [];
  const used = new Set<Eligible>();
  for (const name of stageNames) {
    const source = selected.find((entry) => entry.profile.stages.some((stage) => stage.name === name && supportedStage(stage)));
    if (source) {
      const stage = source.profile.stages.find((item) => item.name === name)!;
      stages.push({...stage, provenance: source.level === 1 ? "reference" : source.level === 2 && stage.confidenceLevel === "verified" ? "reviewed" : "canonical-estimated", sourceProfileId: source.profile.id, resolutionLevel: source.level});
      used.add(source);
    } else {
      stages.push(genericStage(name, power, base.stockTorqueNm, category, stages.at(-1), stages.find((stage) => stage.name === "Stage 1" && stage.provenance !== "generic-indicative")));
    }
  }
  const generic = stages.some((stage) => stage.provenance === "generic-indicative");
  if (generic) reasons.push("GENERIC_INDICATIVE_STAGE_FALLBACK");
  if (generic && category === "unknown-aspiration") reasons.push("ASPIRATION_UNCONFIRMED_CONSERVATIVE_ESTIMATE");
  const strongStageScenario = stages.some((stage) => stage.genericScenario === "strong-stage1-conditional");
  if (strongStageScenario) reasons.push("STRONG_STAGE1_REFERENCE_SCENARIO");
  if (level === 3) reasons.push("CANONICAL_ESTIMATE_VERIFICATION_REQUIRED");
  for (const source of used) reasons.push(...source.reasons);
  const sourceReferences = [...new Map([...used].flatMap((entry) => entry.profile.sourceReferences).map((reference) => [JSON.stringify(reference), reference])).values()];
  if (generic) sourceReferences.push({title: "NoordTune generic RDW indication policy v2", sourceType: "heuristic", scope: `${category}: independently stock-based planning intervals, rounded to 5 pk. Bounds cannot regress; no recursive Stage multipliers. Unusually strong sourced Stage 1 uses broad conditional scenarios, not model-specific targets. Unknown stock torque is not invented.`});
  // RDW identity has no identified-transmission evidence. A matching catalog
  // gearbox label must not become an applicable TCU service on any runtime level.
  const gearboxOptionIds = new Set(serviceOptions.filter((option) => option.requiresGearbox).map((option) => option.id));
  const profile: TuningEstimateProfile = {...base, resolutionLevel: level,
    runtimeCommercialIdentity: {status: level === 4 ? "resolved-generic" : "resolved-compatible",
      make: input.make!.trim(), model: input.model!.trim(), fuel: fuel as "Petrol" | "Diesel",
      registeredPowerHp: power, displacementCc: input.displacementCc,
      firstAdmissionYear: firstAdmissionYear(input), cylinders: input.cylinders},
    stages: stages.map((stage) => ({...stage, tcuRecommended: false})), sourceReferences,
    gearbox: undefined, transmissionSupport: {status: "manual-review"}, tcuSupport: {status: "manual-review"},
    options: base.options.filter((id) => !gearboxOptionIds.has(id)),
    serviceCompatibility: {...base.serviceCompatibility, ...Object.fromEntries([...gearboxOptionIds].map((id) => [id, {status: "manual-review" as const, note: "Installed transmission not identified by RDW; TCU eligibility requires separate evidence."}]))},
    recommendedPackage: base.recommendedPackage ? {...base.recommendedPackage,
      recommendedOptionIds: base.recommendedPackage.recommendedOptionIds?.filter((id) => !gearboxOptionIds.has(id))} : undefined,
    conditions: [...new Set([...used].flatMap((entry) => entry.profile.conditions).concat(generic ? ["Generic Stages are conservative indicative scenarios, not measured or model-specific promises. Hardware and exact engine/ECU access require confirmation."] : []))],
    conditionCodes: [...new Set([...(base.conditionCodes ?? []), ...(generic ? ["GENERIC_INDICATIVE_STAGE_FALLBACK"] : []),
      ...(strongStageScenario ? ["STRONG_STAGE1_REFERENCE_SCENARIO"] : []),
      ...(generic && !base.stockTorqueNm ? ["GENERIC_TORQUE_UNAVAILABLE"] : [])])]};
  return {status: reasons.length || level >= 3 ? "conditional" : "applicable", resolutionLevel: level, profile,
    diagnostics: {referenceTechnicalProfiles: referenceGroups.length, publicTechnicalProfiles: publicGroups.length,
      canonicalShortlisted: canonicalShortlist.length, canonicalCompatible: compatibleCanonical.length, canonicalTechnicalProfiles: canonicalGroups.length},
    reasonCodes: [...new Set(reasons.length ? reasons : ["APPLICABLE_RUNTIME_ESTIMATE"])]};
}
