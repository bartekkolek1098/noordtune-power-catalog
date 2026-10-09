/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlStage1EngineProfiles}=require("../src/data/nl-stage1-engine-seo.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3201";
const priority=[
 "nissan-qashqai-j11-12-dig-t-115",
 "bmw-320i-f30-n20-184",
 "bmw-320i-f30-b48-184",
 "ford-transit-connect-15-ecoblue-100",
 "volkswagen-golf-7-gti-performance-245",
 "renault-master-iii-23-blue-dci-145"
];
(async()=>{
 const bin=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(bin?{executablePath:bin}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const headErrors=[];page.on("pageerror",e=>headErrors.push(e.message));
  const idx=await page.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(idx?.status(),200,"NL engine index status");
  assert.equal(await page.locator("h1").count(),1);
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/motoren"));
  assert.equal(await page.locator(".ux-mobile-actions a").first().getAttribute("href"),"/nl#rdw-check","Index mobile bar opens real RDW lookup");
  const links=await page.locator('a[href^="/nl/motoren/"]').evaluateAll(a=>[...new Set(a.map(x=>x.getAttribute("href")))]);
  assert.equal(links.length,21,"21 unique engine profile links SSR on NL index");
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390));
  const sitemap=await page.request.get(base+"/sitemap.xml");
  assert.equal(sitemap.status(),200);
  const xml=await sitemap.text();
  const motorLoc=[...xml.matchAll(/<loc>([^<]*\/nl\/motoren(?:\/[^<]+)?)<\/loc>/g)].map(x=>x[1]);
  assert.equal(motorLoc.length,22,"1 index plus 21 NL engine URLs");
  assert.equal(new Set(motorLoc).size,22);
  assert.ok(!xml.includes("/en/motoren/")&&!xml.includes("/pl/motoren/"),"Pilot only indexes Dutch URLs");
  await page.screenshot({path:process.env.TEMP+"/noordtune-nl-engine-index-mobile.png",fullPage:false});

  let mobileVerified=0;
  for(const slug of priority){
   const entry=nlStage1EngineProfiles.find(p=>p.slug===slug);
   assert.ok(entry);
   const response=await page.goto(base+"/nl/motoren/"+slug,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(response?.status(),200,slug);
   assert.equal(await page.locator("h1").count(),1);
   const h1=await page.locator("h1").innerText();assert.ok(h1.includes(entry.headline));
   assert.equal(await page.locator(".ux-mobile-actions a").first().getAttribute("href"),"/nl#rdw-check","Motor page mobile CTA opens RDW lookup");
   const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
   assert.ok(canonical?.endsWith("/nl/motoren/"+slug));
   assert.ok(!(await page.locator("meta[name='robots']").getAttribute("content")||"").includes("noindex"));
   const outbound=await page.locator(".ux-nl-engine-sources ul li a[href^='https://']").count();
   assert.ok(outbound>=2);
   const variantCount=await page.locator(".ux-nl-engine-variant").count();
   assert.equal(variantCount,entry.applications.length);
   const sourceLabels=await page.locator(".ux-nl-engine-sources ul").innerText();
   assert.ok(sourceLabels.includes("Stage 1")||sourceLabels.length>50);
   const txt=await page.locator(".ux-nl-engine-scope-note").innerText();
   assert.match(txt,/Geen NoordTune-meting/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"No mobile overflow on "+slug);
   if(slug===priority[0]){
    await page.screenshot({path:process.env.TEMP+"/noordtune-nl-engine-qashqai-mobile.png",fullPage:false});
   }
   mobileVerified++;
   console.log("NL_ENGINE_BROWSER_PASS",slug,variantCount,outbound);
  }
  for(const p of nlStage1EngineProfiles){
   const resp=await page.request.get(base+"/nl/motoren/"+p.slug);
   assert.equal(resp.status(),200,"SSG page "+p.slug);
  }
  for(const target of ["/en/motoren","/pl/motoren","/en/motoren/"+priority[0],"/pl/motoren/"+priority[0]]){
   const response=await page.request.get(base+target);
   assert.equal(response.status(),404,"Non-NL locales should not create thin duplicate pages");
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/motoren/"+priority[1],{waitUntil:"domcontentloaded",timeout:45000});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1440),"No desktop overflow");
  const sourceRows=await page.locator(".ux-nl-engine-sources ul li").count();
  assert.ok(sourceRows>=2);
  await page.screenshot({path:process.env.TEMP+"/noordtune-nl-engine-bmw-desktop.png",fullPage:false});
  assert.deepEqual(headErrors,[],"No frontend runtime errors");
  console.log("NL_ENGINE_SEO_BROWSER_PASS",JSON.stringify({indexProfiles:links.length,sitemapNewUrls:motorLoc.length,visibleEngineJourneys:mobileVerified+1,ssgRoutes:21,nonDutchUrlsCorrectly404:4,sourceClaimsVisible:true,stableMobileDesktop:true}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1;});
