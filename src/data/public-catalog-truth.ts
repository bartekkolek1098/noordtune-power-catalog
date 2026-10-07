import type {EngineVariant, StageDefinition, StageIdentityScope, StageName} from "./catalog-shared.ts";
import type {StageScope} from "../lib/stage-presentation.ts";

/** Bounded public corrections; canonical data remains historical evidence.
 * Every Stage has an independent decision. Receipts/reasons stay on the server;
 * only curated customer notes and whitelisted hardware reach selected DTOs.
 * Reviewed 2026-10-05; see CATALOG_TRUTH_P0_V1_REVIEW.md and
 * CATALOG_TRUTH_P1_V1_REVIEW.md.
 */
type StageReview = ({action: "RANGE"; output: [[number, number], [number, number]]; provenance: "multi-source"}
  | {action: "POINT"; output: [number, number]; provenance: "single-source" | "multi-source"; scope?: StageScope}
  | {action: "CUSTOM" | "WITHHOLD"}) & {reason: string; note?: [string, string, string]; scope?: StageScope;
    referenceYearRange?: [number, number]; identityScope?: StageIdentityScope};
type TruthReview = {
  id: string;
  action: "KEEP" | "CORRECT" | "SPLIT" | "REMOVE_UNSUPPORTED_EXACT_CLAIM" | "MAKE_CONDITIONAL" | "WITHHOLD_OUTPUT";
  grade?: "A" | "B" | "C" | "D";
  years?: [number, number]; generation?: string; version?: string; engine?: string; stockTorqueNm?: number;
  unknownStockTorque?: boolean; engineCodes?: string[];
  ecu?: string; ecuBasis?: "documented-application" | "unconfirmed"; transmission?: string;
  gearbox?: EngineVariant["gearbox"]; tcu?: string; tcuBasis?: "documented-application" | "unconfirmed";
  emissionsStandard?: string;
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
    grade: "C",
    stockTorqueNm: 300,
    ecu: "Bosch MG1CS201",
    ecuBasis: "documented-application",
    transmission: "8-speed Steptronic",
    stages: {
      "Stage 1": {action:"WITHHOLD",reason:"Compatible 184/300 references remain materially divergent; installed DME, software/access, engine calibration, fuel, catalyst and transmission are unresolved."},
      "Stage 2": {action:"WITHHOLD",reason:"Stage 2 evidence exists, but engine version, market fuel and catalyst/gearbox scope are unresolved; the 270 Nm Shiftech page has no Stage 2.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Voor Stage 2 eerst de exacte 320i-motorvariant, brandstof, katalysatorconfiguratie en versnellingsbak bevestigen. Een pakket voor een andere B48-uitvoering geldt niet automatisch voor deze auto.",
        "For Stage 2, confirm the exact 320i engine version, fuel, catalyst configuration and transmission first. A package for another B48 version does not automatically apply to this car.",
        "Przed Stage 2 potwierdzimy dokładną wersję silnika 320i, paliwo, konfigurację katalizatora i skrzynię. Pakiet dla innej wersji B48 nie musi pasować do tego auta.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.press.bmwgroup.com/global/article/attachment/T0285128EN/425810","scope":"European G20 320i launch: 184/300 and 8-speed Steptronic","retrievedAt":"2026-10-05","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"AutoTuner MG1CS201 application","url":"https://us.autotuner.com/blogs/news/bmw-dde8-dme8-bench-read-write-solution-now-available-no-mail-in-unlock","scope":"G20/G21 20i 184/300 application; installed DME/access not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"AutoTuner MG1CS003 incompatible warning","url":"https://us.autotuner.com/pages/ecu/bosch-mg1cs003-spc5777m","scope":"184/270 application is incompatible with this public 184/300 target","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"117Speed Stage 2","url":"https://117speed.co.uk/product/320i-g20/","scope":"Stage 2 listed for UK 184/300; engine/fuel/catalyst applicability unresolved","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "G20/G21 320i, Europese 184 pk / 300 Nm-configuratie. Bosch MG1CS201 is een gedocumenteerde toepassing, maar de gemonteerde DME en software-/toegangsstatus zijn niet geïdentificeerd. Motor-/kalibratieversie, brandstof, katalysator en transmissie eerst bevestigen; de MG1CS003-referentie 184/270 is niet van toepassing.",
      "G20/G21 320i, European 184 hp / 300 Nm configuration. Bosch MG1CS201 is a documented application, but the installed DME and software/access state are not identified. Confirm engine/calibration, fuel, catalyst and transmission first; the MG1CS003 184/270 reference is incompatible.",
      "G20/G21 320i, europejska wersja 184 KM / 300 Nm. Bosch MG1CS201 jest udokumentowanym zastosowaniem, lecz zamontowane DME oraz stan oprogramowania/dostępu nie są zidentyfikowane. Najpierw potwierdzimy silnik/kalibrację, paliwo, katalizator i skrzynię; odniesienie MG1CS003 184/270 jest niezgodne.",
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
    grade: "B",
    years: [2019,2020],
    generation: "B8 facelift",
    version: "B8 facelift 150/340 manual evidence scope",
    engine: "2.0 TDI Evo 150",
    stockTorqueNm: 340,
    ecu: "Bosch MD1CS004",
    ecuBasis: "documented-application",
    transmission: "6-speed Manual",
    gearbox: "Manual",
    stages: {
      "Stage 1": {action:"POINT",output:[190,420],provenance:"multi-source",referenceYearRange:[2019,2020],reason:"Shiftech and RS-Tronic converge on 190/420 from the matching facelift 150/340 configuration.", identityScope: {
        label:{nl:"B8 facelift 150/340 met handbak",en:"B8 facelift 150/340 manual configuration",pl:"B8 po liftingu 150/340 ze skrzynią ręczną"},
        yearRange:[2019,2020],stockTorqueNm:340,generationMarkers:["facelift"],engineFamilyMarkers:["2.0 tdi evo"],transmissionFamilies:["manual"]
      }, note: [
        "Indicatie 190 pk / 420 Nm alleen voor de bevestigde B8 facelift 150/340 met handbak. De 150/360 DSG en eerdere B8-uitvoeringen hebben een aparte beoordeling nodig.",
        "190 hp / 420 Nm indication only for the confirmed B8 facelift 150/340 manual configuration. The 150/360 DSG and earlier B8 versions need a separate review.",
        "Wartości 190 KM / 420 Nm tylko dla potwierdzonego B8 po liftingu 150/340 ze skrzynią ręczną. Wersja 150/360 DSG i wcześniejsze B8 wymagają osobnej oceny.",
      ]},
      "Stage 2": {action:"CUSTOM",reason:"A compatible numeric listing exists, but no shared diesel hardware, retained-emissions or transmission package is established.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2 is maatwerk. Eerst dieselhardware, emissieconfiguratie en handbak-/DSG-grenzen vastleggen; vermogen, prijs, onderdelen, montage en rollenbankwerk volgen de gekozen configuratie.",
        "Stage 2 is custom. Confirm diesel hardware, emissions configuration and manual/DSG limits first; output, price, parts, installation and dyno work follow the selected configuration.",
        "Stage 2 jest indywidualny. Najpierw potwierdzimy osprzęt diesla, układ emisji oraz limity skrzyni ręcznej/DSG; moc, cena, części, montaż i hamownia zależą od konfiguracji.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://www.volkswagen-newsroom.com/en/the-new-passat-the-update-5070/download","scope":"2019 facelift: 150/340 manual and separate 150/360 seven-speed DSG","retrievedAt":"2026-10-05","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"AutoTuner MD1CS004 application","url":"https://us.autotuner.com/pages/ecu/bosch-md1cs004-tc298","scope":"2019+ 150/340 application; installed ECU/access not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/volkswagen/passat/2019/diesel/2.0-tdi-cr-eu6.2-150","scope":"2019 150/340 to Stage 1 190/420","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"RS-Tronic","url":"https://rstronic.com/en/chiptuning/volkswagen/passat/2019/2.0-tdi-cr-eu6.2-150","scope":"2019 150/340 to Stage 1 190/420","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "B8 facelift 2.0 TDI Evo, 150 pk / 340 Nm met handbak. De 150/360 DSG en eerdere B8-uitvoeringen vallen buiten deze cijfers. MD1CS004 is een gedocumenteerde toepassing; gemonteerde ECU en toegang bevestigen.",
      "B8 facelift 2.0 TDI Evo, 150 hp / 340 Nm with manual gearbox. The 150/360 DSG and earlier B8 versions are outside these figures. MD1CS004 is a documented application; confirm the installed ECU and access.",
      "B8 po liftingu 2.0 TDI Evo, 150 KM / 340 Nm ze skrzynią ręczną. Wersja 150/360 DSG i wcześniejsze B8 są poza tym zakresem. MD1CS004 to udokumentowane zastosowanie; ECU i dostęp wymagają potwierdzenia.",
    ]
  },
  {
    id: "ford-focus-st-20-ecoboost",
    action: "MAKE_CONDITIONAL",
    grade: "B",
    years: [2015,2018],
    generation: "Mk3 facelift",
    version: "Mk3 facelift 250/360 petrol manual",
    ecu: "Bosch MEDG17.0 / MED17.0",
    ecuBasis: "documented-application",
    transmission: "MMT6 6-speed Manual",
    gearbox: "Manual",
    emissionsStandard: "Euro 6",
    stages: {
      "Stage 1": {action:"RANGE",output:[[265,270],[430,440]],provenance:"multi-source",reason:"BR Performance and Shiftech facelift references form the accepted bounded range; Unlimited 485 Nm is excluded.", identityScope: {
        label:{nl:"Mk3 facelift 250/360 benzine met MMT6-handbak",en:"Mk3 facelift 250/360 petrol with MMT6 manual",pl:"Mk3 po liftingu 250/360 benzyna z ręczną skrzynią MMT6"},
        yearRange:[2015,2018],stockTorqueNm:360,generationMarkers:["facelift"],engineFamilyMarkers:["2.0 ecoboost"],transmissionFamilies:["manual"],emissionsMarkers:["euro 6"],fuelGradeMarkers:["premium","ron 98","ron98","98"],excludedFuelGradeMarkers:["e85"]
      }, note: [
        "Indicatie 265–270 pk / 430–440 Nm voor de bevestigde Mk3 facelift 2.0 EcoBoost 250/360 met MMT6-handbak en passende premiumbenzine. E85 valt buiten deze aanbeveling; voertuig- en koppelingsconditie controleren.",
        "265–270 hp / 430–440 Nm indication for the confirmed Mk3 facelift 2.0 EcoBoost 250/360 with MMT6 manual and suitable premium petrol. E85 is excluded; confirm vehicle and clutch condition.",
        "Wartości 265–270 KM / 430–440 Nm dla potwierdzonego Mk3 po liftingu 2.0 EcoBoost 250/360 z ręczną skrzynią MMT6 i odpowiednią benzyną premium. E85 jest wykluczone; stan auta i sprzęgła wymaga kontroli.",
      ]},
      "Stage 2": {action:"CUSTOM",reason:"Facelift Stage 2 output and intake/intercooler/exhaust packages differ materially.",scope:{"fuelRon":[],"hardware":[{"part":"intake","requirement":"check"},{"part":"intercooler","requirement":"check"},{"part":"sport-catalyst","requirement":"check"}]}, note: [
        "Stage 2 is maatwerk. Inlaat, intercooler, emissieconforme uitlaat met sportkatalysator en koppelingsconditie worden per auto afgestemd; deze onderdelen zijn niet automatisch vereist of inbegrepen. Geen TCU-pakket voor de handbak.",
        "Stage 2 is custom. Intake, intercooler, emissions-compliant sport-catalyst exhaust and clutch condition are agreed per car; these parts are not automatically required or included. No TCU package for the manual gearbox.",
        "Stage 2 jest indywidualny. Dolot, intercooler, zgodny z emisją wydech z katalizatorem sportowym i stan sprzęgła ustalamy dla auta; części nie są automatycznie wymagane ani wliczone. Bez pakietu TCU dla skrzyni ręcznej.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory","url":"https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf","scope":"factory-focus","retrievedAt":"2026-10-04","sourceType":"manufacturer","retrievalMethod":"search-index"},
      {"title":"AutoTuner MEDG17.0 application","url":"https://us.autotuner.com/pages/ecu/bosch-medg17-0-tc1797","scope":"Focus Mk3 250/360 application; installed ECU not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"AutoTuner MED17.0 application","url":"https://us.autotuner.com/pages/ecu/bosch-med17-0-tc1767","scope":"Separate Focus 250/360 application; installed ECU not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/ford/focus/2014-mkiii/petrol/2.0-t-ecoboost-st-250","scope":"facelift 250/360 to Stage 1 265/440","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BR facelift","url":"https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/7022-iii-facelift-2014-2018/7872-st-2-0t-ecoboost/","scope":"facelift 250/360 to Stage 1 270/430; E85 excluded","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BR facelift Stage 2","url":"https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/23-ford/1123-focus/7022-iii-facelift-2014-2018/7872-st-2-0t-ecoboost/?stage=6885","scope":"Stage 2 facelift 250/360; intake intercooler sport-catalyst exhaust; no E85","retrievedAt":"2026-10-04","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "Mk3 facelift ST benzine, 2.0 EcoBoost 250 pk / 360 Nm, Euro 6 en MMT6-handbak. MEDG17.0 en MED17.0 zijn gedocumenteerde toepassingen; gemonteerde ECU bevestigen. Premiumbenzine passend bij de kalibratie; geen E85 of TCU-pakket.",
      "Mk3 facelift ST petrol, 2.0 EcoBoost 250 hp / 360 Nm, Euro 6 and MMT6 manual. MEDG17.0 and MED17.0 are documented applications; confirm the installed ECU. Premium petrol appropriate to the calibration; no E85 or TCU package.",
      "Mk3 ST po liftingu, benzyna 2.0 EcoBoost 250 KM / 360 Nm, Euro 6 i ręczna skrzynia MMT6. MEDG17.0 i MED17.0 to udokumentowane zastosowania; ECU wymaga identyfikacji. Benzyna premium odpowiednia do kalibracji; bez E85 i pakietu TCU.",
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
    grade: "B",
    generation: "5F pre-GPF",
    version: "Leon Cupra 5F 300/380 pre-GPF",
    engine: "2.0 TSI Cupra 300",
    stockTorqueNm: 380,
    ecu: "Continental Simos 18.x",
    ecuBasis: "documented-application",
    transmission: "6-speed Manual / 6-speed DSG",
    tcu: "Temic DQ250 MQB",
    tcuBasis: "documented-application",
    emissionsStandard: "Euro 6 pre-GPF",
    stages: {
      "Stage 1": {action:"POINT",output:[350,460],provenance:"multi-source",referenceYearRange:[2017,2018],reason:"Shiftech and VAGTechniek converge on 350/460 from the matching pre-GPF 300/380 configuration.",scope:{"fuelRon":[98],"hardware":[]}, identityScope: {
        label:{nl:"Leon Cupra 5F pre-GPF 300/380 op RON 98",en:"Leon Cupra 5F pre-GPF 300/380 on RON 98",pl:"Leon Cupra 5F pre-GPF 300/380 na RON 98"},
        yearRange:[2017,2018],stockTorqueNm:380,generationMarkers:["pre-gpf"],engineFamilyMarkers:["2.0 tsi"],transmissionFamilies:["manual","dsg6"],emissionsMarkers:["pre-gpf"],fuelRonMin:98,bodyStyleMarkers:["hatch","sc","st"],drivetrainMarkers:["fwd","4drive"]
      }, note: [
        "Indicatie 350 pk / 460 Nm voor de bevestigde Leon Cupra 5F 2017–2018 pre-GPF 300/380 op RON 98. Carrosserie, aandrijving, gemonteerde Simos en handbak/DSG eerst bevestigen; Golf R-waarden worden niet overgenomen.",
        "350 hp / 460 Nm indication for the confirmed 2017–2018 pre-GPF Leon Cupra 5F 300/380 on RON 98. Confirm body, drivetrain, installed Simos and manual/DSG first; Golf R figures are not transferred.",
        "Wartości 350 KM / 460 Nm dla potwierdzonego Leona Cupra 5F 2017–2018 pre-GPF 300/380 na RON 98. Najpierw potwierdzimy nadwozie, napęd, Simos i skrzynię ręczną/DSG; nie przenosimy danych Golfa R.",
      ]},
      "Stage 2": {action:"CUSTOM",reason:"Compatible 368/483 and 390/500 listings use materially different hardware and transmission packages.",scope:{"fuelRon":[98],"hardware":[{"part":"downpipe","requirement":"check"},{"part":"sport-catalyst","requirement":"check"},{"part":"intake","requirement":"check"},{"part":"cooling","requirement":"check"}]}, note: [
        "Stage 2 is maatwerk op RON 98. Downpipe met emissieconforme sportkatalysator, inlaat/filter, koeling en handbak-koppeling of DSG/TCU worden per auto afgestemd. Geen emissieverwijdering; hardware en montage apart.",
        "Stage 2 is custom on RON 98. Agree the downpipe with emissions-compliant sport catalyst, intake/filter, cooling and manual clutch or DSG/TCU per car. No emissions deletion; hardware and installation are separate.",
        "Stage 2 jest indywidualny na RON 98. Downpipe z katalizatorem sportowym zgodnym z emisją, dolot/filtr, chłodzenie oraz sprzęgło ręczne lub DSG/TCU ustalamy dla auta. Bez usuwania emisji; osprzęt i montaż osobno.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory ST","url":"https://mundoseat.seat.com/mediacenter_netstor/seat-media-center/global_site/documents/Leon-Cupra/en/CT_new_SEAT_Leon_ST_CUPRA_300_EN.pdf","scope":"300/380, RON 98, manual/DSG and ST 4Drive factory configurations","retrievedAt":"2026-10-05","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"AutoTuner Simos 18.x applications","url":"https://us.autotuner.com/pages/ecu/continental-simos18-2-tc1791","scope":"300/380 appears across multiple Simos 18.x application pages; exact suffix not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"AutoTuner DQ250 application","url":"https://us.autotuner.com/pages/ecu/temic-dq250-mqb-tc1766","scope":"2017 300/380 application; fitted TCU not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/2.0-tsi-300","scope":"300/380 to Stage 1 350/460","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"VAGTechniek","url":"https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/","scope":"300/380 to Stage 1 350/460; RON 98 and transmission checks","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "Leon Cupra 5F 2017–2018 pre-GPF, 300 pk / 380 Nm op RON 98. Handbak en zestraps DSG bestaan; DQ250 en Simos 18.x zijn gedocumenteerde toepassingen, geen identificatie van gemonteerde units. Carrosserie en aandrijving bevestigen; geen Golf R-overdracht.",
      "2017–2018 pre-GPF Leon Cupra 5F, 300 hp / 380 Nm on RON 98. Manual and six-speed DSG configurations exist; DQ250 and Simos 18.x are documented applications, not identification of fitted units. Confirm body and drivetrain; no Golf R transfer.",
      "Leon Cupra 5F 2017–2018 pre-GPF, 300 KM / 380 Nm na RON 98. Dostępne były skrzynie ręczne i 6-biegowe DSG; DQ250 i Simos 18.x to zastosowania, nie identyfikacja zamontowanych sterowników. Potwierdzimy nadwozie i napęd; bez danych Golfa R.",
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
    grade: "B",
    generation: "F20/F21 LCI",
    version: "F20/F21 LCI 118d 150/320 Dutch scope",
    engine: "2.0 diesel (1,995 cc)",
    stockTorqueNm: 320,
    engineCodes: ["B47"],
    ecu: "Bosch EDC17C50",
    ecuBasis: "documented-application",
    transmission: "6-speed Manual / 8-speed Steptronic",
    tcu: "ZF 8HPxx",
    tcuBasis: "documented-application",
    emissionsStandard: "Euro 6",
    stages: {
      "Stage 1": {action:"POINT",output:[190,400],provenance:"multi-source",referenceYearRange:[2015,2019],reason:"Shiftech, Mosselman and BR Performance converge on 190/400 from the matching F20/F21 LCI 150/320 scope.", identityScope: {
        label:{nl:"Nederlandse F20/F21 LCI 118d 150/320",en:"Dutch F20/F21 LCI 118d 150/320",pl:"holenderski F20/F21 LCI 118d 150/320"},
        yearRange:[2015,2019],stockTorqueNm:320,displacementCc:1995,generationMarkers:["lci"],engineFamilyMarkers:["b47"],transmissionFamilies:["manual","automatic8"],emissionsMarkers:["euro 6"],marketMarkers:["nl","netherlands","nederland","dutch"]
      }, note: [
        "Indicatie 190 pk / 400 Nm voor de bevestigde Nederlandse F20/F21 LCI 118d 150/320. Motor, EDC17C50-toepassing en handbak of achttraps Steptronic eerst identificeren; 330 Nm hoort niet bij dit scope.",
        "190 hp / 400 Nm indication for the confirmed Dutch F20/F21 LCI 118d 150/320. Identify the engine, EDC17C50 application and manual or eight-speed Steptronic first; 330 Nm is outside this scope.",
        "Wartości 190 KM / 400 Nm dla potwierdzonego holenderskiego F20/F21 LCI 118d 150/320. Najpierw identyfikujemy silnik, zastosowanie EDC17C50 i skrzynię ręczną lub 8-biegowy Steptronic; 330 Nm jest poza zakresem.",
      ]},
      "Stage 2": {action:"CUSTOM",reason:"One compatible 200/420 listing does not define a shared diesel hardware, emissions or transmission package.",scope:{"fuelRon":[],"hardware":[]}, note: [
        "Stage 2 is maatwerk. Dieselhardware, intacte emissie-uitrusting en de koppelgrenzen van handbak of achttraps automaat eerst beoordelen; vermogen en prijs op aanvraag.",
        "Stage 2 is custom. Review diesel hardware, retained emissions equipment and manual or eight-speed transmission torque limits first; output and price are on request.",
        "Stage 2 jest indywidualny. Najpierw oceniamy osprzęt diesla, zachowany układ emisji oraz limity skrzyni ręcznej lub 8-biegowego automatu; moc i cena na zapytanie.",
      ]},
      "Stage 3+": customStage3()
    },
    sources: [
      {"title":"factory Netherlands","url":"https://www.press.bmwgroup.com/netherlands/article/attachment/T0200822NL/291912","scope":"Dutch F20/F21 LCI: 1,995 cc, 150/320, manual or optional 8-speed, Euro 6","retrievedAt":"2026-10-05","sourceType":"manufacturer","retrievalMethod":"page"},
      {"title":"AutoTuner EDC17C50 application","url":"https://us.autotuner.com/pages/ecu/bosch-edc17c50-tc1797","scope":"F20-LCI 18d 150/320 application; installed ECU not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"AutoTuner ZF 8HPxx application","url":"https://us.autotuner.com/pages/ecu/zf-8hpxx-sh72549","scope":"matching automatic application; fitted transmission/TCU not identified","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"shiftech","url":"https://www.shiftech.eu/en/chiptuning/car/bmw/1-serie/2015-f20-lci/diesel/18d-150","scope":"150/320 to Stage 1 190/400","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"Mosselman","url":"https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp","scope":"Dutch B47 application 150/320 to Stage 1 190/400","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
      {"title":"BR Performance","url":"https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/5-bmw/508-serie-1/7080-f2x-lci-2015-2019/7088-118d/","scope":"F2x LCI 150/320 to Stage 1 190/400","retrievedAt":"2026-10-05","sourceType":"tuner","retrievalMethod":"page"},
    ],
    note: [
      "Nederlandse F20/F21 LCI 118d, 1.995 cc diesel, 150 pk / 320 Nm, Euro 6. EDC17C50 en ZF 8HPxx zijn gedocumenteerde toepassingen; gemonteerde ECU, handbak/automaat en TCU bevestigen. De oude 330 Nm-waarde geldt niet voor dit scope.",
      "Dutch F20/F21 LCI 118d, 1,995 cc diesel, 150 hp / 320 Nm, Euro 6. EDC17C50 and ZF 8HPxx are documented applications; confirm the installed ECU, manual/automatic transmission and TCU. The old 330 Nm value does not apply to this scope.",
      "Holenderski F20/F21 LCI 118d, diesel 1 995 cm³, 150 KM / 320 Nm, Euro 6. EDC17C50 i ZF 8HPxx to udokumentowane zastosowania; ECU, skrzynia ręczna/automatyczna i TCU wymagają identyfikacji. Stara wartość 330 Nm nie dotyczy tego zakresu.",
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
      referenceYearRange: decision.referenceYearRange,
      identityScope: decision.identityScope,
      customerNote: decision.note ? {nl: decision.note[0], en: decision.note[1], pl: decision.note[2]} : undefined,
      requirements: "Confirm vehicle, fuel, installed hardware, ECU access and transmission before work.",
      customerScope: scope, comparison: undefined, notes: [], packageItems: [],
      hardwareRequired: decision.action === "CUSTOM" || scope.hardware.some(part => part.requirement === "required")};
  });
  return {...vehicle,
    engine: review.engine ?? vehicle.engine, generation: review.generation ?? vehicle.generation,
    version: review.version ?? vehicle.version,
    years, yearRange: review.years ? `${review.years[0]}-${review.years[1]}` : vehicle.yearRange,
    stockTorqueNm: review.unknownStockTorque ? undefined : review.stockTorqueNm ?? vehicle.stockTorqueNm,
    gearbox: review.gearbox ?? vehicle.gearbox,
    emissionsStandard: review.emissionsStandard ?? vehicle.emissionsStandard,
    engineCode: undefined, engineIdentity: {engineCodes, status: engineCodes ? "supported-family" : "manual-review"},
    ecuType: ecu ?? "", ecuSupport: {family: ecu, status: review.ecuBasis === "documented-application" ? "supported-family" : "manual-review",
      basis: review.ecuBasis ?? "unconfirmed"},
    transmissionSupport: {gearboxFamily: review.transmission ?? (vehicle.gearbox === "Manual" ? "Manual" : undefined),
      status: "manual-review", basis: "unconfirmed"},
    tcuType: undefined, tcuSupport: {family: review.tcu, status: review.tcuBasis === "documented-application" ? "supported-family" : "manual-review",
      basis: review.tcuBasis ?? "unconfirmed"},
    technicalEvidence: {sourceType: "internal", sourceReference: "CATALOG_TRUTH_P0_V1_REVIEW.md and CATALOG_TRUTH_P1_V1_REVIEW.md: independent factory, tool and tuner receipts", verifiedAt: "2026-10-05",
      notes: ["Application coverage only; no fitted ECU/TCU identification or access confirmation."]},
    verificationRequired: true, configurationNote: {nl: review.note[0], en: review.note[1], pl: review.note[2]},
    outputReferences: review.sources, stages};
}
