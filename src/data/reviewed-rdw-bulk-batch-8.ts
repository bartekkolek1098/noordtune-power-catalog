/** NL business-van Stage 1 evidence batch 8 (2026-10-09).
 * Strict RDW technical cohorts only; supplier values are indicative, not measurements.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const evidence=(provider:string,title:string,url:string,hp:number,nm:number,scope:string)=>({
 provider,title,url,stage1Hp:hp,stage1Nm:nm,scope,retrievedAt:"2026-10-09"
});
const legal="Published Stage 1 values are indicative third-party claims, not NoordTune measurements or guarantees. Scan exact ECU, firmware, engine, gearbox and emissions Euro phase. DPF, EGR, SCR and AdBlue must remain functional and road-legal; no Stage 2/3 values.";
const seeds:readonly Seed[]=[
 {
  id:"rdw-bulk-8-volkswagen-crafter-syn1e-20tdi140-2017-20",
  make:"Volkswagen",model:"Crafter",rdwModel:"CRAFTER",type:"SYN1E",
  from:2017,to:2020,cc:1968,cylinders:4,kw:103,stockNm:340,
  engine:"VW Crafter 2017-2020 2.0 TDI 140 Euro6 1968cc, 103kW",
  fuel:"Diesel",power:[175,175],torque:[400,400],profileIds:[],
  extras:[
   evidence("br-performance","BR Crafter 2017-2020 2.0 TDI 140","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2950-crafter/9434-2017/9436-2-0-tdi/",175,400,"2017-20 140PS/340Nm, ordinary Stage1 175PS/400Nm."),
   evidence("ecu-soft","ECU-Soft Crafter 2017-2020 2.0 TDI 140","https://www.ecu-soft.be/chiptuning/volkswagen/crafter/9434/2-0-tdi-140-12305",175,400,"2017-20 Crafter 140/340, Stage1 175/400, independent ECU version check.")
  ],
  scope:"Only CRAFTER SYN1E 1968cc 103kW single diesel 2017-2020. The newer 2021+ EU6D and 177PS/130kW Crafter are separate versions; no shared calibration claim. Loaded van clutch, gearbox and SCR check. "+legal
 },
 {
  id:"rdw-bulk-8-volkswagen-transporter-7j0-t61-20tdi150-2020-21",
  make:"Volkswagen",model:"Transporter",rdwModel:"TRANSPORTER",type:"7J0",
  from:2020,to:2021,cc:1968,cylinders:4,kw:110,stockNm:340,
  engine:"VW Transporter T6.1 facelift 2.0 TDI CR 150 110kW 1968cc, 2020-21",
  fuel:"Diesel",power:[185,190],torque:[410,420],profileIds:[],
  extras:[
   evidence("atm-chiptuning","ATM Transporter T6 2019-2021 2.0 TDI 150","https://www.atm-chiptuning.com/chiptuning/volkswagen-transporter-multivan-20-tdi-150pk/",185,410,"Transporter 2019-21 T6 facelift 2.0 TDI 150PS/340Nm, normal Stage1 185PS/410Nm."),
   evidence("vagtechniek","VAGtechniek Transporter T6.1 2.0 TDI CR 150","https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6.1/2.0-tdi-150pk/",190,420,"T6.1 2020+ 150PS/340Nm, normal Stage1 190PS/420Nm; Stage1+195/430 excluded.")
  ],
  scope:"Only VW TRANSPORTER type 7J0 1968cc 110kW single diesel first-admitted 2020-21. T6.1 marketed 150PS; T5, 2015-19 T6, T7, e-Transporter and 2022+ engine/Euro variants NOT included. Independently confirm ECU DCM6.2, DQ500/manual transmission, DPF and SCR; 420Nm is not a gearbox approval. "+legal
 },
 {
  id:"rdw-bulk-8-renault-master-mb-23dci145-2019",
  make:"Renault",model:"Master",rdwModel:"MASTER",type:"MB",
  from:2019,to:2019,cc:2299,cylinders:4,kw:107,stockNm:360,
  engine:"Renault Master III 2019 2.3 dCi Bi-Turbo Euro6 145, 107kW",
  fuel:"Diesel",power:[190,210],torque:[420,440],profileIds:[],
  extras:[
   evidence("atm-chiptuning","ATM Master Mk5 2019+ 2.3 dCi 145","https://www.atm-chiptuning.com/chiptuning/renault-master-23-dci-145pk-10609/",210,440,"2019+ Master 145PS/360Nm, Stage1 210PS/440Nm, SID310/SID321 conditional."),
   evidence("shiftech","Shiftech Master 2019+ III 2.3 dCi Bi-Turbo 145 EU6","https://www.shiftech.eu/en/chiptuning/car/renault/master/2019-iii-iii/diesel/2.3-dci-bi-turbo-eu6-145",190,420,"2019+ Master 2.3 dCi Bi-Turbo 145PS/360Nm, normal Stage1 190PS/420Nm.")
  ],
  scope:"Only Master MB 2299cc 107kW single diesel first-admitted 2019. Marked difference between independent Stage1 published outputs 190-210PS and 420-440Nm. Euro6 phase, engine M9T variant, axle load, transmission and ECU must be independently verified. Other Master chassis/type codes excluded. "+legal
 },
 {
  id:"rdw-bulk-8-renault-master-val-23dci145-2022",
  make:"Renault",model:"Master",rdwModel:"MASTER",type:"VAL",
  from:2022,to:2022,cc:2299,cylinders:4,kw:107,stockNm:360,
  engine:"Renault Master III facelift 2022 2.3 dCi 145 Euro6 candidate, 107kW",
  fuel:"Diesel",power:[190,210],torque:[420,440],profileIds:[],
  extras:[
   evidence("atm-chiptuning","ATM Master Mk5 2019+ 2.3 dCi 145","https://www.atm-chiptuning.com/chiptuning/renault-master-23-dci-145pk-10609/",210,440,"2019+ Master 145PS/360Nm, Stage1 210PS/440Nm, SID ECU check."),
   evidence("shiftech","Shiftech Master III 2019+ 2.3 dCi Bi-Turbo 145 EU6","https://www.shiftech.eu/en/chiptuning/car/renault/master/2019-iii-iii/diesel/2.3-dci-bi-turbo-eu6-145",190,420,"2019+ Master 2.3 dCi Bi-Turbo 145PS/360Nm, Stage1 190PS/420Nm.")
  ],
  scope:"Only Master VAL 2299cc 107kW diesel first-admitted 2022. Do not infer VAL chassis/ECU from MB 2019; verify 2022 fitted M9T and SID ECU/Euro6 phase and gearbox, or withhold tune at workshop. Vendor Stage1 figures disagree. "+legal
 },
 {
  id:"rdw-bulk-8-fiat-doblo-263-16multijet105-2015-20",
  make:"Fiat",model:"Doblo",rdwModel:"FIAT DOBLO'",type:"263",
  from:2015,to:2020,cc:1598,cylinders:4,kw:77,stockNm:290,
  engine:"Fiat Doblo II facelift 1.6 MultiJet 105, 1598cc 77kW 2015-20",
  fuel:"Diesel",power:[140,140],torque:[360,360],profileIds:[],
  extras:[
   evidence("atm-chiptuning","ATM Doblo 2015-2021 1.6 Multijet 105","https://www.atm-chiptuning.com/chiptuning/fiat-doblo-16-multijet-105pk/",140,360,"Doblo 2015-2021 105PS/290Nm, ordinary Stage1 140PS/360Nm, original 1598cc, ECU EDC17C49/EDC17C69/EDC16C39."),
   evidence("br-performance","BR-Performance Doblo 2015-2020 1.6 Multijet 105","https://www.br-performance.be/en-be/chiptuning/1-cars/22-fiat/1014-doblo/7167-2015-2020/7168-1-6-multijet/",140,360,"Doblo II 2015-2020 105PS/290Nm, normal Stage1 140PS/360Nm, not 120PS Euro6 or older 105PS calibration.")
  ],
  scope:"Only RDW FIAT DOBLO' type263 with 1598cc original77kW diesel 2015-2020. Some post-2020 models change emissions ECU/variant; not included despite generic ATM year range. Explicitly NOT 120PS/320Nm Euro6 Doblo, 90PS or Opel Combo. Check engine 198A3000, ECU generation, load and clutch capacity. "+legal
 }
];
export const reviewedRdwBulkBatch8=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch8Count=reviewedRdwBulkBatch8.length;
