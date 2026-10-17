/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const baseline=require("../data/research/rdw-observed-3000-coverage-2026-10-08.json");
const {auditObservedRdwCoverage}=require("./report-observed-rdw-coverage.cjs");

const report=auditObservedRdwCoverage();
assert.deepEqual(report,baseline,"Frozen observed-RDW replay must be reproducible from committed source snapshots");
const s=report.stats;
assert.equal(report.schemaVersion,1);
assert.equal(s.rows,3000);
assert.equal(s.makeModelPreserved,3000,"Official RDW make/model must never be overwritten by tuning templates");
assert.equal(s.vehicleContainsSensitiveIdentity,0,"No license plate/VIN/owner identity in fixture vehicle fields");
assert.equal(s.customerStage3,0,"No customer-facing Stage 3");
assert.equal(s.missingRegisteredPower,17,"Power missing from RDW is not fabricated");
assert.equal(s.numericStage1,1379);
assert.equal(s.sourceComparison,294);
assert.equal(s.noNumeric,1621);
assert.equal(s.numericStage1+s.noNumeric,s.rows);
assert.ok(s.sourceComparison<=s.noNumeric,"Source comparison must not replace confirmed direct Stage 1");
assert.deepEqual(s.byCoverage,{B:1075,E:403,C:113,A:294,D:1115});
assert.equal(Object.values(s.byCoverage).reduce((x,y)=>x+y,0),s.rows);
assert.equal(s.baselineCompared,3000);
assert.equal(s.historicalAB,1120);
assert.equal(s.currentAB,1369);
assert.equal(s.improvedToAB,253);
assert.equal(s.demotedFromAB,4);
assert.equal(s.currentAB-s.historicalAB,s.improvedToAB-s.demotedFromAB,
  "Coverage class transitions must balance");
assert.equal(report.lowerConfidenceChanges.reduce((x,y)=>x+y.observations,0),4);
assert.ok(report.lowerConfidenceChanges.every(row=>row.numericStage1StillVisible),
  "Confidence downgrade must not be called customer output loss when Stage 1 remains numeric");
assert.ok(report.lowerConfidenceChanges.every(row=>row.currentCoverage==="C"));
assert.ok(report.lowerConfidenceChanges.every(row=>["FORD","VOLKSWAGEN"].includes(row.make)));
assert.ok(report.topMissingNumericModels.length>10);
assert.ok(report.topMissingNumericModels.some(row=>row.make==="SEAT"&&row.model==="LEON"));
assert.ok(report.topMissingNumericModels.some(row=>row.make==="VOLKSWAGEN"&&row.model==="GOLF"));
assert.ok(report.topMissingNumericModels.some(row=>row.make==="SKODA"&&row.model==="OCTAVIA"));
for(const hash of Object.values(report.inputFingerprints))
  assert.match(hash,/^[a-f0-9]{64}$/,"Snapshot source integrity SHA256");
function noSensitiveOutputFields(value){
 if(Array.isArray(value))return value.forEach(noSensitiveOutputFields);
 if(!value||typeof value!=="object")return;
 for(const [k,v] of Object.entries(value)){
  assert.ok(!/^(kenteken|plate|licensePlate|vin|sampleId|registration|type|variant|execution|owner|address)$/i.test(k),
    "No personal/opaque registration fields allowed in aggregate result: "+k);
  noSensitiveOutputFields(v);
 }
}
noSensitiveOutputFields(report);
assert.ok(report.limitations.some(x=>x.includes("not a random sample")));
console.log("RDW_OBSERVED_REPLAY_PASS: 3000 official make/model identities, 1379 numeric Stage 1, 294 separate comparisons, 253 A/B upgrades, 4 correctly downgraded certainty grades with numeric output retained; 0 private identifiers.");
