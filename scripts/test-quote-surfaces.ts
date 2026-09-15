// Executable integration checks against the real catalog DTOs and quote consumers.
import assert from "node:assert/strict";
import * as catalog from "../src/data/catalog.ts";
import * as pricing from "../src/data/pricing.ts";
import {serviceOptions} from "../src/data/catalog-shared.ts";
import {getCatalogEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {quoteOfferFields} from "../src/lib/quote-offer.ts";
import {isVehicleServiceSelectable} from "../src/lib/vehicle-services.ts";
import {catalogVerificationCopy} from "../src/lib/catalog-verification-copy.ts";
import {createVehicleQuoteMessage, whatsappHref} from "../src/lib/whatsapp.ts";

let checks = 0;
function equal(actual: unknown, expected: unknown, message: string) {
  assert.deepEqual(actual, expected, message);
  checks += 1;
}

for (const vehicle of catalog.engineCatalog) {
  const reviewedNotice = {badge: "known", title: "known", text: "known", footer: "known"};
  const notice = catalogVerificationCopy(vehicle, "nl", reviewedNotice);
  equal(notice.text === "known", vehicle.publicationSource === "existing-curated", `${vehicle.id}: notice agrees with reviewed applicability`);
  const stage = vehicle.stages[0];
  const profile = getCatalogEstimateProfile({...vehicle, verificationRequired: true, confidenceLevel: "estimated"});
  equal(profile.stockPowerHp, vehicle.stockPowerHp, `${vehicle.id}: stock power retained with verification pending`);
  equal(profile.stockTorqueNm, vehicle.stockTorqueNm, `${vehicle.id}: stock torque retained`);
  equal(profile.stages.map(({name, powerHp, torqueNm}) => ({name, powerHp, torqueNm})), vehicle.stages.map(({name, powerHp, torqueNm}) => ({name, powerHp, torqueNm})), `${vehicle.id}: all existing source Stage figures retained`);
  const quote = pricing.resolveStageQuote(vehicle, stage);
  equal(quote.kind, "from", `${vehicle.id}: explicit family policy restores numeric Stage 1`);
  equal(pricing.resolveStageQuote(profile, stage, {estimateApplicable: true, scope: "family", access: {status: "unknown", reasonCode: "test-unknown-ecu"}}), quote, `${vehicle.id}: unknown ECU does not erase commercial estimate`);
  const canonical = catalog.vehicleDatabase.find(
    (candidate) => candidate.id === (vehicle.sourceCanonicalId ?? vehicle.id)
  );
  assert.ok(canonical, `${vehicle.id}: canonical fixture exists`);
  const selector = catalog.getVehicleSelectorItems({
    brand: canonical.brand,
    model: canonical.model,
    year: canonical.years[0]
  }).find((candidate) => candidate.id === vehicle.id);
  equal(selector?.quote, quote, `${vehicle.id}: selector matches vehicle quote`);
  const quickSearch = catalog.searchVehicleSelectorItems(
    `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`, 20000
  ).find((candidate) => candidate.id === vehicle.id);
  equal(quickSearch?.quote, quote, `${vehicle.id}: quick search matches vehicle quote`);

  for (const selectedStage of vehicle.stages) {
    const selectedQuote = pricing.resolveStageQuote(vehicle, selectedStage);
    equal(selectedStage.quote, selectedQuote, `${vehicle.id} ${selectedStage.name}: DTO quote`);
    const offer = quoteOfferFields(selectedQuote, "nl");
    if (selectedQuote.kind === "from") {
      equal(offer.price, (selectedQuote.amountCents / 100).toFixed(2), `${vehicle.id}: Offer amount`);
      equal(offer.priceSpecification?.valueAddedTaxIncluded, true, `${vehicle.id}: VAT convention`);
    } else {
      equal(Object.hasOwn(offer, "price"), false, `${vehicle.id}: no fictional Offer price`);
      equal(Object.hasOwn(offer, "priceSpecification"), false, `${vehicle.id}: no fictional price specification`);
    }
    equal(offer.description, selectedQuote.kind === "from" ? `${pricing.formatQuote(selectedQuote, "nl")}. ${pricing.formatQuoteScope(selectedQuote, "nl")}` : pricing.formatQuote(selectedQuote, "nl"), `${vehicle.id}: Offer matches visible scoped quote`);
  }
}

const generated = catalog.generatedVehicleCatalog.find((vehicle) =>
  !catalog.engineCatalog.some((published) => published.sourceCanonicalId === vehicle.id)
);
assert.ok(generated, "An unpublished generated discovery record exists");
equal(pricing.resolveStageQuote(generated, generated.stages[0]).kind, "on-request", "Generated page cannot recover historical source price");
assert.ok(catalogVerificationCopy(generated, "en", {badge: "", title: "", text: "", footer: ""}).text.includes("estimated catalog data"));

const gearboxOption = serviceOptions.find((option) => option.id === "gearbox");
assert.ok(gearboxOption);
const focus = catalog.engineCatalog.find((vehicle) => vehicle.id === "ford-focus-st-20-ecoboost");
assert.ok(focus);
equal(isVehicleServiceSelectable(focus, gearboxOption), false, "Manual Focus ST cannot select TCU");
equal(isVehicleServiceSelectable({
  options: ["gearbox"],
  serviceCompatibility: {gearbox: {status: "supported"}}
}, gearboxOption), false, "Unknown transmission cannot enable TCU despite a generic supported flag");
equal(isVehicleServiceSelectable({
  gearbox: "DSG",
  options: ["gearbox"],
  serviceCompatibility: {gearbox: {status: "conditional"}}
}, gearboxOption), true, "Explicit DSG with conditional compatibility remains selectable");

const selectedOptions = serviceOptions.filter((option) => ["egr", "speed-limiter"].includes(option.id));
const optionsCents = selectedOptions.reduce((total, option) => total + Math.round(option.price * 100), 0);
const bmw = catalog.engineCatalog.find((vehicle) => vehicle.id === "bmw-320d-b47");
assert.ok(bmw);
const bmwProfile = getCatalogEstimateProfile(bmw);
const onRequest = pricing.resolveStageQuote(bmwProfile, bmw.stages[1], {scope: "vehicle", estimateApplicable: true});
equal(onRequest.kind, "on-request", "Unscoped advanced-unlock higher Stage remains on request");
equal(bmwProfile.stages[1].powerHp, bmw.stages[1].powerHp, "On-request commercial scope does not suppress sourced power data");
const withOptions = pricing.addQuoteOptions(onRequest, optionsCents);
equal(withOptions, onRequest, "Paid options do not turn an unknown base into a numeric total");
const message = createVehicleQuoteMessage({
  locale: "nl",
  vehicle: `${bmw.brand} ${bmw.model} ${bmw.engine}`,
  vehiclePower: `${bmw.stockPowerHp} pk`,
  stage: "Stage 2",
  options: selectedOptions.map((option) => option.name),
  quote: withOptions,
  access: pricing.assessVehicleAccess(bmw),
  matchStatus: "catalog-match"
});
assert.ok(message.includes("Prijs: op aanvraag na ECU- en voertuigcontrole"));
assert.ok(message.includes("Stage 2"));
for (const option of selectedOptions) assert.ok(message.includes(option.name));
equal(new URL(whatsappHref({locale: "nl", message})).searchParams.get("text"), message, "WhatsApp encoding retains the same quote and selections");
const numericBase = pricing.resolveStageQuote(focus, focus.stages[0]);
assert.equal(numericBase.kind, "from");
const numericTotal = pricing.addQuoteOptions(numericBase, optionsCents);
assert.equal(numericTotal.kind, "from");
equal(numericTotal.amountCents, numericBase.amountCents + optionsCents, "Approved base plus chosen options uses integer cents");
const bmwBudget = pricing.resolveStageQuote(bmwProfile, bmw.stages[0], {scope: "vehicle", estimateApplicable: true});
assert.equal(bmwBudget.kind, "from");
equal(bmwBudget.amountCents, 70000, "Applicable plate-specific unlock scenario shows package budget without stacking a surcharge");
equal(bmwBudget.scope, "advanced-unlock-package", "Higher vehicle scenario retains explicit package scope");

console.log(`Quote surface integration: ${checks} assertions passed across ${catalog.engineCatalog.length} curated vehicles, selectors, Offers, WhatsApp, options and TCU eligibility.`);
