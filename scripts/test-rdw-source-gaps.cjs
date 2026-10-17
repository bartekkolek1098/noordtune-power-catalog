/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const baseline = require("../data/research/rdw-source-gap-audit-2026-10-08.json");
const {auditRdwSourceGaps} = require("./report-rdw-source-gaps.cjs");

const current = auditRdwSourceGaps();
assert.deepEqual(current, baseline, "Aggregate baseline must be reproducible from committed input snapshots");
assert.equal(current.reportVersion, "rdw-source-audit-v1");
assert.equal(current.sourceProfiles, 1269);
const t = current.taxonomy, f = current.rdwFleetPossibleFamilySource;

assert.equal(t.all, 4592);
assert.equal(t.petrolDiesel, 3708);
assert.equal(t.otherFuel, 884);
assert.equal(t.candidateSomeYear, 551);
assert.equal(t.candidateEveryCheckedYear, 194);
assert.equal(t.noCandidate, 3157);
assert.equal(t.ambiguousWithoutCandidate, 20);
assert.equal(t.distinctCandidateSources, 512);
assert.equal(t.testedYearApplications, 26223);
assert.equal(t.candidateYearApplications, 2547);
assert.equal(t.petrolDiesel + t.otherFuel, t.all);
assert.equal(t.candidateSomeYear + t.noCandidate, t.petrolDiesel);
assert.ok(t.candidateEveryCheckedYear <= t.candidateSomeYear);
assert.ok(t.candidateYearApplications <= t.testedYearApplications);
assert.equal(Object.values(t.firstMissingFilter).reduce((a,b)=>a+b,0),t.noCandidate,
  "First failed source filter must partition the unmatched taxonomy cohort");
assert.equal(t.firstMissingFilter.noCloseFactoryPower,1222);
assert.equal(t.firstMissingFilter.noMatchingModelFamily,772);
assert.equal(t.firstMissingFilter.noCloseDisplacement,738);

assert.equal(f.selectedGroups,5000);
assert.equal(f.reportedRdwPopulation,11327762);
assert.equal(f.registrationsInSelectedGroups,10155079);
assert.equal(f.groupsWithPossibleModelSource,1082);
assert.equal(f.groupsWithoutPossibleModelSource,3918);
assert.equal(f.registrationsInGroupsWithPossibleModelSource,4348674);
assert.equal(f.registrationsInGroupsWithoutPossibleModelSource,5806405);
assert.equal(f.groupsWithPossibleModelSource+f.groupsWithoutPossibleModelSource,f.selectedGroups);
assert.equal(f.registrationsInGroupsWithPossibleModelSource+
 f.registrationsInGroupsWithoutPossibleModelSource,f.registrationsInSelectedGroups);
assert.ok(f.registrationsInSelectedGroups < f.reportedRdwPopulation,
  "Top 5,000 groups must not be mistaken for the whole RDW fleet");

for (const hash of Object.values(current.inputs))
  assert.match(hash,/^[a-f0-9]{64}$/,"Input revision must be tracked by SHA256");
assert.ok(current.limitations.some(x=>x.includes("NOT")||x.includes("never")));
assert.ok(current.limitations.some(x=>x.includes("5,000")));
assert.ok(current.limitations.some(x=>x.includes("factory-power")));

// All observations are aggregate group descriptors, never a customer record.
function assertAggregateOnly(value){
 if(Array.isArray(value))return value.forEach(assertAggregateOnly);
 if(!value||typeof value!=="object")return;
 for(const [key,v] of Object.entries(value)){
  assert.ok(!/^(plate|kenteken|licensePlate|vin|ownerName|ownerAddress|personalData)$/i.test(key),
   "No plate, VIN or identifying ownership fields in RDW audit: "+key);
  assertAggregateOnly(v);
 }
}
assertAggregateOnly(current);
assert.equal(current.publicStage3Allowed,false);
console.log("RDW_SOURCE_GAP_AUDIT_PASS: 4592 taxonomy entries, 3708 ICE fuel labels, 551 source candidates, 3157 nonmatches; 5000 aggregate RDW cohorts; deterministic and plate-free.");