// Server-only reviewed bulk RDW batch. These ARE NOT generated make/engine cross products.
// Each independent application has explicit original kW, cc, cylinders, fuel,
// body type, first-admission years, accepted provider evidence and owner review.
import {sourceMake, sourceModelFamily} from "../lib/sourced-tuning-match.ts";
import {sourcedTuningProfiles,tuningProfileSources} from "./tuning-profiles/index.ts";
import type {EstimateSourceReference} from "./tuning-estimates-shared.ts";

export type ExtraEvidence = {provider:string;title:string;url:string;stage1Hp:number;stage1Nm:number;scope:string};
export type Seed = {
  id:string; make:string; model:string; rdwModel:string; type:string;
  from:number; to:number; cc:number; cylinders:number; kw:number;
  stockNm:number; engine:string; fuel?:"Petrol"|"Diesel"; power:readonly [number,number]; torque:readonly [number,number];
  profileIds:readonly string[]; extras?:readonly ExtraEvidence[];
  scope:string;
};
const generalChecks="Verify installed engine-code and ECU software by scan, maintenance/fault history, genuine fuel grade, emissions/road compliance, and actual manual/DSG/EDC/EAT clutch torque limits before calibration or quoting. NO automatic Stage 2/Stage 3, E85, hybrid remap or gearbox tune. This is an external source indication, not a NoordTune dyno result or guarantee.";
const pureTech="Check PureTech timing belt in oil or fitted chain variant, oil quality/service history, GPF/OPF, wet-belt debris/pressure, EAT gearbox limits and ECU lock state before considering calibration.";
const vw="Require VAG ECU/firmware, RON98 as applicable, EA211/EA189 engine-code evidence, torque limits and manual versus DSG DQ200/DQ250 check.";
const mini="Check actual B38 engine, MEVD17 ECU variant, RON grade, ECU access and vehicle-specific manual/automatic clutch capacity; UKL-L is not an ECU decoder.";

