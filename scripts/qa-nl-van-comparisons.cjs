/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlVanComparisons,nlVanComparePath}=require("../src/data/nl-van-comparisons.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3152";
const mk=(url)=>base+url;
(async()=>{
 const executable=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(executable?{executablePath:executable}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const runtimeErrors=[];page.on("pageerror",e=>runtimeErrors.push(e.message));
  const index="/nl/bedrijfswagens/vergelijken";
  let r=await page.goto(mk(index),{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(r?.status(),200,"Comparison index");
  assert.equal(await page.locator("h1").count(),1);
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(index));
  assert.equal(await page.getByTestId("nl-van-comparison-index").locator("[data-van-comparison-slug]").count(),21);
  const links=await page.getByTestId("nl-van-comparison-index").locator("[data-van-comparison-slug]").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
  assert.deepEqual(new Set(links),new Set(nlVanComparisons.map(c=>nlVanComparePath(c.slug))),"Index links every audited comparison");
  const sitemap=await page.request.get(mk("/sitemap.xml"),{timeout:45000});
  assert.equal(sitemap.status(),200);
  const xml=await sitemap.text();
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(a=>a[1]);
  assert.equal(urls.length,484,"Twenty-one reviewed van comparisons plus one index");
  assert.equal(new Set(urls).size,484);
  assert.equal(urls.filter(x=>x.includes("/nl/bedrijfswagens/vergelijken")).length,22);
  let engineCards=0,scopeRows=0,quoteLinks=0,sourcesVisible=0;
  for(const c of nlVanComparisons){
   const path=nlVanComparePath(c.slug);
   assert.ok(urls.some(u=>u.endsWith(path)),path+" sitemap");
   r=await page.goto(mk(path),{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,path);
   assert.equal(await page.locator("h1").count(),1);
   assert.ok((await page.locator("h1").innerText()).includes(c.headline),c.slug+" correct unique H1");
   assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(path));
   const robots=await page.locator('meta[name="robots"]').getAttribute("content");
   assert.ok(!robots?.includes("noindex"),path+" indexable");
   const articles=page.getByTestId("van-comparison-variants").locator("article[data-engine-slug]");
   assert.equal(await articles.count(),c.engines.length,c.slug+": all engines");
   const foundEngines=await articles.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("data-engine-slug")));
   assert.deepEqual(foundEngines,c.engineSlugs,c.slug+" source-approved engine order");
   const blocks=articles.locator('[data-application-id]');
   assert.equal(await blocks.count(),c.engines.reduce((n,e)=>n+e.applications.length,0),c.slug+": each RDW application remains distinct");
   const values=await blocks.evaluateAll(nodes=>nodes.map(n=>n.textContent??""));
   for(const e of c.engines){
    for(const a of e.applications){
     assert.ok(values.some(t=>t.includes(String(a.registeredPowerKw).replace(".",",")+" kW")&&t.includes(a.displacementCc+" cc")&&t.includes("RDW-type "+a.requiredRdwType)),c.slug+" exact factory kW, cc and type "+a.id);
    }
   }
   const quotes=articles.getByTestId("catalog-enquiry-link");
   assert.equal(await quotes.count(),c.engines.length,c.slug+": one vehicle-specific quote per motor");
   for(let i=0;i<c.engines.length;i++){
    const href=await quotes.nth(i).getAttribute("href");
    assert.ok(href?.startsWith("https://www.noordtune.nl/nl/bedrijfswagens#catalog-v1?"),c.slug+": workshop contact");
    const ref=new URLSearchParams(new URL(href).hash.split("?")[1]);
    assert.deepEqual([...ref.keys()].sort(),["id","kind"],"No private form fields or fake stage promises");
    assert.equal(ref.get("kind"),"engine");
    assert.equal(ref.get("id"),c.engines[i].slug);
    quoteLinks++;
   }
   const sourceLinks=articles.locator('a[target="_blank"][href^="https://"]');
   assert.ok(await sourceLinks.count()>=c.engines.length*2,c.slug+": each motor links 2 tuner references");
   sourcesVisible+=await sourceLinks.count();
   assert.equal(await page.getByTestId("van-comparison-faq").locator("details").count(),2,c.slug+" unique FAQs");
   assert.ok(await page.locator("a[href='/nl#rdw-check']").count()>=1,c.slug+" RDW lookup");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),c.slug+" mobile horizontal overflow");
   const modelLink=await page.request.get(mk("/nl/bedrijfswagens/"+c.modelSlug),{timeout:35000});
   assert.equal(modelLink.status(),200,c.modelSlug+" old model remains");
   engineCards+=c.engines.length;
   scopeRows+=c.engines.reduce((n,e)=>n+e.applications.length,0);
   console.log("NL_VAN_COMPARISON_BROWSER_PASS",c.slug,c.engines.length);
  }
  for(const [slug,modelSlug,engineSlug]of [
   ["mercedes-sprinter-313-317-cdi","mercedes-sprinter","mercedes-sprinter-w906-313-cdi-129-2013"],
   ["mercedes-vito-114-119-cdi","mercedes-vito","mercedes-vito-119-cdi-1950-euro6e-2024"],
   ["volkswagen-transporter-t5-t6-t61","volkswagen-transporter","volkswagen-transporter-t61-20-tdi-150-2020-21"],
   ["ford-transit-custom-22-tdci-20-ecoblue","ford-transit-custom","ford-transit-custom-20-ecoblue-130"],
   ["toyota-proace-15-20-d4d","toyota-proace","toyota-proace-20-d4d-177-2020-24"],
   ["iveco-daily-23-30-euro6-euro6df","iveco-daily","iveco-daily-23-136-euro6df-2020-23"],
   ["renault-master-23-dci-blue-dci","renault-master","renault-master-23-dci-145-2019-22"],
   ["peugeot-expert-20-bluehdi-120-180","peugeot-expert","peugeot-expert-20-bluehdi-145-2022-24"],
   ["opel-movano-b-c-23-cdti-22-diesel","opel-movano","opel-movano-c-22-diesel-140-2021-23"],
   ["citroen-berlingo-ii-iii-hdi-bluehdi","citroen-berlingo","citroen-berlingo-iii-15-bluehdi-100-2019-23"]
  ]){
   const dest=nlVanComparePath(slug);
   r=await page.goto(mk("/nl/bedrijfswagens/"+modelSlug),{waitUntil:"domcontentloaded"});
   assert.equal(r?.status(),200);
   assert.equal(await page.getByTestId("van-model-to-comparison").getAttribute("href"),dest,"Model crosslink");
   r=await page.goto(mk("/nl/bedrijfswagens/motoren/"+engineSlug),{waitUntil:"domcontentloaded"});
   assert.equal(r?.status(),200);
   assert.equal(await page.getByTestId("van-engine-to-comparison").getAttribute("href"),dest,"Exact engine crosslink");
  }
  r=await page.goto(mk("/nl/bedrijfswagens"),{waitUntil:"domcontentloaded"});
  assert.equal(r?.status(),200);
  assert.ok(await page.locator('a[href="/nl/bedrijfswagens/vergelijken"]').count()>=1,"Directory links index");
  for(const slug of ["mercedes-sprinter-313-317-cdi","volkswagen-transporter-t5-t6-t61","ford-transit-ecoblue-130-165-170","iveco-daily-23-30-euro6-euro6df","renault-master-23-dci-blue-dci","peugeot-expert-20-bluehdi-120-180"]){
   assert.ok(await page.locator('a[href="'+nlVanComparePath(slug)+'"]').count()>=1,"Featured van comparison "+slug);
  }
  r=await page.goto(mk("/nl/merken/mercedes"),{waitUntil:"domcontentloaded"});
  assert.equal(r?.status(),200);
  assert.equal(await page.getByTestId("brand-van-comparisons").locator('a[href^="/nl/bedrijfswagens/vergelijken/"]').count(),2,"Mercedes link to Sprinter and Vito comparisons");
  for(const [make,expected] of [["iveco",1],["renault",2],["peugeot",3],["opel",3],["toyota",2],["citroen",2],["fiat",2]]){
    const res=await page.goto(mk("/nl/merken/"+make),{waitUntil:"domcontentloaded"});
    assert.equal(res?.status(),200,make+" technical brand");
    assert.equal(await page.getByTestId("brand-van-comparisons").locator('a[href^="/nl/bedrijfswagens/vergelijken/"]').count(),expected,make+" source-backed model comparisons");
  }
  await page.setViewportSize({width:320,height:720});
  await page.goto(mk(nlVanComparePath("volkswagen-transporter-t5-t6-t61")),{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"320px comparisons no horizontal overflow");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(mk(nlVanComparePath("mercedes-sprinter-313-317-cdi")),{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"Desktop Sprinter no overflow");
  for(const path of ["/en/bedrijfswagens/vergelijken","/pl/bedrijfswagens/vergelijken",
   "/en/bedrijfswagens/vergelijken/mercedes-sprinter-313-317-cdi",
   "/pl/bedrijfswagens/vergelijken/ford-transit-ecoblue-130-165-170"]){
   const resp=await page.request.get(mk(path),{timeout:30000});
   assert.equal(resp.status(),404,"No invented translated version "+path);
  }
  assert.deepEqual(runtimeErrors,[],"No JavaScript runtime errors");
  console.log("NL_VAN_COMPARISONS_BROWSER_PASS",JSON.stringify({comparisonPages:21,indexPages:1,engineCards,sourceScopes:scopeRows,contactForms:quoteLinks,sourceLinks:sourcesVisible,sitemapRoutes:484,correctCanonicals:true,uniqueFaq:true,existingModelAndEngineURLsPreserved:true,nonDutch404:4,viewports:[320,390,1440]}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
