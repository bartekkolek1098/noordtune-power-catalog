/* eslint-disable @typescript-eslint/no-require-imports */
/* Offline, aggregate-only QA of 3,000 previously frozen public RDW observations.
 * No network or external plate lookups; use synthetic QA0000 in the resolver.
 * Do not persist sampleIds, registry type/variant/execution, plates or owners.
 */
const fs=require("node:fs");
const crypto=require("node:crypto");
const path=require("node:path");
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const snapshot=require("../data/research/nl-top-groups-output-sample.json");
const historical=require("../data/research/nl-output-variant-priority.json");

const baselineBySample=new Map();
for(const group of historical.groups)for(const variant of group.observedOutputVariants)
  for(const sampleId of variant.sampleIds??[])
    baselineBySample.set(sampleId,{class:variant.layer,profileId:variant.selectedProfileId??null});

function inputHash(relative){
  return crypto.createHash("sha256").update(fs.readFileSync(path.resolve(__dirname,"..",relative))).digest("hex");
}
function auditObservedRdwCoverage(){
  const stats={
    rows:0,makeModelPreserved:0,vehicleContainsSensitiveIdentity:0,missingRegisteredPower:0,
    numericStage1:0,noNumeric:0,sourceComparison:0,customerStage3:0,
    byCoverage:{},byFuel:{},historicalAB:0,currentAB:0,improvedToAB:0,demotedFromAB:0,
    baselineCompared:0,changedSelectedProfile:0
  };
  const reasons=new Map(),models=new Map(),degraded=new Map();
  for(const row of snapshot.rows){
    stats.rows++;
    if(Object.keys(row.vehicle).some(key=>/^(kenteken|vin|owner|owner_name|owner_address|naam_eigenaar|adres_eigenaar)$/i.test(key)))
      stats.vehicleContainsSensitiveIdentity++;
    const resolution=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
    const vehicle=resolution.vehicle;
    const estimate=resolution.tuningEstimate;
    const sourceMake=String(row.vehicle.merk??"").trim().toUpperCase();
    const sourceModel=String(row.vehicle.handelsbenaming??"").trim().toUpperCase();
    if(vehicle.make.trim().toUpperCase()===sourceMake&&vehicle.model.trim().toUpperCase()===sourceModel)
      stats.makeModelPreserved++;
    const stage1=estimate.profile?.stages.find(stage=>stage.name==="Stage 1");
    const numeric=Boolean(stage1&&!stage1.customHardware&&(stage1.powerHp!==undefined||stage1.powerRangeHp!==undefined));
    if(numeric)stats.numericStage1++;
    else stats.noNumeric++;
    if(resolution.comparison)stats.sourceComparison++;
    if(estimate.profile?.stages.some(stage=>/^Stage 3/.test(stage.name)))stats.customerStage3++;
    if(vehicle.engine.powerKw==null||!(vehicle.engine.powerKw>0))stats.missingRegisteredPower++;
    const cls=estimate.coverageClass??"Unknown";
    stats.byCoverage[cls]=(stats.byCoverage[cls]??0)+1;
    const fuel=vehicle.fuel??"Unknown";
    stats.byFuel[fuel]??={observations:0,numericStage1:0};
    stats.byFuel[fuel].observations++;
    if(numeric)stats.byFuel[fuel].numericStage1++;
    const modelKey=sourceMake+"|"+sourceModel;
    const model=models.get(modelKey)??{make:vehicle.make,model:vehicle.model,observations:0,numericStage1:0,sourceComparison:0,missingPower:0,coverage:{}};
    model.observations++;
    if(numeric)model.numericStage1++;
    if(resolution.comparison)model.sourceComparison++;
    if(vehicle.engine.powerKw==null)model.missingPower++;
    model.coverage[cls]=(model.coverage[cls]??0)+1;
    models.set(modelKey,model);
    const older=baselineBySample.get(row.sampleId);
    if(older){
      stats.baselineCompared++;
      const oldAB=older.class==="A"||older.class==="B";
      const newAB=cls==="A"||cls==="B";
      if(oldAB)stats.historicalAB++;
      if(newAB)stats.currentAB++;
      if(!oldAB&&newAB)stats.improvedToAB++;
      if(oldAB&&!newAB){
        stats.demotedFromAB++;
        const key=[sourceMake,sourceModel,older.class,cls,older.profileId,estimate.profile?.id??"-"].join("|");
        const item=degraded.get(key)??{
          make:vehicle.make,model:vehicle.model,oldCoverage:older.class,currentCoverage:cls,
          oldProfileId:older.profileId,currentProfileId:estimate.profile?.id??null,
          numericStage1StillVisible:false,
          reasonCodes:[...new Set(estimate.reasonCodes??[])].slice(0,10),observations:0
        };
        item.observations++;
        if(numeric)item.numericStage1StillVisible=true;
        degraded.set(key,item);
      }
      if(older.profileId&&older.profileId!==estimate.profile?.id)stats.changedSelectedProfile++;
    }
    for(const reason of estimate.reasonCodes??[])reasons.set(reason,(reasons.get(reason)??0)+1);
  }
  return {
    schemaVersion:1,derivedOn:"2026-10-08",
    method:"Read-only offline replay of frozen purposive top-250 RDW aggregate-group observations via the current normalizeRdwVehicle, synthetic plate QA0000 only",
    inputFingerprints:{
      rdwObservationsSha256:inputHash("data/research/nl-top-groups-output-sample.json"),
      historicalClassificationSha256:inputHash("data/research/nl-output-variant-priority.json")
    },
    stats,
    lowerConfidenceChanges:[...degraded.values()].sort((a,b)=>b.observations-a.observations||a.make.localeCompare(b.make)),
    topMissingNumericModels:[...models.values()].filter(row=>row.numericStage1<row.observations)
      .sort((a,b)=>(b.observations-b.numericStage1)-(a.observations-a.numericStage1)||a.make.localeCompare(b.make)).slice(0,35),
    topReasonCodes:[...reasons.entries()].sort((a,b)=>b[1]-a[1]).slice(0,25).map(([code,observations])=>({code,observations})),
    limitations:[
      "This is a frozen purposive 3,000-record sample from 250 priority model groups, not a random sample or a full-fleet success rate.",
      "A numeric Stage 1 output in this report may be conditional and requires technical owner/ECU/fuel/hardware verification before sale.",
      "A/B are coverage grades, not necessarily confirmation of the precise customer's ECU or a guaranteed tuning result.",
      "Comparison output is clearly separated from direct Stage 1 and does not prove the listed reference fits the customer's installed engine.",
      "Only aggregate make/model/coverage outcomes and public profile IDs are emitted. No sample IDs, RDW registry type/variant/execution codes, VINs, plates, ownership dates or owner fields are retained."
    ]
  };
}
if(require.main===module){
  const report=auditObservedRdwCoverage();
  const s=report.stats;
  console.log(JSON.stringify(process.argv.includes("--summary")?
    {total:s.rows,exactIdentity:s.makeModelPreserved,numericStage1:s.numericStage1,sourceComparison:s.sourceComparison,
     noNumeric:s.noNumeric,missingPower:s.missingRegisteredPower,
     historicalAB:s.historicalAB,currentAB:s.currentAB,improvedToAB:s.improvedToAB,demotedFromAB:s.demotedFromAB,
     demoted:report.lowerConfidenceChanges,topMissing:report.topMissingNumericModels.slice(0,10)}
    :report,null,2));
}
module.exports={auditObservedRdwCoverage};
