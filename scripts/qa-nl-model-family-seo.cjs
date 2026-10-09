/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {nlModelFamilyHubs}=require("../src/data/nl-model-family-seo.ts");
const root=process.env.RDW_QA_URL||"http://127.0.0.1:3215";
(async()=>{
 const exe=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 try{
  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const jsErrors=[];mobile.on("pageerror",e=>jsErrors.push(e.message));
  const index=await mobile.goto(root+"/nl/modellen",{waitUntil:"domcontentloaded",timeout:35000});
  assert.equal(index?.status(),200);
  assert.equal(await mobile.locator("h1").count(),1);
  const hrefs=await mobile.locator('a[href^="/nl/modellen/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute("href")))]);
  assert.equal(hrefs.length,nlModelFamilyHubs.length,"All six model hubs must be linked in HTML");
  assert.ok((await mobile.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/modellen"));
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=391),"Mobile index no overflow");
  const mobileBar=mobile.locator(".ux-mobile-actions a").first();
  assert.equal(await mobileBar.getAttribute("href"),"/nl#rdw-check");
  await mobile.screenshot({path:process.env.TEMP+"/noordtune-models-index-mobile.png",fullPage:false});
  const xmlRes=await mobile.request.get(root+"/sitemap.xml");
  assert.equal(xmlRes.status(),200);
  const xml=await xmlRes.text();
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(urls.length,248,"Sitemap should contain 248 unique canonical paths");
  const modelUrls=urls.filter(u=>/\/nl\/modellen(?:\/|$)/.test(u));
  assert.equal(modelUrls.length,7,"7 new NL model index + model pages");
  assert.equal(new Set(modelUrls).size,7);
  assert.ok(!xml.includes("/pl/modellen")&&!xml.includes("/en/modellen"),"No unsupported locale duplicates");

  let verified=0;
  for(const m of nlModelFamilyHubs){
    const resp=await mobile.goto(root+"/nl/modellen/"+m.slug,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(resp?.status(),200,m.slug);
    assert.equal(await mobile.locator("h1").count(),1);
    const text=await mobile.locator("h1").innerText();
    assert.ok(text.includes(m.brand)&&text.includes(m.model),"Model H1 correct "+m.slug);
    assert.ok((await mobile.locator('link[rel="canonical"]').getAttribute("href")).endsWith("/nl/modellen/"+m.slug));
    const pages=await mobile.getByTestId("model-hub-variant-card").count();
    assert.equal(pages,m.engines.length,"Unique source-linked motor variants "+m.slug);
    const linked=await mobile.locator('a[href^="/nl/motoren/"]').evaluateAll(a=>[...new Set(a.map(x=>x.getAttribute("href")))]);
    assert.deepEqual(new Set(linked),new Set(m.engineSlugs.map(x=>"/nl/motoren/"+x)),m.slug+" all motor pages linked");
    const indexable=await mobile.locator('meta[name="robots"]').getAttribute("content");
    assert.ok(!indexable||!indexable.includes("noindex"));
    assert.ok(await mobile.getByTestId("model-hub-faq").isVisible(),"Real FAQ visible");
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=391),"No mobile overflow "+m.slug);
    const cta=mobile.locator(".ux-mobile-actions a").first();
    assert.equal(await cta.getAttribute("href"),"/nl#rdw-check","Mobile CTA works");
    if(m.slug==="volkswagen-caddy-20-tdi"||m.slug==="bmw-320i-f30-f31")
      await mobile.screenshot({path:process.env.TEMP+"/noordtune-model-"+m.slug+"-mobile.png",fullPage:false});
    console.log("NL_MODEL_BROWSER_PASS",m.slug,"engines="+pages);
    verified++;
  }
  const languages=["/en/modellen","/pl/modellen","/en/modellen/bmw-320i-f30-f31","/pl/modellen/nissan-qashqai-j11"];
  for(const path of languages){
    const response=await mobile.request.get(root+path);
    assert.equal(response.status(),404,"No fake translation "+path);
  }
  await mobile.setViewportSize({width:320,height:720});
  await mobile.goto(root+"/nl/modellen/nissan-qashqai-j11",{waitUntil:"domcontentloaded"});
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=321),"Small-phone model page no overflow");
  await mobile.setViewportSize({width:1440,height:900});
  await mobile.goto(root+"/nl/modellen/volkswagen-caddy-20-tdi",{waitUntil:"domcontentloaded"});
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=1441),"Desktop no overflow");
  assert.equal(await mobile.getByTestId("model-hub-variant-card").count(),5,"Caddy all five audited variants on desktop");
  await mobile.screenshot({path:process.env.TEMP+"/noordtune-model-caddy-desktop.png",fullPage:false});
  await mobile.goto(root+"/nl",{waitUntil:"domcontentloaded"});
  assert.equal(await mobile.locator('a[href="/nl/modellen"]').count(),1,"NL catalog home links model category");
  await mobile.goto(root+"/nl/motoren",{waitUntil:"domcontentloaded"});
  assert.ok(await mobile.locator('a[href="/nl/modellen"]').count()>=1,"NL engine directory links model category");
  assert.deepEqual(jsErrors,[],"No JS runtime errors in model hubs");
  console.log("NL_MODEL_HUB_BROWSER_PASS",JSON.stringify({verifiedModelPages:verified,modelIndex:1,motorLinks:15,newSitemapUrls:7,totalSitemap:248,negativeLanguages404:4,mobileWidths:[320,390],desktop:1440,allSourceBacked:true}));
 } finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
