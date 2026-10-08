/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require("node:fs");

const observations=require("../docs/audits/competitor-stage-observations.json").rows.filter(row=>row.stage==="Stage 1");

const norm=value=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const canonicalBrand=value=>norm(value).replace(/^mercedes benz$/,"mercedes benz");
function canonicalModel(brand,model){
  let s=norm(model)
    .replace(/\b(series|serie|klasse|class)\b/g,"")
    .replace(/\s+/g," ").trim()
    .replace(/^up$/,"up!");
  if(canonicalBrand(brand)==="mercedes benz" && /^[abces]$/.test(s)) return s;
  if(canonicalBrand(brand)==="bmw" && /^\d$/.test(s)) return s;
  if(s==="transporter multivan caravelle") return "transporter";
  return s;
}
function chassisTokens(value){
  const s=String(value??"").toUpperCase();
  const out=new Set();
  for(const m of s.matchAll(/\b(?:F|G|E|W|X|C|R|S|V|8)[A-Z0-9]{1,4}\b/g)) out.add(m[0]);
  for(const m of s.matchAll(/\bMK\s*([1-9][0-9]?)\b/g)) out.add("MK"+m[1]);
  return out;
}
const overlap=(a,b)=>{
  const a1=a.yearFrom??1900,a2=a.yearTo??2026,b1=b.yearFrom??1900,b2=b.yearTo??2026;
  return Math.max(0,Math.min(a2,b2)-Math.max(a1,b1)+1);
};
const shared=(a,b)=>[...a].some(x=>b.has(x));
function generationCompatible(a,b){
  const ac=chassisTokens(a.generation),bc=chassisTokens(b.generation);
  if(ac.size&&bc.size&&!shared(ac,bc)) return false;
  return overlap(a,b)>=2 || (overlap(a,b)>=1 && (ac.size||bc.size));
}
const engineMarkers=[
  "gti","gtd","amg","nismo","cupra","rs","biturbo","bi turbo","ecoblue","tdi","tdci","dci","bluehdi","hdi","crdi",
  "tsi","tfsi","ecoboost","tce","t gdi","puretech","skyactiv","jtd","turbo d","d4d","multijet","gte","hybrid"
];
function markerSet(row){
  const s=norm(row.engineMarketingName);
  return new Set(engineMarkers.filter(marker=>s.includes(marker)));
}
function engineCompatible(a,b){
  const am=markerSet(a),bm=markerSet(b);
  const performance=["gti","gtd","amg","nismo","cupra","rs","biturbo","bi turbo","ecoblue"];
  for(const marker of performance){
    if(am.has(marker)!==bm.has(marker)) return false;
  }
  const dieselA=a.fuel==="Diesel",dieselB=b.fuel==="Diesel";
  if(dieselA!==dieselB)return false;
  return true;
}
function baseKey(row){
  return [canonicalBrand(row.brand),canonicalModel(row.brand,row.modelFamily),row.fuel??"?",Math.round((row.displacementCc??0)/50)*50,row.stockPowerHp].join("|");
}
const groups=new Map();
for(const row of observations){
  if(!row.brand||!row.modelFamily||!row.stockPowerHp)continue;
  const key=baseKey(row);
  const list=groups.get(key)??[];list.push(row);groups.set(key,list);
}

