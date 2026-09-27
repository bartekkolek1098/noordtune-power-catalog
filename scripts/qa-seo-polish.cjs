/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");

const baseUrl = process.env.SEO_QA_URL || "http://127.0.0.1:3133";
const productionOrigin = "https://power.noordtune.nl";
const locales = ["nl", "en", "pl"];
const locationByLocale = {
  nl: "Assen, Nederland",
  en: "Assen, Netherlands",
  pl: "Assen, Holandia"
};

async function main() {
  const [{engineCatalog, getVehicleSeoSlugs, stageSlugMap}, pricing, stagePolicy, quoteOffer] =
    await Promise.all([
      import("../src/data/catalog.ts"),
      import("../src/data/pricing.ts"),
      import("../src/lib/stage-hardware-policy.ts"),
      import("../src/lib/quote-offer.ts")
    ]);
  const stageByPath = new Map();

  for (const locale of locales) {
    for (const vehicle of engineCatalog) {
      const slugs = getVehicleSeoSlugs(vehicle);
      for (const stage of vehicle.stages) {
        stageByPath.set(
          `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`,
          {locale, vehicle, stage}
        );
      }
    }
  }

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200, "sitemap.xml must return HTTP 200");
  const sitemapXml = await sitemapResponse.text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    decodeEntities(match[1])
  );
  assert.equal(sitemapUrls.length, 291, "sitemap.xml must contain 291 URLs");
  assert.equal(new Set(sitemapUrls).size, 291, "sitemap.xml URLs must be unique");
  assert.ok(!/<lastmod>/i.test(sitemapXml), "sitemap.xml must omit unsupported lastmod values");
  assert.ok(sitemapUrls.every((url) => url.startsWith(`${productionOrigin}/`)));
  assert.ok(sitemapUrls.every((url) => !url.includes("?") && !url.includes("vercel.app")));

  const pages = await concurrentMap(sitemapUrls, 8, async (canonical) => {
    const path = new URL(canonical).pathname;
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
    const html = await response.text();
    const title = decodeEntities(requiredMatch(html, /<title>([\s\S]*?)<\/title>/i, `${path} title`));
    const description = metaDescription(html, path);
    const links = linkTags(html);
    const canonicalLinks = links.filter((link) => relTokens(link).includes("canonical"));
    const alternates = links.filter(
      (link) => relTokens(link).includes("alternate") && link.hreflang
    );
    const locale = path.split("/")[1];
    const pathWithoutLocale = path.slice(locale.length + 1);

    assert.equal(canonicalLinks.length, 1, `${path} must have one canonical`);
    assert.equal(canonicalLinks[0].href, canonical, `${path} canonical mismatch`);
    assert.equal(alternates.length, 3, `${path} must have three locale alternates`);
    assert.deepEqual(
      Object.fromEntries(alternates.map((link) => [link.hreflang, link.href])),
      Object.fromEntries(
        locales.map((alternateLocale) => [
          alternateLocale,
          `${productionOrigin}/${alternateLocale}${pathWithoutLocale}`
        ])
      ),
      `${path} hreflang set mismatch`
    );
    assert.equal(count(title, "NoordTune"), 1, `${path} must have one title brand suffix`);
    assert.ok(title.length > 10, `${path} title is too short`);
    assert.ok(description.length > 50, `${path} description is too short`);
    assert.ok(!/undefined|NaN|vercel\.app|localhost/i.test(`${title} ${description}`));
    assert.ok(!/A\. Vogelstraat 1|9406 XD/.test(html), `${path} leaks unconfirmed address data`);
    assert.ok(html.includes(locationByLocale[locale]), `${path} lacks localized public location`);
    assert.ok(!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html), `${path} is noindex`);

    const jsonLd = jsonLdBlocks(html, path);
    assert.ok(jsonLd.length > 0, `${path} must include JSON-LD`);
    const providers = jsonLd.flatMap(findObjects).filter((item) => item["@type"] === "AutoRepair");
    for (const provider of providers) {
      assert.equal(provider.name, "NoordTune");
      assert.equal(provider.url, "https://www.noordtune.nl");
      assert.equal(provider.telephone, "+31685759600");
      assert.equal(provider.email, "info@noordtune.nl");
      assert.deepEqual(provider.address, {
        "@type": "PostalAddress",
        addressLocality: "Assen",
        addressCountry: "NL"
      });
    }

    const breadcrumbs = jsonLd.filter((item) => item["@type"] === "BreadcrumbList");
    for (const breadcrumb of breadcrumbs) {
      const items = breadcrumb.itemListElement;
      assert.ok(Array.isArray(items) && items.length >= 3, `${path} breadcrumb is incomplete`);
      assert.equal(items.at(-1).item, canonical, `${path} breadcrumb must end at canonical URL`);
      assert.ok(
        items.every(
          (item) =>
            typeof item.item === "string" &&
            (item.item.startsWith(productionOrigin) || item.item.startsWith("https://www.noordtune.nl"))
        ),
        `${path} breadcrumb contains a non-public URL`
      );
    }

    const stageContext = stageByPath.get(path);
    if (stageContext) {
      const vehicleSchema = jsonLd.find((item) => item["@type"] === "Vehicle");
      assert.ok(vehicleSchema, `${path} lacks Vehicle JSON-LD`);
      const displayStage = stagePolicy.applyStageHardwarePolicy([stageContext.stage])[0];
      const quote = pricing.resolveStageQuote(stageContext.vehicle, displayStage);
      const expectedOffer = quoteOffer.quoteOfferFields(quote, stageContext.locale);
      for (const [key, value] of Object.entries(expectedOffer)) {
        assert.deepEqual(vehicleSchema.offers[key], value, `${path} Offer.${key} mismatch`);
      }
      if (quote.kind === "on-request") {
        assert.ok(!("price" in vehicleSchema.offers), `${path} fabricated a numeric price`);
        assert.ok(!("priceSpecification" in vehicleSchema.offers));
      }
    }

    return {path, locale, title, description, html};
  });

  for (const locale of locales) {
    const localePages = pages.filter((page) => page.locale === locale);
    assert.equal(localePages.length, 97, `${locale} must have 97 crawlable pages`);
    assert.equal(new Set(localePages.map((page) => page.title)).size, 97, `${locale} titles must be unique`);
    assert.equal(
      new Set(localePages.map((page) => page.description)).size,
      97,
      `${locale} descriptions must be unique`
    );

    const home = localePages.find((page) => page.path === `/${locale}`);
    assert.ok(home, `Missing ${locale} homepage`);
    const homeHrefs = new Set(anchorTags(home.html).map((link) => link.href));
    for (const vehicle of engineCatalog) {
      assert.ok(
        homeHrefs.has(`/${locale}/vehicles/${vehicle.id}`),
        `${locale} homepage does not link ${vehicle.id}`
      );
      const vehiclePage = localePages.find(
        (page) => page.path === `/${locale}/vehicles/${vehicle.id}`
      );
      assert.ok(vehiclePage, `Missing ${locale} vehicle page for ${vehicle.id}`);
      const vehicleHrefs = new Set(anchorTags(vehiclePage.html).map((link) => link.href));
      const slugs = getVehicleSeoSlugs(vehicle);
      for (const stage of vehicle.stages) {
        const stagePath = `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`;
        assert.ok(vehicleHrefs.has(stagePath), `${vehicle.id} does not link ${stage.name} in ${locale}`);
      }
    }
  }

  console.log(
    `SEO production crawl passed: ${pages.length}/291 HTTP 200, 291 canonicals, 873 hreflang links, unique titles/descriptions, truthful JSON-LD and 24/24 vehicle link coverage.`
  );
}

function requiredMatch(value, pattern, label) {
  const match = value.match(pattern);
  assert.ok(match, `Missing ${label}`);
  return match[1];
}

function metaDescription(html, path) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const descriptions = tags.filter((tag) => tag.name === "description");
  assert.equal(descriptions.length, 1, `${path} must have one description`);
  return decodeEntities(descriptions[0].content || "");
}

function linkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
}

function anchorTags(html) {
  return [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => attributes(match[0]));
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function relTokens(link) {
  return (link.rel || "").toLowerCase().split(/\s+/).filter(Boolean);
}

function jsonLdBlocks(html, path) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        throw new Error(`${path} has invalid JSON-LD: ${error.message}`);
      }
    }
  );
}

function findObjects(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(findObjects);
  return [value, ...Object.values(value).flatMap(findObjects)];
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
}

function count(value, search) {
  return value.split(search).length - 1;
}

async function concurrentMap(values, concurrency, action) {
  const results = new Array(values.length);
  let index = 0;

  async function worker() {
    while (index < values.length) {
      const current = index++;
      results[current] = await action(values[current], current);
    }
  }

  await Promise.all(Array.from({length: concurrency}, worker));
  return results;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
