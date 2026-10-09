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
 },
 {
  slug:"ford-transit-custom-22-tdci-100",modelSlug:"ford-transit-custom",title:"Ford Transit Custom 2.2 TDCi 100",
  intro:"Deze Ford Transit Custom I met originele 74 kW en 2198 cc is de oudere 2.2 TDCi, niet de latere EcoBlue. De marketingaanduiding 100 pk komt na omrekening van de RDW-registratie op ongeveer 101 metrische pk. De tunerwaarden zijn alleen voor de beoordeelde 2015–2016-uitvoering.",
  checks:"Identificeer RDW-type FCC, 2198 cc, 74 kW, 2015–2016 toelatingsfase, Puma/DRFF-motorcode, SID208 ECU, injectoren, DPF en de handbak. Publicaties voor Transit of EcoBlue zijn geen vervangende bron en geven geen veilige maximale koppellimiet voor een beladen bus.",
  appIds:["rdw-bulk-5-ford-custom-fcc-22tdci100-2015-16"]
 },
 {
  slug:"ford-transit-custom-22-tdci-125",modelSlug:"ford-transit-custom",title:"Ford Transit Custom 2.2 TDCi 125",
  intro:"De Ford Transit Custom I 2.2 TDCi met originele 92 kW is een afzonderlijke 125 pk-diesel uit de oudere Puma-generatie. Voor het gecontroleerde 2016 RDW-type FCC bestaan bronnen met Stage 1-vermogens, maar andere uitvoeringen en versnellingsbakken blijven buiten de scope.",
  checks:"Controleer RDW FCC, 2198 cc, 92 kW, originele fabriekssoftware, Puma/CYFF-motorcode, werkelijke SID208/SID211 ECU, DPF en koppeling. Het gedeelde motorblok met hogere fabrieksvarianten bewijst geen identieke ECU of transmissiegrens.",
  appIds:["rdw-bulk-5-ford-custom-fcc-22tdci125-2016"]
 },
 {
  slug:"ford-transit-custom-20-ecoblue-130",modelSlug:"ford-transit-custom",title:"Ford Transit Custom 2.0 EcoBlue 130",
  intro:"De Ford Transit Custom I facelift met 95,6 kW en 1995 cc EcoBlue is een andere motor dan de oudere 2.2 TDCi. Drie tunerpublicaties voor 2019–2022 melden uiteenlopende Stage 1-waarden, daarom toont dit 2020 RDW-cohort bewust een bereik en geen beloofd eindresultaat.",
  checks:"Bevestig RDW-type FCC 2020, 1995 cc, originele 95,6 kW, EcoBlue-motorcode, SID-ECU-firmware, echte mild-hybrid of niet-geëlektrificeerde uitvoering en transmissietype. SCR/DPF, onderhoud en belasting van de werkbus moeten eerst worden gecontroleerd.",
  appIds:["rdw-bulk-5-ford-custom-fcc-20ecoblue130-2020"]
 },
 {
  slug:"mercedes-sprinter-w906-21-cdi-143",modelSlug:"mercedes-sprinter",title:"Mercedes Sprinter W906 2.1 CDI 143",
  intro:"Een Mercedes-Benz Sprinter W906 met originele 105 kW en 2143 cc OM651-diesel vormt niet automatisch dezelfde afstelling als W907/W910 of de nieuwe OM654 1950 cc. De gecontroleerde W906-referentie is beperkt tot RDW-type 906BB35 en eerste toelating in 2018.",
  checks:"Controleer werkelijk W906-chassis, 906BB35, OM651 M651 DE22-motorcode, 2143 cc, 105 kW, Delphi CRD3 ECU, SCR/AdBlue en originele versnellingsbak. De twee externe Stage 1-bronnen verschillen circa 50 Nm; het hoogste getal is geen geschikte koppelgrens zonder individuele beoordeling.",
  appIds:["rdw-bulk-5-mercedes-sprinter-906bb35-21cdi143-2018"]
 },
 {
  slug:"peugeot-expert-20-bluehdi-120",modelSlug:"peugeot-expert",title:"Peugeot Expert III 2.0 BlueHDi 120",
  intro:"Deze Peugeot Expert III met originele 90 kW, 1997 cc en RDW-type V uit 2018–2019 is geen oudere Expert II of elektrische e-Expert. De marketingnaam BlueHDi 120 komt overeen met ongeveer 122 metrische pk uit RDW; drie bronnen tonen een Stage 1-referentie voor deze motorfamilie.",
  checks:"Verifieer originele 90 kW, RDW-type V, 1997 cc, echte DW10 AH01-motorcode, Delphi DCM6.2A/DCM7.1A ECU, emissiefase, handbak of EAT-automaat en SCR/DPF. Bronnen verschillen in fabrieks-Nm; 320/340 Nm is geen RDW-registratie en moet worden gecontroleerd.",
  appIds:["rdw-bulk-5-peugeot-expert-v-20bluehdi120-2018-19"]
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
if(nlVanEngines.length!==10||new Set(nlVanEngines.map(x=>x.slug)).size!==10)throw Error("Manual van engine publication count changed");
export const nlVanEngineBySlug=new Map(nlVanEngines.map(x=>[x.slug,x]));
export function nlVanEngineMetadata(e:NlVanEngine){
 const a=e.applications[0];
 return {title:e.title+" Stage 1",description:e.title+": originele RDW-gegevens van "+a.stockPowerHp+" pk, technische varianten, bronvermelde Stage 1 en ECU- en transmissievoorwaarden."};
}
