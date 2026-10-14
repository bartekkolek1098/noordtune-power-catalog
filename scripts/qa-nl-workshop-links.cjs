/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const base=process.env.RDW_QA_URL||"http://127.0.0.1:3135";
const cases=[
 ["/nl/motoren/bmw-320i-g20-g21-b48-184",".ux-nl-engine-underlink","/nl/bmw-chiptuning"],
 ["/nl/motoren/audi-a3-8p-14-tfsi-125",".ux-nl-engine-underlink","/nl/audi-chiptuning"],
 ["/nl/motoren/volkswagen-polo-aw-10-tsi-95",".ux-nl-engine-underlink","/nl/volkswagen-chiptuning"],
 ["/nl/motoren/ford-fiesta-ja8-10-ecoboost-100",".ux-nl-engine-underlink","/nl/ford-chiptuning"],
 ["/nl/motoren/peugeot-308-ii-12-puretech-130",".ux-nl-engine-underlink","/nl/chiptuning"],
 ["/nl/modellen/bmw-320i-f30-f31",".ux-nl-model-service-link","/nl/bmw-chiptuning"],
 ["/nl/modellen/audi-a1-8x",".ux-nl-model-service-link","/nl/audi-chiptuning"],
 ["/nl/bedrijfswagens",".ux-nl-engine-primary-link","/nl/bedrijfswagens"],
 ["/nl/bedrijfswagens/volkswagen-transporter",".ux-van-model-service-link","/nl/bedrijfswagens"],
 ["/nl/bedrijfswagens/motoren/toyota-proace-20-d4d-177-2020-24",".ux-van-model-service-link","/nl/bedrijfswagens"]
];
(async()=>{
 const executable=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(executable?{executablePath:executable}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  const testedDestinations=new Set();
  for(const [path,selector,expected]of cases){
   const r=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,path);
   const destination="https://www.noordtune.nl"+expected;
   const all=page.locator(selector);
   const hrefs=await all.evaluateAll(elems=>elems.map(el=>el.getAttribute("href")));
   assert.ok(hrefs.includes(destination),path+" should link directly to "+destination+"; found "+hrefs.join(";"));
   const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
   assert.ok(canonical?.endsWith(path),path+" retains a self canonical");
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=391),"No mobile horizontal overflow "+path);
   testedDestinations.add(destination);
  }
  for(const url of testedDestinations){
   const target=await page.request.get(url,{timeout:30000});
   assert.equal(target.status(),200,"NoordTune commercial service link "+url);
  }
  await page.setViewportSize({width:320,height:740});
  await page.goto(base+"/nl/motoren/bmw-320i-g20-g21-b48-184",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=321),"Phone width");
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+"/nl/bedrijfswagens/motoren/toyota-proace-20-d4d-177-2020-24",{waitUntil:"domcontentloaded"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=1441),"Desktop width");
  assert.deepEqual(errors,[],"No browser page errors");
  console.log("NL_WORKSHOP_LINK_BROWSER_PASS",JSON.stringify({catalogPages:cases.length,commercialUrlsVerified:testedDestinations.size,allHTTP200:true,correctCanonicals:true,noHorizontalOverflow:true,deviceWidths:[320,390,1440]}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