const seeds:readonly Seed[]=[
  {id:"rdw-bulk-peugeot-2008-c-12-vti-82",make:"Peugeot",model:"2008",rdwModel:"2008",type:"C",from:2013,to:2015,cc:1199,cylinders:3,kw:60,stockNm:118,engine:"1.2 VTi PureTech 82 naturally aspirated 1199 cc",
    power:[90,90],torque:[125,125],profileIds:["sourced-peugeot-2008-0a8845a5eebf","sourced-peugeot-2008-f8f029666464"],
    scope:"2008 I, registered 60 kW / 1199 cc / C, 2013–2015; naturally aspirated so gains are modest. Independent Peugeot manufacturer original 82 PS/118 Nm; provider 116 Nm stock conflict disclosed. "+pureTech},
  {id:"rdw-bulk-peugeot-2008-u-12-puretech-130",make:"Peugeot",model:"2008",rdwModel:"2008",type:"U",from:2019,to:2020,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"1.2 PureTech 130 petrol turbo, 1199 cc",
    power:[145,150],torque:[250,270],profileIds:["sourced-peugeot-2008-241869f69283","sourced-peugeot-2008-b3940cf28f5b"],
    scope:"2008 II U, 2019–2020, original 96 kW marketed 130 PS (RDW arithmetic rounds to 131 PS). EAT gearboxes require separate torque cap; 270 Nm provider figure is not a safe gearbox promise. "+pureTech},
  {id:"rdw-bulk-peugeot-3008-m-12-puretech-130",make:"Peugeot",model:"3008",rdwModel:"3008",type:"M",from:2020,to:2020,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"1.2 PureTech 130 petrol turbo, 1199 cc, GPF check",
    power:[145,150],torque:[250,270],profileIds:["sourced-peugeot-3008-384c44b36e3e","sourced-peugeot-3008-d9c6695018a9"],
    scope:"3008 II facelift boundary 2020 and RDW type M, original 96 kW. Two source year phases are retained; same family has different ECU/GPF and automatic torque limitations. "+pureTech},
  {id:"rdw-bulk-peugeot-3008-m-16-puretech-180",make:"Peugeot",model:"3008",rdwModel:"3008",type:"M",from:2020,to:2020,cc:1598,cylinders:4,kw:133,stockNm:250,engine:"1.6 PureTech 180 petrol turbo GPF, 1598 cc (EP6 family)",
    power:[215,220],torque:[300,300],profileIds:["sourced-peugeot-3008-44d097b5a4fd","sourced-peugeot-3008-fc3e0dc6da8b"],
    scope:"3008 II phase transition 2020, exactly 133 kW/1598cc petrol, NON-HYBRID only; RDW rounds factory 133 kW to 181 PS though source calls it 180 PS. Confirm EP6 engine and EAT torque. "},
  {id:"rdw-bulk-peugeot-308-l-12-puretech-130",make:"Peugeot",model:"308",rdwModel:"308",type:"L",from:2017,to:2017,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"1.2 PureTech 130 petrol turbo EB2, 1199 cc",
    power:[145,145],torque:[270,270],profileIds:["sourced-peugeot-308-2398cc650647","sourced-peugeot-308-4ec05c29f7f9"],
    scope:"308 II/T9, registered type L and 2017 facelift boundary; both published phases give 145/270, EAT torque often capped at 250 Nm. Do not reuse on type F 308 III. "+pureTech},
  {id:"rdw-bulk-peugeot-308-f-12-puretech-110",make:"Peugeot",model:"308",rdwModel:"308",type:"F",from:2022,to:2022,cc:1199,cylinders:3,kw:81,stockNm:205,engine:"308 III 1.2 PureTech 110 petrol turbo EB2, 1199 cc",
    power:[145,145],torque:[260,260],profileIds:["sourced-peugeot-308-2f9b7c7f4f87"],
    extras:[{provider:"powerconcept",title:"Powerconcept Peugeot 308 III 2021-on 1.2 PureTech 110",url:"https://www.powerconcept.be/reprogrammation/peugeot/308/2021-g/12t-puretech-110hp",stage1Hp:145,stage1Nm:260,scope:"Model generation 2021+ 308 1.2 PureTech 110, original 110 PS / 205 Nm, 1199 cc, illustrative Stage 1 145 PS / 260 Nm."}],
    scope:"308 III type F 2022 original 81 kW (110 PS), not 308 II 110 PS or GPF/hybrid. Factory de-rating claim requires real engine ECU/ECU hardware confirmation. "+pureTech},
  {id:"rdw-bulk-peugeot-308-f-12-puretech-130",make:"Peugeot",model:"308",rdwModel:"308",type:"F",from:2022,to:2022,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"308 III 1.2 PureTech 130 petrol turbo EB2DTS, 1199 cc",
    power:[145,145],torque:[260,260],profileIds:["sourced-peugeot-308-1a1c9a0ab63d"],
    extras:[{provider:"gsg-performance",title:"GSG Performance Peugeot 308 III 2021-on 1.2 PureTech 130",url:"https://gsgperformance.com/car-detail/peugeot/308/2021/1-2t-puretech-130hp",stage1Hp:145,stage1Nm:260,scope:"Peugeot 308 2021+ 1.2T PureTech 130, original 130 PS/230 Nm, standard Stage 1 145 PS/260 Nm; independent publisher."},
      {provider:"powerconcept",title:"Powerconcept Peugeot 308 III 2021-on 1.2 PureTech 130",url:"https://www.powerconcept.be/reprogrammation/peugeot/308/2021-g/12t-puretech-130hp",stage1Hp:145,stage1Nm:260,scope:"308 2021+ 1199 cc 130 PS/230 Nm, Stage1 145 PS/260 Nm; source engine EB2DTS is not proof of installed ECU."}],
    scope:"308 III type F 2022 and exact 96 kW petrol (RDW rounds 131 PS, marketing 130). No 308 II or hybrid figures. "+pureTech},
  {id:"rdw-bulk-peugeot-5008-m-12-puretech-130",make:"Peugeot",model:"5008",rdwModel:"5008",type:"M",from:2020,to:2020,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"5008 II 1.2 PureTech 130 petrol turbo 1199 cc",
    power:[145,150],torque:[270,275],profileIds:["sourced-peugeot-5008-2a7382fd0032","sourced-peugeot-5008-fad1920bf249"],
    scope:"5008 II type M first admission 2020, source phase transition with same original 130/230. Engine/GPF/Valeo ECU revision and EAT gearbox torque to verify. "+pureTech},
  {id:"rdw-bulk-peugeot-208-u-12-puretech-130",make:"Peugeot",model:"208",rdwModel:"208",type:"U",from:2019,to:2019,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"208 II 1.2 PureTech 130 petrol turbo 1199 cc",
    power:[145,150],torque:[250,270],profileIds:["sourced-peugeot-208-5066b8663939"],
    scope:"208 II type U 2019, 96 kW marketed 130 PS. Valéo ECU and EAT8 torque constraints require readout; source stages exclude E85 and 208 I. "+pureTech},
  {id:"rdw-bulk-vw-polo-aw-10-tsi-95",make:"Volkswagen",model:"Polo",rdwModel:"POLO",type:"AW",from:2018,to:2020,cc:999,cylinders:3,kw:70,stockNm:175,engine:"Polo AW 1.0 TSI 95 PS/70 kW petrol EA211, 999 cc",
    power:[130,140],torque:[240,240],profileIds:["sourced-volkswagen-polo-02b3fbe75a9f","sourced-volkswagen-polo-c7848e484ecc","sourced-volkswagen-polo-74af54ed92b8"],
    scope:"Polo AW 70kW original 95 PS, manufacturer VW 2017/2018 says 175Nm both manual and DSG; one provider states 160Nm, so true individual torque must be confirmed. Dry-clutch DSG DQ200 may need materially lower torque than published upper bound. "+vw},
  {id:"rdw-bulk-vw-polo-aw-10-tsi-115",make:"Volkswagen",model:"Polo",rdwModel:"POLO",type:"AW",from:2019,to:2020,cc:999,cylinders:3,kw:85,stockNm:200,engine:"Polo AW 1.0 TSI 115 marketing / 85 kW petrol EA211, 999 cc",
    power:[130,130],torque:[240,240],profileIds:["sourced-volkswagen-polo-55c7721c75e9","sourced-volkswagen-polo-9ae4320dc206"],
    scope:"Polo AW original 85kW converts to 116 metric PS (115 marketing) and 200Nm external original torque. Manual/7-speed DSG dry clutch and RON-grade check required. "+vw},
  {id:"rdw-bulk-fiat-500-312-09-twinair-85",make:"Fiat",model:"500",rdwModel:"FIAT 500",type:"312",from:2015,to:2015,cc:875,cylinders:2,kw:63,stockNm:145,engine:"Fiat 500 312 0.9 TwinAir two-cylinder turbo petrol (875 cc)",
    power:[95,100],torque:[185,190],profileIds:["sourced-fiat-500-c72b67b7704f","sourced-fiat-500-ee5112c087f7"],
    scope:"500 type 312 0.9 TwinAir 85 PS marketing; RDW original 63kW rounds to 86 PS. Verify TwinAir 312A2000, Marelli 8GSF/8GSW, service/turbo and manual/robotised transmission. No 1.2 69 naturally aspirated numbers."},
  {id:"rdw-bulk-mini-cooper-ukll-15-136",make:"MINI",model:"Cooper",rdwModel:"COOPER",type:"UKL-L",from:2015,to:2017,cc:1499,cylinders:3,kw:100,stockNm:220,engine:"MINI Cooper F55/F56 1.5 turbo B38, 1499 cc, 136 PS",
    power:[165,165],torque:[270,310],profileIds:["sourced-mini-cooper-00f9e19eb586","sourced-mini-cooper-c447765b0355"],
    scope:"MINI Cooper original 100kW/1499cc 2015–2017, UKL-L RDW platform alone is not a model-specific ECU decoder. Two publishers quote 220 versus 230Nm original and Stage1 270 versus 310Nm; keep range and require workshop confirmation. "+mini},
  {id:"rdw-bulk-vw-tiguan-5n-20-tdi-177",make:"Volkswagen",model:"Tiguan",rdwModel:"TIGUAN",type:"5N",from:2014,to:2015,cc:1968,cylinders:4,kw:130,stockNm:380,engine:"Tiguan I type 5N 2.0 TDI 177 PS / 130 kW diesel EA189/EA288 check",
    power:[215,215],torque:[430,460],profileIds:["sourced-volkswagen-tiguan-03f89d1cd373","sourced-volkswagen-tiguan-de324d9cb7fb"],
    scope:"Tiguan first generation 5N 2014–2015 2.0 TDI 130kW/1968cc, 380Nm external original. Stage1 provider torque disagreement 430 vs460 requires individual DPF/legal emissions, engine family/ECU and manual/DSG torque review. "+vw},
  {id:"rdw-bulk-vw-transporter-7j0-t5-20-tdi-140",make:"Volkswagen",model:"Transporter",rdwModel:"TRANSPORTER",type:"7J0",from:2012,to:2014,cc:1968,cylinders:4,kw:103,stockNm:340,engine:"VW Transporter T5 facelift 2.0 TDI 140 PS / 103 kW diesel, 1968 cc",
    power:[180,185],torque:[410,410],profileIds:["sourced-volkswagen-transporter-56f7f95e8650","sourced-volkswagen-transporter-9fbc3f5cda45"],
    scope:"Only original admission 2012–2014, RDW type 7J0, T5 facelift, not ambiguous T5/T6 transition 2015 or T6 2016+. Providers differ on stock torque 320 vs340Nm; 340 Nm stock requires engine-code/ECU verification. DPF and gear/clutch suitability individual. "+vw}
];

