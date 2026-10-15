/**
 * Server-side source-backed registry for the NL motor finder. Pass only the
 * serializable, approved search fields to the client component. No original
 * RDW plate records, source URL registry or tuning algorithms leave the server.
 */
import {nlStage1EngineProfiles,nlStage1EnginePath} from "./nl-stage1-engine-seo.ts";
import {nlVanEngines} from "./nl-van-engines-seo.ts";
import {nlVanEnginePath,nlVanModelBySlug,nlVanModels} from "./nl-vans-seo.ts";
import type {NlReviewedMotorResult,NlReviewedMotorScope} from "../lib/nl-reviewed-motor-search.ts";
export type {NlReviewedMotorResult,NlReviewedMotorScope} from "../lib/nl-reviewed-motor-search.ts";

function scopesFor(apps:readonly {
 yearFrom:number;yearTo:number;registeredPowerKw?:number;
 displacementCc:number;requiredRdwType?:string
}[]):readonly NlReviewedMotorScope[]{
 return apps.map(a=>{
  if(!a.requiredRdwType||!a.registeredPowerKw||a.yearFrom>a.yearTo)
   throw Error("Motor finder needs exact reviewed RDW identity");
  return {from:a.yearFrom,to:a.yearTo,registeredKw:a.registeredPowerKw,cc:a.displacementCc,rdwType:a.requiredRdwType};
 });
}
const vanMakeAndModel=new Set(nlVanModels.map(m=>`${m.make.toLowerCase()}|${m.model.toLowerCase()}`));
const isKnownVanModel=(make:string,model:string)=>vanMakeAndModel.has(`${make.toLowerCase()}|${model.toLowerCase()}`);
export const nlReviewedMotorResults:readonly NlReviewedMotorResult[]=[
 ...nlStage1EngineProfiles.map(p=>({
  id:"auto:"+p.slug,href:nlStage1EnginePath(p.slug),title:p.headline,
  make:p.applications[0].make,model:p.applications[0].model,
  kind:isKnownVanModel(p.applications[0].make,p.applications[0].model)?"bedrijfswagen" as const:"personenauto" as const,
  fuel:p.applications[0].fuel as "Petrol"|"Diesel",
  scopes:scopesFor(p.applications)
 })),
 ...nlVanEngines.map(e=>{
  const model=nlVanModelBySlug.get(e.modelSlug);
  if(!model)throw Error("Orphan reviewed van engine "+e.slug);
  const fuel=e.applications[0].fuel;
  if(fuel!=="Diesel"&&fuel!=="CNG")throw Error("Unreviewed fuel for van search "+e.slug);
  return {id:"bus:"+e.slug,href:nlVanEnginePath(e.slug),title:e.title,
   make:model.make,model:model.model,kind:"bedrijfswagen" as const,fuel,
   scopes:scopesFor(e.applications)};
 })
];
if(nlReviewedMotorResults.length!==174||new Set(nlReviewedMotorResults.map(e=>e.href)).size!==174||
 new Set(nlReviewedMotorResults.map(e=>e.id)).size!==174)
 throw Error("Motor finder must only link 73 approved car and 101 van pages");
if(nlReviewedMotorResults.some(item=>!item.scopes.length))
 throw Error("Every search result must have a reviewed RDW cohort");
