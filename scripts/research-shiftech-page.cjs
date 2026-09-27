/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require('node:crypto');
const titleCase = text => text.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
const makes = {'bmw':'BMW','mini':'MINI','citroen':'Citroën','skoda':'Skoda','seat':'Seat','mercedes':'Mercedes-Benz','land-rover':'Land Rover','alfa-romeo':'Alfa Romeo'};
function extractRendered(text, url, retrievedAt) {
  const clean = text.replace(/L\d+: ?/g,'').replace(/cite[^]+/g,'');
  const heading = clean.match(/# ([^\n]+?)(\d+)hp\s+(\d+)nm[^\n]*/i);
  if (!heading) return {url,reason:'NO_RENDERED_FACTORY_AND_STAGE_TABLE'};
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  const [, , type, makeSlug, modelSlug, generationSlug, fuelSlug] = parts;
  if (type !== 'car' || !['petrol','diesel'].includes(fuelSlug)) return {url,reason:'UNSUPPORTED_ROUTE'};
  const yearFrom = Number(generationSlug.match(/^\d{4}/)?.[0]);
  const generationLabel = generationSlug.replace(/^\d{4}-?/, '').replace(/-/g,' ').toUpperCase();
  const prefix = heading[1].trim();
  const yearAt = prefix.indexOf(String(yearFrom));
  if (yearAt < 0 || !yearFrom) return {url,reason:'UNVERIFIED_GENERATION_START'};
  const make = makes[makeSlug] ?? titleCase(makeSlug);
  const prefixModel = prefix.slice(0,yearAt).trim();
  const rawBrand = makeSlug==='mercedes'?'Mercedes':makeSlug==='land-rover'?'Land Rover':make;
  let model = prefixModel.slice(rawBrand.length).trim();
  if (!model) model=titleCase(modelSlug);
  const publishedModels=model.split(/\s*\/\s*/).filter(Boolean);
  const aliases=publishedModels.length>1?publishedModels.slice(1):[];
  if(publishedModels.length>1)model=publishedModels[0];
  if(makeSlug==='kia'&&model==='Stonic (KX1)'){model='Stonic';aliases.push('KX1');}
  let afterYear = prefix.slice(yearAt+4).trim().replace(/^[-–]\s*/,'');
  if(generationLabel && afterYear.toUpperCase().startsWith(generationLabel)) afterYear=afterYear.slice(generationLabel.length).trim();
  // The engine starts at a decimal displacement, or at a badge immediately before it.
  const ccMatch = afterYear.match(/\b(\d[.,]\d)(?!\d)/);
  if (!ccMatch) return {url,reason:'NO_PUBLISHED_DISPLACEMENT'};
  const engineStart = Math.max(0,afterYear.search(/\b(?:[A-Z]*\d{2,3}[a-z]*\s+)?\d[.,]\d(?!\d)/i));
  const engine = afterYear.slice(engineStart).trim();
  if (/hybrid|mhev|phev|\bhev\b|\b48\s*v\b|e.tech|e.power|e.tsi|\b\d{3}h\b|\bHSD\b/i.test(afterYear)) return {url,reason:'HYBRID_APPLICATION_UNSUPPORTED'};
  const stages={};
  for(const match of clean.matchAll(/### Stage ([123])\s*\n([\s\S]*?)(?=### Stage |Contact us|$)/g)) {
    const powers=[...match[2].matchAll(/(?:^|\n)\s*(\d+)\s*hp(?=\s|$)/gi)];
    const torques=[...match[2].matchAll(/(?:^|\n)\s*(\d+)\s*nm(?=\s|$)/gi)];
    if(powers.length>=2 && torques.length>=2 && +powers[0][1]===+heading[2] && +torques[0][1]===+heading[3]
      && +powers[1][1]>=+heading[2] && +torques[1][1]>=+heading[3]) stages['stage'+match[1]]={powerHp:+powers[1][1],torqueNm:+torques[1][1],
      ...(match[1]!=='1'?{conditions:['Published hardware-dependent Stage; verify applicable parts and calibration before work.']}: {})};
  }
  if(!stages.stage1)return {url,reason:'SOURCED_STAGE1_REQUIRED'};
  const id='shiftech-v2-'+crypto.createHash('sha256').update(url).digest('hex').slice(0,16);
  return {id,provider:'shiftech',sourceName:'Shiftech public application table',url,retrievedAt,status:'retrieved',retrievalMethod:'page',
    contentSha256:crypto.createHash('sha256').update(text).digest('hex'),
    identity:{brand:make,modelFamily:model,...(aliases.length?{aliases}:{}),generation:yearFrom+(generationLabel?' - '+generationLabel:''),yearFrom,
      fuel:fuelSlug==='diesel'?'Diesel':'Petrol',engineMarketingName:engine,displacementCc:Number(ccMatch[1].replace(',','.'))*1000,
      displacementPrecision:'nominal',stockPowerHp:+heading[2],stockTorqueNm:+heading[3],powerUnit:'PS',torqueUnit:'Nm',electrification:'unknown'},stages,
    conditions:['Exact engine, generation, fuel, installed hardware and ECU access require workshop verification.'],
    notes:['Hash covers the retrieved rendered public page extraction. Search snippets/index values are not tuning evidence.',
      'Displacement is nominal from the published engine label. The published generation start is not a build date. No competitor prices are retained.']};
}
module.exports={extractRendered};
