/* eslint-disable @typescript-eslint/no-require-imports */
// Unified browser gate for source-only RDW releases.
// The quick gate preserves one true NL/EN/PL UI journey per current engine
// and diverse boundary regressions from the previous batch. Full gate remains
// available, and is REQUIRED when UI, matching, security or fallback changes.
const assert=require("node:assert/strict");
const path=require("node:path");
const {spawnSync}=require("node:child_process");
const {planBrowserQa}=require("./rdw-browser-qa-plan.cjs");
const {reviewedBulkRdwApplications}=require("../src/data/reviewed-rdw-bulk-batch.ts");
const {reviewedRdwBulkBatch2}=require("../src/data/reviewed-rdw-bulk-batch-2.ts");
const {reviewedRdwBulkBatch3}=require("../src/data/reviewed-rdw-bulk-batch-3.ts");

const flag=process.argv[2]??"--smoke";
assert.ok(["--smoke","--full"].includes(flag),
  "Use --smoke for source-only release, --full for UI/matcher/security changes");
assert.ok(!process.env.RDW_QA_ONLY,
  "Combined browser gate refuses RDW_QA_ONLY because it may accidentally skip reviewed engines");
const full=flag==="--full";
const target=process.env.RDW_QA_URL||"http://127.0.0.1:3157";
const rootOutput=process.env.RDW_QA_OUTPUT||
  "C:/Users/barto/Desktop/noordtune-rdw-risk-qa";
const targets=[
  {script:"qa-rdw-bulk-3-browser.cjs",label:"new15",apps:reviewedRdwBulkBatch3,mode:full?"full":"smoke"},
  {script:"qa-rdw-bulk-2-browser.cjs",label:"previous20",apps:reviewedRdwBulkBatch2,mode:full?"full":"regression"},
  {script:"qa-rdw-bulk-browser.cjs",label:"previous15",apps:reviewedBulkRdwApplications,mode:full?"full":"regression"}
];
let count=0;
for(const config of targets){
 const plan=planBrowserQa(config.apps,{mode:config.mode});
 console.log("RDW_QA_GATE "+(full?"FULL":"FAST")+
  " "+config.label+" mode="+config.mode+" browser_journeys="+plan.expectedJourneys+
  " app_identities="+plan.selectedApps.length+" / "+config.apps.length);
 const result=spawnSync(process.execPath,["--no-warnings",path.join(__dirname,config.script)],{
  env:{...process.env,
    RDW_QA_URL:target,
    RDW_QA_ONLY:"",
    RDW_QA_MODE:config.mode,
    RDW_QA_OUTPUT:path.join(rootOutput,config.label)
  },
  cwd:path.resolve(__dirname,".."),
  stdio:"inherit",
  windowsHide:true
 });
 if(result.error)throw result.error;
 if(result.status!==0)throw Error("FAIL: "+config.label+" "+config.mode+
  " browser gate stopped at status "+result.status);
 count+=plan.expectedJourneys;
}
console.log("RDW_QA_GATE_"+(full?"FULL":"FAST")+"_PASS: "+count+
 " browser journeys completed against "+target+
 ". Source-only quick mode does not replace deterministic per-engine, negative-scope, source and 3000-row coverage checks.");
