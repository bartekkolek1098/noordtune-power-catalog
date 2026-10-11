"use client";
import type {ManualCatalogResult} from "@/data/manual-catalog-result";
import type {Locale} from "@/i18n/routing";
import {whatsappHref} from "@/lib/whatsapp";
import {Button} from "@/components/ui/button";

const copy = {
  pl: {heading: "Dane wybranego auta", catalog: "Wybór ręczny · dane katalogowe", year: "Rok", choose: "Wybierz rok", stock: "Seryjnie", stage: "Stage 1", gain: "Przyrost", torque: "Moment", fuel: "Paliwo", pending: "Do sprawdzenia", source: "Porównanie opublikowanych wyników", empty: "Dane tego silnika są w katalogu, ale nie mamy jeszcze pasującego wyniku Stage 1 ze źródłami. To nie oznacza, że tuning jest niemożliwy.", selectYear: "Wybierz rok, aby sprawdzić źródła dla właściwej generacji silnika.", notice: "Wybór ręczny nie potwierdza konkretnego egzemplarza. To wskazania dostawców, nie pomiar ani gwarancja. Przed realizacją sprawdzimy silnik, ECU, skrzynię i paliwo.", fuelNote: "Dane źródłowe zależą od paliwa. Wyższa wartość może wymagać wyższej liczby oktanowej.", stockNote: "Moc z katalogu; moment seryjny ze źródła silnika — nie z RDW.", sources: "Źródła i warunki", ask: "Zapytaj o ten silnik", plate: "Sprawdź także po tablicy", message: "Cześć NoordTune, proszę o sprawdzenie możliwości Stage 1 dla ręcznie wybranej wersji:", petrol: "Benzyna", diesel: "Diesel", electric: "Elektryczny", hybrid: "Hybryda", unknown: "Nieustalone"},
  nl: {heading: "Gegevens van jouw selectie", catalog: "Handmatig gekozen · catalogusgegevens", year: "Jaar", choose: "Kies het jaar", stock: "Origineel", stage: "Stage 1", gain: "Vermogenswinst", torque: "Koppel", fuel: "Brandstof", pending: "Te controleren", source: "Vergelijking van gepubliceerde waarden", empty: "Deze motor staat in de catalogus, maar er is nog geen passende Stage 1-bron voor deze selectie. Dit betekent niet dat tuning onmogelijk is.", selectYear: "Kies het jaar om de bronnen voor de juiste motorgeneratie te controleren.", notice: "Een handmatige keuze bevestigt geen individueel voertuig. Dit zijn leverancierindicaties, geen meting of garantie. Motor, ECU, transmissie en brandstof controleren we vóór uitvoering.", fuelNote: "De bronwaarden zijn brandstofafhankelijk. Een hogere waarde kan een hoger octaangetal vereisen.", stockNote: "Vermogen uit de catalogus; origineel koppel uit de motorbron, niet uit RDW.", sources: "Bronnen en voorwaarden", ask: "Vraag advies voor deze motor", plate: "Controleer ook je kenteken", message: "Hallo NoordTune, graag advies over Stage 1 voor deze handmatig gekozen uitvoering:", petrol: "Benzine", diesel: "Diesel", electric: "Elektrisch", hybrid: "Hybride", unknown: "Onbekend"},
  en: {heading: "Your selected vehicle", catalog: "Manual selection · catalog data", year: "Year", choose: "Choose the year", stock: "Original", stage: "Stage 1", gain: "Power gain", torque: "Torque", fuel: "Fuel", pending: "To be checked", source: "Comparison of published figures", empty: "This engine is in the catalog, but no matching source-backed Stage 1 result is available for this selection yet. That does not mean tuning is impossible.", selectYear: "Choose the year to check sources for the correct engine generation.", notice: "A manual selection does not identify an individual vehicle. These are supplier indications, not a measurement or guarantee. We check engine, ECU, transmission and fuel before work.", fuelNote: "Source figures depend on fuel. A higher figure may require a higher octane grade.", stockNote: "Power from the catalog; original torque from the engine source, not RDW.", sources: "Sources and conditions", ask: "Ask about this engine", plate: "Also check by plate", message: "Hello NoordTune, please check Stage 1 options for this manually selected version:", petrol: "Petrol", diesel: "Diesel", electric: "Electric", hybrid: "Hybrid", unknown: "Unknown"}
} as const;

