// SERVER BOUNDARY: independent, generation-scoped observations, never a copied competitor catalogue.
// Only reviewed applications with explicit matching identity and source URLs belong here.
import {serviceOptions} from "./catalog-shared.ts";
import {reviewedBulkRdwApplications} from "./reviewed-rdw-bulk-batch.ts";
import {reviewedRdwBulkBatch2} from "./reviewed-rdw-bulk-batch-2.ts";
import {reviewedRdwBulkBatch3} from "./reviewed-rdw-bulk-batch-3.ts";
import {reviewedRdwBulkBatch4} from "./reviewed-rdw-bulk-batch-4.ts";
import {reviewedRdwBulkBatch5} from "./reviewed-rdw-bulk-batch-5.ts";
import {reviewedRdwBulkBatch6} from "./reviewed-rdw-bulk-batch-6.ts";
import {normalizeCatalogFuel, registeredPowerToMetricHp} from "./catalog-matching.ts";
import {unavailableEstimateStage, type EstimateResolution, type EstimateSourceReference} from "./tuning-estimates-shared.ts";
import {firstAdmissionYear} from "../lib/rdw-date.ts";
import type {EstimateMatchInput} from "./tuning-estimates.ts";

type VerifiedApplication = {
  id: string;
  make: string;
  model: string;
  generation: string;
  yearFrom: number;
  yearTo: number;
  displacementCc: number;
  cylinders: number;
  stockPowerHp: number;
  /** RDW's original kW must match for rounded 115/116 PS references. */
  registeredPowerKw?: number;
  /** A known RDW homologation body code is positive, not guessed, evidence. */
  requiredRdwType?: string;
  /** Restrict reviewed applications to exact RDW trading names where aliases are unsafe. */
  allowedRdwModels?: readonly string[];
  stockTorqueNm: number;
  fuel: "Petrol" | "Diesel" | "CNG";
  engineLabel: string;
  requirements: string;
  powerRangeHp: [number, number];
  torqueRangeNm: [number, number];
  sources: EstimateSourceReference[];
  reviewNote: string;
};

