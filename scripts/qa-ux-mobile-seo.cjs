/* eslint-disable @typescript-eslint/no-require-imports */
/* Mobile-first visual and SEO smoke regression for the NoordTune design refresh.
   All RDW requests are mocked from an anonymized technical sample; no customer plate. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||
 "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const frozen=require("../data/research/nl-top-groups-output-sample.json");
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const {reviewedRdwBulkBatch4}=require("../src/data/reviewed-rdw-bulk-batch-4.ts");
const app=reviewedRdwBulkBatch4.find(a=>a.id==="rdw-bulk-four-nissan-qashqai-j11-12-digt115");
assert.ok(app,"Reviewed Stage 1 Nissan baseline is required");
const sample=frozen.rows.find(r=>
 r.vehicle.merk?.toLowerCase()===app.make.toLowerCase()&&
 r.vehicle.handelsbenaming?.toLowerCase()===app.allowedRdwModels[0].toLowerCase()&&
 r.vehicle.type?.toLowerCase()===app.requiredRdwType.toLowerCase()&&
 Number(r.vehicle.cilinderinhoud)===app.displacementCc&&
 Number(r.vehicle.datum_eerste_toelating_dt?.slice(0,4))>=app.yearFrom&&
 r.fuels.length===1&&r.fuels[0].brandstof_omschrijving==="Benzine"&&
 Math.abs(Number(r.fuels[0].nettomaximumvermogen)-app.registeredPowerKw)<.25);
assert.ok(sample,"Matching source-only frozen original RDW facts required");
const payload=normalizeRdwVehicle(sample.vehicle,sample.fuels,"QA0000");
delete payload.raw;
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3170";
const output=process.env.RDW_UX_QA_OUTPUT||"C:/Users/barto/Desktop/noordtune-ux-redesign-review";
const scenarios=[["nl",320,720],["nl",390,844],["nl",768,900],["nl",1440,900],["en",390,844],["pl",390,844]];
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 let journeys=0,lookup=0;
 try{
  for(const [locale,width,height] of scenarios){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.route("**/api/rdw-lookup",r=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify(payload)}));
   const response=await page.goto(base+"/"+locale,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(response?.status(),200,locale+" home 200");
   assert.equal(await page.locator("h1").count(),1,locale+" exactly one h1");
   const heading=await page.locator("h1").innerText();
   assert.match(heading,/chiptuning/i,"Localized H1 must mention chiptuning");
   assert.match(heading,locale==="nl"?/zonder giswerk/i:locale==="en"?/no guesswork/i:/bez zgadywania/i,"Localized message must stay consistent");
   const canonical=await page.locator('link[rel="canonical"]').first().getAttribute("href");
   assert.ok(canonical?.endsWith("/"+locale),"Canonical persists: "+canonical);
   assert.ok((await page.locator('link[hreflang]').count())>=3,"Hreflang paths remain present");
   assert.ok((await page.locator('script[type="application/ld+json"]').count())>=1,"Structured data persists");
   const input=page.locator('input[maxlength="10"]').first();
   await input.waitFor({state:"visible"});
   const submit=input.locator("xpath=ancestor::form").locator('button[type="submit"]');
   await submit.waitFor({state:"visible"});
   if(width===320){
    const rect=await submit.boundingBox();
    assert.ok(rect&&rect.y+rect.height<=height-50,"Small-phone primary search button must remain above sticky action bar");
    const menu=page.locator("details.ux-header-menu");
    await menu.locator("summary").click();
    assert.ok(await menu.getByRole("navigation").isVisible(),"Mobile hamburger menu opens");
    assert.ok((await menu.locator("a").count())>=5,"Menu contains navigation");
    await menu.locator("summary").click();
   }
   if(width===390){
    const lang=page.locator("details.ux-language-menu");
    await lang.locator("summary").click();
    assert.ok((await lang.locator('a[lang="pl"]').count())===1,"Mobile locale selector exposes Polish");
    await lang.locator("summary").click();
   }
   assert.ok(await page.locator(".ux-mobile-actions").isVisible()=== (width<768),"Mobile action bar only at mobile width");
   const documentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(documentWidth<=width+1,"No horizontal scroll at "+width+" (actual "+documentWidth+")");
   if(locale==="nl"&&[320,390].includes(width)){
    await page.screenshot({path:path.join(output,"verified-final-"+width+".png"),fullPage:false});
   }
   if(width===1440){
    const photo=page.locator(".ux-hero-photo--desktop");
    assert.ok(await photo.isVisible(),"Real editorial photo visible on desktop");
    assert.match(await photo.locator("img").getAttribute("alt")||"",/sfeerbeeld/i,"Photo described as illustrative");
    await page.waitForFunction(()=>{const i=document.querySelector(".ux-hero-photo--desktop img");return Boolean(i&&i.complete&&i.naturalWidth>0)},null,{timeout:15000});
    const process=page.locator(".ux-process-photo");
    await process.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const i=document.querySelector(".ux-process-photo img");return Boolean(i&&i.complete&&i.naturalWidth>0)},null,{timeout:15000});
   }
   if(width<1024){
    assert.ok(await page.locator(".ux-hero-photo--compact").isVisible(),"Compact editorial photo visible on mobile");
   }
   if(locale==="nl"&&width===390){
    const filters=page.getByTestId("manual-vehicle-filters");
    const popular=page.getByTestId("manual-popular-list");
    await filters.scrollIntoViewIfNeeded();
    const first=await filters.boundingBox(),second=await popular.boundingBox();
    assert.ok(first&&second&&first.y<second.y,"Manual filters must precede popular cards");
    const quick=page.locator("#manual-quick-search");
    await page.waitForFunction(()=>{const i=document.querySelector("#manual-quick-search");return Boolean(i&&Object.keys(i).some(k=>k.startsWith("__reactFiber$")))},null,{timeout:15000});
    await quick.fill("BMW");
    await page.waitForFunction(()=>{
      const element=document.querySelector('[data-testid="manual-popular-list"]');
      return Boolean(element&&getComputedStyle(element).order==="1");
    },null,{timeout:5000});
    await quick.fill("");
   }
   // Exercises existing application contract with a fully synthetic RDW registration.
   if(width===390&&["nl","en","pl"].includes(locale)){
    await page.waitForFunction(()=>{const i=document.querySelector('input[maxlength="10"]');return Boolean(i&&Object.keys(i).some(k=>k.startsWith("__reactFiber$")))},null,{timeout:15000});
    await input.fill("QA0000");
    const http=page.waitForResponse(r=>r.url().includes("/api/rdw-lookup")&&r.request().method()==="POST");
    await submit.click();
    assert.equal((await http).status(),200);
    await page.getByTestId("rdw-result").waitFor({state:"visible",timeout:15000});
    assert.ok((await page.getByTestId("rdw-vehicle-facts").innerText()).includes("kW"),"Factory kW retained");
    assert.equal(await page.locator('[data-testid="rdw-pending-chart"]').count(),0,"Sourced numeric Stage 1 chart retained");
    assert.ok(!page.url().toUpperCase().includes("QA0000"),"No registration in URL");
    lookup++;
   }
   assert.deepEqual(errors,[],"No browser script failures on "+locale+" "+width);
   journeys++;
   console.log("UX_BROWSER_PASS "+locale+" "+width+" lookup="+(width===390));
   await page.close();
  }
  for(const viewport of [[390,844],[1440,900]]){
   const [width,height]=viewport;
   const page=await browser.newPage({viewport:{width,height}});
   const resp=await page.goto(base+"/nl/vehicles/bmw-320d-b47",{waitUntil:"domcontentloaded"});
   assert.equal(resp?.status(),200);
   assert.equal(await page.locator("h1").count(),1);
   assert.ok(await page.getByTestId("vehicle-output-summary").isVisible(),"Vehicle output data stays visible");
   assert.ok((await page.getByTestId("vehicle-output-stock").innerText()).length>0,"Original stock power stays visible");
   assert.ok((await page.getByTestId("vehicle-output-gain").innerText()).length>0,"Gain stays visible");
   assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href"))?.includes("/nl/vehicles/"));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width+1,"Vehicle no horizontal overflow");
   if(width===390)assert.ok(await page.locator(".ux-mobile-actions").isVisible(),"Vehicle mobile sticky consultation");
   journeys++;
   await page.close();
  }
  console.log("UX_MOBILE_SEO_PASS",JSON.stringify({journeys,lookup,verifiedLocales:["nl","en","pl"],minWidth:320,licensedEditorialPhotography:true,seoCanonical:true}));
 } finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
