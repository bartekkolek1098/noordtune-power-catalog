/** Reviewed 1499cc compact-van families, 2026-10-11.
 * A customer lookup exposed a missing Berlingo III family. No plate-specific rule.
 * Explicit make/model/type/kW/year/fuel scopes; no shared-platform inference.
 */
import {buildReviewedRdwBulkBatch, type ExtraEvidence, type Seed} from './reviewed-rdw-bulk-batch.ts';
const checked='2026-10-11';
const evidence=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string):ExtraEvidence=>({provider,title,url,stage1Hp,stage1Nm,scope,retrievedAt:checked});
const common='Published ordinary Stage 1 indications, not NoordTune dyno measurements or guaranteed gains. Confirm fitted DV5/D15 engine, exact ECU/firmware and unlock, transmission/clutch and working load. SCR/AdBlue, DPF and EGR must remain functional and road-legal. No Stage 2/3 figures. Original torque is supplier literature, not RDW. Marketing PS and RDW-converted metric horsepower are kept distinct.';
const seeds:readonly Seed[]=[
 {id:'rdw-bulk-15-citroen-berlingo-e-15bluehdi75-2019-23',make:'Citroen',model:'Berlingo',rdwModel:'BERLINGO',type:'E',from:2019,to:2023,cc:1499,cylinders:4,kw:56,stockNm:230,fuel:'Diesel',engine:'Berlingo III 1.5 BlueHDi 75 / DV5, 56 kW',power:[115,130],torque:[300,320],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Berlingo III 1.5 BlueHDi 75 (2018-2024)','https://www.ecu-soft.be/chiptuning/citroen/berlingo/9767/1-5-bluehdi-75-12771',115,300,'Berlingo 1499cc 75PS/230Nm; ordinary Stage1 115PS/300Nm. ECU unlock assessment required.'),
  evidence('atm-chiptuning','ATM Berlingo 1.5 BlueHDi 75 (2018 onward)','https://www.atm-chiptuning.com/chiptuning/citroen-berlingo-15-bluehdi-75pk/',125,320,'Citroen-specific 1499cc DV5 75PS/230Nm to125PS/320Nm. Not the 1560cc 1.6 diesel.'),
  evidence('shiftech','Shiftech Berlingo 2018 1.5 BlueHDi 75 — Stage 1','https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/citroen/berlingo/2018/diesel/1.5-bluehdi-75',130,300,'Ordinary Stage1 75PS/230Nm to130PS/300Nm; separately advertised Stage2 140/320 explicitly excluded.')
 ],scope:'Only CITROEN BERLINGO type E 1499cc 56kW diesel admitted2019-2023. RDW56kW rounds76 metric PS; published trim75PS. Do not overwrite stock power or use the old type7 1560cc HDi profile. Source spread115-130PS/300-320Nm is not a guaranteed interval or paired dyno measurement. '+common},
 {id:'rdw-bulk-15-citroen-berlingo-e-15bluehdi100-2019-23',make:'Citroen',model:'Berlingo',rdwModel:'BERLINGO',type:'E',from:2019,to:2023,cc:1499,cylinders:4,kw:75,stockNm:250,fuel:'Diesel',engine:'Berlingo III 1.5 BlueHDi 100/102 / DV5, 75 kW',power:[140,145],torque:[300,340],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Berlingo 1.5 BlueHDi 102','https://www.ecu-soft.be/chiptuning/citroen/berlingo/9767/1-5-bluehdi-102-26703',140,340,'Berlingo III 102PS original, Stage1 140PS/340Nm; exact RDW75kW variant, not registered73kW.'),
  evidence('atm-chiptuning','ATM Berlingo 1.5 BlueHDi 102','https://www.atm-chiptuning.com/chiptuning/citroen-berlingo-15-bluehdi-102pk/',145,300,'Citroen Berlingo 2018 onwards, DV5 1499cc102PS/250Nm Stage1 145PS/300Nm, MD1CS003/EDC17C60 conditional.')
 ],scope:'Only type E 75kW 1499cc 2019-2023. Original75kW is102 metric PS, not registered73kW despite marketing100. ECU generation and gearbox must be checked individually. '+common},
 {id:'rdw-bulk-15-citroen-berlingo-e-15bluehdi130-2018-23',make:'Citroen',model:'Berlingo',rdwModel:'BERLINGO',type:'E',from:2018,to:2023,cc:1499,cylinders:4,kw:96,stockNm:300,fuel:'Diesel',engine:'Berlingo III 1.5 BlueHDi 130 / DV5, 96 kW',power:[160,160],torque:[350,360],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Berlingo III 1.5 BlueHDi 130','https://www.ecu-soft.be/chiptuning/citroen/berlingo/9767/1-5-bluehdi-130-13429',160,350,'2018-2024 Berlingo 130PS/300Nm to160PS/350Nm Stage1.'),
  evidence('atm-chiptuning','ATM Berlingo 1.5 BlueHDi 130','https://www.atm-chiptuning.com/chiptuning/citroen-berlingo-15-bluehdi-130pk/',160,360,'1499cc DV5 130PS/300Nm Stage1 160PS/360Nm, Bosch MD1CS003; gearbox-specific checks.')
 ],scope:'Only type E 96kW 1499cc 2018-2023, 131 metric PS vs marketing130. Not the 1560cc120 or 2024 facelift ECU by default. '+common},
 {id:'rdw-bulk-15-peugeot-partner-e-15bluehdi75-2019-23',make:'Peugeot',model:'Partner',rdwModel:'PARTNER',type:'E',from:2019,to:2023,cc:1499,cylinders:4,kw:56,stockNm:230,fuel:'Diesel',engine:'Partner III 1.5 BlueHDi 75 / DV5, 56 kW',power:[115,125],torque:[300,320],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Partner 1.5 BlueHDi 75 (2019 onward)','https://www.ecu-soft.be/chiptuning/peugeot/partner/9773/1-5-bluehdi-75-12771',115,300,'Peugeot-specific Partner III 75PS/230Nm Stage1 115PS/300Nm.'),
  evidence('atm-chiptuning','ATM Partner 1.5 BlueHDi 75','https://www.atm-chiptuning.com/chiptuning/peugeot-partner-15-bluehdi-75pk/',125,320,'Peugeot Partner 2018 onwards1499cc75PS/230Nm Stage1 125PS/320Nm, DV5.')
 ],scope:'Only PEUGEOT PARTNER type E 1499cc56kW admitted2019-2023. Not older Partner type7 1560cc55kW; no Citroen calibration copy. '+common},
 {id:'rdw-bulk-15-peugeot-partner-e-15bluehdi100-2019-21',make:'Peugeot',model:'Partner',rdwModel:'PARTNER',type:'E',from:2019,to:2021,cc:1499,cylinders:4,kw:75,stockNm:254,fuel:'Diesel',engine:'Partner III 1.5 BlueHDi 100/102 / DV5, 75 kW',power:[140,140],torque:[300,340],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Partner 1.5 BlueHDi 100','https://www.ecu-soft.be/chiptuning/peugeot/partner/9773/1-5-bluehdi-100-13431',140,340,'Partner III100PS Stage1 140PS/340Nm, marketed output rounded differently from RDW.'),
  evidence('atm-chiptuning','ATM Partner 1.5 BlueHDi 100','https://www.atm-chiptuning.com/chiptuning/peugeot-partner-15-bluehdi-100pk/',140,300,'1499cc100PS/254Nm Stage1 140PS/300Nm; Bosch EDC17C60/MD1CS003 dependent on actual vehicle.')
 ],scope:'Only PARTNER E 75kW 1499cc2019-2021. Existing separately reviewed2022-2024 application retained to prevent overlapping resolver matches. '+common},
 {id:'rdw-bulk-15-peugeot-partner-e-15bluehdi130-2019-23',make:'Peugeot',model:'Partner',rdwModel:'PARTNER',type:'E',from:2019,to:2023,cc:1499,cylinders:4,kw:96,stockNm:300,fuel:'Diesel',engine:'Partner III 1.5 BlueHDi 130 / DV5, 96 kW',power:[160,160],torque:[350,360],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Partner 1.5 BlueHDi 130','https://www.ecu-soft.be/chiptuning/peugeot/partner/9773/1-5-bluehdi-130-13429',160,350,'Peugeot Partner2019 onward130PS/300Nm Stage1 160PS/350Nm.'),
  evidence('atm-chiptuning','ATM Partner 1.5 BlueHDi 130','https://www.atm-chiptuning.com/chiptuning/peugeot-partner-15-bluehdi-130pk/',160,360,'Peugeot-specific1499cc130PS/300Nm Stage1 160PS/360Nm, actual gearbox/ECU inspection needed.')
 ],scope:'Only PARTNER E1499cc96kW2019-2023; no extrapolation into new2024 ECU. '+common},
 {id:'rdw-bulk-15-opel-combo-e-15d75-2019-22',make:'Opel',model:'Combo',rdwModel:'COMBO',type:'E',from:2019,to:2022,cc:1499,cylinders:4,kw:56,stockNm:230,fuel:'Diesel',engine:'Combo E 1.5 diesel 75 / D15DTL, 56 kW',power:[115,125],torque:[300,320],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Combo 2018-2022 1.5 BlueHDi 75','https://www.ecu-soft.be/chiptuning/opel/combo/10270/1-5-bluehdi-75-12771',115,300,'Opel Combo E75PS/230Nm Stage1 115PS/300Nm; source year2018-2022.'),
  evidence('atm-chiptuning','ATM Opel Combo 1.5 BlueHDi 75','https://www.atm-chiptuning.com/chiptuning/opel-combo-15-bluehdi-75pk/',125,320,'Combo E from2019,1499cc D15DTL75PS/230Nm Stage1 125PS/320Nm.')
 ],scope:'Only OPEL COMBO E1499cc56kW2019-2022. Not earlier Fiat-platform Combo D, not Vauxhall or Berlingo automatically. '+common},
 {id:'rdw-bulk-15-opel-combo-e-15d102-2019-22',make:'Opel',model:'Combo',rdwModel:'COMBO',type:'E',from:2019,to:2022,cc:1499,cylinders:4,kw:75,stockNm:250,fuel:'Diesel',engine:'Combo E 1.5 diesel 100/102 / D15DT, 75 kW',power:[140,140],torque:[340,340],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Combo 2018-2022 1.5 BlueHDi 100','https://www.ecu-soft.be/chiptuning/opel/combo/10270/1-5-bluehdi-100-13431',140,340,'Opel Combo E100PS marketed variant Stage1 140PS/340Nm, source generation2018-2022.'),
  evidence('atm-chiptuning','ATM Opel Combo 1.5 BlueHDi 102','https://www.atm-chiptuning.com/chiptuning/opel-combo-15-bluehdi-102pk/',140,340,'Opel Combo1499cc102PS/250Nm Stage1 140PS/340Nm; D15DT/F15DT ECU-specific.')
 ],scope:'Only COMBO E1499cc75kW2019-2022, not newer81kW110PS despite shared1.5 diesel name. '+common},
 {id:'rdw-bulk-15-opel-combo-e-15d130-2019-22',make:'Opel',model:'Combo',rdwModel:'COMBO',type:'E',from:2019,to:2022,cc:1499,cylinders:4,kw:96,stockNm:300,fuel:'Diesel',engine:'Combo E 1.5 diesel 130/131 / D15DTH, 96 kW',power:[160,160],torque:[350,360],profileIds:[],extras:[
  evidence('ecu-soft','ECU-Soft Combo 2018-2022 1.5 BlueHDi 130','https://www.ecu-soft.be/chiptuning/opel/combo/10270/1-5-bluehdi-130-13429',160,350,'Opel Combo130PS/300Nm Stage1 160PS/350Nm, published2018-2022 generation.'),
  evidence('atm-chiptuning','ATM Opel Combo 1.5 BlueHDi 131','https://www.atm-chiptuning.com/chiptuning/opel-combo-15-bluehdi-131pk/',160,360,'Opel Combo1499cc D15DTH/F15DTH131PS/300Nm Stage1 160PS/360Nm.')
 ],scope:'Only COMBO E1499cc96kW2019-2022; later unlock/Euro phases require independent scope. '+common}
];
export const reviewedCompactVanApplications=buildReviewedRdwBulkBatch(seeds);
