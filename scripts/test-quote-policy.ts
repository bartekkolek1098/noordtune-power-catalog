/* eslint-disable @typescript-eslint/no-require-imports */
// Run with Node's existing TypeScript support; no test dependency is required.
{
const assert: typeof import("node:assert/strict") = require("node:assert/strict");
const {test} = require("node:test") as typeof import("node:test");
const pricing = require("../src/data/pricing.ts") as typeof import("../src/data/pricing");
const messages = require("../src/lib/whatsapp.ts") as typeof import("../src/lib/whatsapp");

const stage1 = {name: "Stage 1" as const};
const stage2 = {name: "Stage 2" as const};
const stage3 = {name: "Stage 3+" as const};
const golfGti = {id: "vw-golf-20-tsi-ea888", brand: "Volkswagen", model: "Golf GTI"};
const bmw128ti = {id: "synthetic-unmapped-hatch", make: "BMW", model: "128TI"};
const unknownAccess = {status: "unknown" as const, reasonCode: "not-identified"};
const standardAccess = {
  status: "confirmed-standard" as const,
  evidence: {applicability: "identified-vehicle" as const, reference: "synthetic-workshop-fixture", identifiedEcu: "synthetic-ecu"}
};

test("reviewed approved configuration uses VAT-inclusive assigned price, not source price", () => {
  const sourceStage = {...stage1, price: 1, sourcePrice: 2};
  const quote = pricing.resolveStageQuote(golfGti, sourceStage, {access: standardAccess});
  assert.equal(quote.kind, "from");
  if (quote.kind !== "from") throw new Error("Expected approved quote");
  assert.equal(quote.amountCents, 34900);
  assert.equal(quote.taxBasis, "inclusive");
  assert.equal(quote.confirmationRequired, true);
  assert.match(quote.policyId, /stage1-advanced$/);
});

test("an approved quote is not evidence of physical access", () => {
  assert.equal(pricing.resolveStageQuote(golfGti, stage1).kind, "from");
  assert.equal(pricing.assessVehicleAccess(golfGti).status, "unknown");
});

test("no-match, ambiguity and conflict outrank a curated assignment", () => {
  for (const matchStatus of ["no-match", "ambiguous", "conflict"] as const) {
    assert.equal(pricing.resolveStageQuote(golfGti, stage1, {matchStatus}).kind, "on-request");
  }
});

test("unknown, unmapped and old diesel configurations never inherit a legacy price", () => {
  const oldDiesel = {id: "synthetic-old-diesel", make: "Ford", model: "Transit", firstAdmissionYear: 2001};
  for (const vehicle of [undefined, {id: "synthetic-unmapped"}, oldDiesel]) {
    assert.equal(pricing.resolveStageQuote(vehicle, stage1, {access: unknownAccess}).kind, "on-request");
  }
  assert.equal(pricing.getPublicStagePrice(oldDiesel, {...stage1, price: 269, sourcePrice: 269}), undefined);
});

test("unreviewed generated published configurations retain their route but cannot quote assigned tiers", () => {
  for (const id of ["volkswagen-golf-7-r-20-tsi", "audi-a3-8v-16-tdi", "seat-leon-cupra-5f-20-tsi-300"]) {
    for (const stage of [stage1, stage2, stage3]) {
      assert.equal(pricing.resolveStageQuote({id}, stage).kind, "on-request");
    }
  }
});

test("a canonical alias is discovery data unless applicability is independently reviewed", () => {
  const alias = {id: "volkswagen-golf-r-2-0-tsi-r-2017"};
  assert.equal(pricing.resolvePublicPricingVehicleId(alias.id), "volkswagen-golf-7-r-20-tsi");
  assert.equal(pricing.resolveStageQuote(alias, stage1).kind, "on-request");
  assert.equal(pricing.resolveStageQuote(alias, stage1, {configurationReviewed: true, access: standardAccess}).kind, "from");
});

test("reviewed false outranks a valid explicit assignment", () => {
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {configurationReviewed: false}).kind, "on-request");
});

test("BMW identity requests ECU review and conditional Stage 1 budget without a lock claim", () => {
  const access = pricing.assessVehicleAccess(bmw128ti);
  assert.equal(access.status, "possible-unlock-review");
  const quote = pricing.resolveStageQuote(bmw128ti, stage1, {matchStatus: "no-match", access});
  assert.equal(quote.kind, "on-request");
  if (quote.kind !== "on-request") throw new Error("Expected review");
  assert.equal(quote.conditionalBudgetFromCents, 70000);
  assert.equal("amountCents" in quote, false);
  assert.match(pricing.conditionalBudgetNote(quote, "en")!, /^If ECU unlocking is required/);
  assert.match(pricing.formatAccessAssessment(access, "en"), /unconfirmed/);
});

test("registration date alone is not access evidence", () => {
  const lateRegisteredOldCar = {id: "synthetic-registration-only", make: "BMW", model: "3 Series", firstAdmissionYear: 2025};
  assert.equal(pricing.assessVehicleAccess(lateRegisteredOldCar).status, "unknown");
  const quote = pricing.resolveStageQuote(lateRegisteredOldCar, stage1);
  assert.equal(quote.kind, "on-request");
  assert.equal("conditionalBudgetFromCents" in quote, false);
});

