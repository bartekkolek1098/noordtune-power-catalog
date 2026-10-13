import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {nlPassengerEngineProfiles} from "../src/data/nl-passenger-engine-expansion.ts";
import {nlStage1EngineProfiles,nlStage1BySlug,nlStage1EnginePath} from "../src/data/nl-stage1-engine-seo.ts";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
import {nlVehiclePhotoByKey} from "../src/data/nl-vehicle-editorial.ts";

assert.equal(nlPassengerEngineProfiles.length,47,"Only the 47 individually edited passenger topics may be published in this batch");
assert.equal(nlStage1EngineProfiles.length,68,"Preserve 21 original NL engine pages plus 47 source-reviewed pages");
assert.equal(nlStage1BySlug.size,68,"No overlapping engine canonical slugs");
const vanIds=new Set(nlVanEngines.flatMap(e=>e.applications.map(a=>a.id)));
const passengerIds=new Set<string>();
const titles=new Set<string>();
const faqQuestions=new Set<string>();
let vettedSourceUrls=0;
for(const p of nlPassengerEngineProfiles){
 assert.ok(!titles.has(p.headline),p.slug+": duplicated headline");titles.add(p.headline);
 assert.equal(nlStage1BySlug.get(p.slug),p);
 assert.ok(nlStage1EnginePath(p.slug).startsWith("/nl/motoren/"));
 assert.ok(p.intro.length>=125&&p.workshopCheck.length>=125&&p.generationNote.length>=85,p.slug+": insufficient individual technical editorial copy");
 assert.equal(p.faq?.length,2,p.slug+": technical FAQs required");
 for(const [q,a] of p.faq??[]){
  assert.ok(q.length>=25&&a.length>=75,p.slug+": thin FAQ content");
  assert.ok(!faqQuestions.has(q),p.slug+": duplicate FAQ question");faqQuestions.add(q);
 }
 for(const a of p.applications){
  assert.ok(!passengerIds.has(a.id),a.id+": duplicate application");passengerIds.add(a.id);
  assert.ok(!vanIds.has(a.id),a.id+": already published under vans");
  assert.ok(a.requiredRdwType&&a.allowedRdwModels?.length&&a.registeredPowerKw&&a.displacementCc&&a.yearFrom<=a.yearTo,a.id+": missing RDW identity");
  assert.ok(a.powerRangeHp[0]>a.stockPowerHp&&a.torqueRangeNm[0]>a.stockTorqueNm,a.id+": fabricated stage gain");
  const independent=new Set(a.sources.filter(s=>s.sourceType==="tuner"&&s.retrievalMethod==="page"&&s.url?.startsWith("https://")).map(s=>new URL(s.url!).hostname.replace(/^www\./,"")));
  assert.ok(independent.size>=2,a.id+": fewer than two independent source publishers");
 }
 const hosts=new Set(p.sources.map(s=>new URL(s.url!).hostname.replace(/^www\./,"")));
 assert.ok(hosts.size>=2,p.slug+": missing independent cited sources");
 vettedSourceUrls+=p.sources.length;
 if(p.photoKey){
  const photo=nlVehiclePhotoByKey.get(p.photoKey);
  assert.ok(photo,p.slug+": unknown generation photo");
  assert.ok(photo.src.startsWith("/images/seo-vehicles/"));
  assert.ok(existsSync("public"+photo.src),p.slug+": missing licensed image");
  assert.ok(photo.author&&photo.source.startsWith("https://commons.wikimedia.org/")&&photo.license&&photo.licenseUrl);
 }
}
const idx=readFileSync("src/app/[locale]/motoren/page.tsx","utf8");
const detail=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
assert.ok(idx.includes("new Set(nlStage1EngineProfiles.map"),"All new makes must be present in the Dutch directory");
assert.ok(detail.includes("p.faq.map")&&detail.includes("p.photoKey")&&detail.includes("quality={78}"));
assert.ok(detail.includes("Geen NoordTune-meting")&&detail.includes("DPF, GPF, SCR en AdBlue blijven intact"));
assert.ok(sitemap.includes("...nlEnginePages")&&sitemap.includes("nlStage1EngineProfiles.map"));
console.log("NL_PASSENGER_SEO_EXPANSION_PASS",JSON.stringify({newEnginePages:nlPassengerEngineProfiles.length,enginePagesTotal:nlStage1EngineProfiles.length,reviewedApplications:passengerIds.size,sourceUrls:vettedSourceUrls,uniqueFaqQuestions:faqQuestions.size,newPhotoAssignments:nlPassengerEngineProfiles.filter(x=>x.photoKey).length}));
