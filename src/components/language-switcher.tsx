"use client";

import {Check, ChevronDown, Globe2} from "lucide-react";
import {usePathname} from "next/navigation";
import {useEffect, useId, useRef, useState} from "react";
import {sharedLocaleCookieName, type Locale, routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const languageLabels: Record<Locale, {name: string; flag: string; label: string}> = {
  nl: {name: "Nederlands", flag: "🇳🇱", label: "NL"},
  en: {name: "English", flag: "🇬🇧", label: "EN"},
  pl: {name: "Polski", flag: "🇵🇱", label: "PL"}
};

const languagePrompt: Record<Locale, string> = {
  nl: "Taal",
  en: "Language",
  pl: "Język"
};

function setPreferredLanguage(language: Locale) {
  const host = window.location.hostname;
  const sharedDomain = host === "noordtune.nl" || host.endsWith(".noordtune.nl")
    ? "; Domain=.noordtune.nl"
    : "";
  // Same authoritative cookie as www.noordtune.nl, without ambiguity from
  // older host-only noordtune_locale and NEXT_LOCALE cookies.
  document.cookie = `${sharedLocaleCookieName}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${sharedDomain}`;
  document.cookie = `noordtune_locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax${sharedDomain}`;
}

export function LanguageSwitcher({
  locale,
  path = "",
  compact = false,
  expanded = false,
  className
}: {
  locale: Locale;
  path?: string;
  compact?: boolean;
  expanded?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open || expanded) return;
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapper.current?.contains(event.target)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, expanded]);

  const options = routing.locales.map((candidate) => {
    const item = languageLabels[candidate];
    const active = candidate === locale;
    return (
      <a
        aria-current={active ? "page" : undefined}
        aria-label={`Switch to ${item.name}`}
        className={cn(
          "flex min-h-11 min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          expanded ? "flex-col justify-center gap-1 text-center" : "w-full",
          active
            ? "border-primary/75 bg-primary/15 text-white"
            : "border-white/15 bg-white/[0.04] text-white/85 hover:border-primary/65 hover:bg-white/[0.09]"
        )}
        href={sitePath(`/${candidate}${path}`)}
        hrefLang={candidate}
        key={candidate}
        lang={candidate}
        onClick={() => {
          setPreferredLanguage(candidate);
          setOpen(false);
        }}
      >
        <span aria-hidden="true" className="text-lg">{item.flag}</span>
        <span className={cn("min-w-0", expanded && "flex flex-col items-center")}>
          <span className="block text-xs font-black uppercase tracking-wide">{item.label}</span>
          <span className="block text-[0.7rem] font-medium text-white/75">{item.name}</span>
        </span>
        {!expanded && active ? <Check aria-hidden="true" className="ml-auto h-4 w-4 text-primary" /> : null}
      </a>
    );
  });

  if (expanded) {
    return (
      <div aria-label="Language switcher" className={cn("min-w-0", className)} data-testid="language-switcher-expanded">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] text-white">
          <Globe2 aria-hidden="true" className="h-4 w-4 text-primary" />
          Taal / Language / Język
        </p>
        <nav aria-label="Choose website language" className="grid min-w-0 grid-cols-3 gap-2">
          {options}
        </nav>
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0", className)} ref={wrapper} data-testid="language-switcher">
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${languagePrompt[locale]}: ${languageLabels[locale].name} – change language`}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-primary/75 bg-[#191b1d] px-2.5 py-2 text-sm font-black text-white shadow-[0_0_12px_rgba(227,6,19,.16)] transition hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-[420px]:px-3"
        data-testid="language-switcher-trigger"
        onClick={() => setOpen(current => !current)}
        ref={trigger}
        type="button"
      >
        <Globe2 aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        <span className={cn(compact ? "hidden min-[420px]:inline" : "inline", "text-xs")}>
          {languagePrompt[locale]}
        </span>
        <span className="text-xs">{locale.toUpperCase()}</span>
        <ChevronDown aria-hidden="true" className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <nav
          aria-label="Choose website language"
          className="absolute right-0 top-full z-[100] mt-2 w-56 max-w-[calc(100vw-2rem)] space-y-1.5 rounded-lg border border-white/25 bg-[#111416] p-2 shadow-[0_16px_38px_rgba(0,0,0,.8)]"
          data-testid="language-switcher-options"
          id={menuId}
        >
          {options}
        </nav>
      ) : null}
    </div>
  );
}
