import assert from "node:assert/strict";
import {assessCatalogMatch, nominalDisplacementMatches, registeredPowerToMetricHp} from "../src/data/catalog-matching.ts";
import {engineCatalog, findCatalogMatch} from "../src/data/catalog.ts";
type Candidate = import("../src/data/catalog-matching").CatalogCandidate;
type Input = import("../src/data/catalog-matching").CatalogMatchInput;

let passed = 0;
function test(name: string, run: () => void) {
  run();
  passed++;
  console.log(`PASS ${name}`);
}
const source = engineCatalog.find((vehicle) => vehicle.id === "ford-focus-st-20-ecoboost")!;
function candidate(id: string, overrides: Partial<Candidate["variant"]> = {}, applicability: Candidate["applicability"] = "reviewed"): Candidate {
  return {variant: {...source, id, model: "Transit", engine: "2.0 EcoBlue", fuel: "Diesel", stockPowerHp: 105, generation: "", years: [2016, 2017, 2018, 2019, 2020], ...overrides}, applicability};
}
const complete: Input = {make: "Ford", model: "Transit", fuel: "Diesel", registeredPower: {value: 77, unit: "kW"}, displacementCc: 1995, firstRegistrationYear: 2019};

test("nominal displacement rules distinguish 1.5, 1.6, 2.0 and 2.2", () => {
  assert.equal(nominalDisplacementMatches(1995, 2000), true);
  for (const cc of [1500, 1600, 2200]) assert.equal(nominalDisplacementMatches(1995, cc), false);
  assert.equal(nominalDisplacementMatches(1499, 1600), false);
});
test("known manufacturer/family/fuel/displacement conflicts reject before selection", () => {
  const cases: [Partial<Candidate["variant"]>, string][] = [
    [{brand: "BMW"}, "MANUFACTURER_CONFLICT"], [{model: "Transit Connect"}, "MODEL_FAMILY_CONFLICT"],
    [{fuel: "Petrol"}, "FUEL_CONFLICT"], [{engine: "1.6 TDCi"}, "DISPLACEMENT_CONFLICT"]
  ];
  for (const [overrides, code] of cases) {
    const result = assessCatalogMatch(complete, [candidate("synthetic-conflict", overrides)]);
    assert.equal(result.variant, undefined);
    assert.ok(result.reasonCodes.includes(code as never) || result.rejections.some((item) => item.reasonCodes.includes(code as never)) || code === "MANUFACTURER_CONFLICT");
  }
});
test("Ford Transit, Custom, Connect, Courier and Tourneo stay distinct", () => {
  const families = ["Transit", "Transit Custom", "Transit Connect", "Transit Courier", "Tourneo", "Tourneo Custom", "Tourneo Connect", "Tourneo Courier"];
  for (const model of families) {
    const result = assessCatalogMatch({...complete, model}, families.map((name, index) => candidate(`synthetic-family-${index}`, {model: name})));
    assert.equal(result.status, "catalog-match");
    assert.equal(result.variant?.model, model);
  }
});
test("equal power cannot bypass a displacement conflict", () => {
  const result = assessCatalogMatch(complete, [candidate("synthetic-wrong-capacity", {engine: "1.5 TDCi"})]);
  assert.equal(result.status, "conflict");
  assert.ok(result.reasonCodes.includes("DISPLACEMENT_CONFLICT"));
});
test("registered units normalize consistently with rounding only", () => {
  assert.ok(Math.abs(registeredPowerToMetricHp({registeredPower: {value: 195, unit: "kW"}})! - 265.126) < 0.01);
  assert.ok(Math.abs(registeredPowerToMetricHp({registeredPower: {value: 100, unit: "hp"}})! - 101.387) < 0.01);
  assert.equal(registeredPowerToMetricHp({registeredPower: {value: 100, unit: "PS"}}), 100);
  assert.equal(assessCatalogMatch(complete, [candidate("synthetic-rounded")]).status, "catalog-match");
  assert.equal(assessCatalogMatch(complete, [candidate("synthetic-output", {stockPowerHp: 120})]).status, "conflict");
});
test("petrol-electric input never matches petrol-only powertrain", () => {
  const result = assessCatalogMatch({...complete, fuel: "Benzine, Elektriciteit"}, [candidate("synthetic-petrol", {fuel: "Petrol"})]);
  assert.equal(result.status, "conflict");
  assert.ok(result.reasonCodes.includes("FUEL_CONFLICT"));
});
test("gas, hydrogen and contradictory combustion fuels require review", () => {
  for (const fuel of ["Benzine / LPG", "Benzine / CNG", "Benzine / LNG", "Benzine / Waterstof", "Benzine / Diesel"]) {
    const result = findCatalogMatch({make: "Volkswagen", model: "Golf GTI", fuel, displacementCc: 1984, registeredPower: {value: 169, unit: "kW"}, firstRegistrationYear: 2016});
    assert.equal(result.status, "ambiguous", fuel);
    assert.equal(result.variant, undefined, fuel);
    assert.ok(result.reasonCodes.includes("UNKNOWN_FUEL"), fuel);
  }
});
test("missing displacement/year/power remain reviewable", () => {
  for (const field of ["displacementCc", "firstRegistrationYear", "registeredPower"] as const) {
    const result = assessCatalogMatch({...complete, [field]: undefined}, [candidate("synthetic-incomplete")]);
    assert.equal(result.status, "ambiguous");
    assert.equal(result.variant, undefined);
  }
});
test("equivalent duplicates collapse; different configurations never tie-break into certainty", () => {
  const first = candidate("synthetic-duplicate-a");
  const second = candidate("synthetic-duplicate-b");
  const equivalent = assessCatalogMatch(complete, [second, first]);
  assert.equal(equivalent.status, "catalog-match");
  assert.equal(equivalent.candidateCount, 1);
  assert.ok(equivalent.reasonCodes.includes("EQUIVALENT_DUPLICATES_COLLAPSED"));
  const distinct = assessCatalogMatch(complete, [first, candidate("synthetic-different-gearbox", {gearbox: "TCU"})]);
  assert.equal(distinct.status, "ambiguous");
  assert.ok(distinct.reasonCodes.includes("MULTIPLE_CONFIGURATIONS"));
});
test("delayed first registration does not select a later generation", () => {
  const result = assessCatalogMatch({...complete, firstRegistrationYear: 2020}, [
    candidate("synthetic-old", {generation: "Mk2", years: [2016, 2017, 2018, 2019]}),
    candidate("synthetic-new", {generation: "Mk3", years: [2020, 2021, 2022]})
  ]);
  assert.equal(result.status, "ambiguous");
  assert.ok(result.reasonCodes.includes("MULTIPLE_CONFIGURATIONS"));
  assert.ok(result.reasonCodes.includes("REGISTRATION_OUTSIDE_CATALOG_PERIOD"));
});
test("explicit generation and registry metadata reject known contradictions", () => {
  const generation = assessCatalogMatch({...complete, model: "Transit Mk3"}, [candidate("synthetic-generation", {generation: "Mk2"})]);
  assert.equal(generation.status, "conflict");
  assert.ok(generation.reasonCodes.includes("GENERATION_CONFLICT"));
  const registry = assessCatalogMatch({...complete, type: "TYPE-B", variant: "VAR-B", execution: "EXEC-B", cylinders: 6}, [{
    ...candidate("synthetic-registry"), registryTypes: ["TYPE-A"], registryVariants: ["VAR-A"], registryExecutions: ["EXEC-A"], cylinders: 4
  }]);
  for (const code of ["REGISTRY_TYPE_CONFLICT", "REGISTRY_VARIANT_CONFLICT", "REGISTRY_EXECUTION_CONFLICT", "CYLINDER_CONFLICT"] as const) assert.ok(registry.reasonCodes.includes(code));
});
test("agreeing generated fields do not establish reviewed applicability", () => {
  const result = assessCatalogMatch(complete, [candidate("synthetic-generated", {}, "generated")]);
  assert.equal(result.status, "ambiguous");
  assert.ok(result.reasonCodes.includes("GENERATED_APPLICABILITY_UNREVIEWED"));
  assert.equal(result.variant, undefined);
});
test("generated annual equivalents collapse without claiming a probability", () => {
  const result = assessCatalogMatch(complete, [2017, 2018, 2019].map((year) => candidate(`synthetic-generated-${year}`, {years: [year], version: String(year)}, "generated")));
  assert.equal(result.status, "ambiguous");
  assert.equal(result.candidateCount, 1);
  assert.equal("confidence" in result, false);
});

