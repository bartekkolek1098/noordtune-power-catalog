import {Clock, Mail, MapPin, MessageCircle, Phone} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {
  footerCopy,
  legalLinks,
  mainLocaleHref,
  mainNavItems,
  whatsappPhoneLabel
} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {vehicleCheckPath} from "@/lib/vehicle-check-path";

export function CatalogFooter({locale}: {locale: Locale}) {
  const copy = footerCopy(locale);
  const nav = mainNavItems(locale);
  const legal = legalLinks(locale);
  const vehicleCheckLabel =
    locale === "nl" ? "Kentekencheck" : locale === "pl" ? "Sprawdź auto" : "Vehicle check";

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="container py-10">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.05fr_.75fr_.75fr_.85fr]">
          <div>
            <a aria-label="NoordTune.nl" href={mainLocaleHref(locale)} rel="noreferrer">
              <NoordTuneLogo className="h-[62px] w-[216px]" />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
          </div>

          <div>
            <h2 className="racing-title text-lg text-white">{copy.contact}</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <a className="flex items-center gap-2 hover:text-primary" href="tel:+31685759600">
                <Phone className="h-4 w-4 text-primary" />
                {whatsappPhoneLabel}
              </a>
              <a className="flex items-center gap-2 hover:text-primary" href="mailto:info@noordtune.nl">
                <Mail className="h-4 w-4 text-primary" />
                info@noordtune.nl
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
                Assen
              </span>
            </div>
          </div>

          <div>
            <h2 className="racing-title text-lg text-white">{copy.links}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <a className="hover:text-primary" href={vehicleCheckPath(locale)}>
                {vehicleCheckLabel}
              </a>
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
