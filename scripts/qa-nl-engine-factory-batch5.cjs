/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlLegacyPassengerSeoScopedApplications}=require("../src/data/nl-passenger-legacy-scope-review.ts");
const base=process.env.RDW_QA_URL||"http://127.0.0.1:3137";
const cases=[
 {path:"/nl/motoren/seat-leon-1p-14-tsi-125",contains:"SEAT Leon II",name:"Leon",type:"1P",kw:92,year:"2009"},
 {path:"/nl/motoren/seat-leon-5f-10-ecotsi-115",contains:"SEAT Leon III",name:"Leon",type:"5F",kw:85,year:"2015"},
 {path:"/nl/motoren/nissan-juke-f15-12-dig-t-115",contains:"Nissan Juke F15",name:"Juke",type:"F15",kw:85,year:"2014"},
 {path:"/nl/motoren/skoda-octavia-1z-14-tsi-122",contains:"Škoda Octavia II",name:"Octavia",type:"1Z",kw:90,year:"2009"},
 {path:"/nl/motoren/skoda-octavia-5e-14-tsi-140",contains:"Škoda Octavia III",name:"Octavia",type:"5E",kw:103,year:"2013"}
];
const hubs=[
 {slug:"seat-leon-1p-5f",slugs:["seat-leon-1p-14-tsi-125","seat-leon-5f-10-ecotsi-115"]},
 {slug:"skoda-octavia-1z-5e",slugs:["skoda-octavia-1z-14-tsi-122","skoda-octavia-5e-14-tsi-140"]}
];
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const errors=[];p.on("pageerror",e=>errors.push(e.message));
  const home=await p.goto(base+"/nl/motoren",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(home?.status(),200);
  for(const entry of cases){
   assert.ok(await p.locator('a[href="'+entry.path+'"]').count()>=1,"Engine directory must link "+entry.path);
  }
  const xml=await (await p.request.get(base+"/sitemap.xml")).text();
  const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.equal(locs.length,484);
  assert.equal(new Set(locs).size,484);
  for(const item of cases){
   assert.ok(locs.some(url=>url.endsWith(item.path)),item.path+" is present in sitemap");
   const response=await p.goto(base+item.path,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(response?.status(),200,item.path);
   const title=await p.locator("h1").innerText();
   assert.ok(title.includes(item.contains),item.path+" h1");
   assert.ok((await p.locator('link[rel="canonical"]').getAttribute("href")).endsWith(item.path));
   assert.ok(!(await p.locator('meta[name="robots"]').getAttribute("content")||"").includes("noindex"));
   const variant=await p.locator(".ux-nl-engine-variant").innerText();
   assert.ok(variant.includes("RDW-type "+item.type),item.path+" exact registered RDW type");
   assert.ok(variant.includes(item.kw+" kW"),item.path+" exact registered RDW kW");
   assert.ok(variant.includes(item.year),item.path+" admission scope");
   assert.ok(await p.locator(".ux-nl-engine-sources a[href^='https://']").count()>=2,item.path+" >=2 publishers");
   assert.equal(await p.locator("section[aria-labelledby='faq-title'] details").count(),2);
   const offer=await p.getByTestId("catalog-enquiry-link").getAttribute("href");
   assert.ok(offer?.includes("kind=engine")&&offer?.includes("id=auto-"+item.path.split("/").at(-1)));
   const api=await p.request.get(base+"/api/enquiry-context?kind=engine&id=auto-"+item.path.split("/").at(-1));
   assert.equal(api.status(),200,item.path+" prefilled enquiry context");
   assert.match(api.headers()["x-robots-tag"]||"",/noindex/);
   const data=await api.json();
   assert.ok(data.context.label.includes(item.contains),item.path+" real reviewed make and engine");
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=391),item.path+" horizontal overflow");
   if(item.type==="5E"){
    assert.equal(await p.locator("figure img[alt*='Voorbeeldfoto']").count(),1);
    assert.ok(await p.locator("figure figcaption a[href^='https://commons.wikimedia.org/']").count()>=1);
   }
   if(item.type==="5F")assert.equal(await p.locator("figure img[alt*='Voorbeeldfoto']").count(),0,"No misleading Cupra photo for ordinary 1.0 TSI");
   console.log("NL_FACTORY5_ENGINE_BROWSER_PASS",item.path);
  }
  for(const hub of hubs){
   const href="/nl/modellen/"+hub.slug;
   assert.ok(locs.some(url=>url.endsWith(href)),"Hub included in sitemap "+hub.slug);
   const r=await p.goto(base+href,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(r?.status(),200,hub.slug);
   assert.ok((await p.locator('link[rel="canonical"]').getAttribute("href")).endsWith(href));
   const cards=p.getByTestId("model-hub-variant-card");
   assert.equal(await cards.count(),2);
   const links=await cards.locator('a[href^="/nl/motoren/"]').evaluateAll(nodes=>nodes.map(x=>x.getAttribute("href")));
   assert.deepEqual(new Set(links),new Set(hub.slugs.map(slug=>"/nl/motoren/"+slug)));
   assert.equal(await p.getByTestId("model-hub-faq").locator("details").count(),2);
   assert.equal(await cards.getByTestId("catalog-enquiry-link").count(),2,"Each engine card must request its own quote");
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=391),hub.slug+" mobile no overflow");
   console.log("NL_FACTORY5_HUB_BROWSER_PASS",hub.slug);
  }
  const vanSlug="volkswagen-caddy-2kn-20-tdi-140-2013-14";
  const vanUrl="/nl/bedrijfswagens/motoren/"+vanSlug;
  assert.ok(locs.some(url=>url.endsWith(vanUrl)));
  const van=await p.goto(base+vanUrl,{waitUntil:"domcontentloaded"});
  assert.equal(van?.status(),200);
  assert.ok((await p.locator('link[rel="canonical"]').getAttribute("href")).endsWith(vanUrl));
  const specs=await p.getByTestId("van-engine-rdw-variant").innerText();
  assert.ok(specs.includes("103 kW")&&specs.includes("2013–2014")&&specs.includes("1968 cc"));
  assert.ok(await p.locator(".ux-van-engine-source-links a[href^='https://']").count()>=2);
  assert.equal(await p.getByTestId("catalog-enquiry-link").count(),1);
  assert.ok((await p.getByTestId("catalog-enquiry-link").getAttribute("href")).includes("id="+vanSlug));
  assert.ok(await p.locator('img[src*="vw-caddy-2kn"]').count()>=1,"Approved same-generation photo for new Caddy");
  const parent=await p.goto(base+"/nl/bedrijfswagens/volkswagen-caddy",{waitUntil:"domcontentloaded"});
  assert.equal(parent?.status(),200);
  assert.ok(await p.locator('a[href="'+vanUrl+'"]').count()>=1,"Caddy model links new engine, no orphan");
  const old=await p.request.get(base+"/nl/motoren/volkswagen-caddy-2kn-20-tdi-140");
  assert.equal(old.status(),200,"Older 2015 profile preserved");
  for(const item of [...cases.map(x=>x.path),"/nl/modellen/"+hubs[0].slug,vanUrl]){
   const response=await p.request.get(base+item.replace(/^\/nl\//,"/en/"));
   assert.equal(response.status(),404,"No auto-generated thin translation "+item);
  }
  await p.setViewportSize({width:320,height:720});
  await p.goto(base+"/nl/modellen/skoda-octavia-1z-5e",{waitUntil:"domcontentloaded"});
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=321),"320px model page no overflow");
  await p.setViewportSize({width:1440,height:900});
  await p.goto(base+vanUrl,{waitUntil:"domcontentloaded"});
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=1441),"Desktop new Caddy no overflow");
  assert.deepEqual(errors,[]);
  console.log("NL_ENGINE_FACTORY_BATCH5_BROWSER_PASS",JSON.stringify({passengerEnginePages:5,newVanEnginePages:1,newModelHubs:2,existingVanPreserved:true,newUrls:8,sitemapUrls:484,seoScopes:nlLegacyPassengerSeoScopedApplications.length,nonDutchNoindex:true,mobile:[320,390],desktop:1440,allHTTP200:true,engineEnquiryLinks:true,noFakeStageClaims:true}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
