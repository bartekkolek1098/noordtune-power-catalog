/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3149";

(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  let r=await page.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(r?.status(),200);
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/motoren"));
  const finder=page.getByTestId("nl-reviewed-motor-finder");
  assert.equal(await finder.count(),1);
  const results=page.getByTestId("nl-motor-search-results").locator('a[data-engine-id]');
  const status=page.getByTestId("nl-motor-search-count");
  const search=page.locator("#nl-motor-search-query");
  const year=page.locator("#nl-motor-search-year");
  const kw=page.locator("#nl-motor-search-kw");
  const filterFuel=page.locator("#nl-motor-search-fuel");
  assert.match(await status.innerText(),/^174 /);
  assert.equal(await results.count(),24,"Search caps initial display for speed");
  assert.equal(new Set(await page.locator('a[href^="/nl/motoren/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")))).size,73,"All 73 passenger engine links remain server-visible");
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"390px index fits");
  await finder.getByRole("button",{name:/Meer onderzochte motoren tonen/}).click();
  assert.equal(await results.count(),48,"Load-more control is functional");
  await search.fill("Juke");
  assert.match(await status.innerText(),/^3 /,"Three Juke variants shown");
  assert.equal(await results.count(),3);
  const jukeLinks=await results.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
  assert.deepEqual(new Set(jukeLinks),new Set([
   "/nl/motoren/nissan-juke-f15-12-dig-t-115",
   "/nl/motoren/nissan-juke-f16-10-dig-t-117",
   "/nl/motoren/nissan-juke-f16-10-dig-t-114"
  ]));
  await year.selectOption("2019");
  assert.match(await status.innerText(),/^1 /,"F15 Juke source-covered year 2019");
  assert.equal(await results.first().getAttribute("href"),"/nl/motoren/nissan-juke-f15-12-dig-t-115");
  await year.selectOption("2020");
  assert.match(await status.innerText(),/^1 /,"F16 Juke source-covered year 2020");
  assert.equal(await results.first().getAttribute("href"),"/nl/motoren/nissan-juke-f16-10-dig-t-117");
  await kw.fill("86");
  assert.match(await status.innerText(),/^1 /,"F16 exact 86 kW/2020 same cohort");
  await kw.fill("85");
  assert.match(await status.innerText(),/^0 /,"No 85 kW Juke result for 2020");
  assert.equal(await page.getByTestId("nl-motor-search-empty").count(),1);
  assert.ok((await page.getByTestId("nl-motor-search-empty").innerText()).includes("Dit betekent niet dat Stage 1 onmogelijk is"));
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  assert.match(await status.innerText(),/^174 /);
  assert.equal(await results.count(),24);
  await finder.getByRole("button",{name:"Bestelwagen / bus"}).click();
  assert.match(await status.innerText(),/^113 /);
  await search.fill("Mercedes Sprinter");
  const after=await results.count();
  assert.ok(after>=5,"Sprinter has several source-backed van engines");
  assert.ok((await results.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")))).every(href=>href.startsWith("/nl/bedrijfswagens/motoren/")));
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  await filterFuel.selectOption("CNG");
  assert.ok(await results.count()>=1,"CNG separate fuel finds Caddy EcoFuel");
  assert.ok((await results.evaluateAll(nodes=>nodes.map(n=>n.innerText))).every(t=>t.includes("aardgas")));
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  await search.fill("VW Golf");
  assert.ok(await results.count()>=4,"VW synonym matches VW Golf engine families");
  assert.ok((await results.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")))).every(h=>h.startsWith("/nl/motoren/")));
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  await search.fill("Citroën");
  assert.ok(await results.count()>=8,"Diacritics normalize French manufacturer correctly");
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  await search.fill("Transit Connect EcoBlue 100");
  await finder.getByRole("button",{name:"Bestelwagen / bus"}).click();
  await year.selectOption("2022");
  await kw.fill("73,3");
  assert.match(await status.innerText(),/^1 /,"2022 Ford specific 73,3 kW application");
  assert.equal(await results.first().getAttribute("href"),"/nl/motoren/ford-transit-connect-15-ecoblue-100");
  await kw.fill("73,5");
  assert.match(await status.innerText(),/^0 /,"73,5 kW must not leak into 2022 cohort");
  await page.getByRole("button",{name:"Alle filters wissen"}).click();
  for(const [slug,expected,overlap]of [
   ["bmw-320i-f30-g20",3,"bmw-320i-f30-n20-184"],
   ["volkswagen-golf-6-7",4,"volkswagen-golf-7-10-tsi-110"],
   ["nissan-juke-f15-f16",3,"nissan-juke-f16-10-dig-t-117"]
  ]){
   const href="/nl/modellen/"+slug;
   r=await page.goto(base+href,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,slug);
   assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(href));
   const cards=page.getByTestId("model-hub-variant-card");
   assert.equal(await cards.count(),expected,slug+" verified engine variants");
   assert.equal(await cards.getByTestId("catalog-enquiry-link").count(),expected,slug+" individual motor quote links");
   assert.equal(await page.getByTestId("model-hub-faq").locator("details").count(),2,slug+" original FAQs");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),slug+" 390px mobile");
   const e=await page.goto(base+"/nl/motoren/"+overlap,{waitUntil:"domcontentloaded"});
   assert.equal(e?.status(),200,overlap);
   const back=page.getByTestId("engine-model-hub-backlink");
   assert.equal(await back.count(),2,"Specific original and crossgeneration comparison must both remain linked");
   assert.ok((await back.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")))).includes(href));
  }
  const sitemap=await page.request.get(base+"/sitemap.xml");
  assert.equal(sitemap.status(),200);
  const xml=await sitemap.text();
  const paths=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.equal(paths.length,472);
  assert.equal(new Set(paths).size,472);
  for(const slug of ["bmw-320i-f30-g20","volkswagen-golf-6-7","nissan-juke-f15-f16"])
   assert.ok(paths.some(path=>path.endsWith("/nl/modellen/"+slug)));
  await page.setViewportSize({width:320,height:720});
  await page.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"320px mobile search");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"1440px desktop search");
  for(const locale of ["en","pl"]){
   for(const slug of ["bmw-320i-f30-g20","volkswagen-golf-6-7","nissan-juke-f15-f16"]){
    const translated=await page.request.get(base+"/"+locale+"/modellen/"+slug);
    assert.equal(translated.status(),404,"No unsupported translated thin generation page");
   }
  }
  assert.deepEqual(errors,[],"No JavaScript runtime errors");
  console.log("NL_REVIEWED_MOTOR_SEARCH_BROWSER_PASS",JSON.stringify({approvedEngineOptions:174,cars:61,vans:113,firstRendered:24,paginationVerified:48,sourceScopedYearAndKw:true,cngSeparate:true,accentAware:true,newGenerationHubs:3,overlapBacklinks:true,sitemap:472,unsupportedTranslations404:6,responsive:[320,390,1440],noPersonalData:true}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
