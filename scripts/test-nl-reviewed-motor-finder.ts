import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {nlStage1EngineProfiles} from "../src/data/nl-stage1-engine-seo.ts";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
import {nlReviewedMotorResults} from "../src/data/nl-reviewed-motor-finder.ts";
import {filterReviewedMotors,reviewedMotorYears,normalizeMotorSearch} from "../src/lib/nl-reviewed-motor-search.ts";
import {nlModelFamilyHubs,nlModelHubByEngineSlug,nlModelHubsByEngineSlug,nlModelHubBySlug,nlModelEnginesTotal} from "../src/data/nl-model-family-seo.ts";

assert.equal(nlReviewedMotorResults.length,174,"73 general motor pages (including 12 vans) plus 101 specific van motor pages");
assert.equal(nlStage1EngineProfiles.length,73);
assert.equal(nlVanEngines.length,101);
assert.equal(nlReviewedMotorResults.filter(x=>x.kind==="personenauto").length,61,"Twelve original generic-route profiles are in fact vans");
assert.equal(nlReviewedMotorResults.filter(x=>x.kind==="bedrijfswagen").length,113,"Include the twelve verified business models from general engine routes");
assert.equal(new Set(nlReviewedMotorResults.map(x=>x.href)).size,174);
assert.equal(new Set(nlReviewedMotorResults.map(x=>x.id)).size,174);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{}).length,174);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{kind:"personenauto"}).length,61);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{kind:"bedrijfswagen"}).length,113);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{kind:"alle"}).length,174);
assert.ok(nlReviewedMotorResults.every(item=>item.scopes.length>0&&item.scopes.every(s=>s.registeredKw>0&&s.cc>800&&s.rdwType.length>=1&&s.from<=s.to)));
assert.ok(nlReviewedMotorResults.every(x=>/^\/nl\/(?:motoren|bedrijfswagens\/motoren)\/[a-z0-9-]+$/.test(x.href)),"Only approved canonical engine URLs");
const pairs=[
 ["bedrijfswagen","ford-transit-20-ecoblue-130","/nl/motoren/ford-transit-20-ecoblue-130"],
 ["bedrijfswagen","ford-transit-20-ecoblue-130","/nl/bedrijfswagens/motoren/ford-transit-20-ecoblue-130"]
] as const;
for(const [kind,id,href]of pairs){
 const matches=nlReviewedMotorResults.filter(x=>x.kind===kind&&x.href===href);
 assert.equal(matches.length,1,"Overlapping motor slugs require separate reviewed paths "+id);
}
assert.equal(normalizeMotorSearch("ŠKODA Čitroën Mégane"),"skoda citroen megane");
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{query:"vw polo",kind:"personenauto"}).some(x=>x.title.includes("Polo")));
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{query:"Skoda Octavia"}).length>=2);
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{query:"Škoda Octavia"}).length>=2);
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{query:"Citroën"}).length>=3);
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{query:"Mercedes Sprinter",kind:"bedrijfswagen"}).length>=5);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{query:"Sprinter",kind:"personenauto"}).length,0);
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{fuel:"CNG"}).length>0);
assert.ok(filterReviewedMotors(nlReviewedMotorResults,{fuel:"CNG"}).every(x=>x.fuel==="CNG"));
const n20=nlReviewedMotorResults.find(x=>x.href==="/nl/motoren/bmw-320i-f30-n20-184");
assert.ok(n20);
assert.ok(filterReviewedMotors([n20],{year:2015}).length===1);
assert.ok(filterReviewedMotors([n20],{year:2016}).length===0,"No fabricated years beyond reviewed N20 scope");
const ecoblue=nlReviewedMotorResults.find(x=>x.href==="/nl/motoren/ford-transit-connect-15-ecoblue-100");
assert.ok(ecoblue);
assert.ok(ecoblue.scopes.some(s=>s.registeredKw===73.5));
assert.ok(ecoblue.scopes.some(s=>s.registeredKw===73.3));
assert.equal(filterReviewedMotors([ecoblue],{year:2022,registeredKw:73.3}).length,1);
assert.equal(filterReviewedMotors([ecoblue],{year:2022,registeredKw:73.5}).length,0,"Year and kW must refer to the same verified application");
assert.equal(filterReviewedMotors([ecoblue],{year:2019,registeredKw:73.5}).length,1);
assert.equal(filterReviewedMotors([ecoblue],{year:2021}).length,0,"No invented interval across reviewed year gap");
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{year:1900}).length,0);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{year:2024.5}).length,0);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{registeredKw:Number.NaN}).length,0);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{registeredKw:-100}).length,0);
assert.equal(filterReviewedMotors(nlReviewedMotorResults,{registeredKw:99999}).length,0);
assert.ok(reviewedMotorYears(nlReviewedMotorResults).includes(2024));
assert.ok(!reviewedMotorYears([n20]).includes(2016));
assert.ok(reviewedMotorYears(nlReviewedMotorResults).every(y=>y>=1886&&y<=2100));

