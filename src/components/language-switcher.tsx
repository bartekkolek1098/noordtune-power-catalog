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
  path = ""
}: {
  locale: Locale;
  path?: string;
}) {
  return (
    <nav aria-label="Language" className="flex items-center gap-1">
      {routing.locales.map((candidate) => {
        const item = languageLabels[candidate];
        const href = sitePath(`/${candidate}${path}`);

        return (
          <a
            aria-label={item.label}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md border text-xl transition-colors",
              candidate === locale
                ? "border-primary bg-primary/15 shadow-[0_0_24px_rgba(226,0,15,.28)]"
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
