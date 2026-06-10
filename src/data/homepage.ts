import type {Locale} from "@/i18n/routing";

type LocalizedText = Record<Locale, string>;

export type PerformanceBanner = {
  id: string;
  image: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  stat: LocalizedText;
  accent: string;
};

export type PopularCar = {
  id: string;
  title: string;
  platform: string;
  image: string;
  detailId: string;
  stageLine: LocalizedText;
  note: LocalizedText;
};

export type HomeVisualCopy = {
  nav: string[];
  phone: string;
  heroKicker: string;
  heroLineA: string;
  heroLineB: string;
  heroLineC: string;
  heroIntro: string;
  manualPanelTitle: string;
  manualPanelText: string;
  featureA: {title: string; text: string};
  featureB: {title: string; text: string};
  featureC: {title: string; text: string};
  exampleEyebrow: string;
  exampleHeadingA: string;
  exampleHeadingB: string;
  exampleTitle: string;
  exampleIntro: string;
  facts: {
    plate: string;
    year: string;
    transmission: string;
    fuel: string;
    automatic: string;
  };
  powerUnit: string;
  standard: string;
  available: string;
  onRequest: string;
  individualQuote: string;
  yourSelection: string;
  priceIndication: string;
  requestQuote: string;
  bookAppointment: string;
  extraOptions: string;
  disclaimer: string;
  howTitleA: string;
  howTitleB: string;
  process: Array<{title: string; text: string}>;
  faqTitleA: string;
  faqTitleB: string;
  faq: Array<{question: string; answer: string}>;
  trust: Array<{title: string; text: string}>;
  footerText: string;
  footerTagline: string;
  contactTitle: string;
  location: string;
  hoursTitle: string;
  hoursWeek: string;
  hoursSunday: string;
  areaTitle: string;
  areaText: string;
  rights: string;
  terms: string;
  privacy: string;
};

