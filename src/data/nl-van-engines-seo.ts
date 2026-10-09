/**
 * Five new manually scoped NL business van engines.
 * Every Stage 1 number is inherited from an owner-reviewed exact RDW application.
 * No inferred numbers from shared chassis, ECU or engine marketing names.
 */
import {nlVanModelBySlug,validateApprovedVanApplication,type ApprovedVanApplication} from "./nl-vans-seo.ts";
import {verifiedRdwApplications} from "./verified-rdw-applications.ts";

type ExtraVanEngineSpec={
 slug:string;modelSlug:string;title:string;intro:string;checks:string;appIds:readonly string[];
};
export type NlVanEngine=ExtraVanEngineSpec&{
 applications:readonly ApprovedVanApplication[];
 sources:readonly ApprovedVanApplication["sources"][number][];
};
const specs:readonly ExtraVanEngineSpec[]=[
 {
  slug:"ford-transit-20-ecoblue-130",modelSlug:"ford-transit",title:"Ford Transit 2.0 EcoBlue 130",
  intro:"De grote Ford Transit met 2.0 EcoBlue en ongeveer 130 pk is als meerdere RDW-varianten geleverd. De FCD- en FED-cohorten hebben verschillende originele kW en eerste toelatingsjaren, dus een bronwaarde geldt alleen bij de juiste generatie en bevestigde ECU.",
  checks:"Controleer motorgeneratie, 1995 cc, FCD of FED, ECU-firmware, natte distributieriem waar van toepassing, DPF/SCR en de originele handgeschakelde of automatische transmissie.",
  appIds:["rdw-bulk-four-ford-transit-fcd-20ecoblue130-2018-19","rdw-bulk-four-ford-transit-fed-20ecoblue130-2022"]
 },
 {
  slug:"volkswagen-transporter-t5-20-tdi-140",modelSlug:"volkswagen-transporter",title:"Volkswagen Transporter T5 2.0 TDI 140",
  intro:"Deze bronvermelde Transporter T5 facelift heeft een 2.0 TDI met originele 103 kW. De gecontroleerde RDW-toelating betreft 2012–2014; de daaropvolgende T6 en latere T7 hebben andere technische varianten.",
  checks:"Verifieer RDW-type 7J0, 1968 cc, originele 103 kW, EGR/DPF, ECU-software, motorkode en handgeschakelde of DSG-transmissie. Een T5-Stage 1-bron is geen T6-goedkeuring.",
  appIds:["rdw-bulk-vw-transporter-7j0-t5-20-tdi-140"]
 },
 {
  slug:"volkswagen-transporter-t6-20-tdi-204",modelSlug:"volkswagen-transporter",title:"Volkswagen Transporter T6 2.0 TDI 204",
  intro:"Deze Transporter T6 is een 2.0 BiTDI met originele 150 kW en een andere turbo-/transmissiecontext dan de T5 140 pk. De getoonde externe cijfers zijn alleen gecontroleerd voor de 2017–2019 RDW-uitvoering.",
  checks:"Vergelijk RDW-type 7J0, 1968 cc, originele 150 kW, de dubbele turbo, ECU, DPF/SCR en de DQ500 of handgeschakelde versnellingsbak voordat meer koppel wordt overwogen.",
  appIds:["rdw-bulk-four-vw-transporter-7j0-t6-20tdi204-2017-19"]
 },
 {
  slug:"peugeot-partner-15-bluehdi-100",modelSlug:"peugeot-partner",title:"Peugeot Partner 1.5 BlueHDi 100",
  intro:"De onderzochte Peugeot Partner gebruikt een 1.5 BlueHDi met 1499 cc en originele 75 kW. De eerste toelating valt in 2022–2024; cijfers voor oudere 1.6 BlueHDi-motoren of een 130 pk Partner vallen buiten deze bronvergelijking.",
  checks:"Controleer RDW-type E, originele 75 kW, 1499 cc, werkelijke ECU-software, EAT-/handbak, DPF, SCR/AdBlue en onderhoud voordat een individuele Stage 1-offerte volgt.",
  appIds:["rdw-bulk-peugeot-partner-e-15bluehdi100-2022-24"]
 },
 {
  slug:"renault-kangoo-15-dci-75",modelSlug:"renault-kangoo",title:"Renault Kangoo II 1.5 dCi 75",
  intro:"Voor deze oudere Renault Kangoo II staat de originele 55 kW-uitvoering centraal. De gecontroleerde technische toepassing is een K9K-gerelateerde 1.5 dCi met 1461 cc en RDW-type W uit 2015–2019, niet een nieuwe Blue dCi of elektrische Kangoo.",
  checks:"Controleer originele 55 kW, 1461 cc, K9K-motorcode, ECU, handgeschakelde versnellingsbak en DPF-uitvoering. De bronwaarden zijn slechts indicatief totdat de werkelijke auto beoordeeld is.",
  appIds:["rdw-bulk2-renault-kangoo-w-15dci75"]
 }
];
const ref=new Map(verifiedRdwApplications.map(a=>[a.id,a]));
export const nlVanEngines:readonly NlVanEngine[]=specs.map(spec=>{
 const m=nlVanModelBySlug.get(spec.modelSlug);
 if(!m||spec.intro.length<125||spec.checks.length<125)throw Error("Van engine article needs unique technical review "+spec.slug);
 const apps=spec.appIds.map(id=>{
  const a=ref.get(id);
  if(!a||!m.verifiedIds.includes(id))throw Error("Van engine has no exact reviewed application "+id);
  validateApprovedVanApplication(a,m.make);
  return a;
 });
 const sources=[...new Map(apps.flatMap(a=>a.sources).map(s=>[s.url,s] as const)).values()];
 if(sources.length<2)throw Error("Van engine needs independent source publications "+spec.slug);
 return {...spec,applications:apps,sources};
});
if(nlVanEngines.length!==5||new Set(nlVanEngines.map(x=>x.slug)).size!==5)throw Error("Manual van engine publication count changed");
export const nlVanEngineBySlug=new Map(nlVanEngines.map(x=>[x.slug,x]));
export function nlVanEngineMetadata(e:NlVanEngine){
 const a=e.applications[0];
 return {title:e.title+" Stage 1",description:e.title+": originele RDW-gegevens van "+a.stockPowerHp+" pk, technische varianten, bronvermelde Stage 1 en ECU- en transmissievoorwaarden."};
}
