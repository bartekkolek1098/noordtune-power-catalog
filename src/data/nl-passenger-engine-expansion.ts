/**
 * Individually written Dutch passenger-engine SEO pages, sourced exclusively
 * from already reviewed, generation-scoped RDW + external Stage 1 applications.
 * This registry is an explicit editorial publication whitelist, NOT a generator
 * for every RDW vehicle or tuning-profile combination.
 */
import rawA from "./nl-passenger-engine-expansion-a.json" with {type:"json"};
import rawB from "./nl-passenger-engine-expansion-b.json" with {type:"json"};
import rawC from "./nl-passenger-engine-expansion-c.json" with {type:"json"};
import {nlLegacyPassengerSeoScopedById} from "./nl-passenger-legacy-scope-review.ts";
import {verifiedRdwApplications} from "./verified-rdw-applications.ts";
import type {NlStage1EngineProfile,ReviewedRdwApplication} from "./nl-stage1-engine-seo.ts";

type Spec = {
 slug:string; headline:string; intro:string; workshopCheck:string;
 generationNote:string; applicationIds:readonly string[];
 faq:readonly (readonly [string,string])[]; photoKey?:string;
};
const specs=[...rawA.items,...rawB.items,...rawC.items] as unknown as readonly Spec[];
const reviewedMap=new Map([...verifiedRdwApplications,...nlLegacyPassengerSeoScopedById.values()].map(item=>[item.id,item]));
const usedIds=new Set<string>();
const publishedSlugs=new Set<string>();
const approvedPhotos=new Set(["bmw-g20","vw-golf-7","skoda-5e","seat-leon-5f"]);
export const nlPassengerEngineProfiles:readonly NlStage1EngineProfile[]=specs.map(spec=>{
 if(!/^[a-z0-9-]+$/.test(spec.slug)||publishedSlugs.has(spec.slug))
  throw Error("Invalid or duplicate NL passenger SEO slug "+spec.slug);
 publishedSlugs.add(spec.slug);
 if(spec.intro.length<125||spec.workshopCheck.length<125||spec.generationNote.length<85)
  throw Error("Passenger engine missing individually reviewed technical guidance: "+spec.slug);
 if(spec.faq.length!==2||spec.faq.some(([q,a])=>q.length<25||a.length<75))
  throw Error("Passenger engine missing useful FAQ: "+spec.slug);
 if(spec.photoKey&&!approvedPhotos.has(spec.photoKey))
  throw Error("Passenger engine photo generation not reviewed: "+spec.slug);
 if(!spec.applicationIds.length)throw Error("Missing reviewed RDW variants: "+spec.slug);
 const applications=spec.applicationIds.map(id=>{
  if(usedIds.has(id))throw Error("RDW application published twice: "+id);
  const a=reviewedMap.get(id);
  if(!a)throw Error("Unknown passenger RDW application "+id);
  if(!a.registeredPowerKw||!a.requiredRdwType||!a.allowedRdwModels?.length||a.yearFrom>a.yearTo)
   throw Error("Missing actual RDW engine identity: "+id);
  if(a.fuel!=="Petrol"&&a.fuel!=="Diesel")
   throw Error("Special fuels need separate evidence: "+id);
  if(a.powerRangeHp[0]<=a.stockPowerHp||a.torqueRangeNm[0]<=a.stockTorqueNm)
   throw Error("Invalid source-based Stage 1 range: "+id);
  const sources=a.sources.filter(s=>s.sourceType==="tuner"&&s.retrievalMethod==="page"&&s.url?.startsWith("https://"));
  const providers=new Set(sources.map(s=>new URL(s.url!).hostname.replace(/^www\./,"")));
  if(providers.size<2)throw Error("Insufficient independent tuner publishers: "+id);
  usedIds.add(id);
  return a as ReviewedRdwApplication;
 });
 if(new Set(applications.map(a=>a.make.toLowerCase())).size!==1||
    new Set(applications.map(a=>a.model.toLowerCase())).size!==1||
    new Set(applications.map(a=>a.displacementCc)).size!==1||
    new Set(applications.map(a=>a.registeredPowerKw)).size!==1||
    new Set(applications.map(a=>a.fuel)).size!==1)
  throw Error("Merged incompatible RDW engines: "+spec.slug);
 const sources=[...new Map(applications.flatMap(a=>a.sources)
   .filter(s=>s.sourceType==="tuner"&&s.retrievalMethod==="page"&&s.url?.startsWith("https://"))
   .map(s=>[s.url,s] as const)).values()];
 return {...spec,applications,sources};
});
if(specs.length!==nlPassengerEngineProfiles.length)throw Error("Passenger SEO manifest incomplete");
