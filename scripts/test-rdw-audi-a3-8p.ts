import assert from "node:assert/strict";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const id="rdw-audi-a3-8p-14-tfsi-125";
const input:EstimateMatchInput={
  make:"AUDI",model:"AUDI A3",type:"8P",
  fuel:"Benzine",registeredPower:{value:92,unit:"kW"},
  displacementCc:1390,cylinders:4,
  firstRegistrationYear:2010,firstRegistrationDate:"2010-05-24"
};
const resolved=resolveRdwTuningEstimate(input);
assert.equal(resolved.profile?.id,id);
assert.equal(resolved.coverageClass,"B");
assert.equal(resolved.profile?.stockPowerHp,125);
assert.equal(resolved.profile?.stockTorqueNm,200);
assert.equal(resolved.profile?.generation,"8P facelift (2008–2012)");
assert.equal(resolved.profile?.fuel,"Petrol");
assert.equal(resolved.profile?.verificationRequired,true);
assert.ok(resolved.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
assert.equal(resolved.profile?.sourceReferences.length,5);
assert.ok(resolved.profile?.sourceReferences.every(s=>s.url?.startsWith("https://")));
const customer=customerProfile(resolved.profile!);
assert.deepEqual(customer.stages.map(stage=>stage.name),["Stage 1","Stage 2"]);
assert.deepEqual(customer.stages[0].powerRangeHp,[135,150]);
assert.deepEqual(customer.stages[0].torqueRangeNm,[230,255]);
assert.equal(customer.stages[0].quoteRequired,true);
assert.equal(resolveStageQuote(resolved.profile,customer.stages[0]).kind,"on-request");
assert.equal(formatEstimateGain(customer.stages[0],125,200,"pl"),"+10–25 KM / +30–55 Nm");
assert.equal(customer.stages[1].powerHp,undefined);
assert.equal(customer.stages[1].powerRangeHp,undefined);
assert.equal(customer.stages[1].torqueNm,undefined);
assert.equal(customer.stages[1].torqueRangeNm,undefined);
for(const year of [2008,2009,2010,2011,2012]){
  assert.equal(resolveRdwTuningEstimate({...input,firstRegistrationYear:year,
    firstRegistrationDate:`${year}-05-24`}).profile?.id,id,`verified 8P source year ${year}`);
}
const negatives:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]>=[
  ["old pre-facelift 2007",{firstRegistrationYear:2007,firstRegistrationDate:"2007-05-24"}],
  ["2013 registration withheld",{firstRegistrationYear:2013,firstRegistrationDate:"2013-05-24"}],
  ["2014 registration withheld",{firstRegistrationYear:2014,firstRegistrationDate:"2014-05-24"}],
  ["wrong 8V body",{type:"8V"}],["wrong 8Y body",{type:"8Y"}],
  ["wrong 8L body",{type:"8L"}],["body missing",{type:undefined}],
  ["explicit later model",{model:"AUDI A3 8V"}],
  ["explicit 8V variant",{variant:"8V"}],
  ["explicit 8Y execution",{execution:"8Y"}],
  ["A3 Sportback unreviewed",{model:"AUDI A3 SPORTBACK"}],
  ["S3 unreviewed",{model:"AUDI S3"}],
  ["A1 sister model",{model:"AUDI A1"}],
  ["A4 sister model",{model:"AUDI A4"}],
  ["different make",{make:"VOLKSWAGEN",model:"GOLF"}],
  ["1197 cc erroneous source",{displacementCc:1197}],
  ["1395 cc EA211",{displacementCc:1395}],
  ["missing displacement",{displacementCc:undefined}],
  ["3 cylinder",{cylinders:3}],
  ["90 kW 122 PS",{registeredPower:{value:90,unit:"kW"}}],
  ["93 kW",{registeredPower:{value:93,unit:"kW"}}],
  ["91 kW",{registeredPower:{value:91,unit:"kW"}}],
  ["same PS not source kW",{registeredPower:null,powerHp:125}],
  ["unsupported PS unit",{registeredPower:{value:125,unit:"PS"}}],
  ["diesel",{fuel:"Diesel"}],
  ["CNG",{fuel:"CNG"}],
  ["hybrid",{fuel:"Benzine / Elektriciteit"}],
  ["mixed LPG",{fuel:"Benzine / LPG"}],
  ["E85",{fuel:"E85"}],
  ["wrong manufacturer torque",{stockTorqueNm:250}],
  ["contradictory year/date",{firstRegistrationYear:2011}],
  ["invalid date",{firstRegistrationYear:undefined,firstRegistrationDate:"2010-02-30"}]
];
for(const [reason,patch] of negatives)
  assert.notEqual(resolveRdwTuningEstimate({...input,...patch}).profile?.id,id,reason);