// Minimal deterministic fixtures sanitized from official RDW retrieval on 2026-09-15T09:52:43Z.
// Provenance: RDW m9d7-ebf2 (registry facts), 8ys7-d773 (fuel / net maximum power).
// Identifiers are synthetic; no production exception is keyed by a registration plate.
const registryFixtures: {id: string; input: Input; expected: string}[] = [
  {id: "synthetic-bmw-performance", expected: "conflict", input: {make: "BMW", model: "128TI", fuel: "Benzine", displacementCc: 1998, registeredPower: {value: 195, unit: "kW"}, firstRegistrationDate: "2022-09-14", cylinders: 4, type: "F1H", variant: "7L51"}},
  {id: "synthetic-commercial-custom", expected: "conflict", input: {make: "FORD", model: "TRANSIT CUSTOM", fuel: "Diesel", displacementCc: 1995, registeredPower: {value: 77, unit: "kW"}, firstRegistrationDate: "2019-04-29", type: "FCC", variant: "YLF61ABX"}},
  {id: "synthetic-commercial-connect", expected: "no-match", input: {make: "FORD", model: "TRANSIT CONNECT", fuel: "Diesel", displacementCc: 1499, registeredPower: {value: 73.5, unit: "kW"}, firstRegistrationDate: "2018-10-17", type: "PU2", variant: "Z2GA1BFX"}}
];
for (const fixture of registryFixtures) test(`official sanitized regression ${fixture.id}`, () => {
  const result = findCatalogMatch(fixture.input);
  assert.equal(result.status, fixture.expected);
  assert.equal(result.variant, undefined);
  assert.ok(result.candidates.length <= 8);
  assert.ok(result.rejections.length <= 16);
});
test("representative curated BMW, Golf GTI and manual Focus select correct public IDs", () => {
  const examples: [Input, string][] = [
    [{make: "BMW", model: "320d", fuel: "Diesel", displacementCc: 1995, powerHp: 190, firstRegistrationYear: 2017}, "bmw-320d-b47"],
    [{make: "Volkswagen", model: "Golf GTI", fuel: "Petrol", displacementCc: 1984, powerHp: 230, firstRegistrationYear: 2017}, "vw-golf-20-tsi-ea888"],
    [{make: "Ford", model: "Focus ST", fuel: "Petrol", displacementCc: 1999, powerHp: 250, firstRegistrationYear: 2015}, "ford-focus-st-20-ecoboost"]
  ];
  for (const [input, id] of examples) {
    const result = findCatalogMatch(input);
    assert.equal(result.status, "catalog-match");
    assert.equal(result.variant?.id, id);
  }
});
test("Golf R generation boundary retains correct public candidate without claiming exact match", () => {
  const result = findCatalogMatch({make: "Volkswagen", model: "Golf R", fuel: "Petrol", displacementCc: 1984, powerHp: 300, firstRegistrationYear: 2017});
  assert.equal(result.status, "ambiguous");
  assert.ok(result.candidates.some((candidate) => candidate.id === "volkswagen-golf-7-r-20-tsi"));
  assert.equal(result.variant, undefined);
});
console.log(`${passed} executable matcher regressions passed.`);

export {};
