import type {ProfileStage, ResearchIdentity} from "../src/data/tuning-profiles/schema.ts";

export type GenerationBoundary = {brand: string; modelFamily: string; generation: string; yearFrom: number; yearTo: number; sourceUrl: string; retrievedAt: string};
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const familyKey = (value: string) => normalize(value).replace(/ serie$/, " series").replace(/ klasse$/, " class");
const label = (value: string) => normalize(value.replace(/^\s*\d{4}\s*[-–]\s*/, ""));

/** Body aliases can differ between providers, but a predecessor is never a boundary for its successor. */
export function compatibleGeneration(a: string, b: string, aYear?: number, bYear?: number) {
  const left=label(a), right=label(b);
  if (left===right) return true;
  const codes=(value:string):string[]=>value.match(/\b(?:[a-z]{1,3}\d{1,3}|\d[a-z]|mk[ivx\d]+)\b/g) ?? [];
  const l=codes(left),r=codes(right);
  if (!l.length || !r.length || !l.some(code=>r.includes(code))) return false;
  const phase=(value:string)=>value.match(/\b(?:lci|fl|phase [ivx\d]+|mk[ivx\d]+)\b/g)?.join("|") ?? "";
  // Some provider indices omit FL despite using the same documented start year.
  return phase(left)===phase(right) || (aYear!==undefined && aYear===bYear);
}

/** Flag inconsistent sourced stages without manufacturing corrected measurements. */
export function flagNonMonotonicStages(stages: readonly (ProfileStage|undefined)[]) {
  let previous:ProfileStage|undefined, nonMonotonic=false;
  for(const stage of stages) {
    if(!stage)continue;
    if(previous && (stage.selectedPowerHp<previous.selectedPowerHp || (stage.selectedTorqueNm!==undefined && previous.selectedTorqueNm!==undefined && stage.selectedTorqueNm<previous.selectedTorqueNm))) {
      nonMonotonic=true; stage.sourceAgreement="conflict";stage.ownerReviewRequired=true;
      stage.conditions.push("NON_MONOTONIC_SOURCED_STAGE", "Published later-stage output is below the earlier-stage indication. Original source values are preserved; applicability and configuration require owner review.");
    }
    previous=stage;
  }
  return nonMonotonic;
}

export function effectiveGenerationScope(identities: readonly ResearchIdentity[], boundaries: readonly GenerationBoundary[]) {
  const identity=identities[0];
  const rawFrom=Math.max(...identities.map(item=>item.yearFrom));
  const ends=identities.flatMap(item=>item.yearTo===undefined?[]:[item.yearTo]);
  const rawTo=ends.length?Math.min(...ends):undefined;
  const matching=boundaries.filter(boundary=>normalize(boundary.brand)===normalize(identity.brand)
    && [identity.modelFamily,...(identity.aliases??[])].some(model=>familyKey(model)===familyKey(boundary.modelFamily))
    && identities.some(item=>compatibleGeneration(item.generation,boundary.generation,item.yearFrom,boundary.yearFrom))
    && boundary.yearTo>=rawFrom && (rawTo===undefined || boundary.yearFrom<=rawTo));
  const boundary=matching.find(item=>item.yearFrom<=rawFrom && item.yearTo>=rawFrom)
    ?? [...matching].sort((a,b)=>a.yearFrom-b.yearFrom)[0];
  const yearFrom=boundary?Math.max(rawFrom,boundary.yearFrom):rawFrom;
  const yearTo=boundary?Math.min(rawTo??Infinity,boundary.yearTo):rawTo;
  return {yearFrom,yearTo,boundary,adjusted:yearFrom!==rawFrom || yearTo!==rawTo,rawFrom,rawTo};
}
