/* eslint-disable @typescript-eslint/no-require-imports */
// Node's existing TypeScript runtime executes these behavior regressions without dependencies.
{
const assert: typeof import("node:assert/strict") = require("node:assert/strict");
const {test} = require("node:test") as typeof import("node:test");
const pricing = require("../src/data/pricing.ts") as typeof import("../src/data/pricing");
const messages = require("../src/lib/whatsapp.ts") as typeof import("../src/lib/whatsapp");
const catalog = require("../src/data/catalog.ts") as typeof import("../src/data/catalog");
const stage1 = {name: "Stage 1" as const};
const stage2 = {name: "Stage 2" as const};
const stage3 = {name: "Stage 3+" as const};
const golfGti = {id: "vw-golf-20-tsi-ea888", brand: "Volkswagen", model: "Golf GTI"};
const bmw128ti = {id: "ref-bmw-128ti-f40-265", brand: "BMW", model: "128TI", generation: "F40"};
const unknownAccess = {status: "unknown" as const, reasonCode: "not-identified"};
const standardAccess = {status: "confirmed-standard" as const,
  evidence: {applicability: "identified-vehicle" as const, reference: "synthetic-workshop-fixture", identifiedEcu: "synthetic-ecu"}};
function amount(quote: import("../src/data/pricing").QuoteResolution) {
  assert.equal(quote.kind, "from");
  if (quote.kind !== "from") throw new Error("Expected scoped numeric draft estimate");
  return quote.amountCents;
}

test("all 24 public profiles retain three numeric software estimates despite verification flags", () => {
  assert.equal(catalog.engineCatalog.length, 24);
  for (const vehicle of catalog.engineCatalog) {
    for (const stage of vehicle.stages) {
      const quote = pricing.resolveStageQuote(vehicle, stage, {access: unknownAccess});
      assert.ok(amount(quote) >= 29900, `${vehicle.id} ${stage.name}`);
      assert.ok(stage.powerHp > 0 && stage.torqueNm > 0);
      if (quote.kind === "from") {
        assert.equal(quote.status, "draft-local-owner-review");
        assert.equal(quote.indicative, true);
        assert.equal(quote.taxBasis, "inclusive");
        assert.equal(quote.scope, "family-software");
      }
    }
  }
});

test("explicit categories assign 299, 449, 549 and 700 without legacy source prices", () => {
  assert.equal(amount(pricing.resolveStageQuote({id: "bmw-x3-e83-20d"}, stage1)), 29900);
  assert.equal(amount(pricing.resolveStageQuote(golfGti, {...stage1, price: 269} as typeof stage1)), 44900);
  assert.equal(amount(pricing.resolveStageQuote({id: "volkswagen-golf-7-r-20-tsi"}, stage1)), 54900);
  assert.equal(amount(pricing.resolveStageQuote(bmw128ti, stage1)), 70000);
  assert.equal(pricing.assessVehicleAccess(golfGti).status, "unknown");
});

test("legacy/generated provenance and no exact match do not invalidate an explicitly applicable profile", () => {
  const vehicle = {id: "volkswagen-golf-7-r-20-tsi", publicationSource: "canonical-publication" as const};
  for (const matchStatus of ["no-match", "ambiguous", "conflict"] as const) {
    assert.equal(amount(pricing.resolveStageQuote(vehicle, stage1, {matchStatus, configurationReviewed: false, estimateApplicable: true})), 54900);
  }
});

test("actual incompatible identity and unavailable profiles remain unquoted", () => {
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {identityConflict: true}).kind, "on-request");
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {estimateApplicable: false}).kind, "on-request");
});

test("an unrecognized object never receives runtime pricing merely from age or fuel", () => {
  const vehicle = {id: "synthetic-old-diesel", make: "Ford", model: "Transit", firstAdmissionYear: 2001};
  assert.equal(pricing.resolveStageQuote(vehicle, stage1, {access: unknownAccess}).kind, "on-request");
  assert.equal(pricing.getPublicStagePrice(vehicle, {...stage1, price: 269}), undefined);
});

test("public estimate DTO vehicleId and known canonical alias resolve the same explicit scenario", () => {
  const direct = pricing.resolveStageQuote({id: "volkswagen-golf-7-r-20-tsi"}, stage1);
  assert.deepEqual(pricing.resolveStageQuote({id: "estimate-public-golf-r", vehicleId: "volkswagen-golf-7-r-20-tsi"}, stage1), direct);
  assert.deepEqual(pricing.resolveStageQuote({id: "volkswagen-golf-r-2-0-tsi-r-2017"}, stage1), direct);
});

