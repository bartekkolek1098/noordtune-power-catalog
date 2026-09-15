import type {EstimateStage} from "../data/tuning-estimates-shared.ts";

export type ChartEstimateStage = Pick<EstimateStage, "name" | "powerHp" | "torqueNm" | "powerRangeHp" | "torqueRangeNm" | "approximate" | "customHardware">;

/** Missing/custom outputs stay gaps; a visual curve must never supply an invented Stage value. */
export function estimateChartData(stages: ChartEstimateStage[], stockPower: number, stockTorque?: number, stockLabel = "Stock") {
  const powerRanges = stages.some(stage => !stage.customHardware && stage.powerRangeHp);
  const torqueRanges = stages.some(stage => !stage.customHardware && stage.torqueRangeNm);
  const point = (value: number | undefined, rangeSeries: boolean) => value === undefined ? null : rangeSeries ? [value, value] : value;
  return [
    {name: stockLabel, pk: point(stockPower, powerRanges), nm: point(stockTorque, torqueRanges), approximate: false},
    ...stages.map(stage => ({
      name: stage.name.replace("Stage ", "S"),
      pk: stage.customHardware ? null : stage.powerRangeHp ?? point(stage.powerHp, powerRanges),
      nm: stage.customHardware ? null : stage.torqueRangeNm ?? point(stage.torqueNm, torqueRanges),
      approximate: Boolean(stage.approximate)
    }))
  ];
}
