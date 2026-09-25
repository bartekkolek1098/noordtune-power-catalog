// Historical PR13 coverage runner. Dataset V1 uses test-tuning-profile-dataset.ts
// and data/research/coverage-report.json; its Stage3 and pricing policy supersede
// this checkpoint's assertions. Run this file only against the PR13 checkout.
import assert from "node:assert/strict";
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {performance} from "node:perf_hooks";
import {createHash} from "node:crypto";
import {engineCatalog, vehicleDatabase, vehicleDatabaseCount} from "../src/data/catalog.ts";
import type {EngineVariant} from "../src/data/catalog-shared.ts";
import {nominalEngineDisplacements, normalizeCatalogFuel, registeredPowerToMetricHp} from "../src/data/catalog-matching.ts";
import {tuningReferenceProfiles, type EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import type {EstimateResolution, EstimateStage, TuningEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {assessVehicleAccess, resolveStageQuote} from "../src/data/pricing.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";

type Fixture = {id: string; group: "live-owner" | "curated" | "non-public-canonical" | "safety"; input: EstimateMatchInput; sourceId?: string; context?: string};
type LiveFixture = {caseId: string; normalizedIdentity: EstimateMatchInput; liveRetrievalSucceeded: boolean};
const liveSource = JSON.parse(readFileSync(resolve("docs/tuning-qa/runtime/live-rdw-identities.json"), "utf8")) as {retrievedAt: string; identities: LiveFixture[]};
const publicIds = new Set(engineCatalog.flatMap(vehicle => [vehicle.id, vehicle.sourceCanonicalId].filter(Boolean)));
const publicProfileIds = new Set(engineCatalog.map(vehicle => vehicle.id));
const referenceProfileIds = new Set(tuningReferenceProfiles.map(vehicle => vehicle.id));
const sourceById = new Map<string, EngineVariant | TuningEstimateProfile>([...vehicleDatabase, ...engineCatalog, ...tuningReferenceProfiles].map(vehicle => [vehicle.id, vehicle]));
const brands = ["BMW", "Volkswagen", "Audi", "Ford", "Mercedes-Benz", "Volvo", "Renault", "Peugeot", "Citroën", "Opel", "Land Rover", "Fiat", "Hyundai", "Kia"];
const stages = ["Stage 1", "Stage 2", "Stage 3+"];
const beforeCounts = {public: engineCatalog.length, canonical: vehicleDatabaseCount, stages: vehicleDatabase.reduce((sum, vehicle) => sum + vehicle.stages.length, 0)};
function sourceFingerprint() {
  const digest = createHash("sha256");
  for (const vehicle of vehicleDatabase) digest.update(JSON.stringify([vehicle.id, vehicle.brand, vehicle.model, vehicle.engine, vehicle.fuel, vehicle.years, vehicle.stockPowerHp, vehicle.stockTorqueNm, vehicle.stages.map(stage => [stage.name, stage.powerHp, stage.torqueNm, stage.requirements, stage.packageItems])]));
  return digest.digest("hex");
}
const originalSourceFingerprint = sourceFingerprint();
let assertions = 0;
function check(condition: unknown, message: string): asserts condition { assertions++; assert.ok(condition, message); }
function same(actual: unknown, expected: unknown, message: string) { assertions++; assert.deepEqual(actual, expected, message); }
function positive(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && value > 0; }
function positiveRange(value: unknown): value is [number, number] { return Array.isArray(value) && value.length === 2 && value.every(positive) && value[0] <= value[1]; }
function hasPower(stage: {powerHp?: number | null; powerRangeHp?: [number, number] | null}) { return positive(stage.powerHp) || positiveRange(stage.powerRangeHp); }
function powerInterval(stage: EstimateStage): [number, number] | undefined { return positiveRange(stage.powerRangeHp) ? stage.powerRangeHp : positive(stage.powerHp) ? [stage.powerHp, stage.powerHp] : undefined; }
type EvidenceClass = "reference" | "public" | "canonical" | "generic" | "unavailable";
function evidenceClass(stage?: EstimateStage): EvidenceClass {
  if (!stage) return "unavailable";
  if (stage.provenance === "generic-indicative") return "generic";
  if (stage.provenance === "reference" || referenceProfileIds.has(stage.sourceProfileId ?? "")) return "reference";
  if (publicProfileIds.has(stage.sourceProfileId ?? "")) return "public";
  return stage.provenance === "canonical-estimated" || stage.provenance === "reviewed" ? "canonical" : "unavailable";
}
function technicalKey(vehicle: EngineVariant) {
  return JSON.stringify([vehicle.brand, vehicle.model, vehicle.engine, vehicle.fuel, vehicle.stockPowerHp, vehicle.stockTorqueNm, vehicle.stages.map(stage => [stage.name, stage.powerHp, stage.torqueNm])]);
}

/** Synthetic catalog regression contexts, not claimed RDW facts or a random fleet survey. */
function canonicalInput(vehicle: EngineVariant): {input: EstimateMatchInput; context: string} {
  const nominal = nominalEngineDisplacements(vehicle.engine);
  const displacementCc = nominal.length === 1 ? nominal[0]
    : vehicle.brand === "BMW" && /\b(?:330d|340i|M140i)\b/i.test(vehicle.model) ? 3000 : 2000;
  const year = vehicle.years[0] ?? Number(vehicle.yearRange.slice(0, 4));
  return {
    input: {make: vehicle.brand, model: vehicle.model, fuel: vehicle.fuel, registeredPower: {value: vehicle.stockPowerHp, unit: "PS"}, displacementCc, firstRegistrationYear: year},
    context: nominal.length === 1
      ? "Synthetic source identity: model/fuel/stock power/year from this canonical row; nominal displacement from its engine label. Generated source applicability is not independently verified."
      : "Synthetic source identity with an explicit 2.0/3.0-litre test context; the coarse source label does not establish displacement. Generic fallback is acceptable and counted separately."
  };
}

// Fixed plausible family/engine combinations, selected without filtering on resolver success.
// This excludes generated badge/engine cross-products such as Golf GTI 3.0 TDI and 5 Serie 330d.
// Coarse BMW/Mercedes/Volvo labels remain in the pool: their generic outcomes must be disclosed.
const nonPublicAllowlist: Record<string, Array<string | [model: string, displacementCc: number]>> = {
  BMW: [["3 Serie 340i", 2998], ["1 Serie M140i", 2998], ["5 Serie 530d", 2993], ["3 Serie 330i", 1998]],
  Volkswagen: ["Polo 1.4 TSI", "Touran 1.6 TDI", "Tiguan 2.0 TDI", "Touran 1.4 TSI"],
  Audi: ["A5 2.0 TFSI", "Q3 2.0 TDI", "Q5 2.0 TDI", "TT 2.0 TFSI"],
  Ford: ["Fiesta 1.0 EcoBoost", "Focus 1.5 EcoBoost", "Mondeo 2.0 TDCi", "Kuga 2.0 TDCi"],
  "Mercedes-Benz": [["A Klasse 180d", 1461], ["C Klasse 200", 1991], ["E Klasse 220d", 1950], ["GLC 250d", 2143]],
  Volvo: [["V40 D3", 1969], ["V60 D4", 1969], ["V90 T4", 1969], ["XC90 T5", 1969]],
  Renault: ["Clio 0.9 TCe", "Megane 1.5 dCi", "Kadjar 1.5 dCi", "Scenic 1.5 dCi"],
  Peugeot: ["208 1.2 PureTech", "308 1.5 BlueHDi", "3008 2.0 BlueHDi", "508 2.0 BlueHDi"],
  "Citroën": ["C3 1.2 PureTech", "C4 1.6 HDi", "C5 2.0 BlueHDi", "Berlingo 1.6 HDi"],
  Opel: ["Corsa 1.4 Turbo", "Astra 1.6 CDTi", "Insignia 2.0 CDTi", "Mokka 1.4 Turbo"],
  "Land Rover": ["Freelander 2.2 TD4", "Range Rover Sport 3.0 SDV6", "Discovery 3.0 TDV6", "Defender 2.0 SD4"],
  Fiat: ["500 0.9 TwinAir", "Punto 1.3 Multijet", "Bravo 1.4 T-Jet", "Tipo 1.6 Multijet"],
  Hyundai: ["i20 1.0 T-GDi", "i30 1.6 CRDi", "Tucson 2.0 CRDi", "i30 1.6 T-GDi"],
  Kia: ["Ceed 1.0 T-GDi", "Sportage 1.6 T-GDi", "Sorento 2.2 CRDi", "Ceed 1.6 CRDi"]
};
const nonPublicFixtures: Fixture[] = brands.flatMap(brand => nonPublicAllowlist[brand].map(specification => {
  const [model, explicitDisplacement] = typeof specification === "string" ? [specification, undefined] : specification;
  const copies = vehicleDatabase.filter(vehicle => vehicle.brand === brand && vehicle.model === model && !publicIds.has(vehicle.id) && ["Petrol", "Diesel"].includes(vehicle.fuel));
  check(copies.length, `${brand} ${model}: a non-public canonical source exists`);
  // Prefer the 2018 source copy; where the model ends earlier/starts later use the nearest year.
  const source = [...copies].sort((a, b) => Math.abs((a.years[0] ?? 0) - 2018) - Math.abs((b.years[0] ?? 0) - 2018) || a.id.localeCompare(b.id))[0];
  const {input} = canonicalInput(source);
  if (explicitDisplacement) input.displacementCc = explicitDisplacement;
  return {id: `canonical:${source.id}`, group: "non-public-canonical" as const, input, sourceId: source.id,
    context: `Synthetic plausible model/engine regression identity from an explicit allowlist; source stock values remain estimated and are not independently verified factory facts. ${explicitDisplacement ? "Explicit displacement is test context for the coarse source label, not an inferred source fact." : "Displacement is nominal cc from the engine label."} Year copy nearest 2018 selected before running the resolver.`};
}));
same(nonPublicFixtures.length, 56, "Four independent technical profiles from each of fourteen brands");
same(new Set(nonPublicFixtures.map(fixture => technicalKey(sourceById.get(fixture.sourceId!) as EngineVariant))).size, 56, "Year/template duplicates do not inflate the fixture count");
check(nonPublicFixtures.every(fixture => !publicIds.has(fixture.sourceId!)), "Every canonical fixture starts from a non-public source row");
check(nonPublicFixtures.every(fixture => !/Golf GTI 3\.0 TDI|5 Serie 330d|Vito AMG|X3 125d|Z4 M340i|Clio RS 2\.0 dCi|Tucson N/.test(fixture.input.model ?? "")), "Known implausible generated cross-products never enter the normal-ICE denominator");

const curatedSpec: [string, number, number][] = [["bmw-320d-b47", 1995, 2017], ["vw-golf-20-tsi-ea888", 1984, 2017], ["volkswagen-golf-7-r-20-tsi", 1984, 2017], ["ford-focus-st-20-ecoboost", 1999, 2015]];
const curatedFixtures: Fixture[] = curatedSpec.map(([id, displacementCc, year]) => {
  const vehicle = engineCatalog.find(item => item.id === id)!;
  check(vehicle, `${id}: curated fixture exists`);
  return {id: `curated:${id}`, group: "curated", sourceId: id, input: {make: vehicle.brand, model: `${vehicle.model} ${vehicle.generation ?? ""}`, fuel: vehicle.fuel, powerHp: vehicle.stockPowerHp, displacementCc, firstRegistrationYear: year}};
});
same(liveSource.identities.map(fixture => fixture.caseId).sort(), ["OWNER-A", "OWNER-D", "OWNER-B", "OWNER-C"], "All four mandatory identities came from the live RDW evidence");
check(liveSource.identities.every(fixture => fixture.liveRetrievalSucceeded), "Live RDW retrieval succeeded for each mandatory identity");
const liveFixtures: Fixture[] = liveSource.identities.map(fixture => ({id: fixture.caseId, group: "live-owner", input: fixture.normalizedIdentity, context: `Official RDW facts retrieved ${liveSource.retrievedAt}; owner-requested acceptance case.`}));
const results: ReturnType<typeof record>[] = [];
const failures: {fixture: string; message: string}[] = [];

function record(fixture: Fixture, result: EstimateResolution, elapsedMs: number) {
  const profile = result.profile;
  const access = assessVehicleAccess(profile ?? fixture.input);
  const quoteFor = (stage?: EstimateStage) => resolveStageQuote(profile ?? {make: fixture.input.make, model: fixture.input.model}, stage, {scope: "vehicle", estimateApplicable: Boolean(profile), access});
  const quote = quoteFor(profile?.stages[0]);
  return {id: fixture.id, group: fixture.group, inputIdentity: fixture.input, sourceFixtureId: fixture.sourceId, context: fixture.context, status: result.status,
    resolutionLevel: result.resolutionLevel ?? profile?.resolutionLevel ?? null,
    selectedProfile: profile ? {id: profile.id, brand: profile.brand, model: profile.model, engine: profile.engine, provenance: profile.provenance, stockPowerHp: profile.stockPowerHp, stockTorqueNm: profile.stockTorqueNm, verificationRequired: profile.verificationRequired, conditionCodes: profile.conditionCodes, conditions: profile.conditions, sourceReferences: profile.sourceReferences, runtimeCommercialIdentity: profile.runtimeCommercialIdentity} : null,
    stages: stages.map(name => {const stage = profile?.stages.find(item => item.name === name); return {name, powerHp: stage?.powerHp ?? null, powerRangeHp: stage?.powerRangeHp ?? null, torqueNm: stage?.torqueNm ?? null, torqueRangeNm: stage?.torqueRangeNm ?? null, provenance: stage?.provenance ?? null, evidenceClass: evidenceClass(stage), resolutionLevel: stage?.resolutionLevel ?? null, sourceProfileId: stage?.sourceProfileId ?? null, genericCategory: stage?.genericCategory ?? null, genericScenario: stage?.genericScenario ?? null, notes: stage?.notes ?? [], quote: quoteFor(stage)};}),
    diagnostics: result.diagnostics,
    accessAssessment: access, quoteMode: quote.kind, quote, reasonCodes: result.reasonCodes, rejectionReason: profile ? null : result.reasonCodes.join(", "), elapsedMs: Math.round(elapsedMs * 100) / 100, responseBytes: Buffer.byteLength(JSON.stringify(result))};
}

function verifyProfile(fixture: Fixture, result: EstimateResolution, requireNumeric = true) {
  const profile = result.profile;
  if (!requireNumeric && !profile) return;
  check(profile, `${fixture.id}: supported ICE has a resolved estimate profile`);
  same(profile.verificationRequired, true, `${fixture.id}: estimates require verification`);
  check(!profile.gearbox && !profile.options.includes("gearbox"), `${fixture.id}: an RDW identity without transmission evidence cannot enable paid TCU tuning`);
  const stock = registeredPowerToMetricHp(fixture.input);
  check(stock && Math.abs(profile.stockPowerHp - Math.round(stock)) <= 1, `${fixture.id}: registered stock power stays factual`);
  same(profile.stages.map(stage => stage.name), stages, `${fixture.id}: all three stage controls resolve`);
  check(!("candidates" in result) && !("rejections" in result) && !("vehicleDatabase" in result), `${fixture.id}: no candidate arrays or full database in browser resolution DTO`);
  check(Buffer.byteLength(JSON.stringify(result)) < 24000, `${fixture.id}: one compact estimate DTO`);
  let previousPower: [number, number] | undefined;
  for (const stage of profile.stages) {
    check(hasPower(stage), `${fixture.id} ${stage.name}: useful sourced peak or finite ordered power range`);
    const torqueAvailable = positive(stage.torqueNm) || positiveRange(stage.torqueRangeNm);
    check(torqueAvailable || stage.provenance === "generic-indicative" && !profile.stockTorqueNm && stage.notes?.some(note => /no defensible stock torque source|torque.*unspecified/i.test(note)), `${fixture.id} ${stage.name}: sourced torque, labelled range, or explicit missing-torque explanation`);
    check(["reviewed", "reference", "canonical-estimated", "generic-indicative"].includes(stage.provenance ?? ""), `${fixture.id} ${stage.name}: explicit per-stage provenance`);
    same(stage.resolutionLevel, ({reference: 1, public: 2, canonical: 3, generic: 4, unavailable: undefined} as const)[evidenceClass(stage)], `${fixture.id} ${stage.name}: per-stage resolution level agrees with its actual source class`);
    const interval = powerInterval(stage);
    if (stage.provenance === "generic-indicative") {
      check(stage.powerHp === undefined, `${fixture.id} ${stage.name}: generic power is not a pseudo-exact scalar`);
      check(positiveRange(stage.powerRangeHp) && stage.powerRangeHp.every(value => value % 5 === 0), `${fixture.id} ${stage.name}: generic power bounds are rounded to 5 pk`);
      check(!previousPower || interval && interval[0] >= previousPower[0] && interval[1] >= previousPower[1], `${fixture.id} ${stage.name}: later generic power bounds never move backward`);
      previousPower = interval;
      continue;
    }
    previousPower = interval;
    const source = stage.sourceProfileId ? sourceById.get(stage.sourceProfileId) : undefined;
    check(source, `${fixture.id} ${stage.name}: non-generic output names an existing source profile`);
    const sourceStage = source.stages.find(item => item.name === stage.name);
    same([stage.powerHp, stage.torqueNm], [sourceStage?.powerHp, sourceStage?.torqueNm], `${fixture.id} ${stage.name}: published/catalog peak values are not rewritten`);
  }
  const beforeQuote = JSON.stringify(result);
  const access = assessVehicleAccess(profile);
  for (const stage of profile.stages) {
    const quote = resolveStageQuote(profile, stage, {scope: "vehicle", estimateApplicable: true, access});
    if (fixture.group !== "safety" && stage.name === "Stage 1") check(quote.kind === "from", `${fixture.id}: supported runtime Stage 1 has a scoped commercial starting budget without requiring a public ID`);
    if (fixture.group !== "safety" && stage.name !== "Stage 1") check(quote.kind === "from" || quote.reasonCode === "advanced-unlock-higher-stage-scope-unassigned", `${fixture.id} ${stage.name}: ordinary resolved runtime work has a budget; advanced higher-Stage scope remains individual`);
    if (quote.kind === "from") {
      check(quote.indicative && quote.confirmationRequired && quote.status === "draft-local-owner-review", `${fixture.id} ${stage.name}: numeric quote remains a draft requiring confirmation`);
      const budget: Record<string, number[]> = {"classic-standard-diesel": [29900, 44900, 69900], "contemporary-standard": [44900, 54900, 84900], "higher-complexity": [54900, 69900, 99900], "advanced-unlock": [70000]};
      same(quote.amountCents, budget[quote.pricingCategory]?.[stages.indexOf(stage.name)], `${fixture.id} ${stage.name}: quote follows the requested category budget`);
      check(quote.scope === "vehicle-software" || quote.scope === "advanced-unlock-package", `${fixture.id} ${stage.name}: lookup uses a vehicle or explicitly scoped unlock budget`);
    }
  }
  same(JSON.stringify(result), beforeQuote, `${fixture.id}: commercial resolution does not mutate outputs, conditions or ECU evidence`);
  same(assessVehicleAccess(profile), access, `${fixture.id}: pricing never upgrades ECU access evidence`);
}

for (const fixture of [...liveFixtures, ...curatedFixtures, ...nonPublicFixtures]) {
  const started = performance.now();
  const result = resolveRdwTuningEstimate(fixture.input);
  results.push(record(fixture, result, performance.now() - started));
  try {
    verifyProfile(fixture, result);
    if (fixture.group === "live-owner" && ["OWNER-B", "OWNER-C", "OWNER-D"].includes(fixture.id)) {
      check(result.profile?.stages.slice(1).every(hasPower), `${fixture.id}: Stage-1-only reference cannot blank Stage 2/3`);
    }
  } catch (error) {
    failures.push({fixture: fixture.id, message: error instanceof Error ? error.message : String(error)});
  }
}

const emptySources = {references: [], publicVehicles: [], canonicalVehicles: []};
function safety(id: string, input: EstimateMatchInput, sources: Parameters<typeof resolveRdwTuningEstimate>[1], inspect: (result: EstimateResolution) => void) {
  const fixture: Fixture = {id, group: "safety", input};
  const started = performance.now(); const result = resolveRdwTuningEstimate(input, sources);
  results.push(record(fixture, result, performance.now() - started));
  try {inspect(result);} catch (error) {failures.push({fixture: id, message: error instanceof Error ? error.message : String(error)});}
}
for (const badSource of [
  {model: "Golf GTI 3.0 TDI", input: {make: "Volkswagen", model: "Golf GTI", fuel: "Petrol", powerHp: 230, displacementCc: 1984, firstRegistrationYear: 2017}},
  {model: "5 Serie 330d", input: {make: "BMW", model: "530d", fuel: "Diesel", powerHp: 258, displacementCc: 2993, firstRegistrationYear: 2013}}
] satisfies Array<{model: string; input: EstimateMatchInput}>) {
  const source = vehicleDatabase.find(vehicle => vehicle.model === badSource.model)!;
  check(source, `${badSource.model}: implausible generated source exists only for the negative control`);
  safety(`implausible-source:${badSource.model}`, badSource.input, {...emptySources, canonicalVehicles: [source]}, result => {
    check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), `${badSource.model}: incompatible generated cross-product never supplies the plausible input's source peaks`);
  });
}
const connectInput = liveFixtures.find(fixture => fixture.id === "OWNER-B")!.input;
const fordTransit = vehicleDatabase.find(vehicle => vehicle.brand === "Ford" && /^Transit 1.5 TDCi$/.test(vehicle.model) && vehicle.fuel === "Diesel")!;
check(fordTransit, "A non-public generic Ford Transit 1.5 safety source exists");
safety("wrong-displacement", {...canonicalInput(fordTransit).input, displacementCc: 2198}, {...emptySources, canonicalVehicles: [fordTransit]}, result => {
  verifyProfile({id: "wrong-displacement", group: "safety", input: {...canonicalInput(fordTransit).input, displacementCc: 2198}}, result);
  check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), "Wrong displacement must never borrow the incompatible canonical engine's peaks");
});
for (const family of ["Transit Custom", "Transit Connect", "Transit Courier"]) {
  const input = {...canonicalInput(fordTransit).input, model: family};
  safety(`wrong-Ford-family:${family}`, input, {...emptySources, canonicalVehicles: [fordTransit]}, result => {
    check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), `${family}: family alone rejects generic Transit despite identical fuel, power, displacement and year`);
    same(result.profile?.model, family, "Generic estimate preserves the exact detected Ford family");
  });
}
const wrongFuelInput = {...canonicalInput(fordTransit).input, fuel: "Petrol"};
safety("wrong-fuel", wrongFuelInput, {...emptySources, canonicalVehicles: [fordTransit]}, result => {
  check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), "Petrol identity cannot borrow diesel source figures");
  same(result.profile?.fuel, "Petrol", "Generic petrol stays petrol");
});
const generationInput = {...canonicalInput(fordTransit).input, model: `${fordTransit.model} Mk3`};
safety("known-generation-conflict", generationInput, {...emptySources, canonicalVehicles: [{...fordTransit, generation: "Mk2"}]}, result => {
  check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), "Known Mk3 identity cannot borrow Mk2 source figures");
});
for (const [id, fuel] of [["hybrid", "Benzine / Elektriciteit"], ["electric", "Electric"]]) safety(id, {...connectInput, fuel}, emptySources, result => {
  same(result.status, "unavailable", `${id}: no diesel multiplier on unsupported powertrain`);
  check(!result.profile, `${id}: no misleading numerical ICE profile`);
});
safety("missing-power", {...connectInput, powerHp: null, registeredPower: null}, emptySources, result => {
  same(result.status, "unavailable", "Missing registered power is genuinely unavailable"); check(!result.profile, "Missing power must not invent a stock value");
});
const ambiguitySource = nonPublicFixtures.find(fixture => fixture.input.make === "Volkswagen")!;
const vehicle = sourceById.get(ambiguitySource.sourceId!) as EngineVariant;
const duplicate = {...vehicle, id: "runtime-synthetic-equivalent-year-copy", years: [...vehicle.years], stages: vehicle.stages.map(stage => ({...stage}))};
sourceById.set(duplicate.id, duplicate);
safety("equivalent-year-copy", ambiguitySource.input, {...emptySources, canonicalVehicles: [vehicle, duplicate]}, result => {
  same(result.resolutionLevel ?? result.profile?.resolutionLevel, 3, "Equivalent year copies collapse into one canonical output profile");
  verifyProfile({...ambiguitySource, id: "equivalent-year-copy"}, result);
});
const conflicting = {...duplicate, id: "runtime-synthetic-different-output", stages: duplicate.stages.map(stage => ({...stage, powerHp: stage.powerHp + 23, torqueNm: stage.torqueNm + 31}))};
safety("multiple-technical-profiles", ambiguitySource.input, {...emptySources, canonicalVehicles: [vehicle, conflicting]}, result => {
  same(result.resolutionLevel ?? result.profile?.resolutionLevel, 4, "Distinct technically compatible peak outputs use generic indication instead of arbitrary first-row selection");
  check(result.reasonCodes.includes("MULTIPLE_CANONICAL_TECHNICAL_PROFILES"), "Ambiguous canonical output is explained");
  check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), "Ambiguous engine outputs cannot leak through as sourced stages");
});
const genericInput: EstimateMatchInput = {make: "Unrepresented test make", model: "Test ordinary petrol", fuel: "Petrol", registeredPower: {value: 100, unit: "PS"}, displacementCc: 1598, firstRegistrationYear: 2015};
safety("generic-unknown-aspiration", genericInput, emptySources, result => {
  verifyProfile({id: "generic-unknown-aspiration", group: "safety", input: genericInput}, result);
  same(result.profile?.brand, genericInput.make, "Generic fallback keeps make"); same(result.profile?.model, genericInput.model, "Generic fallback keeps model");
  check(result.profile?.stages.every(stage => stage.provenance === "generic-indicative"), "Unknown aspiration remains explicitly generic");
  check(!result.profile?.stockTorqueNm, "No precise stock torque is invented without a source");
});

