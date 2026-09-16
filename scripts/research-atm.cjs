/* eslint-disable @typescript-eslint/no-require-imports */
const crypto=require('node:crypto');
const {fetchPage}=require('./research-fetch.cjs');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const decode=value=>String(value??'').replace(/&(?:amp|quot|apos|lt|gt|nbsp);|&#(?:x[0-9a-f]+|\d+);/gi,entity=>{
  const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' '};
  return named[entity.toLowerCase()]??String.fromCodePoint(entity.toLowerCase().startsWith('&#x')?parseInt(entity.slice(3,-1),16):Number(entity.slice(2,-1)));
});
const clean=value=>decode(String(value??'').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
function attributes(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m=>[m[1].toLowerCase(),decode(m[3])]));}
function breadcrumbs(html){
  const rows=[];
  for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    let value;try{value=JSON.parse(match[1]);}catch{continue;}
    const visit=node=>{if(!node||typeof node!=='object')return;if(node['@type']==='ListItem'&&Number(node.position)&&node.item?.name)rows.push({position:Number(node.position),name:clean(node.item.name),url:node.item['@id']??node.item.url});for(const child of Object.values(node))if(Array.isArray(child))child.forEach(visit);else if(child&&typeof child==='object')visit(child);};visit(value);
  }
  return [...new Map(rows.map(row=>[row.position,row])).values()].sort((a,b)=>a.position-b.position);
}
function yearScope(generation){
  const years=[...generation.matchAll(/\b(?:19|20)\d{2}\b/g)].map(m=>Number(m[0]));
  return years.length?{yearFrom:years[0],...(years.length>1?{yearTo:years[1]}:{})}:{};
}
function tableFacts(html){
  const facts={};
  for(const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
    const cells=[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1])).filter(Boolean);
    if(cells.length>=2)facts[cells[0].toLowerCase()]=cells.slice(1).join(' ');
  }
  return facts;
}
function comparison(html,field){
  const match=html.match(new RegExp('<div\\b[^>]*class=["\'][^"\']*\\b'+field+'\\b[^"\']*["\'][^>]*>\\s*(?:<div[^>]*>\\s*)?(\\d+(?:[.,]\\d+)?)\\s*<span[^>]*>\\s*(pk|Nm)\\s*</span>','i'));
  return match?{value:Number(match[1].replace(',','.')),unit:match[2]}:undefined;
}
function extract(response){
  const base={id:'atm-v3-'+hash(response.url).slice(0,16),provider:'atm-chiptuning',sourceName:'ATM-Chiptuning public application table',url:response.url,retrievedAt:response.retrievedAt,status:response.status,retrievalMethod:'page',httpStatus:response.httpStatus,contentSha256:response.contentSha256};
  if(response.status!=='retrieved')return {...base,conditions:['ACTUAL_PUBLIC_FACT_RETRIEVAL_REQUIRED'],notes:[response.reason??'Public page unavailable.']};
  const html=response.body??'',crumbs=breadcrumbs(html),byPosition=new Map(crumbs.map(row=>[row.position,row]));
  const brand=byPosition.get(3)?.name,models=byPosition.get(4)?.name?.split(/\s*\/\s*/),generation=byPosition.get(5)?.name,engine=byPosition.get(6)?.name;
  const facts=tableFacts(html),scope=yearScope(generation??''),hp=Number(engine?.match(/\b(\d+)\s*pk\b/i)?.[1]);
  const cc=Number(facts.cilinderinhoud?.match(/\b(\d+)\s*CC\b/i)?.[1]);
  const fuel=/^diesel$/i.test(facts.brandstof)?'Diesel':/^benzine$/i.test(facts.brandstof)?'Petrol':undefined;
  const ppre=comparison(html,'tuning-p-pre'),tpre=comparison(html,'tuning-t-pre'),ppost=comparison(html,'tuning-p-post'),tpost=comparison(html,'tuning-t-post');
  const engineCodes=facts.motornummer?.split(/\s*(?:&|,|\/)\s*/).filter(Boolean);
  const engineFamily=/\bEcoBlue\b/i.test(engine??'')?'EcoBlue':/\bTDCi\b/i.test(engine??'')?'TDCi':undefined;
  const identity={brand,modelFamily:models?.[0],...(models?.length>1?{aliases:models.slice(1)}:{}),generation,...scope,fuel,engineMarketingName:engine,
    ...(engineFamily?{engineFamily}:{}),...(engineCodes?.length?{engineCodes}:{}),...(cc?{displacementCc:cc,displacementPrecision:'exact'}:{}),
    stockPowerHp:ppre?.value??hp,...(tpre?{stockTorqueNm:tpre.value}:{}),powerUnit:'PS',torqueUnit:'Nm',...(facts['type ecu']?{ecuFamily:facts['type ecu']}:{}),electrification:'unknown'};
  const complete=Boolean(brand&&models?.[0]&&generation&&scope.yearFrom&&engine&&cc&&fuel&&hp);
  // Restrict availability language to actual application content, excluding menus/reviews.
  const availabilityText=clean(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')).match(/Momenteel is chiptuning[\s\S]{0,350}?nog niet mogelijk[^.]*\.?/i)?.[0];
  const hybrid=/\b(?:MHEV|PHEV|HEV|hybrid|48\s*v|eTSI|GTE|e-hybrid|HSD)\b/i.test(engine??'');
  const pending=availabilityText?/ontwikkeling/i.test(availabilityText)?'development-pending':'not-available':hybrid?'hybrid-only':undefined;
  const provenance={supportingUrls:crumbs.filter(row=>row.position>=3&&row.position<=5&&/^https:\/\//.test(row.url??'')).map(row=>row.url)};
  if(pending)return {...base,...provenance,unresolvedIdentity:identity,availability:{status:pending,scope:'source-application-only',evidence:pending==='hybrid-only'?'Published application is explicitly hybrid.':'Current application explicitly says tuning is unavailable or in development.'},conditions:['SOURCE_APPLICATION_NOT_ORDINARY_AVAILABLE'],notes:['Availability applies only to this provider application and retrieved date; it is not a NoordTune support verdict.']};
  const stages={},reasons=[];
  for(const match of html.matchAll(/<a\b[^>]*>/gi)){
    const a=attributes(match[0]);if(!/(?:^|\s)Chiptuning-stages__stage(?:\s|$)/.test(a.class??'')||!['1','2','3'].includes(a['data-stage']))continue;
    const power=Number(a['data-up']),torque=Number(a['data-ut']);
    if(a['data-p-type']!=='pk'||a['data-t-type']!=='Nm'||!(power>0)||!(torque>0)){reasons.push('INVALID_EXPLICIT_STAGE_FACTS');continue;}
    const key='stage'+a['data-stage'];
    if(stages[key]&&(stages[key].powerHp!==power||stages[key].torqueNm!==torque)){reasons.push('DUPLICATE_STAGE_CONFLICT');continue;}
    stages[key]={powerHp:power,torqueNm:torque,...(key!=='stage1'?{conditions:['Published hardware-dependent stage; confirm required parts before work.']}:{})};
  }
  if(!complete)reasons.push('ATM_INCOMPLETE_APPLICATION_IDENTITY');
  if(!ppre||ppre.unit!=='pk'||ppre.value!==hp||!tpre||tpre.unit!=='Nm')reasons.push('ATM_STOCK_TABLE_HEADING_MISMATCH');
  if(!stages.stage1||!ppost||!tpost||stages.stage1.powerHp!==ppost.value||stages.stage1.torqueNm!==tpost.value)reasons.push('ATM_STAGE1_TABLE_MISMATCH');
  if(stages.stage1&&(stages.stage1.powerHp<hp||(tpre&&stages.stage1.torqueNm<tpre.value)))reasons.push('STAGE1_BELOW_STOCK_REVIEW');
  if(!(facts.methode??'').split(',').some(method=>/^Chiptuning$/i.test(method.trim())))reasons.push('ATM_ORDINARY_REMAP_METHOD_UNCONFIRMED');
  if(/TDCi/i.test(engine??'')&&/EcoBlue/i.test(engine??''))reasons.push('ENGINE_FAMILY_LABEL_CONFLICT');
  return {...base,...provenance,...(complete?{identity}:{unresolvedIdentity:identity}),...(Object.keys(stages).length?{stages}:{}),
    availability:{status:'available',scope:'source-application-only',evidence:'Actual application table and exact numeric Stage controls; method checked separately.'},
    conditions:[...new Set([...reasons,...(reasons.length?['V3_APPLICABILITY_UNRESOLVED']:[]),'Exact engine, generation and installed ECU require workshop verification.'])],
    notes:['Only factual application fields retained; no prices, reviews, marketing, images or dyno graphics. Stage 1+ is not Stage 2. ECU/code facts describe the provider application, not the installed ECU of an RDW registration.',...(facts.methode?.includes('Externe module')?['Both remap and external module methods are listed; this vote is the explicitly labeled Stage 1 software/remap table, not a second module vote.']:[])]};
}
async function main(){
  const at=process.argv.indexOf('--url');
  if(at>=0){
    const fs=require('node:fs'),path=require('node:path'),url=process.argv[at+1];
    if(new URL(url).hostname!=='www.atm-chiptuning.com'||!new URL(url).pathname.startsWith('/chiptuning/'))throw Error('Use an actual public ATM application URL.');
    const result=extract(await fetchPage(url,{refresh:process.argv.includes('--refresh'),maxAgeMs:30*86400000}));
    const directory=path.resolve('.git/nl-fleet-v3/atm-review');fs.mkdirSync(directory,{recursive:true});const file=path.join(directory,result.id+'.json');fs.writeFileSync(file,JSON.stringify(result,null,2));
    console.log(JSON.stringify({candidate:file,status:result.status,availability:result.availability,conditions:result.conditions,acceptedDatasetModified:false}));
  }else await require('./research-provider-refresh.cjs').run('atm-chiptuning',{extract});
}
module.exports={extract,attributes,breadcrumbs,tableFacts,yearScope,clean,comparison};
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
