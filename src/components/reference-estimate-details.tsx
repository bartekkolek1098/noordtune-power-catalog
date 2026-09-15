"use client";

import {Check, MessageCircle, Sparkles} from "lucide-react";
import {useState} from "react";
import {serviceOptions} from "@/data/catalog-shared";
import type {TuningEstimateProfile} from "@/data/tuning-estimates-shared";
import {
  addQuoteOptions, assessVehicleAccess, conditionalBudgetNote,
  formatAccessAssessment, formatQuote, formatQuoteScope, resolveStageQuote
} from "@/data/pricing";
import type {Locale} from "@/i18n/routing";
import {localizeServiceOption} from "@/lib/service-copy";
import {formatCurrency} from "@/lib/utils";
import {isVehicleServiceSelectable} from "@/lib/vehicle-services";
import {createVehicleQuoteMessage, whatsappHref} from "@/lib/whatsapp";
import {PowerChart} from "@/components/power-chart";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

type ReferenceDetailsProps = {profile: TuningEstimateProfile; locale: Locale};

/** Inline manual reference selection. This creates neither a route nor registered vehicle facts. */
export function ReferenceEstimateDetails(props: ReferenceDetailsProps) {
  return <ReferenceSetup key={props.profile.id} {...props} />;
}

function ReferenceSetup({profile, locale}: ReferenceDetailsProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const text = copy[locale];
  const stage = profile.stages[stageIndex] ?? profile.stages[0];
  const access = assessVehicleAccess(profile);
  const availableOptions = serviceOptions.filter(option => isVehicleServiceSelectable(profile, option))
    .map(option => localizeServiceOption(option, locale));
  const selected = availableOptions.filter(option => selectedOptions.includes(option.id));
  const optionsCents = selected.reduce((sum, option) => sum + Math.round(option.price * 100), 0);
  const quote = addQuoteOptions(resolveStageQuote(profile, stage, {scope: "vehicle", estimateApplicable: true, access}), optionsCents);
  const budget = conditionalBudgetNote(quote, locale);
  const powerUnit = locale === "nl" ? "pk" : locale === "pl" ? "KM" : "hp";
  const localeCode = locale === "nl" ? "nl-NL" : locale === "pl" ? "pl-PL" : "en-US";
  const label = `${profile.brand} ${profile.model} ${profile.engine}`;
  const quoteHref = whatsappHref({locale, message: createVehicleQuoteMessage({
    locale, vehicle: `${profile.brand} ${profile.model}`, fuel: profile.fuel, vehiclePower: `${profile.stockPowerHp} ${powerUnit}`,
    engine: profile.engine, estimateProfileLabel: label,
    indicativeOutput: {powerHp: stage?.powerHp, torqueNm: stage?.torqueNm},
    quote, access, stage: stage?.name ?? "Stage 1", options: selected.map(option => option.name)
  })});
  const isConnect = profile.id === "ref-ford-transit-connect-15-tdci-100";

  return (
    <section className="min-w-0 space-y-4 border-t border-white/10 pt-5" data-testid="manual-reference-details" data-profile-id={profile.id}>
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        <div className="min-w-0 rounded-[3px] border border-white/10 bg-black/35 p-4">
          <Badge className="mb-3 border-primary/35 bg-primary/15 text-primary">{text.indication}</Badge>
          <h3 className="racing-title break-words text-2xl leading-tight text-white">{profile.brand} {profile.model}</h3>
          <p className="mt-2 break-words text-sm text-muted-foreground">{profile.engine} · {profile.generation}</p>
          <p className="mt-3 text-xl font-black" data-testid="manual-reference-output">
            {profile.stockPowerHp} → {stage?.powerHp ?? text.pending} {powerUnit}
            {stage?.torqueNm !== undefined ? ` · ${stage.torqueNm} Nm` : ""}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{text.verification}</p>
          {isConnect ? <p className="mt-2 text-xs leading-5 text-muted-foreground" data-testid="manual-connect-condition">{text.connectCondition}</p> : null}
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{stage?.requirements}</p>
          <Button className="mt-4 h-auto min-h-11 max-w-full whitespace-normal rounded-[3px] text-center" onClick={() => setStageIndex(0)} type="button" variant="outline">
            <Sparkles className="h-4 w-4 shrink-0" />{text.recommendation}
          </Button>
        </div>

        <div className="min-w-0 rounded-[3px] border border-primary/30 bg-[linear-gradient(145deg,rgba(227,6,19,.16),rgba(0,0,0,.42))] p-4">
          <div className="text-sm font-black uppercase tracking-[0.16em] text-primary">{text.calculator}</div>
          <div className="mt-2 break-words text-3xl font-black" data-testid="manual-reference-price">{formatQuote(quote, locale)}</div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{formatQuoteScope(quote, locale)}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{formatAccessAssessment(access, locale)} {budget}</p>
          <Button asChild className="mt-4 h-auto min-h-12 w-full whitespace-normal rounded-[3px] py-3 text-center text-sm font-black uppercase leading-tight">
            <a data-testid="manual-reference-quote" href={quoteHref} rel="noreferrer" target="_blank"><MessageCircle className="h-4 w-4 shrink-0" />{text.quote}</a>
          </Button>
        </div>
      </div>

      <div className="min-w-0 rounded-[3px] border border-white/10 bg-black/25 p-4">
        <PowerChart locale={locale} powerUnit={powerUnit} stages={profile.stages} stockPower={profile.stockPowerHp} stockTorque={profile.stockTorqueNm} stockLabel={text.stock} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        <div className="min-w-0 rounded-[3px] border border-white/10 p-4">
          <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-primary">{text.selectStage}</div>
          <div className="space-y-2">
            {profile.stages.map((candidate, index) => (
              <button className={`w-full rounded-[3px] border p-3 text-left transition ${stageIndex === index ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.035] hover:border-primary/50"}`} key={candidate.name} onClick={() => setStageIndex(index)} type="button" aria-pressed={stageIndex === index} data-testid="manual-reference-stage" data-stage={candidate.name}>
                <span className="flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-2 font-bold">{stageIndex === index ? <Check className="h-4 w-4" /> : null}{candidate.name}</span><span className="text-xs text-primary">{formatQuote(resolveStageQuote(profile, candidate, {scope: "vehicle", estimateApplicable: true, access}), locale)}</span></span>
                <span className="mt-2 block text-sm text-muted-foreground">{candidate.powerHp !== undefined ? `${candidate.powerHp} ${powerUnit}` : text.pending} / {candidate.torqueNm !== undefined ? `${candidate.torqueNm} Nm` : text.pending}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-[3px] border border-white/10 p-4">
          <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-primary">{text.options}</div>
          <div className="space-y-2">
            {availableOptions.map(option => (
              <label className="flex min-w-0 cursor-pointer flex-wrap items-start justify-between gap-3 rounded-[3px] border border-white/10 bg-white/[0.035] p-3 text-sm" key={option.id}>
                <span className="min-w-0 flex-1 basis-28"><span className="block font-semibold">{option.name}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.description}</span></span>
                <span className="flex shrink-0 items-center gap-3"><span className="text-muted-foreground">{formatCurrency(option.price, localeCode)}</span><input checked={selectedOptions.includes(option.id)} className="h-4 w-4 accent-[#e2000f]" onChange={() => setSelectedOptions(current => current.includes(option.id) ? current.filter(id => id !== option.id) : [...current, option.id])} type="checkbox" data-option-id={option.id} /></span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <details className="min-w-0 rounded-[3px] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-muted-foreground" data-testid="manual-reference-sources">
        <summary className="cursor-pointer font-semibold text-white">{text.details}</summary>
        <p className="mt-3">{stage?.requirements}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">{stage?.packageItems.map(item => <li key={item}>{item}</li>)}</ul>
        <ul className="mt-2 list-disc space-y-1 pl-4">{profile.conditions.map(condition => <li key={condition}>{condition}</li>)}</ul>
        <ul className="mt-3 space-y-3">{profile.sourceReferences.map(source => (
          <li className="break-words" key={source.title}>{source.url ? <a className="text-primary underline" href={source.url} rel="noreferrer" target="_blank">{source.title}</a> : source.title}<span className="mt-1 block text-xs">{source.scope}</span>{source.retrievedAt ? <span className="block text-xs">{text.retrieved}: {source.retrievedAt}</span> : null}</li>
        ))}</ul>
      </details>
      <Button asChild className="h-auto min-h-12 w-full whitespace-normal rounded-[3px] py-3 text-center text-sm font-black uppercase leading-tight" variant="outline">
        <a href={quoteHref} rel="noreferrer" target="_blank"><MessageCircle className="h-4 w-4 shrink-0" />{text.quote}</a>
      </Button>
    </section>
  );
}

const copy = {
  nl: {
    indication: "Catalogusindicatie", verification: "Indicatieve referentiewaarden. ECU-, voertuig- en hardwarecontrole vóór uitvoering.",
    connectCondition: "Referentie voor 1.5 TDCi vóór de facelift. Een eerste toelating in 2018 bevestigt niet of dit TDCi of EcoBlue is; controleer de motorgeneratie voordat deze waarden worden toegepast.",
    pending: "Te bevestigen", recommendation: "Aanbevolen startpunt: Stage 1", calculator: "Prijsindicatie", quote: "Vraag offerte voor deze setup", stock: "Stock",
    selectStage: "Kies Stage", options: "Opties", details: "Referentie, voorwaarden en Stage-details", retrieved: "Bron geraadpleegd"
  },
  en: {
    indication: "Catalog estimate", verification: "Indicative reference values. ECU, vehicle and hardware checks before work.",
    connectCondition: "Reference for the pre-facelift 1.5 TDCi. First registration in 2018 does not establish TDCi or EcoBlue; identify the engine generation before applying these figures.",
    pending: "To be confirmed", recommendation: "Recommended starting point: Stage 1", calculator: "Price estimate", quote: "Request a quote for this setup", stock: "Stock",
    selectStage: "Select Stage", options: "Options", details: "References, conditions and Stage details", retrieved: "Source retrieved"
  },
  pl: {
    indication: "Wartości katalogowe", verification: "Orientacyjne wartości referencyjne. Kontrola ECU, pojazdu i osprzętu przed wykonaniem.",
    connectCondition: "Referencja dla 1.5 TDCi przed liftingiem. Pierwsza rejestracja w 2018 r. nie potwierdza TDCi ani EcoBlue; przed zastosowaniem tych wartości należy ustalić generację silnika.",
    pending: "Do potwierdzenia", recommendation: "Zalecany punkt wyjścia: Stage 1", calculator: "Orientacyjna cena", quote: "Poproś o wycenę konfiguracji", stock: "Seria",
    selectStage: "Wybierz Stage", options: "Opcje", details: "Źródła, warunki i szczegóły Stage", retrieved: "Data dostępu do źródła"
  }
} as const;