same({public: engineCatalog.length, canonical: vehicleDatabase.length, stages: vehicleDatabase.reduce((sum, vehicle) => sum + vehicle.stages.length, 0)}, beforeCounts, "Coverage resolution does not mutate catalog counts or Stage count");
same(beforeCounts, {public: 24, canonical: 58586, stages: 175758}, "Publication and canonical record counts remain unchanged");
same(sourceFingerprint(), originalSourceFingerprint, "Resolution preserves every canonical identity, source peak and Stage requirement/package item");
const normal = results.filter(result => result.group !== "safety" && ["Petrol", "Diesel"].includes(normalizeCatalogFuel(result.inputIdentity.fuel) ?? "") && registeredPowerToMetricHp(result.inputIdentity));
const numeric = normal.filter(result => result.stages.every(hasPower));
const torqueAvailable = normal.filter(result => result.stages.every(stage => positive(stage.torqueNm) || positiveRange(stage.torqueRangeNm)));
const canonicalResults = results.filter(result => result.group === "non-public-canonical");
const levels = (rows: typeof results) => Object.fromEntries([1, 2, 3, 4].map(level => [level, rows.filter(row => row.resolutionLevel === level).length]));
const percentage = (count: number) => Math.round(count / normal.length * 10000) / 100;
const perStageEvidence = stages.map((name, index) => ({name, denominator: normal.length,
  classes: Object.fromEntries((["reference", "public", "canonical", "generic", "unavailable"] as const).map(category => {
    const count = normal.filter(row => row.stages[index].evidenceClass === category).length;
    return [category, {count, percent: percentage(count)}];
  }))}));
