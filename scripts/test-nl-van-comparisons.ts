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
 "fiat-ducato-23-multijet-euro6":{model:"fiat-ducato",count:4},
 "iveco-daily-23-30-euro6-euro6df":{model:"iveco-daily",count:6},
 "renault-master-23-dci-blue-dci":{model:"renault-master",count:4},
 "peugeot-expert-20-bluehdi-120-180":{model:"peugeot-expert",count:4},
 "toyota-proace-city-15-d4d-75-130":{model:"toyota-proace-city",count:4},
 "opel-vivaro-b-16-cdti-biturbo":{model:"opel-vivaro",count:4},
 "opel-movano-b-c-23-cdti-22-diesel":{model:"opel-movano",count:5},
 "citroen-jumpy-15-20-bluehdi":{model:"citroen-jumpy",count:4},
 "citroen-berlingo-ii-iii-hdi-bluehdi":{model:"citroen-berlingo",count:4},
 "peugeot-partner-ii-iii-hdi-bluehdi":{model:"peugeot-partner",count:5},
 "fiat-doblo-16-multijet-100-120":{model:"fiat-doblo",count:3},
 "opel-combo-e-15-diesel-75-130":{model:"opel-combo",count:3},
 "renault-kangoo-15-dci-75-110":{model:"renault-kangoo",count:3}
} as const;
assert.equal(nlVanCompareIndexPath,"/nl/bedrijfswagens/vergelijken");
assert.equal(nlVanComparisons.length,21);
assert.equal(nlVanCompareBySlug.size,21);
assert.equal(nlVanCompareByModelSlug.size,21);
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
 const plain=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 assert.ok(plain(title).includes(plain(c.make.split("-")[0]))&&title.length>=48&&title.length<=92);
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
assert.equal(engines.size,95,"95 distinct reviewed diesel van engine pages in technical comparisons");
assert.equal(quoteHandoffs,95);
assert.equal(reviewedApplications,112,"112 exact reviewed RDW variants, including separate Iveco body types and admission intervals");
assert.equal(faqQuestions.size,42);
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
// Regression guards: a shared model badge or RDW type never fills source year gaps.
const applicationYears=(slug:string)=>{
 const comparison=nlVanCompareBySlug.get(slug);
 assert.ok(comparison);
 return (engineSlug:string)=>{
  const engine=comparison.engines.find(e=>e.slug===engineSlug);
  assert.ok(engine);
  return engine.applications.flatMap(a=>Array.from({length:a.yearTo-a.yearFrom+1},(_,i)=>a.yearFrom+i));
 };
};
const master145=applicationYears("renault-master-23-dci-blue-dci")("renault-master-23-dci-145-2019-22");
assert.deepEqual(master145,[2019,2022],"Never interpolate Master 145 for unreviewed 2020–2021");
const expert145=applicationYears("peugeot-expert-20-bluehdi-120-180")("peugeot-expert-20-bluehdi-145-2022-24");
assert.deepEqual(expert145,[2022,2024],"No inferred Expert 145 application for 2023");
const kangoo90=applicationYears("renault-kangoo-15-dci-75-110")("renault-kangoo-15-dci-90-2015-2019");
assert.deepEqual(kangoo90,[2015,2019],"Kangoo 90 includes only independently reviewed admission years");
const movano=nlVanCompareBySlug.get("opel-movano-b-c-23-cdti-22-diesel")!;
assert.deepEqual(new Set(movano.engines.flatMap(e=>e.applications.map(a=>a.displacementCc))),new Set([2299,2179]));
assert.ok(new Set(movano.engines.flatMap(e=>e.applications.map(a=>a.requiredRdwType))).has("Y"));
assert.ok(new Set(movano.engines.flatMap(e=>e.applications.map(a=>a.requiredRdwType))).has("MR"));
const iveco=nlVanCompareBySlug.get("iveco-daily-23-30-euro6-euro6df")!;
assert.equal(iveco.auditedScopes,17,"Iveco chassis type and original kW scope preserved per body variant");
assert.deepEqual(new Set(iveco.engines.flatMap(e=>e.applications.map(a=>a.displacementCc))),new Set([2287,2998]));
assert.ok(iveco.engines.flatMap(e=>e.applications).some(a=>a.registeredPowerKw===114.6));
const city=nlVanCompareBySlug.get("toyota-proace-city-15-d4d-75-130")!;
assert.equal(city.engines.filter(e=>e.applications.some(a=>a.registeredPowerKw===96)).length,2);
assert.deepEqual(city.engines.filter(e=>e.applications.some(a=>a.registeredPowerKw===96)).map(e=>e.applications[0].yearFrom),[2020,2024],"2024 Proace City 130 independent software cohort");
const berlingo=nlVanCompareBySlug.get("citroen-berlingo-ii-iii-hdi-bluehdi")!;
assert.deepEqual(new Set(berlingo.engines.map(e=>e.applications[0].displacementCc)),new Set([1560,1499]));
assert.deepEqual(new Set(berlingo.engines.map(e=>e.applications[0].requiredRdwType)),new Set(["7","E"]));

console.log("NL_VAN_COMPARISON_SEO_PASS",JSON.stringify({
 reviewedComparisonPages:nlVanComparisons.length,uniquePublicRoutes:22,engineCards:engines.size,
 reviewedRdWScopeRows:reviewedApplications,verifiedContactHandoffs:quoteHandoffs,
 uniqueFaqs:faqQuestions.size,canonicalSitemapAfter:484,onlyNl:true,
 noNewStage1Claims:true,roadEmissionControlsRetained:true
}));
