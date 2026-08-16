import {ClipboardCheck, ShieldCheck} from "lucide-react";
import {Badge} from "@/components/ui/badge";

export type CatalogVerificationText = {
  badge: string;
  title: string;
  text: string;
  footer: string;
};

export function CatalogVerificationNotice({
  text
}: {
  text: CatalogVerificationText;
}) {
  return (
    <section className="container pt-8">
      <div className="panel-edge grid gap-5 rounded-[3px] border border-amber-400/25 bg-[linear-gradient(110deg,rgba(245,158,11,.1),rgba(255,255,255,.025)_48%,rgba(0,0,0,.32))] p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-[3px] border border-amber-400/35 bg-amber-400/10 text-amber-300">
          <ClipboardCheck className="h-6 w-6" />
        </div>
        <div>
          <Badge className="rounded-[3px] border-amber-400/35 bg-amber-400/10 text-amber-200">
            {text.badge}
          </Badge>
          <h2 className="racing-title mt-3 text-2xl leading-none text-white md:text-3xl">
            {text.title}
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            {text.text}
          </p>
        </div>
        <div className="flex items-start gap-2 text-xs font-bold uppercase leading-5 text-slate-300 md:max-w-48">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{text.footer}</span>
        </div>
      </div>
    </section>
  );
}
