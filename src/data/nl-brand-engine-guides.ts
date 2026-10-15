/**
 * Dutch-only technical brand navigation. Every destination is derived from
 * independently reviewed *published* motor, comparison, or van model pages.
 * Do not turn a make in the raw RDW register into an indexable brand page.
 */
import rawA from "./nl-brand-engine-guides-a.json" with {type:"json"};
import rawB from "./nl-brand-engine-guides-b.json" with {type:"json"};
import rawC from "./nl-brand-engine-guides-c.json" with {type:"json"};
import {nlStage1EngineProfiles,type NlStage1EngineProfile} from "./nl-stage1-engine-seo.ts";
import {nlVanEngines,type NlVanEngine} from "./nl-van-engines-seo.ts";
import {nlVanModels,type VanModel} from "./nl-vans-seo.ts";
import {nlModelFamilyHubs,type NlModelFamilyHub} from "./nl-model-family-seo.ts";

type BrandGuideSpec={
 slug:string;
 make:string;
 headline:string;
 intro:string;
 difference:string;
 checks:string;
 faq:readonly (readonly [string,string])[];
};
export type NlBrandEngineGuide=BrandGuideSpec&{
 name:string;
 passenger:readonly NlStage1EngineProfile[];
 vanEngines:readonly NlVanEngine[];
 vanModels:readonly VanModel[];
 modelHubs:readonly NlModelFamilyHub[];
 sourceCount:number;
 reviewedApplicationCount:number;
};
const specs=[...rawA.items,...rawB.items,...rawC.items] as unknown as readonly BrandGuideSpec[];
export function nlBrandGuidePath(slug:string){return "/nl/merken/"+slug;}
export const nlBrandEngineIndexPath="/nl/merken";
export const nlBrandEngineGuides:readonly NlBrandEngineGuide[]=specs.map(spec=>{
 const ascii=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(!/^[a-z][a-z0-9-]+$/.test(spec.slug)||!spec.make||!ascii(spec.headline).includes(ascii(spec.make.split("-")[0])))
  throw Error("Invalid reviewed NL technical brand URL "+spec.slug);
 if(spec.intro.length<340||spec.difference.length<340||spec.checks.length<340)
  throw Error("Insufficient unique brand technical commentary "+spec.slug);
 if(spec.faq.length!==2||spec.faq.some(([q,a])=>q.length<36||a.length<150))
  throw Error("Missing source-specific brand FAQ "+spec.slug);
 const byMake=(make:string)=>make.toLowerCase()===spec.make.toLowerCase();
 const passenger=nlStage1EngineProfiles.filter(p=>byMake(p.applications[0].make));
 const vanModels=nlVanModels.filter(m=>byMake(m.make));
 const vanEngines=nlVanEngines.filter(e=>vanModels.some(m=>m.slug===e.modelSlug));
 const modelHubs=nlModelFamilyHubs.filter(m=>byMake(m.brand));
 if(passenger.length+vanEngines.length<2||!passenger.length&&!vanEngines.length)
  throw Error("Brand guide cannot be an empty make doorway: "+spec.slug);
 for(const hub of modelHubs){
  if(hub.engines.some(e=>!passenger.includes(e)))throw Error("Brand hub links another make "+spec.slug);
 }
 const applications=[...passenger.flatMap(p=>p.applications),...vanEngines.flatMap(e=>e.applications)];
 const sourceUrls=new Set([...passenger.flatMap(p=>p.sources),...vanEngines.flatMap(e=>e.sources)].map(s=>s.url).filter((url):url is string=>typeof url==="string"));
 const publishers=new Set([...sourceUrls].map(url=>new URL(url).hostname.replace(/^www\./,"")));
 if(publishers.size<2)throw Error("At least two independent source publishers required: "+spec.slug);
 const name=spec.make==="Citroen"?"Citroën":spec.make==="Seat"?"SEAT":spec.make==="Skoda"?"Škoda":spec.make;
 return {...spec,name,passenger,vanModels,vanEngines,modelHubs,
  sourceCount:sourceUrls.size,reviewedApplicationCount:new Set(applications.map(a=>a.id)).size};
});
if(nlBrandEngineGuides.length!==15||new Set(nlBrandEngineGuides.map(g=>g.slug)).size!==15||
 new Set(nlBrandEngineGuides.map(g=>g.make.toLowerCase())).size!==15)
 throw Error("Technical NL brand guides require explicit editorial approval");
export const nlBrandGuideBySlug=new Map(nlBrandEngineGuides.map(g=>[g.slug,g]));
export const nlBrandGuideByMake=new Map(nlBrandEngineGuides.map(g=>[g.make.toLowerCase(),g]));
export function getNlBrandGuide(make:string){return nlBrandGuideByMake.get(make.trim().toLowerCase());}
export function nlBrandGuideMetadata(guide:NlBrandEngineGuide){
 const title=guide.headline;
 const description=`Bekijk ${guide.name} motoren en generaties in NoordTune Power Catalog: ${guide.passenger.length} personenautomotoren, ${guide.vanEngines.length} bestelwagenmotoren, RDW-kW, ECU en onafhankelijke Stage 1-bronnen.`;
 return {title,description};
}
