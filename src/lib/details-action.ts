import type {EngineVariant} from "../data/catalog-shared.ts";
import {getCatalogEstimateProfile, type TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import {applyStageHardwarePolicy} from "./stage-hardware-policy.ts";
import type {Locale} from "../i18n/routing.ts";

export type DetailsAction = {kind: "vehicle-page"; path: `/vehicles/${string}`} |
  {kind: "inline-configurator"; target: "rdw-configurator"} | {kind: "unavailable"};

/** The caller supplies the actual published catalog on the server, never pricing aliases. */
export function resolveDetailsAction(profile: TuningEstimateProfile | undefined, published: readonly EngineVariant[]): DetailsAction {
  if (!profile) return {kind: "unavailable"};
  const inline: DetailsAction = {kind: "inline-configurator", target: "rdw-configurator"};
  const page = published.find(vehicle => vehicle.id === profile.vehicleId);
  if (!page || profile.provenance !== "existing-catalog" ||
      !["brand", "model", "engine", "fuel", "generation", "yearRange", "stockPowerHp", "stockTorqueNm"].every(key =>
        profile[key as keyof TuningEstimateProfile] === page[key as keyof EngineVariant])) return inline;
  const figures = (value: TuningEstimateProfile) => applyStageHardwarePolicy(value.stages).map(stage =>
    [stage.name, stage.powerHp, stage.torqueNm, stage.powerRangeHp, stage.torqueRangeNm, Boolean(stage.customHardware)]);
  if (JSON.stringify(figures(profile)) !== JSON.stringify(figures(getCatalogEstimateProfile(page)))) return inline;
  return {kind: "vehicle-page", path: `/vehicles/${page.id}`};
}

export function detailsActionLabel(action: DetailsAction, locale: Locale) {
  return action.kind === "vehicle-page"
    ? {nl: "Open tuningpagina", en: "Open tuning page", pl: "Otwórz stronę tuningu"}[locale]
    : {nl: "Bekijk volledige configuratie", en: "View full configuration", pl: "Zobacz pełną konfigurację"}[locale];
}

export function focusConfigurator(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.focus({preventScroll: true});
  target.scrollIntoView({block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
}
