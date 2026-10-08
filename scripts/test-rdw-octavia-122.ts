import assert from "node:assert/strict";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const id = "rdw-skoda-octavia-1z-14-tsi-122";
const input:EstimateMatchInput = {
  make:"SKODA", model:"OCTAVIA", type:"1Z",
  fuel:"Benzine", registeredPower:{value:90,unit:"kW"},
  displacementCc:1390, cylinders:4,
  firstRegistrationYear:2011, firstRegistrationDate:"2011-05-20"
};
const r=resolveRdwTuningEstimate(input);
assert.equal(r.profile?.id,id);
assert.equal(r.coverageClass,"B");
assert.equal(r.profile?.brand,"Skoda");
assert.ok(r.profile?.model.startsWith("Octavia 1Z facelift"));
assert.equal(r.profile?.generation,"1Z facelift (II)");
assert.equal(r.profile?.stockPowerHp,122);
assert.equal(r.profile?.stockTorqueNm,200);
assert.equal(r.profile?.fuel,"Petrol");
assert.equal(r.profile?.sourceReferences.length,4);
assert.ok(r.profile?.sourceReferences.every(x=>x.url?.startsWith("https://")));
assert.equal(r.profile?.verificationRequired,true);
assert.ok(r.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
const customer=customerProfile(r.profile!);
assert.deepEqual(customer.stages.map(s=>s.name),["Stage 1","Stage 2"]);
assert.deepEqual(customer.stages[0].powerRangeHp,[140,155]);
assert.deepEqual(customer.stages[0].torqueRangeNm,[240,270]);
assert.equal(customer.stages[0].quoteRequired,true);
assert.equal(resolveStageQuote(r.profile,customer.stages[0]).kind,"on-request");
assert.equal(formatEstimateGain(customer.stages[0],122,200,"pl"),"+18–33 KM / +40–70 Nm");
assert.equal(customer.stages[1].powerHp,undefined);
assert.equal(customer.stages[1].powerRangeHp,undefined);
assert.equal(customer.stages[1].torqueNm,undefined);
assert.equal(customer.stages[1].torqueRangeNm,undefined);
for(const year of [2009,2010,2011,2012,2013]){
  assert.equal(resolveRdwTuningEstimate({...input,firstRegistrationYear:year,
    firstRegistrationDate:`${year}-05-20`}).profile?.id,id,"positive 1Z year "+year);
}
const negatives:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]> = [
  ["before approved facelift",{firstRegistrationYear:2008,firstRegistrationDate:"2008-05-20"}],
  ["after production",{firstRegistrationYear:2014,firstRegistrationDate:"2014-05-20"}],
  ["new generation 5E",{type:"5E"}],["new generation NX",{type:"NX"}],
  ["missing RDW generation",{type:undefined}],
  ["model explicit 5E",{model:"OCTAVIA 5E"}],["model explicit III",{model:"OCTAVIA III"}],
  ["model explicit IV",{model:"OCTAVIA IV"}],
  ["variant conflicting 5E",{variant:"5E"}],["execution conflicting NX",{execution:"NX"}],
  ["new EA211 cc",{displacementCc:1395}],["unknown cc",{displacementCc:undefined}],
  ["3 cylinder",{cylinders:3}],
  ["diesel",{fuel:"Diesel"}],["CNG",{fuel:"CNG"}],
  ["mixed CNG",{fuel:"Benzine / CNG"}],
  ["hybrid",{fuel:"Benzine / Elektriciteit"}],["LPG",{fuel:"Benzine / LPG"}],
  ["103 kW 140 PS",{registeredPower:{value:103,unit:"kW"}}],
  ["92 kW 125 PS",{registeredPower:{value:92,unit:"kW"}}],
  ["89 kW",{registeredPower:{value:89,unit:"kW"}}],
  ["91 kW",{registeredPower:{value:91,unit:"kW"}}],
  ["unsupported power unit",{registeredPower:{value:122,unit:"PS"}}],
  ["missing original kW",{registeredPower:null,powerHp:122}],
  ["contradictory torque",{stockTorqueNm:250}],
  ["contradictory first admission year",{firstRegistrationYear:2012}],
  ["invalid first admission date",{firstRegistrationDate:"2011-02-30",firstRegistrationYear:undefined}],
  ["other Skoda model",{model:"FABIA"}],["other Skoda model Superb",{model:"SUPERB"}],
  ["Seat sibling",{make:"SEAT",model:"LEON"}],
  ["Volkswagen sibling",{make:"VOLKSWAGEN",model:"GOLF"}]
];
for(const [label,change] of negatives)assert.notEqual(
  resolveRdwTuningEstimate({...input,...change}).profile?.id,id,label);

