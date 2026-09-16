/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict');
const {extract,yearScope,attributes}=require('./research-atm.cjs');
let assertions=0;
const equal=(actual,expected,label)=>{assertions++;assert.deepEqual(actual,expected,label);};
const ok=(value,label)=>{assertions++;assert.ok(value,label);};
// Synthetic minimal markup, not copied provider pages. No network requests.
function fixture(options={}){
  const o={brand:'Ford',model:'Transit Connect',generation:'3th - 2016 ->',engine:'1.5 Ecoblue 100pk',hp:100,nm:250,tunedHp:145,tunedNm:340,cc:1499,fuel:'Diesel',method:'Chiptuning',ecu:'Bosch MD1CS005',...options};
  const crumb=[['Home','/'],['Chiptuning','/chiptuning/'],[o.brand,'/make/'],[o.model,'/model/'],[o.generation,'/generation/'],[o.engine,'/engine/']].map(([name,url],i)=>({'@id':'#crumbs',itemListElement:{'@type':'ListItem',position:i+1,item:{name,'@id':'https://www.atm-chiptuning.com'+url}}}));
  const table=Object.entries({Brandstof:o.fuel,Methode:o.method,Cilinderinhoud:o.cc+' CC','Type ecu':o.ecu,...(o.code?{Motornummer:o.code}:{})}).map(([key,v])=>'<tr><td>'+key+'</td><td></td><td><strong>'+v+'</strong></td></tr>').join('');
  const cmp=(name,value,unit,nest=false)=>`<div class="Chiptuning-comparison__number ${name}">${nest?'<div>':''}${value}<span>${unit}</span>${nest?'</div>':''}</div>`;
  const stage=(name,p,n)=>`<a class="Chiptuning-stages__stage" data-stage="${name}" data-up="${p}" data-ut="${n}" data-p-type="pk" data-t-type="Nm">Stage ${name}</a>`;
  const body=`<script type="application/ld+json">${JSON.stringify({'@graph':crumb})}</script><h1>${o.engine}</h1><table>${table}</table>${cmp('tuning-p-pre',o.hp,'pk')}${cmp('tuning-t-pre',o.nm,'Nm')}${cmp('tuning-p-post',o.tunedHp,'pk',true)}${cmp('tuning-t-post',o.tunedNm,'Nm',true)}${stage('1',o.tunedHp,o.tunedNm)}${stage('1+',999,999)}<div class="Chiptuning-stages__stage-info" data-stage="2">Stage 2 software</div>${o.stage2?stage('2',o.stage2[0],o.stage2[1]):''}${o.extra??''}`;
  return {url:'https://www.atm-chiptuning.com/chiptuning/synthetic-'+o.hp+'/',retrievedAt:'2026-09-16T00:00:00Z',status:'retrieved',httpStatus:200,contentSha256:'a'.repeat(64),body};
}
for(const data of [
 {hp:75,nm:200,tunedHp:140,tunedNm:320,engine:'1.5 TDCi 75pk'},
 {hp:100,nm:250,tunedHp:145,tunedNm:340,engine:'1.5 Ecoblue 100pk'},
 {hp:120,nm:270,tunedHp:145,tunedNm:340,engine:'1.5 Ecoblue 120pk'},
 {brand:'Volkswagen',model:'Caddy',generation:'Mk5 - 2020 ->',engine:'2.0 TDI 122pk',hp:122,nm:250,tunedHp:180,tunedNm:410,cc:1968},
 {brand:'Volkswagen',model:'Golf',generation:'Golf 8 - 2019 ->',engine:'1.5 TSI 150pk',hp:150,nm:250,tunedHp:180,tunedNm:335,cc:1498,fuel:'Benzine'},
 {brand:'MAN',model:'TGE',generation:'2017 ->',engine:'2.0 TDI 140pk',hp:140,nm:340,tunedHp:190,tunedNm:420,cc:1968},
 {brand:'Renault',model:'Master',generation:'2019 - 2024',engine:'2.3 dCi 135pk',hp:135,nm:360,tunedHp:165,tunedNm:400,cc:2299},
 {brand:'Mercedes-Benz',model:'Sprinter',generation:'11/2021 -> ...',engine:'315 CDI 150pk',hp:150,nm:340,tunedHp:195,tunedNm:420,cc:1950,code:'OM654'},
 {brand:'Mercedes-Benz',model:'Vito',generation:'W447 - 2020 ->',engine:'116 CDI 163pk',hp:163,nm:380,tunedHp:200,tunedNm:440,cc:1950},
 {brand:'Volkswagen',model:'Transporter / Multivan',generation:'T6 - 2015 - 2019',engine:'2.0 TDI 150pk',hp:150,nm:340,tunedHp:190,tunedNm:410,cc:1968},
 {brand:'Ford',model:'Focus',generation:'Mk2 - 2004 - 2010',engine:'1.6 100pk',hp:100,nm:150,tunedHp:110,tunedNm:165,cc:1596,fuel:'Benzine'},
 {brand:'Peugeot',model:'Partner',generation:'2008 - 2018',engine:'1.6 BlueHDi 100pk',hp:100,nm:254,tunedHp:125,tunedNm:300,cc:1560},
 ]){
  const response=fixture(data),o=extract(response);
  equal(o.provider,'atm-chiptuning','First-class provider');
  equal(o.identity.brand,data.brand??'Ford','Published make');
  equal(o.identity.stockPowerHp,data.hp,'Factory PS');equal(o.identity.stockTorqueNm,data.nm,'Factory torque');
  equal(o.identity.displacementCc,data.cc??1499,'Exact displacement');equal(o.identity.displacementPrecision,'exact','Precision retained');
  equal(o.stages.stage1.powerHp,data.tunedHp,'Numeric Stage 1');equal(o.stages.stage1.torqueNm,data.tunedNm,'Numeric Stage 1 Nm');
  equal(o.stages.stage2,undefined,'Info panel and Stage 1+ are not Stage 2');
  equal(o.contentSha256,response.contentSha256,'Original response hash retained');
  ok(!o.conditions.includes('V3_APPLICABILITY_UNRESOLVED'),'Complete actual table accepted for review');
  ok(!/999/.test(JSON.stringify(o.stages)),'Do not import Stage 1+ gains');
}
equal(extract(fixture({code:'XWGB &amp; XWGC'})).identity.engineCodes,['XWGB','XWGC'],'Explicit code list');
equal(extract(fixture({ecu:'Bosch A &amp; Delphi B'})).identity.ecuFamily,'Bosch A & Delphi B','Explicit ECU alternatives');
equal(extract(fixture()).identity.engineCodes,undefined,'No inferred code');
equal(extract(fixture()).identity.cylinders,undefined,'No inferred cylinders');
equal(extract(fixture({model:'Transporter / Multivan'})).identity.aliases,['Multivan'],'Published model alias');
equal(extract(fixture({stage2:[160,360]})).stages.stage2.powerHp,160,'Explicit numeric Stage 2');
equal(extract(fixture({method:'Chiptuning , Externe module'})).conditions.includes('V3_APPLICABILITY_UNRESOLVED'),false,'One explicit remap vote when both methods listed');
ok(extract(fixture({method:'Externe module'})).conditions.includes('ATM_ORDINARY_REMAP_METHOD_UNCONFIRMED'),'Module-only never remap');
ok(extract(fixture({hp:101})).conditions.includes('ATM_STOCK_TABLE_HEADING_MISMATCH'),'Heading/table disagreement rejected');
ok(extract(fixture({fuel:'Onbekend'})).conditions.includes('ATM_INCOMPLETE_APPLICATION_IDENTITY'),'Missing fuel not guessed');
ok(extract(fixture({cc:''})).conditions.includes('ATM_INCOMPLETE_APPLICATION_IDENTITY'),'Missing cc not inferred from label');
ok(extract(fixture({tunedHp:95})).conditions.includes('STAGE1_BELOW_STOCK_REVIEW'),'Below-stock PS rejected');
ok(extract(fixture({tunedNm:240})).conditions.includes('STAGE1_BELOW_STOCK_REVIEW'),'Below-stock torque rejected');
ok(extract(fixture({engine:'1.5 TDCi EcoBlue 100pk'})).conditions.includes('ENGINE_FAMILY_LABEL_CONFLICT'),'Mixed Ford family labels rejected');
const pending=extract(fixture({generation:'T6.1 - 2021 - 2024',extra:'<p>Momenteel is chiptuning voor deze toepassing nog niet mogelijk, deze is nog in ontwikkeling.</p>'}));
equal(pending.availability.status,'development-pending','Negative availability outranks stale numeric widgets');
equal(pending.availability.scope,'source-application-only','No global unsupported conclusion');equal(pending.stages,undefined,'No negative tuning vote');
equal(pending.unresolvedIdentity.generation,'T6.1 - 2021 - 2024','Negative exact generation retained');
equal(pending.unresolvedIdentity.yearFrom,2021,'Negative start');equal(pending.unresolvedIdentity.yearTo,2024,'Negative end');
for(const engine of ['1.5 eTSI 100pk','1.5 MHEV 100pk','1.5 Hybrid 100pk','1.5 GTE 100pk']){
 const o=extract(fixture({engine}));equal(o.availability.status,'hybrid-only','Hybrid evidence');equal(o.stages,undefined,'No ordinary hybrid vote');
}
for(const status of ['blocked','unavailable']){const o=extract({...fixture(),status});equal(o.status,status,'Access state');equal(o.identity,undefined,'Blocked facts not extracted');equal(o.stages,undefined,'Blocked stages not extracted');}
equal(yearScope('11/2021 -> ...'),{yearFrom:2021},'Month prefix');equal(yearScope('T6.1 - 2021 - 2024'),{yearFrom:2021,yearTo:2024},'Generation digits are not years');equal(yearScope('Mk5'),{},'No fabricated generation years');
equal(attributes("<a data-stage='1+' data-up='999'>")['data-stage'],'1+','Exact stage attributes');
ok(assertions>=100,'At least 100 meaningful source parsing assertions');
console.log(JSON.stringify({suite:'ATM parsing',assertions,networkRequests:0,failures:0}));
