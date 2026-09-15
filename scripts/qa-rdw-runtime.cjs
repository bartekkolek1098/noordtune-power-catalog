/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {formatEstimatePower, formatEstimateTorque, formatEstimateSource} = require("../src/lib/estimate-copy.ts");
const {formatQuote, addQuoteOptions} = require("../src/data/pricing.ts");
const {serviceOptions} = require("../src/data/catalog-shared.ts");
const output = path.resolve(process.env.RDW_QA_OUTPUT || "docs/tuning-qa/runtime");
const base = process.env.RDW_QA_URL || "http://localhost:3113";
const plates = ["H329XH", "V380ST", "V978ZF", "KKH27K"];
const liveIdentities = JSON.parse(fs.readFileSync(path.resolve("docs/tuning-qa/runtime/live-rdw-identities.json"),"utf8")).identities;
const cases = [
  ...[320,390,768,1440].flatMap(width => plates.map(plate => ({plate, width, locale:"nl"}))),
  ...["en","pl"].flatMap(locale => plates.map(plate => ({plate, width:320, locale})))
];
const report = {checkedAt:new Date().toISOString(), base, liveApi:true, mockedResponses:false, screenshots:[], results:[], errors:[]};

async function layoutMetrics(root) {
  return root.evaluate(element => {
    const box = element.getBoundingClientRect();
    const overflow = [...element.querySelectorAll("p,td,th,label,a,button,section")].flatMap(child => {
      const rect = child.getBoundingClientRect();
      const style = getComputedStyle(child);
      if (!rect.width || !rect.height || style.position === "absolute" || style.position === "fixed") return [];
      return rect.left < box.left - 2 || rect.right > box.right + 2 || child.scrollWidth > child.clientWidth + 2
        ? [{tag:child.tagName, text:child.textContent.trim().slice(0,80), width:rect.width, scrollWidth:child.scrollWidth}]
        : [];
    });
    return {viewport:innerWidth, documentWidth:document.documentElement.scrollWidth, overflow};
  });
}

