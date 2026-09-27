import type {EstimateSourceReference} from "./tuning-estimates-shared.ts";

// Supplemental research does not overwrite the existing catalog/reference figures.
// These comparisons do not identify the installed engine, ECU, gearbox or access method.
const retrievedAt = "2026-09-15";

export const connectResearchSources: Record<string, EstimateSourceReference> = {
  ford2015: {
    title: "Ford: Transit Connect 1.5 TDCi introduction (2015)",
    url: "https://media.ford.com/content/fordmedia/feu/gb/en/news/2015/06/09/ford-delivers-class-leading-fuel-efficiency-and-segment-first-te.html",
    scope: "Manufacturer: 1.5 TDCi ECOnetic 100 PS / 250 Nm, Euro Stage VI, introduced summer 2015. This specification does not identify a particular registered vehicle.",
    sourceType: "manufacturer", retrievalMethod: "search-index", retrievedAt
  },
  ford2018: {
    title: "Ford: Transit Connect EcoBlue introduction (2018)",
    url: "https://media.ford.com/content/fordmedia/feu/de/de/news/2018/07/11/ford-transit-connect-und-ford-transit-courier-mit-neuen-motoren-.html",
    scope: "Manufacturer: new 1.5 EcoBlue 75/100/120 PS Connect, with market introduction in Q3 2018. First admission in 2018 is not engine-generation evidence.",
    sourceType: "manufacturer", retrievalMethod: "search-index", retrievedAt
  },
  br: {
    title: "BR-Performance: Transit Connect II 1.5 TDCi 100",
    url: "https://www.br-performance.be/nl-be/chiptuning/1-wagens/23-ford/12693-transit-connect/14273-ii-2013-2018/22985-1-5-tdci/",
    scope: "Tuner application labelled 2015–2018 1.5 TDCi: stock 100 pk / 250 Nm; Stage 1 125 pk / 330 Nm. A published reference, not a universal limit or NoordTune measurement.",
    sourceType: "tuner", retrievalMethod: "search-index", retrievedAt
  },
  unlimited: {
    title: "Unlimited Tuning: Transit Connect 1.5 TDCi 100",
    url: "https://www.unlimitedtuning.nl/chiptuning-ford-transit-connect-1-5-tdci-100-pk.html",
    scope: "Tuner application: stock 100 pk / 250 Nm, Stage 1 140 pk / 340 Nm and separately named Stage 1+ 145 pk / 355 Nm. Broad engine/year labels do not establish applicability to a specific vehicle; Stage 1+ is not relabelled Stage 2.",
    sourceType: "tuner", retrievalMethod: "page", retrievedAt
  },
  shiftech: {
    title: "Shiftech: Transit Connect 2016 1.5 TDCI EU5 100",
    url: "https://www.shiftech.eu/en/chiptuning/car/ford/transit-connect/2016/diesel/1.5-tdci-eu5-100",
    scope: "Tuner application explicitly labelled 2016 1.5 TDCI EU5: stock 100 hp / 250 Nm, Stage 1 125 hp / 330 Nm and Stage 2 135 hp / 350 Nm. Source Stage 2 requires installed-part review. The EU5 label differs from Ford's 2015 Euro VI specification; applicability to a specific vehicle needs confirmation.",
    sourceType: "tuner", retrievalMethod: "page", retrievedAt
  }
};

export const connectStage1Comparison = {
  status: "conditional-reference-comparison" as const,
  powerRangeHp: [125, 140] as [number, number],
  torqueRangeNm: [330, 340] as [number, number],
  sourceReferences: Object.values(connectResearchSources),
  conditions: [
    "Published comparable 1.5 TDCi 100 Stage 1 references span 125–140 pk and 330–340 Nm; the endpoints are source comparisons, not a measured interval or guaranteed result.",
    "The 2018 TDCi/EcoBlue transition remains unresolved without engine-generation evidence. Keep this estimate conditional when the detected vehicle has no confirmed engine-generation evidence.",
    "Stock torque 250 Nm belongs to the conditional reference configuration; RDW did not report measured or registered torque.",
    "ECU, transmission, vehicle condition and software/hardware scope require confirmation before work. Published access methods do not prove the installed ECU or unlock status."
  ]
};

/** Optional source candidate, usable only when its application and stage progression fit. */
export const connectStage2ConditionalReference = {
  name: "Stage 2" as const,
  powerHp: 135,
  torqueNm: 350,
  sourceReferences: [connectResearchSources.shiftech],
  applicability: {
    family: "tdci-pre-facelift" as const,
    sourceEmissionsLabel: "EU5",
    requiresEngineGenerationEvidence: true,
    requiresHardwareReview: true
  },
  conditions: [
    "The Shiftech 2016 TDCI EU5 application and installed hardware must be reviewed; its applicability to the detected vehicle is not established by these source figures.",
    "Do not combine the 135 pk source Stage 2 with a 140 pk Stage 1 endpoint as an increasing package ladder. They are different tuner scopes.",
    "This is a conditional third-party source candidate, not an approved NoordTune target or a dyno measurement."
  ]
};
