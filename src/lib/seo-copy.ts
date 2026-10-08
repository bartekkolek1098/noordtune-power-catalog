import type {EngineVariant, StageDefinition} from "../data/catalog-shared.ts";
import {formatQuote, resolveStageQuote} from "../data/pricing.ts";
import {formatEstimatePower, formatEstimateTorque} from "./estimate-copy.ts";
import {applyStageHardwarePolicy} from "./stage-hardware-policy.ts";
import type {Locale} from "../i18n/routing.ts";

export const SEO_BRAND = "NoordTune";

const localeCopy: Record<
  Locale,
  {
    powerUnit: string;
    vehicleTitleSuffix: string;
    stageTitleSuffix: string;
    homeTitle: string;
    homeDescription: string;
  }
> = {
  nl: {
    powerUnit: "pk",
    vehicleTitleSuffix: "chiptuning & Stage 1",
    stageTitleSuffix: "chiptuning",
    homeTitle: "RDW vermogenscatalogus | Stage 1 per kenteken",
    homeDescription:
      "Controleer fabrieksgegevens via RDW en bekijk Stage 1-indicaties met bronnen. Zoek ook op merk, model en motor. De vermogenscatalogus van NoordTune.nl."
  },
  en: {
    powerUnit: "hp",
    vehicleTitleSuffix: "tuning & Stage 1",
    stageTitleSuffix: "tuning",
    homeTitle: "RDW power catalog | Stage 1 by registration",
    homeDescription:
      "Check factory specifications using RDW and explore source-linked Stage 1 estimates. Search by plate, make, model or engine. A catalog by NoordTune.nl."
  },
  pl: {
    powerUnit: "KM",
    vehicleTitleSuffix: "chiptuning i Stage 1",
    stageTitleSuffix: "chiptuning",
    homeTitle: "Katalog mocy RDW | Stage 1 dla Twojego auta",
    homeDescription:
      "Sprawdź fabryczną moc w RDW i orientacyjne Stage 1 ze źródłami. Szukaj po numerze rejestracji lub wybierz markę i silnik. Katalog NoordTune.nl."
  }
};

export function brandedSeoTitle(title: string) {
  return `${title} | ${SEO_BRAND}`;
}

export function homepageMetadataCopy(locale: Locale) {
  return {
    title: localeCopy[locale].homeTitle,
    description: localeCopy[locale].homeDescription
  };
}

export function vehicleMetadataCopy(locale: Locale, vehicle: EngineVariant) {
  const copy = localeCopy[locale];
  const stage = applyStageHardwarePolicy(vehicle.stages)[0];
  const quote = formatQuote(resolveStageQuote(vehicle, stage), locale);
  const estimate = catalogEstimateLabel(vehicle, locale);
  const identity = `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`;
  const power = formatEstimatePower(stage, locale);
  const torque = formatEstimateTorque(stage, locale);
  const title = `${vehicle.brand} ${vehicle.model} ${copy.vehicleTitleSuffix}`;
  const description =
    locale === "en"
      ? `${identity}: Stage 1 ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}, ${torque}. ${quote}. ${estimate}.`
      : locale === "pl"
        ? `${identity}: Stage 1 ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}, ${torque}. ${quote}. ${estimate}.`
        : `${identity}: Stage 1 ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}, ${torque}. ${quote}. ${estimate}.`;

  return {title, description};
}

export function stageMetadataCopy(
  locale: Locale,
  vehicle: EngineVariant,
  stage: StageDefinition
) {
  const copy = localeCopy[locale];
  const displayStage = applyStageHardwarePolicy([stage])[0];
  const quote = formatQuote(resolveStageQuote(vehicle, displayStage), locale);
  const estimate = catalogEstimateLabel(vehicle, locale);
  const identity = `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`;
  const power = formatEstimatePower(displayStage, locale);
  const torque = displayStage.customHardware
    ? ""
    : `, ${formatEstimateTorque(displayStage, locale)}`;
  const title = `${vehicle.brand} ${vehicle.model} ${stage.name} ${copy.stageTitleSuffix}`;
  const description =
    locale === "en"
      ? `${stage.name} for ${identity}: ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}${torque}. ${quote}. ${estimate}.`
      : locale === "pl"
        ? `${stage.name} dla ${identity}: ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}${torque}. ${quote}. ${estimate}.`
        : `${stage.name} voor ${identity}: ${vehicle.stockPowerHp} ${copy.powerUnit} → ${power}${torque}. ${quote}. ${estimate}.`;

  return {title, description};
}

function catalogEstimateLabel(vehicle: EngineVariant, locale: Locale) {
  return vehicle.publicationSource === "existing-curated"
    ? {
        nl: "Voertuigspecifieke indicatie",
        en: "Vehicle-specific estimate",
        pl: "Dane orientacyjne dla pojazdu"
      }[locale]
    : {
        nl: "Schatting; toepasbaarheid te bevestigen",
        en: "Estimate; applicability to be confirmed",
        pl: "Szacunek; zastosowanie do potwierdzenia"
      }[locale];
}
