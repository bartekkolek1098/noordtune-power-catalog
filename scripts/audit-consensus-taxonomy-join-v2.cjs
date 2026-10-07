/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require("node:fs");
const consensus=require("../docs/audits/stage1-cross-provider-normalization-v2.json").clusters.filter(row=>row.status==="SUPPORTED_RANGE");
const taxonomy=require("C:/Users/barto/Desktop/noordtune-power-catalog-taxonomy-v2/src/data/catalog-taxonomy-v2.json").rows;

const norm=value=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function modelKey(brand,model){
  let b=norm(brand),m=norm(model).replace(/\b(series|serie|klasse|class)\b/g,"").replace(/\s+/g," ").trim();
  if(b==="mercedes benz"&&/^[abces]$/.test(m))return m;
  if(b==="bmw"&&/^\d$/.test(m))return m;
  if(m==="up")return "up!";
  if(m==="transporter multivan caravelle")return "transporter";
  return m;
}
function chassisTokens(value){
  const s=String(value??"").toUpperCase();
  const out=new Set();
  for(const m of s.matchAll(/\b(?:F|G|E|W|R|X|C)[0-9]{2,3}\b/g))out.add(m[0]);
  return out;
}
function romanGeneration(value){
  const s=String(value??"").toUpperCase();
  const matches=[...s.matchAll(/\b(VIII|VII|VI|IV|III|II|V|I)\b/g)].map(m=>m[1]);
  return new Set(matches);
}
function generationCompatible(cluster,row){
  const clusterCodes=new Set(cluster.identity.generations.flatMap(g=>[...chassisTokens(g)]));
  const rowCodes=chassisTokens(row.generation);
  if(clusterCodes.size&&rowCodes.size)return [...clusterCodes].some(x=>rowCodes.has(x));
  const clusterRoman=new Set(cluster.identity.generations.flatMap(g=>[...romanGeneration(g)]));
  const rowRoman=romanGeneration(row.generation);
  if(clusterRoman.size&&rowRoman.size){
    if([...clusterRoman].some(x=>rowRoman.has(x)))return true;
    return false;
  }
  return true;
}
const markerList=["ecoblue","puretech","bluehdi","tdi","tdci","dci","hdi","crdi","jtd","tsi","tfsi","ecoboost","tce","t gdi","skyactiv","gti","gtd","amg","cupra","nismo","biturbo","bi turbo","mhev","hybrid"];
function markers(value){
  const s=norm(value); return new Set(markerList.filter(m=>s.includes(m)));
}
function performanceTokens(value){
  return new Set(norm(value).split(" ").filter(token=>
    /^(?:[a-z]+[0-9]+[a-z]*|[0-9]+[a-z]+)$/.test(token) ||
    ["gti","gtd","amg","cupra","nismo","rs","jcW","m140i","m135i","m240i","m340i"].includes(token)
  ));
}
function engineCompatible(cluster,row){
  const votes=cluster.votes;
  const sourceEngines=votes.map(v=>v.engine).filter(Boolean);
  const sourceMarkers=new Set(sourceEngines.flatMap(e=>[...markers(e)]));
  const rowMarkers=markers(row.engine);
  const perf=["gti","gtd","amg","cupra","nismo","rs","biturbo","bi turbo","ecoblue","puretech","bluehdi"];
  for(const marker of perf){
    if(sourceMarkers.has(marker)&&!rowMarkers.has(marker))return false;
  }
  const sourcePerf=new Set(sourceEngines.flatMap(e=>[...performanceTokens(e)]));
  const rowPerf=performanceTokens(row.engine);
  if(sourcePerf.size&&rowPerf.size){
    const shared=[...sourcePerf].some(x=>rowPerf.has(x));
    if(!shared){
      const meaningful=[...sourcePerf].filter(x=>/[0-9]/.test(x));
      if(meaningful.length)return false;
    }
  }
  return true;
}
function yearOverlap(cluster,row){
  const c1=cluster.identity.yearFrom??1900,c2=cluster.identity.yearTo??2026;
  return Math.max(0,Math.min(c2,row.yearTo)-Math.max(c1,row.yearFrom)+1);
}
const mappings=[];
for(const cluster of consensus){
  const i=cluster.identity;
  const candidates=taxonomy.filter(row=>
    norm(row.brand)===norm(i.brand) &&
    modelKey(row.brand,row.model)===modelKey(i.brand,i.modelFamily) &&
    row.fuel===i.fuel &&
    row.stockPowerHp===i.stockPowerHp &&
    (!i.displacementCc||!row.displacementCc||Math.abs(row.displacementCc-i.displacementCc)<=80) &&
    yearOverlap(cluster,row)>=1 &&
    generationCompatible(cluster,row) &&
    engineCompatible(cluster,row)
  );
  mappings.push({
    consensusKey:cluster.baseKey,
    providers:cluster.providers,
    identity:cluster.identity,
    powerRangeHp:cluster.powerRangeHp,
    torqueRangeNm:cluster.torqueRangeNm,
    matches:candidates.length,
    taxonomy:candidates.map(row=>({id:row.id,brand:row.brand,model:row.model,generation:row.generation,years:[row.yearFrom,row.yearTo],engine:row.engine,fuel:row.fuel,displacementCc:row.displacementCc,stockPowerHp:row.stockPowerHp,sourceUrl:row.sourceUrl}))
  });
}
const rowsMatched=mappings.flatMap(m=>m.taxonomy.map(row=>({taxonomyId:row.id,consensusKey:m.consensusKey})));
const taxonomyCollision=new Map();
for(const row of rowsMatched){const arr=taxonomyCollision.get(row.taxonomyId)??[];arr.push(row.consensusKey);taxonomyCollision.set(row.taxonomyId,arr);}
const collisions=[...taxonomyCollision].filter(([,v])=>v.length>1);
const summary={
  createdAt:new Date().toISOString(),
  supportedConsensus:consensus.length,
  exactSingleMatch:mappings.filter(x=>x.matches===1).length,
  multipleMatches:mappings.filter(x=>x.matches>1).length,
  unmatched:mappings.filter(x=>x.matches===0).length,
  taxonomyRowsCovered:new Set(rowsMatched.map(x=>x.taxonomyId)).size,
  taxonomyCollisions:collisions.length,
  policy:"Audit-only join. Automatic production promotion requires one unambiguous taxonomy identity or an explicit reviewed split."
};
const out={...summary,mappings,collisions:collisions.map(([taxonomyId,keys])=>({taxonomyId,consensusKeys:keys}))};
const target="docs/audits/stage1-consensus-taxonomy-join-v2.json";
const meta={...out};delete meta.mappings;delete meta.collisions;
const head=JSON.stringify(meta,null,2).slice(0,-2);
fs.writeFileSync(target,head+',\n  "mappings": [\n'+mappings.map(x=>"    "+JSON.stringify(x)).join(",\n")+'\n  ],\n  "collisions": '+JSON.stringify(out.collisions,null,2)+'\n}\n');
console.log(JSON.stringify(summary,null,2));
