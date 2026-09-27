/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const {existsSync, mkdirSync} = require("node:fs");
const {join} = require("node:path");
const {chromium} = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"
);

const baseUrl = process.env.SEO_QA_URL || "http://127.0.0.1:3133";
const outputDir = join(process.cwd(), ".git", "catalog-seo-polish-v1");
const systemBrowser = [
  process.env.PLAYWRIGHT_EXECUTABLE,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
].find((path) => path && existsSync(path));
const widths = [320, 390, 768, 1440];
const samples = {
  nl: {
    location: "Assen, Nederland",
    vehicle: "/nl/vehicles/bmw-320d-b47",
    stage: "/nl/bmw/3-series/320d/stage-1"
  },
  en: {
    location: "Assen, Netherlands",
    vehicle: "/en/vehicles/volkswagen-golf-7-r-20-tsi",
    stage: "/en/volkswagen/golf-7-r/2-0-tsi-300/stage-2"
  },
  pl: {
    location: "Assen, Holandia",
    vehicle: "/pl/vehicles/audi-a4-b9-20-tdi-190",
    stage: "/pl/audi/a4-b9/2-0-tdi-190/stage-3-plus"
  }
};

(async () => {
  mkdirSync(outputDir, {recursive: true});
  const browser = await chromium.launch({
    headless: true,
    ...(systemBrowser ? {executablePath: systemBrowser} : {})
  });
  const errors = [];

  try {
    for (const [index, width] of widths.entries()) {
      const locale = ["nl", "en", "pl", "nl"][index];
      const page = await browser.newPage({viewport: {width, height: 900}});
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`${width}px console: ${message.text()}`);
      });
      page.on("pageerror", (error) => errors.push(`${width}px page: ${error.message}`));
      await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
      assert.ok(await page.locator("#manual-selector").isVisible(), `${width}px manual selector hidden`);
      assert.ok(await page.locator("input.plate-shadow").isVisible(), `${width}px lookup hidden`);
      assert.equal(
        await page.locator('section[aria-labelledby="more-catalog-vehicles"] a').count(),
        20,
        `${width}px compact catalog link count`
      );
      assert.ok(await page.getByText(samples[locale].location, {exact: true}).isVisible());
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 1, `${width}px page overflows horizontally by ${overflow}px`);
      await page.locator("summary").first().click();
      assert.ok(await page.locator("details").first().evaluate((element) => element.open));
      await page.screenshot({
        path: join(outputDir, `home-${locale}-${width}.png`),
        fullPage: true
      });
      await page.close();
    }

    for (const [locale, sample] of Object.entries(samples)) {
      const page = await browser.newPage({viewport: {width: 390, height: 900}});
      await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});
      await page.locator(`a[href="${sample.vehicle}"]`).first().click();
      await page.waitForURL(`**${sample.vehicle}`);
      assert.ok(await page.locator("#tuning-calculator").isVisible(), `${locale} vehicle calculator hidden`);
      assert.ok(await page.getByText(sample.location, {exact: true}).isVisible());
      await page.goto(`${baseUrl}${sample.stage}`, {waitUntil: "networkidle"});
      assert.ok(await page.locator("#tuning-calculator").isVisible(), `${locale} Stage calculator hidden`);
      assert.ok(await page.getByText(sample.location, {exact: true}).isVisible());
      await page.close();
    }

    assert.deepEqual(errors, [], errors.join("\n"));
    console.log(
      "SEO browser QA passed at 320/390/768/1440px: lookup and selector visible, compact links readable, localized footer present, real vehicle links clicked, FAQ action worked, and one vehicle/Stage page passed per locale."
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
