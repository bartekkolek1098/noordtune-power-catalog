export const publicCatalogTruthGrades = {
  "bmw-3-series-g20-g21-320i": "C",
  "volkswagen-passat-b8-20-tdi": "B",
  "ford-focus-st-20-ecoboost": "B",
  "seat-leon-cupra-5f-20-tsi-300": "B",
  "bmw-1-series-f20-f21-118d": "B"
} as const;

export function getPublicCatalogTruthGrade(id: string) {
  return publicCatalogTruthGrades[id as keyof typeof publicCatalogTruthGrades];
}