const perStagePricing = stages.map((name, index) => {
  const quotes = normal.map(row => row.stages[index].quote);
  const numericCount = quotes.filter(quote => quote.kind === "from").length;
  return {name, denominator: normal.length, numericCount, numericPercent: percentage(numericCount), onRequestCount: quotes.length - numericCount,
    categories: Object.fromEntries(["classic-standard-diesel", "contemporary-standard", "higher-complexity", "advanced-unlock"].map(category => {
      const count = quotes.filter(quote => quote.kind === "from" && quote.pricingCategory === category).length;
      return [category, {count, percent: percentage(count)}];
    })), requestReasons: Object.fromEntries([...new Set(quotes.flatMap(quote => quote.kind === "on-request" ? [quote.reasonCode] : []))].map(reason => [reason, quotes.filter(quote => quote.kind === "on-request" && quote.reasonCode === reason).length]))};
});
same(normal.length, 64, "The existing four live, four curated and 56 non-public normal-ICE fixture base is retained");
for (const row of perStageEvidence) same(Object.values(row.classes).reduce((sum, value) => sum + value.count, 0), normal.length, `${row.name}: per-stage source coverage accounts for all 64 normal identities`);
const timings = normal.map(result => result.elapsedMs).sort((a, b) => a - b);
const summary = {fixtures: results.length, liveOwner: liveFixtures.length, curated: curatedFixtures.length, nonPublicTechnicalFixtures: nonPublicFixtures.length, nonPublicBrands: brands,
  normalIce: normal.length, allStagesNumeric: numeric.length, normalIceNumericPercent: Math.round(numeric.length / normal.length * 10000) / 100,
  allStagesTorqueNumberOrRange: torqueAvailable.length, torqueNumberOrRangePercent: Math.round(torqueAvailable.length / normal.length * 10000) / 100,
  resolverTimingMs: {median: timings[Math.floor(timings.length / 2)], p95: timings[Math.ceil(timings.length * .95) - 1], max: timings.at(-1)}, maxEstimateDtoBytes: Math.max(...normal.map(result => result.responseBytes)),
  resolutionLevels: levels(normal), nonPublicResolutionLevels: levels(canonicalResults), perStageEvidence, perStagePricing,
  unresolved: results.filter(result => !result.selectedProfile).map(result => ({id: result.id, reason: result.rejectionReason})), assertions, failures};