test("reviewed commercial bridge preserves assignment and access scope across a new technical source ID", () => {
  const technical={id:"sourced-bmw-synthetic",pricingProfileId:"bmw-320d-b47",brand:"BMW",model:"320d"};
  assert.equal(amount(pricing.resolveStageQuote(technical,stage1,{scope:"family"})),44900);
  assert.equal(amount(pricing.resolveStageQuote(technical,stage1,{scope:"vehicle"})),70000);
  assert.equal(pricing.assessVehicleAccess(technical).status,"possible-unlock-review");
  assert.equal(amount(pricing.resolveStageQuote({id:"sourced-ford-synthetic",pricingProfileId:"ref-ford-transit-connect-15-tdci-100"},stage1)),44900);
  assert.equal(pricing.resolveStageQuote(technical,{...stage3,customHardware:true}).kind,"on-request");
});

test("BMW 320d family starting estimate and plate-specific unlock scenario preserve separate scope", () => {
  const vehicle = {id: "bmw-320d-b47"};
  const family = pricing.resolveStageQuote(vehicle, stage1);
  const plate = pricing.resolveStageQuote(vehicle, stage1, {scope: "vehicle"});
  assert.equal(amount(family), 44900);
  assert.equal(amount(plate), 70000);
  if (family.kind === "from" && plate.kind === "from") {
    assert.equal(family.scope, "family-software");
    assert.equal(plate.scope, "advanced-unlock-package");
  }
  assert.match(pricing.formatQuoteScope(family, "en")!, /least expensive applicable configuration/);
  assert.match(pricing.formatQuoteScope(plate, "en")!, /advanced ECU-unlock scenario/);
});

test("unknown ECU does not remove an applicable contemporary plate estimate", () => {
  assert.equal(amount(pricing.resolveStageQuote(golfGti, stage1, {scope: "vehicle", access: unknownAccess})), 44900);
});

test("BMW reference has a prominent 700 package budget with conditional scope", () => {
  const quote = pricing.resolveStageQuote(bmw128ti, stage1);
  assert.equal(amount(quote), 70000);
  assert.match(pricing.conditionalBudgetNote(quote, "en")!, /does not confirm a locked ECU/);
  assert.equal(pricing.assessVehicleAccess(bmw128ti).status, "possible-unlock-review");
});

test("Ford reference prices explicitly follow the correct model-engine profile", () => {
  assert.equal(amount(pricing.resolveStageQuote({id: "ref-ford-transit-custom-20-ecoblue-105"}, stage1)), 54900);
  assert.equal(amount(pricing.resolveStageQuote({id: "ref-ford-transit-connect-15-tdci-100"}, stage1)), 44900);
});

test("reference Stage 2 and 3 remain individually unscoped without suppressing Stage 1", () => {
  for (const id of ["ref-bmw-128ti-f40-265", "ref-ford-transit-custom-20-ecoblue-105", "ref-ford-transit-connect-15-tdci-100"]) {
    assert.ok(amount(pricing.resolveStageQuote({id}, stage1)) > 0);
    assert.equal(pricing.resolveStageQuote({id}, stage2).kind, "on-request");
    assert.equal(pricing.resolveStageQuote({id}, stage3).kind, "on-request");
  }
});

test("every public higher Stage is at least as expensive and explicitly excludes extra hardware", () => {
  for (const vehicle of catalog.engineCatalog) {
    const one = amount(pricing.resolveStageQuote(vehicle, stage1));
    const two = amount(pricing.resolveStageQuote(vehicle, stage2));
    const three = amount(pricing.resolveStageQuote(vehicle, stage3));
    assert.ok(one <= two && two <= three, vehicle.id);
    assert.match(pricing.formatQuoteScope(pricing.resolveStageQuote(vehicle, stage2), "en")!, /required hardware.*assessed separately/);
  }
});

test("confirmed BMW unlock uses 700 scoped budget; unassigned unlock work never falls to 299", () => {
  const access = {...standardAccess, status: "confirmed-unlock-required" as const};
  assert.equal(amount(pricing.resolveStageQuote({id: "bmw-320d-b47"}, stage1, {access})), 70000);
  assert.equal(pricing.resolveStageQuote({id: "bmw-x3-e83-20d"}, stage1, {access}).kind, "on-request");
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {access}).kind, "on-request");
  assert.equal(pricing.resolveStageQuote({id: "bmw-320d-b47"}, stage2, {access}).kind, "on-request");
});

test("registration date alone does not diagnose access or create a commercial scenario", () => {
  const vehicle = {id: "synthetic-registration-only", make: "BMW", model: "3 Series", firstAdmissionYear: 2025};
  assert.equal(pricing.assessVehicleAccess(vehicle).status, "unknown");
  assert.equal(pricing.resolveStageQuote(vehicle, stage1).kind, "on-request");
});

