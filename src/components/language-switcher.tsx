import {type Locale, routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const languageLabels: Record<Locale, {flag: string; label: string}> = {
  nl: {flag: "🇳🇱", label: "Nederlands"},
  en: {flag: "🇬🇧", label: "English"},
  pl: {flag: "🇵🇱", label: "Polski"}
};

const mainSiteUrl = "https://noordtune.nl";

const menuLabels: Record<Locale, string[]> = {
  nl: ["HOME", "KATALOG MOCY", "DIAGNOSE", "WERKWIJZE", "RESULTATEN", "OVER ONS", "CONTACT"],
  en: ["HOME", "POWER CATALOG", "DIAGNOSTICS", "PROCESS", "RESULTS", "ABOUT", "CONTACT"],
  pl: ["HOME", "KATALOG MOCY", "DIAGNOSTYKA", "JAK DZIALAMY", "REALIZACJE", "O NAS", "KONTAKT"]
};

export function LanguageSwitcher({
  locale,
  path = ""
}: {
  locale: Locale;
  path?: string;
}) {
  const menuHrefs = [
    `${mainSiteUrl}/`,
    sitePath(`/${locale}`),
    `${mainSiteUrl}/#diagnose`,
    `${mainSiteUrl}/#werkwijze`,
    `${mainSiteUrl}/#resultaten`,
    `${mainSiteUrl}/#over-ons`,
    `${mainSiteUrl}/#contact`
  ];
  const menuScript = `
(() => {
  const script = document.currentScript;
  const header = script && script.closest("header");
  const languageNav = script && script.previousElementSibling;

  if (!header || !languageNav) return;

  const labels = ${JSON.stringify(menuLabels[locale])};
  const hrefs = ${JSON.stringify(menuHrefs)};
  const navClass = "flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.72rem] font-black uppercase tracking-normal text-white";
  const activeClass = "transition hover:text-primary text-primary";
  const linkClass = "transition hover:text-primary text-white";
  let menu = Array.from(header.querySelectorAll("nav")).find(
    (item) => item.getAttribute("aria-label") !== "Language"
  );

  if (!menu) {
    menu = document.createElement("nav");
    header.insertBefore(menu, languageNav);
  }

  menu.setAttribute("aria-label", "Main menu");
  menu.className = navClass;
  menu.innerHTML = labels.map((label, index) => {
    const current = index === 1 ? ' aria-current="page"' : "";
    const className = index === 1 ? activeClass : linkClass;
    return '<a' + current + ' class="' + className + '" href="' + hrefs[index] + '">' + label + '</a>';
  }).join("");
})();
`;

  return (
    <>
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
      <script dangerouslySetInnerHTML={{__html: menuScript}} />
    </>
  );
}