const desiredHubs={
 "bmw-320i-f30-g20":["bmw-320i-f30-n20-184","bmw-320i-f30-b48-184","bmw-320i-g20-g21-b48-184"],
 "volkswagen-golf-6-7":["volkswagen-golf-6-14-tsi-122","volkswagen-golf-7-12-tsi-105","volkswagen-golf-7-10-tsi-110","volkswagen-golf-7-gti-performance-245"],
 "nissan-juke-f15-f16":["nissan-juke-f15-12-dig-t-115","nissan-juke-f16-10-dig-t-117","nissan-juke-f16-10-dig-t-114"]
} as const;
assert.equal(nlModelFamilyHubs.length,24);
assert.equal(nlModelHubBySlug.size,24);
assert.equal(nlModelEnginesTotal(),56);
for(const [slug,engines]of Object.entries(desiredHubs)){
 const hub=nlModelHubBySlug.get(slug);
 assert.ok(hub);
 assert.deepEqual(hub.engineSlugs,engines);
 assert.ok(hub.intro.length>=150&&hub.checks.length>=115&&hub.difference.length>=140);
 assert.equal(hub.faq.length,2);
 assert.equal(new Set(hub.engines.map(x=>x.applications[0].make)).size,1);
 for(const engine of hub.engines){
  assert.ok(nlModelHubsByEngineSlug.get(engine.slug)?.includes(hub),slug+" must be linked from motor page "+engine.slug);
 }
}
for(const [slug,primary,secondary]of [
 ["bmw-320i-f30-n20-184","bmw-320i-f30-f31","bmw-320i-f30-g20"],
 ["volkswagen-golf-7-10-tsi-110","volkswagen-golf-7","volkswagen-golf-6-7"],
 ["nissan-juke-f16-10-dig-t-117","nissan-juke-f16","nissan-juke-f15-f16"]
] as const){
 assert.equal(nlModelHubByEngineSlug.get(slug)?.slug,primary,"Original primary comparison must remain stable");
 assert.deepEqual(nlModelHubsByEngineSlug.get(slug)?.map(h=>h.slug),[primary,secondary]);
}
const page=readFileSync("src/app/[locale]/motoren/page.tsx","utf8");
const detail=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
assert.match(page,/<NlReviewedMotorFinder items=\{nlReviewedMotorResults\}/);
assert.match(detail,/comparisonHubs\.map/);
assert.match(detail,/data-testid="engine-model-hub-backlink"/);
const finder=readFileSync("src/components/nl-reviewed-motor-finder.tsx","utf8");
assert.ok(finder.includes("from \"@/lib/nl-reviewed-motor-search\""),"Avoid bundling server RDW registry in browser search code");
assert.match(finder,/"use client"/);
assert.match(finder,/role="status"/);
assert.match(finder,/id="nl-motor-search-kw"/);
assert.match(finder,/id="nl-motor-search-year"/);
assert.match(finder,/Geen beoordeeld motorprofiel/);
assert.ok(!finder.includes("fetch(")&&!finder.includes("localStorage")&&!finder.includes("navigator.sendBeacon"),"User filters must remain client-only");
console.log("NL_REVIEWED_MOTOR_FINDER_PASS",JSON.stringify({reviewedMotors:nlReviewedMotorResults.length,passenger:61,vans:113,overlappingSlugsNamespacesSeparated:true,yearKwSameApplication:true,noMissingYearInterpolation:true,makes:new Set(nlReviewedMotorResults.map(x=>x.make)).size,newModelHubs:3,modelHubsTotal:24,distinctEnginesInComparisons:56,noNewStageOneNumbers:true}));
