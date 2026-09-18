/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {formatEstimatePower, formatEstimateTorque, formatEstimateSource, genericEstimateNote, estimateLimitations} = require("../src/lib/estimate-copy.ts");
const {formatQuote, addQuoteOptions, resolveStageQuote, assessVehicleAccess} = require("../src/data/pricing.ts");
const {normalizeRdwVehicle} = require("../src/lib/rdw.ts");
const {isVehicleServiceSelectable} = require("../src/lib/vehicle-services.ts");
const {serviceOptions} = require("../src/data/catalog-shared.ts");
const output=path.resolve('docs/tuning-data/browser-v3-2');
const base=process.env.RDW_QA_URL||'http://localhost:3120';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const plates=['H329XH','V380ST','V978ZF','KKH27K'];
const liveIdentities=read('docs/tuning-qa/runtime/live-rdw-identities.json').identities;
const priorOwner=read('docs/tuning-data/browser-v3/owner-browser-acceptance.json').results.filter(r=>r.liveApi);
const ledger=read('data/research/v3-2-next20-decisions.json');
const sample=read('data/research/nl-top-groups-output-sample.json').rows;
const outcomes=read('data/research/v3-2-results.json');
const synthetic=ledger.decisions.flatMap(d=>d.selectedProfiles.map(profile=>({rank:d.rank,profile,input:d}))).map(({rank,profile,input},index)=>{
 const result=outcomes.observedRows.find(r=>r.selectedProfile===profile.id);
 const row=result?sample.find(r=>r.sampleId===result.sampleId):{
   vehicle:{merk:input.make,handelsbenaming:input.model,cilinderinhoud:String(input.displacementCc),aantal_cilinders:'4',datum_eerste_toelating:String(profile.yearFrom)+'0101'},
   fuels:[{brandstof_omschrijving:input.fuel==='Petrol'?'Benzine':'Diesel',nettomaximumvermogen:String(input.registeredPowerKw)}]
 };
 const plate='QA32'+String(index+1).padStart(2,'0');
 const payload=normalizeRdwVehicle(row.vehicle,row.fuels,plate);delete payload.raw;
 assert.equal(payload.tuningEstimate.profile.id,profile.id);
 return {plate,id:'rank-'+rank+'-'+profile.yearFrom,rank,sampleId:row.sampleId,payload};
});
const identities=[...plates.map(plate=>({plate,id:plate.toLowerCase()})),...synthetic];
const cases=[...[320,390,768,1440].flatMap(width=>identities.map(f=>({...f,width,locale:'nl'}))),
 ...['en','pl'].flatMap(locale=>identities.filter(f=>f.plate==='V380ST'||f.rank===2||f.rank===7||f.rank===20).map(f=>({...f,width:320,locale})))];
