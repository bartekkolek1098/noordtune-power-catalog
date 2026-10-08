import assert from "node:assert/strict";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const applications = [
  {make:"SEAT",model:"LEON",type:"5F",id:"rdw-seat-leon-5f-10-tsi-85kw",
    cc:999,cylinders:3,torque:200,year:2017,years:[2015,2017,2019],
    sourceTorque:[225,240],sourcePower:[130,135],expectedGain:"+14–19 KM / +25–40 Nm",frozenCount:12},
  {make:"NISSAN",model:"NISSAN JUKE",type:"F15",id:"rdw-nissan-juke-f15-12-digt-85kw",
    cc:1197,cylinders:4,torque:190,year:2017,years:[2015,2016,2019],
    sourceTorque:[230,231],sourcePower:[130,131],expectedGain:"+14–15 KM / +40–41 Nm",frozenCount:12}
] as const;

for(const a of applications){
  const input: EstimateMatchInput = {
    make:a.make,model:a.model,type:a.type,firstRegistrationDate:`${a.year}-06-17`,
    firstRegistrationYear:a.year,displacementCc:a.cc,cylinders:a.cylinders,
    fuel:"Benzine",registeredPower:{value:85,unit:"kW"}
  };
  const estimate=resolveRdwTuningEstimate(input);
  assert.equal(estimate.profile?.id,a.id,a.id+" exact 85kW application");
  assert.equal(estimate.coverageClass,"B");
  assert.equal(estimate.profile?.stockPowerHp,116,"RDW 85 kW rounds to 116 metric PS");
  assert.equal(estimate.profile?.stockTorqueNm,a.torque,"Source factory Nm, not an RDW field");
  assert.deepEqual(estimate.profile?.stages[0].powerRangeHp,a.sourcePower);
  assert.deepEqual(estimate.profile?.stages[0].torqueRangeNm,a.sourceTorque);
  assert.ok(estimate.profile?.verificationRequired);
  assert.ok(estimate.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
  assert.ok(estimate.profile!.sourceReferences.length>=3);
  assert.ok(estimate.profile!.sourceReferences.every(ref=>ref.url?.startsWith("https://")));
  assert.equal(estimate.profile?.brand,a.make==="SEAT"?"Seat":"Nissan");
  assert.ok(!estimate.profile?.model.includes("1 Series"),"No BMW 1 Series on another make");
  const customer=customerProfile(estimate.profile!);
  assert.deepEqual(customer.stages.map(x=>x.name),["Stage 1","Stage 2"]);
  assert.deepEqual(customer.stages[0].powerRangeHp,a.sourcePower);
  assert.deepEqual(customer.stages[0].torqueRangeNm,a.sourceTorque);
  assert.equal(customer.stages[0].quoteRequired,true);
  assert.equal(resolveStageQuote(estimate.profile,customer.stages[0]).kind,"on-request");
  assert.equal(customer.stages[1].powerHp,undefined);
  assert.equal(customer.stages[1].powerRangeHp,undefined);
  assert.equal(customer.stages[1].torqueRangeNm,undefined);
  assert.equal(formatEstimateGain(customer.stages[0],116,a.torque,"pl"),a.expectedGain);

  const inputRdw = normalizeRdwVehicle({
    merk:a.make,handelsbenaming:a.model,type:a.type,
    cilinderinhoud:String(a.cc),aantal_cilinders:String(a.cylinders),
    datum_eerste_toelating_dt:`${a.year}-06-17T00:00:00.000`,
    aantal_zitplaatsen:"5",massa_ledig_voertuig:"1190"
  },[{brandstof_omschrijving:"Benzine",nettomaximumvermogen:"85.00"}],"QA0000");
  assert.equal(inputRdw.vehicle.make,a.make);
  assert.equal(inputRdw.vehicle.model,a.model);
  assert.equal(inputRdw.vehicle.engine.powerKw,85);
  assert.equal(inputRdw.vehicle.engine.powerHp,116);
  assert.equal(inputRdw.vehicle.engine.displacementCc,a.cc);
  assert.equal(inputRdw.tuningEstimate.profile?.id,a.id);
  assert.deepEqual(inputRdw.tuningEstimate.profile?.stages[0].powerRangeHp,a.sourcePower);

  for(const [label,change] of [
    ["wrong fuel",{fuel:"Diesel"}],
    ["mixed hybrid fuel",{fuel:"Benzine / Elektriciteit"}],
    ["CNG fuel",{fuel:"CNG"}],
    ["wrong RDW type",{type:a.type==="5F"?"1P":"F16"}],
    ["missing required RDW type",{type:""}],
    ["wrong power",{registeredPower:{value:86,unit:"kW" as const}}],
    ["lower power",{registeredPower:{value:84,unit:"kW" as const}}],
    ["wrong power unit",{registeredPower:{value:116,unit:"PS" as const}}],
    ["missing official registered power",{registeredPower:null,powerHp:116}],
    ["wrong displacement",{displacementCc:a.cc+49}],
    ["wrong cylinders",{cylinders:a.cylinders+1}],
    ["before scope",{firstRegistrationYear:2012,firstRegistrationDate:"2012-06-17"}],
    ["after scope",{firstRegistrationYear:2022,firstRegistrationDate:"2022-06-17"}],
    ["contradictory RDW year",{firstRegistrationYear:2018}],
    ["invalid RDW date",{firstRegistrationYear:undefined,firstRegistrationDate:"2017-02-30"}],
    ["wrong model",{model:"ALTIMA"}],
    ["wrong make",{make:"Volkswagen"}],
    ["known conflicting factory torque",{stockTorqueNm:a.torque+30}]
  ] as const){
    const other=resolveRdwTuningEstimate({...input,...change});
    assert.notEqual(other.profile?.id,a.id,a.id+" rejects "+label);
  }
}

// Frozen 3,000-registration purposive test sample; the original group samples
// were chosen before tuning results. Neither real plates nor VINs are used.
let observed=0,recovered=0;
for(const a of applications){
  const samples=frozen.rows.filter(row=>
    row.vehicle.merk===a.make && row.vehicle.handelsbenaming===a.model &&
    Number(row.vehicle.cilinderinhoud)===a.cc &&
    row.vehicle.type===a.type &&
    row.fuels.some((fuel:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>fuel.brandstof_omschrijving==="Benzine" && Number(fuel.nettomaximumvermogen)===85));
  assert.equal(samples.length,a.frozenCount,a.id+" frozen subset size");
  const distribution: Record<number,number> = {};
  for(const row of samples){
    const n=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
    observed++;
    assert.equal(n.tuningEstimate.profile?.id,a.id,a.id+" historical year match");
    const y=n.vehicle.registration.firstAdmissionYear!;
    distribution[y]=(distribution[y]??0)+1;
    if(n.tuningEstimate.profile?.stages[0].powerRangeHp)recovered++;
  }
  assert.deepEqual(Object.keys(distribution).map(Number).sort((x,y)=>x-y),[...a.years].sort((x,y)=>x-y));
}
assert.equal(observed,24);
assert.equal(recovered,24);

// Adjacent Qashqai/Juke engine identities are not interchangeable:
// J11 1.2 DIG-T can have a manual 190 Nm or CVT 165 Nm baseline.
// RDW lacks trustworthy transmission decoding for those results.
const qashqai=resolveRdwTuningEstimate({
 make:"Nissan",model:"NISSAN QASHQAI",type:"J11",fuel:"Benzine",
 registeredPower:{value:85,unit:"kW"},displacementCc:1197,cylinders:4,
 firstRegistrationYear:2017,firstRegistrationDate:"2017-06-17"
});
assert.notEqual(qashqai.profile?.id,"rdw-nissan-juke-f15-12-digt-85kw");
assert.notEqual(qashqai.profile?.id,"rdw-seat-leon-5f-10-tsi-85kw");

for(const [make,model,expected] of [
  ["BMW","118I","rdw-bmw-118i-f40-136"],
  ["Volkswagen","CADDY","rdw-vw-caddy-iv-14-tgi-cng-110"],
  ["SEAT","LEON","rdw-seat-leon-1p-14-tsi-125"]
] as const){
  const req:EstimateMatchInput = {
    make,model,fuel:make==="Volkswagen"?"CNG":"Benzine",
    registeredPower:{value:make==="BMW"?100:make==="Volkswagen"?81:92,unit:"kW"},
    displacementCc:make==="BMW"?1499:make==="Volkswagen"?1395:1390,
    firstRegistrationYear:make==="BMW"?2021:make==="Volkswagen"?2019:2010,
    firstRegistrationDate:make==="BMW"?"2021-06-17":make==="Volkswagen"?"2019-06-17":"2010-06-17",
    type:make==="BMW"?"F1H":make==="Volkswagen"?"2KN":"1P"
  };
  assert.equal(resolveRdwTuningEstimate(req).profile?.id,expected,"existing application remains unchanged");
}
console.log("RDW_85KW_SCOPES_PASS: 2 factory kW applications / 24 recovered frozen observations; 36 negative identity checks; Qashqai gearbox unresolved; BMW/Caddy/Seat1P unchanged; Stage2 withheld.");
