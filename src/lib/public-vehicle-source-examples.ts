// SERVER ONLY. Examples of independently published Stage 1 applications, not a
// tuning promise for an unverified registration, ECU, fuel grade, or software.
import type {EngineVariant} from "../data/catalog-shared.ts";
import {nominalEngineDisplacements, nominalDisplacementMatches} from "../data/catalog-matching.ts";
import {reviewedPublicStage1Samples} from "../data/reviewed-public-stage1-samples.ts";
import {sourcedTuningProfiles} from "../data/tuning-profiles/index.ts";
import {matchSourcedProfile} from "./sourced-tuning-match.ts";
import type {SourcedTuningProfile} from "../data/tuning-profiles/schema.ts";

export type PublicVehicleSourceExample = {
  sourceProfileId: string;
  generation: string;
  yearFrom: number;
  yearTo: number;
  stockPowerHp: number;
  stockTorqueNm: number;
  stage1PowerRangeHp: [number, number];
  stage1TorqueRangeNm?: [number, number];
  sourceUrls: string[];
  independentlyPublishedValues: number;
  ownerReviewRequired: boolean;
  /** Only when a tuner reported a dyno baseline different from official stock. */
  observedStockBaseline?: {
    officialPowerHp: number;
    officialTorqueNm: number;
  };
  sourceStageLabel?: "Stage 1+";
  sourceEngineCode?: string;
  awdOnly?: boolean;
  ecuDecodeRequired?: boolean;
};

// Already reviewed displacement scopes from the retained public matcher.
// These values refine coarse legacy engine strings such as "2.0d / 3.0d";
// they must never be inferred from the marketing name alone.
const reviewedDisplacementCc: Record<string, number> = {
  "bmw-1-series-f20-f21-118i": 1499,
  "bmw-1-series-f20-f21-118d": 1995,
  "bmw-1-series-f20-f21-120d": 1995,
  "bmw-3-series-f30-f31-318d": 1995,
  "bmw-3-series-f30-f31-330d": 2993,
  "bmw-5-series-f10-f11-520d": 1995,
  "bmw-3-series-g20-g21-320i": 1998
};

function powerRange(values: readonly number[]): [number, number] | undefined {
  const positive = values.filter(value => Number.isFinite(value) && value > 0);
  return positive.length ? [Math.min(...positive), Math.max(...positive)] : undefined;
}

const stableCache = new WeakMap<EngineVariant, PublicVehicleSourceExample[]>();

