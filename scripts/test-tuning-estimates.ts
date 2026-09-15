import assert from "node:assert/strict";
import {engineCatalog, vehicleDatabaseCount, searchVehicleSelectorItems, getModelsForBrand, getYearsForModel, getVehicleSelectorItems, getReferenceSelectorEstimate, getVehicleById} from "../src/data/catalog.ts";
import {getCatalogEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {resolveTuningEstimate, tuningReferenceProfiles, type EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";

let passed = 0;
function test(name: string, run: () => void) { run(); passed++; console.log(`PASS ${name}`); }
const publicCount = engineCatalog.length;
const canonicalCount = vehicleDatabaseCount;
const bmw: EstimateMatchInput = {make: "BMW", model: "128TI", fuel: "Benzine", displacementCc: 1998, registeredPower: {value: 195, unit: "kW"}, firstRegistrationDate: "2022-09-14", type: "F1H", variant: "7L51", cylinders: 4};
const custom: EstimateMatchInput = {make: "FORD", model: "TRANSIT CUSTOM", fuel: "Diesel", displacementCc: 1995, registeredPower: {value: 77, unit: "kW"}, firstRegistrationDate: "2019-04-29", type: "FCC", variant: "YLF61ABX"};
const connect: EstimateMatchInput = {make: "FORD", model: "TRANSIT CONNECT", fuel: "Diesel", displacementCc: 1499, registeredPower: {value: 73.5, unit: "kW"}, firstRegistrationDate: "2018-10-17", type: "PU2", variant: "Z2GA1BFX"};

test("all 24 public configurations retain numeric stock and all 72 Stage results", () => {
  assert.equal(engineCatalog.length, 24);
  let stages = 0;
  for (const vehicle of engineCatalog) {
    const profile = getCatalogEstimateProfile(vehicle);
    assert.equal(profile.id, vehicle.id);
    assert.equal(profile.vehicleId, vehicle.id);
    assert.ok(profile.stockPowerHp > 0 && profile.stockTorqueNm! > 0, vehicle.id);
    assert.equal(profile.stages.length, 3, vehicle.id);
    for (const stage of profile.stages) {
      assert.ok(stage.powerHp! > profile.stockPowerHp, `${vehicle.id}: ${stage.name}`);
      assert.ok(stage.torqueNm! > profile.stockTorqueNm!, `${vehicle.id}: ${stage.name}`);
      assert.ok(stage.requirements.length > 0);
      assert.ok(stage.packageItems.length > 0);
      stages++;
    }
    assert.deepEqual(profile.options, vehicle.options);
    assert.deepEqual(profile.serviceCompatibility, vehicle.serviceCompatibility);
    assert.deepEqual(profile.recommendedPackage, vehicle.recommendedPackage);
  }
  assert.equal(stages, 72);
});
test("estimated provenance, verification flags and unknown ECU never erase public numbers", () => {
  for (const vehicle of engineCatalog) {
    const profile = getCatalogEstimateProfile({...vehicle, confidenceLevel: "estimated", verificationRequired: true, ecuSupport: {status: "manual-review"}, transmissionSupport: {status: "manual-review"}});
    assert.equal(profile.stages[0].powerHp, vehicle.stages[0].powerHp);
    assert.equal(profile.stages[0].torqueNm, vehicle.stages[0].torqueNm);
    assert.equal(profile.verificationRequired, true);
    assert.notEqual(profile.ecuSupport?.status, "verified");
  }
});
test("all 24 public profiles resolve through identity validation with compatible vehicle facts", () => {
  const capacities: Record<string, number> = {
    "vw-golf-20-tsi-ea888": 1984, "bmw-320d-b47": 1995, "audi-a3-20-tdi": 1968,
    "mercedes-a45-amg-m133": 1991, "bmw-x3-e83-20d": 1995, "volvo-xc60-d5": 2400,
    "ford-focus-st-20-ecoboost": 1999, "bmw-1-series-f20-f21-118i": 1499,
    "bmw-1-series-f20-f21-118d": 1995, "bmw-1-series-f20-f21-120d": 1995,
    "bmw-3-series-f30-f31-318d": 1995, "bmw-3-series-f30-f31-330d": 2993,
    "bmw-5-series-f10-f11-520d": 1995, "bmw-3-series-g20-g21-320i": 1998,
    "volkswagen-golf-7-16-tdi": 1598, "volkswagen-golf-7-20-tdi": 1968,
    "volkswagen-golf-7-r-20-tsi": 1984, "volkswagen-passat-b8-20-tdi": 1968,
    "audi-a3-8v-16-tdi": 1598, "audi-a4-b9-20-tdi-190": 1968, "audi-a4-b9-20-tfsi": 1984,
    "audi-a6-c7-30-tdi-272": 2967, "skoda-octavia-5e-20-tdi-150": 1968,
    "seat-leon-cupra-5f-20-tsi-300": 1984
  };
  for (const vehicle of engineCatalog) {
    const result = resolveTuningEstimate({
      make: vehicle.brand, model: vehicle.model, fuel: vehicle.fuel,
      displacementCc: capacities[vehicle.id], powerHp: vehicle.stockPowerHp,
      firstRegistrationYear: vehicle.years[Math.floor(vehicle.years.length / 2)], type: vehicle.generation
    }, engineCatalog);
    assert.notEqual(result.status, "unavailable", `${vehicle.id}: ${result.reasonCodes.join(", ")}`);
    assert.equal(result.profile?.vehicleId, vehicle.id, vehicle.id);
    assert.equal(result.profile?.stages.filter((stage) => stage.powerHp && stage.torqueNm).length, 3, vehicle.id);
  }
});
test("BMW 320d / GTI / Golf R / manual Focus resolve useful existing peak estimates", () => {
  const examples: [EstimateMatchInput, string, number, number][] = [
    [{make: "BMW", model: "320D", fuel: "Diesel", displacementCc: 1995, powerHp: 190, firstRegistrationYear: 2017}, "bmw-320d-b47", 225, 470],
    [{make: "Volkswagen", model: "Golf GTI", fuel: "Petrol", displacementCc: 1984, powerHp: 230, firstRegistrationYear: 2017}, "vw-golf-20-tsi-ea888", 300, 450],
    [{make: "Volkswagen", model: "Golf R", fuel: "Petrol", displacementCc: 1984, powerHp: 300, firstRegistrationYear: 2017}, "volkswagen-golf-7-r-20-tsi", 365, 480],
    [{make: "Ford", model: "Focus ST", fuel: "Petrol", displacementCc: 1999, powerHp: 250, firstRegistrationYear: 2015}, "ford-focus-st-20-ecoboost", 285, 430]
  ];
  for (const [input, id, hp, nm] of examples) {
    const result = resolveTuningEstimate(input, engineCatalog);
    assert.notEqual(result.status, "unavailable", id);
    assert.equal(result.profile?.vehicleId, id);
    assert.equal(result.profile?.stages[0].powerHp, hp);
    assert.equal(result.profile?.stages[0].torqueNm, nm);
    if (id.startsWith("ford-focus")) {
      assert.equal(result.profile?.gearbox, "Manual");
      assert.equal(result.profile?.serviceCompatibility?.gearbox.status, "not-applicable");
    }
  }
});
test("BMW 128ti uses manufacturer stock and RON98 tuner Stage 1 reference", () => {
  const result = resolveTuningEstimate(bmw, engineCatalog);
  assert.equal(result.status, "applicable");
  assert.equal(result.profile?.id, "ref-bmw-128ti-f40-265");
  assert.equal(result.profile?.stockPowerHp, 265);
  assert.equal(result.profile?.stockTorqueNm, 400);
  assert.equal(result.profile?.stages[0].powerHp, 310);
  assert.equal(result.profile?.stages[0].torqueNm, 480);
  assert.match(result.profile!.stages[0].requirements, /RON98/);
  assert.equal(result.profile?.vehicleId, undefined);
  assert.equal(result.profile?.provenance, "tuner-reference");
});
test("an on-request higher-stage commercial scope retains applicable BMW 320d output", () => {
  const estimate = resolveTuningEstimate({make: "BMW", model: "320D", fuel: "Diesel", displacementCc: 1995, powerHp: 190, firstRegistrationYear: 2017}, engineCatalog);
  const stage = estimate.profile!.stages[1];
  const quote = resolveStageQuote(estimate.profile, stage, {scope: "vehicle"});
  assert.equal(quote.kind, "on-request");
  assert.equal(stage.powerHp, 245);
  assert.equal(stage.torqueNm, 520);
  assert.notEqual(estimate.status, "unavailable");
});
test("Transit Custom 1995 cc / 77 kW yields its own 190 pk / 440 Nm reference", () => {
  const result = resolveTuningEstimate(custom, engineCatalog);
  assert.notEqual(result.status, "unavailable");
  assert.equal(result.profile?.id, "ref-ford-transit-custom-20-ecoblue-105");
  assert.equal(result.profile?.stockTorqueNm, 360);
  assert.equal(result.profile?.stages[0].powerHp, 190);
  assert.equal(result.profile?.stages[0].torqueNm, 440);
  assert.match(result.profile!.engine, /2\.0 EcoBlue/);
  assert.doesNotMatch(result.profile!.engine, /1\.5|1\.6|2\.2/);
});
test("2018 Connect is explicitly conditional TDCi reference, never inferred EcoBlue", () => {
  const result = resolveTuningEstimate(connect, engineCatalog);
  assert.equal(result.status, "conditional");
  assert.equal(result.profile?.id, "ref-ford-transit-connect-15-tdci-100");
  assert.equal(result.profile?.stockTorqueNm, 250);
  assert.equal(result.profile?.stages[0].powerHp, 125);
  assert.equal(result.profile?.stages[0].torqueNm, 330);
  assert.ok(result.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));
  assert.match(result.profile!.stages[0].requirements, /pre-facelift.*not an EcoBlue/i);
});
test("first-registration year and opaque variant do not resolve Connect engine generation", () => {
  for (const firstRegistrationYear of [2017, 2018, 2019]) {
    const result = resolveTuningEstimate({...connect, firstRegistrationDate: undefined, firstRegistrationYear}, engineCatalog);
    assert.equal(result.status, "conditional");
    assert.ok(result.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));
  }
  const documented = resolveTuningEstimate({...connect, firstRegistrationDate: "2017-05-01", engineGenerationEvidence: {family: "tdci-pre-facelift", sourceReference: "Synthetic engine inspection record"}}, engineCatalog);
  assert.equal(documented.status, "applicable");
  assert.ok(!documented.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));
});
test("explicit Connect EcoBlue evidence never borrows the TDCi result", () => {
  for (const input of [
    {...connect, model: "TRANSIT CONNECT ECOBLUE"},
    {...connect, engineGenerationEvidence: {family: "ecoblue" as const, sourceReference: "Synthetic engine identification"}}
  ]) {
    const result = resolveTuningEstimate(input, engineCatalog);
    assert.equal(result.status, "unavailable");
    assert.equal(result.profile, undefined);
    assert.ok(result.reasonCodes.includes("CONNECT_ECOBLUE_REFERENCE_UNAVAILABLE"));
  }
});
test("new profiles have no invented Stage 2/3 peaks and unknown transmission enables no TCU option", () => {
  for (const profile of tuningReferenceProfiles) {
    for (const stage of profile.stages.slice(1)) {
      assert.equal(stage.powerHp, undefined);
      assert.equal(stage.torqueNm, undefined);
    }
    assert.equal(profile.gearbox, undefined);
    assert.equal(profile.options.includes("gearbox"), false);
    assert.equal(profile.recommendedPackage?.recommendedOptionIds?.length, 0);
  }
});
test("reference services preserve existing fuel eligibility and expose individual catalog limitations", () => {
  const petrol = tuningReferenceProfiles.find((profile) => profile.id === "ref-bmw-128ti-f40-265")!;
  for (const option of ["dpf", "adblue", "scr", "gearbox"]) assert.equal(petrol.options.includes(option), false, option);
  const diesel = tuningReferenceProfiles.find((profile) => profile.id === "ref-ford-transit-custom-20-ecoblue-105")!;
  for (const option of ["pops", "launch", "gearbox"]) assert.equal(diesel.options.includes(option), false, option);
  const torqueIssue = getCatalogEstimateProfile(engineCatalog.find((vehicle) => vehicle.id === "bmw-3-series-g20-g21-320i")!);
  assert.ok(torqueIssue.conditionCodes?.includes("SOURCE_STOCK_TORQUE_DISCREPANCY"));
  assert.equal(torqueIssue.stockTorqueNm, 270);
  assert.ok(torqueIssue.conditions.some((condition) => condition.includes("300 Nm")));
  const displacementIssue = getCatalogEstimateProfile(engineCatalog.find((vehicle) => vehicle.id === "bmw-1-series-f20-f21-118i")!);
  assert.ok(displacementIssue.conditionCodes?.includes("ENGINE_DISPLACEMENT_SCOPE_1499"));
  assert.ok(displacementIssue.conditions.some((condition) => condition.includes("1499 cc") && condition.includes("1598 cc")));
});
test("wrong Ford family, displacement, fuel, stock output and established generation remain rejected", () => {
  for (const input of [
    {...custom, model: "TRANSIT"}, {...custom, model: "TOURNEO CUSTOM"},
    {...custom, displacementCc: 1499}, {...custom, displacementCc: 1598}, {...custom, displacementCc: 2198},
    {...custom, fuel: "Petrol"}, {...custom, registeredPower: {value: 100, unit: "kW" as const}},
    {...custom, model: "TRANSIT CUSTOM MK2"}, {...connect, displacementCc: 1598},
    {...bmw, model: "128TI F70"}, {...bmw, displacementCc: 1499}
  ]) {
    const result = resolveTuningEstimate(input, engineCatalog);
    assert.equal(result.status, "unavailable", JSON.stringify(input));
    assert.equal(result.profile, undefined);
  }
});
test("missing critical identity and unrepresented fuel cannot select an output profile", () => {
  for (const input of [{...bmw, displacementCc: undefined}, {...bmw, registeredPower: undefined}, {...bmw, fuel: "Benzine / LPG"}, {...bmw, model: undefined}]) {
    assert.equal(resolveTuningEstimate(input, engineCatalog).status, "unavailable");
  }
  assert.notEqual(resolveTuningEstimate({...bmw, firstRegistrationDate: undefined}, engineCatalog).status, "unavailable");
});
test("equivalent source copies collapse while different outputs remain ambiguous", () => {
  const golf = engineCatalog.find((vehicle) => vehicle.id === "vw-golf-20-tsi-ea888")!;
  const input = {make: "Volkswagen", model: "Golf GTI", fuel: "Petrol", displacementCc: 1984, powerHp: 230, firstRegistrationYear: 2017};
  assert.equal(resolveTuningEstimate(input, [golf, {...golf, id: "synthetic-copy"}]).status, "applicable");
  const different = {...golf, id: "synthetic-other-output", stages: golf.stages.map((stage) => ({...stage, powerHp: stage.powerHp + 10}))};
  assert.equal(resolveTuningEstimate(input, [golf, different]).status, "unavailable");
});
test("same-power earlier 118i 1598 cc does not inherit 2016-source 1499 cc profile", () => {
  const result = resolveTuningEstimate({make: "BMW", model: "118i", fuel: "Petrol", displacementCc: 1598, powerHp: 136, firstRegistrationYear: 2015}, engineCatalog);
  assert.equal(result.status, "unavailable");
});
test("reference layer does not publish vehicles or alter canonical record count", () => {
  assert.equal(engineCatalog.length, publicCount);
  assert.equal(vehicleDatabaseCount, canonicalCount);
  assert.equal(tuningReferenceProfiles.length, 3);
  assert.ok(tuningReferenceProfiles.every((profile) => !engineCatalog.some((vehicle) => vehicle.id === profile.id)));
});
test("all three references are manually searchable and selectable with identical scoped profile/quote", () => {
  for (const [query, id, brand, model, year, amount] of [
    ["BMW 128ti", "ref-bmw-128ti-f40-265", "BMW", "128ti", 2022, 70000],
    ["Transit Custom", "ref-ford-transit-custom-20-ecoblue-105", "Ford", "Transit Custom", 2019, 54900],
    ["Transit Connect", "ref-ford-transit-connect-15-tdci-100", "Ford", "Transit Connect", 2018, 44900]
  ] as const) {
    const search = searchVehicleSelectorItems(query);
    assert.equal(search.length, 1, query);
    assert.equal(search[0].kind, "reference");
    assert.equal(search[0].id, id);
    assert.ok(getModelsForBrand(brand).includes(model));
    assert.ok(getYearsForModel(brand, model).includes(year));
    assert.equal(getVehicleSelectorItems({brand, model, year})[0].id, id);
    const selected = getReferenceSelectorEstimate(id)!;
    assert.equal(selected.profile?.id, id);
    assert.equal(selected.profile?.stages[0].powerHp, tuningReferenceProfiles.find((profile) => profile.id === id)?.stages[0].powerHp);
    assert.deepEqual(search[0].quote, resolveStageQuote(selected.profile, selected.profile?.stages[0], {scope: "vehicle"}));
    assert.equal(search[0].quote.kind === "from" ? search[0].quote.amountCents : undefined, amount);
    assert.equal(getVehicleById(id), undefined);
    if (model === "Transit Connect") assert.ok(selected.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));
  }
  assert.equal(getReferenceSelectorEstimate("synthetic-unknown-id"), undefined);
  assert.equal(searchVehicleSelectorItems("Transit Connect", 0).length, 0);
});
test("manual reference search respects stock-power and generation qualifiers", () => {
  for (const [query, id] of [
    ["Ford Transit Custom 105", "ref-ford-transit-custom-20-ecoblue-105"],
    ["Ford Transit Connect 100", "ref-ford-transit-connect-15-tdci-100"],
    ["BMW 128ti F40 265", "ref-bmw-128ti-f40-265"]
  ]) {
    const results = searchVehicleSelectorItems(query);
    assert.equal(results.length, 1, query);
    assert.equal(results[0].kind, "reference");
    assert.equal(results[0].id, id);
  }
  assert.equal(searchVehicleSelectorItems("Ford Transit Custom 130").some((item) => item.id === "ref-ford-transit-custom-20-ecoblue-105"), false);
  assert.equal(searchVehicleSelectorItems("Ford Transit Connect 120").some((item) => item.id === "ref-ford-transit-connect-15-tdci-100"), false);
  assert.equal(searchVehicleSelectorItems("BMW 128ti F70 265").some((item) => item.id === "ref-bmw-128ti-f40-265"), false);
});
console.log(`${passed} executable tuning-estimate regressions passed; 24/24 public profiles retain all 72 numeric Stages.`);
