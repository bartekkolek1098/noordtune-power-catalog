import assert from "node:assert/strict";
import {readFileSync, mkdirSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {normalizeRdwVehicle, type RdwFuelRow, type RdwVehicleRow} from "../src/lib/rdw.ts";

// Frozen, purpose-selected RDW observations: never a whole-fleet prevalence estimate.
// This executable emits AGGREGATES ONLY. Do not output sample IDs, plates, VINs,
// exact dates, hashed per-car identifiers, variant strings, URLs or raw RDW rows.
const SAMPLE = "data/research/nl-top-groups-output-sample.json";
const JSON_REPORT = "docs/rdw-evidence-funnel.json";
const MARKDOWN_REPORT = "docs/rdw-evidence-funnel.md";
type FrozenRow = {vehicle:RdwVehicleRow;fuels:RdwFuelRow[];groupId:string};
type FrozenGroup = {groupId:string;priorityRank:number;make:string;model:string;
  displacementCc:number;yearBandFrom:number;yearBandTo:number;sampleSize:number};
type FrozenSample = {schemaVersion:number;sampleSize:number;groupsSampled:number;
  baselineHead:string;method:string;rows:FrozenRow[];groups:FrozenGroup[]};
const freeze = JSON.parse(readFileSync(SAMPLE, "utf8")) as FrozenSample;
assert.equal(freeze.sampleSize, 3000, "The same purpose-selected frozen RDW cohort must be used");
assert.equal(freeze.rows.length, freeze.sampleSize, "No removed/substituted observations");
assert.equal(freeze.groups.length, 250, "Same 250 preselected priority groups");
assert.equal(freeze.groupsSampled, 250);
const buckets = ["sourceLinked", "genericIndicative", "canonicalEstimated", "otherNumeric", "withheld"] as const;
type EvidenceBucket = typeof buckets[number];
type Counts = Record<EvidenceBucket, number>;
const makeCounts=():Counts => ({sourceLinked:0,genericIndicative:0,canonicalEstimated:0,otherNumeric:0,withheld:0});
const isNumber=(value:unknown):value is number =>
  typeof value==="number"&&Number.isFinite(value)&&value>0;
function stageHasNumeric(stage?:{powerHp?:number;powerRangeHp?:readonly number[]}) {
  return Boolean(stage&&(isNumber(stage.powerHp)||
    Array.isArray(stage.powerRangeHp)&&stage.powerRangeHp.length===2&&
    stage.powerRangeHp.every(isNumber)&&stage.powerRangeHp[0]<=stage.powerRangeHp[1]));
}
type EstimateProfile = NonNullable<ReturnType<typeof normalizeRdwVehicle>["tuningEstimate"]["profile"]>;
function classify(profile?:EstimateProfile):EvidenceBucket {
  const stage = profile?.stages.find(s=>s.name==="Stage 1");
  if(!stageHasNumeric(stage))return "withheld";
  if(stage?.provenance==="generic-indicative"||profile?.coverageClass==="D")return "genericIndicative";
  if(stage?.provenance==="canonical-estimated"||stage?.sourceConfidence==="canonical-existing")
    return "canonicalEstimated";
  const linked=profile?.sourceReferences.some(source=>
    source.url?.startsWith("https://")&&source.sourceType!=="heuristic")??false;
  const stageEvidence=Boolean(stage?.evidenceSourceIds?.length||
    stage?.provenance==="reference"||profile?.provenance==="sourced-profile");
  return linked&&stageEvidence?"sourceLinked":"otherNumeric";
}
const identity={rdwModelKnown:0,registeredPowerKnown:0,technicalFactsComplete:0,
  eligibleOrdinaryIce:0,ambiguousOrUnsupportedFuel:0,modelMissing:0,
  missingOriginalPower:0,missingGenerationType:0,missingEngineDisplacement:0,
  missingCylinderCount:0,missingFirstAdmissionYear:0};
const layers:Record<string,number>={A:0,B:0,C:0,D:0,E:0,unknown:0};
const stage1=makeCounts();
let sourceLinkedOrdinaryIce=0, sourceLinkedFullTechnical=0;
const allGroups=new Map(freeze.groups.map(g=>[g.groupId,{g,counts:makeCounts(),
  registeredPowerKnown:0,technicalFactsComplete:0,eligibleOrdinaryIce:0}]));
let customerStage2Numeric=0, customerStage3Numeric=0;
for(const row of freeze.rows){
  const group=allGroups.get(row.groupId);
  assert.ok(group,"Every frozen RDW row belongs to its preselected group");
  // No customer plate, no network request. Only the already stripped
  // technical facts are passed through the actual production normalizer.
  const result=normalizeRdwVehicle(row.vehicle,row.fuels,"QA0000");
  const modelKnown=Boolean(row.vehicle.merk?.trim()&&row.vehicle.handelsbenaming?.trim());
  const powerKnown=isNumber(result.vehicle.engine.powerKw);
  const typeKnown=Boolean(result.vehicle.type?.trim());
  const ccKnown=isNumber(result.vehicle.engine.displacementCc);
  const cylKnown=isNumber(result.vehicle.engine.cylinders);
  const yearKnown=Boolean(result.vehicle.registration.firstAdmissionYear);
  const fuelKnown=result.vehicle.fuels.length===1&&
    ["Benzine","Diesel"].includes(result.vehicle.fuels[0]);
  const complete=modelKnown&&powerKnown&&typeKnown&&ccKnown&&cylKnown&&yearKnown&&fuelKnown;
  if(modelKnown)identity.rdwModelKnown++;else identity.modelMissing++;
  if(powerKnown){identity.registeredPowerKnown++;group.registeredPowerKnown++;}
  else identity.missingOriginalPower++;
  if(!typeKnown)identity.missingGenerationType++;
  if(!ccKnown)identity.missingEngineDisplacement++;
  if(!cylKnown)identity.missingCylinderCount++;
  if(!yearKnown)identity.missingFirstAdmissionYear++;
  if(!fuelKnown)identity.ambiguousOrUnsupportedFuel++;
  if(complete){identity.technicalFactsComplete++;group.technicalFactsComplete++;}
  const ordinaryIce=modelKnown&&powerKnown&&ccKnown&&cylKnown&&yearKnown&&fuelKnown;
  if(ordinaryIce){identity.eligibleOrdinaryIce++;group.eligibleOrdinaryIce++;}
  const layer=result.tuningEstimate.coverageClass??"unknown";
  layers[layer]=(layers[layer]??0)+1;
  const kind=classify(result.tuningEstimate.profile);
  stage1[kind]++;group.counts[kind]++;
  if(kind==="sourceLinked"&&ordinaryIce)sourceLinkedOrdinaryIce++;
  if(kind==="sourceLinked"&&complete)sourceLinkedFullTechnical++;
  const stages=result.tuningEstimate.profile?.stages??[];
  if(stages.find(stage=>stage.name==="Stage 2"&&stageHasNumeric(stage)))customerStage2Numeric++;
  if(stages.find(stage=>stage.name==="Stage 3+"&&stageHasNumeric(stage)))customerStage3Numeric++;
}
const total=(counts:Counts)=>buckets.reduce((acc,key)=>acc+counts[key],0);
assert.equal(total(stage1),freeze.sampleSize);
assert.equal(Object.values(layers).reduce((a,b)=>a+b,0),freeze.sampleSize);
assert.equal(identity.rdwModelKnown+identity.modelMissing,freeze.sampleSize);
assert.equal(identity.registeredPowerKnown+identity.missingOriginalPower,freeze.sampleSize);
const sourceLinkedAcrossGroups=Array.from(allGroups.values()).reduce((sum,x)=>
  sum+x.counts.sourceLinked,0);
assert.equal(sourceLinkedAcrossGroups,stage1.sourceLinked);
assert.ok(sourceLinkedOrdinaryIce<=identity.eligibleOrdinaryIce);
assert.ok(sourceLinkedFullTechnical<=identity.technicalFactsComplete);
const percent=(n:number,d:number)=>d===0?null:Math.round(10000*n/d)/100;
const topUnresolvedGroups=[...allGroups.values()].map(({g,counts,technicalFactsComplete})=>({
  priorityRank:g.priorityRank,make:g.make,model:g.model,displacementCc:g.displacementCc,
  yearBand:`${g.yearBandFrom}–${g.yearBandTo}`,
  sampleCount:total(counts),sourceLinkedStage1:counts.sourceLinked,
  notSourceLinkedStage1:total(counts)-counts.sourceLinked,
  technicalFactsComplete
})).filter(group=>group.sampleCount>=8&&group.notSourceLinkedStage1>0)
  .sort((a,b)=>b.notSourceLinkedStage1-a.notSourceLinkedStage1||a.priorityRank-b.priorityRank)
  .slice(0,40);
const report={
  schemaVersion:1,
  scope:{
    evidenceBase:"Frozen purpose-selected 250 priority RDW groups, 3 × 4 vehicle observations each",
    frozenBaselineHead:freeze.baselineHead,
    frozenMethod:"Three beginning/middle/end slices before knowing outcome; nonrandom, nonrepresentative",
    denominator:freeze.sampleSize,groups:freeze.groups.length,
    selection:"Dutch active passenger/light commercial vehicles in the frozen selection",
    notFleetPrevalence:true,
    dataHandling:"Aggregate-only. No plate/VIN/customer/sample ID, query URL, or individual RDW row is output."
  },
  rdwIdentity:identity,
  stage1:{
    sourceLinkedIndicative:stage1.sourceLinked,
    genericIndicative:stage1.genericIndicative,
    canonicalEstimated:stage1.canonicalEstimated,
    otherNumericUnverified:stage1.otherNumeric,
    withoutNumeric:stage1.withheld,
    anyNumeric:freeze.sampleSize-stage1.withheld,
    sourceLinkedShareOfFrozenPercent:percent(stage1.sourceLinked,freeze.sampleSize),
    sourceLinkedWithinOrdinaryIce:sourceLinkedOrdinaryIce,
    sourceLinkedWithinFullTechnicalIdentity:sourceLinkedFullTechnical,
    sourceLinkedShareOfOrdinaryIcePercent:percent(sourceLinkedOrdinaryIce,identity.eligibleOrdinaryIce),
    disclaimer:"Source-linked is an application/reference published Stage 1, NOT a measured or guaranteed owner/ECU result. Generic and generated canonical numbers are NOT counted as sourced."
  },
  stage2:{customerNumeric:customerStage2Numeric,notSourcedOrWithheld:freeze.sampleSize-customerStage2Numeric},
  stage3:{customerNumeric:customerStage3Numeric},
  internalCoverageClasses:layers,
  topUnresolvedGroups,
  nextDecisionRule:"Prioritize unresolved groups from this fixed nonrandom cohort, then verify precise stock kW, engine generation, RDW type, cc, fuel, ECU/gearbox constraints and independent tuner sources before releasing any Stage 1 result."
};
const fmt=(n:number)=>n.toLocaleString("en-US");
const head=[
  "# RDW identity and source-backed Stage 1: frozen-sample coverage",
  "",
  "**Method:** frozen 250-group / 3,000-row purposive historical RDW cohort. Not random, not representative of the Dutch fleet, and not a universal RDW coverage estimate.",
  "",
  "## Three different customer outcomes",
  "",
  "| Measurement | Sample count | Denominator | Meaning |",
  "|---|---:|---:|---|",
  `| RDW make + model present | ${fmt(identity.rdwModelKnown)} | ${fmt(freeze.sampleSize)} | A recognizable RDW registration, not a matching engine tune |`,
  `| RDW original engine kW present | ${fmt(identity.registeredPowerKnown)} | ${fmt(freeze.sampleSize)} | Factory power exists in the registration; torque/ECU do not |`,
  `| Full technical fields incl. RDW body type | ${fmt(identity.technicalFactsComplete)} | ${fmt(freeze.sampleSize)} | Make/model/engine kW/cc/cylinders/year/type/single ordinary ICE fuel |`,
  `| Ordinary ICE, interpretable RDW base | ${fmt(identity.eligibleOrdinaryIce)} | ${fmt(freeze.sampleSize)} | Safe denominator for a petrol/diesel Stage 1 discovery funnel |`,
  `| **Stage 1 numeric with linked published sources** | **${fmt(stage1.sourceLinked)}** | **${fmt(freeze.sampleSize)}** | Indicative; always requires physical ECU/transmission verification |`,
  `| Stage 1 source-linked among ordinary ICE | ${fmt(sourceLinkedOrdinaryIce)} | ${fmt(identity.eligibleOrdinaryIce)} | Source links within the interpretable petrol/diesel subset only |`,
  `| Stage 1 generic numeric (not sourced) | ${fmt(stage1.genericIndicative)} | ${fmt(freeze.sampleSize)} | Not considered verified Stage 1 coverage |`,
  `| Stage 1 generated/canonical numeric | ${fmt(stage1.canonicalEstimated)} | ${fmt(freeze.sampleSize)} | Not considered verified Stage 1 coverage |`,
  `| Stage 1 other unverified numeric | ${fmt(stage1.otherNumeric)} | ${fmt(freeze.sampleSize)} | Not considered verified Stage 1 coverage |`,
  `| Stage 1 numerical output withheld | ${fmt(stage1.withheld)} | ${fmt(freeze.sampleSize)} | Do not invent an output; refer to workshop quote |`,
  `| Public numerical Stage 3 | ${fmt(customerStage3Numeric)} | ${fmt(freeze.sampleSize)} | Stage 3 output must remain withheld |`,
  "",
  `**Source-linked Stage 1: ${report.stage1.sourceLinkedShareOfFrozenPercent}% of this frozen, nonrandom sample; ${report.stage1.sourceLinkedShareOfOrdinaryIcePercent}% relative to the ordinary-ICE interpretable subset.** Neither number is a Dutch-fleet percentage.`,
  "",
  "## Priority groups with no complete source-linked Stage 1",
  "",
  "| Rank in frozen fleet priority | Make / model / engine displacement | Frozen year band | Sample rows | Without sourced Stage 1 | Technical fields complete |",
  "|---:|---|---|---:|---:|---:|",
  ...topUnresolvedGroups.slice(0,25).map(g=>`| ${g.priorityRank} | ${g.make} ${g.model}, ${g.displacementCc} cc | ${g.yearBand} | ${g.sampleCount} | ${g.notSourceLinkedStage1} | ${g.technicalFactsComplete} |`),
  "",
  "This queue **does not prove turbocharged compatibility**. Resolve factory kW, exact generation and drivetrain using sources before publishing results. Cars with naturally aspirated engines, EVs, LPG, hybrids or disputed gearbox/ECU must not inherit generated power figures.",
  "",
  "## Reproduce",
  "",
  "`pnpm qa:rdw-funnel` recalculates the whole bounded cohort against the production RDW normalizer and compares deterministic, sanitized JSON/Markdown results. `pnpm report:rdw-funnel` explicitly rewrites the two tracked aggregate reports after an approved code change.",
  ""
].join("\n");
const outputs:[[string,string],[string,string]]=[
  [JSON_REPORT,JSON.stringify(report,null,2)+"\n"],[MARKDOWN_REPORT,head]
];
const check=process.argv.includes("--check");
const write=process.argv.includes("--write");
if(check===write)throw new Error("Specify exactly one of --write or --check");
for(const [file,text] of outputs){
  const full=resolve(file);
  if(write){mkdirSync(resolve("docs"),{recursive:true});writeFileSync(full,text);}
  else assert.equal(readFileSync(full,"utf8").replace(/\r\n/g,"\n"),text,`Coverage report stale: run pnpm report:rdw-funnel for ${file}`);
}
console.log(JSON.stringify({result:"PASS",mode:write?"write":"check",rows:freeze.sampleSize,
  baseIdentity:identity.rdwModelKnown,registeredKw:identity.registeredPowerKnown,
  exactTechnicalIdentity:identity.technicalFactsComplete,
  ordinaryIce:identity.eligibleOrdinaryIce,stage1,stage3Numeric:customerStage3Numeric,
  topGroupPriorityRanks:topUnresolvedGroups.slice(0,12).map(g=>g.priorityRank)}));