test("unknown context cannot suppress an identity-specific BMW access review", () => {
  assert.equal(pricing.resolveStageQuote({id: "bmw-320d-b47"}, stage1, {access: unknownAccess}).kind, "on-request");
});

test("Stage 2 and 3 do not inherit the BMW conditional Stage 1 budget", () => {
  for (const stage of [stage2, stage3]) {
    const quote = pricing.resolveStageQuote(bmw128ti, stage);
    assert.equal(quote.kind, "on-request");
    assert.equal("conditionalBudgetFromCents" in quote, false);
  }
});

test("confirmed unlock never falls through to an ordinary tier", () => {
  const access = {...standardAccess, status: "confirmed-unlock-required" as const};
  const quote = pricing.resolveStageQuote(golfGti, stage1, {access});
  assert.equal(quote.kind, "on-request");
  if (quote.kind !== "on-request") throw new Error("Expected review");
  assert.equal(quote.reasonCode, "unlock-inclusive-policy-unavailable");
});

test("a forged confirmed access state without identifying evidence cannot quote", () => {
  const invalid = {status: "confirmed-standard"} as import("../src/data/pricing").AccessAssessment;
  assert.equal(pricing.resolveStageQuote(golfGti, stage1, {access: invalid}).kind, "on-request");
});

test("physical standard-access identification can clear a reviewed BMW access condition", () => {
  assert.equal(pricing.resolveStageQuote({id: "bmw-320d-b47"}, stage1, {access: standardAccess}).kind, "from");
});

test("there is no approved total for a missing Stage", () => {
  assert.equal(pricing.resolveStageQuote(golfGti, undefined).kind, "on-request");
});

test("selected paid options preserve an on-request base without a numeric subtotal quote", () => {
  const quote = pricing.resolveStageQuote(bmw128ti, stage1);
  assert.deepEqual(pricing.addQuoteOptions(quote, 14900 + 11900), quote);
  assert.equal("amountCents" in pricing.addQuoteOptions(quote, 26800), false);
});

test("numeric quotes add integer cents exactly and reject invalid option amounts", () => {
  const quote = pricing.addQuoteOptions(pricing.resolveStageQuote(golfGti, stage1), 101);
  assert.equal(quote.kind, "from");
  if (quote.kind !== "from") throw new Error("Expected approved quote");
  assert.equal(quote.amountCents, 35001);
  assert.match(pricing.formatQuote(quote, "nl"), /350,01/);
  for (const amount of [-1, 0.1, Number.NaN]) {
    assert.throws(() => pricing.addQuoteOptions(quote, amount), RangeError);
  }
});

test("localized WhatsApp uses the same facts, review, Stage/options and conditional budget", () => {
  const access = pricing.assessVehicleAccess(bmw128ti);
  const quote = pricing.addQuoteOptions(pricing.resolveStageQuote(bmw128ti, stage1), 14900);
  const input = {
    plate: "SYNTHETIC-A", vehicle: "BMW 128TI", fuel: "Petrol", firstAdmission: "2022-09-14",
    firstAdmissionYear: 2022, displacementCc: 1998, registeredPower: {value: 195, unit: "kW"},
    matchStatus: "no-match" as const, access, quote, stage: "Stage 1", options: ["Pops & Bangs"]
  };
  for (const locale of ["nl", "en", "pl"] as const) {
    const message = messages.createLookupQuoteMessage({...input, locale});
    assert.match(message, /BMW 128TI/);
    assert.match(message, /1998 cc/);
    assert.match(message, /195 kW/);
    assert.match(message, /2022/);
    assert.match(message, /Stage 1/);
    assert.match(message, /Pops & Bangs/);
    assert.match(message, /700/);
    assert.doesNotMatch(message, /269|299|849|\b320d\b/);
  }
  assert.match(messages.createLookupQuoteMessage({...input, locale: "nl"}), /Prijs: op aanvraag na ECU- en voertuigcontrole/);
  assert.match(messages.createLookupQuoteMessage({...input, locale: "en"}), /Price: on request after ECU and vehicle verification/);
  assert.match(messages.createLookupQuoteMessage({...input, locale: "pl"}), /Cena: wycena indywidualna po weryfikacji ECU i pojazdu/);
});

test("invalid first admission is unavailable even when a contradictory year was supplied", () => {
  const message = messages.createLookupQuoteMessage({
    locale: "nl", plate: "SYNTHETIC-B", vehicle: "Synthetic vehicle", firstAdmission: "2023-02-29",
    firstAdmissionYear: 2023, quote: pricing.resolveStageQuote(undefined, stage1), stage: "Stage 1", options: []
  });
  assert.match(message, /Eerste toelating: Niet beschikbaar/);
  assert.doesNotMatch(message, /2023/);
});

test("all 24 curated assignments remain nominally unchanged; 18 now require review", () => {
  assert.equal(Object.keys(pricing.publicVehiclePricingAssignments).length, 24);
  let reviewed = 0;
  for (const id of Object.keys(pricing.publicVehiclePricingAssignments)) {
    if (pricing.resolveStageQuote({id}, stage1).kind === "on-request") reviewed += 1;
  }
  assert.equal(reviewed, 18);
  assert.deepEqual(pricing.pricingV2StageTierIds.map((id) => pricing.getPricingTier(id)?.priceFrom),
    [299, 349, 399, 449, 499, 549, 699, 849, 999]);
});
}
