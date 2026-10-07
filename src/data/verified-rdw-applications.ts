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
  stockTorqueNm: number;
  fuel: "Petrol" | "Diesel";
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
  if (/\b(?:F20|F21)\b/i.test(generationHints)) return false;
  return normalized(input.make) === normalized(app.make)
    && model.split(" ").includes(normalized(app.model))
    && year !== undefined && year >= app.yearFrom && year <= app.yearTo
    && input.displacementCc === app.displacementCc
    && (input.cylinders == null || input.cylinders === app.cylinders)
    && normalizeCatalogFuel(input.fuel) === app.fuel
    && hp != null && Math.abs(hp - app.stockPowerHp) <= 0.6;
}

export function resolveVerifiedRdwApplication(input: EstimateMatchInput, applications = verifiedRdwApplications): EstimateResolution | undefined {
  const matchesByIdentity = applications.filter((app) => matches(input, app));
  if (matchesByIdentity.length !== 1) return undefined;
  const app = matchesByIdentity[0];
  return {
    status: "conditional", coverageClass: "B", resolutionLevel: 1,
    reasonCodes: ["GENERATION_SCOPED_SOURCE_EVIDENCE", "SOURCE_OWNER_REVIEW_REQUIRED", "OUTPUT_RANGE_SOURCE_CONFLICT", "ECU_AND_FUEL_SCOPE_UNCONFIRMED"],
    profile: {
      id: app.id, brand: app.make, model: `1 Series ${app.generation} ${app.model}`,
      engine: "1.5 turbo petrol (1499 cc)", generation: app.generation, version: `${app.generation} ${app.model}, published indicative output`,
      yearRange: `${app.yearFrom}–${app.yearTo}`, fuel: app.fuel,
      stockPowerHp: app.stockPowerHp, stockTorqueNm: app.stockTorqueNm,
      stages: [
        {
          name: "Stage 1", powerRangeHp: app.powerRangeHp, torqueRangeNm: app.torqueRangeNm,
          approximate: true, provenance: "multi-source", sourceConfidence: "multi-source",
          sourceProfileId: app.id, resolutionLevel: 1, confidenceLevel: "manual-review", recommendedUse: "daily",
          hardwareRequired: false, tcuRecommended: false, logCheckRecommended: true,
          requirements: "Confirm installed ECU, RON grade, fuel/hardware compatibility, and vehicle condition before calibration.",
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
      runtimeCommercialIdentity: {status: "resolved-compatible", make: app.make, model: app.model, fuel: app.fuel,
        registeredPowerHp: app.stockPowerHp, displacementCc: app.displacementCc, firstAdmissionYear: yearOf(input)},
      conditions: [app.reviewNote], conditionCodes: ["SOURCE_OWNER_REVIEW_REQUIRED", "OUTPUT_RANGE_SOURCE_CONFLICT", "ECU_AND_FUEL_SCOPE_UNCONFIRMED"],
      verificationRequired: true
    }
  };
}
