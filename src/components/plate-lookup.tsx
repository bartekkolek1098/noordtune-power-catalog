"use client";

import {AnimatePresence, motion} from "framer-motion";
import {
  AlertTriangle,
  Car,
  Check,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench
} from "lucide-react";
import {useMemo, useState} from "react";
import type {RdwTuningLookupResult} from "@/lib/rdw-types";
import {serviceOptions, type StageDefinition} from "@/data/catalog-shared";
import {
  getPublicStagePrice,
  getPublicStagePricingTier
} from "@/data/pricing";
import type {Locale} from "@/i18n/routing";
import {localizeServiceOption} from "@/lib/service-copy";
import {formatCurrency} from "@/lib/utils";
import {sitePath} from "@/lib/site-path";
import {createLookupQuoteMessage, whatsappHref} from "@/lib/whatsapp";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {PowerChart} from "@/components/power-chart";
import {
  CatalogVerificationNotice,
  type CatalogVerificationText
} from "@/components/catalog-verification-notice";

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
  fromPrice: string;
  stage: string;
  stock: string;
  power: string;
  torque: string;
  options: string;
  viewDetails: string;
  quoteForCar: string;
  verification: CatalogVerificationText & {
    success: string;
  };
  recommendation: {
    eyebrow: string;
    bestDaily: string;
    dailyDescription: string;
    stage1Benefit: string;
    diagnosticBenefit: string;
    gearboxBenefit: string;
    selectStage1: string;
    stage1Selected: string;
    recommendedAddOn: string;
    addGearbox: string;
    removeGearbox: string;
    manualBadge: string;
    manualTitle: string;
    manualDescription: string;
    manualDetected: string;
    manualEcu: string;
    manualStage: string;
    manualQuote: string;
    nextStep: string;
    nextStepDescription: string;
    manualCta: string;
    indicativeEstimate: string;
  };
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
  const [result, setResult] = useState<RdwTuningLookupResult | null>(null);
  const [error, setError] = useState<LookupError | null>(null);
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [recommendedPackageUsed, setRecommendedPackageUsed] = useState(false);

  const match = result?.tuningMatch?.variant;
  const stages = useMemo(() => {
    if (match) {
      return match.stages.map((stage) => ({
        ...stage,
        sourcePrice: stage.sourcePrice ?? stage.price,
        price: getPublicStagePrice(match, stage),
        pricingTier: getPublicStagePricingTier(match, stage) ?? stage.pricingTier
      }));
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
  const stage1Index = stages.findIndex((stage) => stage.name === "Stage 1");
  const gearboxOption = match && match.gearbox !== "Manual"
    ? availableOptions.find((option) => option.id === "gearbox")
    : undefined;
  const localeCode = locale === "en" ? "en-US" : locale === "pl" ? "pl-PL" : "nl-NL";
  const powerUnit = locale === "en" ? "hp" : locale === "pl" ? "KM" : "pk";
  const localCopy = lookupRuntimeCopy[locale];
  const quoteVehicleLabel = match
    ? `${match.brand} ${match.model} ${match.engine}`
    : result
      ? `${result.vehicle.make} ${result.vehicle.model}`.trim()
      : undefined;
  const optionsTotal = selectedOptions.reduce((total, id) => {
    const option = serviceOptions.find((item) => item.id === id);
    return total + (option?.price ?? 0);
  }, 0);
  const total = (selectedStage?.price ?? 0) + optionsTotal;
  const selectedOptionLabels = availableOptions
    .filter((option) => selectedOptions.includes(option.id))
    .map((option) => option.name);
  const recommendedPackage =
    recommendedPackageUsed && selectedStage?.name === "Stage 1"
      ? `${text.recommendation.bestDaily} · Stage 1`
      : undefined;
  const lookupQuoteMessage =
    result && selectedStage
      ? createLookupQuoteMessage({
          displacementCc: result.vehicle.engine.displacementCc,
          exactMatch: Boolean(match),
          fuel: result.vehicle.fuel,
          locale,
          options: selectedOptionLabels,
          plate: result.vehicle.plate,
          price: formatCurrency(total, localeCode),
          recommendedPackage,
          stage: selectedStage.name,
          vehicle: quoteVehicleLabel ?? `${result.vehicle.make} ${result.vehicle.model}`.trim(),
          vehiclePower:
            result.vehicle.engine.powerHp !== null &&
            result.vehicle.engine.powerHp !== undefined
              ? `${result.vehicle.engine.powerHp} ${powerUnit}`
              : undefined
        })
      : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedOptions([]);
    setStageIndex(0);
    setRecommendedPackageUsed(false);

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

      setResult(payload as RdwTuningLookupResult);
    } catch {
      setError({
        code: "NETWORK_ERROR",
        message: localCopy.networkError
      });
    } finally {
      setLoading(false);
    }
  }

  function selectStage(index: number, recommended = false) {
    setStageIndex(index);
    setRecommendedPackageUsed(recommended);
  }

  function toggleOption(id: string) {
    setSelectedOptions((current) =>
      current.includes(id)
        ? current.filter((optionId) => optionId !== id)
        : [...current, id]
    );
  }

  return (
    <Card className="panel-edge min-w-0 carbon-panel border-primary/20 shadow-glow">
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
            <Button className="h-14 rounded-[3px] px-6 font-black uppercase" disabled={loading} type="submit">
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
              data-testid="rdw-result"
              exit={{opacity: 0, y: -8}}
              initial={{opacity: 0, y: 8}}
            >
              <div className="rounded-[3px] border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">
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
                {match ? (
                  <div className="rounded-[3px] border border-emerald-400/25 bg-[linear-gradient(145deg,rgba(16,185,129,.08),rgba(0,0,0,.34))] p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="rounded-[3px] border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
                        <Check className="mr-1 h-3.5 w-3.5" />
                        {text.verification.success}
                      </Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {text.catalogMatch}
                      </span>
                    </div>
                    <div className="font-bold">
                      {match.brand} {match.model}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {match.engine} · {match.ecuType}
                    </p>
                    {result.tuningMatch?.publicVehicleId ? (
                      <Button asChild className="mt-4 rounded-[3px]" variant="outline">
                        <a
                          data-testid="rdw-open-published-tuning"
                          href={sitePath(`/${locale}/vehicles/${result.tuningMatch.publicVehicleId}`)}
                        >
                          {localCopy.openTuningPage}
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        className="mt-4 rounded-[3px]"
                        data-testid="rdw-open-inline-tuning"
                        onClick={() => document.getElementById("rdw-inline-tuning")?.scrollIntoView({behavior: "smooth", block: "start"})}
                        type="button"
                        variant="outline"
                      >
                        {localCopy.viewInlineDetails}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className="panel-edge overflow-hidden border-primary/35 p-5"
                    data-testid="rdw-manual-review"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="border-primary/40 bg-primary/15 text-primary">
                        {text.recommendation.manualBadge}
                      </Badge>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        {text.recommendation.nextStep}
                      </span>
                    </div>
                    <h3 className="racing-title mt-4 text-2xl leading-tight text-white">
                      {text.recommendation.manualTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {text.recommendation.manualDescription}
                    </p>
                    <ul className="mt-5 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                      {[
                        text.recommendation.manualDetected,
                        text.recommendation.manualEcu,
                        text.recommendation.manualStage,
                        text.recommendation.manualQuote
                      ].map((item) => (
                        <li className="flex gap-2" key={item}>
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 rounded-[3px] border border-white/10 bg-black/35 p-3 text-sm leading-6 text-slate-300">
                      <span className="font-black text-white">
                        {text.recommendation.nextStep}:
                      </span>{" "}
                      {text.recommendation.nextStepDescription}
                    </div>
                    <Button
                      className="mt-4 rounded-[3px]"
                      data-testid="rdw-open-inline-tuning"
                      onClick={() => document.getElementById("rdw-inline-tuning")?.scrollIntoView({behavior: "smooth", block: "start"})}
                      type="button"
                      variant="outline"
                    >
                      {localCopy.viewInlineDetails}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="rounded-[3px] border border-primary/30 bg-[linear-gradient(145deg,rgba(227,6,19,.16),rgba(0,0,0,.42))] p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {match ? text.estimate : text.recommendation.indicativeEstimate}
                  </div>
                  <div className="mt-2 text-3xl font-black">
                    {text.fromPrice} {formatCurrency(total, localeCode)}
                  </div>
                  {!match ? (
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {text.recommendation.nextStepDescription}
                    </p>
                  ) : null}
                  <Button asChild className="mt-4 h-auto min-h-12 w-full whitespace-normal rounded-[3px] py-3 text-sm font-black uppercase leading-tight shadow-[0_0_32px_rgba(227,6,19,.38)]">
                    <a
                      data-testid={match ? "rdw-exact-quote" : "rdw-manual-review-quote"}
                      href={whatsappHref({
                        locale,
                        message: lookupQuoteMessage,
                        vehicleLabel: quoteVehicleLabel
                      })}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {match ? text.quoteForCar : text.recommendation.manualCta}
                    </a>
                  </Button>
                </div>
              </div>

              {match ? (
                <CatalogVerificationNotice compact text={text.verification} />
              ) : null}

              {match ? (
                <section
                  className="panel-edge overflow-hidden border-primary/35 p-5"
                  data-testid="rdw-recommended-package"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-[3px] border border-primary/35 bg-primary/15 text-primary">
                          <Sparkles className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                            {text.recommendation.eyebrow}
                          </div>
                          <h3 className="racing-title mt-1 text-2xl leading-none text-white">
                            {text.recommendation.bestDaily}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {text.recommendation.dailyDescription}
                      </p>
                      <ul className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                        <li className="flex gap-2">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {text.recommendation.stage1Benefit}
                        </li>
                        <li className="flex gap-2">
                          <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {text.recommendation.diagnosticBenefit}
                        </li>
                        {gearboxOption ? (
                          <li className="flex gap-2 sm:col-span-2">
                            <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {text.recommendation.gearboxBenefit}
                          </li>
                        ) : null}
                      </ul>
                    </div>

                    <div className="rounded-[3px] border border-white/10 bg-black/40 p-4">
                      <Button
                        className="h-12 w-full rounded-[3px] font-black uppercase"
                        disabled={stage1Index < 0}
                        onClick={() => selectStage(stage1Index, true)}
                        type="button"
                      >
                        <Check className="h-4 w-4" />
                        {recommendedPackageUsed && selectedStage?.name === "Stage 1"
                          ? text.recommendation.stage1Selected
                          : text.recommendation.selectStage1}
                      </Button>

                      {gearboxOption ? (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                            {text.recommendation.recommendedAddOn}
                          </div>
                          <Button
                            className="h-auto min-h-11 w-full justify-between gap-3 rounded-[3px] px-3 py-2 text-left text-xs font-bold"
                            onClick={() => toggleOption(gearboxOption.id)}
                            type="button"
                            variant="outline"
                          >
                            <span>
                              {gearboxOption.name} · {text.fromPrice}{" "}
                              {formatCurrency(gearboxOption.price, localeCode)}
                            </span>
                            <span className="text-primary">
                              {selectedOptions.includes(gearboxOption.id)
                                ? text.recommendation.removeGearbox
                                : text.recommendation.addGearbox}
                            </span>
                          </Button>
                        </div>
                      ) : null}

                      <Button asChild className="mt-4 h-auto min-h-11 w-full whitespace-normal rounded-[3px] py-3 text-xs font-black uppercase leading-tight">
                        <a
                          data-testid="rdw-recommendation-quote"
                          href={whatsappHref({
                            locale,
                            message: lookupQuoteMessage,
                            vehicleLabel: quoteVehicleLabel
                          })}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {text.quoteForCar}
                        </a>
                      </Button>
                    </div>
                  </div>
                </section>
              ) : null}

              <div
                className="scroll-mt-36 rounded-[3px] border border-white/10 bg-black/25 p-4"
                id="rdw-inline-tuning"
              >
                {!match ? (
                  <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
                    <AlertTriangle className="h-4 w-4" />
                    {text.recommendation.indicativeEstimate}
                  </div>
                ) : null}
                <PowerChart
                  powerUnit={powerUnit}
                  stages={stages}
                  stockPower={match?.stockPowerHp ?? result.vehicle.engine.powerHp ?? 150}
                  stockLabel={text.stock}
                  stockTorque={match?.stockTorqueNm ?? estimateStockTorque(result)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
                <div className="overflow-hidden rounded-[3px] border border-white/10">
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
                          onClick={() => selectStage(index)}
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

                <div className="rounded-[3px] border border-white/10 p-4">
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
    requestQuote: string;
    openTuningPage: string;
    viewInlineDetails: string;
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
    requestQuote: "Vraag offerte aan",
    openTuningPage: "Open tuningpagina",
    viewInlineDetails: "Bekijk volledige tuningdetails",
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
    requestQuote: "Request quote",
    openTuningPage: "Open tuning page",
    viewInlineDetails: "View full tuning details",
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
    requestQuote: "Poproś o wycenę",
    openTuningPage: "Otwórz stronę tuningu",
    viewInlineDetails: "Zobacz pełne szczegóły tuningu",
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
      price: 299,
      requirements: copy.indicativeRequirement,
      packageItems: copy.stage1Items
    },
    {
      name: "Stage 2",
      powerHp: Math.round(powerHp * 1.32),
      torqueNm: Math.round(powerHp * 3.05),
      price: 449,
      requirements: copy.hardwareRequirement,
      packageItems: copy.stage2Items
    },
    {
      name: "Stage 3+",
      powerHp: Math.round(powerHp * 1.58),
      torqueNm: Math.round(powerHp * 3.45),
      price: 699,
      requirements: copy.customRequirement,
      packageItems: copy.stage3Items
    }
  ];
}

function estimateStockTorque(result: RdwTuningLookupResult) {
  const power = result.vehicle.engine.powerHp ?? 150;
  const fuel = result.vehicle.fuel?.toLowerCase() ?? "";

  if (fuel.includes("diesel")) {
    return Math.round(power * 2.15);
  }

  return Math.round(power * 1.55);
}
