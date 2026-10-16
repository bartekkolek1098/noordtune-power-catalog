/**
 * Twenty-one hand-authored, source-backed Dutch technical diesel van comparisons.
 * All original RDW factory kW and Stage 1 estimates are read exclusively from
 * existing approved van engine pages, without new tuning calculations/sources.
 */
import rawA from "./nl-van-comparison-batch-a.json" with {type:"json"};
import rawB from "./nl-van-comparison-batch-b.json" with {type:"json"};
import rawC from "./nl-van-comparison-batch-c.json" with {type:"json"};
import rawD from "./nl-van-comparison-batch-d.json" with {type:"json"};
import rawE from "./nl-van-comparison-batch-e.json" with {type:"json"};
import {nlVanEngineBySlug,type NlVanEngine} from "./nl-van-engines-seo.ts";
import {nlVanModelBySlug} from "./nl-vans-seo.ts";

type VanCompareSpec={
 slug:string;modelSlug:string;headline:string;intro:string;difference:string;
 checks:string;usage:string;faq:readonly (readonly [string,string])[];
 engineSlugs:readonly string[];
};
export type NlVanComparison=VanCompareSpec&{
 make:string;model:string;engines:readonly NlVanEngine[];
 auditedScopes:number;sourceUrls:number;
};
export const nlVanCompareIndexPath="/nl/bedrijfswagens/vergelijken";
export function nlVanComparePath(slug:string){return "/nl/bedrijfswagens/vergelijken/"+slug;}
const approvedSpecs=[...rawA.items,...rawB.items,...rawC.items,...rawD.items,...rawE.items] as unknown as readonly VanCompareSpec[];
const publishedSlugs=new Set<string>();
export const nlVanComparisons:readonly NlVanComparison[]=approvedSpecs.map(spec=>{
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(spec.slug)||publishedSlugs.has(spec.slug))
  throw Error("Duplicate or unreviewed van comparison slug "+spec.slug);
 publishedSlugs.add(spec.slug);
 const model=nlVanModelBySlug.get(spec.modelSlug);
 if(!model)throw Error("Comparison must reference approved van model "+spec.slug);
 if(spec.engineSlugs.length<3||new Set(spec.engineSlugs).size!==spec.engineSlugs.length)
  throw Error("Van model comparison must have >=3 distinct audited engines "+spec.slug);
 if(spec.intro.length<350||spec.difference.length<365||spec.checks.length<315||spec.usage.length<225)
  throw Error("Van comparison needs substantial unique technical editorial review "+spec.slug);
 if(spec.faq.length!==2||spec.faq.some(([q,a])=>q.length<40||a.length<185))
  throw Error("Each van comparison requires 2 original technically substantial FAQs "+spec.slug);
 const plain=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(!plain(spec.headline).includes(plain(model.make.split("-")[0]))||spec.headline.length<48||spec.headline.length>92)
  throw Error("Model comparison headline invalid "+spec.slug);
 const engines=spec.engineSlugs.map(slug=>{
  const engine=nlVanEngineBySlug.get(slug);
  if(!engine)throw Error("Cannot compare unpublished van motor: "+slug);
  if(engine.modelSlug!==spec.modelSlug)throw Error("Wrong make/model in comparison "+spec.slug+" "+slug);
  if(engine.applications.some(a=>a.fuel!=="Diesel"))
   throw Error("Do not silently include CNG/Electric in diesel comparison "+spec.slug);
  if(engine.applications.some(a=>!a.requiredRdwType||!a.registeredPowerKw||!a.allowedRdwModels?.length))
   throw Error("Motor comparison requires exact RDW scope "+slug);
  const hosts=new Set(engine.sources.map(s=>new URL(s.url??"").hostname.replace(/^www\./,"")));
  if(hosts.size<2)throw Error("Every comparison motor requires two independent tuner publishers "+slug);
  return engine;
 });
 const scopes=new Set(engines.flatMap(e=>e.applications.map(a=>a.id)));
 const sources=new Set(engines.flatMap(e=>e.sources.map(s=>s.url)));
 if(scopes.size<engines.length||sources.size<2*engines.length/3)
  throw Error("Comparison lacks independently reviewed identity or source coverage "+spec.slug);
 return {...spec,make:model.make,model:model.model,engines,auditedScopes:scopes.size,sourceUrls:sources.size};
});
if(nlVanComparisons.length!==21||publishedSlugs.size!==21||
 new Set(nlVanComparisons.map(c=>c.modelSlug)).size!==21)
 throw Error("Twenty-one individually hand-reviewed van comparisons required");
export const nlVanCompareBySlug=new Map(nlVanComparisons.map(x=>[x.slug,x]));
export const nlVanCompareByModelSlug=new Map(nlVanComparisons.map(x=>[x.modelSlug,x]));
export const nlVanCompareByEngineSlug=new Map(nlVanComparisons.flatMap(c=>c.engineSlugs.map(slug=>[slug,c] as const)));
export function nlVanCompareMetadata(c:NlVanComparison){
 return {title:c.headline,description:`${c.make} ${c.model}: vergelijk ${c.engines.length} gecontroleerde motoruitvoeringen, originele RDW-kW, bouwjaren, ECU, transmissie en bronvermelde Stage 1-resultaten bij NoordTune.`};
}
