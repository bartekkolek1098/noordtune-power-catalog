/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {formatQuote} = require("../src/data/pricing.ts");
const output = path.resolve("docs/tuning-qa/corrective");
const baseUrl = process.env.TUNING_FINAL_URL || "http://localhost:3100";
const fixtures = [
  {id: "ref-bmw-128ti-f40-265", query: "BMW 128ti", brand: "BMW", model: "128ti", year: "2022", power: 310, torque: 480, price: 70000},
  {id: "ref-ford-transit-custom-20-ecoblue-105", query: "Ford Transit Custom 105", brand: "Ford", model: "Transit Custom", year: "2019", power: 190, torque: 440, price: 54900},
  {id: "ref-ford-transit-connect-15-tdci-100", query: "Ford Transit Connect 100", brand: "Ford", model: "Transit Connect", year: "2018", power: 125, torque: 330, price: 44900}
];
const report = {generatedAt: new Date().toISOString(), baseUrl, notes: ["Manual selections do not supply registration dates or plates. WhatsApp links were decoded without opening or sending messages.", "Both quick search and the brand/model/year/engine flow select the same server reference profile and shared vehicle-scope quote. No reference SEO route is created.", "The existing absolute diagonal background decoration is excluded from content-overflow metrics; all content descendants and whole-page overflow remain checked. The pointer is moved off cards before measuring intentional hover-arrow transforms."], cases: []};