export function getPublicVehicleSourceExamples(
  vehicle: EngineVariant,
  sources: readonly SourcedTuningProfile[] = sourcedTuningProfiles
): PublicVehicleSourceExample[] {
  const cacheable = sources === sourcedTuningProfiles;
  if (cacheable && stableCache.has(vehicle)) return stableCache.get(vehicle)!;
  const nominal = nominalEngineDisplacements(vehicle.engine);
  const cc = reviewedDisplacementCc[vehicle.id] ?? (nominal.length === 1 ? nominal[0] : undefined);
  const stockTorque = vehicle.stockTorqueNm;
  if (!cc || stockTorque === undefined || stockTorque <= 0) return [];

  const found = new Map<string, {source: SourcedTuningProfile; years: number[]}>();
  for (const year of [...new Set(vehicle.years)].sort((a,b)=>a-b)) {
    const match = matchSourcedProfile({
      make: vehicle.brand,
      model: vehicle.model,
      fuel: vehicle.fuel,
      displacementCc: cc,
      powerHp: vehicle.stockPowerHp,
      firstRegistrationYear: year,
      type: vehicle.generation ?? ""
    }, sources).profile;

    if (!match || match.stockTorqueNm !== stockTorque ||
      Math.abs(match.stockPowerHp - vehicle.stockPowerHp) > .6 ||
      !match.stage1.sourceValues.length) continue;

    const power = powerRange(match.stage1.sourceValues.map(value => value.powerHp));
    if (!power || power[0] <= vehicle.stockPowerHp) continue;
    const record = found.get(match.id) ?? {source: match, years: []};
    record.years.push(year);
    found.set(match.id, record);
  }

  const results = [...found.values()].flatMap(({source, years}) => {
    const power = powerRange(source.stage1.sourceValues.map(item => item.powerHp));
    const torqueValues = source.stage1.sourceValues.map(item => item.torqueNm);
    const torque = torqueValues.every(value => value !== undefined)
      ? powerRange(torqueValues as number[]) : undefined;
    if (!power) return [];
    const urls = [...new Set(source.sourceUrls.filter(url => /^https:\/\//i.test(url)))].slice(0, 3);
    if (!urls.length) return [];
    // Only observed per-year compatibility is shown, not the source's entire
    // broad publication period or an extrapolation into missing years.
    const segments: Array<[number, number]> = [];
    for (const year of years) {
      const last = segments.at(-1);
      if (last && last[1] === year - 1) last[1] = year;
      else segments.push([year, year]);
    }
    return segments.map(([yearFrom, yearTo]): PublicVehicleSourceExample => ({
      sourceProfileId: source.id,
      generation: source.generation,
      yearFrom, yearTo,
      stockPowerHp: source.stockPowerHp,
      stockTorqueNm: source.stockTorqueNm!,
      stage1PowerRangeHp: power,
      ...(torque && torque[0] >= stockTorque ? {stage1TorqueRangeNm: torque} : {}),
      sourceUrls: urls,
      independentlyPublishedValues: source.stage1.sourceValues.length,
      ownerReviewRequired: source.ownerReviewRequired || source.stage1.ownerReviewRequired
    }));
  });

  // Small, independent evidence backlog for stock configurations that are
  // absent from the initial 1,269-source collection. It is identity-gated:
  // an external application's numbers are never applied to a different model,
  // body generation, fuel, stock output, displacement or outside-year vehicle.
  for (const sample of reviewedPublicStage1Samples) {
    const matchingYears = vehicle.years.filter(year=>year>=sample.yearFrom&&year<=sample.yearTo);
    if(sample.publicVehicleId!==vehicle.id||
      sample.expectedMake!==vehicle.brand || sample.expectedModel!==vehicle.model ||
      sample.expectedGeneration!==vehicle.generation ||
      sample.expectedFuel!==vehicle.fuel || sample.stockPowerHp!==vehicle.stockPowerHp ||
      sample.stockTorqueNm!==stockTorque ||
      !nominalDisplacementMatches(sample.displacementCc, cc) ||
      !matchingYears.length ||
      !sample.sourceUrls.length || !sample.sourceUrls.every(url=>/^https:\/\//i.test(url)) ||
      sample.powerRangeHp[0] <= (sample.observedStockPowerHp ?? vehicle.stockPowerHp) ||
      sample.torqueRangeNm[0] <= (sample.observedStockTorqueNm ?? stockTorque) ||
      // A partially specified baseline could misstate the quoted source gain.
      ((sample.observedStockPowerHp === undefined) !== (sample.observedStockTorqueNm === undefined)) ||
      (sample.observedStockPowerHp !== undefined && !sample.sourceEngineCode) ||
      (sample.observedStockPowerHp !== undefined && !sample.sourceStageLabel)) continue;
    results.push({
      sourceProfileId: sample.id, generation:sample.expectedGeneration,
      yearFrom:Math.min(...matchingYears),yearTo:Math.max(...matchingYears),
      stockPowerHp:sample.observedStockPowerHp ?? sample.stockPowerHp,
      stockTorqueNm:sample.observedStockTorqueNm ?? sample.stockTorqueNm,
      ...(sample.observedStockPowerHp !== undefined && sample.observedStockTorqueNm !== undefined
        ? {observedStockBaseline: {officialPowerHp:sample.stockPowerHp,officialTorqueNm:sample.stockTorqueNm}} : {}),
      ...(sample.sourceStageLabel ? {sourceStageLabel:sample.sourceStageLabel} : {}),
      ...(sample.sourceEngineCode ? {sourceEngineCode:sample.sourceEngineCode} : {}),
      ...(sample.awdOnly ? {awdOnly:true} : {}),
      ...(sample.ecuDecodeRequired ? {ecuDecodeRequired:true} : {}),
      stage1PowerRangeHp:sample.powerRangeHp,
      stage1TorqueRangeNm:sample.torqueRangeNm,
      sourceUrls:sample.sourceUrls.slice(0,3),
      independentlyPublishedValues:sample.stage1ObservationCount ?? sample.sourceUrls.length,
      ownerReviewRequired:true
    });
  }
  results.sort((a,b)=>b.yearTo-a.yearTo||b.independentlyPublishedValues-a.independentlyPublishedValues||a.sourceProfileId.localeCompare(b.sourceProfileId));
  // At most three dated examples: no giant competitor-derived listings on a page.
  const limited = results.slice(0,3);
  if(cacheable) stableCache.set(vehicle, limited);
  return limited;
}
