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
},
  {
  "slug": "mercedes-vito-116-cdi-1950-2023",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 116 CDI 2.0 (2023)",
  "intro": "De Mercedes-Benz Vito 116 CDI met originele 120 kW en 1950 cc is een andere fabrieksafstelling dan de 114 CDI van 100 kW of 119 CDI van 140 kW. Voor 2023 hebben we twee bronpublicaties met dezelfde normale Stage 1-indicatie voor de Euro 6 D-full-fase gevonden. RDW bevestigt echter niet zelfstandig de geïnstalleerde ECU of de emissiehomologatie.",
  "checks": "Controleer VITO type 639/4, originele RDW 120 kW, 1950 cc en toelating 2023. Bevestig werkelijke OM654-code, Euro 6 D-full-fase, Bosch ECU en unlock, automaat of handbak, DPF/SCR en de belasting van een zakelijke werkbus; de BR/ECU-Soft-resultaten zijn geen transmissiegoedkeuring.",
  "appIds": [
    "rdw-bulk-7-mercedes-vito-6394-20-116cdi163-2023"
  ]
},
  {
  "slug": "mercedes-vito-116-cdi-1950-euro6e-2024",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 116 CDI Euro 6e (2024)",
  "intro": "De Vito 116 CDI van 2024 met 1950 cc en 120 kW valt binnen een nieuwere Euro 6e-brongroep dan veel 2020–2023-uitvoeringen. Twee onafhankelijke aanbieders noemen hetzelfde normale Stage 1-resultaat; dat blijft uitsluitend een referentie totdat de werkelijke Mercedes-software en emissievariant zijn gecontroleerd.",
  "checks": "Verifieer RDW-type 639/4, diesel 1950 cc, oorspronkelijke 120 kW, eerste toelating in 2024, werkelijk bevestigde Euro 6e, ECU-firmware, Bosch motormanagement, transmissietype en SCR/AdBlue. Het oudere Vito 116 CDI Euro 6 D-temp-resultaat mag niet worden gekopieerd.",
  "appIds": [
    "rdw-bulk-7-mercedes-vito-6394-20-116cdi163-euro6e-2024"
  ]
},
  {
  "slug": "mercedes-vito-119-cdi-1950-2020",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 119 CDI 2.0 (2020)",
  "intro": "De Mercedes-Benz Vito 119 CDI met originele 140 kW en 1950 cc in de onderzochte 2020-registratie behoort niet automatisch tot dezelfde softwarefase als de Euro 6e-uitvoering van 2024. Twee onafhankelijke leveranciers publiceren voor de oudere W447 Euro 6 D-temp-groep zeer hoge, onderling verschillende cijfers; we tonen de volledige bandbreedte, niet één aanbevolen eindresultaat.",
  "checks": "Bevestig exact RDW-type 639/2, eerste toelating 2020, diesel 1950 cc en originele 140 kW, daarna de echte OM654-motor, ECU-firmware en Euro 6 D-temp-variant. Vooral de opgegeven 550–570 Nm mag niet als veilige automaatgrens voor een zwaar beladen bus worden geïnterpreteerd.",
  "appIds": [
    "rdw-bulk-7-mercedes-vito-6392-20-119cdi190-2020"
  ]
},
  {
  "slug": "mercedes-vito-119-cdi-1950-euro6e-2024",
  "modelSlug": "mercedes-vito",
  "title": "Mercedes-Benz Vito 119 CDI Euro 6e (2024)",
  "intro": "De Vito 119 CDI met 140 kW en 1950 cc is in 2024 als Euro 6e-referentie bij afzonderlijke tuners beschreven. De gewone Stage 1-indicatie van deze bronfase verschilt van sommige oudere D-temp-cijfers. Het RDW-type en jaartal zijn slechts een eerste filter en bewijzen nooit de daadwerkelijke ECU of transmissie.",
  "checks": "Verifieer VITO RDW-type 639/4, origineel 140 kW, diesel 1950 cc, eerste toelating 2024 en exact Euro 6e-motormanagement. Controleer OM654, ECU-unlock, automaatkoppel, koeling, roetfilter en SCR; geen overname van hogere 2020-publicaties zonder diagnose.",
  "appIds": [
    "rdw-bulk-7-mercedes-vito-6394-20-119cdi190-euro6e-2024"
  ]
},
  {
  "slug": "mercedes-sprinter-317-cdi-1950-170-2023-24",
  "modelSlug": "mercedes-sprinter",
  "title": "Mercedes-Benz Sprinter 317 CDI 2.0 170",
  "intro": "De Sprinter 317 CDI met originele 125 kW en 1950 cc is een andere afstelling dan de eerder beoordeelde 315 CDI 110 kW. Voor de onderzochte 2023–2024 Euro 6 D-full-kandidaat noemen twee specifiekere tunerpublicaties een bescheiden Stage 1-indicatie; een algemenere pagina met hogere cijfers is bewust niet gebruikt.",
  "checks": "Controleer RDW SPRINTER type 906BB35, 1950 cc, originele 125 kW diesel, 2023–2024, werkelijk OM654-blok, ECU-software en Euro 6 D-full. De RDW-typecode duidt niet zelfstandig een W907/W910-chassis aan; kijk ook naar automaat, laadgewicht, DPF en SCR/AdBlue.",
  "appIds": [
    "rdw-bulk-7-mercedes-sprinter-906bb35-20-317cdi170-2023-24"
  ]
},
  {
  "slug": "peugeot-expert-20-bluehdi-145-2022-24",
  "modelSlug": "peugeot-expert",
  "title": "Peugeot Expert III 2.0 BlueHDi 145",
  "intro": "De Peugeot Expert III 2.0 BlueHDi 145 in de gecontroleerde RDW-configuratie heeft originele 106 kW en 1997 cc. Dat rekent om naar ongeveer 144 metrische pk, terwijl aanbieders de handelsnaam 145 pk gebruiken. De afzonderlijke 2022- en 2024-uitvoeringen delen een bronbereik, maar hun geïnstalleerde Euro 6-ECU mag niet als identiek worden beschouwd.",
  "checks": "Controleer Peugeot Expert RDW-type V, diesel 1997 cc, originele 106 kW, toelatingsjaar 2022 of 2024, daadwerkelijke DW10/Delphi DCM7.1A ECU en Euro 6.3 tegenover facelift-emissiefase. De bronnen verschillen in gepubliceerd origineel koppel (370 of 379 Nm), dat RDW zelf niet rapporteert.",
  "appIds": [
    "rdw-bulk-7-peugeot-expert-v-20bluehdi145-2022",
    "rdw-bulk-7-peugeot-expert-v-20bluehdi145-2024"
  ]
},
  {
  "slug": "fiat-ducato-23-multijet-120-euro6-2020-21",
  "modelSlug": "fiat-ducato",
  "title": "Fiat Ducato 2.3 MultiJet 120 Euro 6 (2020–2021)",
  "intro": "De Fiat Ducato III met 2.3 MultiJet 120 heeft in de bekeken RDW-variant originele 88 kW en 2287 cc. Twee onafhankelijke leveranciers publiceren voor de Euro 6-motor hoge maar licht uiteenlopende Stage 1-cijfers. Ze horen nadrukkelijk niet bij de 96 kW 130 pk-versies uit eerdere batches.",
  "checks": "Bevestig FIAT DUCATO type 250, diesel 2287 cc, originele 88 kW en eerste toelating in 2020–2021. De F1AGL411-motorcode en werkelijke Marelli/Bosch ECU, versnellingsbak, koeling, SCR/DPF en eventuele zware camperopbouw moeten eerst worden gecontroleerd; 460+ Nm is geen goedgekeurde bedrijfslimiet.",
  "appIds": [
    "rdw-bulk-7-fiat-ducato-250-23multijet120-2020-21"
  ]
},
{
  slug:"volkswagen-crafter-20-tdi-140-2017-20",
  modelSlug:"volkswagen-crafter",
  title:"Volkswagen Crafter 2.0 TDI 140 (2017–2020)",
  intro:"De Volkswagen Crafter met 103 kW en 1968 cc diesel is voor toelatingsjaren 2017–2020 een afzonderlijke 140 pk-uitvoering. Twee onafhankelijk gepubliceerde Stage 1-bronnen komen overeen; nieuwere Euro 6d-Crafters en de 130 kW-versie vallen buiten deze selectie.",
  checks:"Controleer RDW-type SYN1E, 1968 cc, 103 kW en eerste toelating binnen 2017–2020. Verifieer motorcode, werkelijke ECU, transmissie, aanhangergewicht, DPF en SCR/AdBlue voordat een belastbare werkbus wordt aangepast; de leverancierindicatie geeft geen gegarandeerde koppellimiet.",
  appIds:["rdw-bulk-8-volkswagen-crafter-syn1e-20tdi140-2017-20"],
},
{
  slug:"volkswagen-transporter-t61-20-tdi-150-2020-21",
  modelSlug:"volkswagen-transporter",
  title:"Volkswagen Transporter T6.1 2.0 TDI 150 (2020–2021)",
  intro:"De Transporter T6.1 met originele 110 kW en 1968 cc is niet dezelfde uitvoering als de oudere T5 of T6. ATM en VAGtechniek publiceren voor de 150 pk-variant verschillende normale Stage 1-resultaten. Daarom is alleen een bereik onder voorbehoud zichtbaar.",
  checks:"Controleer RDW-type 7J0, diesel 1968 cc, originele 110 kW en eerste toelating in 2020 of 2021. Bevestig T6.1-facelift, ECU Delphi DCM6.2, softwarefase, eventuele DQ500 DSG versus handbak, DPF/SCR en koppeling. Stage 1+ blijft buiten deze vergelijking.",
  appIds:["rdw-bulk-8-volkswagen-transporter-7j0-t61-20tdi150-2020-21"],
},
{
  slug:"renault-master-23-dci-145-2019-22",
  modelSlug:"renault-master",
  title:"Renault Master 2.3 dCi 145 (2019 / 2022)",
  intro:"Voor de Renault Master met originele 107 kW en 2299 cc tonen we twee afzonderlijke RDW-types: MB uit 2019 en VAL uit 2022. De publicaties voor de Master III-facelift verschillen aanzienlijk in Stage 1-vermogen en koppel en zijn geen bevestiging dat de ECU's identiek zijn.",
  checks:"Controleer originele 107 kW, 2299 cc, type MB 2019 of VAL 2022, werkelijke M9T-motorvariant en Continental SID310/SID321 ECU. Bij een bestelwagen voor transport of bouw moeten koppeling, automaat, temperatuur, DPF en SCR/AdBlue vóór een offerte gecontroleerd worden.",
  appIds:["rdw-bulk-8-renault-master-mb-23dci145-2019","rdw-bulk-8-renault-master-val-23dci145-2022"],
},
{
  slug:"fiat-doblo-16-multijet-105-2015-20",
  modelSlug:"fiat-doblo",
  title:"Fiat Doblò 1.6 MultiJet 105 (2015–2020)",
  intro:"De compacte Fiat Doblò 1.6 MultiJet met 1598 cc en originele 77 kW heeft binnen RDW-type 263 een apart gecontroleerd Stage 1-bronprofiel voor 2015–2020. De nieuwere MultiJet 120, de 90 pk en andere Opel- of Peugeot-bestelwagens mogen deze cijfers niet overnemen.",
  checks:"Vergelijk RDW FIAT DOBLO' type 263, originele 77 kW, 1598 cc, diesel en toelatingsjaar 2015–2020. Bevestig de 198A3000-motorcode, Bosch EDC17C49/EDC17C69/EDC16C39-variant, versnellingsbak en laadprofiel; DPF, EGR en SCR/AdBlue blijven volledig functioneren.",
  appIds:["rdw-bulk-8-fiat-doblo-263-16multijet105-2015-20"],
},
{
  slug:"ford-transit-20-ecoblue-130-2024",
  modelSlug:"ford-transit",
  title:"Ford Transit 2.0 EcoBlue 130 (2024)",
  intro:"Deze Ford Transit uit de modelgeneratie 2024 heeft bij de RDW originele 95,7 kW en een dieselmotor van 1996 cc. ECU-Soft en BSR beschrijven voor de 130 pk Transit V een overeenkomende normale Stage 1-indicatie, maar hun publicatie bewijst niet dat elke bestelwagen dezelfde ECU bevat.",
  checks:"Controleer RDW-handelsbenaming TRANSIT, carrosserie- of typecode FCD, originele 95,7 kW, 1996 cc diesel, vier cilinders en eerste toelating 2024. Verifieer daarna ECU-unlock, Euro-emissiefase, FWD/RWD, handbak of automaat, koppeling en werkbelading. DPF, EGR en SCR/AdBlue blijven legaal en functioneel.",
  appIds:["rdw-bulk-9-ford-transit-fcd-20ecoblue130-2024"],
},
{
  slug:"ford-transit-20-ecoblue-165-2024",
  modelSlug:"ford-transit",
  title:"Ford Transit 2.0 EcoBlue 165 (2024)",
  intro:"De Transit EcoBlue 165 uit 2024 heeft originele RDW-motoroutput 121,3 kW en 1996 cc; dit is een andere fabrieksafstelling dan de Transit 130 met 95,7 kW. Twee afzonderlijke aanbieders publiceren een Stage 1-indicatie, terwijl bij sommige automaten ook het oorspronkelijke koppel verschilt.",
  checks:"Controleer FORD TRANSIT type FCD, 121,3 kW, diesel 1996 cc en eerste toelating 2024. De bron met 390 Nm fabriekskoppel is niet automatisch geschikt voor BVA8-uitvoeringen die soms 360 Nm voeren: identificeer ECU, BVA8/BVA10 of handbak, unlock, emissiesystemen, laadgewicht en transmissiekoppel vóór een offerte.",
  appIds:["rdw-bulk-9-ford-transit-fcd-20ecoblue165-2024"],
},
{
  slug:"ford-transit-connect-15-ecoblue-100-pu2-2024",
  modelSlug:"ford-transit-connect",
  title:"Ford Transit Connect 1.5 EcoBlue 100 (PU2, 2024)",
  intro:"De Transit Connect met RDW-type PU2, 1499 cc en 73,3 kW kan in 2024 nog voorkomen naast de latere geheel andere generatie op Volkswagen-platform. Voor deze specifieke oudere EcoBlue-motor geven drie onafhankelijke publicaties een normale Stage 1-indicatie die tussen de leveranciers licht verschilt.",
  checks:"Vergelijk RDW TRANSIT CONNECT type PU2, originele 73,3 kW, 1499 cc diesel, vier cilinders en toelating 2024. Controleer of werkelijk de eerdere 1.5 EcoBlue met Bosch MD1CS005 aanwezig is en geen nieuwe Connect 2.0 diesel; verifieer koppeling, transmissie en dat DPF/EGR/SCR correct blijven werken. Origineel koppel verschilt tussen leveranciers.",
  appIds:["rdw-bulk-9-ford-transit-connect-pu2-15ecoblue100-2024"],
},
{
  "slug": "opel-vivaro-b-16-cdti-95-euro6-2017-19",
  "modelSlug": "opel-vivaro",
  "title": "Opel Vivaro B 1.6 CDTI 95 Euro 6 (2017–2019)",
  "intro": "De Opel Vivaro B met originele 70 kW en 1598 cc is de zuinige 95 pk-diesel uit de Euro 6-generatie. Voor precies deze RDW-type F7-motor bestaan eigen Opel-bronnen, maar 2014–2016 Euro 5-gegevens en de latere Vivaro van 2019 op PSA-platform mogen niet worden samengevoegd.",
  "checks": "Controleer VIVARO-B type F7, 1598 cc, originele 70 kW, diesel, eerste toelating 2017–2019 en de werkelijke R9M-motorcode. ECU-soft en een onafhankelijke aanbieder noemen 350 Nm, ATM noemt 370 Nm: de ECU, Euro-fase, koppeling, handbak en SCR/DPF moeten vóór tuning gecontroleerd worden.",
  "appIds": [
    "rdw-bulk-10-opel-vivaro-b-f7-16cdti95-euro6-2017-19"
  ]
},
{
  "slug": "opel-vivaro-b-16-cdti-120-euro6-2017-19",
  "modelSlug": "opel-vivaro",
  "title": "Opel Vivaro B 1.6 CDTI 120 Euro 6 (2017–2019)",
  "intro": "De 1.6 CDTI 120 heeft in de RDW-registratie 89 kW, wat afgerond 121 metrische pk oplevert. Dit is een eigen fabrieksvariant van Opel Vivaro B, los van de 70 kW 95 pk en van de 92 kW BiTurbo 125 pk, met afzonderlijk gecontroleerde tunerpublicaties voor Euro 6.",
  "checks": "Verifieer RDW-type F7 en handelsnaam VIVARO-B, 1598 cc, 89 kW en 2017–2019. Publicaties spreken 300 of 320 Nm origineel en 350 of 370 Nm na Stage 1; het fabriekskoppel staat niet in RDW. Controleer R9M D4, ECU-versie, echte Turbo-variant, de versnellingsbak en werkende AdBlue/SCR en DPF.",
  "appIds": [
    "rdw-bulk-10-opel-vivaro-b-f7-16cdti120-euro6-2017-19"
  ]
},
{
  "slug": "opel-vivaro-b-16-biturbo-125-euro6-2017-19",
  "modelSlug": "opel-vivaro",
  "title": "Opel Vivaro B 1.6 CDTI BiTurbo 125 (2017–2019)",
  "intro": "De Vivaro B BiTurbo 125 met oorspronkelijke 92 kW en 1598 cc gebruikt een andere afstelling dan de 95 en 120 pk CDTI. Drie onafhankelijke leveranciers publiceren Stage 1-waarden voor de 2016–2019 Euro 6-familie, waaronder verschillende maxima voor deze 125 pk-uitvoering.",
  "checks": "Controleer VIVARO-B, RDW F7, 1598 cc, originele 92 kW, 2017–2019, motor R9M D4 met twee turbochargers, Bosch EDC17C42/C84, softwareversie, DPF/SCR en draaglast. Zakelijke busjes met aanhanger mogen niet automatisch het maximale gepubliceerde koppel toepassen.",
  "appIds": [
    "rdw-bulk-10-opel-vivaro-b-f7-16biturbo125-euro6-2017-19"
  ]
},
{
  "slug": "opel-vivaro-b-16-biturbo-145-euro6-2019",
  "modelSlug": "opel-vivaro",
  "title": "Opel Vivaro B 1.6 CDTI BiTurbo 145 Euro 6 (2019)",
  "intro": "De 2019 Opel Vivaro B 1.6 BiTurbo 145 met 107 kW en 1598 cc is de sterkere Euro 6-variant van de oudere F7-generatie. Twee leveranciers die 2019 expliciet in hun motoroverzicht opnemen publiceren dezelfde gewone Stage 1-indicatie; dat is geen bewijs dat elke 2019 Vivaro identieke ECU-software heeft.",
  "checks": "Vergelijk de RDW-handelsbenaming VIVARO-B, type F7, 107 kW, 1598 cc, diesel en eerste toelating 2019. Controleer de originele BiTurbo-motorcode R9M D4, werkelijke EDC17C84, transmissie, koeling en SCR/AdBlue/DPF; gebruik deze gegevens niet voor VIVARO type V of 92 kW 125 pk.",
  "appIds": [
    "rdw-bulk-10-opel-vivaro-b-f7-16biturbo145-euro6-2019"
  ]
},
{
  "slug": "ford-transit-connect-15-tdci-120-2015",
  "modelSlug": "ford-transit-connect",
  "title": "Ford Transit Connect 1.5 TDCi 120 (2015)",
  "intro": "De oudere Ford Transit Connect PU2 1.5 TDCi 120 uit 2015 gebruikt 1499 cc en originele 88 kW. Het is nadrukkelijk niet dezelfde EcoBlue-generatie als de Connect 1.5 vanaf 2018 of de nieuwere 2.0 diesel. De uitgekozen onafhankelijke publicaties tonen verschillende gewone Stage 1-indicaties.",
  "checks": "Identificeer RDW-model TRANSIT CONNECT, type PU2, eerste toelating 2015, 1499 cc, 88 kW diesel, vier cilinders, motorkode XWGB en de werkelijke ECU. ATM is specifiek voor Connect; de tweede leverancier groepeert Tourneo en Connect. Controleer handbak, DPF/EGR en de voertuigconditie.",
  "appIds": [
    "rdw-bulk-10-ford-transit-connect-pu2-15tdci120-2015"
  ]
},
{
  "slug": "peugeot-expert-20-bluehdi-177-2024",
  "modelSlug": "peugeot-expert",
  "title": "Peugeot Expert 2.0 BlueHDi 177 (2024)",
  "intro": "Deze Peugeot Expert met 1997 cc en originele RDW-motoroutput 130 kW wordt door verschillende aanbieders als 177 of 180 pk geadverteerd. Voor het faceliftjaar 2024 zijn onafhankelijke externe Stage 1-publicaties met 205 pk gevonden, maar die verschillen over het eindkoppel en kunnen een andere Euro 6-fase beschrijven.",
  "checks": "Controleer bij deze Expert type V, 1997 cc, 130 kW en eerste toelating 2024, werkelijk DW10/AH01-motorlabel, Delphi DCM-software en eventuele ECU-unlock. De externe opgegeven 440 of 460 Nm is niet vanzelf geschikt voor elke EAT8 of zwaar beladen werkbus; DPF, EGR en SCR/AdBlue blijven legaal actief.",
  "appIds": [
    "rdw-bulk-10-peugeot-expert-v-20bluehdi177-2024"
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
if(nlVanEngines.length!==36||new Set(nlVanEngines.map(x=>x.slug)).size!==36)throw Error("Manual van engine publication count changed");
export const nlVanEngineBySlug=new Map(nlVanEngines.map(x=>[x.slug,x]));
export function nlVanEngineMetadata(e:NlVanEngine){
 const a=e.applications[0];
 return {title:e.title+" Stage 1",description:e.title+": originele RDW-gegevens van "+a.stockPowerHp+" pk, technische varianten, bronvermelde Stage 1 en ECU- en transmissievoorwaarden."};
}