(async () => {
  fs.mkdirSync(output,{recursive:true});
  const browser = await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
  try {
    for (const fixture of cases) {
      const {plate,width,locale} = fixture;
      const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
      const pageErrors = [];
      page.on("pageerror",error => pageErrors.push(error.message));
      try {
        await page.goto(`${base}/${locale}`,{waitUntil:"networkidle"});
        const input = page.locator('input[maxlength="10"]');
        await input.fill(plate);
        const responsePromise = page.waitForResponse(response => response.url().includes("/api/rdw-lookup") && response.request().method() === "POST");
        const startedAt = Date.now();
        await input.locator("xpath=ancestor::form").locator('button[type="submit"]').click();
        const response = await responsePromise;
        assert.equal(response.status(),200,`${plate}: RDW API status`);
        const payload = await response.json();
        const expectedIdentity = liveIdentities.find(item => item.caseId === plate).normalizedIdentity;
        assert.deepEqual({make:payload.vehicle.make,model:payload.vehicle.model,cc:payload.vehicle.engine.displacementCc,kw:payload.vehicle.engine.powerKw,date:payload.vehicle.registration.firstAdmission,type:payload.vehicle.type,variant:payload.vehicle.variant,execution:payload.vehicle.execution},
          {make:expectedIdentity.make,model:expectedIdentity.model,cc:expectedIdentity.displacementCc,kw:expectedIdentity.registeredPower.value,date:expectedIdentity.firstRegistrationDate,type:expectedIdentity.type,variant:expectedIdentity.variant,execution:expectedIdentity.execution},`${plate}: actual local API preserves the independently retrieved RDW identity`);
        const durationMs = Date.now()-startedAt;
        const payloadBytes = Buffer.byteLength(JSON.stringify(payload));
        assert.ok(payloadBytes < 25000,`${plate}: compact response ${payloadBytes} bytes`);
        assert.equal(payload.raw,undefined);
        assert.equal(payload.tuningMatch.candidates,undefined);
        assert.equal(payload.tuningMatch.variant,undefined);
        const profile = payload.tuningEstimate.profile;
        assert.ok(profile,`${plate}: resolved estimate`);
        assert.equal(profile.stages.length,3);
        assert.ok(profile.stages.every(stage => Number.isFinite(stage.powerHp)));
        const root = page.getByTestId("rdw-result");
        await root.waitFor({state:"visible"});
        await root.getByTestId("catalog-power-chart").waitFor({state:"visible"});
        await root.getByTestId("rdw-estimate-output").waitFor({state:"visible"});
        const initialText = await root.innerText();
        assert.ok(initialText.includes(`${payload.vehicle.make} ${payload.vehicle.model}`));
        assert.ok(initialText.includes(`${payload.vehicle.engine.displacementCc} cc`));
        assert.ok(initialText.includes(String(payload.vehicle.engine.powerHp)));
        assert.ok((await root.getByTestId("rdw-first-registration").innerText()).includes(String(payload.vehicle.registration.firstAdmissionYear)));
        assert.equal(await root.getByTestId("rdw-pending-chart").count(),0);
        assert.ok(!initialText.includes("Vermogen en koppel te bevestigen"));
        const rows = root.locator("tbody tr");
        assert.equal(await rows.count(),3);
        const stageResults = [];
        for (let index=0;index<3;index++) {
          const stage = profile.stages[index];
          const row = rows.nth(index);
          assert.ok((await row.innerText()).includes(formatEstimatePower(stage,locale)));
          assert.ok((await row.innerText()).includes(formatEstimateTorque(stage,locale)));
          assert.equal(await row.getAttribute("data-stage-provenance"),stage.provenance);
          await row.click();
          const expectedPower = formatEstimatePower(stage,locale);
          assert.ok((await root.getByTestId("rdw-estimate-output").innerText()).includes(expectedPower));
          const href = await root.getByTestId("rdw-exact-quote").getAttribute("href");
          const message = new URL(href).searchParams.get("text");
          assert.ok(message.includes(`${payload.vehicle.make} ${payload.vehicle.model}`));
          assert.ok(message.includes(plate));
          assert.ok(message.includes(String(payload.vehicle.engine.powerKw)+" kW"));
          assert.ok(message.includes(expectedPower));
          assert.ok(message.includes(formatEstimateSource(stage,locale)));
          if (stage.torqueNm !== undefined || stage.torqueRangeNm) assert.ok(message.includes(formatEstimateTorque(stage,locale)));
          assert.ok(message.includes(`(${payload.vehicle.registration.firstAdmissionYear})`));
          assert.ok(!/confirmed-locked|ECU: SID211/.test(message));
          stageResults.push({stage:stage.name,powerHp:stage.powerHp,powerRangeHp:stage.powerRangeHp,torqueNm:stage.torqueNm,torqueRangeNm:stage.torqueRangeNm,provenance:stage.provenance,visiblePower:expectedPower,visibleTorque:formatEstimateTorque(stage,locale)});
        }
        await rows.nth(0).click();
        const options = root.locator('input[type="checkbox"]');
        assert.ok(await options.count()>0,`${plate}: options available`);
        const firstOption = options.first();
        const before = new URL(await root.getByTestId("rdw-exact-quote").getAttribute("href")).searchParams.get("text");
        await firstOption.check();
        const after = new URL(await root.getByTestId("rdw-exact-quote").getAttribute("href")).searchParams.get("text");
        assert.notEqual(after,before,`${plate}: selected option carried to WhatsApp`);
        const availableFirst = serviceOptions.find(option => profile.options.includes(option.id) && !option.requiresGearbox);
        if (availableFirst && payload.tuningQuote.kind === "from") {
          // The first available option uses the existing service order for these live profiles.
          assert.ok(after.includes(formatQuote(addQuoteOptions(payload.tuningQuote,Math.round(availableFirst.price*100)),locale)));
        }
        await firstOption.uncheck();
        // Recharts animates initially. Verify the actual plotted curve, not just
        // its container, before recording chart acceptance or taking evidence.
        await page.waitForTimeout(1800);
        const powerCurve = root.locator(".recharts-area-curve").first();
        await powerCurve.waitFor({state:"visible"});
        const curve = await powerCurve.evaluate(element => ({path:element.getAttribute("d"),width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height}));
        assert.ok(curve.path?.length > 40 && curve.width > 50 && curve.height > 0,`${plate}: numeric power curve drawn`);
        const metrics = await layoutMetrics(root);
        assert.ok(metrics.documentWidth <= width,`${plate} ${locale} ${width}: viewport overflow`);
        assert.deepEqual(metrics.overflow,[],`${plate} ${locale} ${width}: clipped result content`);
        assert.deepEqual(pageErrors,[],`${plate}: browser runtime errors`);
        if (locale === "nl" && [320,1440].includes(width)) {
          const screenshot = `live-${plate.toLowerCase()}-${width}.png`;
          await root.screenshot({path:path.join(output,screenshot)});
          report.screenshots.push(screenshot);
        }
        report.results.push({...fixture,identity:payload.vehicle,selectedLevel:payload.tuningEstimate.resolutionLevel,profile:profile.id,stages:stageResults,quote:payload.tuningQuote,responseBytes:payloadBytes,requestDurationMs:durationMs,serverTiming:response.headers()["server-timing"],cache:response.headers()["x-rdw-cache"],chart:true,powerCurve:curve,options:true,whatsapp:true,layout:metrics});
        console.log(`PASS live UI ${plate} ${locale} ${width}px ${payloadBytes} bytes ${response.headers()["server-timing"]}`);
      } catch(error) {
        report.errors.push({...fixture,error:error.stack || String(error)});
        throw error;
      } finally {
        await page.close();
      }
    }
  } finally {
    fs.writeFileSync(path.join(output,"browser-acceptance.json"),JSON.stringify(report,null,2)+"\n");
    await browser.close();
  }
  console.log(`Passed ${report.results.length} live browser cases; retained ${report.screenshots.length} screenshots.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
