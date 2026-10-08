/* eslint-disable @typescript-eslint/no-require-imports */
// Bulk browser acceptance: all 15 source-reviewed RDW applications × three
// customer locales on 390 px and NL also 320/1180px = 75 real UI journeys.
// Inputs exclusively use fixed synthetic plates + frozen stripped technical RDW.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||
  "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const frozen=require("../data/research/nl-top-groups-output-sample.json");
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const {reviewedRdwBulkBatch2:reviewedBulkRdwApplications}=require("../src/data/reviewed-rdw-bulk-batch-2.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3157";
const output=process.env.RDW_QA_OUTPUT||"C:/Users/barto/Desktop/noordtune-rdw-bulk-qa";
const oidc=process.env.VERCEL_OIDC_TOKEN||"";
const previewOrigin=new URL(base).origin;
const protectedPreview=new URL(base).hostname.endsWith(".vercel.app");
const selectedApps=process.env.RDW_QA_ONLY
 ? reviewedBulkRdwApplications.filter(a=>a.id===process.env.RDW_QA_ONLY)
 : reviewedBulkRdwApplications;
assert.ok(selectedApps.length>0,"Explicit QA subset must identify an approved application");
const expectedJourneys=selectedApps.length*5;
const scenarios=selectedApps.flatMap((app,index)=>{
  const tasks=["nl","en","pl"].map(locale=>({app,index,locale,width:390}));
  tasks.push({app,index,locale:"nl",width:320},{app,index,locale:"nl",width:1180});
  return tasks;
});
assert.equal(reviewedBulkRdwApplications.length,20);
assert.equal(scenarios.length,expectedJourneys);
const allowed=frozen.rows;
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browserBin=["C:/Program Files/Google/Chrome/Application/chrome.exe",
   "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(browserBin?{executablePath:browserBin}:{})});
 const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:"reduce"});
 if(oidc&&protectedPreview){
  await context.route(url=>url.origin===previewOrigin,route=>route.continue({
    headers:{...route.request().headers(),"x-vercel-trusted-oidc-idp-token":oidc}
  }));
 }
 const results=[];
 try{
  for(const app of selectedApps){
   const index=reviewedBulkRdwApplications.indexOf(app);
   const row=allowed.find(r=>
     r.vehicle.merk?.toLowerCase()===app.make.toLowerCase()&&
     r.vehicle.handelsbenaming?.toLowerCase()===app.allowedRdwModels[0].toLowerCase()&&
     r.vehicle.type?.toLowerCase()===app.requiredRdwType.toLowerCase()&&
     Number(r.vehicle.cilinderinhoud)===app.displacementCc&&
     Number(r.vehicle.aantal_cilinders)===app.cylinders&&
     Number(r.vehicle.datum_eerste_toelating_dt?.slice(0,4))>=app.yearFrom&&
     Number(r.vehicle.datum_eerste_toelating_dt?.slice(0,4))<=app.yearTo&&
     r.fuels.length===1&&r.fuels[0].brandstof_omschrijving===(app.fuel==="Petrol"?"Benzine":"Diesel")&&
     Math.abs(Number(r.fuels[0].nettomaximumvermogen)-app.registeredPowerKw)<0.25);
   assert.ok(row,app.id+" has independent frozen registration evidence");
   const plate="QA"+String(index+1).padStart(4,"0");
   const payload=normalizeRdwVehicle(row.vehicle,row.fuels,plate);
   delete payload.raw;
   assert.equal(payload.tuningEstimate.profile?.id,app.id);
   assert.deepEqual(payload.tuningEstimate.profile?.stages[0].powerRangeHp,app.powerRangeHp);
   assert.deepEqual(payload.tuningEstimate.profile?.stages[0].torqueRangeNm,app.torqueRangeNm);
   const items=scenarios.filter(c=>c.app===app);
   // Run UI journeys sequentially: Chromium form hydration and mocked RDW POST
   // can race when 5 pages submit at once on Windows. Bulk throughput is
   // achieved by grouping 15 applications under one QA/release, not risky UI races.
   const batch=[];
   for(const {locale,width} of items){
    const page=await context.newPage();
    try{
     await page.setViewportSize({width,height:950});
     const errors=[],leaks=[];
     page.on("pageerror",e=>errors.push(e.message));
     page.on("request",r=>{
       if(r.url().toUpperCase().includes(plate))leaks.push("Registration appeared in URL");
       if((r.postData()||"").toUpperCase().includes(plate)&&
         !(r.url().includes("/api/rdw-lookup")&&r.method()==="POST"))
         leaks.push("Registration appeared in a non-RDW request body");
     });
     await page.route("**/api/rdw-lookup",route=>route.fulfill({
      status:200,contentType:"application/json",body:JSON.stringify(payload)
     }));
     const resp=await page.goto(base+"/"+locale,{waitUntil:"domcontentloaded",timeout:45000});
     assert.equal(resp?.status(),200,app.id+" "+locale+" home HTTP");
     const field=page.locator('input[maxlength="10"]');
     await field.waitFor({state:"visible"});
     // Server HTML can show the form before Next/React attaches its handlers.
     // Wait for the actual client component to hydrate, not an arbitrary sleep.
     await page.waitForFunction(()=>{
       const element=document.querySelector('input[maxlength="10"]');
       return Boolean(element&&Object.keys(element).some(key=>key.startsWith("__reactFiber$")));
     },null,{timeout:30000});
     await field.fill(plate);
     const api=page.waitForResponse(r=>r.url().includes("/api/rdw-lookup")&&r.request().method()==="POST");
     await field.locator("xpath=ancestor::form").locator('button[type="submit"]').click();
     assert.equal((await api).status(),200);
     const result=page.getByTestId("rdw-result");
     await result.waitFor({state:"visible"});
     const text=await result.innerText();
     assert.ok(text.includes(payload.vehicle.make)&&text.includes(payload.vehicle.model),
      "Original RDW make/model visible");
     const facts=await page.getByTestId("rdw-vehicle-facts").innerText();
     const localeKw=new Intl.NumberFormat(locale==="en"?"en-GB":locale).format(app.registeredPowerKw);
     assert.ok(facts.includes(localeKw+" kW"),app.id+" exact original RDW kW in localized panel");
     const expectedCc=new Intl.NumberFormat(locale==="en"?"en-GB":locale).format(app.displacementCc)+" cm"+String.fromCharCode(179);
     assert.ok(facts.includes(expectedCc),app.id+" exact registered engine displacement displayed");
     assert.ok(text.includes(String(app.stockPowerHp)),app.id+" correctly rounded factory PS");
     for(const value of [...app.powerRangeHp,...app.torqueRangeNm])
       assert.ok(text.includes(String(value)),app.id+" missing sourced Stage1 "+value);
     const stageRow=result.locator("tbody tr").first();
     assert.ok((await stageRow.innerText()).includes(String(app.powerRangeHp[0])));
     await stageRow.click();
     const quote=result.getByTestId("rdw-exact-quote");
     assert.ok(await quote.isVisible(),app.id+" has customer enquiry");
     const href=await quote.getAttribute("href");
     assert.ok(!href||!href.toUpperCase().includes(plate),"No registration leaked in contact URL");
     assert.equal(await result.getByTestId("catalog-power-chart").count(),1);
     assert.equal(await result.getByTestId("rdw-pending-chart").count(),0);
     assert.ok(!text.includes("Stage 3+"),"Stage 3 must not be public");
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
     assert.ok(overflow<=1,app.id+" "+locale+" "+width+" horizontal overflow="+overflow);
     assert.deepEqual(errors,[],app.id+" browser runtime errors");
     assert.deepEqual(leaks,[],app.id+" plate privacy");
     if(locale==="nl"&&width===390)
       await result.screenshot({path:path.join(output,app.id+"-nl-390.png")});
     console.log("PASS RDW_BULK_BROWSER "+app.id+" "+locale+" "+width);
     batch.push({application:app.id,locale,width,originalKw:app.registeredPowerKw,
      stockPs:app.stockPowerHp,stage1:app.powerRangeHp,torque:app.torqueRangeNm,overflow});
    }finally{await page.close();}
   }
   assert.equal(batch.length,5);
   results.push(...batch);
   console.log("PASS RDW_BULK_APPLICATION "+app.id+" "+results.length+"/"+expectedJourneys);
  }
  assert.equal(results.length,expectedJourneys);
  fs.writeFileSync(path.join(output,"qa-summary.json"),
    JSON.stringify({checkedAt:new Date().toISOString(),applicationCount:selectedApps.length,
      count:results.length,results,protectedPreview:!!(oidc&&protectedPreview)},null,2)+"\n");
  console.log("RDW_BULK2_BROWSER_QA_PASS: "+results.length+"/"+expectedJourneys+" across "+selectedApps.length+" exact source-reviewed RDW applications "+
    "(NL/EN/PL 390px and NL 320/1180px); "+(oidc&&protectedPreview?"protected preview":"local/public HTTP"));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
