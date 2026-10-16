/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3161";
const isLive=new URL(base).hostname==="power.noordtune.nl";
const allowed=new Set(["http://127.0.0.1:3161","https://power.noordtune.nl"]);
assert.ok(allowed.has(base),"Catalog conversion QA is restricted to local QA or actual production");

(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const sampled=[
   {path:"/nl/motoren/bmw-320i-g20-g21-b48-184",source:"passenger_engine",hrefPart:"id=auto-bmw-320i-g20-g21-b48-184",label:"BMW 320i"},
   {path:"/nl/bedrijfswagens/motoren/mercedes-sprinter-w906-313-cdi-129-2013",source:"van_engine",hrefPart:"id=mercedes-sprinter-w906-313-cdi-129-2013",label:"Mercedes Sprinter"},
   {path:"/nl/bedrijfswagens/vergelijken/iveco-daily-23-30-euro6-euro6df",source:"van_engine",hrefPart:"id=iveco-daily-",label:"Iveco Daily"}
  ];
  let quoteLinks=0;
  for(const p of sampled){
   const r=await page.goto(base+p.path,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,p.path);
   assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(p.path));
   const tracked=page.getByTestId("catalog-enquiry-link");
   assert.ok(await tracked.count()>=1,p.path+" tracked quote available");
   const first=tracked.first();
   assert.equal(await first.getAttribute("data-catalog-analytics-event"),"catalog_enquiry_click");
   assert.equal(await first.getAttribute("data-catalog-analytics-locale"),"nl");
   assert.equal(await first.getAttribute("data-catalog-analytics-source"),p.source);
   assert.equal(await first.getAttribute("referrerpolicy"),"origin","WWW receives origin-only referrer for legitimate attribution");
   assert.ok(!(await first.getAttribute("rel")??"").includes("noreferrer"),"Do not hide entire trusted source host");
   assert.ok((await first.getAttribute("href")).includes(p.hrefPart),p.path+" exact engine handoff retained");
   assert.ok(await page.locator('a[data-catalog-analytics-event="catalog_whatsapp_click"]').count()>=1);
   const projected=await page.locator('a[data-catalog-analytics-event]').evaluateAll(nodes=>nodes.map(e=>({
    event:e.getAttribute("data-catalog-analytics-event"),
    locale:e.getAttribute("data-catalog-analytics-locale"),
    source:e.getAttribute("data-catalog-analytics-source")
   })));
   assert.ok(projected.every(event=>event.locale==="nl"&&["catalog_enquiry_click","catalog_whatsapp_click"].includes(event.event)));
   assert.ok(projected.every(event=>!Object.values(event).some(s=>/kenteken|vin|registration|plate|email|price/i.test(s||""))));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),p.path+" mobile no overflow");
   quoteLinks+=await tracked.count();
   console.log("CATALOG_ANALYTICS_PAGE_BROWSER_PASS",p.path);
  }
  const homepage=await page.goto(base+"/nl",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(homepage?.status(),200);
  assert.ok(await page.locator('a[data-catalog-analytics-source="mobile_whatsapp"]').count()>=1);
  assert.ok(await page.locator('a[data-catalog-analytics-source="header_whatsapp"]').count()>=1);
  await page.waitForFunction(()=>document.querySelectorAll('script[src*="/_vercel/insights/"]').length===1,null,{timeout:15000});
  const scripts=await page.locator('script[src*="/_vercel/insights/"]').count();
  assert.equal(scripts,1,"Exactly one Vercel Analytics loader after client hydration");

  // Verify real cross-domain referrer and exact context; no customer enquiry sent.
  await page.goto(base+"/nl/bedrijfswagens/motoren/mercedes-sprinter-w906-313-cdi-129-2013",{waitUntil:"domcontentloaded"});
  await page.getByTestId("catalog-enquiry-link").click();
  await page.waitForURL(u=>u.origin==="https://www.noordtune.nl"&&u.pathname==="/nl/bedrijfswagens",{timeout:45000});
  await page.locator('[data-testid="catalog-enquiry-status"][data-status="ready"]').waitFor({timeout:35000});
  assert.match(await page.locator("#business-vehicle").inputValue(),/Mercedes Sprinter/i);
  assert.equal(await page.locator("#business-question").inputValue(),"");
  const referrer=await page.evaluate(()=>document.referrer);
  assert.equal(referrer,new URL(base).origin+"/","Only catalog origin should be visible to WWW, without motor path, plate or VIN");
  assert.equal(new URL(page.url()).hash,"#offerte");
  await page.setViewportSize({width:320,height:720});
  await page.goto(base+"/nl/motoren/bmw-320i-g20-g21-b48-184",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"320px mobile page");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/bedrijfswagens/vergelijken/iveco-daily-23-30-euro6-euro6df",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"1440 desktop page");
  assert.deepEqual(errors,[],"No JavaScript runtime errors");
  console.log("CATALOG_ANALYTICS_BROWSER_PASS",JSON.stringify({
   url:base,trackedSamplePages:sampled.length,quoteLinks,
   originOnlyWWWReferrer:true,WWWPrefilledExactMotor:true,testMessagesSent:0,
   privacySafeProperties:["locale","source"],AnalyticsScriptNodes:scripts,
   responsive:[320,390,1440],eventSourcesDistinct:true,siteIsProduction:isLive
  }));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
