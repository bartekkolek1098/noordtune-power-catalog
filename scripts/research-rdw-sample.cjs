/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const crypto = require('node:crypto');
const {POPULATION, VEHICLE_DATASET, FUEL_DATASET, queryUrl, getJson} = require('./research-rdw-fleet.cjs');
const quote = value => "'" + value.replace(/'/g, "''") + "'";
const norm = value => (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
const isVan = group => group.vehicleClass === 'Bedrijfsauto';
async function main() {
  const fleet = JSON.parse(fs.readFileSync('data/research/nl-fleet-model-priority.json', 'utf8'));
  const eligible = fleet.groups.filter(group => group.yearBandFrom >= 2005 && group.displacementCc > 0 && group.cylinders > 0);
  const groups = new Map();
  // Purposive, frequency-led breadth sample, explicitly not a random estimator.
  for (const brand of ['VOLKSWAGEN','PEUGEOT','RENAULT','FORD','KIA','HYUNDAI','TOYOTA','NISSAN','OPEL','BMW','MINI','AUDI','SKODA','SEAT','MERCEDES-BENZ','CITROEN','VOLVO','DACIA','SUZUKI','MAZDA','HONDA','MITSUBISHI','LEXUS','FIAT','IVECO','ALFA ROMEO','LAND ROVER','JEEP']) {
    const models = new Set();
    for (const group of eligible.filter(group => norm(group.make) === brand && !isVan(group))) {
      if (models.has(group.model)) continue;
      models.add(group.model); groups.set(group.id, group);
      if (models.size >= 2) break;
    }
  }
  const vanModels = new Set();
  for (const group of eligible.filter(isVan)) {
    const key = `${group.make}|${group.model}`;
    if (vanModels.has(key)) continue;
    vanModels.add(key); groups.set(group.id, group);
    if (vanModels.size >= 20) break;
  }
  const raw = [], queries = [];
  const vehicleFields = 'kenteken,merk,handelsbenaming,voertuigsoort,aantal_cilinders,cilinderinhoud,datum_eerste_toelating,datum_eerste_toelating_dt,type,variant,uitvoering,export_indicator,toegestane_maximum_massa_voertuig';
  for (const group of groups.values()) {
    const where = `${POPULATION} AND merk = ${quote(group.make)} AND handelsbenaming = ${quote(group.model)} AND cilinderinhoud = ${group.displacementCc} AND aantal_cilinders = ${group.cylinders} AND voertuigsoort = ${quote(group.vehicleClass)} AND date_extract_y(datum_eerste_toelating_dt) BETWEEN ${group.yearBandFrom} AND ${group.yearBandTo}`;
    const query = {select: vehicleFields, where, order:'kenteken', limit:3};
    const result = await getJson(queryUrl(VEHICLE_DATASET, query));
    queries.push({groupId:group.id, url:result.response.url, retrievedAt:result.response.retrievedAt, contentSha256:result.response.contentSha256, rows:result.rows.length});
    raw.push(...result.rows.map(vehicle => ({groupId:group.id, vehicle, retrievedAt:result.response.retrievedAt})));
  }
  const unique = [...new Map(raw.map(row => [row.vehicle.kenteken, row])).values()], fuels = [];
  const fuelQueries = [];
  for (let offset=0; offset<unique.length; offset+=40) {
    const plates = unique.slice(offset,offset+40).map(row => row.vehicle.kenteken);
    const result = await getJson(queryUrl(FUEL_DATASET, {where:`kenteken in (${plates.map(quote).join(',')})`, limit:200}));
    fuels.push(...result.rows);
    // Public fuel-query URL contains plates. Keep it only in private HTTP cache.
    fuelQueries.push({dataset:FUEL_DATASET, selectedPlates:plates.length, rows:result.rows.length, retrievedAt:result.response.retrievedAt, contentSha256:result.response.contentSha256});
  }
  fs.mkdirSync('.git/nl-fleet-v2',{recursive:true});
  fs.writeFileSync('.git/nl-fleet-v2/rdw-live-private.json',JSON.stringify(unique.map(row=>({...row,fuels:fuels.filter(fuel=>fuel.kenteken===row.vehicle.kenteken)}))));
  const withoutPlate = row => Object.fromEntries(Object.entries(row).filter(([key])=>key!=='kenteken'));
  const rows = unique.map(row=>({sampleId:'rdw-'+crypto.createHash('sha256').update(row.vehicle.kenteken).digest('hex').slice(0,20),
    groupId:row.groupId, retrievedAt:row.retrievedAt, vehicle:withoutPlate(row.vehicle), fuels:fuels.filter(fuel=>fuel.kenteken===row.vehicle.kenteken).map(withoutPlate)}));
  const report = {schemaVersion:1, method:'Three plate-sorted registrations per selected exact group; two distinct common passenger models per priority brand and twenty distinct van models. Purposive sample; no fleet power/fuel share extrapolation.',
    populationWhere:POPULATION, join:'Exact kenteken join for this bounded sample only; every returned fuel row retained, including hybrid/electric rows.', sampleSize:rows.length,
    vehicleQueries:queries, fuelQueries, rows};
  fs.writeFileSync('data/research/nl-rdw-live-sample.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({sample:rows.length,groups:groups.size,brands:[...new Set(rows.map(row=>row.vehicle.merk))].length,fuelRows:fuels.length}));
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
