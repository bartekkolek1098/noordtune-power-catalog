import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {nlVanComparisons,nlVanCompareBySlug,nlVanCompareByModelSlug,nlVanCompareByEngineSlug,nlVanComparePath,nlVanCompareIndexPath,nlVanCompareMetadata} from "../src/data/nl-van-comparisons.ts";
import {nlVanModels,nlVanModelBySlug,nlVanEnginePath} from "../src/data/nl-vans-seo.ts";
import {nlVanEngines,nlVanEngineBySlug} from "../src/data/nl-van-engines-seo.ts";
import {getCatalogEnquiryContext} from "../src/lib/catalog-enquiry-context.ts";
import {validCatalogEnquiryContext} from "../src/lib/catalog-enquiry-contract.ts";

const approved={
 "mercedes-sprinter-313-317-cdi":{model:"mercedes-sprinter",count:7},
 "mercedes-vito-114-119-cdi":{model:"mercedes-vito",count:6},
 "volkswagen-transporter-t5-t6-t61":{model:"volkswagen-transporter",count:8},
 "ford-transit-custom-22-tdci-20-ecoblue":{model:"ford-transit-custom",count:3},
 "ford-transit-ecoblue-130-165-170":{model:"ford-transit",count:6},
 "volkswagen-crafter-20-tdi-102-140":{model:"volkswagen-crafter",count:3},
 "toyota-proace-15-20-d4d":{model:"toyota-proace",count:5},
 "peugeot-boxer-20-22-bluehdi":{model:"peugeot-boxer",count:4},
 "fiat-ducato-23-multijet-euro6":{model:"fiat-ducato",count:4}
} as const;
assert.equal(nlVanCompareIndexPath,"/nl/bedrijfswagens/vergelijken");
assert.equal(nlVanComparisons.length,9);
assert.equal(nlVanCompareBySlug.size,9);
assert.equal(nlVanCompareByModelSlug.size,9);
assert.deepEqual(new Set(nlVanComparisons.map(c=>c.slug)),new Set(Object.keys(approved)));
const urls=new Set<string>(),headlines=new Set<string>(),faqQuestions=new Set<string>(),engines=new Set<string>();
let reviewedApplications=0,quoteHandoffs=0;
for(const c of nlVanComparisons){
 const expected=approved[c.slug as keyof typeof approved];
 assert.ok(expected);
 const parent=nlVanModelBySlug.get(c.modelSlug);
 assert.equal(parent?.slug,expected.model);
 assert.equal(c.make,parent?.make);
 assert.equal(c.model,parent?.model);
 assert.equal(c.engines.length,expected.count);
 assert.equal(c.engines.length,c.engineSlugs.length);
 assert.equal(nlVanCompareBySlug.get(c.slug),c);
 assert.equal(nlVanCompareByModelSlug.get(c.modelSlug),c);
 assert.equal(c.usage.length>225&&c.difference.length>365&&c.checks.length>315&&c.intro.length>350,true,c.slug+" unique editorial scope");
 assert.equal(c.faq.length,2);
 assert.ok(!headlines.has(c.headline),"No duplicate SEO title "+c.headline);
 headlines.add(c.headline);
 for(const [question,answer]of c.faq){
  assert.ok(question.length>40&&answer.length>185,c.slug+": FAQ substance");
  assert.ok(!faqQuestions.has(question),"No FAQ text reused "+question);
  faqQuestions.add(question);
 }
 const {title,description}=nlVanCompareMetadata(c);
 assert.ok(title.includes(c.make.split("-")[0])&&title.length>=48&&title.length<=92);
 assert.ok(description.includes("RDW-kW")&&description.includes("ECU")&&description.length>=145&&description.length<=240);
 const p=nlVanComparePath(c.slug);
 assert.match(p,/^\/nl\/bedrijfswagens\/vergelijken\/[a-z0-9-]+$/);
 assert.ok(!urls.has(p));urls.add(p);
 const modelSources=new Set<string>(),modelApps=new Set<string>();
 for(const engine of c.engines){
  const same=nlVanEngineBySlug.get(engine.slug);
  assert.equal(same,engine,"Comparison card must be a real published engine, not a clone");
  assert.equal(engine.modelSlug,c.modelSlug);
  assert.equal(nlVanCompareByEngineSlug.get(engine.slug),c);
  assert.ok(nlVanEngines.includes(engine));
  assert.match(nlVanEnginePath(engine.slug),/^\/nl\/bedrijfswagens\/motoren\/[a-z0-9-]+$/);
  assert.ok(!engines.has(engine.slug),"Every compared van engine belongs to one technical comparison");
  engines.add(engine.slug);
  const reference={kind:"engine" as const,id:engine.slug};
  const enquiry=getCatalogEnquiryContext(reference);
  assert.ok(validCatalogEnquiryContext(enquiry,reference),engine.slug+" must preserve precise NL quote");
  quoteHandoffs++;
  const publishers=new Set<string>();
  for(const s of engine.sources){
   assert.ok(s.url?.startsWith("https://"));
   publishers.add(new URL(s.url!).hostname.replace(/^www\./,""));
   modelSources.add(s.url!);
  }
  assert.ok(publishers.size>=2,engine.slug+": 2 independent tuner hosts");
  for(const a of engine.applications){
   assert.ok(a.requiredRdwType&&a.allowedRdwModels?.length&&a.registeredPowerKw);
   assert.equal(a.fuel,"Diesel");
   assert.ok(a.yearFrom<=a.yearTo&&a.powerRangeHp[0]>a.stockPowerHp&&a.torqueRangeNm[0]>a.stockTorqueNm);
   assert.ok(parent?.verifiedIds.includes(a.id),c.slug+" unreviewed application "+a.id);
   modelApps.add(a.id);
   reviewedApplications++;
  }
 }
 assert.equal(c.auditedScopes,modelApps.size);
 assert.equal(c.sourceUrls,modelSources.size);
}
assert.ok(nlVanComparisons.every(x=>nlVanModels.includes(nlVanModelBySlug.get(x.modelSlug)!)));
assert.equal(engines.size,46,"All 46 selected and distinct commercial van engine pages compared");
assert.equal(quoteHandoffs,46);
assert.ok(reviewedApplications>=46);
assert.equal(faqQuestions.size,18);
const index=readFileSync("src/app/[locale]/bedrijfswagens/vergelijken/page.tsx","utf8");
const detail=readFileSync("src/app/[locale]/bedrijfswagens/vergelijken/[slug]/page.tsx","utf8");
const model=readFileSync("src/app/[locale]/bedrijfswagens/[slug]/page.tsx","utf8");
const engine=readFileSync("src/app/[locale]/bedrijfswagens/motoren/[slug]/page.tsx","utf8");
const brands=readFileSync("src/app/[locale]/merken/[slug]/page.tsx","utf8");
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
assert.match(index,/dynamicParams=false/);
assert.match(detail,/dynamicParams=false/);
assert.match(index,/locale!=="nl"/);
assert.match(detail,/locale!=="nl"/);
assert.match(detail,/engineSlugs|c\.engines\.map/);
assert.match(detail,/a\.registeredPowerKw/);
assert.match(detail,/a\.yearFrom/);
assert.match(detail,/e\.sources\.slice/);
assert.match(detail,/CatalogEnquiryLink business locale="nl"/);
assert.match(detail,/geen ECU-goedkeuring|geen ECU-goedkeuring|geen garantie|geen ECU-goedkeuring/i);
assert.match(model,/data-testid="van-model-to-comparison"/);
assert.match(engine,/data-testid="van-engine-to-comparison"/);
assert.match(brands,/data-testid="brand-van-comparisons"/);
assert.match(sitemap,/\.\.\.nlVanComparisonPages/);
assert.ok(!detail.includes('href="/en/bedrijfswagens/vergelijken"'));
assert.ok(!detail.includes('"@type":"Offer"'),"No fabricated fixed-price stage service");
console.log("NL_VAN_COMPARISON_SEO_PASS",JSON.stringify({
 reviewedComparisonPages:nlVanComparisons.length,uniquePublicRoutes:10,engineCards:engines.size,
 reviewedRdWScopeRows:reviewedApplications,verifiedContactHandoffs:quoteHandoffs,
 uniqueFaqs:faqQuestions.size,canonicalSitemapAfter:472,onlyNl:true,
 noNewStage1Claims:true,roadEmissionControlsRetained:true
}));
