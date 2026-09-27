/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {extract:unlimited,years}=require('./research-unlimited.cjs');
const {extractRendered:shiftech}=require('./research-shiftech-page.cjs');
const {discover,extract:vtech}=require('./research-vtech.cjs');
const {robotsAllowed}=require('./research-fetch.cjs');
// Minimal synthetic markup exercises table semantics; no provider HTML is committed.
const row=(tag,values)=>'<tr>'+values.map(v=>'<'+tag+'>'+v+'</'+tag+'>').join('')+'</tr>';
function sample(label){return {url:'https://www.unlimitedtuning.nl/synthetic.html',status:'retrieved',retrievedAt:'2026-09-16T00:00:00Z',contentSha256:'a'.repeat(64),body:'<main><h1>Chiptuning Ford Fiesta 1.25 60 pk</h1><table>'+row('th',['','Standaard','Ecotuning',label,'Stage 1+','Stage 2'])+row('td',['Vermogen','60 pk','66 pk','82 pk','99 pk','90 pk'])+row('td',['Koppel','110 Nm','115 Nm','125 Nm','160 Nm','135 Nm'])+'</table></main>'};}
const scope={brand:'Ford',modelFamily:'Fiesta',generation:'MK7',yearFrom:2013,yearTo:2017,fuel:'Petrol'};
assert.deepEqual(years('t/m 2014'),{yearTo:2014});
assert.deepEqual(years('.. t/m 2017'),{yearTo:2017});
assert.deepEqual(years('2018 t/m nu'),{yearFrom:2018});
assert.deepEqual(years('2014 t/m 2019'),{yearFrom:2014,yearTo:2019});
assert.ok(!unlimited(sample('Normal'),{...scope,yearFrom:undefined,yearTo:2014}).identity,'End-only period cannot establish a generation start');
for(const label of ['Normal','Stage 1']){const o=unlimited(sample(label),scope);assert.equal(o.identity.displacementCc,1250);assert.equal(o.stages.stage1.powerHp,82);assert.equal(o.stages.stage2.powerHp,90);}
assert.ok(!unlimited(sample('Xtreme'),scope).stages.stage1,'Xtreme/Stage 1+ is not ordinary Stage 1');
const marked=sample('Stage 1');marked.body=marked.body.replace('Fiesta 1.25','Fiesta 48V 1.25');assert.equal(unlimited(marked,scope).identity.electrification,'hybrid');
const conflicting=sample('Stage 1');conflicting.body=conflicting.body.replace('Fiesta 1.25','Fiesta 1.5 TDCI EcoBlue');assert.ok(unlimited(conflicting,scope).conditions.includes('ENGINE_FAMILY_LABEL_CONFLICT'));
const rendered='# Kia Stonic (KX1) 2017 1.6 CRDI EU6 110hp 260nm\n### Stage 1\n110 hp\n135 hp\n25 hp\n260 nm\n320 nm\n60 nm\nContact us';
const url='https://www.shiftech.eu/en/chiptuning/car/kia/stonic-kx1/2017/diesel/1.6-crdi-eu6-110';
const s=shiftech(rendered,url,'2026-09-16T00:00:00Z');assert.equal(s.identity.modelFamily,'Stonic');assert.deepEqual(s.identity.aliases,['KX1']);assert.equal(s.stages.stage1.powerHp,135);assert.equal(s.stages.stage1.torqueNm,320);
assert.equal(shiftech(rendered.replace('1.6 CRDI','1.6 CRDI 48V'),url,'2026-09-16').reason,'HYBRID_APPLICATION_UNSUPPORTED');
assert.equal(shiftech(rendered.replace('110 hp\n135','111 hp\n135'),url,'2026-09-16').reason,'SOURCED_STAGE1_REQUIRED','Stock headline and table must agree');
const engine={value:'vii::15-tsi-150',gen_label:'VII',engine:'1.5 TSI 150 KM'};
const tree={baseUrl:'https://sklep.vtech.pl/powerchip/',tree:{volkswagen:{label:'Volkswagen',models:{golf:{label:'Golf',years:{2017:{engines:[engine]},2018:{engines:[engine]}}}}}}};
const d=discover({body:'var vtFitmentSearch = '+JSON.stringify(tree)+';'});assert.equal(d.length,1);assert.deepEqual(d[0].years,[2017,2018],'Configurator year copies are deduplicated');
const modulePage={url:d[0].url,status:'retrieved',retrievedAt:'2026-09-16T00:00:00Z',body:'<h1>Golf 1.5 TSI</h1><h3 class="vt-fitment-product-name">PowerChip One</h3><span class="vt-fitment-gain-value hp" data-count-to="15"></span><span class="vt-fitment-gain-value nm" data-count-to="25"></span>'};
const v=vtech(modulePage,d[0]);assert.equal(v.packages[0].tunedPowerHp,165);assert.equal(v.packages[0].kind,'external-module');assert.ok(!v.stages&&!v.identity);assert.equal(v.unresolvedIdentity.stockTorqueNm,undefined);
assert.equal(robotsAllowed('User-agent: *\nDisallow: /private/\nAllow: /private/public/','https://example.test/private/page'),false);
assert.equal(robotsAllowed('User-agent: *\nDisallow: /private/\nAllow: /private/public/','https://example.test/private/public/page'),true);
const cache=fs.mkdtempSync(path.join(os.tmpdir(),'noordtune-provider-cache-'));
const blockedUrl='https://blocked.example.test/page';
const file=path.join(cache,crypto.createHash('sha256').update(blockedUrl).digest('hex')+'.json');
fs.writeFileSync(file,JSON.stringify({url:blockedUrl,status:'blocked',httpStatus:403,retrievedAt:'2000-01-01T00:00:00Z'}));
process.env.TUNING_RESEARCH_CACHE=cache;delete require.cache[require.resolve('./research-fetch.cjs')];
require('./research-fetch.cjs').fetchPage(blockedUrl,{refresh:true,maxAgeMs:0}).then(result=>{assert.equal(result.status,'blocked');assert.equal(result.cached,true,'Explicit refresh cannot bypass recorded block');fs.unlinkSync(file);fs.rmdirSync(cache);console.log('Provider parser, package, generation-year deduplication, robots and blocked-refresh regressions passed.');}).catch(error=>{console.error(error);process.exitCode=1;});
