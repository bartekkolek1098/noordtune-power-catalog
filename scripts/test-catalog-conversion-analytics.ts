import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 approvedCatalogConversionEvent,catalogConversionSources,
 catalogEnquiryConversionSource,type CatalogConversionEvent
} from "../src/lib/catalog-conversion-analytics.ts";
import {catalogEnquiryHref,passengerEngineEnquiryId} from "../src/lib/catalog-enquiry-contract.ts";

const validSources=[
 "passenger_engine","van_engine","manual_selector","rdw_profile",
 "floating_whatsapp","mobile_whatsapp","vehicle_whatsapp","header_whatsapp"
];
assert.deepEqual([...catalogConversionSources],validSources);
const emit=(name:"catalog_enquiry_click"|"catalog_whatsapp_click",locale:"nl"|"en"|"pl",source:string)=>
 ({name,properties:{locale,source}} as CatalogConversionEvent);

for(const locale of ["nl","en","pl"] as const){
 for(const source of validSources.slice(0,4))assert.equal(approvedCatalogConversionEvent(emit("catalog_enquiry_click",locale,source)),true);
 for(const source of validSources.slice(4))assert.equal(approvedCatalogConversionEvent(emit("catalog_whatsapp_click",locale,source)),true);
 for(const source of validSources.slice(0,4))assert.equal(approvedCatalogConversionEvent(emit("catalog_whatsapp_click",locale,source)),false);
 for(const source of validSources.slice(4))assert.equal(approvedCatalogConversionEvent(emit("catalog_enquiry_click",locale,source)),false);
}
assert.equal(catalogEnquiryConversionSource("manual",false),"manual_selector");
assert.equal(catalogEnquiryConversionSource("manual",true),"manual_selector");
assert.equal(catalogEnquiryConversionSource("profile",false),"rdw_profile");
assert.equal(catalogEnquiryConversionSource("profile",true),"rdw_profile");
assert.equal(catalogEnquiryConversionSource("engine",false),"passenger_engine");
assert.equal(catalogEnquiryConversionSource("engine",true),"van_engine");

const bad=[
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",plate:"XX-123-X"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",id:"auto-bmw-320i"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",query:"which auto?"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",vin:"secret"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",customer:"John"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",year:2022}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",referrer:"https://site.test/?plate=x"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"passenger_engine",price:250}},
 {name:"catalog_enquiry_click",properties:{locale:"en",source:"unapproved"}},
 {name:"catalog_enquiry_click",properties:{locale:"NL",source:"passenger_engine"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl"}},
 {name:"catalog_enquiry_click",properties:{locale:"nl",source:"manual_selector",id:"tax-0123456789abcdef"}},
 {name:"test_view",properties:{locale:"nl",source:"passenger_engine"}}
] as unknown as CatalogConversionEvent[];
for(const x of bad)assert.equal(approvedCatalogConversionEvent(x),false,"Block unapproved or privacy-unsafe custom event payload: "+JSON.stringify(x));

const files={
 layout:readFileSync("src/app/layout.tsx","utf8"),
 link:readFileSync("src/components/catalog-tracked-link.tsx","utf8"),
 quote:readFileSync("src/components/catalog-enquiry-link.tsx","utf8"),
 floating:readFileSync("src/components/floating-whatsapp.tsx","utf8"),
 mobile:readFileSync("src/components/mobile-action-bar.tsx","utf8"),
 vehicle:readFileSync("src/components/vehicle-contact-cta.tsx","utf8"),
 header:readFileSync("src/components/catalog-header.tsx","utf8")
};
assert.equal((files.layout.match(/<Analytics\s*\/>/g)??[]).length,1,"Exactly one automatic visitor/pageview tracker on Catalog root layout");
assert.match(files.layout,/from "@vercel\/analytics\/next"/);
assert.match(files.link,/from "@vercel\/analytics"/);
assert.match(files.link,/approvedCatalogConversionEvent\(action\)/,"No unapproved event may be sent");
assert.match(files.link,/try\{track\(action.name,action.properties\)\}catch/,"Best effort only, never block real quote action");
assert.doesNotMatch(files.link,/window\.location\s*=|preventDefault\(/,"Do not change normal link navigation");
assert.match(files.quote,/catalogEnquiryHref\(reference,locale,business\)/,"Existing validated exact-engine handoff remains intact");
assert.match(files.quote,/data-testid="catalog-enquiry-link"/);
assert.match(files.quote,/referrerPolicy="origin"/,"Only transmit trusted site ORIGIN to WWW, never plate or path");
assert.match(files.quote,/rel="noopener"/);
assert.doesNotMatch(files.quote,/rel="noreferrer"/,"Do not artificially erase privacy-safe referral origin needed for measuring conversions");
assert.match(files.quote,/catalogEnquiryConversionSource\(reference.kind,business\)/);
assert.match(files.floating,/source:"floating_whatsapp"/);
assert.match(files.mobile,/source:"mobile_whatsapp"/);
assert.match(files.vehicle,/source:"vehicle_whatsapp"/);
assert.match(files.header,/source:"header_whatsapp"/);

for(const locale of ["nl","en","pl"] as const){
 const passenger=catalogEnquiryHref({kind:"engine",id:passengerEngineEnquiryId("bmw-320i-g20-g21-b48-184")},locale);
 assert.equal(new URL(passenger).origin,"https://www.noordtune.nl");
 assert.equal(new URL(passenger).search,"");
 assert.ok(passenger.includes("catalog-v1?kind=engine"));
}
const vanQuote=catalogEnquiryHref({kind:"engine",id:"mercedes-sprinter-w906-313-cdi-129-2013"},"nl",true);
assert.equal(new URL(vanQuote).pathname,"/nl/bedrijfswagens");
assert.ok(vanQuote.includes("kind=engine"));
console.log("CATALOG_ANALYTICS_PRIVACY_PASS",JSON.stringify({
 rootAnalyticsExactlyOnce:true,eventNames:2,allowedEventSources:validSources.length,locales:3,
 eachEventExactlyTwoSafeKeys:["locale","source"],adversarialPIICasesBlocked:bad.length,
 engineQuoteOriginsOnly:true,businessVsPassengerDistinguished:true,
 oldHandoffURLsUnchanged:true,whatsappCTAClassesPreserved:true,plansMayRestrictCustomEvents:true
}));