const rows=frozen.rows.filter(row=>row.vehicle.merk==="AUDI"&&
  row.vehicle.handelsbenaming==="AUDI A3"&&row.vehicle.type==="8P"&&
  Number(row.vehicle.cilinderinhoud)===1390&&
  Number(row.vehicle.aantal_cilinders)===4&&
  row.fuels.some((f:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>
    f.brandstof_omschrijving==="Benzine"&&Number(f.nettomaximumvermogen)===92));
assert.equal(rows.length,12,"fixed purpose-selected A3 8P 92kW observations");
const years:Record<number,number>={};
let selected=0,withheld2013=0;
for(const row of rows){
  const normalized=normalizeRdwVehicle(row.vehicle,row.fuels,"QA03A3");
  const year=normalized.vehicle.registration.firstAdmissionYear!;
  years[year]=(years[year]??0)+1;
  assert.equal(normalized.vehicle.engine.powerKw,92);
  assert.equal(normalized.vehicle.engine.powerHp,125);
  if(year===2010){
    selected++;
    assert.equal(normalized.tuningEstimate.profile?.id,id,"actual 2010 A3 8P source application");
    assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].powerRangeHp,[135,150]);
    assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].torqueRangeNm,[230,255]);
  }else if(year===2013){
    withheld2013++;
    assert.notEqual(normalized.tuningEstimate.profile?.id,id,"2013 old-stock identity unreviewed");
  }else throw new Error("Unexpected year in frozen A3 subset");
}
assert.deepEqual(years,{"2010":8,"2013":4});
assert.equal(selected,8);
assert.equal(withheld2013,4);

const regressions=[
  {make:"AUDI",model:"AUDI A1",type:"8X",cc:1197,kw:63,year:2011,cyl:4,fuel:"Benzine",id:"rdw-audi-a1-8x-12-tfsi-86"},
  {make:"AUDI",model:"AUDI A1",type:"8X",cc:1390,kw:90,year:2011,cyl:4,fuel:"Benzine",id:"rdw-audi-a1-8x-14-tfsi-122"},
  {make:"SKODA",model:"OCTAVIA",type:"5E",cc:1395,kw:103,year:2014,cyl:4,fuel:"Benzine",id:"rdw-skoda-octavia-5e-14-tsi-140"},
  {make:"SKODA",model:"OCTAVIA",type:"1Z",cc:1390,kw:90,year:2011,cyl:4,fuel:"Benzine",id:"rdw-skoda-octavia-1z-14-tsi-122"},
  {make:"SEAT",model:"LEON",type:"5F",cc:999,kw:85,year:2017,cyl:3,fuel:"Benzine",id:"rdw-seat-leon-5f-10-tsi-85kw"},
  {make:"NISSAN",model:"NISSAN JUKE",type:"F15",cc:1197,kw:85,year:2017,cyl:4,fuel:"Benzine",id:"rdw-nissan-juke-f15-12-digt-85kw"}
];
for(const a of regressions){
  const r=resolveRdwTuningEstimate({make:a.make,model:a.model,type:a.type,
    fuel:a.fuel,displacementCc:a.cc,cylinders:a.cyl,
    registeredPower:{value:a.kw,unit:"kW"},
    firstRegistrationYear:a.year,firstRegistrationDate:`${a.year}-05-24`});
  assert.equal(r.profile?.id,a.id,a.id+" must be unaffected");
}
console.log("AUDI_A3_8P_125_PASS: 8/8 original 2010 registrations gained indicative Stage 1; "+
  "4/4 late 2013 registrations deliberately withheld; "+negatives.length+
  " negative identity tests; "+regressions.length+" earlier application regressions; Stage 2/3 withheld.");
