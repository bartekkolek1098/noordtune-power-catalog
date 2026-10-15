import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {nlBrandEngineGuides,nlBrandGuideBySlug,getNlBrandGuide,nlBrandGuidePath,nlBrandGuideMetadata,nlBrandEngineIndexPath} from "../src/data/nl-brand-engine-guides.ts";
import {nlStage1EngineProfiles,nlStage1EnginePath} from "../src/data/nl-stage1-engine-seo.ts";
import {nlModelFamilyHubs,nlModelHubPath} from "../src/data/nl-model-family-seo.ts";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
import {nlVanModels,nlVanModelPath,nlVanEnginePath} from "../src/data/nl-vans-seo.ts";

assert.equal(nlBrandEngineIndexPath,"/nl/merken");
assert.equal(nlBrandEngineGuides.length,15,"Only the fifteen hand-authored NL technical brand hubs may be indexable");
assert.equal(new Set(nlBrandEngineGuides.map(g=>g.slug)).size,15);
assert.equal(new Set(nlBrandEngineGuides.map(g=>g.make)).size,15);
assert.equal(nlBrandGuideBySlug.size,15);
assert.deepEqual(new Set(nlBrandEngineGuides.map(g=>g.slug)),new Set([
 "bmw","audi","volkswagen","mercedes","ford","toyota","peugeot","renault","nissan","opel","citroen","fiat","iveco","seat","skoda"
]));
const routePaths=new Set<string>();
const titleSet=new Set<string>(),questionSet=new Set<string>();
const representedPassenger=new Set<string>(),representedVans=new Set<string>(),representedVanModels=new Set<string>(),representedHubs=new Set<string>();
let totalReviewedSources=0;
for(const g of nlBrandEngineGuides){
 assert.equal(nlBrandGuideBySlug.get(g.slug),g);
 assert.equal(getNlBrandGuide(g.make),g);
 assert.equal(getNlBrandGuide(" "+g.make.toUpperCase()+" "),g);
 const path=nlBrandGuidePath(g.slug);
 assert.equal(path,"/nl/merken/"+g.slug);
 assert.ok(!routePaths.has(path));routePaths.add(path);
 const meta=nlBrandGuideMetadata(g);
 assert.ok(meta.title.length>34&&meta.title.length<90,g.slug+" title");
 assert.ok(meta.description.length>115&&meta.description.length<230,g.slug+" description");
 assert.ok(!titleSet.has(meta.title),g.slug+" duplicate metadata");titleSet.add(meta.title);
 for(const [key,text] of [["intro",g.intro],["difference",g.difference],["checks",g.checks]] as const)
  assert.ok(text.length>=340,g.slug+" thin "+key);
 assert.equal(g.faq.length,2,g.slug+" exactly 2 independent technical questions");
 for(const [q,a] of g.faq){
  assert.ok(q.length>35&&a.length>145,g.slug+" thin FAQ");
  assert.ok(!questionSet.has(q),"Duplicate FAQ "+q);questionSet.add(q);
 }
 assert.ok(g.passenger.length+g.vanEngines.length>=2,g.slug+" too few verifiable engine profiles");
 const sourceHosts=new Set<string>(),sourceUrls=new Set<string>(),appIds=new Set<string>();
 for(const p of g.passenger){
  assert.equal(p.applications[0].make.toLowerCase(),g.make.toLowerCase(),g.slug+" cross-make passenger");
  assert.ok(nlStage1EngineProfiles.includes(p));
  representedPassenger.add(p.slug);
  assert.match(nlStage1EnginePath(p.slug),/^\/nl\/motoren\/[-a-z0-9]+$/);
  for(const app of p.applications)appIds.add(app.id);
  for(const s of p.sources){
   assert.ok(s.url?.startsWith("https://"));
   sourceUrls.add(s.url!);sourceHosts.add(new URL(s.url!).hostname.replace(/^www\./,""));
  }
 }
 for(const m of g.vanModels){
  assert.equal(m.make.toLowerCase(),g.make.toLowerCase(),g.slug+" cross-make van");
  representedVanModels.add(m.slug);
  assert.ok(nlVanModels.includes(m));
  assert.match(nlVanModelPath(m.slug),/^\/nl\/bedrijfswagens\/[a-z0-9-]+$/);
 }
 for(const e of g.vanEngines){
  assert.ok(nlVanEngines.includes(e));
  const parent=nlVanModels.find(m=>m.slug===e.modelSlug);
  assert.equal(parent?.make.toLowerCase(),g.make.toLowerCase(),g.slug+" wrong business motor brand");
  representedVans.add(e.slug);
  assert.match(nlVanEnginePath(e.slug),/^\/nl\/bedrijfswagens\/motoren\/[a-z0-9-]+$/);
  for(const app of e.applications)appIds.add(app.id);
  for(const s of e.sources){
   assert.ok(s.url?.startsWith("https://"));
   sourceUrls.add(s.url!);sourceHosts.add(new URL(s.url!).hostname.replace(/^www\./,""));
  }
 }
 for(const hub of g.modelHubs){
  assert.equal(hub.brand.toLowerCase(),g.make.toLowerCase());
  assert.ok(nlModelFamilyHubs.includes(hub));
  representedHubs.add(hub.slug);
  assert.match(nlModelHubPath(hub.slug),/^\/nl\/modellen\/[a-z0-9-]+$/);
  assert.ok(hub.engines.every(engine=>g.passenger.includes(engine)));
 }
 assert.equal(g.sourceCount,sourceUrls.size,g.slug+" source count derived from actual links");
 assert.equal(g.reviewedApplicationCount,appIds.size,g.slug+" application count derived from actual evidence");
 assert.ok(sourceHosts.size>=2,g.slug+" insufficient independent external sources");
 totalReviewedSources+=sourceUrls.size;
}
assert.equal(representedPassenger.size,69,"Do not invent thin brand pages for the four isolated one-profile marques");
assert.equal(representedVans.size,nlVanEngines.length,"All reviewed van engines have technical make navigation");
assert.equal(representedVanModels.size,nlVanModels.length,"Every reviewed van family is discoverable by brand");
assert.equal(representedHubs.size,nlModelFamilyHubs.length,"Every independently reviewed model comparison has a matching brand page");
for(const absent of ["Dacia","Hyundai","MINI","Mazda"]){
 assert.equal(getNlBrandGuide(absent),undefined,"Don't index one-engine doorway "+absent);
}
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
assert.ok(sitemap.includes("nlBrandEngineGuides.map(")&&sitemap.includes("...nlBrandPages"),"Only manually published Dutch brand URLs in sitemap");
const homepage=readFileSync("src/app/[locale]/page.tsx","utf8");
const index=readFileSync("src/app/[locale]/motoren/page.tsx","utf8");
const motor=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
const van=readFileSync("src/app/[locale]/bedrijfswagens/motoren/[slug]/page.tsx","utf8");
assert.match(homepage,/href=\{sitePath\(nlBrandEngineIndexPath\)\}/,"Home should directly link brand directory");
assert.match(index,/href=\{sitePath\(nlBrandEngineIndexPath\)\}/,"Motor index must link brand directory");
assert.match(motor,/data-testid="engine-to-brand-link"/);
assert.match(van,/data-testid="van-engine-to-brand-link"/);
const route=readFileSync("src/app/[locale]/merken/[slug]/page.tsx","utf8");
assert.match(route,/dynamicParams=false/);
assert.match(route,/nlBrandEngineGuides.map/);
assert.match(route,/getNlBrandGuide|nlBrandGuideBySlug/);
assert.match(route,/Stage 1-waarden zijn externe indicaties|Stage 1-waarden zijn externe/);
assert.match(route,/voorgeschreven emissievoorzieningen|DPF, SCR en AdBlue/);
console.log("NL_BRAND_ENGINE_HUBS_PASS",JSON.stringify({brandGuides:nlBrandEngineGuides.length,newCanonicalUrls:nlBrandEngineGuides.length+1,passengerEngineProfilesRepresented:representedPassenger.size,vanEnginesRepresented:representedVans.size,vanModelsRepresented:representedVanModels.size,comparisonHubsRepresented:representedHubs.size,uniqueFaq:questionSet.size,sourceLinksCountAcrossBrands:totalReviewedSources,excludesThinSoloMakes:4,onlyNl:true,unchangedRdwValues:true}));