export const homeVisualCopy: Record<Locale, HomeVisualCopy> = {
  nl: {
    nav: ["HOME", "KATALOGUS", "DIAGNOSE", "WERKWIJZE", "RESULTATEN", "OVER ONS", "CONTACT"],
    phone: "+31 685 759 600",
    heroKicker: "RDW VERMOGENSCATALOGUS",
    heroLineA: "Controleer de",
    heroLineB: "tuning­mogelijkheden",
    heroLineC: "van jouw auto.",
    heroIntro:
      "NoordTune combineert RDW-gegevens met een professionele tuningcatalogus. Bekijk direct mogelijkheden voor Stage 1 / 2 / 3+, DPF / AdBlue / EGR, DSG / TCU tuning en ontvang een indicatie op maat.",
    manualPanelTitle: "Of kies jouw auto handmatig",
    manualPanelText:
      "Voor klanten buiten Nederland: kies merk, model, bouwjaar en motor zonder Nederlands kenteken.",
    featureA: {
      title: "RDW-gegevens",
      text: "We halen betrouwbare voertuiggegevens rechtstreeks op via de RDW-database."
    },
    featureB: {
      title: "Stage 1 / 2 / 3+",
      text: "Bekijk alle beschikbare stages en prestatieniveaus voor jouw motor."
    },
    featureC: {
      title: "Directe prijsindicatie",
      text: "Ontvang direct een prijsindicatie of vraag een offerte op maat aan."
    },
    exampleEyebrow: "Voorbeeldresultaat",
    exampleHeadingA: "Voorbeeld",
    exampleHeadingB: "resultaat",
    exampleTitle: "BMW 320d",
    exampleIntro: "Gebaseerd op RDW-gegevens en onze tuningcatalogus.",
    facts: {
      plate: "Kenteken",
      year: "Bouwjaar",
      transmission: "Transmissie",
      fuel: "Brandstof",
      automatic: "Automaat"
    },
    powerUnit: "pk",
    standard: "Standaard (fabriek)",
    available: "Beschikbaar",
    onRequest: "Op aanvraag",
    individualQuote: "Individuele offerte",
    yourSelection: "Jouw selectie",
    priceIndication: "Prijsindicatie",
    requestQuote: "Vraag offerte aan",
    bookAppointment: "Plan afspraak",
    extraOptions: "Extra opties",
    disclaimer:
      "Vermogenswinst is afhankelijk van type motor, transmissie en brandstof. Bovenstaande waarden zijn indicaties.",
    howTitleA: "Hoe werkt",
    howTitleB: "het?",
    process: [
      {title: "Kenteken invoeren", text: "Vul je kenteken in of kies je auto handmatig."},
      {title: "RDW-gegevens ophalen", text: "We halen voertuiggegevens veilig op via de RDW."},
      {title: "Tuning bekijken", text: "Bekijk stages, opties en prijsindicaties voor jouw auto."},
      {title: "Offerte aanvragen", text: "Vraag eenvoudig een offerte aan of plan direct een afspraak."}
    ],
    faqTitleA: "Veelgestelde",
    faqTitleB: "vragen",
    faq: [
      {
        question: "Is chiptuning veilig voor mijn motor?",
        answer:
          "Ja, mits de software wordt afgestemd op de staat van de auto, de motorcode en de originele marges. NoordTune werkt met diagnose, logging en conservatieve waarden voor dagelijks betrouwbaar gebruik."
      },
      {
        question: "Blijft mijn fabrieksgarantie behouden?",
        answer:
          "Een softwareaanpassing kan invloed hebben op fabrieks- of dealergarantie. We leggen vooraf duidelijk uit wat er wordt aangepast, zodat je een bewuste keuze kunt maken."
      },
      {
        question: "Wat is het verschil tussen Stage 1, 2 en 3+?",
        answer:
          "Stage 1 is software op een standaard auto. Stage 2 vraagt meestal hardware zoals downpipe, intake of intercooler. Stage 3+ is maatwerk met grotere turbo, brandstof- of koelingupgrades."
      },
      {
        question: "Wat zijn DPF, EGR en AdBlue opties?",
        answer:
          "Dit zijn emissie- en uitlaatgerelateerde systemen. We adviseren per auto wat technisch mogelijk is en vermelden altijd dat gebruik op de openbare weg aan lokale regelgeving moet voldoen."
      },
      {
        question: "Hoe lang duurt een tuning?",
        answer:
          "Een standaard Stage 1 met diagnose duurt meestal enkele uren. Complexere werkzaamheden, TCU-tuning of aanvullende opties plannen we op basis van voertuig en gewenste setup."
      }
    ],
    trust: [
      {title: "Expertise", text: "Jarenlange ervaring in chiptuning en diagnose."},
      {title: "Maatwerk", text: "Elke tuning wordt afgestemd op jouw auto en wensen."},
      {title: "Kwaliteit", text: "Veilige en betrouwbare oplossingen met oog voor duurzaamheid."},
      {title: "Resultaat", text: "Merkbaar meer vermogen, koppel en rijplezier."}
    ],
    footerText:
      "De specialist in professionele chiptuning en auto diagnostiek. Meer vermogen, betere prestaties en optimale betrouwbaarheid.",
    footerTagline: "Chiptuning & Auto Diagnostiek",
    contactTitle: "Contact",
    location: "Assen, Nederland",
    hoursTitle: "Openingstijden",
    hoursWeek: "Ma - Za: 09:00 - 18:00",
    hoursSunday: "Zondag: Gesloten",
    areaTitle: "Ons werkgebied",
    areaText: "Assen & omgeving",
    rights: "Alle rechten voorbehouden",
    terms: "Algemene voorwaarden",
    privacy: "Privacybeleid"
  },
  en: {
    nav: ["HOME", "POWER CATALOG", "DIAGNOSTICS", "PROCESS", "RESULTS", "ABOUT", "CONTACT"],
    phone: "+31 685 759 600",
    heroKicker: "RDW POWER CATALOG",
    heroLineA: "Check your car's",
    heroLineB: "tuning potential",
    heroLineC: "instantly.",
    heroIntro:
      "NoordTune combines RDW vehicle data with a professional tuning catalog. Instantly view Stage 1 / 2 / 3+, DPF / AdBlue / EGR, DSG / TCU tuning options and receive a tailored indication.",
    manualPanelTitle: "Or choose your car manually",
    manualPanelText:
      "For customers outside the Netherlands: choose make, model, year and engine without a Dutch plate.",
    featureA: {
      title: "RDW data",
      text: "We retrieve reliable vehicle data directly from the RDW database."
    },
    featureB: {
      title: "Stage 1 / 2 / 3+",
      text: "View available stages and performance levels for your engine."
    },
    featureC: {
      title: "Instant price indication",
      text: "Receive a direct indication or request a custom quote."
    },
    exampleEyebrow: "Example result",
    exampleHeadingA: "Example ",
    exampleHeadingB: "result",
    exampleTitle: "BMW 320d",
    exampleIntro: "Based on RDW data and our tuning catalog.",
    facts: {
      plate: "Plate",
      year: "Year",
      transmission: "Transmission",
      fuel: "Fuel",
      automatic: "Automatic"
    },
    powerUnit: "hp",
    standard: "Standard (factory)",
    available: "Available",
    onRequest: "On request",
    individualQuote: "Individual quote",
    yourSelection: "Your selection",
    priceIndication: "Price indication",
    requestQuote: "Request quote",
    bookAppointment: "Book appointment",
    extraOptions: "Extra options",
    disclaimer:
      "Power gains depend on engine type, transmission and fuel. Values shown are indicative.",
    howTitleA: "How does",
    howTitleB: "it work?",
    process: [
      {title: "Enter plate", text: "Enter your Dutch plate or choose your car manually."},
      {title: "Fetch RDW data", text: "We securely retrieve vehicle data through RDW."},
      {title: "View tuning", text: "Review stages, options and price indications for your car."},
      {title: "Request quote", text: "Request a quote or directly plan an appointment."}
    ],
    faqTitleA: "Frequently asked",
    faqTitleB: "questions",
    faq: [
      {
        question: "Is chiptuning safe for my engine?",
        answer:
          "Yes, when the calibration is matched to the vehicle condition, engine code and factory safety margins. NoordTune uses diagnostics, logs and conservative values for reliable daily driving."
      },
      {
        question: "Will factory warranty remain valid?",
        answer:
          "Software changes can affect manufacturer or dealer warranty. We explain the work clearly before tuning, so you can make an informed decision."
      },
      {
        question: "What is the difference between Stage 1, 2 and 3+?",
        answer:
          "Stage 1 is software for a standard car. Stage 2 usually requires hardware such as a downpipe, intake or intercooler. Stage 3+ is custom work with larger turbo, fuel or cooling upgrades."
      },
      {
        question: "What are DPF, EGR and AdBlue options?",
        answer:
          "These are exhaust and emissions-related systems. We advise per vehicle what is technically possible and always note that road use must comply with local regulations."
      },
      {
        question: "How long does tuning take?",
        answer:
          "A normal Stage 1 with diagnostics usually takes a few hours. More complex work, TCU tuning or extra options are planned based on the vehicle and requested setup."
      }
    ],
    trust: [
      {title: "Expertise", text: "Years of experience in chiptuning and diagnostics."},
      {title: "Custom work", text: "Every tune is matched to your car and goals."},
      {title: "Quality", text: "Reliable solutions with durability in mind."},
      {title: "Result", text: "Noticeably more power, torque and driving pleasure."}
    ],
    footerText:
      "Specialist in professional chiptuning and vehicle diagnostics. More power, better performance and optimal reliability.",
    footerTagline: "Chiptuning & Vehicle Diagnostics",
    contactTitle: "Contact",
    location: "Assen, Netherlands",
    hoursTitle: "Opening hours",
    hoursWeek: "Mon - Sat: 09:00 - 18:00",
    hoursSunday: "Sunday: Closed",
    areaTitle: "Service area",
    areaText: "Assen & region",
    rights: "All rights reserved",
    terms: "Terms and conditions",
    privacy: "Privacy policy"
  },
  pl: {
    nav: ["HOME", "KATALOG MOCY", "DIAGNOSTYKA", "JAK DZIAŁAMY", "WYNIKI", "O NAS", "KONTAKT"],
    phone: "+31 685 759 600",
    heroKicker: "KATALOG MOCY RDW",
    heroLineA: "Sprawdź",
    heroLineB: "możliwości tuningu",
    heroLineC: "swojego auta.",
    heroIntro:
      "NoordTune łączy dane RDW z profesjonalnym katalogiem tuningu. Od razu sprawdzisz Stage 1 / 2 / 3+, DPF / AdBlue / EGR, tuning DSG / TCU i otrzymasz indywidualną wycenę.",
    manualPanelTitle: "Lub wybierz auto ręcznie",
    manualPanelText:
      "Dla klientów spoza Holandii: wybierz markę, model, rok i silnik bez holenderskiej tablicy.",
    featureA: {
      title: "Dane RDW",
      text: "Pobieramy wiarygodne dane pojazdu bezpośrednio z bazy RDW."
    },
    featureB: {
      title: "Stage 1 / 2 / 3+",
      text: "Zobacz dostępne stage i poziomy osiągów dla swojego silnika."
    },
    featureC: {
      title: "Szybka cena orientacyjna",
      text: "Otrzymaj od razu orientacyjną cenę albo poproś o wycenę."
    },
    exampleEyebrow: "Przykładowy wynik",
    exampleHeadingA: "Przykładowy ",
    exampleHeadingB: "wynik",
    exampleTitle: "BMW 320d",
    exampleIntro: "Na podstawie danych RDW i naszego katalogu tuningu.",
    facts: {
      plate: "Tablica",
      year: "Rok",
      transmission: "Skrzynia",
      fuel: "Paliwo",
      automatic: "Automat"
    },
    powerUnit: "KM",
    standard: "Seria (fabryka)",
    available: "Dostępne",
    onRequest: "Na zapytanie",
    individualQuote: "Indywidualna wycena",
    yourSelection: "Twój wybór",
    priceIndication: "Cena orientacyjna",
    requestQuote: "Poproś o wycenę",
    bookAppointment: "Umów termin",
    extraOptions: "Opcje dodatkowe",
    disclaimer:
      "Przyrost mocy zależy od typu silnika, skrzyni i paliwa. Pokazane wartości są orientacyjne.",
    howTitleA: "Jak to",
    howTitleB: "działa?",
    process: [
      {title: "Wpisz tablicę", text: "Wpisz holenderską tablicę albo wybierz auto ręcznie."},
      {title: "Pobieramy dane RDW", text: "Bezpiecznie pobieramy dane pojazdu z RDW."},
      {title: "Sprawdź tuning", text: "Zobacz stage, opcje i orientacyjne ceny dla auta."},
      {title: "Poproś o wycenę", text: "Poproś o ofertę albo od razu umów termin."}
    ],
    faqTitleA: "Najczęstsze",
    faqTitleB: "pytania",
    faq: [
      {
        question: "Czy chiptuning jest bezpieczny dla silnika?",
        answer:
          "Tak, jeśli program jest dopasowany do stanu auta, kodu silnika i fabrycznych marginesów bezpieczeństwa. NoordTune pracuje na diagnostyce, logach i rozsądnych wartościach do codziennej jazdy."
      },
      {
        question: "Czy gwarancja fabryczna zostaje zachowana?",
        answer:
          "Zmiana oprogramowania może mieć wpływ na gwarancję producenta lub dealera. Przed wykonaniem usługi jasno tłumaczymy zakres zmian, aby decyzja była świadoma."
      },
      {
        question: "Czym różni się Stage 1, 2 i 3+?",
        answer:
          "Stage 1 to samo oprogramowanie w seryjnym aucie. Stage 2 zwykle wymaga osprzętu, np. downpipe, dolotu lub intercoolera. Stage 3+ to indywidualny projekt z większą turbiną, paliwem lub chłodzeniem."
      },
      {
        question: "Czym są opcje DPF, EGR i AdBlue?",
        answer:
          "To systemy związane z emisją spalin i układem wydechowym. Dla każdego auta doradzamy, co jest technicznie możliwe, pamiętając o zgodności użytkowania z lokalnymi przepisami."
      },
      {
        question: "Ile trwa tuning?",
        answer:
          "Standardowy Stage 1 z diagnostyką zajmuje zwykle kilka godzin. Bardziej złożone prace, tuning TCU lub dodatkowe opcje planujemy indywidualnie pod konkretne auto."
      }
    ],
    trust: [
      {title: "Doświadczenie", text: "Lata doświadczenia w chiptuningu i diagnostyce."},
      {title: "Indywidualnie", text: "Każdy tuning dopasowujemy do auta i celu."},
      {title: "Jakość", text: "Bezpieczne rozwiązania z myślą o trwałości."},
      {title: "Rezultat", text: "Odczuwalnie więcej mocy, momentu i przyjemności z jazdy."}
    ],
    footerText:
      "Specjalista od profesjonalnego chiptuningu i diagnostyki. Więcej mocy, lepsze osiągi i optymalna niezawodność.",
    footerTagline: "Chiptuning i diagnostyka samochodowa",
    contactTitle: "Kontakt",
    location: "Assen, Holandia",
    hoursTitle: "Godziny otwarcia",
    hoursWeek: "Pon. - Sob.: 09:00 - 18:00",
    hoursSunday: "Niedziela: zamknięte",
    areaTitle: "Obszar działania",
    areaText: "Assen i okolice",
    rights: "Wszelkie prawa zastrzeżone",
    terms: "Regulamin",
    privacy: "Polityka prywatności"
  }
};

