import type {EngineVariant, StageDefinition} from "./catalog-shared.ts";

/** Bounded public corrections. Canonical imports and provider datasets remain historical evidence.
 * Reviewed 2026-10-04; rationale and independent retrieval receipts are in CATALOG_TRUTH_P0_V1_REVIEW.md.
 * Registration years constrain a public scope; they never identify a fitted engine/controller.
 */
type TruthReview = {
  id: string;
  action: "KEEP" | "CORRECT" | "SPLIT" | "REMOVE_UNSUPPORTED_EXACT_CLAIM" | "MAKE_CONDITIONAL" | "WITHHOLD_OUTPUT";
  years?: [number, number]; generation?: string; engine?: string; stockTorqueNm?: number;
  unknownStockTorque?: boolean; engineCodes?: string[];
  ecu?: string; ecuBasis?: "documented-application" | "unconfirmed"; transmission?: string;
  stage1?: [[number, number], [number, number]];
  note: [string, string, string];
  sources: NonNullable<EngineVariant["outputReferences"]>;
};

export const publicCatalogTruthReviews: TruthReview[] = [
  {
    "id": "bmw-320d-b47",
    "action": "CORRECT",
    "years": [
      2015,
      2019
    ],
    "generation": "F30/F31 LCI",
    "ecu": "Bosch EDC17",
    "ecuBasis": "documented-application",
    "stage1": [
      [
        220,
        225
      ],
      [
        440,
        460
      ]
    ],
    "sources": [
      {
        "title": "factory",
        "url": "https://www.press.bmwgroup.com/netherlands/article/detail/T0216582NL/bmw-presenteert-de-vernieuwde-bmw-3-serie",
        "scope": "factory-b47",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2015-f30-f31-f35-lci/diesel/20d-190",
        "scope": "shiftech-1159",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "mosselman",
        "url": "https://www.mosselmanturbo.com/nl/bmw-320d-f30-f31-lci-190hp",
        "scope": "mosselman-bmw-320d-f30-f31-lci-190hp",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "un",
        "url": "https://www.unlimitedtuning.nl/chiptuning-bmw-320d-f30-f31-190-pk.html",
        "scope": "un-b47",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "F30/F31 LCI, 190 pk / 400 Nm. G20 valt buiten deze indicatie. Motor, ECU en versnellingsbak worden afzonderlijk bevestigd.",
      "F30/F31 LCI, 190 hp / 400 Nm. This indication excludes G20. Engine, ECU and transmission are confirmed separately.",
      "F30/F31 LCI, 190 KM / 400 Nm. Ta prognoza nie dotyczy G20. Silnik, ECU i skrzynię potwierdzimy osobno."
    ]
  },
  {
    "id": "vw-golf-20-tsi-ea888",
    "action": "CORRECT",
    "years": [
      2013,
      2017
    ],
    "generation": "Golf 7",
    "ecu": "Continental Simos 18.x",
    "ecuBasis": "documented-application",
    "stage1": [
      [
        300,
        305
      ],
      [
        440,
        460
      ]
    ],
    "sources": [
      {
        "title": "factory",
        "url": "https://www.volkswagen-newsroom.com/en/engine-versions-golf-7-gti-profile-20034",
        "scope": "factory-gti",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "br",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/",
        "scope": "br-gti",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "unlimited",
        "url": "https://www.unlimitedtuning.nl/chiptuning-volkswagen-golf-7-2-0-gti-performance-230-pk.html",
        "scope": "unlimited-golf-7-2-0-gti-performance-230",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "GTI Performance vóór facelift, 230 pk / 350 Nm. Niet voor standaard GTI, Performance 245 pk, Clubsport, TCR of R. Brandstof en gemonteerde hardware controleren.",
      "GTI Performance before facelift, 230 hp / 350 Nm. Excludes standard GTI, Performance 245 hp, Clubsport, TCR and R. Check fuel and installed hardware.",
      "GTI Performance przed liftingiem, 230 KM / 350 Nm. Nie dotyczy zwykłego GTI, Performance 245 KM, Clubsport, TCR ani R. Sprawdzimy paliwo i osprzęt."
    ]
  },
  {
    "id": "bmw-3-series-g20-g21-320i",
    "action": "CORRECT",
    "stockTorqueNm": 300,
    "ecuBasis": "unconfirmed",
    "sources": [
      {
        "title": "factory",
        "url": "https://www.press.bmwgroup.com/belux/article/detail/T0285543NL/de-nieuwe-bmw-3-reeks-berline?language=nl",
        "scope": "factory-g20",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/bmw/3-serie/2019-g20-g21/petrol/20i-2.0t-eu6d-184",
        "scope": "shiftech-433364",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "G20/G21 320i, Europese 184 pk / 300 Nm-configuratie. Tuningvermogen en ECU-toegang na identificatie; eerste registratie bepaalt de toegang niet.",
      "G20/G21 320i, European 184 hp / 300 Nm configuration. Tuning output and ECU access after identification; first registration does not determine access.",
      "G20/G21 320i, europejska wersja 184 KM / 300 Nm. Parametry tuningu i dostęp do ECU po identyfikacji; data pierwszej rejestracji nie określa dostępu."
    ]
  },
  {
    "id": "volkswagen-golf-7-r-20-tsi",
    "action": "CORRECT",
    "years": [
      2014,
      2016
    ],
    "stockTorqueNm": 380,
    "ecu": "Continental Simos 18.x",
    "ecuBasis": "documented-application",
    "stage1": [
      [
        350,
        350
      ],
      [
        460,
        460
      ]
    ],
    "sources": [
      {
        "title": "factory",
        "url": "https://www.volkswagen-newsroom.com/de/motorversionen-golf-7-steckbrief-20040",
        "scope": "factory-vw",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/volkswagen/golf/2012-vii-mki/petrol/2.0-tsi-300",
        "scope": "shiftech-10594",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "br",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/",
        "scope": "br-r",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "search-index"
      }
    ],
    "note": [
      "Golf 7 R vóór facelift, 300 pk / 380 Nm. Niet voor facelift 310 pk / 400 Nm of latere GPF 300 pk / 400 Nm. Exacte DSG/TCU identificeren.",
      "Golf 7 R before facelift, 300 hp / 380 Nm. Excludes facelift 310 hp / 400 Nm and later GPF 300 hp / 400 Nm. Identify the exact DSG/TCU.",
      "Golf 7 R przed liftingiem, 300 KM / 380 Nm. Nie dotyczy liftingu 310 KM / 400 Nm ani późniejszego GPF 300 KM / 400 Nm. Wymagana identyfikacja DSG/TCU."
    ]
  },
  {
    "id": "bmw-x3-e83-20d",
    "action": "REMOVE_UNSUPPORTED_EXACT_CLAIM",
    "engine": "2.0d",
    "ecuBasis": "unconfirmed",
    "stage1": [
      [
        210,
        215
      ],
      [
        425,
        430
      ]
    ],
    "sources": [
      {
        "title": "factory",
        "url": "https://www.press.bmwgroup.com/global/article/detail/T0011997EN/bmw-x3-best-seller-now-even-more-powerful-and-efficient-bmw-efficientdynamics-in-the-2008-model-year%3A-bmw-x3-2-0d-with-new-four-cylinder-diesel-engine-optional-six-speed-automatic-transmission-fuel-saving-technologies-on-all-variants-of-the-world-s-most-successful-sav-in-the-premium-segment?language=en",
        "scope": "factory-x3",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "sh",
        "url": "https://www.shiftech.eu/en/chiptuning/car/bmw/x3/2003-e83/diesel/20d-177",
        "scope": "sh-x3",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "un",
        "url": "https://www.unlimitedtuning.nl/chiptuning-bmw-x3-2-0d-177-pk.html",
        "scope": "un-x3",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "E83 2.0d, 177 pk / 350 Nm. Exacte motorcode en ECU nog te bevestigen. Handgeschakeld of automaat afzonderlijk controleren.",
      "E83 2.0d, 177 hp / 350 Nm. Exact engine code and ECU still need confirmation. Check manual or automatic transmission separately.",
      "E83 2.0d, 177 KM / 350 Nm. Dokładny kod silnika i ECU wymagają potwierdzenia. Skrzynię ręczną lub automatyczną sprawdzimy osobno."
    ]
  },
  {
    "id": "audi-a4-b9-20-tdi-190",
    "action": "CORRECT",
    "stage1": [
      [
        220,
        225
      ],
      [
        450,
        460
      ]
    ],
    "transmission": "S tronic (longitudinal)",
    "sources": [
      {
        "title": "factory",
        "url": "https://www.audi-mediacenter.com/en/the-audi-a4-major-upgrade-for-the-bestseller-11884/download",
        "scope": "factory-a4",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/audi/a4/2015-b9/diesel/2.0-tdi-cr-eu6-190",
        "scope": "shiftech-416",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "un",
        "url": "https://www.unlimitedtuning.nl/chiptuning-audi-a4-b9-2-0-tdi-190-pk.html",
        "scope": "un-a4",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "B9 2.0 TDI, 190 pk / 400 Nm. Motorcode, emissievariant en longitudinale S tronic/TCU vóór uitvoering controleren.",
      "B9 2.0 TDI, 190 hp / 400 Nm. Check engine code, emissions variant and longitudinal S tronic/TCU before work.",
      "B9 2.0 TDI, 190 KM / 400 Nm. Przed realizacją sprawdzimy kod silnika, wersję emisji i wzdłużną skrzynię S tronic/TCU."
    ]
  },
  {
    "id": "volkswagen-passat-b8-20-tdi",
    "action": "MAKE_CONDITIONAL",
    "unknownStockTorque": true,
    "sources": [
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/volkswagen/passat/2015-b8/diesel/2.0-tdi-cr-eu6-150",
        "scope": "shiftech-10772",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "unlimited",
        "url": "https://www.unlimitedtuning.nl/chiptuning-volkswagen-passat-b8-2-0-tdi-150-pk.html",
        "scope": "unlimited-v2-d903c4a80235bdbf",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "B8 2.0 TDI, 150 pk. Stockkoppel en tuningwaarden na bevestiging van de exacte motor- en transmissievariant.",
      "B8 2.0 TDI, 150 hp. Stock torque and tuning figures after confirming the exact engine and transmission variant.",
      "B8 2.0 TDI, 150 KM. Moment seryjny i parametry tuningu po potwierdzeniu dokładnej wersji silnika i skrzyni."
    ]
  },
  {
    "id": "ford-focus-st-20-ecoboost",
    "action": "WITHHOLD_OUTPUT",
    "sources": [
      {
        "title": "factory",
        "url": "https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf",
        "scope": "factory-focus",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "search-index"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/ford/focus/2014-mkiii/petrol/2.0-t-ecoboost-st-250",
        "scope": "shiftech-ford-focus-2014-mkiii-petrol-20-t-ecoboost-st-250",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "br",
        "url": "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/1124-mk3-2010-2014/1141-st-2-0t-ecoboost/",
        "scope": "br-focus",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "search-index"
      }
    ],
    "note": [
      "Mk3 ST benzine, 2.0 EcoBoost 250 pk / 360 Nm. Geen ST diesel of Mk4. Tuningwaarden na bevestiging van vóór/na facelift, brandstof en kalibratie.",
      "Mk3 ST petrol, 2.0 EcoBoost 250 hp / 360 Nm. Excludes ST diesel and Mk4. Tuning figures after confirming pre/post facelift, fuel and calibration.",
      "Mk3 ST benzyna, 2.0 EcoBoost 250 KM / 360 Nm. Nie dotyczy ST diesel ani Mk4. Parametry tuningu po potwierdzeniu liftingu, paliwa i kalibracji."
    ]
  },
  {
    "id": "volvo-xc60-d5",
    "action": "WITHHOLD_OUTPUT",
    "engineCodes": [
      "D5244T20"
    ],
    "sources": [
      {
        "title": "factory",
        "url": "https://www.volvocars.com/pl/support/car/xc60/2016/article/c48f21dbf78fa679c0a801e800b1d372/",
        "scope": "factory-volvo",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "search-index"
      },
      {
        "title": "un",
        "url": "https://www.unlimitedtuning.nl/chiptuning-volvo-xc60-2015-2-4-d5-220-pk.html",
        "scope": "un-xc60",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "XC60 I D5 AWD, D5244T20 220 pk / 440 Nm. Niet de 220 pk / 420 Nm-variant. Motorcode, automaat en tuningwaarden vóór uitvoering bevestigen.",
      "XC60 I D5 AWD, D5244T20 220 hp / 440 Nm. Excludes the 220 hp / 420 Nm variant. Confirm engine code, automatic transmission and tuning figures before work.",
      "XC60 I D5 AWD, D5244T20 220 KM / 440 Nm. Nie dotyczy wersji 220 KM / 420 Nm. Przed realizacją potwierdzimy kod silnika, automat i parametry tuningu."
    ]
  },
  {
    "id": "seat-leon-cupra-5f-20-tsi-300",
    "action": "MAKE_CONDITIONAL",
    "unknownStockTorque": true,
    "ecu": "Continental Simos 18.x",
    "ecuBasis": "documented-application",
    "sources": [
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/2.0-tsi-300",
        "scope": "shiftech-9457",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "vag",
        "url": "https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/",
        "scope": "vag-cupra",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "search-index"
      }
    ],
    "note": [
      "Leon Cupra 5F 300 pk. Exact stockkoppel, emissievariant en versnellingsbak nog te bevestigen; Golf R-waarden zijn niet overdraagbaar.",
      "Leon Cupra 5F 300 hp. Exact stock torque, emissions variant and transmission still need confirmation; Golf R figures do not transfer.",
      "Leon Cupra 5F 300 KM. Moment seryjny, wersja emisji i skrzynia wymagają potwierdzenia; wartości Golfa R nie mają tu automatycznie zastosowania."
    ]
  },
  {
    "id": "mercedes-a45-amg-m133",
    "action": "MAKE_CONDITIONAL",
    "stage1": [
      [
        400,
        410
      ],
      [
        530,
        540
      ]
    ],
    "sources": [
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/mercedes/a/2012-w176/essence/45-amg-2.0t-360",
        "scope": "shiftech-6051",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "unlimited",
        "url": "https://www.unlimitedtuning.nl/chiptuning-mercedes-benz-w176-a45-amg-360-pk.html",
        "scope": "unlimited-counterpart-6051",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "W176 M133 360 pk / 450 Nm-configuratie. Niet voor facelift 381 pk / 475 Nm of W177. Brandstof, ECU en transmissie bevestigen.",
      "W176 M133 360 hp / 450 Nm configuration. Excludes facelift 381 hp / 475 Nm and W177. Confirm fuel, ECU and transmission.",
      "W176 M133, wersja 360 KM / 450 Nm. Nie dotyczy liftingu 381 KM / 475 Nm ani W177. Potwierdzimy paliwo, ECU i skrzynię."
    ]
  },
  {
    "id": "bmw-1-series-f20-f21-118d",
    "action": "MAKE_CONDITIONAL",
    "engine": "2.0 diesel",
    "unknownStockTorque": true,
    "ecu": "Bosch EDC17",
    "ecuBasis": "documented-application",
    "sources": [
      {
        "title": "factory",
        "url": "https://www.press.bmwgroup.com/global/article/attachment/T0200199EN/302716",
        "scope": "factory-118d",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "factory",
        "url": "https://www.press.bmwgroup.com/united-kingdom/article/detail/T0200962EN_GB/the-bmw-1-series-for-2015",
        "scope": "factory-118d-uk",
        "retrievedAt": "2026-10-04",
        "sourceType": "manufacturer",
        "retrievalMethod": "page"
      },
      {
        "title": "shiftech",
        "url": "https://www.shiftech.eu/en/chiptuning/car/bmw/1-serie/2015-f20-lci/diesel/18d-150",
        "scope": "shiftech-1000",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      },
      {
        "title": "mosselman",
        "url": "https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp",
        "scope": "mosselman-bmw-118d-f20-f21-lci-150hp",
        "retrievedAt": "2026-10-04",
        "sourceType": "tuner",
        "retrievalMethod": "page"
      }
    ],
    "note": [
      "F20/F21 118d, 150 pk. Stockkoppel en tuningwaarden na bevestiging van de marktuitvoering en motor-/transmissievariant.",
      "F20/F21 118d, 150 hp. Stock torque and tuning figures after confirming market specification and engine/transmission variant.",
      "F20/F21 118d, 150 KM. Moment seryjny i parametry tuningu po potwierdzeniu wersji rynkowej, silnika i skrzyni."
    ]
  }
];

export function applyPublicCatalogTruth(vehicle: EngineVariant): EngineVariant {
  const review = publicCatalogTruthReviews.find(row => row.id === vehicle.id);
  if (!review) return vehicle;
  const years = review.years
    ? Array.from({length: review.years[1] - review.years[0] + 1}, (_, i) => review.years![0] + i) : vehicle.years;
  const engineCodes = review.engineCodes ?? (review.id === "bmw-320d-b47" ? ["B47"] : undefined);
  const ecu = review.ecu ?? (review.ecuBasis === "unconfirmed" ? undefined : vehicle.ecuSupport?.family);
  const stages: StageDefinition[] = vehicle.stages.map(stage => {
    const ranged = stage.name === "Stage 1" && review.stage1;
    return {...stage, powerHp: undefined, torqueNm: undefined,
      powerRangeHp: ranged ? [...ranged[0]] : undefined, torqueRangeNm: ranged ? [...ranged[1]] : undefined,
      approximate: Boolean(ranged), provenance: ranged ? "multi-source" : "reviewed",
      confidenceLevel: "manual-review", customHardware: stage.name !== "Stage 1",
      quoteRequired: !ranged, hardwareScopeApproved: false,
      requirements: stage.name === "Stage 1" ? "Confirm engine, fuel, original hardware, ECU access and transmission before work."
        : "Custom hardware and calibration; scope and quote after vehicle review.",
      customerScope: {fuelRon: [], hardware: []}, comparison: undefined,
      notes: [], packageItems: [], hardwareRequired: stage.name !== "Stage 1"};
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
