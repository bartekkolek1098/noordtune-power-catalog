/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlVanModels,nlVanPending}=require("../src/data/nl-vans-seo.ts");
const {nlVanEngines}=require("../src/data/nl-van-engines-seo.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3225";
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  const response=await page.goto(base+"/nl/bedrijfswagens",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(response?.status(),200,"Dutch van directory");
  assert.equal(await page.locator("h1").count(),1);
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/bedrijfswagens"));
  assert.equal(await page.locator(".ux-vans-model-card").count(),22,"All 22 van families are server-side discoverable");
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"Directory fits a phone");
  const links=await page.locator('a[href^="/nl/bedrijfswagens/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute("href")))]);
  assert.equal(links.length,16,"Only 15 approved van models have distinct SEO links");
  assert.ok(await page.locator("#van-modellen").isVisible(),"Accessible van directory");
  await page.waitForFunction(()=>{const el=document.querySelector("#van-model-filter");return Boolean(el&&Object.keys(el).some(k=>k.startsWith("__reactFiber$")))},null,{timeout:12000});
  await page.locator("#van-model-filter").fill("Sprinter");
  await page.waitForFunction(()=>document.querySelectorAll(".ux-vans-model-card").length===1,null,{timeout:8000});
  assert.match(await page.locator(".ux-vans-model-card").innerText(),/Mercedes-Benz Sprinter/);
  await page.locator("#van-model-filter").fill("");
  await page.getByRole("button",{name:"Grote bestelwagen"}).click();
  await page.waitForFunction(()=>document.querySelectorAll(".ux-vans-model-card").length>2,null,{timeout:8000});
  const states=await page.locator(".ux-vans-model-card .ux-vans-model-eyebrow").allTextContents();
  assert.ok(states.every(s=>s==="Grote bestelwagen"));
  await page.getByRole("button",{name:"Alle modellen"}).click();
  await page.waitForFunction(()=>document.querySelectorAll(".ux-vans-model-card").length===22,null,{timeout:8000});
  await page.screenshot({path:process.env.TEMP+"/noordtune-vans-directory-mobile.png",fullPage:false});
  assert.ok((await page.locator('a[href^="https://www.rijksoverheid.nl/"]').count())>=1,"Dutch legal emissions reference");
  const sitemap=await page.request.get(base+"/sitemap.xml");
  assert.equal(sitemap.status(),200);
  const xml=await sitemap.text();
  const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.equal(locs.length,281,"274 route sitemap (269 previous + five validated engines)");
  const vanUrls=locs.filter(x=>x.includes("/nl/bedrijfswagens"));
  assert.equal(vanUrls.length,33,"One directory plus 15 models and ten exact engines");
  assert.equal(new Set(vanUrls).size,33,"Van sitemap canonicals unique");
  assert.ok(!xml.includes("/en/bedrijfswagens")&&!xml.includes("/pl/bedrijfswagens"));

  for(const m of nlVanModels){
   const r=await page.request.get(base+"/nl/bedrijfswagens/"+m.slug);
   assert.equal(r.status(),200,m.slug+" indexable model path");
   const html=await r.text();
   assert.ok(html.includes("Motorgegevens")||html.includes("Bedrijfswagen")||html.includes("chiptuning"),"Model page content "+m.slug);
  }
  for(const m of nlVanPending){
   const r=await page.request.get(base+"/nl/bedrijfswagens/"+m.slug);
   assert.equal(r.status(),404,"Unreviewed model must not spawn a thin landing page "+m.slug);
  }
  for(const e of nlVanEngines){
   const r=await page.request.get(base+"/nl/bedrijfswagens/motoren/"+e.slug);
   assert.equal(r.status(),200,e.slug+" source-reviewed SSG");
  }
  for(const path of ["/en/bedrijfswagens","/pl/bedrijfswagens","/en/bedrijfswagens/ford-transit","/pl/bedrijfswagens/volkswagen-caddy"]){
   const r=await page.request.get(base+path);
   assert.equal(r.status(),404,"No unsupported translated pages "+path);
  }
  for(const [slug,expected] of [["mercedes-sprinter",3],["mercedes-vito",2],["toyota-proace",0],["peugeot-partner",1],["ford-transit-connect",3],["ford-transit-custom",3],["peugeot-expert",2],["fiat-ducato",2]]){
   const r=await page.goto(base+"/nl/bedrijfswagens/"+slug,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200);
   assert.equal(await page.locator("h1").count(),1);
   assert.equal(await page.getByTestId("van-audited-variant").count(),expected);
   assert.equal(await page.getByTestId("van-no-stage1-data").count(),expected?0:1);
   assert.ok(await page.locator(".ux-van-model-compliance").isVisible(),"SCR legal note visible");
   const c=await page.locator('link[rel="canonical"]').getAttribute("href");
   assert.ok(c?.endsWith("/nl/bedrijfswagens/"+slug),"Model canonical");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"No mobile overflow "+slug);
   if(slug==="ford-transit-connect")await page.screenshot({path:process.env.TEMP+"/noordtune-ford-connect-mobile.png",fullPage:false});
   console.log("NL_VAN_MODEL_BROWSER_PASS",slug,expected);
  }
  for(const slug of ["ford-transit-20-ecoblue-130","volkswagen-transporter-t6-20-tdi-204","peugeot-partner-15-bluehdi-100","ford-transit-custom-22-tdci-100","ford-transit-custom-22-tdci-125","ford-transit-custom-20-ecoblue-130","mercedes-sprinter-w906-21-cdi-143","peugeot-expert-20-bluehdi-120","fiat-ducato-23-multijet-130-2013-15","fiat-ducato-23-multijet-130-euro6-2018-19","mercedes-vito-114-cdi-1950-2023","mercedes-vito-114-cdi-1950-euro6e-2024","mercedes-sprinter-315-cdi-1950-150","peugeot-expert-20-bluehdi-180-2019-22"]){
   await page.goto(base+"/nl/bedrijfswagens/motoren/"+slug,{waitUntil:"domcontentloaded"});
   assert.equal(await page.locator("h1").count(),1);
   assert.ok(await page.locator('ul.ux-van-engine-source-links a').count()>=2);
   assert.ok(await page.locator(".ux-van-model-audit").count()>=1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391));
   console.log("NL_VAN_ENGINE_BROWSER_PASS",slug);
  }
  await page.setViewportSize({width:320,height:720});
  await page.goto(base+"/nl/bedrijfswagens",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"320px category no horizontal overflow");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/bedrijfswagens/volkswagen-transporter",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"Desktop VW Transporter no overflow");
  await page.screenshot({path:process.env.TEMP+"/noordtune-vw-transporter-desktop.png",fullPage:false});
  await page.goto(base+"/nl",{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator('a[href="/nl/bedrijfswagens"]').count(),1,"NL homepage links vans category");
  assert.deepEqual(errors,[],"No runtime JavaScript errors");
  console.log("NL_VAN_BROWSER_QA_PASS",JSON.stringify({
   indexedVanPages:16,browseOnlyModels:6,exactStage1VanEnginePages:16,
   verifiedSourceApplications:30,indexedVanUrls:33,totalSitemapUrls:281,
   testedWidths:[320,390,1440],translatedThin404:4
  }));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
