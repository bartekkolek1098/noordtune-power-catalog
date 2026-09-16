import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,writeFileSync} from "node:fs";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";

const read=(file:string)=>JSON.parse(readFileSync(file,"utf8"));
const inputPath="data/research/nl-top-groups-output-sample.json";
const sample=read(inputPath),queue=read("data/research/nl-output-variant-priority.json");
const priority=read("data/research/nl-technical-priority-v3.json");
assert.equal(sample.rows.length,3000);assert.equal(queue.groups.length,250);
const layers=new Map<string,string>();
for(const row of sample.rows){
  const result=normalizeRdwVehicle(row.vehicle,row.fuels,"SAMPLE");
  layers.set(row.sampleId,result.tuningEstimate.coverageClass??"E");
}
const sourced=(layer:string)=>layer==="A"||layer==="B";
let before=0,after=0,mixed=0,changed=0;
const changedScenarios:{groupId:string;priorityRank:number;fuel:string;registeredPowerKw:number|null;year:number;before:string;after:string;sampleIds:string[]}[]=[];
const top50={fully:0,partially:0,notSourceCovered:0};
for(const group of queue.groups){
  let hasSourced=false;
  for(const variant of group.observedOutputVariants){
    const values=variant.sampleIds.map((id:string)=>layers.get(id));
    assert.equal(values.length,variant.observedCount);assert.ok(values.every((value:string)=>value),"All frozen sample IDs replayed");
    const post=values.every(sourced)?"sourced":values.some(sourced)?"mixed":values[0];
    if(post==="mixed")mixed++;
    const was=sourced(variant.layer),now=post==="sourced";
    if(was)before++;if(now)after++;if(now)hasSourced=true;
    if(was!==now){changed++;changedScenarios.push({groupId:group.groupId,priorityRank:group.priorityRank,fuel:variant.fuel,registeredPowerKw:variant.registeredPowerKw,year:variant.firstAdmissionYear,before:variant.layer,after:post,sampleIds:variant.sampleIds});}
  }
  if(group.priorityRank<=50){
    const frozen=priority.groups.find((item:{groupId:string})=>item.groupId===group.groupId);
    assert.ok(frozen);
    const published=frozen.variants.some((variant:{layer:string})=>sourced(variant.layer));
    if(sourced(frozen.layer))top50.fully++;
    else if(hasSourced||published)top50.partially++;
    else top50.notSourceCovered++;
  }
}
assert.equal(queue.groups.reduce((sum:number,group:{observedOutputVariants:unknown[]})=>sum+group.observedOutputVariants.length,0),1862);
assert.equal(top50.fully+top50.partially+top50.notSourceCovered,50);
const report={datasetFingerprint:tuningDatasetFingerprint,sampleSha256:createHash("sha256").update(readFileSync(inputPath)).digest("hex"),
  groups:250,sampledRegistrations:3000,distinctObservedScenarios:1862,beforeSourcedScenarios:before,afterSourcedScenarios:after,
  mixedScenarios:mixed,changedScenarioCount:changed,changedScenarios,
  top50:{...top50,method:"Full means frozen strict whole-group layer A/B. Partial means at least one frozen observed or published scenario is sourced while the whole group remains C/D/E. Counts use unchanged Top-50 membership and do not assign fleet vehicles to output variants."},
  method:"Exact original 3,000 normalized RDW rows and 1,862 observed scenario memberships replayed offline. Before layers come from frozen V3 queue. After layers use the production normalization/resolver. No live RDW requests or new scenarios."};
writeFileSync("data/research/v3-1-observed-coverage.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({before,after,mixed,changed,top50,changedScenarios},null,2));
