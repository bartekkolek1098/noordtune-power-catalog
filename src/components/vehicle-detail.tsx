"use client";

import {Check, Gauge, MessageCircle, ShieldCheck, Sparkles, Wrench} from "lucide-react";
import {useMemo, useState} from "react";
import {
  serviceOptions,
  type EngineVariant,
  type StageDefinition
} from "@/data/catalog-shared";
import type {Locale} from "@/i18n/routing";
import {localizeServiceOption} from "@/lib/service-copy";
import {formatCurrency} from "@/lib/utils";
import {createVehicleQuoteMessage, whatsappHref} from "@/lib/whatsapp";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {PowerChart} from "@/components/power-chart";

type VehicleCopy = {
  fromPrice: string;
  calculator: string;
  selectStage: string;
  availableOptions: string;
  packageBreakdown: string;
  requirements: string;
  requestQuote: string;
  whatsapp: string;
  stock: string;
  tuned: string;
  gain: string;
  power: string;
  torque: string;
  ecu: string;
  gearbox: string;
  fuel: string;
  yearRange: string;
  disclaimer: string;
  stage1Package: string;
  stage2Package: string;
  stage3Package: string;
  stage1Requirements: string;
  stage2Requirements: string;
  stage3Requirements: string;
  recommendation: {
    eyebrow: string;
    title: string;
    intro: string;
    recommendedBadge: string;
    bestDaily: string;
    bestDailyText: string;
    performance: string;
    performanceText: string;
    custom: string;
    customText: string;
    selectSetup: string;
    setupSelected: string;
    recommendedAddOns: string;
    gearboxText: string;
    addGearbox: string;
    removeGearbox: string;
    quoteSelected: string;
  };
};

