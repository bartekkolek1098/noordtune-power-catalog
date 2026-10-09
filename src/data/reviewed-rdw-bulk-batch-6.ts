/**
 * RDW batch 6 — scoped and independently published Stage 1 references.
 * Exact 3,000-row frozen cohort positive matches, no raw registrations.
 * Values are indicative supplier publications, not NoordTune dyno records.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const extra=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string)=>({
  provider,title,url,stage1Hp,stage1Nm,scope,retrievedAt:"2026-10-09"
});
const individual="Always confirm engine family, true ECU firmware and transmission/torque capacity, mechanical condition, applicable emissions phase and approved road use before any calibration. Published tuner figures are NOT a measured NoordTune output, guarantee, or ECU authorization. DPF/EGR/SCR/AdBlue remain functional; Stage 2/3 output withheld.";
const seeds:readonly Seed[]=[
 {
  id:"rdw-bulk-6-fiat-ducato-250-23multijet130-2013-15",
  make:"Fiat",model:"Ducato",rdwModel:"FIAT DUCATO",type:"250",
  from:2013,to:2015,cc:2287,cylinders:4,kw:96,stockNm:320,
  engine:"Fiat Ducato III 2.3 130 MultiJet, older 2011–2016-generation F1AE 2287cc diesel, RDW 96kW rounds 131 metric PS, marketed 130PS",
  fuel:"Diesel",power:[180,180],torque:[410,420],profileIds:[],
  extras:[
   extra("br-performance","BR Ducato III Mk2 2011–2016 130 MultiJet 131→180PS/320→410Nm","https://www.br-performance.be/en-be/chiptuning/1-cars/22-fiat/1025-ducato/4048-09-2011-2016/4050-130-multijet/",180,410,"Fiat Ducato III Mk2 09/2011–2016, marketed 130/131PS, published original 320Nm, standard Stage1 180PS/410Nm; NOT Euro6 2018."),
   extra("atm-chiptuning","ATM Ducato 2.3 MultiJet130 normal Stage1 180PS/420Nm","https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-130pk/",180,420,"Ducato 2.3 MultiJet original 130PS/320Nm, published 180PS/420Nm ordinary Stage1; version/fitted Marelli or Bosch ECU to confirm."),
   extra("revtuning","Revtuning Ducato 2.3 MultiJet130 2011–2016","https://revtuning.eu/nl/product/chiptuning-fiat-ducato-2-3-130-multijet-130hp-2011-2016",180,420,"2011–2016 Fiat Ducato 2.3 MultiJet130, original 130PS/320Nm, indicative Stage1 180PS/420Nm, F1AE0481N engine.")
  ],
  scope:"ONLY RDW FIAT DUCATO 250, 2287cc, 96kW, diesel, first admission 2013–2015 in older 130 MultiJet generation, not 2018-on Euro6 despite same kW. RDW 96kW mathematically converts to 131 metric PS, publisher often says 130. Source torque differences 410 vs 420Nm are retained, no arbitrary upper choice. F1AE0481N possible, ECU and gearbox individually confirm. "+individual
 },
 {
  id:"rdw-bulk-6-fiat-ducato-250-23multijet130-euro6-2018-19",
  make:"Fiat",model:"Ducato",rdwModel:"FIAT DUCATO",type:"250",
  from:2018,to:2019,cc:2287,cylinders:4,kw:96,stockNm:320,
  engine:"Fiat Ducato III 2.3 130 MultiJet Euro6, later 2016–2019 F1AGL411D 2287cc 96kW diesel, not 2011–2016 older calibration",
  fuel:"Diesel",power:[160,160],torque:[400,400],profileIds:[],
  extras:[
   extra("atm-chiptuning","ATM Ducato Euro6 2.3 130 MultiJet130 Stage1 160/400","https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-eur6-130pk/",160,400,"2.3 MultiJet Euro6 original 130PS/320Nm, Stage1 160PS/400Nm, ECU Marelli MJD9DF or Bosch EDC17C69; separate from older Stage1 180/420."),
   extra("revtuning","Revtuning Ducato 2.3 130 MultiJet Euro6 2016–2019","https://revtuning.eu/product/chiptuning-fiat-ducato-2-3-130-multijet-eur6-130hp-2016-2019",160,400,"2016–2019 2.3 130 Euro6 original 130PS/320Nm, Stage1 160PS/400Nm, F1AGL411D; source values indicative.")
  ],
  scope:"Only type 250 FIAT DUCATO with exact 96kW/2287cc diesel first registered 2018–2019, Euro6 F1AGL411D candidate. DO NOT inherit older 2013–2015 180PS. RDW first admission and fuel do not prove ECU or Euro6 revision, so check software/aftertreatment by scan. "+individual
 },
 {
  id:"rdw-bulk-6-mercedes-vito-6394-1950-114cdi136-2023",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/4",
  from:2023,to:2023,cc:1950,cylinders:4,kw:100,stockNm:330,
  engine:"Mercedes-Benz Vito 114 CDI 2.0D 1950cc Euro6 2021-on, original RDW 100kW≈136PS, type639/4 2023; ECU/Euro phase not inferred by type alone",
  fuel:"Diesel",power:[195,195],torque:[435,435],profileIds:[],
  extras:[
   extra("atm-chiptuning","ATM Vito 114 CDI 2.0D Euro6 2021-on 136→195PS/330→435Nm","https://www.atm-chiptuning.com/chiptuning/mercedes-benz-vito-114-cdi-20d-euro-6-2021-136pk/",195,435,"2021-on Mercedes Vito 114 CDI 1950cc, advertised stock 136PS/330Nm and Stage1 195PS/435Nm, Bosch MD1CP001; specific EU6 phases must be identified."),
   extra("nrstechniek","NRS Vito 114 CDI 2.0D Euro6 2021-on Stage1","https://www.nrstechniek.nl/vehicle-details/mercedes-benz/vito/2020/114-cdi-2-0d-euro-6-2021-136hp/",195,435,"Mercedes Vito 2020-on 114CDI (Euro6 2021-on) marketed 136PS/330Nm Stage1 195PS/435Nm; not proof 2024 Euro6e."),
   extra("dyno-chiptuningfiles","Dyno Vito 114 CDI 2.0 Euro6 2021-on","https://www.dyno-chiptuningfiles.com/chiptuning-file/mercedes-benz-vito-114-cdi-20d-euro-6-2021-136hp/",195,435,"Vito 114 CDI 1950cc Bosch MD1CP001 original136/330→195/435; external file claim only.")
  ],
  scope:"Exact VITO 639/4, 1950cc, original RDW 100kW, year 2023. Supplier standard Euro6 2021-on 114 CDI with 195/435; BR-Performance lists different 2020-2024 Euro6 D-temp at 220/480 and Shiftech post2020 editorial note differs from first-page 265/550. Those higher or differently phased tunes are NOT included. RDW type does NOT independently identify W447 or actual emissions Euro6 stage; hold quoted result conditional until MD1 ECU/emissions verified. "+individual
 },
 {
  id:"rdw-bulk-6-mercedes-vito-6394-1950-114cdi136-euro6e-2024",
  make:"Mercedes-Benz",model:"Vito",rdwModel:"VITO",type:"639/4",
  from:2024,to:2024,cc:1950,cylinders:4,kw:100,stockNm:330,
  engine:"Mercedes-Benz Vito 114 CDI 1.95D potential 2024 Euro6e 1950cc original100kW≈136PS; confirm actual homologated Euro6e and ECU first",
  fuel:"Diesel",power:[190,190],torque:[430,430],profileIds:[],
  extras:[
   extra("br-performance","BR Vito 114 CDI 1.95D 2024 Euro6e 136→190PS/330→430Nm","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1892-vito/13011-2024/18071-114-cdi-1-95d-euro-6e/",190,430,"Mercedes Vito 2024-on Euro6e 114CDI original136PS/330Nm standard Stage1 190PS/430Nm; excludes older Euro6 D-temp 220/480."),
   extra("ecu-soft","ECU-Soft Vito 2024–2026 114 CDI 1.95D Euro6e","https://www.ecu-soft.be/chiptuning/mercedes/vito/13011/114-cdi-1-95d-euro-6e-136-21237",190,430,"Vito 2024–26 Euro6e 136/330→190/430, distinct newer emissions firmware and unlock requirements."),
   extra("bortec","BORTEC Vito 114 CDI Euro6e from 2024 136→190","https://bortec-tuning.de/tuning/mercedes-benz/vito/2024/114-cdi-1.95d-euro-6e-136-ps/",190,430,"2024 and later Vito 114 CDI Euro6e 136/330→190/430 ordinary Stage1, vehicle-specific emissions ECU requires confirmation.")
  ],
  scope:"Only VITO type 639/4, 100kW original, 1950cc diesel, 2024. External sources explicitly refer to Euro6e; RDW sample fields do NOT decode the installed Euro6e ECU, so values remain conditional pending vehicle scan and individual year/ECU check. DO NOT transfer 2023 Euro6/D-temp 195/435 or older ECU stage 220/480 to 2024. "+individual
 },
 {
  id:"rdw-bulk-6-mercedes-sprinter-906bb35-1950-315cdi150-2020",
  make:"Mercedes-Benz",model:"Sprinter",rdwModel:"SPRINTER",type:"906BB35",
  from:2020,to:2020,cc:1950,cylinders:4,kw:110,stockNm:330,
  engine:"Mercedes-Benz Sprinter 315 CDI 2.0 OM654 candidate 1950cc, 110kW≈150PS, first admission2020 type906BB35; must confirm W907/W910 rather than infer from type",
  fuel:"Diesel",power:[190,190],torque:[430,430],profileIds:[],
  extras:[
   extra("atm-chiptuning","ATM Sprinter 315 CDI 150PS OM654 1950cc MD1CP001","https://www.atm-chiptuning.com/chiptuning/mercedes-benz-sprinter-315-cdi-150pk/",190,430,"Mercedes Sprinter 315 CDI original150PS/330Nm 1950cc Bosch MD1CP001 standard Stage1 190PS/430Nm; W907/2018 boundary check."),
   extra("dtx-chiptuning","DTX Sprinter 2018–2020 315 CDI 150 stage 190/430","https://dtxchiptuning.com/mercedes-benz/sprinter/2018-2020/mercedes-benz-sprinter-2018-2020-315-cdi-150hp/",190,430,"2018–2020 Sprinter 315 CDI150 original150PS/330Nm, stage190PS/430Nm; engine code and actual ECU must be scanned."),
   extra("br-performance","BR W910 2018–2021 Sprinter 315 CDI 150","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/9918-w910-06-2018-10-2021/12389-315-cdi-euro-6-d-full/",190,430,"W910 2018–2021 x15 CDI original150/330→190/430; RDW type906BB35 alone is NOT proof of W910.")
  ],
  scope:"Strictly RDW SPRINTER 906BB35, 1950cc, 110kW and first admission2020. Do not reuse 2.1 OM651 2143cc W906 or 315 CDI 1950 without confirmed OM654, original ECU, W907/W910 phase; RDW '906BB35' may not map directly to marketing chassis codes. Source power is conditional candidate, not ECU compatibility. "+individual
 },
 {
  id:"rdw-bulk-6-mercedes-sprinter-906bb35-1950-315cdi150-2024",
  make:"Mercedes-Benz",model:"Sprinter",rdwModel:"SPRINTER",type:"906BB35",
  from:2024,to:2024,cc:1950,cylinders:4,kw:110,stockNm:330,
  engine:"Mercedes-Benz Sprinter later 315 CDI OM654 1950cc diesel original110kW≈150PS, reviewed RDW type906BB35 first-admission2024",
  fuel:"Diesel",power:[190,190],torque:[430,430],profileIds:[],
  extras:[
   extra("vandrieperformance","Van Drie Sprinter 2021-on 315 CDI Euro6d Full 150","https://vandrieperformance.nl/voertuigen/mercedes-sprinter-2021-0-315-cdi-euro-6-d-full-150pk/",190,430,"Sprinter 2021-on 315 CDI150 original150/330→190/430 ordinary Stage1, contemporary emissions phase must be individually verified."),
   extra("dyno-chiptuningfiles","Dyno Sprinter 315 CDI 150 development report November 2024","https://www.dyno-chiptuningfiles.com/nl/tuning-projecten/stage-1-gereed-voor-de-mercedes-benz-sprinter/",190,430,"2024 technical publication for 315 CDI150 1950cc Bosch MD1CP001 original150PS/330Nm Stage1 190PS/430Nm."),
   extra("km-tuning","KM Tuning OM654 Sprinter x15 CDI 150 software","https://www.km-tuning.com/OM654-2.0T-Sprinter-x15-CDI-150-HP-Tuning-Software/SW10138",190,430,"OM654 2.0T x15 CDI150 original150PS/340Nm in this source; Stage1 190PS/430Nm, MRD1 unlock/ECU check required. Factory torque conflicts 330 vs 340 and source original is not RDW.")
  ],
  scope:"Only original RDW type906BB35, 1950cc, 110kW diesel year2024. Manufacturer OM654/MD1CP001/MRD1 ECU identification is NOT possible solely from this type and year; source original torque differs 330 vs 340Nm, so 330Nm here is a *source reference*, not RDW fact or vehicle truth. Do NOT apply W906 2143cc or W910 2018–21 files automatically. "+individual
 },
 {
  id:"rdw-bulk-6-peugeot-expert-v-20bluehdi180-2019-22",
  make:"Peugeot",model:"Expert",rdwModel:"EXPERT",type:"V",
  from:2019,to:2022,cc:1997,cylinders:4,kw:130,stockNm:400,
  engine:"Peugeot Expert III 2.0 BlueHDi 180 marketing/130kW RDW (~177 metricPS) DW10 diesel, type V first-admission 2019–2022, GPF/SCR phase check",
  fuel:"Diesel",power:[205,215],torque:[460,470],profileIds:[],
  extras:[
   extra("ecu-soft","ECU-Soft Expert/Traveller 2019–2024 2.0 BlueHDi180 normal Stage1","https://www.ecu-soft.be/chiptuning/peugeot/expert-traveller/11175/2-0-bluehdi-180-14955",205,460,"2019–2024 Expert/Traveller 2.0 BlueHDi180 original180PS/400Nm, indicative Stage1 205PS/460Nm; vendor page discusses external ECU unlock and lacks universal vehicle measured plot."),
   extra("unlimited-tuning","Unlimited Expert 2.0 BlueHDi180 Normal Stage1 215PS/470Nm","https://www.unlimitedtuning.nl/chiptuning-peugeot-expert-2-0-bluehdi-180-pk.html",215,470,"Expert 2.0 BlueHDi 180 original180PS/400Nm; NORMAL (not Extreme) tuning 215PS/470Nm; Eco and Xtreme intentionally excluded.")
  ],
  scope:"Exact Peugeot EXPERT type V diesel 1997cc registered130kW, first-admitted 2019–2022. 130kW≈177 metric PS RDW, while suppliers market 180. Ordinary Stage1 sources 205/460 and 215/470 not equivalent to extreme tune. Sources apply model family 2019–2024, but 2024 Euro6e firmware is NOT automatically matched. Exclude earlier type X, 1.5, Toyota Proace, Opel Vivaro, and e-Expert. Check fitted DW10/ECU, EAT8, SCR/DPF, actual power and restrictions. "+individual
 }
];
export const reviewedRdwBulkBatch6=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch6Count=reviewedRdwBulkBatch6.length;
