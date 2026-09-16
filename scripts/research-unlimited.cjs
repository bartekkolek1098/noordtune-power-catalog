/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require('node:crypto');
const clean = html => html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
function mainHtml(html) { return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? ''; }
function links(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(match => ({url: match[1].replace(/&amp;/g, '&'), label: clean(match[2])}))
    .filter(link => link.url.startsWith('https://www.unlimitedtuning.nl/') && !/[?#]/.test(link.url));
}
function categoryLinks(html) {
  const main = mainHtml(html);
  const category = main.match(/<ul class="catalog-sub-category[^>]*>([\s\S]*?)<\/ul>/)?.[1];
  return category ? links(category) : links(main).filter(link => /\bpk\b/i.test(link.label) && /\.html$/.test(link.url));
}
function years(label) {
  const values = label.match(/\b(?:19|20)\d{2}\b/g)?.map(Number) ?? [];
  if(!values.length)return undefined;
  // Dutch "t/m" means "through", not "from". An end-only category cannot
  // supply a generation start and therefore cannot complete an identity.
  if(values.length===1&&/(?:t\s*\/\s*m|tot(?:\s+en\s+met)?|until|through|up\s+to)\s*(?:19|20)\d{2}/i.test(label))return {yearTo:values[0]};
  return {yearFrom: values[0], ...(values[1] ? {yearTo: values[1]} : {})};
}
function extract(response, scope) {
  const html = mainHtml(response.body ?? '');
  const title = clean(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const table = [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map(match => match[0]).find(table => /Vermogen/i.test(table) && /Koppel/i.test(table));
  const rows = table ? [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row => [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell => clean(cell[1]))) : [];
  const header = rows.find(row => row.some(cell => /^Standaard$/i.test(cell)));
  const power = rows.find(row => /^Vermogen$/i.test(row[0]));
  const torque = rows.find(row => /^Koppel$/i.test(row[0]));
  const value = text => Number(text?.match(/\d+(?:[.,]\d+)?/)?.[0].replace(',', '.')) || undefined;
  const stockIndex = header?.findIndex(cell => /^Standaard$/i.test(cell));
  const normalIndex = header?.findIndex(cell => /^(?:Normal(?: tuning)?|Stage\s*1)$/i.test(cell));
  const stage2Index = header?.findIndex(cell => /^Stage\s*2$/i.test(cell));
  const engine = title.replace(/^Chiptuning\s+/i, '').replace(new RegExp(`^${scope.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'), '')
    .replace(new RegExp(`^${scope.modelFamily.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'), '').replace(/\b(?:19|20)\d{2}\s*[-–]\s*(?:19|20)\d{2}\s*/g, '').replace(/\s+\d+\s*pk.*$/i, '').trim();
  const cc = Number(engine.match(/\b\d[.,]\d{1,2}(?!\d)/)?.[0].replace(',', '.')) * 1000;
  const id = 'unlimited-v2-' + crypto.createHash('sha256').update(response.url + '|' + scope.brand + '|' + scope.modelFamily + '|' + scope.generation).digest('hex').slice(0, 16);
  const identity = {brand: scope.brand, modelFamily: scope.modelFamily, generation: scope.generation,
    yearFrom: scope.yearFrom, ...(scope.yearTo ? {yearTo: scope.yearTo} : {}), fuel: scope.fuel,
    engineMarketingName: engine, displacementCc: cc, displacementPrecision: 'nominal',
    stockPowerHp: stockIndex >= 0 ? value(power?.[stockIndex]) : undefined,
    stockTorqueNm: stockIndex >= 0 ? value(torque?.[stockIndex]) : undefined,
    powerUnit: 'PS', torqueUnit: 'Nm', electrification: /hybrid|phev|mhev|\bhev\b|\b48\s*v\b|e.power|e.tech|e.tsi|\bHSD\b|\b\d{3}h\b|\b\d{3}e\b|cooper s e\b|\bniro\b/i.test(title) ? 'hybrid' : 'unknown'};
  const stages = {};
  if (normalIndex >= 0 && value(power?.[normalIndex])) stages.stage1 = {powerHp: value(power[normalIndex]), torqueNm: value(torque?.[normalIndex])};
  if (stage2Index >= 0 && value(power?.[stage2Index])) stages.stage2 = {powerHp: value(power[stage2Index]), torqueNm: value(torque?.[stage2Index]), conditions: ['Published Stage 2 package; applicable hardware and calibration require workshop verification.']};
  const complete = identity.stockPowerHp && cc && scope.yearFrom && scope.fuel && engine && stages.stage1;
  return {id, provider: 'unlimited-tuning', sourceName: 'Unlimited Tuning NL public Normal/Stage 1/Stage 2 table', url: response.url,
    retrievedAt: response.retrievedAt, status: response.status, httpStatus: response.httpStatus, retrievalMethod: 'page', contentSha256: response.contentSha256,
    ...(complete ? {identity} : {unresolvedIdentity: identity}), stages, supportingUrls: scope.supportingUrls,
    applicability: [`Linked by the provider's ${scope.brand} ${scope.modelFamily} → ${scope.generation} → ${scope.fuel} category; category URLs establish year/fuel applicability.`],
    conditions: ['Exact engine, generation, fuel, installed hardware and ECU access require workshop verification.',
      ...(scope.brand==='Ford'&&/\bTDCi\b/i.test(engine)&&/\bEcoBlue\b/i.test(engine)?['ENGINE_FAMILY_LABEL_CONFLICT']:[])],
    notes: ['Normal or explicitly labelled Stage 1 is the ordinary remap observation. Stage 1+ and Xtreme are not substituted for Stage 1 or Stage 2.',
      'Engine displacement is nominal from the published engine label. Provider year bands are preserved, not interpreted as build dates. No competitor prices are retained.']};
}
module.exports = {clean, mainHtml, links, categoryLinks, years, extract};
if (require.main === module) {
  // Refresh output is a candidate fact diff only, never an accepted batch mutation.
  require('./research-provider-refresh.cjs').run('unlimited-tuning', {extract}).catch(error => { console.error(error.message); process.exitCode = 1; });
}
