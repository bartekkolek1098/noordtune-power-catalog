"use client";

import {CarFront, ChevronRight, Search, Star} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import type {Locale} from "@/i18n/routing";
import {
  getBrands,
  getModelsForBrand,
  getVehicleById,
  getYearsForModel,
  searchVehicles,
  vehicleDatabase
} from "@/data/catalog";
import {sitePath} from "@/lib/site-path";
import {cn, formatCurrency} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";

type ManualSelectorCopy = {
  title: string;
  subtitle: string;
  quickSearch: string;
  quickPlaceholder: string;
  popular: string;
  brand: string;
  brandSearch: string;
  model: string;
  year: string;
  engine: string;
  choose: string;
  selectBrand: string;
  selectModel: string;
  selectYear: string;
  selectEngine: string;
  noResults: string;
  manualPath: string;
  rdwPrimary: string;
  from: string;
};

export function ManualSelector({
  className,
  locale,
  text
}: {
  className?: string;
  locale: Locale;
  text: ManualSelectorCopy;
}) {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const brands = useMemo(() => getBrands(), []);
  const filteredBrands = useMemo(() => {
    const normalized = brandFilter.toLowerCase();
    return brands.filter((item) => item.toLowerCase().includes(normalized));
  }, [brandFilter, brands]);
  const models = useMemo(() => (brand ? getModelsForBrand(brand) : []), [brand]);
  const years = useMemo(
    () => (brand && model ? getYearsForModel(brand, model) : []),
    [brand, model]
  );
  const engines = useMemo(
    () =>
      vehicleDatabase.filter((vehicle) => {
        const yearNumber = Number(year);
        return (
          vehicle.brand === brand &&
          vehicle.model === model &&
          (!year || vehicle.years.includes(yearNumber))
        );
      }),
    [brand, model, year]
  );
  const searchResults = useMemo(() => searchVehicles(query).slice(0, 4), [query]);
  const selectedVehicle = getVehicleById(vehicleId);

  useEffect(() => {
    const section = document.getElementById("manual-selector");
    const manualLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="#manual-selector"]')
    );
    const heroLink = manualLinks.find((link) => {
      const grid = link.closest("div.grid");
      return grid?.querySelectorAll('a[href="#manual-selector"]').length === 4;
    });
    const heroPanel = heroLink?.closest("div.grid")?.parentElement;

    if (section && heroPanel && !heroPanel.contains(section)) {
      heroPanel.replaceWith(section);
    }
  }, []);

  function resetAfterBrand(nextBrand: string) {
    setBrand(nextBrand);
    setModel("");
    setYear("");
    setVehicleId("");
  }

  function detailHref(id: string) {
    return sitePath(`/${locale}/vehicles/${id}`);
  }

  const visibleVehicles = query
    ? searchResults
    : vehicleDatabase.filter((vehicle) => vehicle.popular).slice(0, 4);
  const brandOptions =
    brand && !filteredBrands.includes(brand) ? [brand, ...filteredBrands] : filteredBrands;

  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-[920px] scroll-mt-24 overflow-hidden rounded-xl border border-primary/25 bg-[linear-gradient(135deg,rgba(14,14,14,.96),rgba(5,5,5,.9)_54%,rgba(226,0,15,.13))] p-4 shadow-[0_24px_90px_rgba(0,0,0,.48)] ring-1 ring-white/5 sm:p-5",
        className
      )}
      id="manual-selector"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-28 w-72 rotate-[-16deg] bg-[linear-gradient(90deg,transparent,rgba(226,0,15,.38),transparent)] blur-sm" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(226,0,15,.75),transparent)]" />

      <div className="relative space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge className="mb-3 w-fit border-primary/35 bg-primary/15 text-primary">
              {text.manualPath}
            </Badge>
            <h2 className="text-2xl font-black uppercase italic leading-tight tracking-normal text-white md:text-[1.75rem]">
              {text.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {text.subtitle} {text.rdwPrimary}
            </p>
          </div>
          <div className="hidden rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-xs font-black uppercase text-primary sm:block">
            RDW + Manual
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/55 p-3 sm:p-4">
          <label className="mb-2 block text-xs font-black uppercase tracking-normal text-slate-300">
            {text.quickSearch}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              className="h-12 border-primary/25 bg-black/70 pl-10 text-sm font-semibold text-white shadow-[inset_0_0_24px_rgba(0,0,0,.32)] placeholder:text-slate-500 focus-visible:ring-primary"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.quickPlaceholder}
              value={query}
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-white/10 bg-black/45 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-normal text-primary">
              <Star className="h-4 w-4 fill-primary" />
              {text.popular}
            </div>
            <div className="grid gap-2">
              {visibleVehicles.map((vehicle) => (
                <a
                  className="group grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-primary/50 hover:bg-primary/10"
                  href={detailHref(vehicle.id)}
                  key={vehicle.id}
                >
                  <span className="flex items-center gap-2 font-bold leading-tight text-white">
                    {vehicle.popular ? (
                      <Star className="h-4 w-4 shrink-0 fill-primary text-primary" />
                    ) : (
                      <CarFront className="h-4 w-4 shrink-0 text-primary" />
                    )}
                    {vehicle.brand} {vehicle.model}
                  </span>
                  <span className="text-xs leading-5 text-muted-foreground">
                    {vehicle.version} · {vehicle.engine} · {vehicle.yearRange}
                  </span>
                  <span className="flex items-center justify-between gap-3 text-sm font-black text-primary">
                    {text.from}{" "}
                    {formatCurrency(
                      vehicle.stages[0].price,
                      locale === "en" ? "en-US" : locale === "pl" ? "pl-PL" : "nl-NL"
                    )}
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
              {visibleVehicles.length === 0 && query ? (
                <p className="rounded-lg border border-white/10 bg-black/45 p-3 text-sm text-muted-foreground">
                  {text.noResults}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-black/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] sm:p-4">
            <label className="mb-2 block text-xs font-black uppercase tracking-normal text-slate-300">
              {text.brandSearch}
            </label>
            <Input
              className="mb-3 h-11 border-white/10 bg-black/70 text-sm font-semibold focus-visible:ring-primary"
              onChange={(event) => setBrandFilter(event.target.value)}
              placeholder={text.brandSearch}
              value={brandFilter}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectBox
                label={text.brand}
                onChange={(value) => resetAfterBrand(value)}
                options={brandOptions}
                placeholder={text.selectBrand}
                value={brand}
              />
              <SelectBox
                disabled={!brand}
                label={text.model}
                onChange={(value) => {
                  setModel(value);
                  setYear("");
                  setVehicleId("");
                }}
                options={models}
                placeholder={brand ? text.selectModel : text.selectBrand}
                value={model}
              />
              <SelectBox
                disabled={!model}
                label={text.year}
                onChange={(value) => {
                  setYear(value);
                  setVehicleId("");
                }}
                options={years.map(String)}
                placeholder={model ? text.selectYear : text.selectModel}
                value={year}
              />
              <SelectBox
                disabled={!model}
                label={text.engine}
                onChange={(value) => {
                  setVehicleId(value);

                  if (value) {
                    window.location.href = detailHref(value);
                  }
                }}
                options={engines.map((vehicle) => ({
                  label: `${vehicle.engine} · ${vehicle.version}`,
                  value: vehicle.id
                }))}
                placeholder={model ? text.selectEngine : text.selectModel}
                value={vehicleId}
              />
            </div>

            {filteredBrands.length === 0 ? (
              <p className="mt-3 rounded-lg border border-white/10 bg-black/45 p-3 text-sm text-muted-foreground">
                {text.noResults}
              </p>
            ) : null}

            <div className="mt-4 rounded-lg border border-primary/20 bg-[linear-gradient(135deg,rgba(226,0,15,.14),rgba(255,255,255,.035))] p-4">
              {selectedVehicle ? (
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="text-xl font-black">
                      {selectedVehicle.brand} {selectedVehicle.model}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedVehicle.version} · {selectedVehicle.engine} ·{" "}
                      {selectedVehicle.ecuType}
                    </p>
                  </div>
                  <Button asChild className="shadow-[0_0_28px_rgba(226,0,15,.32)]">
                    <a href={detailHref(selectedVehicle.id)}>
                      {text.choose}
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  {text.selectBrand} → {text.selectModel} → {text.selectYear} →{" "}
                  {text.selectEngine}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <FloatingWhatsappButton locale={locale} />
    </section>
  );
}

function SelectBox({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  value
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: Array<string | {label: string; value: string}>;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        className="h-12 w-full rounded-lg border border-white/10 bg-black/65 px-3 text-sm text-white outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-45"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
