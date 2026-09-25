import {customerStageNotes, stageScope} from "../src/lib/stage-presentation.ts";
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
import {customHardwareLabel, estimateLimitations, estimateStageTechnicalNotes, formatEstimatePower, formatEstimateSource, formatEstimateTorque} from "../src/lib/estimate-copy.ts";
import {estimateChartData} from "../src/lib/estimate-chart.ts";
import {applyStageHardwarePolicy} from "../src/lib/stage-hardware-policy.ts";
import type {EstimateStage} from "../src/data/tuning-estimates-shared.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";

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
  const displayStages = applyStageHardwarePolicy(profile.stages);
  equal(displayStages.slice(0, 2), profile.stages.slice(0, 2), `${vehicle.id}: presentation preserves existing Stage 1/2`);
  const custom = displayStages.find(stage => stage.name === "Stage 3+");
  assert.ok(custom);
  equal([custom.customHardware, custom.powerHp, custom.torqueNm], [true, undefined, undefined], `${vehicle.id}: unsupported Stage 3 stays selectable as custom hardware work`);
  const displayQuote = pricing.resolveStageQuote(profile, custom);
  equal(displayQuote.kind, "on-request", `${vehicle.id}: custom Stage cannot inherit an unscoped package price`);
  equal(Object.hasOwn(quoteOfferFields(displayQuote, "nl"), "price"), false, `${vehicle.id}: custom Stage Offer has no unscoped amount`);
  equal(profile.stages[2].powerHp, vehicle.stages[2].powerHp, `${vehicle.id}: presentation does not mutate retained source data`);
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

const sourcedStage: EstimateStage = {name: "Stage 1", powerHp: 160, torqueNm: 340,
  approximate: true, provenance: "multi-source", requirements: "Vehicle verification", packageItems: []};
const customStage: EstimateStage = {name: "Stage 3+", customHardware: true,
  requirements: "Hardware scope required", packageItems: []};
const genuineStage3: EstimateStage = {...sourcedStage, name: "Stage 3+", powerHp: 480, torqueNm: 620, provenance: "single-source", hardwareRequired: true};
equal(applyStageHardwarePolicy([genuineStage3])[0], genuineStage3, "A genuine applicable published Stage 3 figure can be displayed with its hardware scope");
const approvedStage3: EstimateStage = {...genuineStage3, provenance: "reviewed", hardwareScopeApproved: true};
equal(applyStageHardwarePolicy([approvedStage3])[0], approvedStage3, "An explicitly approved NoordTune hardware profile can retain its Stage 3 figure");
equal(applyStageHardwarePolicy([{...genuineStage3, customHardware: true}])[0].powerHp, undefined, "Explicit custom state overrides stale sourced values");
const customLabels = {nl: "Maatwerk / hardware-afhankelijk", en: "Custom / hardware-dependent", pl: "Indywidualnie / zależnie od osprzętu"} as const;
const units = {nl: "pk", en: "hp", pl: "KM"} as const;
const conflictCopy = {
  nl: "Bronnen verschillen of Stage-waarden sluiten niet op elkaar aan. Controle van de gekozen tuningwaarde en hardware is nodig vóór uitvoering.",
  en: "Sources disagree or Stage figures are inconsistent. The selected tuning figure and hardware need review before work.",
  pl: "Źródła różnią się lub wartości poszczególnych Stage są niespójne. Przed realizacją trzeba zweryfikować wybrane parametry i osprzęt."
} as const;
for (const locale of ["nl", "en", "pl"] as const) {
  equal(formatEstimatePower(sourcedStage, locale), `≈160 ${units[locale]}`, `${locale}: sourced power is one approximate point`);
  equal(formatEstimateTorque(sourcedStage, locale), "≈340 Nm", `${locale}: sourced torque is one approximate point`);
  equal(customHardwareLabel(locale), customLabels[locale], `${locale}: owner-requested hardware copy`);
  equal(formatEstimatePower(customStage, locale), customLabels[locale], `${locale}: missing Stage 3 is retained as custom work`);
  const sourcedMessage = createVehicleQuoteMessage({locale, vehicle: "Example 1.6 diesel", stage: sourcedStage.name,
    quote: numericBase, options: [], indicativeOutput: sourcedStage,
    estimateSource: formatEstimateSource(sourcedStage, locale)});
  assert.ok(sourcedMessage.includes(`≈160 ${units[locale]} / ≈340 Nm`));
  equal(new URL(whatsappHref({locale, message: sourcedMessage})).searchParams.get("text"), sourcedMessage, `${locale}: approximate symbols survive WhatsApp encoding`);
  const customMessage = createVehicleQuoteMessage({locale, vehicle: "Example 1.6 diesel", stage: customStage.name,
    quote: onRequest, options: ["Selected service"], indicativeOutput: customStage,
    estimateSource: formatEstimateSource(customStage, locale)});
  equal(customMessage.split(customLabels[locale]).length - 1, 1, `${locale}: WhatsApp explains custom Stage exactly once`);
  assert.ok(customMessage.includes("Stage 3+"));
  assert.ok(customMessage.includes("Selected service"));
  assert.doesNotMatch(customMessage, /≈|\b160\b|\b340\b|undefined|NaN/);
  equal(formatEstimatePower({...sourcedStage, customHardware: true}, locale), customLabels[locale], `${locale}: custom flag cannot leak stale numeric output`);
  equal(estimateLimitations({...bmwProfile, conditionCodes: ["NOORDTUNE_TARGET_REVIEW_REQUIRED"]}, locale).some(text => /190|440|460/.test(text)), false, `${locale}: owner-review warning does not embed an obsolete external figure`);
  const conflictNotes = estimateLimitations({...bmwProfile, conditionCodes: ["SOURCE_CONSENSUS_CONFLICT"]}, locale);
  equal(conflictNotes, [conflictCopy[locale]], `${locale}: source disagreement and nonmonotonic Stage warning is localized`);
  const conflictMessage = createVehicleQuoteMessage({locale, vehicle: "Example 1.6 diesel", stage: sourcedStage.name,
    quote: numericBase, options: [], indicativeOutput: sourcedStage, estimateNotes: conflictNotes});
  equal(conflictMessage.split(conflictCopy[locale]).length - 1, 1, `${locale}: WhatsApp carries the same review warning once`);
  assert.ok(conflictMessage.includes(`≈160 ${units[locale]} / ≈340 Nm`), `${locale}: warning preserves the selected approximate output`);
  assert.doesNotMatch(conflictNotes.join(" "), /Shiftech|Mosselman|Unlimited|\d|–/, `${locale}: primary warning contains no competitor or source-value range`);
}
equal(formatEstimateSource({...sourcedStage, provenance: "single-source"}, "nl"), "Indicatieve tuningwaarde", "Single-source confidence uses concise customer copy");
equal(formatEstimateSource(sourcedStage, "nl"), "Catalogusindicatie", "Multiple-source confidence uses concise customer copy");
equal(formatEstimateSource({...sourcedStage, provenance: "generic-indicative"}, "nl"), "Algemene indicatie", "Emergency heuristic is identified independently");
const sourcedChart = estimateChartData([sourcedStage, {...sourcedStage, name: "Stage 2", powerHp: 170, torqueNm: 360}, customStage], 136, 320);
equal(sourcedChart.map(point => [point.pk, point.nm]), [[136, 320], [160, 340], [170, 360], [null, null]], "Chart preserves sourced point values and leaves custom Stage 3 unplotted");
equal(sourcedChart.map(point => point.approximate), [false, true, true, false], "Chart tooltip distinguishes registered stock from approximate sourced output");
const guardedChart = estimateChartData([{...customStage, powerHp: 999, torqueNm: 999, powerRangeHp: [800, 999]}], 136);
equal(guardedChart[1].pk, null, "Custom stage cannot plot stale or fabricated power");
equal(guardedChart[1].nm, null, "Custom stage cannot plot stale or fabricated torque");
equal(guardedChart[0].nm, null, "Missing stock torque remains unknown");
const emergencyChart = estimateChartData([{...sourcedStage, approximate: false, powerHp: undefined, powerRangeHp: [155, 170]}], 136, 320);
equal(emergencyChart[1].pk, [155, 170], "Emergency fallback range remains a range, never an invented midpoint");

