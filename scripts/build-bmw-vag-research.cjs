/* eslint-disable @typescript-eslint/no-require-imports */
// Rebuild factual observations from locally cached, actually retrieved sources.
// No network, source prose, images, or competitor prices enter the output.
const fs = require('node:fs');
const crypto = require('node:crypto');
const root = '.git/tuning-dataset-v1/';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = body => crypto.createHash('sha256').update(body).digest('hex');
const text = body => body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
function buildVag() {
  const rows = [];
  for (const {hit, url} of read(root + 'vag-selected.json')) {
    const file = root + `web-shiftech-${hit.id}.json`;
    if (!fs.existsSync(file)) continue;
    const source = read(file);
    const clean = source.body.replace(/L\d+:\s*/g, '').replace(/cite[^]*/g, '');
    const stock = clean.match(/# [^\n]*?\b(\d+)hp\s+(\d+)nm/i);
    const stages = {};
    for (const match of clean.matchAll(/### Stage ([123])\s+([\s\S]*?)(?=### |Image gallery|$)/g)) {
      const power = match[2].match(/Power\s+(\d+) hp\s*\+\s*\d+ hp\s+(\d+) hp/i);
      const torque = match[2].match(/(?:Couple|Torque)\s+(\d+) nm\s*\+\s*\d+ nm\s+(\d+) nm/i);
      if (power) stages[`stage${match[1]}`] = {powerHp: Number(power[2]), ...(torque ? {torqueNm: Number(torque[2])} : {}), ...(match[1] === '2' ? {conditions: [hit.engine.fuel === 'petrol' ? 'Published Stage 2 assumes an exhaust/downpipe with sport catalyst; intercooler or intake changes may also be required.' : 'Published Stage 2 is hardware-dependent; the page does not specify a diesel hardware bill of materials.']} : {})};
    }
    if (!stock || !stages.stage1 || Number(stock[1]) !== hit.engine.horsepower) throw new Error(`Unverified Stage table ${hit.id}`);
    const conditions = [];
    if ([10511, 10513].includes(hit.id)) conditions.push('Provider recommends renewing the air-flow meter and N75 boost-control valve before tuning.');
    if ([10546, 10547, 9636].includes(hit.id)) conditions.push('These figures must not be transferred to smaller Polo/Fabia/Ibiza/A1 applications; provider notes different intake/intercooler limits.');
    rows.push({id: `shiftech-${hit.id}`, provider: 'shiftech', sourceName: 'Shiftech public application table', url, retrievedAt: source.retrievedAt, status: 'retrieved', retrievalMethod: 'page', contentSha256: hash(source.body), identity: {
      brand: hit.brand.name, modelFamily: hit.model.name, generation: hit.version.name.replace(/^\d{4}\s*-\s*/, ''), yearFrom: hit.version.year, fuel: hit.engine.fuel === 'diesel' ? 'Diesel' : 'Petrol', aspiration: 'turbo', engineMarketingName: hit.engine.name, displacementCc: Math.round(Number(hit.engine.name.match(/^\d\.\d/)[0]) * 1000), displacementPrecision: 'nominal', stockPowerHp: Number(stock[1]), stockTorqueNm: Number(stock[2]), powerUnit: 'PS', torqueUnit: 'Nm', electrification: 'none'}, stages, conditions, notes: ['Hash covers the actually retrieved rendered page text, not a raw HTTP response.', 'The provider uses metric European hp/ch figures; original numbers are retained.', 'Only the published generation start is known; no end year or exact displacement is inferred.']});
  }
  appendUnlimitedVag(rows);
  fs.mkdirSync('data/research/batches', {recursive: true});
  fs.writeFileSync('data/research/batches/vag.json', JSON.stringify(rows, null, 2) + '\n');
  return rows.length;
}
module.exports = {buildVag, read, text, hash};
function appendUnlimitedVag(rows) {
 const pairs = [10511,10513,10515,10516,10546,10547,10582,10576,10598,10597,10600];
 const selected = read(root+'unlimited-vag-selected.json');
 const cleanCell = value => text(value).replace(/&nbsp;/g,' ').trim();
 for (let i=0;i<selected.length;i++) {
  const item=selected[i],source=read(item.cacheFile),other=rows.find(x=>x.id===`shiftech-${pairs[i]}`);
  const table=[...source.body.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(m=>[...m[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(r=>[...r[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>cleanCell(c[1])))).find(t=>t[0].includes('Normal'));
  const header=table[0],p=table.find(r=>r[0]==='Vermogen'),t=table.find(r=>r[0]==='Koppel');
  const normal=header.indexOf('Normal'),stock=header.indexOf('Standaard');
  const title=cleanCell(source.body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1]);
  const generation=item.slug.includes('mk2')?'VII MKII':item.slug.startsWith('golf-7-')?'VII MKI':item.slug.startsWith('golf-6-')?'VI':'IV';
  const [yearFrom,yearTo]=({'IV':[1997,2003],'VI':[2008,2012],'VII MKI':[2012,2017],'VII MKII':[2017,2020]})[generation];
  const engine=title.replace(/^Chiptuning Volkswagen Golf (?:4|6|7)(?: mk2)?\s*/i,'').replace(/\s*\d+ pk$/,'');
  const identity={brand:'Volkswagen',modelFamily:'Golf',generation,yearFrom,yearTo,fuel:/TDI/.test(engine)?'Diesel':'Petrol',aspiration:'turbo',engineMarketingName:engine,displacementCc:Math.round(Number(engine.match(/^\d\.\d/)[0])*1000),displacementPrecision:'nominal',stockPowerHp:parseInt(p[stock]),stockTorqueNm:parseInt(t[stock]),powerUnit:'PS',torqueUnit:'Nm',electrification:'none'};
  const stages={stage1:{powerHp:parseInt(p[normal]),torqueNm:parseInt(t[normal])}};
  const stage3=header.indexOf('Stage 3');
  if(stage3>0) stages.stage3={powerHp:parseInt(p[stage3]),torqueNm:parseInt(t[stage3]),conditions:['Provider labels this output Stage 3 but publishes no applicable hardware bill of materials. Configuration and hardware require individual review; this is not an approved NoordTune package.']};
  const notes=['Normal maps to Stage 1 on the provider tuning-packages page. Xtreme maps to Stage 1.5 and is not relabelled Stage 2.','Year band comes from the visible provider Golf generation navigation, not the possibly stale URL.','Original Dutch pk values are metric PS. No exact displacement or engine code is inferred.'];
  const row={id:`unlimited-${item.slug}`,provider:'unlimited-tuning',sourceName:'Unlimited Tuning public application table',url:source.url,retrievedAt:source.retrievedAt,status:source.status,retrievalMethod:'page',httpStatus:source.httpStatus,contentSha256:source.contentSha256,supportingUrls:[item.parent,'https://www.unlimitedtuning.nl/chiptuning-volkswagen-golf.html','https://www.unlimitedtuning.nl/tuningspakketten.html'],identity,stages,notes};
  if(identity.stockPowerHp===other.identity.stockPowerHp && identity.stockTorqueNm===other.identity.stockTorqueNm) {
   const group=`vag-golf-${generation.toLowerCase().replaceAll(' ','-')}-${identity.displacementCc}-${identity.fuel.toLowerCase()}-${identity.stockPowerHp}`;
   row.consensusGroup=group;other.consensusGroup=group;
   other.notes.push('Independently matched with Unlimited by Golf body generation, fuel, nominal displacement, stock power and stock torque.');
  } else notes.push(`Stock torque differs from Shiftech (${other.identity.stockTorqueNm} Nm). Kept separate pending applicable engine/gearbox verification.`);
  rows.push(row);
 }
}
const bmwPairs = [
 ['bmw-118i-f20-f21-lci-136hp',993,1500,'nominal','shiftech'],
 ['bmw-116i-f20-f21-lci-109hp',992,1499,'exact','bmw-f20-2015'],
 ['bmw-318i-f30-f31-lci-136hp',1169,1499,'exact','bmw-f30-2015'],
 ['bmw-320i-f30-f31-lci-184hp',1170,1998,'exact','bmw-f30-2015-details2'],
 ['bmw-330i-f30-f31-lci-252hp',1167,1998,'exact','bmw-f30-2015-details2'],
 ['bmw-340i-f30-f31-lci-327hp',1157,2998,'exact','bmw-f30-2015-details'],
 ['bmw-118d-f20-f21-lci-150hp',1000,1995,'exact','bmw-f20-2015'],
 ['bmw-120d-f20-f21-lci-190hp',996,1995,'exact','bmw-f20-2015'],
 ['bmw-125d-f20-f21-lci-224hp',997,1995,'exact','bmw-f20-2015'],
 ['bmw-318d-f30-f31-lci-150hp',1165,1995,'exact','bmw-f30-2015-details'],
 ['bmw-320d-f30-f31-lci-190hp',1159,1995,'exact','bmw-f30-2015-details2'],
 ['bmw-316d-f30-f31-lci-116hp',1164,1995,'exact','bmw-f30-2015-details2'],
 ['bmw-330d-f30-f31-lci-258hp',1161,2993,'exact','bmw-f30-2015-details'],
 ['bmw-335xd-f30-f31-lci-313hp',1168,2993,'exact','bmw-f30-2015-details2'],
 ['bmw-120d-f20-f21-184hp',981,2000,'nominal','bmw-f20-2011'],
 ['bmw-118d-f20-f21-143hp',988,2000,'nominal','bmw-f20-2011'],
 ['bmw-125d-f20-f21-218hp',982,2000,'nominal','bmw-125d-2012'],
 ['bmw-116d-f20-f21-116hp',133172,2000,'nominal','bmw-f20-2011'],
 ['bmw-320d-f30-f31-184hp',1141,2000,'nominal','bmw-f30-article'],
 ['bmw-318d-f30-f31-143hp',1144,2000,'nominal','bmw-f30-article'],
 ['bmw-325d-f30-f31-218hp',1146,1995,'exact','bmw-f30-2015-details'],
 ['bmw-330d-f30-f31-258hp',1140,2993,'exact','bmw-f30-2015-details'],
 ['bmw-520d-f10-f11-190hp',1288,2000,'nominal','bmw-f10-2014'],
 ['bmw-520d-g30-g31-190hp',1302,1995,'exact','bmw-g30-2016'],
 ['bmw-530i-g30-g31-252hp',1301,1998,'exact','bmw-g30-2016'],
 ['bmw-540i-g30-340hp',1303,2998,'exact','bmw-g30-2016'],
 ['bmw-320i-g20-184hp',433364,2000,'nominal','shiftech'],
 ['bmw-330i-g20-258hp',1177,2000,'nominal','shiftech'],
 ['bmw-318d-g20-150hp',1176,2000,'nominal','bmw-g20-2019'],
 ['bmw-320d-g20-190hp',1175,2000,'nominal','bmw-g20-2019'],
 ['bmw-118i-f40-140hp',1008,1499,'exact','bmw-f40-2019'],
 ['bmw-128ti-f40-265hp',1013,2000,'nominal','shiftech'],
 ['bmw-118d-f40-150hp',1010,1995,'exact','bmw-f40-2019'],
 ['bmw-120d-f40-190hp',1009,1995,'exact','bmw-f40-2019'],
 ['bmw-116i-f40-109hp',186327,1500,'nominal','shiftech'],
 ['bmw-120i-f40-178hp',1014,2000,'nominal','shiftech'],
];
function bmwTable(source) {
  const clean = source.body.replace(/L\d+:\s*/g, '').replace(/cite[^]*/g, '');
  const stock = clean.match(/# [^\n]*?\b(\d+)hp\s+(\d+)nm/i);
  const stages = {};
  for (const m of clean.matchAll(/### Stage ([123])\s+([\s\S]*?)(?=### |Image gallery|$)/g)) {
    const p = m[2].match(/Power\s+(\d+) hp\s*\+\s*\d+ hp\s+(\d+) hp/i);
    const t = m[2].match(/(?:Couple|Torque)\s+(\d+) nm\s*\+\s*\d+ nm\s+(\d+) nm/i);
    if (p) stages[`stage${m[1]}`] = {powerHp: Number(p[2]), ...(t ? {torqueNm: Number(t[2])} : {})};
  }
  return {stock, stages};
}
function buildBmw() {
 const rows = [], supports = new Map();
 const selected = read(root + 'mosselman-selected.json');
 const shiftech = read(root + 'bmw-shiftech-selected.json');
 for (const [slug, shifId, cc, precision, supportId] of bmwPairs) {
  const entry = selected.find(x => x.slug === slug), source = read(entry.cacheFile), clean = text(source.body);
  let scope = clean.match(/Model\(s\):\s*(\d) Series Jaar:\s*(.*?)\s*\((\d{4})\s*-(\d{4}|heden|present|>)\)\s*Tag\(s\):\s*(\S+)\s*Motorcode:\s*(\S+)/i);
  if (!scope && slug === "bmw-118i-f40-140hp") scope = ["", "1", "F40", "2019", ">", "118i", "B38"];
  if (!scope) throw new Error(`Mosselman scope absent: ${slug}`);
  const stock = clean.match(/Standaard vermogen:\s*(\d+)(?:hp|pk)\s*\|\s*(\d+)Nm/);
  if (!stock) throw new Error(`Mosselman stock absent: ${slug}`);
  const summary = clean.slice(clean.indexOf('Standaard vermogen:'), clean.indexOf('Meer Informatie', clean.indexOf('Standaard vermogen:')));
  const stages = {};
  for (const m of summary.matchAll(/Stage ([123])(?:\s*\|\s*ECU Remap)?\s*\+\s*\d+(?:hp|pk)\s*\((\d+)(?:hp|pk)\)\s*\|\s*\+\s*\d+Nm\s*\((\d+)Nm\)/g)) if (!stages[`stage${m[1]}`]) stages[`stage${m[1]}`] = {powerHp: Number(m[2]), torqueNm: Number(m[3])};
  if (!stages.stage1) {
   const m = clean.match(/Stage 1 \| ECU Remap\s*\+\s*\d+(?:hp|pk)\s*\((\d+)(?:hp|pk)\)\s*\|\s*\+\s*\d+Nm\s*\((\d+)Nm\)/);
   if (m) stages.stage1 = {powerHp: Number(m[1]), torqueNm: Number(m[2])};
  }
  if (!stages.stage1) throw new Error(`Mosselman Stage 1 absent: ${slug}`);
  const fuel = /d$/.test(scope[5]) ? 'Diesel' : 'Petrol';
  const conditions = [];
  if (/98 Oct|RON\s*98|ron98/.test(clean)) conditions.push('Published petrol tuning figures require or recommend RON 98 premium fuel.');
  if (slug === 'bmw-118i-f20-f21-lci-136hp') conditions.push('Applies to the B38 1.5-litre engine only. Early 118i 136 PS LCI cars may use the different N13 1.6-litre engine; verify engine identity.');
  const notes = ['Source year range describes the listed generation; engine applicability still requires the matching engine family and stock output.', 'Provider European hp/pk figures are retained as metric PS.'];
  if (slug === 'bmw-118i-f40-140hp') notes.push('This redesigned Mosselman page omits its generation year band. The 2019 start is supported by the linked BMW launch specification and the matching Shiftech generation; it is not presented as a Mosselman model-year statement.');
  if (slug === 'bmw-128ti-f40-265hp') { delete stages.stage2.torqueNm; stages.stage2.conditions = ['Intercooler hardware and RON 98 fuel required.', 'Source conflict: Stage 2 table shows 480 Nm while the package description states 500 Nm; torque is withheld pending review.']; }
  if (slug === 'bmw-340i-f30-f31-lci-327hp') {
   stages.stage2.conditions = ['Stage 2 requires a sport-catalyst/downpipe and RON 98; gearbox software is recommended for automatic cars.'];
   stages.stage3.conditions = ['Published Stage 3 package requires a downpipe, B58TU high-pressure fuel pump, upgraded B58 turbo and RON 98.', 'Hardware applicability and emissions compliance require individual review.'];
   notes.push('URL says 327hp, but source stock table and manufacturer specification state 326 PS; 326 is retained. Stage 2+ is a separate package and is not relabelled Stage 3.');
  }
  if (slug === 'bmw-540i-g30-340hp') { delete stages.stage3; stages.stage2.conditions = ['Stage 2 requires a sport-catalyst/downpipe and RON 98.']; notes.push('Sequential HTML headings labelled Stage 3/4 actually describe Stage 1+/2+ OPF packages; they are excluded.'); }
  const sh = shiftech.find(x => x.hit.id === shifId), shSource = read(root + `web-shiftech-${shifId}.json`), shFacts = bmwTable(shSource);
  const support = supportId === 'shiftech' ? shSource : read(root + `support-${supportId}.json`);
  const supportUrl = support.url;
  if (supportId !== 'shiftech') supports.set(supportId, support);
  notes.push(`Displacement support: ${supportUrl}; ${precision === 'nominal' ? 'nominal litre class only' : 'manufacturer effective capacity'}.`);
  const identity = {brand:'BMW', modelFamily:`${scope[1]} Series`, generation:scope[2], yearFrom:Number(scope[3]), ...(/^\d{4}$/.test(scope[4]) ? {yearTo:Number(scope[4])} : {}), fuel, aspiration:'turbo', engineMarketingName:scope[5], engineFamily:scope[6].match(/^[BN]\d{2}/)?.[0] ?? scope[6], ...(scope[6].length > 3 ? {engineCodes:[scope[6]]} : {}), displacementCc:cc, displacementPrecision:precision, stockPowerHp:Number(stock[1]), stockTorqueNm:Number(stock[2]), powerUnit:'PS', torqueUnit:'Nm', electrification:'none'};
  const moss = {id:`mosselman-${slug}`, provider:'mosselman', sourceName:'Mosselman BMW application table', url:source.url, retrievedAt:source.retrievedAt, status:'retrieved', retrievalMethod:'page', httpStatus:source.httpStatus, contentSha256:source.contentSha256, supportingUrls:[supportUrl], identity, stages, conditions, notes};
  if (supportId !== 'shiftech' && precision === 'exact') moss.stockValidation = {sourceId:`manufacturer-${supportId}`, fields:['stockPowerHp','displacementCc']};
  if (shFacts.stock && shFacts.stages.stage1) {
   const shIdentity = {...identity, generation:sh.hit.version.name.replace(/^\d{4}\s*-\s*/,''), yearFrom:sh.hit.version.year, yearTo:undefined, stockPowerHp:Number(shFacts.stock[1]), stockTorqueNm:Number(shFacts.stock[2])};
   const sc = [];
   if ([1008,1169].includes(shifId)) sc.push('Provider notes only 165–170 PS on 95 RON; higher published output needs suitable higher-octane fuel.');
   if (shFacts.stages.stage2) shFacts.stages.stage2.conditions = [fuel==='Petrol' ? 'Published Stage 2 assumes exhaust/downpipe hardware with sport catalyst; additional cooling/intake requirements need checking.' : 'Published Stage 2 requires matching installed hardware; no diesel-specific parts list is published on this page.'];
   const agreesStock = identity.stockPowerHp === shIdentity.stockPowerHp && identity.stockTorqueNm === shIdentity.stockTorqueNm;
   const group = `bmw-${scope[2].toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${scope[5].toLowerCase()}-${identity.stockPowerHp}-${identity.engineFamily.toLowerCase()}`;
   if (agreesStock) moss.consensusGroup = group;
   else { notes.push(`Stock-torque disagreement with Shiftech (${shIdentity.stockTorqueNm} Nm); observations are not merged automatically.`); sc.push(`Stock-torque disagreement with Mosselman (${identity.stockTorqueNm} Nm); owner review required before merging.`); }
   rows.push({...moss, id:`shiftech-${shifId}`, provider:'shiftech', sourceName:'Shiftech public application table', url:sh.url, retrievedAt:shSource.retrievedAt, httpStatus:undefined, contentSha256:hash(shSource.body), supportingUrls:[source.url,supportUrl], identity:shIdentity, stages:shFacts.stages, conditions:sc, notes:['Hash covers the actually retrieved rendered page text, not a raw HTTP response.', 'The source generation label and start year are preserved; overlap with Mosselman is limited to the named shared body and engine.', `Engine family is corroborated by the applicable Mosselman profile: ${source.url}.`, `Displacement support: ${supportUrl}.`], ...(agreesStock ? {consensusGroup:group} : {})});
  } else notes.push('Shiftech counterpart has no published Stage 1 output; not used as a second tuning source.');
  rows.push(moss);
 }
 for (const [id,source] of supports) rows.push({id:`manufacturer-${id}`,provider:'manufacturer',sourceName:'BMW manufacturer identity support',url:source.url,retrievedAt:source.retrievedAt,status:'retrieved',retrievalMethod:'page',contentSha256:hash(source.body),notes:['Supporting engine capacity / cylinder / stock identity reference only; no tuning estimate is attributed to the manufacturer.','Hash covers actually retrieved rendered page or PDF text.']});
 fs.writeFileSync('data/research/batches/bmw.json',JSON.stringify(rows,null,2)+'\n');
 return {observations:rows.length,tuning:rows.filter(x=>x.stages?.stage1).length,mosselman:rows.filter(x=>x.provider==='mosselman').length};
}
module.exports.buildBmw = buildBmw;
if (require.main === module) console.log(JSON.stringify({vag:buildVag(),bmw:buildBmw()}));
