import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {independentProvider, metricPower, metricTorque, stageConsensus} from "../src/data/tuning-profiles/consensus.ts";
import type {SourceObservation, SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";
import {compatibleGeneration, effectiveGenerationScope, flagNonMonotonicStages, type GenerationBoundary} from "./tuning-profile-scope.ts";
import {applyLargeGainScrutiny, hasReviewedEngineFamily, negativeSourceConflicts, sourceIsAvailable} from "./tuning-source-evidence.ts";

const root = resolve("data/research");
const batchRoot = join(root, "batches");
const observations = readdirSync(batchRoot).filter(file => file.endsWith(".json")).sort().flatMap(file => JSON.parse(readFileSync(join(batchRoot, file), "utf8")) as SourceObservation[]);
type ReviewedPromotion={sourceId:string;url:string;contentSha256:string;stock:{brand:string;modelFamily:string;fuel:string;yearFrom:number;yearTo:number;displacementCc:number;stockPowerHp:number;stockTorqueNm:number};stage1:{powerHp:number;torqueNm:number};frozenCaseIds:string[];reason:string};
const promotionPath=join(root,"v3-1-reviewed-promotions.json");
const promotions:ReviewedPromotion[]=existsSync(promotionPath)?JSON.parse(readFileSync(promotionPath,"utf8")).reviews:[];
const promotionById=new Map(promotions.map(review=>[review.sourceId,review]));
assert.equal(promotionById.size,promotions.length,"Reviewed promotions must have unique source IDs");
for(const review of promotions){
  const source=observations.find(item=>item.id===review.sourceId);
  assert.ok(source?.identity&&source.stages?.stage1&&source.status==="retrieved"&&source.retrievalMethod!=="search-index"
    &&source.url===review.url&&source.contentSha256===review.contentSha256,`${review.sourceId}: retrieved source and pinned page hash required`);
  assert.ok(source.conditions?.includes("V2_RESEARCH_QUEUE_NOT_PROMOTED")&&review.reason&&review.frozenCaseIds.length,
    `${review.sourceId}: explicit bounded queue review required`);
  for(const [field,value] of Object.entries(review.stock))assert.equal(source.identity[field as keyof typeof source.identity],value,
    `${review.sourceId}: reviewed stock ${field} drifted`);
  assert.equal(source.stages.stage1.powerHp,review.stage1.powerHp);
  assert.equal(source.stages.stage1.torqueNm,review.stage1.torqueNm);
}
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ids = new Set<string>();
const rejected: {sourceId: string; reasons: string[]}[] = [];
const supportingEvidence: string[] = [];
const groups = new Map<string, SourceObservation[]>();
const boundaries: GenerationBoundary[] = existsSync(join(root, "generation-boundaries.json")) ? JSON.parse(readFileSync(join(root, "generation-boundaries.json"), "utf8")) : [];
type CounterpartLink = {sourceId:string;targetSourceId:string;generation:string;evidenceUrls:string[];reason:string;relationship?:"same-provider-application-mirror";independentBridgeSourceId?:string};
const counterparts:CounterpartLink[]=["v2-counterpart-links.json","v3-counterpart-links.json","v3-2-counterpart-links.json"].flatMap(file=>existsSync(join(root,file))?JSON.parse(readFileSync(join(root,file),"utf8")):[]);
const v2Checkpoint=existsSync(join(root,"v2-consensus-checkpoint.json"))?JSON.parse(readFileSync(join(root,"v2-consensus-checkpoint.json"),"utf8")):undefined;
const retainedSourceIds=new Set<string>(v2Checkpoint?.profiles.flatMap((p:{sourceIds:string[]})=>p.sourceIds)??[]);
for (const source of observations) {
  assert.ok(source.id && !ids.has(source.id), `Duplicate/missing observation ID: ${source.id}`);
  ids.add(source.id);
  assert.ok(/^https:\/\//.test(source.url) && Number.isFinite(Date.parse(source.retrievedAt)), `${source.id}: URL and real retrieval timestamp required`);
  if (source.provider === "manufacturer" && source.status === "retrieved" && !source.stages) { supportingEvidence.push(source.id); continue; }
  const identity = source.identity;
  const reasons = [];
  if (source.status !== "retrieved" || source.retrievalMethod === "search-index") reasons.push("ACTUAL_PUBLIC_FACT_RETRIEVAL_REQUIRED");
  if (source.packages?.some(item => item.kind === "external-module")) reasons.push("EXTERNAL_MODULE_NOT_ORDINARY_REMAP");
  if(!sourceIsAvailable(source))reasons.push("SOURCE_APPLICATION_NOT_AVAILABLE");
  if(negativeSourceConflicts(source,observations).length)reasons.push("SOURCE_NEGATIVE_APPLICABILITY_OVERLAP");
  if(source.conditions?.includes("V3_APPLICABILITY_UNRESOLVED"))reasons.push("V3_APPLICABILITY_UNRESOLVED");
  if(source.conditions?.includes("V3_RESEARCH_QUEUE_NOT_PROMOTED"))reasons.push("V3_RESEARCH_QUEUE_NOT_PROMOTED");
  if (source.conditions?.includes("V2_APPLICABILITY_UNRESOLVED")) reasons.push("V2_APPLICABILITY_UNRESOLVED");
  if (source.conditions?.includes("V2_RESEARCH_QUEUE_NOT_PROMOTED")&&!promotionById.has(source.id)) reasons.push("V2_RESEARCH_QUEUE_NOT_PROMOTED");
  if(source.conditions?.includes("ENGINE_FAMILY_LABEL_CONFLICT")&&!hasReviewedEngineFamily(source,observations))reasons.push("ENGINE_FAMILY_LABEL_CONFLICT");
  if (!identity) reasons.push("IDENTITY_UNAVAILABLE");
  else {
    if (!identity.brand || !identity.modelFamily || !identity.generation || !identity.engineMarketingName) reasons.push("MODEL_ENGINE_GENERATION_REQUIRED");
    if (!Number.isInteger(identity.yearFrom) || identity.yearFrom < 1980 || identity.yearFrom > 2027 || (identity.yearTo !== undefined && identity.yearTo < identity.yearFrom)) reasons.push("INVALID_YEAR_SCOPE");
    if (!(identity.displacementCc > 0) || !(identity.stockPowerHp > 0)) reasons.push("INVALID_STOCK_FACTS");
    if (identity.electrification === "hybrid" || identity.electrification === "mild-hybrid") reasons.push("HYBRID_RUNTIME_SCOPE_UNSUPPORTED");
    if (!["Petrol", "Diesel"].includes(identity.fuel)) reasons.push("UNSUPPORTED_FUEL");
    if(source.reviewedScope){
      assert.ok(source.reviewedScope.yearFrom>=identity.yearFrom&&source.reviewedScope.yearTo<=(identity.yearTo??2026)
        &&source.reviewedScope.yearTo>=source.reviewedScope.yearFrom,`${source.id}: reviewed scope must narrow published years`);
      assert.ok(source.reviewedScope.reason&&/^https:\/\//.test(source.reviewedScope.sourceUrl)&&source.reviewedScope.contentSha256.length===64,`${source.id}: reviewed scope provenance required`);
    }
  }
  if (!source.stages?.stage1 || !(source.stages.stage1.powerHp > 0)) reasons.push("SOURCED_STAGE1_REQUIRED");
  if(identity&&source.stages?.stage1&&(source.stages.stage1.powerHp<identity.stockPowerHp-1
    ||(identity.stockTorqueNm&&source.stages.stage1.torqueNm&&source.stages.stage1.torqueNm<identity.stockTorqueNm-1)))reasons.push("STAGE1_BELOW_STOCK_REVIEW");
  for (const value of Object.values(source.stages ?? {})) {
    assert.ok(Number.isFinite(value.powerHp) && value.powerHp > 0, `${source.id}: invalid Stage power`);
    assert.ok(value.torqueNm === undefined || (Number.isFinite(value.torqueNm) && value.torqueNm > 0), `${source.id}: invalid Stage torque`);
  }
  if (reasons.length || !identity) { rejected.push({sourceId: source.id, reasons}); continue; }
  const acceptedSource=promotionById.has(source.id)
    ? {...source,conditions:source.conditions?.filter(condition=>condition!=="V2_RESEARCH_QUEUE_NOT_PROMOTED")}
    : source;
  // Deliberately strict grouping: generation and published year band stay distinct.
  // Wider cross-model/year relationships require explicit evidence, never Cartesian expansion.
  const key = [identity.brand, identity.modelFamily, identity.generation, identity.fuel, identity.displacementCc,
    Math.round(metricPower(identity.stockPowerHp, identity.powerUnit)), identity.stockTorqueNm===undefined?"unknown":Math.round(metricTorque(identity.stockTorqueNm,identity.torqueUnit)), identity.yearFrom, identity.yearTo ?? "open", identity.engineFamily ?? ""].map(value => normalize(String(value))).join("|");
  const groupKey = source.consensusGroup ? `reviewed:${source.consensusGroup}` : key;
  groups.set(groupKey, [...(groups.get(groupKey) ?? []), acceptedSource]);
}

// Reviewed cross-provider links preserve the original target group key / ID.
// Raw provider labels remain in source-pages; equivalence is explicit and audited.
for(const link of counterparts){
  const sourceEntry=[...groups.entries()].find(([,items])=>items.some(item=>item.id===link.sourceId));
  const targetEntry=[...groups.entries()].find(([,items])=>items.some(item=>item.id===link.targetSourceId));
  assert.ok(sourceEntry&&targetEntry,`Counterpart source must be accepted: ${link.sourceId} -> ${link.targetSourceId}`);
  const source=sourceEntry[1].find(item=>item.id===link.sourceId)!,target=targetEntry[1].find(item=>item.id===link.targetSourceId)!;
  if(link.relationship==="same-provider-application-mirror"){
    const bridge=observations.find(item=>item.id===link.independentBridgeSourceId);
    assert.ok(bridge?.identity&&bridge.status==="retrieved"&&bridge.retrievalMethod!=="search-index"
      &&independentProvider(bridge)!==independentProvider(source)&&link.evidenceUrls.includes(bridge.url),`${link.sourceId}: independent applicability bridge required for duplicate consolidation`);
  }else assert.notEqual(independentProvider(source),independentProvider(target),`${link.sourceId}: independent corroborating provider required`);
  assert.ok(link.reason&&link.evidenceUrls.includes(source.url)&&link.evidenceUrls.includes(target.url),`${link.sourceId}: concrete counterpart evidence required`);
  assert.equal(link.generation,target.identity!.generation,`${link.sourceId}: reviewed target generation must be exact`);
  if(sourceEntry[0]===targetEntry[0])continue;
  groups.set(sourceEntry[0],sourceEntry[1].filter(item=>item.id!==source.id));
  if(!groups.get(sourceEntry[0])!.length)groups.delete(sourceEntry[0]);
  groups.set(targetEntry[0],[...targetEntry[1],source]);
}

const profiles: SourcedTuningProfile[] = [...groups.entries()].map(([key, sources]) => {
  // Adding a provider does not silently replace the already reviewed identity label.
  const retained=sources.filter(item=>retainedSourceIds.has(item.id));
  const representatives=retained.length?retained:sources;
  const source = representatives.find(item => item.identity?.displacementPrecision === "exact") ?? representatives[0];
  const identity = source.identity!;
  const {yearFrom,yearTo,boundary,adjusted,rawFrom,rawTo}=effectiveGenerationScope(sources.map(item=>item.reviewedScope
    ? {...item.identity!,yearFrom:item.reviewedScope.yearFrom,yearTo:item.reviewedScope.yearTo,generation:item.reviewedScope.generation??item.identity!.generation}
    : item.identity!),boundaries);
  assert.ok(yearTo === undefined || yearTo >= yearFrom, `${key}: counterpart years do not overlap`);
  for (const item of sources) {
    const other = item.identity!;
    assert.equal(normalize(other.brand), normalize(identity.brand), `${key}: counterpart make conflict`);
    assert.equal(normalize(other.modelFamily), normalize(identity.modelFamily), `${key}: counterpart family conflict`);
    assert.equal(other.fuel, identity.fuel, `${key}: counterpart fuel conflict`);
    const reviewedEquivalent=counterparts.some(link=>link.sourceId===item.id&&sources.some(candidate=>candidate.id===link.targetSourceId)
      &&link.generation===identity.generation);
    assert.ok(reviewedEquivalent||compatibleGeneration(other.generation,identity.generation,other.yearFrom,identity.yearFrom),`${key}: counterpart body generation conflict`);
    assert.ok(Math.abs(other.displacementCc - identity.displacementCc) <= (other.displacementPrecision === "nominal" || identity.displacementPrecision === "nominal" ? 49 : 2), `${key}: counterpart displacement conflict`);
    assert.ok(Math.abs(metricPower(other.stockPowerHp, other.powerUnit) - metricPower(identity.stockPowerHp, identity.powerUnit)) <= 3, `${key}: counterpart stock power conflict`);
    if (other.stockTorqueNm && identity.stockTorqueNm) assert.ok(Math.abs(metricTorque(other.stockTorqueNm,other.torqueUnit) - metricTorque(identity.stockTorqueNm,identity.torqueUnit)) <= 10, `${key}: counterpart stock torque variant conflict`);
    if (other.engineFamily && identity.engineFamily) assert.equal(normalize(other.engineFamily), normalize(identity.engineFamily), `${key}: counterpart engine-family conflict`);
  }
  const stage1 = stageConsensus(sources, "stage1")!;
  const stage2 = stageConsensus(sources, "stage2");
  const stage3 = stageConsensus(sources, "stage3");
  const factoryEvidence=sources.some(item=>{
    const evidence=item.factoryDeratingEvidence;
    if(!evidence)return false;
    const fact=observations.find(candidate=>candidate.id===evidence.sourceId);
    assert.ok(fact?.provider==="manufacturer"&&fact.status==="retrieved"&&fact.retrievalMethod!=="search-index"
      &&fact.contentSha256?.length===64&&evidence.fields.length&&evidence.reason,`${item.id}: explicit factory de-rating provenance required`);
    return true;
  });
  applyLargeGainScrutiny(sources,stage1,factoryEvidence);
  const nonMonotonic=flagNonMonotonicStages([stage1,stage2,stage3]);
  const ownerReviewRequired = adjusted || sources.some(item=>item.reviewedScope) || [stage1, stage2, stage3].some(stage => stage?.ownerReviewRequired);
  const sourceCount = (stage: "stage1" | "stage2" | "stage3") => new Set(sources.filter(item => item.stages?.[stage]).map(independentProvider)).size;
  const {powerUnit, torqueUnit, ...facts} = identity;
  return {...facts, generation:source.reviewedScope?.generation??identity.generation, yearFrom, ...(yearTo !== undefined ? {yearTo} : {}),
    ...(boundary ? {generationScopeSource: {url: boundary.sourceUrl, retrievedAt: boundary.retrievedAt, method: "successor-generation-start" as const}} : {}),
    stockPowerHp: Math.round(metricPower(identity.stockPowerHp, powerUnit)),
    ...(identity.stockTorqueNm !== undefined ? {stockTorqueNm: Math.round(metricTorque(identity.stockTorqueNm, torqueUnit))} : {}),
    aliases: [...new Set(sources.flatMap(item => item.identity?.aliases ?? []))],
    id: `sourced-${normalize(identity.brand)}-${normalize(identity.modelFamily)}-${createHash("sha256").update(key).digest("hex").slice(0, 12)}`,
    sourceIds: sources.map(item => item.id), sourceUrls: [...new Set(sources.map(item => item.url))],
    retrievedAt: sources.map(item => item.retrievedAt).sort().at(-1)!, lastReviewedAt: sources.map(item => item.retrievedAt).sort().at(-1)!,
    reviewStatus: ownerReviewRequired ? "owner-review-required" as const : "source-reviewed" as const,
    ownerReviewRequired, stockSourceQuality: sources.some(item => item.stockValidation?.fields.includes("stockPowerHp") && item.stockValidation.fields.includes("displacementCc")
      && observations.some(manufacturer => manufacturer.id === item.stockValidation!.sourceId && manufacturer.provider === "manufacturer" && manufacturer.status === "retrieved" && manufacturer.retrievalMethod !== "search-index"))
      ? "manufacturer" as const : new Set(sources.map(independentProvider)).size >= 2 ? "multi-source" as const : "single-source" as const,
    stage1, ...(stage2 ? {stage2} : {}), ...(stage3 ? {stage3} : {}), stage1SourceCount: sourceCount("stage1"), stage2SourceCount: sourceCount("stage2"), stage3SourceCount: sourceCount("stage3"),
    conditions: [...new Set([...sources.flatMap(item => item.conditions ?? []),...(adjusted?["SOURCE_GENERATION_SCOPE_ADJUSTED"]:[]),...(nonMonotonic?["NON_MONOTONIC_SOURCED_STAGE"]:[])])],
    notes: [...new Set([...sources.flatMap(item => item.notes ?? []),...(adjusted?[`Effective scope intersects the matching body generation: source overlap ${rawFrom}–${rawTo??"open"} becomes ${yearFrom}–${yearTo??"open"}. Raw provider year bands are preserved in source observations; applicability requires review.`]:[])]) ]};
}).sort((a, b) => a.id.localeCompare(b.id));
for(const review of promotions)assert.ok(profiles.some(profile=>profile.sourceIds.includes(review.sourceId)),
  `${review.sourceId}: reviewed observation must enter a sourced profile`);

const datasetRoot = resolve("src/data/tuning-profiles");
mkdirSync(datasetRoot, {recursive: true});
// Complete all identity/checkpoint assertions before changing any generated file.
const outputs=new Map<string,string>();
const write = (file: string, value: unknown) => outputs.set(file, `${JSON.stringify(value, null, 2)}\n`);
write(join(datasetRoot, "profiles.json"), profiles);
write(join(datasetRoot, "source-index.json"), observations.map(({id, provider, sourceName, url, retrievedAt, status, retrievalMethod, contentSha256}) => ({id, provider, sourceName, url, retrievedAt, status, retrievalMethod, contentSha256})));
write(join(root, "source-pages.json"), observations);
write(join(root, "profile-consensus.json"), profiles.map(({id, brand, modelFamily, generation, yearFrom, yearTo, stockPowerHp, stockSourceQuality, stage1, stage2, stage3, ownerReviewRequired, sourceIds}) => ({id, brand, modelFamily, generation, yearFrom, yearTo, stockPowerHp, stockSourceQuality, stage1, stage2, stage3, ownerReviewRequired, sourceIds})));
// Every V1 numeric or applicability change is reproducibly linked to the new
// independent observations. Missing V1 identities are a build failure.
for(const [checkpointFile,outputFile] of [["v1-consensus-checkpoint.json",v2Checkpoint?"v3-v1-source-changes.json":"v2-source-changes.json"],["v2-consensus-checkpoint.json","v3-source-changes.json"]]){
const checkpointPath=join(root,checkpointFile);
if(existsSync(checkpointPath)){
  type Snapshot={id:string;sourceIds:string[];brand:string;modelFamily:string;generation:string;yearFrom:number;yearTo?:number;stockPowerHp:number;stockTorqueNm?:number;displacementCc:number;fuel:string;stages:Record<string,{powerHp:number;torqueNm?:number}|null>};
  const checkpoint=JSON.parse(readFileSync(checkpointPath,"utf8")) as {head:string;profiles:Snapshot[]};
  const stageFacts=(profile:SourcedTuningProfile)=>Object.fromEntries((["stage1","stage2","stage3"] as const).map(key=>[key,profile[key]?{powerHp:profile[key]!.selectedPowerHp,...(profile[key]!.selectedTorqueNm!==undefined?{torqueNm:profile[key]!.selectedTorqueNm}:{})}:null]));
  const records=checkpoint.profiles.flatMap(before=>{
    const supersessions: {profileId:string;retainedProfileId:string;reason:string;evidenceSourceIds:string[]}[]=checkpointFile==="v2-consensus-checkpoint.json"&&existsSync(join(root,"v3-profile-supersessions.json"))?JSON.parse(readFileSync(join(root,"v3-profile-supersessions.json"),"utf8")):[];
    const supersession=supersessions.find(row=>row.profileId===before.id);
    const profile=profiles.find(p=>p.id===(supersession?.retainedProfileId??before.id));
    assert.ok(profile,`Checkpoint profile disappeared without an explicit reviewed consolidation: ${before.id}`);
    if(supersession)assert.ok(supersession.reason&&supersession.evidenceSourceIds.length>=2
      &&before.sourceIds.every(id=>profile.sourceIds.includes(id)),`${before.id}: consolidated source observations must remain in the retained profile`);
    const after:Snapshot={id:profile.id,sourceIds:profile.sourceIds,brand:profile.brand,modelFamily:profile.modelFamily,generation:profile.generation,yearFrom:profile.yearFrom,...(profile.yearTo!==undefined?{yearTo:profile.yearTo}:{}),stockPowerHp:profile.stockPowerHp,...(profile.stockTorqueNm!==undefined?{stockTorqueNm:profile.stockTorqueNm}:{}),displacementCc:profile.displacementCc,fuel:profile.fuel,stages:stageFacts(profile)};
    const fields=([...new Set([...Object.keys(before),...Object.keys(after)])] as (keyof Snapshot)[]).filter(key=>key!=="sourceIds"&&JSON.stringify(before[key])!==JSON.stringify(after[key]));
    const addedSourceIds=profile.sourceIds.filter(id=>!before.sourceIds.includes(id));
    if(!fields.length&&!addedSourceIds.length)return [];
    const evidence=addedSourceIds.map(id=>observations.find(s=>s.id===id)!);
    const existingProviders=new Set(observations.filter(s=>before.sourceIds.includes(s.id)).map(independentProvider));
    if(fields.length)assert.ok(evidence.some(s=>!existingProviders.has(independentProvider(s))),`${before.id}: changed V1 facts require a new independent provider`);
    return [{profileId:before.id,...(supersession?{retainedProfileId:profile.id,supersession}:{}),changedFields:fields,numericChanged:JSON.stringify(before.stages)!==JSON.stringify(after.stages),addedSourceIds,before,after,
      reason:fields.includes("stages")?"New independent source enters the existing conservative consensus: one vote per provider; conflict uses the minimum, otherwise rounded median; no maximum selection.":fields.length?"Applicability narrowed to the intersection of independently published source scopes.":"Independent corroboration; existing selected facts retained.",
      counterpartReviews:counterparts.filter(link=>addedSourceIds.includes(link.sourceId)),evidence:evidence.map(s=>({sourceId:s.id,provider:s.provider,url:s.url,retrievedAt:s.retrievedAt,contentSha256:s.contentSha256,identity:s.identity,stages:s.stages}))}];
  });
  write(join(root,outputFile),{baselineHead:checkpoint.head,baselineProfiles:checkpoint.profiles.length,missingProfiles:0,reviewedConsolidations:records.filter(r=>r.supersession).length,numericChanged:records.filter(r=>r.numericChanged).length,scopeChanged:records.filter(r=>r.changedFields.some(f=>f==="yearFrom"||f==="yearTo")).length,records});
}
}
const stockVariants=profiles.flatMap((profile,index)=>profiles.slice(index+1).filter(other=>normalize(profile.brand)===normalize(other.brand)
  && normalize(profile.modelFamily)===normalize(other.modelFamily) && profile.fuel===other.fuel
  && Math.abs(profile.displacementCc-other.displacementCc)<=49 && Math.abs(profile.stockPowerHp-other.stockPowerHp)<=3
  && compatibleGeneration(profile.generation,other.generation,profile.yearFrom,other.yearFrom)
  && profile.yearFrom<=(other.yearTo??9999) && other.yearFrom<=(profile.yearTo??9999)
  && profile.stockTorqueNm!==undefined && other.stockTorqueNm!==undefined && profile.stockTorqueNm!==other.stockTorqueNm)
  .map(other=>({reason:"UNMERGED_STOCK_TORQUE_VARIANTS",profileIds:[profile.id,other.id],sourceIds:[...profile.sourceIds,...other.sourceIds],stockTorqueNm:[profile.stockTorqueNm,other.stockTorqueNm]})));
write(join(root, "unresolved-conflicts.json"), {rejected,stockVariants, conflicts: profiles.filter(profile => [profile.stage1, profile.stage2, profile.stage3].some(stage => stage?.sourceAgreement === "conflict")).map(profile => ({id: profile.id, sourceIds: profile.sourceIds, stage1: profile.stage1, stage2: profile.stage2, stage3: profile.stage3}))});
for(const [file,content] of outputs)writeFileSync(file,content);
console.log(JSON.stringify({observations: observations.length, profiles: profiles.length, multiSource: profiles.filter(profile => profile.stage1.confidence === "multi-source").length, rejected: rejected.length, supportingEvidence: supportingEvidence.length}));
