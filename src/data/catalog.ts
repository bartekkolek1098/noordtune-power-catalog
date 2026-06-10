export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export type StageDefinition = {
  name: "Stage 1" | "Stage 2" | "Stage 3+";
  powerHp: number;
  torqueNm: number;
  price: number;
  requirements: string;
  packageItems: string[];
};

export type ServiceOption = {
  id: string;
  name: string;
  price: number;
  fuels?: FuelType[];
  requiresGearbox?: boolean;
  category: "software" | "emissions" | "gearbox" | "performance" | "security";
  description: string;
};

export type EngineVariant = {
  id: string;
  brand: string;
  model: string;
  engine: string;
  version: string;
  fuel: FuelType;
  yearRange: string;
  years: number[];
  stockPowerHp: number;
  stockTorqueNm: number;
  ecuType: string;
  gearbox?: "DSG" | "ZF" | "TCU" | "Manual";
  stages: StageDefinition[];
  options: string[];
  image: string;
  popular?: boolean;
  tags: string[];
};

export const serviceOptions: ServiceOption[] = [
  {
    id: "dpf",
    name: "DPF delete",
    price: 185,
    fuels: ["Diesel"],
    category: "emissions",
    description: "DPF off / delete software for off-road or export use where legally permitted."
  },
  {
    id: "adblue",
    name: "AdBlue off",
    price: 199,
    fuels: ["Diesel"],
    category: "emissions",
    description: "AdBlue / SCR off diagnostics and software solution where legally permitted."
  },
  {
    id: "egr",
    name: "EGR off",
    price: 149,
    fuels: ["Diesel", "Petrol"],
    category: "emissions",
    description: "EGR off calibration for vehicles with EGR-related faults or race/export use."
  },
  {
    id: "scr",
    name: "SCR delete",
    price: 219,
    fuels: ["Diesel"],
    category: "emissions",
    description: "SCR system software solution where legally permitted."
  },
  {
    id: "immo",
    name: "Immo off",
    price: 169,
    category: "security",
    description: "Immobilizer software service for ECU replacement and diagnostic repair scenarios."
  },
  {
    id: "speed-limiter",
    name: "Speed limiter removal",
    price: 119,
    category: "performance",
    description: "Vmax / speed limiter adjustment after drivetrain suitability check."
  },
  {
    id: "launch",
    name: "Launch control",
    price: 165,
    fuels: ["Petrol", "Hybrid"],
    category: "performance",
    description: "Launch control strategy for supported ECU/TCU combinations."
  },
  {
    id: "pops",
    name: "Pops & Bangs / Crackle",
    price: 149,
    fuels: ["Petrol"],
    category: "performance",
    description: "Crackle calibration for petrol engines, set conservatively for hardware safety."
  },
  {
    id: "gearbox",
    name: "DSG / TCU tuning",
    price: 239,
    requiresGearbox: true,
    category: "gearbox",
    description: "DSG, ZF or TCU shift strategy, torque limits and launch behavior where supported."
  }
];

export const allServiceOptionIds = serviceOptions.map((option) => option.id);

export const engineCatalog: EngineVariant[] = [
  {
    id: "vw-golf-20-tsi-ea888",
    brand: "Volkswagen",
    model: "Golf GTI",
    engine: "2.0 TSI EA888",
    version: "GTI Performance",
    fuel: "Petrol",
    yearRange: "2014-2020",
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020],
    stockPowerHp: 230,
    stockTorqueNm: 350,
    ecuType: "Bosch MED17 / MG1",
    gearbox: "DSG",
    options: allServiceOptionIds,
    popular: true,
    tags: ["vw", "golf", "gti", "2.0 tsi", "ea888", "dsg"],
    image:
      "https://images.unsplash.com/photo-1769968313283-d6336681ce8b?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    stages: [
      {
        name: "Stage 1",
        powerHp: 300,
        torqueNm: 450,
        price: 305,
        requirements: "Originele hardware",
        packageItems: [
          "ECU remap op maat",
          "Software uitlezen en veilig loggen",
          "Vermogens- en koppelbegrenzers optimaliseren"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 335,
        torqueNm: 500,
        price: 439,
        requirements: "Intake en downpipe aanbevolen",
        packageItems: [
          "Stage 1 pakket",
          "Kalibratie voor betere uitlaatflow",
          "Extra controle van ontsteking, turbodruk en temperaturen"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 430,
        torqueNm: 560,
        price: 799,
        requirements: "Hybride turbo, brandstofupgrade en logs",
        packageItems: [
          "Volledige maatwerk calibratie",
          "Turbo- en brandstofupgrade afstemming",
          "Meerdere logrondes en nazorg"
        ]
      }
    ]
  },
  {
    id: "bmw-320d-b47",
    brand: "BMW",
    model: "3 Serie 320d",
    engine: "2.0d B47",
    version: "F30/F31 320d",
    fuel: "Diesel",
    yearRange: "2015-2022",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    stockPowerHp: 190,
    stockTorqueNm: 400,
    ecuType: "Bosch EDC17 / MD1",
    gearbox: "ZF",
    options: allServiceOptionIds,
    popular: true,
    tags: ["bmw", "320d", "3 serie", "3 series", "b47", "2.0d", "diesel", "zf"],
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 225,
        torqueNm: 470,
        price: 269,
        requirements: "Originele hardware",
        packageItems: [
          "Maatwerk ECU remap",
          "Originele software uitlezen en backup",
          "Optimalisatie van turbodruk, raildruk en koppelbegrenzers"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 245,
        torqueNm: 520,
        price: 399,
        requirements: "Intercooler en downpipe aanbevolen",
        packageItems: [
          "Stage 1 pakket",
          "Kalibratie voor betere koeling en flow",
          "Rooklimieten en thermische bescherming gecontroleerd"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 280,
        torqueNm: 600,
        price: 679,
        requirements: "Turbo upgrade en brandstofcontrole",
        packageItems: [
          "Maatwerk setup voor turbo upgrade",
          "Brandstof- en koppelmodel kalibratie",
          "Uitgebreide logs voor en na tuning"
        ]
      }
    ]
  },
  {
    id: "audi-a3-20-tdi",
    brand: "Audi",
    model: "A3 2.0 TDI",
    engine: "2.0 TDI CR",
    version: "8V 150pk",
    fuel: "Diesel",
    yearRange: "2013-2020",
    years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    stockPowerHp: 150,
    stockTorqueNm: 340,
    ecuType: "Bosch EDC17",
    gearbox: "DSG",
    options: allServiceOptionIds,
    popular: true,
    tags: ["audi", "a3", "2.0 tdi", "tdi", "8v", "diesel", "dsg"],
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 185,
        torqueNm: 410,
        price: 269,
        requirements: "Originele hardware",
        packageItems: [
          "ECU remap op originele hardware",
          "Software backup en diagnose",
          "Koppelopbouw afgestemd op DSG of handbak"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 205,
        torqueNm: 455,
        price: 399,
        requirements: "Uitlaatflow en koeling aanbevolen",
        packageItems: [
          "Stage 1 pakket",
          "Flow- en emissiesysteemcontrole",
          "Extra logcontrole onder belasting"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 240,
        torqueNm: 520,
        price: 679,
        requirements: "Turbo upgrade en logs",
        packageItems: [
          "Turbo upgrade calibratie",
          "Brandstof- en laaddrukmodel op maat",
          "Nazorg en file-revisie inbegrepen"
        ]
      }
    ]
  },
  {
    id: "mercedes-a45-amg-m133",
    brand: "Mercedes-Benz",
    model: "A 45 AMG",
    engine: "2.0 Turbo M133",
    version: "W176 AMG",
    fuel: "Petrol",
    yearRange: "2013-2018",
    years: [2013, 2014, 2015, 2016, 2017, 2018],
    stockPowerHp: 360,
    stockTorqueNm: 450,
    ecuType: "Bosch MED17",
    gearbox: "TCU",
    options: allServiceOptionIds,
    popular: true,
    tags: ["mercedes", "a45", "amg", "m133", "2.0 turbo", "tcu"],
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 400,
        torqueNm: 520,
        price: 339,
        requirements: "Originele hardware",
        packageItems: [
          "Maatwerk ECU remap",
          "Boost, ontsteking en koppelmodel optimalisatie",
          "AMG-specifieke logcontrole"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 430,
        torqueNm: 560,
        price: 509,
        requirements: "Downpipe, intake en bougies",
        packageItems: [
          "Stage 1 pakket",
          "Hardwaregerichte kalibratie",
          "Launch- en TCU-afstemming aanbevolen"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 500,
        torqueNm: 640,
        price: 949,
        requirements: "Turbo upgrade, brandstof en TCU kalibratie",
        packageItems: [
          "Volledige AMG maatwerk setup",
          "Turbo, brandstof en transmissie op elkaar afgestemd",
          "Meerdere controlelogs inbegrepen"
        ]
      }
    ]
  },
  {
    id: "bmw-x3-e83-20d",
    brand: "BMW",
    model: "X3 2.0d",
    engine: "2.0d M47",
    version: "E83 177pk",
    fuel: "Diesel",
    yearRange: "2007-2010",
    years: [2007, 2008, 2009, 2010],
    stockPowerHp: 177,
    stockTorqueNm: 350,
    ecuType: "Bosch EDC16",
    gearbox: "ZF",
    options: allServiceOptionIds,
    popular: true,
    tags: ["bmw", "x3", "e83", "2.0d", "m47", "177", "diesel"],
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 214,
        torqueNm: 420,
        price: 269,
        requirements: "Originele hardware",
        packageItems: [
          "Maatwerk ECU remap / Stage 1",
          "Analyse originele ECU-software",
          "Gasrespons en koppelopbouw geoptimaliseerd"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 228,
        torqueNm: 455,
        price: 399,
        requirements: "Goede onderhoudsstaat en flowcontrole",
        packageItems: [
          "Stage 1 pakket",
          "Extra turbodruk- en rooklimietcontrole",
          "Diagnose voor en na tuning"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 255,
        torqueNm: 520,
        price: 679,
        requirements: "Turbo upgrade en maatwerk logs",
        packageItems: [
          "Turbo upgrade afstemming",
          "Brandstof- en koppelbegrenzers op maat",
          "Uitgebreide nazorg"
        ]
      }
    ]
  },
  {
    id: "volvo-xc60-d5",
    brand: "Volvo",
    model: "XC60 D5",
    engine: "2.4 D5",
    version: "D5 AWD",
    fuel: "Diesel",
    yearRange: "2014-2017",
    years: [2014, 2015, 2016, 2017],
    stockPowerHp: 220,
    stockTorqueNm: 440,
    ecuType: "Bosch EDC17",
    gearbox: "TCU",
    options: allServiceOptionIds,
    tags: ["volvo", "xc60", "d5", "2.4", "awd", "diesel"],
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 255,
        torqueNm: 520,
        price: 305,
        requirements: "Originele hardware",
        packageItems: [
          "ECU optimalisatie op maat",
          "Koppelbegrenzers afgestemd op AWD aandrijving",
          "Diagnose en proefritcontrole"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 275,
        torqueNm: 560,
        price: 439,
        requirements: "Koeling en uitlaatflow gecontroleerd",
        packageItems: [
          "Stage 1 pakket",
          "Thermische bescherming gecontroleerd",
          "Extra logcontrole onder belasting"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 305,
        torqueNm: 620,
        price: 799,
        requirements: "Maatwerk turbo/brandstof setup",
        packageItems: [
          "Maatwerk hardware-afstemming",
          "Turbo- en brandstofmodel revisie",
          "Controlelogs en nazorg"
        ]
      }
    ]
  },
  {
    id: "ford-focus-st-20-ecoboost",
    brand: "Ford",
    model: "Focus ST",
    engine: "2.0 EcoBoost",
    version: "ST Mk3",
    fuel: "Petrol",
    yearRange: "2012-2018",
    years: [2012, 2013, 2014, 2015, 2016, 2017, 2018],
    stockPowerHp: 250,
    stockTorqueNm: 360,
    ecuType: "Bosch MED17",
    gearbox: "Manual",
    options: allServiceOptionIds,
    tags: ["ford", "focus", "st", "ecoboost", "2.0", "petrol"],
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    stages: [
      {
        name: "Stage 1",
        powerHp: 285,
        torqueNm: 430,
        price: 305,
        requirements: "Originele hardware",
        packageItems: [
          "Maatwerk benzine ECU remap",
          "Boost en ontsteking afgestemd",
          "Gasrespons verbeterd"
        ]
      },
      {
        name: "Stage 2",
        powerHp: 315,
        torqueNm: 470,
        price: 439,
        requirements: "Intake, intercooler en downpipe aanbevolen",
        packageItems: [
          "Stage 1 pakket",
          "Hardwaregerichte kalibratie",
          "Temperatuur- en knockcontrole"
        ]
      },
      {
        name: "Stage 3+",
        powerHp: 380,
        torqueNm: 540,
        price: 799,
        requirements: "Hybride turbo en brandstofupgrade",
        packageItems: [
          "Hybride turbo afstemming",
          "Brandstofmodel op maat",
          "Meerdere revisies inbegrepen"
        ]
      }
    ]
  }
];