function stockTorqueCompatible(a,b){
  if(!Number.isFinite(a.stockTorqueNm)||!Number.isFinite(b.stockTorqueNm))return true;
  const delta=Math.abs(a.stockTorqueNm-b.stockTorqueNm);
  const baseline=Math.max(1,(a.stockTorqueNm+b.stockTorqueNm)/2);
  return delta<=Math.max(10,baseline*0.03);
}
function compatible(a,b){
  if(Math.abs((a.displacementCc??0)-(b.displacementCc??0))>80)return false;
  if(!generationCompatible(a,b))return false;
  if(!engineCompatible(a,b))return false;
  if(!stockTorqueCompatible(a,b))return false;
  return true;
}
function components(rows){
  const ordered=[...rows].sort((a,b)=>(a.yearFrom??1900)-(b.yearFrom??1900)||(a.yearTo??2026)-(b.yearTo??2026));
  const groups=[];
  for(const row of ordered){
    const target=groups.find(group=>group.every(existing=>compatible(existing,row)));
    if(target)target.push(row);
    else groups.push([row]);
  }
  return groups;
}
const median=values=>{const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;};
const clusters=[];
for(const [base,rows] of groups){
  for(const cluster of components(rows)){
    const byProvider=new Map();
    for(const row of cluster){
      const existing=byProvider.get(row.provider);
      if(!existing||row.retrievedAt>existing.retrievedAt)byProvider.set(row.provider,row);
    }
    const votes=[...byProvider.values()];
    const powers=votes.map(v=>v.tunedPowerHp).filter(Number.isFinite);
    const torques=votes.map(v=>v.tunedTorqueNm).filter(Number.isFinite);
    const powerSpread=powers.length>1?(Math.max(...powers)-Math.min(...powers))/median(powers):0;
    const torqueSpread=torques.length>1?(Math.max(...torques)-Math.min(...torques))/median(torques):0;
    const yearFrom=Math.max(...votes.map(v=>v.yearFrom??1900));
    const yearTo=Math.min(...votes.map(v=>v.yearTo??2026));
    const stockTorques=[...new Set(votes.map(v=>v.stockTorqueNm).filter(Number.isFinite))];
    const validScope=yearFrom<=yearTo;
    const status=votes.length>=2 && validScope && powerSpread<=0.06 && torqueSpread<=0.10
      ? "SUPPORTED_RANGE"
      : votes.length>=2 ? "CONFLICT_REVIEW" : "SINGLE_SOURCE_CONDITIONAL";
    clusters.push({
      baseKey:base,
      status,
      providers:[...byProvider.keys()].sort(),
      identity:{
        brand:votes[0]?.brand,modelFamily:votes[0]?.modelFamily,
        generations:[...new Set(votes.map(v=>v.generation).filter(Boolean))],
        yearFrom,
        yearTo,
        fuel:votes[0]?.fuel,displacementCc:votes[0]?.displacementCc,
        stockPowerHp:votes[0]?.stockPowerHp,
        stockTorqueNm:stockTorques
      },
      powerRangeHp:powers.length?[Math.min(...powers),Math.max(...powers)]:undefined,
      torqueRangeNm:torques.length?[Math.min(...torques),Math.max(...torques)]:undefined,
      powerSpreadPct:Number((powerSpread*100).toFixed(2)),
      torqueSpreadPct:Number((torqueSpread*100).toFixed(2)),
      votes:votes.map(v=>({provider:v.provider,sourceId:v.sourceId,url:v.url,generation:v.generation,years:[v.yearFrom,v.yearTo],engine:v.engineMarketingName,stockTorqueNm:v.stockTorqueNm,tunedPowerHp:v.tunedPowerHp,tunedTorqueNm:v.tunedTorqueNm}))
    });
  }
}
clusters.sort((a,b)=>a.baseKey.localeCompare(b.baseKey)||b.providers.length-a.providers.length);
const summary={
  createdAt:new Date().toISOString(),
  observations:observations.length,
  clusters:clusters.length,
  multiSource:clusters.filter(c=>c.providers.length>=2).length,
  supportedRange:clusters.filter(c=>c.status==="SUPPORTED_RANGE").length,
  conflicts:clusters.filter(c=>c.status==="CONFLICT_REVIEW").length,
  singleSource:clusters.filter(c=>c.status==="SINGLE_SOURCE_CONDITIONAL").length,
  note:"Cross-provider normalization audit only. No customer value is promoted automatically."
};
const out={...summary,clusters};
const target="docs/audits/stage1-cross-provider-normalization-v2.json";
const meta={...out};delete meta.clusters;
const head=JSON.stringify(meta,null,2).slice(0,-2);
fs.writeFileSync(target,head+',\n  "clusters": [\n'+clusters.map(x=>"    "+JSON.stringify(x)).join(",\n")+'\n  ]\n}\n');
console.log(JSON.stringify(summary,null,2));
