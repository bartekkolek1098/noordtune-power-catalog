import {Clock, Mail, MapPin, MessageCircle, Phone} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {
  localizedBusinessLocation,
  NOORDTUNE_BUSINESS
} from "@/lib/business-info";
import {
  footerCopy,
  legalLinks,
  mainLocaleHref,
  mainNavItems,
  whatsappPhoneLabel
} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";

export function CatalogFooter({locale}: {locale: Locale}) {
  const copy = footerCopy(locale);
  const nav = mainNavItems(locale);
  const legal = legalLinks(locale);
  const location = localizedBusinessLocation(locale);
  const productContext = {
    nl: {
      label: "NoordTune Power Catalog",
      text: "De Power Catalog is onderdeel van NoordTune.nl. Voor diensten, projecten en bedrijfsinformatie ga je naar de hoofdsite.",
      cta: "Naar NoordTune.nl"
    },
    en: {
      label: "NoordTune Power Catalog",
      text: "The Power Catalog is part of NoordTune.nl. Visit the main website for services, projects and company information.",
      cta: "Go to NoordTune.nl"
    },
    pl: {
      label: "NoordTune Power Catalog",
      text: "Power Catalog jest częścią NoordTune.nl. Usługi, realizacje i informacje o firmie znajdziesz na głównej stronie.",
      cta: "Przejdź do NoordTune.nl"
    }
  }[locale];

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="container py-10">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.05fr_.75fr_.75fr_.85fr]">
          <div>
            <a aria-label="NoordTune.nl" href={mainLocaleHref(locale)} rel="noreferrer">
              <NoordTuneLogo className="h-[62px] w-[216px]" />
            </a>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-primary">
              {productContext.label}
            </div>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {productContext.text}
            </p>
            <a
              className="mt-3 inline-flex text-sm font-black text-white transition hover:text-primary"
              href={mainLocaleHref(locale)}
              rel="noreferrer"
            >
              {productContext.cta} →
            </a>
          </div>

          <div>
            <h2 className="racing-title text-lg text-white">{copy.contact}</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <a
                className="flex items-center gap-2 hover:text-primary"
                href={`tel:${NOORDTUNE_BUSINESS.telephone}`}
              >
                <Phone className="h-4 w-4 text-primary" />
                {whatsappPhoneLabel}
              </a>
              <a
                className="flex items-center gap-2 hover:text-primary"
                href={`mailto:${NOORDTUNE_BUSINESS.email}`}
              >
                <Mail className="h-4 w-4 text-primary" />
                {NOORDTUNE_BUSINESS.email}
              </a>
              <a
                className="flex items-center gap-2 hover:text-primary"
                href={whatsappHref({locale})}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                {copy.whatsapp}
              </a>
            </div>
          </div>

          <div>
            <h2 className="racing-title text-lg text-white">{copy.hours}</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {copy.openingHours}
              </span>
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                {location}
              </span>
            </div>
          </div>

          <div>
            <h2 className="racing-title text-lg text-white">{copy.links}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {nav
                .filter((item) => !item.active)
                .map((item) => (
                  <a className="hover:text-primary" href={item.href} key={item.href}>
                    {item.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 NoordTune.nl</div>
          <div className="flex flex-wrap gap-5">
            {legal.map((item) => (
              <a className="hover:text-primary" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
