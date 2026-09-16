/* eslint-disable @typescript-eslint/no-require-imports */
// Only server-side aggregates are requested. Individual QA vehicles use a separate,
// bounded sample; fuel/power are never imputed into these exact fleet counts.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {fetchPage} = require('./research-fetch.cjs');
const VEHICLE_DATASET = 'm9d7-ebf2';
const FUEL_DATASET = '8ys7-d773';
const POPULATION = "export_indicator = 'Nee' AND (voertuigsoort = 'Personenauto' OR (voertuigsoort = 'Bedrijfsauto' AND toegestane_maximum_massa_voertuig <= 3500))";
const GROUP = 'merk,handelsbenaming,cilinderinhoud,aantal_cilinders,voertuigsoort,floor(date_extract_y(datum_eerste_toelating_dt)/5)*5';
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function queryUrl(dataset, query) {
  const url = new URL(`https://opendata.rdw.nl/resource/${dataset}.json`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(`$${key}`, String(value));
  return url.href;
}
async function getJson(url, options = {}) {
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetchPage(url, {...options, refresh: options.refresh || attempt > 0});
    if (response.status === 'retrieved') return {response, rows: JSON.parse(response.body)};
    // No retry of robots denial, authentication, rate limit or CAPTCHA blocks.
    if (response.status === 'blocked' || (response.httpStatus && response.httpStatus < 500)) break;
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
  }
  throw new Error(`RDW request failed: ${response.status} ${response.httpStatus ?? ''} ${response.reason ?? ''}`);
}
function provenance(response, query) {
  return {url: response.url, query, retrievedAt: response.retrievedAt, contentSha256: response.contentSha256,
    responseBytes: Buffer.byteLength(response.body), httpStatus: response.httpStatus};
}
async function main() {
  const options = {refresh: process.argv.includes('--refresh'), maxAgeMs: 7 * 86400000};
  const countQuery = {select: 'voertuigsoort,count(*) AS vehicles', where: POPULATION, group: 'voertuigsoort', order: 'voertuigsoort'};
  const groupQuery = {select: `${GROUP.split(',floor(')[0]},floor(date_extract_y(datum_eerste_toelating_dt)/5)*5 AS year_band_from,count(*) AS vehicles`,
    where: POPULATION, group: GROUP,
    order: 'vehicles DESC,merk,handelsbenaming,cilinderinhoud,aantal_cilinders,voertuigsoort,year_band_from', limit: 5000};
  const counts = await getJson(queryUrl(VEHICLE_DATASET, countQuery), options);
  const groups = await getJson(queryUrl(VEHICLE_DATASET, groupQuery), options);
  const numberOrNull = value => value === undefined || value === null || value === '' ? null : Number(value);
  const rows = groups.rows.map((row, index) => {
    const identity = {make: row.merk ?? null, model: row.handelsbenaming ?? null, displacementCc: numberOrNull(row.cilinderinhoud),
      cylinders: numberOrNull(row.aantal_cilinders), vehicleClass: row.voertuigsoort, yearBandFrom: numberOrNull(row.year_band_from)};
    return {id: `rdw-group-${digest(JSON.stringify(identity)).slice(0, 16)}`, frequencyRank: index + 1, ...identity,
      yearBandTo: identity.yearBandFrom === null ? null : identity.yearBandFrom + 4, vehicles: Number(row.vehicles)};
  });
  const result = {schemaVersion: 1, dataset: VEHICLE_DATASET, fuelDataset: FUEL_DATASET,
    countKind: 'exact-model-displacement-cylinder-class-first-admission-five-year-band',
    population: {where: POPULATION, description: 'Published non-exported passenger registrations and commercial registrations with permitted maximum mass <=3500 kg. Registration presence is not proof of insured/on-road use. Unknown commercial mass excluded.',
      byClass: counts.rows.map(row => ({vehicleClass: row.voertuigsoort, vehicles: Number(row.vehicles)})), vehicles: counts.rows.reduce((sum, row) => sum + Number(row.vehicles), 0)},
    selection: {method: 'Top 5000 aggregate groups by exact count; deterministic full-key tie order', limit: 5000,
      groups: rows.length, vehiclesInSelectedGroups: rows.reduce((sum, row) => sum + row.vehicles, 0), completeFleetGrouping: false},
    limitations: ['No full-fleet fuel/power join. Do not distribute a group count among stock-output variants.',
      'First admission is a registration fact, not proof of build year or engine generation.',
      'Null displacement/year are retained; electric, hybrid and naturally aspirated populations are not silently removed.',
      'Two sequential live queries are not a transactional snapshot; retrieval times and hashes are retained.'],
    queries: {counts: provenance(counts.response, countQuery), groups: provenance(groups.response, groupQuery)}, groups: rows};
  const output = path.resolve('data/research/nl-fleet-model-priority.json');
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({output, population: result.population.vehicles, groups: rows.length, countedVehicles: result.selection.vehiclesInSelectedGroups,
    aggregateResponseBytes: result.queries.counts.responseBytes + result.queries.groups.responseBytes}));
}
module.exports = {VEHICLE_DATASET, FUEL_DATASET, POPULATION, queryUrl, getJson, provenance};
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
