import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {openLookupContact} from "../src/lib/lookup-contact.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";

const route=readFileSync("src/app/api/rdw-lookup/route.ts","utf8");
const get=route.slice(route.indexOf("export async function GET"),route.indexOf("export async function POST"));
assert.ok(get.includes('405, {Allow: "POST"}'));
assert.ok(!/request|lookupRdwVehicle|handleLookup|searchParams/.test(get));
// Execute the actual GET function body with tripwires for lookup/query access.
const executeGet = new Function("errorResponse", "handleLookup", "lookupRdwVehicle",
  get.replace("export async function GET", "return async function GET"));
let lookups=0;
const tripwire=()=>{lookups++;throw new Error("GET invoked lookup")};
const getResult=await executeGet((code:string,message:string,status:number,headers:object)=>({code,message,status,headers}),tripwire,tripwire)
  (new Proxy({}, {get(){throw new Error("GET read request/query")}}));
assert.equal(getResult.status,405);assert.equal(getResult.headers.Allow,"POST");assert.equal(lookups,0);
assert.ok(route.includes('"Cache-Control": "no-store"'));
const ui=readFileSync("src/components/plate-lookup.tsx","utf8");
assert.ok(ui.includes('method: "POST"'));
assert.ok(!/whatsappHref|lookupQuoteMessage|localStorage|sessionStorage|document.cookie|searchParams|analytics/.test(ui));
assert.equal((ui.match(/onClick=\{onLookupContact\}/g)||[]).length,2);
for(const locale of ["nl","en","pl"] as const) {
  let calls=0;const urls:string[]=[];
  const input={plate:"QA1234",locale,options:["Synthetic option"],vehicle:"Synthetic car",stage:"Stage 2",firstAdmission:"2022-01-01",indicativeOutput:{powerHp:180,torqueNm:300},quote:resolveStageQuote({id:"vw-golf-20-tsi-ea888"},{name:"Stage 2"})};
  assert.equal(calls,0);
  openLookupContact(input,(url,target,features)=>{calls++;urls.push(url);assert.equal(target,"_blank");assert.equal(features,"noopener,noreferrer")});
  assert.equal(calls,1);const text=new URL(urls[0]).searchParams.get("text")!;
  for(const value of ["QA1234","Stage 2","180","300","2022","Synthetic option"])assert.ok(text.includes(value));
}
console.log("POST-only handler structure and explicit-click contact helper PASS; opener stubbed, no external navigation/message.");
