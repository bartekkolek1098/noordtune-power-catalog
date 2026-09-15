import type {EstimateStage} from "../data/tuning-estimates-shared.ts";

/** Presentation policy only: retained catalog facts are not silently rewritten. */
export function applyStageHardwarePolicy(stages: readonly EstimateStage[]): EstimateStage[] {
  return stages.map(stage => {
    const sourcedHardwareFigure = (stage.provenance === "multi-source" || stage.provenance === "single-source" || stage.hardwareScopeApproved === true) &&
      stage.powerHp !== undefined && Number.isFinite(stage.powerHp) && stage.powerHp > 0;
    if (stage.name !== "Stage 3+" || (!stage.customHardware && sourcedHardwareFigure)) return {...stage};
    return {...stage, customHardware: true, hardwareRequired: true,
      powerHp: undefined, torqueNm: undefined, powerRangeHp: undefined, torqueRangeNm: undefined};
  });
}