// Numeric boundaries are the actual tuner-published values (not percent multipliers).
// F40 136 PS is NOT interchangeable with the 140 PS F40 variant or the 136 PS F20/F21.
// All values are provisional. ECU/fuel/hardware require customer-specific confirmation.
export const verifiedRdwApplications: readonly VerifiedApplication[] = [{
  id: "rdw-bmw-118i-f40-136",
  make: "BMW",
  model: "118i",
  generation: "F40",
  yearFrom: 2020,
  yearTo: 2024,
  displacementCc: 1499,
  cylinders: 3,
  stockPowerHp: 136,
  stockTorqueNm: 220,
  fuel: "Petrol",
  engineLabel: "1.5 turbo petrol (1499 cc)",
  requirements: "Confirm installed ECU, RON grade, fuel/hardware compatibility, and vehicle condition before calibration.",
  powerRangeHp: [165, 180],
  torqueRangeNm: [278, 280],
  sources: [
    {title: "BR-Performance BMW 118i F40 136 PS", sourceType: "tuner", retrievalMethod: "search-index", retrievedAt: "2026-10-07",
      url: "https://www.br-performance.be/en-be/chiptuning/1-cars/5-bmw/508-serie-1/10897-f4x-2019-2024/19033-118i-1-5t/",
      scope: "F40 2020–2024, 1.5 petrol, 136/220 stock, Stage 1 180 PS/280 Nm; provider indication only."},
    {title: "BORTEC BMW 118i F40 136 PS", sourceType: "tuner", retrievalMethod: "search-index", retrievedAt: "2026-10-07",
      url: "https://bortec-tuning.de/tuning/bmw/1er/f40-2019-2024/118i-136-ps/",
      scope: "F40 2019–2024, 118i 136 PS/220 Nm, Stage 1 180 PS/280 Nm; independent published claim."},
    {title: "TuningBot BMW 118i F40 136 PS application", sourceType: "tuner", retrievalMethod: "search-index", retrievedAt: "2026-10-07",
      url: "https://tuningbot.com/ecu-tuning/bmw/118i/",
      scope: "F40 118i 1.5 T 136 PS, MG1CS201 application, approximately +29 PS/+58 Nm; ECU not identified by RDW."}
  ],
  reviewNote: "Published F40 136 PS Stage 1 claims disagree; range spans observed 165–180 PS and 278–280 Nm. RON grade, ECU family, condition and transmission must be checked. These are not NoordTune measurements."
}, {
  id: "rdw-vw-caddy-iv-14-tgi-cng-110",
  make: "Volkswagen",
  model: "Caddy",
  generation: "IV (2K facelift, 2015–2020)",
  yearFrom: 2015,
  yearTo: 2020,
  displacementCc: 1395,
  cylinders: 4,
  stockPowerHp: 110,
  stockTorqueNm: 200,
  fuel: "CNG",
  engineLabel: "1.4 TGI CNG (1395 cc)",
  requirements: "Confirm CNG / gas-system compatibility, original ECU calibration, vehicle condition and transmission before work. Do not substitute petrol-only figures.",
  powerRangeHp: [135, 140],
  torqueRangeNm: [240, 250],
  sources: [
    {title: "BR-Performance Caddy IV 1.4 TGI", sourceType: "tuner", retrievalMethod: "page",
      retrievedAt: "2026-10-07", url: "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2937-caddy/7057-iv-07-2015-2020/7633-1-4-tgi/",
      scope: "2015–2020 Caddy IV 1.4 TGI 110/200 stock, Stage 1 135/250."},
    {title: "Shiftech Caddy 1.4 TGI 110", sourceType: "tuner", retrievalMethod: "page",
      retrievedAt: "2026-10-07", url: "https://www.shiftech.eu/en/chiptuning/car/volkswagen/caddy/2015-4/petrol/1.4-tgi-110",
      scope: "2015-onwards Caddy 1.4 TGI 110/200 stock, Stage 1 135/240; verify CNG application."},
    {title: "VAGtechniek Caddy 2K facelift2 1.4 TGI", sourceType: "tuner", retrievalMethod: "page",
      retrievedAt: "2026-10-07", url: "https://www.vagtechniek.nl/chiptuning/volkswagen/caddy/2k-facelift2/1.4-tgi-110pk/",
      scope: "Caddy 2K facelift2 1.4 TGI 110/200 stock, Stage 1 140/250. Excludes Stage 1+ 145/260."},
    {title: "Van Drie Performance Caddy 2015–2020 1.4 TGI", sourceType: "tuner", retrievalMethod: "page",
      retrievedAt: "2026-10-07", url: "https://vandrieperformance.nl/voertuigen/volkswagen-caddy-2015-2020-1-4-tgi-110pk/",
      scope: "2015–2020 Caddy 1.4 TGI 110/200 stock, Stage 1 135/250, published indicative figures."}
  ],
  reviewNote: "Indicative values from generation-and-fuel-specific 1.4 TGI references. Provider outputs vary: 135–140 PS, 240–250 Nm. Installed CNG system, ECU and fuel-specific calibration require workshop verification. No guarantee of power or road legality."
}, {
  id: "rdw-seat-leon-1p-14-tsi-125",
  make: "Seat", model: "Leon", generation: "1P facelift",
  yearFrom: 2009, yearTo: 2011,
  displacementCc: 1390, cylinders: 4,
  stockPowerHp: 125, stockTorqueNm: 200, fuel: "Petrol",
  engineLabel: "1.4 TSI CAXC turbo petrol (1390 cc)",
  requirements: "Confirm Seat Leon 1P / engine CAXC and Bosch MED17.5.20 or MED17.5.5 ECU, fuel quality, gearbox, installed hardware and engine condition. A 2009–2011 admission alone does not verify an installed ECU.",
  powerRangeHp: [145, 150], torqueRangeNm: [250, 265],
  sources: [
    {
      title: "VAGtechniek Seat Leon 1P facelift 1.4 TSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.vagtechniek.nl/chiptuning/seat/leon/1p-facelift/1.4-tsi-125pk/",
      scope: "1P facelift 1.4 TSI 125 PS / 200 Nm, Stage 1 145 PS / 250 Nm; Stage 1+ and fuel scope excluded."
    },
    {
      title: "Tuning Service Seat Leon 1P 1.4 TSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://tuningservice.nl/chiptuning/seat/leon/1p-2005-2012/14-tsi-125pk/",
      scope: "Leon 1P 2005–2012, 1390 cc, CAXC, Bosch MED17.5.20, stock 125 PS / 200 Nm, Stage 1 150 PS / 265 Nm; Stage 2 excluded."
    },
    {
      title: "BPT Portal Seat Leon 1P 1.4 TSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://bpt-portal.com/nl/tuning/cars/seat/leon/1p-2005-2012/1-4-tsi-125hp/",
      scope: "Leon 1P 2005–2012, CAXC, Bosch MED17.5.20/MED17.5.5, 125 PS / 200 Nm stock; Stage 1 145 PS / 250 Nm."
    }
  ],
  reviewNote: "Published 1P/CAXC 125 PS Stage 1 observations span 145–150 PS and 250–265 Nm; this is an indicative source range, not measured NoordTune output. Exact engine code, ECU software, fuel quality and workshop applicability require manual verification. No automatic Stage 2."
}, {
  id: "rdw-seat-leon-5f-10-tsi-85kw",
  make: "Seat", model: "Leon", generation: "5F (III)",
  yearFrom: 2015, yearTo: 2020,
  displacementCc: 999, cylinders: 3,
  // RDW: registered 85 kW -> rounded 116 metric PS. Provider references
  // normally label the very same 85 kW engine as "115 PS".
  stockPowerHp: 116, registeredPowerKw: 85, requiredRdwType: "5F", stockTorqueNm: 200, fuel: "Petrol",
  engineLabel: "1.0 TSI / EcoTSI petrol turbo (999 cc), CHZD check required",
  requirements: "Confirm actual 5F engine code CHZD/ECU (Bosch MED17.5.21), gearbox, RON grade, hardware and maintenance condition. RDW 85 kW rounds to 116 metric PS, while providers label the original output 115 PS. Excludes hybrids, E85 and Stage 1+.",
  powerRangeHp: [130, 135], torqueRangeNm: [225, 240],
  sources: [
    {title: "BR-Performance Leon 5F facelift 1.0 TSI 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.br-performance.lu/en-lu/chiptuning/1-cars/48-seat/2724-leon/9004-iii-facelift-5f-2016-2020/22357-1-0-tsi/",
      scope: "Leon III facelift 5F 1.0 TSI 115 PS / 200 Nm, Stage 1 130 PS / 240 Nm. No E85 or hardware Stage 2."},
    {title: "Shiftech Leon 5F MK2 1.0 TSI 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/1.0-tsi-tfsi-115",
      scope: "2017-on Leon 5F Mk2 1.0 TSI 115 PS / 200 Nm, Stage 1 135 PS / 240 Nm."},
    {title: "VAGtechniek Leon 5F facelift 1.0 EcoTSI 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/1.0-ecotsi-115pk/",
      scope: "Leon 5F facelift 1.0 EcoTSI stock 115 PS / 200 Nm, Stage 1 135 PS / 225 Nm; separate Stage 1+ 140/240 excluded."}
  ],
  reviewNote: "Three published 5F 1.0 TSI Stage 1 observations span 130–135 PS / 225–240 Nm, original provider stock is labelled 115 PS / 200 Nm. RDW 85 kW displays approximately 116 metric PS after conversion; any displayed gain is calculated against registered 116 PS, not a provider-stated +15/+20. These are indicative, not NoordTune measured figures."
}, {
  id: "rdw-nissan-juke-f15-12-digt-85kw",
  make: "Nissan", model: "Juke", generation: "F15 facelift",
  yearFrom: 2014, yearTo: 2019,
  displacementCc: 1197, cylinders: 4,
  stockPowerHp: 116, registeredPowerKw: 85, requiredRdwType: "F15", stockTorqueNm: 190, fuel: "Petrol",
  engineLabel: "1.2 DIG-T turbo petrol (1197 cc), HR12DDT / HRA2 check required",
  requirements: "Confirm F15 model, installed HR12DDT/HRA2 engine, manual gearbox, ECU family (Siemens/Continental EMS3155 or compatible), fuel grade and condition. Nissan/ADAC specify 85 kW / 115 PS / 190 Nm; RDW 85 kW is displayed as about 116 metric PS. Not a Stage 2 promise.",
  powerRangeHp: [130, 131], torqueRangeNm: [230, 231],
  sources: [
    {title: "Shiftech Nissan Juke F15 1.2 DIG-T 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.shiftech.eu/en/chiptuning/car/nissan/juke/2010/petrol/1.2-dig-t-115",
      scope: "Juke F15 1.2 DIG-T stock 115 PS / 190 Nm, Stage 1 130 PS / 230 Nm, no Stage 2 output reused."},
    {title: "RS-Tronic Nissan Juke 1.2 DIG-T 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://rstronic.com/en/chiptuning/nissan/juke/2010/1.2-dig-t-115",
      scope: "F15 Juke 1.2 DIG-T original 115 PS / 190 Nm, Stage 1 130 PS / 230 Nm."},
    {title: "KHPTOOLS Nissan Juke 1.2 DIG-T 115 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.khptools.com/reprogramacion/turismos-furgonetas/nissan/juke/2010-2018/12-dig-t/115/3440/stage-1",
      scope: "Juke 2010–2018 1.2 DIG-T 115 PS / 190 Nm, Stage 1 131 PS / 231 Nm."},
    {title: "Nissan News: new Juke DIG-T 115 factory powertrain",
      sourceType: "manufacturer", retrievalMethod: "search-index", retrievedAt: "2026-10-08",
      url: "https://france.nissannews.com/fr-FR/releases/nouveau-nissan-juke-un-crossover-toujours-plus-turbulent?downloadUrl=%2Ffr-FR%2Freleases%2Frelease-117996%2Fdownload&la=1",
      scope: "Official Nissan release: Juke 1.2 DIG-T 115 PS (85 kW), 190 Nm, 1197 cc with six-speed manual. Manufacturer stock data only, not an ECU or tuning result."}
  ],
  reviewNote: "Independent F15 1.2 DIG-T Stage 1 observations 130–131 PS / 230–231 Nm. Official original 85 kW corresponds to a manufacturer-labelled 115 PS, while the RDW metric conversion is rounded to 116 PS. ECU, transmission, year, fuel and vehicle condition must be checked; no guarantee of gains."
}, {
  id: "rdw-skoda-octavia-5e-14-tsi-140",
  make: "Skoda", model: "Octavia", generation: "5E (III, pre-facelift)",
  yearFrom: 2013, yearTo: 2015,
  displacementCc: 1395, cylinders: 4,
  // RDW registration 103 kW resolves to about 140 metric PS.
  registeredPowerKw: 103, requiredRdwType: "5E",
  stockPowerHp: 140, stockTorqueNm: 250, fuel: "Petrol",
  engineLabel: "1.4 TSI EA211 (1395 cc, 103 kW), CHPA check required",
  requirements: "Confirm Octavia III type 5E, EA211/CHPA engine code and installed ECU; verify fuel octane, engine health and manual/DSG clutch or gearbox torque limits before calibration. Excludes 1.4 TSI 150 PS, 1.4 TGI G-TEC CNG, hybrid and Stage 1+.",
  powerRangeHp: [170, 180], torqueRangeNm: [300, 320],
  sources: [
    {title: "BR-Performance Octavia III 1.4 TSI CHPA 140 PS (2013–2015)",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/49-skoda/2764-octavia/5430-2013-2017/5435-1-4-tsi-chpa/",
      scope: "Octavia III 1.4 TSI 140 PS / 250 Nm, model years 2013–2015, Stage 1 170 PS / 300 Nm; explicitly not the later 150 PS engine."},
    {title: "Shiftech Octavia 2013 1.4 TSI 140 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2013/petrol/1.4-tsi-tfsi-ss-140",
      scope: "Octavia 2013 1.4 TSI 140 PS / 250 Nm; Stage 1 180 PS / 300 Nm, excluding E85."},
    {title: "VAGtechniek Octavia 5E 1.4 TSI 140 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.vagtechniek.nl/chiptuning/skoda/octavia/5e/1.4-tsi-140pk/",
      scope: "Octavia 5E 1.4 TSI 140 PS / 250 Nm, Stage 1 180 PS / 320 Nm; separate Stage 1+ 185/330 is excluded, DSG requires individual confirmation."}
  ],
  reviewNote: "Three independently published 5E/CHPA 140 PS Stage 1 indications span 170–180 PS and 300–320 Nm; source-only example, not a NoordTune dyno measurement. Exact 103 kW RDW type 5E petrol identity is required. ECU, fuel, clutch/DSG, condition and calibration limits must be confirmed before quotation; no numerical Stage 2 or Stage 3."
}, {
  id: "rdw-skoda-octavia-1z-14-tsi-122",
  make: "Skoda", model: "Octavia", generation: "1Z facelift (II)",
  yearFrom: 2009, yearTo: 2013,
  displacementCc: 1390, cylinders: 4,
  // Registered 90 kW rounds to 122 metric PS; RDW cannot identify CAXA/ECU.
  registeredPowerKw: 90, requiredRdwType: "1Z",
  stockPowerHp: 122, stockTorqueNm: 200, fuel: "Petrol",
  engineLabel: "1.4 TSI petrol turbo (1390 cc), CAXA check required",
  requirements: "Confirm 1Z facelift, CAXA engine family, installed Bosch MED17.5.x ECU/software, octane, engine condition, timing-chain history, DSG/manual clutch and torque limit before any calibration. Excludes III 5E, NX, CNG/hybrid, E85, Stage 1+, and unsupported Stage 2.",
  powerRangeHp: [140, 155], torqueRangeNm: [240, 270],
  sources: [
    {title: "VAGtechniek Octavia 1Z facelift 1.4 TSI 122 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.vagtechniek.nl/chiptuning/skoda/octavia/1z-facelift/1.4-tsi-122pk/",
      scope: "Octavia II 1Z facelift, 2009–2013, 1.4 TSI original 122 PS / 200 Nm. Standard Stage 1 145 PS / 250 Nm; separate Stage 1+ 150/260 excluded."},
    {title: "BR-Performance Octavia II 1.4 TSI 122 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/49-skoda/2764-octavia/2765-2004-2012/2767-1-4-tsi/",
      scope: "Octavia II 2004–2012 1.4 TSI original 122 PS / 200 Nm, Stage 1 145 PS / 250 Nm; 2013 admission supported separately by 1Z facelift source."},
    {title: "Shiftech Octavia II 1.4 TSI 122 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.4-tsi-tfsi-122",
      scope: "Octavia II 1.4 TSI 122 PS / 200 Nm, Stage 1 140 PS / 240 Nm; no E85 conversion figure reused."},
    {title: "Tuning Service Octavia II 1.4 TSI 122 PS CAXA",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://tuningservice.nl/chiptuning/skoda/octavia/2004-2012/14-tsi-122pk/",
      scope: "Octavia II 1390 cc CAXA, Bosch MED17.5.20 reference, 122 PS / 200 Nm, published Stage 1 155 PS / 270 Nm; installed ECU still unconfirmed."}
  ],
  reviewNote: "Four published Octavia II/1Z 1.4 TSI 122 PS Stage 1 observations range 140–155 PS and 240–270 Nm. Original 90 kW and fuel are confirmed RDW facts, while 200 Nm, CAXA and ECU references are external. These are indicative publisher examples, not NoordTune measured output. Verify real 1Z generation, ECU, fuel grade, timing chain/condition and gearbox before a quote; no numerical Stage 2 or Stage 3."
}, {
  id: "rdw-audi-a1-8x-12-tfsi-86",
  make: "Audi", model: "A1", generation: "8X (2010–2014)",
  yearFrom: 2010, yearTo: 2014,
  displacementCc: 1197, cylinders: 4,
  registeredPowerKw: 63, requiredRdwType: "8X", allowedRdwModels: ["AUDI A1", "A1"],
  stockPowerHp: 86, stockTorqueNm: 160, fuel: "Petrol",
  engineLabel: "1.2 TFSI petrol turbo, 1197 cc (CBZA/EA111 check required)",
  requirements: "Confirm original 63 kW Audi A1 8X CBZA engine, installed Simos 10 or other ECU by vehicle scan, firmware, maintenance/timing-chain condition, fuel grade and manual/DSG DQ200 torque capacity. Provider sources disagree on mild versus aggressive Stage 1; do not claim ECU compatibility from RDW. Excludes E85, S1/Sportback without independent matching, Stage 2 and Stage 3.",
  powerRangeHp: [105, 130], torqueRangeNm: [175, 220],
  sources: [
    {title:"TVS Engineering Audi A1 8X 1.2 TFSI 86 PS (mild Stage 1)",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://tvsengineering.com/tuning/audi-a1-8x-2010-2014-1-2-tfsi-86hp-tuning/",
      scope:"Audi A1 8X 2010–2014, CBZA EA111, 86 PS / 160 Nm, mild Stage 1 105 PS / 175 Nm. TVS also has separate Stage 2 values; excluded."},
    {title:"BR-Performance Audi A1 8X 1.2 TFSI 86 PS",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/203-8x-2010-2014/204-1-2-tfsi/",
      scope:"Audi A1 8X 2010–2014, stock 86 PS/160 Nm, Stage 1 130 PS/215 Nm. E85 excluded."},
    {title:"Shiftech Audi A1 8X 1.2 TSI/TFSI 85 PS",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://www.shiftech.eu/en/chiptuning/car/audi/a1/2010-8x/petrol/1.2-tsi-tfsi-85",
      scope:"Audi A1 8X 1.2 TFSI original 85 PS/160 Nm (provider rounding), Stage 1 130 PS/220 Nm. Official RDW registered 63 kW rounds to 86 metric PS."}
  ],
  reviewNote:"Independent Audi A1 8X 1.2 TFSI providers differ substantially: TVS mild Stage 1 105/175, BR-Performance 130/215 and Shiftech 130/220. The 105–130 PS / 175–220 Nm interval is a sourced indication, NOT a predicted achievable range for an uninspected car. A more aggressive 140/225 Stage 1 claim by another provider was deliberately not automatically approved. Stock 63 kW is an RDW fact; 160 Nm, CBZA and ECU family are externally sourced and must be confirmed. No unsupported higher Stage numbers."
}, {
  id: "rdw-audi-a1-8x-14-tfsi-122",
  make: "Audi", model: "A1", generation: "8X (2010–2014)",
  yearFrom: 2010, yearTo: 2014,
  displacementCc: 1390, cylinders: 4,
  registeredPowerKw: 90, requiredRdwType: "8X", allowedRdwModels: ["AUDI A1", "A1"],
  stockPowerHp: 122, stockTorqueNm: 200, fuel: "Petrol",
  engineLabel: "1.4 TFSI petrol turbo, 1390 cc (EA111; exact engine code to verify)",
  requirements: "Verify original 90 kW 122 PS A1 8X, actual engine code (manufacturer and tuner sources vary CPVA/CNVA), installed ECU and software, RON grade, timing-chain/engine health, and especially DQ200 dry clutch or manual gearbox torque limits before any calibration. Excludes 1.4 140/185 PS, E85, later GB/8Y, hybrid/CNG, and numerical Stage 2/3.",
  powerRangeHp: [135, 155], torqueRangeNm: [230, 270],
  sources: [
    {title:"Audi A1 1.4 TFSI 90 kW manufacturer specification",
      sourceType:"manufacturer", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://www.audi.de/dam/nemo/customer-area/more-information/predecessor-models/a1/a1/pdf/AU210_1.4TFSI_119_2010_neu.pdf",
      scope:"March 2010 official Audi A1 1.4 TFSI 90 kW/122 PS, 1390 cc/200 Nm and S tronic DSG; factory specification only, not a tuning output or installed ECU identity."},
    {title:"TVS Engineering Audi A1 8X 1.4 TFSI 122 PS (mild Stage 1)",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://tvsengineering.com/tuning/audi-a1-8x-2010-2014-1-4-tfsi-122hp-tuning/",
      scope:"A1 8X 1.4 TFSI 122 PS/200 Nm, mild Stage 1 135 PS/230 Nm, DQ200 gearbox source scope; customer-specific gearbox must be verified."},
    {title:"Shiftech Audi A1 8X 1.4 TSI/TFSI 122 PS",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://www.shiftech.eu/en/chiptuning/car/audi/a1/2010-8x/petrol/1.4-tsi-tfsi-122",
      scope:"A1 8X stock 122 PS/200 Nm, Stage 1 140 PS/240 Nm; E85 tuning is separately published and excluded."},
    {title:"BR-Performance Audi A1 8X 1.4 TFSI 122 PS",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/203-8x-2010-2014/205-1-4-tfsi/",
      scope:"Audi A1 8X 2010–2014, original 122 PS/200 Nm, Stage 1 145 PS/250 Nm. No E85."},
    {title:"Tuning Service Audi A1 8X 1.4 TFSI 122 PS",
      sourceType:"tuner", retrievalMethod:"page", retrievedAt:"2026-10-08",
      url:"https://tuningservice.nl/chiptuning/audi/a1/8x-2010-2014/14-tfsi-122pk/",
      scope:"A1 8X 1390 cc original 122 PS/200 Nm, Stage 1 155 PS/270 Nm, listed engine CNVA/ECU MED17.5.5; not proof of customer's installed ECU."}
  ],
  reviewNote:"The exact 90 kW Audi A1 8X petrol has Audi factory 122 PS/200 Nm; published mild-to-strong Stage 1 source claims span 135–155 PS and 230–270 Nm. The owner must verify engine/ECU, RON, maintenance and DQ200/manual drivetrain before a price or performance statement. These are independent provider claims, not measured NoordTune output; no numerical Stage 2/3."
}, {
  id: "rdw-audi-a3-8p-14-tfsi-125",
  make: "Audi", model: "A3", generation: "8P facelift (2008–2012)",
  yearFrom: 2008, yearTo: 2012,
  displacementCc: 1390, cylinders: 4,
  registeredPowerKw: 92, requiredRdwType: "8P",
  allowedRdwModels: ["AUDI A3", "A3"],
  stockPowerHp: 125, stockTorqueNm: 200, fuel: "Petrol",
  engineLabel: "1.4 TFSI petrol turbo 1390 cc / 92 kW (CAXC/EA111 check required)",
  requirements: "Require actual Audi A3 facelift type 8P 1390 cc original 92 kW petrol and model-year-suitable engine. Source catalogues target 2008–2012; 2013/2014 first registrations are withheld until ECU and production-year documentary evidence is reviewed. Confirm CAXC/EA111 engine and installed ECU, timing chain/oil health, RON grade and manual or DQ200 dry-clutch limits. Excludes A3 8V/8Y/8L, 1.2 TFSI 1197 cc, 122 PS/90 kW, Sportback without exact reviewed registration name, hybrids/E85 and unsupported later stages.",
  powerRangeHp: [135, 150], torqueRangeNm: [230, 255],
  sources: [
    {title: "TVS Engineering Audi A3 8P 1.4 TFSI 125 PS mild Stage 1",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://tvsengineering.com/tuning/audi-a3-8p-2008-2012-1-4-tfsi-125hp-tuning/",
      scope: "Audi A3 8P 2008–2012, original 125 PS/200 Nm, documented CAXC and DQ200 provider scope. Mild Stage 1 135 PS/230 Nm; gearbox type not inferred from RDW."},
    {title: "Shiftech Audi A3 8P 1.4 TSI/TFSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.shiftech.eu/en/chiptuning/car/audi/a3/2008-8p/petrol/1.4-tsi-tfsi-125",
      scope: "Audi A3 8P 1.4 TFSI stock 125 PS/200 Nm, Stage 1 140 PS/240 Nm; separate E85 programmes explicitly excluded."},
    {title: "VAGtechniek Audi A3 8P facelift 1.4 TFSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.vagtechniek.nl/chiptuning/audi/a3/8p-facelift/1.4-tfsi-125pk/",
      scope: "A3 8P facelift 1.4 TFSI 125 PS/200 Nm, Stage 1 145 PS/250 Nm; Stage 1+ 150 PS/260 Nm not included."},
    {title: "BR-Performance Audi A3 8P facelift 1.4 TSI 125 PS",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/213-a3-a3-berline/214-8p-mk2-2008-2012/5156-1-4-tsi/",
      scope: "A3 8P facelift 2008–2012 1.4 TSI stock 125 PS/200 Nm, Stage 1 145 PS/250 Nm, not E85."},
    {title: "SLS Tuning Audi A3 8P 1.4 TSI original 92 kW",
      sourceType: "tuner", retrievalMethod: "page", retrievedAt: "2026-10-08",
      url: "https://www.slstuning.de/chiptuning/audi/a3-8p/800-14-tsi/stage-1/",
      scope: "A3 8P original 92 kW / 125 PS / 200 Nm; Stage 1 110 kW / 150 PS / 255 Nm. The 110 kW denotes tuned power, NOT another stock A3 engine."}
  ],
  reviewNote: "Five reviewed A3 8P 125 PS Stage 1 source indications: 135–150 PS and 230–255 Nm; output is a publisher range, not NoordTune dyno data or a guarantee. Exact 92 kW/1390cc/8P registration and 2008–2012 original admission required. Four 2013 A3 8P registrations in the frozen cohort remain held for production-year/ECU evidence. A competing Tuning Service listing erroneously states 1197cc for its nominal 1.4 TFSI 125 PS; intentionally excluded. Installed CAXC, ECU, DSG/manual, maintenance and fuel require workshop review; no Stage 2 or Stage 3 figures."
}, {
  id: "rdw-renault-megane-z-12-tce-115",
  make: "Renault", model: "Megane", generation: "III (RDW Z, 2012–2015)",
  yearFrom: 2012, yearTo: 2015,
  displacementCc: 1197, cylinders: 4,
  registeredPowerKw: 85, requiredRdwType: "Z",
  allowedRdwModels: ["MEGANE"],
  stockPowerHp: 116, stockTorqueNm: 190, fuel: "Petrol",
  engineLabel: "1.2 TCe 115, H5Ft turbo petrol (RDW 1197 cc, source marketing 115 PS)",
  requirements: "Confirm original 85 kW RDW Megane III type Z and the actual H5Ft engine/ECU before calibration. Sources label 115 PS while 85 kW rounds to 116 metric PS; never overwrite the registered power. Check oil consumption, timing-chain/engine condition, fault codes, fuel octane, emissions legality and actual manual/EDC clutch/transmission torque limits. Published 1198 cc brochure figures are a one-cc nominal specification mismatch and not a license to match another engine. Exclude RFB Megane IV, Nissan DIG-T, E85, hybrids and unsupported Stage 2/3.",
  powerRangeHp: [130, 135], torqueRangeNm: [230, 230],
  sources: [
    {title:"BR-Performance Megane III phase 2 1.2 TCe 115 PS 2012–2013",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://www.br-performance.lu/en-lu/chiptuning/1-cars/45-renault/2547-megane/5366-megane-3-ph2-2012-2013/5369-1-2-tce/",
      scope:"Megane III phase2 2012–2013, original marketed 115 PS / 190 Nm, Stage 1 130 PS / 230 Nm; E85 explicitly incompatible."},
    {title:"BR-Performance Megane III phase 3 1.2 TCe 115 PS 2014–2015",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/45-renault/2547-megane/5988-megane-3-ph3-2014-2015/5994-1-2-tce/",
      scope:"Megane III phase3 2014–2015 original 115 PS / 190 Nm, Stage 1 130 PS / 230 Nm; different from 130 PS version."},
    {title:"Shiftech Megane III phase 3 1.2 TCe 115",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://www.shiftech.eu/en/chiptuning/car/renault/megane/2014-iii-ii/petrol/1.2-tce-115",
      scope:"2014 Megane III 1.2 TCe 115 PS / 190 Nm, Stage 1 135 PS / 230 Nm, E85 a separate product and excluded."}
  ],
  reviewNote:"Indicative external Stage 1 claims for the 1.2 TCe 115 range 130–135 PS, 230 Nm; this is not a NoordTune dyno result or an achievable-output guarantee. RDW 85kW converts to displayed 116 PS despite the marketed 115 PS. Source catalogues often round the nominal 1197cc RDW engine to 1198cc. ECU, fuel, oil/timing-chain health and gearbox must be inspected. No higher Stage output."
}, {
  id: "rdw-renault-megane-z-12-tce-130",
  make: "Renault", model: "Megane", generation: "III (RDW Z, 2013–2015)",
  yearFrom: 2013, yearTo: 2015,
  displacementCc: 1197, cylinders: 4,
  registeredPowerKw: 97, requiredRdwType: "Z",
  allowedRdwModels: ["MEGANE"],
  stockPowerHp: 132, stockTorqueNm: 205, fuel: "Petrol",
  engineLabel: "1.2 Energy TCe 130 H5Ft (RDW 1197 cc / 97 kW; marketing 130 PS)",
  requirements: "Require type Z Megane III with original RDW 97 kW/1197cc petrol, not 96 kW, 85 kW, hybrid, type RFB/Megane IV or Nissan Juke. Renault's 130 PS marketing differs from the mathematical 97 kW→132 metric PS conversion, and the official source lists a nominal 1198 cc displacement: preserve RDW facts and verify engine code H5Ft. Inspect ECU software, maintenance/oil consumption, timing chain, fault codes, octane, manual/EDC gearbox/clutch and legal/road suitability; source high torque is not automatically suitable. No Stage 2/3.",
  powerRangeHp: [140, 150], torqueRangeNm: [230, 240],
  sources: [
    {title:"Renault official 2013 Energy TCe 130 introduction",
      sourceType:"manufacturer",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://suppliers.renault.com/pfr_visible/Images/20130305_DP_Renault_Geneva_2013_GB_tcm319-1141028.pdf",
      scope:"Renault 2013 Geneva briefing pp30–31: TCe 130, 97kW at 5,500rpm, marketed 130hp, 205Nm, official nominal 1198cc, Megane III application. Manufacturer factory facts only, not a Stage 1 result. RDW reports 1197cc; source nominal differs by 1cc."},
    {title:"BR-Performance Megane III phase 3 1.2 TCe 130",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/45-renault/2547-megane/5988-megane-3-ph3-2014-2015/5990-1-2-tce/",
      scope:"Megane III phase3 2014–2015 original 130PS / 205Nm marketed, Stage 1 140PS / 230Nm. E85 excluded."},
    {title:"Shiftech Megane III phase 3 1.2 TCe 130",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://www.shiftech.eu/en/chiptuning/car/renault/megane/2014-iii-ii/petrol/1.2-tce-130",
      scope:"Megane III 2014 1.2 TCe 130PS / 205Nm, live page Stage 1 140PS / 230Nm; search index previously showed 145PS / 255Nm. Withhold the higher inconsistent value; E85 separately excluded."},
    {title:"GSG Performance Megane III phase 3 1.2 TCe 130",
      sourceType:"tuner",retrievalMethod:"page",retrievedAt:"2026-10-08",
      url:"https://gsgperformance.com/car-detail/renault/megane/3-ph3-2013-2015/1-2-tce-130hp",
      scope:"Megane III phase3 2013–2015, marketed factory 130PS / 205Nm, Stage 1 150PS / 240Nm; independent tuner claim only, not NoordTune approval of stated performance."}
  ],
  reviewNote:"Conservatively scoped phase3 TCe130 Stage 1 results: 140/230 (BR), 140/230 (Shiftech live page) and 150/240 (GSG). Shiftech indexed 145/255 contradicts the live page, so the higher torque is excluded pending manual reconciliation. The 140–150PS / 230–240Nm values are illustrative provider outputs, never a guaranteed range. 97kW RDW rounds to 132 metric PS, not the manufacturer's 130 PS marketing convention; torque 205Nm is manufacturer-sourced. Nominal 1198cc is in Renault's 2013 press information while RDW reports 1197cc. Check true H5Ft ECU, engine health, fuel and gearbox before any quote; no Stage 2/3."
}, ...reviewedBulkRdwApplications, ...reviewedRdwBulkBatch2, ...reviewedRdwBulkBatch3, ...reviewedRdwBulkBatch4, ...reviewedRdwBulkBatch5, ...reviewedRdwBulkBatch6];

