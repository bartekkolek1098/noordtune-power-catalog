import assert from "node:assert/strict";
import {readdirSync, readFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {
  engineCatalog,
  getVehicleSeoSlugs,
  stageSlugMap
} from "../src/data/catalog.ts";
import {isPublicCatalogStageName} from "../src/data/catalog-shared.ts";
import {featuredCatalogCars} from "../src/data/homepage.ts";
import {nlStage1EngineProfiles,nlStage1EnginePath} from "../src/data/nl-stage1-engine-seo.ts";
import {nlModelFamilyHubs,nlModelHubPath} from "../src/data/nl-model-family-seo.ts";
import {nlVanModels,nlVanModelPath,nlVanEnginePath} from "../src/data/nl-vans-seo.ts";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {routing} from "../src/i18n/routing.ts";
import {
  localizedBusinessLocation,
  NOORDTUNE_BUSINESS
} from "../src/lib/business-info.ts";
import {formatEstimatePower} from "../src/lib/estimate-copy.ts";
import {quoteOfferFields} from "../src/lib/quote-offer.ts";
import {
  brandedSeoTitle,
  homepageMetadataCopy,
  stageMetadataCopy,
  vehicleMetadataCopy
} from "../src/lib/seo-copy.ts";
import {applyStageHardwarePolicy} from "../src/lib/stage-hardware-policy.ts";

const expectedRoutes = [
  ...routing.locales.flatMap((locale) => [
  `/${locale}`,
  ...engineCatalog.map((vehicle) => `/${locale}/vehicles/${vehicle.id}`),
  ...engineCatalog.flatMap((vehicle) => {
    const slugs = getVehicleSeoSlugs(vehicle);

    return vehicle.stages.filter((stage) => isPublicCatalogStageName(stage.name)).map(
      (stage) =>
        `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`
    );
  })
]),
  "/nl/motoren",
  ...nlStage1EngineProfiles.map(p=>nlStage1EnginePath(p.slug)),
  "/nl/modellen",
  ...nlModelFamilyHubs.map(h=>nlModelHubPath(h.slug)),
  "/nl/bedrijfswagens",
  ...nlVanModels.map(m=>nlVanModelPath(m.slug)),
  ...nlVanEngines.map(e=>nlVanEnginePath(e.slug))
];

assert.equal(engineCatalog.length, 24, "The curated public catalog must stay at 24 vehicles");
assert.equal(expectedRoutes.length, 288, "The sitemap includes 248 previous routes plus 21 curated NL van URLs");
assert.equal(new Set(expectedRoutes).size, 288, "Every public sitemap route must be unique");

const publicIds = new Set(engineCatalog.map((vehicle) => vehicle.id));
const popularPublicIds = new Set(
  featuredCatalogCars.map((car) => car.detailId).filter((id) => publicIds.has(id))
);
const additionalIds = engineCatalog
  .filter((vehicle) => !featuredCatalogCars.some((car) => car.detailId === vehicle.id))
  .map((vehicle) => vehicle.id);
assert.equal(popularPublicIds.size, 3, "The compact photo section must show three curated profiles");
assert.equal(additionalIds.length, 21, "The compact crawl-link group must retain the other 21 profiles");
assert.deepEqual(
  new Set([...popularPublicIds, ...additionalIds]),
  publicIds,
  "The homepage link groups must cover every curated vehicle"
);

for (const locale of routing.locales) {
  assert.match(homepageMetadataCopy(locale).title, /RDW|rdw/i);
  assert.equal(count(brandedSeoTitle(homepageMetadataCopy(locale).title), "NoordTune"), 1);

  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const vehicle of engineCatalog) {
    const vehicleCopy = vehicleMetadataCopy(locale, vehicle);
    assert.ok(vehicleCopy.title.includes(vehicle.brand));
    assert.ok(vehicleCopy.title.includes(vehicle.model));
    assert.ok(!vehicleCopy.title.includes("NoordTune"));
    assert.ok(vehicleCopy.description.includes(vehicle.engine));
    assert.equal(count(brandedSeoTitle(vehicleCopy.title), "NoordTune"), 1);
    assert.ok(!titles.has(vehicleCopy.title), `Duplicate ${locale} title: ${vehicleCopy.title}`);
    assert.ok(
      !descriptions.has(vehicleCopy.description),
      `Duplicate ${locale} description: ${vehicleCopy.description}`
    );
    titles.add(vehicleCopy.title);
    descriptions.add(vehicleCopy.description);

    for (const stage of vehicle.stages.filter((candidate) => isPublicCatalogStageName(candidate.name))) {
      const stageCopy = stageMetadataCopy(locale, vehicle, stage);
      const displayStage = applyStageHardwarePolicy([stage])[0];
      const quote = resolveStageQuote(vehicle, displayStage);
      const offer = quoteOfferFields(quote, locale);

      assert.ok(stageCopy.title.includes(vehicle.brand));
      assert.ok(stageCopy.title.includes(vehicle.model));
      assert.ok(stageCopy.title.includes(stage.name));
      assert.ok(!stageCopy.title.includes("NoordTune"));
      assert.ok(stageCopy.description.includes(formatEstimatePower(displayStage, locale)));
      assert.equal(count(brandedSeoTitle(stageCopy.title), "NoordTune"), 1);
      assert.ok(!titles.has(stageCopy.title), `Duplicate ${locale} title: ${stageCopy.title}`);
      assert.ok(
        !descriptions.has(stageCopy.description),
        `Duplicate ${locale} description: ${stageCopy.description}`
      );
      titles.add(stageCopy.title);
      descriptions.add(stageCopy.description);

      if (quote.kind === "on-request") {
        assert.ok(!("price" in offer), `${vehicle.id} ${stage.name} must not publish a numeric offer`);
        assert.ok(!("priceSpecification" in offer));
      } else {
        assert.equal(offer.price, (quote.amountCents / 100).toFixed(2));
        assert.equal(offer.priceCurrency, quote.currency);
      }

      if (displayStage.customHardware) {
        assert.equal(displayStage.powerHp, undefined);
        assert.equal(displayStage.powerRangeHp, undefined);
        assert.match(stageCopy.description, /Maatwerk|Custom|Indywidualnie/);
      }
    }
  }
}

assert.deepEqual(
  routing.locales.map((locale) => localizedBusinessLocation(locale)),
  ["Assen, Nederland", "Assen, Netherlands", "Assen, Holandia"]
);
assert.deepEqual(NOORDTUNE_BUSINESS.address, {locality: "Assen", countryCode: "NL"});

const sitemapSource = readFileSync(resolve("src/app/sitemap.ts"), "utf8");
assert.ok(!sitemapSource.includes("new Date("), "Sitemap must not use request/build time as content time");
assert.ok(!sitemapSource.includes("lastModified"), "Sitemap must omit unsupported modification dates");

const runtimeSource = listFiles(resolve("src"))
  .filter((path) => /\.(?:ts|tsx)$/.test(path))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
assert.ok(!runtimeSource.includes("A. Vogelstraat 1"), "Unconfirmed street address leaked into runtime source");
assert.ok(!runtimeSource.includes("9406 XD"), "Unconfirmed postcode leaked into runtime source");

console.log(
  `SEO polish tests passed: ${expectedRoutes.length} unique routes, ${engineCatalog.length} vehicles, localized metadata, honest offers and 24/24 crawl links.`
);

function count(value: string, search: string) {
  return value.split(search).length - 1;
}

function listFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? listFiles(path) : [path];
  });
}
