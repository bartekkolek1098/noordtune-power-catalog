import assert from "node:assert/strict";
import {getManualCatalogResult} from "../src/lib/manual-catalog-result.ts";
import {catalogTaxonomyV2} from "../src/data/catalog-taxonomy-v2.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";

const row = catalogTaxonomyV2.find(row => row.brand === "BMW" && row.model === "1" && row.generation === "F40" && row.engine.includes("118i") && row.stockPowerHp === 140)!;
assert.ok(row, "Customer's BMW 118i 140 F40 is in the real catalog");
const original = JSON.stringify(sourcedTuningProfiles.find(p => p.id === "sourced-bmw-1-series-d2f9ef15e2da"));
const actual = getManualCatalogResult(row.id, 2021)!;
assert.equal(actual.status, "source-comparison");
assert.equal(actual.vehicle.selectedYear, 2021);
assert.equal(actual.vehicle.stockPowerHp, 140);
assert.equal(actual.vehicle.stockPowerKw, 103);
assert.deepEqual(actual.stage1?.powerHp, [170, 180]);
assert.deepEqual(actual.stage1?.torqueNm, [260, 300]);
assert.equal(actual.stage1?.stockTorqueNm, 220);
assert.deepEqual(actual.sources.map(s => [s.powerHp, s.torqueNm]), [[180, 260], [170, 300]], "Preserve each supplier's own pair, not an invented blended tune");
assert.ok(actual.fuelRon.includes(98));
assert.ok(actual.sources.every(s => s.url.startsWith("https://") && !s.url.includes("vtech")), "Taxonomy discovery is not tuning evidence");
assert.ok(!("registeredPower" in actual.vehicle) && !("plate" in actual.vehicle), "Manual choices cannot fabricate RDW identity");
assert.equal(original, JSON.stringify(sourcedTuningProfiles.find(p => p.id === actual.sourceProfileId)), "Does not mutate source database");
const missingYear = getManualCatalogResult(row.id)!;
assert.equal(missingYear.status, "select-year");
assert.equal(missingYear.stage1, undefined);
assert.equal(missingYear.vehicle.stockPowerHp, 140, "Quick search still returns known catalog specs");
assert.equal(getManualCatalogResult(row.id, 2018), undefined);
assert.equal(getManualCatalogResult(row.id, NaN), undefined);
assert.equal(getManualCatalogResult(row.id, 2021.5), undefined);
assert.equal(getManualCatalogResult("../../unknown", 2021), undefined);
assert.equal(getManualCatalogResult(row.id, 2026)?.stage1, undefined, "Do not extend source-year scope to broad discovery year range");
const differentOutput = catalogTaxonomyV2.find(r => r.brand === "BMW" && r.model === "1" && r.generation === "F40" && r.engine.includes("118i") && r.stockPowerHp === 136)!;
const other = getManualCatalogResult(differentOutput.id, 2021)!;
assert.notEqual(other.sourceProfileId, actual.sourceProfileId, "118i 136 cannot borrow 118i 140 output");
assert.equal(getManualCatalogResult("unknown-electric-id", 2021), undefined);
assert.ok(other.vehicle.engine, "Pending tuning still returns known catalog specifications");
let checked = 0;
for (const selected of catalogTaxonomyV2.filter((_, i) => i % 101 === 0)) {
 const result = getManualCatalogResult(selected.id, selected.yearFrom)!;
 assert.equal(result.vehicle.id, selected.id);
 if (result.stage1) {
  assert.ok(result.sources.length > 0);
  assert.ok(result.stage1.powerHp.every(n => n > selected.stockPowerHp!));
  assert.ok(result.sourceProfileId);
 }
 checked++;
}
console.log("MANUAL_CATALOG_RESULT_PASS", JSON.stringify({customerBMW: true, yearAndPowerGuards: true, noRDWFabrication: true, sampleSelections: checked, sourceFiguresUnchanged: true}));
