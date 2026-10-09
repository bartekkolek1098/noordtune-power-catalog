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
 },
 {
  "slug": "fiat-ducato-23-multijet-130-2013-15",
  "modelSlug": "fiat-ducato",
  "title": "Fiat Ducato 2.3 MultiJet 130 (2013–2015)",
  "intro": "De oudere Fiat Ducato III Mk2 met 2287 cc en originele 96 kW is in tunerpublicaties meestal bekend als 2.3 130 MultiJet. Deze 2013–2015-uitvoering hoort niet bij de latere Euro 6-softwarefase, zelfs als beide bij RDW circa 131 metrische pk aangeven. Gepubliceerde Stage 1-waarden zijn alleen indicatief.",
  "checks": "Controleer RDW-type 250, 2287 cc, originele 96 kW en toelatingsjaar 2013–2015; verifieer F1AE0481N-motorcode, exacte Marelli/Bosch ECU, koppeling, versnellingsbak, koeling, DPF en onderhoud. Niet automatisch toepassen op 2018–2019 Euro 6 Ducato of 2.2 MultiJet.",
  "appIds": [
    "rdw-bulk-6-fiat-ducato-250-23multijet130-2013-15"
  ]
},
 {
  "slug": "fiat-ducato-23-multijet-130-euro6-2018-19",
  "modelSlug": "fiat-ducato",
  "title": "Fiat Ducato 2.3 MultiJet 130 Euro 6 (2018–2019)",
  "intro": "De Fiat Ducato met 2287 cc en originele 96 kW in 2018–2019 hoort bij een latere Euro 6-dieselgeneratie dan de oudere 2013–2015 2.3 MultiJet 130. Tunerpublicaties voor deze latere fase laten een ander, conservatiever Stage 1-bereik zien; dezelfde fabrieks-kW maakt de ECU's niet uitwisselbaar.",
  "checks": "Controleer RDW-type 250, originele 96 kW, 2287 cc, datum eerste toelating 2018–2019, werkelijke F1AGL411D-motorcode, Marelli MJD9DF of Bosch EDC17C69 ECU en SCR/DPF. Ook koppeling, automaat/handbak en belasting bij camper- of bedrijfsgebruik moeten worden beoordeeld.",
  "appIds": [
    "rdw-bulk-6-fiat-ducato-250-23multijet130-euro6-2018-19"
  ]
},
 {
  "slug": "mercedes-vito-114-cdi-1950-2023",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 114 CDI 2.0D (2023)",
  "intro": "Bij deze Mercedes-Benz Vito 114 CDI bedraagt het originele RDW-vermogen 100 kW en de cilinderinhoud 1950 cc. Voor het beoordeelde type 639/4 met eerste toelating in 2023 bestaan meerdere bronpublicaties voor de 136 pk-motor. Exacte Euro 6-software en de werkelijke ECU blijven ondanks het bouwjaar te controleren.",
  "checks": "Vergelijk RDW-gegevens 639/4, 1950 cc, 100 kW, eerste toelating 2023, daadwerkelijke OM654/OM651-aanduiding en Bosch MD1CP001 ECU, transmissie en SCR/DPF. Hogere cijfers van andere Euro 6 D-temp- of ECU-publicaties horen niet automatisch bij deze bronselectie.",
  "appIds": [
    "rdw-bulk-6-mercedes-vito-6394-1950-114cdi136-2023"
  ]
},
 {
  "slug": "mercedes-vito-114-cdi-1950-euro6e-2024",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 114 CDI Euro 6e (2024)",
  "intro": "De Mercedes-Benz Vito 114 CDI met originele 100 kW, 1950 cc en eerste toelating in 2024 heeft een afzonderlijke Euro 6e-bronset. De drie bekeken publicaties komen overeen in het normale Stage 1-resultaat, maar RDW-type 639/4 alleen bewijst niet dat de gemonteerde ECU daadwerkelijk overeenkomt met die softwarefase.",
  "checks": "Bevestig Euro 6e-homologatie, ECU/firmware en type 639/4 met 100 kW en 1950 cc, jaargang 2024. Controleer Bosch MD1-variant, handbak of automaat, SCR/AdBlue, onderhoud en softwaretoegang voordat de gepubliceerde Stage 1-waarden op deze Vito worden toegepast.",
  "appIds": [
    "rdw-bulk-6-mercedes-vito-6394-1950-114cdi136-euro6e-2024"
  ]
},
 {
  "slug": "mercedes-sprinter-315-cdi-1950-150",
  "modelSlug": "mercedes-sprinter",
  "title": "Mercedes-Benz Sprinter 315 CDI 2.0 150",
  "intro": "De Sprinter met originele 110 kW en 1950 cc komt in de gecontroleerde RDW-steekproef onder type 906BB35 in 2020 en 2024 voor. De externe 315 CDI-bronnen noemen vergelijkbare Stage 1-uitkomsten, maar de RDW-typecode bevestigt niet zelfstandig een W907/W910-generatie of exact OM654-ECU-bestand.",
  "checks": "Controleer originele 110 kW, type 906BB35, 1950 cc, bouwjaar 2020 of 2024, werkelijk OM654-motorblok, Bosch MD1CP001/MRD1 software, handgeschakelde of automatische transmissie en SCR/AdBlue. Originele bronkoppelwaarden 330/340 Nm verschillen; dit is geen RDW Nm-meting of garantie.",
  "appIds": [
    "rdw-bulk-6-mercedes-sprinter-906bb35-1950-315cdi150-2020",
    "rdw-bulk-6-mercedes-sprinter-906bb35-1950-315cdi150-2024"
  ]
},
 {
  "slug": "peugeot-expert-20-bluehdi-180-2019-22",
  "modelSlug": "peugeot-expert",
  "title": "Peugeot Expert III 2.0 BlueHDi 180",
  "intro": "Deze Peugeot Expert III met 1997 cc en originele 130 kW is de 2.0 BlueHDi 180-marketingvariant. De 130 kW-registratie komt omgerekend op circa 177 metrische pk; de twee onafhankelijke aanbieders melden verschillende gewone Stage 1-uitkomsten, zodat de pagina bewust een voorwaardelijk bereik toont.",
  "checks": "Bevestig RDW-type V, 1997 cc, originele 130 kW en eerste toelating 2019–2022, DW10-motorfamilie, ECU en unlock-staat, EAT8 of handbak en SCR/DPF. Xtreme-tuning, Euro 6e-varianten uit 2024, Opel Vivaro, Toyota Proace en e-Expert vallen buiten deze getallen.",
  "appIds": [
    "rdw-bulk-6-peugeot-expert-v-20bluehdi180-2019-22"
  ]
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
if(nlVanEngines.length!==16||new Set(nlVanEngines.map(x=>x.slug)).size!==16)throw Error("Manual van engine publication count changed");
export const nlVanEngineBySlug=new Map(nlVanEngines.map(x=>[x.slug,x]));
export function nlVanEngineMetadata(e:NlVanEngine){
 const a=e.applications[0];
 return {title:e.title+" Stage 1",description:e.title+": originele RDW-gegevens van "+a.stockPowerHp+" pk, technische varianten, bronvermelde Stage 1 en ECU- en transmissievoorwaarden."};
}
