import assert from "node:assert/strict";
import {engineCatalog, vehicleDatabase} from "../src/data/catalog.ts";
import {serviceOptions, type EngineVariant} from "../src/data/catalog-shared.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {getCatalogEstimateProfile, type TuningEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {resolveRdwTuningEstimate, type RuntimeEstimateSources} from "../src/lib/rdw-tuning-estimate.ts";
import {isVehicleServiceSelectable} from "../src/lib/vehicle-services.ts";

let passed = 0;
function test(name: string, run: () => void) { run(); passed++; console.log(`PASS ${name}`); }
const empty: RuntimeEstimateSources = {references: [], publicVehicles: [], canonicalVehicles: []};
const identity: EstimateMatchInput = {make: "Ford", model: "Focus", fuel: "Petrol", displacementCc: 999, powerHp: 125, firstRegistrationYear: 2018};
function candidate(overrides: Partial<EngineVariant> = {}): EngineVariant {
  return {id: "synthetic-focus", brand: "Ford", model: "Focus 1.0 EcoBoost", engine: "1.0 EcoBoost", version: "Mk3", generation: "Mk3", fuel: "Petrol", years: [2014, 2015, 2016, 2017, 2018], yearRange: "2014–2018", stockPowerHp: 125, stockTorqueNm: 200, ecuType: "Unverified family label", options: [], image: "", tags: [],
    stages: [{name: "Stage 1", powerHp: 155, torqueNm: 240, price: 1, requirements: "Software", packageItems: []}, {name: "Stage 2", powerHp: 180, torqueNm: 270, price: 1, requirements: "Hardware", packageItems: []}, {name: "Stage 3+", powerHp: 215, torqueNm: 310, price: 1, requirements: "Custom hardware", packageItems: []}], ...overrides};
}
function onlyStage1(vehicle: EngineVariant): TuningEstimateProfile {
  const profile = getCatalogEstimateProfile(vehicle);
  return {...profile, vehicleId: undefined, provenance: "tuner-reference", stages: [profile.stages[0]], sourceReferences: [{title: "Synthetic test reference", sourceType: "tuner", scope: "Only the synthetic test engine."}]};
}

