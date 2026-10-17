/* eslint-disable @typescript-eslint/no-require-imports */
// Research-only: distinguish actual naming aliases from dangerous shared-engine
// model siblings. NO customer match can be produced from this report.
const {catalogTaxonomyV2} = require("../src/data/catalog-taxonomy-v2.ts");
const {sourcedTuningProfiles} = require("../src/data/tuning-profiles/index.ts");
const {sourceMake, sourceModelFamily} = require("../src/lib/sourced-tuning-match.ts");
const {nominalDisplacementMatches} = require("../src/data/catalog-matching.ts");

function sourceEnd(profile) {
  return profile.yearTo ?? Number(profile.retrievedAt.slice(0, 4));
}
function sourceDisplacementMatches(row, profile) {
  if (!row.displacementCc || !profile.displacementCc) return false;
  return profile.displacementPrecision === "exact"
    ? Math.abs(row.displacementCc - profile.displacementCc) <= 2
    : nominalDisplacementMatches(row.displacementCc, profile.displacementCc);
}
function inputFamily(row) {
  const model = row.brand === "BMW" && /^[1-8]$/.test(row.model)
    ? row.model + " series" : row.model;
  return model + " " + row.engine;
}
function namesMatch(model, family) {
  return model === family || model.startsWith(family + " ");
}
function stringDistance(a, b) {
  const costs = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = costs[0];
    costs[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = costs[j];
      costs[j] = Math.min(costs[j] + 1, costs[j - 1] + 1,
        previous + Number(a[i - 1] !== b[j - 1]));
      previous = old;
    }
  }
  return costs[b.length];
}
function diagnosticOnlySimilar(a, b) {
  if (!a || !b) return false;
  const ratio = stringDistance(a, b) / Math.max(a.length, b.length);
  return ratio < 0.45 || a.startsWith(b) || b.startsWith(a);
}

function auditModelSiblingRejections() {
  const sourcesByMake = new Map();
  for (const profile of sourcedTuningProfiles) {
    const brand = sourceMake(profile.brand);
    const list = sourcesByMake.get(brand) ?? [];
    list.push(profile);
    sourcesByMake.set(brand, list);
  }
  const siblingPairs = new Map();
  const brandCounts = new Map();
  let modelRejected = 0;
  let superficiallySimilar = 0;
  const visibleRiskExamples = [];
  for (const row of catalogTaxonomyV2) {
    if (!["Petrol", "Diesel"].includes(row.fuel)) continue;
    const make = sourceMake(row.brand);
    const start = Math.max(1990, row.yearFrom);
    const end = Math.min(2026, row.yearTo);
    // Same stage as v1's "model family" first-failed diagnostic.
    const possible = (sourcesByMake.get(make) ?? []).filter(profile =>
      profile.fuel === row.fuel &&
      Math.abs(profile.stockPowerHp - row.stockPowerHp) <= 3 &&
      sourceDisplacementMatches(row, profile) &&
      start <= sourceEnd(profile) && end >= profile.yearFrom
    );
    if (!possible.length) continue;
    const fullModel = sourceModelFamily(make, inputFamily(row));
    const candidates = possible.flatMap(profile =>
      [profile.modelFamily, ...(profile.aliases ?? [])].map(value => ({
        profile,
        sourceFamily: sourceModelFamily(make, value)
      }))
    );
    if (candidates.some(c => namesMatch(fullModel, c.sourceFamily))) continue;
    modelRejected++;
    const taxonomyModel = sourceModelFamily(make,
      row.brand === "BMW" && /^[1-8]$/.test(row.model)
        ? row.model + " series" : row.model);
    const sorted = candidates.map(c => ({
      ...c,
      superficialSimilarity: diagnosticOnlySimilar(taxonomyModel, c.sourceFamily),
      ratio: stringDistance(taxonomyModel, c.sourceFamily) /
        Math.max(taxonomyModel.length, c.sourceFamily.length)
    })).sort((a, b) => a.ratio - b.ratio ||
      a.profile.modelFamily.localeCompare(b.profile.modelFamily));
    if (sorted.some(c => c.superficialSimilarity)) superficiallySimilar++;
    const makeCount = brandCounts.get(row.brand) ?? 0;
    brandCounts.set(row.brand, makeCount + 1);
    const closest = sorted[0];
    if (closest) {
      const key = row.brand + "|" + row.model + "|" + closest.profile.modelFamily;
      siblingPairs.set(key, (siblingPairs.get(key) ?? 0) + 1);
    }
    const riskPair = [
      ["BMW", "4", "3 Series"],
      ["BMW", "2", "3 Series"],
      ["Citroën", "C4", "C4 Picasso"],
      ["Peugeot", "3008", "308"],
      ["Ford", "Tourneo Custom", "Transit Custom"]
    ];
    if (closest && visibleRiskExamples.length < 22 &&
      riskPair.some(([m, original, related]) =>
        m === row.brand && original === row.model &&
        closest.profile.modelFamily === related)) {
      visibleRiskExamples.push({
        make: row.brand,
        taxonomyModel: row.model,
        taxonomyGeneration: row.generation,
        taxonomyStockPowerHp: row.stockPowerHp,
        otherSourceModel: closest.profile.modelFamily,
        otherSourceGeneration: closest.profile.generation,
        reason: "Different model family despite shared make/fuel/power/cc/years"
      });
    }
  }
  const topModelSiblingPairs = [...siblingPairs.entries()]
    .map(([key, rows]) => {
      const [make, taxonomyModel, otherSourceModel] = key.split("|");
      return {make, taxonomyModel, otherSourceModel, rows};
    })
    .sort((a, b) => b.rows - a.rows ||
      a.make.localeCompare(b.make) ||
      a.taxonomyModel.localeCompare(b.taxonomyModel))
    .slice(0, 45);
  return {
    reportVersion: "model-sibling-review-v1",
    inputTaxonomyRows: catalogTaxonomyV2.length,
    publishedSourceRows: sourcedTuningProfiles.length,
    modelFamilyRejections: modelRejected,
    superficiallySimilarNameRows: superficiallySimilar,
    warning: "Similarity is NOT evidence of an alias or compatible ECU calibration. Never enable fuzzy cross-model tuning matches from this diagnostic.",
    rejectedByMake: [...brandCounts.entries()]
      .map(([make, rows]) => ({make, rows}))
      .sort((a, b) => b.rows - a.rows || a.make.localeCompare(b.make)),
    topModelSiblingPairs,
    protectedExamples: visibleRiskExamples,
    allowedFutureChange: "Only an individually approved exact alias based on documented manufacturer model naming and full engine/gen/stock torque/hardware evidence; add negative sibling tests first."
  };
}
if (require.main === module) {
  const report = auditModelSiblingRejections();
  console.log(JSON.stringify(process.argv.includes("--summary") ? {
    modelFamilyRejections: report.modelFamilyRejections,
    superficiallySimilarNameRows: report.superficiallySimilarNameRows,
    topModelSiblingPairs: report.topModelSiblingPairs.slice(0, 15),
    warning: report.warning
  } : report, null, 2));
}
module.exports = {auditModelSiblingRejections};