const reportFlag = process.argv.indexOf("--report");
if (reportFlag >= 0) {
  const destination = resolve(process.argv[reportFlag + 1] ?? "docs/tuning-qa/runtime/runtime-coverage.json");
  const report = {generatedAt: new Date().toISOString(), liveSourceRetrievedAt: liveSource.retrievedAt, selectionMethod: "Four explicit plausible model/engine combinations per requested brand, chosen without filtering for resolver success. Public source rows and obviously implausible generated badge/engine cross-products are excluded. The year copy closest to 2018 is used. BMW/Mercedes/Volvo coarse-label contexts remain to exercise honest generic fallback. These synthetic catalog regression identities are not a sampled fleet or independently verified factory specifications; four separately identified cases use actual live RDW facts.", nonPublicAllowlist, beforeCounts, summary, fixtures: results};
  mkdirSync(dirname(destination), {recursive: true}); writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    "# Runtime RDW estimate coverage", "",
    `Normal ICE fixtures with a sourced peak or a finite ordered Stage 1/2/3 power range: **${numeric.length}/${normal.length} (${summary.normalIceNumericPercent}%)**. Generic bounds use 5 pk steps and are not measured or vehicle-specific tuning targets.`, "",
    `All three Stages also have sourced torque or an explicitly estimated range for **${torqueAvailable.length}/${normal.length} (${summary.torqueNumberOrRangePercent}%)**. The remaining generic profiles explicitly explain why torque is unspecified; no precise stock torque is fabricated.`, "",
    `Non-public canonical technical fixtures: **${nonPublicFixtures.length} across ${brands.length} brands**. Source-derived synthetic identities test runtime behavior; the four live owner cases are reported separately. This is not a real-world fleet coverage percentage.`, "",
    `Resolution levels (all normal ICE): ${JSON.stringify(summary.resolutionLevels)}. Non-public fixtures: ${JSON.stringify(summary.nonPublicResolutionLevels)}. Level 4 explicitly means generic indication, not an identified canonical tune.`, "",
    "## Per-Stage evidence coverage", "",
    "The denominator is the same 64 normal-ICE fixtures for every Stage. Public and non-public canonical estimates are separated by each Stage's actual source profile ID; profile-level resolution cannot conceal generic later Stages. Publication is not independent technical verification.", "",
    "| Stage | Specific reference | Public source | Non-public canonical | Generic range | Unavailable |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...perStageEvidence.map(row => `| ${row.name} | ${["reference", "public", "canonical", "generic", "unavailable"].map(category => `${row.classes[category].count} (${row.classes[category].percent}%)`).join(" | ")} |`), "",
    "## Runtime commercial coverage", "",
    "All prices below are local draft starting budgets requiring owner/workshop confirmation. Software scope, selected options and any advanced unlock remain separate from output provenance and physical ECU evidence. Later Stages may retain an on-request commercial scope while keeping their output range available.", "",
    "| Stage | Numeric draft budget | On request | Numeric category counts (classic / contemporary / complexity / advanced) |",
    "| --- | ---: | ---: | --- |",
    ...perStagePricing.map(row => `| ${row.name} | ${row.numericCount}/${row.denominator} (${row.numericPercent}%) | ${row.onRequestCount} | ${Object.values(row.categories).map(category => category.count).join(" / ")} |`), "",
    "## Individual fixtures", "",
    "| Fixture | Level | Profile | Stage 1 pk / Nm | Stage 2 pk / Nm | Stage 3 pk / Nm | Evidence S1 / S2 / S3 | Draft budgets S1 / S2 / S3 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...results.map(result => `| ${result.id} | ${result.resolutionLevel ?? "unavailable"} | ${result.selectedProfile?.id ?? result.rejectionReason} | ${result.stages.map(stage => `${stage.powerRangeHp?.join("–") ?? stage.powerHp ?? "—"} / ${stage.torqueRangeNm?.join("–") ?? stage.torqueNm ?? "—"}`).join(" | ")} | ${result.stages.map(stage => stage.evidenceClass).join(" / ")} | ${result.stages.map(stage => stage.quote.kind === "from" ? `€${stage.quote.amountCents / 100}` : `request (${stage.quote.reasonCode})`).join(" / ")} |`), "",
    "Complete input identities, source IDs/comparisons, rejection reasons, quote objects, DTO sizes and single-process resolution timing are in the adjacent JSON report. The resolver timing excludes initial module/catalog loading and the RDW network request."
  ];
  writeFileSync(destination.replace(/\.json$/, ".md"), `${lines.join("\n")}\n`);
}
console.log(`Runtime RDW coverage: ${JSON.stringify(summary)}`);
check(summary.normalIceNumericPercent >= 95, "Overwhelming majority of normal ICE fixtures receive all three numerical stages");
same(failures, [], "Runtime fixtures pass identity, source-output and safety assertions");
