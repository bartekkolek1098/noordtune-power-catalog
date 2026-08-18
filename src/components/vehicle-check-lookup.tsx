"use client";

import {AnimatePresence, motion} from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  Loader2,
  Search,
  ShieldCheck
} from "lucide-react";
import {useState} from "react";
import {RdwPurchaseCheck} from "@/components/rdw-purchase-check";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import type {Locale} from "@/i18n/routing";
import type {RdwVehicleCheckResult} from "@/lib/rdw-types";
import {sitePath} from "@/lib/site-path";

type VehicleCheckLookupCopy = {
  label: string;
  placeholder: string;
  submit: string;
  loading: string;
  notFound: string;
  invalid: string;
  source: string;
  detected: string;
};

type LookupError = {
  code: string;
  message: string;
};

export function VehicleCheckLookup({
  locale,
  text
}: {
  locale: Locale;
  text: VehicleCheckLookupCopy;
}) {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<RdwVehicleCheckResult | null>(null);
  const [error, setError] = useState<LookupError | null>(null);
  const [loading, setLoading] = useState(false);
  const copy = runtimeCopy[locale];
  const powerUnit = locale === "en" ? "hp" : locale === "pl" ? "KM" : "pk";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(sitePath("/api/rdw-vehicle-check"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

      setResult(payload as RdwVehicleCheckResult);
    } catch {
      setError({code: "NETWORK_ERROR", message: copy.networkError});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="panel-edge min-w-0 carbon-panel border-primary/20 shadow-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              {text.label}
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{text.source}</p>
          </div>
          <Badge className="border-primary/30 bg-primary/10 text-primary">RDW</Badge>
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? text.loading : text.submit}
            </Button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              animate={{opacity: 1, y: 0}}
              className="mt-5 rounded-[3px] border border-destructive/30 bg-destructive/10 p-4 text-sm text-red-100"
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
              data-testid="vehicle-check-result"
              exit={{opacity: 0, y: -8}}
              initial={{opacity: 0, y: 8}}
            >
              <div className="rounded-[3px] border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    {text.detected}
                  </div>
                  <Badge variant={result.cached ? "secondary" : "default"}>
                    {result.cached ? copy.cacheHit : copy.cacheMiss}
                  </Badge>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="mt-1 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <div className="text-2xl font-black">
                      {result.vehicle.make} {result.vehicle.model}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{result.vehicle.fuel ?? copy.unknownFuel}</span>
                      <span>
                        {result.vehicle.engine.displacementCc ?? "-"} cc ·{" "}
                        {result.vehicle.engine.powerHp ?? "-"} {powerUnit}
                      </span>
                      <span>{result.vehicle.body ?? result.vehicle.vehicleType ?? "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-xs text-muted-foreground">
                  <span>{copy.checkedAt}: {formatCheckedAt(result.fetchedAt, locale)}</span>
                  {result.cached ? <span>{copy.temporaryCache}</span> : null}
                </div>
              </div>

              <RdwPurchaseCheck locale={locale} result={result} />

              <div className="flex flex-col gap-3 rounded-[3px] border border-white/10 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted-foreground">{copy.tuningCrossLink}</p>
                <Button asChild className="shrink-0 rounded-[3px]" variant="outline">
                  <a href={sitePath(`/${locale}`)}>
                    {copy.tuningLink}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

const runtimeCopy: Record<Locale, {
  cacheHit: string;
  cacheMiss: string;
  checkedAt: string;
  networkError: string;
  temporaryCache: string;
  tuningCrossLink: string;
  tuningLink: string;
  unknownFuel: string;
}> = {
  nl: {
    cacheHit: "tijdelijke cache",
    cacheMiss: "nieuw van RDW",
    checkedAt: "RDW gecontroleerd",
    networkError: "De RDW-kentekencheck kon niet worden geladen.",
    temporaryCache: "Herbruikt uit tijdelijke cache",
    tuningCrossLink: "Wil je weten wat er veilig mogelijk is met deze auto?",
    tuningLink: "Bekijk ook de tuningmogelijkheden",
    unknownFuel: "Brandstof onbekend"
  },
  en: {
    cacheHit: "temporary cache",
    cacheMiss: "fresh from RDW",
    checkedAt: "RDW checked",
    networkError: "The RDW Vehicle Check could not be loaded.",
    temporaryCache: "Reused from temporary cache",
    tuningCrossLink: "Would you like to see the safe tuning potential for this car?",
    tuningLink: "View tuning possibilities",
    unknownFuel: "Fuel unknown"
  },
  pl: {
    cacheHit: "tymczasowy cache",
    cacheMiss: "nowe dane z RDW",
    checkedAt: "Sprawdzono w RDW",
    networkError: "Nie udało się załadować kontroli pojazdu RDW.",
    temporaryCache: "Wynik z tymczasowej pamięci cache",
    tuningCrossLink: "Chcesz sprawdzić bezpieczne możliwości tuningu tego auta?",
    tuningLink: "Sprawdź również możliwości tuningu",
    unknownFuel: "Paliwo nieznane"
  }
};

function formatCheckedAt(value: string, locale: Locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : locale === "pl" ? "pl-PL" : "nl-NL",
    {dateStyle: "medium", timeStyle: "short"}
  ).format(date);
}
