/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fixtures = require("./fixtures/catalog-truth-p0.json");
const {engineCatalog, stageSlugMap} = require("../src/data/catalog.ts");
const {technicalFamilyLabel} = require("../src/lib/technical-identity-copy.ts");
const base = process.env.P0_QA_URL || "http://localhost:3144";
const output = path.join(process.cwd(), ".git", "catalog-truth-p0-browser");
const executablePath = [process.env.PLAYWRIGHT_EXECUTABLE, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(file => file && fs.existsSync(file));
const labels = {
  nl: {pending: "Te bevestigen", custom: "Maatwerk / hardware-afhankelijk", request: "Prijs op aanvraag", unit: "pk"},
  en: {pending: "To be confirmed", custom: "Custom / hardware-dependent", request: "Price on request", unit: "hp"},
  pl: {pending: "Do potwierdzenia", custom: "Indywidualnie / zależnie od osprzętu", request: "Wycena indywidualna", unit: "KM"}
};
const forbidden = /SOURCE_OWNER_REVIEW|HARDWARE_SCOPE_REVIEW|PUBLIC_CONFIGURATION_CONFIRMATION|factory-b47|shiftech-\d|source-voting|source consensus|no recursive Stage multipliers|Dokładne stockkoppel|undefined|NaN/;
const report = {method: "Genuine local production pages and interactions; fixture identities only, no live registrations or outgoing messages. WhatsApp destinations inspected without navigation.", vehicles: [], stageRoutes: [], options: [], homes: [], screenshots: [], errors: []};
function rangeLabel(range, unit) { return range[0] === range[1] ? `≈${range[0]} ${unit}` : `${range[0]}–${range[1]} ${unit}`; }
function expectedOutput(fixture, index, locale) {
  if (index === 2 || (index === 1 && fixture.stage2Action === "CUSTOM_ON_REQUEST")) return [labels[locale].custom];
  if (index === 1) return fixture.stage2 ? [`≈${fixture.stage2[0]} ${labels[locale].unit}`, `≈${fixture.stage2[1]} Nm`] : [labels[locale].pending];
  return fixture.stage1 ? [rangeLabel(fixture.stage1[0], labels[locale].unit), rangeLabel(fixture.stage1[1], "Nm")] : [labels[locale].pending];
}
function cents(fixture, index) { return index === 0 ? fixture.stage1Cents : index === 1 ? fixture.stage2Cents : null; }
function hasAll(text, fragments, name) { for (const fragment of fragments) assert.ok(text.includes(fragment), `${name}: missing ${fragment}`); }
function message(href) { return new URL(href).searchParams.get("text"); }
async function selected(page, fixture, index, locale) {
  const section = page.locator("#tuning-calculator");
  const aside = section.locator("aside");
  const stageName = ["Stage 1", "Stage 2", "Stage 3+"][index];
  await aside.locator("button").filter({hasText: stageName}).click();
  const quote = await section.getByTestId("vehicle-recommendation-quote").getAttribute("href");
  const quoteMessage = message(quote);
  hasAll(quoteMessage, [stageName, ...expectedOutput(fixture, index, locale)], `${fixture.id}/${locale} WhatsApp ${stageName}`);
  assert.doesNotMatch(quoteMessage, forbidden);
  const topPrice = await aside.locator("div.text-4xl").innerText();
  const amount = cents(fixture,index);
  if (amount === null) {
    assert.equal(topPrice, labels[locale].request, `${fixture.id}/${locale}/${stageName} request price`);
    assert.ok(!/\b(?:299|449|549|699|899)\b/.test(quoteMessage), "withheld quote must not restore a numeric base price");
  } else {
    assert.ok(topPrice.includes(String(amount / 100)), "deliberate price retained");
    assert.ok(quoteMessage.includes(topPrice), "WhatsApp agrees with visible price");
  }
  hasAll(await aside.innerText(), expectedOutput(fixture, index, locale), "visible calculator output");
  const vehicle = engineCatalog.find(vehicle => vehicle.id === fixture.id);
  const stageNote = vehicle.stages[index].customerNote?.[locale];
  if (stageNote) {
    hasAll(await section.innerText(),[stageNote],"Stage-specific reason/hardware in calculator");
    hasAll(quoteMessage,[stageNote],"Stage-specific reason/hardware in WhatsApp draft");
  }
  const sticky = section.getByTestId("vehicle-sticky-quote").locator("a");
  for (let i = 0; i < await sticky.count(); i++) assert.equal(await sticky.nth(i).getAttribute("href"), quote);
  const recommendation = section.getByTestId("vehicle-recommendation").locator("article").nth(index);
  await recommendation.locator("button").click();
  hasAll(message(await section.getByTestId("vehicle-recommendation-quote").getAttribute("href")), [stageName, ...expectedOutput(fixture, index, locale)], "recommendation selection agrees");
  const option = aside.locator("label").filter({hasText: "Vmax /"});
  if (await option.count()) {
    await option.locator('input[type="checkbox"]').check();
    const optionPrice = await aside.locator("div.text-4xl").innerText();
    const optionMessage = message(await section.getByTestId("vehicle-recommendation-quote").getAttribute("href"));
    hasAll(optionMessage,["Vmax /",...expectedOutput(fixture,index,locale)],"option quote agrees with selected Stage");
    if (amount === null) {
      assert.equal(optionPrice,labels[locale].request,"option cannot price unresolved Stage");
      hasAll(optionMessage,[{nl:"Prijs: op aanvraag",en:"Price: on request",pl:"Cena: wycena indywidualna"}[locale]],"option draft remains on request");
    } else {
      assert.ok(optionPrice.includes(String(amount / 100 + 119)),"existing option adds once to existing software price");
      hasAll(optionMessage,[optionPrice],"priced option draft agrees with displayed total");
    }
    await option.locator('input[type="checkbox"]').uncheck();
    assert.equal(await aside.locator("div.text-4xl").innerText(),topPrice,"unchecking restores base quote");
    report.options.push({locale,id:fixture.id,stage:stageName,option:"speed-limiter",checkedAndUnchecked:true});
  }
}
function monitor(page, location) {
  page.on("pageerror", error => report.errors.push(`${location}: ${error.message}`));
  page.on("console", msg => { if (msg.type() === "error") report.errors.push(`${location}: ${msg.text()}`); });
}
(async () => {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {})});
  try {
    for (const locale of ["nl", "en", "pl"]) {
      const page = await browser.newPage({viewport: {width: 390, height: 900}, reducedMotion: "reduce"});
      monitor(page, locale);
      for (const fixture of fixtures) {
        const vehicle = engineCatalog.find(vehicle => vehicle.id === fixture.id);
        const vehiclePath = `/${locale}/vehicles/${fixture.id}`;
        assert.equal((await page.goto(base + vehiclePath, {waitUntil: "networkidle"})).status(), 200);
        assert.equal(await page.locator("h1").count(), 1);
        const body = await page.locator("main").innerText();
        assert.doesNotMatch(body, forbidden);
        hasAll(body, [vehicle.configurationNote[locale], technicalFamilyLabel(vehicle.ecuSupport, vehicle.ecuType, locale), `${fixture.stockHp} ${labels[locale].unit}`, ...expectedOutput(fixture, 0, locale)], "vehicle public facts");
        if (fixture.stockNm === null) assert.ok(body.includes(labels[locale].pending), "missing stock torque remains unknown");
        if (fixture.stage2) {
          // An isolated supported point must remain visible when adjacent Stage outputs are withheld.
          await page.locator('[data-testid="catalog-power-chart"] .recharts-area-dots circle').nth(3).waitFor();
          assert.equal(await page.locator('[data-testid="catalog-power-chart"] .recharts-area-dots circle').count(),4,"only stock and supported S2 point pairs plotted");
        }
        for (let index = 0; index < 3; index++) await selected(page, fixture, index, locale);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "390px vehicle overflow");
        report.vehicles.push({locale, id: fixture.id, width: 390, stageInteractions: 3, recommendationInteractions: 3});
        const visualProfiles = ["bmw-320d-b47","vw-golf-20-tsi-ea888","volkswagen-golf-7-r-20-tsi","ford-focus-st-20-ecoboost","volvo-xc60-d5","mercedes-a45-amg-m133"];
        if ((locale === "nl" && visualProfiles.includes(fixture.id)) || fixture.id === "volvo-xc60-d5") {
          await page.setViewportSize({width:1320,height:1000});
          for (const stageName of ["Stage 1","Stage 2"]) {
            await page.locator("#tuning-calculator aside").locator("button").filter({hasText: stageName}).click();
            const screenshot = `${locale}-${fixture.id}-${stageName.replace(" ","-")}-1320.png`;
            await page.locator("#tuning-calculator").screenshot({path: path.join(output, screenshot)});
            report.screenshots.push(screenshot);
          }
          await page.setViewportSize({width:390,height:900});
        }
        for (const [index, name] of ["Stage 1", "Stage 2", "Stage 3+"].entries()) {
          const slug = fixture.slugs;
          const stagePath = `/${locale}/${slug.brand}/${slug.model}/${slug.engine}/${stageSlugMap[name]}`;
          assert.equal((await page.goto(base + stagePath, {waitUntil: "networkidle"})).status(), 200);
          const section = page.locator("#tuning-calculator");
          const quoteMessage = message(await section.getByTestId("vehicle-recommendation-quote").getAttribute("href"));
          hasAll(quoteMessage, [name, ...expectedOutput(fixture, index, locale)], "direct Stage route initial selection");
          const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)));
          const service = jsonLd.find(item => item["@type"] === "Vehicle");
          assert.ok(service?.offers, "Stage structured Offer");
          if (cents(fixture,index) === null) assert.equal(service.offers.price, undefined, "on-request Offer omits price");
          else assert.equal(service.offers.price, (cents(fixture,index) / 100).toFixed(2));
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "390px Stage overflow");
          assert.doesNotMatch(await page.locator("main").innerText(), forbidden);
          report.stageRoutes.push({path: stagePath, initialSelection: name});
        }
      }
      await page.close();
      console.log(`${locale}: 12 vehicle flows and 36 direct Stage routes passed`);
    }
    for (const [locale, width] of [["nl", 320], ["en", 768], ["pl", 1440]]) {
      const page = await browser.newPage({viewport: {width, height: 950}, reducedMotion: "reduce"});
      monitor(page, `${locale}/${width}`);
      await page.goto(`${base}/${locale}`, {waitUntil: "networkidle"});
      assert.equal(await page.locator('section[aria-labelledby="more-catalog-vehicles"] a').count(), 20);
      const selector = page.locator("#manual-selector");
      const response = page.waitForResponse(response => response.url().includes("/api/catalog-selector") && new URL(response.url()).searchParams.get("q") === "BMW 320d");
      await selector.locator("input").first().fill("BMW 320d");
      await response;
      await selector.locator(`a[href="/${locale}/vehicles/bmw-320d-b47"]`).first().click();
      await page.waitForURL(`**/${locale}/vehicles/bmw-320d-b47`);
      await selected(page, fixtures[0], 1, locale);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px overflow`);
      const screenshot = `${locale}-navigation-${width}.png`;
      await page.screenshot({path: path.join(output, screenshot), fullPage: true});
      report.screenshots.push(screenshot);
      report.homes.push({locale, width, realSelectorNavigation: true, stage2RequestQuote: true});
      await page.close();
    }
    const response = await browser.newPage();
    const xml = await (await response.request.get(base + "/sitemap.xml")).text();
    assert.equal((xml.match(/<loc>/g) || []).length, 291);
    await response.close();
    assert.deepEqual(report.errors, [], report.errors.join("\n"));
    fs.writeFileSync(path.join(output, "receipt.json"), JSON.stringify(report, null, 2) + "\n");
    console.log("P0 browser PASS: 36 vehicle pages, 108 direct Stage routes, 216 selection interactions, 3 selector navigations, sitemap 291; no console/page errors.");
  } finally { await browser.close(); }
})().catch(error => { fs.writeFileSync(path.join(output, "failed-receipt.json"), JSON.stringify({...report, failure: String(error)}, null, 2)); console.error(error); process.exitCode = 1; });
