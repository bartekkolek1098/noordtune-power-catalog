import {MessageCircle} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {whatsappHref} from "@/lib/whatsapp";
import {cn} from "@/lib/utils";

const labels: Record<Locale, string> = {
  nl: "Vraag offerte via WhatsApp",
  en: "Request a quote on WhatsApp",
  pl: "Popros o wycene przez WhatsApp"
};

export function FloatingWhatsappButton({
  locale,
  mobileCtaOffset = false,
  vehicleLabel
}: {
  locale: Locale;
  mobileCtaOffset?: boolean;
  vehicleLabel?: string;
}) {
  return (
    <a
      aria-label={labels[locale]}
      className={cn(
        "fixed right-4 z-50 grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-[#25d366] text-white shadow-[0_0_34px_rgba(37,211,102,.45)] transition hover:scale-105 hover:bg-[#1fbd5a] focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:ring-offset-2 focus:ring-offset-black md:right-6",
        mobileCtaOffset ? "bottom-24 md:bottom-6" : "bottom-5 md:bottom-6"
      )}
      href={whatsappHref({locale, vehicleLabel})}
      rel="noreferrer"
      target="_blank"
      title={labels[locale]}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
