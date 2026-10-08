import Image from "next/image";
import type {Locale} from "@/i18n/routing";
import {assetPath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const copy: Record<Locale, {eyebrow: string; statement: string; credit: string; alt: string}> = {
  nl: {
    eyebrow: "NOORDTUNE / AUTOMOTIVE",
    statement: "Elke motor heeft zijn eigen verhaal.",
    credit: "Sfeerbeeld · Ryan Collins / Unsplash",
    alt: "Sfeerbeeld van een donkere auto met verlichte koplamp"
  },
  en: {
    eyebrow: "NOORDTUNE / AUTOMOTIVE",
    statement: "Every engine has its own story.",
    credit: "Illustrative photo · Ryan Collins / Unsplash",
    alt: "Editorial photograph of a dark car with its headlight on"
  },
  pl: {
    eyebrow: "NOORDTUNE / AUTOMOTIVE",
    statement: "Każdy silnik ma swoją historię.",
    credit: "Zdjęcie ilustracyjne · Ryan Collins / Unsplash",
    alt: "Ilustracyjne zdjęcie ciemnego samochodu z zapalonym reflektorem"
  }
};

export function HeroPhoto({
  locale,
  compact = false
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const text = copy[locale];
  return (
    <figure
      className={cn(
        "ux-hero-photo",
        compact ? "ux-hero-photo--compact lg:hidden" : "ux-hero-photo--desktop hidden lg:block"
      )}
    >
      <Image
        alt={text.alt}
        className="ux-hero-photo__image object-cover"
        fill
        loading="lazy"
        quality={78}
        sizes={compact ? "(min-width: 768px) 720px, 100vw" : "(min-width: 1280px) 520px, 43vw"}
        src={assetPath("/brand/editorial/car-headlight-unsplash-ryan-collins.jpg")}
      />
      <span className="ux-hero-photo__edge" aria-hidden="true" />
      <figcaption className="ux-hero-photo__caption">
        <span className="ux-hero-photo__eyebrow">{text.eyebrow}</span>
        <strong className="ux-hero-photo__statement">{text.statement}</strong>
        <span className="ux-hero-photo__credit">{text.credit}</span>
      </figcaption>
    </figure>
  );
}
