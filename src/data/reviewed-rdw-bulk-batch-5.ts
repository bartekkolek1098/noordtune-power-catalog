/**
 * Fifth reviewed RDW batch: exact NL company-van engine applications.
 * Data is explicitly selected from the 3,000-row frozen technical RDW sample
 * and individually reviewed tuner pages (no copying values across brands).
 *
 * DO NOT mix Euro phases, ECU packages or transmissions by model name.
 * Original kW and displacement from RDW. Original Nm only from publishers.
 * Ordinary Stage 1 numbers are references, not NoordTune measured results.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const retrievedAt="2026-10-09";
const source=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string)=>({
 provider,title,url,stage1Hp,stage1Nm,scope,retrievedAt
});
const mandatory="Each Stage 1 reference is an external publisher claim, not NoordTune dyno output or a guaranteed calibrated power. Confirm exact engine code, ECU firmware and possible gearbox torque cap by diagnostic scan. Preserve road-legal DPF/EGR/SCR and AdBlue operation. Stage 2/3 numerics are NOT included.";
const seeds:readonly Seed[]=[
 {
  id:"rdw-bulk-5-ford-custom-fcc-22tdci100-2015-16",
  make:"Ford",model:"Transit Custom",rdwModel:"TRANSIT CUSTOM",type:"FCC",from:2015,to:2016,
  cc:2198,cylinders:4,kw:74,stockNm:310,engine:"Ford Transit Custom I 2.2 TDCi 100 marketed / 74 kW rounds to 101 metric PS, Duratorq/Puma 2198 cc diesel",
  fuel:"Diesel",power:[180,180],torque:[420,420],profileIds:[],
  extras:[
   source("atm-chiptuning","ATM Transit Custom 2013-2016 2.2 TDCi 100", "https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-22-tdci-100pk/",180,420,"Exact Custom, 2198 cc, 100PS marketing/310Nm original, ordinary Stage1 180PS/420Nm. ECU SID208; not later EcoBlue 2.0."),
   source("van-drie-performance","Van Drie Transit Custom 2012-2016 2.2 TDCi 100","https://vandrieperformance.nl/voertuigen/ford-transit-custom-2012-2016-2-2-tdci-100pk/",180,420,"Custom 2.2 TDCi 2012-2016, 100PS/310Nm original, indicative Stage1 180PS/420Nm; separate from customer-specific dyno readings.")
  ],
  scope:"Original RDW type FCC, exactly 2198cc/74kW diesel, only first admissions 2015-2016 within matching original Custom 2.2 generation. RDW rounds marketing 100PS to 101 metric PS. Verify Puma 2.2 DRFF ECU SID208, injection, emissions and manual gearbox; no later 2.0 EcoBlue, hybrid, Transit van or unstated ECU. "+mandatory
 },
 {
  id:"rdw-bulk-5-ford-custom-fcc-22tdci125-2016",
  make:"Ford",model:"Transit Custom",rdwModel:"TRANSIT CUSTOM",type:"FCC",from:2016,to:2016,
  cc:2198,cylinders:4,kw:92,stockNm:330,engine:"Ford Transit Custom I 2.2 TDCi 125 marketed / 92 kW / 2198 cc Duratorq/Puma diesel",
  fuel:"Diesel",power:[180,180],torque:[420,420],profileIds:[],
  extras:[
   source("atm-chiptuning","ATM Transit Custom 2.2 TDCi 125", "https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-22-tdci-125pk/",180,420,"Transit Custom 2013-2016, 125PS/330Nm stock, Stage1 180PS/420Nm, 2198cc and engine CYFF, subject to ECU readout."),
   source("ecu-soft","ECU-Soft Transit / Transit Custom 2013-2016 2.2 TDCi125","https://www.ecu-soft.be/chiptuning/ford/transit-transit-custom/5931/2-2-tdci-125-5971",180,420,"Transit/Custom 2013-2016, marketed 125PS/330Nm, stage1 180PS/420Nm; RDW technical type FCC distinguishes Custom rather than standard Transit.")
  ],
  scope:"Only 2016 RDW Custom type FCC, 2198cc/92kW diesel. The 125PS marketing name is consistent with 92kW rounded. Do not reassign to 2.0 EcoBlue, Tourneo or different gearbox; confirm 2.2 Puma CYFF and actual SID ECU. "+mandatory
 },
 {
  id:"rdw-bulk-5-ford-custom-fcc-20ecoblue130-2020",
  make:"Ford",model:"Transit Custom",rdwModel:"TRANSIT CUSTOM",type:"FCC",from:2020,to:2020,
  cc:1995,cylinders:4,kw:95.6,stockNm:385,engine:"Ford Transit Custom I facelift 2.0 EcoBlue 130PS marketing / 95.6kW / 1995cc RDW diesel (nominal 1996cc in tuner materials)",
  fuel:"Diesel",power:[170,190],torque:[430,440],profileIds:[],
  extras:[
   source("atm-chiptuning","ATM Transit Custom 2019+ EcoBlue 130 conservative Stage1","https://www.atm-chiptuning.com/chiptuning/ford-transit-custom-20-tdci-ecoblue-130pk-11631/",170,430,"2019-2023 2.0 EcoBlue 130PS/385Nm original, ordinary Stage1 170PS/430Nm, engine listed as nominal 1996cc. Note ATM also has a different 2017-2018 calibration at 190/460; it is excluded."),
   source("ecu-soft","ECU-Soft Transit Custom 2019-2022 2.0 EcoBlue 130","https://www.ecu-soft.be/chiptuning/ford/transit-custom/14309/2-0-ecoblue-130-26217",190,440,"2019-2022 Transit Custom 2.0 EcoBlue 130PS/385Nm original, normal Stage1 190PS/440Nm; indicative source, not installed ECU proof."),
   source("van-drie-performance","Van Drie Transit Custom 2019-2022 2.0 EcoBlue 130","https://vandrieperformance.nl/voertuigen/ford-transit-custom-2019-2022-2-0-ecoblue-130pk/",190,440,"2019-2022 Custom 130PS/385Nm original, indicative 190PS/440Nm Stage1. This publisher is not proof the exact 2020 vehicle is non-mild-hybrid.")
  ],
  scope:"Only 2020 RDW type FCC, 1995cc/95.6kW diesel. Tuner nominal 1996cc is a 1cc marketing/source discrepancy, not a different RDW fact. Two providers differ by 20PS/10Nm; keep FULL conservative 170-190PS/430-440Nm range and mandatory owner review. IMPORTANT: EcoBlue Micro Hybrid/mHEV vs non-hybrid, ECU firmware SID family, DPF/SCR and manual/automatic gearbox MUST be individually checked; RDW fuel alone cannot prove electrification. "+mandatory
 },
 {
  id:"rdw-bulk-5-mercedes-sprinter-906bb35-21cdi143-2018",
  make:"Mercedes-Benz",model:"Sprinter",rdwModel:"SPRINTER",type:"906BB35",from:2018,to:2018,
  cc:2143,cylinders:4,kw:105,stockNm:330,engine:"Mercedes-Benz Sprinter W906 214/314 CDI OM651 2.1 diesel 2143cc/105kW marketed 143PS",
  fuel:"Diesel",power:[190,200],torque:[430,480],profileIds:[],
  extras:[
   source("atm-chiptuning","ATM Sprinter 214/314 CDI 143 OM651 2143cc","https://www.atm-chiptuning.com/chiptuning/mercedes-benz-sprinter-214314-cdi-143pk/",190,430,"Sprinter 214/314 CDI OM651 M651 DE22, 2143cc, stock 143PS/330Nm, stage1 190PS/430Nm. Publisher does not distinguish W906 and W907 automatically."),
   source("br-performance","BR-Performance Sprinter W906 2016-2018 214/314 CDI 143","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8734-214-314-cdi/",200,480,"2016-2018 W906 214/314 CDI 143PS/330Nm, standard Stage1 200PS/480Nm, different output than ATM and not a gearbox-safe guarantee.")
  ],
  scope:"Strictly first-admission 2018 RDW type 906BB35, 2143cc/105kW Diesel, inspected W906 OM651 214/314 candidate. W907/W910 2018-2021 and new OM654 1950cc may share names but are NOT automatically this source generation. Published sources disagree by 10PS/50Nm; never guarantee upper torque on overloaded Sprinter. Confirm actual W906 generation, OM651, ECU CRD3 variants, SCR, transmission and build phase by scan; no automatic source assignment across 2019/2020 model overlap. "+mandatory
 },
 {
  id:"rdw-bulk-5-peugeot-expert-v-20bluehdi120-2018-19",
  make:"Peugeot",model:"Expert",rdwModel:"EXPERT",type:"V",from:2018,to:2019,
  cc:1997,cylinders:4,kw:90,stockNm:340,engine:"Peugeot Expert III 2.0 BlueHDi 120 marketed / 90kW RDW converts to 122 metric PS, DW10 AH01 diesel 1997 cc",
  fuel:"Diesel",power:[200,200],torque:[450,450],profileIds:[],
  extras:[
   source("atm-chiptuning","ATM Expert / Traveller III 2.0 BlueHDi 120","https://www.atm-chiptuning.com/chiptuning/peugeot-expert-traveller-20-bluehdi-120pk/",200,450,"2016-2019 Expert/Traveller BlueHDi 2.0, original 120PS marketing /340Nm, stage1 200PS/450Nm, code AH01 1997cc, ECU Delphi DCM6.2A/DCM7.1A."),
   source("shiftech","Shiftech Expert III 2016 2.0 BlueHDi 120 non-EU6d","https://www.shiftech.eu/en/chiptuning/car/peugeot/expert-traveller/2016-iii/diesel/2.0-bluehdi-120",200,450,"Expert/Traveller III 2016 model generation 120PS marketing / 320Nm source-original, stage1 200PS/450Nm. Different source-original torque; do not promise 320 or 340Nm as RDW fact."),
   source("tuningservice","Tuning Service Expert/Traveller III 2016-2019 2.0 BlueHDi 120","https://tuningservice.nl/chiptuning/peugeot/expert-traveller/2016-2019/20-bluehdi-120pk/",200,450,"Expert 2016-2019 1997cc 120PS/340Nm marketing, stage1 200PS/450Nm and Delphi DCM6.2A; verify exact EAT gearbox and SCR status.")
  ],
  scope:"Only Expert III RDW type V, 1997cc and registered 90kW, first admitted 2018-2019, diesel; 90kW mathematically 122 metric PS despite catalog marketing 120. Original published torque conflicts (Shiftech 320Nm versus ATM/TuningService 340Nm); the 340Nm value is a publisher reference only, not in RDW. Exclude Peugeot Expert II type X, newer 1.5 BlueHDi, Toyota Proace, Opel Vivaro and electric e-Expert even if chassis shared. Confirm actual DW10, DCM6.2A/DCM7.1A firmware, SCR/DPF, transmission load before use. "+mandatory
 }
];
export const reviewedRdwBulkBatch5=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch5Count=reviewedRdwBulkBatch5.length;
