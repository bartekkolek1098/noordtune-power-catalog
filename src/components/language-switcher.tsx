import {type Locale, routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const languageLabels: Record<Locale, {flag: string; label: string}> = {
  nl: {flag: "🇳🇱", label: "Nederlands"},
  en: {flag: "🇬🇧", label: "English"},
  pl: {flag: "🇵🇱", label: "Polski"}
};

export function LanguageSwitcher({
  locale,
  path = "",
  paths
}: {
  locale: Locale;
  path?: string;
  paths?: Partial<Record<Locale, string>>;
}) {
  return (
    <nav aria-label="Language" className="flex shrink-0 items-center gap-1">
      {routing.locales.map((candidate) => {
        const item = languageLabels[candidate];
        const href = sitePath(paths?.[candidate] ?? `/${candidate}${path}`);

        return (
          <a
            aria-label={item.label}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[3px] border text-lg transition-colors min-[360px]:h-9 min-[360px]:w-9 min-[430px]:h-10 min-[430px]:w-10 min-[430px]:text-xl",
              candidate === locale
                ? "border-primary bg-primary/15 shadow-[0_0_24px_rgba(227,6,19,.28)]"
                : "border-white/10 bg-black/30 hover:border-primary/50 hover:bg-primary/10"
            )}
            href={href}
            key={candidate}
            title={item.label}
          >
            <span aria-hidden>{item.flag}</span>
          </a>
        );
      })}
    </nav>
  );
}