const bmw340iSource = sourcedTuningProfiles.find(profile => profile.brand === "BMW" && profile.modelFamily === "3 Series" && /340i/.test(profile.engineMarketingName) && profile.stage3);
assert.ok(bmw340iSource, "Actual researched BMW 340i Stage 3 hardware fixture exists");
const bmw340iResult = resolveRdwTuningEstimate({make: "BMW", model: "340i F30", fuel: "Petrol", powerHp: bmw340iSource.stockPowerHp,
  displacementCc: 2998, cylinders: 6, firstRegistrationYear: 2016, type: "F30", variant: "B58"});
assert.ok(bmw340iResult.profile, "Actual resolver selects a BMW 340i estimate");
equal(bmw340iResult.profile.id, bmw340iSource.id, "Production resolver selects the sourced hardware profile");
const bmw340iStage3 = bmw340iResult.profile.stages.find(stage => stage.name === "Stage 3+")!;
const hardwareScope = stageScope(bmw340iStage3);
equal(hardwareScope.fuelRon, [98], "BMW Stage 3 retains RON 98");
for (const part of ["downpipe", "fuel-pump", "b58-turbo"]) equal(hardwareScope.hardware.some(item => item.part === part), true, "Retain documented hardware: " + part);
const hardwareQuote = pricing.resolveStageQuote(bmw340iResult.profile, bmw340iStage3, {scope: "vehicle", estimateApplicable: true});
equal(hardwareQuote.kind, "on-request", "Published BMW hardware facts do not approve a NoordTune commercial scope");
for (const locale of ["nl", "en", "pl"] as const) {
  const hardwareMessage = createVehicleQuoteMessage({locale, vehicle: "BMW 340i", stage: bmw340iStage3.name,
    quote: hardwareQuote, options: [], indicativeOutput: bmw340iStage3, estimateNotes: customerStageNotes(bmw340iStage3, locale, bmw340iResult.profile)});
  for (const required of ["downpipe", "B58TU", "B58", "RON 98"]) {
    equal(hardwareMessage.toLowerCase().includes(required.toLowerCase()), true, locale + ": WhatsApp preserves localized hardware fact " + required);
  }
}
const mappedNotes = estimateStageTechnicalNotes({notes: ["SOURCE_CONSENSUS_CONFLICT", "HARDWARE_SCOPE_REVIEW: machine status", "Requires RON 98.", "Requires RON 98.", ""]}, "pl");
equal(mappedNotes.filter(note => note.includes("RON 98")).length, 1, "Typed fuel requirement deduplicates");
assert.doesNotMatch(mappedNotes.join(" "), /SOURCE_|HARDWARE_|Requires/);

console.log(`Quote surface integration: ${checks} assertions passed across ${catalog.engineCatalog.length} curated vehicles, selectors, Offers, WhatsApp, options and TCU eligibility.`);
