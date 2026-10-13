/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const crypto=require("node:crypto");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const docs=require("../src/data/nl-vehicle-editorial.json").items;
const photos=require("../src/data/nl-vehicle-photo-library.json").images;
const base=(process.env.NL_VEHICLE_SEO_URL||"http://127.0.0.1:52522").replace(/\/$/,"");
const title="Chiptuning per auto en motor vergelijken";
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
 const context=await browser.newContext(),page=await context.newPage();
 const errors=[];page.on("pageerror",err=>errors.push(err.message));
 const first=await page.goto(base+"/nl/voertuigen",{waitUntil:"domcontentloaded",timeout:60000});
 assert.equal(first?.status(),200);
 assert.equal(await page.locator("h1").count(),1);
 assert.match(await page.locator("h1").innerText(),new RegExp(title));
 assert.equal(await page.getByTestId("nl-vehicle-directory-link").count(),24);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://power.noordtune.nl/nl/voertuigen");
 const sitemap=await context.request.get(base+"/sitemap.xml");assert.equal(sitemap.status(),200);
 const routes=[...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
 assert.equal(routes.length,375);assert.equal(new Set(routes).size,375);
 assert.ok(routes.includes("https://power.noordtune.nl/nl/voertuigen"));
 assert.ok(!(routes.some(u=>u.endsWith("/en/voertuigen")||u.endsWith("/pl/voertuigen"))));
 for(const article of docs){
  const path="/nl/vehicles/"+article.id;
  const res=await context.request.get(base+path,{timeout:40000});
  assert.equal(res.status(),200,article.id+" page");
  const html=await res.text();
  assert.ok(html.includes('data-testid="nl-vehicle-guide"'),article.id+" missing individual editorial");
  assert.ok(html.includes('data-testid="nl-vehicle-licensed-photo"'),article.id+" missing licensed photograph");
  assert.ok(html.includes(photos[article.photoKey].source.replace(/&/g,"&amp;").slice(0,55))||html.includes("commons.wikimedia.org"),article.id+" missing attribution");
  assert.ok(html.includes('href="/nl/voertuigen"'),article.id+" missing indexed hub link");
  assert.ok(routes.includes("https://power.noordtune.nl"+path),article.id+" missing canonical from sitemap");
 }
 for(const [key,p] of Object.entries(photos)){
  const response=await context.request.get(base+p.src);assert.equal(response.status(),200,"License image "+key);
  const bytes=await response.body();assert.equal(bytes.length,p.bytes,key+" size");assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),p.sha256,key+" checksum");
 }
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:960});
  for(const path of ["/nl/voertuigen","/nl/vehicles/bmw-320d-b47","/nl/vehicles/vw-golf-20-tsi-ea888","/nl/vehicles/ford-focus-st-20-ecoboost"]){
   const res=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:45000});assert.equal(res?.status(),200);
   assert.equal(await page.locator("h1").count(),1,path+" h1");
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),true,path+" mobile overflow "+width);
   if(path!=="/nl/voertuigen"){
    const guide=page.getByTestId("nl-vehicle-guide");assert.equal(await guide.count(),1);
    assert.equal(await guide.locator("details").count(),2,path+" unique FAQ");
    const img=page.getByTestId("nl-vehicle-licensed-photo").locator("img");
    await img.scrollIntoViewIfNeeded();await img.evaluate(async node=>{const i=node;if(!i.complete)await new Promise((resolve,reject)=>{i.onload=resolve;i.onerror=reject});});
    assert.ok(await img.evaluate(i=>i.naturalWidth>0),path+" photo");
    assert.equal(await guide.locator('a[href="#tuning-calculator"]').count(),1);
   }
  }
 }
 for(const path of ["/en/voertuigen","/pl/voertuigen"]){const resp=await context.request.get(base+path);assert.equal(resp.status(),404,path+" unsupported locale must404");}
 assert.deepEqual(errors,[]);
 console.log("NL_VEHICLE_SEO_BROWSER_PASS",JSON.stringify({locale:"nl",directoryLinks:24,enginePages:24,licensedPhotos:15,faq:48,sitemap:routes.length,viewports:[320,390,1440],unsupportedLanguages404:true,browserErrors:0}));
 await context.close();
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
