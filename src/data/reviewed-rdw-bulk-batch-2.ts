// Second independent, source-scoped RDW bulk batch. Never publish raw RDW
// registrations or infer installed ECUs from engine marketing labels.
import {buildReviewedRdwBulkBatch,type Seed} from "./reviewed-rdw-bulk-batch.ts";
const extra=(provider:string,title:string,url:string,stage1Hp:number,stage1Nm:number,scope:string)=>
  ({provider,title,url,stage1Hp,stage1Nm,scope});
const checkVag="Verify exact EA211/EA111 engine code, factory power and ECU software by scan, correct octane, engine/chain history and gearbox type. Manual versus DSG DQ200 clutch torque thresholds vary; published maxima are not customer approvals.";
const checkPsa="Verify PureTech wet-belt or chain revision and maintenance/oil pressure, GPF/OPF, Valeo/Continental ECU and EAT/MT clutch torque capability before quote. E85 or missing hardware never inherit petrol Stage 1.";
const checkRenault="Scan correct H4Dt/H5Ht/K9K family ECU and software, check fuel, oil/service and manual versus EDC/x-Tronic CVT torque limits; do not infer ECU/transmission from RDW body code.";
const checkFord="Verify actual Fox 1.0 EcoBoost ECU, timing belt in oil and oil-pump drive belt, oil pressure, fuel grade, engine faults, manual/PowerShift transmission and legal emissions before any calibration.";
const seeds:readonly Seed[]=[
 {id:"rdw-bulk2-hyundai-i20-gb-10tgdi-100",make:"Hyundai",model:"i20",rdwModel:"I20",type:"GB",from:2020,to:2020,cc:998,cylinders:3,kw:73.6,stockNm:172,engine:"i20 II GB/IB 1.0 T-GDI 100 PS petrol, 998cc",
  power:[140,140],torque:[230,230],profileIds:["sourced-hyundai-i20-f18efa13f458"],
  extras:[
    extra("br-performance","BR-Performance i20 GB 2014–2020 1.0 T-GDI 100","https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/25-hyundai/1277-i-20/6575-2014-2020/10058-1-0-t-gdi/",140,230,"Old i20 GB/IB 2014–2020 stock 100 PS/172 Nm; standard Stage 1 140 PS/230 Nm; not E85."),
    extra("shiftech","Shiftech i20 GB/IB 1.0 T-GDI 100","https://www.shiftech.eu/en/chiptuning/car/hyundai/i20/2014-gb-ib/petrol/1.0-t-gdi-100",140,230,"2014 GB/IB old-generation 100/172→140/230, not new 2020 BC3 mHEV.")
  ],scope:"Only original RDW GB 2020 petrol, 73.6 kW, not BC3 mild hybrid. Verify ECU firmware, engine hardware and transmission separately."},
 {id:"rdw-bulk2-seat-ibiza-kj-tsi95-2018",make:"Seat",model:"Ibiza",rdwModel:"IBIZA",type:"KJ",from:2018,to:2018,cc:999,cylinders:3,kw:70,stockNm:160,engine:"Ibiza V KJ 1.0 TSI 95 PS pre-2019 calibration",
  power:[130,135],torque:[225,240],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Ibiza KJ 2017–2018 95 PS","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/9248-a0-06-2017-2024/9249-1-0-tsi/",130,240,"KJ 2017–2018 original 95PS/160Nm, Stage1 130PS/240Nm, no E85."),
    extra("vagtechniek","VAGtechniek Ibiza KJ 1.0 TSI 95","https://www.vagtechniek.nl/chiptuning/seat/ibiza/kj/1.0-tsi-95pk/",135,225,"Ibiza KJ original 95PS/160Nm; ordinary Stage 1 135PS/225Nm; Stage1+ 140/240 excluded.")
  ],scope:"IBIZA KJ 2018 original 70kW/999cc, stock 160Nm example. Do not transfer separate 2019-up 175Nm source mapping. "+checkVag},
 {id:"rdw-bulk2-seat-ibiza-kj-tsi95-2019",make:"Seat",model:"Ibiza",rdwModel:"IBIZA",type:"KJ",from:2019,to:2019,cc:999,cylinders:3,kw:70,stockNm:175,engine:"Ibiza V KJ 1.0 TSI 95 PS post-2019 original published torque variation",
  power:[130,135],torque:[225,240],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Ibiza KJ 2019–2021 95 PS","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/9248-v-kj-06-2017-2021/22305-1-0-tsi/",130,240,"KJ 2019–2021 original 95PS/175Nm, Stage1 130PS/240Nm."),
    extra("vagtechniek","VAGtechniek Ibiza KJ 95 PS alternate stock convention","https://www.vagtechniek.nl/chiptuning/seat/ibiza/kj/1.0-tsi-95pk/",135,225,"Original 95PS, published 160Nm from a different KJ scope; Stage1 135PS/225Nm. Owner-specific stock torque unresolved.")
  ],scope:"KJ 2019 95PS source BR original 175Nm vs VAG 160Nm, original torque not RDW-registered: verify actual ECU and gearbox, not a 175Nm guarantee. "+checkVag},
 {id:"rdw-bulk2-seat-ibiza-kj-tsi115",make:"Seat",model:"Ibiza",rdwModel:"IBIZA",type:"KJ",from:2018,to:2019,cc:999,cylinders:3,kw:85,stockNm:200,engine:"Ibiza V KJ 1.0 TSI 115 marketed / RDW 85kW ~116 PS",
  power:[130,135],torque:[225,240],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Ibiza KJ 1.0 TSI 115","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/9248-a0-06-2017-2024/9250-1-0-tsi/",130,240,"KJ 2017–2018 115PS/200Nm, Stage1 130PS/240Nm."),
    extra("br-performance","BR-Performance Ibiza KJ 2019–2021 115","https://www.br-performance.com/brp-barcelona/chiptuning/1-vehiculos/48-seat/2700-ibiza/9248-a0-06-2017-2024/12799-1-0-tsi/",130,240,"KJ 2019–2021 115PS/200Nm, Stage1 130PS/240Nm."),
    extra("vagtechniek","VAGtechniek Ibiza KJ 115","https://www.vagtechniek.nl/chiptuning/seat/ibiza/kj/1.0-tsi-115pk/",135,225,"KJ 115PS/200Nm original, Stage1 135PS/225Nm; exclude separately published 140/240 Stage1+.")
  ],scope:"Original RDW 85kW rounds to 116 metric PS, tuner 115 marketing convention only. "+checkVag},
 {id:"rdw-bulk2-seat-ibiza-6j-tsi95",make:"Seat",model:"Ibiza",rdwModel:"IBIZA",type:"6J",from:2015,to:2015,cc:999,cylinders:3,kw:70,stockNm:160,engine:"Ibiza 6J facelift 2 (6P marketing) 1.0 TSI 95 PS",
  power:[130,135],torque:[225,240],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Ibiza IV 6P 2015–2017 1.0 TSI 95","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/48-seat/2700-ibiza/7275-6p-2015-2017/8664-1-0-tsi/",130,240,"Ibiza 6J-derived fourth generation 6P facelift 2015–2017 original 95/160, Stage1 130/240."),
    extra("vagtechniek","VAGtechniek Ibiza 6J facelift2 95","https://www.vagtechniek.nl/chiptuning/seat/ibiza/6j-facelift2/1.0-tsi-95pk/",135,225,"Ibiza 6J facelift2 original 95/160, Stage1 135/225; Stage1+ 140/240 excluded.")
  ],scope:"RDW 6J body type with 2015 facelift, not new KJ or older 6J 1.2 TSI; installed ECU and true engine mandatory. "+checkVag},
 {id:"rdw-bulk2-nissan-micra-k14-10-igt100",make:"Nissan",model:"Micra",rdwModel:"NISSAN MICRA",type:"K14",from:2019,to:2020,cc:999,cylinders:3,kw:74,stockNm:160,engine:"Nissan Micra V K14 1.0 IG-T 100 marketing (RDW 74kW ~101 PS) HR10DET petrol",
  power:[115,120],torque:[200,220],profileIds:[],
  extras:[
    extra("shiftech","Shiftech Micra 2020 1.0 IG-T 100","https://www.shiftech.eu/en/chiptuning/car/nissan/micra/2020/petrol/1.0-ig-t-100",120,220,"K14 original 100PS/160Nm, Stage1 120PS/220Nm; CVT or manual not determined."),
    extra("hirsch-racing","Hirsch Racing Micra K14 1.0 IG-T 100","https://www.hirsch-racing.de/en/chiptuning/nissan/micra/k14-2017/10-ig-t-100hp/",115,200,"K14 1.0 IG-T 100/160, Stage1 115PS/200Nm; published EMS3140 ECU only a source hint, not an installed ECU fact.")
  ],scope:"Only K14 2019–2020 original 74kW; not earlier 117PS DIG-T / K13 1.2 or 92PS 68kW later variant. CVT/x-Tronic and manual torque differ. "+checkRenault},
 {id:"rdw-bulk2-renault-clio-v-tce100",make:"Renault",model:"Clio",rdwModel:"CLIO",type:"RJA",from:2019,to:2020,cc:999,cylinders:3,kw:74,stockNm:160,engine:"Clio V RJA 1.0 TCe 100 marketing / RDW 74kW (~101 PS) H4Dt petrol",
  power:[115,120],torque:[200,220],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Clio V 1.0 TCe 100","https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2453-clio/9874-clio-5-03-2019/9875-1-0-tce/",115,200,"Clio V 03/2019–2023 TCe100 100PS/160Nm, Stage1 115/200; no E85."),
    extra("shiftech","Shiftech Clio V 1.0 TCe 100","https://www.shiftech.eu/en/chiptuning/car/renault/clio/2019-v/petrol/1.0-tce-100",120,220,"Clio V 2019 original 100/160, Stage1 120/220; not GPL/LPG application.")
  ],scope:"RJA 2019–2020 strictly petrol 74kW, never LPG or 90/91PS later RJA. "+checkRenault},
 {id:"rdw-bulk2-renault-clio-v-tce90-2021",make:"Renault",model:"Clio",rdwModel:"CLIO",type:"RJA",from:2021,to:2021,cc:999,cylinders:3,kw:67,stockNm:160,engine:"Clio V RJA 1.0 TCe 90 pre-facelift, RDW 67kW (~91PS)",
  power:[110,110],torque:[200,200],profileIds:["sourced-renault-clio-70035de1a6f4"],
  scope:"Clio V 2021 phase1 90PS/160Nm, archived ATM + Unlimited independent retrieved sources give conservative 110PS/200Nm. Keep later 2023 facelift out of this source period. "+checkRenault},
 {id:"rdw-bulk2-renault-clio-v-tce90-facelift",make:"Renault",model:"Clio",rdwModel:"CLIO",type:"RJA",from:2024,to:2025,cc:999,cylinders:3,kw:67,stockNm:160,engine:"Clio V facelift RJA 1.0 TCe 90 / RDW 67kW (~91PS)",
  power:[110,120],torque:[200,220],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Clio V facelift 2023–2025 TCe90","https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2453-clio/14353-v-facelift-2023-2025/23257-1-0-tce/",110,200,"Clio V facelift 2023–2025 original 90PS/160Nm, Stage1 110PS/200Nm."),
    extra("shiftech","Shiftech Clio V phase2 2023 1.0 TCe90","https://www.shiftech.eu/en/chiptuning/car/renault/clio/2023-v-ii/petrol/1.0-tce-90",120,220,"Clio V phase2 2023 90PS/160Nm, Stage1 120PS/220Nm.")
  ],scope:"RJA first admissions 2024–2025 only, NOT 2026 upcoming new Clio generation, no LPG. "+checkRenault},
 {id:"rdw-bulk2-dacia-sandero-djf-tce90",make:"Dacia",model:"Sandero",rdwModel:"SANDERO",type:"DJF",from:2023,to:2024,cc:999,cylinders:3,kw:67,stockNm:160,engine:"Dacia Sandero III DJF 1.0 TCe 90 marketed / 67kW ~91PS",
  power:[110,120],torque:[200,220],profileIds:["sourced-dacia-sandero-de13962cd6b7"],
  scope:"Pure petrol DJF 1.0 TCe90; same year LPG ECO-G reports mixed fuel and must not match, nor 1.0 SCe naturally aspirated. CVT/manual ECU constraints unknown. "+checkRenault},
 {id:"rdw-bulk2-ford-fiesta-ja8-ecoboost100",make:"Ford",model:"Fiesta",rdwModel:"FIESTA",type:"JA8",from:2015,to:2017,cc:998,cylinders:3,kw:74,stockNm:170,engine:"Fiesta MkVII JA8 1.0 EcoBoost turbo 100PS petrol, 998cc",
  power:[145,145],torque:[240,250],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Fiesta VII facelift 100","https://www.br-performance.fr/brp-toulouse/reprogrammation/1-voitures/23-ford/1117-fiesta/5382-vii-facelift-2012-2017/5483-1-0t-ecoboost/?stage=4271",145,240,"Fiesta VII facelift 2012–2017 original 100/170, Stage1 145PS/240Nm, no E85."),
    extra("shiftech","Shiftech Fiesta MkVII 1.0 EcoBoost 100","https://www.shiftech.eu/en/chiptuning/car/ford/fiesta/2013-mkvii/petrol/1.0-t-ecoboost-100",145,250,"Fiesta MkVII original 100PS/170Nm, Stage1 145PS/250Nm; not MkVIII or 125PS.")
  ],scope:"JA8 older MkVII 2015–2017 original 74kW, wet belt and engine condition mandatory, no assumption of shared 125PS ECU. "+checkFord},
 {id:"rdw-bulk2-ford-fiesta-jhh-ecoboost100",make:"Ford",model:"Fiesta",rdwModel:"FIESTA",type:"JHH",from:2019,to:2019,cc:998,cylinders:3,kw:73.5,stockNm:170,engine:"Fiesta MkVIII JHH 1.0 EcoBoost 100PS (RDW 73.5kW rounded100PS)",
  power:[145,145],torque:[240,250],profileIds:["sourced-ford-fiesta-004e2fcbac57"],
  extras:[
    extra("br-performance","BR-Performance Fiesta VIII 1.0 EcoBoost 100","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1117-fiesta/9067-mk8-active-2017/9068-1-0t-ecoboost/",145,240,"Fiesta VIII 2017–2021 original 100PS/170Nm, Stage1 145PS/240Nm.")
  ],scope:"JHH MkVIII original 73.5kW 2019, NOT previous JA8 or newer 1.0 mHEV. Wet-belt and gearbox/ECU constraints mandatory. "+checkFord},
 {id:"rdw-bulk2-opel-corsa-u-f-12t100-2020",make:"Opel",model:"Corsa",rdwModel:"CORSA",type:"U",from:2020,to:2020,cc:1199,cylinders:3,kw:74,stockNm:205,engine:"Opel Corsa F U 1.2 Turbo 100PS petrol GPF, 1199cc",
  power:[130,135],torque:[240,240],profileIds:["sourced-opel-corsa-83066d51d4e0"],
  extras:[
    extra("br-performance","BR-Performance Opel Corsa F 1.2T GPF 100","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/42-opel/2130-corsa/10981-f-2019/11415-1-2-turbo-gpf/",135,240,"Corsa F 2019+ original 100PS/205Nm, Stage1 135PS/240Nm."),
    extra("shiftech","Shiftech Opel Corsa F 1.2 Turbo 100","https://www.shiftech.eu/en/chiptuning/car/opel/corsa/2019-f/petrol/1.2-turbo-100",130,240,"Corsa F 2019+ original 100PS/205Nm, Stage1 130PS/240Nm.")
  ],scope:"First admission 2020 only; 2024 factory chain/Euro changes not automatically covered, mixed hybrid excluded. "+checkPsa},
 {id:"rdw-bulk2-citroen-c3-s-12puretech110-2017",make:"Citroen",model:"C3",rdwModel:"C3",type:"S",from:2017,to:2017,cc:1199,cylinders:3,kw:81,stockNm:205,engine:"Citroën C3 III type S 1.2 PureTech 110 turbo EB2DT 2017",
  power:[145,145],torque:[270,270],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Citroen C3 III 2016–2018 1.2T110","https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/17-citroen/802-c3-c3-picasso/7817-11-2016-2020/7820-1-2t-puretech/",145,270,"C3 III original 110PS/205Nm 2016–2018, Stage1 145/270, EAT gearbox limits; separate later GPF 2019 source."),
    extra("shiftech","Shiftech Citroen C3 2017 1.2 THP PureTech 110","https://www.shiftech.eu/en/chiptuning/car/citroen/c3/2017/petrol/1.2-thp-puretech-110",145,270,"C3 2017 original 110PS/205Nm, Stage1 145PS/270Nm; not hybrid.")
  ],scope:"Only 2017 type S 81kW/1199cc, source engine EB2DT and ECU require confirmation. 2019 GPF owner torque may differ; withheld. "+checkPsa},
 {id:"rdw-bulk2-renault-kangoo-w-15dci75",make:"Renault",model:"Kangoo",rdwModel:"KANGOO",type:"W",from:2015,to:2019,cc:1461,cylinders:4,kw:55,stockNm:200,engine:"Kangoo II type W 1.5 dCi 75 marketed /55kW diesel K9K",
  fuel:"Diesel",power:[110,115],torque:[240,260],profileIds:["sourced-renault-kangoo-b737162d3a98"],
  extras:[
    extra("shiftech","Shiftech Kangoo II 2013 phaseII 1.5 dCi EU6 75","https://www.shiftech.eu/en/chiptuning/car/renault/kangoo/2013-ii-ii/diesel/1.5-dci-eu6-75",110,240,"Kangoo II 2013 phase2 Euro6 original 75PS/180Nm, Stage1 110PS/240Nm. Another publisher quotes 200Nm stock; do not infer transmission torque.")
  ],scope:"Kangoo W 1461cc 55kW diesel, 2015–2019; 180 vs200Nm source original torque discrepancy requires K9K/gearbox code confirmation. No DPF deletion. "+checkRenault},
 {id:"rdw-bulk2-peugeot-5008-m-12t130-2018-19",make:"Peugeot",model:"5008",rdwModel:"5008",type:"M",from:2018,to:2019,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"Peugeot 5008 II M 1.2 PureTech 130 petrol turbo pre-2020 facelift",
  power:[145,150],torque:[270,275],profileIds:["sourced-peugeot-5008-fad1920bf249"],
  scope:"5008 II 2018–2019 type M old phase 2017–2020, source archived ATM + Shiftech; GPF/engine rev/gearbox check. "+checkPsa},
 {id:"rdw-bulk2-peugeot-5008-m-12t130-2021",make:"Peugeot",model:"5008",rdwModel:"5008",type:"M",from:2021,to:2021,cc:1199,cylinders:3,kw:96,stockNm:230,engine:"Peugeot 5008 II facelift M 1.2 PureTech 130 petrol turbo GPF",
  power:[145,150],torque:[270,275],profileIds:["sourced-peugeot-5008-2a7382fd0032"],
  scope:"5008 II facelift first admission 2021, archived ATM + Shiftech 2020+ GPF; distinct from non-hybrid 2018/19 source phase. "+checkPsa},
 {id:"rdw-bulk2-vw-caddy-2kn-20tdi140-2013-14",make:"Volkswagen",model:"Caddy",rdwModel:"CADDY",type:"2KN",from:2013,to:2014,cc:1968,cylinders:4,kw:103,stockNm:320,engine:"VW Caddy III facelift 2KN 2.0 TDI CR 140PS /103kW diesel",
  fuel:"Diesel",power:[180,185],torque:[400,410],profileIds:["sourced-volkswagen-caddy-ce00f32a90bd"],
  scope:"RDW 2KN 2013–2014 2.0 TDI 140 only; 2015 transition Caddy IV excluded. Confirm EA189 engine/ECU, DPF intact and manual/DSG torque. "+checkVag},
 {id:"rdw-bulk2-vw-golf-1k-14tsi122-2009",make:"Volkswagen",model:"Golf",rdwModel:"GOLF",type:"1K",from:2009,to:2009,cc:1390,cylinders:4,kw:90,stockNm:200,engine:"Volkswagen Golf VI 1K 1.4 TSI 122PS/90kW EA111 1390cc",
  power:[145,145],torque:[250,250],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Golf VI 2008–2012 1.4 TSI 122","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/2969-vi-2008-2012/2974-1-4-tsi/",145,250,"Golf VI original 122PS/200Nm, Stage1 145PS/250Nm."),
    extra("vagtechniek","VAGtechniek Golf 6 1.4 TSI 122","https://www.vagtechniek.nl/chiptuning/volkswagen/golf/6/1.4-tsi-122pk/",145,250,"Golf 6 original 122PS/200Nm, ordinary Stage1 145PS/250Nm; Stage1+150/260 excluded.")
  ],scope:"Only Golf VI 1K first admitted 2009 original 90kW/1390cc; 1.4 TSI 140/160 twincharger different. Check CAXA, chain and DQ200. "+checkVag},
 {id:"rdw-bulk2-vw-golf-au-12tsi105-2014-15",make:"Volkswagen",model:"Golf",rdwModel:"GOLF",type:"AU",from:2014,to:2015,cc:1197,cylinders:4,kw:77,stockNm:175,engine:"Volkswagen Golf VII AU 1.2 TSI 105PS /77kW EA211 1197cc",
  power:[130,130],torque:[215,220],profileIds:[],
  extras:[
    extra("br-performance","BR-Performance Golf VII 2012–2014 1.2 TSI 105","https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-golf-vii-mk1-2012-2017/5108-1-2-tsi/",130,215,"Golf VII 2012–2014 105PS/175Nm, Stage1 130PS/215Nm; BR source phase stops 2014."),
    extra("shiftech","Shiftech Golf VII MKI 2012 1.2 TSI 105","https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2012-vii-mki/petrol/1.2-tsi-ss-105",130,220,"Golf VII early 105PS/175Nm, Stage1 130PS/220Nm."),
    extra("vagtechniek","VAGtechniek Golf 7 1.2 TSI 105","https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7/1.2-tsi-105pk/",130,220,"Golf 7 1.2 TSI105/175, ordinary Stage1 130/220, stronger Stage1+140/240 excluded.")
  ],scope:"Golf VII 2014–15 original 77kW/1197cc, not earlier 1K or Golf VII 1.2 TSI 110 81kW. Manual/DSG limits and ECU identification mandatory. "+checkVag}
];
export const reviewedRdwBulkBatch2=buildReviewedRdwBulkBatch(seeds);
export const reviewedRdwBulkBatch2Count=reviewedRdwBulkBatch2.length;