function normalized(value?: string) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function yearOf(input: EstimateMatchInput) {
  const fromDate = firstAdmissionYear(input.firstRegistrationDate ?? undefined);
  const explicit = input.firstRegistrationYear;
  if (typeof explicit === "number" && Number.isInteger(explicit)) {
    if (input.firstRegistrationDate && fromDate !== explicit) return undefined;
    return explicit;
  }
  return fromDate;
}

function matches(input: EstimateMatchInput, app: VerifiedApplication) {
  const year = yearOf(input);
  const hp = registeredPowerToMetricHp(input);
  const model = normalized(input.model);
  const acceptedModelName = normalized(app.model);
  // Punctuation in RDW model names (MX-5, T-Roc, C5 Aircross) becomes spaces.
  // Match a complete model phrase on word boundaries only when an EXACT RDW
  // trading-name allowlist is also provided; never broaden old token rules.
  const phraseInName = app.allowedRdwModels !== undefined &&
    (model === acceptedModelName || model.startsWith(acceptedModelName + " ") ||
      model.endsWith(" " + acceptedModelName) || model.includes(" " + acceptedModelName + " "));
  const generationHints = [input.model, input.type, input.variant, input.execution].filter(Boolean).join(" ");
  // An explicit conflicting body code is veto evidence even if power and year fit.
  if (app.make === "BMW" && /\b(?:F20|F21)\b/i.test(generationHints)) return false;
  // Explicit generation veto. Similar power and displacement do not identify
  // a model family or ECU. Seat 1P and 5F are distinct applications.
  if (app.make === "Seat" && (app.generation.startsWith("1P")
    ? /\b(?:1M|5F|KL)\b/i : /\b(?:1M|1P|KL)\b/i).test(generationHints)) return false;
  if (app.make === "Nissan" && app.generation.startsWith("F15") &&
    /\b(?:F16|J11|J12)\b/i.test(generationHints)) return false;
  if (app.make === "Skoda" && app.generation.startsWith("5E") &&
    /\b(?:1Z|NX)\b/i.test(generationHints)) return false;
  if (app.make === "Skoda" && app.generation.startsWith("1Z") &&
    /\b(?:5E|NX|III|IV)\b/i.test(generationHints)) return false;
  // RDW 8X is not the later GB/8Y Audi A1; a contradictory generation hint vetoes the claim.
  if (app.make === "Audi" && app.generation.startsWith("8X") &&
    /\b(?:GB|8Y|S1)\b/i.test(generationHints)) return false;
  if (app.make === "Audi" && app.generation.startsWith("8P") &&
    /\b(?:8L|8V|8Y)\b/i.test(generationHints)) return false;
  // Megane III (Z) and Megane IV (RFB/B9) must not inherit each other\'s ECU/gearbox outputs.
  if (app.make === "Renault" && app.generation.startsWith("III") &&
    /\b(?:RFB|B9|IV|MK4)\b/i.test(generationHints)) return false;
  return normalized(input.make) === normalized(app.make)
    && (model.split(" ").includes(acceptedModelName) || phraseInName)
    && (app.allowedRdwModels === undefined || app.allowedRdwModels.some(name => normalized(name) === model))
    && year !== undefined && year >= app.yearFrom && year <= app.yearTo
    && input.displacementCc === app.displacementCc
    && (app.requiredRdwType === undefined || normalized(input.type) === normalized(app.requiredRdwType))
    && (input.cylinders == null || input.cylinders === app.cylinders)
    && normalizeCatalogFuel(input.fuel) === app.fuel
    && (app.fuel !== "CNG" || normalized(input.fuel) === "cng")
    && hp != null && Math.abs(hp - app.stockPowerHp) <= 0.6
    && (app.registeredPowerKw === undefined ||
      (input.registeredPower?.unit === "kW" &&
       Math.abs(input.registeredPower.value - app.registeredPowerKw) <= 0.25))
    && (input.stockTorqueNm == null || Math.abs(input.stockTorqueNm - app.stockTorqueNm) < 1);
}

