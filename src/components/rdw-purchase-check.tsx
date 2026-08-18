"use client";

import {
  AlertTriangle,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileWarning,
  Gauge,
  Info,
  MessageCircle,
  ReceiptEuro,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import type {
  PurchaseSignal,
  PurchaseSignalCode,
  PurchaseSignalLevel,
  RdwLookupResult
} from "@/lib/rdw-types";
import {createPurchaseInspectionMessage, whatsappHref} from "@/lib/whatsapp";
import {formatCurrency} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

export function RdwPurchaseCheck({
  locale,
  result,
  variant = "full"
}: {
  locale: Locale;
  result: RdwLookupResult;
  variant?: "compact" | "full";
}) {
  const t = getVehicleCheckCopy(locale);
  const localeCode = locale === "en" ? "en-US" : locale === "pl" ? "pl-PL" : "nl-NL";
  const signalCounts = countSignals(result.purchaseSignals);
  const prioritySignals = result.purchaseSignals.filter(
    (signal) => signal.level !== "positive"
  );
  const positiveSignals = result.purchaseSignals.filter(
    (signal) => signal.level === "positive"
  );
  const importantSignals = result.purchaseSignals
    .filter((signal) => signal.level !== "positive")
    .map((signal) => t.signals[signal.code].title);
  const message = createPurchaseInspectionMessage({
    apkStatus: formatApkSummary(result, locale),
    attentionSignals: importantSignals,
    locale,
    odometerJudgement: result.odometer.judgement ?? t.unavailable,
    plate: result.vehicle.plate,
    recalls: formatRecallSummary(result, locale),
    vehicle: `${result.vehicle.make} ${result.vehicle.model}`.trim()
  });

  if (variant === "compact") {
    return (
      <section className="space-y-3" data-testid="rdw-purchase-summary">
        <div className="panel-edge border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,.05),rgba(0,0,0,.42))] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                {t.summaryTitle}
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.compactText}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[0.68rem] sm:min-w-[280px]">
              <SignalCount level="positive" label={t.positive} value={signalCounts.positive} />
              <SignalCount level="attention" label={t.attention} value={signalCounts.attention} />
              <SignalCount level="check-required" label={t.checkRequired} value={signalCounts["check-required"]} />
            </div>
          </div>
        </div>
        <PurchaseSummaryCards locale={locale} result={result} />
      </section>
    );
  }

  return (
    <section className="space-y-4" data-testid="rdw-purchase-check">
      <div className="panel-edge border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,.055),rgba(0,0,0,.42))] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-[3px] border-primary/35 bg-primary/12 text-primary">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                {t.officialCheck}
              </Badge>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                {t.noScore}
              </span>
            </div>
            <h3 className="racing-title mt-3 text-2xl text-white sm:text-3xl">
              {t.summaryTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t.summaryText}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-[330px]">
            <SignalCount level="positive" label={t.positive} value={signalCounts.positive} />
            <SignalCount level="attention" label={t.attention} value={signalCounts.attention} />
            <SignalCount level="check-required" label={t.checkRequired} value={signalCounts["check-required"]} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {prioritySignals.map((signal) => (
            <SignalCard
              key={signal.code}
              locale={locale}
              reportedOverride={
                signal.code === "recall-open" && !result.recalls.detailsAvailable
                  ? t.openRecallDetailsUnavailable
                  : undefined
              }
              signal={signal}
            />
          ))}
        </div>
      </div>

      <PurchaseSummaryCards locale={locale} result={result} />

      <div className="panel-edge grid gap-5 border-primary/35 bg-[linear-gradient(120deg,rgba(227,6,19,.16),rgba(0,0,0,.5))] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-primary">{t.inspectionEyebrow}</div>
          <h3 className="racing-title mt-2 text-2xl text-white sm:text-3xl">{t.inspectionTitle}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{t.inspectionText}</p>
        </div>
        <Button asChild className="h-auto min-h-12 rounded-[3px] px-5 py-3 font-black uppercase shadow-[0_0_32px_rgba(227,6,19,.35)]">
          <a data-testid="purchase-inspection-quote" href={whatsappHref({locale, message})} rel="noreferrer" target="_blank">
            <MessageCircle className="h-4 w-4" />{t.inspectionCta}
          </a>
        </Button>
      </div>

      <details className="group panel-edge border-white/10 p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase text-white">
          {t.secondaryDetails}
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
          {positiveSignals.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {positiveSignals.map((signal) => (
                <SignalCard key={signal.code} locale={locale} signal={signal} />
              ))}
            </div>
          ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <div className="panel-edge border-white/10 p-4 sm:p-5">
          <SectionTitle icon={CarFront} title={t.vehicleDetails} />
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label={t.firstAdmission} value={formatDate(result.ownershipRegistration.firstAdmission, locale)} />
            <Detail label={t.firstRegistrationNl} value={formatDate(result.ownershipRegistration.firstRegistrationNl, locale)} />
            <Detail label={t.importSignal} value={importLabel(result.ownershipRegistration.likelyImported, result.ownershipRegistration.daysBetweenFirstAdmissionAndNlRegistration, t)} />
            <Detail label={t.wam} value={booleanLabel(result.insurance.wamInsured, t)} />
            <Detail label={t.exportIndicator} value={booleanLabel(result.ownershipRegistration.exportIndicator, t)} />
            <Detail label={t.waitingInspection} value={booleanLabel(result.ownershipRegistration.waitingForInspection, t)} />
            <Detail label={t.taxiIndicator} value={booleanLabel(result.ownershipRegistration.taxiIndicator, t)} />
            <Detail label={t.color} value={[result.vehicle.color, result.vehicle.secondColor].filter(Boolean).join(" / ") || t.unavailable} />
            <Detail label={t.seatsDoors} value={`${result.vehicle.seats ?? "-"} / ${result.vehicle.doors ?? "-"}`} />
            <Detail label={t.runningWeight} value={unit(result.towing.runningWeightKg, "kg", t.unavailable)} />
            <Detail label={t.payload} value={unit(result.towing.payloadKg, "kg", t.unavailable)} />
            <Detail label={t.towing} value={`${unit(result.towing.unbrakedKg, "kg", "-")} / ${unit(result.towing.brakedKg, "kg", "-")}`} />
            <Detail helper={t.catalogPriceHelp} label={t.catalogPrice} value={currency(result.financial.catalogPriceEur, localeCode, t.unavailable)} />
            <Detail helper={t.grossBpmHelp} label={t.grossBpm} value={currency(result.financial.grossBpmEur, localeCode, t.unavailable)} />
          </div>
        </div>

        <div className="panel-edge border-white/10 p-4 sm:p-5">
          <SectionTitle icon={ReceiptEuro} title={t.environment} />
          {result.environment.fuels.length > 0 ? (
            <div className="mt-4 space-y-3">
              {result.environment.fuels.map((fuel, index) => (
                <div className="rounded-[3px] border border-white/10 bg-black/30 p-3" key={`${fuel.fuel ?? "fuel"}-${index}`}>
                  <div className="font-black text-white">{fuel.fuel ?? t.unavailable}</div>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <Detail label={t.power} value={unit(fuel.powerKw, "kW", t.unavailable)} />
                    <Detail label={t.emissionClass} value={fuel.exhaustEmissionLevel ?? fuel.emissionClass ?? t.unavailable} />
                    <Detail label={t.consumption} value={unit(fuel.combinedConsumption, "l/100 km", t.unavailable)} />
                    <Detail label={t.consumptionWltp} value={unit(fuel.combinedConsumptionWltp, "l/100 km", t.unavailable)} />
                    <Detail label={t.co2} value={unit(fuel.co2CombinedGkm, "g/km", t.unavailable)} />
                    <Detail label={t.co2Wltp} value={unit(fuel.co2CombinedWltpGkm, "g/km", t.unavailable)} />
                    <Detail label={t.electricConsumption} value={unit(fuel.electricConsumptionWltp, "Wh/km", t.unavailable)} />
                    <Detail label={t.range} value={unit(fuel.electricRangeWltpKm ?? fuel.rangeKm, "km", t.unavailable)} />
                    {fuel.hybridClass ? <Detail label={t.hybridClass} value={fuel.hybridClass} /> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{t.sourceUnavailable}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="panel-edge border-white/10 p-4 sm:p-5">
          <SectionTitle icon={FileWarning} title={t.apkHistory} />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.apkHistoryIntro}</p>
          {result.apkHistory.items.length > 0 ? (
            <div className="mt-4 space-y-2">
              {result.apkHistory.items.map((item, index) => (
                <div className="rounded-[3px] border border-white/10 bg-black/30 p-3" key={`${item.inspectionDate}-${item.defectCode}-${index}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-black text-white">{formatDate(item.inspectionDate, locale)}</span>
                    <Badge className="rounded-[3px] border-amber-400/25 bg-amber-400/10 text-amber-200">
                      {t.defectCode} {item.defectCode} · {item.count}x
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description ?? t.descriptionUnavailable}
                  </p>
                  {locale !== "nl" && item.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{t.officialDutchDescription}</p>
                  ) : null}
                  {item.inspectionType ? <p className="mt-2 text-xs text-muted-foreground">{item.inspectionType}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[3px] border border-white/10 bg-black/30 p-3 text-sm leading-6 text-muted-foreground">
              {t.noApkRows}
            </div>
          )}
        </div>

        <div className="panel-edge border-white/10 p-4 sm:p-5">
          <SectionTitle icon={RotateCcw} title={t.recallDetails} />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.recallCaveat}</p>
          {result.recalls.status === "open" && !result.recalls.detailsAvailable ? (
            <div className="mt-4 rounded-[3px] border border-red-400/25 bg-red-400/[0.08] p-3 text-sm leading-6 text-red-100">
              {t.openRecallDetailsUnavailable}
            </div>
          ) : null}
          {result.recalls.items.length > 0 ? (
            <div className="mt-4 space-y-2">
              {result.recalls.items.map((item) => (
                <div className="rounded-[3px] border border-red-400/20 bg-red-400/[0.06] p-3" key={item.referenceCode}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-white">{item.referenceCode}</span>
                    <Badge className="rounded-[3px] border-red-400/30 bg-red-400/10 text-red-200">{item.status}</Badge>
                  </div>
                  {item.producerReference ? <p className="mt-2 text-xs text-muted-foreground">{t.producerCode}: {item.producerReference}</p> : null}
                  {item.defectDescription ? <p className="mt-2 text-sm leading-6 text-slate-300">{item.defectDescription}</p> : null}
                  {item.remedyDescription ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.remedy}: {item.remedyDescription}</p> : null}
                  {item.informationUrl ? (
                    <a className="mt-3 inline-flex items-center gap-1 text-xs font-black uppercase text-primary hover:text-white" href={item.informationUrl} rel="noreferrer" target="_blank">
                      {t.moreInfo}<ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : result.recalls.status === "open" && !result.recalls.detailsAvailable ? null : (
            <div className="mt-4 rounded-[3px] border border-white/10 bg-black/30 p-3 text-sm leading-6 text-muted-foreground">
              {t.noOpenRecallRows}
            </div>
          )}
        </div>
      </div>
        </div>
      </details>

      <div className="rounded-[3px] border border-white/10 bg-black/25 p-4 text-xs leading-5 text-muted-foreground">
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p>{t.disclaimer}</p>
            <p className="mt-2">{t.inspectionDisclaimer}</p>
          </div>
        </div>
        <details className="mt-3 border-t border-white/10 pt-3">
          <summary className="cursor-pointer font-black uppercase text-slate-300">{t.sourceStatus}</summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {result.sourceStatus.map((source) => (
              <div className="rounded-[3px] border border-white/10 p-2" key={source.source}>
                <div className="font-bold text-slate-200">{source.label}</div>
                <div className="mt-1 text-muted-foreground">
                  {source.datasetId} · {t.status[source.status]} · {source.rowCount}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

function PurchaseSummaryCards({locale, result}: {locale: Locale; result: RdwLookupResult}) {
  const t = getVehicleCheckCopy(locale);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={CalendarCheck}
        label={t.apk}
        tone={signalTone(result.purchaseSignals, ["apk-expired", "apk-expiring", "apk-unknown"])}
        value={formatApkSummary(result, locale)}
      >
        {t.until} {formatDate(result.roadworthiness.apkExpiry, locale)}
      </SummaryCard>
      <SummaryCard
        icon={Gauge}
        label={t.odometer}
        tone={signalTone(result.purchaseSignals, ["odometer-illogical", "odometer-unknown"])}
        value={result.odometer.judgement ?? t.unavailable}
      >
        {result.odometer.lastRegistrationYear
          ? `${t.lastRecordedYear}: ${result.odometer.lastRegistrationYear}`
          : t.noIndividualReadings}
      </SummaryCard>
      <SummaryCard
        icon={RotateCcw}
        label={t.recalls}
        tone={signalTone(result.purchaseSignals, ["recall-open", "recall-unknown"])}
        value={formatRecallSummary(result, locale)}
      >
        {t.recallCaveat}
      </SummaryCard>
      <SummaryCard
        icon={ClipboardCheck}
        label={t.registration}
        tone={signalTone(result.purchaseSignals, ["transfer-blocked", "exported", "waiting-for-inspection"])}
        value={booleanLabel(result.ownershipRegistration.transferPossible, t)}
      >
        {t.lastRegistration}: {formatDate(result.ownershipRegistration.currentRegistrationDate, locale)}
      </SummaryCard>
    </div>
  );
}

function SignalCard({
  locale,
  reportedOverride,
  signal
}: {
  locale: Locale;
  reportedOverride?: string;
  signal: PurchaseSignal;
}) {
  const t = getVehicleCheckCopy(locale);
  const item = t.signals[signal.code];
  const Icon = signal.level === "positive" ? CheckCircle2 : signal.level === "attention" ? AlertTriangle : FileWarning;
  return (
    <article className={`rounded-[3px] border p-3 ${signalClassName(signal.level)}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-black text-white">{item.title}</div>
          <p className="mt-1 text-xs leading-5 text-slate-300">{reportedOverride ?? item.reported}</p>
          {(signal.date || signal.value !== undefined || signal.days !== undefined) ? (
            <div className="mt-2 text-xs font-bold text-white">
              {signal.date ? formatDate(signal.date, locale) : null}
              {signal.value !== undefined && signal.value !== null ? `${signal.date ? " · " : ""}${signal.value}` : null}
              {signal.days !== undefined ? `${signal.date || signal.value !== undefined ? " · " : ""}${signal.days} ${t.days}` : null}
            </div>
          ) : null}
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.why}</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{item.action}</p>
        </div>
      </div>
    </article>
  );
}

function SignalCount({level, label, value}: {level: PurchaseSignalLevel; label: string; value: number}) {
  return <div className={`rounded-[3px] border p-2 ${signalClassName(level)}`}><div className="text-xl font-black">{value}</div><div>{label}</div></div>;
}

function SummaryCard({children, icon: Icon, label, tone, value}: {
  children: React.ReactNode;
  icon: typeof ShieldCheck;
  label: string;
  tone: PurchaseSignalLevel;
  value: string;
}) {
  return <article className="rounded-[3px] border border-white/10 bg-black/30 p-4"><div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground"><Icon className={`h-4 w-4 ${toneText(tone)}`} />{label}</div><div className="mt-2 text-lg font-black text-white">{value}</div><div className="mt-2 text-xs leading-5 text-muted-foreground">{children}</div></article>;
}

function SectionTitle({icon: Icon, title}: {icon: typeof ShieldCheck; title: string}) {
  return <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-[3px] border border-primary/30 bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><h3 className="racing-title text-xl text-white">{title}</h3></div>;
}

function Detail({helper, label, value}: {helper?: string; label: string; value: string}) {
  return <div className="rounded-[3px] border border-white/10 bg-black/25 p-2.5"><div className="text-[0.68rem] font-bold uppercase text-muted-foreground">{label}</div><div className="mt-1 break-words text-sm font-semibold text-slate-100">{value}</div>{helper ? <p className="mt-1.5 text-[0.68rem] leading-4 text-muted-foreground">{helper}</p> : null}</div>;
}

function countSignals(signals: PurchaseSignal[]) {
  return signals.reduce((counts, signal) => ({...counts, [signal.level]: counts[signal.level] + 1}), {positive: 0, attention: 0, "check-required": 0});
}

function signalTone(signals: PurchaseSignal[], codes: PurchaseSignalCode[]): PurchaseSignalLevel {
  return signals.find((signal) => codes.includes(signal.code))?.level ?? "positive";
}

function signalClassName(level: PurchaseSignalLevel) {
  if (level === "check-required") return "border-red-400/25 bg-red-400/[0.08] text-red-200";
  if (level === "attention") return "border-amber-400/25 bg-amber-400/[0.08] text-amber-200";
  return "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200";
}

function toneText(level: PurchaseSignalLevel) {
  return level === "check-required" ? "text-red-300" : level === "attention" ? "text-amber-300" : "text-emerald-300";
}

function formatDate(value: string | undefined, locale: Locale) {
  if (!value) return getVehicleCheckCopy(locale).unavailable;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "pl" ? "pl-PL" : "nl-NL", {dateStyle: "medium", timeZone: "UTC"}).format(date);
}

function formatApkSummary(result: RdwLookupResult, locale: Locale) {
  return getVehicleCheckCopy(locale).apkStatus[result.roadworthiness.status];
}

function formatRecallSummary(result: RdwLookupResult, locale: Locale) {
  const t = getVehicleCheckCopy(locale);
  if (result.recalls.status === "clear") return t.noOpenRecalls;
  if (result.recalls.status === "unknown") return t.recallUnknown;
  if (result.recalls.openCount === null) return t.openRecallReported;
  return `${result.recalls.openCount} ${t.openRecalls}`;
}

function booleanLabel(value: boolean | null, t: VehicleCheckCopy) {
  return value === null ? t.unavailable : value ? t.yes : t.no;
}

function importLabel(value: boolean | null, days: number | null, t: VehicleCheckCopy) {
  if (value === null) return t.unavailable;
  if (value) return `${t.possibleImport}${days === null ? "" : ` · ${days} ${t.days}`}`;
  return t.noImportSignal;
}

function currency(value: number | null | undefined, locale: string, fallback: string) {
  return value === null || value === undefined ? fallback : formatCurrency(value, locale);
}

function unit(value: number | null | undefined, suffix: string, fallback: string) {
  return value === null || value === undefined ? fallback : `${value} ${suffix}`;
}

type SignalCopy = {title: string; reported: string; why: string; action: string};
type VehicleCheckCopy = {
  officialCheck: string; noScore: string; summaryTitle: string; summaryText: string; compactText: string;
  positive: string; attention: string; checkRequired: string; days: string;
  apk: string; odometer: string; recalls: string; registration: string; until: string;
  lastRecordedYear: string; noIndividualReadings: string; recallCaveat: string;
  lastRegistration: string; vehicleDetails: string; firstAdmission: string;
  firstRegistrationNl: string; importSignal: string; wam: string; exportIndicator: string;
  waitingInspection: string; taxiIndicator: string; color: string; seatsDoors: string;
  runningWeight: string; payload: string; towing: string; catalogPrice: string; catalogPriceHelp: string;
  grossBpm: string; grossBpmHelp: string; environment: string; power: string; emissionClass: string;
  consumption: string; consumptionWltp: string; co2: string; co2Wltp: string;
  electricConsumption: string; range: string; hybridClass: string; apkHistory: string;
  apkHistoryIntro: string; defectCode: string; descriptionUnavailable: string;
  officialDutchDescription: string; noApkRows: string; recallDetails: string;
  producerCode: string; remedy: string; moreInfo: string; noOpenRecallRows: string; openRecallDetailsUnavailable: string;
  inspectionEyebrow: string; inspectionTitle: string; inspectionText: string;
  inspectionCta: string; disclaimer: string; inspectionDisclaimer: string;
  sourceStatus: string; sourceUnavailable: string; secondaryDetails: string; unavailable: string; yes: string; no: string;
  possibleImport: string; noImportSignal: string; noOpenRecalls: string; openRecalls: string; openRecallReported: string; recallUnknown: string;
  apkStatus: Record<RdwLookupResult["roadworthiness"]["status"], string>;
  status: Record<RdwLookupResult["sourceStatus"][number]["status"], string>;
  signals: Record<PurchaseSignalCode, SignalCopy>;
};

type VehicleCheckSupplement = Pick<
  VehicleCheckCopy,
  | "compactText"
  | "catalogPrice"
  | "catalogPriceHelp"
  | "grossBpm"
  | "grossBpmHelp"
  | "openRecallDetailsUnavailable"
  | "secondaryDetails"
  | "possibleImport"
  | "noImportSignal"
  | "openRecallReported"
  | "recallUnknown"
> & {likelyImportSignal: SignalCopy};

type VehicleCheckBaseCopy = Omit<
  VehicleCheckCopy,
  | "compactText"
  | "catalogPriceHelp"
  | "grossBpmHelp"
  | "openRecallDetailsUnavailable"
  | "secondaryDetails"
  | "openRecallReported"
  | "recallUnknown"
>;

const vehicleCheckCopy: Record<Locale, VehicleCheckBaseCopy> = {
  nl: {
    officialCheck: "Officiële RDW-check", noScore: "Aandachtssignalen, geen voertuigscore", summaryTitle: "Aankoopcheck in één overzicht", summaryText: "We tonen wat RDW officieel registreert, waarom een punt aandacht verdient en wat je vóór aankoop praktisch kunt controleren.", positive: "Positief", attention: "Aandacht", checkRequired: "Controleren", days: "dagen", apk: "APK", odometer: "Tellerstand", recalls: "Terugroepacties", registration: "Tenaamstelling mogelijk", until: "Geldig tot", lastRecordedYear: "Laatste registratiejaar", noIndividualReadings: "Geen individuele tellerstanden beschikbaar", recallCaveat: "Geen open melding in deze bron bewijst niet dat het voertuig nooit een terugroepactie heeft gehad.", lastRegistration: "Laatste tenaamstelling", vehicleDetails: "Registratie en voertuigdetails", firstAdmission: "Eerste toelating", firstRegistrationNl: "Eerste registratie NL", importSignal: "Importsignaal", wam: "WAM verzekerd", exportIndicator: "Exportindicator", waitingInspection: "Wacht op keuren", taxiIndicator: "Taxi-indicator", color: "Kleur(en)", seatsDoors: "Zitplaatsen / deuren", runningWeight: "Massa rijklaar", payload: "Laadvermogen", towing: "Trekgewicht ongeremd / geremd", catalogPrice: "Catalogusprijs RDW", grossBpm: "Bruto BPM", environment: "Brandstof en milieu", power: "Netto maximumvermogen", emissionClass: "Emissieklasse", consumption: "Verbruik gecombineerd", consumptionWltp: "Verbruik WLTP", co2: "CO₂ gecombineerd", co2Wltp: "CO₂ WLTP", electricConsumption: "Elektrisch verbruik WLTP", range: "Elektrische actieradius", hybridClass: "Hybrideklasse", apkHistory: "Recente APK-gebreken", apkHistoryIntro: "Maximaal twaalf recente gebrekregels, nieuwste eerst. Dit zijn gemelde APK-gebreken, geen volledige onderhoudshistorie.", defectCode: "Gebrekcode", descriptionUnavailable: "Geen omschrijving beschikbaar in de officiële referentiedataset.", officialDutchDescription: "Officiële RDW-omschrijving (Nederlands).", noApkRows: "De recente RDW-query gaf geen gebrekregels terug. Dat is geen bewijs dat het voertuig nooit een APK-gebrek heeft gehad.", recallDetails: "Open terugroepacties", producerCode: "Producentcode", remedy: "Herstel", moreInfo: "Meer informatie", noOpenRecallRows: "Deze RDW-query gaf geen open terugroepactieregels terug. Controleer bij twijfel ook bij merk of dealer.", inspectionEyebrow: "Technische aankoopcontrole", inspectionTitle: "Laat deze auto controleren vóór aankoop", inspectionText: "Een RDW-check zegt niets over actuele foutcodes, live data, slijtage of de mechanische staat. NoordTune kan die technische punten vóór aankoop controleren.", inspectionCta: "Laat deze auto controleren vóór aankoop", disclaimer: "Bron: officiële RDW Open Data. Dit is geen schadeverleden, geen complete eigenaarshistorie en toont geen individuele tellerstanden.", inspectionDisclaimer: "Geen RDW-waarschuwing garandeert geen goede mechanische staat. Een fysieke inspectie en diagnosescan blijven aanbevolen vóór aankoop.", sourceStatus: "Status officiële bronnen", sourceUnavailable: "Deze aanvullende RDW-bron was tijdelijk niet beschikbaar. De kerngegevens en tuningcheck blijven bruikbaar.", unavailable: "Niet beschikbaar", yes: "Ja", no: "Nee", possibleImport: "Verschil tussen eerste toelating en eerste registratie in NL", noImportSignal: "Geen datumverschil geregistreerd", noOpenRecalls: "Geen open actie gemeld", openRecalls: "open acties", apkStatus: {valid: "Geldig", "expiring-soon": "Verloopt binnen 60 dagen", expired: "Verlopen", unknown: "Niet beschikbaar"}, status: {available: "beschikbaar", unavailable: "tijdelijk niet beschikbaar", partial: "gedeeltelijk", "not-applicable": "niet van toepassing"},
    signals: {
      "apk-valid": {title: "APK ruim geldig", reported: "RDW meldt een geldige APK met meer dan 60 dagen resterend.", why: "De officiële vervaldatum geeft een eerste praktisch controlemoment.", action: "Controleer alsnog rapporten en actuele technische staat."},
      "apk-expiring": {title: "APK verloopt binnenkort", reported: "RDW meldt dat de APK binnen 60 dagen verloopt.", why: "Een nieuwe keuring en mogelijk herstel kunnen snel nodig zijn.", action: "Bespreek keuring, kosten en gemelde gebreken met de verkoper."},
      "apk-expired": {title: "APK is verlopen", reported: "De officiële RDW-vervaldatum ligt in het verleden.", why: "Gebruik op de openbare weg en een nieuwe keuring vragen directe aandacht.", action: "Laat keuring en technische staat vóór aankoop controleren."},
      "apk-unknown": {title: "APK-datum niet beschikbaar", reported: "RDW leverde geen bruikbare APK-vervaldatum.", why: "Zonder datum kan de actuele keuringsstatus hier niet worden bevestigd.", action: "Controleer de APK-status rechtstreeks bij RDW of verkoper."},
      "odometer-logical": {title: "Tellerstandoordeel logisch", reported: "RDW registreert het tellerstandoordeel als logisch.", why: "Dit oordeel vergelijkt registraties, maar toont geen losse meetwaarden.", action: "Vergelijk onderhoudsfacturen en de actuele tellerstand."},
      "odometer-illogical": {title: "Tellerstandoordeel niet logisch", reported: "RDW registreert een onlogisch tellerstandoordeel.", why: "De registratiereeks verdient nader onderzoek.", action: "Vraag documentatie op en laat kilometerhistorie zorgvuldig controleren."},
      "odometer-unknown": {title: "Geen bruikbaar tellerstandoordeel", reported: "RDW geeft geen logisch/onlogisch oordeel voor deze registratie.", why: "Dat is niet automatisch negatief, maar biedt minder controle-informatie.", action: "Controleer tellerstand, facturen en onderhoudsboekjes."},
      "recall-clear": {title: "Geen open terugroepactie gemeld", reported: "De officiële voertuig- en statusbronnen melden geen open actie.", why: "Dit betreft de huidige open status in de beschikbare RDW-data.", action: "Vraag merk of dealer bij twijfel om een aanvullende VIN-controle."},
      "recall-open": {title: "Open terugroepactie", reported: "RDW meldt één of meer open terugroepacties voor dit kenteken.", why: "Herstel door producent of dealer kan nog nodig zijn.", action: "Neem de referentiecode mee naar de merkdealer en bevestig herstel."},
      "recall-unknown": {title: "Terugroepstatus niet volledig beschikbaar", reported: "De aanvullende RDW-statusbron kon niet volledig worden bevestigd.", why: "Een ontbrekende bron is geen positieve of negatieve voertuigstatus.", action: "Controleer de terugroepstatus bij merk of dealer."},
      "transfer-possible": {title: "Tenaamstellen mogelijk", reported: "RDW meldt dat tenaamstelling mogelijk is.", why: "Dit is een actuele registratiestatus, geen technische beoordeling.", action: "Controleer identiteit en documenten bij de overdracht."},
      "transfer-blocked": {title: "Tenaamstellen niet mogelijk", reported: "RDW meldt dat tenaamstelling momenteel niet mogelijk is.", why: "De overdracht kan niet normaal worden afgerond.", action: "Laat de verkoper de officiële blokkade vóór aankoop oplossen."},
      exported: {title: "Exportindicator actief", reported: "RDW meldt een exportindicator voor dit voertuig.", why: "De Nederlandse registratiestatus verdient controle.", action: "Controleer kentekenstatus en documenten vóór betaling."},
      "waiting-for-inspection": {title: "Wacht op keuren", reported: "RDW meldt dat het voertuig wacht op keuren.", why: "Een officiële keuring kan nodig zijn voordat normaal gebruik of registratie mogelijk is.", action: "Vraag RDW/verkoper welke keuring vereist is en laat dit oplossen."},
      "wam-uninsured": {title: "WAM niet verzekerd gemeld", reported: "RDW meldt op dit moment geen WAM-verzekering.", why: "Dit kan bij handelsvoorraad voorkomen en is niet automatisch fraude.", action: "Bevestig de status en regel verzekering vóór gebruik op de weg."},
      "likely-import": {title: "Mogelijk importvoertuig", reported: "Eerste toelating en eerste registratie in Nederland hebben verschillende datums.", why: "Import is niet automatisch negatief, maar buitenlandse documentatie kan relevant zijn.", action: "Vraag herkomst-, onderhouds- en importdocumenten op."},
      "recent-transfer": {title: "Recente tenaamstelling", reported: "De laatste tenaamstelling is minder dan 90 dagen geleden.", why: "Een recente overdracht is op zichzelf geen bewijs van een probleem.", action: "Vraag de verkoper rustig naar de context van de recente wijziging."},
      "taxi-indicator": {title: "Taxi-indicator actief", reported: "RDW toont de officiële taxi-indicator voor dit voertuig.", why: "Dit is de huidige indicator en geen complete taxi-gebruikshistorie.", action: "Vraag naar gebruik, onderhoud en slijtage en laat de staat controleren."}
    }
  },
  en: {
    officialCheck: "Official RDW check", noScore: "Attention signals, not a vehicle score", summaryTitle: "Pre-purchase check at a glance", summaryText: "We show what RDW officially reports, why a point may deserve attention and what you can verify before buying.", positive: "Positive", attention: "Attention", checkRequired: "Check required", days: "days", apk: "APK", odometer: "Odometer", recalls: "Recalls", registration: "Transfer possible", until: "Valid until", lastRecordedYear: "Last registration year", noIndividualReadings: "No individual odometer readings available", recallCaveat: "No open recall in this dataset does not prove that the vehicle has never been recalled.", lastRegistration: "Latest registration", vehicleDetails: "Registration and vehicle details", firstAdmission: "First admission", firstRegistrationNl: "First registration in NL", importSignal: "Import signal", wam: "WAM insured", exportIndicator: "Export indicator", waitingInspection: "Waiting for inspection", taxiIndicator: "Taxi indicator", color: "Colour(s)", seatsDoors: "Seats / doors", runningWeight: "Mass in running order", payload: "Payload", towing: "Unbraked / braked towing mass", catalogPrice: "RDW list price", grossBpm: "Gross BPM", environment: "Fuel and environment", power: "Maximum net power", emissionClass: "Emission class", consumption: "Combined consumption", consumptionWltp: "WLTP consumption", co2: "Combined CO₂", co2Wltp: "WLTP CO₂", electricConsumption: "WLTP electric consumption", range: "Electric range", hybridClass: "Hybrid class", apkHistory: "Recent APK defects", apkHistoryIntro: "Up to twelve recent defect rows, newest first. These are reported APK defects, not a complete maintenance history.", defectCode: "Defect code", descriptionUnavailable: "No description is available in the official reference dataset.", officialDutchDescription: "Official RDW description (Dutch).", noApkRows: "The recent RDW query returned no defect rows. This does not prove that the vehicle has never had an APK defect.", recallDetails: "Open recalls", producerCode: "Producer code", remedy: "Remedy", moreInfo: "More information", noOpenRecallRows: "This RDW query returned no open recall rows. When in doubt, also check with the manufacturer or dealer.", inspectionEyebrow: "Technical purchase inspection", inspectionTitle: "Request a pre-purchase vehicle check", inspectionText: "An RDW check does not show current fault codes, live data, wear or mechanical condition. NoordTune can inspect those technical points before you buy.", inspectionCta: "Request a pre-purchase vehicle check", disclaimer: "Source: official RDW Open Data. This is not a damage-history report, not a complete ownership history and does not show individual odometer readings.", inspectionDisclaimer: "No RDW warning does not guarantee good mechanical condition. A physical inspection and diagnostic scan remain recommended before purchase.", sourceStatus: "Official source status", sourceUnavailable: "This additional RDW source was temporarily unavailable. The core vehicle and tuning check remain usable.", unavailable: "Unavailable", yes: "Yes", no: "No", possibleImport: "Different first-admission and first-registration-in-NL dates", noImportSignal: "No date difference reported", noOpenRecalls: "No open recall reported", openRecalls: "open recalls", apkStatus: {valid: "Valid", "expiring-soon": "Expires within 60 days", expired: "Expired", unknown: "Unavailable"}, status: {available: "available", unavailable: "temporarily unavailable", partial: "partial", "not-applicable": "not applicable"},
    signals: {
      "apk-valid": {title: "APK comfortably valid", reported: "RDW reports a valid APK with more than 60 days remaining.", why: "The official expiry date provides a useful first checkpoint.", action: "Still review inspection records and the current technical condition."},
      "apk-expiring": {title: "APK expires soon", reported: "RDW reports that the APK expires within 60 days.", why: "A new inspection and possible repairs may soon be required.", action: "Discuss inspection, costs and reported defects with the seller."},
      "apk-expired": {title: "APK has expired", reported: "The official RDW expiry date is in the past.", why: "Road use and a new inspection require immediate attention.", action: "Have the inspection and technical condition checked before buying."},
      "apk-unknown": {title: "APK date unavailable", reported: "RDW did not provide a usable APK expiry date.", why: "The current inspection status cannot be confirmed here without a date.", action: "Check the APK status directly with RDW or the seller."},
      "odometer-logical": {title: "Odometer judgement is logical", reported: "RDW records the odometer judgement as logical.", why: "This judgement compares registrations but does not expose individual readings.", action: "Compare service invoices with the current odometer reading."},
      "odometer-illogical": {title: "Odometer judgement is illogical", reported: "RDW records an illogical odometer judgement.", why: "The registration sequence deserves further investigation.", action: "Request documentation and check the mileage history carefully."},
      "odometer-unknown": {title: "No usable odometer judgement", reported: "RDW provides no logical/illogical judgement for this registration.", why: "This is not automatically negative, but gives less verification information.", action: "Check the odometer, invoices and service records."},
      "recall-clear": {title: "No open recall reported", reported: "The official vehicle and status sources report no open recall.", why: "This concerns the current open status in the available RDW data.", action: "Ask the manufacturer or dealer for an additional VIN check if needed."},
      "recall-open": {title: "Open recall", reported: "RDW reports one or more open recalls for this plate.", why: "Repair by the manufacturer or dealer may still be required.", action: "Take the reference code to the dealer and confirm the repair."},
      "recall-unknown": {title: "Recall status not fully available", reported: "The additional RDW status source could not be fully confirmed.", why: "A missing source is neither a positive nor negative vehicle status.", action: "Check the recall status with the manufacturer or dealer."},
      "transfer-possible": {title: "Registration transfer possible", reported: "RDW reports that registration transfer is possible.", why: "This is a current registration status, not a technical assessment.", action: "Verify identity and documents during the transfer."},
      "transfer-blocked": {title: "Registration transfer not possible", reported: "RDW reports that registration transfer is currently not possible.", why: "The transfer cannot be completed normally.", action: "Have the seller resolve the official restriction before purchase."},
      exported: {title: "Export indicator active", reported: "RDW reports an export indicator for this vehicle.", why: "The Dutch registration status deserves verification.", action: "Check the registration status and documents before payment."},
      "waiting-for-inspection": {title: "Waiting for inspection", reported: "RDW reports that the vehicle is waiting for inspection.", why: "An official inspection may be required before normal use or registration.", action: "Ask RDW or the seller which inspection is required and have it resolved."},
      "wam-uninsured": {title: "WAM not insured", reported: "RDW currently reports no WAM insurance.", why: "This can occur with dealer stock and does not automatically imply fraud.", action: "Confirm the status and arrange insurance before road use."},
      "likely-import": {title: "Possible imported vehicle", reported: "The first-admission and first-registration-in-NL dates differ.", why: "Import is not automatically negative, but foreign documentation can matter.", action: "Request origin, maintenance and import documents."},
      "recent-transfer": {title: "Recent registration transfer", reported: "The latest registration is less than 90 days old.", why: "A recent transfer is not evidence of a problem by itself.", action: "Ask the seller for the context of the recent change."},
      "taxi-indicator": {title: "Taxi indicator active", reported: "RDW shows the official taxi indicator for this vehicle.", why: "This is the current indicator, not a complete history of taxi use.", action: "Ask about use, maintenance and wear and inspect the condition."}
    }
  },
  pl: {
    officialCheck: "Oficjalne sprawdzenie RDW", noScore: "Sygnały do uwagi, nie ocena auta", summaryTitle: "Kontrola przed zakupem w jednym miejscu", summaryText: "Pokazujemy, co oficjalnie rejestruje RDW, dlaczego dany punkt zasługuje na uwagę i co warto sprawdzić przed zakupem.", positive: "Pozytywne", attention: "Uwaga", checkRequired: "Do sprawdzenia", days: "dni", apk: "APK", odometer: "Przebieg", recalls: "Akcje serwisowe", registration: "Możliwość przerejestrowania", until: "Ważne do", lastRecordedYear: "Rok ostatniej rejestracji", noIndividualReadings: "Brak dostępu do pojedynczych odczytów licznika", recallCaveat: "Brak otwartej akcji w tym zbiorze nie dowodzi, że pojazd nigdy nie podlegał akcji serwisowej.", lastRegistration: "Ostatnia rejestracja", vehicleDetails: "Rejestracja i dane pojazdu", firstAdmission: "Pierwsze dopuszczenie", firstRegistrationNl: "Pierwsza rejestracja w NL", importSignal: "Sygnał importu", wam: "Ubezpieczenie WAM", exportIndicator: "Wskaźnik eksportu", waitingInspection: "Oczekuje na kontrolę", taxiIndicator: "Wskaźnik taxi", color: "Kolor(y)", seatsDoors: "Miejsca / drzwi", runningWeight: "Masa gotowa do jazdy", payload: "Ładowność", towing: "Masa przyczepy bez hamulca / z hamulcem", catalogPrice: "Cena katalogowa RDW", grossBpm: "BPM brutto", environment: "Paliwo i emisje", power: "Moc maksymalna netto", emissionClass: "Klasa emisji", consumption: "Zużycie łączne", consumptionWltp: "Zużycie WLTP", co2: "CO₂ łącznie", co2Wltp: "CO₂ WLTP", electricConsumption: "Zużycie energii WLTP", range: "Zasięg elektryczny", hybridClass: "Klasa hybrydy", apkHistory: "Ostatnie usterki APK", apkHistoryIntro: "Maksymalnie dwanaście ostatnich wpisów, od najnowszego. To zgłoszone usterki APK, a nie pełna historia serwisowa.", defectCode: "Kod usterki", descriptionUnavailable: "Brak opisu w oficjalnym zbiorze referencyjnym.", officialDutchDescription: "Oficjalny opis RDW (po niderlandzku).", noApkRows: "Ostatnie zapytanie RDW nie zwróciło wpisów usterek. Nie oznacza to, że pojazd nigdy nie miał usterki APK.", recallDetails: "Otwarte akcje serwisowe", producerCode: "Kod producenta", remedy: "Naprawa", moreInfo: "Więcej informacji", noOpenRecallRows: "To zapytanie RDW nie zwróciło otwartych akcji. W razie wątpliwości sprawdź również u producenta lub dealera.", inspectionEyebrow: "Kontrola techniczna przed zakupem", inspectionTitle: "Sprawdź auto przed zakupem", inspectionText: "Dane RDW nie pokazują aktualnych błędów, live data, zużycia ani stanu mechanicznego. NoordTune może sprawdzić te punkty przed zakupem.", inspectionCta: "Sprawdź auto przed zakupem", disclaimer: "Źródło: oficjalne RDW Open Data. To nie jest raport historii szkód ani pełna historia właścicieli i nie pokazuje pojedynczych odczytów licznika.", inspectionDisclaimer: "Brak ostrzeżeń RDW nie gwarantuje dobrego stanu mechanicznego. Przed zakupem nadal zalecamy oględziny i diagnostykę komputerową.", sourceStatus: "Status oficjalnych źródeł", sourceUnavailable: "To dodatkowe źródło RDW było chwilowo niedostępne. Podstawowe dane pojazdu i kalkulator tuningu nadal działają.", unavailable: "Brak danych", yes: "Tak", no: "Nie", possibleImport: "Różne daty pierwszego dopuszczenia i rejestracji w NL", noImportSignal: "Brak różnicy dat", noOpenRecalls: "Brak otwartej akcji", openRecalls: "otwarte akcje", apkStatus: {valid: "Ważne", "expiring-soon": "Wygasa w ciągu 60 dni", expired: "Nieważne", unknown: "Brak danych"}, status: {available: "dostępne", unavailable: "chwilowo niedostępne", partial: "częściowe", "not-applicable": "nie dotyczy"},
    signals: {
      "apk-valid": {title: "APK ważne przez ponad 60 dni", reported: "RDW podaje ważne APK z okresem dłuższym niż 60 dni.", why: "Oficjalna data ważności jest dobrym pierwszym punktem kontroli.", action: "Mimo to sprawdź raporty i aktualny stan techniczny."},
      "apk-expiring": {title: "APK wkrótce wygasa", reported: "RDW podaje, że APK wygasa w ciągu 60 dni.", why: "Wkrótce może być potrzebne badanie i ewentualne naprawy.", action: "Omów badanie, koszty i zgłoszone usterki ze sprzedawcą."},
      "apk-expired": {title: "APK jest nieważne", reported: "Oficjalna data ważności RDW już minęła.", why: "Jazda po drodze i nowe badanie wymagają natychmiastowej uwagi.", action: "Przed zakupem sprawdź badanie i stan techniczny."},
      "apk-unknown": {title: "Brak daty APK", reported: "RDW nie przekazało użytecznej daty ważności APK.", why: "Bez daty nie można tutaj potwierdzić aktualnego statusu badania.", action: "Sprawdź status APK bezpośrednio w RDW lub u sprzedawcy."},
      "odometer-logical": {title: "Ocena licznika: logiczny", reported: "RDW ocenia ciąg rejestracji przebiegu jako logiczny.", why: "Ocena porównuje rejestracje, ale nie pokazuje pojedynczych odczytów.", action: "Porównaj faktury serwisowe z aktualnym przebiegiem."},
      "odometer-illogical": {title: "Ocena licznika: nielogiczny", reported: "RDW rejestruje nielogiczną ocenę przebiegu.", why: "Ciąg rejestracji wymaga dokładniejszego wyjaśnienia.", action: "Poproś o dokumenty i dokładnie sprawdź historię przebiegu."},
      "odometer-unknown": {title: "Brak użytecznej oceny licznika", reported: "RDW nie podaje oceny logiczny/nielogiczny dla tej rejestracji.", why: "Nie jest to automatycznie negatywne, ale daje mniej informacji kontrolnych.", action: "Sprawdź licznik, faktury i książkę serwisową."},
      "recall-clear": {title: "Brak otwartej akcji serwisowej", reported: "Oficjalne źródła pojazdu i statusu nie zgłaszają otwartej akcji.", why: "Dotyczy to bieżącego statusu w dostępnych danych RDW.", action: "W razie potrzeby poproś producenta lub dealera o kontrolę VIN."},
      "recall-open": {title: "Otwarta akcja serwisowa", reported: "RDW zgłasza co najmniej jedną otwartą akcję dla tej tablicy.", why: "Naprawa u producenta lub dealera może być nadal wymagana.", action: "Przekaż kod referencyjny dealerowi i potwierdź naprawę."},
      "recall-unknown": {title: "Niepełny status akcji serwisowych", reported: "Nie udało się w pełni potwierdzić dodatkowego źródła RDW.", why: "Brak źródła nie jest ani pozytywnym, ani negatywnym statusem auta.", action: "Sprawdź akcje u producenta lub dealera."},
      "transfer-possible": {title: "Przerejestrowanie możliwe", reported: "RDW podaje, że przerejestrowanie jest możliwe.", why: "To bieżący status rejestracyjny, a nie ocena techniczna.", action: "Sprawdź tożsamość i dokumenty podczas przekazania."},
      "transfer-blocked": {title: "Przerejestrowanie niemożliwe", reported: "RDW podaje, że obecnie nie można przerejestrować pojazdu.", why: "Transakcji nie da się normalnie sfinalizować.", action: "Poproś sprzedawcę o usunięcie oficjalnej blokady przed zakupem."},
      exported: {title: "Aktywny wskaźnik eksportu", reported: "RDW pokazuje wskaźnik eksportu dla tego pojazdu.", why: "Holenderski status rejestracji wymaga sprawdzenia.", action: "Przed płatnością sprawdź status i dokumenty."},
      "waiting-for-inspection": {title: "Pojazd oczekuje na kontrolę", reported: "RDW podaje, że pojazd oczekuje na kontrolę.", why: "Oficjalne badanie może być wymagane przed użytkowaniem lub rejestracją.", action: "Ustal w RDW lub u sprzedawcy, jaka kontrola jest wymagana."},
      "wam-uninsured": {title: "Brak ubezpieczenia WAM", reported: "RDW obecnie nie wykazuje ubezpieczenia WAM.", why: "Może to dotyczyć zapasu dealerskiego i nie oznacza automatycznie oszustwa.", action: "Potwierdź status i ubezpiecz auto przed jazdą."},
      "likely-import": {title: "Możliwy pojazd importowany", reported: "Daty pierwszego dopuszczenia i pierwszej rejestracji w NL są różne.", why: "Import nie jest automatycznie negatywny, ale ważne mogą być dokumenty zagraniczne.", action: "Poproś o dokumenty pochodzenia, serwisu i importu."},
      "recent-transfer": {title: "Niedawna zmiana rejestracji", reported: "Ostatnia rejestracja miała miejsce mniej niż 90 dni temu.", why: "Niedawna zmiana sama w sobie nie jest dowodem problemu.", action: "Zapytaj sprzedawcę o powód ostatniej zmiany."},
      "taxi-indicator": {title: "Aktywny wskaźnik taxi", reported: "RDW pokazuje oficjalny wskaźnik taxi dla tego pojazdu.", why: "To bieżący wskaźnik, a nie pełna historia użytkowania jako taxi.", action: "Zapytaj o sposób użytkowania, serwis i zużycie oraz sprawdź stan auta."}
    }
  }
};

const vehicleCheckSupplement: Record<Locale, VehicleCheckSupplement> = {
  nl: {
    compactText: "APK, tellerstand, terugroepacties en tenaamstelling in één korte samenvatting.",
    catalogPrice: "Oorspronkelijke catalogusprijs RDW",
    catalogPriceHelp: "Historische nieuwprijs in de RDW-registratie; dit is geen actuele marktwaarde.",
    grossBpm: "Bruto BPM bij registratie",
    grossBpmHelp: "Registratiegegeven uit RDW; dit is niet automatisch het huidige te betalen BPM-bedrag.",
    openRecallDetailsUnavailable: "RDW meldt een open terugroepactie. Details zijn tijdelijk niet beschikbaar.",
    secondaryDetails: "Alle voertuig-, milieu- en brongegevens",
    possibleImport: "Mogelijk importvoertuig",
    noImportSignal: "Geen importsignaal bij een datumverschil tot en met 30 dagen",
    openRecallReported: "Open terugroepactie gemeld",
    recallUnknown: "Terugroepstatus niet volledig beschikbaar",
    likelyImportSignal: {
      title: "Mogelijk importvoertuig",
      reported: "Tussen eerste toelating en eerste registratie in Nederland zit meer dan 30 dagen.",
      why: "Deze conservatieve NoordTune-presentatieregel is geen officiële RDW-classificatie van import of fraude.",
      action: "Vraag herkomst-, onderhouds- en importdocumenten op."
    }
  },
  en: {
    compactText: "APK, odometer judgement, recalls and transfer status in one concise summary.",
    catalogPrice: "Original RDW list price",
    catalogPriceHelp: "Historical new-vehicle price in the RDW registration; this is not the current market value.",
    grossBpm: "Gross BPM at registration",
    grossBpmHelp: "RDW registration information; this is not automatically the BPM currently payable.",
    openRecallDetailsUnavailable: "RDW reports an open recall. Details are temporarily unavailable.",
    secondaryDetails: "All vehicle, environment and source details",
    possibleImport: "Possible imported vehicle",
    noImportSignal: "No import signal for a date difference of 30 days or less",
    openRecallReported: "Open recall reported",
    recallUnknown: "Recall status not fully available",
    likelyImportSignal: {
      title: "Possible imported vehicle",
      reported: "The first admission and first registration in the Netherlands differ by more than 30 days.",
      why: "This conservative NoordTune presentation rule is not an official RDW import or fraud classification.",
      action: "Request origin, maintenance and import documents."
    }
  },
  pl: {
    compactText: "APK, ocena przebiegu, akcje serwisowe i możliwość rejestracji w krótkim podsumowaniu.",
    catalogPrice: "Pierwotna cena katalogowa RDW",
    catalogPriceHelp: "Historyczna cena nowego pojazdu w rejestrze RDW; nie jest to aktualna wartość rynkowa.",
    grossBpm: "BPM brutto przy rejestracji",
    grossBpmHelp: "Dane rejestracyjne RDW; nie oznaczają automatycznie aktualnej kwoty BPM do zapłaty.",
    openRecallDetailsUnavailable: "RDW zgłasza otwartą akcję serwisową. Szczegóły są chwilowo niedostępne.",
    secondaryDetails: "Wszystkie dane pojazdu, emisji i źródeł",
    possibleImport: "Możliwy pojazd importowany",
    noImportSignal: "Brak sygnału importu przy różnicy dat do 30 dni włącznie",
    openRecallReported: "Zgłoszona otwarta akcja serwisowa",
    recallUnknown: "Status akcji serwisowych nie jest w pełni dostępny",
    likelyImportSignal: {
      title: "Możliwy pojazd importowany",
      reported: "Między pierwszym dopuszczeniem a pierwszą rejestracją w Holandii jest ponad 30 dni różnicy.",
      why: "Ta ostrożna reguła prezentacji NoordTune nie jest oficjalną klasyfikacją importu ani oszustwa RDW.",
      action: "Poproś o dokumenty pochodzenia, serwisu i importu."
    }
  }
};

function getVehicleCheckCopy(locale: Locale): VehicleCheckCopy {
  const base = vehicleCheckCopy[locale];
  const supplement = vehicleCheckSupplement[locale];

  return {
    ...base,
    ...supplement,
    signals: {
      ...base.signals,
      "likely-import": supplement.likelyImportSignal
    }
  };
}
