/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const catalog = require("../src/data/catalog.ts");
const {normalizeRdwVehicle} = require("../src/lib/rdw.ts");
const {resolveStageQuote, formatQuote} = require("../src/data/pricing.ts");
const baselineRoot = process.env.TUNING_BASELINE_ROOT || path.join(process.env.TEMP, "noordtune-tuning-baseline-4d12e510");
const baseline = require(path.join(baselineRoot, "src/data/catalog.ts"));
const output = path.resolve("docs/tuning-qa/corrective");
const smoke = process.argv.includes("--smoke");
fs.mkdirSync(output, {recursive: true});
const widths = [320, 360, 390, 430, 768, 1024, 1440];
const fixtures = [
  {id: "bmw128ti", make: "BMW", model: "128TI", fuel: "Benzine", cc: 1998, kw: 195, date: "2022-09-14", nlDate: "2026-05-29", expectedStage1: [310, 480], widths},
  {id: "golf-gti", make: "VOLKSWAGEN", model: "GOLF GTI", fuel: "Benzine", cc: 1984, kw: 169, date: "2017-05-12", detailId: "vw-golf-20-tsi-ea888", widths},
  {id: "transit-custom", make: "FORD", model: "TRANSIT CUSTOM", fuel: "Diesel", cc: 1995, kw: 77, date: "2019-04-29", expectedStage1: [190, 440], widths},
  {id: "transit-connect", make: "FORD", model: "TRANSIT CONNECT", fuel: "Diesel", cc: 1499, kw: 73.5, date: "2018-10-17", expectedStage1: [125, 330], widths},
  {id: "bmw320d", make: "BMW", model: "320D", fuel: "Diesel", cc: 1995, kw: 140, date: "2017-09-12", detailId: "bmw-320d-b47", widths: [320, 1440]},
  {id: "golf-r", make: "VOLKSWAGEN", model: "GOLF R", fuel: "Benzine", cc: 1984, kw: 221, date: "2017-09-12", detailId: "volkswagen-golf-7-r-20-tsi", widths: [320, 1440]},
  {id: "focus-st", make: "FORD", model: "FOCUS ST", fuel: "Benzine", cc: 1999, kw: 184, date: "2015-08-10", detailId: "ford-focus-st-20-ecoboost", widths: [320, 1440]}
];
const report = {
  generatedAt: new Date().toISOString(),
  baseline: {sha: "4d12e510953fb57c3f8f84a737880ff860a617e7", url: process.env.TUNING_BASELINE_URL || "http://localhost:3102", source: baselineRoot},
  finalUrl: process.env.TUNING_FINAL_URL || "http://localhost:3100",
  syntheticIdentifiersOnly: true,
  notes: [
    "Both versions use the same installed Chrome executable, fonts, viewport and sanitized deterministic RDW vehicle facts; matching is evaluated by each version's actual catalog function.",
    "BMW128ti, Transit Custom and Transit Connect use sanitized official RDW make/model, displacement, power and first-admission facts retrieved for the task. Synthetic identifier ZZ1001 replaces all plates. Other curated examples use controlled synthetic registration dates.",
    "Only the Next.js development overlay is hidden equally in both versions; no vehicle, quote or layout pixels are masked.",
    "Date, estimate profile/provenance, scoped draft prices, access text and chart caption may legitimately alter result height. Numeric profile output is independent of exact ECU/access confirmation and quote mode.",
    "WhatsApp hrefs are decoded and asserted without opening or sending any message."
  ],
  results: [],
  detailPages: [],
  publicCoverage: [],
  errors: []
};

function payloadFor(fixture, version) {
  const payload = normalizeRdwVehicle({
    merk: fixture.make,
    handelsbenaming: fixture.model,
    cilinderinhoud: String(fixture.cc),
    aantal_cilinders: "4",
    datum_eerste_toelating_dt: `${fixture.date}T00:00:00.000`,
    datum_eerste_tenaamstelling_in_nederland_dt: `${fixture.nlDate || fixture.date}T00:00:00.000`,
    vervaldatum_apk_dt: "2027-03-15T00:00:00.000"
  }, [{brandstof_omschrijving: fixture.fuel, nettomaximumvermogen: String(fixture.kw)}], "ZZ1001");
  delete payload.raw;
  payload.retrievedAt = "2026-09-15T12:00:00.000Z";
  if (version === "baseline") {
    payload.tuningMatch = baseline.findCatalogMatch({
      make: fixture.make, model: fixture.model, fuel: fixture.fuel,
      powerHp: Math.round(fixture.kw * 1.35962)
    });
  }
  return payload;
}

