import {ChevronRight, MessageCircle} from "lucide-react";

type SeoInfoCard = {
  title: string;
  text: string;
};

type SeoInfoLink = {
  href: string;
  label: string;
  primary?: boolean;
};

export function SeoInfoSections({
  cards,
  eyebrow,
  links,
  title
}: {
  cards: SeoInfoCard[];
  eyebrow: string;
  links: SeoInfoLink[];
  title: string;
}) {
  return (
    <section className="mt-10 rounded-[3px] border border-white/10 bg-black/55 p-5 shadow-[0_0_70px_rgba(0,0,0,.28)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </div>
          <h2 className="racing-title mt-2 text-3xl leading-none text-white md:text-4xl">
            {title}
          </h2>
        </div>
        <MessageCircle className="hidden h-10 w-10 text-primary md:block" />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <article
            className="rounded-[3px] border border-white/10 bg-white/[0.035] p-4"
            key={card.title}
          >
            <h3 className="text-sm font-black uppercase text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            className={
              link.primary
                ? "inline-flex items-center gap-2 rounded-[3px] bg-primary px-4 py-3 text-sm font-black uppercase text-white shadow-[0_0_28px_rgba(227,6,19,.32)] transition hover:bg-primary/90"
                : "inline-flex items-center gap-2 rounded-[3px] border border-white/15 px-4 py-3 text-sm font-black uppercase text-white transition hover:border-primary hover:text-primary"
            }
            href={link.href}
            key={link.href}
          >
            {link.label}
            <ChevronRight className="h-4 w-4" />
          </a>
        ))}
      </div>
    </section>
  );
}
