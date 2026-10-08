import assert from "node:assert/strict";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};
import {reviewedRdwBulkBatch3 as reviewedBulkRdwApplications,reviewedRdwBulkBatch3Count as reviewedBulkRdwApplicationCount} from "../src/data/reviewed-rdw-bulk-batch-3.ts";
import {resolveVerifiedRdwApplication} from "../src/data/verified-rdw-applications.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

assert.equal(reviewedBulkRdwApplicationCount,15,"Independent bulk manifest exact count");
assert.equal(new Set(reviewedBulkRdwApplications.map(a=>a.id)).size,15);
const positives:Record<string,number>={};
let matches=0,negative=0;
const safeStock=(kw:number)=>Math.round(kw*1.359621617);
for(const app of reviewedBulkRdwApplications){
  assert.ok(app.allowedRdwModels.length===1);
  assert.ok(app.requiredRdwType);
  assert.ok(app.yearFrom<=app.yearTo);
  assert.ok(app.sources.length>=2);
  assert.ok(app.sources.every(s=>s.url?.startsWith("https://")&&s.sourceType==="tuner"&&s.retrievalMethod==="page"));
  const test:EstimateMatchInput={
    make:app.make,model:app.allowedRdwModels[0],type:app.requiredRdwType,
    firstRegistrationYear:app.yearFrom,firstRegistrationDate:`${app.yearFrom}-05-17`,
    displacementCc:app.displacementCc,cylinders:app.cylinders,fuel:app.fuel==="Diesel"?"Diesel":"Benzine",
    registeredPower:{value:app.registeredPowerKw,unit:"kW"}
  };
  const proof=resolveVerifiedRdwApplication(test);
  assert.equal(proof?.profile?.id,app.id,"Exact RDW original and approved source scope must match");
  assert.equal(proof.coverageClass,"B");
  assert.equal(proof.profile?.stockPowerHp,safeStock(app.registeredPowerKw));
  assert.equal(proof.profile?.stockTorqueNm,app.stockTorqueNm);
  assert.deepEqual(proof.profile?.stages[0].powerRangeHp,app.powerRangeHp);
  assert.deepEqual(proof.profile?.stages[0].torqueRangeNm,app.torqueRangeNm);
  assert.equal(proof.profile?.stages[0].quoteRequired,true);
  assert.equal(proof.profile?.verificationRequired,true);
  for(const stage of proof.profile?.stages.slice(1)??[]){
    assert.equal(stage.powerHp,undefined);
    assert.equal(stage.torqueNm,undefined);
    assert.equal(stage.powerRangeHp,undefined);
    assert.equal(stage.torqueRangeNm,undefined);
  }
  for(let year=app.yearFrom;year<=app.yearTo;year++){
    const match=resolveVerifiedRdwApplication({...test,firstRegistrationYear:year,firstRegistrationDate:`${year}-05-17`});
    assert.equal(match?.profile?.id,app.id,`Year within approved ${app.id}: ${year}`);
  }
  const bad:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]>=[
    ["year outside",{firstRegistrationYear:app.yearTo+1,firstRegistrationDate:`${app.yearTo+1}-05-17`}],
    ["year before",{firstRegistrationYear:app.yearFrom-1,firstRegistrationDate:`${app.yearFrom-1}-05-17`}],
    ["no type",{type:undefined}],["wrong type",{type:"UNREVIEWED"}],
    ["wrong registered +1kW",{registeredPower:{value:app.registeredPowerKw+1,unit:"kW"}}],
    ["wrong registered -1kW",{registeredPower:{value:app.registeredPowerKw-1,unit:"kW"}}],
    ["wrong displacement",{displacementCc:app.displacementCc+10}],
    ["wrong cylinder",{cylinders:app.cylinders===2?4:2}],
    ["wrong fuel",{fuel:app.fuel==="Diesel"?"Benzine":"Diesel"}],
    ["LPG fuel mix",{fuel:"Benzine / LPG"}],
    ["hybrid",{fuel:"Benzine / Elektriciteit"}],
    ["missing power",{registeredPower:undefined}],
    ["other make",{make:app.make==="Nissan"?"Renault":app.make==="Volkswagen"?"Seat":"Nissan"}],
    ["other model",{model:"OTHER MAKE MODEL"}],
    ["contradictory year",{firstRegistrationYear:app.yearFrom+1}],
    ["incorrect stock torque",{stockTorqueNm:app.stockTorqueNm+30}]
  ];
  for(const [reason,patch] of bad){
    const p=resolveVerifiedRdwApplication({...test,...patch});
    assert.notEqual(p?.profile?.id,app.id,`${app.id} wrong ${reason}`);
    negative++;
  }
  const rows=frozen.rows.filter(row=>
    row.vehicle.merk?.toLowerCase()===app.make.toLowerCase() &&
    app.allowedRdwModels.some(m=>row.vehicle.handelsbenaming?.toLowerCase()===m.toLowerCase()) &&
    row.vehicle.type?.toLowerCase()===app.requiredRdwType.toLowerCase() &&
    Number(row.vehicle.cilinderinhoud)===app.displacementCc &&
    Number(row.vehicle.aantal_cilinders)===app.cylinders &&
    Number(row.vehicle.datum_eerste_toelating_dt?.slice(0,4))>=app.yearFrom &&
    Number(row.vehicle.datum_eerste_toelating_dt?.slice(0,4))<=app.yearTo &&
    row.fuels.length===1 &&
    row.fuels[0].brandstof_omschrijving===(app.fuel==="Petrol"?"Benzine":"Diesel") &&
    Math.abs(Number(row.fuels[0].nettomaximumvermogen)-app.registeredPowerKw)<0.25
  );
  positives[app.id]=rows.length;
  assert.ok(rows.length>0,`Frozen cohort has an explicit positive case for ${app.id}`);
  for(const row of rows){
    const result=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
    assert.equal(result.vehicle.engine.powerHp,app.stockPowerHp,`${app.id} registered factory power displayed`);
    assert.equal(result.tuningEstimate.profile?.id,app.id,`${app.id}: sample exact RDW `);
    assert.deepEqual(result.tuningEstimate.profile?.stages[0].powerRangeHp,app.powerRangeHp);
    assert.deepEqual(result.tuningEstimate.profile?.stages[0].torqueRangeNm,app.torqueRangeNm);
    matches++;
  }
}
assert.ok(matches>=85,"Bulk batch recovers at least 25 preselected nonrandom cases");
// No two bulk applications may match the same sampled technical registration.
assert.equal(matches,Object.values(positives).reduce((a,b)=>a+b,0));
// Regression: punctuation/multiword RDW names are whole allowlisted trading
// names, never unconstrained substring matches such as MX-50 / T-ROCKET.
for(const [applicationId,invalidTradingNames] of [
  ["rdw-bulk-mazda-mx5-nc1-18-mzr-126",["MAZDA MX-50","MX-5 SPORT","MAZDA 5"]],
  ["rdw-bulk-vw-troc-a1-15tsi150-2020",["T-ROC R","T-ROCKET","T-ROC CABRIO"]],
  ["rdw-bulk-citroen-c5-aircross-a-12puretech130-2020-21",["C5","C5 X","C3 AIRCROSS"]],
  ["rdw-bulk-nissan-xtrail-t32-16digt163-2017-19",["NISSAN X-TRAILER","NISSAN QASHQAI","NISSAN X-TRAIL SPORT"]]
] as const){
  const app=reviewedBulkRdwApplications.find(app=>app.id===applicationId);
  assert.ok(app,applicationId+" explicitly reviewed");
  const input:EstimateMatchInput={
    make:app.make,model:app.allowedRdwModels[0],type:app.requiredRdwType,
    displacementCc:app.displacementCc,cylinders:app.cylinders,
    fuel:app.fuel==="Petrol"?"Benzine":"Diesel",
    registeredPower:{value:app.registeredPowerKw,unit:"kW"},
    firstRegistrationYear:app.yearFrom,firstRegistrationDate:`${app.yearFrom}-05-17`
  };
  assert.equal(resolveVerifiedRdwApplication(input)?.profile?.id,applicationId);
  for(const wrongModel of invalidTradingNames){
    assert.notEqual(resolveVerifiedRdwApplication({...input,model:wrongModel})?.profile?.id,
      applicationId,applicationId+" falsely matches "+wrongModel);
    negative++;
  }
}
console.log("RDW_BULK_3_PASS",JSON.stringify({
  approvedApplications:reviewedBulkRdwApplicationCount,
  fixedFrozenMatches:matches,
  adversarialNegativeChecks:negative,
  perApplicationCount:positives,
  noNumericStage2Or3:true,
  sampleIsRepresentative:false
}));
