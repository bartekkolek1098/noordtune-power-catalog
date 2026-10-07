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
  }
];
