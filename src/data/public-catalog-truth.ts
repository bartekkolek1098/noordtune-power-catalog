import type {EngineVariant, StageDefinition, StageName} from "./catalog-shared.ts";
import type {StageScope} from "../lib/stage-presentation.ts";

/** Bounded public corrections; canonical data remains historical evidence.
 * Every Stage has an independent decision. Receipts/reasons stay on the server;
 * only curated customer notes and whitelisted hardware reach selected DTOs.
 * Reviewed 2026-10-04; see CATALOG_TRUTH_P0_V1_REVIEW.md.
 */
type StageReview = ({action: "RANGE"; output: [[number, number], [number, number]]; provenance: "multi-source"}
  | {action: "POINT"; output: [number, number]; provenance: "single-source"; scope: StageScope; referenceYearRange: [number, number]}
  | {action: "CUSTOM" | "WITHHOLD"}) & {reason: string; note?: [string, string, string]; scope?: StageScope};
type TruthReview = {
  id: string;
  action: "KEEP" | "CORRECT" | "SPLIT" | "REMOVE_UNSUPPORTED_EXACT_CLAIM" | "MAKE_CONDITIONAL" | "WITHHOLD_OUTPUT";
  years?: [number, number]; generation?: string; engine?: string; stockTorqueNm?: number;
  unknownStockTorque?: boolean; engineCodes?: string[];
  ecu?: string; ecuBasis?: "documented-application" | "unconfirmed"; transmission?: string;
  stages: Record<StageName, StageReview>;
  note: [string, string, string];
  sources: NonNullable<EngineVariant["outputReferences"]>;
};
const customStage3 = (): StageReview => ({action: "CUSTOM", reason: "No exact turbo/fuel/hardware package with owner-approved commercial scope.", note: [
  "Stage 3+ wordt per auto opgebouwd: turbo, brandstofsysteem, koeling en aandrijflijn bepalen het pakket. Vermogen en prijs na beoordeling; geen vast pakket bevestigd.",
  "Stage 3+ is defined per car: turbo, fuel system, cooling and drivetrain determine the package. Output and price follow review; no fixed package is confirmed.",
  "Stage 3+ ustalamy dla konkretnego auta: turbo, paliwo, chłodzenie i napęd określają pakiet. Moc i cenę podamy po ocenie; stały pakiet nie jest potwierdzony."
]});

