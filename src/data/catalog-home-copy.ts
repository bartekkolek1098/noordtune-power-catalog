import type {Locale} from "@/i18n/routing";

type CatalogPageCopy = {
  partOf: string;
  visitMain: string;
  toolTitle: string;
  toolIntro: string;
  evidence: Array<{number:string;title:string;description:string}>;
  results: {
    eyebrow:string; title:string;intro:string;example:string;
    factory:string;indicative:string;note:string;visitProfile:string;
  };
  featured:{eyebrow:string;title:string;intro:string};
  more:{title:string;intro:string;showAll:string};
  faq:{eyebrow:string;title:string;intro:string;questions:Array<{question:string;answer:string}>};
  handoff:{eyebrow:string;title:string;intro:string;aboutCatalog:string;main:string;chiptuning:string};
};

export const catalogHomeCopy: Record<Locale,CatalogPageCopy> = {
  nl:{
    partOf:"De vermogenscatalogus van NoordTune.nl",
    visitMain:"Naar NoordTune.nl",
    toolTitle:"Wat vind je in deze catalogus?",
    toolIntro:"Eén plek voor fabrieksgegevens, beschikbare motorprofielen en een onderbouwde Stage 1-indicatie. Voor diensten, werkzaamheden en afspraken ga je naar de hoofdwebsite van NoordTune.",
    evidence:[
      {number:"01",title:"Voertuiggegevens via RDW",description:"Controleer eerst de geregistreerde uitvoering, brandstof, cilinderinhoud en het fabrieksvermogen."},
      {number:"02",title:"Stage 1 met bronvermelding",description:"Waar onafhankelijke publicaties bij de juiste motorvariant passen, tonen we een indicatieve vermogens- en koppelrange."},
      {number:"03",title:"Geen passende cijfers? Geen gok.",description:"Als motorcode, ECU of transmissie niet vaststaat, blijven cijfers achterwege en kan NoordTune de auto individueel beoordelen."}
    ],
    results:{
      eyebrow:"ZO LEES JE EEN PROFIEL",
      title:"Van fabrieksspecificatie naar Stage 1-indicatie",
      intro:"Een voorbeeld uit de catalogus: BMW 320d met B47-motor. De waarden gelden voor het beschreven motorprofiel en zijn geen meting aan jouw specifieke auto.",
      example:"BMW 320d · 2.0d B47",factory:"Origineel (fabriek)",indicative:"Stage 1 · indicatief",
      note:"De werkelijke uitkomst hangt af van motorcode, ECU-software, transmissie en technische staat. Stage 2 is maatwerk en krijgt niet automatisch een vermogensbelofte.",
      visitProfile:"Bekijk dit voertuigprofiel"
    },
    featured:{eyebrow:"VOERTUIGPROFIELEN",title:"Veelbekeken auto's",intro:"Open een motorprofiel om het oorspronkelijke vermogen, beschikbare Stage-pagina's en de aandachtspunten te vergelijken."},
    more:{title:"Meer voertuigprofielen",intro:"Ook onderstaande motoren hebben een eigen cataloguspagina. Staat jouw uitvoering er niet bij? Gebruik de kentekencheck of kies merk, model, bouwjaar en motor.",showAll:"Toon alle overige voertuigprofielen"},
    faq:{eyebrow:"OVER DE CATALOGUS",title:"Veelgestelde vragen",intro:"Heldere antwoorden over herkomst, betrouwbaarheid en de grenzen van tuningindicaties.",questions:[
      {question:"Welke gegevens komen van RDW?",answer:"We gebruiken openbare RDW-voertuiggegevens, zoals merk, type, brandstof en geregistreerd vermogen. Een kenteken alleen bevestigt niet de geïnstalleerde ECU of exacte motorgeneratie."},
      {question:"Is de vermogenswinst van Stage 1 gegarandeerd?",answer:"Nee. Getoonde Stage 1-waarden zijn referenties uit gedocumenteerde tuningpublicaties of beoordeelde profielen. Het werkelijke resultaat verschilt per motor, ECU, transmissie en technische staat."},
      {question:"Waarom zie ik bij sommige auto's geen Stage 1-cijfers?",answer:"Als we niet zeker genoeg weten welke motorconfiguratie of bron bij de auto past, tonen we liever alleen de fabrieksgegevens. Een individuele beoordeling kan dan uitkomst bieden."},
      {question:"Kan ik ook zonder Nederlands kenteken zoeken?",answer:"Ja. Met de handmatige selectie kies je merk, model, bouwjaar en motor. Dit is een referentieprofiel: controle van de echte auto blijft noodzakelijk."},
      {question:"Waar vind ik diensten, prijzen of een afspraak?",answer:"Op NoordTune.nl vind je de informatie over chiptuning, diagnose, prijzen en afspraken. Deze subsite is uitsluitend bedoeld voor het ontdekken en vergelijken van voertuigprofielen."}
    ]},
    handoff:{eyebrow:"NOORDTUNE.NL",title:"Van informatie naar professioneel advies",intro:"De catalogus helpt je het juiste voertuigprofiel te vinden. Diagnose, uitvoering, tarieven en afspraken verlopen via de officiële hoofdwebsite.",aboutCatalog:"Dit is een aparte vermogenscatalogus, geen vervanging van de NoordTune-website.",main:"Ga naar NoordTune.nl",chiptuning:"Bekijk chiptuning"}
  },
  en:{
    partOf:"The power catalog by NoordTune.nl",
    visitMain:"Visit NoordTune.nl",
    toolTitle:"What is in this catalog?",
    toolIntro:"One place for factory specifications, engine profiles and evidence-based Stage 1 indications. Visit NoordTune.nl for workshop services, pricing and appointments.",
    evidence:[
      {number:"01",title:"Vehicle facts from RDW",description:"Start with the registered vehicle version, fuel, displacement and factory power."},
      {number:"02",title:"Source-linked Stage 1",description:"Where published tuning figures fit a properly scoped engine variant, we show indicative power and torque ranges."},
      {number:"03",title:"No evidence? No invented figures.",description:"If the engine generation, ECU or transmission is uncertain, numeric gains are withheld pending a workshop assessment."}
    ],
    results:{eyebrow:"HOW TO READ A PROFILE",title:"From factory output to a Stage 1 indication",intro:"An example from the catalog: BMW 320d with the B47 engine. Figures describe a reviewed engine profile, not a measurement of your individual car.",example:"BMW 320d · 2.0d B47",factory:"Factory output",indicative:"Stage 1 · indicative",note:"Actual results depend on engine code, ECU software, transmission and condition. Stage 2 requires individual assessment rather than automatic power promises.",visitProfile:"Explore this vehicle profile"},
    featured:{eyebrow:"VEHICLE PROFILES",title:"Popular vehicles",intro:"Open an engine profile to compare factory power, the available Stage pages and relevant verification notes."},
    more:{title:"More vehicle profiles",intro:"These engines also have their own catalog pages. Can't find yours? Use the plate check or select make, model, year and engine.",showAll:"Show all other vehicle profiles"},
    faq:{eyebrow:"ABOUT THE CATALOG",title:"Frequently asked questions",intro:"Clear answers about evidence, accuracy and the limits of tuning indications.",questions:[
      {question:"Which data comes from RDW?",answer:"We use public Dutch RDW vehicle data, such as make, technical type, fuel and registered power. A license plate alone does not identify installed ECU firmware or every engine generation."},
      {question:"Are Stage 1 gains guaranteed?",answer:"No. Stage 1 figures are indications based on documented tuner publications or reviewed engine profiles. Real output depends on the engine, ECU, transmission and vehicle condition."},
      {question:"Why do some cars have no Stage 1 figures?",answer:"When there is insufficient evidence to identify the exact engine or match a source responsibly, only factory data is shown. NoordTune can assess the car individually."},
      {question:"Can I search without a Dutch plate?",answer:"Yes. Choose the make, model, registration year and engine manually. Such catalog matches remain references until checked against the actual vehicle."},
      {question:"Where can I book services or find prices?",answer:"NoordTune.nl is the official site for chiptuning, diagnostics, pricing and appointments. This subsite is for discovering and comparing vehicle profiles."}
    ]},
    handoff:{eyebrow:"NOORDTUNE.NL",title:"From information to expert advice",intro:"Use the catalog to identify the right engine profile. Diagnosis, calibration, prices and appointments are handled by NoordTune's main website.",aboutCatalog:"This is a dedicated power catalog, not a replacement for the main NoordTune website.",main:"Visit NoordTune.nl",chiptuning:"Explore chiptuning"}
  },
  pl:{
    partOf:"Katalog mocy NoordTune.nl",
    visitMain:"Odwiedź NoordTune.nl",
    toolTitle:"Co znajdziesz w katalogu?",
    toolIntro:"Dane fabryczne, profile silników i udokumentowane orientacyjne wyniki Stage 1. Usługi warsztatowe, ceny i terminy znajdują się na głównej stronie NoordTune.nl.",
    evidence:[
      {number:"01",title:"Dane pojazdu z RDW",description:"Najpierw sprawdź wersję techniczną, paliwo, pojemność i fabryczną moc."},
      {number:"02",title:"Stage 1 ze źródłami",description:"Gdy publikacje dotyczą dokładnie właściwego wariantu silnika, pokazujemy orientacyjny zakres mocy i momentu."},
      {number:"03",title:"Brak pewności? Bez zgadywania.",description:"Jeśli silnik, ECU lub skrzynia nie są potwierdzone, nie podajemy wymyślonych przyrostów. Pozostaje indywidualna ocena."}
    ],
    results:{eyebrow:"JAK CZYTAĆ PROFIL",title:"Od mocy fabrycznej do wskazań Stage 1",intro:"Przykład z katalogu: BMW 320d z silnikiem B47. Wyniki dotyczą opisanego profilu, a nie pomiaru konkretnego egzemplarza.",example:"BMW 320d · 2.0d B47",factory:"Moc fabryczna",indicative:"Stage 1 · orientacyjnie",note:"Rzeczywisty wynik zależy od silnika, ECU, skrzyni i stanu auta. Stage 2 wymaga indywidualnej oceny — bez automatycznych obietnic.",visitProfile:"Zobacz profil pojazdu"},
    featured:{eyebrow:"PROFILE AUT",title:"Popularne samochody",intro:"Otwórz profil silnika i porównaj moc fabryczną, dostępne strony Stage oraz wymagane sprawdzenia."},
    more:{title:"Więcej profili pojazdów",intro:"Te silniki mają osobne strony katalogowe. Brakuje Twojego auta? Wyszukaj je po numerze RDW lub wybierz markę, model, rocznik i silnik.",showAll:"Pokaż wszystkie pozostałe profile"},
    faq:{eyebrow:"O KATALOGU",title:"Najczęstsze pytania",intro:"Konkretnie o danych, źródłach i granicach szacunków.",questions:[
      {question:"Jakie informacje pochodzą z RDW?",answer:"Używamy publicznych danych holenderskiego RDW: marki, typu, paliwa i zarejestrowanej mocy. Sam numer tablicy nie potwierdza wersji ECU ani dokładnej generacji silnika."},
      {question:"Czy przyrosty Stage 1 są gwarantowane?",answer:"Nie. To wartości orientacyjne oparte na publikacjach tunerów lub zweryfikowanych profilach. Wynik zależy od silnika, ECU, skrzyni i stanu technicznego."},
      {question:"Dlaczego nie każde auto ma wynik Stage 1?",answer:"Nie przypisujemy danych, gdy brakuje wiarygodnych źródeł lub identyfikacja silnika jest niepewna. Wtedy pokazujemy dane fabryczne i opcję indywidualnej wyceny."},
      {question:"Czy można szukać bez holenderskiej rejestracji?",answer:"Tak. Wybierz markę, model, rocznik i silnik. Jest to profil referencyjny; rzeczywisty samochód trzeba później sprawdzić."},
      {question:"Gdzie są usługi, ceny i rezerwacje?",answer:"Główna strona NoordTune.nl zawiera ofertę chiptuningu, diagnostyki, ceny i kontakt. Ta subdomena służy tylko do przeglądania profili samochodów."}
    ]},
    handoff:{eyebrow:"NOORDTUNE.NL",title:"Od danych do profesjonalnej konsultacji",intro:"Katalog pomaga znaleźć właściwą konfigurację. Diagnoza, modyfikacje, ceny i terminy są obsługiwane przez główną stronę NoordTune.",aboutCatalog:"To osobny katalog mocy — nie zastępuje oficjalnej witryny NoordTune.nl.",main:"Przejdź do NoordTune.nl",chiptuning:"Sprawdź chiptuning"}
  }
};
