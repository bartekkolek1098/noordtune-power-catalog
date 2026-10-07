import type {EngineVariant, StageDefinition} from "../data/catalog-shared.ts";
import {getCatalogEstimateProfile, type EstimateStage, type TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import {compareStages, stageScope} from "./stage-presentation.ts";

const customerStageNames = new Set<StageDefinition["name"]>(["Stage 1", "Stage 2"]);
const sourceBackedStageProvenance = new Set<NonNullable<EstimateStage["provenance"]>>([
  "reference",
  "single-source",
  "multi-source"
]);

function customerSafeStage(stage: EstimateStage, profile: TuningEstimateProfile): EstimateStage {
  const numericIsSourceBacked =
    sourceBackedStageProvenance.has(stage.provenance ?? "reviewed") &&
    profile.provenance !== "canonical-estimated" &&
    profile.provenance !== "generic-indicative";

  if (numericIsSourceBacked || (
    stage.powerHp === undefined &&
    stage.torqueNm === undefined &&
    stage.powerRangeHp === undefined &&
    stage.torqueRangeNm === undefined
  )) {
    return stage;
  }

  return {
    ...stage,
    powerHp: undefined,
    torqueNm: undefined,
    powerRangeHp: undefined,
    torqueRangeNm: undefined,
    approximate: false,
    quoteRequired: true,
    provenance: "reviewed",
    customerNote: stage.customerNote ?? {
      nl: "Exact vermogen en koppel na bevestiging van de motor-, software- en voertuigvariant.",
      en: "Exact power and torque after confirming the engine, software and vehicle variant.",
      pl: "Dokładną moc i moment podamy po potwierdzeniu silnika, oprogramowania i wersji pojazdu."
    }
  };
}

/** Strip research prose and unsafe generated numbers at the customer boundary. */
export function customerProfile(profile: TuningEstimateProfile): TuningEstimateProfile {
  const publicStages = profile.stages
    .filter(stage => customerStageNames.has(stage.name))
    .map(stage => customerSafeStage(stage, profile));
  const first = publicStages.find(stage => stage.name === "Stage 1");

  return {
    ...profile,
    conditions: [],
    sourceReferences: profile.sourceReferences
      .filter(source => source.sourceType !== "heuristic" && source.url)
      .map(source => ({...source, title: new URL(source.url!).hostname, scope: ""})),
    stages: publicStages.map(stage => ({
      ...stage,
      customerScope: stageScope(stage),
      comparison: stage.comparison ?? compareStages(first, stage),
      requirements: "",
      packageItems: [],
      notes: [],
      planningBasis: undefined
    })),
    recommendedPackage: profile.recommendedPackage && customerStageNames.has(profile.recommendedPackage.stage)
      ? {...profile.recommendedPackage, notes: undefined}
      : undefined
  };
}

export function customerVehicle(vehicle: EngineVariant): EngineVariant {
  const profile = customerProfile(getCatalogEstimateProfile(vehicle));
  const safeStages = new Map(profile.stages.map(stage => [stage.name, stage]));

  return {
    ...vehicle,
    stages: vehicle.stages
      .filter(stage => safeStages.has(stage.name))
      .map(stage => ({
        ...stage,
        ...safeStages.get(stage.name)!,
        identityScope: undefined,
        price: stage.price
      })),
    outputReferences: vehicle.outputReferences?.map(source => ({
      ...source,
      title: new URL(source.url).hostname,
      scope: ""
    })),
    dataNotes: undefined,
    technicalNotes: undefined,
    technicalEvidence: undefined,
    engineIdentity: vehicle.engineIdentity ? {...vehicle.engineIdentity, notes: undefined} : undefined,
    ecuSupport: vehicle.ecuSupport ? {...vehicle.ecuSupport, notes: undefined} : undefined,
    transmissionSupport: vehicle.transmissionSupport ? {...vehicle.transmissionSupport, notes: undefined} : undefined,
    tcuSupport: vehicle.tcuSupport ? {...vehicle.tcuSupport, notes: undefined} : undefined,
    recommendedPackage: profile.recommendedPackage
  };
}