const report={checkedAt:new Date().toISOString(),base,datasetFingerprint:outcomes.datasetFingerprint,method:'Four owner plates use the genuine local HTTP RDW route without interception. Each of the 23 new profiles uses a separate deterministic DTO through the production normalizer. A sampleId identifies an unchanged sanitized frozen RDW row; absent sampleId means a synthetic technical identity in a sourced year not represented by that cohort. QA32xx inputs are synthetic and intercepted, not live plate lookups.',screenshots:[],results:[],errors:[]};

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
        if (fixture.payload) await page.route("**/api/rdw-lookup", route => route.fulfill({status:200, contentType:"application/json", body:JSON.stringify(fixture.payload)}));
        await page.goto(`${base}/${locale}`,{waitUntil:"networkidle"});
        const input = page.locator('input[maxlength="10"]');
        await input.fill(plate);
        const responsePromise = page.waitForResponse(response => response.url().includes("/api/rdw-lookup") && response.request().method() === "POST");
        const startedAt = Date.now();
        await input.locator("xpath=ancestor::form").locator('button[type="submit"]').click();
        const response = await responsePromise;
        assert.equal(response.status(),200,`${plate}: RDW API status`);
        const payload = await response.json();
        const expectedIdentity = liveIdentities.find(item => item.caseId === plate)?.normalizedIdentity;
        if (expectedIdentity) assert.deepEqual({make:payload.vehicle.make,model:payload.vehicle.model,cc:payload.vehicle.engine.displacementCc,kw:payload.vehicle.engine.powerKw,date:payload.vehicle.registration.firstAdmission,type:payload.vehicle.type,variant:payload.vehicle.variant,execution:payload.vehicle.execution},
          {make:expectedIdentity.make,model:expectedIdentity.model,cc:expectedIdentity.displacementCc,kw:expectedIdentity.registeredPower.value,date:expectedIdentity.firstRegistrationDate,type:expectedIdentity.type,variant:expectedIdentity.variant,execution:expectedIdentity.execution},`${plate}: actual local API preserves the independently retrieved RDW identity`);
        const durationMs = Date.now()-startedAt;
        const payloadBytes = Buffer.byteLength(JSON.stringify(payload));
        assert.ok(payloadBytes < 25000,`${plate}: compact response ${payloadBytes} bytes`);
        assert.equal(payload.raw,undefined);
        assert.equal(payload.tuningMatch.candidates,undefined);
        assert.equal(payload.tuningMatch.variant,undefined);
        const profile = payload.tuningEstimate.profile;
        const root = page.getByTestId("rdw-result");
        await root.waitFor({state:"visible"});
        if (!profile) {
          assert.equal(fixture.id,"unsupported-ev");
          assert.equal(payload.tuningQuote.kind,"on-request");
          await root.getByTestId("rdw-pending-chart").waitFor({state:"visible"});
          assert.equal(await root.getByTestId("catalog-power-chart").count(),0);
          assert.equal(await root.locator('input[type="checkbox"]').count(),0, "Unsupported EV offers no unscoped tuning services");
          const message = new URL(await root.getByTestId("rdw-manual-review-quote").getAttribute("href")).searchParams.get("text");
          assert.ok(message.includes(plate) && message.includes("ECU"));
          assert.ok(!/269|700/.test(message));
          const metrics = await layoutMetrics(root);
          assert.ok(metrics.documentWidth <= width);
          assert.deepEqual(metrics.overflow,[]);
          assert.deepEqual(pageErrors,[]);
          if (width === 320) {
            const screenshot = `${fixture.id}-${width}.png`;
            await root.screenshot({style:'header, [class~="fixed"] {visibility:hidden !important;}',path:path.join(output,screenshot)});
            report.screenshots.push(screenshot);
          }
          report.results.push({id:fixture.id,plate,width,locale,liveApi:false,identity:payload.vehicle,quote:payload.tuningQuote,unsupported:true,layout:metrics,whatsapp:true});
          console.log(`PASS synthetic unsupported ${width}px`);
          continue;
        }
        assert.equal(profile.stages.length,3);
        if(fixture.payload)assert.equal(profile.id,fixture.payload.tuningEstimate.profile.id);
        else {
          const prior=priorOwner.find(r=>r.identity.make===payload.vehicle.make&&r.identity.model===payload.vehicle.model&&r.locale===locale);
          assert.ok(prior,plate+' prior owner result');assert.equal(profile.id,prior.profile);assert.deepEqual(payload.tuningQuote,prior.quote);
          const facts=s=>({name:s.name??s.stage,powerHp:s.powerHp,torqueNm:s.torqueNm,powerRangeHp:s.powerRangeHp,torqueRangeNm:s.torqueRangeNm,provenance:s.provenance});
          assert.deepEqual(profile.stages.map(facts),prior.stages.map(facts),plate+' retains reviewed technical output');
        }
        assert.ok(profile.stages.every(stage => stage.customHardware || Number.isFinite(stage.powerHp) || stage.powerRangeHp?.every(Number.isFinite)));
        await root.getByTestId("catalog-power-chart").waitFor({state:"visible"});
        await root.getByTestId("rdw-estimate-output").waitFor({state:"visible"});
        const initialText = await root.innerText();
        assert.ok(initialText.includes(`${payload.vehicle.make} ${payload.vehicle.model}`));
        assert.ok(initialText.includes(`${payload.vehicle.engine.displacementCc} cc`));
        assert.ok(initialText.includes(String(payload.vehicle.engine.powerHp)));
        assert.ok(!/sourced-[a-z]|candidate|confidenceScore|selectedProfileId|contentSha256/i.test(initialText),'No debug/source ID leakage in visible result');
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
          assert.equal(await row.getAttribute("data-stage-provenance"),stage.provenance ?? null);
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
          const quote = resolveStageQuote(profile,stage,{scope:"vehicle",estimateApplicable:true,access:assessVehicleAccess(profile)});
          const messagePrice = quote.kind === "from" ? formatQuote(quote,locale) : {nl:"Prijs: op aanvraag na ECU- en voertuigcontrole",en:"Price: on request after ECU and vehicle verification",pl:"Cena: wycena indywidualna po weryfikacji ECU i pojazdu"}[locale];
          assert.ok(message.includes(messagePrice), `${plate} ${stage.name}: WhatsApp price agrees`);
          assert.ok((await root.innerText()).includes(formatQuote(quote,locale)), `${plate} ${stage.name}: visible price agrees`);
          if (index === 2) assert.equal(quote.kind,"on-request");
          else if (!fixture.payload && (plate !== "KKH27K" || index === 0)) assert.equal(quote.kind,"from");
          if (fixture.id === "bmw-340i-hardware" && index === 2) {
            const details = root.locator("#rdw-estimate-details");
            await details.locator("summary").click();
            for (const fact of ["downpipe", "B58TU high-pressure fuel pump", "upgraded B58 turbo", "RON 98"]) {
              assert.ok((await details.innerText()).includes(fact), `Published hardware scope visible: ${fact}`);
              assert.ok(message.includes(fact), `Published hardware scope in WhatsApp: ${fact}`);
            }
            const expanded = await layoutMetrics(root);
            assert.deepEqual(expanded.overflow, [], "Expanded hardware details fit the viewport");
            await details.locator("summary").click();
          }
          assert.ok(!/€\s*269\b/.test(message));
          if (stage.provenance === "generic-indicative") {
            assert.equal(stage.powerHp,undefined);
            assert.ok(stage.powerRangeHp.every(value => value % 5 === 0));
            assert.ok(message.includes(genericEstimateNote(locale)));
            assert.ok((await root.innerText()).includes(genericEstimateNote(locale)));
          }
          if (plate === "V978ZF") {
            assert.ok(profile.conditionCodes.includes("NOORDTUNE_TARGET_REVIEW_REQUIRED"));
            assert.ok(message.includes(estimateLimitations(profile,locale)[0]));
          }
          if (plate === "V380ST") assert.ok((await root.innerText()).includes("TDCi/EcoBlue") || (await root.innerText()).includes("EcoBlue"), "Engine generation condition remains visible at every Stage");
          if (stage.torqueNm !== undefined || stage.torqueRangeNm) assert.ok(message.includes(formatEstimateTorque(stage,locale)));
          assert.ok(message.includes(`(${payload.vehicle.registration.firstAdmissionYear})`));
          assert.ok(!/confirmed-locked|ECU: SID211/.test(message));
          stageResults.push({stage:stage.name,powerHp:stage.powerHp,powerRangeHp:stage.powerRangeHp,torqueNm:stage.torqueNm,torqueRangeNm:stage.torqueRangeNm,provenance:stage.provenance,visiblePower:expectedPower,visibleTorque:formatEstimateTorque(stage,locale),quote});
        }
        await rows.nth(0).click();
        const options = root.locator('input[type="checkbox"]');
        assert.ok(await options.count()>0,`${plate}: options available`);
        const firstOption = options.first();
        const before = new URL(await root.getByTestId("rdw-exact-quote").getAttribute("href")).searchParams.get("text");
        await firstOption.check();
        const after = new URL(await root.getByTestId("rdw-exact-quote").getAttribute("href")).searchParams.get("text");
        assert.notEqual(after,before,`${plate}: selected option carried to WhatsApp`);
        const availableFirst = serviceOptions.find(option => isVehicleServiceSelectable(profile,option));
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
        if (profile.stages.some(stage => stage.powerRangeHp)) {
          assert.equal(await root.getByTestId("catalog-power-chart").getAttribute("data-has-ranges"),"true");
          assert.ok(await root.locator(".recharts-area-area").first().evaluate(element => element.getBoundingClientRect().height > 0), `${plate}: actual range band drawn`);
        }
        const metrics = await layoutMetrics(root);
        assert.ok(metrics.documentWidth <= width,`${plate} ${locale} ${width}: viewport overflow`);
        assert.deepEqual(metrics.overflow,[],`${plate} ${locale} ${width}: clipped result content`);
        assert.deepEqual(pageErrors,[],`${plate}: browser runtime errors`);
        if (locale === "nl" && width === 320 && ([2,7,20].includes(fixture.rank)||["V380ST","KKH27K"].includes(plate))) {
          const screenshot = `${fixture.id}-${width}.png`;
          await root.screenshot({style:'header, [class~="fixed"] {visibility:hidden !important;}',path:path.join(output,screenshot)});
          report.screenshots.push(screenshot);
        }
        report.results.push({id:fixture.id,width,locale,rank:fixture.rank,sampleId:fixture.sampleId,liveApi:!fixture.payload,identity:payload.vehicle,selectedLevel:payload.tuningEstimate.resolutionLevel,profile:profile.id,coverageClass:payload.tuningEstimate.coverageClass,stages:stageResults,quote:payload.tuningQuote,responseBytes:payloadBytes,requestDurationMs:durationMs,serverTiming:response.headers()["server-timing"],cache:response.headers()["x-rdw-cache"],chart:true,powerCurve:curve,options:true,whatsapp:true,layout:metrics});
        console.log(`PASS ${fixture.payload ? "synthetic" : "live"} UI ${plate} ${locale} ${width}px ${payloadBytes} bytes`);
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
  console.log(`Passed ${report.results.length} browser cases; retained ${report.screenshots.length} screenshots.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
