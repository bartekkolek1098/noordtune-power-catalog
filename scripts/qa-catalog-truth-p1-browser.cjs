/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fixtures = require("./fixtures/catalog-truth-p1.json");
const {engineCatalog, getVehicleSeoSlugs, stageSlugMap} = require("../src/data/catalog.ts");

const base = process.env.P1_QA_URL || "http://localhost:3145";
const output = path.join(process.cwd(), ".git", "catalog-truth-p1-browser");
const executablePath = [process.env.PLAYWRIGHT_EXECUTABLE, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"]
  .find(file => file && fs.existsSync(file));
const labels = {
  nl: {pending: "Te bevestigen", custom: "Maatwerk / hardware-afhankelijk", request: "Prijs op aanvraag", unit: "pk"},
  en: {pending: "To be confirmed", custom: "Custom / hardware-dependent", request: "Price on request", unit: "hp"},
  pl: {pending: "Do potwierdzenia", custom: "Indywidualnie / zależnie od osprzętu", request: "Wycena indywidualna", unit: "KM"}
};
const forbidden = /SUPPORTED_POINT|SUPPORTED_RANGE|CUSTOM_ON_REQUEST|WITHHOLD|source ID|resolver code|research note|source consensus|undefined|NaN/;
const report = {
  method: "Local production build with genuine page interactions. WhatsApp URLs were inspected without navigation; no message was sent.",
  vehiclePages: [], stageRoutes: [], localeSpots: [], screenshots: [], errors: []
};

function expectedStage1(fixture, locale) {
  if (fixture.stage1.kind === "WITHHELD") return [labels[locale].pending];
  if (fixture.stage1.kind === "RANGE") return [
    `${fixture.stage1.output[0][0]}–${fixture.stage1.output[0][1]} ${labels[locale].unit}`,
    `${fixture.stage1.output[1][0]}–${fixture.stage1.output[1][1]} Nm`
  ];
  return [`≈${fixture.stage1.output[0]} ${labels[locale].unit}`, `≈${fixture.stage1.output[1]} Nm`];
}
function whatsappText(href) { return new URL(href).searchParams.get("text") || ""; }
function assertIncludes(text, fragments, label) {
  for (const fragment of fragments) assert.ok(text.includes(fragment), `${label}: missing ${fragment}`);
}
function monitor(page, location) {
  page.on("pageerror", error => report.errors.push(`${location}: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") report.errors.push(`${location}: ${message.text()}`); });
}
async function assertNoOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal overflow`);
}
async function selectStage(page, fixture, index, locale) {
  const section = page.locator("#tuning-calculator");
  const aside = section.locator("aside");
  const stageName = ["Stage 1", "Stage 2", "Stage 3+"][index];
  await aside.locator("button").filter({hasText: stageName}).click();
  const quoteLink = section.getByTestId("vehicle-recommendation-quote");
  const href = await quoteLink.getAttribute("href");
  const draft = whatsappText(href);
  assertIncludes(draft, [stageName], `${fixture.id}/${locale}/${stageName} WhatsApp`);
  assert.doesNotMatch(draft, forbidden);
  const visible = await aside.innerText();
  const price = await aside.locator("div.text-4xl").innerText();
  if (index === 0 && fixture.stage1.kind !== "WITHHELD") {
    assertIncludes(visible, expectedStage1(fixture, locale), `${fixture.id}/${locale} Stage 1 output`);
    assertIncludes(draft, expectedStage1(fixture, locale), `${fixture.id}/${locale} Stage 1 draft`);
    assert.ok(price.includes(String(fixture.stage1.priceCents / 100)), `${fixture.id}/${locale}: Stage 1 price`);
    assert.ok(draft.includes(price), `${fixture.id}/${locale}: Stage 1 visible/draft quote parity`);
  } else {
    assertIncludes(visible, [index === 0 ? labels[locale].pending : labels[locale].custom], `${fixture.id}/${locale}/${stageName} output`);
    assert.equal(price, labels[locale].request, `${fixture.id}/${locale}/${stageName}: on-request price`);
    assert.ok(!/\b(?:269|299|449|549|700|899)\b/.test(draft), `${fixture.id}/${locale}/${stageName}: no numeric software quote`);
  }
  assert.equal(page.url().startsWith(base), true, "inspecting a WhatsApp draft must not navigate or send");
}

(async () => {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {})});
  try {
    for (const fixture of fixtures) {
      const vehicle = engineCatalog.find(item => item.id === fixture.id);
      assert.ok(vehicle, fixture.id);
      const page = await browser.newPage({viewport: {width: 390, height: 900}, reducedMotion: "reduce"});
      monitor(page, `nl/${fixture.id}`);
      const vehiclePath = `/nl/vehicles/${fixture.id}`;
      const response = await page.goto(base + vehiclePath, {waitUntil: "networkidle"});
      assert.equal(response.status(), 200, vehiclePath);
      assert.equal(await page.locator("h1").count(), 1);
      const body = await page.locator("main").innerText();
      assertIncludes(body, [vehicle.configurationNote.nl, fixture.ecuFamily, `${fixture.stock[0]} pk`], `${fixture.id}: NL facts`);
      assert.doesNotMatch(body, forbidden);
      await page.getByTestId("catalog-power-chart").waitFor();
      for (let index = 0; index < 3; index++) await selectStage(page, fixture, index, "nl");
      await assertNoOverflow(page, fixture.id);
      const screenshot = `nl-${fixture.id}-390.png`;
      await page.locator("#tuning-calculator").screenshot({path: path.join(output, screenshot)});
      report.screenshots.push(screenshot);
      report.vehiclePages.push({locale: "nl", id: fixture.id, width: 390, stagesChecked: 3, whatsappDraftOnly: true});

      const slugs = getVehicleSeoSlugs(vehicle);
      for (const [index, stageName] of ["Stage 1", "Stage 2", "Stage 3+"].entries()) {
        const route = `/nl/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stageName]}`;
        const stageResponse = await page.goto(base + route, {waitUntil: "networkidle"});
        assert.equal(stageResponse.status(), 200, route);
        const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)));
        const structuredVehicle = jsonLd.find(item => item["@type"] === "Vehicle");
        assert.ok(structuredVehicle?.offers, `${route}: structured Offer`);
        if (index === 0 && fixture.stage1.priceCents !== null) {
          assert.equal(structuredVehicle.offers.price, (fixture.stage1.priceCents / 100).toFixed(2), `${route}: structured price`);
        } else {
          assert.equal(structuredVehicle.offers.price, undefined, `${route}: on-request Offer omits numeric price`);
        }
        const draft = whatsappText(await page.getByTestId("vehicle-recommendation-quote").getAttribute("href"));
        assertIncludes(draft, [stageName], `${route}: direct route selection`);
        assert.doesNotMatch(await page.locator("main").innerText(), forbidden);
        await assertNoOverflow(page, route);
        report.stageRoutes.push({route, stageName, structuredOffer: true});
      }
      await page.close();
    }

    for (const [locale, fixtureId, width] of [["en", "ford-focus-st-20-ecoboost", 768], ["pl", "seat-leon-cupra-5f-20-tsi-300", 1440]]) {
      const fixture = fixtures.find(item => item.id === fixtureId);
      const vehicle = engineCatalog.find(item => item.id === fixtureId);
      const page = await browser.newPage({viewport: {width, height: 950}, reducedMotion: "reduce"});
      monitor(page, `${locale}/${fixtureId}`);
      const response = await page.goto(`${base}/${locale}/vehicles/${fixtureId}`, {waitUntil: "networkidle"});
      assert.equal(response.status(), 200);
      const body = await page.locator("main").innerText();
      assertIncludes(body, [vehicle.configurationNote[locale], fixture.ecuFamily, `${fixture.stock[0]} ${labels[locale].unit}`, ...expectedStage1(fixture, locale)], `${locale}/${fixtureId}`);
      assert.doesNotMatch(body, forbidden);
      await selectStage(page, fixture, 0, locale);
      await selectStage(page, fixture, 1, locale);
      await assertNoOverflow(page, `${locale}/${fixtureId}`);
      report.localeSpots.push({locale, id: fixtureId, width, stage1And2: true});
      await page.close();
    }

    const sitemapPage = await browser.newPage();
    const sitemapResponse = await sitemapPage.request.get(base + "/sitemap.xml");
    assert.equal(sitemapResponse.status(), 200);
    const xml = await sitemapResponse.text();
    assert.equal((xml.match(/<loc>/g) || []).length, 291);
    await sitemapPage.close();
    assert.deepEqual(report.errors, [], report.errors.join("\n"));
    fs.writeFileSync(path.join(output, "receipt.json"), JSON.stringify({...report, sitemapUrls: 291}, null, 2) + "\n");
    console.log("P1 browser PASS: 5 NL vehicle pages, 15 NL Stage routes, EN/PL spot checks, 19 Stage interactions, structured Offers and sitemap 291; no console/page errors or outgoing messages.");
  } finally {
    await browser.close();
  }
})().catch(error => {
  fs.writeFileSync(path.join(output, "failed-receipt.json"), JSON.stringify({...report, failure: String(error)}, null, 2) + "\n");
  console.error(error);
  process.exitCode = 1;
});
