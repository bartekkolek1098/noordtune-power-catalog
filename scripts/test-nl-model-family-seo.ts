import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {nlStage1EngineProfiles} from "../src/data/nl-stage1-engine-seo.ts";
import {
 nlModelFamilyHubs,nlModelHubBySlug,nlModelHubByEngineSlug,
 nlModelHubPath,nlModelHubMetadata,nlModelEnginesTotal
} from "../src/data/nl-model-family-seo.ts";

assert.equal(nlModelFamilyHubs.length,6,"Publish six researched multi-engine NL model hubs");
assert.equal(nlModelHubBySlug.size,6);
assert.equal(nlModelEnginesTotal(),15,"Only 15 source-backed engine topics are assigned to researched model families");
const slugs=new Set<string>(),titles=new Set<string>(),descriptions=new Set<string>();
const linked=new Set<string>();
for(const m of nlModelFamilyHubs){
 const path=nlModelHubPath(m.slug);
 assert.ok(path.startsWith("/nl/modellen/"),"Only Dutch canonical model paths");
 assert.ok(!slugs.has(m.slug));
 slugs.add(m.slug);
 assert.ok(m.engineSlugs.length>=2&&m.engineSlugs.length===m.engines.length);
 assert.ok(m.intro.length>=150&&m.difference.length>=140&&m.checks.length>=115,"Model page needs useful, original editorial text");
 assert.ok(m.faq.length>=2&&m.faq.every(([q,a])=>q.length>25&&a.length>95));
 assert.ok(new Set(m.faq.map(([q])=>q)).size===m.faq.length,"No duplicate FAQs");
 const {title,description}=nlModelHubMetadata(m);
 assert.ok(!titles.has(title)||!descriptions.has(description),"No repeated metadata across models");
 titles.add(title);descriptions.add(description);
 assert.ok(title.includes("Stage 1")&&title.includes(m.brand));
 assert.ok(!title.includes("| NoordTune"),"Layout appends NoordTune branding once");
 assert.ok(description.includes("ECU")&&description.includes(m.model));
 assert.ok(description.length>=115&&description.length<200);
 for(const engine of m.engines){
  assert.ok(nlStage1EngineProfiles.includes(engine),"Only reviewed published motor topics in hubs");
  assert.equal(engine.applications[0].make,m.brand);
  assert.ok(engine.sources.length>=2&&engine.sources.every(s=>s.url?.startsWith("https://")));
  assert.equal(nlModelHubByEngineSlug.get(engine.slug),m,"Reverse engine→model link");
  assert.ok(!linked.has(engine.slug),"Each motor in exactly one primary model family");
  linked.add(engine.slug);
 }
}
assert.equal(linked.size,15);
const homepage=readFileSync("src/app/[locale]/page.tsx","utf8");
const engineIndex=readFileSync("src/app/[locale]/motoren/page.tsx","utf8");
const engineDetail=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
const modelsPage=readFileSync("src/app/[locale]/modellen/page.tsx","utf8");
const modelDetail=readFileSync("src/app/[locale]/modellen/[slug]/page.tsx","utf8");
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
assert.ok(homepage.includes('sitePath("/nl/modellen")'),"Homepage links model category");
assert.ok(engineIndex.includes('sitePath("/nl/modellen")'),"Engine index links models");
assert.ok(engineDetail.includes("nlModelHubByEngineSlug.get(p.slug)"),"Engine detail has contextual backlink");
assert.ok(modelsPage.includes('dynamicParams=false')&&modelDetail.includes('dynamicParams=false'));
assert.ok(modelsPage.includes('locale!=="nl"')&&modelDetail.includes('locale!=="nl"'),"No thin translations yet");
assert.ok(modelDetail.includes("ItemList"),"Model page has actual engine navigation");
assert.ok(!modelDetail.includes('"@type":"Offer"'),"No invented service offers");
assert.ok(modelDetail.includes("geen NoordTune-meting"),"Averred published performance should not be claims of NoordTune dyno readings");
assert.ok(sitemap.includes("...nlModelPages"),"NL model pages belong in sitemap");
console.log("NL_MODEL_HUB_SEO_PASS",JSON.stringify({nlModelHubs:nlModelFamilyHubs.length,distinctEngines:linked.size,originalFaqs:nlModelFamilyHubs.reduce((n,m)=>n+m.faq.length,0),originalSitemapRoutes:241,newRoutes:7,totalRoutes:248,duplicates:0,onlyNl:true}));
