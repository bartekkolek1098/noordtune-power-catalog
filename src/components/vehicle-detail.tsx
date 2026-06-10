"use client";

import {Check, Gauge, MessageCircle} from "lucide-react";
import {useMemo, useState} from "react";
import type {EngineVariant, StageDefinition} from "@/data/catalog";
import {serviceOptions} from "@/data/catalog";
import type {Locale} from "@/i18n/routing";
import {localizeServiceOption} from "@/lib/service-copy";
import {formatCurrency} from "@/lib/utils";
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
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
            <div className="rounded-lg border border-white/10 bg-black/45 p-4" key={item.label}>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {item.label}
              </div>
              <div className="mt-2 text-2xl font-black">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/45 p-4">
          <PowerChart
            powerUnit={powerUnit}
            stages={vehicle.stages}
            stockPower={vehicle.stockPowerHp}
            stockLabel={text.stock}
            stockTorque={vehicle.stockTorqueNm}
          />
        </div>

        <div className="rounded-lg border border-white/10 bg-black/45 p-5">
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
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
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

      <aside className="space-y-4 rounded-lg border border-primary/30 bg-black/70 p-5 shadow-[0_0_70px_rgba(226,0,15,.15)]">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            {text.calculator}
          </div>
          <div className="mt-2 text-4xl font-black">
            {text.fromPrice} {formatCurrency(total, localeCode)}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {text.selectStage}
          </div>
          <div className="grid gap-2">
            {vehicle.stages.map((stage, index) => (
              <button
                className={`rounded-lg border p-3 text-left transition ${
                  stageIndex === index
                    ? "border-primary bg-primary/15"
                    : "border-white/10 bg-white/[0.035] hover:border-primary/50"
                }`}
                key={stage.name}
                onClick={() => setStageIndex(index)}
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
                className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm"
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
                    onChange={(event) => {
                      setSelectedOptions((current) =>
                        event.target.checked
                          ? [...current, option.id]
                          : current.filter((id) => id !== option.id)
                      );
                    }}
                    type="checkbox"
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button asChild className="h-12 w-full">
          <a href="https://wa.me/31685759600">
            <MessageCircle className="h-4 w-4" />
            {text.whatsapp}
          </a>
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">{text.disclaimer}</p>
      </aside>
    </div>
  );
}
