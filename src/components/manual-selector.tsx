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
  const searchResults = useMemo(() => searchVehicles(query).slice(0, 6), [query]);
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
    : vehicleDatabase.filter((vehicle) => vehicle.popular).slice(0, 6);

  return (
    <section
      className={cn(
        "scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.035] p-4 md:p-5",
        className
      )}
      id="manual-selector"
    >
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div>
            <Badge className="mb-3 w-fit border-primary/30 bg-primary/15 text-primary">
              {text.manualPath}
            </Badge>
            <h2 className="text-2xl font-black uppercase italic tracking-normal text-white md:text-3xl">
              {text.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {text.subtitle} {text.rdwPrimary}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold uppercase text-muted-foreground">
              {text.quickSearch}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                className="h-12 border-primary/20 bg-black/60 pl-10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.quickPlaceholder}
                value={query}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-normal text-primary">
              <Star className="h-4 w-4 fill-primary" />
              {text.popular}
            </div>
            {visibleVehicles.map((vehicle) => (
              <a
                className="group grid gap-3 rounded-lg border border-white/10 bg-black/45 p-3 transition hover:border-primary/50 hover:bg-primary/10 sm:grid-cols-[1fr_auto]"
                href={detailHref(vehicle.id)}
                key={vehicle.id}
              >
                <span>
                  <span className="flex items-center gap-2 font-bold text-white">
                    {vehicle.popular ? (
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    ) : (
                      <CarFront className="h-4 w-4 text-primary" />
                    )}
                    {vehicle.brand} {vehicle.model}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {vehicle.version} · {vehicle.engine} · {vehicle.yearRange}
                  </span>
                </span>
                <span className="flex items-center justify-between gap-4 text-sm text-primary sm:justify-end">
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

        <div className="grid gap-4 rounded-lg border border-primary/20 bg-black/35 p-4">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase text-muted-foreground">
              {text.brand}
            </label>
            <Input
              className="mb-2 h-11 border-white/10 bg-black/55"
              onChange={(event) => setBrandFilter(event.target.value)}
              placeholder={text.brandSearch}
              value={brandFilter}
            />
            <div className="grid max-h-44 gap-2 overflow-auto rounded-lg border border-white/10 bg-black/35 p-2 sm:grid-cols-2">
              {filteredBrands.map((item) => (
                <button
                  className={`rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                    item === brand
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.045] hover:bg-primary/15"
                  }`}
                  key={item}
                  onClick={() => resetAfterBrand(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
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

          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
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
                <Button asChild>
                  <a href={detailHref(selectedVehicle.id)}>
                    {text.choose}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {text.selectBrand} → {text.selectModel} → {text.selectYear} →{" "}
                {text.selectEngine}
              </p>
            )}
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
