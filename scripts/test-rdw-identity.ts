import assert from "node:assert/strict";
import {mkdirSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import {dirname, resolve} from "node:path";
import {normalizeRdwVehicle, type RdwVehicleRow, type RdwFuelRow} from "../src/lib/rdw.ts";
import {firstAdmissionYear, formatRegistrationDate, parseRdwDate} from "../src/lib/rdw-date.ts";
import {addQuoteOptions, assessVehicleAccess, formatQuote, resolveStageQuote} from "../src/data/pricing.ts";
import {createLookupQuoteMessage} from "../src/lib/whatsapp.ts";

let passed = 0;
function test(name: string, run: () => void) {
  run(); passed++; console.log(`PASS ${name}`);
}
test("strict RDW calendar dates accept ISO and YYYYMMDD including leap days", () => {
  for (const [input, expected] of [
    ["20220914", "2022-09-14"], ["2022-09-14", "2022-09-14"],
    ["2022-09-14T00:00:00.000", "2022-09-14"], ["2022-09-14T00:00:00Z", "2022-09-14"],
    ["20000229", "2000-02-29"], ["2024-02-29T23:30:00-12:00", "2024-02-29"]
  ]) assert.equal(parseRdwDate(input), expected);
});
test("strict date validation rejects invalid leap dates, times and format variants", () => {
  for (const value of [undefined, "", "20230229", "19000229", "21000229", "20220230", "20221301", "20220001", "20220100", "00000229", "2022-9-14", "14-09-2022", "2022/09/14", " 20220914", "2022-09-14x", "2022-09-14T24:00:00", "2022-09-14T00:60:00", "2022-09-14T00:00:60", "2022-09-14T00:00:00+24:00"]) assert.equal(parseRdwDate(value), undefined, String(value));
  assert.equal(firstAdmissionYear("20230229"), undefined);
});
test("first-admission ISO date wins, invalid ISO falls back to raw valid date", () => {
  const base = {merk: "SYNTHETIC", handelsbenaming: "DATE FIXTURE"};
  const iso = normalizeRdwVehicle({...base, datum_eerste_toelating_dt: "2022-09-14T00:00:00.000", datum_eerste_toelating: "20200101"}, [], "SYN001");
  assert.equal(iso.vehicle.registration.firstAdmission, "2022-09-14");
  assert.equal(iso.vehicle.registration.firstAdmissionYear, 2022);
  const fallback = normalizeRdwVehicle({...base, datum_eerste_toelating_dt: "2023-02-29T00:00:00.000", datum_eerste_toelating: "20240229"}, [], "SYN002");
  assert.equal(fallback.vehicle.registration.firstAdmission, "2024-02-29");
});
test("Netherlands import registration stays separate from actual first admission", () => {
  const result = normalizeRdwVehicle({merk: "SYNTHETIC", handelsbenaming: "IMPORT FIXTURE", datum_eerste_toelating: "20160405", datum_eerste_tenaamstelling_in_nederland: "20210809"}, [], "SYN003");
  assert.deepEqual([result.vehicle.registration.firstAdmission, result.vehicle.registration.firstAdmissionYear, result.vehicle.registration.firstRegistrationNl], ["2016-04-05", 2016, "2021-08-09"]);
});
test("missing first admission never substitutes import, ownership transfer or catalog year", () => {
  const row = {
    merk: "BMW", handelsbenaming: "320D", cilinderinhoud: "1995",
    datum_eerste_tenaamstelling_in_nederland_dt: "2024-01-02T00:00:00.000",
    datum_tenaamstelling_dt: "2025-03-04T00:00:00.000"
  } satisfies RdwVehicleRow & {datum_tenaamstelling_dt: string};
  const result = normalizeRdwVehicle(row, [{brandstof_omschrijving: "Diesel", nettomaximumvermogen: "140"}], "SYN004");
  assert.equal(result.vehicle.registration.firstAdmission, undefined);
  assert.equal(result.vehicle.registration.firstAdmissionYear, undefined);
  assert.equal(result.vehicle.registration.firstRegistrationNl, "2024-01-02");
  assert.ok(result.tuningMatch.reasonCodes.includes("MISSING_REGISTRATION_YEAR"));
  assert.equal(formatRegistrationDate(result.vehicle.registration.firstAdmission, "nl"), "Niet beschikbaar");
});
test("multiple hybrid power rows never fabricate a summed or maximum system output", () => {
  const result = normalizeRdwVehicle({merk: "SYNTHETIC", handelsbenaming: "HYBRID FIXTURE", datum_eerste_toelating: "20200101"}, [
    {brandstof_omschrijving: "Benzine", nettomaximumvermogen: "110"},
    {brandstof_omschrijving: "Elektriciteit", nettomaximumvermogen: "75"}
  ], "SYN005");
  assert.equal(result.vehicle.fuel, "Benzine / Elektriciteit");
  assert.equal(result.vehicle.engine.powerKw, null);
  assert.equal(result.vehicle.engine.powerHp, null);
});
test("date display includes actual year in each supported locale", () => {
  assert.equal(formatRegistrationDate("2022-09-14", "nl"), "14 september 2022");
  assert.equal(formatRegistrationDate("2022-09-14", "en"), "14 September 2022");
  assert.equal(formatRegistrationDate("2022-09-14", "pl"), "14 września 2022");
});

// Only synthetic identifiers are retained. The first three fact sets reproduce minimal
// official RDW m9d7-ebf2 + 8ys7-d773 data retrieved 2026-09-15T09:52:43Z.
const fixtures: {id: string; vehicle: RdwVehicleRow; fuel: RdwFuelRow[]; expected: string}[] = [
  {id: "SYN101", vehicle: {merk: "BMW", handelsbenaming: "128TI", cilinderinhoud: "1998", aantal_cilinders: "4", datum_eerste_toelating_dt: "2022-09-14T00:00:00.000", type: "F1H", variant: "7L51"}, fuel: [{brandstof_omschrijving: "Benzine", nettomaximumvermogen: "195"}], expected: "conflict"},
  {id: "SYN102", vehicle: {merk: "FORD", handelsbenaming: "TRANSIT CUSTOM", cilinderinhoud: "1995", datum_eerste_toelating_dt: "2019-04-29T00:00:00.000", type: "FCC", variant: "YLF61ABX"}, fuel: [{brandstof_omschrijving: "Diesel", nettomaximumvermogen: "77"}], expected: "conflict"},
  {id: "SYN103", vehicle: {merk: "FORD", handelsbenaming: "TRANSIT CONNECT", cilinderinhoud: "1499", datum_eerste_toelating_dt: "2018-10-17T00:00:00.000", type: "PU2", variant: "Z2GA1BFX"}, fuel: [{brandstof_omschrijving: "Diesel", nettomaximumvermogen: "73.5"}], expected: "no-match"},
  {id: "SYN104", vehicle: {merk: "BMW", handelsbenaming: "320D", cilinderinhoud: "1995", datum_eerste_toelating: "20170615"}, fuel: [{brandstof_omschrijving: "Diesel", nettomaximumvermogen: "140"}], expected: "catalog-match"},
  {id: "SYN105", vehicle: {merk: "VOLKSWAGEN", handelsbenaming: "GOLF GTI", cilinderinhoud: "1984", datum_eerste_toelating: "20170615"}, fuel: [{brandstof_omschrijving: "Benzine", nettomaximumvermogen: "169"}], expected: "catalog-match"},
  {id: "SYN106", vehicle: {merk: "VOLKSWAGEN", handelsbenaming: "GOLF R", cilinderinhoud: "1984", datum_eerste_toelating: "20170615"}, fuel: [{brandstof_omschrijving: "Benzine", nettomaximumvermogen: "221"}], expected: "ambiguous"},
  {id: "SYN107", vehicle: {merk: "FORD", handelsbenaming: "FOCUS ST", cilinderinhoud: "1999", datum_eerste_toelating: "20150615"}, fuel: [{brandstof_omschrijving: "Benzine", nettomaximumvermogen: "184"}], expected: "catalog-match"}
];

const normalized = fixtures.map((fixture) => ({fixture, result: normalizeRdwVehicle(fixture.vehicle, fixture.fuel, fixture.id)}));
const quoteResults = normalized.map(({fixture, result}) => {
  const vehicle = result.vehicle;
  const identity = result.tuningMatch.variant ?? {make: vehicle.make, model: vehicle.model};
  const access = assessVehicleAccess(identity);
  const baseQuote = resolveStageQuote(identity, {name: "Stage 1"}, {matchStatus: result.tuningMatch.status, access});
  const quote = addQuoteOptions(baseQuote, 14900);
  const message = createLookupQuoteMessage({
    locale: "nl", plate: fixture.id, vehicle: `${vehicle.make} ${vehicle.model}`, fuel: vehicle.fuel,
    firstAdmission: vehicle.registration.firstAdmission, displacementCc: vehicle.engine.displacementCc,
    vehiclePower: vehicle.engine.powerKw == null ? undefined : `${vehicle.engine.powerKw} kW (${vehicle.engine.powerHp} pk)`,
    matchStatus: result.tuningMatch.status, access, quote, stage: "Stage 1", options: ["EGR off"]
  });
  return {fixture, result, baseQuote, quote, access, message};
});

for (const {fixture, result, quote, message} of quoteResults) test(`normalized RDW / quote / Dutch WhatsApp consistency ${fixture.id}`, () => {
  assert.equal(result.tuningMatch.status, fixture.expected);
  assert.equal(result.vehicle.make, fixture.vehicle.merk);
  assert.equal(result.vehicle.model, fixture.vehicle.handelsbenaming);
  assert.equal(result.vehicle.engine.displacementCc, Number(fixture.vehicle.cilinderinhoud));
  assert.ok(message.includes(`Auto: ${fixture.vehicle.merk} ${fixture.vehicle.handelsbenaming}`));
  assert.ok(message.includes(`Cilinderinhoud: ${fixture.vehicle.cilinderinhoud} cc`));
  assert.ok(message.includes(`${fixture.fuel[0].nettomaximumvermogen} kW`));
  assert.ok(message.includes(`(${result.vehicle.registration.firstAdmissionYear})`));
  assert.ok(message.includes("Extra opties: EGR off"));
  if (quote.kind === "on-request") {
    assert.equal(formatQuote(quote, "nl"), "Prijs op aanvraag");
    assert.ok(message.includes("Prijs: op aanvraag na ECU- en voertuigcontrole"));
    assert.equal("amountCents" in quote, false);
    assert.doesNotMatch(message, /€\s?(?:0|269|299)\b/);
  } else assert.ok(message.includes(formatQuote(quote, "nl")));
});
test("BMW conditional unlock budget stays conditional and never becomes base plus options", () => {
  const result = quoteResults[0];
  assert.equal(result.access.status, "possible-unlock-review");
  assert.equal(result.quote.kind, "on-request");
  assert.equal(result.quote.kind === "on-request" && result.quote.conditionalBudgetFromCents, 70000);
  assert.match(result.message, /Als ECU-unlock nodig is, indicatief Stage 1-budget vanaf €\s?700/);
  assert.ok(result.message.includes("Definitieve offerte na ECU-identificatie."));
  assert.doesNotMatch(result.message, /€\s?849|ECU.*(?:is locked|is vergrendeld)/);
});
test("Ford message retains official Custom identity and excludes rejected engines or owner-only ECU", () => {
  const message = quoteResults[1].message;
  assert.ok(message.includes("Auto: FORD TRANSIT CUSTOM"));
  assert.ok(message.includes("1995 cc"));
  assert.doesNotMatch(message, /1\.5|1\.6|2\.2|SID211/);
});
test("unavailable admission is explicit in WhatsApp despite a separate import date", () => {
  const message = createLookupQuoteMessage({locale: "nl", plate: "SYN008", vehicle: "SYNTHETIC DATE FIXTURE", firstAdmission: undefined, quote: {kind: "on-request", currency: "EUR", reasonCode: "test"}, stage: "Stage 2", options: ["Selected service"], matchStatus: "no-match"});
  assert.ok(message.includes("Eerste toelating: Niet beschikbaar"));
  assert.ok(message.includes("Stage: Stage 2"));
  assert.ok(message.includes("Extra opties: Selected service"));
});

const baselineIndex = process.argv.indexOf("--baseline");
const reportIndex = process.argv.indexOf("--report");
if (baselineIndex >= 0 && reportIndex >= 0) {
  const require = createRequire(import.meta.url);
  const baselineRoot = resolve(process.argv[baselineIndex + 1]);
  const baseline = require(resolve(baselineRoot, "src/data/catalog.ts")) as {
    findCatalogMatch: (input: {make?: string; model?: string; fuel?: string; powerHp?: number | null}) => {variant: {id: string; model: string; engine: string; stages: {name: string; price: number}[]}; confidence: number} | null;
  };
  const baselinePricing = require(resolve(baselineRoot, "src/data/pricing.ts")) as {
    getPublicStagePrice: (vehicle: {id: string}, stage: {name: string; price: number}) => number;
  };
  const report = {
    source: "Sanitized deterministic RDW fixtures and representative synthetic curated fixtures",
    officialFixtureRetrievedAt: "2026-09-15T09:52:43Z",
    provenance: ["https://opendata.rdw.nl/resource/m9d7-ebf2.json", "https://opendata.rdw.nl/resource/8ys7-d773.json"],
    baselineSha: "4d12e510953fb57c3f8f84a737880ff860a617e7",
    generatedAt: new Date().toISOString(),
    fixtures: quoteResults.map(({fixture, result, access, baseQuote, quote, message}) => {
      const old = baseline.findCatalogMatch({make: fixture.vehicle.merk, model: fixture.vehicle.handelsbenaming, fuel: result.vehicle.fuel, powerHp: result.vehicle.engine.powerHp});
      return {
        syntheticId: fixture.id, facts: result.vehicle,
        baseline: old ? {status: "matched", id: old.variant.id, model: old.variant.model, engine: old.variant.engine, confidence: old.confidence, sourceStage1Price: old.variant.stages[0].price, publicStage1Price: baselinePricing.getPublicStagePrice(old.variant, old.variant.stages[0])} : {status: "no-match", uiHardcodedStage1Fallback: 269},
        current: {status: result.tuningMatch.status, id: result.tuningMatch.variant?.id, reasonCodes: result.tuningMatch.reasonCodes, candidates: result.tuningMatch.candidates, access, baseQuote, selectedOptions: [{id: "egr", name: "EGR off", priceCents: 14900}], quote, dutchWhatsApp: message}
      };
    })
  };
  const reportPath = resolve(process.argv[reportIndex + 1]);
  mkdirSync(dirname(reportPath), {recursive: true});
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote sanitized matcher/quote comparison to ${reportPath}`);
}
console.log(`${passed} executable RDW identity regressions passed.`);
