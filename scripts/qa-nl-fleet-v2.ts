import assert from "node:assert/strict";
import {readFileSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import type {RdwVehicleRow, RdwFuelRow} from "../src/lib/rdw.ts";

const argument=(name:string,fallback:string)=>{const index=process.argv.indexOf(name);return index<0?fallback:process.argv[index+1];};
const runtimeRoot=resolve(argument("--runtime-root","."));
const output=argument("--output","data/research/v2-rdw-validation.json");
const sample=JSON.parse(readFileSync("data/research/nl-rdw-live-sample.json","utf8")) as {rows:{sampleId:string;groupId:string;registrationVerified:boolean;retrievedAt:string;vehicle:RdwVehicleRow;fuels:RdwFuelRow[]}[];registrationVerification:unknown};
const memoryBefore=process.memoryUsage();
const {normalizeRdwVehicle}=await import(pathToFileURL(resolve(runtimeRoot,"src/lib/rdw.ts")).href) as typeof import("../src/lib/rdw.ts");
const {tuningDatasetFingerprint}=await import(pathToFileURL(resolve(runtimeRoot,"src/data/tuning-profiles/index.ts")).href) as typeof import("../src/data/tuning-profiles/index.ts");
const layers:Record<string,number>={A:0,B:0,C:0,D:0,E:0},pricing:Record<string,number>={};
const sizes:number[]=[],timings:number[]=[];
const rows=sample.rows.map(row=>{
  assert.ok(row.registrationVerified,row.sampleId+": current registration status required");
  const started=performance.now();
  const result=normalizeRdwVehicle(row.vehicle,row.fuels,"SAMPLE");
  timings.push(performance.now()-started);
  assert.equal(result.vehicle.model,row.vehicle.handelsbenaming?.trim(),"Keep actual RDW model");
  const powers=row.fuels.map(f=>Number(f.nettomaximumvermogen)).filter(n=>n>0);
  assert.equal(result.vehicle.engine.powerKw,powers.length===1?powers[0]:null,"Keep actual registered stock output; do not infer hybrid total");
  const estimate=result.tuningEstimate,profile=estimate.profile;
  const fuel=result.vehicle.fuel??"";
  if(/Elektriciteit|LPG|Waterstof/i.test(fuel))assert.ok(!profile,"Unsupported mixed/electric powertrain must not get ordinary ICE profile");
  const layer=estimate.coverageClass??"E";layers[layer]++;
  const category=result.tuningQuote.kind==="from"?result.tuningQuote.pricingCategory:"on-request";
  pricing[category]=(pricing[category]??0)+1;
  const stage=(name:string)=>{const value=profile?.stages.find(s=>s.name===name);return value?{powerHp:value.powerHp,torqueNm:value.torqueNm,powerRangeHp:value.powerRangeHp,torqueRangeNm:value.torqueRangeNm,provenance:value.provenance,customHardware:Boolean(value.customHardware)}:null;};
  const payload={...result,raw:undefined,normalizedKenteken:"SAMPLE"};
  sizes.push(Buffer.byteLength(JSON.stringify(payload)));
  return {sampleId:row.sampleId,groupId:row.groupId,retrievedAt:row.retrievedAt,registrationVerified:true,
    detectedModelCorrect:true,registeredStockRetained:true,
    identity:{make:result.vehicle.make,model:result.vehicle.model,fuel,registeredPowerKw:result.vehicle.engine.powerKw,stockPowerHp:result.vehicle.engine.powerHp,displacementCc:result.vehicle.engine.displacementCc,cylinders:result.vehicle.engine.cylinders,firstAdmissionYear:result.vehicle.registration.firstAdmissionYear,type:result.vehicle.type,variant:result.vehicle.variant,execution:result.vehicle.execution},
    layer,resolutionLevel:estimate.resolutionLevel,status:estimate.status,selectedProfile:profile?.id,selectedModel:profile?.model,stage1:stage("Stage 1"),stage2:stage("Stage 2"),stage3:stage("Stage 3+"),priceClass:category,quote:result.tuningQuote,reasons:estimate.reasonCodes};
});
assert.ok(rows.length>=150,"At least 150 fresh verified Dutch registrations");
const summarize=(values:number[])=>{const ordered=[...values].sort((a,b)=>a-b);return {min:ordered[0],median:ordered[Math.floor(ordered.length*.5)],p95:ordered[Math.min(ordered.length-1,Math.floor(ordered.length*.95))],max:ordered.at(-1)};};
const report={datasetFingerprint:tuningDatasetFingerprint,checkedAt:new Date().toISOString(),method:"Pure production normalizeRdwVehicle path over freshly retrieved and independently status-verified RDW rows. This excludes network latency. Purposive breadth sample; no population extrapolation. HTTP/browser checks are recorded separately. Only hashed registration IDs are persisted.",sampleSize:rows.length,makes:new Set(rows.map(r=>r.identity.make)).size,registrationVerification:sample.registrationVerification,modelErrors:0,stockOutputErrors:0,unsupportedOrdinaryProfileErrors:0,layers,pricingCategories:pricing,
  normalizationMs:summarize(timings),serializedApiPayloadBytes:summarize(sizes),memory:{beforeRuntimeImport:memoryBefore,afterSample:process.memoryUsage(),note:"Process RSS/heap includes the canonical catalog and runtime imports; not isolated source dataset memory."},rows};
writeFileSync(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({output,sample:rows.length,layers,pricing,normalizationMs:report.normalizationMs,apiBytes:report.serializedApiPayloadBytes,memory:report.memory.afterSample},null,2));
