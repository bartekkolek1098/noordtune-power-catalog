// Server-only manual adapter. A selection never fabricates an RDW registration.
import {commercialVanFamilies} from './reviewed-commercial-vans.ts';
import type {VehicleSelectorItem} from './catalog-selector.ts';
import type {ManualCatalogResult} from './manual-catalog-result.ts';
const normalize=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const idOf=(id:string)=>'reviewed-van-'+id;
const band=(v:readonly number[]):[number,number]=>[Math.min(...v),Math.max(...v)];
export function reviewedVanSelectorItems(filter:{brand?:string;model?:string;year?:number}={},query?:string):VehicleSelectorItem[]{
 const tokens=query?normalize(query).split(/\s+/).filter(Boolean):[];
 return commercialVanFamilies.filter(f=>
  (!filter.brand||normalize(filter.brand)===normalize(f.selectorBrand))&&
  (!filter.model||normalize(filter.model)===normalize(f.model))&&
  (filter.year===undefined||(Number.isInteger(filter.year)&&filter.year>=f.from&&filter.year<=f.to))&&
  tokens.every(t=>normalize([f.selectorBrand,f.model,f.engine,f.generation,Math.round(f.kw*1.359621617),...Array.from({length:f.to-f.from+1},(_,i)=>f.from+i)].join(' ')).includes(t))
 ).map(f=>({kind:'reviewed',id:idOf(f.id),brand:f.selectorBrand,model:f.model,
  engine:f.engine,version:f.generation,yearRange:`${f.from}–${f.to}`,ecuType:'Vehicle-specific ECU check',popular:false,
  quote:{kind:'on-request',currency:'EUR',reasonCode:'MANUAL_SELECTION_REQUIRES_VEHICLE_CHECK'}}));
}
export function getReviewedVanManualResult(id:string,selectedYear?:number):ManualCatalogResult|undefined{
 const f=commercialVanFamilies.find(f=>idOf(f.id)===id);
 if(!f||(selectedYear!==undefined&&(!Number.isInteger(selectedYear)||selectedYear<f.from||selectedYear>f.to)))return undefined;
 const result:ManualCatalogResult={vehicle:{id,brand:f.selectorBrand,model:f.model,generation:f.generation,engine:f.engine,fuel:'Diesel',yearFrom:f.from,yearTo:f.to,selectedYear,displacementCc:f.cc,stockPowerHp:Math.round(f.kw*1.359621617),stockPowerKw:f.kw},status:selectedYear===undefined?'select-year':'source-comparison',sources:[],fuelRon:[],
  reviewConditions:{nl:f.checksNl,en:f.scope,pl:'To wskazania źródłowe dla wybranej rodziny silnika, nie identyfikacja konkretnego auta. Przed realizacją trzeba sprawdzić kod silnika, ECU, normę emisji i skrzynię. Zakres mocy nie jest zalecanym obciążeniem mechanicznym. Nazwa handlowa mocy może różnić się od przeliczenia kW. DPF, EGR i SCR/AdBlue pozostają sprawne.'}};
 if(selectedYear===undefined)return result;
 const sources=f.sources.map(s=>({title:s.title,url:s.url,powerHp:s.stage1Hp,torqueNm:s.stage1Nm}));
 return {...result,sources,sourceProfileId:id,
  stage1:{powerHp:band(sources.map(s=>s.powerHp)),torqueNm:band(sources.map(s=>s.torqueNm)),...(!f.hideManualStockTorque?{stockTorqueNm:f.stockNm}:{})}};
}
