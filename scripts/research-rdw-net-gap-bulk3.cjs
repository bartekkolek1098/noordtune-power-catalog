/* eslint-disable @typescript-eslint/no-require-imports */
// Research only: aggregate original RDW technical cohorts, no real plate/VIN.
// Match source candidates strictly enough to prioritize human review, but
// never turn this draft inventory into public numerical tuning applications.
const sample=require("../data/research/nl-top-groups-output-sample.json");
const profiles=require("../src/data/tuning-profiles/profiles.json");
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const {sourceMake,sourceModelFamily}=require("../src/lib/sourced-tuning-match.ts");
const normalize=(s)=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const brands=new Map();
for(const p of profiles){const key=sourceMake(p.brand);let list=brands.get(key);if(!list){list=[];brands.set(key,list);}list.push(p);}
const aggregated=new Map();
let processed=0;
for(const row of sample.rows){
 const v=row.vehicle,f=row.fuels;
 const fuel=f.length===1?f[0].brandstof_omschrijving:"mixed";
 const kw=f.length===1?Number(f[0].nettomaximumvermogen):0;
 const year=Number(v.datum_eerste_toelating_dt?.slice(0,4)||v.datum_eerste_toelating?.slice(0,4));
 const key=JSON.stringify([v.merk,v.handelsbenaming,v.type,v.cilinderinhoud,v.aantal_cilinders,fuel,kw]);
 let agg=aggregated.get(key); if(!agg){agg={make:v.merk,model:v.handelsbenaming,type:v.type||"",cc:Number(v.cilinderinhoud),cyl:Number(v.aantal_cilinders),fuel,kw,yearHist:{},sampleSize:0,sourceLinked:0};aggregated.set(key,agg);}
 agg.sampleSize++;agg.yearHist[year]=(agg.yearHist[year]||0)+1;
 if(kw>0&&["Benzine","Diesel"].includes(fuel)){
   const p=normalizeRdwVehicle(v,f,"QA0000").tuningEstimate.profile;
   const stage=p?.stages.find(s=>s.name==="Stage 1");
   if(stage&&(stage.powerHp||stage.powerRangeHp)&&p.sourceReferences?.some(s=>s.url?.startsWith("https://")))agg.sourceLinked++;
 }
 processed++;
}
const result=[];
for(const agg of aggregated.values()){
 const gap=agg.sampleSize-agg.sourceLinked;
 if(gap<2||!Number.isFinite(agg.cc)||agg.cc<=0||!agg.kw||agg.fuel==="mixed"||!["Benzine","Diesel"].includes(agg.fuel)||!agg.type)continue;
 const model=sourceModelFamily(sourceMake(agg.make),agg.model);
 const stockHp=Math.round(agg.kw*1.359621617);
 const yearList=Object.keys(agg.yearHist).map(Number);
 const firstYear=Math.min(...yearList),lastYear=Math.max(...yearList);
 const p=(brands.get(sourceMake(agg.make))||[]).filter(x=>{
  const pmod=sourceModelFamily(sourceMake(x.brand),x.modelFamily);
  const aliasMatch=[pmod,...(x.aliases||[]).map(a=>sourceModelFamily(sourceMake(x.brand),a))].some(m=>normalize(m)===normalize(model));
  return aliasMatch && Math.abs(stockHp-x.stockPowerHp)<=2&&
   (x.displacementPrecision==="exact"?Math.abs(agg.cc-x.displacementCc)<=2:Math.abs(agg.cc-x.displacementCc)<=50)&&
   (!x.cylinders||agg.cyl===x.cylinders)&&
   ((agg.fuel==="Benzine"?"Petrol":"Diesel")===x.fuel)&&
   x.yearFrom<=lastYear&&(x.yearTo??2026)>=firstYear&&
   !["hybrid","mild-hybrid"].includes(x.electrification);
 });
 const plausible=p.map(x=>({id:x.id,g:x.generation,years:[x.yearFrom,x.yearTo??2026],stock:[x.stockPowerHp,x.stockTorqueNm],stage:[x.stage1?.selectedPowerHp,x.stage1?.selectedTorqueNm],count:x.stage1SourceCount,providers:[...new Set((x.stage1.sourceValues||[]).map(s=>s.provider))],quality:x.stockSourceQuality,engine:x.engineMarketingName})).sort((a,b)=>b.count-a.count);
 result.push({n:agg.sampleSize,gap,source:agg.sourceLinked,make:agg.make,model:agg.model,type:agg.type,cc:agg.cc,cyl:agg.cyl,kw:agg.kw,years:agg.yearHist,providers:plausible.slice(0,7),matches:plausible.length});
}
result.sort((a,b)=>b.gap-a.gap||b.providers.filter(p=>p.count>1).length-a.providers.filter(p=>p.count>1).length||a.make.localeCompare(b.make));
console.log("FROZEN_COHORT_SCAN",JSON.stringify({rows:processed,uniqueTechnical:aggregated.size,unresolvedIdentityCohorts:result.length,unresolvedRows:result.reduce((a,b)=>a+b.gap,0),cohortsWithSourcedCandidates:result.filter(r=>r.matches>0).length,unresolvedRowsWithAnyCandidate:result.filter(r=>r.matches>0).reduce((a,b)=>a+b.gap,0)}));
for(const row of result.slice(0,130))console.log(JSON.stringify(row));