export function resolveVerifiedRdwApplication(input: EstimateMatchInput, applications = verifiedRdwApplications): EstimateResolution | undefined {
  const matchesByIdentity = applications.filter((app) => matches(input, app));
  if (matchesByIdentity.length !== 1) return undefined;
  const app = matchesByIdentity[0];
  return {
    status: "conditional", coverageClass: "B", resolutionLevel: 1,
    reasonCodes: ["GENERATION_SCOPED_SOURCE_EVIDENCE", "SOURCE_OWNER_REVIEW_REQUIRED", "OUTPUT_RANGE_SOURCE_CONFLICT", "ECU_AND_FUEL_SCOPE_UNCONFIRMED"],
    profile: {
      id: app.id, brand: app.make,
      model: app.make === "BMW" ? `${app.model.startsWith("3") ? "3 Series" : "1 Series"} ${app.generation} ${app.model}` : `${app.model} ${app.generation}`,
      engine: app.engineLabel, generation: app.generation, version: `${app.generation} ${app.model}, published indicative output`,
      yearRange: `${app.yearFrom}–${app.yearTo}`, fuel: app.fuel,
      stockPowerHp: app.stockPowerHp, stockTorqueNm: app.stockTorqueNm,
      stages: [
        {
          name: "Stage 1", powerRangeHp: app.powerRangeHp, torqueRangeNm: app.torqueRangeNm,
          approximate: true, provenance: "multi-source", sourceConfidence: "multi-source",
          sourceProfileId: app.id, resolutionLevel: 1, confidenceLevel: "manual-review", recommendedUse: "daily",
          hardwareRequired: false, tcuRecommended: false, logCheckRecommended: true,
          requirements: app.requirements,
          packageItems: [], notes: [app.reviewNote],
          quoteRequired: true,
          evidenceSourceIds: app.sources.map((source) => source.url!)
        },
        unavailableEstimateStage("Stage 2"),
        unavailableEstimateStage("Stage 3+")
      ],
      options: serviceOptions.filter((option) => !option.requiresGearbox && (!option.fuels || option.fuels.includes(app.fuel))).map((option) => option.id),
      ecuType: "To be identified", ecuSupport: {status: "manual-review"},
      transmissionSupport: {status: "manual-review"}, tcuSupport: {status: "manual-review"},
      recommendedPackage: {stage: "Stage 1", recommendedOptionIds: [], verificationRequired: true},
      provenance: "sourced-profile", sourceConfidence: "multi-source", coverageClass: "B", resolutionLevel: 1,
      sourceReferences: app.sources,
      ...(app.fuel !== "CNG" ? {runtimeCommercialIdentity: {status: "resolved-compatible" as const,
        make: app.make, model: app.model, fuel: app.fuel, registeredPowerHp: app.stockPowerHp,
        displacementCc: app.displacementCc, firstAdmissionYear: yearOf(input)}} : {}),
      conditions: [app.reviewNote], conditionCodes: ["SOURCE_OWNER_REVIEW_REQUIRED", "OUTPUT_RANGE_SOURCE_CONFLICT", "ECU_AND_FUEL_SCOPE_UNCONFIRMED"],
      verificationRequired: true
    }
  };
}
