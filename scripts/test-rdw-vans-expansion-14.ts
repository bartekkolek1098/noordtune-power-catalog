import assert from "node:assert/strict";
import fs from "node:fs";
import snapshot from "../data/research/nl-vans-expansion-rdw-cohorts.json" with {type:"json"};
import {reviewedRdwBulkBatch14,reviewedRdwBulkBatch14Count} from "../src/data/reviewed-rdw-bulk-batch-14.ts";
import {verifiedRdwApplications,resolveVerifiedRdwApplication} from "../src/data/verified-rdw-applications.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

/** A fixed, nonrandom technical sample; it is NOT Netherlands fleet coverage. */
assert.equal(reviewedRdwBulkBatch14Count,13);
assert.equal(snapshot.groups.length,24);
const added=new Set(reviewedRdwBulkBatch14.map(x=>x.id));
const previous=verifiedRdwApplications.filter(x=>!added.has(x.id));
function match(make:string,model:string,type:string,cc:number,cylinders:number,year:number,kw:number,fuel:string):EstimateMatchInput{
 return {make,model,type,displacementCc:cc,cylinders,
  firstRegistrationYear:year,firstRegistrationDate:year+"-06-15",
  registeredPower:{value:kw,unit:"kW"},fuel};
}
function sourceLinked(r:ReturnType<typeof resolveVerifiedRdwApplication>){
 const p=r?.profile,st=p?.stages?.find(x=>x.name==="Stage 1");
 return Boolean(p&&st?.powerRangeHp?.[1]&&st.powerRangeHp[1]>p.stockPowerHp
  &&p.sourceReferences?.length>=2);
}
let checked=0,before=0,after=0;
const found=new Map<string,number>();
for(const group of snapshot.groups){
 assert.ok(!("kenteken" in group)&&!("vin" in group));
 assert.equal(group.verifiedSingleFuelRows,group.outputs.reduce((n,x)=>n+x.observed,0));
 for(const row of group.outputs){
  checked+=row.observed;
  const data=match(group.make,group.model,group.type,group.cc,group.cylinders,group.year,row.kw,row.fuel);
  const old=resolveVerifiedRdwApplication(data,previous),now=resolveVerifiedRdwApplication(data);
  if(sourceLinked(old))before+=row.observed;
  if(sourceLinked(now))after+=row.observed;
  if(now?.profile?.id&&added.has(now.profile.id)){
   found.set(now.profile.id,(found.get(now.profile.id)||0)+row.observed);
  }
 }
}
assert.equal(checked,1054);
assert.equal(found.size,13,"All reviewed applications need an independent RDW technical observation");
let negatives=0;
for(const app of reviewedRdwBulkBatch14){
 const t=match(app.make,app.allowedRdwModels[0],app.requiredRdwType,
  app.displacementCc,app.cylinders,app.yearFrom,app.registeredPowerKw,app.fuel);
 assert.ok(verifiedRdwApplications.some(x=>x.id===app.id));
 assert.equal(resolveVerifiedRdwApplication(t)?.profile?.id,app.id);
 const p=resolveVerifiedRdwApplication(t)?.profile;
 assert.deepEqual(p?.stages?.[0].powerRangeHp,app.powerRangeHp);
 assert.deepEqual(p?.stages?.[0].torqueRangeNm,app.torqueRangeNm);
 assert.equal(p?.stages?.[0].quoteRequired,true);
 assert.ok(app.sources.length>=2);
 assert.ok(new Set(app.sources.map(s=>new URL(s.url??"").hostname)).size>=2);
 for(const stage of p?.stages.slice(1)??[]){
  assert.equal(stage.powerHp,undefined);
  assert.equal(stage.torqueNm,undefined);
  assert.equal(stage.powerRangeHp,undefined);
  assert.equal(stage.torqueRangeNm,undefined);
 }
 const bad:Partial<EstimateMatchInput>[]=[
  {firstRegistrationYear:app.yearFrom-1,firstRegistrationDate:(app.yearFrom-1)+"-06-15"},
  {firstRegistrationYear:app.yearTo+1,firstRegistrationDate:(app.yearTo+1)+"-06-15"},
  {type:undefined},{type:"WRONG TYPE"},
  {registeredPower:{value:app.registeredPowerKw+1,unit:"kW"}},
  {registeredPower:{value:app.registeredPowerKw-1,unit:"kW"}},
  {registeredPower:undefined},{displacementCc:app.displacementCc+10},
  {cylinders:3},{fuel:"Benzine"},{fuel:"CNG"},
  {fuel:"Benzine / Elektriciteit"},{make:"NOT TOYOTA OR PEUGEOT"},
  {model:"UNKNOWN MODEL"},{stockTorqueNm:app.stockTorqueNm+40}
 ];
 for(const patch of bad){
  assert.notEqual(resolveVerifiedRdwApplication({...t,...patch})?.profile?.id,app.id,
   app.id+" incorrect technical identity match "+JSON.stringify(patch));
  negatives++;
 }
}
assert.equal(negatives,195);
const result={method:snapshot.method,nonRepresentative:true,
 referenceDate:"2026-10-10",frozenObservations:checked,
 groups:snapshot.groups.length,priorSourceLinked:before,currentSourceLinked:after,
 netNewSourceLinked:after-before,reviewedApplications:13,negativeChecks:negatives,
 linkedRowsByApplication:Object.fromEntries([...found].sort((a,b)=>a[0].localeCompare(b[0]))),
 olderFrozenRDWBenchmark:"1,854/3,000 (unchanged; different denominator)",
 unknown:["Proace 2.0 145 106kW 2022-2024","Boxer 2184cc 2024+"],plateNumbersStored:false};
assert.ok(result.netNewSourceLinked>0);
if(process.argv.includes("--write")){
 fs.writeFileSync("docs/nl-vans-expansion-rdw-batch14.json",JSON.stringify(result,null,2)+"\n");
}
console.log("RDW_VANS_EXPANSION_14_PASS",JSON.stringify(result));
