import assert from "node:assert/strict";
import {
  getBrands,
  getModelsForBrand,
  getVehicleSelectorItems,
  getYearsForModel,
  searchVehicleSelectorItems
} from "../src/data/catalog.ts";
import {
  catalogTaxonomyV2,
  catalogTaxonomyV2Count,
  catalogTaxonomyV2Source
} from "../src/data/catalog-taxonomy-v2.ts";

assert.equal(catalogTaxonomyV2Count, 4592);
assert.equal(catalogTaxonomyV2.length, catalogTaxonomyV2Count);
assert.equal(new Set(catalogTaxonomyV2.map(row => row.id)).size, catalogTaxonomyV2Count);
assert.equal(catalogTaxonomyV2Source.provider, "V-Tech");
assert.equal(catalogTaxonomyV2Source.role, "taxonomy-only");

assert.equal(
  catalogTaxonomyV2.find(row => row.brand === "BMW" && row.model === "1" && row.generation === "F40" && /118d/.test(row.engine))?.fuel,
  "Diesel"
);
assert.equal(
  catalogTaxonomyV2.find(row => row.brand === "Audi" && row.model === "A4" && /1\.8 TFSI/.test(row.engine))?.fuel,
  "Petrol"
);
assert.equal(
  catalogTaxonomyV2.find(row => row.brand === "Alfa Romeo" && /JTDm/.test(row.engine))?.fuel,
  "Diesel"
);
for (const [marker, expectedFuel] of [
  ["BiTDI", "Diesel"],
  ["CRD", "Diesel"],
  ["DI-D", "Diesel"],
  ["TiD", "Diesel"],
  ["MZR-CD", "Diesel"],
  ["1.3TDCi", "Diesel"],
  ["BlueTDI", "Diesel"],
  ["MultiJet2", "Diesel"],
  ["324td", "Diesel"],
  ["VTi", "Petrol"],
  ["Kompressor", "Petrol"],
  ["Ti-VCT", "Petrol"],
  ["2.0TSI", "Petrol"],
  ["318Ci", "Petrol"]
] as const) {
  const row = catalogTaxonomyV2.find(item => item.engine.toLowerCase().includes(marker.toLowerCase()));
  assert.ok(row, `expected taxonomy marker ${marker}`);
  assert.equal(row.fuel, expectedFuel, `${marker} fuel classification`);
}
assert.ok(
  catalogTaxonomyV2
    .filter(row => row.brand === "MINI" && /(?:Cooper|One) (?:D|SD)\b/i.test(row.engine))
    .every(row => row.fuel === "Diesel"),
  "MINI Cooper/One D and SD variants must not be classified as petrol"
);

assert.ok(getBrands().includes("Volkswagen"));
assert.ok(getBrands().includes("BMW"));

const vwModels = getModelsForBrand("Volkswagen");
assert.ok(vwModels.includes("Golf"));
assert.ok(vwModels.includes("Transporter"));
assert.ok(!vwModels.includes("Golf 2.0 BiTDI"), "legacy model×trim cross-product must not become a model option");

assert.ok(getYearsForModel("Volkswagen", "Golf").includes(2019));

const golf2019 = getVehicleSelectorItems({brand: "Volkswagen", model: "Golf", year: 2019}, 50);
assert.ok(golf2019.length > 0);
assert.ok(golf2019.some(item => item.kind === "taxonomy"));
assert.ok(
  !golf2019.some(item => /BiTDI/i.test(item.engine)),
  "2019 Golf selector must not contain the generated 2.0 BiTDI cross-product"
);
assert.ok(
  golf2019.filter(item => item.kind === "taxonomy").every(item => item.quote.kind === "on-request"),
  "taxonomy discovery rows cannot carry an automatic NoordTune quote"
);

const transporter2019 = getVehicleSelectorItems({brand: "Volkswagen", model: "Transporter", year: 2019}, 50);
assert.ok(
  transporter2019.some(item => item.kind === "taxonomy" && /204\s*KM/i.test(item.engine)),
  "real 204 hp T6/T6.1 Transporter taxonomy should remain selectable"
);

const fakeQuickSearch = searchVehicleSelectorItems("Volkswagen Golf 2.0 BiTDI 2019", 10);
assert.ok(
  !fakeQuickSearch.some(item => /BiTDI/i.test(item.engine)),
  "quick search must not fall back to legacy generated cross-products"
);

const realQuickSearch = searchVehicleSelectorItems("Volkswagen Transporter 204", 10);
assert.ok(realQuickSearch.some(item => item.kind === "taxonomy"));

console.log(
  `Selector taxonomy V2 PASS: ${catalogTaxonomyV2Count} real discovery rows; generated Golf BiTDI 204 removed from customer selector while real Transporter 204 remains discoverable.`
);
