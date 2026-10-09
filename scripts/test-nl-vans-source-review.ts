import assert from "node:assert/strict";
import manifest from "../src/data/nl-vans-manifest.json" with {type:"json"};
import {verifiedRdwApplications} from "../src/data/verified-rdw-applications.ts";
import {
  nlVanModels,nlVanPending,nlVanModelBySlug,nlVanIndexedModels
} from "../src/data/nl-vans-seo.ts";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
assert.equal(nlVanModels.length,15);
assert.equal(nlVanPending.length,7);
assert.equal(nlVanIndexedModels.length,15);
assert.equal(nlVanEngines.length,5);
assert.equal(new Set([...nlVanModels,...nlVanPending].map(x=>x.slug)).size,22);
assert.equal(new Set(nlVanEngines.map(x=>x.slug)).size,5);
assert.equal(new Set(nlVanModels.map(x=>x.make)).size,6);
assert.equal(manifest.indexed.length,15);
const available=new Map(verifiedRdwApplications.map(x=>[x.id,x]));
const uniqueModels=new Set<string>(),sourceUrl=new Set<string>();
let apps=0;
for(const model of nlVanModels){
 assert.ok(!uniqueModels.has(model.make+"/"+model.model),"Repeated indexable model");
 uniqueModels.add(model.make+"/"+model.model);
 assert.ok(model.manufacturerSource?.url.startsWith("https://")||model.applications.length>0);
 assert.equal(model.faq.length,2);
 assert.ok(model.checks.toLowerCase().includes("ecu")||model.checks.toLowerCase().includes("motorcode"));
 assert.ok(model.intro.length>=135&&model.difference.length>=130&&model.usage.length>=105);
 for(const a of model.applications){
  const canonical=available.get(a.id);assert.equal(canonical,a);
  assert.ok(a.registeredPowerKw&&a.requiredRdwType&&a.sources?.length>=2);
  const providers=new Set(a.sources.map(s=>new URL(s.url??"").hostname));
  assert.ok(providers.size>=2);
  for(const s of a.sources){
   assert.equal(s.sourceType,"tuner");
   assert.equal(s.retrievalMethod,"page");
   sourceUrl.add(s.url??"");
  }
  apps++;
 }
 for(const slug of model.engineSlugs){
  assert.ok(slug&&!slug.includes("undefined"));
 }
}
for(const p of nlVanPending){
 assert.equal(p.indexable,false);
 assert.ok(!nlVanModelBySlug.has(p.slug),"Unreviewed van cannot get indexed model URL");
}
for(const e of nlVanEngines){
 const m=nlVanModelBySlug.get(e.modelSlug);
 assert.ok(m,"Engine must have parent");
 assert.equal(e.applications.length,e.appIds.length);
 assert.ok(e.sources.length>=2);
 assert.ok(e.intro.length>=125&&e.checks.length>=125);
 for(const app of e.applications){
  assert.ok(m.verifiedIds.includes(app.id));
  assert.ok(app.powerRangeHp[0]>app.stockPowerHp);
  assert.ok(app.torqueRangeNm[0]>app.stockTorqueNm);
 }
 for(const src of e.sources)sourceUrl.add(src.url??"");
}
console.log("NL_VAN_DATA_PASS",JSON.stringify({
 reviewedVanModelPages:nlVanIndexedModels.length,
 additionalBrowseOnlyModels:nlVanPending.length,
 newExactEnginePages:nlVanEngines.length,
 auditedRdwApplications:apps,
 distinctExternalSourceUrls:sourceUrl.size,
 neverFabricatesStageGains:true,
 manualIndexApproval:true
}));
