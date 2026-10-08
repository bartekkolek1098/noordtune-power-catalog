/* eslint-disable @typescript-eslint/no-require-imports */
// Bounded frozen RDW technical-cohort candidate discovery. This script does not
// call RDW APIs and NEVER logs, persists, or carries individual registration IDs.
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const {sourceMake,sourceModelFamily}=require("../src/lib/sourced-tuning-match.ts");
const frozen=require("../data/research/nl-top-groups-output-sample.json");
const profiles=require("../src/data/tuning-profiles/profiles.json");
const models=(make,model)=>sourceModelFamily(sourceMake(make),model);
const compatible=(row,profile)=>{
 const v=row.vehicle,make=sourceMake(v.merk),model=models(v.merk,v.handelsbenaming);
 if(make!==sourceMake(profile.brand))return false;
 const src=[profile.modelFamily,...(profile.aliases||[])].map(m=>models(profile.brand,m));
 if(!src.some(m=>m===model || model.startsWith(m+" ")))return false;
 const cc=Number(v.cilinderinhoud),year=Number(v.datum_eerste_toelating?.slice(0,4)??v.datum_eerste_toelating_dt?.slice(0,4));
 if(!Number.isFinite(cc)||!Number.isInteger(year)||year<profile.yearFrom||year>(profile.yearTo??2026))return false;
 if(profile.displacementPrecision==="exact" ? Math.abs(cc-profile.displacementCc)>2 : Math.abs(cc-profile.displacementCc)>49)return false;
 if(profile.cylinders&&Number(v.aantal_cilinders)!==profile.cylinders)return false;
 const fuels=row.fuels.map(f=>f.brandstof_omschrijving);
 if(fuels.length!==1||(fuels[0]==="Benzine"?"Petrol":fuels[0]==="Diesel"?"Diesel":"unknown")!==profile.fuel)return false;
 const kw=Number(row.fuels[0].nettomaximumvermogen);
 if(!Number.isFinite(kw)||kw<=0||Math.abs(Math.round(kw*1.359621617)-profile.stockPowerHp)>1)return false;
 if(profile.electrification==="hybrid"||profile.electrification==="mild-hybrid")return false;
 return true;
};
const map=new Map();
for(const row of frozen.rows){
 const v=row.vehicle, f=row.fuels;
 const kw=f.length===1?Number(f[0].nettomaximumvermogen):0;
 const year=Number(v.datum_eerste_toelating?.slice(0,4)??v.datum_eerste_toelating_dt?.slice(0,4));
 const key=JSON.stringify([v.merk,v.handelsbenaming,v.type||"",v.cilinderinhoud,v.aantal_cilinders,f.map(x=>x.brandstof_omschrijving).join("/"),kw,year]);
 const entry=map.get(key)||{n:0,row};entry.n++;map.set(key,entry);
}
const cases=[];
for(const group of map.values()){
 const {row,n}=group;
 const {vehicle:v}=row,kw=Number(row.fuels?.[0]?.nettomaximumvermogen),year=Number(v.datum_eerste_toelating?.slice(0,4)??v.datum_eerste_toelating_dt?.slice(0,4));
 const p=profiles.filter(pro=>compatible(row,pro));
 const minSources=process.env.RDW_BULK_MIN_SOURCES==="1"?1:2;
 const multi=p.filter(pro=>pro.stage1SourceCount>=minSources&&
    (minSources===1||["multi-source","manufacturer"].includes(pro.stockSourceQuality))&&
    pro.stage1?.selectedPowerHp>0&&pro.stage1?.selectedTorqueNm>0);
 // Full legacy resolver is expensive on a 1,000+ identity scan. Assess it
 // only for evidence-rich technical variants where an improvement is plausible.
 if(multi.length===0)continue;
 const vprof=normalizeRdwVehicle(v,row.fuels,"QA0000").tuningEstimate.profile;
 const stage=vprof?.stages?.find(s=>s.name==="Stage 1");
 const src=Boolean(stage&&(stage.powerHp||stage.powerRangeHp)&&vprof.sourceReferences?.some(s=>s.url?.startsWith("https://")));
 cases.push({make:v.merk,model:v.handelsbenaming,type:v.type||"",cc:Number(v.cilinderinhoud),year,kw,count:n,
  hasSource:src,matchedAll:p.length,matchedMulti:multi.length,
  candidates:multi.map(x=>({
    profile:x.id,power:x.stockPowerHp,torque:x.stockTorqueNm,
    sourceGeneration:x.generation,first:x.yearFrom,last:x.yearTo,
    providerCount:x.stage1SourceCount,engine:x.engineMarketingName,
    stockQuality:x.stockSourceQuality,stage1:[x.stage1.selectedPowerHp,x.stage1.selectedTorqueNm],
    stage1ProviderRefs:[...new Set(x.stage1.sourceValues.map(s=>s.provider))],
    actualDisplacement:x.displacementCc,precision:x.displacementPrecision
  }))});
}
const counts={frozen:3000,technicalGroups:cases.length,
  missingSource:cases.filter(c=>!c.hasSource).reduce((n,c)=>n+c.count,0),
  withAnyCandidate:cases.filter(c=>!c.hasSource&&c.matchedAll>0).reduce((n,c)=>n+c.count,0),
  withMultiCandidate:cases.filter(c=>!c.hasSource&&c.matchedMulti>0).reduce((n,c)=>n+c.count,0),
  cleanMulti:cases.filter(c=>!c.hasSource&&c.matchedMulti===1).reduce((n,c)=>n+c.count,0)
};
const eligible=cases.filter(c=>!c.hasSource&&c.matchedMulti>0);
const agg=new Map();
for(const c of eligible){
 const k=JSON.stringify([c.make,c.model,c.type,c.cc,c.kw]);
 const a=agg.get(k)||{name:c.make+" "+c.model,cc:c.cc,kw:c.kw,type:c.type,
 n:0,years:[],profiles:new Map(),candidateCounts:[],providers:[]};
 a.n+=c.count;a.years.push(c.year);a.candidateCounts.push(c.matchedMulti);
 for(const p of c.candidates) {a.profiles.set(p.profile,p);a.providers.push(...p.stage1ProviderRefs);}
 agg.set(k,a);
}
const top=[...agg.values()].sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name));
console.log("BULK_CANDIDATE_SUMMARY",JSON.stringify(counts));
for(const c of top.slice(0,75)){
 const prof=[...c.profiles.values()];
 console.log(JSON.stringify({n:c.n,makeModel:c.name,type:c.type,cc:c.cc,kw:c.kw,
 years:[Math.min(...c.years),Math.max(...c.years)],profiles:prof.map(p=>({s:p.profile,g:p.sourceGeneration,p:p.power,t:p.torque,s1:p.stage1,count:p.providerCount,publishers:p.stage1ProviderRefs,
 cc:p.actualDisplacement,ccprecision:p.precision}))}));
}
