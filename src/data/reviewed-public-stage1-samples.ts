/**
 * SERVER ONLY. Independently observed, narrowly dated source applications.
 * These are comparative reference samples, NEVER published NoordTune targets
 * or proof of exact ECU applicability. No third-party database is copied.
 */
export type ReviewedPublicStage1Sample = {
  id: string;
  publicVehicleId: string;
  expectedMake: string;
  expectedModel: string;
  expectedGeneration: string;
  expectedFuel: "Petrol" | "Diesel";
  displacementCc: number;
  stockPowerHp: number;
  stockTorqueNm: number;
  yearFrom: number;
  yearTo: number;
  powerRangeHp: [number, number];
  torqueRangeNm: [number, number];
  sourceUrls: string[];
  /** Source dyno baseline when different from manufacturer/vehicle-card stock. */
  observedStockPowerHp?: number;
  observedStockTorqueNm?: number;
  sourceStageLabel?: "Stage 1+";
  sourceEngineCode?: string;
  awdOnly?: boolean;
  ecuDecodeRequired?: boolean;
  /** Count only published tuning outputs, excluding manufacturer/factory specifications. */
  stage1ObservationCount?: number;
  reviewedAt: string;
  status: "owner-review-required";
};

export const reviewedPublicStage1Samples: readonly ReviewedPublicStage1Sample[] = [
  {
    id: "research-bmw-520d-f10-190-400",
    publicVehicleId: "bmw-5-series-f10-f11-520d",
    expectedMake: "BMW", expectedModel: "5 Serie F10/F11 520d", expectedGeneration: "F10/F11",
    expectedFuel: "Diesel", displacementCc: 1995, stockPowerHp: 190, stockTorqueNm: 400,
    yearFrom: 2014, yearTo: 2016,
    powerRangeHp: [220, 220], torqueRangeNm: [440, 460],
    sourceUrls: [
      "https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/5-bmw/571-serie-5/579-f1x-2010-10-2016/6798-520d/",
      "https://www.bps-tuning.ro/soft-putere-stage-1-bmw-520d/"
    ],
    reviewedAt: "2026-10-07", status: "owner-review-required"
  },
  {
    id: "research-bmw-g20-320i-184-300",
    publicVehicleId: "bmw-3-series-g20-g21-320i",
    expectedMake: "BMW", expectedModel: "3 Serie G20/G21 320i", expectedGeneration: "G20/G21",
    expectedFuel: "Petrol", displacementCc: 1998, stockPowerHp: 184, stockTorqueNm: 300,
    yearFrom: 2019, yearTo: 2021,
    powerRangeHp: [260, 260], torqueRangeNm: [420, 420],
    sourceUrls: [
      "https://www.cscmotors.com/remapping-stats/BMW/3-series/g2x-2019/320i-184hp-1131"
    ],
    reviewedAt: "2026-10-07", status: "owner-review-required"
  },
  {
    id: "research-audi-a3-8v-16tdi-116-250",
    publicVehicleId: "audi-a3-8v-16-tdi",
    expectedMake: "Audi", expectedModel: "A3 8V 1.6 TDI", expectedGeneration: "8V",
    expectedFuel: "Diesel", displacementCc: 1598, stockPowerHp: 116, stockTorqueNm: 250,
    yearFrom: 2017, yearTo: 2018,
    powerRangeHp: [140, 145], torqueRangeNm: [310, 320],
    sourceUrls: [
      "https://www.br-performance.be/en-be/chiptuning/1-cars/11-audi/213-a3/8607-8v-facelift-07-2016-2020/9567-1-6-tdi-2017-2018/",
      "https://www.vagtechniek.nl/chiptuning/audi/a3/8v-facelift/1.6-tdi-116pk/"
    ],
    reviewedAt: "2026-10-07", status: "owner-review-required"
  },
  {
    id: "research-audi-a3-8v-20tdi-150-340",
    publicVehicleId: "audi-a3-20-tdi",
    expectedMake: "Audi", expectedModel: "A3 2.0 TDI", expectedGeneration: "8V",
    expectedFuel: "Diesel", displacementCc: 1968, stockPowerHp: 150, stockTorqueNm: 340,
    yearFrom: 2016, yearTo: 2018,
    powerRangeHp: [195, 195], torqueRangeNm: [430, 430],
    sourceUrls: [
      "https://www.br-performance.be/en-be/chiptuning/1-cars/11-audi/213-a3/8607-8v-facelift-07-2016-2020/8612-2-0-tdi/",
      "https://tuning.aktuning.se/audi/a3/8v-mk2-2016-2019/20-tdi-150-hk/steg-1"
    ],
    reviewedAt: "2026-10-07", status: "owner-review-required"
  },
  {
    id: "research-vw-golf7-mk2-dfga-150-340",
    publicVehicleId: "volkswagen-golf-7-20-tdi",
    expectedMake: "Volkswagen", expectedModel: "Golf 7 2.0 TDI", expectedGeneration: "Golf 7",
    expectedFuel: "Diesel", displacementCc: 1968, stockPowerHp: 150, stockTorqueNm: 340,
    yearFrom: 2017, yearTo: 2019,
    powerRangeHp: [185, 185], torqueRangeNm: [425, 425],
    sourceUrls: [
      "https://www.biesseracing.com/en/listino/volkswagen/golf%3A319%3Agolf-VIIMk/volkswagen-golf-2-0-tdi-150cv-dfga.html"
    ],
    reviewedAt: "2026-10-08", status: "owner-review-required"
  },
  {
    id: "research-audi-a6-c7-eu6-272-600",
    publicVehicleId: "audi-a6-c7-30-tdi-272",
    expectedMake: "Audi", expectedModel: "A6 C7 3.0 TDI", expectedGeneration: "C7",
    expectedFuel: "Diesel", displacementCc: 2967, stockPowerHp: 272, stockTorqueNm: 600,
    yearFrom: 2015, yearTo: 2018,
    powerRangeHp: [300, 308], torqueRangeNm: [650, 668],
    sourceUrls: [
      "https://www.turboperformance.de/chiptuning/pkw/audi/a6-c7/3.0-v6-tdi-272PS",
      "https://proremaps.co.uk/remap-stats/audi-a6-c7-2011-2018-3-0-tdi-eu6-272hp-203kw-600nm/"
    ],
    reviewedAt: "2026-10-08", status: "owner-review-required"
  },
  {
    id: "research-skoda-octavia5e-150-340-dff-dcy",
    publicVehicleId: "skoda-octavia-5e-20-tdi-150",
    expectedMake: "Skoda", expectedModel: "Octavia 5E 2.0 TDI", expectedGeneration: "5E",
    expectedFuel: "Diesel", displacementCc: 1968, stockPowerHp: 150, stockTorqueNm: 340,
    yearFrom: 2017, yearTo: 2018,
    powerRangeHp: [170, 170], torqueRangeNm: [380, 380],
    sourceUrls: [
      "https://www.swperformance.de/filter/fahrzeugtyp/pkw/marke/skoda/modell/octavia/typ/octavia_iii_-_5e_seit_11.2012/motorisierung/2.0_tdi_cr_-_150ps.html",
      "https://www.autoweek.nl/auto/90479/skoda-octavia-2-0-tdi-150pk-greentech-style/"
    ],
    sourceEngineCode: "DFF / DCY", stage1ObservationCount: 1,
    reviewedAt: "2026-10-08", status: "owner-review-required"
  },
  {
    id: "research-volvo-xc60i-d5244t20-awd-bsr-2016",
    publicVehicleId: "volvo-xc60-d5",
    expectedMake: "Volvo", expectedModel: "XC60 D5", expectedGeneration: "XC60 I",
    expectedFuel: "Diesel", displacementCc: 2400, stockPowerHp: 220, stockTorqueNm: 440,
    yearFrom: 2016, yearTo: 2017,
    // BSR's published measured stock reading is different from Volvo's 220/440
    // manufacturer specification. Never subtract one source from the other.
    observedStockPowerHp: 221, observedStockTorqueNm: 428,
    powerRangeHp: [282, 282], torqueRangeNm: [533, 533],
    sourceStageLabel: "Stage 1+",
    sourceEngineCode: "D5244T20", awdOnly: true, ecuDecodeRequired: true,
    stage1ObservationCount: 1,
    sourceUrls: [
      "https://www.bsrtuning.nl/tuning-kits/t/3265/volvo-xc60-d5-awd-220hp-2016-2017-d-5244-t20",
      "https://www.volvocars.com/nl/support/car/xc60/16w17/article/d24bb7d1e21ec6e4c0a801e801cf6114/510652ac31fe5b38c0a801e8014486bc/c48f21dbf78fa679c0a801e800b1d372/"
    ],
    reviewedAt: "2026-10-08", status: "owner-review-required"
  }
];
