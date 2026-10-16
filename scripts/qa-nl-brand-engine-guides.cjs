/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlBrandEngineGuides,nlBrandGuidePath}=require("../src/data/nl-brand-engine-guides.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3141";
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const res=await page.goto(base+"/nl/merken",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(res?.status(),200);
  assert.equal(await page.locator("h1").count(),1);
  assert.equal(await page.getByTestId("nl-brand-directory").locator("[data-brand-slug]").count(),nlBrandEngineGuides.length);
  const found=await page.getByTestId("nl-brand-directory").locator("[data-brand-slug]").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("data-brand-slug")));
  assert.deepEqual(new Set(found),new Set(nlBrandEngineGuides.map(g=>g.slug)));
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/merken"));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"Brand directory mobile width");
  const sitemap=await page.request.get(base+"/sitemap.xml");
  assert.equal(sitemap.status(),200);
  const xml=await sitemap.text();
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(urls.length,484,"Twelve added van comparisons without altering NL brand routes");
  assert.equal(new Set(urls).size,484);
  assert.equal(urls.filter(url=>url.includes("/nl/merken")).length,16,"One index and 15 brand guides");
  assert.ok(!xml.includes("/en/merken")&&!xml.includes("/pl/merken"),"No thin translations");
  let checked=0,totalCars=0,totalVans=0,totalModels=0,totalHubs=0;
  for(const g of nlBrandEngineGuides){
   const path=nlBrandGuidePath(g.slug);
   assert.ok(urls.some(u=>u.endsWith(path)),g.slug+" sitemap URL");
   const r=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,path);
   assert.equal(await page.locator("h1").count(),1);
   assert.ok((await page.locator("h1").innerText()).includes(g.headline),g.slug+" unique H1");
   assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(path));
   assert.ok(!(await page.locator('meta[name="robots"]').getAttribute("content")||"").includes("noindex"));
   assert.equal(await page.getByTestId("brand-faq").locator("details").count(),2,g.slug+" original FAQ");
   assert.equal(await page.getByTestId("brand-passenger-engines").locator("article").count(),g.passenger.length,g.slug+" no unrelated car engines");
   assert.equal(await page.getByTestId("brand-van-engines").locator("article").count(),g.vanEngines.length,g.slug+" no unrelated van engines");
   assert.equal(await page.getByTestId("brand-model-hubs").locator('a[href^="/nl/modellen/"]').count(),g.modelHubs.length,g.slug+" model hubs");
   assert.equal(await page.getByTestId("brand-van-models").locator('a[href^="/nl/bedrijfswagens/"]').count(),g.vanModels.length,g.slug+" van models");
   const carLinks=await page.getByTestId("brand-passenger-engines").locator('a[href^="/nl/motoren/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
   assert.deepEqual(new Set(carLinks),new Set(g.passenger.map(p=>"/nl/motoren/"+p.slug)),g.slug+" accurate car motor links");
   const vanLinks=await page.getByTestId("brand-van-engines").locator('a[href^="/nl/bedrijfswagens/motoren/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
   assert.deepEqual(new Set(vanLinks),new Set(g.vanEngines.map(v=>"/nl/bedrijfswagens/motoren/"+v.slug)),g.slug+" accurate van motor links");
   assert.ok(await page.locator('a[href="/nl#rdw-check"]').count()>=1,g.slug+" real plate lookup");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),g.slug+" no mobile horizontal overflow");
   const schema=await page.locator('script[type="application/ld+json"]').first().textContent();
   assert.ok(schema.includes("CollectionPage")&&schema.includes("ItemList"));
   checked++;totalCars+=g.passenger.length;totalVans+=g.vanEngines.length;totalModels+=g.vanModels.length;totalHubs+=g.modelHubs.length;
   console.log("NL_BRAND_BROWSER_PASS",g.slug,g.passenger.length,g.vanEngines.length,g.modelHubs.length);
  }
  for(const [path,selector,expected] of [
   ["/nl/motoren/bmw-320i-g20-g21-b48-184","engine-to-brand-link","/nl/merken/bmw"],
   ["/nl/motoren/audi-a3-8p-14-tfsi-125","engine-to-brand-link","/nl/merken/audi"],
   ["/nl/bedrijfswagens/motoren/mercedes-sprinter-w906-21-cdi-143","van-engine-to-brand-link","/nl/merken/mercedes"],
   ["/nl/bedrijfswagens/motoren/toyota-proace-20-d4d-177-2020-24","van-engine-to-brand-link","/nl/merken/toyota"]
  ]){
   const r=await page.goto(base+path,{waitUntil:"domcontentloaded"});
   assert.equal(r?.status(),200,path);
   assert.equal(await page.getByTestId(selector).getAttribute("href"),expected);
  }
  await page.setViewportSize({width:320,height:720});
  await page.goto(base+"/nl/merken/volkswagen",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"320px VW");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/merken/mercedes",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"1440px Mercedes");
  for(const locale of ["en","pl"]){
   for(const route of ["/merken","/merken/bmw","/merken/volkswagen"]){
    const r=await page.request.get(base+"/"+locale+route);
    assert.equal(r.status(),404,"No unreviewed translated brand pages");
   }
  }
  await page.goto(base+"/nl",{waitUntil:"domcontentloaded"});
  assert.ok(await page.locator('a[href="/nl/merken"]').count()>=1,"Homepage links brand discovery");
  await page.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded"});
  assert.ok(await page.locator('a[href="/nl/merken"]').count()>=1,"Passenger engine index links brand discovery");
  assert.deepEqual(errors,[]);
  console.log("NL_BRAND_ENGINE_BROWSER_PASS",JSON.stringify({brandPages:checked,indexPages:1,sitemapRoutes:484,passengerLinks:totalCars,vanEngineLinks:totalVans,vanModelLinks:totalModels,modelHubs:totalHubs,negativeLocale404:6,responsive:[320,390,1440],correctCanonicals:true,rdwAndSourcesGrounded:true}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
