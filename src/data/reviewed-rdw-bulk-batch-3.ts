// Third RDW evidence batch: high-NET-GAP original engine configurations.
// Source statements are independent publisher Stage 1 indications, NOT NoordTune
// measurements or a promise that an unknown ECU/gearbox can accept the map.
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const src=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string)=>
  ({provider,title,url,stage1Hp,stage1Nm,scope});
const vag="Engine/ECU hardware and firmware, RON fuel, DSG/manual torque limits and emissions legality must be checked. Stages with separately tuned gearbox, ethanol fuel, more hardware or Stage2 are excluded.";
const japanese="Require engine code, installed petrol ECU, service/timing, fuel grade, emissions compliance and manual/CVT/x-Tronic gearbox torque review. Never transfer an otherwise similar Nissan sibling's tuning file.";
const psa="PureTech oil/wet timing belt or chain variant, fault codes, GPF and EAT automatic/manual clutch limits must be physically checked. Output is source-published, not an installed ECU approval.";
const sourceDisagreement="Published original torque differs across tuners and is not an RDW registration field; confirm actual factory engine and installed gearbox before quotation.";
const seeds:readonly Seed[]=[
 {id:"rdw-bulk-mazda-mx5-nc1-18-mzr-126",make:"Mazda",model:"MX-5",rdwModel:"MAZDA MX-5",type:"NC1",
  from:2007,to:2014,cc:1798,cylinders:4,kw:93,stockNm:167,
  engine:"Mazda MX-5 NC1 1.8 MZR naturally aspirated petrol, original 93 kW ~126 PS",
  power:[138,139],torque:[170,182],profileIds:[],
  extras:[
   src("br-performance","BR-Performance Mazda MX-5 NC 1.8 MZR 2006–2015","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/36-mazda/6639-mx5/6640-nc-2006-2015/6641-1-8-mzr/",138,182,"NC 2006–2015 original advertised 125 PS / 167 Nm, ordinary software Stage1 138 PS/182 Nm. Modified-testimonial intake/exhaust results excluded."),
   src("shiftech","Shiftech Mazda MX5 NC 2005 1.8 MZR 126","https://www.shiftech.eu/en/chiptuning/car/mazda/mx5/2005/petrol/1.8i-mzr-126",139,170,"NC1 1.8 MZR marketed126 PS, original 155Nm, ordinary Stage1 139PS/170Nm. E85, Stage2 hardware excluded.")
  ],scope:"No 2005 first admission (before BR NC 2006 source scope). Normally aspirated engine: modest gains. Original BR stock 167Nm versus Shiftech 155Nm: "+sourceDisagreement},
 {id:"rdw-bulk-vw-troc-a1-15tsi150-2020",make:"Volkswagen",model:"T-Roc",rdwModel:"T-ROC",type:"A1",
  from:2020,to:2020,cc:1498,cylinders:4,kw:110,stockNm:250,
  engine:"VW T-Roc I type A1 1.5 TSI 150 110kW 1498cc EA211 Evo petrol",
  power:[175,175],torque:[300,300],profileIds:[],
  extras:[
   src("br-performance","BR-Performance T-Roc I 2018–2020 1.5 TSI 150","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/9674-t-roc/9675-2018-2025/9630-1-5-tsi/",175,300,"T-Roc I 2018–2020 original 150/250, standard Stage1 175/300, E85 excluded."),
   src("shiftech","Shiftech T-Roc 2017 generation 1.5 TSI150","https://www.shiftech.eu/de/chiptuning/auto/volkswagen/t-roc/2017/benzin/1.5-tsi-150",175,300,"T-Roc I 2017 source 150/250 →175/300 standard Stage1, not later eTSI mild-hybrid.")
  ],scope:"Only 2020 first admission A1/110kW pure petrol; 2022–2024 facelift and eTSI are intentionally excluded. "+vag},
 {id:"rdw-bulk-vw-troc-a1-r-20tsi300-2019-21",make:"Volkswagen",model:"T-Roc",rdwModel:"T-ROC",type:"A1",
  from:2019,to:2021,cc:1984,cylinders:4,kw:221,stockNm:400,
  engine:"VW T-Roc R first phase 2.0 TSI 300 PS / 221 kW EA888 petrol",
  power:[350,380],torque:[460,500],profileIds:[],
  extras:[
   src("br-performance","BR-Performance T-Roc I R 2.0 TSI 2017–2021 standard Stage 1","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/9674-t-roc/9675-2017-2025/13731-r-2-0-tsi-2022/",380,500,"T-Roc I R original300PS/400Nm, ordinary Stage1 380PS/500Nm. The separate combined ECU+DSG option 400PS/520Nm is EXCLUDED."),
   src("shiftech","Shiftech VW T-Roc I R 2.0TSI 300","https://www.shiftech.eu/en/chiptuning/car/volkswagen/t-roc/2017/petrol/2.0-tsi-r-300",350,460,"T-Roc I 300PS/400Nm, ordinary Stage1 350PS/460Nm. Stage2/ethanol separate and excluded.")
  ],scope:"T-Roc R power 221kW (300.5 metric PS rounds300) despite marketed 300; 2019–2021 only, not 2024 R facelift or regular 1.5. Owner ECU/DSG DQ381 torque verification mandatory. "+vag},
 {id:"rdw-bulk-audi-q3-8u-20tfsi170-2012-15",make:"Audi",model:"Q3",rdwModel:"Q3",type:"8U",
  from:2012,to:2015,cc:1984,cylinders:4,kw:125,stockNm:280,
  engine:"Audi Q3 8U 2.0 TFSI 170 PS original 125kW petrol (verify installed EA888/MED)",
  power:[255,260],torque:[380,400],profileIds:[],
  extras:[
   src("vagtechniek","VAGtechniek Audi Q3 8U 2.0 TFSI170 Stage1","https://www.vagtechniek.nl/chiptuning/audi/q3/8u/2.0-tfsi-170pk/",255,380,"Q3 8U original 170PS/280Nm. Standard Stage1 255PS/380Nm. Stage1+265/400 and factory map upgrade are NOT Stage1."),
   src("shiftech","Shiftech Audi Q3 8U 2.0TFSI170 Stage1","https://www.shiftech.eu/en/chiptuning/car/audi/q3/2011-8u/petrol/2.0-tfsi-170",260,400,"8U 2011-on original 170PS/280Nm and Stage1 260PS/400Nm, not 180PS/2.0 TSI or E85.")
  ],scope:"Large provider tuning gains likely arise from factory output de-rating; Q3 8U 125kW alone does not establish shared 211PS turbo/ECU. Confirm actual engine code and S-Tronic/manual clutch and hardware before any owner quote. "+vag},
 {id:"rdw-bulk-nissan-xtrail-t32-16digt163-2017-19",make:"Nissan",model:"X-Trail",rdwModel:"NISSAN X-TRAIL",type:"T32",
  from:2017,to:2019,cc:1618,cylinders:4,kw:120,stockNm:240,
  engine:"Nissan X-Trail III T32 facelift 1.6 DIG-T 163 PS MR16DDT petrol 1618cc",
  power:[180,205],torque:[270,320],profileIds:[],
  extras:[
   src("shiftech","Shiftech Nissan X-Trail III 2017 facelift 1.6 DIG-T163","https://www.shiftech.eu/en/chiptuning/car/nissan/x-trail/2017-iii-ii/petrol/1.6-dig-t-163",180,270,"X-Trail III facelift 2017 original163PS/240Nm, standard Stage1 180/270, Stage2 189/284 excluded."),
   src("ecu-soft","ECU-Soft Nissan X-Trail T32 2014–2019 1.6 DIG-T 163","https://www.ecu-soft.be/chiptuning/nissan/x-trail/6578/1-6-dig-t-163-9863",205,320,"X-Trail T32 petrol 1.6 DIG-T 163/240, standard Stage1 205/320. Published page header 2014–2017; 2019 use requires ECU/revision review.")
  ],scope:"2017–2019 T32 MR16DDT, ECU-Soft catalogue page internally narrows to 2014–2017, so 2019 ECU applicability is unconfirmed; conditional inquiry only, never promised maximum. "+japanese},
 {id:"rdw-bulk-bmw-320i-g3l-20t184-2019-20",make:"BMW",model:"320I",rdwModel:"320I",type:"G3L",
  from:2019,to:2020,cc:1998,cylinders:4,kw:135,stockNm:290,
  engine:"BMW 320i G20/G21 type G3L 2.0 B48 184 PS 135kW petrol GPF",
  power:[220,260],torque:[370,420],profileIds:[],
  extras:[
   src("br-performance","BR Performance BMW G2x 320i GPF standard Stage1","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/5-bmw/525-serie-3/10456-g2x-03-2019-06-2024/12115-320i-gpf/",220,370,"G20 GPF 184PS/290Nm, standard Stage1 220PS/370Nm, manual/auto torque check."),
   src("mosselman","Mosselman Turbo BMW 320i G20 B48 184hp Stage1","https://www.mosselmanturbo.com/en/bmw-320i-g20-184hp",260,420,"G20 B48 factory 184PS/135kW/290Nm, premium RON98 ECU remap Stage1 260PS/420Nm.")
  ],scope:"RDW G3L first admissions 2019–2020 only, 2024 LCI withheld. BMW ECU unlock needed for some build dates; B48 stock horsepower does NOT prove same turbo and drivetrain or availability. 98RON, GPF and ZF/manual torque review required."},
 {id:"rdw-bulk-bmw-320i-g3k-20t184-2020",make:"BMW",model:"320I",rdwModel:"320I",type:"G3K",
  from:2020,to:2020,cc:1998,cylinders:4,kw:135,stockNm:290,
  engine:"BMW 320i G20/G21 type G3K 2.0 B48 184 PS 135kW petrol GPF",
  power:[220,260],torque:[370,420],profileIds:[],
  extras:[
   src("br-performance","BR Performance BMW G2x 320i GPF standard Stage1","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/5-bmw/525-serie-3/10456-g2x-03-2019-06-2024/12115-320i-gpf/",220,370,"BMW G3K 2020 G20 GPF factory 184/290, published standard Stage1 220/370."),
   src("mosselman","Mosselman Turbo BMW 320i G20 B48 184hp Stage1","https://www.mosselmanturbo.com/en/bmw-320i-g20-184hp",260,420,"G20 B48 Stage1 260/420 RON98 only, exact ECU unlock/installed B48 must be verified.")
  ],scope:"G3K 2020 135kW only; exclude 3K F30 and 2024 G3K LCI. B48/GPF/ECU unlocking and automatic gearbox calibration unknown."},
 {id:"rdw-bulk-citroen-c5-aircross-a-12puretech130-2020-21",make:"Citroen",model:"C5 Aircross",rdwModel:"C5 AIRCROSS",type:"A",
  from:2020,to:2021,cc:1199,cylinders:3,kw:96,stockNm:230,
  engine:"Citroën C5 Aircross I 1.2 PureTech GPF 130PS petrol, RDW96kW 1199cc",
  power:[145,145],torque:[250,275],profileIds:[],
  extras:[
   src("br-performance","BR-Performance Citroën C5 Aircross 2018–22 1.2 PureTech130","https://www.br-performance.lu/en-lu/chiptuning/1-cars/17-citroen/820-c5-c5-aircross/10403-2018/10406-1-2-puretech-gpf/",145,250,"C5 Aircross 2018–2022 original marketing130PS/230Nm, ordinary Stage1 145PS/250Nm."),
   src("shiftech","Shiftech Citroen C5 Aircross 2018 1.2 PureTech GPF130","https://www.shiftech.eu/en/chiptuning/car/citroen/c5-aircross/2018/petrol/1.2-thp-puretech-gpf-130",145,275,"C5 Aircross first-generation original130PS/230Nm, Stage1 145/275Nm, E85 excluded.")
  ],scope:"Single-fuel petrol only; hybrid versions with similar badge excluded. Published max275Nm may exceed installed EAT clutch limit; full belt/oil/GPF/ECU check. "+psa},
 {id:"rdw-bulk-citroen-c4-b-12puretech130-2020-22",make:"Citroen",model:"C4",rdwModel:"C4",type:"B",
  from:2020,to:2022,cc:1199,cylinders:3,kw:96,stockNm:230,
  engine:"Citroen C4 III type B 1.2 PureTech GPF 130PS, original 96kW 1199cc petrol",
  power:[145,145],torque:[250,270],profileIds:[],
  extras:[
   src("br-performance","BR Performance Citroen C4 III 12/2020–2023 PureTech130 GPF","https://www.br-performance.fr/brp-bayonne-es/chiptuning/1-vehiculos/17-citroen/808-c4/11287-12-2020/11099-1-2-puretech-gpf/",145,250,"New 2020 C4 III original130PS/230Nm, ordinary Stage1 145PS/250Nm, NOT earlier C4 2015 1.2T."),
   src("atm-chiptuning","ATM Citroen C4 2020-on 1.2 PureTech 130","https://www.atm-chiptuning.com/chiptuning/citroen-c4-12-puretech-130pk-11400/",145,270,"Citroen C4 III 2020-on original130/230, Stage1 145/270, 1199cc; source ECU Valeo VD56.1 must be checked."),
   src("ecu-soft","ECU-Soft Citroen C4 2020–2023 1.2 PureTech 130 GPF","https://www.ecu-soft.be/chiptuning/citroen/c4/11287/1-2-puretech-gpf-130-14303",145,250,"C4 III first year 2020 through 2023 original130PS/230Nm, Stage1 145PS/250Nm; corroborates 2020-11 original first admissions independently of BR's 12/2020 phase catalogue.")
  ],scope:"C4 III type B petrol nonhybrid, 2020–2022 only; four frozen 2020 original admissions date 2020-11, one month before BR's December source start but ATM+ECU-Soft both explicitly cover 2020 (independent corroboration). Wet belt, GPF, installed Valeo ECU and EAT limits require physical check. "+psa},
 {id:"rdw-bulk-nissan-juke-f16-10digt117-2020",make:"Nissan",model:"Juke",rdwModel:"NISSAN JUKE",type:"F16",
  from:2020,to:2020,cc:999,cylinders:3,kw:86,stockNm:200,
  engine:"Nissan Juke II F16 1.0 DIG-T 117PS petrol HR10DDT (RDW 86kW)",
  power:[130,130],torque:[240,240],profileIds:[],
  extras:[
   src("br-performance","BR-Performance Nissan Juke II 2019–2020 DIG-T117","https://www.br-performance.be/en-be/chiptuning/1-cars/41-nissan/2033-juke/10911-2020/12391-1-0-dig-t/",130,240,"Juke II 2019–2020 original117PS/200Nm, Stage1 130PS/240Nm."),
   src("gsg-performance","GSG Performance Juke 2020 1.0 DIG-T117","https://gsgperformance.com/car-detail/nissan/juke/2020/1-0-dig-t-117hp",130,240,"Juke II 2020 original117PS/200Nm, ordinary Stage1 130/240.")
  ],scope:"Original 86kW F16 2020 only, don't borrow Juke F15 1.2 DIG-T or 84kW/114PS 2021 variant. "+japanese},
 {id:"rdw-bulk-nissan-juke-f16-10digt114-2021-24",make:"Nissan",model:"Juke",rdwModel:"NISSAN JUKE",type:"F16",
  from:2021,to:2024,cc:999,cylinders:3,kw:84,stockNm:200,
  engine:"Nissan Juke F16 facelift-era 1.0 DIG-T114 marketing, original RDW84kW petrol",
  power:[120,130],torque:[220,220],profileIds:[],
  extras:[
   src("shiftech","Shiftech Nissan Juke 2020 1.0 DIG-T114","https://www.shiftech.eu/en/chiptuning/car/nissan/juke/2020/petrol/1.0-dig-t-114",120,220,"Juke II original114PS/200Nm according to Shiftech, Stage1 120PS/220Nm."),
   src("unlimited-tuning","Unlimited Tuning Nissan Juke 1.0 DIG-T114","https://www.unlimitedtuning.nl/chiptuning-nissan-juke-1-0-dig-t-114-pk.html",130,220,"Juke II original114PS/180Nm in this listing, normal Stage1 130/220Nm; optional Xtreme 135/230 excluded.")
  ],scope:"Owner original 180 versus200Nm conflicting across publishers, not RDW fact. Original 84kW vs 86kW is strictly enforced; CVT/xTronic gearbox may not permit advertised torque. "+sourceDisagreement+" "+japanese},
 {id:"rdw-bulk-nissan-micra-k14-10igt92-2021-24",make:"Nissan",model:"Micra",rdwModel:"NISSAN MICRA",type:"K14",
  from:2021,to:2024,cc:999,cylinders:3,kw:68,stockNm:160,
  engine:"Nissan Micra K14 1.0 IG-T92 marketed / original RDW68kW (~92PS) petrol",
  power:[110,120],torque:[184,220],profileIds:[],
  extras:[
   src("br-performance","BR-Performance Micra K14 2021 IG-T92","https://www.br-performance.be/en-be/chiptuning/1-cars/41-nissan/2040-micra/11419-2021/14221-1-0-ig-t/",110,184,"Micra K14 2021 92PS/144Nm original publisher and Stage1 110PS/184Nm."),
   src("shiftech","Shiftech Micra K14 2020 1.0 IG-T92","https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2020/petrol/1.0-ig-t-92",120,220,"Micra K14 92PS/160Nm original Shiftech and Stage1 120PS/220Nm.")
  ],scope:"BR factory original144Nm differs from Shiftech160Nm; listing is for 92PS, not earlier K14 100PS 74kW. xTronic/manual owner check. "+sourceDisagreement+" "+japanese},
 {id:"rdw-bulk-audi-a1sportback-8x-10tfsi95-2015-17",make:"Audi",model:"A1",rdwModel:"A1 SPORTBACK",type:"8X",
  from:2015,to:2017,cc:999,cylinders:3,kw:70,stockNm:160,
  engine:"Audi A1 Sportback facelift 8X 1.0 TFSI 95PS original70kW 999cc EA211",
  power:[120,130],torque:[235,240],profileIds:[],
  extras:[
   src("br-performance","BR Performance Audi A1 8X facelift 2015–18 1.0 TFSI95","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/6567-8x-2015-2018/6568-1-0-tfsi/",130,240,"A1 8X facelift 2015–18 1.0 TFSI95 stock95PS/160Nm, standard Stage1 130PS/240Nm; Sportback trading name needs engine code confirmation."),
   src("shiftech","Shiftech Audi A1 8X 2015 1.0 TSI/TFSI95","https://www.shiftech.eu/en/chiptuning/car/audi/a1/2015-8x/petrol/1.0-tsi-tfsi-95",120,235,"A1 8X generation 2015 95PS/175Nm, Stage1 120PS/235Nm.")
  ],scope:"Strict RDW A1 SPORTBACK 8X 999cc 70kW 2015–2017: tuners catalog A1 8X 1.0 TFSI, exact Sportback ECU/gearbox is not guaranteed. Original torque160 vs175Nm conflicts. "+sourceDisagreement+" "+vag},
 {id:"rdw-bulk-peugeot-partner-e-15bluehdi100-2022-24",make:"Peugeot",model:"Partner",rdwModel:"PARTNER",type:"E",
  from:2022,to:2024,cc:1499,cylinders:4,kw:75,stockNm:250,fuel:"Diesel",
  engine:"Peugeot Partner III 1.5 BlueHDi100 marketed / RDW75kW (~102PS), DV5 1499cc",
  power:[140,140],torque:[300,345],profileIds:[],
  extras:[
   src("atm-chiptuning","ATM Partner III 2018-on 1.5 BlueHDi100","https://www.atm-chiptuning.com/chiptuning/peugeot-partner-15-bluehdi-100pk/",140,300,"Partner 2018-on 1.5 BlueHDi100 marketing 100/254Nm, standard Stage1 140/300Nm. Exact RDW75kW rounds 102PS."),
   src("unlimited-tuning","Unlimited Tuning Partner III 1.5 BlueHDi100","https://www.unlimitedtuning.nl/chiptuning-peugeot-partner-1-5-bluehdi-100-pk.html",140,345,"Partner 2018-on 1.5 BlueHDi marketed100PS/250Nm Stage1 140/345Nm; installed DV5 ECU and commercial gearbox torque to verify.")
  ],scope:"Marketing100PS differs from RDW75kW→102PS; no assumption that factory ECU hardware or gearbox allows full 345Nm. DPF/AdBlue intact and legal. Installed exact DV5/ECU and clutch required."},
 {id:"rdw-bulk-vw-tiguan-5n-20tsi180-2012-14",make:"Volkswagen",model:"Tiguan",rdwModel:"TIGUAN",type:"5N",
  from:2012,to:2014,cc:1984,cylinders:4,kw:132,stockNm:280,
  engine:"VW Tiguan I 5N 2.0 TSI180 original132kW petrol 1984cc EA888 generation check",
  power:[235,260],torque:[400,400],profileIds:[],
  extras:[
   src("unlimited-tuning","Unlimited Tuning Tiguan 2007–15 2.0 TSI 180","https://www.unlimitedtuning.nl/chiptuning-volkswagen-tiguan-2-0-tsi-180-pk.html",235,400,"Tiguan I 2007–15 2.0 TSI180 source stock180/320Nm, Stage1 235PS/400Nm."),
   src("atm-chiptuning","ATM Tiguan 2011–15 2.0 TSI 180","https://www.atm-chiptuning.com/chiptuning/volkswagen-tiguan-20-tsi-180pk/",260,400,"Tiguan I NZ/5N 2011–15 2.0 TSI180 original180PS/280Nm, Stage1 260PS/400Nm. Verify specific ECU/engine generation.")
  ],scope:"I type5N old Tiguan only 2012–14. Publisher factory280 vs320Nm inconsistent, Stage1 235–260PS wide because ECU/hardware may differ. No use for 2017 Tiguan II 5N carryover or hybrid. "+sourceDisagreement+" "+vag}
];
export const reviewedRdwBulkBatch3=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch3Count=reviewedRdwBulkBatch3.length;