export function VehicleDetail({
  initialStageName,
  locale,
  text,
  vehicle
}: {
  initialStageName?: StageDefinition["name"];
  locale: Locale;
  text: VehicleCopy;
  vehicle: EngineVariant;
}) {
  const [stageIndex, setStageIndex] = useState(() =>
    Math.max(
      0,
      initialStageName
        ? vehicle.stages.findIndex((stage) => stage.name === initialStageName)
        : 0
    )
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [recommendedPackage, setRecommendedPackage] = useState<StageDefinition["name"] | null>(null);
  const selectedStage = vehicle.stages[stageIndex] ?? vehicle.stages[0];
  const availableOptions = useMemo(
    () =>
      serviceOptions
        .filter((option) => vehicle.options.includes(option.id))
        .map((option) => localizeServiceOption(option, locale)),
    [locale, vehicle.options]
  );
  const optionsTotal = selectedOptions.reduce((total, id) => {
    const option = serviceOptions.find((item) => item.id === id);
    return total + (option?.price ?? 0);
  }, 0);
  const total = selectedStage.price + optionsTotal;
  const localeCode = locale === "en" ? "en-US" : locale === "pl" ? "pl-PL" : "nl-NL";
  const powerUnit = locale === "en" ? "hp" : locale === "pl" ? "KM" : "pk";
  const selectedOptionLabels = availableOptions
    .filter((option) => selectedOptions.includes(option.id))
    .map((option) => option.name);
  const gearboxOption =
    vehicle.gearbox && vehicle.gearbox !== "Manual"
      ? availableOptions.find((option) => option.id === "gearbox")
      : undefined;
  const localizedPackage =
    selectedStage.name === "Stage 1"
      ? text.stage1Package
      : selectedStage.name === "Stage 2"
        ? text.stage2Package
        : text.stage3Package;
  const localizedRequirements =
    selectedStage.name === "Stage 1"
      ? text.stage1Requirements
      : selectedStage.name === "Stage 2"
        ? text.stage2Requirements
        : text.stage3Requirements;
  const vehicleLabel = `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`;
  const recommendedPackageLabel =
    recommendedPackage === selectedStage.name
      ? `${recommendationLabel(selectedStage.name, text)} · ${selectedStage.name}`
      : undefined;
  const quoteHref = whatsappHref({
    locale,
    message: createVehicleQuoteMessage({
      locale,
      options: selectedOptionLabels,
      price: formatCurrency(total, localeCode),
      recommendedPackage: recommendedPackageLabel,
      stage: selectedStage.name,
      vehicle: `${vehicle.brand} ${vehicle.model} ${vehicle.engine} ${vehicle.version}`,
      vehiclePower: `${vehicle.stockPowerHp} ${powerUnit} -> ${selectedStage.powerHp} ${powerUnit}`
    }),
    vehicleLabel
  });
  const recommendationCards = vehicle.stages.map((stage, index) => ({
    description:
      stage.name === "Stage 1"
        ? text.recommendation.bestDailyText
        : stage.name === "Stage 2"
          ? text.recommendation.performanceText
          : text.recommendation.customText,
    index,
    label: recommendationLabel(stage.name, text),
    stage
  }));

  function selectStage(index: number, recommended = false) {
    setStageIndex(index);
    setRecommendedPackage(recommended ? vehicle.stages[index]?.name ?? null : null);
  }

  function toggleOption(id: string) {
    setSelectedOptions((current) =>
      current.includes(id)
        ? current.filter((optionId) => optionId !== id)
        : [...current, id]
    );
  }

  return (
    <div className="grid min-w-0 gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:pb-0">
      <div className="min-w-0 space-y-6">
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          {[
            {
              label: text.power,
              value: `${vehicle.stockPowerHp} → ${selectedStage.powerHp} ${powerUnit}`
            },
            {label: text.torque, value: `${vehicle.stockTorqueNm} → ${selectedStage.torqueNm} Nm`},
            {
              label: text.gain,
              value: `+${selectedStage.powerHp - vehicle.stockPowerHp} ${powerUnit} / +${
                selectedStage.torqueNm - vehicle.stockTorqueNm
              } Nm`
            }
          ].map((item) => (
            <div className="min-w-0 rounded-[3px] border border-white/10 bg-black/45 p-4" key={item.label}>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {item.label}
              </div>
              <div className="mt-2 text-2xl font-black">{item.value}</div>
            </div>
          ))}
        </div>

        <section
          className="panel-edge min-w-0 overflow-hidden border-primary/30 p-5 md:p-6"
          data-testid="vehicle-recommendation"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] border border-primary/35 bg-primary/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                    {text.recommendation.eyebrow}
                  </div>
                  <h2 className="racing-title mt-1 text-2xl leading-none text-white md:text-3xl">
                    {text.recommendation.title}
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {text.recommendation.intro}
              </p>
            </div>
            <Badge className="w-fit border-primary/35 bg-primary/15 text-primary">
              {text.recommendation.recommendedBadge}: Stage 1
            </Badge>
          </div>

          <div className="mt-6 grid min-w-0 gap-3 md:grid-cols-3">
            {recommendationCards.map(({description, index, label, stage}) => {
              const isRecommendedSelection = recommendedPackage === stage.name;

              return (
                <article
                  className={`flex min-h-full min-w-0 flex-col rounded-[3px] border p-4 transition ${
                    isRecommendedSelection
                      ? "border-primary bg-primary/[0.12] shadow-[0_0_32px_rgba(227,6,19,.16)]"
                      : stage.name === "Stage 1"
                        ? "border-primary/35 bg-[linear-gradient(155deg,rgba(227,6,19,.12),rgba(255,255,255,.025))]"
                        : "border-white/10 bg-black/35"
                  }`}
                  key={stage.name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                        {label}
                      </div>
                      <h3 className="mt-1 text-xl font-black text-white">{stage.name}</h3>
                    </div>
                    {stage.name === "Stage 1" ? (
                      <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <Wrench className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                  <div className="mt-4 border-t border-white/10 pt-3 text-sm font-black text-white">
                    <span className="block">
                      {stage.powerHp} {powerUnit} / {stage.torqueNm} Nm
                    </span>
                    <span className="mt-1 block text-xs text-primary">
                      {text.fromPrice} {formatCurrency(stage.price, localeCode)}
                    </span>
                  </div>
                  <Button
                    className="mt-3 w-full rounded-[3px] text-xs font-black uppercase"
                    onClick={() => selectStage(index, true)}
                    type="button"
                    variant={stage.name === "Stage 1" ? "default" : "outline"}
                  >
                    {isRecommendedSelection
                      ? text.recommendation.setupSelected
                      : text.recommendation.selectSetup}
                  </Button>
                </article>
              );
            })}
          </div>

          {gearboxOption ? (
            <div className="mt-4 grid gap-3 rounded-[3px] border border-white/10 bg-black/40 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                  {text.recommendation.recommendedAddOns}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {text.recommendation.gearboxText}
                </p>
              </div>
              <Button
                className="rounded-[3px] text-xs font-black uppercase"
                onClick={() => toggleOption(gearboxOption.id)}
                type="button"
                variant="outline"
              >
                {selectedOptions.includes(gearboxOption.id)
                  ? text.recommendation.removeGearbox
                  : `${text.recommendation.addGearbox} · ${formatCurrency(gearboxOption.price, localeCode)}`}
              </Button>
            </div>
          ) : null}

          <Button asChild className="mt-4 h-auto min-h-12 w-full whitespace-normal rounded-[3px] py-3 text-center font-black uppercase leading-tight md:w-auto">
            <a data-testid="vehicle-recommendation-quote" href={quoteHref} rel="noreferrer" target="_blank">
              <MessageCircle className="h-4 w-4" />
              {text.recommendation.quoteSelected}
            </a>
          </Button>
        </section>

        <div className="rounded-[3px] border border-white/10 bg-black/45 p-4">
          <PowerChart
            powerUnit={powerUnit}
            stages={vehicle.stages}
            stockPower={vehicle.stockPowerHp}
            stockLabel={text.stock}
            stockTorque={vehicle.stockTorqueNm}
          />
        </div>

        <div className="rounded-[3px] border border-white/10 bg-black/45 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            <Gauge className="h-4 w-4" />
            {text.packageBreakdown}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Badge className="mb-3 border-primary/30 bg-primary/15 text-primary">
                {selectedStage.name}
              </Badge>
              <ul className="space-y-2">
                {localizedPackage.split("|").map((item) => (
                  <li className="flex gap-2 text-sm text-slate-200" key={item}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[3px] border border-white/10 bg-white/[0.035] p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {text.requirements}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {localizedRequirements}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>{text.ecu}: {vehicle.ecuType}</span>
                <span>{text.gearbox}: {vehicle.gearbox ?? "-"}</span>
                <span>{text.fuel}: {vehicle.fuel}</span>
                <span>{text.yearRange}: {vehicle.yearRange}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="min-w-0 space-y-4 rounded-[3px] border border-primary/40 bg-black/70 p-5 shadow-[0_0_80px_rgba(226,0,15,.2)]">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            {text.calculator}
          </div>
          <div className="mt-2 text-4xl font-black">
            {text.fromPrice} {formatCurrency(total, localeCode)}
          </div>
          <Button asChild className="mt-4 h-14 w-full rounded-[3px] text-base font-black uppercase shadow-[0_0_30px_rgba(227,6,19,.38)]">
            <a href={quoteHref} rel="noreferrer" target="_blank">
              <MessageCircle className="h-5 w-5" />
              {text.requestQuote}
            </a>
          </Button>
        </div>

        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {text.selectStage}
          </div>
          <div className="grid gap-2">
            {vehicle.stages.map((stage, index) => (
              <button
                className={`rounded-[3px] border p-3 text-left transition ${
                  stageIndex === index
                    ? "border-primary bg-primary/15"
                    : "border-white/10 bg-white/[0.035] hover:border-primary/50"
                }`}
                key={stage.name}
                onClick={() => selectStage(index)}
                type="button"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-bold">{stage.name}</span>
                  <span className="text-primary">
                    {text.fromPrice} {formatCurrency(stage.price, localeCode)}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {stage.powerHp} {powerUnit} / {stage.torqueNm} Nm
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {text.availableOptions}
          </div>
          <div className="space-y-2">
            {availableOptions.map((option) => (
              <label
                className="flex cursor-pointer items-start justify-between gap-3 rounded-[3px] border border-white/10 bg-white/[0.035] p-3 text-sm"
                key={option.id}
              >
                <span>
                  <span className="block font-semibold">{option.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-muted-foreground">
                    {text.fromPrice} {formatCurrency(option.price, localeCode)}
                  </span>
                  <input
                    checked={selectedOptions.includes(option.id)}
                    className="h-4 w-4 accent-[#e2000f]"
                    onChange={() => toggleOption(option.id)}
                    type="checkbox"
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button asChild className="h-12 w-full rounded-[3px] font-black uppercase" variant="outline">
          <a href={quoteHref} rel="noreferrer" target="_blank">
            <MessageCircle className="h-4 w-4" />
            {text.whatsapp}
          </a>
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">{text.disclaimer}</p>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/30 bg-black/92 p-3 shadow-[0_-18px_50px_rgba(0,0,0,.62)] backdrop-blur lg:hidden">
        <div className="container grid grid-cols-[1fr_auto] gap-3">
          <Button asChild className="h-12 text-sm shadow-[0_0_26px_rgba(226,0,15,.32)]">
            <a href={quoteHref} rel="noreferrer" target="_blank">
              {text.requestQuote}
            </a>
          </Button>
          <Button
            asChild
            className="h-12 w-12 border-[#25d366]/50 bg-[#25d366] p-0 text-white hover:bg-[#1fbd5a]"
            variant="outline"
          >
            <a aria-label={text.whatsapp} href={quoteHref} rel="noreferrer" target="_blank">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function recommendationLabel(stageName: StageDefinition["name"], text: VehicleCopy) {
  if (stageName === "Stage 1") {
    return text.recommendation.bestDaily;
  }

  if (stageName === "Stage 2") {
    return text.recommendation.performance;
  }

  return text.recommendation.custom;
}
