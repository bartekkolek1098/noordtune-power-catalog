/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require('node:crypto');
const {fetchPage} = require('./research-fetch.cjs');
const {clean} = require('./research-unlimited.cjs');
const CONFIGURATOR = 'https://sklep.vtech.pl/konfigurator-powerchip/';
function discover(response) {
  const json = response.body?.match(/var vtFitmentSearch = (\{[^<]+\});/)?.[1];
  if (!json) throw new Error('Public V-Tech configurator tree is absent; review site changes');
  const config = JSON.parse(json), variants = new Map();
  // The route construction is published by the ordinary configurator's form.
  if (config.baseUrl !== 'https://sklep.vtech.pl/powerchip/') throw new Error('Unreviewed V-Tech base URL');
  for (const [makeSlug, make] of Object.entries(config.tree)) for (const [modelSlug, model] of Object.entries(make.models)) {
    for (const [year, row] of Object.entries(model.years)) for (const engine of row.engines) {
      const [genSlug, engineSlug] = engine.value.split('::');
      if (!genSlug || !engineSlug) continue;
      const url = `${config.baseUrl}${makeSlug}/${modelSlug}/${genSlug}/${engineSlug}/`;
      const variant = variants.get(url) ?? {url, brand: make.label, modelFamily: model.label, generation: engine.gen_label,
        engineMarketingName: engine.engine, years: [], supportingUrls: [CONFIGURATOR]};
      if (/^\d{4}$/.test(year)) variant.years.push(Number(year));
      variants.set(url, variant);
    }
  }
  return [...variants.values()].map(variant => ({...variant, years: [...new Set(variant.years)].sort((a,b) => a-b)}));
}
function extract(response, scope) {
  const title = clean(response.body?.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const packages = [...(response.body ?? '').matchAll(/<h3 class="vt-fitment-product-name">([^<]+)<\/h3>([\s\S]*?)(?=<h3 class="vt-fitment-product-name">|$)/g)].map(match => {
    const power = match[2].match(/class="vt-fitment-gain-value hp"[\s\S]*?data-count-to="(\d+)"/);
    const torque = match[2].match(/class="vt-fitment-gain-value nm"[\s\S]*?data-count-to="(\d+)"/);
    return {name: clean(match[1]), kind: 'external-module', ...(power ? {powerGainHp: +power[1]} : {}), ...(torque ? {torqueGainNm: +torque[1]} : {})};
  }).filter(item => item.powerGainHp || item.torqueGainNm);
  const hp = Number(scope.engineMarketingName.match(/(\d+)\s*KM\b/i)?.[1]) || undefined;
  const cc = Number(scope.engineMarketingName.match(/\b\d[.,]\d\b/)?.[0].replace(',', '.')) * 1000 || undefined;
  const years = scope.years ?? [];
  return {id: 'vtech-v2-' + crypto.createHash('sha256').update(response.url).digest('hex').slice(0,16), provider: 'vtech',
    sourceName: 'V-Tech public PowerChip configurator', url: response.url, retrievedAt: response.retrievedAt, status: response.status,
    httpStatus: response.httpStatus, retrievalMethod: 'page', contentSha256: response.contentSha256,
    unresolvedIdentity: {brand: scope.brand, modelFamily: scope.modelFamily, generation: scope.generation,
      ...(years.length ? {yearFrom: Math.min(...years), yearTo: Math.max(...years)} : {}), engineMarketingName: scope.engineMarketingName,
      ...(cc ? {displacementCc: cc, displacementPrecision: 'nominal'} : {}), stockPowerHp: hp, powerUnit: 'PS'},
    packages: packages.map(item => ({...item, ...(hp && item.powerGainHp ? {tunedPowerHp: hp + item.powerGainHp} : {})})),
    supportingUrls: scope.supportingUrls,
    applicability: [title, 'Public configurator year selections: ' + years.join(', ')],
    conditions: ['External PowerChip module required. These packages are not an ordinary ECU-remap Stage 1, Stage 2 or Stage 3.'],
    notes: ['Only factual package gains retained. Tuned power is stock PS plus the explicitly published package gain; stock torque/fuel are not inferred.',
      'The previous /chip-tuning/ catalog URLs returned HTTP 404 during V2. Current public pages expose PowerChip packages. No package vote is promoted into remap consensus.']};
}
module.exports = {CONFIGURATOR, discover, extract};
if (require.main === module) {
  const fs = require('node:fs');
  if (process.argv.includes('--discover')) fetchPage(CONFIGURATOR, {refresh: process.argv.includes('--refresh'), maxAgeMs: 30*86400000}).then(response => {
    const rows = discover(response); fs.mkdirSync('.git/nl-fleet-v2', {recursive:true});
    fs.writeFileSync('.git/nl-fleet-v2/vtech-discovery.json', JSON.stringify({url:response.url, retrievedAt:response.retrievedAt, contentSha256:response.contentSha256, variants:rows},null,2));
    console.log(JSON.stringify({variants:rows.length, output:'.git/nl-fleet-v2/vtech-discovery.json'}));
  }).catch(error => {console.error(error.message);process.exitCode=1;});
  else require('./research-provider-refresh.cjs').run('vtech', {extract}).catch(error => {console.error(error.message);process.exitCode=1;});
}
