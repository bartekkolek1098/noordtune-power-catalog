/* eslint-disable @typescript-eslint/no-require-imports */
// Two independent synthetic RDW customer journeys on local/immutable Preview/live.
// Never query a real plate, save owner records, commit tokens, or navigate to WhatsApp.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE ||
  "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {normalizeRdwVehicle} = require("../src/lib/rdw.ts");
const frozen = require("../data/research/nl-top-groups-output-sample.json");
const base = process.env.RDW_QA_URL || "http://127.0.0.1:3154";
const output = process.env.RDW_QA_OUTPUT || "C:/Users/barto/Desktop/noordtune-audi-a1-8x-qa";
const oidcToken = process.env.VERCEL_OIDC_TOKEN || "";
const apps=[
  {id:"12",cc:1197,kw:63,ps:86,originalTorque:160,power:[105,130],torque:[175,220],year:"2011",plate:"QA012X"},
  {id:"14",cc:1390,kw:90,ps:122,originalTorque:200,power:[135,155],torque:[230,270],year:"2011",plate:"QA014X"}
];
const cases=apps.flatMap(app=>["nl","en","pl"].flatMap(locale=>
  [320,390,1180].map(width=>({app,locale,width}))));
const results=[];
(async ()=>{
  fs.mkdirSync(output,{recursive:true});
  const browserBin=["C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
  const browser=await chromium.launch({headless:true,...(browserBin?{executablePath:browserBin}:{})});
  const ctx=await browser.newContext({viewport:{width:390,height:950},reducedMotion:"reduce"});
  const previewOrigin=new URL(base).origin;
  const isVercelPreview=new URL(base).hostname.endsWith(".vercel.app");
  if(oidcToken && isVercelPreview){
    await ctx.route(url=>url.origin===previewOrigin,route=>route.continue({
      headers:{...route.request().headers(),"x-vercel-trusted-oidc-idp-token":oidcToken}
    }));
  }
  try {
    for(const {app,locale,width} of cases){
      const row=frozen.rows.find(item=>
        item.vehicle.merk==="AUDI" && item.vehicle.handelsbenaming==="AUDI A1" &&
        item.vehicle.type==="8X" &&
        Number(item.vehicle.cilinderinhoud)===app.cc &&
        item.vehicle.datum_eerste_toelating_dt?.startsWith(app.year) &&
        item.fuels.some(f=>f.brandstof_omschrijving==="Benzine" &&
          Number(f.nettomaximumvermogen)===app.kw));
      assert.ok(row,app.id+" frozen RDW observation");
      const payload=normalizeRdwVehicle(row.vehicle,row.fuels,app.plate);
      delete payload.raw;
      assert.equal(payload.tuningEstimate.profile?.id,
        app.id==="12"?"rdw-audi-a1-8x-12-tfsi-86":"rdw-audi-a1-8x-14-tfsi-122");
      assert.deepEqual(payload.tuningEstimate.profile.stages[0].powerRangeHp,app.power);
      assert.deepEqual(payload.tuningEstimate.profile.stages[0].torqueRangeNm,app.torque);
      const page=await ctx.newPage();
      await page.setViewportSize({width,height:950});
      const runtimeErrors=[],privacyErrors=[];
      page.on("pageerror",e=>runtimeErrors.push(e.message));
      page.on("request",request=>{
        if(request.url().toUpperCase().includes(app.plate))privacyErrors.push("plate in requested URL");
        if((request.postData()||"").toUpperCase().includes(app.plate) &&
          !(request.url().includes("/api/rdw-lookup")&&request.method()==="POST"))
          privacyErrors.push("plate in non-RDW request body");
      });
      await page.route("**/api/rdw-lookup",route=>route.fulfill({
        status:200,contentType:"application/json",body:JSON.stringify(payload)
      }));
      const response=await page.goto(`${base}/${locale}`,{waitUntil:"domcontentloaded"});
      assert.equal(response?.status(),200,`${app.id}/${locale}/${width} homepage HTTP`);
      const input=page.locator('input[maxlength="10"]');
      await input.waitFor({state:"visible"});
      await input.fill(app.plate);
      const awaited=page.waitForResponse(r=>r.url().includes("/api/rdw-lookup") &&
        r.request().method()==="POST");
      await input.locator("xpath=ancestor::form").locator('button[type="submit"]').click();
      assert.equal((await awaited).status(),200);
      const result=page.getByTestId("rdw-result");
      await result.waitFor({state:"visible"});
      const text=await result.innerText();
      assert.ok(text.includes("AUDI AUDI A1"),"Actual RDW make and model preserved");
      assert.ok(text.includes(app.kw+" kW"),"Exact original kW displayed");
      assert.ok(text.includes(app.cc+" cc"),"Exact displacement displayed");
      assert.ok(text.includes(String(app.ps)),"Rounded original metric PS displayed");
      for(const value of [...app.power,...app.torque])
        assert.ok(text.includes(String(value)),`Missing independently sourced ${value}`);
      const rowStage=result.locator("tbody tr").first();
      assert.ok((await rowStage.innerText()).includes(String(app.power[0])));
      await rowStage.click();
      assert.ok(await result.getByTestId("rdw-exact-quote").isVisible(),"Stage 1 enquiry");
      const href=await result.getByTestId("rdw-exact-quote").getAttribute("href");
      assert.ok(!href||!href.toUpperCase().includes(app.plate),"plate must not appear in enquiry URL");
      assert.equal(await result.getByTestId("catalog-power-chart").count(),1,"Stage 1 chart present");
      assert.equal(await result.getByTestId("rdw-pending-chart").count(),0,"source values displayed");
      assert.ok(!text.includes("Stage 3+"),"No public Stage 3");
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      assert.ok(overflow<=1,`${app.id}/${locale}/${width} horizontal overflow ${overflow}`);
      assert.deepEqual(runtimeErrors,[],"No page errors");
      assert.deepEqual(privacyErrors,[],"No plate leaked to request URL/other POST");
      if(width===390)await result.screenshot({path:path.join(output,`audi-a1-${app.id}-${locale}-390.png`)});
      results.push({application:app.id,locale,width,http:response.status(),
        stockKw:app.kw,stockPs:app.ps,stage1Hp:app.power,stage1TorqueNm:app.torque,
        overflow,errorCount:runtimeErrors.length});
      console.log(`PASS AUDI_A1_BROWSER ${app.id} ${locale} ${width}px`);
      await page.close();
    }
    assert.equal(results.length,18);
    fs.writeFileSync(path.join(output,"qa-summary.json"),
      JSON.stringify({checkedAt:new Date().toISOString(),results,errors:[]},null,2)+"\n");
    console.log("AUDI_A1_BROWSER_QA_PASS: 18/18, 2 scoped engines × NL/EN/PL × 320/390/1180; "+
      (oidcToken&&isVercelPreview?"authorized protected preview":"local/public HTTP"));
  }finally{
    await ctx.close();
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1});