export const publicCatalogTruthReviews: TruthReview[] = [
  {
    id: "bmw-320d-b47",
    action: "CORRECT",
    years: [2015,2019],
    generation: "F30/F31 LCI",
    ecu: "Bosch EDC17",
    ecuBasis: "documented-application",
    stages: {
      "Stage 1": {action:"RANGE",output:[[220,225],[440,460]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"Compatible Stage 2 listing, but diesel hardware and transmission limits are unspecified.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2 is mogelijk na beoordeling van het hardwarepakket en de versnellingsbak. Er is nog geen bevestigd pakket voor deze 190 pk-diesel; vermogen en prijs volgen na controle.",
        "Stage 2 needs review of the hardware package and transmission. No package is confirmed for this 190 hp diesel yet; output and price follow that review.",
        "Stage 2 wymaga oceny osprzętu i skrzyni. Pakiet dla tego diesla 190 KM nie jest jeszcze potwierdzony; moc i cenę ustalimy po kontroli.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.press.bmwgroup.com/netherlands/article/detail/T0216582NL/bmw-presenteert-de-vernieuwde-bmw-3-serie","scope":"factory-b47","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2015-f30-f31-f35-lci/diesel/20d-190","scope":"shiftech-1159","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"mosselman","url":"https://www.mosselmanturbo.com/nl/bmw-320d-f30-f31-lci-190hp","scope":"mosselman-bmw-320d-f30-f31-lci-190hp","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"un","url":"https://www.unlimitedtuning.nl/chiptuning-bmw-320d-f30-f31-190-pk.html","scope":"un-b47","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "F30/F31 LCI, 190 pk / 400 Nm. G20 valt buiten deze indicatie. Motor, ECU en versnellingsbak worden afzonderlijk bevestigd.",
      "F30/F31 LCI, 190 hp / 400 Nm. This indication excludes G20. Engine, ECU and transmission are confirmed separately.",
      "F30/F31 LCI, 190 KM / 400 Nm. Ta prognoza nie dotyczy G20. Silnik, ECU i skrzynię potwierdzimy osobno.",
    ]
  },
  {
    id: "vw-golf-20-tsi-ea888",
    action: "CORRECT",
    years: [2013,2017],
    generation: "Golf 7",
    ecu: "Continental Simos 18.x",
    ecuBasis: "documented-application",
    stages: {
      "Stage 1": {action:"RANGE",output:[[300,305],[440,460]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"BR and Vagtechniek use different intake/exhaust packages; Stage 2 fuel and gearbox limits are not fully aligned.",scope:{"fuelRon":[],"hardware":[{"part":"intake","requirement":"check"},{"part":"sport-catalyst","requirement":"check"},{"part":"exhaust","requirement":"check"}]}, note: [
        "Stage 2-pakketten voor de GTI Performance verschillen per aanbieder. Inlaat, uitlaat met sportkatalysator, brandstof en DSG/koppeling eerst afstemmen; onderdelen en montage worden apart geoffreerd.",
        "GTI Performance Stage 2 packages differ between providers. Agree intake, exhaust with sport catalyst, fuel and DSG/clutch scope first; parts and installation are quoted separately.",
        "Pakiety Stage 2 dla GTI Performance różnią się między firmami. Najpierw ustalimy dolot, wydech z katalizatorem sportowym, paliwo i DSG/sprzęgło; części i montaż wycenimy osobno.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.volkswagen-newsroom.com/en/engine-versions-golf-7-gti-profile-20034","scope":"factory-gti","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"br","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/","scope":"br-gti","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"unlimited","url":"https://www.unlimitedtuning.nl/chiptuning-volkswagen-golf-7-2-0-gti-performance-230-pk.html","scope":"unlimited-golf-7-2-0-gti-performance-230","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BR Stage 2","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/?stage=5216","scope":"Stage 2 230/350; intake and sport-catalyst exhaust","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"Vagtechniek Stage 2","url":"https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7-/2.0-tsi-gti-performance-230pk/","scope":"Stage 2 230/350; downpipe and filter; Stage 1+ fuel not transferred","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "GTI Performance vóór facelift, 230 pk / 350 Nm. Niet voor standaard GTI, Performance 245 pk, Clubsport, TCR of R. Brandstof en gemonteerde hardware controleren.",
      "GTI Performance before facelift, 230 hp / 350 Nm. Excludes standard GTI, Performance 245 hp, Clubsport, TCR and R. Check fuel and installed hardware.",
      "GTI Performance przed liftingiem, 230 KM / 350 Nm. Nie dotyczy zwykłego GTI, Performance 245 KM, Clubsport, TCR ani R. Sprawdzimy paliwo i osprzęt.",
    ]
  },
  {
    id: "bmw-3-series-g20-g21-320i",
    action: "CORRECT",
    stockTorqueNm: 300,
    ecuBasis: "unconfirmed",
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"Stage 2 evidence exists, but engine version, market fuel and catalyst/gearbox scope are unresolved; the 270 Nm Shiftech page has no Stage 2.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Voor Stage 2 eerst de exacte 320i-motorvariant, brandstof, katalysatorconfiguratie en versnellingsbak bevestigen. Een pakket voor een andere B48-uitvoering geldt niet automatisch voor deze auto.",
        "For Stage 2, confirm the exact 320i engine version, fuel, catalyst configuration and transmission first. A package for another B48 version does not automatically apply to this car.",
        "Przed Stage 2 potwierdzimy dokładną wersję silnika 320i, paliwo, konfigurację katalizatora i skrzynię. Pakiet dla innej wersji B48 nie musi pasować do tego auta.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.press.bmwgroup.com/belux/article/detail/T0285543NL/de-nieuwe-bmw-3-reeks-berline?language=nl","scope":"factory-g20","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2019-g20-g21/petrol/20i-2.0t-eu6d-184","scope":"shiftech-433364","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"117Speed Stage 2","url":"https://117speed.co.uk/product/320i-g20/","scope":"Stage 2 listed for UK 184 bhp/300; engine/fuel/catalyst applicability unresolved","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "G20/G21 320i, Europese 184 pk / 300 Nm-configuratie. Tuningvermogen en ECU-toegang na identificatie; eerste registratie bepaalt de toegang niet.",
      "G20/G21 320i, European 184 hp / 300 Nm configuration. Tuning output and ECU access after identification; first registration does not determine access.",
      "G20/G21 320i, europejska wersja 184 KM / 300 Nm. Parametry tuningu i dostęp do ECU po identyfikacji; data pierwszej rejestracji nie określa dostępu.",
    ]
  },
  {
    id: "volkswagen-golf-7-r-20-tsi",
    action: "CORRECT",
    years: [2014,2016],
    stockTorqueNm: 380,
    ecu: "Continental Simos 18.x",
    ecuBasis: "documented-application",
    stages: {
      "Stage 1": {action:"RANGE",output:[[350,350],[460,460]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"TVS Stage 2 uses stock engine hardware/RON98; BR Stage 2 requires intake and sport-catalyst exhaust. Material hardware and TCU scope difference.",scope:{"fuelRon":[],"hardware":[{"part":"intake","requirement":"check"},{"part":"sport-catalyst","requirement":"check"},{"part":"exhaust","requirement":"check"}]}, note: [
        "Stage 2 kan bij deze R software op originele hardware of een pakket met inlaat en sportkatalysator betekenen. Kies eerst het pakket, de brandstof en de DSG/koppelgrens; hardware is niet inbegrepen.",
        "Stage 2 for this R can mean software on stock hardware or an intake and sport-catalyst package. Confirm package, fuel and DSG torque limit first; hardware is excluded.",
        "Stage 2 dla tego R może oznaczać samą mapę na seryjnym osprzęcie lub pakiet dolotu i katalizatora sportowego. Najpierw ustalimy pakiet, paliwo i limit DSG; osprzęt nie jest wliczony.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.volkswagen-newsroom.com/de/motorversionen-golf-7-steckbrief-20040","scope":"factory-vw","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2012-vii-mki/petrol/2.0-tsi-300","scope":"shiftech-10594","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"br","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/","scope":"br-r","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"search-index"},
      {"title":"BR Stage 2","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/?stage=6549","scope":"Stage 2 300/380; intake and sport-catalyst exhaust","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"TVS Stage 2","url":"https://tvsengineering.com/tuning/volkswagen-golf-golf-7-2012-2016-2-0-tsi-r-300hp-tuning/","scope":"Stage 2 300/380; stock engine hardware RON98; DQ250 software limits differ","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "Golf 7 R vóór facelift, 300 pk / 380 Nm. Niet voor facelift 310 pk / 400 Nm of latere GPF 300 pk / 400 Nm. Exacte DSG/TCU identificeren.",
      "Golf 7 R before facelift, 300 hp / 380 Nm. Excludes facelift 310 hp / 400 Nm and later GPF 300 hp / 400 Nm. Identify the exact DSG/TCU.",
      "Golf 7 R przed liftingiem, 300 KM / 380 Nm. Nie dotyczy liftingu 310 KM / 400 Nm ani późniejszego GPF 300 KM / 400 Nm. Wymagana identyfikacja DSG/TCU.",
    ]
  },
  {
    id: "bmw-x3-e83-20d",
    action: "REMOVE_UNSUPPORTED_EXACT_CLAIM",
    engine: "2.0d",
    ecuBasis: "unconfirmed",
    stages: {
      "Stage 1": {action:"RANGE",output:[[210,215],[425,430]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"A genuine 177/350 Stage 2 listing exists; no specific diesel hardware, retained emissions configuration or gearbox limit is established.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Voor deze E83 is Stage 2 alleen op aanvraag: hardware, emissiesysteem en handbak/automaat eerst beoordelen. We nemen geen pakket van een andere X3-motor over.",
        "Stage 2 for this E83 is on request: review hardware, emissions equipment and manual/automatic transmission first. We do not transfer a package from another X3 engine.",
        "Stage 2 dla E83 wyceniamy indywidualnie po sprawdzeniu osprzętu, układu emisji i skrzyni. Nie przenosimy pakietu z innego silnika X3.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.press.bmwgroup.com/global/article/detail/T0011997EN/bmw-x3-best-seller-now-even-more-powerful-and-efficient-bmw-efficientdynamics-in-the-2008-model-year%3A-bmw-x3-2-0d-with-new-four-cylinder-diesel-engine-optional-six-speed-automatic-transmission-fuel-saving-technologies-on-all-variants-of-the-world-s-most-successful-sav-in-the-premium-segment?language=en","scope":"factory-x3","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"sh","url":"https://www.shiftech.eu/en/chiptuning/car/bmw/x3/2003-e83/diesel/20d-177","scope":"sh-x3","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"un","url":"https://www.unlimitedtuning.nl/chiptuning-bmw-x3-2-0d-177-pk.html","scope":"un-x3","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "E83 2.0d, 177 pk / 350 Nm. Exacte motorcode en ECU nog te bevestigen. Handgeschakeld of automaat afzonderlijk controleren.",
      "E83 2.0d, 177 hp / 350 Nm. Exact engine code and ECU still need confirmation. Check manual or automatic transmission separately.",
      "E83 2.0d, 177 KM / 350 Nm. Dokładny kod silnika i ECU wymagają potwierdzenia. Skrzynię ręczną lub automatyczną sprawdzimy osobno.",
    ]
  },
  {
    id: "audi-a4-b9-20-tdi-190",
    action: "CORRECT",
    transmission: "S tronic (longitudinal)",
    stages: {
      "Stage 1": {action:"RANGE",output:[[220,225],[450,460]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"Compatible 190/400 Stage 2 listing exists; diesel parts and longitudinal transmission torque scope are not specified.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2 vraagt een vastgelegd hardwarepakket voor deze TDI en controle van de langsgeplaatste versnellingsbak. Het pakket en de prijs worden na voertuigcontrole bepaald.",
        "Stage 2 needs a defined hardware package for this TDI and review of the longitudinal transmission. Package and price are agreed after vehicle inspection.",
        "Stage 2 wymaga ustalonego osprzętu dla tego TDI i kontroli wzdłużnej skrzyni. Pakiet i cenę określimy po sprawdzeniu auta.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.audi-mediacenter.com/en/the-audi-a4-major-upgrade-for-the-bestseller-11884/download","scope":"factory-a4","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/audi/a4/2015-b9/diesel/2.0-tdi-cr-eu6-190","scope":"shiftech-416","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"un","url":"https://www.unlimitedtuning.nl/chiptuning-audi-a4-b9-2-0-tdi-190-pk.html","scope":"un-a4","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "B9 2.0 TDI, 190 pk / 400 Nm. Motorcode, emissievariant en longitudinale S tronic/TCU vóór uitvoering controleren.",
      "B9 2.0 TDI, 190 hp / 400 Nm. Check engine code, emissions variant and longitudinal S tronic/TCU before work.",
      "B9 2.0 TDI, 190 KM / 400 Nm. Przed realizacją sprawdzimy kod silnika, wersję emisji i wzdłużną skrzynię S tronic/TCU.",
    ]
  },
  {
    id: "volkswagen-passat-b8-20-tdi",
    action: "MAKE_CONDITIONAL",
    unknownStockTorque: true,
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"Stage 2 195/440 exists for a 150/320 source scope; exact Dutch stock/application mapping and diesel hardware are unresolved.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2-waarden voor deze 150 pk-versie volgen pas na bevestiging van de motor-/marktuitvoering, het stockkoppel en de versnellingsbak. Daarna bepalen we het passende hardwarepakket.",
        "Stage 2 figures for this 150 hp version follow confirmation of engine/market specification, stock torque and transmission. We then define the applicable hardware package.",
        "Parametry Stage 2 dla wersji 150 KM podamy po potwierdzeniu silnika, rynku, momentu seryjnego i skrzyni. Następnie ustalimy właściwy osprzęt.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/volkswagen/passat/2015-b8/diesel/2.0-tdi-cr-eu6-150","scope":"shiftech-10772","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"unlimited","url":"https://www.unlimitedtuning.nl/chiptuning-volkswagen-passat-b8-2-0-tdi-150-pk.html","scope":"unlimited-v2-d903c4a80235bdbf","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "B8 2.0 TDI, 150 pk. Stockkoppel en tuningwaarden na bevestiging van de exacte motor- en transmissievariant.",
      "B8 2.0 TDI, 150 hp. Stock torque and tuning figures after confirming the exact engine and transmission variant.",
      "B8 2.0 TDI, 150 KM. Moment seryjny i parametry tuningu po potwierdzeniu dokładnej wersji silnika i skrzyni.",
    ]
  },
  {
    id: "ford-focus-st-20-ecoboost",
    action: "WITHHOLD_OUTPUT",
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"Facelift Stage 2 evidence exists, but fuel/calibration and intercooler/intake requirements differ or are unspecified across the broad Mk3 scope.",scope:{"fuelRon":[],"hardware":[{"part":"intake","requirement":"check"},{"part":"intercooler","requirement":"check"},{"part":"sport-catalyst","requirement":"check"}]}, note: [
        "Stage 2 bestaat voor de benzine-ST, maar eerst bouwvariant, brandstof en het pakket met inlaat, intercooler en sportkatalysator bevestigen. Faceliftwaarden gelden niet automatisch voor elke Mk3. Dit is een handbak; geen TCU-pakket.",
        "Stage 2 exists for the petrol ST, but confirm build version, fuel and the intake, intercooler and sport-catalyst package first. Facelift figures do not automatically apply to every Mk3. This is a manual car; no TCU package.",
        "Stage 2 istnieje dla benzynowego ST, lecz trzeba potwierdzić wersję, paliwo oraz dolot, intercooler i katalizator sportowy. Dane liftingu nie dotyczą automatycznie każdego Mk3. Skrzynia ręczna; bez pakietu TCU.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf","scope":"factory-focus","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"search-index"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/ford/focus/2014-mkiii/petrol/2.0-t-ecoboost-st-250","scope":"shiftech-ford-focus-2014-mkiii-petrol-20-t-ecoboost-st-250","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"br","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/1124-mk3-2010-2014/1141-st-2-0t-ecoboost/","scope":"br-focus","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"search-index"},
      {"title":"BR facelift Stage 2","url":"https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/23-ford/1123-focus/7022-iii-facelift-2014-2018/7872-st-2-0t-ecoboost/?stage=6885","scope":"Stage 2 facelift 250/360; intake intercooler sport-catalyst exhaust; no E85","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "Mk3 ST benzine, 2.0 EcoBoost 250 pk / 360 Nm. Geen ST diesel of Mk4. Tuningwaarden na bevestiging van vóór/na facelift, brandstof en kalibratie.",
      "Mk3 ST petrol, 2.0 EcoBoost 250 hp / 360 Nm. Excludes ST diesel and Mk4. Tuning figures after confirming pre/post facelift, fuel and calibration.",
      "Mk3 ST benzyna, 2.0 EcoBoost 250 KM / 360 Nm. Nie dotyczy ST diesel ani Mk4. Parametry tuningu po potwierdzeniu liftingu, paliwa i kalibracji.",
    ]
  },
  {
    id: "volvo-xc60-d5",
    action: "WITHHOLD_OUTPUT",
    engineCodes: ["D5244T20"],
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"POINT",output:[245,520],provenance:"single-source","referenceYearRange":[2016,2017],reason:"BSR kit 3314 explicitly labelled Stage 2, D5244T20 AWD 2016-2017, with rear exhaust; source originals 221/428 are measured references, not adopted factory stock.",scope:{"fuelRon":[],"hardware":[{"part":"rear-exhaust","requirement":"required"}]}, note: [
        "BSR Stage 2-referentie, alleen voor modeljaar 2016–2017, D5244T20 diesel met AWD, automaat en de voorgeschreven achteruitlaat. Geen NoordTune-vermogensgarantie. Dit BSR-uitlaatdeel is uit het assortiment: gemonteerde onderdelen en ECU-toegang eerst controleren. Softwareprijs; hardware en montage apart.",
        "BSR Stage 2 reference, only for model years 2016–2017, D5244T20 diesel with AWD, automatic transmission and the specified rear exhaust. No NoordTune output guarantee. This BSR exhaust part is discontinued: confirm installed parts and ECU access first. Software price; hardware and installation separate.",
        "Referencja BSR Stage 2 tylko dla roczników modelowych 2016–2017, diesla D5244T20 z AWD, automatem i wymaganym tylnym wydechem. Bez gwarancji mocy NoordTune. Ten element BSR wycofano: sprawdzimy zamontowane części i dostęp do ECU. Cena oprogramowania; osprzęt i montaż osobno.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.volvocars.com/pl/support/car/xc60/2016/article/c48f21dbf78fa679c0a801e800b1d372/","scope":"factory-volvo","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"search-index"},
      {"title":"un","url":"https://www.unlimitedtuning.nl/chiptuning-volvo-xc60-2015-2-4-d5-220-pk.html","scope":"un-xc60","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BSR Stage 2","url":"https://en.bsr.se/tuning-kits/t/3314/volvo-xc60-d5-awd-220hp-2016-2017-d-5244-t20","scope":"Stage 2 245/520; D5244T20 AWD 2016-2017; rear exhaust package","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BSR rear exhaust","url":"https://en.bsr.se/product/exhaust-system-4002036/volvo-xc60-i-d5-2009-2017-2wd-awd","scope":"Specified rear muffler; excludes catalyst and downpipe; discontinued","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "XC60 I D5 AWD, D5244T20 220 pk / 440 Nm. Niet de 220 pk / 420 Nm-variant. Motorcode, automaat en tuningwaarden vóór uitvoering bevestigen.",
      "XC60 I D5 AWD, D5244T20 220 hp / 440 Nm. Excludes the 220 hp / 420 Nm variant. Confirm engine code, automatic transmission and tuning figures before work.",
      "XC60 I D5 AWD, D5244T20 220 KM / 440 Nm. Nie dotyczy wersji 220 KM / 420 Nm. Przed realizacją potwierdzimy kod silnika, automat i parametry tuningu.",
    ]
  },
  {
    id: "seat-leon-cupra-5f-20-tsi-300",
    action: "MAKE_CONDITIONAL",
    unknownStockTorque: true,
    ecu: "Continental Simos 18.x",
    ecuBasis: "documented-application",
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"Genuine Stage 2 exists for 300/380; Dutch body/drivetrain/market stock scope and fuel/hardware remain unresolved.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2 pas na bevestiging van carrosserie, aandrijving, stockkoppel, brandstof en DSG/koppeling. Gepubliceerde pakketten voor een andere Cupra 300-uitvoering zijn geen doel voor deze auto.",
        "Stage 2 follows confirmation of body style, drivetrain, stock torque, fuel and DSG/clutch. Published packages for another Cupra 300 version are not a target for this car.",
        "Stage 2 po potwierdzeniu nadwozia, napędu, momentu seryjnego, paliwa i DSG/sprzęgła. Pakiet dla innej Cupry 300 nie określa celu dla tego auta.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/2.0-tsi-300","scope":"shiftech-9457","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"vag","url":"https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/","scope":"vag-cupra","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"search-index"},
    ],
    note: [
      "Leon Cupra 5F 300 pk. Exact stockkoppel, emissievariant en versnellingsbak nog te bevestigen; Golf R-waarden zijn niet overdraagbaar.",
      "Leon Cupra 5F 300 hp. Exact stock torque, emissions variant and transmission still need confirmation; Golf R figures do not transfer.",
      "Leon Cupra 5F 300 KM. Moment seryjny, wersja emisji i skrzynia wymagają potwierdzenia; wartości Golfa R nie mają tu automatycznie zastosowania.",
    ]
  },
  {
    id: "mercedes-a45-amg-m133",
    action: "MAKE_CONDITIONAL",
    stages: {
      "Stage 1": {action:"RANGE",output:[[400,410],[530,540]],provenance:"multi-source",reason:"Accepted compatible Stage 1 reference envelope; vehicle confirmation required."},
      "Stage 2": {action:"CUSTOM",reason:"Genuine 360/450 Stage 2 listings exist; BR sport-catalyst/filter package excludes E85 but does not define octane and installed AMG gearbox limits.",scope:{"fuelRon":[],"hardware":[{"part":"sport-catalyst","requirement":"check"},{"part":"intake","requirement":"check"},{"part":"cooling","requirement":"check"}]}, note: [
        "Stage 2-pakketten bestaan voor de W176 360 pk, met sportkatalysator en luchtfilter. Brandstof, koeling en AMG-versnellingsbak eerst afstemmen; geen overname van 381 pk- of W177-waarden. Hardware en montage apart.",
        "Stage 2 packages exist for the W176 360 hp with sport catalyst and air filter. Agree fuel, cooling and AMG transmission scope first; no transfer of 381 hp or W177 figures. Hardware and installation separate.",
        "Dla W176 360 KM istnieją pakiety Stage 2 z katalizatorem sportowym i filtrem. Najpierw ustalimy paliwo, chłodzenie i skrzynię AMG; bez przenoszenia danych wersji 381 KM lub W177. Osprzęt i montaż osobno.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"shiftech","url":"https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/mercedes/a/2012-w176/essence/45-amg-2.0t-360","scope":"shiftech-6051","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"unlimited","url":"https://www.unlimitedtuning.nl/chiptuning-mercedes-benz-w176-a45-amg-360-pk.html","scope":"unlimited-counterpart-6051","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BR Stage 2","url":"https://www.br-performance.be/fr-be/reprogrammation/1-voitures/37-mercedes/1626-a-a-berline/4106-w176-2012-2015/5521-45-amg/?stage=8813","scope":"Stage 2 360/450; sport-catalyst exhaust and BMC filter; excludes E85","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "W176 M133 360 pk / 450 Nm-configuratie. Niet voor facelift 381 pk / 475 Nm of W177. Brandstof, ECU en transmissie bevestigen.",
      "W176 M133 360 hp / 450 Nm configuration. Excludes facelift 381 hp / 475 Nm and W177. Confirm fuel, ECU and transmission.",
      "W176 M133, wersja 360 KM / 450 Nm. Nie dotyczy liftingu 381 KM / 475 Nm ani W177. Potwierdzimy paliwo, ECU i skrzynię.",
    ]
  },
  {
    id: "bmw-1-series-f20-f21-118d",
    action: "MAKE_CONDITIONAL",
    engine: "2.0 diesel",
    unknownStockTorque: true,
    ecu: "Bosch EDC17",
    ecuBasis: "documented-application",
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Accepted Stage 1 applicability/evidence remains unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"150/320 Stage 2 source exists; 320/330 factory market conflict and exact diesel/transmission scope remain unresolved.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Voor Stage 2 eerst marktuitvoering, motor en versnellingsbak identificeren. Het verschil in stockkoppel is nog niet opgelost; daarna bepalen we hardware, vermogen en prijs.",
        "Identify market specification, engine and transmission before Stage 2. The stock-torque difference is unresolved; hardware, output and price follow identification.",
        "Przed Stage 2 potwierdzimy rynek, silnik i skrzynię. Różnica momentu seryjnego pozostaje nierozwiązana; potem ustalimy osprzęt, moc i cenę.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.press.bmwgroup.com/global/article/attachment/T0200199EN/302716","scope":"factory-118d","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"factory","url":"https://www.press.bmwgroup.com/united-kingdom/article/detail/T0200962EN_GB/the-bmw-1-series-for-2015","scope":"factory-118d-uk","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/bmw/1-serie/2015-f20-lci/diesel/18d-150","scope":"shiftech-1000","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"mosselman","url":"https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp","scope":"mosselman-bmw-118d-f20-f21-lci-150hp","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "F20/F21 118d, 150 pk. Stockkoppel en tuningwaarden na bevestiging van de marktuitvoering en motor-/transmissievariant.",
      "F20/F21 118d, 150 hp. Stock torque and tuning figures after confirming market specification and engine/transmission variant.",
      "F20/F21 118d, 150 KM. Moment seryjny i parametry tuningu po potwierdzeniu wersji rynkowej, silnika i skrzyni.",
    ]
  },
];

export function applyPublicCatalogTruth(vehicle: EngineVariant): EngineVariant {
  const review = publicCatalogTruthReviews.find(row => row.id === vehicle.id);
  if (!review) return vehicle;
  const years = review.years
    ? Array.from({length: review.years[1] - review.years[0] + 1}, (_, i) => review.years![0] + i) : vehicle.years;
  const engineCodes = review.engineCodes ?? (review.id === "bmw-320d-b47" ? ["B47"] : undefined);
  const ecu = review.ecu ?? (review.ecuBasis === "unconfirmed" ? undefined : vehicle.ecuSupport?.family);
  const stages: StageDefinition[] = vehicle.stages.map(stage => {
    const decision = review.stages[stage.name];
    const numeric = decision.action === "RANGE" || decision.action === "POINT";
    const scope = decision.scope ?? {fuelRon: [], hardware: []};
    return {...stage, powerHp: decision.action === "POINT" ? decision.output[0] : undefined,
      torqueNm: decision.action === "POINT" ? decision.output[1] : undefined,
      powerRangeHp: decision.action === "RANGE" ? [...decision.output[0]] : undefined,
      torqueRangeNm: decision.action === "RANGE" ? [...decision.output[1]] : undefined,
      approximate: numeric, provenance: numeric ? decision.provenance : "reviewed",
      confidenceLevel: "manual-review", customHardware: decision.action === "CUSTOM",
      quoteRequired: !numeric, hardwareScopeApproved: false,
      referenceYearRange: decision.action === "POINT" ? decision.referenceYearRange : undefined,
      customerNote: decision.note ? {nl: decision.note[0], en: decision.note[1], pl: decision.note[2]} : undefined,
      requirements: "Confirm vehicle, fuel, installed hardware, ECU access and transmission before work.",
      customerScope: scope, comparison: undefined, notes: [], packageItems: [],
      hardwareRequired: decision.action === "CUSTOM" || scope.hardware.some(part => part.requirement === "required")};
  });
  return {...vehicle,
    engine: review.engine ?? vehicle.engine, generation: review.generation ?? vehicle.generation,
    years, yearRange: review.years ? `${review.years[0]}-${review.years[1]}` : vehicle.yearRange,
    stockTorqueNm: review.unknownStockTorque ? undefined : review.stockTorqueNm ?? vehicle.stockTorqueNm,
    engineCode: undefined, engineIdentity: {engineCodes, status: engineCodes ? "supported-family" : "manual-review"},
    ecuType: ecu ?? "", ecuSupport: {family: ecu, status: review.ecuBasis === "documented-application" ? "supported-family" : "manual-review",
      basis: review.ecuBasis ?? "unconfirmed"},
    transmissionSupport: {gearboxFamily: review.transmission ?? (vehicle.gearbox === "Manual" ? "Manual" : undefined),
      status: "manual-review", basis: "unconfirmed"},
    tcuType: undefined, tcuSupport: {status: "manual-review", basis: "unconfirmed"},
    technicalEvidence: {sourceType: "internal", sourceReference: "CATALOG_TRUTH_P0_V1_REVIEW.md: independent factory, tool and tuner receipts", verifiedAt: "2026-10-04",
      notes: ["Application coverage only; no fitted ECU/TCU identification or access confirmation."]},
    verificationRequired: true, configurationNote: {nl: review.note[0], en: review.note[1], pl: review.note[2]},
    outputReferences: review.sources, stages};
}
