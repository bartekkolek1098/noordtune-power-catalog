"use client";

import type {Locale} from "@/i18n/routing";
import type {PublicVehicleSourceExample} from "@/lib/public-vehicle-source-examples";
import {formatEstimateGain} from "@/lib/estimate-copy";

const copy = {
  nl: {
    eyebrow: "Stage 1 · bronvoorbeelden", title: "Er zijn vergelijkbare motorreferenties",
    note: "Voor deze brede cataloguskaart is het exacte Stage 1-resultaat nog niet bevestigd. De onderstaande afzonderlijke bronvoorbeelden gelden uitsluitend voor de aangegeven toepassingsjaren en origineel vermogen/koppel. Controle van motor, ECU, brandstof en uitvoering is vereist.",
    period: "Bronperiode", stock: "Bronserie", stage1: "Stage 1 bij deze bron", gain: "Verschil in deze bron",
    sources: "Gepubliceerde bronnen", review: "Bronnen verschillen; NoordTune controleert de toepasselijke configuratie.",
    contact: "Vraag Stage 1 voor mijn uitvoering aan",
    noSourceTitle: "Stage 1: controle van de exacte uitvoering",
    noSourceNote: "De fabrieksspecificaties staan hierboven. Voor deze combinatie hebben we nog geen toepasselijke, betrouwbare bron voor een specifiek Stage 1-getal. Vraag NoordTune om de motor- en ECU-variant te controleren en een persoonlijke vermogensindicatie te maken."
  },
  en: {
    eyebrow: "Stage 1 · source examples", title: "Comparable engine references are available",
    note: "The exact Stage 1 result is not confirmed for this broad catalog entry. These separate published source examples apply only to the listed application years and factory power/torque. Engine, ECU, fuel and installed vehicle configuration still require confirmation.",
    period: "Reference period", stock: "Source stock", stage1: "Stage 1 from this source", gain: "Difference for this source",
    sources: "Published sources", review: "Sources differ; NoordTune checks the applicable configuration.",
    contact: "Ask for Stage 1 on my exact vehicle",
    noSourceTitle: "Stage 1: exact configuration review",
    noSourceNote: "Factory specifications are shown above. We do not yet have a reliable Stage 1 output reference scoped to this full configuration. Ask NoordTune to verify the engine and ECU and provide a vehicle-specific power indication."
  },
  pl: {
    eyebrow: "Stage 1 · przykłady źródłowe", title: "Są wyniki dla porównywalnych wersji silnika",
    note: "Dokładny wynik Stage 1 nie jest jeszcze potwierdzony dla tej szerokiej karty katalogowej. Poniższe osobne przykłady dotyczą tylko wskazanych lat zastosowania i mocy oraz momentu seryjnego. NoordTune potwierdzi generację, ECU, paliwo i wersję auta przed ofertą.",
    period: "Lata referencji", stock: "Seria wg źródła", stage1: "Stage 1 wg źródła", gain: "Przyrost w tej referencji",
    sources: "Źródła publiczne", review: "Źródła różnią się; NoordTune sprawdzi właściwą konfigurację.",
    contact: "Zapytaj o Stage 1 dla mojego auta",
    noSourceTitle: "Stage 1: weryfikacja konkretnej wersji",
    noSourceNote: "Parametry seryjne są podane powyżej. Dla tej konfiguracji nie mamy jeszcze wiarygodnych, zgodnych źródeł pozwalających pokazać konkretną moc Stage 1. NoordTune sprawdzi silnik i ECU oraz przygotuje orientacyjną wycenę i wynik dla Twojego auta."
  }
} as const;

const showRange = (v: [number, number], unit: string) =>
  `${v[0] === v[1] ? v[0] : `${v[0]}–${v[1]}`} ${unit}`;

export function PublicVehicleSourceExamples({examples,locale,quoteHref}: {
  examples: readonly PublicVehicleSourceExample[];
  locale: Locale;
  quoteHref: string;
}) {
  const t=copy[locale], unit={nl:"pk",en:"hp",pl:"KM"}[locale];
  if (!examples.length) return (
    <section className="min-w-0 rounded-[3px] border border-amber-400/30 bg-amber-400/[.045] p-4 sm:p-5" data-testid="vehicle-stage1-review">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Stage 1</p>
      <h3 className="mt-2 text-xl font-black text-white">{t.noSourceTitle}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{t.noSourceNote}</p>
      <a className="mt-4 inline-flex min-h-11 items-center rounded-[3px] bg-primary px-4 py-2 text-sm font-black text-white" href={quoteHref} rel="noreferrer" target="_blank" data-testid="vehicle-review-quote">{t.contact}</a>
    </section>
  );
  return (
    <section className="min-w-0 rounded-[3px] border border-amber-400/30 bg-amber-400/[.045] p-4 sm:p-5" data-testid="vehicle-source-examples">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">{t.eyebrow}</p>
      <h3 className="mt-2 text-xl font-black text-white">{t.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{t.note}</p>
      <div className="mt-4 grid min-w-0 gap-3">
        {examples.map(example => {
          const raw={powerRangeHp:example.stage1PowerRangeHp,torqueRangeNm:example.stage1TorqueRangeNm,approximate:true};
          const gain=formatEstimateGain(raw,example.stockPowerHp,example.stockTorqueNm,locale);
          return (
            <article className="min-w-0 rounded border border-white/10 bg-black/35 p-3 sm:p-4" data-testid="vehicle-source-example" key={example.sourceProfileId+`-${example.yearFrom}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="break-words text-sm font-bold text-white">{example.generation}</div>
                <div className="text-xs font-semibold text-amber-200">{t.period}: {example.yearFrom}{example.yearFrom===example.yearTo?"":`–${example.yearTo}`}</div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div><div className="text-xs text-slate-400">{t.stock}</div><div className="mt-1 text-sm font-semibold text-white">{example.stockPowerHp} {unit} / {example.stockTorqueNm} Nm</div></div>
                <div><div className="text-xs text-slate-400">{t.stage1}</div><div className="mt-1 text-sm font-semibold text-white">{showRange(example.stage1PowerRangeHp,unit)}{example.stage1TorqueRangeNm?` / ${showRange(example.stage1TorqueRangeNm,"Nm")}`:""}</div></div>
                <div><div className="text-xs text-slate-400">{t.gain}</div><div className="mt-1 text-sm font-semibold text-amber-200">{gain}</div></div>
              </div>
              {example.ownerReviewRequired ? <p className="mt-2 text-xs text-amber-200">{t.review}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-400">{t.sources}:</span>
                {example.sourceUrls.map((url,index)=>(
                  <a className="break-all font-semibold text-amber-200 underline underline-offset-2" href={url} key={url} rel="noopener noreferrer nofollow" target="_blank">#{index+1}</a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <a className="mt-4 inline-flex min-h-11 items-center rounded-[3px] bg-primary px-4 py-2 text-sm font-black text-white" href={quoteHref} rel="noreferrer" target="_blank" data-testid="vehicle-source-quote">{t.contact}</a>
    </section>
  );
}
