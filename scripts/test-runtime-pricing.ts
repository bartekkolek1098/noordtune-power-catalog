/* eslint-disable @typescript-eslint/no-require-imports */
// Executed by test-quote-policy.ts as part of the existing test:tuning command.
{
const assert: typeof import("node:assert/strict") = require("node:assert/strict");
const {test} = require("node:test") as typeof import("node:test");
const {resolveStageQuote, assessVehicleAccess, addQuoteOptions, formatQuote} = require("../src/data/pricing.ts") as typeof import("../src/data/pricing.ts");
const {createLookupQuoteMessage} = require("../src/lib/whatsapp.ts") as typeof import("../src/lib/whatsapp.ts");
type Identity = import("../src/data/runtime-pricing.ts").RuntimeCommercialIdentity;
type Quote = import("../src/data/pricing.ts").QuoteResolution;
const stages = [{name: "Stage 1"}, {name: "Stage 2"}, {name: "Stage 3+", hardwareScopeApproved: true}] as const;
const ordinary: Identity = {status: "resolved-generic", make: "Ford", model: "Focus", fuel: "Petrol", registeredPowerHp: 125, displacementCc: 999, firstAdmissionYear: 2018, cylinders: 3};
function profile(overrides: Partial<Identity> = {}) {
  const identity = {...ordinary, ...overrides};
  return {brand: identity.make, model: identity.model, runtimeCommercialIdentity: identity};
}
function amount(quote: Quote) {
  assert.equal(quote.kind, "from");
  if (quote.kind !== "from") throw new Error("Expected numeric draft quote");
  assert.equal(quote.status, "draft-local-owner-review");
  assert.equal(quote.indicative, true);
  assert.equal(quote.confirmationRequired, true);
  assert.equal(quote.taxBasis, "inclusive");
  return quote.amountCents;
}
function amounts(vehicle: import("../src/data/pricing.ts").QuoteVehicle) {
  return stages.map(stage => amount(resolveStageQuote(vehicle, stage, {scope: "vehicle"})));
}

test("ordinary 2010s runtime profiles receive software prices without IDs, with Stage 3 scope explicitly approved", () => {
  for (const fuel of ["Petrol", "Diesel"] as const) {
    const vehicle = profile({fuel});
    assert.deepEqual(amounts(vehicle), [39900, 54900, 79900]);
    assert.equal(assessVehicleAccess(vehicle).status, "unknown");
    const quote = resolveStageQuote(vehicle, stages[0]);
    assert.equal(quote.kind === "from" && quote.scope, "vehicle-software");
    assert.match(quote.kind === "from" ? quote.policyId : "", /^draft-runtime-v1:ordinary-2010s-commercial-scope/);
  }
});

test("classic diesel requires a listed family, year, modest output, displacement and cylinder count", () => {
  const classic: Identity = {status: "resolved-compatible", make: "Volkswagen", model: "Golf 1.9 TDI", fuel: "Diesel", registeredPowerHp: 105, displacementCc: 1896, firstAdmissionYear: 2007, cylinders: 4};
  assert.deepEqual(amounts(profile(classic)), [29900, 44900, 69900]);
  for (const exception of [{firstAdmissionYear: 2011}, {registeredPowerHp: 150}, {displacementCc: 2198}, {fuel: "Petrol" as const}, {cylinders: undefined}, {firstAdmissionYear: undefined}, {model: "Unspecified"}]) {
    assert.equal(amount(resolveStageQuote(profile({...classic, ...exception}), stages[0])), 'firstAdmissionYear' in exception && exception.firstAdmissionYear === 2011 ? 39900 : 44900);
  }
  assert.equal(assessVehicleAccess(profile(classic)).status, "unknown");
});

test("high output, larger engines, performance and listed premium/van families use complexity prices", () => {
  const cases: Partial<Identity>[] = [
    {registeredPowerHp: 250}, {displacementCc: 2993}, {cylinders: 6},
    {make: "Volkswagen", model: "Golf R"}, {make: "Mercedes-Benz", model: "A45 AMG"},
    {make: "Land Rover", model: "Defender", fuel: "Diesel", registeredPowerHp: 241, displacementCc: 1999, firstAdmissionYear: 2020, cylinders: 4},
    {make: "BMW", model: "530d", fuel: "Diesel", firstAdmissionYear: 2001},
    {make: "Ford", model: "Transit Custom", fuel: "Diesel", registeredPowerHp: 105, displacementCc: 1995, firstAdmissionYear: 2019, cylinders: 4},
    {make: "Opel", model: "Vivaro", fuel: "Diesel"}
  ];
  for (const value of cases) assert.deepEqual(amounts(profile(value)), [54900, 69900, 99900], JSON.stringify(value));
  assert.deepEqual(amounts(profile({make: "Ford", model: "Transit Connect", fuel: "Diesel", registeredPowerHp: 100, displacementCc: 1499, cylinders: 4})), [39900, 54900, 79900]);
  assert.deepEqual(amounts(profile({make: "Audi", model: "A3", fuel: "Diesel", registeredPowerHp: 110, displacementCc: 1598, cylinders: 4})), [39900, 54900, 79900]);
});

test("modern and missing-year runtime scopes use the revised modern matrix without inferring ECU access", () => {
  for (const firstAdmissionYear of [2020,2026,undefined]) {
    const vehicle=profile({firstAdmissionYear});
    assert.deepEqual(amounts(vehicle),[44900,59900,89900]);
    assert.equal(assessVehicleAccess(vehicle).status,"unknown");
  }
  assert.deepEqual(amounts(profile({firstAdmissionYear:2010})),[39900,54900,79900]);
  assert.deepEqual(amounts(profile({firstAdmissionYear:2019})),[39900,54900,79900]);
});

test("runtime Stage 3 requires approved hardware scope; a technical source alone never scopes its price", () => {
  for(const vehicle of [profile(), {...profile(), id:"vw-golf-20-tsi-ea888"}, {...profile(), id:"ref-ford-transit-connect-15-tdci-100"}]) {
    const technicalStage={name:"Stage 3+" as const,powerHp:450,torqueNm:600,provenance:"published-source"};
    const quote=resolveStageQuote(vehicle,technicalStage);
    assert.equal(quote.kind,"on-request");
    assert.equal(quote.kind === "on-request" && quote.reasonCode,"stage3-hardware-scope-unapproved");
    assert.deepEqual(addQuoteOptions(quote,14900),quote);
    assert.equal(resolveStageQuote(vehicle,{...technicalStage,hardwareScopeApproved:true}).kind,"from");
  }
});

test("reviewed public and reference assignments retain precedence over runtime category rules", () => {
  const gti = {...profile({make: "Volkswagen", model: "Golf GTI", registeredPowerHp: 230}), id: "vw-golf-20-tsi-ea888"};
  assert.deepEqual(amounts(gti), [44900, 54900, 84900]);
  const x3 = {...profile({make: "BMW", model: "X3 2.0d", fuel: "Diesel", firstAdmissionYear: 2008}), id: "bmw-x3-e83-20d"};
  assert.deepEqual(amounts(x3), [29900, 44900, 69900]);
  for (const [id, expected] of [["ref-ford-transit-connect-15-tdci-100", 44900], ["ref-ford-transit-custom-20-ecoblue-105", 54900]] as const) {
    const vehicle = {...profile(), id};
    assert.equal(amount(resolveStageQuote(vehicle, stages[0])), expected);
    assert.equal(amount(resolveStageQuote(vehicle, stages[1])), expected === 44900 ? 54900 : 69900);
    assert.equal(amount(resolveStageQuote(vehicle, stages[2])), expected === 44900 ? 84900 : 99900);
    assert.equal(resolveStageQuote({id}, stages[1]).kind, "on-request");
  }
});

test("runtime reference software fill preserves the assigned category and leaves advanced/custom scopes individual", () => {
  const connect = {...profile({make: "Ford", model: "Transit Connect", fuel: "Diesel", registeredPowerHp: 100, displacementCc: 1499}), id: "ref-ford-transit-connect-15-tdci-100"};
  const custom = {...profile({make: "Ford", model: "Transit Custom", fuel: "Diesel", registeredPowerHp: 105, displacementCc: 1995}), id: "ref-ford-transit-custom-20-ecoblue-105"};
  assert.deepEqual(amounts(connect), [44900, 54900, 84900]);
  assert.deepEqual(amounts(custom), [54900, 69900, 99900]);
  const filled = resolveStageQuote(connect, stages[1]);
  assert.match(filled.kind === "from" ? filled.policyId : "", /^draft-runtime-v1:reference-category:/);
  for (const vehicle of [connect, custom]) {
    assert.equal(resolveStageQuote({...vehicle, runtimeCommercialIdentity: undefined}, stages[1]).kind, "on-request");
    assert.equal(resolveStageQuote({...vehicle, runtimeCommercialIdentity: {...vehicle.runtimeCommercialIdentity, workScope: "custom"}}, stages[1]).kind, "on-request");
  }
  const bmw = {...profile({make: "BMW", model: "128TI", registeredPowerHp: 265, displacementCc: 1998}), id: "ref-bmw-128ti-f40-265"};
  assert.equal(amount(resolveStageQuote(bmw, stages[0])), 70000);
  assert.equal(resolveStageQuote(bmw, stages[1]).kind, "on-request");
  assert.equal(resolveStageQuote(bmw, stages[2]).kind, "on-request");
});

test("runtime BMW unlock scenarios use 700 only with explicit identity scope, never year alone", () => {
  const dated = profile({make: "BMW", model: "318i", registeredPowerHp: 156, displacementCc: 1998, firstAdmissionYear: 2025, cylinders: 4});
  assert.equal(assessVehicleAccess(dated).status, "unknown");
  assert.equal(amount(resolveStageQuote(dated, stages[0])), 44900);
  const flagged = {...dated, generation: "G20"};
  const quote = resolveStageQuote(flagged, stages[0]);
  assert.equal(amount(quote), 70000);
  assert.equal(quote.kind === "from" && quote.scope, "advanced-unlock-package");
  assert.equal(resolveStageQuote(flagged, stages[1]).kind, "on-request");
  const confirmedStandard = {status: "confirmed-standard" as const, evidence: {applicability: "identified-vehicle" as const, reference: "synthetic-workshop-case", identifiedEcu: "identified-test-ecu"}};
  assert.equal(amount(resolveStageQuote(flagged, stages[0], {access: confirmedStandard})), 44900);
  assert.equal(resolveStageQuote(dated, stages[0], {access: {...confirmedStandard, status: "confirmed-unlock-required"}}).kind, "on-request");
});

test("rejected, unrecognized, custom and malformed identities cannot acquire a default quote", () => {
  assert.equal(resolveStageQuote({make: "Ford", model: "Focus"}, stages[0], {estimateApplicable: true}).kind, "on-request");
  assert.equal(resolveStageQuote(profile(), stages[0], {identityConflict: true}).kind, "on-request");
  assert.equal(resolveStageQuote(profile(), stages[0], {estimateApplicable: false}).kind, "on-request");
  assert.equal(resolveStageQuote(profile({workScope: "custom"}), stages[0]).kind, "on-request");
  for (const invalid of [{status: "rejected"}, {fuel: "Hybrid"}, {registeredPowerHp: 0}, {registeredPowerHp: Number.NaN}, {make: ""}, {model: ""}, {displacementCc: -1}, {firstAdmissionYear: 2020.5}]) {
    assert.equal(resolveStageQuote(profile(invalid as Partial<Identity>), stages[0]).kind, "on-request");
  }
});

test("pricing ignores technical provenance and outputs and leaves the input and ECU state unchanged", () => {
  const input = {...profile(), engine: "1.0 petrol", stockPowerHp: 125, stages: [{name: "Stage 2", powerRangeHp: [145, 160]}], ecuSupport: {status: "manual-review", family: undefined}, provenance: "generic-indicative"};
  const before = JSON.stringify(input);
  const quote = resolveStageQuote(input, stages[1]);
  const changedTechnicalEstimates = {...input, provenance: "canonical-estimated", stockPowerHp: 900, stages: [{name: "Stage 2", powerRangeHp: [999, 1999]}]};
  assert.deepEqual(resolveStageQuote(changedTechnicalEstimates, stages[1]), quote);
  assert.equal(JSON.stringify(input), before);
  assert.equal(assessVehicleAccess(input).status, "unknown");
});

test("runtime options and WhatsApp preserve the same rounded output range and indicative price", () => {
  const vehicle = profile();
  const base = resolveStageQuote(vehicle, stages[1]);
  const quote = addQuoteOptions(base, 14900);
  assert.equal(amount(base), 54900);
  assert.equal(amount(quote), 69800);
  for (const locale of ["nl", "en", "pl"] as const) {
    const message = createLookupQuoteMessage({locale, plate: "SYNTHETIC-RUNTIME", vehicle: "FORD FOCUS", firstAdmission: "2018-06-12", registeredPower: {value: 92, unit: "kW"}, displacementCc: 999,
      stage: "Stage 2", indicativeOutput: {powerRangeHp: [145, 160]}, estimateSource: "generic-indicative", options: ["Selected existing service"], quote, access: assessVehicleAccess(vehicle)});
    assert.ok(message.includes("145–160"));
    assert.ok(message.includes(formatQuote(quote, locale)));
    for (const fact of ["SYNTHETIC-RUNTIME", "FORD FOCUS", "2018", "92 kW", "999 cc", "Stage 2", "Selected existing service"]) assert.ok(message.includes(fact), fact);
    assert.ok(!message.includes("269"));
  }
});
}
