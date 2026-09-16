import {readFileSync, writeFileSync, existsSync} from "node:fs";
import {vehicleDatabase} from "../src/data/catalog.ts";
import {nominalEngineDisplacements} from "../src/data/catalog-matching.ts";
import {sourcedTuningProfiles, tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";
import {sourceMake, sourceModelFamily} from "../src/lib/sourced-tuning-match.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

type Layer = "A"|"B"|"C"|"D"|"E";
type Group = {id:string; make:string; model:string; displacementCc:number|null; cylinders:number|null; vehicleClass:string; yearBandFrom:number|null; yearBandTo:number|null; vehicles:number; frequencyRank:number};
type Variant = {origin:"source-profile"|"canonical-hypothesis"|"live-rdw"; fuel:string; stockPowerHp:number; yearFrom:number; yearTo:number; profileId?:string; engine?:string; registeredPowerKw?:number; type?:string; variant?:string; execution?:string};
const file="data/research/nl-technical-priority.json";
const fleet=JSON.parse(readFileSync("data/research/nl-fleet-model-priority.json","utf8")) as {groups:Group[];queries:unknown;population:{vehicles:number}};
const previous=existsSync(file)&&!process.argv.includes("--rerank")?JSON.parse(readFileSync(file,"utf8")):undefined;
const oldRows=new Map<string,{priorityRank:number;score:number;scoreFactors:unknown;baselineLayer:Layer}>(previous?.groups.map((row:{groupId:string})=>[row.groupId,row])??[]);
const live: {groupId:string;vehicle:Record<string,string>;fuels:Record<string,string>[]}[]=existsSync("data/research/nl-rdw-live-sample.json")?JSON.parse(readFileSync("data/research/nl-rdw-live-sample.json","utf8")).rows:[];
const family=(make:string,model:string)=>sourceModelFamily(sourceMake(make),model);
const overlap=(a:number,b:number,c:number,d:number)=>Math.max(a,c)<=Math.min(b,d);
const modelFits=(make:string,left:string,right:string)=>{
  const a=family(make,left),b=family(make,right);
  if(a===b)return true;
  // Keep Transit siblings and shared-platform vans distinct.
  if(/\b(?:transit|tourneo)\b/.test(a+b)) return a.replace(/\s+(?:\d[.,]\d|tdci|ecoblue).*$/,"")===b.replace(/\s+(?:\d[.,]\d|tdci|ecoblue).*$/,"");
  return a.startsWith(b+" ")||b.startsWith(a+" ");
};
const canonicalByMake=new Map<string,typeof vehicleDatabase>();
const canonical=new Map<string,{make:string;model:string;cc:number;variant:Variant}>();
for(const v of vehicleDatabase){
  const make=sourceMake(v.brand),list=canonicalByMake.get(make)??[];list.push(v);canonicalByMake.set(make,list);
  if(!["Petrol","Diesel"].includes(v.fuel))continue;
  const cc=nominalEngineDisplacements(v.engine),modelCc=nominalEngineDisplacements(v.model);
  if(cc.length!==1||(modelCc.length===1&&Math.abs(modelCc[0]-cc[0])>49))continue;
  if(v.fuel==="Petrol"&&/\b(?:TDI|TDCi|CDI|dCi|HDi|CRDi|MultiJet)\b/i.test(v.model))continue;
  if(v.fuel==="Diesel"&&/\b(?:TSI|TFSI|EcoBoost|T-GDI|GTI)\b/i.test(v.model))continue;
  if(/Golf GTI 3\.0 TDI|Vito AMG|X3 125d|Z4 M340i|Clio RS 2\.0 dCi|Tucson N/.test(v.model))continue;
  const key=JSON.stringify([make,v.model,v.engine,v.fuel,v.stockPowerHp]);
  const years=v.years.filter(Number.isInteger);if(!years.length)continue;
  const entry=canonical.get(key)??{make,model:v.model,cc:cc[0],variant:{origin:"canonical-hypothesis" as const,fuel:v.fuel,stockPowerHp:v.stockPowerHp,yearFrom:Math.min(...years),yearTo:Math.max(...years),engine:v.engine}};
  entry.variant.yearFrom=Math.min(entry.variant.yearFrom,...years);entry.variant.yearTo=Math.max(entry.variant.yearTo,...years);canonical.set(key,entry);
}
const canon=[...canonical.values()];
const rows=fleet.groups.map(group=>{
  const make=sourceMake(group.make),from=group.yearBandFrom,to=group.yearBandTo,cc=group.displacementCc;
  const candidates:Variant[]=[];
  if(from&&to&&cc){
    for(const p of sourcedTuningProfiles)if(sourceMake(p.brand)===make&&modelFits(make,group.model,p.modelFamily)
      &&Math.abs(cc-p.displacementCc)<=(p.displacementPrecision==="exact"?2:49)&&overlap(from,to,p.yearFrom,p.yearTo??2026)
      &&(!p.cylinders||!group.cylinders||p.cylinders===group.cylinders)) candidates.push({origin:"source-profile",fuel:p.fuel,stockPowerHp:p.stockPowerHp,
        yearFrom:p.yearFrom,yearTo:p.yearTo??2026,profileId:p.id,engine:p.engineMarketingName});
    for(const sample of live.filter(row=>row.groupId===group.id)){
      const powerRows=sample.fuels.map(row=>Number(row.nettomaximumvermogen)).filter(n=>n>0);
      const kw=powerRows.length===1?powerRows[0]:undefined;
      const year=Number(sample.vehicle.datum_eerste_toelating?.slice(0,4));
      candidates.push({origin:"live-rdw",fuel:sample.fuels.map(row=>row.brandstof_omschrijving).join(" / "),stockPowerHp:kw?Math.round(kw*1.359621617):0,
        registeredPowerKw:kw,yearFrom:year,yearTo:year,type:sample.vehicle.type,variant:sample.vehicle.variant,execution:sample.vehicle.uitvoering});
    }
  }
  const hints=from&&to&&cc?canon.filter(c=>c.make===make&&modelFits(make,group.model,c.model)&&Math.abs(cc-c.cc)<=49&&overlap(from,to,c.variant.yearFrom,c.variant.yearTo)):[];
  // Unvalidated generated Caddy 300 PS / similar cross-products must not count
  // against measured or sourced variants. Keep them as research hints only.
  if(!candidates.length)candidates.push(...hints.map(row=>row.variant));
  // Generated year copies never affect the number of stock-output hypotheses or score.
  const distinct=new Map<string,Variant>();
  for(const candidate of candidates){const key=JSON.stringify([candidate.fuel,candidate.stockPowerHp,candidate.yearFrom,candidate.yearTo]);
    if(!distinct.has(key)||candidate.origin==="live-rdw")distinct.set(key,candidate);}
  const variants=[...distinct.values()].map(variant=>{
    const year=Math.floor((Math.max(variant.yearFrom,from??variant.yearFrom)+Math.min(variant.yearTo,to??variant.yearTo))/2);
    const input:EstimateMatchInput={make:group.make,model:group.model,fuel:variant.fuel,displacementCc:cc,powerHp:variant.stockPowerHp,
      firstRegistrationYear:year,cylinders:group.cylinders,type:variant.type,variant:variant.variant,execution:variant.execution,
      ...(variant.registeredPowerKw?{registeredPower:{value:variant.registeredPowerKw,unit:"kW" as const}}:{})};
    const result=resolveRdwTuningEstimate(input,{canonicalVehicles:canonicalByMake.get(make)??[]});
    return {...variant,scenarioYear:year,layer:(result.coverageClass??"E") as Layer,selectedProfileId:result.profile?.id,reasons:result.reasonCodes};
  });
  const layer=(variants.length?variants.map(v=>v.layer).sort().at(-1):"E") as Layer;
  const generic=variants.some(v=>v.layer==="D"),missing=!variants.some(v=>v.layer==="A"||v.layer==="B"),single=variants.some(v=>v.layer==="B");
  const ambiguous=variants.some(v=>v.reasons.some(reason=>/MULTIPLE|AMBIGU|CONFLICT/.test(reason)));
  const van=group.vehicleClass==="Bedrijfsauto";
  const workshop=van||candidates.some(v=>v.fuel==="Diesel"||/TSI|TFSI|T.GDI|TCe|DIG.T|EcoBoost|BoosterJet|turbo/i.test(v.engine??""));
  const scoreFactors={frequency:Math.log10(1+group.vehicles)*20,generic:generic?20:0,missingSource:missing?20:0,singleSource:single?10:0,
    van:van?12:0,workshop:workshop?8:0,ambiguity:ambiguous?8:0};
  const prior=oldRows.get(group.id);
  return {groupId:group.id,make:group.make,model:group.model,displacementCc:cc,vehicleClass:group.vehicleClass,
    yearBandFrom:from,yearBandTo:to,exactRdwVehicles:group.vehicles,frequencyRank:group.frequencyRank,
    priorityRank:prior?.priorityRank??0,score:prior?.score??Number(Object.values(scoreFactors).reduce((sum,n)=>sum+n,0).toFixed(3)),
    scoreFactors:prior?.scoreFactors??scoreFactors,baselineLayer:prior?.baselineLayer??layer,layer,
    variantSetIncomplete:true,variants,knownVariantScenarios:variants.length,unvalidatedCanonicalHints:hints.length,
    scenarioBasis:candidates.some(row=>row.origin!=="canonical-hypothesis")?"published-or-live-variants":"unvalidated-canonical-hypotheses-only",
    limitations:variants.length?['Fuel/power scenarios are derived from provider facts or explicitly unvalidated canonical hypotheses, not full-fleet fuel/power counts.','Group class is the least-covered known scenario; unknown variants remain unmeasured.']:['No supported fuel/power scenario is established; retain this exact group as unresolved.']};
});
rows.sort((a,b)=>b.score-a.score||b.exactRdwVehicles-a.exactRdwVehicles||a.groupId.localeCompare(b.groupId));
rows.forEach((row,index)=>{row.priorityRank=index+1;});
const counts=()=>({A:0,B:0,C:0,D:0,E:0});
const coverage=[50,100,250,500,1000].map(limit=>{
  const subset=rows.slice(0,limit),identities=counts(),weighted=counts(),before=counts();
  for(const row of subset){identities[row.layer]++;weighted[row.layer]+=row.exactRdwVehicles;before[row.baselineLayer]++;}
  const denominator=subset.reduce((sum,row)=>sum+row.exactRdwVehicles,0);
  return {top:limit,identities,before,identitySourcedPercent:100*(identities.A+identities.B)/subset.length,
    conditionalWeightedModelDisplacementReach:weighted,exactGroupVehicleDenominator:denominator,
    conditionalWeightedSourcedPercent:100*(weighted.A+weighted.B)/denominator,
    exactTunedVehicleCoverage:null,reason:'Exact group counts weight derived scenario classes. Variant shares and unknown variants are not measured; this is potential model/displacement reach, not a count of tunable or source-covered individual vehicles.'};
});
const result={schemaVersion:1,kind:"derived-technical-research-priority",datasetFingerprint:tuningDatasetFingerprint,
  rankingBaseline:previous?.rankingBaseline??"d92bcd179813d1587e82e7f3a12ee5f1914648df",
  scoreFormula:"20*log10(1+exact RDW group count) +20 generic +20 no sourced +10 single-source +12 light van +8 diesel/turbo/workshop +8 ambiguity. Binary factors; no canonical row/year-copy multiplier.",
  priorityPolicy:"Baseline scores remain frozen for before/after comparison. --rerank explicitly starts a new priority snapshot.",
  coverageMethod:"A/B/C/D/E is the least-covered evaluated distinct fuel/stock-output/year-scope scenario for each exact RDW group. Published and live variants are used where available. Unvalidated canonical hypotheses are retained as hints and only evaluated when no published/live variant exists; their scenarioBasis is explicit. Use actual RDW model/cc/cylinders and a representative overlapping year; never inject provider generation or engine code into RDW model text. Live sample type/variant/execution are kept. Scenarios and counts are distinct, and unobserved variants prevent claiming exact technical fleet coverage.",
  exactFleetVehicles:fleet.population.vehicles,aggregateGroups:rows.length,canonicalHypotheses:canon.length,coverage,groups:rows};
const {groups:groupRows,...metadata}=result;
writeFileSync(file,JSON.stringify(metadata,null,2).slice(0,-2)+',\n  "groups": [\n'+groupRows.map(row=>'    '+JSON.stringify(row)).join(',\n')+'\n  ]\n}\n');
console.log(JSON.stringify({groups:rows.length,coverage:coverage.map(row=>({top:row.top,identities:row.identities,sourcedPercent:row.identitySourcedPercent,conditionalWeightedPercent:row.conditionalWeightedSourcedPercent}))},null,2));
