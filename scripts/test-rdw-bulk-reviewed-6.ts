import assert from "node:assert/strict";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};
import {reviewedRdwBulkBatch6,reviewedRdwBulkBatch6Count} from "../src/data/reviewed-rdw-bulk-batch-6.ts";
import {resolveVerifiedRdwApplication} from "../src/data/verified-rdw-applications.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

assert.equal(reviewedRdwBulkBatch6Count,7,"Every batch4 reviewed application is registered");
assert.equal(new Set(reviewedRdwBulkBatch6.map(x=>x.id)).size,7);
let total=0, negative=0;
const counts:Record<string,number>={};
for(const app of reviewedRdwBulkBatch6){
 assert.equal(app.allowedRdwModels.length,1);
 assert.ok(app.requiredRdwType&&app.yearTo>=app.yearFrom);
 assert.ok(app.sources.length>=2&&app.sources.every(s=>s.url?.startsWith("https://")&&s.sourceType==="tuner"&&s.retrievalMethod==="page"));
 const test:EstimateMatchInput={make:app.make,model:app.allowedRdwModels[0],
  type:app.requiredRdwType,firstRegistrationYear:app.yearFrom,
  firstRegistrationDate:`${app.yearFrom}-05-17`,
  displacementCc:app.displacementCc,cylinders:app.cylinders,
  registeredPower:{value:app.registeredPowerKw,unit:"kW"},
  fuel:app.fuel==="Diesel"?"Diesel":"Benzine"};
 const match=resolveVerifiedRdwApplication(test);
 assert.equal(match?.profile?.id,app.id,`Registered original identity ${app.id}`);
 assert.equal(match?.profile?.stockPowerHp,Math.round(app.registeredPowerKw*1.359621617));
 if(app.make==="BMW")assert.ok(match?.profile?.model.startsWith("3 Series"),"BMW 320i must be presented as 3 Series, not 1 Series");
 assert.deepEqual(match?.profile?.stages[0].powerRangeHp,app.powerRangeHp);
 assert.deepEqual(match?.profile?.stages[0].torqueRangeNm,app.torqueRangeNm);
 assert.equal(match?.profile?.stages[0].quoteRequired,true);
 assert.equal(match?.profile?.verificationRequired,true);
 for(const stage of match.profile.stages.slice(1)){
  assert.equal(stage.powerHp,undefined);
  assert.equal(stage.torqueNm,undefined);
  assert.equal(stage.powerRangeHp,undefined);
  assert.equal(stage.torqueRangeNm,undefined);
 }
 for(let year=app.yearFrom;year<=app.yearTo;year++){
  const r=resolveVerifiedRdwApplication({...test,firstRegistrationYear:year,firstRegistrationDate:`${year}-05-17`});
  assert.equal(r?.profile?.id,app.id,`Year in range ${app.id}: ${year}`);
 }
 const bad:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]>=[
  ["year before",{firstRegistrationYear:app.yearFrom-1,firstRegistrationDate:`${app.yearFrom-1}-05-17`}],
  ["year after",{firstRegistrationYear:app.yearTo+1,firstRegistrationDate:`${app.yearTo+1}-05-17`}],
  ["no type",{type:undefined}],["wrong type",{type:"UNREVIEWED"}],
  ["wrong +1 kW",{registeredPower:{value:app.registeredPowerKw+1,unit:"kW"}}],
  ["wrong -1 kW",{registeredPower:{value:app.registeredPowerKw-1,unit:"kW"}}],
  ["no registered power",{registeredPower:undefined}],
  ["wrong displacement",{displacementCc:app.displacementCc+10}],
  ["wrong cylinders",{cylinders:app.cylinders===3?4:3}],
  ["wrong fuel",{fuel:app.fuel==="Diesel"?"Benzine":"Diesel"}],
  ["mixed fuel",{fuel:"Benzine / LPG"}],
  ["hybrid",{fuel:"Benzine / Elektriciteit"}],
  ["wrong make",{make:"NOT THE BRAND"}],
  ["wrong model",{model:"OTHER UNKNOWN MODEL"}],
  ["wrong stock torque",{stockTorqueNm:app.stockTorqueNm+30}]
 ];
 for(const [reason,patch] of bad){
  assert.notEqual(resolveVerifiedRdwApplication({...test,...patch})?.profile?.id,app.id,
   `${app.id}: incorrectly matched ${reason}`);
  negative++;
 }
 const rows=frozen.rows.filter(row=>
  row.vehicle.merk?.toLowerCase()===app.make.toLowerCase() &&
  row.vehicle.handelsbenaming?.toLowerCase()===app.allowedRdwModels[0].toLowerCase() &&
  row.vehicle.type?.toLowerCase()===app.requiredRdwType.toLowerCase() &&
  Number(row.vehicle.cilinderinhoud)===app.displacementCc &&
  Number(row.vehicle.aantal_cilinders)===app.cylinders &&
  Number(row.vehicle.datum_eerste_toelating_dt?.slice(0,4))>=app.yearFrom &&
  Number(row.vehicle.datum_eerste_toelating_dt?.slice(0,4))<=app.yearTo &&
  row.fuels.length===1 &&
  row.fuels[0].brandstof_omschrijving===(app.fuel==="Diesel"?"Diesel":"Benzine") &&
  Math.abs(Number(row.fuels[0].nettomaximumvermogen)-app.registeredPowerKw)<0.25);
 assert.ok(rows.length>0,`No frozen RDW positive observation for ${app.id}`);
 for(const row of rows){
  const r=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
  assert.equal(r.vehicle.engine.powerHp,app.stockPowerHp,`${app.id}: original RDW power`);
  assert.equal(r.tuningEstimate.profile?.id,app.id,`${app.id}: frozen observation must select exact reviewed engine`);
  assert.deepEqual(r.tuningEstimate.profile?.stages[0].powerRangeHp,app.powerRangeHp);
  assert.deepEqual(r.tuningEstimate.profile?.stages[0].torqueRangeNm,app.torqueRangeNm);
  total++;
 }
 counts[app.id]=rows.length;
}
assert.ok(total>=26,"Fifth batch must match all 26 exact frozen van observations");
console.log("RDW_BULK_6_PASS",JSON.stringify({approvedApplications:reviewedRdwBulkBatch6Count,
 frozenReviewedMatches:total,adversarialNegativeChecks:negative,
 perApplicationCount:counts,stage2AndStage3NumericWithheld:true,notFleetPrevalence:true}));
