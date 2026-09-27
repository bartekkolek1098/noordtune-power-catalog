import {normalizeCatalogMake, registeredPowerToMetricHp} from "../data/catalog-matching.ts";
import type {EstimateMatchInput} from "../data/tuning-estimates.ts";

/** Narrow manufacturer-backed exclusions; no hybrid inference from age alone.
 * Evidence: data/research/batches/v2-manufacturer-evidence.json.
 * These also protect incomplete RDW fuel descriptions that only say petrol.
 */
export function hasUnsupportedSourcedPowertrain(input:EstimateMatchInput){
  const make=normalizeCatalogMake(input.make);
  const model=(input.model??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const text=[model,input.type,input.variant,input.execution].join(" ");
  if(/\b(?:hybrid|hybride|phev|mhev|hev|hsd|48\s*v)\b|\be[- ]power\b/i.test(text))return true;
  // Both the original 2016 Niro and its successor are dedicated electrified models.
  if(make==="kia"&&/\bniro\b/.test(model))return true;
  const power=registeredPowerToMetricHp(input),cc=input.displacementCc;
  if(!power||!cc)return false;
  // Suzuki's European 129 PS / 1.4 BoosterJet package is the 48V hybrid.
  if(make==="suzuki"&&/\b(?:swift|vitara|sx4|s.cross)\b/.test(model)&&Math.abs(cc-1400)<=49&&Math.abs(power-129)<=.7)return true;
  // The 158 PS Qashqai is the electrified output variant. The older 160 PS
  // variant remains distinct; 140 PS requires explicit J12 body evidence.
  if(make==="nissan"&&/\bqashqai\b/.test(model)&&Math.abs(cc-1300)<=49
    &&(Math.abs(power-158)<=.7||(Math.abs(power-140)<=.7&&/\bj12\b/i.test(text))))return true;
  return false;
}
