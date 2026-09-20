"use client";

import {CarFront, ChevronRight, Search, Star} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import type {Locale} from "@/i18n/routing";
import type {VehicleSelectorItem} from "@/data/catalog-selector";
import type {EstimateResolution} from "@/data/tuning-estimates-shared";
import {formatQuote, formatQuoteScope} from "@/data/pricing";
import {detailsActionLabel, focusConfigurator} from "@/lib/details-action";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ReferenceEstimateDetails} from "@/components/reference-estimate-details";

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
  initialBrands,
  initialPopularVehicles,
  locale,
  text
}: {
  className?: string;
  initialBrands: string[];
  initialPopularVehicles: VehicleSelectorItem[];
  locale: Locale;
  text: ManualSelectorCopy;
}) {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [engines, setEngines] = useState<VehicleSelectorItem[]>([]);
  const [searchResults, setSearchResults] = useState<VehicleSelectorItem[]>([]);
  const [referenceId, setReferenceId] = useState("");
  const [referenceRequest, setReferenceRequest] = useState(0);
  const [referenceEstimate, setReferenceEstimate] = useState<EstimateResolution>();
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [referenceError, setReferenceError] = useState(false);
  const referenceCopy = locale === "en"
    ? {loading: "Loading the catalog estimate…", error: "The estimate could not be loaded. Select the vehicle to try again.", conditional: "Conditional reference: confirm the engine generation before applying these estimated figures.", connect: "Pre-facelift 1.5 TDCi reference only. Confirm the engine generation; a 2018 registration alone does not establish TDCi or EcoBlue."}
    : locale === "pl"
      ? {loading: "Wczytywanie szacunków katalogowych…", error: "Nie udało się wczytać szacunków. Wybierz pojazd, aby spróbować ponownie.", conditional: "Warunkowy profil referencyjny: przed zastosowaniem szacunków potwierdź generację silnika.", connect: "Profil dotyczy wyłącznie 1.5 TDCi sprzed liftingu. Potwierdź generację silnika; rejestracja w 2018 r. nie rozstrzyga między TDCi a EcoBlue."}
      : {loading: "Catalogusindicatie laden…", error: "De indicatie kon niet worden geladen. Kies het voertuig om opnieuw te proberen.", conditional: "Voorwaardelijke referentie: bevestig de motorgeneratie voordat deze indicatieve waarden worden toegepast.", connect: "Alleen een referentie voor de 1.5 TDCi vóór de facelift. Bevestig de motorgeneratie; registratie in 2018 bepaalt niet of dit TDCi of EcoBlue is."};

  const filteredBrands = useMemo(() => {
    const normalized = brandFilter.toLowerCase();
    return initialBrands.filter((item) => item.toLowerCase().includes(normalized));
  }, [brandFilter, initialBrands]);
  const selectedVehicle = engines.find((vehicle) => vehicle.id === vehicleId);

  useEffect(() => {
    if (!referenceId) {
      setReferenceEstimate(undefined);
      setReferenceLoading(false);
      setReferenceError(false);
      return;
    }

    const controller = new AbortController();
    setReferenceLoading(true);
    setReferenceError(false);
    setReferenceEstimate(undefined);
    fetchSelector<{estimate: EstimateResolution}>(
      {mode: "reference", id: referenceId}, controller.signal
    )
      .then((data) => {
        setReferenceEstimate(data.estimate);
        setReferenceLoading(false);
        window.requestAnimationFrame(() => {
          focusConfigurator("manual-reference-result");
        });
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setReferenceLoading(false);
          setReferenceError(true);
        }
      });
    return () => controller.abort();
  }, [referenceId, referenceRequest]);

  useEffect(() => {
    const normalized = query.trim();

    if (normalized.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetchSelector<{vehicles: VehicleSelectorItem[]}>(
        {mode: "search", q: normalized},
        controller.signal
      )
        .then((data) => setSearchResults(data.vehicles))
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            setSearchResults([]);
          }
        });
    }, 180);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!brand) {
      setModels([]);
      return;
    }

    const controller = new AbortController();

    fetchSelector<{models: string[]}>(
      {mode: "models", brand},
      controller.signal
    )
      .then((data) => setModels(data.models))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setModels([]);
        }
      });

    return () => controller.abort();
  }, [brand]);

  useEffect(() => {
    if (!brand || !model) {
      setYears([]);
      return;
    }

    const controller = new AbortController();

    fetchSelector<{years: number[]}>(
      {mode: "years", brand, model},
      controller.signal
    )
      .then((data) => setYears(data.years))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setYears([]);
        }
      });

    return () => controller.abort();
  }, [brand, model]);

  useEffect(() => {
    if (!brand || !model || !year) {
      setEngines([]);
      return;
    }

    const controller = new AbortController();
    const params: Record<string, string> = {mode: "engines", brand, model, year};

    fetchSelector<{vehicles: VehicleSelectorItem[]}>(params, controller.signal)
      .then((data) => setEngines(data.vehicles))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setEngines([]);
        }
      });

    return () => controller.abort();
  }, [brand, model, year]);

  function resetAfterBrand(nextBrand: string) {
    setBrand(nextBrand);
    setModel("");
    setYear("");
    setVehicleId("");
    setModels([]);
    setYears([]);
    setEngines([]);
    setReferenceId("");
  }

  function detailHref(vehicle: VehicleSelectorItem) {
    return vehicle.pagePath ? sitePath("/" + locale + vehicle.pagePath) : undefined;
  }

  function selectReference(vehicle: VehicleSelectorItem) {
    if (referenceId === vehicle.id && referenceEstimate?.profile) {
      focusConfigurator("manual-reference-result");
      return;
    }
    setReferenceId(vehicle.id);
    setReferenceRequest((request) => request + 1);
  }

  const hasSearchQuery = query.trim().length >= 2;
  const visibleVehicles = hasSearchQuery
    ? searchResults
    : initialPopularVehicles;
  const brandOptions =
    brand && !filteredBrands.includes(brand) ? [brand, ...filteredBrands] : filteredBrands;

  return (
    <section
      className={cn(
        "panel-edge relative mx-auto w-full max-w-[920px] scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,rgba(14,14,14,.96),rgba(5,5,5,.9)_54%,rgba(227,6,19,.13))] p-4 shadow-[0_24px_90px_rgba(0,0,0,.48)] ring-1 ring-white/5 sm:p-5",
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
            <h2 className="racing-title text-2xl leading-tight text-white md:text-[1.75rem]">
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

        <div className="grid min-w-0 grid-cols-1 gap-4">
          <div className="rounded-lg border border-white/10 bg-black/45 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-normal text-primary">
              <Star className="h-4 w-4 fill-primary" />
              {text.popular}
            </div>
            <div className="grid gap-2">
              {visibleVehicles.map((vehicle) => { const ResultAction = vehicle.pagePath ? "a" : "button"; return (
                <ResultAction
                className="group grid w-full gap-2 rounded-[3px] text-left border border-white/10 bg-white/[0.035] p-3 transition hover:border-primary/50 hover:bg-primary/10"
                  href={detailHref(vehicle)}
                  type={vehicle.pagePath ? undefined : "button"}
                  data-testid="manual-result-action"
                  key={vehicle.id}
                  onClick={!vehicle.pagePath ? (event) => {
                    event.preventDefault();
                    selectReference(vehicle);
                  } : undefined}
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
                    <span className="min-w-0 break-words">{formatQuote(vehicle.quote, locale)}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                  </span>
                  {formatQuoteScope(vehicle.quote, locale) ? (
                    <span className="text-xs leading-5 text-muted-foreground">{formatQuoteScope(vehicle.quote, locale)}</span>
                  ) : null}
                </ResultAction>
              ); })}
              {visibleVehicles.length === 0 && hasSearchQuery ? (
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
                  setYears([]);
                  setEngines([]);
                  setReferenceId("");
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
                  setEngines([]);
                  setReferenceId("");
                }}
                options={years.map(String)}
                placeholder={model ? text.selectYear : text.selectModel}
                value={year}
              />
              <SelectBox
                disabled={!year}
                label={text.engine}
                onChange={(value) => {
                  setVehicleId(value);

                  if (value) {
                    const vehicle = engines.find((item) => item.id === value);
                    if (vehicle && !vehicle.pagePath) {
                      selectReference(vehicle);
                    } else if (vehicle?.pagePath) {
                      window.location.href = detailHref(vehicle)!;
                    }
                  } else {
                    setReferenceId("");
                  }
                }}
                options={engines.map((vehicle) => ({
                  label: `${vehicle.engine} · ${vehicle.version}`,
                  value: vehicle.id
                }))}
                placeholder={year ? text.selectEngine : model ? text.selectYear : text.selectModel}
                value={vehicleId}
              />
            </div>

            {filteredBrands.length === 0 ? (
              <p className="mt-3 rounded-lg border border-white/10 bg-black/45 p-3 text-sm text-muted-foreground">
                {text.noResults}
              </p>
            ) : null}

            <div className="mt-4 rounded-[3px] border border-primary/20 bg-[linear-gradient(135deg,rgba(227,6,19,.14),rgba(255,255,255,.035))] p-4">
              {selectedVehicle ? (
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="text-xl font-black">
                      {selectedVehicle.brand} {selectedVehicle.model}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedVehicle.version} · {selectedVehicle.engine} ·{" "}
                      {{nl: "ECU-controle vóór uitvoering", en: "ECU check before work", pl: "Kontrola ECU przed realizacją"}[locale]}
                    </p>
                  </div>
                  <Button asChild className="h-auto min-h-10 max-w-full whitespace-normal rounded-[3px] py-2 text-center font-black uppercase shadow-[0_0_28px_rgba(227,6,19,.32)]">
                    {selectedVehicle.pagePath ? <a href={detailHref(selectedVehicle)}>{detailsActionLabel({kind: "vehicle-page", path: selectedVehicle.pagePath}, locale)}<ChevronRight className="h-4 w-4" /></a>
                      : <button type="button" onClick={() => selectReference(selectedVehicle)}>{detailsActionLabel({kind: "inline-configurator", target: "rdw-configurator"}, locale)}<ChevronRight className="h-4 w-4" /></button>}

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
        {referenceId ? (
          <div className="min-w-0 scroll-mt-32 space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-primary" id="manual-reference-result" tabIndex={-1} aria-label={detailsActionLabel({kind: "inline-configurator", target: "rdw-configurator"}, locale)} aria-live="polite">
            {referenceLoading ? <p className="text-sm text-muted-foreground">{referenceCopy.loading}</p> : null}
            {referenceError ? <p className="text-sm text-muted-foreground">{referenceCopy.error}</p> : null}
            {referenceEstimate?.status === "conditional" && !referenceEstimate.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW") ? (
              <p className="rounded-[3px] border border-primary/20 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">
                {referenceCopy.conditional}
              </p>
            ) : null}
            {referenceEstimate?.profile ? (
              <ReferenceEstimateDetails key={referenceEstimate.profile.id} profile={referenceEstimate.profile} locale={locale} />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

async function fetchSelector<T>(
  params: Record<string, string>,
  signal: AbortSignal
) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${sitePath("/api/catalog-selector")}?${query}`, {
    signal
  });

  if (!response.ok) {
    throw new Error("Catalog selector request failed.");
  }

  return (await response.json()) as T;
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
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        className="h-12 w-full rounded-[3px] border border-white/10 bg-black/65 px-3 text-sm text-white outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-45"
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
