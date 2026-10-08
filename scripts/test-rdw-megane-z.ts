import assert from "node:assert/strict";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";
import frozen from "../data/research/nl-top-groups-output-sample.json" with {type:"json"};

const cases = [
  {id:"rdw-renault-megane-z-12-tce-115",kw:85,stockHp:116,stockNm:190,
    yearFrom:2012,yearTo:2015,power:[130,135] as [number,number],
    torque:[230,230] as [number,number],stockName:"TCe 115",sourceCount:3,
    expected:{"2012":4,"2013":2,"2014":3,"2015":1},total:10},
  {id:"rdw-renault-megane-z-12-tce-130",kw:97,stockHp:132,stockNm:205,
    yearFrom:2013,yearTo:2015,power:[140,150] as [number,number],
    torque:[230,255] as [number,number],stockName:"TCe 130",sourceCount:4,
    expected:{"2013":2,"2014":1,"2015":3},total:6}
] as const;
let negativeChecks=0;
for(const test of cases){
  const input:EstimateMatchInput={
    make:"RENAULT",model:"MEGANE",type:"Z",
    fuel:"Benzine",registeredPower:{value:test.kw,unit:"kW"},
    displacementCc:1197,cylinders:4,
    firstRegistrationYear:test.yearFrom,firstRegistrationDate:`${test.yearFrom}-05-17`
  };
  const result=resolveRdwTuningEstimate(input);
  assert.equal(result.profile?.id,test.id);
  assert.equal(result.coverageClass,"B");
  assert.equal(result.profile?.stockPowerHp,test.stockHp);
  assert.equal(result.profile?.stockTorqueNm,test.stockNm);
  assert.equal(result.profile?.brand,"Renault");
  assert.ok(result.profile?.engine.includes(test.stockName));
  assert.ok(result.profile?.generation?.startsWith("III"));
  assert.equal(result.profile?.fuel,"Petrol");
  assert.ok(result.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
  assert.equal(result.profile?.sourceReferences.length,test.sourceCount);
  assert.ok(result.profile?.sourceReferences.every(ref=>ref.url?.startsWith("https://")));
  assert.equal(result.profile?.verificationRequired,true);
  assert.equal(result.profile?.ecuSupport?.status,"manual-review");
  assert.equal(result.profile?.tcuSupport?.status,"manual-review");
  const customer=customerProfile(result.profile!);
  assert.deepEqual(customer.stages.map(stage=>stage.name),["Stage 1","Stage 2"]);
  assert.deepEqual(customer.stages[0].powerRangeHp,test.power);
  assert.deepEqual(customer.stages[0].torqueRangeNm,test.torque);
  assert.equal(customer.stages[0].quoteRequired,true);
  assert.equal(resolveStageQuote(result.profile,customer.stages[0]).kind,"on-request");
  const gain=formatEstimateGain(customer.stages[0],test.stockHp,test.stockNm,"pl");
  assert.ok(gain?.includes(String(test.power[0]-test.stockHp))&&
    gain?.includes(String(test.power[1]-test.stockHp)),
    "Displayed Stage 1 gain derived from sourced Stage range and RDW rounded power");
  assert.equal(customer.stages[1].powerHp,undefined);
  assert.equal(customer.stages[1].powerRangeHp,undefined);
  assert.equal(customer.stages[1].torqueNm,undefined);
  assert.equal(customer.stages[1].torqueRangeNm,undefined);
  for(let year=test.yearFrom;year<=test.yearTo;year++){
    assert.equal(resolveRdwTuningEstimate({...input,firstRegistrationYear:year,
      firstRegistrationDate:`${year}-05-17`}).profile?.id,test.id);
  }

  const negatives:ReadonlyArray<readonly [string,Partial<EstimateMatchInput>]>= [
    ["before-source-period",{firstRegistrationYear:test.yearFrom-1,
      firstRegistrationDate:`${test.yearFrom-1}-05-17`}],
    ["after-generation",{firstRegistrationYear:2016,firstRegistrationDate:"2016-05-17"}],
    ["RFB body new Megane IV",{type:"RFB"}],
    ["B9 IV body",{type:"B9"}],
    ["empty body code",{type:undefined}],
    ["conflicting RFB variant",{variant:"RFB"}],
    ["conflicting B9 execution",{execution:"B9"}],
    ["conflicting IV badge",{model:"MEGANE IV"}],
    ["Megane RS badge",{model:"MEGANE RS"}],
    ["Megane Estate unreviewed name",{model:"MEGANE ESTATE"}],
    ["Clio sibling",{model:"CLIO"}],
    ["Kadjar sibling",{model:"KADJAR"}],
    ["Nissan Juke sibling",{make:"NISSAN",model:"NISSAN JUKE",type:"F15"}],
    ["original other power",{registeredPower:{value:test.kw===85?97:85,unit:"kW"}}],
    ["original other 96 kW",{registeredPower:{value:96,unit:"kW"}}],
    ["original +1 kW",{registeredPower:{value:test.kw+1,unit:"kW"}}],
    ["original -1 kW",{registeredPower:{value:test.kw-1,unit:"kW"}}],
    ["PS unit not authoritative",{registeredPower:{value:test.stockHp,unit:"PS"}}],
    ["missing original kW",{registeredPower:null,powerHp:test.stockHp}],
    ["1198cc brochure rounded not registered",{displacementCc:1198}],
    ["1199cc unrelated",{displacementCc:1199}],
    ["1149cc older 1.2",{displacementCc:1149}],
    ["missing cc",{displacementCc:undefined}],
    ["3 cylinders",{cylinders:3}],
    ["diesel",{fuel:"Diesel"}],
    ["LPG mix",{fuel:"Benzine / LPG"}],
    ["CNG",{fuel:"CNG"}],
    ["petrol hybrid",{fuel:"Benzine / Elektriciteit"}],
    ["E85 not standard",{fuel:"E85"}],
    ["stock torque conflict",{stockTorqueNm:test.stockNm+30}],
    ["conflicting year/date",{firstRegistrationYear:test.yearTo}],
    ["invalid date",{firstRegistrationDate:"2014-02-30",firstRegistrationYear:undefined}],
  ];
  for(const [name,patch] of negatives){
    // The competing 130 PS registration is allowed to match its OWN independent
    // configuration, but never the wrong 115/130 published tuning output.
    const x=resolveRdwTuningEstimate({...input,...patch});
    assert.notEqual(x.profile?.id,test.id,`${test.id}: ${name}`);
    negativeChecks++;
  }
  const rows=frozen.rows.filter(row=>
    row.vehicle.merk==="RENAULT"&&row.vehicle.handelsbenaming==="MEGANE"&&
    row.vehicle.type==="Z"&&Number(row.vehicle.cilinderinhoud)===1197&&
    Number(row.vehicle.aantal_cilinders)===4&&
    row.fuels.some((f:{brandstof_omschrijving?:string;nettomaximumvermogen?:string})=>
      f.brandstof_omschrijving==="Benzine"&&Number(f.nettomaximumvermogen)===test.kw));
  assert.equal(rows.length,test.total,"Fixed preselected 1.2 TCe cohort unchanged");
  const found:Record<number,number>={};
  for(const row of rows){
    // Only a fake QA plate reaches the server pure normalizer; no real plate,
    // record ID, sample ID, VIN or individual year+variant row is output.
    const normalized=normalizeRdwVehicle(row.vehicle,row.fuels,"QA00M3");
    assert.equal(normalized.vehicle.engine.powerKw,test.kw);
    assert.equal(normalized.vehicle.engine.powerHp,test.stockHp);
    assert.equal(normalized.tuningEstimate.profile?.id,test.id);
    assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].powerRangeHp,test.power);
    assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].torqueRangeNm,test.torque);
    const year=normalized.vehicle.registration.firstAdmissionYear!;
    found[year]=(found[year]??0)+1;
  }
  assert.deepEqual(found,test.expected);
}
const regressions=[
  {make:"AUDI",model:"AUDI A3",type:"8P",cc:1390,kw:92,year:2010,cyl:4,fuel:"Benzine",id:"rdw-audi-a3-8p-14-tfsi-125"},
  {make:"AUDI",model:"AUDI A1",type:"8X",cc:1197,kw:63,year:2011,cyl:4,fuel:"Benzine",id:"rdw-audi-a1-8x-12-tfsi-86"},
  {make:"AUDI",model:"AUDI A1",type:"8X",cc:1390,kw:90,year:2011,cyl:4,fuel:"Benzine",id:"rdw-audi-a1-8x-14-tfsi-122"},
  {make:"SKODA",model:"OCTAVIA",type:"5E",cc:1395,kw:103,year:2014,cyl:4,fuel:"Benzine",id:"rdw-skoda-octavia-5e-14-tsi-140"},
  {make:"SKODA",model:"OCTAVIA",type:"1Z",cc:1390,kw:90,year:2011,cyl:4,fuel:"Benzine",id:"rdw-skoda-octavia-1z-14-tsi-122"},
  {make:"SEAT",model:"LEON",type:"5F",cc:999,kw:85,year:2017,cyl:3,fuel:"Benzine",id:"rdw-seat-leon-5f-10-tsi-85kw"},
  {make:"NISSAN",model:"NISSAN JUKE",type:"F15",cc:1197,kw:85,year:2017,cyl:4,fuel:"Benzine",id:"rdw-nissan-juke-f15-12-digt-85kw"}
] as const;
for(const app of regressions){
  const r=resolveRdwTuningEstimate({make:app.make,model:app.model,
    type:app.type,displacementCc:app.cc,cylinders:app.cyl,fuel:app.fuel,
    registeredPower:{value:app.kw,unit:"kW"},
    firstRegistrationYear:app.year,firstRegistrationDate:`${app.year}-05-17`});
  assert.equal(r.profile?.id,app.id,"Existing application unchanged: "+app.id);
}
console.log("MEGANE_Z_RDW_PASS: two exact petrol 85/97 kW III Z applications; "+
  "16/16 frozen observations, "+negativeChecks+" adversarial negatives, "+
  regressions.length+" existing regressions, RFB IV and Stage 2/3 excluded.");