type GeneratedTrim = {
  code: string;
  engine: string;
  fuel: FuelType;
  stockPowerHp: number;
  stockTorqueNm: number;
  ecuType: string;
  gearbox?: EngineVariant["gearbox"];
  tags: string[];
};

type GeneratedModel =
  | string
  | {
      name: string;
      start: number;
      end?: number;
    };

type GeneratedFamily = {
  brand: string;
  models: GeneratedModel[];
  trims: GeneratedTrim[];
};

const generatedYears = Array.from({length: 15}, (_, index) => 2012 + index);

const generatedFamilies: GeneratedFamily[] = [
  {
    brand: "BMW",
    models: ["1 Serie", "2 Serie", "3 Serie", "4 Serie", "5 Serie", "X1", "X3", "X5"],
    trims: [
      bmwDieselTrim("118d", 150, 330),
      bmwDieselTrim("120d", 190, 400),
      bmwDieselTrim("320d", 190, 400),
      bmwDieselTrim("330d", 258, 560, "Bosch EDC17 / MD1", "ZF"),
      bmwPetrolTrim("330i", 252, 350),
      bmwPetrolTrim("340i", 326, 450, "Bosch MG1", "ZF"),
      bmwPetrolTrim("M140i", 340, 500, "Bosch MG1", "ZF")
    ]
  },
  {
    brand: "Volkswagen",
    models: ["Golf", "Polo", "Passat", "Arteon", "Tiguan", "T-Roc", "Transporter", "Caddy"],
    trims: [
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("1.5 TSI", 150, 250),
      vagPetrolTrim("2.0 TSI GTI", 230, 350),
      vagPetrolTrim("2.0 TSI R", 300, 400),
      vagDieselTrim("1.6 TDI", 115, 250),
      vagDieselTrim("2.0 TDI", 150, 340),
      vagDieselTrim("2.0 BiTDI", 204, 450)
    ]
  },
  {
    brand: "Audi",
    models: ["A3", "A4", "A5", "A6", "Q3", "Q5", "TT", "S3"],
    trims: [
      vagPetrolTrim("1.4 TFSI", 150, 250),
      vagPetrolTrim("2.0 TFSI", 252, 370),
      vagPetrolTrim("S tronic 2.0 TFSI", 310, 400),
      vagDieselTrim("1.6 TDI", 116, 250),
      vagDieselTrim("2.0 TDI", 150, 340),
      vagDieselTrim("2.0 TDI 190", 190, 400),
      vagDieselTrim("3.0 TDI", 272, 600)
    ]
  },
  {
    brand: "Mercedes-Benz",
    models: ["A Klasse", "CLA", "C Klasse", "E Klasse", "GLA", "GLC", "Vito"],
    trims: [
      mercedesDieselTrim("180d", 116, 280),
      mercedesDieselTrim("200d", 150, 320),
      mercedesDieselTrim("220d", 194, 400),
      mercedesDieselTrim("250d", 204, 500),
      mercedesPetrolTrim("200", 184, 300),
      mercedesPetrolTrim("300", 258, 400),
      mercedesPetrolTrim("AMG 35", 306, 400)
    ]
  },
  {
    brand: "Skoda",
    models: ["Octavia", "Superb", "Kodiaq", "Karoq", "Fabia", "Rapid"],
    trims: [
      vagPetrolTrim("1.0 TSI", 110, 200),
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("2.0 TSI RS", 245, 370),
      vagDieselTrim("1.6 TDI", 116, 250),
      vagDieselTrim("2.0 TDI", 150, 340),
      vagDieselTrim("2.0 TDI 190", 190, 400)
    ]
  },
  {
    brand: "SEAT",
    models: ["Ibiza", "Leon", "Ateca", "Tarraco", "Alhambra"],
    trims: [
      vagPetrolTrim("1.0 TSI", 110, 200),
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("1.8 TSI", 180, 320),
      vagPetrolTrim("2.0 TSI Cupra", 300, 400),
      vagDieselTrim("1.6 TDI", 116, 250),
      vagDieselTrim("2.0 TDI", 150, 340)
    ]
  },
  {
    brand: "Cupra",
    models: ["Leon", "Formentor", "Ateca", "Born"],
    trims: [
      vagPetrolTrim("1.5 TSI", 150, 250),
      vagPetrolTrim("2.0 TSI 245", 245, 370),
      vagPetrolTrim("2.0 TSI 300", 300, 400),
      vagPetrolTrim("2.0 TSI 310", 310, 400),
      hybridTrim("e-Hybrid", 245, 400)
    ]
  },
  {
    brand: "Ford",
    models: ["Fiesta", "Focus", "Kuga", "Mondeo", "Ranger", "Transit"],
    trims: [
      fordPetrolTrim("1.0 EcoBoost", 125, 200),
      fordPetrolTrim("1.5 EcoBoost", 182, 240),
      fordPetrolTrim("2.0 EcoBoost ST", 250, 360),
      fordDieselTrim("1.5 TDCi", 120, 300),
      fordDieselTrim("2.0 TDCi", 150, 370),
      fordDieselTrim("2.0 EcoBlue", 170, 420)
    ]
  },
  {
    brand: "Volvo",
    models: ["V40", "V60", "V90", "XC40", "XC60", "XC90"],
    trims: [
      volvoDieselTrim("D3", 150, 350),
      volvoDieselTrim("D4", 190, 400),
      volvoDieselTrim("D5", 225, 470),
      volvoPetrolTrim("T4", 190, 300),
      volvoPetrolTrim("T5", 250, 350),
      hybridTrim("T8", 390, 640)
    ]
  },
  {
    brand: "Renault",
    models: ["Clio", "Megane", "Kadjar", "Captur", "Talisman", "Trafic"],
    trims: [
      renaultPetrolTrim("0.9 TCe", 90, 140),
      renaultPetrolTrim("1.3 TCe", 140, 240),
      renaultPetrolTrim("1.8 TCe RS", 280, 390),
      renaultDieselTrim("1.5 dCi", 110, 260),
      renaultDieselTrim("1.6 dCi", 160, 380)
    ]
  },
  {
    brand: "Peugeot",
    models: ["208", "308", "508", "2008", "3008", "5008"],
    trims: [
      psaPetrolTrim("1.2 PureTech", 130, 230),
      psaPetrolTrim("1.6 THP", 180, 250),
      hybridTrim("Hybrid 225", 225, 360),
      psaDieselTrim("1.5 BlueHDi", 130, 300),
      psaDieselTrim("2.0 BlueHDi", 180, 400)
    ]
  },
  {
    brand: "Opel",
    models: ["Corsa", "Astra", "Insignia", "Mokka", "Grandland", "Vivaro"],
    trims: [
      psaPetrolTrim("1.2 Turbo", 130, 230),
      psaPetrolTrim("1.4 Turbo", 150, 245),
      psaPetrolTrim("1.6 Turbo", 200, 300),
      psaDieselTrim("1.5 CDTi", 130, 300),
      psaDieselTrim("2.0 CDTi", 170, 400)
    ]
  },
  {
    brand: "MINI",
    models: ["Cooper", "Cooper S", "Clubman", "Countryman"],
    trims: [
      miniPetrolTrim("Cooper 1.5T", 136, 220),
      miniPetrolTrim("Cooper S 2.0T", 192, 280),
      miniPetrolTrim("JCW 2.0T", 231, 320),
      bmwDieselTrim("Cooper D", 116, 270, "Bosch EDC17", "Manual"),
      bmwDieselTrim("Cooper SD", 170, 360, "Bosch EDC17", "ZF")
    ]
  },
  {
    brand: "Toyota",
    models: ["Yaris", "Corolla", "C-HR", "RAV4", "Hilux"],
    trims: [
      toyotaPetrolTrim("1.2 Turbo", 116, 185),
      toyotaDieselTrim("2.0 D-4D", 124, 310),
      toyotaDieselTrim("2.4 D-4D", 150, 400),
      hybridTrim("Hybrid 1.8", 122, 305),
      hybridTrim("Hybrid 2.5", 218, 420)
    ]
  },
  {
    brand: "Hyundai",
    models: ["i20", "i30", "Kona", "Tucson", "Santa Fe"],
    trims: [
      hyundaiPetrolTrim("1.0 T-GDi", 120, 172),
      hyundaiPetrolTrim("1.6 T-GDi", 177, 265),
      hyundaiPetrolTrim("N 2.0 T-GDi", 280, 392),
      hyundaiDieselTrim("1.6 CRDi", 136, 320),
      hyundaiDieselTrim("2.0 CRDi", 185, 400)
    ]
  },
  {
    brand: "Kia",
    models: ["Ceed", "Proceed", "Sportage", "Sorento", "Stinger"],
    trims: [
      hyundaiPetrolTrim("1.0 T-GDi", 120, 172),
      hyundaiPetrolTrim("1.6 T-GDi", 177, 265),
      hyundaiPetrolTrim("2.0 T-GDi", 255, 353),
      hyundaiDieselTrim("1.6 CRDi", 136, 320),
      hyundaiDieselTrim("2.2 CRDi", 200, 440)
    ]
  },
  {
    brand: "Porsche",
    models: ["Cayenne", "Macan", "Panamera", "911"],
    trims: [
      porschePetrolTrim("2.0 Turbo", 252, 370),
      porschePetrolTrim("3.0 V6", 340, 450),
      porschePetrolTrim("GTS", 460, 620),
      porschePetrolTrim("Turbo", 550, 770),
      hybridTrim("E-Hybrid", 462, 700)
    ]
  },
  {
    brand: "Alfa Romeo",
    models: ["Giulietta", "Giulia", "Stelvio", "Tonale"],
    trims: [
      alfaPetrolTrim("1.4 MultiAir", 170, 250),
      alfaPetrolTrim("2.0 Turbo", 280, 400),
      alfaDieselTrim("2.2 JTD", 190, 450),
      alfaPetrolTrim("Quadrifoglio", 510, 600)
    ]
  }
];

