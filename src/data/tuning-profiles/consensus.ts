import type {ProfileStage, SourceObservation, StageSourceValue} from "./schema.ts";

export const metricPower = (value: number, unit: "PS" | "bhp") => unit === "bhp" ? value * 1.013869665424 : value;
export const metricTorque = (value: number, unit?: "Nm" | "lb-ft") => unit === "lb-ft" ? value * 1.3558179483314 : value;
const round = (value: number, step: number) => Math.floor((value + step / 2 - 1e-8) / step) * step;
const median = (values: number[]) => {
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
};
export const independentProvider = (source: SourceObservation) => source.provider === "other" || source.provider === "manufacturer" ? `${source.provider}:${source.sourceName.toLowerCase()}` : source.provider;

/** Preserve every fact, but one provider gets one vote even across mirrored pages. */
export function stageConsensus(observations: SourceObservation[], stage: "stage1" | "stage2" | "stage3"): ProfileStage | undefined {
  const available = observations.filter(source => source.status === "retrieved" && source.retrievalMethod !== "search-index" && source.identity && source.stages?.[stage]);
  if (!available.length) return undefined;
  const sourceValues: StageSourceValue[] = available.map(source => {
    const value = source.stages![stage]!;
    return {sourceId: source.id, provider: source.provider, powerHp: metricPower(value.powerHp, source.identity!.powerUnit),
      ...(value.torqueNm !== undefined ? {torqueNm: metricTorque(value.torqueNm, source.identity!.torqueUnit)} : {}),
      powerUnit: "PS", torqueUnit: "Nm", conditions: [...(value.conditions ?? [])]};
  });
  const votes = [...new Set(available.map(independentProvider))].map(provider => {
    const values = sourceValues.filter((_, index) => independentProvider(available[index]) === provider);
    // Duplicate/provider mirrors with conflicting claims do not get averaged.
    return {powerHp: Math.min(...values.map(value => value.powerHp)), torqueNm: values.every(value => value.torqueNm !== undefined) ? Math.min(...values.map(value => value.torqueNm!)) : undefined};
  });
  const powers = sourceValues.map(value => value.powerHp);
  const torques = sourceValues.flatMap(value => value.torqueNm === undefined ? [] : [value.torqueNm]);
  const powerSpread = (Math.max(...powers) - Math.min(...powers)) / median(powers);
  const torqueSpread = torques.length ? (Math.max(...torques) - Math.min(...torques)) / median(torques) : 0;
  const conflict = powerSpread > .05 + 1e-8 || torqueSpread > .08 + 1e-8;
  const selectedPowerHp = round(conflict ? Math.min(...powers) : median(votes.map(vote => vote.powerHp)), 5);
  const torqueVotes = votes.flatMap(vote => vote.torqueNm === undefined ? [] : [vote.torqueNm]);
  const selectedTorqueNm = torqueVotes.length ? round(conflict ? Math.min(...torques) : median(torqueVotes), 10) : undefined;
  return {selectedPowerHp, ...(selectedTorqueNm !== undefined ? {selectedTorqueNm} : {}), sourceValues,
    confidence: votes.length >= 2 ? "multi-source" : "single-source",
    sourceAgreement: conflict ? "conflict" : votes.length >= 2 ? "strong" : "acceptable",
    ownerReviewRequired: conflict || votes.length < 2,
    conditions: [...new Set(available.flatMap(source => [...(source.conditions ?? []), ...(source.stages![stage]!.conditions ?? [])]))]};
}
