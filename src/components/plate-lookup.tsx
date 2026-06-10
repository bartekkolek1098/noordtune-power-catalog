"use client";

import {AnimatePresence, motion} from "framer-motion";
import {
  AlertTriangle,
  Car,
  Check,
  ChevronRight,
  Loader2,
  Search,
  ShieldCheck
} from "lucide-react";
import {useMemo, useState} from "react";
import type {RdwLookupResult} from "@/lib/rdw";
import {serviceOptions, type StageDefinition} from "@/data/catalog";
import type {Locale} from "@/i18n/routing";
import {localizeServiceOption} from "@/lib/service-copy";
import {formatCurrency} from "@/lib/utils";
import {sitePath} from "@/lib/site-path";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {PowerChart} from "@/components/power-chart";

type LookupCopy = {
  label: string;
  placeholder: string;
  submit: string;
  loading: string;
  notFound: string;
  invalid: string;
  disclaimer: string;
  source: string;
  detected: string;
  catalogMatch: string;
  estimate: string;
  stage: string;
  stock: string;
  power: string;
  torque: string;
  options: string;
  viewDetails: string;
};

type LookupError = {
  code: string;
  message: string;
};

export function PlateLookup({
  locale,
  text
}: {
  locale: Locale;
  text: LookupCopy;
}) {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<RdwLookupResult | null>(null);
  const [error, setError] = useState<LookupError | null>(null);
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const match = result?.tuningMatch?.variant;
  const stages = useMemo(() => {
    if (match) {
      return match.stages;
    }

    const detectedPower = result?.vehicle.engine.powerHp ?? 150;
    return createIndicativeStages(detectedPower, locale);
  }, [locale, match, result]);

  const availableOptions = useMemo(() => {
    if (match) {
      return serviceOptions
        .filter((option) => match.options.includes(option.id))
        .map((option) => localizeServiceOption(option, locale));
    }

    return serviceOptions.map((option) => localizeServiceOption(option, locale));
  }, [locale, match]);

  const selectedStage = stages[stageIndex] ?? stages[0];
  const localeCode = locale === "en" ? "en-US" : locale === "pl" ? "pl-PL" : "nl-NL";
  const powerUnit = locale === "en" ? "hp" : locale === "pl" ? "KM" : "pk";
  const localCopy = lookupRuntimeCopy[locale];
  const optionsTotal = selectedOptions.reduce((total, id) => {
    const option = serviceOptions.find((item) => item.id === id);
    return total + (option?.price ?? 0);
  }, 0);
  const total = (selectedStage?.price ?? 0) + optionsTotal;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedOptions([]);
    setStageIndex(0);

    try {
      const response = await fetch(sitePath("/api/rdw-lookup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({kenteken: plate})
      });
      const payload = await response.json();

      if (!response.ok) {
        const code = payload?.error?.code ?? "LOOKUP_ERROR";
        setError({
          code,
          message: code === "NOT_FOUND" ? text.notFound : text.invalid
        });
        return;
      }

      setResult(payload as RdwLookupResult);
    } catch {
      setError({
        code: "NETWORK_ERROR",
        message: localCopy.networkError
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="carbon-panel border-primary/20 shadow-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Car className="h-6 w-6 text-primary" />
              {text.label}
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{text.source}</p>
          </div>
          <Badge className="border-primary/30 bg-primary/10 text-primary">
            RDW
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center rounded-l-lg bg-[#164394] text-xs font-black text-white">
                NL
              </div>
              <Input
                aria-label={text.label}
                className="plate-shadow h-14 border-0 bg-[#ffd000] pl-12 text-center text-2xl font-black uppercase tracking-[0.18em] text-black placeholder:text-black/35 focus-visible:ring-primary"
                inputMode="text"
                maxLength={10}
                onChange={(event) => setPlate(event.target.value)}
                placeholder={text.placeholder}
                value={plate}
              />
            </div>
            <Button className="h-14 px-6" disabled={loading} type="submit">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? text.loading : text.submit}
            </Button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              animate={{opacity: 1, y: 0}}
              className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-red-100"
              exit={{opacity: 0, y: -8}}
              initial={{opacity: 0, y: 8}}
            >
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{error.message}</span>
              </div>
            </motion.div>
          ) : null}

          {result ? (
            <motion.div
              animate={{opacity: 1, y: 0}}
              className="mt-6 space-y-5"
              exit={{opacity: 0, y: -8}}
              initial={{opacity: 0, y: 8}}
            >
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {text.detected}
                  </div>
                  <Badge variant={result.cached ? "secondary" : "default"}>
                    {result.cached ? localCopy.cacheHit : localCopy.cacheMiss}
                  </Badge>
                </div>
                <div className="text-2xl font-black">
                  {result.vehicle.make} {result.vehicle.model}
                </div>
                <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <span>{result.vehicle.fuel ?? localCopy.unknownFuel}</span>
                  <span>
                    {result.vehicle.engine.displacementCc ?? "-"} cc ·{" "}
                    {result.vehicle.engine.powerHp ?? "-"} {powerUnit}
                  </span>
                  <span>
                    APK {result.vehicle.registration.apkExpiry ?? "-"}
                  </span>
                  <span>Type {result.vehicle.variant ?? result.vehicle.type ?? "-"}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    {text.catalogMatch}
                  </div>
                  {match ? (
                    <>
                      <div className="font-bold">
                        {match.brand} {match.model}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {match.engine} · {match.ecuType}
                      </p>
                      <Button asChild className="mt-4" variant="outline">
                        <a href={sitePath(`/${locale}/vehicles/${match.id}`)}>
                          {text.viewDetails}
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {localCopy.exactMatch}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {text.estimate}
                  </div>
                  <div className="mt-2 text-3xl font-black">
                    {formatCurrency(total, localeCode)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <PowerChart
                  powerUnit={powerUnit}
                  stages={stages}
                  stockPower={match?.stockPowerHp ?? result.vehicle.engine.powerHp ?? 150}
                  stockLabel={text.stock}
                  stockTorque={match?.stockTorqueNm ?? estimateStockTorque(result)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
                <div className="overflow-hidden rounded-lg border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.04] text-left text-muted-foreground">
                      <tr>
                        <th className="px-3 py-3">{text.stage}</th>
                        <th className="px-3 py-3">{text.power}</th>
                        <th className="px-3 py-3">{text.torque}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stages.map((stage, index) => (
                        <tr
                          className="cursor-pointer border-t border-white/10 hover:bg-white/[0.04]"
                          key={stage.name}
                          onClick={() => setStageIndex(index)}
                        >
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                  stageIndex === index
                                    ? "border-primary bg-primary text-black"
                                    : "border-white/20"
                                }`}
                              >
                                {stageIndex === index ? (
                                  <Check className="h-3 w-3" />
                                ) : null}
                              </span>
                              {stage.name}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            {stage.powerHp} {powerUnit}
                          </td>
                          <td className="px-3 py-3">{stage.torqueNm} Nm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-white/10 p-4">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {text.options}
                  </div>
                  <div className="space-y-2">
                    {availableOptions.map((option) => (
                      <label
                        className="flex cursor-pointer items-start justify-between gap-3 rounded-md bg-white/[0.04] p-3 text-sm"
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
                            {formatCurrency(option.price, localeCode)}
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
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {text.disclaimer}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

const lookupRuntimeCopy: Record<
  Locale,
  {
    cacheHit: string;
    cacheMiss: string;
    exactMatch: string;
    networkError: string;
    unknownFuel: string;
    indicativeRequirement: string;
    hardwareRequirement: string;
    customRequirement: string;
    stage1Items: string[];
    stage2Items: string[];
    stage3Items: string[];
  }
> = {
  nl: {
    cacheHit: "cache hit",
    cacheMiss: "nieuwe RDW check",
    exactMatch: "NoordTune bevestigt de exacte ECU en motorvariant in de offerte.",
    networkError: "RDW lookup kon niet worden geladen.",
    unknownFuel: "Brandstof onbekend",
    indicativeRequirement: "Catalogusmatch vereist",
    hardwareRequirement: "Hardwarecontrole vereist",
    customRequirement: "Maatwerk setup",
    stage1Items: [
      "Indicatieve Stage 1 calibratie",
      "ECU en motorvariant worden eerst bevestigd",
      "Diagnose voor veilige afstemming"
    ],
    stage2Items: [
      "Indicatieve Stage 2 calibratie",
      "Hardware- en onderhoudscontrole",
      "Logcontrole onder belasting"
    ],
    stage3Items: [
      "Indicatieve maatwerk setup",
      "Turbo/brandstofcontrole",
      "Offerte op basis van exacte voertuigconfiguratie"
    ]
  },
  en: {
    cacheHit: "cache hit",
    cacheMiss: "fresh RDW check",
    exactMatch: "NoordTune confirms the exact ECU and engine variant in the quote.",
    networkError: "RDW lookup could not be loaded.",
    unknownFuel: "Fuel unknown",
    indicativeRequirement: "Catalog match required",
    hardwareRequirement: "Hardware check required",
    customRequirement: "Custom setup",
    stage1Items: [
      "Indicative Stage 1 calibration",
      "ECU and engine variant confirmed first",
      "Diagnostics for safe calibration"
    ],
    stage2Items: [
      "Indicative Stage 2 calibration",
      "Hardware and maintenance check",
      "Load logging check"
    ],
    stage3Items: [
      "Indicative custom setup",
      "Turbo/fuel system check",
      "Quote based on exact vehicle configuration"
    ]
  },
  pl: {
    cacheHit: "z cache",
    cacheMiss: "nowe sprawdzenie RDW",
    exactMatch: "NoordTune potwierdzi dokładny ECU i wariant silnika w wycenie.",
    networkError: "Nie udało się załadować wyszukiwania RDW.",
    unknownFuel: "Paliwo nieznane",
    indicativeRequirement: "Wymagane dopasowanie katalogu",
    hardwareRequirement: "Wymagana kontrola hardware",
    customRequirement: "Indywidualna konfiguracja",
    stage1Items: [
      "Orientacyjna kalibracja Stage 1",
      "Najpierw potwierdzamy ECU i wariant silnika",
      "Diagnostyka dla bezpiecznego strojenia"
    ],
    stage2Items: [
      "Orientacyjna kalibracja Stage 2",
      "Kontrola hardware i stanu technicznego",
      "Logi pod obciążeniem"
    ],
    stage3Items: [
      "Orientacyjna konfiguracja indywidualna",
      "Kontrola turbo i układu paliwowego",
      "Oferta na podstawie dokładnej konfiguracji auta"
    ]
  }
};

function createIndicativeStages(powerHp: number, locale: Locale): StageDefinition[] {
  const copy = lookupRuntimeCopy[locale];

  return [
    {
      name: "Stage 1",
      powerHp: Math.round(powerHp * 1.18),
      torqueNm: Math.round(powerHp * 2.7),
      price: 269,
      requirements: copy.indicativeRequirement,
      packageItems: copy.stage1Items
    },
    {
      name: "Stage 2",
      powerHp: Math.round(powerHp * 1.32),
      torqueNm: Math.round(powerHp * 3.05),
      price: 399,
      requirements: copy.hardwareRequirement,
      packageItems: copy.stage2Items
    },
    {
      name: "Stage 3+",
      powerHp: Math.round(powerHp * 1.58),
      torqueNm: Math.round(powerHp * 3.45),
      price: 749,
      requirements: copy.customRequirement,
      packageItems: copy.stage3Items
    }
  ];
}

function estimateStockTorque(result: RdwLookupResult) {
  const power = result.vehicle.engine.powerHp ?? 150;
  const fuel = result.vehicle.fuel?.toLowerCase() ?? "";

  if (fuel.includes("diesel")) {
    return Math.round(power * 2.15);
  }

  return Math.round(power * 1.55);
}