export function ManualCatalogDetails({result, locale, onYearChange}: {
  result: ManualCatalogResult; locale: Locale; onYearChange: (year: string) => void;
}) {
  const t = copy[locale], v = result.vehicle, stage = result.stage1;
  const unit = locale === "pl" ? "KM" : locale === "nl" ? "pk" : "hp";
  const fmt = (value: number) => new Intl.NumberFormat(locale).format(value);
  const range = (values: [number, number]) => values[0] === values[1] ? fmt(values[0]) : `${fmt(values[0])}–${fmt(values[1])}`;
  const fuel = ({Petrol: t.petrol, Diesel: t.diesel, Electric: t.electric, Hybrid: t.hybrid} as Record<string, string>)[v.fuel] ?? t.unknown;
  const engine = v.engine.replace(/\b(\d+)\s*KM\b/g, `$1 ${unit}`);
  const gain: [number, number] | undefined = stage && v.stockPowerHp ? [stage.powerHp[0] - v.stockPowerHp, stage.powerHp[1] - v.stockPowerHp] : undefined;
  const contact = () => {
    const message = [t.message, `${v.brand} ${v.model} · ${v.generation}`, engine,
      v.selectedYear ? `${t.year}: ${v.selectedYear}` : `${v.yearFrom}–${v.yearTo}`, `${t.fuel}: ${fuel}`].join("\n");
    window.open(whatsappHref({locale, message}), "_blank", "noopener,noreferrer");
  };
  return <section className="manual-catalog-details min-w-0 space-y-4" data-testid="manual-catalog-details" data-selection-id={v.id} data-result-status={result.status}>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{t.catalog}</p>
      <h3 className="mt-2 text-xl font-black text-white">{t.heading}</h3>
      <p className="mt-1 font-semibold text-white">{v.brand} {v.model} · {v.generation}</p>
      <p className="mt-1 break-words text-sm text-slate-300">{engine} · {fuel}</p>
    </div>
    <label className="block text-sm font-semibold text-slate-300">{t.year}
      <select className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-[#101314] px-3 text-white" data-testid="manual-result-year" value={v.selectedYear ?? ""} onChange={event => onYearChange(event.target.value)}>
        <option value="">{t.choose}</option>
        {Array.from({length: v.yearTo - v.yearFrom + 1}, (_, i) => v.yearTo - i).map(year => <option key={year} value={year}>{year}</option>)}
      </select>
    </label>
    <div className="grid gap-3 sm:grid-cols-3" data-testid="manual-performance-cards">
      <div className="min-w-0 rounded-xl border border-white/15 bg-black/25 p-3">
        <p className="text-xs text-slate-300">{t.stock}</p><p className="mt-2 break-words text-xl font-black text-white" data-testid="manual-stock-power">{v.stockPowerHp ? `${fmt(v.stockPowerHp)} ${unit}` : t.pending}</p>
        {v.stockPowerKw ? <p className="mt-1 text-xs text-slate-400">{fmt(v.stockPowerKw)} kW</p> : null}
        {stage?.stockTorqueNm ? <p className="mt-3 text-xs text-slate-300">{t.torque}: {fmt(stage.stockTorqueNm)} Nm</p> : null}
      </div>
      <div className="min-w-0 rounded-xl border border-primary/60 bg-primary/10 p-3">
        <p className="text-xs text-slate-300">{t.stage}</p><p className="mt-2 break-words text-xl font-black text-white" data-testid="manual-stage1-power">{stage ? `${range(stage.powerHp)} ${unit}` : t.pending}</p>
        {stage?.torqueNm ? <p className="mt-3 text-xs text-slate-300">{t.torque}: {range(stage.torqueNm)} Nm</p> : null}
      </div>
      <div className="min-w-0 rounded-xl border border-emerald-300/30 bg-emerald-400/5 p-3">
        <p className="text-xs text-slate-300">{t.gain}</p><p className="mt-2 break-words text-xl font-black text-emerald-200" data-testid="manual-power-gain">{gain ? `+${range(gain)} ${unit}` : t.pending}</p>
      </div>
    </div>
    {!stage ? <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-300" data-testid="manual-result-pending">{result.status === "select-year" ? t.selectYear : t.empty}</p> : <div className="space-y-2 text-xs leading-5 text-slate-300">
      <p>{t.source}. {t.stockNote}</p><p>{t.notice}</p>
      {result.fuelRon.length ? <p data-testid="manual-fuel-condition">RON {result.fuelRon.join(" / ")}. {t.fuelNote}</p> : null}
    </div>}
    {result.sources.length ? <details className="rounded-lg border border-white/15 p-3" data-testid="manual-catalog-sources">
      <summary className="cursor-pointer text-sm font-bold text-white">{t.sources} ({result.sources.length})</summary>
      <ul className="mt-3 space-y-3 text-sm">{result.sources.map(source => <li key={source.url} className="break-words"><a className="text-primary underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a><p className="text-slate-300">{fmt(source.powerHp)} {unit}{source.torqueNm ? ` / ${fmt(source.torqueNm)} Nm` : ""}</p></li>)}</ul>
    </details> : null}
    <div className="flex flex-wrap gap-3">
      <Button className="h-auto min-h-11 whitespace-normal px-4 py-3 text-sm font-bold" data-testid="manual-catalog-contact" onClick={contact} type="button">{t.ask}</Button>
      <a className="inline-flex min-h-11 items-center text-sm text-slate-300 underline" href="#rdw-check" data-testid="manual-optional-plate" onClick={event => {
        const input = document.querySelector<HTMLInputElement>('#rdw-check input');
        if (input) {event.preventDefault(); input.focus({preventScroll: true}); document.getElementById('rdw-check')?.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});}
      }}>{t.plate}</a>
    </div>
  </section>;
}
