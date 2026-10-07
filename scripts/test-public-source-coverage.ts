import assert from "node:assert/strict";
import {engineCatalog} from "../src/data/catalog.ts";
import {customerVehicle} from "../src/lib/customer-profile.ts";
import {getCatalogEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {getPublicVehicleSourceExamples} from "../src/lib/public-vehicle-source-examples.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import {reviewedPublicStage1Samples} from "../src/data/reviewed-public-stage1-samples.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";

let direct=0,examplesOnly=0,reviewOnly=0,exampleRows=0;
const sourceById=new Map(sourcedTuningProfiles.map(item=>[item.id,item]));
const additionalById=new Map(reviewedPublicStage1Samples.map(item=>[item.id,item]));
const seen=new Set<string>();
for(const vehicle of engineCatalog) {
 const customer=customerVehicle(vehicle);
 const stages=getCatalogEstimateProfile(customer).stages;
 assert.deepEqual(stages.map(stage=>stage.name),["Stage 1","Stage 2"],vehicle.id);
 const stage1=stages[0];
 const isDirect=stage1.powerHp!==undefined||stage1.powerRangeHp!==undefined;
 const examples=getPublicVehicleSourceExamples(vehicle);
 if(isDirect) direct++;
 else if(examples.length) examplesOnly++;
 else reviewOnly++;
 for(const ref of examples){
   exampleRows++;
   assert.ok(!isDirect || ref.sourceProfileId,vehicle.id);
   assert.ok(ref.yearFrom<=ref.yearTo && ref.yearTo<=Math.max(...vehicle.years));
   assert.ok(ref.yearFrom>=Math.min(...vehicle.years));
   assert.ok(ref.stockPowerHp===vehicle.stockPowerHp,vehicle.id+" stock power must exactly match");
   assert.ok(ref.stockTorqueNm===vehicle.stockTorqueNm,vehicle.id+" stock torque must exactly match");
   assert.ok(ref.stage1PowerRangeHp[0]>ref.stockPowerHp,vehicle.id+" source power gain");
   assert.ok(ref.stage1PowerRangeHp[1]>=ref.stage1PowerRangeHp[0]);
   assert.ok(ref.sourceUrls.length>=1 && ref.sourceUrls.every(url=>url.startsWith("https://")));
   const source=sourceById.get(ref.sourceProfileId);
   const reviewed=additionalById.get(ref.sourceProfileId);
   assert.ok(source || reviewed,vehicle.id+" source ID");
   if(source){
     assert.equal(source.stockTorqueNm,vehicle.stockTorqueNm);
     assert.equal(source.stockPowerHp,vehicle.stockPowerHp);
     assert.ok(ref.sourceUrls.every(url=>source.sourceUrls.includes(url)));
     assert.deepEqual(ref.stage1PowerRangeHp,[
       Math.min(...source.stage1.sourceValues.map(value=>value.powerHp)),
       Math.max(...source.stage1.sourceValues.map(value=>value.powerHp))
     ]);
   }else{
     assert.ok(reviewed && reviewed.publicVehicleId===vehicle.id);
     assert.equal(reviewed.stockPowerHp,vehicle.stockPowerHp);
     assert.equal(reviewed.stockTorqueNm,vehicle.stockTorqueNm);
     assert.ok(ref.sourceUrls.every(url=>reviewed.sourceUrls.includes(url)));
     assert.deepEqual(ref.stage1PowerRangeHp,reviewed.powerRangeHp);
     assert.deepEqual(ref.stage1TorqueRangeNm,reviewed.torqueRangeNm);
     assert.equal(ref.ownerReviewRequired,true);
   }
   const powerGain=formatEstimateGain({powerRangeHp:ref.stage1PowerRangeHp,torqueRangeNm:ref.stage1TorqueRangeNm},ref.stockPowerHp,ref.stockTorqueNm,"pl");
   assert.match(powerGain,/\+\d+/);
   assert.ok(!powerGain.includes("NaN") && !powerGain.includes("—"));
   seen.add(vehicle.id);
 }
 assert.ok(!customer.stages.some(stage=>stage.name==="Stage 3+"),vehicle.id+" stage3 absent");
}
assert.equal(engineCatalog.length,24);
assert.equal(direct,10,"baseline direct numeric customer Stage 1 coverage changed");
assert.equal(examplesOnly,10,"ten vetted example-supported public cards, including four additional observed applications");
assert.equal(reviewOnly,4,"four cards still require further source-specific review");
assert.equal(direct+examplesOnly+reviewOnly,24);
for(const id of [
 "bmw-1-series-f20-f21-118i","bmw-1-series-f20-f21-120d",
 "bmw-3-series-f30-f31-318d","bmw-3-series-f30-f31-330d",
 "volkswagen-golf-7-16-tdi","audi-a4-b9-20-tfsi"
]) assert.ok(seen.has(id),id+" dated published reference");

const f20=engineCatalog.find(v=>v.id==="bmw-1-series-f20-f21-118i")!;
const expected=getPublicVehicleSourceExamples(f20);
assert.ok(expected.length>0);
assert.deepEqual(getPublicVehicleSourceExamples({...f20,stockTorqueNm:999}),[],"same ID with different stock torque cannot use cache");
assert.deepEqual(getPublicVehicleSourceExamples({...f20,years:[2025]}),[],"same ID with different year cannot use cache");
assert.deepEqual(getPublicVehicleSourceExamples({...f20,fuel:"Diesel"}),[],"same ID with different fuel cannot use cache");
assert.deepEqual(getPublicVehicleSourceExamples({...f20,model:"5 Serie 520d"}),[],"same ID with different model cannot use cache");
const f20toF40={...f20,model:"1 Serie F40 118i",generation:"F40",years:[2021]};
assert.deepEqual(getPublicVehicleSourceExamples(f20toF40),[],"F20 cannot be promoted to F40 by matching horsepower");

const a4=engineCatalog.find(v=>v.id==="audi-a4-b9-20-tfsi")!;
assert.ok(getPublicVehicleSourceExamples(a4).every(row=>row.yearTo<=2017),
  "A4 B9 reference cannot pretend to cover 2018-2020");
const bmw320i=engineCatalog.find(v=>v.id==="bmw-3-series-g20-g21-320i")!;
const g20Refs=getPublicVehicleSourceExamples(bmw320i);
assert.ok(g20Refs.some(ref=>ref.sourceProfileId==="research-bmw-g20-320i-184-300"));
assert.ok(g20Refs.every(ref=>ref.stockTorqueNm===300),
  "184/270 or 184/290 source must not be represented as 184/300");
assert.ok(g20Refs.every(ref=>ref.yearTo<=2021),
  "G20 example cannot pretend to cover later engine/software years");
assert.equal(reviewedPublicStage1Samples.length,4);
for (const sample of reviewedPublicStage1Samples) {
  const vehicle=engineCatalog.find(v=>v.id===sample.publicVehicleId)!;
  assert.ok(vehicle,"Research sample public vehicle exists");
  assert.ok(vehicle.years.some(year=>year>=sample.yearFrom&&year<=sample.yearTo));
  assert.equal(vehicle.brand,sample.expectedMake);
  assert.equal(vehicle.model,sample.expectedModel);
  assert.equal(vehicle.generation,sample.expectedGeneration);
  assert.equal(vehicle.stockPowerHp,sample.stockPowerHp);
  assert.equal(vehicle.stockTorqueNm,sample.stockTorqueNm);
  assert.ok(sample.sourceUrls.every(url=>url.startsWith("https://")));
  assert.ok(sample.powerRangeHp[0]>sample.stockPowerHp && sample.torqueRangeNm[0]>sample.stockTorqueNm);
  assert.ok(sample.status==="owner-review-required");
  assert.ok(seen.has(sample.publicVehicleId),"Additional source sample visible");
}
assert.deepEqual(getPublicVehicleSourceExamples({...bmw320i,years:[2023,2024]}),[],
  "G20 source years cannot be extrapolated into 2023-2024");
console.log(JSON.stringify({result:"PASS",publicProfiles:24,directNumeric:direct,datedSourceExampleOnly:examplesOnly,reviewRequiredNoNumeric:reviewOnly,datedExampleRows:exampleRows,sourceDatasetSize:sourcedTuningProfiles.length,stage3Public:0}));
