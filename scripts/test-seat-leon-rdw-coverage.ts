import assert from "node:assert/strict";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {formatEstimateGain} from "../src/lib/estimate-copy.ts";

const input: EstimateMatchInput = {
  make:"SEAT",model:"LEON",fuel:"Benzine",
  registeredPower:{value:92,unit:"kW"},displacementCc:1390,cylinders:4,
  firstRegistrationYear:2010,firstRegistrationDate:"2010-03-18",type:"1P"
};
const result=resolveRdwTuningEstimate(input);
assert.equal(result.profile?.id,"rdw-seat-leon-1p-14-tsi-125");
assert.equal(result.profile?.generation,"1P facelift");
assert.equal(result.profile?.brand,"Seat");
assert.ok(result.profile?.model.startsWith("Leon "), "A Seat must not be labelled as BMW 1 Series");
assert.equal(result.profile?.stockPowerHp,125);
assert.equal(result.profile?.stockTorqueNm,200);
assert.equal(result.coverageClass,"B");
const stages=customerProfile(result.profile!).stages;
assert.deepEqual(stages.map(stage=>stage.name),["Stage 1","Stage 2"]);
assert.deepEqual(stages[0].powerRangeHp,[145,150]);
assert.deepEqual(stages[0].torqueRangeNm,[250,265]);
assert.equal(stages[0].quoteRequired,true);
assert.equal(stages[1].powerHp,undefined);
assert.equal(stages[1].torqueNm,undefined);
assert.equal(stages[1].powerRangeHp,undefined);
assert.equal(stages[1].torqueRangeNm,undefined);
assert.equal(resolveStageQuote(result.profile,stages[0]).kind,"on-request");
assert.equal(formatEstimateGain(stages[0],125,200,"pl"),"+20–25 KM / +50–65 Nm");
assert.equal(result.profile?.sourceReferences.length,3);
assert.ok(result.profile?.sourceReferences.every(source=>source.url?.startsWith("https://")));
assert.ok(result.reasonCodes.includes("SOURCE_OWNER_REVIEW_REQUIRED"));
assert.equal(result.profile?.verificationRequired,true);

const normalized=normalizeRdwVehicle({
 merk:"SEAT",handelsbenaming:"LEON",cilinderinhoud:"1390",aantal_cilinders:"4",
 datum_eerste_toelating_dt:"2009-10-15T00:00:00.000",type:"1P",
 aantal_deuren:"5",aantal_zitplaatsen:"5",eerste_kleur:"ZWART"
},[{brandstof_omschrijving:"Benzine",nettomaximumvermogen:"92"}],"QA0000");
assert.equal(normalized.vehicle.make,"SEAT");
assert.equal(normalized.vehicle.model,"LEON");
assert.equal(normalized.vehicle.engine.powerHp,125);
assert.equal(normalized.vehicle.engine.powerKw,92);
assert.equal(normalized.vehicle.registration.firstAdmissionYear,2009);
assert.equal(normalized.tuningEstimate.profile?.generation,"1P facelift");
assert.equal(normalized.tuningEstimate.profile?.id,"rdw-seat-leon-1p-14-tsi-125");
assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].powerRangeHp,[145,150]);

for(const [name,partial] of [
 ["2008 before facelift",{firstRegistrationYear:2008,firstRegistrationDate:"2008-03-18"}],
 ["2012 after narrow published scope",{firstRegistrationYear:2012,firstRegistrationDate:"2012-03-18"}],
 ["5F explicit generation",{model:"Leon 5F"}],
 ["KL explicit generation",{type:"KL"}],
 ["1M explicit generation",{type:"1M"}],
 ["wrong power",{registeredPower:{value:110,unit:"kW" as const}}],
 ["wrong cc",{displacementCc:1395}],
 ["wrong cylinders",{cylinders:3}],
 ["diesel",{fuel:"Diesel"}],
 ["CNG",{fuel:"CNG"}],
 ["different model",{model:"ALTEA"}],
 ["different make",{make:"Volkswagen"}],
 ["contradictory year",{firstRegistrationYear:2011}],
 ["invalid date",{firstRegistrationYear:undefined,firstRegistrationDate:"2010-02-30"}],
 ["conflicting stock torque",{stockTorqueNm:240}],
 ["unknown power unit",{registeredPower:null,powerHp:undefined}]
] as const){
 const other=resolveRdwTuningEstimate({...input,...partial});
 assert.notEqual(other.profile?.id,"rdw-seat-leon-1p-14-tsi-125",name);
}

const caddy=resolveRdwTuningEstimate({
 make:"Volkswagen",model:"CADDY",fuel:"CNG",
 registeredPower:{value:81,unit:"kW"},displacementCc:1395,cylinders:4,
 firstRegistrationYear:2019,firstRegistrationDate:"2019-06-25",type:"2KN"
});
assert.equal(caddy.profile?.id,"rdw-vw-caddy-iv-14-tgi-cng-110");
assert.ok(caddy.profile?.model.startsWith("Caddy "), "VW Caddy must not be labelled BMW 1 Series");

// Regression from a bounded, previously frozen public RDW technical sample.
 // No registration plate is read, logged or committed. This is not a fleet-wide rate.
const observed = (await import("../data/research/nl-top-groups-output-sample.json", {with:{type:"json"}})).default.rows
  .filter(row=>row.vehicle.merk==="SEAT" && row.vehicle.handelsbenaming==="LEON");
let sampleDirect=0,appScoped=0;
const recoveredYears=new Map<number,number>();
for(const row of observed){
  const sample=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
  const profile=sample.tuningEstimate.profile;
  const one=profile?.stages.find(stage=>stage.name==="Stage 1");
  if(one && (one.powerHp!==undefined||one.powerRangeHp!==undefined))sampleDirect++;
  if(profile?.id==="rdw-seat-leon-1p-14-tsi-125"){
    appScoped++;
    const year=sample.vehicle.registration.firstAdmissionYear!;
    recoveredYears.set(year,(recoveredYears.get(year)??0)+1);
    assert.equal(sample.vehicle.engine.displacementCc,1390);
    assert.equal(sample.vehicle.engine.powerHp,125);
    assert.equal(sample.vehicle.fuel,"Benzine");
  }
}
assert.equal(observed.length,144,"Frozen Seat Leon bounded sample size");
assert.equal(appScoped,15,"15 observed compatible pre-facelift/1P 125 PS registrations recover numeric output");
assert.equal(sampleDirect,71,"Seat Leon numeric Stage 1: original 44 + reviewed 1P 15 + 5F 1.0 TSI 12; all scopes independently tested");
assert.deepEqual(Object.fromEntries(recoveredYears),{"2009":8,"2010":7});

const bmw=resolveRdwTuningEstimate({
 make:"BMW",model:"118I",fuel:"Benzine",
 registeredPower:{value:100,unit:"kW"},displacementCc:1499,cylinders:3,
 firstRegistrationYear:2021,firstRegistrationDate:"2021-06-18",type:"F1H"
});
assert.equal(bmw.profile?.id,"rdw-bmw-118i-f40-136");
assert.ok(bmw.profile?.model.startsWith("1 Series F40"),"BMW label unchanged");

console.log("SEAT_LEON_RDW_PASS: 1P CAXC 125/200 -> 145–150/250–265, gain +20–25/+50–65, 16 negative scopes, correct Caddy/BMW model labels, no numerical Stage 2.");
