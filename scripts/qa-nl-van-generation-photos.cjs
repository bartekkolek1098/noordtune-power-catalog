/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlVanPhotoByEngineSlug,nlVanPhotos}=require("../src/data/nl-van-generation-photos.ts");
const url=(process.env.RDW_QA_URL||"http://127.0.0.1:52528").replace(/\/$/,"");
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const context=await browser.newContext();
  const page=await context.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  let pages=0;
  for(const [slug,photo] of nlVanPhotoByEngineSlug){
   const res=await context.request.get(url+"/nl/bedrijfswagens/motoren/"+slug,{timeout:30000});
   assert.equal(res.status(),200,"Source-linked NL van engine route "+slug);
   const html=await res.text();
   assert.ok(html.includes('data-testid="nl-van-photo-section"'),"Generation photo missing "+slug);
   assert.ok(html.includes(photo.src),"Exact image source missing "+slug);
   assert.ok(html.includes("commons.wikimedia.org"),"Attribution missing "+slug);
   assert.ok(html.includes('rel="canonical"'),"Van canonical missing "+slug);
   pages++;
  }
  for(const [key,photo] of Object.entries(nlVanPhotos)){
   const rsp=await context.request.get(url+photo.src,{timeout:25000});
   assert.equal(rsp.status(),200,"Photo HTTP status "+key);
   const bytes=await rsp.body();
   assert.equal(bytes.length,photo.bytes,"Photo bytes "+key);
   assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),photo.sha256,"Photo checksum "+key);
  }
  const examples=[
   "/nl/bedrijfswagens/motoren/volkswagen-transporter-t5-20-tdi-140",
   "/nl/bedrijfswagens/motoren/volkswagen-transporter-t6-20-tdi-204",
   "/nl/bedrijfswagens/motoren/citroen-berlingo-iii-15-bluehdi-75-2019-23",
   "/nl/bedrijfswagens/motoren/toyota-proace-city-15-d4d-100-2020-23",
   "/nl/bedrijfswagens/motoren/mercedes-sprinter-w906-21-cdi-143"
  ];
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   for(const p of examples){
    const res=await page.goto(url+p,{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(res?.status(),200,p+" 200");
    assert.equal(await page.locator("h1").count(),1,p+" h1");
    const photo=page.getByTestId("nl-van-licensed-photo");
    assert.equal(await photo.count(),1,"Photo missing "+p);
    const image=photo.locator("img");await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const i=document.querySelector('[data-testid="nl-van-licensed-photo"] img');return i?.complete&&i.naturalWidth>0},null,{timeout:15000});
    assert.ok(await photo.locator('a[href^="https://commons.wikimedia.org/wiki/File:"]').count(),"Attribution link "+p);
    assert.ok(await photo.locator('a[href^="https://creativecommons.org/licenses/"]').count(),"CC Licence "+p);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),true,"Horizontal scroll "+width+" "+p);
   }
  }
  const cngPage=await context.request.get(url+"/nl/bedrijfswagens/motoren/volkswagen-caddy-20-ecofuel-cng-109-2014");
  assert.equal(cngPage.status(),200);
  assert.match(await cngPage.text(),/Aardgas \(CNG\)/,"Caddy EcoFuel fuel must not be labeled petrol");
  const sitemap=await context.request.get(url+"/sitemap.xml"),xml=await sitemap.text();
  assert.equal(sitemap.status(),200);
  const loc=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(v=>v[1]);
  assert.equal(loc.length,375,"Photos do NOT generate new SEO doorway URLs");
  assert.ok(!xml.includes("/en/bedrijfswagens")&&!xml.includes("/pl/bedrijfswagens"));
  assert.deepEqual(errors,[]);
  console.log("NL_VAN_IMAGE_BROWSER_PASS",JSON.stringify({engineRoutesWithLicensedPhotos:pages,licensedPhotos:Object.keys(nlVanPhotos).length,viewports:[320,390,1440],responsiveExamples:examples.length,unmodifiedSitemap:loc.length,jsErrors:0}));
  await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
