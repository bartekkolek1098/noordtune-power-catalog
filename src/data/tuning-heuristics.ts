import type {StageName} from "./catalog-shared.ts";

export type GenericEstimateCategory = "turbo-diesel" | "turbo-petrol" | "naturally-aspirated" | "unknown-aspiration";
type StageHeuristic = {powerFactor: number; priorStageFactor: number; torqueFactorRange: readonly [number, number]};

/** Local illustrative scenarios, not measured gains or model-specific tuning targets.
 * Factors apply to factual registered stock power. For later stages, a compatible
 * sourced/previous Stage peak is a floor: max(stock factor, prior peak factor).
 * This avoids a Stage-1-only reference erasing later Stages or making them regress.
 * Higher Stages assume suitable hardware and require individual workshop review.
 * Torque factors are used ONLY when a compatible source supplies stock torque;
 * absent that source no precise stock/Stage torque is invented.
 */
export const genericTuningHeuristics: Record<GenericEstimateCategory, Record<StageName, StageHeuristic>> = {
  "turbo-diesel": {
    "Stage 1": {powerFactor: 1.15, priorStageFactor: 1, torqueFactorRange: [1.10, 1.20]},
    "Stage 2": {powerFactor: 1.25, priorStageFactor: 1.05, torqueFactorRange: [1.15, 1.30]},
    "Stage 3+": {powerFactor: 1.35, priorStageFactor: 1.08, torqueFactorRange: [1.20, 1.40]}
  },
  "turbo-petrol": {
    "Stage 1": {powerFactor: 1.15, priorStageFactor: 1, torqueFactorRange: [1.10, 1.20]},
    "Stage 2": {powerFactor: 1.30, priorStageFactor: 1.05, torqueFactorRange: [1.15, 1.35]},
    "Stage 3+": {powerFactor: 1.40, priorStageFactor: 1.08, torqueFactorRange: [1.20, 1.45]}
  },
  "naturally-aspirated": {
    "Stage 1": {powerFactor: 1.03, priorStageFactor: 1, torqueFactorRange: [1, 1.04]},
    "Stage 2": {powerFactor: 1.06, priorStageFactor: 1.02, torqueFactorRange: [1.01, 1.07]},
    "Stage 3+": {powerFactor: 1.10, priorStageFactor: 1.03, torqueFactorRange: [1.02, 1.10]}
  },
  "unknown-aspiration": {
    "Stage 1": {powerFactor: 1.02, priorStageFactor: 1, torqueFactorRange: [1, 1.03]},
    "Stage 2": {powerFactor: 1.04, priorStageFactor: 1.01, torqueFactorRange: [1, 1.05]},
    "Stage 3+": {powerFactor: 1.06, priorStageFactor: 1.02, torqueFactorRange: [1, 1.07]}
  }
};
