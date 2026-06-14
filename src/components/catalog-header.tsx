import {MessageCircle} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {LanguageSwitcher} from "@/components/language-switcher";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {Button} from "@/components/ui/button";
import {mainLocaleHref, mainNavItems, whatsappPhoneLabel} from "@/lib/noordtune-links";
import {cn} from "@/lib/utils";
import {whatsappHref} from "@/lib/whatsapp";

export function CatalogHeader({
  className,
  languagePath = "",
  locale
}: {
  className?: string;
  languagePath?: string;
  locale: Locale;
}) {
  const navItems = mainNavItems(locale);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-black/86 backdrop-blur-xl",
        className
      )}
    >
      <div className="container flex min-h-[72px] items-center gap-3 py-2 xl:min-h-[84px]">
        <a
          aria-label="NoordTune.nl"
          className="shrink-0"
          href={mainLocaleHref(locale)}
          rel="noreferrer"
        >
          <NoordTuneLogo className="h-[54px] w-[188px] sm:h-[64px] sm:w-[222px] xl:h-[70px] xl:w-[244px]" />
        </a>

        <CatalogNav
          className="hidden flex-1 items-center justify-center gap-3 xl:flex 2xl:gap-4"
          items={navItems}
        />

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} path={languagePath} />
          <Button
            asChild
            className="hidden h-11 rounded-[3px] border border-white/20 bg-black/50 px-4 text-xs font-black uppercase text-white hover:border-primary hover:bg-primary/10 hover:text-primary sm:inline-flex"
            variant="outline"
          >
            <a href={whatsappHref({locale})} rel="noreferrer" target="_blank">
              <MessageCircle className="h-4 w-4" />
              {whatsappPhoneLabel}
            </a>
          </Button>
          <Button
            asChild
            aria-label="WhatsApp NoordTune"
            className="h-11 w-11 rounded-[3px] border border-[#25d366]/40 bg-[#25d366] p-0 text-white hover:bg-[#20bd5b] sm:hidden"
          >
            <a href={whatsappHref({locale})} rel="noreferrer" target="_blank">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      <CatalogNav
        className="container flex gap-3 overflow-x-auto border-t border-white/10 py-2 text-[0.68rem] xl:hidden"
        items={navItems}
      />
    </header>
  );
}

function CatalogNav({
  className,
  items
}: {
  className?: string;
  items: ReturnType<typeof mainNavItems>;
}) {
  return (
    <nav aria-label="Main menu" className={cn("text-white", className)}>
      {items.map((item) => (
        <a
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "whitespace-nowrap font-black uppercase tracking-normal transition hover:text-primary focus:outline-none focus-visible:text-primary",
            item.active
              ? "text-primary"
              : "text-white/86"
          )}
          href={item.href}
          key={`${item.label}-${item.href}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