const additionalGeneratedFamilies: GeneratedFamily[] = [
  {
    brand: "BMW",
    models: [
      model("1 Serie", 2004),
      model("2 Serie", 2014),
      model("3 Serie", 2000),
      model("4 Serie", 2013),
      model("5 Serie", 2000),
      model("6 Serie", 2003, 2018),
      model("7 Serie", 2000),
      model("X1", 2009),
      model("X2", 2018),
      model("X3", 2004),
      model("X4", 2014),
      model("X5", 2000),
      model("X6", 2008),
      model("Z4", 2003)
    ],
    trims: [
      bmwDieselTrim("116d", 116, 260),
      bmwDieselTrim("118d", 143, 320),
      bmwDieselTrim("120d", 184, 380),
      bmwDieselTrim("123d", 204, 400),
      bmwDieselTrim("125d", 224, 450),
      bmwDieselTrim("318d", 150, 320),
      bmwDieselTrim("320d", 184, 380),
      bmwDieselTrim("325d", 218, 450),
      bmwDieselTrim("330d", 258, 560),
      bmwDieselTrim("335d", 313, 630),
      bmwDieselTrim("520d", 190, 400),
      bmwDieselTrim("530d", 265, 620),
      bmwDieselTrim("540d", 320, 680),
      bmwPetrolTrim("118i", 136, 220),
      bmwPetrolTrim("125i", 224, 310),
      bmwPetrolTrim("320i", 184, 270),
      bmwPetrolTrim("328i", 245, 350),
      bmwPetrolTrim("330i", 258, 400),
      bmwPetrolTrim("340i", 326, 450),
      bmwPetrolTrim("M135i", 306, 450),
      bmwPetrolTrim("M140i", 340, 500),
      bmwPetrolTrim("M240i", 340, 500),
      bmwPetrolTrim("M340i", 374, 500),
      hybridTrim("330e", 292, 420),
      hybridTrim("530e", 292, 420),
      bmwPetrolTrim("550i", 450, 650, "Bosch MEVD / MG1", "ZF")
    ]
  },
  {
    brand: "Audi",
    models: [
      model("A1", 2010),
      model("A3", 2000),
      model("A4", 2000),
      model("A5", 2007),
      model("A6", 2000),
      model("A7", 2010),
      model("A8", 2002),
      model("Q2", 2016),
      model("Q3", 2011),
      model("Q5", 2008),
      model("Q7", 2006),
      model("TT", 2000),
      model("S1", 2014, 2018),
      model("S3", 2000),
      model("S4", 2000),
      model("S5", 2007),
      model("SQ5", 2013)
    ],
    trims: [
      vagPetrolTrim("1.0 TFSI", 110, 200),
      vagPetrolTrim("1.2 TFSI", 105, 175),
      vagPetrolTrim("1.4 TFSI", 150, 250),
      vagPetrolTrim("1.5 TFSI", 150, 250),
      vagPetrolTrim("1.8 TFSI", 180, 320),
      vagPetrolTrim("2.0 TFSI", 252, 370),
      vagPetrolTrim("2.0 TFSI 310", 310, 400),
      vagPetrolTrim("2.5 TFSI", 400, 480),
      vagPetrolTrim("3.0 TFSI", 333, 440),
      vagDieselTrim("1.6 TDI", 105, 250),
      vagDieselTrim("2.0 TDI 120", 120, 290),
      vagDieselTrim("2.0 TDI 143", 143, 320),
      vagDieselTrim("2.0 TDI 150", 150, 340),
      vagDieselTrim("2.0 TDI 177", 177, 380),
      vagDieselTrim("2.0 TDI 190", 190, 400),
      vagDieselTrim("3.0 TDI 204", 204, 450),
      vagDieselTrim("3.0 TDI 245", 245, 580),
      vagDieselTrim("3.0 TDI 272", 272, 600),
      hybridTrim("TFSI e", 245, 400)
    ]
  },
  {
    brand: "Volkswagen",
    models: [
      model("Golf", 2000),
      model("Golf GTI", 2000),
      model("Golf R", 2010),
      model("Polo", 2000),
      model("Passat", 2000),
      model("Arteon", 2017),
      model("Tiguan", 2007),
      model("Touareg", 2003),
      model("T-Roc", 2017),
      model("Touran", 2003),
      model("Sharan", 2000, 2022),
      model("Scirocco", 2008, 2017),
      model("Transporter", 2003),
      model("Caddy", 2004),
      model("Crafter", 2006)
    ],
    trims: [
      vagPetrolTrim("1.0 TSI", 110, 200),
      vagPetrolTrim("1.2 TSI", 105, 175),
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("1.5 TSI", 150, 250),
      vagPetrolTrim("1.8 TSI", 180, 250),
      vagPetrolTrim("2.0 TSI GTI", 230, 350),
      vagPetrolTrim("2.0 TSI R", 300, 400),
      vagPetrolTrim("2.5 TFSI", 400, 480),
      vagDieselTrim("1.6 TDI", 105, 250),
      vagDieselTrim("1.9 TDI", 105, 250),
      vagDieselTrim("2.0 TDI 120", 120, 300),
      vagDieselTrim("2.0 TDI 140", 140, 320),
      vagDieselTrim("2.0 TDI 150", 150, 340),
      vagDieselTrim("2.0 TDI 190", 190, 400),
      vagDieselTrim("2.0 BiTDI", 204, 450),
      vagDieselTrim("3.0 TDI", 286, 600),
      hybridTrim("GTE", 245, 400)
    ]
  },
  {
    brand: "Mercedes-Benz",
    models: [
      model("A Klasse", 2004),
      model("B Klasse", 2005),
      model("CLA", 2013),
      model("C Klasse", 2000),
      model("E Klasse", 2000),
      model("S Klasse", 2000),
      model("GLA", 2014),
      model("GLB", 2019),
      model("GLC", 2015),
      model("GLE", 2015),
      model("GLS", 2016),
      model("SLK", 2000, 2020),
      model("SLC", 2016, 2020),
      model("Vito", 2003),
      model("Sprinter", 2000),
      model("AMG GT", 2015)
    ],
    trims: [
      mercedesDieselTrim("180 CDI", 109, 250),
      mercedesDieselTrim("180d", 116, 280),
      mercedesDieselTrim("200 CDI", 136, 300),
      mercedesDieselTrim("200d", 150, 320),
      mercedesDieselTrim("220 CDI", 170, 400),
      mercedesDieselTrim("220d", 194, 400),
      mercedesDieselTrim("250 CDI", 204, 500),
      mercedesDieselTrim("250d", 204, 500),
      mercedesDieselTrim("300d", 245, 500),
      mercedesDieselTrim("350 CDI", 265, 620),
      mercedesPetrolTrim("180", 156, 250),
      mercedesPetrolTrim("200", 184, 300),
      mercedesPetrolTrim("250", 211, 350),
      mercedesPetrolTrim("300", 258, 400),
      mercedesPetrolTrim("350", 306, 370),
      mercedesPetrolTrim("AMG 35", 306, 400),
      mercedesPetrolTrim("AMG 43", 367, 520),
      mercedesPetrolTrim("AMG 45", 381, 475),
      mercedesPetrolTrim("AMG 63", 510, 700),
      hybridTrim("300e", 320, 700)
    ]
  },
  {
    brand: "Skoda",
    models: [
      model("Fabia", 2000),
      model("Rapid", 2012, 2019),
      model("Scala", 2019),
      model("Octavia", 2000),
      model("Octavia RS", 2000),
      model("Superb", 2002),
      model("Yeti", 2009, 2017),
      model("Karoq", 2017),
      model("Kodiaq", 2017)
    ],
    trims: [
      vagPetrolTrim("1.0 TSI", 110, 200),
      vagPetrolTrim("1.2 TSI", 105, 175),
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("1.5 TSI", 150, 250),
      vagPetrolTrim("1.8 TSI", 180, 250),
      vagPetrolTrim("2.0 TSI RS", 245, 370),
      vagDieselTrim("1.6 TDI", 105, 250),
      vagDieselTrim("1.9 TDI", 105, 250),
      vagDieselTrim("2.0 TDI 140", 140, 320),
      vagDieselTrim("2.0 TDI 150", 150, 340),
      vagDieselTrim("2.0 TDI 184", 184, 380),
      vagDieselTrim("2.0 TDI 190", 190, 400),
      hybridTrim("iV", 245, 400)
    ]
  },
  {
    brand: "SEAT",
    models: [
      model("Ibiza", 2000),
      model("Leon", 2000),
      model("Leon Cupra", 2000),
      model("Toledo", 2000, 2019),
      model("Altea", 2004, 2015),
      model("Ateca", 2016),
      model("Tarraco", 2019),
      model("Alhambra", 2000, 2020)
    ],
    trims: [
      vagPetrolTrim("1.0 TSI", 110, 200),
      vagPetrolTrim("1.2 TSI", 105, 175),
      vagPetrolTrim("1.4 TSI", 150, 250),
      vagPetrolTrim("1.5 TSI", 150, 250),
      vagPetrolTrim("1.8 TSI", 180, 250),
      vagPetrolTrim("2.0 TSI Cupra", 300, 400),
      vagDieselTrim("1.6 TDI", 105, 250),
      vagDieselTrim("1.9 TDI", 105, 250),
      vagDieselTrim("2.0 TDI 140", 140, 320),
      vagDieselTrim("2.0 TDI 150", 150, 340),
      vagDieselTrim("2.0 TDI 184", 184, 380)
    ]
  },
  {
    brand: "Ford",
    models: [
      model("Fiesta", 2000),
      model("Fiesta ST", 2005),
      model("Focus", 2000),
      model("Focus ST", 2005),
      model("Focus RS", 2002, 2018),
      model("Kuga", 2008),
      model("Mondeo", 2000),
      model("S-Max", 2006),
      model("Galaxy", 2000, 2023),
      model("Ranger", 2006),
      model("Transit", 2000),
      model("Transit Custom", 2012),
      model("Mustang", 2015)
    ],
    trims: [
      fordPetrolTrim("1.0 EcoBoost", 125, 200),
      fordPetrolTrim("1.5 EcoBoost", 182, 240),
      fordPetrolTrim("1.6 EcoBoost", 182, 240),
      fordPetrolTrim("2.0 EcoBoost ST", 250, 360),
      fordPetrolTrim("2.3 EcoBoost", 280, 420),
      fordPetrolTrim("2.3 EcoBoost RS", 350, 470),
      fordDieselTrim("1.5 TDCi", 120, 300),
      fordDieselTrim("1.6 TDCi", 115, 270),
      fordDieselTrim("2.0 TDCi", 150, 370),
      fordDieselTrim("2.0 EcoBlue", 170, 420),
      fordDieselTrim("2.2 TDCi", 160, 385),
      fordDieselTrim("3.2 TDCi", 200, 470)
    ]
  },
  {
    brand: "Volvo",
    models: [
      model("C30", 2006, 2013),
      model("S40", 2000, 2012),
      model("S60", 2000),
      model("S80", 2000, 2016),
      model("S90", 2016),
      model("V40", 2012, 2019),
      model("V50", 2004, 2012),
      model("V60", 2010),
      model("V70", 2000, 2016),
      model("V90", 2016),
      model("XC40", 2018),
      model("XC60", 2008),
      model("XC70", 2000, 2016),
      model("XC90", 2002)
    ],
    trims: [
      volvoDieselTrim("1.6D", 115, 270),
      volvoDieselTrim("D2", 120, 280),
      volvoDieselTrim("D3", 150, 350),
      volvoDieselTrim("D4", 190, 400),
      volvoDieselTrim("D5", 225, 470),
      volvoPetrolTrim("T3", 152, 250),
      volvoPetrolTrim("T4", 190, 300),
      volvoPetrolTrim("T5", 250, 350),
      volvoPetrolTrim("T6", 310, 400),
      hybridTrim("T8", 390, 640)
    ]
  },
  {
    brand: "Renault",
    models: [
      model("Clio", 2000),
      model("Clio RS", 2000, 2019),
      model("Megane", 2000),
      model("Megane RS", 2004),
      model("Captur", 2013),
      model("Kadjar", 2015, 2022),
      model("Austral", 2022),
      model("Scenic", 2000),
      model("Talisman", 2015, 2022),
      model("Koleos", 2008),
      model("Trafic", 2000),
      model("Master", 2000)
    ],
    trims: [
      renaultPetrolTrim("0.9 TCe", 90, 140),
      renaultPetrolTrim("1.0 TCe", 100, 160),
      renaultPetrolTrim("1.2 TCe", 130, 205),
      renaultPetrolTrim("1.3 TCe", 140, 240),
      renaultPetrolTrim("1.6 TCe", 205, 280),
      renaultPetrolTrim("1.8 TCe RS", 280, 390),
      renaultDieselTrim("1.5 dCi", 110, 260),
      renaultDieselTrim("1.6 dCi", 160, 380),
      renaultDieselTrim("2.0 dCi", 175, 380),
      hybridTrim("E-Tech", 160, 300)
    ]
  },
  {
    brand: "Peugeot",
    models: [
      model("206", 2000, 2012),
      model("207", 2006, 2014),
      model("208", 2012),
      model("307", 2001, 2008),
      model("308", 2007),
      model("407", 2004, 2011),
      model("508", 2011),
      model("2008", 2013),
      model("3008", 2009),
      model("5008", 2009),
      model("Partner", 2000),
      model("Expert", 2000)
    ],
    trims: [
      psaPetrolTrim("1.2 PureTech", 110, 205),
      psaPetrolTrim("1.2 PureTech 130", 130, 230),
      psaPetrolTrim("1.6 THP", 156, 240),
      psaPetrolTrim("1.6 PureTech 180", 180, 250),
      psaPetrolTrim("1.6 PureTech 225", 225, 300),
      psaDieselTrim("1.4 HDi", 90, 215),
      psaDieselTrim("1.5 BlueHDi", 130, 300),
      psaDieselTrim("1.6 HDi", 115, 270),
      psaDieselTrim("2.0 HDi", 150, 340),
      psaDieselTrim("2.0 BlueHDi", 180, 400),
      hybridTrim("Hybrid 225", 225, 360),
      hybridTrim("Hybrid4 300", 300, 520)
    ]
  },
  {
    brand: "Citroën",
    models: [
      model("C2", 2003, 2010),
      model("C3", 2002),
      model("C4", 2004),
      model("C4 Picasso", 2006, 2022),
      model("C5", 2000, 2017),
      model("C5 Aircross", 2018),
      model("Berlingo", 2000),
      model("Jumpy", 2000)
    ],
    trims: [
      psaPetrolTrim("1.2 PureTech", 110, 205),
      psaPetrolTrim("1.2 PureTech 130", 130, 230),
      psaPetrolTrim("1.6 THP", 156, 240),
      psaDieselTrim("1.5 BlueHDi", 130, 300),
      psaDieselTrim("1.6 HDi", 115, 270),
      psaDieselTrim("2.0 HDi", 150, 340),
      psaDieselTrim("2.0 BlueHDi", 180, 400),
      hybridTrim("Hybrid 225", 225, 360)
    ]
  },
  {
    brand: "DS Automobiles",
    models: [
      model("DS 3", 2010),
      model("DS 4", 2011),
      model("DS 5", 2011, 2018),
      model("DS 7", 2017),
      model("DS 9", 2020)
    ],
    trims: [
      psaPetrolTrim("1.2 PureTech", 130, 230),
      psaPetrolTrim("1.6 PureTech 180", 180, 250),
      psaPetrolTrim("1.6 PureTech 225", 225, 300),
      psaDieselTrim("1.5 BlueHDi", 130, 300),
      psaDieselTrim("2.0 BlueHDi", 180, 400),
      hybridTrim("E-Tense 225", 225, 360),
      hybridTrim("E-Tense 300", 300, 520)
    ]
  },
  {
    brand: "Opel",
    models: [
      model("Corsa", 2000),
      model("Astra", 2000),
      model("Vectra", 2000, 2008),
      model("Insignia", 2008),
      model("Meriva", 2003, 2017),
      model("Zafira", 2000, 2019),
      model("Mokka", 2012),
      model("Crossland", 2017),
      model("Grandland", 2017),
      model("Vivaro", 2001)
    ],
    trims: [
      psaPetrolTrim("1.0 Turbo", 115, 170),
      psaPetrolTrim("1.2 Turbo", 130, 230),
      psaPetrolTrim("1.4 Turbo", 150, 245),
      psaPetrolTrim("1.6 Turbo", 200, 300),
      psaPetrolTrim("2.0 Turbo OPC", 280, 400),
      psaDieselTrim("1.3 CDTi", 95, 190),
      psaDieselTrim("1.5 CDTi", 130, 300),
      psaDieselTrim("1.6 CDTi", 136, 320),
      psaDieselTrim("2.0 CDTi", 170, 400),
      hybridTrim("Hybrid4", 300, 520)
    ]
  },
  {
    brand: "MINI",
    models: [
      model("One", 2001),
      model("Cooper", 2001),
      model("Cooper S", 2002),
      model("John Cooper Works", 2008),
      model("Clubman", 2007),
      model("Countryman", 2010),
      model("Paceman", 2013, 2016)
    ],
    trims: [
      miniPetrolTrim("One 1.5T", 102, 180),
      miniPetrolTrim("Cooper 1.5T", 136, 220),
      miniPetrolTrim("Cooper S 1.6T", 184, 260),
      miniPetrolTrim("Cooper S 2.0T", 192, 280),
      miniPetrolTrim("JCW 2.0T", 231, 320),
      bmwDieselTrim("One D", 95, 220, "Bosch EDC17", "Manual"),
      bmwDieselTrim("Cooper D", 116, 270, "Bosch EDC17", "Manual"),
      bmwDieselTrim("Cooper SD", 170, 360, "Bosch EDC17", "ZF")
    ]
  },
  {
    brand: "Land Rover",
    models: [
      model("Freelander", 2000, 2014),
      model("Discovery Sport", 2015),
      model("Discovery", 2000),
      model("Range Rover Evoque", 2011),
      model("Range Rover Sport", 2005),
      model("Range Rover Velar", 2017),
      model("Range Rover", 2002),
      model("Defender", 2020)
    ],
    trims: [
      landRoverDieselTrim("2.0 TD4", 150, 380),
      landRoverDieselTrim("2.0 SD4", 240, 500),
      landRoverDieselTrim("2.2 TD4", 150, 420),
      landRoverDieselTrim("3.0 TDV6", 258, 600),
      landRoverDieselTrim("3.0 SDV6", 306, 700),
      landRoverPetrolTrim("2.0 Si4", 240, 340),
      landRoverPetrolTrim("3.0 SC", 340, 450),
      landRoverPetrolTrim("5.0 SC", 510, 625),
      hybridTrim("P400e", 404, 640)
    ]
  },
  {
    brand: "Jaguar",
    models: [
      model("XE", 2015),
      model("XF", 2008),
      model("XJ", 2003, 2019),
      model("F-Pace", 2016),
      model("E-Pace", 2018),
      model("F-Type", 2013)
    ],
    trims: [
      landRoverDieselTrim("2.0d", 180, 430),
      landRoverDieselTrim("3.0d", 300, 700),
      landRoverPetrolTrim("2.0t", 250, 365),
      landRoverPetrolTrim("3.0 SC", 380, 460),
      landRoverPetrolTrim("5.0 SC", 550, 680)
    ]
  },
  {
    brand: "Nissan",
    models: [
      model("Micra", 2000),
      model("Juke", 2010),
      model("Qashqai", 2007),
      model("X-Trail", 2001),
      model("Navara", 2000),
      model("GT-R", 2009, 2022),
      model("370Z", 2009, 2020)
    ],
    trims: [
      nissanPetrolTrim("1.0 DIG-T", 117, 180),
      nissanPetrolTrim("1.2 DIG-T", 115, 190),
      nissanPetrolTrim("1.3 DIG-T", 160, 270),
      nissanPetrolTrim("1.6 DIG-T", 190, 240),
      nissanPetrolTrim("3.8 V6 Twin Turbo", 570, 637),
      renaultDieselTrim("1.5 dCi", 110, 260),
      renaultDieselTrim("1.6 dCi", 160, 380),
      nissanDieselTrim("2.3 dCi", 190, 450)
    ]
  },
  {
    brand: "Mazda",
    models: [
      model("Mazda 2", 2003),
      model("Mazda 3", 2003),
      model("Mazda 6", 2002),
      model("CX-3", 2015),
      model("CX-5", 2012),
      model("CX-7", 2007, 2012),
      model("MX-5", 2000)
    ],
    trims: [
      mazdaPetrolTrim("1.5 Skyactiv-G", 120, 150),
      mazdaPetrolTrim("2.0 Skyactiv-G", 165, 210),
      mazdaPetrolTrim("2.5 Skyactiv-G", 194, 258),
      mazdaPetrolTrim("2.3 DISI Turbo", 260, 380),
      mazdaDieselTrim("1.8 Skyactiv-D", 116, 270),
      mazdaDieselTrim("2.2 Skyactiv-D", 150, 380),
      mazdaDieselTrim("2.2 Skyactiv-D 184", 184, 445)
    ]
  },
  {
    brand: "Honda",
    models: [
      model("Civic", 2000),
      model("Civic Type R", 2001),
      model("Accord", 2000, 2015),
      model("CR-V", 2000),
      model("HR-V", 2015),
      model("Jazz", 2001)
    ],
    trims: [
      hondaPetrolTrim("1.0 VTEC Turbo", 129, 200),
      hondaPetrolTrim("1.5 VTEC Turbo", 182, 240),
      hondaPetrolTrim("2.0 VTEC Turbo Type R", 320, 400),
      hondaDieselTrim("1.6 i-DTEC", 120, 300),
      hondaDieselTrim("2.2 i-DTEC", 150, 350),
      hybridTrim("e:HEV", 184, 315)
    ]
  },
  {
    brand: "Subaru",
    models: [
      model("Impreza", 2000),
      model("WRX STI", 2000, 2021),
      model("Forester", 2000),
      model("Legacy", 2000, 2020),
      model("Outback", 2000),
      model("BRZ", 2012)
    ],
    trims: [
      subaruPetrolTrim("2.0 Boxer", 150, 196),
      subaruPetrolTrim("2.0 DIT", 240, 350),
      subaruPetrolTrim("2.5 Turbo", 300, 407),
      subaruDieselTrim("2.0D Boxer", 150, 350)
    ]
  },
  {
    brand: "Mitsubishi",
    models: [
      model("Colt", 2000, 2012),
      model("Lancer", 2000, 2017),
      model("Lancer Evolution", 2000, 2016),
      model("ASX", 2010),
      model("Outlander", 2003),
      model("Pajero", 2000, 2021),
      model("L200", 2000)
    ],
    trims: [
      mitsubishiPetrolTrim("1.5 Turbo", 150, 210),
      mitsubishiPetrolTrim("2.0 Turbo Evo", 295, 366),
      mitsubishiDieselTrim("1.8 DI-D", 150, 300),
      mitsubishiDieselTrim("2.2 DI-D", 150, 380),
      mitsubishiDieselTrim("2.4 DI-D", 181, 430),
      hybridTrim("PHEV", 224, 360)
    ]
  },
  {
    brand: "Hyundai",
    models: [
      model("i10", 2008),
      model("i20", 2008),
      model("i20 N", 2021),
      model("i30", 2007),
      model("i30 N", 2017),
      model("Kona", 2017),
      model("Tucson", 2004),
      model("Santa Fe", 2000),
      model("ix35", 2009, 2015)
    ],
    trims: [
      hyundaiPetrolTrim("1.0 T-GDi", 120, 172),
      hyundaiPetrolTrim("1.4 T-GDi", 140, 242),
      hyundaiPetrolTrim("1.6 T-GDi", 177, 265),
      hyundaiPetrolTrim("2.0 T-GDi N", 280, 392),
      hyundaiDieselTrim("1.6 CRDi", 136, 320),
      hyundaiDieselTrim("1.7 CRDi", 141, 340),
      hyundaiDieselTrim("2.0 CRDi", 185, 400),
      hyundaiDieselTrim("2.2 CRDi", 200, 440),
      hybridTrim("Hybrid", 230, 350),
      hybridTrim("PHEV", 265, 350)
    ]
  },
  {
    brand: "Kia",
    models: [
      model("Rio", 2000),
      model("Ceed", 2007),
      model("Proceed", 2008),
      model("XCeed", 2019),
      model("Sportage", 2004),
      model("Sorento", 2002),
      model("Optima", 2010, 2020),
      model("Stinger", 2017)
    ],
    trims: [
      hyundaiPetrolTrim("1.0 T-GDi", 120, 172),
      hyundaiPetrolTrim("1.4 T-GDi", 140, 242),
      hyundaiPetrolTrim("1.6 T-GDi", 204, 265),
      hyundaiPetrolTrim("2.0 T-GDi", 255, 353),
      hyundaiPetrolTrim("3.3 T-GDi", 370, 510),
      hyundaiDieselTrim("1.6 CRDi", 136, 320),
      hyundaiDieselTrim("1.7 CRDi", 141, 340),
      hyundaiDieselTrim("2.0 CRDi", 185, 400),
      hyundaiDieselTrim("2.2 CRDi", 200, 440),
      hybridTrim("PHEV", 265, 350)
    ]
  },
  {
    brand: "Fiat",
    models: [
      model("500", 2007),
      model("500X", 2014),
      model("Panda", 2003),
      model("Punto", 2000, 2018),
      model("Tipo", 2015),
      model("Bravo", 2007, 2014),
      model("Doblo", 2000),
      model("Ducato", 2000)
    ],
    trims: [
      fiatPetrolTrim("0.9 TwinAir", 105, 145),
      fiatPetrolTrim("1.4 T-Jet", 120, 215),
      fiatPetrolTrim("1.4 MultiAir", 170, 250),
      fiatDieselTrim("1.3 Multijet", 95, 200),
      fiatDieselTrim("1.6 Multijet", 120, 320),
      fiatDieselTrim("2.0 Multijet", 170, 350),
      fiatDieselTrim("2.3 Multijet", 180, 400)
    ]
  },
  {
    brand: "Abarth",
    models: [model("500", 2008), model("595", 2012), model("695", 2012), model("124 Spider", 2016, 2020)],
    trims: [
      fiatPetrolTrim("1.4 T-Jet 145", 145, 206),
      fiatPetrolTrim("1.4 T-Jet 165", 165, 230),
      fiatPetrolTrim("1.4 T-Jet 180", 180, 250)
    ]
  },
  {
    brand: "Jeep",
    models: [
      model("Renegade", 2014),
      model("Compass", 2006),
      model("Cherokee", 2000),
      model("Grand Cherokee", 2000),
      model("Wrangler", 2000)
    ],
    trims: [
      fiatPetrolTrim("1.3 T-GDi", 150, 270),
      fiatPetrolTrim("2.0 Turbo", 270, 400),
      fiatDieselTrim("1.6 Multijet", 120, 320),
      fiatDieselTrim("2.0 Multijet", 170, 350),
      landRoverDieselTrim("3.0 CRD", 250, 570),
      hybridTrim("4xe", 240, 520)
    ]
  },
  {
    brand: "Maserati",
    models: [model("Ghibli", 2013), model("Quattroporte", 2004), model("Levante", 2016), model("GranTurismo", 2007)],
    trims: [
      maseratiPetrolTrim("3.0 V6", 350, 500),
      maseratiPetrolTrim("3.0 V6 S", 430, 580),
      maseratiDieselTrim("3.0 V6 Diesel", 275, 600),
      maseratiPetrolTrim("3.8 V8", 530, 710)
    ]
  },
  {
    brand: "Porsche",
    models: [
      model("Boxster", 2000),
      model("Cayman", 2005),
      model("911", 2000),
      model("Macan", 2014),
      model("Cayenne", 2003),
      model("Panamera", 2009)
    ],
    trims: [
      porschePetrolTrim("2.0 Turbo", 252, 370),
      porschePetrolTrim("2.5 Turbo", 350, 420),
      porschePetrolTrim("3.0 Turbo", 420, 500),
      porschePetrolTrim("3.0 V6", 340, 450),
      porschePetrolTrim("3.6 Turbo", 420, 550),
      porschePetrolTrim("GTS", 460, 620),
      porschePetrolTrim("Turbo", 550, 770),
      porschePetrolTrim("Turbo S", 650, 800),
      porscheDieselTrim("3.0 Diesel", 262, 580),
      porscheDieselTrim("4.2 Diesel", 385, 850),
      hybridTrim("E-Hybrid", 462, 700)
    ]
  },
  {
    brand: "Alfa Romeo",
    models: [
      model("147", 2000, 2010),
      model("156", 2000, 2007),
      model("159", 2005, 2011),
      model("MiTo", 2008, 2018),
      model("Giulietta", 2010, 2020),
      model("Giulia", 2016),
      model("Stelvio", 2017),
      model("Tonale", 2022)
    ],
    trims: [
      alfaPetrolTrim("1.4 T-Jet", 120, 215),
      alfaPetrolTrim("1.4 MultiAir", 170, 250),
      alfaPetrolTrim("1.75 TBi", 240, 340),
      alfaPetrolTrim("2.0 Turbo", 280, 400),
      alfaPetrolTrim("Quadrifoglio", 510, 600),
      alfaDieselTrim("1.6 JTD", 120, 320),
      alfaDieselTrim("1.9 JTD", 150, 320),
      alfaDieselTrim("2.0 JTD", 170, 360),
      alfaDieselTrim("2.2 JTD", 190, 450)
    ]
  },
  {
    brand: "Dacia",
    models: [
      model("Sandero", 2008),
      model("Logan", 2004),
      model("Duster", 2010),
      model("Jogger", 2022),
      model("Dokker", 2012, 2021)
    ],
    trims: [
      renaultPetrolTrim("0.9 TCe", 90, 140),
      renaultPetrolTrim("1.0 TCe", 100, 160),
      renaultPetrolTrim("1.2 TCe", 125, 205),
      renaultPetrolTrim("1.3 TCe", 150, 250),
      renaultDieselTrim("1.5 dCi", 110, 260)
    ]
  }
];

