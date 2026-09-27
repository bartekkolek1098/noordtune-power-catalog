import type {EngineVariant} from "../data/catalog-shared.ts";
import {getCatalogEstimateProfile, type TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import {compareStages, stageScope} from "./stage-presentation.ts";

/** Strip research prose at the serialization boundary; internal catalog/evidence stays intact. */
export function customerProfile(profile: TuningEstimateProfile): TuningEstimateProfile {
  const first = profile.stages.find(stage => stage.name === "Stage 1");
  return {...profile, conditions: [], sourceReferences: profile.sourceReferences.filter(source => source.sourceType !== "heuristic" && source.url).map(source => ({...source, title: new URL(source.url!).hostname, scope: ""})),
    stages: profile.stages.map(stage => ({...stage, customerScope: stageScope(stage), comparison: stage.comparison ?? compareStages(first, stage),
      requirements: "", packageItems: [], notes: [], planningBasis: undefined})),
    recommendedPackage: profile.recommendedPackage ? {...profile.recommendedPackage, notes: undefined} : undefined};
}

export function customerVehicle(vehicle: EngineVariant): EngineVariant {
  const stages = customerProfile(getCatalogEstimateProfile(vehicle)).stages;
  return {...vehicle, stages: vehicle.stages.map((stage, i) => ({...stage, ...stages[i], powerHp: stage.powerHp, torqueNm: stage.torqueNm, price: stage.price})),
    technicalEvidence: undefined,
    engineIdentity: vehicle.engineIdentity ? {...vehicle.engineIdentity, notes: undefined} : undefined,
    ecuSupport: vehicle.ecuSupport ? {...vehicle.ecuSupport, notes: undefined} : undefined,
    transmissionSupport: vehicle.transmissionSupport ? {...vehicle.transmissionSupport, notes: undefined} : undefined,
    tcuSupport: vehicle.tcuSupport ? {...vehicle.tcuSupport, notes: undefined} : undefined,
    recommendedPackage: vehicle.recommendedPackage ? {...vehicle.recommendedPackage, notes: undefined} : undefined};
}
