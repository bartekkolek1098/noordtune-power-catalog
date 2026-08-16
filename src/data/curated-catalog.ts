export type CuratedVehiclePublication = {
  id: string;
  sourceId: string;
  model: string;
  version: string;
  generation: string;
  platform: string;
  yearRange: string;
  years: number[];
  seoModelSlug: string;
  seoEngineSlug: string;
  imageStatus: "dedicated" | "family-level" | "generic-placeholder";
  dataNotes: string[];
  technicalNotes: string[];
};

const ESTIMATE_NOTE =
  "Published from an existing canonical estimate; exact engine, ECU and TCU variants require vehicle-specific confirmation.";
const SERVICE_NOTE =
  "Listed services remain subject to diagnosis, legal review and vehicle-specific compatibility confirmation.";

export const curatedVehiclePublications: CuratedVehiclePublication[] = [
  {
    id: "bmw-1-series-f20-f21-118i",
    sourceId: "bmw-1-serie-118i-2016",
    model: "1 Serie F20/F21 118i",
    version: "F20/F21 118i catalog estimate",
    generation: "F20/F21",
    platform: "BMW 1 Series F20/F21",
    yearRange: "2015-2019",
    years: [2015, 2016, 2017, 2018, 2019],
    seoModelSlug: "1-series-f20-f21",
    seoEngineSlug: "118i",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-1-series-f20-f21-118d",
    sourceId: "bmw-1-serie-118d-2015",
    model: "1 Serie F20/F21 118d",
    version: "F20/F21 118d catalog estimate",
    generation: "F20/F21",
    platform: "BMW 1 Series F20/F21",
    yearRange: "2015-2019",
    years: [2015, 2016, 2017, 2018, 2019],
    seoModelSlug: "1-series-f20-f21",
    seoEngineSlug: "118d",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-1-series-f20-f21-120d",
    sourceId: "bmw-1-serie-120d-2015",
    model: "1 Serie F20/F21 120d",
    version: "F20/F21 120d catalog estimate",
    generation: "F20/F21",
    platform: "BMW 1 Series F20/F21",
    yearRange: "2015-2019",
    years: [2015, 2016, 2017, 2018, 2019],
    seoModelSlug: "1-series-f20-f21",
    seoEngineSlug: "120d",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-3-series-f30-f31-318d",
    sourceId: "bmw-3-serie-318d-2015",
    model: "3 Serie F30/F31 318d",
    version: "F30/F31 318d catalog estimate",
    generation: "F30/F31",
    platform: "BMW 3 Series F30/F31",
    yearRange: "2015-2019",
    years: [2015, 2016, 2017, 2018, 2019],
    seoModelSlug: "3-series-f30-f31",
    seoEngineSlug: "318d",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-3-series-f30-f31-330d",
    sourceId: "bmw-3-serie-330d-2015",
    model: "3 Serie F30/F31 330d",
    version: "F30/F31 330d catalog estimate",
    generation: "F30/F31",
    platform: "BMW 3 Series F30/F31",
    yearRange: "2012-2019",
    years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    seoModelSlug: "3-series-f30-f31",
    seoEngineSlug: "330d",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-5-series-f10-f11-520d",
    sourceId: "bmw-5-serie-520d-2015",
    model: "5 Serie F10/F11 520d",
    version: "F10/F11 520d catalog estimate",
    generation: "F10/F11",
    platform: "BMW 5 Series F10/F11",
    yearRange: "2014-2017",
    years: [2014, 2015, 2016, 2017],
    seoModelSlug: "5-series-f10-f11",
    seoEngineSlug: "520d",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "bmw-3-series-g20-g21-320i",
    sourceId: "bmw-3-serie-320i-2019",
    model: "3 Serie G20/G21 320i",
    version: "G20/G21 320i catalog estimate",
    generation: "G20/G21",
    platform: "BMW 3 Series G20/G21",
    yearRange: "2019-2024",
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    seoModelSlug: "3-series-g20-g21",
    seoEngineSlug: "320i",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "volkswagen-golf-7-16-tdi",
    sourceId: "volkswagen-golf-1-6-tdi-2017",
    model: "Golf 7 1.6 TDI",
    version: "Golf 7 1.6 TDI catalog estimate",
    generation: "Golf 7",
    platform: "MQB",
    yearRange: "2017-2020",
    years: [2017, 2018, 2019, 2020],
    seoModelSlug: "golf-7",
    seoEngineSlug: "1-6-tdi",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "volkswagen-golf-7-20-tdi",
    sourceId: "volkswagen-golf-2-0-tdi-2015",
    model: "Golf 7 2.0 TDI",
    version: "Golf 7 2.0 TDI catalog estimate",
    generation: "Golf 7",
    platform: "MQB",
    yearRange: "2013-2020",
    years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    seoModelSlug: "golf-7",
    seoEngineSlug: "2-0-tdi-150",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "volkswagen-golf-7-r-20-tsi",
    sourceId: "volkswagen-golf-r-2-0-tsi-r-2017",
    model: "Golf 7 R",
    version: "Golf 7 R 2.0 TSI catalog estimate",
    generation: "Golf 7",
    platform: "MQB",
    yearRange: "2017-2018",
    years: [2017, 2018],
    seoModelSlug: "golf-7-r",
    seoEngineSlug: "2-0-tsi-300",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "volkswagen-passat-b8-20-tdi",
    sourceId: "volkswagen-passat-2-0-tdi-2017",
    model: "Passat B8 2.0 TDI",
    version: "Passat B8 2.0 TDI catalog estimate",
    generation: "B8",
    platform: "MQB",
    yearRange: "2015-2020",
    years: [2015, 2016, 2017, 2018, 2019, 2020],
    seoModelSlug: "passat-b8",
    seoEngineSlug: "2-0-tdi-150",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "audi-a3-8v-16-tdi",
    sourceId: "audi-a3-1-6-tdi-2017",
    model: "A3 8V 1.6 TDI",
    version: "A3 8V 1.6 TDI catalog estimate",
    generation: "8V",
    platform: "MQB",
    yearRange: "2017-2020",
    years: [2017, 2018, 2019, 2020],
    seoModelSlug: "a3-8v",
    seoEngineSlug: "1-6-tdi",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "audi-a4-b9-20-tdi-190",
    sourceId: "audi-a4-2-0-tdi-190-2017",
    model: "A4 B9 2.0 TDI",
    version: "A4 B9 2.0 TDI 190 catalog estimate",
    generation: "B9",
    platform: "MLB Evo",
    yearRange: "2016-2020",
    years: [2016, 2017, 2018, 2019, 2020],
    seoModelSlug: "a4-b9",
    seoEngineSlug: "2-0-tdi-190",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "audi-a4-b9-20-tfsi",
    sourceId: "audi-a4-2-0-tfsi-2017",
    model: "A4 B9 2.0 TFSI",
    version: "A4 B9 2.0 TFSI catalog estimate",
    generation: "B9",
    platform: "MLB Evo",
    yearRange: "2016-2020",
    years: [2016, 2017, 2018, 2019, 2020],
    seoModelSlug: "a4-b9",
    seoEngineSlug: "2-0-tfsi-252",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "audi-a6-c7-30-tdi-272",
    sourceId: "audi-a6-3-0-tdi-272-2016",
    model: "A6 C7 3.0 TDI",
    version: "A6 C7 3.0 TDI 272 catalog estimate",
    generation: "C7",
    platform: "MLB",
    yearRange: "2014-2018",
    years: [2014, 2015, 2016, 2017, 2018],
    seoModelSlug: "a6-c7",
    seoEngineSlug: "3-0-tdi-272",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "skoda-octavia-5e-20-tdi-150",
    sourceId: "skoda-octavia-2-0-tdi-150-2017",
    model: "Octavia 5E 2.0 TDI",
    version: "Octavia 5E 2.0 TDI 150 catalog estimate",
    generation: "5E",
    platform: "MQB",
    yearRange: "2013-2020",
    years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    seoModelSlug: "octavia-5e",
    seoEngineSlug: "2-0-tdi-150",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  },
  {
    id: "seat-leon-cupra-5f-20-tsi-300",
    sourceId: "seat-leon-cupra-2-0-tsi-cupra-2017",
    model: "Leon Cupra 5F",
    version: "Leon Cupra 5F 2.0 TSI 300 catalog estimate",
    generation: "5F",
    platform: "MQB",
    yearRange: "2017-2018",
    years: [2017, 2018],
    seoModelSlug: "leon-cupra-5f",
    seoEngineSlug: "2-0-tsi-300",
    imageStatus: "generic-placeholder",
    dataNotes: [ESTIMATE_NOTE],
    technicalNotes: [SERVICE_NOTE]
  }
];

export const curatedVehiclePublicationById = new Map(
  curatedVehiclePublications.map((publication) => [publication.id, publication])
);