const rdw=normalizeRdwVehicle({
  merk:"SKODA",handelsbenaming:"OCTAVIA",type:"1Z",cilinderinhoud:"1390",
  aantal_cilinders:"4",datum_eerste_toelating_dt:"2011-05-20T00:00:00.000",
  aantal_zitplaatsen:"5"
},[{brandstof_omschrijving:"Benzine",nettomaximumvermogen:"90.00"}],"QA0000");
assert.equal(rdw.vehicle.engine.powerKw,90);
assert.equal(rdw.vehicle.engine.powerHp,122);
assert.equal(rdw.vehicle.registration.firstAdmissionYear,2011);
assert.equal(rdw.tuningEstimate.profile?.id,id);

// Historical purpose-selected technical rows; never log/commit owner plates,
// individual sample IDs, VINs or per-car RDW raw records.
const observations=frozen.rows.filter(row=>
 row.vehicle.merk==="SKODA" && row.vehicle.handelsbenaming==="OCTAVIA" &&
 row.vehicle.type==="1Z" && Number(row.vehicle.cilinderinhoud)===1390 &&
 Number(row.vehicle.aantal_cilinders)===4 &&
 row.fuels.some((f:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>
   f.brandstof_omschrijving==="Benzine"&&Number(f.nettomaximumvermogen)===90));
assert.equal(observations.length,12,"frozen sample 1Z 90 kW observations");
const distribution:Record<number,number>={};
for(const row of observations){
 const v=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
 const year=v.vehicle.registration.firstAdmissionYear!;
 distribution[year]=(distribution[year]??0)+1;
 assert.equal(v.tuningEstimate.profile?.id,id,"strict identity for frozen year");
 assert.deepEqual(v.tuningEstimate.profile?.stages[0].powerRangeHp,[140,155]);
}
assert.deepEqual(distribution,{"2010":4,"2011":4,"2013":4});

for(const [make,model,type,cc,kw,year,expected,fuel,cylinders] of [
 ["SKODA","OCTAVIA","5E",1395,103,2014,"rdw-skoda-octavia-5e-14-tsi-140","Benzine",4],
 ["SEAT","LEON","5F",999,85,2017,"rdw-seat-leon-5f-10-tsi-85kw","Benzine",3],
 ["NISSAN","NISSAN JUKE","F15",1197,85,2017,"rdw-nissan-juke-f15-12-digt-85kw","Benzine",4],
 ["BMW","118I","F1H",1499,100,2021,"rdw-bmw-118i-f40-136","Benzine",3],
 ["Volkswagen","CADDY","2KN",1395,81,2019,"rdw-vw-caddy-iv-14-tgi-cng-110","CNG",4]
] as const){
 assert.equal(resolveRdwTuningEstimate({
  make,model,type,displacementCc:cc,cylinders,
  registeredPower:{value:kw,unit:"kW"},fuel,
  firstRegistrationYear:year,firstRegistrationDate:`${year}-06-17`
 }).profile?.id,expected,"previous reviewed Stage 1 remains isolated");
}
console.log("OCTAVIA_1Z_122_PASS: 12/12 frozen 90kW 1Z observations; "+negatives.length+
  " negative guards; 5 reviewed regressions; stage2 withheld, stage3 not published.");