const allGeneratedFamilies = [...generatedFamilies, ...additionalGeneratedFamilies];

export const generatedVehicleCatalog: EngineVariant[] = allGeneratedFamilies.flatMap(
  (family) =>
    family.models.flatMap((modelDefinition) => {
      const {name: modelName, years} = resolveGeneratedModel(modelDefinition);

      return family.trims.flatMap((trim) =>
        years.map((year) => createGeneratedVehicle(family.brand, modelName, trim, year))
      );
    })
);

export const vehicleDatabase: EngineVariant[] = dedupeVehicles([
  ...engineCatalog,
  ...generatedVehicleCatalog
]);

export const vehicleDatabaseCount = vehicleDatabase.length;

export function getVehicleById(id: string) {
  return vehicleDatabase.find((vehicle) => vehicle.id === id);
}

export function getBrands() {
  return Array.from(new Set(vehicleDatabase.map((vehicle) => vehicle.brand))).sort();
}

export function getModelsForBrand(brand: string) {
  return Array.from(
    new Set(
      vehicleDatabase
        .filter((vehicle) => vehicle.brand === brand)
        .map((vehicle) => vehicle.model)
    )
  ).sort();
}

export function getYearsForModel(brand: string, model: string) {
  return Array.from(
    new Set(
      vehicleDatabase
        .filter((vehicle) => vehicle.brand === brand && vehicle.model === model)
        .flatMap((vehicle) => vehicle.years)
    )
  ).sort((a, b) => b - a);
}

