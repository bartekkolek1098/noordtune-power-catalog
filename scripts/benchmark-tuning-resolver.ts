import {readFileSync,writeFileSync} from "node:fs";
import {sourcedTuningProfiles,tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

const inputs:EstimateMatchInput[]=sourcedTuningProfiles.map(p=>({make:p.brand,model:p.modelFamily+" "+p.engineMarketingName,fuel:p.fuel,powerHp:p.stockPowerHp,displacementCc:p.displacementCc,firstRegistrationYear:p.yearFrom+Math.min(1,(p.yearTo??2026)-p.yearFrom),type:p.generation,variant:p.engineFamily}));
const argument=(name:string,fallback:string)=>{const at=process.argv.indexOf(name);return at<0?fallback:process.argv[at+1];};
const live=JSON.parse(readFileSync(argument("--sample","data/research/v2-rdw-validation.json"),"utf8"));
const liveInputs:EstimateMatchInput[]=live.rows.map((row:{identity:{make:string;model:string;fuel:string;registeredPowerKw:number;displacementCc:number;firstAdmissionYear:number;type?:string;variant?:string;execution?:string}})=>({make:row.identity.make,model:row.identity.model,fuel:row.identity.fuel,registeredPower:{value:row.identity.registeredPowerKw,unit:"kW"},displacementCc:row.identity.displacementCc,firstRegistrationYear:row.identity.firstAdmissionYear,type:row.identity.type,variant:row.identity.variant,execution:row.identity.execution}));
const summary=(numbers:number[])=>{const sorted=[...numbers].sort((a,b)=>a-b);return {calls:sorted.length,median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],max:sorted.at(-1)};};
global.gc?.();const memoryBeforeIndex=process.memoryUsage();const started=performance.now();matchSourcedProfile(inputs[0],sourcedTuningProfiles);const coldIndexMs=performance.now()-started;global.gc?.();const memoryAfterIndex=process.memoryUsage();
const sourceLinear:number[]=[],sourceIndexed:number[]=[],resolver:number[]=[];
// Alternate modes to reduce order/thermal bias; dataset/facts are identical.
for(let repeat=0;repeat<3;repeat++)for(const input of [...inputs,...liveInputs]){
  for(const indexed of repeat%2?[true,false]:[false,true]){const start=performance.now();matchSourcedProfile(input,sourcedTuningProfiles,{indexed});(indexed?sourceIndexed:sourceLinear).push(performance.now()-start);}
}
for(const input of liveInputs)resolveRdwTuningEstimate(input);
for(let repeat=0;repeat<3;repeat++)for(const input of liveInputs){const start=performance.now();resolveRdwTuningEstimate(input);resolver.push(performance.now()-start);}
global.gc?.();
const report={datasetFingerprint:tuningDatasetFingerprint,node:process.version,platform:process.platform,checkedAt:new Date().toISOString(),profiles:sourcedTuningProfiles.length,method:"Same-process alternating indexed/exhaustive source matcher, three passes over all source-derived fixtures plus 222 actual normalized registrations. Warm full resolver over the live sample. Network, HTTP and browser costs excluded. Source index keeps all same-make siblings for identity guards.",coldSourceIndexMs:coldIndexMs,sourceExhaustiveMs:summary(sourceLinear),sourceIndexedMs:summary(sourceIndexed),fullResolverMs:summary(resolver),memory:{gcAvailable:Boolean(global.gc),beforeIndex:memoryBeforeIndex,afterIndex:memoryAfterIndex,heapIndexDeltaBytes:memoryAfterIndex.heapUsed-memoryBeforeIndex.heapUsed,afterBenchmark:process.memoryUsage()}};
report.method=report.method.replace("222 actual",`${live.rows.length} actual`);
writeFileSync(argument("--output","data/research/v2-performance.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report,null,2));
