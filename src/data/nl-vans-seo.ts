/**
 * Hand-reviewed NL company-van index.
 *
 * - 15 source-supported model comparisons are indexable.
 * - Seven additional vans remain discoverable in the directory/plate search,
 *   not as invented Stage 1 SEO pages.
 * - Numeric engine values may only come from strict verified RDW applications.
 */
import rawManifest from "./nl-vans-manifest.json" with {type: "json"};
import {verifiedRdwApplications} from "./verified-rdw-applications.ts";
import {nlStage1BySlug} from "./nl-stage1-engine-seo.ts";

export type ApprovedVanApplication=(typeof verifiedRdwApplications)[number];
export type FaqPair=readonly [question:string, answer:string];
type VanSource={name:string;url:string};
type ReviewModel={
 slug:string;make:string;model:string;size:"Compact"|"Middel"|"Groot";
 indexable:boolean;intro:string;difference:string;usage:string;checks:string;
 manufacturerSource:VanSource|null;verifiedIds:readonly string[];
 engineSlugs:readonly string[];faq:readonly FaqPair[];
};
export type VanModel=ReviewModel & {applications:readonly ApprovedVanApplication[]};
export type PendingVan={slug:string;make:string;model:string;size:"Compact"|"Middel"|"Groot";indexable:false};
type Manifest={version:string;indexed:readonly ReviewModel[];pending:readonly PendingVan[]};

const manifest=rawManifest as unknown as Manifest;
const verifiedMap=new Map(verifiedRdwApplications.map(x=>[x.id,x]));
export function validateApprovedVanApplication(a:ApprovedVanApplication,make:string){
 if(a.make.toLowerCase()!==make.toLowerCase())throw Error("Wrong make on van RDW scope: "+a.id);
 if(!a.registeredPowerKw||!a.requiredRdwType||!a.allowedRdwModels?.length||a.displacementCc<800||a.cylinders<2)throw Error("Missing exact RDW original van identity: "+a.id);
 if(!a.sources||a.sources.length<2||!a.sources.every(s=>s.url?.startsWith("https://")&&s.retrievalMethod==="page"&&s.sourceType==="tuner"))throw Error("Unreviewed Stage1 source(s) in "+a.id);
 if(new Set(a.sources.map(s=>new URL(s.url??"").hostname.replace(/^www\./,""))).size<2)throw Error("Need two independent publishers: "+a.id);
 if(a.powerRangeHp[0]<=a.stockPowerHp||a.torqueRangeNm[0]<=a.stockTorqueNm)throw Error("Invalid external Stage1 gains for "+a.id);
}
export const nlVanModels:readonly VanModel[]=manifest.indexed.map(m=>{
 if(!/^[a-z0-9-]+$/.test(m.slug)||!m.indexable||m.faq.length!==2)throw Error("Invalid manually indexed van topic "+m.slug);
 if(m.intro.length<135||m.difference.length<130||m.usage.length<105||m.checks.length<110)throw Error("Missing model-specific useful editorial copy "+m.slug);
 if(!m.verifiedIds.length&&!m.manufacturerSource?.url.startsWith("https://"))throw Error("Indexed van lacks independent manufacturer/approved source "+m.slug);
 if(new Set(m.verifiedIds).size!==m.verifiedIds.length)throw Error("Duplicate van application "+m.slug);
 const applications=m.verifiedIds.map(id=>{
  const a=verifiedMap.get(id);if(!a)throw Error("Missing approved van app "+id);
  validateApprovedVanApplication(a,m.make);
  return a;
 });
 for(const slug of m.engineSlugs){
  const a=nlStage1BySlug.get(slug);
  if(!a||a.applications[0].make.toLowerCase()!==m.make.toLowerCase())throw Error("Linking unpublished van engine "+slug);
 }
 for(const [question,answer] of m.faq)if(question.length<24||answer.length<85)throw Error("FAQ lacks individual technical detail in "+m.slug);
 return {...m,applications};
});
export const nlVanPending:readonly PendingVan[]=manifest.pending;
if(nlVanModels.length!==15||nlVanPending.length!==7||new Set([...nlVanModels,...nlVanPending].map(x=>x.slug)).size!==22)throw Error("Van publication manifest changed, manual approval required");
export const nlVanModelBySlug=new Map(nlVanModels.map(x=>[x.slug,x]));
export const nlVanIndexedModels=nlVanModels.filter(x=>x.indexable);
export const nlVanBrandNames=["Ford","Volkswagen","Mercedes-Benz","Toyota","Peugeot","Renault","Opel","Citroën","Fiat","Iveco"] as const;
export function nlVanModelPath(slug:string){return "/nl/bedrijfswagens/"+slug;}
export function nlVanEnginePath(slug:string){return "/nl/bedrijfswagens/motoren/"+slug;}
export function nlVanModelMetadata(m:VanModel){
 return {title:m.make+" "+m.model+" chiptuning en motoren",
 description:m.make+" "+m.model+": RDW-vermogens, onderscheid tussen motorversies, Stage 1-bronnen waar beschikbaar, en ECU/SCR-diagnose bij NoordTune."};
}
export function nlVanNumbers(m:VanModel){
 return {engines:m.engineSlugs.length,rdwApplications:m.applications.length,sources:new Set(m.applications.flatMap(a=>a.sources.map(s=>s.url))).size};
}