export function searchVehicles(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return vehicleDatabase.filter((vehicle) => vehicle.popular);
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);

  return vehicleDatabase
    .map((vehicle) => {
      const haystack = [
        vehicle.brand,
        vehicle.model,
        vehicle.engine,
        vehicle.version,
        vehicle.yearRange,
        vehicle.fuel,
        ...vehicle.tags
      ]
        .join(" ")
        .toLowerCase();
      const score = tokens.reduce(
        (total, token) => total + (haystack.includes(token) ? 1 : 0),
        vehicle.popular ? 0.35 : 0
      );

      return {vehicle, score};
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.vehicle);
}

export function findCatalogMatch(input: {
  make?: string;
  model?: string;
  fuel?: string;
  powerHp?: number | null;
}) {
  const make = normalizeSearch(input.make);
  const model = normalizeSearch(input.model);
  const fuel = normalizeFuel(input.fuel);

  if (!make || !model) {
    return null;
  }

  const candidates = vehicleDatabase
    .map((variant) => {
      if (!brandMatches(make, variant.brand)) {
        return {variant, score: 0};
      }

      const modelScore = scoreModelIdentity(model, variant);
      if (modelScore < 22) {
        return {variant, score: 0};
      }

      if (fuel && variant.fuel !== fuel) {
        return {variant, score: 0};
      }

      let score = 45 + modelScore + (fuel ? 18 : 0);

      if (input.powerHp) {
        const delta = Math.abs(input.powerHp - variant.stockPowerHp);
        const tolerance = Math.max(35, Math.round(variant.stockPowerHp * 0.22));

        if (delta > tolerance) {
          return {variant, score: 0};
        }

        score += Math.max(0, 25 - Math.floor(delta / 4));
      }

      return {variant, score};
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];

  if (!best || best.score < 78) {
    return null;
  }

  return {
    confidence: Math.min(100, best.score),
    variant: best.variant
  };
}

function createGeneratedVehicle(
  brand: string,
  modelName: string,
  trim: GeneratedTrim,
  year: number
): EngineVariant {
  const model = `${modelName} ${trim.code}`;

  return {
    id: `${slugify(brand)}-${slugify(modelName)}-${slugify(trim.code)}-${year}`,
    brand,
    model,
    engine: trim.engine,
    version: `${year} ${trim.code}`,
    fuel: trim.fuel,
    yearRange: `${year}`,
    years: [year],
    stockPowerHp: trim.stockPowerHp,
    stockTorqueNm: trim.stockTorqueNm,
    ecuType: trim.ecuType,
    gearbox: trim.gearbox,
    stages: buildGeneratedStages(trim),
    options: allServiceOptionIds,
    image:
      "https://images.unsplash.com/photo-1769968313283-d6336681ce8b?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200",
    tags: [
      brand,
      modelName,
      model,
      trim.code,
      trim.engine,
      String(year),
      ...trim.tags
    ]
  };
}

function buildGeneratedStages(trim: GeneratedTrim): StageDefinition[] {
  const diesel = trim.fuel === "Diesel";
  const hybrid = trim.fuel === "Hybrid";
  const stage1Power = diesel ? 1.2 : hybrid ? 1.14 : 1.22;
  const stage2Power = diesel ? 1.34 : hybrid ? 1.24 : 1.42;
  const stage3Power = diesel ? 1.52 : hybrid ? 1.36 : 1.7;
  const stage1Torque = diesel ? 1.18 : hybrid ? 1.1 : 1.2;
  const stage2Torque = diesel ? 1.32 : hybrid ? 1.2 : 1.36;
  const stage3Torque = diesel ? 1.48 : hybrid ? 1.3 : 1.55;
  const premium = trim.stockPowerHp >= 280;

  return [
    {
      name: "Stage 1",
      powerHp: roundToFive(trim.stockPowerHp * stage1Power),
      torqueNm: roundToTen(trim.stockTorqueNm * stage1Torque),
      price: premium ? 339 : 269,
      requirements: "Software only, original hardware in healthy condition",
      packageItems: [
        "Custom ECU remap",
        "Diagnostic readout and safe logging",
        "Torque limiters and throttle response optimized"
      ]
    },
    {
      name: "Stage 2",
      powerHp: roundToFive(trim.stockPowerHp * stage2Power),
      torqueNm: roundToTen(trim.stockTorqueNm * stage2Torque),
      price: premium ? 509 : 399,
      requirements: diesel
        ? "Intercooler, downpipe and maintenance check recommended"
        : "Downpipe, intake, intercooler and spark plugs recommended",
      packageItems: [
        "Stage 1 package",
        "Calibration for improved flow and cooling",
        "Additional boost, fuel and temperature logging"
      ]
    },
    {
      name: "Stage 3+",
      powerHp: roundToFive(trim.stockPowerHp * stage3Power),
      torqueNm: roundToTen(trim.stockTorqueNm * stage3Torque),
      price: premium ? 949 : 679,
      requirements: "Turbo, fueling and drivetrain setup confirmed before quote",
      packageItems: [
        "Full custom hardware calibration",
        "Turbo and fuel model tuning",
        "Multiple log revisions and aftercare"
      ]
    }
  ];
}

function makeTrim(
  code: string,
  engine: string,
  fuel: FuelType,
  stockPowerHp: number,
  stockTorqueNm: number,
  ecuType: string,
  gearbox: EngineVariant["gearbox"] = "Manual",
  tags: string[] = []
): GeneratedTrim {
  return {
    code,
    engine,
    fuel,
    stockPowerHp,
    stockTorqueNm,
    ecuType,
    gearbox,
    tags
  };
}

function model(name: string, start: number, end = 2026): GeneratedModel {
  return {name, start, end};
}

function resolveGeneratedModel(modelDefinition: GeneratedModel) {
  if (typeof modelDefinition === "string") {
    return {name: modelDefinition, years: generatedYears};
  }

  return {
    name: modelDefinition.name,
    years: rangeYears(modelDefinition.start, modelDefinition.end ?? 2026)
  };
}

function rangeYears(start: number, end: number) {
  return Array.from({length: Math.max(0, end - start + 1)}, (_, index) => start + index);
}

function bmwDieselTrim(
  code: string,
  power: number,
  torque: number,
  ecuType = "Bosch EDC17 / MD1",
  gearbox: EngineVariant["gearbox"] = "ZF"
) {
  return makeTrim(code, "2.0d / 3.0d BMW diesel", "Diesel", power, torque, ecuType, gearbox, [
    "bmw",
    "diesel",
    "b47",
    "n47",
    "n57"
  ]);
}

function bmwPetrolTrim(
  code: string,
  power: number,
  torque: number,
  ecuType = "Bosch MG1 / MEVD",
  gearbox: EngineVariant["gearbox"] = "ZF"
) {
  return makeTrim(code, "BMW turbo petrol", "Petrol", power, torque, ecuType, gearbox, [
    "bmw",
    "petrol",
    "b48",
    "b58"
  ]);
}

function vagPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / MG1", "DSG", [
    "tsi",
    "tfsi",
    "ea888",
    "dsg"
  ]);
}

function vagDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / MD1", "DSG", [
    "tdi",
    "diesel",
    "dsg"
  ]);
}

function mercedesDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, "Mercedes CDI / d", "Diesel", power, torque, "Bosch EDC17 / MD1", "TCU", [
    "mercedes",
    "cdi",
    "diesel"
  ]);
}

function mercedesPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, "Mercedes turbo petrol", "Petrol", power, torque, "Bosch MED17 / MG1", "TCU", [
    "mercedes",
    "petrol",
    "amg"
  ]);
}

function hybridTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Hybrid", power, torque, "Bosch MG1 / Denso", "TCU", [
    "hybrid",
    "phev"
  ]);
}

function fordPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / MG1", "Manual", [
    "ecoboost",
    "petrol"
  ]);
}

function fordDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / MD1", "Manual", [
    "tdci",
    "ecoblue",
    "diesel"
  ]);
}

function volvoDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, "Volvo Drive-E diesel", "Diesel", power, torque, "Bosch EDC17", "TCU", [
    "volvo",
    "drive-e",
    "diesel"
  ]);
}

function volvoPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, "Volvo Drive-E petrol", "Petrol", power, torque, "Bosch MED17 / Denso", "TCU", [
    "volvo",
    "drive-e",
    "petrol"
  ]);
}

function renaultPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Continental EMS", "Manual", [
    "tce",
    "petrol"
  ]);
}

function renaultDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / SID", "Manual", [
    "dci",
    "diesel"
  ]);
}

function psaPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MEVD / MG1", "Manual", [
    "puretech",
    "thp",
    "petrol"
  ]);
}

function psaDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / MD1", "Manual", [
    "bluehdi",
    "cdti",
    "diesel"
  ]);
}

function miniPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MEVD / MG1", "Manual", [
    "mini",
    "petrol"
  ]);
}

function toyotaPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Denso", "Manual", [
    "toyota",
    "petrol"
  ]);
}

function toyotaDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Denso / Bosch", "Manual", [
    "toyota",
    "diesel"
  ]);
}

function hyundaiPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / Kefico", "Manual", [
    "tgdi",
    "petrol"
  ]);
}

function hyundaiDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / MD1", "Manual", [
    "crdi",
    "diesel"
  ]);
}

function porschePetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MG1", "TCU", [
    "porsche",
    "petrol",
    "pdk"
  ]);
}

function porscheDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17", "TCU", [
    "porsche",
    "diesel",
    "pdk"
  ]);
}

function alfaPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / MG1", "TCU", [
    "alfa",
    "petrol"
  ]);
}

function alfaDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17", "TCU", [
    "alfa",
    "diesel",
    "jtd"
  ]);
}

function landRoverDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / Denso", "TCU", [
    "land rover",
    "range rover",
    "td4",
    "sd4",
    "tdv6",
    "sdv6",
    "diesel"
  ]);
}

function landRoverPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / MG1", "TCU", [
    "land rover",
    "range rover",
    "si4",
    "supercharged",
    "petrol"
  ]);
}

function nissanPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Hitachi / Bosch MG1", "Manual", [
    "nissan",
    "dig-t",
    "petrol"
  ]);
}

function nissanDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17 / SID", "Manual", [
    "nissan",
    "dci",
    "diesel"
  ]);
}

function mazdaPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Denso", "Manual", [
    "mazda",
    "skyactiv",
    "petrol"
  ]);
}

function mazdaDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Denso", "Manual", [
    "mazda",
    "skyactiv-d",
    "diesel"
  ]);
}

function hondaPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Keihin / Bosch", "Manual", [
    "honda",
    "vtec",
    "turbo",
    "petrol"
  ]);
}

function hondaDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17", "Manual", [
    "honda",
    "i-dtec",
    "diesel"
  ]);
}

function subaruPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Denso", "Manual", [
    "subaru",
    "boxer",
    "turbo",
    "petrol"
  ]);
}

function subaruDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Denso", "Manual", [
    "subaru",
    "boxer",
    "diesel"
  ]);
}

function mitsubishiPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Mitsubishi / Denso", "Manual", [
    "mitsubishi",
    "mivec",
    "turbo",
    "petrol"
  ]);
}

function mitsubishiDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Denso / Bosch", "Manual", [
    "mitsubishi",
    "di-d",
    "diesel"
  ]);
}

function fiatPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch ME7 / MED17", "Manual", [
    "fiat",
    "abarth",
    "t-jet",
    "multiair",
    "petrol"
  ]);
}

function fiatDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC16 / EDC17", "Manual", [
    "fiat",
    "multijet",
    "diesel"
  ]);
}

function maseratiPetrolTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Petrol", power, torque, "Bosch MED17 / MG1", "TCU", [
    "maserati",
    "petrol",
    "zf"
  ]);
}

function maseratiDieselTrim(code: string, power: number, torque: number) {
  return makeTrim(code, code, "Diesel", power, torque, "Bosch EDC17", "TCU", [
    "maserati",
    "diesel",
    "zf"
  ]);
}

function dedupeVehicles(vehicles: EngineVariant[]) {
  const seen = new Set<string>();

  return vehicles.filter((vehicle) => {
    if (seen.has(vehicle.id)) {
      return false;
    }

    seen.add(vehicle.id);
    return true;
  });
}

function normalizeSearch(value?: string) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function brandMatches(make: string, brand: string) {
  const normalizedBrand = normalizeSearch(brand);
  const aliases: Record<string, string[]> = {
    volkswagen: ["volkswagen", "vw"],
    "mercedes benz": ["mercedes benz", "mercedes"],
    "alfa romeo": ["alfa romeo", "alfa"],
    mini: ["mini", "bmw mini"]
  };
  const candidates = aliases[normalizedBrand] ?? [normalizedBrand];

  return candidates.some((candidate) => make === candidate || make.includes(candidate));
}

function scoreModelIdentity(inputModel: string, variant: EngineVariant) {
  const identitySources = [
    variant.model,
    variant.version,
    variant.engine,
    ...variant.tags
  ].map(normalizeSearch);
  const stopWords = new Set([
    "petrol",
    "diesel",
    "benzine",
    "hybrid",
    "turbo",
    "serie",
    "series",
    "klasse",
    "class",
    "performance",
    "edition",
    "manual",
    "dsg",
    "zf",
    "tcu"
  ]);
  const tokens = Array.from(
    new Set(identitySources.flatMap((source) => source.split(/\s+/)))
  ).filter((token) => isImportantModelToken(token, stopWords));
  let score = 0;

  for (const source of identitySources) {
    if (source.length > 3 && inputModel.includes(source)) {
      score += 24;
    }
  }

  for (const token of tokens) {
    if (inputModel.includes(token)) {
      score += /\d/.test(token) ? 18 : 14;
    }
  }

  return Math.min(score, 65);
}

function isImportantModelToken(token: string, stopWords: Set<string>) {
  if (!token || stopWords.has(token)) {
    return false;
  }

  return token.length >= 2 || /^\d$/.test(token);
}

function roundToFive(value: number) {
  return Math.round(value / 5) * 5;
}

function roundToTen(value: number) {
  return Math.round(value / 10) * 10;
}

export function slugify(value: string) {
  return normalizeSearch(value).replace(/\s+/g, "-");
}

export type StageSlug = "stage-1" | "stage-2" | "stage-3-plus";

export const stageSlugMap: Record<StageDefinition["name"], StageSlug> = {
  "Stage 1": "stage-1",
  "Stage 2": "stage-2",
  "Stage 3+": "stage-3-plus"
};

export function getVehicleSeoSlugs(vehicle: EngineVariant) {
  const engineCode = extractEngineCode(vehicle);
  const modelFamily = vehicle.model
    .replace(new RegExp(`\\b${escapeRegExp(engineCode)}\\b`, "i"), "")
    .replace(/\bserie\b/i, "Series")
    .trim();

  return {
    brand: slugify(vehicle.brand),
    model: slugify(modelFamily || vehicle.model),
    engine: slugify(engineCode || vehicle.engine)
  };
}

export function getVehicleBySeoSlugs(
  brandSlug: string,
  modelSlug: string,
  engineSlug: string
) {
  return vehicleDatabase.find((vehicle) => {
    const slugs = getVehicleSeoSlugs(vehicle);

    return (
      slugs.brand === brandSlug &&
      slugs.model === modelSlug &&
      slugs.engine === engineSlug
    );
  });
}

export function getStageNameFromSlug(slug: string) {
  return Object.entries(stageSlugMap).find(([, value]) => value === slug)?.[0] as
    | StageDefinition["name"]
    | undefined;
}

function extractEngineCode(vehicle: EngineVariant) {
  const modelToken = normalizeSearch(vehicle.model)
    .split(/\s+/)
    .find((token) => /\d/.test(token) && /[a-z]/.test(token));

  if (modelToken) {
    return modelToken;
  }

  const engineTokens = normalizeSearch(vehicle.engine).split(/\s+/);
  const engineCode = engineTokens.find((token) => /\d/.test(token) && token.length > 1);

  if (/^\d+$/.test(engineTokens[0] ?? "") && /^\d+$/.test(engineTokens[1] ?? "")) {
    return engineTokens.slice(0, 3).join(" ");
  }

  return engineCode ?? vehicle.engine;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeFuel(fuel?: string): FuelType | undefined {
  if (!fuel) {
    return undefined;
  }

  const normalized = fuel.toLowerCase();

  if (normalized.includes("diesel")) {
    return "Diesel";
  }

  if (normalized.includes("benzine") || normalized.includes("petrol")) {
    return "Petrol";
  }

  if (normalized.includes("hybride") || normalized.includes("hybrid")) {
    return "Hybrid";
  }

  if (normalized.includes("elektr") || normalized.includes("electric")) {
    return "Electric";
  }

  return undefined;
}