export const homepageHeroImage = "/brand/v8/hero-performance-bg.png";

export const performanceBanners: PerformanceBanner[] = [
  {
    id: "diesel-torque",
    image: "/brand/v8/banner-car-speed.png",
    title: {
      nl: "Diesel koppel, veilig opgebouwd",
      en: "Diesel torque, built safely",
      pl: "Moment diesla, zbudowany bezpiecznie"
    },
    subtitle: {
      nl: "BMW 320d / 330d, Passat 2.0 TDI en Audi TDI platforms met diagnose, logs en maatwerk file.",
      en: "BMW 320d / 330d, Passat 2.0 TDI and Audi TDI platforms with diagnostics, logs and a custom file.",
      pl: "BMW 320d / 330d, Passat 2.0 TDI i Audi TDI z diagnostyką, logami i indywidualnym plikiem."
    },
    stat: {
      nl: "+35-70 pk",
      en: "+35-70 hp",
      pl: "+35-70 KM"
    },
    accent: "Stage 1"
  },
  {
    id: "vag-petrol",
    image: "/brand/v8/banner-gauge-red.png",
    title: {
      nl: "GTI, R, Cupra en RS platforms",
      en: "GTI, R, Cupra and RS platforms",
      pl: "Platformy GTI, R, Cupra i RS"
    },
    subtitle: {
      nl: "EA888 2.0 TSI met DSG/TCU opties, launch control en conservatieve temperatuurcontrole.",
      en: "EA888 2.0 TSI with DSG/TCU options, launch control and conservative temperature control.",
      pl: "EA888 2.0 TSI z opcjami DSG/TCU, launch control i ostrożną kontrolą temperatur."
    },
    stat: {
      nl: "300-370 pk",
      en: "300-370 hp",
      pl: "300-370 KM"
    },
    accent: "VAG"
  },
  {
    id: "premium-sport",
    image: "/brand/v8/banner-workshop-red.png",
    title: {
      nl: "Premium performance zonder gokwerk",
      en: "Premium performance without guesswork",
      pl: "Premium performance bez zgadywania"
    },
    subtitle: {
      nl: "Porsche, AMG, BMW en Audi worden eerst gematcht op ECU, brandstof, vermogen en platform.",
      en: "Porsche, AMG, BMW and Audi are first matched by ECU, fuel, power and platform.",
      pl: "Porsche, AMG, BMW i Audi najpierw dopasowujemy po ECU, paliwie, mocy i platformie."
    },
    stat: {
      nl: "Maatwerk",
      en: "Custom",
      pl: "Indywidualnie"
    },
    accent: "ECU / TCU"
  }
];

