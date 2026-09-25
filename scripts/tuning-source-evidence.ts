import {independentProvider, metricPower, metricTorque} from "../src/data/tuning-profiles/consensus.ts";
import type {ProfileStage, SourceObservation} from "../src/data/tuning-profiles/schema.ts";

const norm=(s:string|undefined)=>(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
export const sourceIsAvailable=(source:SourceObservation)=>!source.availability||source.availability.status==="available";

/** The documented 2.0 Transit application does not resolve the 1.5 Connect split. */
export function hasReviewedEngineFamily(source:SourceObservation, observations:readonly SourceObservation[]){
  const p=source.identity,e=source.engineFamilyEvidence;
  if(!p||!e||!e.reason||e.engineFamily!=="EcoBlue"||p.engineFamily!=="EcoBlue")return false;
  const fact=observations.find(o=>o.id===e.sourceId);
  return Boolean(fact?.provider==="manufacturer"&&fact.status==="retrieved"&&fact.retrievalMethod!=="search-index"&&fact.contentSha256?.length===64
    &&p.brand==="Ford"&&["Transit","Transit Custom"].includes(p.modelFamily)&&p.fuel==="Diesel"
    &&[1995,1996].includes(p.displacementCc)&&p.yearFrom>=2016
    &&({105:360,130:385,170:405,185:415} as Record<number,number>)[p.stockPowerHp]===p.stockTorqueNm);
}

/** A provider's negative application cannot veto another provider's evidence. */
export function negativeSourceConflicts(source:SourceObservation, observations:readonly SourceObservation[]){
  const a=source.identity;
  if(!a)return [];
  return observations.filter(negative=>{
    if(negative.id===source.id||negative.status!=="retrieved"||negative.retrievalMethod==="search-index"
      ||independentProvider(negative)!==independentProvider(source)
      ||!negative.availability||!["not-available","development-pending","different-ecu-generation"].includes(negative.availability.status))return false;
    const b=negative.identity??negative.unresolvedIdentity;
    if(!b?.brand||!b.modelFamily||!b.generation||!b.yearFrom||!b.stockPowerHp)return false;
    if(norm(a.brand)!==norm(b.brand)||norm(a.modelFamily)!==norm(b.modelFamily)||a.stockPowerHp!==b.stockPowerHp)return false;
    if(b.fuel&&a.fuel!==b.fuel)return false;
    if(b.displacementCc&&Math.abs(a.displacementCc-b.displacementCc)>(a.displacementPrecision==="exact"&&b.displacementPrecision==="exact"?2:49))return false;
    if(a.engineFamily&&b.engineFamily&&norm(a.engineFamily)!==norm(b.engineFamily))return false;
    // Apply effective reviewed scopes. Overlap requires review/narrowing before a vote.
    const from=source.reviewedScope?.yearFrom??a.yearFrom,to=source.reviewedScope?.yearTo??a.yearTo??9999;
    return Math.max(from,b.yearFrom)<=Math.min(to,b.yearTo??9999);
  }).map(s=>s.id);
}

export function applyLargeGainScrutiny(sources:readonly SourceObservation[], stage:ProfileStage, validFactoryEvidence:boolean){
  const large=sources.some(source=>{
    const identity=source.identity!;
    return stage.selectedPowerHp/metricPower(identity.stockPowerHp,identity.powerUnit)>1.45+1e-8
      ||(identity.stockTorqueNm!==undefined&&stage.selectedTorqueNm!==undefined&&stage.selectedTorqueNm/metricTorque(identity.stockTorqueNm,identity.torqueUnit)>1.45+1e-8);
  });
  if(!large)return {largeGain:false,extraEvidenceSatisfied:true};
  const compatibleIndependent=stage.confidence==="multi-source"&&stage.sourceAgreement!=="conflict";
  const enough=compatibleIndependent||validFactoryEvidence;
  stage.conditions.push(enough?"LARGE_GAIN_CORROBORATED":"LARGE_GAIN_REQUIRES_EXTRA_EVIDENCE");
  if(!enough)stage.ownerReviewRequired=true;
  return {largeGain:true,extraEvidenceSatisfied:enough};
}
