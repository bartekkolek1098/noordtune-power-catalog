import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {engineCatalog, getReferenceSelectorEstimate, getVehicleSelectorItems, vehicleDatabaseCount} from "../src/data/catalog.ts";
import {serviceOptions} from "../src/data/catalog-shared.ts";
import type {CatalogMatchInput} from "../src/data/catalog-matching.ts";
import {getCatalogEstimateProfile, getCatalogEstimateProfileForIdentity} from "../src/data/tuning-estimates-shared.ts";
import {publicCatalogTruthReviews} from "../src/data/public-catalog-truth.ts";
import {addQuoteOptions, assessVehicleAccess, getPublicServicePrice, resolveStageQuote} from "../src/data/pricing.ts";
import {customerProfile, customerVehicle} from "../src/lib/customer-profile.ts";
import {estimateChartData} from "../src/lib/estimate-chart.ts";
import {formatEstimatePower, formatEstimateTorque} from "../src/lib/estimate-copy.ts";
import {quoteOfferFields} from "../src/lib/quote-offer.ts";
import {customerStageNotes} from "../src/lib/stage-presentation.ts";
import {isVehicleServiceSelectable} from "../src/lib/vehicle-services.ts";
import {createVehicleQuoteMessage, whatsappHref} from "../src/lib/whatsapp.ts";

type Stage1Fixture = {kind: "WITHHELD" | "POINT" | "RANGE"; output: null | [number, number] | [[number, number], [number, number]]; priceCents: number | null};
type Fixture = {id: string; grade: "B" | "C"; stock: [number, number]; years: [number, number]; generation: string;
  ecuFamily: string; tcuFamily?: string; stage1: Stage1Fixture; stage2Action: "CUSTOM_ON_REQUEST" | "WITHHOLD_UNTIL_IDENTIFIED";
  supportedIdentity: CatalogMatchInput; manualIdentity?: CatalogMatchInput;
  rejectedIdentities: Array<{label: string; input: CatalogMatchInput}>};

const fixtures: Fixture[] = JSON.parse(readFileSync(new URL("./fixtures/catalog-truth-p1.json", import.meta.url), "utf8"));
assert.equal(fixtures.length, 5);
assert.equal(engineCatalog.length, 24);
assert.equal(vehicleDatabaseCount, 58586);
assert.equal(3 + engineCatalog.length * 3 + engineCatalog.reduce((count, vehicle) => count + vehicle.stages.length * 3, 0), 291);

let checks = 0;
const equal = (actual: unknown, expected: unknown, label: string) => { assert.deepEqual(actual, expected, label); checks++; };
const gearboxOption = serviceOptions.find(option => option.id === "gearbox")!;
equal(getPublicServicePrice(gearboxOption), 249, "conditional TCU public from-price remains 249");

