import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import {engineCatalog, vehicleDatabase} from "../src/data/catalog.ts";
import {customerProfile, customerVehicle} from "../src/lib/customer-profile.ts";
import {getCatalogEstimateProfile} from "../src/data/tuning-estimates-shared.ts";

const publicStageNames = ["Stage 1", "Stage 2"];
const trustedProvenance = new Set(["reference", "single-source", "multi-source"]);

for (const vehicle of engineCatalog) {
  const safe = customerVehicle(vehicle);
  assert.deepEqual(
    safe.stages.map(stage => stage.name),
    publicStageNames,
    `${vehicle.id}: customer catalog exposes Stage 1 and Stage 2 only`
  );

  for (const stage of safe.stages) {
    const hasNumericOutput =
      stage.powerHp !== undefined ||
      stage.torqueNm !== undefined ||
      stage.powerRangeHp !== undefined ||
      stage.torqueRangeNm !== undefined;

    if (hasNumericOutput) {
      assert.ok(
        trustedProvenance.has(stage.provenance ?? ""),
        `${vehicle.id} ${stage.name}: customer numeric output must be source-backed`
      );
    }
  }
}

const reviewedBmw = customerVehicle(engineCatalog.find(vehicle => vehicle.id === "bmw-320d-b47")!);
assert.deepEqual(reviewedBmw.stages[0].powerRangeHp, [220, 225]);
assert.deepEqual(reviewedBmw.stages[0].torqueRangeNm, [440, 460]);

const fakeCanonical = vehicleDatabase.find(vehicle => vehicle.id === "volkswagen-golf-2-0-bitdi-2019");
assert.ok(fakeCanonical, "known generated Volkswagen 204 hp cross-product exists for regression coverage");
assert.equal(fakeCanonical.stockPowerHp, 204);
assert.equal(fakeCanonical.stages[1].powerHp, 275, "raw generated evidence remains internal for audit");

const safeCanonical = customerProfile({
  ...getCatalogEstimateProfile(fakeCanonical),
  vehicleId: undefined,
  provenance: "canonical-estimated"
});
assert.deepEqual(safeCanonical.stages.map(stage => stage.name), publicStageNames);
for (const stage of safeCanonical.stages) {
  assert.equal(stage.powerHp, undefined);
  assert.equal(stage.torqueNm, undefined);
  assert.equal(stage.powerRangeHp, undefined);
  assert.equal(stage.torqueRangeNm, undefined);
  assert.equal(stage.quoteRequired, true);
}

const publicRouteCount = 3 + engineCatalog.length * 3 + engineCatalog.length * publicStageNames.length * 3;
assert.equal(publicRouteCount, 219);

const sitemapSource = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
assert.match(sitemapSource, /isPublicCatalogStageName/);

const stagePageSource = readFileSync(
  new URL("../src/app/[locale]/[brand]/[model]/[engine]/[stage]/page.tsx", import.meta.url),
  "utf8"
);
assert.match(stagePageSource, /stageName === "Stage 3\+"/);
assert.match(stagePageSource, /permanentRedirect\(stageSeoPath\(safeLocale, vehicle, "Stage 2"\)\)/);

const logoSource = readFileSync(new URL("../src/components/noordtune-logo.tsx", import.meta.url), "utf8");
assert.match(logoSource, /noordtune-logo-dark\.svg/);
for (const asset of [
  "../public/brand/noordtune-logo-dark.svg",
  "../public/favicon.svg",
  "../public/favicon.ico",
  "../public/apple-touch-icon.png",
  "../public/site.webmanifest"
]) {
  assert.ok(existsSync(new URL(asset, import.meta.url)), `${asset}: branding asset exists`);
}

console.log("Customer catalog safety PASS: generated/canonical numeric fallbacks withheld, Stage 3 removed from customer catalog, 219 public routes, branding assets installed.");