async function metrics(locator) {
  return locator.evaluate(root => {
    const elements = [root, ...root.querySelectorAll("div,section,span,p,table,th,td,label,a,button,input,select")];
    const overflow = elements.filter(el => el !== root).flatMap(el => {
      const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
      if (!rect.width || !rect.height || style.display === "none" || style.position === "absolute" || style.position === "fixed" || style.display === "inline") return [];
      return el.textContent.trim() && el.scrollWidth > el.clientWidth + 2 ? [{tag: el.tagName, className: el.className, text: el.textContent.trim().slice(0, 100), width: el.clientWidth, scroll: el.scrollWidth}] : [];
    });
    return {overflow, internalScrollbars: elements.filter(el => ["auto", "scroll"].includes(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 2).length, pageOverflow: document.documentElement.scrollWidth > innerWidth + 2};
  });
}

async function checkCase(browser, fixture, width, mode, locale = "nl") {
  const context = await browser.newContext({viewport: {width, height: 1000}, deviceScaleFactor: 1, locale: "nl-NL", reducedMotion: "reduce"});
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
  await page.addStyleTag({content: "nextjs-portal { display: none !important; }"});
  const selector = page.locator("#manual-selector");
  const response = await page.request.get(`${baseUrl}/api/catalog-selector?mode=reference&id=${fixture.id}`);
  assert.equal(response.status(), 200);
  const {estimate, quote} = await response.json();
  assert.equal(estimate.profile.id, fixture.id);
  assert.equal(quote.amountCents, fixture.price);
  if (mode === "search") {
    await selector.locator("input").first().fill(fixture.query);
    const card = selector.locator('a[href="#manual-reference-result"]').first();
    await card.waitFor();
    assert.ok((await card.textContent()).includes(formatQuote(quote, locale)), "Search card quote matches reference result scope");
    await card.click();
  } else {
    const selects = selector.locator("select");
    await selects.nth(0).selectOption(fixture.brand);
    await selects.nth(1).selectOption(fixture.model);
    await selects.nth(2).selectOption(fixture.year);
    await selects.nth(3).selectOption(fixture.id);
  }
  const details = page.getByTestId("manual-reference-details");
  await details.waitFor();
  await details.getByTestId("catalog-power-chart").waitFor();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(250);
  assert.equal(await details.getAttribute("data-profile-id"), fixture.id);
  assert.ok(page.url().endsWith(`/${locale}`), "Reference selection stays inline on the same page");
  assert.equal(await details.locator('a[href*="/vehicles/"]').count(), 0, "No invented reference SEO link");
  const outputText = await details.getByTestId("manual-reference-output").textContent();
  assert.ok(outputText.includes(String(fixture.power)) && outputText.includes(String(fixture.torque)), "Published Stage 1 output is visible");
  assert.equal(await details.getByTestId("manual-reference-price").textContent(), formatQuote(quote, locale));
  assert.equal(await details.getByTestId("manual-reference-stage").count(), 3);
  assert.equal(await details.locator('input:checked').count(), 0, "Paid options are never preselected");
  assert.equal(await details.locator('input[data-option-id="dsg-tcu"]').count(), 0);
  if (fixture.id.includes("connect")) assert.equal(await details.getByTestId("manual-connect-condition").count(), 1);
  const initialMessage = new URL(await details.getByTestId("manual-reference-quote").getAttribute("href")).searchParams.get("text");
  assert.ok(initialMessage.includes(String(fixture.power)) && initialMessage.includes(String(fixture.torque)));
  assert.ok(!/\d{4}-\d{2}-\d{2}/.test(initialMessage), "Manual reference cannot invent a first-registration date");
  assert.ok(initialMessage.includes(locale === "en" ? "First registration: Unavailable" : locale === "pl" ? "Pierwsza rejestracja: Brak danych" : "Eerste toelating: Niet beschikbaar"), "Manual first-registration status is explicitly unavailable");
  const initialMetrics = await metrics(selector);
  assert.deepEqual(initialMetrics.overflow, []);
  assert.equal(initialMetrics.internalScrollbars, 0);
  assert.equal(initialMetrics.pageOverflow, false);
  const screenshot = `manual-${fixture.id}-${locale}-${mode}-${width}.png`;
  await details.screenshot({path: path.join(output, screenshot), animations: "disabled"});
  const option = details.locator('input[type="checkbox"]').first();
  const optionName = await option.locator("xpath=ancestor::label").locator("span").first().locator("span").first().textContent();
  await option.check();
  await details.locator('[data-stage="Stage 2"]').click();
  assert.equal(await option.isChecked(), true, "Options survive a Stage change");
  assert.equal(await details.getByTestId("catalog-power-chart").count(), 1, "Stage 2 request leaves the Stage 1 illustration available");
  const stage2Message = new URL(await details.getByTestId("manual-reference-quote").getAttribute("href")).searchParams.get("text");
  assert.ok(stage2Message.includes("Stage 2") && stage2Message.includes(optionName));
  assert.ok(!(await details.getByTestId("manual-reference-price").textContent()).includes("€"), "Unknown Stage price does not turn into an option subtotal");
  await details.getByTestId("manual-reference-sources").locator("summary").click();
  assert.equal(await details.getByTestId("manual-reference-sources").getAttribute("open"), "");
  const expandedMetrics = await metrics(selector);
  assert.deepEqual(expandedMetrics.overflow, []);
  assert.equal(expandedMetrics.internalScrollbars, 0);
  await details.locator('a[href^="https://wa.me/"]').last().scrollIntoViewIfNeeded();
  assert.equal(await details.locator('a[href^="https://wa.me/"]').last().isVisible(), true);
  assert.deepEqual(errors, []);
  report.cases.push({fixture: fixture.id, width, mode, locale, profile: estimate.profile.id, quote, output: outputText, initialMessage, screenshot, metrics: initialMetrics, expandedMetrics, optionPreserved: optionName, errors});
  await context.close();
  console.log(`${fixture.id} ${mode} ${locale} ${width}: values, quote, chart, options and inline details passed`);
}

(async () => {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({executablePath: process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
  report.browser = await browser.version();
  try {
    for (const fixture of fixtures) for (const width of [320, 1440]) for (const mode of ["search", "cascade"]) await checkCase(browser, fixture, width, mode);
    for (const locale of ["en", "pl"]) await checkCase(browser, fixtures[2], 320, "search", locale);
    report.summary = {cases: report.cases.length, overflow: 0, pageErrors: 0, manualReferences: 3};
    console.log(JSON.stringify(report.summary, null, 2));
  } finally {
    fs.writeFileSync(path.join(output, "manual-reference-report.json"), JSON.stringify(report, null, 2) + "\n");
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
