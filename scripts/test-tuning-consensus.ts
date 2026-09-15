import assert from "node:assert/strict";
import {stageConsensus} from "../src/data/tuning-profiles/consensus.ts";
import type {SourceObservation} from "../src/data/tuning-profiles/schema.ts";

const observation = (id: string, provider: SourceObservation["provider"], powerHp: number, torqueNm = 330): SourceObservation => ({
  id, provider, sourceName: provider, url: `https://example.com/${id}`, retrievedAt: "2026-09-15T00:00:00Z", status: "retrieved", retrievalMethod: "page",
  identity: {brand: "Test", modelFamily: "Test", generation: "I", yearFrom: 2015, fuel: "Diesel", engineMarketingName: "1.6 diesel", displacementCc: 1600, displacementPrecision: "nominal", stockPowerHp: 136, powerUnit: "PS", torqueUnit: "Nm"},
  stages: {stage1: {powerHp, torqueNm}}
});
const a = observation("a", "shiftech", 159);
const b = observation("b", "unlimited-tuning", 162, 340);
const close = stageConsensus([a, b], "stage1")!;
assert.equal(close.selectedPowerHp, 160);
assert.equal(close.selectedTorqueNm, 330);
assert.equal(close.confidence, "multi-source");
assert.equal(close.sourceAgreement, "strong");
const conflict = stageConsensus([a, observation("c", "mosselman", 190, 420)], "stage1")!;
assert.equal(conflict.selectedPowerHp, 160);
assert.equal(conflict.selectedTorqueNm, 330);
assert.equal(conflict.sourceAgreement, "conflict");
assert.equal(conflict.ownerReviewRequired, true);
assert.equal(conflict.sourceValues.length, 2);
assert.equal(stageConsensus([a, {...b, provider: "shiftech"}], "stage1")!.confidence, "single-source");
assert.equal(stageConsensus([{...a, status: "blocked"}], "stage1"), undefined);
assert.equal(stageConsensus([{...a, retrievalMethod: "search-index"}], "stage1"), undefined);
assert.equal(stageConsensus([a], "stage2"), undefined);
assert.equal(stageConsensus([a], "stage3"), undefined);
const imperial = {...a, identity: {...a.identity!, powerUnit: "bhp" as const, torqueUnit: "lb-ft" as const}, stages: {stage1: {powerHp: 158, torqueNm: 250}}};
const converted = stageConsensus([imperial], "stage1")!;
assert.equal(converted.selectedPowerHp, 160);
assert.equal(converted.selectedTorqueNm, 340);
assert.ok(converted.sourceValues[0].powerHp > 160);
console.log("Tuning consensus: 17 assertions passed (agreement, conflicts, independence, units, unsupported stages).");
