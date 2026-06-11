import {MessageCircle} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {whatsappHref} from "@/lib/whatsapp";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";

export function VehicleContactCta({
  locale,
  quoteLabel,
  vehicleLabel,
  whatsappLabel
}: {
  locale: Locale;
  quoteLabel: string;
  vehicleLabel: string;
  whatsappLabel: string;
}) {
  const href = whatsappHref({locale, vehicleLabel});

  return (
    <>
      <FloatingWhatsappButton locale={locale} mobileCtaOffset vehicleLabel={vehicleLabel} />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/30 bg-black/92 p-3 shadow-[0_-18px_50px_rgba(0,0,0,.62)] backdrop-blur lg:hidden">
        <div className="container grid grid-cols-[1fr_auto] gap-3">
          <a
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-4 text-sm font-black text-primary-foreground shadow-[0_0_26px_rgba(226,0,15,.32)] transition hover:bg-primary/90"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {quoteLabel}
          </a>
          <a
            aria-label={whatsappLabel}
            className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-[#25d366]/50 bg-[#25d366] text-white transition hover:bg-[#1fbd5a]"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </>
  );
}
