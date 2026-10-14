/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlStage1EngineProfiles}=require("../src/data/nl-stage1-engine-seo.ts");
const {nlModelFamilyHubs}=require("../src/data/nl-model-family-seo.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3136";

(async()=>{
 const path=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(path?{executablePath:path}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const priorities=["bmw-320i-g20-g21-b48-184","audi-a1-8x-14-tfsi-122","ford-transit-20-ecoblue-130","volkswagen-caddy-2kn-20-tdi-140","peugeot-308-iii-12-puretech-130","nissan-juke-f16-10-dig-t-114"];
  for(const slug of priorities){
    const profile=nlStage1EngineProfiles.find(p=>p.slug===slug);
    assert.ok(profile,"Published profile "+slug);
    const response=await page.goto(base+"/nl/motoren/"+slug,{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(response?.status(),200,slug);
    const link=page.getByTestId("catalog-enquiry-link");
    assert.equal(await link.count(),1,slug+": offer must be available once");
    const href=await link.getAttribute("href");
    const parsed=new URL(href);
    assert.equal(parsed.origin,"https://www.noordtune.nl");
    assert.equal(parsed.pathname,"/nl/contact");
    assert.equal(parsed.search,"");
    const ref=new URLSearchParams(parsed.hash.split("?")[1]);
    assert.deepEqual([...ref.keys()].sort(),["id","kind"]);
    assert.equal(ref.get("kind"),"engine");
    assert.equal(ref.get("id"),"auto-"+slug);
    assert.ok(!/plate|vin|email|customer|price|tuned/i.test(parsed.hash));
    const api=await page.request.get(base+"/api/enquiry-context?kind=engine&id="+ref.get("id"));
    assert.equal(api.status(),200,slug+": local public engine context");
    assert.match(api.headers()["x-robots-tag"]||"",/noindex/);
    const json=await api.json();
    assert.equal(json.context.label,profile.headline);
    assert.equal(json.context.kind,"engine");
    assert.equal(json.context.id,"auto-"+slug);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),slug+": 390px viewport overflow");
    console.log("NL_PASSENGER_OFFER_BROWSER_PASS",slug);
  }
  let apiChecked=0;
  for(const p of nlStage1EngineProfiles){
   const id="auto-"+p.slug;
   const r=await page.request.get(base+"/api/enquiry-context?kind=engine&id="+id);
   assert.equal(r.status(),200,p.slug);
   const j=await r.json();
   assert.equal(j.context.label,p.headline,p.slug);
   assert.equal(j.context.id,id);
   apiChecked++;
  }
  let hubOffers=0;
  for(const hub of nlModelFamilyHubs){
   const resp=await page.goto(base+"/nl/modellen/"+hub.slug,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(resp?.status(),200,hub.slug);
   const cards=page.getByTestId("model-hub-variant-card");
   assert.equal(await cards.count(),hub.engines.length);
   const links=cards.getByTestId("catalog-enquiry-link");
   assert.equal(await links.count(),hub.engines.length);
   const ids=await links.evaluateAll(nodes=>nodes.map(n=>new URLSearchParams(new URL(n.getAttribute("href")).hash.split("?")[1]).get("id")));
   assert.deepEqual(ids,hub.engineSlugs.map(slug=>"auto-"+slug));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),hub.slug+": mobile overflow");
   hubOffers+=ids.length;
  }
  const van=await page.request.get(base+"/api/enquiry-context?kind=engine&id=ford-transit-20-ecoblue-130");
  assert.equal(van.status(),200,"Existing legacy van engine ID still resolves as van");
  const unknown=await page.request.get(base+"/api/enquiry-context?kind=engine&id=auto-unknown-other-engine");
  assert.equal(unknown.status(),404,"Unknown passenger engine IDs must be rejected");
  const invalid=await page.request.get(base+"/api/enquiry-context?kind=engine&id=auto-bmw-320i-g20-g21-b48-184&year=1900");
  assert.equal(invalid.status(),404,"Out-of-range passenger year must not resolve");
  await page.setViewportSize({width:320,height:740});
  await page.goto(base+"/nl/modellen/volkswagen-golf-7",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321));
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/motoren/bmw-320i-g20-g21-b48-184",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441));
  assert.deepEqual(errors,[],"No frontend page errors");
  console.log("NL_PASSENGER_ENQUIRY_BROWSER_PASS",JSON.stringify({passengerPages:apiChecked,modelHubs:nlModelFamilyHubs.length,modelOfferLinks:hubOffers,manualSpotChecks:priorities.length,vanIdCompatible:true,invalidRefs404:true,mobile:[320,390],desktop:1440,noPersonalData:true}));
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