test("invalid claims of confirmed access need evidence; valid standard identification retains estimates", () => {
  const invalid = {status: "confirmed-standard"} as import("../src/data/pricing").AccessAssessment;
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {access: invalid}).kind, "on-request");
  assert.equal(amount(pricing.resolveStageQuote({id: "bmw-320d-b47"}, stage1, {access: standardAccess, scope: "vehicle"})), 44900);
});

test("selected paid options add once to the 700 package and preserve scope", () => {
  const base = pricing.resolveStageQuote(bmw128ti, stage1);
  const total = pricing.addQuoteOptions(base, 14900);
  assert.equal(amount(total), 84900);
  assert.equal(total.kind === "from" && total.scope, "advanced-unlock-package");
  const request = pricing.resolveStageQuote(bmw128ti, stage2);
  assert.deepEqual(pricing.addQuoteOptions(request, 14900), request);
});

test("custom hardware remains on request before any public, reference or approved hardware override", () => {
  for (const vehicle of [golfGti, bmw128ti, {id:"bmw-x3-e83-20d"}]) {
    for (const scope of ["family","vehicle"] as const) {
      for (const stage of [stage1,stage2,stage3]) {
        const quote=pricing.resolveStageQuote(vehicle,{...stage,customHardware:true,hardwareScopeApproved:true},{scope});
        assert.equal(quote.kind,"on-request");
        assert.equal(quote.kind === "on-request" && quote.reasonCode,"custom-hardware-scope-unassigned");
      }
    }
  }
});

test("integer-cent arithmetic preserves fractional values and rejects invalid totals", () => {
  const quote = pricing.addQuoteOptions(pricing.resolveStageQuote(golfGti, stage1), 101);
  assert.equal(amount(quote), 45001);
  assert.match(pricing.formatQuote(quote, "nl"), /450,01/);
  for (const cents of [-1, 0.1, Number.NaN, Number.MAX_SAFE_INTEGER]) assert.throws(() => pricing.addQuoteOptions(quote, cents), RangeError);
});

test("WhatsApp agrees with detected facts, profile output, selected Stage/options and scoped budget", () => {
  const quote = pricing.addQuoteOptions(pricing.resolveStageQuote(bmw128ti, stage1), 14900);
  const input = {plate: "SYNTHETIC-A", vehicle: "BMW 128TI", fuel: "Petrol", firstAdmission: "2022-09-14",
    displacementCc: 1998, registeredPower: {value: 195, unit: "kW"}, engine: "2.0 turbo petrol",
    estimateProfileLabel: "BMW 128ti F40 Stage 1 reference", indicativeOutput: {powerHp: 300, torqueNm: 450},
    matchStatus: "conflict" as const, access: pricing.assessVehicleAccess(bmw128ti), quote, stage: "Stage 1", options: ["Pops & Bangs"]};
  for (const locale of ["nl", "en", "pl"] as const) {
    const message = messages.createLookupQuoteMessage({...input, locale});
    for (const expected of [/BMW 128TI/, /1998 cc/, /195 kW/, /2022/, /300/, /450 Nm/, /849/, /Pops & Bangs/]) assert.match(message, expected);
    assert.doesNotMatch(message, /configuratieconflict|configuration conflict|konflikt konfiguracji|269|\b320d\b/);
  }
  assert.match(messages.createLookupQuoteMessage({...input, locale: "nl"}), /Catalogusindicatie — ECU-controle vóór uitvoering/);
});

test("unavailable Stage 2 retains selected options and on-request wording", () => {
  const message = messages.createLookupQuoteMessage({locale: "nl", plate: "SYNTHETIC-B", vehicle: "BMW 128TI",
    quote: pricing.addQuoteOptions(pricing.resolveStageQuote(bmw128ti, stage2), 14900), stage: "Stage 2", options: ["Pops & Bangs"]});
  assert.match(message, /Prijs: op aanvraag/);
  assert.match(message, /Pops & Bangs/);
  assert.doesNotMatch(message, /149|€0/);
});

test("invalid first admission remains unavailable without replacing it with a supplied year", () => {
  const message = messages.createLookupQuoteMessage({locale: "nl", plate: "SYNTHETIC-C", vehicle: "Synthetic",
    firstAdmission: "2023-02-29", firstAdmissionYear: 2023, quote: pricing.resolveStageQuote(undefined, stage1), stage: "Stage 1", options: []});
  assert.match(message, /Eerste toelating: Niet beschikbaar/);
  assert.doesNotMatch(message, /2023/);
});
}

require("./test-runtime-pricing.ts");
