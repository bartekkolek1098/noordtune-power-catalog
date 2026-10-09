import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {reviewedRdwBulkBatch4} from "../src/data/reviewed-rdw-bulk-batch-4.ts";
import {
 nlStage1EngineProfiles,nlStage1BySlug,nlStage1EnginePath,
 nlStage1EngineMetadata,allStage1PowerRange,allStage1TorqueRange
} from "../src/data/nl-stage1-engine-seo.ts";

assert.equal(nlStage1EngineProfiles.length,21,"Publish only 21 distinct NL engine topics from batch 4");
assert.equal(nlStage1BySlug.size,21,"Canonical slugs must be unique");
const allIds=nlStage1EngineProfiles.flatMap(p=>p.applicationIds);
assert.equal(new Set(allIds).size,reviewedRdwBulkBatch4.length);
assert.deepEqual(new Set(allIds),new Set(reviewedRdwBulkBatch4.map(a=>a.id)));
const titles=new Set<string>(), descriptions=new Set<string>();
let verifiedReferences=0;
for(const p of nlStage1EngineProfiles){
 assert.match(p.slug,/^[a-z0-9-]+$/);
 assert.ok(p.intro.length>=100&&p.workshopCheck.length>=120&&p.generationNote.length>=55,`Individual researched NL copy too short ${p.slug}`);
 const {title,description}=nlStage1EngineMetadata(p);
 assert.ok(!titles.has(title),"Duplicate page SEO title "+title);
 assert.ok(!descriptions.has(description),"Duplicate page SEO description "+description);
 assert.ok(title.includes(p.headline)&&title.includes("Stage 1"));
 assert.ok(!title.includes("| NoordTune"),"Root metadata template adds brand exactly once");
 assert.ok(description.includes("RDW-varianten")&&description.includes("bronnen"));
 assert.ok(description.length>=100&&description.length<220);
 titles.add(title);descriptions.add(description);
 assert.ok(nlStage1EnginePath(p.slug).startsWith("/nl/motoren/"));
 assert.equal(p.applications.length,p.applicationIds.length);
 assert.equal(new Set(p.applications.map(a=>a.make)).size,1);
 assert.equal(new Set(p.applications.map(a=>a.model)).size,1);
 assert.ok(p.sources.length>=2);
 assert.equal(new Set(p.sources.map(x=>x.url)).size,p.sources.length);
 for(const source of p.sources){
  assert.ok(source.url?.startsWith("https://"));
  assert.equal(source.sourceType,"tuner");
  assert.equal(source.retrievalMethod,"page");
 }
 verifiedReferences+=p.sources.length;
 const power=allStage1PowerRange(p.applications),torque=allStage1TorqueRange(p.applications);
 assert.ok(power[0]>0&&power[1]>=power[0]&&torque[0]>0&&torque[1]>=torque[0]);
 for(const a of p.applications){
  assert.ok(a.stockPowerHp>0&&a.registeredPowerKw>0&&a.displacementCc>0&&a.cylinders>0);
  assert.ok(a.yearFrom<=a.yearTo&&a.requiredRdwType&&a.allowedRdwModels.length===1);
  assert.ok(a.powerRangeHp[0]>a.stockPowerHp,"Stage 1 must show an evidenced positive HP gain");
  assert.ok(a.torqueRangeNm[0]>a.stockTorqueNm,"Stage 1 must show an evidenced torque gain");
  assert.ok(a.reviewNote.toLowerCase().includes("not a guarantee"));
 }
}
const details=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
const listing=readFileSync("src/app/[locale]/motoren/page.tsx","utf8");
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
const homepage=readFileSync("src/app/[locale]/page.tsx","utf8");
assert.ok(details.includes('locale!=="nl"')&&listing.includes('locale!=="nl"'),"Only NL language published in pilot");
assert.ok(details.includes('dynamicParams=false')&&listing.includes('dynamicParams=false'));
assert.ok(details.includes("Stage 2 en Stage 3"),"Stage 2 and Stage 3 must remain outside sourced Stage 1 figures");
assert.ok(details.includes("geen NoordTune")||details.includes("Geen NoordTune-meting"));
assert.ok(details.includes("RDW registreert niet voor elke auto het fabriekskoppel"));
assert.ok(details.includes("citation:p.sources.map"));
assert.ok(sitemap.includes("...nlEnginePages"));
assert.ok(homepage.includes('href={sitePath("/nl/motoren")}'));
assert.ok(!homepage.includes("p.applicationIds") ,"No raw RDW IDs exposed in home page link logic");
console.log("NL_STAGE1_ENGINE_SEO_PASS",JSON.stringify({distinctNlPages:nlStage1EngineProfiles.length,reviewedRdwVariants:allIds.length,verifiedOutboundSourceReferences:verifiedReferences,duplicateCanonicals:0,onlyNl:true,unverifiedVariantsNotPublished:true}));
