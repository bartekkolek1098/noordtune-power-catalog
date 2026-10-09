/** Reviewed NL Ford utility-van RDW Stage 1 applications, 2026-10-09.
 * Source values only; exact 2024 RDW model, type, kW, cc, cylinders, fuel.
 * No ECU compatibility claim or promised gains without individual diagnostics.
 */
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const supplier=(provider:string,title:string,url:string,hp:number,nm:number,scope:string)=>({
 provider,title,url,stage1Hp:hp,stage1Nm:nm,scope,retrievedAt:"2026-10-09"
});
const caution="All Stage 1 values are indicative independent tuner advertisements, not NoordTune dyno results or guaranteed vehicle outcomes. Verify actual ECU, emission firmware, engine condition, manual/automatic transmission, loading, clutch/gearbox and towing constraints. SCR/AdBlue, DPF and EGR must stay functional and legal. No numerical Stage 2 or 3 promises.";
const seeds:readonly Seed[]=[
 {
  id:"rdw-bulk-9-ford-transit-fcd-20ecoblue130-2024",
  make:"Ford",model:"Transit",rdwModel:"TRANSIT",type:"FCD",
  from:2024,to:2024,cc:1996,cylinders:4,kw:95.7,stockNm:360,
  engine:"Ford Transit V 2024 2.0 EcoBlue 130 PS, RDW original 95.7 kW / 1996cc, FCD",
  fuel:"Diesel",power:[190,190],torque:[440,440],profileIds:[],
  extras:[
   supplier("ecu-soft","ECU-Soft Transit V 2023-2026 2.0 EcoBlue 130","https://www.ecu-soft.be/chiptuning/ford/transit/14301/2-0-ecoblue-130-26109",190,440,"Transit V 2023-26, factory 130PS/360Nm and indicative standard Stage1 190PS/440Nm. Do not import 2019-22 hybrid/385Nm profile."),
   supplier("bsr-tuning","BSR Transit 2023-2026 2.0 EcoBlue 130","https://www.bsrtuning.nl/tuning-kits/t/6544/ford-transit-20-ecoblue-130hp-2023-2026",190,440,"Transit 2023-26 130PS/360Nm and Stage1 190PS/440Nm; supplier adjusts per drivetrain.")
  ],
  scope:"Only 2024 RDW FORD TRANSIT FCD diesel 1996cc 4 cylinders original 95.7kW (marketing 130PS). Different from 2016 Transit 1995cc 96kW and 2024 121.3kW/165PS. Later model ECU may require security unlock; avoid any older generic calibration. "+caution
 },
 {
  id:"rdw-bulk-9-ford-transit-fcd-20ecoblue165-2024",
  make:"Ford",model:"Transit",rdwModel:"TRANSIT",type:"FCD",
  from:2024,to:2024,cc:1996,cylinders:4,kw:121.3,stockNm:390,
  engine:"Ford Transit V 2024 2.0 EcoBlue 165 PS, RDW original 121.3kW / 1996cc, FCD",
  fuel:"Diesel",power:[190,190],torque:[440,440],profileIds:[],
  extras:[
   supplier("ecu-soft","ECU-Soft Transit 2023-2026 2.0 EcoBlue 165","https://www.ecu-soft.be/chiptuning/ford/transit/14301/2-0-ecoblue-165-26111",190,440,"2023-26 Transit V: supplier ordinary Stage1 165PS/390Nm to 190PS/440Nm. ECU unlock required. The BVA8 variant has 360Nm stock and must be checked separately."),
   supplier("tsp-chiptuning","TSP Transit / Transit Custom 2024+ 2.0 EcoBlue 165","https://tsp-chiptuning.de/chiptuning/autos-kleintransporter/ford/transit-transit-custom/2024/diesel/20-ecoblue-165ps",190,440,"2024+ 2.0 EcoBlue 165PS/390Nm Stage1 190PS/440Nm; confirm vehicle is Transit, not Custom.")
  ],
  scope:"Only 2024 RDW FORD TRANSIT FCD diesel 1996cc 4 cylinders original 121.3kW (marketing 165PS). RDW cannot identify BVA8 360Nm vs BVA10 390Nm, so stockNm reflects advertised general trim rather than measured engine torque; verify gearbox before any customer quote. Different from 130PS/95.7kW. "+caution
 },
 {
  id:"rdw-bulk-9-ford-transit-connect-pu2-15ecoblue100-2024",
  make:"Ford",model:"Transit Connect",rdwModel:"TRANSIT CONNECT",type:"PU2",
  from:2024,to:2024,cc:1499,cylinders:4,kw:73.3,stockNm:250,
  engine:"Ford Transit Connect 2018-2024 1.5 EcoBlue 100PS, RDW original 73.3kW 1499cc PU2",
  fuel:"Diesel",power:[145,150],torque:[340,340],profileIds:[],
  extras:[
   supplier("atm-chiptuning","ATM Transit Connect 1.5 EcoBlue 100","https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-100pk/",145,340,"Transit Connect 1.5 EcoBlue 100PS/250Nm 1499cc, Bosch MD1CS005, normal Stage1 145PS/340Nm. Exact year must be independently confirmed."),
   supplier("van-drie-performance","Van Drie Transit Connect 2018-2024 1.5 EcoBlue 100","https://vandrieperformance.nl/voertuigen/ford-transit-connect-2018-2024-1-5-ecoblue-100pk/",150,340,"2018-2024 1.5 EcoBlue 100PS/240Nm normal Stage1 150PS/340Nm. Original torque 240 vs ATM 250; no factory torque claim from RDW."),
   supplier("dyno-chiptuningfiles","Dyno ChiptuningFiles Transit Connect 1.5 EcoBlue 100","https://www.dyno-chiptuningfiles.com/chiptuning-file/ford-transit-connect-15-ecoblue-100hp/",145,340,"100PS/250Nm, Stage1 145PS/340Nm, 1499cc Bosch MD1CS005; supplied file data, not proof of this specific RDW vehicle.")
  ],
  scope:"Only 2024 RDW FORD TRANSIT CONNECT PU2 diesel 1499cc 4cyl original 73.3kW. This is NOT 2024 new VW Caddy-based Transit Connect 2.0 diesel, a Transit Courier, or Transit Custom. Although providers quote stock torque differently (240 vs 250Nm), 250 is a supplier reference only; never infer from RDW. Verify MD1CS005 firmware and 2018-2024 model overlap before programming. "+caution
 }
];
export const reviewedRdwBulkBatch9=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch9Count=reviewedRdwBulkBatch9.length;