export const popularCars: PopularCar[] = [
  {
    id: "bmw-3-series",
    title: "BMW 3 Series",
    platform: "E90/E91/E92/F30 320d / 330d",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80",
    detailId: "bmw-320d-b47",
    stageLine: {
      nl: "163-190 pk → Stage 1: 210-230 pk",
      en: "163-190 hp → Stage 1: 210-230 hp",
      pl: "163-190 KM → Stage 1: 210-230 KM"
    },
    note: {
      nl: "Zeer populair voor koppel en dagelijks rijcomfort.",
      en: "Very popular for torque and daily drivability.",
      pl: "Bardzo popularny wybór dla momentu i jazdy na co dzień."
    }
  },
  {
    id: "vw-golf",
    title: "VW Golf GTI / R",
    platform: "Mk7 / Mk7.5 EA888 2.0 TSI",
    image:
      "https://images.unsplash.com/photo-1769968313283-d6336681ce8b?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "vw-golf-20-tsi-ea888",
    stageLine: {
      nl: "230-310 pk → Stage 1: 300-370 pk",
      en: "230-310 hp → Stage 1: 300-370 hp",
      pl: "230-310 KM → Stage 1: 300-370 KM"
    },
    note: {
      nl: "DSG/TCU, launch en Stage 2 hardware maken veel verschil.",
      en: "DSG/TCU, launch and Stage 2 hardware make a big difference.",
      pl: "DSG/TCU, launch i hardware Stage 2 robią dużą różnicę."
    }
  },
  {
    id: "audi-a4-a6",
    title: "Audi A4 / A6",
    platform: "B8/B9 2.0 TDI",
    image:
      "https://images.unsplash.com/photo-1570327180806-652d03d8b8ba?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "audi-a4-2-0-tdi-2020",
    stageLine: {
      nl: "150-190 pk → Stage 1: 185-230 pk",
      en: "150-190 hp → Stage 1: 185-230 hp",
      pl: "150-190 KM → Stage 1: 185-230 KM"
    },
    note: {
      nl: "Sterke allround diesel voor snelweg en trekgewicht.",
      en: "Strong all-round diesel for motorway use and towing.",
      pl: "Mocny diesel do tras, autostrad i holowania."
    }
  },
  {
    id: "mercedes-c-class",
    title: "Mercedes C-Class",
    platform: "W205 220d / 250d",
    image:
      "https://images.unsplash.com/photo-1624863135932-ce9877948c59?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "mercedes-benz-c-klasse-220d-2020",
    stageLine: {
      nl: "170-204 pk → Stage 1: 210-245 pk",
      en: "170-204 hp → Stage 1: 210-245 hp",
      pl: "170-204 KM → Stage 1: 210-245 KM"
    },
    note: {
      nl: "Soepele automaat, veel koppel en nette gasrespons.",
      en: "Smooth automatic, strong torque and clean throttle response.",
      pl: "Płynny automat, dużo momentu i lepsza reakcja gazu."
    }
  },
  {
    id: "vw-passat",
    title: "VW Passat B8",
    platform: "2.0 TDI DSG",
    image:
      "https://images.unsplash.com/photo-1751079038497-0de0540a4546?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "volkswagen-passat-2-0-tdi-2020",
    stageLine: {
      nl: "150-190 pk → Stage 1: 185-230 pk",
      en: "150-190 hp → Stage 1: 185-230 hp",
      pl: "150-190 KM → Stage 1: 185-230 KM"
    },
    note: {
      nl: "Zakelijke kilometerauto met grote Stage 1 winst.",
      en: "Business-mileage car with a strong Stage 1 gain.",
      pl: "Auto flotowe z wyraźnym przyrostem Stage 1."
    }
  },
  {
    id: "bmw-5-series",
    title: "BMW 5 Series",
    platform: "F10/F11 530d",
    image:
      "https://images.unsplash.com/photo-1746393464070-e2834fbfd43e?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "bmw-5-serie-330d-2020",
    stageLine: {
      nl: "245-258 pk → Stage 1: 300-315 pk",
      en: "245-258 hp → Stage 1: 300-315 hp",
      pl: "245-258 KM → Stage 1: 300-315 KM"
    },
    note: {
      nl: "Veel gevraagd voor ZF tuning en sterk middengebied.",
      en: "Often requested for ZF tuning and strong mid-range torque.",
      pl: "Często wybierany pod tuning ZF i mocny środek obrotów."
    }
  },
  {
    id: "audi-a3-s3",
    title: "Audi A3 / S3",
    platform: "8V TDI / TFSI",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    detailId: "audi-a3-20-tdi",
    stageLine: {
      nl: "150-310 pk → Stage 1: 185-370 pk",
      en: "150-310 hp → Stage 1: 185-370 hp",
      pl: "150-310 KM → Stage 1: 185-370 KM"
    },
    note: {
      nl: "Compact platform, veel ECU/DSG mogelijkheden.",
      en: "Compact platform with many ECU/DSG possibilities.",
      pl: "Kompaktowa platforma z wieloma opcjami ECU/DSG."
    }
  },
  {
    id: "porsche",
    title: "Porsche 911 / Macan",
    platform: "Turbo / V6 / PDK",
    image:
      "https://images.unsplash.com/photo-1573075527635-deaa9c8efdc6?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "porsche-macan-3-0-v6-2020",
    stageLine: {
      nl: "340-450 pk → Stage 1: 410-520 pk",
      en: "340-450 hp → Stage 1: 410-520 hp",
      pl: "340-450 KM → Stage 1: 410-520 KM"
    },
    note: {
      nl: "Premium maatwerk met extra focus op warmte en PDK/TCU.",
      en: "Premium custom tuning with extra focus on heat and PDK/TCU.",
      pl: "Premium strojenie z naciskiem na temperatury i PDK/TCU."
    }
  },
  {
    id: "ford-focus",
    title: "Ford Focus ST / RS",
    platform: "EcoBoost",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    detailId: "ford-focus-st-20-ecoboost",
    stageLine: {
      nl: "250-350 pk → Stage 1: 285-395 pk",
      en: "250-350 hp → Stage 1: 285-395 hp",
      pl: "250-350 KM → Stage 1: 285-395 KM"
    },
    note: {
      nl: "Levendige benzine tuning met koeling en knockcontrole.",
      en: "Responsive petrol tuning with cooling and knock control.",
      pl: "Dynamiczny benzynowy tuning z kontrolą temperatur i spalania stukowego."
    }
  },
  {
    id: "cupra-octavia",
    title: "Leon Cupra / Octavia RS",
    platform: "EA888 2.0 TSI",
    image:
      "https://images.unsplash.com/photo-1725184702660-1f0ac975916c?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    detailId: "seat-leon-2-0-tsi-cupra-2020",
    stageLine: {
      nl: "245-300 pk → Stage 1: 300-370 pk",
      en: "245-300 hp → Stage 1: 300-370 hp",
      pl: "245-300 KM → Stage 1: 300-370 KM"
    },
    note: {
      nl: "Veelgevraagd VAG platform voor Stage 1 en Stage 2.",
      en: "High-demand VAG platform for Stage 1 and Stage 2.",
      pl: "Popularna platforma VAG pod Stage 1 i Stage 2."
    }
  }
];
