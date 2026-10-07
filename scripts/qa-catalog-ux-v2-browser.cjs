/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const {existsSync, mkdirSync} = require("node:fs");
const {join} = require("node:path");
const {tmpdir} = require("node:os");
const {chromium} = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"
);

const baseUrl = process.env.UX_QA_URL || "http://127.0.0.1:3011";
const outputDir = join(tmpdir(), "noordtune-catalog-ux-v2");
mkdirSync(outputDir, {recursive: true});
const systemBrowser = [
  process.env.PLAYWRIGHT_EXECUTABLE,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
].find((path) => path && existsSync(path));

const expected = {
  nl: {headline: /Check wat jouw.*auto écht.*kan\./is, manual: "Of kies jouw auto handmatig"},
  en: {headline: /Check what your.*car can really.*do\./is, manual: "Or choose your car manually"},
  pl: {headline: /Sprawdź, co.*naprawdę potrafi.*Twoje auto\./is, manual: "Lub wybierz auto ręcznie"}
};

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(systemBrowser ? {executablePath: systemBrowser} : {})
  });
  const errors = [];
  try {
    for (const locale of ["nl", "en", "pl"]) {
      for (const width of [320, 390, 768, 1440]) {
        const page = await browser.newPage({viewport: {width, height: width < 768 ? 844 : 960}});
        page.on("console", message => {
          if (message.type() === "error") errors.push(`${locale}/${width} console: ${message.text()}`);
        });
        page.on("pageerror", error => errors.push(`${locale}/${width} page: ${error.message}`));
        await page.goto(`${baseUrl}/${locale}`, {waitUntil: "networkidle"});

        const h1 = await page.locator("h1").first().innerText();
        assert.match(h1, expected[locale].headline, `${locale}/${width}: conversion headline`);
        const mainSiteLogo = page.locator('header a[aria-label="NoordTune.nl"]').first();
        assert.equal(
          await mainSiteLogo.getAttribute("href"),
          `https://www.noordtune.nl/${locale}`,
          `${locale}/${width}: NoordTune.nl remains the primary company-site destination`
        );
        const plate = page.locator("input.plate-shadow");
        assert.ok(await plate.isVisible(), `${locale}/${width}: plate lookup visible`);
        const plateBox = await plate.boundingBox();
        const plateFirstScreenThreshold = width < 640 ? 460 : 900;
        assert.ok(
          plateBox && plateBox.y < plateFirstScreenThreshold,
          `${locale}/${width}: plate lookup above first-screen threshold ${plateFirstScreenThreshold}px`
        );

        const manualCta = page.locator('a[href="#manual-selector"]').first();
        assert.ok(await manualCta.isVisible(), `${locale}/${width}: manual selector CTA visible`);
        if (width < 640) {
          assert.ok(await page.locator('a[href="#rdw-configurator"]').last().isVisible(), `${locale}/${width}: sticky plate CTA visible`);
          assert.ok(!(await page.locator('[data-testid="floating-whatsapp"]').isVisible()), `${locale}/${width}: floating WhatsApp hidden behind mobile CTA bar`);
        }
        assert.ok(await page.locator("#manual-selector").isVisible(), `${locale}/${width}: manual selector exists`);
        const manualBox = await page.locator("#manual-selector").boundingBox();
        if (width < 768) assert.ok(manualBox && manualBox.y > plateBox.y, `${locale}/${width}: manual selector follows plate-first flow`);

        const bodyText = await page.locator("body").innerText();
        assert.ok(!bodyText.includes("Stage 3+"), `${locale}/${width}: no Stage 3+ customer copy`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert.ok(overflow <= 1, `${locale}/${width}: horizontal overflow ${overflow}px`);

        if (locale === "nl" && width === 390) {
          const stage1 = page.getByText("Stage 1", {exact: true}).first();
          const stage2 = page.getByText("Stage 2", {exact: true}).first();
          const s1 = await stage1.boundingBox();
          const s2 = await stage2.boundingBox();
          assert.ok(s1 && s2 && s1.y < s2.y, "mobile: Stage 1 precedes Stage 2");
          await page.screenshot({path: join(outputDir, "home-nl-390.png"), fullPage: true});
        }
        if (locale === "nl" && width === 1440) {
          await page.screenshot({path: join(outputDir, "home-nl-1440.png"), fullPage: true});
        }
        await page.close();
      }
    }

    const vehiclePage = await browser.newPage({viewport: {width: 390, height: 844}});
    vehiclePage.on("console", message => {
      if (message.type() === "error") errors.push(`vehicle/390 console: ${message.text()}`);
    });
    vehiclePage.on("pageerror", error => errors.push(`vehicle/390 page: ${error.message}`));
    await vehiclePage.goto(`${baseUrl}/nl/vehicles/bmw-320d-b47`, {waitUntil: "networkidle"});
    const vehicleHero = vehiclePage.locator('[data-testid="vehicle-hero"]');
    assert.ok(await vehicleHero.isVisible(), "vehicle/390: vehicle hero visible");
    assert.ok(!(await vehicleHero.innerText()).includes("ECU-familie"), "vehicle/390: ECU family moved below the conversion hero");
    assert.ok(!(await vehicleHero.getByText("Chiptuning hoofdsite", {exact: true}).isVisible()), "vehicle/390: secondary company CTA hidden from mobile hero");
    const heroBox = await vehicleHero.boundingBox();
    assert.ok(heroBox && heroBox.height < 580, `vehicle/390: compact mobile hero height ${heroBox?.height}px`);
    const verification = vehiclePage.locator('[data-testid="catalog-verification"]');
    const verificationBox = await verification.boundingBox();
    assert.ok(verificationBox && verificationBox.height < 100, `vehicle/390: compact verification height ${verificationBox?.height}px`);
    assert.ok(!(await verification.locator("p").first().isVisible()), "vehicle/390: verification detail copy collapsed on mobile");
    const recommendation = vehiclePage.locator('[data-testid="vehicle-recommendation"]');
    const recommendationBox = await recommendation.boundingBox();
    assert.ok(recommendationBox && recommendationBox.y < 900, `vehicle/390: Stage comparison starts at ${recommendationBox?.y}px`);
    assert.ok(await recommendation.getByText("Stage 1", {exact: true}).isVisible(), "vehicle/390: Stage 1 visible");
    assert.ok(await recommendation.getByText("Stage 2", {exact: true}).isVisible(), "vehicle/390: Stage 2 visible");
    assert.ok(!(await vehiclePage.locator("body").innerText()).includes("Stage 3+"), "vehicle/390: Stage 3+ absent");
    assert.ok(await vehiclePage.locator('[data-testid="vehicle-sticky-quote"]').isVisible(), "vehicle/390: sticky quote visible");
    const footerMainSite = vehiclePage.locator('footer a[aria-label="NoordTune.nl"]').first();
    assert.equal(await footerMainSite.getAttribute("href"), "https://www.noordtune.nl/nl", "vehicle/390: footer returns to NoordTune.nl");
    const vehicleOverflow = await vehiclePage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(vehicleOverflow <= 1, `vehicle/390: horizontal overflow ${vehicleOverflow}px`);
    assert.ok(await vehiclePage.getByText("Vermogen (pk)", {exact: true}).isVisible(), "vehicle/390: chart labels power explicitly");
    assert.ok(await vehiclePage.getByText("Koppel (Nm)", {exact: true}).isVisible(), "vehicle/390: chart labels torque explicitly");
    await vehiclePage.screenshot({path: join(outputDir, "vehicle-bmw320d-nl-390.png"), fullPage: true});
    await vehiclePage.close();

    const vehicleTablet = await browser.newPage({viewport: {width: 768, height: 960}});
    await vehicleTablet.goto(`${baseUrl}/pl/vehicles/bmw-320d-b47`, {waitUntil: "networkidle"});
    const tabletText = await vehicleTablet.locator("body").innerText();
    assert.ok(tabletText.includes("SERIA\n190 KM / 400 Nm"), "vehicle/768: stock output is a separate card");
    assert.ok(tabletText.includes("STAGE 1\n220–225 KM / 440–460 Nm"), "vehicle/768: Stage 1 output is a separate card");
    assert.ok(tabletText.includes("PRZYROST\n+30–35 KM / +40–60 Nm"), "vehicle/768: range gain is calculated");
    assert.ok(!tabletText.includes("190 →"), "vehicle/768: legacy mixed stock-to-stage arrow is absent");
    assert.ok(await vehicleTablet.getByText("Moc (KM)", {exact: true}).isVisible(), "vehicle/768: Polish chart power label visible");
    assert.ok(await vehicleTablet.getByText("Moment (Nm)", {exact: true}).isVisible(), "vehicle/768: Polish chart torque label visible");
    await vehicleTablet.close();

    assert.deepEqual(errors, [], errors.join("\n"));
    console.log(`Catalog UX V2 browser PASS: NL/EN/PL at 320/390/768/1440 plus BMW vehicle mobile; plate-first flow, Stage 1/2 only, NoordTune.nl hierarchy and no overflow. Screenshots: ${outputDir}`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
