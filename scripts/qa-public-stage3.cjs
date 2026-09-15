/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {engineCatalog, getVehicleSeoSlugs} = require("../src/data/catalog.ts");
const {customHardwareLabel} = require("../src/lib/estimate-copy.ts");
const base = process.env.RDW_QA_URL || "http://localhost:3115";
const output = path.resolve(process.env.RDW_QA_OUTPUT || "docs/tuning-data/browser");
async function assertCustomChartGap(page, chart) {
  await page.waitForTimeout(1800);
  const lastTick = chart.locator("text").filter({hasText: /^S3\+$/});
  assert.equal(await lastTick.textContent(), "S3+");
  const tick = await lastTick.boundingBox();
  const curve = await chart.locator(".recharts-area-curve").first().boundingBox();
  assert.ok(curve && tick && curve.width > 20 && curve.x + curve.width < tick.x - 10,
    "The numeric curve stops before the custom Stage 3 axis position");
}

(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless:true});
  const report = {checkedAt:new Date().toISOString(), base, results:[], errors:[]};
  try {
    for (const locale of ["nl", "en", "pl"]) {
      for (const width of [320, 1440]) {
        const vehicle = engineCatalog[0];
        const slugs = getVehicleSeoSlugs(vehicle);
        const url = `${base}/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/stage-3-plus`;
        const page = await browser.newPage({viewport:{width,height:1000}});
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        try {
          const response = await page.goto(url, {waitUntil:"networkidle"});
          assert.equal(response.status(), 200);
          const label = customHardwareLabel(locale);
          const cards = page.getByTestId("vehicle-recommendation").locator("article");
          assert.equal(await cards.count(), 3);
          assert.ok((await cards.nth(2).innerText()).includes(label));
          assert.ok(!(await cards.nth(2).innerText()).includes(`${vehicle.stages[2].powerHp}`));
          const description = await page.locator('meta[name="description"]').getAttribute("content");
          assert.ok(description.includes(label));
          assert.ok(!description.includes(`${vehicle.stages[2].powerHp}`));
          for (const node of await page.locator('script[type="application/ld+json"]').allTextContents()) {
            const data = JSON.parse(node);
            if (data.offers) {
              assert.equal(data.offers.price, undefined, "Custom work has no unscoped structured Offer price");
              assert.equal(data.offers.priceSpecification, undefined);
            }
          }
          const chart = page.getByTestId("catalog-power-chart");
          assert.equal(await chart.count(), 1);
          await assertCustomChartGap(page, chart);
          const message = new URL(await page.getByTestId("vehicle-recommendation-quote").getAttribute("href")).searchParams.get("text");
          assert.ok(message.includes(label));
          assert.ok(!message.includes(`${vehicle.stages[2].powerHp}`));
          const layout = await page.evaluate(() => ({width:innerWidth, documentWidth:document.documentElement.scrollWidth}));
          assert.ok(layout.documentWidth <= width, `${locale}: no horizontal overflow`);
          assert.deepEqual(errors, []);
          if (locale === "nl" && width === 320) await page.getByTestId("vehicle-recommendation").screenshot({style:'header, [class~="fixed"] {visibility:hidden !important;}',path:path.join(output,"public-stage3-320.png")});
          report.results.push({surface:"public-stage-page",locale,width,url,stageCards:3,customLabel:label,metadata:true,structuredOffer:true,chart:true,whatsapp:true,layout});
          console.log(`PASS public Stage 3 ${locale} ${width}px`);
        } catch (error) {
          report.errors.push({locale,width,url,error:String(error.stack || error)});
          throw error;
        } finally { await page.close(); }
      }
    }
    for (const locale of ["nl", "en", "pl"]) {
      const page = await browser.newPage({viewport:{width:320,height:1000}});
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      try {
        await page.goto(`${base}/${locale}`, {waitUntil:"networkidle"});
        const selector = page.locator("#manual-selector");
        await selector.locator("input").first().fill("Ford Transit Connect 100");
        await selector.locator('a[href="#manual-reference-result"]').first().click();
        const details = page.getByTestId("manual-reference-details");
        await details.waitFor();
        assert.equal(await details.getByTestId("manual-reference-stage").count(), 3);
        await details.locator('[data-stage="Stage 3+"]').click();
        const label = customHardwareLabel(locale);
        assert.ok((await details.getByTestId("manual-reference-output").innerText()).includes(label));
        assert.ok(!(await details.getByTestId("manual-reference-price").innerText()).includes("€"));
        await assertCustomChartGap(page, details.getByTestId("catalog-power-chart"));
        const message = new URL(await details.getByTestId("manual-reference-quote").getAttribute("href")).searchParams.get("text");
        assert.ok(message.includes(label));
        const layout = await page.evaluate(() => ({width:innerWidth,documentWidth:document.documentElement.scrollWidth}));
        assert.ok(layout.documentWidth <= 320);
        assert.deepEqual(errors, []);
        report.results.push({surface:"manual-reference",locale,width:320,profile:await details.getAttribute("data-profile-id"),stageCards:3,customLabel:label,chart:true,whatsapp:true,layout});
        console.log(`PASS manual-reference Stage 3 ${locale} 320px`);
      } catch (error) {
        report.errors.push({surface:"manual-reference",locale,error:String(error.stack || error)});
        throw error;
      } finally { await page.close(); }
    }
  } finally {
    fs.writeFileSync(path.join(output,"public-stage3-acceptance.json"), JSON.stringify(report,null,2)+"\n");
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
