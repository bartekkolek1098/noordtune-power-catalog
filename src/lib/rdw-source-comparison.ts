// SERVER ONLY: a bounded comparison to published Stage 1 applications.
// This is explicitly NOT a tune target for the plate's unconfirmed generation.
import {normalizeCatalogFuel, registeredPowerToMetricHp, nominalDisplacementMatches} from "../data/catalog-matching.ts";
import {sourcedTuningProfiles} from "../data/tuning-profiles/index.ts";
import type {SourcedTuningProfile} from "../data/tuning-profiles/schema.ts";
import type {EstimateMatchInput} from "../data/tuning-estimates.ts";
import {sourceMake, sourceModelFamily, sourceRegistrationYear} from "./sourced-tuning-match.ts";

export type SimilarStage1Comparison = {
  kind: "similar-family-source-comparison";
  powerRangeHp: [number, number];
  torqueRangeNm?: [number, number];
  matchedApplications: number;
  generationCount: number;
  sourceUrls: string[];
};

function scopeMatches(input: EstimateMatchInput, source: SourcedTuningProfile) {
  const make = sourceMake(input.make);
  const year = sourceRegistrationYear(input);
  const power = registeredPowerToMetricHp(input);
  const fuel = normalizeCatalogFuel(input.fuel);
  const model = sourceModelFamily(make, input.model ?? "");
  if (!year || !power || !input.displacementCc || !["Petrol", "Diesel"].includes(fuel ?? "")) return false;
  if (make !== sourceMake(source.brand) || fuel !== source.fuel) return false;
  // An explicit BMW body code is disqualifying evidence for another generation.
  // Opaque RDW type/variant codes are not decoded speculatively.
  if (make === "bmw") {
    const explicit = [input.model,input.type,input.variant,input.execution].join(" ").match(/\b[EFG]\d{2,3}\b/gi)?.map(x=>x.toUpperCase()) ?? [];
    const sourceBodies = source.generation.match(/\b[EFG]\d{2,3}\b/gi)?.map(x=>x.toUpperCase()) ?? [];
    if (explicit.length && sourceBodies.length && !explicit.some(x=>sourceBodies.includes(x))) return false;
  }
  const families = [source.modelFamily, ...(source.aliases ?? [])].map(value=>sourceModelFamily(make,value));
  if (!families.some(value=>model===value || model.startsWith(value+" "))) return false;
  if (source.displacementPrecision === "exact"
    ? Math.abs(source.displacementCc-input.displacementCc)>2
    : !nominalDisplacementMatches(input.displacementCc,source.displacementCc)) return false;
  if (Math.abs(source.stockPowerHp-power)>3) return false;
  if (input.cylinders && source.cylinders && input.cylinders!==source.cylinders) return false;
  if (year < source.yearFrom || year > (source.yearTo ?? Number(source.retrievedAt.slice(0,4)))) return false;
  if (source.stage1.sourceValues.length < 1) return false;
  return true;
}

export function getComparableSourceStage1(input:EstimateMatchInput, data:readonly SourcedTuningProfile[]=sourcedTuningProfiles):SimilarStage1Comparison|undefined{
  const compatible=data.filter(source=>scopeMatches(input,source));
  if(!compatible.length)return undefined;
  const outputs=compatible.map(source=>source.stage1.selectedPowerHp).filter(Number.isFinite);
  if(!outputs.length)return undefined;
  const torques=compatible.map(source=>source.stage1.selectedTorqueNm).filter((v):v is number=>typeof v==="number"&&Number.isFinite(v));
  const uniqueGenerations=new Set(compatible.map(source=>source.generation));
  const urlSet=new Set(compatible.flatMap(source=>source.sourceUrls).filter(url=>/^https:\/\//.test(url)));
  return {
    kind:"similar-family-source-comparison",
    powerRangeHp:[Math.min(...outputs),Math.max(...outputs)],
    ...(torques.length===compatible.length?{torqueRangeNm:[Math.min(...torques),Math.max(...torques)] as [number,number]}:{}),
    matchedApplications:compatible.length,
    generationCount:uniqueGenerations.size,
    sourceUrls:[...urlSet].slice(0,3)
  };
}
