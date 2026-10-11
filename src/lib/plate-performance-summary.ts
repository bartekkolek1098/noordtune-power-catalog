import type {EstimateStage, TuningEstimateProfile} from '../data/tuning-estimates-shared.ts';
export type PerformanceRange = readonly [number, number];
const positive=(x:unknown):x is number=>typeof x==='number'&&Number.isFinite(x)&&x>0;
function validRange(single:number|undefined,range:readonly number[]|undefined):PerformanceRange|undefined{
 if(range?.length===2&&range.every(positive)&&range[1]>=range[0])return [range[0],range[1]];
 return positive(single)?[single,single]:undefined;
}
/** Display arithmetic only: never infer engine output, torque or a calibration.
 * Registered horsepower always takes precedence over supplier marketing labels.
 */
export function platePerformanceSummary(profile:TuningEstimateProfile|undefined,stage:EstimateStage|undefined,registeredHp:number|null|undefined){
 const stockPower=positive(registeredHp)?registeredHp:undefined;
 const stockTorque=positive(profile?.stockTorqueNm)?profile.stockTorqueNm:undefined;
 const eligible=!!stage&&!stage.customHardware&&!stage.name.startsWith('Stage 3');
 const power=eligible?validRange(stage.powerHp,stage.powerRangeHp):undefined;
 const torque=eligible?validRange(stage.torqueNm,stage.torqueRangeNm):undefined;
 const gain=(r:PerformanceRange|undefined,base:number|undefined):PerformanceRange|undefined=>r&&base!==undefined&&r[0]>=base?[Math.round((r[0]-base)*10)/10,Math.round((r[1]-base)*10)/10]:undefined;
 return {stockPower,stockTorque,power,torque,powerGain:gain(power,stockPower),torqueGain:gain(torque,stockTorque),numeric:!!power};
}
export function formatPerformanceRange(range:PerformanceRange|undefined,locale:string,unit:string,gain=false){
 if(!range)return undefined;
 const f=(x:number)=>new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(x);
 const value=range[0]===range[1]?f(range[0]):f(range[0])+'–'+f(range[1]);
 return (gain?'+':'')+value+' '+unit;
}