async function layoutMetrics(locator) {
  return locator.evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    const elements = [root, ...root.querySelectorAll("div,section,span,p,table,th,td,label,a,button,input")];
    const overflow = elements.flatMap((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (!r.width || !r.height || style.display === "none" || style.position === "absolute" || style.position === "fixed") return [];
      const hasText = el.textContent.trim();
      if (hasText && el.scrollWidth > el.clientWidth + 2 && style.display !== "inline") {
        return [{tag: el.tagName, text: hasText.slice(0, 100), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, overflowX: style.overflowX}];
      }
      return [];
    });
    const internalScrollbars = elements.filter((el) => {
      const style = getComputedStyle(el);
      return ["scroll", "auto"].includes(style.overflowY) && el.scrollHeight > el.clientHeight + 2;
    }).map((el) => ({tag: el.tagName, text: el.textContent.slice(0, 100)}));
    return {contentWidth: rootRect.width, height: rootRect.height, overflow, internalScrollbars,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      stageRows: root.querySelectorAll("tbody tr").length,
      checkboxes: root.querySelectorAll('input[type="checkbox"]').length,
      charts: root.querySelectorAll('.recharts-responsive-container,[data-testid="rdw-pending-chart"]').length,
      detailsLinks: [...root.querySelectorAll('a[href*="/vehicles/"]')].map((a) => ({href: a.getAttribute("href"), text: a.textContent})),
      whatsappLinks: root.querySelectorAll('a[href^="https://wa.me/"]').length};
  });
}