const profileById=new Map(sourcedTuningProfiles.map(profile=>[profile.id,profile]));
const sourceById=new Map(tuningProfileSources.map(record=>[record.id,record]));
const unique=new Set<string>();
export function buildReviewedRdwBulkBatch(entries: readonly Seed[]) { return entries.map(seed=>{
  if(unique.has(seed.id))throw Error("Duplicate approved bulk RDW ID: "+seed.id);
  unique.add(seed.id);
  if(!/^rdw-bulk(?:2)?-/.test(seed.id)||seed.from>seed.to||seed.from<2008||seed.to>2026
    ||!seed.type||seed.cc<=0||seed.cylinders<=0||seed.kw<=0)throw Error("Incomplete reviewed bulk RDW scope "+seed.id);
  if(seed.power[0]>seed.power[1]||seed.torque[0]>seed.torque[1])throw Error("Invalid Stage1 envelope "+seed.id);
  const factoryPs=Math.round(seed.kw*1.359621617);
  const fuel = seed.fuel ?? ((seed.id.includes("-tdi-")||seed.id.includes("-dci-"))?"Diesel":"Petrol");
  const expectedModel=sourceModelFamily(sourceMake(seed.make),seed.model);
  const values:{provider:string;powerHp:number;torqueNm:number;ref:EstimateSourceReference}[]=[];
  const profiles=seed.profileIds.map(id=>{
    const profile=profileById.get(id);if(!profile)throw Error("Missing source dataset profile: "+id);
    if(sourceMake(profile.brand)!==sourceMake(seed.make)
      ||sourceModelFamily(sourceMake(profile.brand),profile.modelFamily)!==expectedModel
      ||profile.fuel!=="Petrol"&&profile.fuel!=="Diesel"
      ||profile.fuel!==fuel
      ||Math.abs(profile.stockPowerHp-factoryPs)>1.5
      ||(profile.stockTorqueNm!==undefined&&Math.abs(profile.stockTorqueNm-seed.stockNm)>20)
      ||(profile.displacementPrecision==="exact"?Math.abs(profile.displacementCc-seed.cc)>2:Math.abs(profile.displacementCc-seed.cc)>49)
      ||profile.electrification==="hybrid"||profile.electrification==="mild-hybrid"
      ||(profile.cylinders!==undefined&&profile.cylinders!==seed.cylinders)
      ||(profile.yearTo??2026)<seed.from||profile.yearFrom>seed.to){
      throw Error("Source and RDW technical identity mismatch for "+seed.id+" / "+id);
    }
    for(const src of profile.stage1.sourceValues){
      const observation=sourceById.get(src.sourceId);
      if(!observation||observation.status!=="retrieved"||observation.retrievalMethod==="search-index"
        ||!observation.url.startsWith("https://")||!src.torqueNm){
        throw Error("Missing actually retrieved source Stage 1 "+seed.id+"/"+src.sourceId);
      }
      values.push({provider:src.provider,powerHp:src.powerHp,torqueNm:src.torqueNm,
        ref:{title:observation.sourceName,sourceType:"tuner",retrievalMethod:"page",
          retrievedAt:observation.retrievedAt.slice(0,10),url:observation.url,
          scope:`${seed.make} ${seed.model} ${seed.engine}, external Stage 1 ${src.powerHp} PS / ${src.torqueNm} Nm, source-scope ${profile.generation}. Source-original ${profile.stockPowerHp} PS / ${profile.stockTorqueNm} Nm is not independently measured by NoordTune.`}});
    }
    return profile;
  });
  for(const ex of seed.extras??[]){
    if(!ex.url.startsWith("https://")||!ex.provider||ex.stage1Hp<=0||ex.stage1Nm<=0)throw Error("Bad reviewed extra source "+seed.id);
    values.push({provider:ex.provider,powerHp:ex.stage1Hp,torqueNm:ex.stage1Nm,
      ref:{title:ex.title,url:ex.url,sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",scope:ex.scope}});
  }
  const providers=[...new Set(values.map(v=>v.provider))];
  if(providers.length<2)throw Error("At least two independent Stage1 provider publishers required: "+seed.id);
  if(values.some(v=>v.powerHp<seed.power[0]||v.powerHp>seed.power[1]||v.torqueNm<seed.torque[0]||v.torqueNm>seed.torque[1]))
    throw Error("Reviewed frozen Stage1 envelope excludes a retrieved source value: "+seed.id);
  for(let year=seed.from;year<=seed.to;year++){
    if(!profiles.some(profile=>year>=profile.yearFrom&&year<=(profile.yearTo??2026))
       &&!(seed.extras?.length))throw Error("Unreviewed gap in source generation-year coverage: "+seed.id+"/"+year);
  }
  const refs=[...new Map(values.map(value=>[value.ref.url,value.ref])).values()];
  return {
    id:seed.id,make:seed.make,model:seed.model,generation:`${seed.type} reviewed RDW application`,
    yearFrom:seed.from,yearTo:seed.to,displacementCc:seed.cc,cylinders:seed.cylinders,
    registeredPowerKw:seed.kw,requiredRdwType:seed.type,allowedRdwModels:[seed.rdwModel],
    stockPowerHp:factoryPs,stockTorqueNm:seed.stockNm,fuel,
    engineLabel:seed.engine,
    requirements:`${generalChecks} ${seed.scope}`,
    powerRangeHp:[...seed.power] as [number,number],torqueRangeNm:[...seed.torque] as [number,number],
    sources:refs,
    reviewNote:`Bulk reviewer evidence ${providers.length} independent source publishers (${providers.join(", ")}); ${seed.scope} Original ${seed.kw} kW rounds to ${factoryPs} metric PS; source market names may use a different rounded PS. External factory torque ${seed.stockNm} Nm is not an RDW field. Stage 1 ${seed.power[0]}–${seed.power[1]} PS / ${seed.torque[0]}–${seed.torque[1]} Nm is a published indicator, not a guarantee or NoordTune dyno result. ECU, engine health, gearbox and emissions require owner-specific workshop confirmation. Stage 2/3 withheld.`
  };
}); }
export const reviewedBulkRdwApplications=buildReviewedRdwBulkBatch(seeds);
export const reviewedBulkRdwApplicationCount=reviewedBulkRdwApplications.length;