for (const fixture of fixtures) {
  const vehicle = engineCatalog.find(item => item.id === fixture.id)!;
  assert.ok(vehicle, `${fixture.id}: public vehicle exists`);
  const review = publicCatalogTruthReviews.find(item => item.id === fixture.id)!;
  equal(review.grade, fixture.grade, `${fixture.id}: final grade`);
  equal([vehicle.stockPowerHp, vehicle.stockTorqueNm], fixture.stock, `${fixture.id}: stock output`);
  equal([vehicle.years[0], vehicle.years.at(-1)], fixture.years, `${fixture.id}: supported period`);
  equal(vehicle.generation, fixture.generation, `${fixture.id}: generation`);
  equal(vehicle.ecuSupport?.family, fixture.ecuFamily, `${fixture.id}: ECU application family`);
  equal(vehicle.ecuSupport?.basis, "documented-application", `${fixture.id}: ECU wording is application evidence`);
  assert.notEqual(vehicle.ecuSupport?.status, "verified", `${fixture.id}: installed ECU is not inferred`);
  if (fixture.tcuFamily) {
    equal(vehicle.tcuSupport?.family, fixture.tcuFamily, `${fixture.id}: TCU application family`);
    equal(vehicle.tcuSupport?.basis, "documented-application", `${fixture.id}: TCU wording is application evidence`);
    assert.notEqual(vehicle.tcuSupport?.status, "verified", `${fixture.id}: installed TCU is not inferred`);
  }

  const stage1 = vehicle.stages[0];
  if (fixture.stage1.kind === "POINT") {
    equal([stage1.powerHp, stage1.torqueNm], fixture.stage1.output, `${fixture.id}: Stage 1 point`);
    equal([stage1.powerRangeHp, stage1.torqueRangeNm], [undefined, undefined], `${fixture.id}: point is not converted to range`);
  } else if (fixture.stage1.kind === "RANGE") {
    equal([stage1.powerRangeHp, stage1.torqueRangeNm], fixture.stage1.output, `${fixture.id}: Stage 1 range`);
    equal([stage1.powerHp, stage1.torqueNm], [undefined, undefined], `${fixture.id}: range is not converted to point`);
  } else {
    equal([stage1.powerHp, stage1.torqueNm, stage1.powerRangeHp, stage1.torqueRangeNm], [undefined, undefined, undefined, undefined], `${fixture.id}: Stage 1 withheld`);
  }
  const staticQuote = resolveStageQuote(vehicle, stage1);
  equal(staticQuote.kind === "from" ? staticQuote.amountCents : null, fixture.stage1.priceCents, `${fixture.id}: static Stage 1 price`);
  assert.notEqual(staticQuote.kind === "from" ? staticQuote.amountCents : null, 26900, `${fixture.id}: no 269 fallback`);

  const scoped = getCatalogEstimateProfileForIdentity(vehicle, fixture.supportedIdentity);
  const scopedStage1 = scoped.stages[0];
  if (fixture.stage1.kind === "POINT") equal([scopedStage1.powerHp, scopedStage1.torqueNm], fixture.stage1.output, `${fixture.id}: compatible runtime point retained`);
  if (fixture.stage1.kind === "RANGE") equal([scopedStage1.powerRangeHp, scopedStage1.torqueRangeNm], fixture.stage1.output, `${fixture.id}: compatible runtime range retained`);
  if (fixture.stage1.kind === "WITHHELD") equal([scopedStage1.powerHp, scopedStage1.torqueNm, scopedStage1.powerRangeHp], [undefined, undefined, undefined], `${fixture.id}: identity cannot invent output`);
  const scopedQuote = resolveStageQuote(scoped, scopedStage1, {scope: "vehicle"});
  equal(scopedQuote.kind === "from" ? scopedQuote.amountCents : null, fixture.stage1.priceCents, `${fixture.id}: compatible runtime price`);

  for (const rejected of fixture.rejectedIdentities) {
    const rejectedProfile = getCatalogEstimateProfileForIdentity(vehicle, rejected.input);
    const rejectedStage = rejectedProfile.stages[0];
    equal([rejectedStage.powerHp, rejectedStage.torqueNm, rejectedStage.powerRangeHp, rejectedStage.torqueRangeNm],
      [undefined, undefined, undefined, undefined], `${fixture.id}: ${rejected.label} has no borrowed output`);
    const rejectedQuote = resolveStageQuote(rejectedProfile, rejectedStage, {scope: "vehicle"});
    equal(rejectedQuote.kind, "on-request", `${fixture.id}: ${rejected.label} has no numeric quote`);
    equal(addQuoteOptions(rejectedQuote, 24900), rejectedQuote, `${fixture.id}: ${rejected.label} TCU option cannot create a total`);
  }

  const stage2 = vehicle.stages[1];
  equal([stage2.powerHp, stage2.torqueNm, stage2.powerRangeHp, stage2.torqueRangeNm], [undefined, undefined, undefined, undefined], `${fixture.id}: Stage 2 has no numeric output`);
  equal(stage2.customHardware, fixture.stage2Action === "CUSTOM_ON_REQUEST", `${fixture.id}: independent Stage 2 action`);
  equal(resolveStageQuote(vehicle, stage2).kind, "on-request", `${fixture.id}: Stage 2 price on request`);
  const stage3 = vehicle.stages[2];
  equal([stage3.customHardware, stage3.quoteRequired, stage3.powerHp, stage3.torqueNm], [true, true, undefined, undefined], `${fixture.id}: Stage 3+ custom on request`);

  const customerVehicleDto = customerVehicle(vehicle);
  assert.doesNotMatch(JSON.stringify(customerVehicleDto), /identityScope|WITHHOLD_UNTIL_IDENTIFIED|SUPPORTED_(?:POINT|RANGE)|source-voting/, `${fixture.id}: internal scope does not reach customer vehicle DTO`);
  const customerProfileDto = customerProfile(getCatalogEstimateProfile(vehicle));
  assert.doesNotMatch(JSON.stringify(customerProfileDto), /identityScope|WITHHOLD_UNTIL_IDENTIFIED|SUPPORTED_(?:POINT|RANGE)|source-voting/, `${fixture.id}: internal scope does not reach customer profile DTO`);
  for (const locale of ["nl", "en", "pl"] as const) {
    const notes = customerStageNotes(customerProfileDto.stages[0], locale, customerProfileDto);
    assert.ok(notes.length, `${fixture.id}: ${locale} customer scope note exists`);
    const message = createVehicleQuoteMessage({locale, vehicle: `${vehicle.brand} ${vehicle.model}`, stage: stage1.name,
      options: [], quote: staticQuote, indicativeOutput: stage1});
    assert.ok(message.includes(formatEstimatePower(stage1, locale)), `${fixture.id}: ${locale} WhatsApp power parity`);
    if (fixture.stage1.kind !== "WITHHELD") assert.ok(message.includes(formatEstimateTorque(stage1, locale)), `${fixture.id}: ${locale} WhatsApp torque parity`);
    equal(new URL(whatsappHref({locale, message})).searchParams.get("text"), message, `${fixture.id}: ${locale} WhatsApp draft roundtrip`);
  }
  const offer = quoteOfferFields(staticQuote, "en");
  equal(Object.hasOwn(offer, "price"), fixture.stage1.priceCents !== null, `${fixture.id}: structured Offer price parity`);
  const chart = estimateChartData(getCatalogEstimateProfile(vehicle).stages, vehicle.stockPowerHp, vehicle.stockTorqueNm);
  equal([chart[2].pk, chart[2].nm, chart[3].pk, chart[3].nm], [null, null, null, null], `${fixture.id}: chart leaves Stage 2 and 3 gaps`);

  const unknownTransmission = getCatalogEstimateProfileForIdentity(vehicle, {...fixture.supportedIdentity, transmission: undefined});
  equal(isVehicleServiceSelectable(unknownTransmission, gearboxOption), false, `${fixture.id}: unknown transmission has no TCU product`);
  if (fixture.manualIdentity) {
    const manual = getCatalogEstimateProfileForIdentity(vehicle, fixture.manualIdentity);
    equal(isVehicleServiceSelectable(manual, gearboxOption), false, `${fixture.id}: manual identity has no TCU product`);
    const automatic = getCatalogEstimateProfileForIdentity(vehicle, fixture.supportedIdentity);
    equal(isVehicleServiceSelectable(automatic, gearboxOption), true, `${fixture.id}: documented automatic application exposes conditional TCU only`);
    equal(automatic.serviceCompatibility?.gearbox?.status, "conditional", `${fixture.id}: automatic TCU remains conditional`);
  }
}

