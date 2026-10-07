import taxonomy from "./catalog-taxonomy-v2.json" with {type: "json"};
import type {VehicleSelectorItem} from "./catalog-selector.ts";

export type CatalogTaxonomyRow = {
  id: string;
  brand: string;
  model: string;
  generation: string;
  yearFrom: number;
  yearTo: number;
  engine: string;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "Unknown";
  displacementCc?: number;
  stockPowerHp?: number;
  sourceUrl: string;
};

type TaxonomySnapshot = {
  schemaVersion: number;
  kind: "selector-taxonomy-discovery";
  source: {
    provider: string;
    role: "taxonomy-only";
    discoveryUrl: string;
    retrievedAt: string;
    contentSha256: string;
  };
  policy: string;
  count: number;
  rows: CatalogTaxonomyRow[];
};

const snapshot = taxonomy as TaxonomySnapshot;

export const catalogTaxonomyV2 = snapshot.rows;
export const catalogTaxonomyV2Count = snapshot.count;
export const catalogTaxonomyV2Source = snapshot.source;

export function taxonomyBrands() {
  return Array.from(new Set(catalogTaxonomyV2.map(row => row.brand))).sort();
}

export function taxonomyModelsForBrand(brand: string) {
  return Array.from(
    new Set(catalogTaxonomyV2.filter(row => row.brand === brand).map(row => row.model))
  ).sort();
}

export function taxonomyYearsForModel(brand: string, model: string) {
  const years = new Set<number>();
  for (const row of catalogTaxonomyV2) {
    if (row.brand !== brand || row.model !== model) continue;
    for (let year = row.yearFrom; year <= row.yearTo; year += 1) years.add(year);
  }
  return Array.from(years).sort((a, b) => b - a);
}

export function taxonomyRowsForSelection(brand: string, model: string, year: number) {
  return catalogTaxonomyV2
    .filter(row => row.brand === brand && row.model === model && year >= row.yearFrom && year <= row.yearTo)
    .sort((a, b) =>
      (a.stockPowerHp ?? Number.MAX_SAFE_INTEGER) - (b.stockPowerHp ?? Number.MAX_SAFE_INTEGER) ||
      a.engine.localeCompare(b.engine) ||
      a.generation.localeCompare(b.generation)
    );
}

export function taxonomySelectorItem(row: CatalogTaxonomyRow): VehicleSelectorItem {
  return {
    kind: "taxonomy",
    id: row.id,
    brand: row.brand,
    model: row.model,
    engine: row.engine,
    version: row.generation,
    yearRange: row.yearFrom === row.yearTo ? String(row.yearFrom) : `${row.yearFrom}–${row.yearTo}`,
    ecuType: "Vehicle identification required",
    popular: false,
    quote: {
      kind: "on-request",
      currency: "EUR",
      reasonCode: "TAXONOMY_DISCOVERY_REQUIRES_TUNING_EVIDENCE"
    }
  };
}

export function searchTaxonomySelectorItems(query: string, limit = 4) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  return catalogTaxonomyV2
    .map(row => {
      const haystack = [
        row.brand,
        row.model,
        row.generation,
        row.engine,
        String(row.yearFrom),
        String(row.yearTo),
        row.stockPowerHp ? String(row.stockPowerHp) : ""
      ].join(" ").toLowerCase();
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return {row, score};
    })
    .filter(item => item.score === tokens.length)
    .sort((a, b) =>
      (b.row.yearTo - a.row.yearTo) ||
      ((a.row.stockPowerHp ?? Number.MAX_SAFE_INTEGER) - (b.row.stockPowerHp ?? Number.MAX_SAFE_INTEGER)) ||
      a.row.engine.localeCompare(b.row.engine)
    )
    .slice(0, limit)
    .map(item => taxonomySelectorItem(item.row));
}

export function hasTaxonomyCoverage(brand: string, model: string, year: number) {
  return catalogTaxonomyV2.some(
    row => row.brand === brand && row.model === model && year >= row.yearFrom && year <= row.yearTo
  );
}