async function lookupCase(browser, fixture, width, version) {
  const locale = fixture.locale || "nl";
  const context = await browser.newContext({viewport: {width, height: 1000}, deviceScaleFactor: 1, locale: "nl-NL", timezoneId: "Europe/Amsterdam", reducedMotion: "reduce"});
  const page = await context.newPage();
  const payload = payloadFor(fixture, version);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/rdw-lookup", (route) => route.fulfill({status: 200, contentType: "application/json", body: JSON.stringify(payload)}));
  await page.goto(`${version === "baseline" ? report.baseline.url : report.finalUrl}/${locale}`, {waitUntil: "networkidle"});
  await page.addStyleTag({content: "nextjs-portal { display: none !important; }"});
  await page.locator('form input').first().fill("ZZ1001");
  await page.locator('form button[type="submit"]').first().click();
  const result = page.getByTestId("rdw-result");
  await result.waitFor({state: "visible"});
  if (version === "final" && payload.tuningEstimate.profile) await page.getByTestId("catalog-power-chart").waitFor();
  await page.waitForTimeout(350);
  const metrics = await layoutMetrics(result);
  const card = page.locator(".carbon-panel").first();
  const name = `${version}-${fixture.id}${locale === "nl" ? "" : `-${locale}`}-${width}`;
  await card.screenshot({path: path.join(output, `${name}.png`), animations: "disabled"});
  const box = await result.boundingBox();
  await page.screenshot({path: path.join(output, `${name}-summary.png`), clip: {x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.width, height: Math.min(box.height, 850)}, animations: "disabled"});
  const order = await page.evaluate(() => {
    const plate = document.querySelector(".carbon-panel");
    const manual = document.querySelector("#manual-selector");
    return Boolean(plate && manual && (plate.compareDocumentPosition(manual) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  const quotes = await result.locator('a[href^="https://wa.me/"]').evaluateAll((links) => links.map((link) => new URL(link.href).searchParams.get("text")));
  const record = {version, fixture: fixture.id, locale, width, matchStatus: payload.tuningMatch?.status ?? (payload.tuningMatch?.variant ? "legacy-match" : "legacy-no-match"), matchId: payload.tuningMatch?.variant?.id, ...metrics, plateBeforeManual: order, screenshot: `${name}.png`, summary: `${name}-summary.png`, errors};
  if (version === "final") {
    assert.equal(order, true, "PlateLookup must remain before ManualSelector");
    assert.equal(metrics.stageRows, 3, "Stage controls remain visible");
    assert.ok(metrics.checkboxes > 0, "Options remain present");
    assert.ok(metrics.charts > 0, "Chart container remains present");
    assert.ok(metrics.whatsappLinks > 0, "Quote CTA remains present");
    const date = await page.getByTestId("rdw-first-registration").textContent();
    assert.ok(date.includes(fixture.date.slice(0, 4)), "First registration year is immediately shown");
    record.firstRegistration = date;
    const profile = payload.tuningEstimate.profile;
    assert.ok(profile, `${fixture.id}: compatible tuning estimate must not be empty`);
    assert.equal(await page.getByTestId("rdw-pending-chart").count(), 0, "Usable profile has a catalog chart");
    const stage1 = profile.stages.find((stage) => stage.name === "Stage 1");
    if (fixture.expectedStage1) assert.deepEqual([stage1.powerHp, stage1.torqueNm], fixture.expectedStage1, "Sourced reference values are retained");
    assert.ok((await result.locator("tbody tr").first().textContent()).includes(String(stage1.powerHp)));
    assert.ok((await result.locator("tbody tr").first().textContent()).includes(String(stage1.torqueNm)));
    assert.ok(quotes.every((message) => message.includes(String(stage1.powerHp)) && message.includes(String(stage1.torqueNm))), "WhatsApp includes indicative output");
    const quote = resolveStageQuote(profile, stage1, {scope: "vehicle", estimateApplicable: true});
    assert.equal(quote.kind, "from", "Explicit profile scenario has a numeric Stage 1 indication");
    assert.ok((await result.textContent()).includes(formatQuote(quote, locale)));
    record.profile = {id: profile.id, provenance: profile.provenance, status: payload.tuningEstimate.status, stockPowerHp: profile.stockPowerHp, stockTorqueNm: profile.stockTorqueNm, stages: profile.stages.map(({name, powerHp, torqueNm}) => ({name, powerHp, torqueNm}))};
    record.quote = quote;
    if (fixture.id === "bmw128ti") assert.ok(quotes.every((message) => message.includes("700")));
    if (fixture.id === "focus-st" || !profile.gearbox) {
      const optionText = await result.locator("label").allTextContents();
      assert.ok(optionText.every((text) => !text.includes("DSG / TCU tuning")), "Unknown/manual transmission cannot select TCU");
    }
    if ([320, 1440].includes(width)) {
      const option = result.locator('input[type="checkbox"]').first();
      const optionLabel = await option.locator("xpath=ancestor::label").locator("span").first().locator("span").first().textContent();
      await option.check();
      await result.locator("tbody tr").nth(1).click();
      assert.equal(await option.isChecked(), true, "Stage change preserves options");
      assert.equal(await page.getByTestId("catalog-power-chart").count(), 1, "A Stage 2 quotation request cannot hide the available Stage 1 chart");
      if (profile.provenance === "tuner-reference") {
        assert.equal(profile.stages[1].powerHp, undefined, "No invented reference Stage 2 power");
        assert.equal(profile.stages[2].powerHp, undefined, "No invented reference Stage 3 power");
      }
      const quoteLink = result.locator('a[href^="https://wa.me/"]').last();
      await quoteLink.scrollIntoViewIfNeeded();
      assert.ok(await quoteLink.isVisible(), "Final quote CTA is reachable");
      const updated = new URL(await quoteLink.getAttribute("href")).searchParams.get("text");
      assert.ok(updated.includes("Stage 2") && updated.includes(optionLabel), "WhatsApp preserves Stage and paid option");
      record.interaction = {stage: "Stage 2", option: optionLabel, quoteReachable: true, preserved: true};
      if (metrics.detailsLinks.length) {
        const response = await page.request.get(`${report.finalUrl}${metrics.detailsLinks[0].href}`);
        assert.equal(response.status(), 200, "Full-details CTA resolves");
        record.detailsStatus = response.status();
      } else {
        await result.locator('a[href="#rdw-estimate-details"]').click();
        assert.equal(await page.locator("#rdw-estimate-details").getAttribute("open"), "", "Reference inline details expand");
        const expanded = await layoutMetrics(result);
        assert.deepEqual(expanded.overflow, [], "Expanded reference details do not clip");
        assert.deepEqual(expanded.internalScrollbars, [], "Expanded reference details use natural page scrolling");
        record.inlineDetails = "expanded without clipping";
      }
    }
  }
  report.results.push(record);
  await context.close();
  console.log(`${version} ${fixture.id} ${width}: ${record.matchStatus}; overflow=${metrics.overflow.length}, scrollbars=${metrics.internalScrollbars.length}`);
}

async function detailCase(browser, fixture, width) {
  const context = await browser.newContext({viewport: {width, height: 1000}, locale: "nl-NL", reducedMotion: "reduce"});
  const page = await context.newPage();
  const vehicle = catalog.getVehicleById(fixture.detailId);
  await page.goto(`${report.finalUrl}/nl/vehicles/${vehicle.id}`, {waitUntil: "networkidle"});
  await page.addStyleTag({content: "nextjs-portal { display: none !important; }"});
  const calculator = page.locator("#tuning-calculator");
  await page.getByTestId("catalog-power-chart").waitFor();
  const metrics = await layoutMetrics(calculator);
  await calculator.screenshot({path: path.join(output, `final-detail-${fixture.id}-${width}.png`), animations: "disabled"});
  const quote = resolveStageQuote(vehicle, vehicle.stages[0]);
  assert.ok((await calculator.textContent()).includes(formatQuote(quote, "nl")));
  if (fixture.id === "focus-st") assert.equal(await calculator.locator("label").filter({hasText: "DSG / TCU tuning"}).count(), 0);
  const slugs = catalog.getVehicleSeoSlugs(vehicle);
  const stagePath = `/nl/${slugs.brand}/${slugs.model}/${slugs.engine}/stage-1`;
  const response = await page.goto(`${report.finalUrl}${stagePath}`, {waitUntil: "networkidle"});
  assert.equal(response.status(), 200);
  const structured = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent)));
  const offer = structured.find((entry) => entry["@type"] === "Vehicle").offers;
  if (quote.kind === "on-request") assert.equal(Object.hasOwn(offer, "price"), false, "Request Stage page omits numeric Offer price");
  else assert.equal(Number(offer.price), quote.amountCents / 100);
  report.detailPages.push({fixture: fixture.id, width, ...metrics, quote, offer, screenshot: `final-detail-${fixture.id}-${width}.png`});
  await context.close();
  console.log(`detail ${fixture.id} ${width}: ${quote.kind}; overflow=${metrics.overflow.length}`);
}

async function publicCoverageCase(browser, vehicle) {
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}, locale: "nl-NL", reducedMotion: "reduce"});
  const page = await context.newPage();
  await page.goto(`${report.finalUrl}/nl/vehicles/${vehicle.id}`, {waitUntil: "networkidle"});
  await page.addStyleTag({content: "nextjs-portal { display: none !important; }"});
  await page.getByTestId("catalog-power-chart").waitFor();
  const calculator = page.locator("#tuning-calculator");
  const text = await calculator.textContent();
  for (const stage of vehicle.stages) {
    assert.ok(text.includes(`${stage.powerHp} pk / ${stage.torqueNm} Nm`), `${vehicle.id} ${stage.name}: existing tuned values visible`);
  }
  assert.ok(text.includes(`${vehicle.stockPowerHp} → ${vehicle.stages[0].powerHp} pk`), "Stock and gain display retained");
  const quote = resolveStageQuote(vehicle, vehicle.stages[0]);
  assert.equal(quote.kind, "from");
  assert.ok(text.includes(formatQuote(quote, "nl")));
  const metrics = await layoutMetrics(calculator);
  assert.deepEqual(metrics.overflow, []);
  const screenshot = `public-${vehicle.id}-1440.png`;
  await calculator.screenshot({path: path.join(output, screenshot), animations: "disabled"});
  report.publicCoverage.push({id: vehicle.id, stockPowerHp: vehicle.stockPowerHp, stockTorqueNm: vehicle.stockTorqueNm, stages: vehicle.stages.map(({name,powerHp,torqueNm}) => ({name,powerHp,torqueNm})), quote, chart: true, screenshot});
  await context.close();
  console.log(`public coverage ${vehicle.id}: 3 numeric stages, chart and ${quote.amountCents / 100} family indication`);
}

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
  report.browser = await browser.version();
  try {
    for (const fixture of smoke ? fixtures.slice(0, 2) : fixtures) {
      for (const width of smoke ? [320] : fixture.widths) {
        await Promise.all(["baseline", "final"].map((version) => lookupCase(browser, fixture, width, version)));
      }
    }
    for (const fixture of smoke ? fixtures.filter((item) => item.detailId).slice(0, 1) : fixtures.filter((item) => item.detailId)) {
      for (const width of smoke ? [320] : [320, 1440]) await detailCase(browser, fixture, width);
    }
    for (const locale of ["en", "pl"]) {
      await Promise.all(["baseline", "final"].map((version) => lookupCase(browser, {...fixtures[0], locale}, 320, version)));
    }
    if (!smoke) for (const vehicle of catalog.engineCatalog) await publicCoverageCase(browser, vehicle);
    const finalResults = report.results.filter((result) => result.version === "final");
    report.summary = {
      lookupComparisons: finalResults.length,
      positivePublicProfiles: report.publicCoverage.length,
      finalOverflowCases: finalResults.filter((result) => result.overflow.length || result.pageOverflow).map((result) => `${result.fixture}-${result.width}`),
      finalInternalScrollbarCases: finalResults.filter((result) => result.internalScrollbars.length).length,
      finalPageErrors: finalResults.flatMap((result) => result.errors),
      detailOverflowCases: report.detailPages.filter((result) => result.overflow.length).map((result) => `${result.fixture}-${result.width}`)
    };
    assert.deepEqual(report.summary.finalOverflowCases, [], "All final lookup content must fit");
    assert.equal(report.summary.finalInternalScrollbarCases, 0, "No internal vertical scrollbars");
    assert.deepEqual(report.summary.finalPageErrors, [], "No final page errors");
    assert.deepEqual(report.summary.detailOverflowCases, [], "All final detail content must fit");
  } catch (error) {
    report.errors.push(error.stack ?? error.message);
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(output, smoke ? "visual-smoke-report.json" : "visual-report.json"), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report.summary ?? report.errors, null, 2));
})();