const g20 = engineCatalog.find(vehicle => vehicle.id === "bmw-3-series-g20-g21-320i")!;
const g20Stage1Quote = resolveStageQuote(g20, g20.stages[0]);
equal(g20Stage1Quote.kind, "on-request", "G20 Stage 1 remains on request");
equal(resolveStageQuote(g20, g20.stages[1]).kind, "on-request", "G20 Stage 2 remains on request");
assert.notEqual(g20Stage1Quote.kind === "from" ? g20Stage1Quote.amountCents : null, 70000);
assert.notEqual(assessVehicleAccess(g20).status, "confirmed-unlock-required", "G20 model/year does not confirm advanced unlock");
assert.match(g20.configurationNote!.en, /installed DME.*not identified/i);
assert.match(g20.configurationNote!.en, /184\/270.*incompatible/i);

const passat = engineCatalog.find(vehicle => vehicle.id === "volkswagen-passat-b8-20-tdi")!;
equal(getVehicleSelectorItems({brand: passat.brand, model: passat.model, year: 2019}).some(item => item.id === passat.id && item.pagePath), true, "supported Passat selector reaches public page");
equal(getVehicleSelectorItems({brand: passat.brand, model: passat.model, year: 2018}).some(item => item.id === passat.id || item.pagePath === `/vehicles/${passat.id}`), false, "pre-facelift selector cannot claim supported Passat profile");
for (const id of ["volkswagen-passat-b8-20-tdi", "ford-focus-st-20-ecoboost"] as const) {
  const vehicle = engineCatalog.find(item => item.id === id)!;
  const outsideYear = Math.min(...vehicle.years) - 1;
  equal(getVehicleSelectorItems({brand: vehicle.brand, model: vehicle.model, year: outsideYear}).some(item => item.id === id && item.pagePath), false, `${id}: outside-scope year has no public-page claim`);
  if (vehicle.sourceCanonicalId) equal(getReferenceSelectorEstimate(vehicle.sourceCanonicalId), undefined, `${id}: shadowed canonical ID cannot restore stale output`);
}

equal(fixtures.filter(fixture => fixture.grade === "B").length, 4, "four profiles upgraded C to B");
equal(fixtures.filter(fixture => fixture.grade === "C").length, 1, "one profile remains C");
equal(fixtures.filter(fixture => fixture.stage1.kind === "POINT").length, 3, "three numeric Stage 1 points");
equal(fixtures.filter(fixture => fixture.stage1.kind === "RANGE").length, 1, "one numeric Stage 1 range");
equal(fixtures.filter(fixture => fixture.stage1.kind === "WITHHELD").length, 1, "one withheld Stage 1");
equal(fixtures.filter(fixture => fixture.stage2Action === "CUSTOM_ON_REQUEST").length, 4, "four Stage 2 custom scopes");
equal(fixtures.filter(fixture => fixture.stage2Action === "WITHHOLD_UNTIL_IDENTIFIED").length, 1, "one Stage 2 identity withholding");

console.log(`Catalog Truth P1: ${checks} contract assertions; 4 C->B, 1 C retained, 3 Stage 1 points, 1 range, 1 withheld, 0 numeric Stage 2, 291 routes.`);