test("non-public canonical profile resolves all Stages without SEO or confirmed ECU", () => {
  const result = resolveRdwTuningEstimate(identity, {...empty, canonicalVehicles: [candidate()]});
  assert.equal(result.resolutionLevel, 3);
  assert.equal(result.status, "conditional");
  assert.deepEqual(result.profile?.stages.map((stage) => [stage.powerHp, stage.torqueNm, stage.provenance]), [[155, 240, "canonical-estimated"], [180, 270, "canonical-estimated"], [215, 310, "canonical-estimated"]]);
  assert.equal(result.profile?.vehicleId, undefined);
  assert.equal(result.profile?.ecuSupport?.status, "manual-review");
  assert.equal(result.profile?.ecuType, "To be identified");
});
test("public RDW estimates preserve power but never infer installed DSG or TCU eligibility", () => {
  const source = engineCatalog.find((vehicle) => vehicle.id === "vw-golf-20-tsi-ea888")!;
  const before = JSON.stringify(source);
  const gearboxOption = serviceOptions.find((option) => option.id === "gearbox")!;
  const result = resolveRdwTuningEstimate({make: "Volkswagen", model: "Golf GTI", fuel: "Petrol", displacementCc: 1984, powerHp: 230, firstRegistrationYear: 2016});
  assert.equal(result.resolutionLevel, 2);
  assert.deepEqual(result.profile?.stages.map((stage) => [stage.powerHp, stage.torqueNm]), source.stages.map((stage) => [stage.powerHp, stage.torqueNm]));
  assert.equal(result.profile?.gearbox, undefined);
  assert.equal(result.profile?.transmissionSupport?.status, "manual-review");
  assert.equal(result.profile?.tcuSupport?.status, "manual-review");
  assert.equal(result.profile?.serviceCompatibility?.gearbox.status, "manual-review");
  assert.equal(isVehicleServiceSelectable(result.profile!, gearboxOption), false);
  assert.equal(result.profile?.options.includes("gearbox"), false);
  assert.ok(result.profile?.stages.every((stage) => stage.tcuRecommended === false));
  assert.equal(result.profile?.recommendedPackage?.recommendedOptionIds?.includes("gearbox") ?? false, false);
  assert.equal(JSON.stringify(source), before);
  assert.equal(getCatalogEstimateProfile(source).gearbox, "DSG");
  assert.equal(isVehicleServiceSelectable(getCatalogEstimateProfile(source), gearboxOption), true);
});
test("every runtime hierarchy level removes inherited gearbox services without transmission evidence", () => {
  const vehicle = candidate({gearbox: "ZF", options: ["gearbox", "immo"], serviceCompatibility: {gearbox: {status: "supported"}}, recommendedPackage: {stage: "Stage 1", recommendedOptionIds: ["gearbox", "immo"]}});
  const configurations: [RuntimeEstimateSources, number][] = [
    [{...empty, references: [onlyStage1(vehicle)]}, 1],
    [{...empty, publicVehicles: [vehicle]}, 2],
    [{...empty, canonicalVehicles: [vehicle]}, 3],
    [empty, 4]
  ];
  for (const [sources, level] of configurations) {
    const result = resolveRdwTuningEstimate(identity, sources);
    assert.equal(result.resolutionLevel, level);
    assert.equal(result.profile?.gearbox, undefined);
    assert.equal(result.profile?.options.includes("gearbox"), false);
    assert.equal(result.profile?.tcuSupport?.status, "manual-review");
    assert.equal(result.profile?.transmissionSupport?.status, "manual-review");
    assert.ok(result.profile?.stages.every((stage) => stage.powerHp! > 0));
  }
});
test("technical year/template duplicates collapse without choosing conflicting output", () => {
  const copies = [2016, 2017, 2018].map((year) => candidate({id: `copy-${year}`, years: [year], yearRange: String(year), version: `${year} EcoBoost`}));
  const result = resolveRdwTuningEstimate(identity, {...empty, canonicalVehicles: copies});
  assert.equal(result.resolutionLevel, 3);
  assert.ok(result.reasonCodes.includes("EQUIVALENT_CANONICAL_DUPLICATES_COLLAPSED"));
  assert.equal(result.profile?.stages[0].powerHp, 155);
  const reverse = resolveRdwTuningEstimate(identity, {...empty, canonicalVehicles: [...copies].reverse()});
  assert.deepEqual(reverse, result);
});
test("materially different canonical outputs fall back instead of selecting first", () => {
  const alternative = candidate({id: "other-output", stages: candidate().stages.map((stage) => ({...stage, powerHp: stage.powerHp + 20}))});
  const result = resolveRdwTuningEstimate(identity, {...empty, canonicalVehicles: [candidate(), alternative]});
  assert.equal(result.resolutionLevel, 4);
  assert.ok(result.reasonCodes.includes("MULTIPLE_CANONICAL_TECHNICAL_PROFILES"));
  assert.ok(result.profile?.stages.every((stage) => stage.provenance === "generic-indicative" && stage.powerHp! > 0));
  assert.equal(result.profile?.stockTorqueNm, undefined);
  assert.equal(result.profile?.model, identity.model);
});
test("Stage-1-only reference independently uses compatible canonical later Stages", () => {
  const reference = onlyStage1(candidate({id: "synthetic-reference"}));
  reference.stages[0].powerHp = 160;
  const result = resolveRdwTuningEstimate(identity, {...empty, references: [reference], canonicalVehicles: [candidate()]});
  assert.equal(result.resolutionLevel, 1);
  assert.deepEqual(result.profile?.stages.map((stage) => [stage.powerHp, stage.provenance]), [[160, "reference"], [180, "canonical-estimated"], [215, "canonical-estimated"]]);
});
test("each missing canonical Stage uses generic fallback without hiding other Stages", () => {
  const vehicle = candidate({stages: candidate().stages.filter((stage) => stage.name !== "Stage 2")});
  const result = resolveRdwTuningEstimate(identity, {...empty, canonicalVehicles: [vehicle]});
  assert.equal(result.profile?.stages[0].powerHp, 155);
  assert.equal(result.profile?.stages[1].provenance, "generic-indicative");
  assert.equal(result.profile?.stages[2].powerHp, 215);
});
test("generic later Stages use compatible previous output floor", () => {
  const profile = onlyStage1(candidate({id: "synthetic-reference"}));
  profile.stages[0].powerHp = 200;
  const result = resolveRdwTuningEstimate(identity, {...empty, references: [profile]});
  const stages = result.profile!.stages;
  assert.ok(stages[1].powerHp! > 200);
  assert.ok(stages[2].powerHp! > stages[1].powerHp!);
  assert.equal(stages[1].torqueNm, undefined);
  assert.ok(stages[1].torqueRangeNm);
});
test("hard displacement, fuel, model-family, power and generation mismatches never supply source values", () => {
  for (const overrides of [
    {engine: "1.6 EcoBoost"}, {fuel: "Diesel" as const}, {model: "Transit Connect 1.0 EcoBoost"},
    {stockPowerHp: 150}, {generation: "Mk4", version: "Mk4"}
  ]) {
    const result = resolveRdwTuningEstimate({...identity, type: "Mk3"}, {...empty, canonicalVehicles: [candidate(overrides)]});
    assert.equal(result.resolutionLevel, 4, JSON.stringify(overrides));
    assert.ok(result.profile?.stages.every((stage) => stage.provenance === "generic-indicative"));
    assert.equal(result.profile?.model, "Focus");
  }
});
test("reference and lower canonical Stage generation conflicts are rejected", () => {
  const reference = onlyStage1(candidate({id: "synthetic-reference"}));
  const result = resolveRdwTuningEstimate(identity, {...empty, references: [reference], canonicalVehicles: [candidate({generation: "Mk4", version: "Mk4"})]});
  assert.equal(result.profile?.stages[0].provenance, "reference");
  assert.equal(result.profile?.stages[1].provenance, "generic-indicative");
});
test("Ford van families stay isolated through fallback", () => {
  const input = {...identity, model: "Transit Custom", displacementCc: 1995, fuel: "Diesel", powerHp: 105};
  for (const model of ["Transit", "Transit Connect", "Transit Courier"]) {
    const vehicle = candidate({model, engine: "2.0 EcoBlue", fuel: "Diesel", stockPowerHp: 105});
    const result = resolveRdwTuningEstimate(input, {...empty, canonicalVehicles: [vehicle]});
    assert.equal(result.resolutionLevel, 4);
    assert.equal(result.profile?.model, "Transit Custom");
  }
});
test("unknown aspiration has conservative generic power and no invented stock/Stage torque", () => {
  const result = resolveRdwTuningEstimate({...identity, model: "Unlisted compact"}, empty);
  assert.equal(result.resolutionLevel, 4);
  assert.equal(result.profile?.stockPowerHp, 125);
  assert.equal(result.profile?.stockTorqueNm, undefined);
  assert.deepEqual(result.profile?.stages.map((stage) => stage.powerHp), [128, 130, 133]);
  assert.ok(result.profile?.stages.every((stage) => stage.genericCategory === "unknown-aspiration" && stage.torqueNm === undefined && stage.torqueRangeNm === undefined));
});
test("explicit turbo diesel and naturally aspirated evidence choose distinct tables", () => {
  const diesel = resolveRdwTuningEstimate({...identity, model: "Unlisted TDI", fuel: "Diesel"}, empty);
  const natural = resolveRdwTuningEstimate({...identity, model: "Unlisted naturally aspirated"}, empty);
  assert.equal(diesel.profile?.stages[0].genericCategory, "turbo-diesel");
  assert.equal(natural.profile?.stages[0].genericCategory, "naturally-aspirated");
  assert.ok(diesel.profile!.stages[0].powerHp! > natural.profile!.stages[0].powerHp!);
});
test("hybrid, EV, gas conversion and missing/invalid power remain explicitly unsupported", () => {
  for (const fuel of ["Benzine / Elektriciteit", "Hybrid", "Electric", "Benzine / LPG", "Benzine / Diesel"]) {
    const result = resolveRdwTuningEstimate({...identity, fuel}, empty);
    assert.equal(result.status, "unavailable", fuel);
    assert.equal(result.profile, undefined);
  }
  for (const powerHp of [undefined, 0, -1, Number.NaN]) {
    const result = resolveRdwTuningEstimate({...identity, powerHp}, empty);
    assert.equal(result.status, "unavailable");
    assert.ok(result.reasonCodes.includes("MISSING_OR_INVALID_REGISTERED_POWER"));
  }
});
test("actual registered-unit conversion remains factual in wholly generic profiles", () => {
  const result = resolveRdwTuningEstimate({...identity, model: "Unlisted", powerHp: undefined, registeredPower: {value: 100, unit: "kW"}}, empty);
  assert.equal(result.profile?.stockPowerHp, Math.round(100 / 0.73549875));
  assert.equal(result.profile?.model, "Unlisted");
  assert.match(result.profile!.engine, /999 cc/);
});
test("known EcoBlue evidence cannot receive a TDCi reference", () => {
  const result = resolveRdwTuningEstimate({make: "Ford", model: "Transit Connect", fuel: "Diesel", displacementCc: 1499, powerHp: 100, firstRegistrationYear: 2018, engineGenerationEvidence: {family: "ecoblue", sourceReference: "Synthetic workshop identification"}});
  assert.notEqual(result.profile?.id, "ref-ford-transit-connect-15-tdci-100");
  assert.ok(result.profile?.stages.every((stage) => stage.sourceProfileId !== "ref-ford-transit-connect-15-tdci-100"));
});
test("conditional Connect comparison and BMW/Custom references retain useful independent later Stages", () => {
  const cases: EstimateMatchInput[] = [
    {make: "Ford", model: "Transit Connect", fuel: "Diesel", displacementCc: 1499, powerHp: 100, firstRegistrationYear: 2018},
    {make: "Ford", model: "Transit Custom", fuel: "Diesel", displacementCc: 1995, powerHp: 105, firstRegistrationYear: 2019},
    {make: "BMW", model: "128ti", fuel: "Petrol", displacementCc: 1998, powerHp: 265, firstRegistrationYear: 2022}
  ];
  for (const input of cases) {
    const result = resolveRdwTuningEstimate(input);
    assert.equal(result.resolutionLevel, 1);
    assert.equal(result.status, "conditional");
    const stages = result.profile!.stages;
    assert.equal(stages[0].provenance, "reference");
    assert.ok(stages.slice(1).every((stage) => stage.provenance === "generic-indicative" && stage.powerHp! > 0 && stage.torqueNm === undefined && stage.torqueRangeNm));
    assert.ok(stages[1].powerHp! > (stages[0].powerRangeHp?.[1] ?? stages[0].powerHp!));
    assert.ok(stages[2].powerHp! > stages[1].powerHp!);
    if (input.model === "Transit Connect") {
      assert.deepEqual(stages[0].powerRangeHp, [125, 140]);
      assert.deepEqual(stages[0].torqueRangeNm, [330, 340]);
      assert.equal(stages[0].powerHp, 125);
      assert.ok(result.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));
      assert.notEqual(stages[1].powerHp, 135, "EU5-only source is not silently applied to unidentified vehicle");
    }
    if (input.make === "BMW") assert.equal(stages[1].genericCategory, "turbo-petrol");
  }
});
test("live Defender technical facts expose non-public canonical coverage", () => {
  const result = resolveRdwTuningEstimate({make: "LAND ROVER", model: "DEFENDER", fuel: "Diesel", displacementCc: 1999, registeredPower: {value: 177, unit: "kW"}, firstRegistrationDate: "2020-06-12", type: "LE", variant: "HCBBC0", execution: "50AC010", cylinders: 4});
  assert.equal(result.resolutionLevel, 3);
  assert.match(result.profile!.id, /^land-rover-defender-2-0-sd4-/);
  assert.equal(result.profile?.vehicleId, undefined);
  assert.deepEqual(result.profile?.stages.map((stage) => [stage.powerHp, stage.torqueNm]), [[290, 590], [320, 660], [365, 740]]);
});
test("all public profiles and canonical dataset remain unchanged after runtime resolution", () => {
  const before = JSON.stringify([engineCatalog, vehicleDatabase]);
  resolveRdwTuningEstimate(identity);
  assert.equal(JSON.stringify([engineCatalog, vehicleDatabase]), before);
  assert.equal(engineCatalog.length, 24);
  assert.equal(vehicleDatabase.length, 58586);
  assert.equal(vehicleDatabase.reduce((count, vehicle) => count + vehicle.stages.length, 0), 175758);
});
test("compact resolver result contains one profile, no candidates or full catalog", () => {
  const result = resolveRdwTuningEstimate(identity);
  assert.deepEqual(Object.keys(result).sort(), ["status", "resolutionLevel", "profile", "reasonCodes", "diagnostics"].sort());
  assert.ok(Object.values(result.diagnostics!).every((value) => Number.isInteger(value)));
  assert.ok(JSON.stringify(result).length < 15000);
  assert.equal(result.profile?.stages.length, 3);
});
console.log(`\n${passed} runtime resolver tests passed.`);
