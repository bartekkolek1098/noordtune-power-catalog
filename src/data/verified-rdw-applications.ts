// SERVER BOUNDARY: independent, generation-scoped observations, never a copied competitor catalogue.
// Only reviewed applications with explicit matching identity and source URLs belong here.
import {serviceOptions} from "./catalog-shared.ts";
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
}];

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
  return normalized(input.make) === normalized(app.make)
    && model.split(" ").includes(normalized(app.model))
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
      model: app.make === "BMW" ? `1 Series ${app.generation} ${app.model}` : `${app.model} ${app.generation}`,
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
