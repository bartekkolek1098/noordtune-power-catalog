import assert from "node:assert/strict";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const id = "rdw-skoda-octavia-5e-14-tsi-140";
const input: EstimateMatchInput = {
  make:"SKODA", model:"OCTAVIA", type:"5E", fuel:"Benzine",
  registeredPower:{value:103,unit:"kW"}, displacementCc:1395, cylinders:4,
  firstRegistrationYear:2014, firstRegistrationDate:"2014-05-20"
};
const result=resolveRdwTuningEstimate(input);
assert.equal(result.profile?.id,id);
assert.equal(result.coverageClass,"B");
assert.equal(result.profile?.brand,"Skoda");
assert.ok(result.profile?.model.startsWith("Octavia 5E"));
assert.equal(result.profile?.stockPowerHp,140);
assert.equal(result.profile?.stockTorqueNm,250);
assert.equal(result.profile?.fuel,"Petrol");
assert.equal(result.profile?.generation,"5E (III, pre-facelift)");
assert.equal(result.profile?.sourceReferences.length,3);
assert.ok(result.profile?.sourceReferences.every(x=>x.url?.startsWith("https://")));
assert.ok(result.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
assert.equal(result.profile?.verificationRequired,true);
const stages=customerProfile(result.profile!).stages;
assert.deepEqual(stages.map(x=>x.name),["Stage 1","Stage 2"]);
assert.deepEqual(stages[0].powerRangeHp,[170,180]);
assert.deepEqual(stages[0].torqueRangeNm,[300,320]);
assert.equal(stages[0].quoteRequired,true);
assert.equal(resolveStageQuote(result.profile,stages[0]).kind,"on-request");
assert.equal(formatEstimateGain(stages[0],140,250,"pl"),"+30–40 KM / +50–70 Nm");
assert.equal(stages[1].powerHp,undefined);
assert.equal(stages[1].powerRangeHp,undefined);
assert.equal(stages[1].torqueNm,undefined);
assert.equal(stages[1].torqueRangeNm,undefined);

for(const year of [2013,2014,2015]){
  assert.equal(resolveRdwTuningEstimate({...input,firstRegistrationYear:year,
    firstRegistrationDate:`${year}-05-20`}).profile?.id,id,"Positive 5E year "+year);
}
const negative: ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]> = [
  ["2012 before approved 5E range",{firstRegistrationYear:2012,firstRegistrationDate:"2012-05-20"}],
  ["2016 new engine variants",{firstRegistrationYear:2016,firstRegistrationDate:"2016-05-20"}],
  ["2020 new generation",{firstRegistrationYear:2020,firstRegistrationDate:"2020-05-20"}],
  ["wrong generation",{type:"NX"}],["earlier Octavia",{type:"1Z"}],
  ["explicit NX despite conflicting RDW type",{model:"OCTAVIA NX"}],
  ["explicit 1Z despite conflicting RDW type",{model:"OCTAVIA 1Z"}],
  ["absent RDW type",{type:undefined}],["wrong displacement",{displacementCc:1390}],
  ["three cylinders",{cylinders:3}],["diesel",{fuel:"Diesel"}],
  ["CNG",{fuel:"CNG"}],["mixed gas",{fuel:"Benzine / CNG"}],
  ["hybrid",{fuel:"Benzine / Elektriciteit"}],
  ["150 PS 110 kW engine",{registeredPower:{value:110,unit:"kW"}}],
  ["122 PS 90 kW engine",{registeredPower:{value:90,unit:"kW"}}],
  ["wrong kW",{registeredPower:{value:104,unit:"kW"}}],
  ["unverified power unit",{registeredPower:{value:140,unit:"PS"}}],
  ["missing registered power",{registeredPower:null,powerHp:140}],
  ["known conflicting torque",{stockTorqueNm:200}],
  ["contradictory admission year",{firstRegistrationYear:2015}],
  ["invalid admission date",{firstRegistrationDate:"2014-02-30",firstRegistrationYear:undefined}],
  ["another Skoda model",{model:"SUPERB"}],["SEAT sibling",{make:"SEAT",model:"LEON"}],
  ["Golf sibling",{make:"VOLKSWAGEN",model:"GOLF"}],
];
for(const [name,change] of negative){
  assert.notEqual(resolveRdwTuningEstimate({...input,...change}).profile?.id,id,name);
}

const rdw=normalizeRdwVehicle({
  merk:"SKODA",handelsbenaming:"OCTAVIA",type:"5E",cilinderinhoud:"1395",
  aantal_cilinders:"4",datum_eerste_toelating_dt:"2014-05-20T00:00:00.000",
  aantal_zitplaatsen:"5"
},[{brandstof_omschrijving:"Benzine",nettomaximumvermogen:"103.00"}],"QA0000");
assert.equal(rdw.vehicle.engine.powerKw,103);
assert.equal(rdw.vehicle.engine.powerHp,140);
assert.equal(rdw.vehicle.registration.firstAdmissionYear,2014);
assert.equal(rdw.tuningEstimate.profile?.id,id);

// Previously frozen purposive top-250 RDW public technical observations. Synthetic
// plate only; no registration, VIN, identity, variant or source query URL is logged.
const observed=frozen.rows.filter(row=>
  row.vehicle.merk==="SKODA" && row.vehicle.handelsbenaming==="OCTAVIA" &&
  row.vehicle.type==="5E" && Number(row.vehicle.cilinderinhoud)===1395 &&
  Number(row.vehicle.aantal_cilinders)===4 &&
  row.fuels.some((f:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>f.brandstof_omschrijving==="Benzine" &&
    Number(f.nettomaximumvermogen)===103));
assert.equal(observed.length,16,"Preselected frozen Octavia 5E 103 kW sample");
const byYear:Record<number,number>={};
for(const row of observed){
  const vehicle=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
  const year=vehicle.vehicle.registration.firstAdmissionYear!;
  byYear[year]=(byYear[year]??0)+1;
  assert.equal(vehicle.tuningEstimate.profile?.id,id,"Frozen observed model/year/kW");
  assert.deepEqual(vehicle.tuningEstimate.profile?.stages[0].powerRangeHp,[170,180]);
}
assert.deepEqual(byYear,{"2013":4,"2014":8,"2015":4});

for(const [make,model,type,cc,kw,year,expected,fuel] of [
  ["SEAT","LEON","5F",999,85,2017,"rdw-seat-leon-5f-10-tsi-85kw","Benzine"],
  ["NISSAN","NISSAN JUKE","F15",1197,85,2017,"rdw-nissan-juke-f15-12-digt-85kw","Benzine"],
  ["BMW","118I","F1H",1499,100,2021,"rdw-bmw-118i-f40-136","Benzine"],
  ["Volkswagen","CADDY","2KN",1395,81,2019,"rdw-vw-caddy-iv-14-tgi-cng-110","CNG"]
] as const){
  assert.equal(resolveRdwTuningEstimate({
    make,model,type,displacementCc:cc,cylinders:make==="BMW"||make==="SEAT"?3:4,
    registeredPower:{value:kw,unit:"kW"},fuel,
    firstRegistrationYear:year,firstRegistrationDate:`${year}-06-17`
  }).profile?.id,expected,"Unrelated certified RDW identity unchanged");
}
console.log("OCTAVIA_140_RDW_PASS: strict 5E/103kW/1395cc petrol 2013–2015; 16/16 frozen cases; 25 negatives; 4 existing application regressions; Stage2 numeric withheld and Stage3 unpublished.");
