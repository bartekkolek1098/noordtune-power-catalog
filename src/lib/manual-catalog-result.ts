// Server only. Discovery taxonomy identifies a selection, NEVER supplies tuning gains.
import {catalogTaxonomyV2} from "../data/catalog-taxonomy-v2.ts";
import {sourcedTuningProfiles, tuningProfileSources} from "../data/tuning-profiles/index.ts";
import {matchSourcedProfile} from "./sourced-tuning-match.ts";
import type {ManualCatalogResult} from "../data/manual-catalog-result.ts";

const byId = new Map(catalogTaxonomyV2.map(row => [row.id, row]));
const sourceById = new Map(tuningProfileSources.map(source => [source.id, source]));
const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;
const band = (values: number[]): [number, number] => [Math.min(...values), Math.max(...values)];

/** Resolve only a known taxonomy ID and an explicitly selected, in-scope year.
 * Uses existing generation/badge/fuel/displacement/power matching without changing
 * RDW matching or inventing a registered vehicle type, VIN or an ECU identity.
 */
export function getManualCatalogResult(id: string, selectedYear?: number): ManualCatalogResult | undefined {
  const row = byId.get(id);
  if (!row || (selectedYear !== undefined && (!Number.isInteger(selectedYear) || selectedYear < row.yearFrom || selectedYear > row.yearTo))) return undefined;
  const kw = row.engine.match(/\b(\d+(?:[.,]\d+)?)\s*kW\b/i)?.[1];
  const result: ManualCatalogResult = {
    vehicle: {
      id: row.id, brand: row.brand, model: row.model, generation: row.generation,
      engine: row.engine, fuel: row.fuel, yearFrom: row.yearFrom, yearTo: row.yearTo,
      selectedYear, displacementCc: row.displacementCc, stockPowerHp: row.stockPowerHp,
      ...(kw ? {stockPowerKw: Number(kw.replace(",", "."))} : {})
    },
    status: selectedYear === undefined ? "select-year" : "needs-review", sources: [], fuelRon: []
  };
  if (selectedYear === undefined || !positive(row.stockPowerHp) || !positive(row.displacementCc)
    || !["Petrol", "Diesel"].includes(row.fuel) || !row.generation) return result;

  // Exact catalog PS separates e.g. 118i 136 from 118i 140. The taxonomy's nominal
  // displacement is passed unchanged; existing matcher retains its narrow checks.
  const candidates = sourcedTuningProfiles.filter(source => positive(source.stockPowerHp)
    && Math.abs(source.stockPowerHp - row.stockPowerHp!) <= 0.51 && Boolean(source.generation));
  const match = matchSourcedProfile({
    make: row.brand, model: `${row.model} ${row.engine}`, variant: row.generation,
    fuel: row.fuel, displacementCc: row.displacementCc,
    registeredPower: {value: row.stockPowerHp, unit: "PS"}, firstRegistrationYear: selectedYear
  }, candidates);
  const source = match.profile;
  if (!source) return result;

  const published = source.stage1.sourceValues.flatMap(value => {
    const reference = sourceById.get(value.sourceId);
    if (!reference || !positive(value.powerHp) || value.powerHp <= row.stockPowerHp!
      || value.powerUnit !== "PS" || !reference.url?.startsWith("https://")) return [];
    let url: URL;
    try { url = new URL(reference.url); } catch { return []; }
    if (url.username || url.password || url.protocol !== "https:") return [];
    return [{title: url.hostname.replace(/^www\./, ""), url: url.href, powerHp: value.powerHp,
      ...(value.torqueUnit === "Nm" && positive(value.torqueNm) ? {torqueNm: value.torqueNm} : {})}];
  });
  const sources = [...new Map(published.map(item => [item.url, item])).values()].slice(0, 8);
  if (!sources.length) return result;
  const torqueValues = sources.map(s => s.torqueNm).filter(positive);
  const conditions = [...source.conditions, ...source.stage1.conditions,
    ...source.stage1.sourceValues.flatMap(value => value.conditions ?? [])].join(" ");
  const fuelRon = [...new Set([...conditions.matchAll(/\bRON\s*(95|98|100|102)\b/gi)].map(value => Number(value[1])))].sort((a, b) => a - b);
  return {...result, status: "source-comparison", sourceProfileId: source.id, sources, fuelRon,
    stage1: {powerHp: band(sources.map(s => s.powerHp)),
      ...(torqueValues.length === sources.length ? {torqueNm: band(torqueValues)} : {}),
      ...(positive(source.stockTorqueNm) ? {stockTorqueNm: source.stockTorqueNm} : {})}};
}
