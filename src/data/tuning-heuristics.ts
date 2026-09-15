import type {StageName} from "./catalog-shared.ts";

export type GenericEstimateCategory = "turbo-diesel" | "turbo-petrol" | "naturally-aspirated" | "unknown-aspiration";
type StageHeuristic = {powerFactorRange: readonly [number, number]; torqueFactorRange: readonly [number, number]};

/** Local illustrative scenarios, not measured gains or model-specific tuning targets.
 * Every interval is independently based on factual registered stock power,
 * converted to whole metric pk as displayed beside the registered kW value.
 * Previous range bounds may only prevent regression; no previous Stage is multiplied.
 * Output bounds round outwards to 5 pk / 5 Nm increments. Exact sources stay exact.
 * Higher Stages assume suitable hardware and require individual workshop review.
 * Torque factors are used ONLY when a compatible source supplies stock torque;
 * absent that source no precise stock/Stage torque is invented.
 */
export const genericTuningHeuristics: Record<GenericEstimateCategory, Record<StageName, StageHeuristic>> = {
  "turbo-diesel": {
    "Stage 1": {powerFactorRange: [1.15, 1.25], torqueFactorRange: [1.10, 1.20]},
    "Stage 2": {powerFactorRange: [1.25, 1.40], torqueFactorRange: [1.15, 1.30]},
    "Stage 3+": {powerFactorRange: [1.40, 1.55], torqueFactorRange: [1.20, 1.40]}
  },
  "turbo-petrol": {
    "Stage 1": {powerFactorRange: [1.10, 1.20], torqueFactorRange: [1.10, 1.20]},
    "Stage 2": {powerFactorRange: [1.25, 1.40], torqueFactorRange: [1.15, 1.35]},
    "Stage 3+": {powerFactorRange: [1.40, 1.60], torqueFactorRange: [1.20, 1.45]}
  },
  "naturally-aspirated": {
    "Stage 1": {powerFactorRange: [1.02, 1.05], torqueFactorRange: [1, 1.04]},
    "Stage 2": {powerFactorRange: [1.05, 1.10], torqueFactorRange: [1.01, 1.07]},
    "Stage 3+": {powerFactorRange: [1.08, 1.15], torqueFactorRange: [1.02, 1.10]}
  },
  "unknown-aspiration": {
    "Stage 1": {powerFactorRange: [1, 1.04], torqueFactorRange: [1, 1.03]},
    "Stage 2": {powerFactorRange: [1.02, 1.07], torqueFactorRange: [1, 1.05]},
    "Stage 3+": {powerFactorRange: [1.04, 1.10], torqueFactorRange: [1, 1.07]}
  }
};

/** An unusually strong sourced Stage 1 may reflect factory de-rating, but this
 * does not prove shared hardware or headroom. Later scenarios use the SAME fixed
 * source interval plus a broad stock-power-based uncertainty width, never Stage 2
 * to calculate Stage 3. The zero lower increment explicitly promises no extra gain.
 * These are owner-review planning bands, not model-specific workshop targets.
 */
export const strongStage1ScenarioStockWidths: Partial<Record<StageName, number>> = {
  "Stage 2": 0.20,
  "Stage 3+": 0.40
};
