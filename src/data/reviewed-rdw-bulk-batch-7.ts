/**
 * Reviewed van RDW batch 7, 2026-10-09.
 *
 * Five distinct technical model/motor clusters, eight exact year/type cohorts.
 * Source values are independently published Stage 1 INDICATIONS, not validated
 * ECU mappings or NoordTune measured dyno results. Original kW from RDW,
 * original Nm from third-party supplier publications only.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";

const cite=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string)=>({
  provider,title,url,stage1Hp,stage1Nm,scope,retrievedAt:"2026-10-09"
});
const conditions="Published results are NOT measurements or tuning guarantees for a NoordTune customer. Original RDW type, original kW, fuel, cc, cylinder count and year must match; vehicle-specific engine generation, installed ECU, firmware, transmission and Euro phase still require workshop diagnostics. Emissions controls (DPF/EGR/SCR/AdBlue) must remain road-legal and functional. No Stage2/Stage3 numeric figures are inferred.";
const seeds:readonly Seed[]=[
 {
  id:"rdw-bulk-7-mercedes-vito-6394-20-116cdi163-2023",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/4",from:2023,to:2023,
  cc:1950,cylinders:4,kw:120,stockNm:380,
  engine:"Mercedes Vito 116 CDI 2.0 OM654 candidate 1950cc / 120kW / marketed 163PS, 2023 Euro 6 D-full conditional",
  fuel:"Diesel",power:[200,200],torque:[440,440],profileIds:[],
  extras:[
    cite("br-performance","BR-Performance Vito W447 2020–2024 116 CDI Euro 6 D-full from 10/2021","https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/37-mercedes/1892-vito/11163-w447-2020-2024/13581-116-cdi-euro-6-d-full-10-2021/",200,440,
    "Vito W447 116 CDI 163PS/380Nm, Euro6 D-full from 10/2021, normal Stage1 200PS/440Nm; original 120kW matches nominal 163PS."),
    cite("ecu-soft","ECU-Soft Vito 2020–2024 116 CDI Euro 6 D-full 163","https://www.ecu-soft.be/chiptuning/mercedes/vito/11163/116-cdi-euro-6-d-full-10-2021-163-16747",200,440,
    "W447 2020–2024 116 CDI Euro6 D-full from 10/2021 original163/380, published Stage1 200/440 with ECU unlock conditional.")
  ],
  scope:"ONLY first registration 2023 and RDW type 639/4 VITO, 1950cc, 120kW diesel. Vito 2024 Euro6e requires its separate calibration, while W447 marketing chassis and Euro6 phase cannot be proven by RDW type alone. ATM's older 2143cc 116 CDI is EXCLUDED. "+conditions
 },
 {
  id:"rdw-bulk-7-mercedes-vito-6394-20-116cdi163-euro6e-2024",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/4",from:2024,to:2024,
  cc:1950,cylinders:4,kw:120,stockNm:380,
  engine:"Mercedes Vito 116 CDI 1.95D 2024 Euro6e conditional 1950cc 120kW marketed 163PS",
  fuel:"Diesel",power:[200,200],torque:[440,440],profileIds:[],
  extras:[
    cite("br-performance","BR-Performance Vito 2024 Euro6e 116 CDI 163 Stage1","https://www.br-performance.lu/en-lu/chiptuning/1-cars/37-mercedes/1892-vito/13011-2024/18073-116-cdi-1-95d-euro-6e/",200,440,
    "2024 Vito 116 CDI 1.95D Euro6e marketed163PS/380Nm, published 200PS/440Nm ordinary Stage1."),
    cite("van-drie-performance","Van Drie Vito 2024 Euro6e 116 CDI 163","https://vandrieperformance.nl/voertuigen/mercedes-vito-2024-0-116-cdi-1-95d-euro-6e-163pk/",200,440,
    "2024 onwards Vito 116 CDI 1.95D Euro6e 163PS/380Nm, vendor indication 200PS/440Nm, measured result is vehicle-specific.")
  ],
  scope:"Only 2024 VITO 639/4 exact 120kW/1950cc diesel; manufacturers do not imply Euro6e installed ECU from type/first registration alone. Do not reuse 2023 Euro6 D-full ECU or high 250PS Stage1 publications. "+conditions
 },
 {
  id:"rdw-bulk-7-mercedes-vito-6392-20-119cdi190-2020",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/2",from:2020,to:2020,
  cc:1950,cylinders:4,kw:140,stockNm:440,
  engine:"Mercedes Vito W447 119 CDI OM654 2.0 1950cc 140kW marketed 190PS, 2020 Euro6 D-temp conditional",
  fuel:"Diesel",power:[270,280],torque:[550,570],profileIds:[],
  extras:[
    cite("atm-chiptuning","ATM Vito 119 CDI 190 ordinary Stage1 270/550","https://www.atm-chiptuning.com/chiptuning/mercedes-benz-vito-119-cdi-190pk/",270,550,
    "Vito 2020-on 119CDI original190PS/440Nm, ordinary Stage1 270PS/550Nm, OM654 1950cc ECU MD1CP001/EDC17C66."),
    cite("br-performance","BR-Performance Vito 2020–2024 119 CDI Euro6 D-temp 280/570","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1892-vito/11163-w447-2020-2024/12205-119-cdi-1-95d-euro-6-d-temp/",280,570,
    "Vito W447 2020–2024 119 CDI Euro6 D-temp 190PS/440Nm, published Stage1 280PS/570Nm. Very large range; ECU/chassis/gearbox confirmation mandatory.")
  ],
  scope:"Exact VITO model RDW type639/2, 1950cc original140kW diesel admitted2020; supplier power disagreement 270 vs280PS and torque550 vs570Nm. This is NOT a universal or safe gearbox limit. No transfer of these higher Euro6 D-temp claims to later 2024 Euro6e. No W447 chassis inferred solely from type. "+conditions
 },
 {
  id:"rdw-bulk-7-mercedes-vito-6394-20-119cdi190-euro6e-2024",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/4",from:2024,to:2024,
  cc:1950,cylinders:4,kw:140,stockNm:440,
  engine:"Mercedes Vito 119 CDI 1.95D 2024 Euro6e candidate, original140kW marketed 190PS OM654",
  fuel:"Diesel",power:[250,250],torque:[550,550],profileIds:[],
  extras:[
    cite("br-performance","BR-Performance Vito 2024 Euro6e 119 CDI","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1892-vito/13011-2024/18075-119-cdi-1-95d-euro-6e/",250,550,
    "Vito 119 CDI 2024 Euro6e original190PS/440Nm, Stage1 250PS/550Nm in supplier catalog."),
    cite("van-drie-performance","Van Drie Vito 119 CDI Euro6e 2024","https://vandrieperformance.nl/voertuigen/mercedes-vito-2024-0-119-cdi-1-95d-euro-6e-190pk/",250,550,
    "Vito 119 CDI 1.95D Euro6e 2024 original190PS/440Nm, advertised stage 250PS/550Nm; specific owner vehicle must be dyno/ECU confirmed.")
  ],
  scope:"Only VITO RDW type639/4, 1950cc, 140kW Diesel first admitted2024, with confirmed Euro6e before ECU acceptance. Different 2020 D-temp supplier figures must NOT be carried forward. "+conditions
 },
 {
  id:"rdw-bulk-7-mercedes-sprinter-906bb35-20-317cdi170-2023-24",
  make:"Mercedes-Benz",model:"Sprinter",rdwModel:"SPRINTER",type:"906BB35",from:2023,to:2024,
  cc:1950,cylinders:4,kw:125,stockNm:380,
  engine:"Mercedes Sprinter 317 CDI 2.0 OM654 1950cc, original125kW marketed170PS, Euro6 D-full conditional 2023–24",
  fuel:"Diesel",power:[190,190],torque:[430,430],profileIds:[],
  extras:[
    cite("atm-chiptuning","ATM Sprinter 217/317/517 CDI Euro6 170 ordinary Stage1","https://www.atm-chiptuning.com/chiptuning/mercedes-benz-sprinter-217317517-cdi-eur6-170pk/",190,430,
    "Sprinter Euro6 217/317/517 CDI 170PS original380Nm 1950cc Bosch MD1CP001, normal Stage1 190PS/430Nm. ATM other generic 317 page shows 220/480 with mixed ECU scope and is excluded."),
    cite("br-performance","BR-Performance Sprinter 217/317/517 CDI Euro6 D-full from 2021","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/11639-11-2021/13611-217-317-517-cdi-euro-6-d-full/",190,430,
    "Sprinter 11/2021+ 217/317/517 CDI Euro6 D-full original170/380, advertised Stage1 190PS/430Nm.")
  ],
  scope:"Strict RDW first-admission2023–24 model SPRINTER type906BB35 1950cc registered125kW diesel, engine OM654 317 CDI candidate. RDW type does NOT identify W907/W910 or true Euro6 phase. Two explicit Euro6D-full sources agree at190/430, but another generic ATM 317 page states220/480 with unspecified ECU phase: EXCLUDED. Owner diagnostic check required. "+conditions
 },
 {
  id:"rdw-bulk-7-peugeot-expert-v-20bluehdi145-2022",
  make:"Peugeot",model:"Expert",rdwModel:"EXPERT",type:"V",from:2022,to:2022,
  cc:1997,cylinders:4,kw:106,stockNm:370,
  engine:"Peugeot Expert III 2.0 BlueHDi 145 marketing, RDW registered106kW≈144PS 1997cc typeV Euro6.3 candidate2022",
  fuel:"Diesel",power:[180,180],torque:[420,420],profileIds:[],
  extras:[
    cite("atm-chiptuning","ATM Peugeot Expert/Traveller 2.0 BlueHDi145","https://www.atm-chiptuning.com/chiptuning/peugeot-expert-traveller-20-bluehdi-145pk/",180,420,
    "Expert III BlueHDi145 original145PS/379Nm 1997cc Delphi DCM7.1A, Stage1 180PS/420Nm. Original Nm 379 differs from Euro6.3 source 370."),
    cite("br-performance","BR Expert/Traveller 2.0 BlueHDi Euro6.3 145 Stage1","https://www.br-performance.lu/en-lu/chiptuning/1-cars/43-peugeot/2328-expert-traveller/11175-2019-2024/13115-2-0-bluehdi-euro-6-3-2021/",180,420,
    "2019–2024 Expert/Traveller Euro6.3 from2021 original145PS/370Nm, Stage1 180PS/420Nm. No proof of individual ECU; stage application conditional."),
    cite("ecu-soft","ECU-Soft Expert/Traveller 2019–24 2.0 BlueHDi145 Euro6.3","https://ecu-soft.be/chiptuning/peugeot/expert-traveller/11175/2-0-bluehdi-euro-6-3-2021-145-16281",180,420,
    "Exact Expert 2019–24 Euro6.3 (2021-on), original145PS/370Nm, advertised Stage1 180PS/420Nm.")
  ],
  scope:"Expert III typeV 1997cc registered106kW diesel from2022, marketing145PS but RDW mathematical conversion rounds144PS. Original supplier torque mismatch370/379Nm; 370 is BR/ECU source reference, NOT RDW fact. Check DCM7.1A, actual Euro6.3, SCR/DPF and gearbox. No older 2.0 150, newer2024 Euro6e or brand transfer to Proace. "+conditions
 },
 {
  id:"rdw-bulk-7-peugeot-expert-v-20bluehdi145-2024",
  make:"Peugeot",model:"Expert",rdwModel:"EXPERT",type:"V",from:2024,to:2024,
  cc:1997,cylinders:4,kw:106,stockNm:370,
  engine:"Peugeot Expert 2.0 BlueHDi145 2024 facelift, RDW106kW≈144PS, 1997cc, later ECU/emissions version pending diagnosis",
  fuel:"Diesel",power:[180,180],torque:[420,420],profileIds:[],
  extras:[
    cite("ecu-soft","ECU-Soft Expert/Traveller 2024–2026 2.0 BlueHDi145","https://ecu-soft.be/chiptuning/peugeot/expert-traveller/13067/2-0-bluehdi-145-21469",180,420,
    "2024 onward Expert/Traveller 2.0 BlueHDi145 original145PS/370Nm, normal Stage1 180PS/420Nm; ECU unlock status variable."),
    cite("atm-chiptuning","ATM Expert 2.0 BlueHDi145 standard Stage1","https://www.atm-chiptuning.com/chiptuning/peugeot-expert-traveller-20-bluehdi-145pk/",180,420,
    "Expert 2.0 BlueHDi145 original145PS/379Nm, Stage1 180PS/420Nm. ATM has no 2024 Euro phase confirmed so installed ECU remains mandatory check.")
  ],
  scope:"2024 RDW Expert typeV 1997cc106kW diesel only, marketed145. Source 2024 ECU-Soft with independent generic ATM reference (same output), but exact installed Euro6e/Euro6.3 and DCM ECU MUST be checked. No source suggests applying 2022 calibration file blindly. "+conditions
 },
 {
  id:"rdw-bulk-7-fiat-ducato-250-23multijet120-2020-21",
  make:"Fiat",model:"Ducato",rdwModel:"FIAT DUCATO",type:"250",from:2020,to:2021,
  cc:2287,cylinders:4,kw:88,stockNm:320,
  engine:"Fiat Ducato 2.3 MultiJet 120PS marketing, RDW88kW≈120PS, 2287cc, Euro6 F1AGL411 candidate2020–2021",
  fuel:"Diesel",power:[200,203],torque:[460,462],profileIds:[],
  extras:[
    cite("bsr","BSR Fiat Ducato 2.3 MultiJet Euro6 F1AGL411 120hp","https://en.bsr.se/tuning-kits/t/4549/fiat-ducato-23-120hp-multijet-euro6-f1agl411",203,462,
    "2.3 120 MultiJet Euro6 F1AGL411 marketing120PS, BSR original122PS/323Nm, tuned203PS/462Nm, individual firmware check."),
    cite("mychiptuningfiles","MyChiptuningFiles Fiat Ducato 2.3 MultiJet120 88kW","https://mychiptuningfiles.com/en/chiptuning-files/fiat/fiat-ducato/fiat-ducato-2-3-multijet-120hp",200,460,
    "Fiat Ducato 2.3 MultiJet120 original120PS/320Nm 88kW, supplier Stage1 200PS/460Nm; page lacks Euro6 phase proof, so mechanical ECU confirmation mandatory.")
  ],
  scope:"Only 2020–21 FIAT DUCATO 250 2287cc registered88kW diesel. BSR's 122/323 manufacturer-original reference differs from marketing120/320; original RDW converted power is120PS, Nm remains supplier-origin only. Both vendors publish Stage1 200–203PS/460–462Nm, potentially high for loaded camper: not an approved safe torque limit. ECU F1AGL411/Euro6 software and transmission must be checked before any owner recommendation. "+conditions
 }
];
export const reviewedRdwBulkBatch7=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch7Count=reviewedRdwBulkBatch7.length;
