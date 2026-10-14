import assert from "node:assert/strict";
import {verifiedRdwApplications} from "../src/data/verified-rdw-applications.ts";
import {nlLegacyPassengerSeoScopedApplications,nlLegacyPassengerSeoScopedById} from "../src/data/nl-passenger-legacy-scope-review.ts";
import {nlPassengerEngineProfiles} from "../src/data/nl-passenger-engine-expansion.ts";
import {nlModelHubBySlug} from "../src/data/nl-model-family-seo.ts";
import {nlVanEngineBySlug} from "../src/data/nl-van-engines-seo.ts";
import {nlVanModelBySlug} from "../src/data/nl-vans-seo.ts";

const cases=[
 {id:"rdw-seat-leon-1p-14-tsi-125",make:"Seat",model:"Leon",type:"1P",kw:92,cc:1390,from:2009,to:2011,rdwName:"LEON",slug:"seat-leon-1p-14-tsi-125"},
 {id:"rdw-seat-leon-5f-10-tsi-85kw",make:"Seat",model:"Leon",type:"5F",kw:85,cc:999,from:2015,to:2020,rdwName:"LEON",slug:"seat-leon-5f-10-ecotsi-115"},
 {id:"rdw-nissan-juke-f15-12-digt-85kw",make:"Nissan",model:"Juke",type:"F15",kw:85,cc:1197,from:2014,to:2019,rdwName:"NISSAN JUKE",slug:"nissan-juke-f15-12-dig-t-115"},
 {id:"rdw-skoda-octavia-1z-14-tsi-122",make:"Skoda",model:"Octavia",type:"1Z",kw:90,cc:1390,from:2009,to:2013,rdwName:"OCTAVIA",slug:"skoda-octavia-1z-14-tsi-122"},
 {id:"rdw-skoda-octavia-5e-14-tsi-140",make:"Skoda",model:"Octavia",type:"5E",kw:103,cc:1395,from:2013,to:2015,rdwName:"OCTAVIA",slug:"skoda-octavia-5e-14-tsi-140"}
] as const;
assert.equal(nlLegacyPassengerSeoScopedApplications.length,5);
assert.equal(nlLegacyPassengerSeoScopedById.size,5);
assert.deepEqual(new Set(nlLegacyPassengerSeoScopedById.keys()),new Set(cases.map(x=>x.id)));
for(const c of cases){
 const source=verifiedRdwApplications.find(a=>a.id===c.id);
 assert.ok(source,c.id+": original reviewed RDW source preserved");
 const a=nlLegacyPassengerSeoScopedById.get(c.id);
 assert.ok(a);
 assert.notEqual(a,source,"SEO scoped record is a copy; no mutation of core RDW");
 assert.equal(a.id,c.id);
 assert.equal(a.make,c.make);
 assert.equal(a.model,c.model);
 assert.equal(a.requiredRdwType,c.type);
 assert.equal(a.registeredPowerKw,c.kw);
 assert.equal(a.displacementCc,c.cc);
 assert.equal(a.yearFrom,c.from);
 assert.equal(a.yearTo,c.to);
 assert.deepEqual(a.allowedRdwModels,[c.rdwName]);
 assert.equal(a.fuel,"Petrol");
 assert.ok(!source.requiredRdwType||source.requiredRdwType===c.type,"Original RDW type never broadened");
 assert.ok(!source.allowedRdwModels?.length,"SEO whitelist must not silently mutate core original");
 const page=nlPassengerEngineProfiles.find(p=>p.slug===c.slug);
 assert.ok(page,"Only manually approved source engine gets an SEO profile "+c.slug);
 assert.equal(page.applications.length,1);
 assert.equal(page.applications[0],a);
 assert.ok(page.headline.length>=20 && (page.faq?.length??0)===2);
 const providers=new Set(page.sources.map(x=>new URL(x.url!).hostname.replace(/^www\./,"")));
 assert.ok(providers.size>=2);
 for(const [property,value] of [["requiredRdwType","wrong"],["registeredPowerKw",c.kw+1],["displacementCc",c.cc+1]] as const) {
  assert.notEqual((a as unknown as Record<string,unknown>)[property],value);
 }
}
const leon=nlModelHubBySlug.get("seat-leon-1p-5f");
const octavia=nlModelHubBySlug.get("skoda-octavia-1z-5e");
assert.ok(leon&&octavia);
assert.deepEqual(leon.engineSlugs,cases.filter(x=>x.make==="Seat").map(x=>x.slug));
assert.deepEqual(octavia.engineSlugs,cases.filter(x=>x.make==="Skoda").map(x=>x.slug));
assert.equal(leon.engines.length,2);
assert.equal(octavia.engines.length,2);
assert.notEqual(leon.engines[0].applications[0].displacementCc,leon.engines[1].applications[0].displacementCc);
assert.notEqual(octavia.engines[0].applications[0].registeredPowerKw,octavia.engines[1].applications[0].registeredPowerKw);
const caddyId="rdw-bulk2-vw-caddy-2kn-20tdi140-2013-14";
const caddy=nlVanEngineBySlug.get("volkswagen-caddy-2kn-20-tdi-140-2013-14");
assert.ok(caddy);
assert.deepEqual(caddy.appIds,[caddyId]);
assert.equal(caddy.applications[0].id,caddyId);
assert.equal(caddy.applications[0].requiredRdwType,"2KN");
assert.equal(caddy.applications[0].registeredPowerKw,103);
assert.deepEqual(caddy.applications[0].allowedRdwModels,["CADDY"]);
assert.equal(caddy.applications[0].fuel,"Diesel");
assert.equal(caddy.applications[0].yearFrom,2013);
assert.equal(caddy.applications[0].yearTo,2014);
assert.ok(nlVanModelBySlug.get(caddy.modelSlug)?.verifiedIds.includes(caddyId));
assert.equal(caddy.sources.length,2);
assert.ok(!caddy.appIds.includes("rdw-bulk-four-vw-caddy-2kn-20tdi140-2015"));
assert.ok(nlVanEngineBySlug.has("volkswagen-caddy-2kn-20-tdi-140-2013-14"));
assert.ok(!nlLegacyPassengerSeoScopedById.has(caddyId),"van remains in its separate indexed category");
console.log("NL_LEGACY_ENGINE_SCOPE_PASS",JSON.stringify({newPassengerEngines:cases.length,extraVanEngine:1,newModelHubs:2,seoOnlyApprovedBoundaries:5,caddySeparateGeneration:true,originalRdwResolverUntouched:true,sourcePublisherMinimum:2}));
