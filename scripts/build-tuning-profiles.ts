import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdirSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {independentProvider, metricPower, metricTorque, stageConsensus} from "../src/data/tuning-profiles/consensus.ts";
import type {SourceObservation, SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";

const root = resolve("data/research");
const batchRoot = join(root, "batches");
const observations = readdirSync(batchRoot).filter(file => file.endsWith(".json")).sort().flatMap(file => JSON.parse(readFileSync(join(batchRoot, file), "utf8")) as SourceObservation[]);
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ids = new Set<string>();
const rejected: {sourceId: string; reasons: string[]}[] = [];
const groups = new Map<string, SourceObservation[]>();
for (const source of observations) {
  assert.ok(source.id && !ids.has(source.id), `Duplicate/missing observation ID: ${source.id}`);
  ids.add(source.id);
  assert.ok(/^https:\/\//.test(source.url) && Number.isFinite(Date.parse(source.retrievedAt)), `${source.id}: URL and real retrieval timestamp required`);
  const identity = source.identity;
  const reasons = [];
  if (source.status !== "retrieved" || source.retrievalMethod === "search-index") reasons.push("ACTUAL_PUBLIC_FACT_RETRIEVAL_REQUIRED");
  if (!identity) reasons.push("IDENTITY_UNAVAILABLE");
  else {
    if (!identity.brand || !identity.modelFamily || !identity.generation || !identity.engineMarketingName) reasons.push("MODEL_ENGINE_GENERATION_REQUIRED");
    if (!Number.isInteger(identity.yearFrom) || identity.yearFrom < 1980 || identity.yearFrom > 2027 || (identity.yearTo !== undefined && identity.yearTo < identity.yearFrom)) reasons.push("INVALID_YEAR_SCOPE");
    if (!(identity.displacementCc > 0) || !(identity.stockPowerHp > 0)) reasons.push("INVALID_STOCK_FACTS");
    if (identity.electrification === "hybrid" || identity.electrification === "mild-hybrid") reasons.push("HYBRID_RUNTIME_SCOPE_UNSUPPORTED");
    if (!["Petrol", "Diesel"].includes(identity.fuel)) reasons.push("UNSUPPORTED_FUEL");
  }
  if (!source.stages?.stage1 || !(source.stages.stage1.powerHp > 0)) reasons.push("SOURCED_STAGE1_REQUIRED");
  for (const value of Object.values(source.stages ?? {})) {
    assert.ok(Number.isFinite(value.powerHp) && value.powerHp > 0, `${source.id}: invalid Stage power`);
    assert.ok(value.torqueNm === undefined || (Number.isFinite(value.torqueNm) && value.torqueNm > 0), `${source.id}: invalid Stage torque`);
  }
  if (reasons.length || !identity) { rejected.push({sourceId: source.id, reasons}); continue; }
  // Deliberately strict grouping: generation and published year band stay distinct.
  // Wider cross-model/year relationships require explicit evidence, never Cartesian expansion.
  const key = [identity.brand, identity.modelFamily, identity.generation, identity.fuel, identity.displacementCc,
    Math.round(metricPower(identity.stockPowerHp, identity.powerUnit)), identity.stockTorqueNm ?? "unknown", identity.yearFrom, identity.yearTo ?? "open", identity.engineFamily ?? ""].map(value => normalize(String(value))).join("|");
  const groupKey = source.consensusGroup ? `reviewed:${source.consensusGroup}` : key;
  groups.set(groupKey, [...(groups.get(groupKey) ?? []), source]);
}

const profiles: SourcedTuningProfile[] = [...groups.entries()].map(([key, sources]) => {
  const source = sources.find(item => item.identity?.displacementPrecision === "exact") ?? sources[0];
  const identity = source.identity!;
  const yearFrom = Math.max(...sources.map(item => item.identity!.yearFrom));
  const ends = sources.flatMap(item => item.identity!.yearTo === undefined ? [] : [item.identity!.yearTo!]);
  const yearTo = ends.length ? Math.min(...ends) : undefined;
  assert.ok(yearTo === undefined || yearTo >= yearFrom, `${key}: counterpart years do not overlap`);
  for (const item of sources) {
    const other = item.identity!;
    assert.equal(normalize(other.brand), normalize(identity.brand), `${key}: counterpart make conflict`);
    assert.equal(normalize(other.modelFamily), normalize(identity.modelFamily), `${key}: counterpart family conflict`);
    assert.equal(other.fuel, identity.fuel, `${key}: counterpart fuel conflict`);
    assert.ok(Math.abs(other.displacementCc - identity.displacementCc) <= (other.displacementPrecision === "nominal" || identity.displacementPrecision === "nominal" ? 49 : 2), `${key}: counterpart displacement conflict`);
    assert.ok(Math.abs(metricPower(other.stockPowerHp, other.powerUnit) - metricPower(identity.stockPowerHp, identity.powerUnit)) <= 3, `${key}: counterpart stock power conflict`);
    if (other.stockTorqueNm && identity.stockTorqueNm) assert.ok(Math.abs(other.stockTorqueNm - identity.stockTorqueNm) <= 10, `${key}: counterpart stock torque variant conflict`);
    if (other.engineFamily && identity.engineFamily) assert.equal(normalize(other.engineFamily), normalize(identity.engineFamily), `${key}: counterpart engine-family conflict`);
  }
  const stage1 = stageConsensus(sources, "stage1")!;
  const stage2 = stageConsensus(sources, "stage2");
  const stage3 = stageConsensus(sources, "stage3");
  const ownerReviewRequired = [stage1, stage2, stage3].some(stage => stage?.ownerReviewRequired);
  const sourceCount = (stage: "stage1" | "stage2" | "stage3") => new Set(sources.filter(item => item.stages?.[stage]).map(independentProvider)).size;
  const {powerUnit, torqueUnit, ...facts} = identity;
  return {...facts, yearFrom, ...(yearTo !== undefined ? {yearTo} : {}), stockPowerHp: Math.round(metricPower(identity.stockPowerHp, powerUnit)),
    ...(identity.stockTorqueNm !== undefined ? {stockTorqueNm: Math.round(metricTorque(identity.stockTorqueNm, torqueUnit))} : {}),
    aliases: [...new Set(sources.flatMap(item => item.identity?.aliases ?? []))],
    id: `sourced-${normalize(identity.brand)}-${normalize(identity.modelFamily)}-${createHash("sha256").update(key).digest("hex").slice(0, 12)}`,
    sourceIds: sources.map(item => item.id), sourceUrls: [...new Set(sources.map(item => item.url))],
    retrievedAt: sources.map(item => item.retrievedAt).sort().at(-1)!, lastReviewedAt: sources.map(item => item.retrievedAt).sort().at(-1)!,
    reviewStatus: ownerReviewRequired ? "owner-review-required" as const : "source-reviewed" as const,
    ownerReviewRequired, stockSourceQuality: new Set(sources.map(independentProvider)).size >= 2 ? "multi-source" as const : "single-source" as const,
    stage1, ...(stage2 ? {stage2} : {}), ...(stage3 ? {stage3} : {}), stage1SourceCount: sourceCount("stage1"), stage2SourceCount: sourceCount("stage2"), stage3SourceCount: sourceCount("stage3"),
    conditions: [...new Set(sources.flatMap(item => item.conditions ?? []))], notes: [...new Set(sources.flatMap(item => item.notes ?? []))]};
}).sort((a, b) => a.id.localeCompare(b.id));

const datasetRoot = resolve("src/data/tuning-profiles");
mkdirSync(datasetRoot, {recursive: true});
const write = (file: string, value: unknown) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
write(join(datasetRoot, "profiles.json"), profiles);
write(join(datasetRoot, "source-index.json"), observations.map(({id, provider, sourceName, url, retrievedAt, status, retrievalMethod, contentSha256}) => ({id, provider, sourceName, url, retrievedAt, status, retrievalMethod, contentSha256})));
write(join(root, "source-pages.json"), observations);
write(join(root, "profile-consensus.json"), profiles.map(({id, brand, modelFamily, generation, yearFrom, yearTo, stockPowerHp, stockSourceQuality, stage1, stage2, stage3, ownerReviewRequired, sourceIds}) => ({id, brand, modelFamily, generation, yearFrom, yearTo, stockPowerHp, stockSourceQuality, stage1, stage2, stage3, ownerReviewRequired, sourceIds})));
write(join(root, "unresolved-conflicts.json"), {rejected, conflicts: profiles.filter(profile => [profile.stage1, profile.stage2, profile.stage3].some(stage => stage?.sourceAgreement === "conflict")).map(profile => ({id: profile.id, sourceIds: profile.sourceIds, stage1: profile.stage1, stage2: profile.stage2, stage3: profile.stage3}))});
console.log(JSON.stringify({observations: observations.length, profiles: profiles.length, multiSource: profiles.filter(profile => profile.stage1.confidence === "multi-source").length, rejected: rejected.length}));
