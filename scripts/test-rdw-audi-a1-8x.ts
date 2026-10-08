import assert from "node:assert/strict";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const applications = [
  {id:"rdw-audi-a1-8x-12-tfsi-86",kw:63,cc:1197,ps:86,stockNm:160,
    power:[105,130] as [number,number],torque:[175,220] as [number,number],
    gain:"+19–44 KM / +15–60 Nm",sourceCount:3,observations:12,
    distribution:{"2010":4,"2011":4,"2013":3,"2014":1}},
  {id:"rdw-audi-a1-8x-14-tfsi-122",kw:90,cc:1390,ps:122,stockNm:200,
    power:[135,155] as [number,number],torque:[230,270] as [number,number],
    gain:"+13–33 KM / +30–70 Nm",sourceCount:5,observations:10,
    distribution:{"2010":4,"2011":2,"2013":3,"2014":1}}
] as const;

for(const app of applications){
  const input:EstimateMatchInput = {
    make:"AUDI",model:"AUDI A1",type:"8X",fuel:"Benzine",
    registeredPower:{value:app.kw,unit:"kW"},
    displacementCc:app.cc,cylinders:4,
    firstRegistrationYear:2011,firstRegistrationDate:"2011-05-19"
  };
  const resolution=resolveRdwTuningEstimate(input);
  assert.equal(resolution.profile?.id,app.id,"Exact A1 stock kW / body / model");
  assert.equal(resolution.coverageClass,"B");
  assert.equal(resolution.profile?.brand,"Audi");
  assert.ok(resolution.profile?.model.startsWith("A1 8X"));
  assert.equal(resolution.profile?.stockPowerHp,app.ps);
  assert.equal(resolution.profile?.stockTorqueNm,app.stockNm);
  assert.equal(resolution.profile?.generation,"8X (2010–2014)");
  assert.equal(resolution.profile?.fuel,"Petrol");
  assert.equal(resolution.profile?.verificationRequired,true);
  assert.ok(resolution.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
  assert.equal(resolution.profile?.sourceReferences.length,app.sourceCount);
  assert.ok(resolution.profile?.sourceReferences.every(ref=>ref.url?.startsWith("https://")));
  const customer=customerProfile(resolution.profile!);
  assert.deepEqual(customer.stages.map(s=>s.name),["Stage 1","Stage 2"]);
  assert.deepEqual(customer.stages[0].powerRangeHp,app.power);
  assert.deepEqual(customer.stages[0].torqueRangeNm,app.torque);
  assert.equal(customer.stages[0].quoteRequired,true);
  assert.equal(resolveStageQuote(resolution.profile,customer.stages[0]).kind,"on-request");
  assert.equal(formatEstimateGain(customer.stages[0],app.ps,app.stockNm,"pl"),app.gain);
  assert.equal(customer.stages[1].powerHp,undefined);
  assert.equal(customer.stages[1].powerRangeHp,undefined);
  assert.equal(customer.stages[1].torqueNm,undefined);
  assert.equal(customer.stages[1].torqueRangeNm,undefined);

  for(const year of [2010,2011,2012,2013,2014]){
    assert.equal(resolveRdwTuningEstimate({...input,firstRegistrationYear:year,
      firstRegistrationDate:`${year}-05-19`}).profile?.id,app.id,"Positive verified 8X admission year");
  }
  const bad:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]> = [
    ["2009 before A1 8X",{firstRegistrationYear:2009,firstRegistrationDate:"2009-05-19"}],
    ["2015 outside reviewed window",{firstRegistrationYear:2015,firstRegistrationDate:"2015-05-19"}],
    ["2022 next generation",{firstRegistrationYear:2022,firstRegistrationDate:"2022-05-19"}],
    ["later RDW type GB",{type:"GB"}],
    ["different RDW type 8Y",{type:"8Y"}],
    ["missing RDW type",{type:undefined}],
    ["explicit A1 generation 8Y",{model:"AUDI A1 8Y"}],
    ["explicit later GB variant",{variant:"GB"}],
    ["explicit later 8Y execution",{execution:"8Y"}],
    ["S1 variant conflict",{variant:"S1"}],
    ["same-name A1 Sportback not reviewed",{model:"AUDI A1 SPORTBACK"}],
    ["different badge S1",{model:"AUDI S1"}],
    ["different Audi A3",{model:"AUDI A3"}],
    ["different Audi Q3",{model:"AUDI Q3"}],
    ["Volkswagen sibling",{make:"VOLKSWAGEN",model:"POLO"}],
    ["SEAT sibling",{make:"SEAT",model:"IBIZA"}],
    ["wrong exact power plus 1 kW",{registeredPower:{value:app.kw+1,unit:"kW"}}],
    ["wrong exact power minus 1 kW",{registeredPower:{value:app.kw-1,unit:"kW"}}],
    ["stock horsepower without official kW",{registeredPower:null,powerHp:app.ps}],
    ["wrong power unit PS",{registeredPower:{value:app.ps,unit:"PS"}}],
    ["wrong displacement 999",{displacementCc:999}],
    ["wrong displacement 1395",{displacementCc:1395}],
    ["wrong displacement 1598",{displacementCc:1598}],
    ["wrong cylinder count",{cylinders:3}],
    ["diesel",{fuel:"Diesel"}],
    ["compressed natural gas",{fuel:"CNG"}],
    ["hybrid",{fuel:"Benzine / Elektriciteit"}],
    ["mixed LPG",{fuel:"Benzine / LPG"}],
    ["E85",{fuel:"E85"}],
    ["known factory torque conflict",{stockTorqueNm:app.stockNm+30}],
    ["contradictory date/year",{firstRegistrationYear:2012}],
    ["invalid admission date",{firstRegistrationYear:undefined,firstRegistrationDate:"2011-02-30"}]
  ];
  for(const [name,change] of bad) {
    const result=resolveRdwTuningEstimate({...input,...change});
    assert.notEqual(result.profile?.id,app.id,app.id+" rejects "+name);
  }
  const normalized=normalizeRdwVehicle({
    merk:"AUDI",handelsbenaming:"AUDI A1",type:"8X",cilinderinhoud:String(app.cc),
    aantal_cilinders:"4",datum_eerste_toelating_dt:"2011-05-19T00:00:00.000",
    aantal_zitplaatsen:"4"
  },[{brandstof_omschrijving:"Benzine",nettomaximumvermogen:String(app.kw)}],"QA0000");
  assert.equal(normalized.vehicle.engine.powerKw,app.kw);
  assert.equal(normalized.vehicle.engine.powerHp,app.ps);
  assert.equal(normalized.vehicle.registration.firstAdmissionYear,2011);
  assert.equal(normalized.tuningEstimate.profile?.id,app.id);

  // Frozen purpose-selected group sample: do not read, persist, print or
  // match an individual registration, VIN, sample ID, variant or execution.
  const rows=frozen.rows.filter(row=>
    row.vehicle.merk==="AUDI" && row.vehicle.handelsbenaming==="AUDI A1" &&
    row.vehicle.type==="8X" && Number(row.vehicle.cilinderinhoud)===app.cc &&
    Number(row.vehicle.aantal_cilinders)===4 &&
    row.fuels.some((f:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>
      f.brandstof_omschrijving==="Benzine"&&Number(f.nettomaximumvermogen)===app.kw));
  assert.equal(rows.length,app.observations,"Preselected A1 frozen technical subgroup size");
  const byYear:Record<number,number>={};
  for(const row of rows){
    const n=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
    assert.equal(n.tuningEstimate.profile?.id,app.id,app.id+" year/engine match");
    assert.deepEqual(n.tuningEstimate.profile?.stages[0].powerRangeHp,app.power);
    const year=n.vehicle.registration.firstAdmissionYear!;
    byYear[year]=(byYear[year]??0)+1;
  }
  assert.deepEqual(byYear,app.distribution,"Preselected years remain unchanged");
}
const relatives = [
  {make:"SKODA",model:"OCTAVIA",type:"5E",cc:1395,cylinders:4,kw:103,year:2014,fuel:"Benzine",id:"rdw-skoda-octavia-5e-14-tsi-140"},
  {make:"SKODA",model:"OCTAVIA",type:"1Z",cc:1390,cylinders:4,kw:90,year:2011,fuel:"Benzine",id:"rdw-skoda-octavia-1z-14-tsi-122"},
  {make:"SEAT",model:"LEON",type:"5F",cc:999,cylinders:3,kw:85,year:2017,fuel:"Benzine",id:"rdw-seat-leon-5f-10-tsi-85kw"},
  {make:"NISSAN",model:"NISSAN JUKE",type:"F15",cc:1197,cylinders:4,kw:85,year:2017,fuel:"Benzine",id:"rdw-nissan-juke-f15-12-digt-85kw"},
  {make:"BMW",model:"118I",type:"F1H",cc:1499,cylinders:3,kw:100,year:2021,fuel:"Benzine",id:"rdw-bmw-118i-f40-136"},
  {make:"Volkswagen",model:"CADDY",type:"2KN",cc:1395,cylinders:4,kw:81,year:2019,fuel:"CNG",id:"rdw-vw-caddy-iv-14-tgi-cng-110"}
] as const;
for(const a of relatives){
  const other=resolveRdwTuningEstimate({make:a.make,model:a.model,type:a.type,
    displacementCc:a.cc,cylinders:a.cylinders,fuel:a.fuel,
    registeredPower:{value:a.kw,unit:"kW"},
    firstRegistrationYear:a.year,firstRegistrationDate:`${a.year}-05-19`});
  assert.equal(other.profile?.id,a.id,"Existing verified application preserved: "+a.id);
}
console.log("AUDI_A1_8X_RDW_PASS: 2 exact factory kW applications, 22/22 frozen observations, "+
  "64 adversarial mismatches, six unrelated source profiles unchanged, no unsupported Stage2/3.");
