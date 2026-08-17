import {ClipboardCheck, ShieldCheck} from "lucide-react";
import {Badge} from "@/components/ui/badge";

export type CatalogVerificationText = {
  badge: string;
  title: string;
  text: string;
  footer: string;
};

export function CatalogVerificationNotice({
  compact = false,
  text
}: {
  compact?: boolean;
  text: CatalogVerificationText;
}) {
  if (compact) {
    return (
      <aside
        className="panel-edge rounded-[3px] border border-amber-400/30 bg-[linear-gradient(110deg,rgba(245,158,11,.12),rgba(255,255,255,.025)_55%,rgba(0,0,0,.32))] p-4 sm:p-5"
        data-testid="rdw-exact-verification"
      >
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-amber-400/35 bg-amber-400/10 text-amber-300 sm:flex">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge className="max-w-full whitespace-normal rounded-[3px] border-amber-400/35 bg-amber-400/10 px-2 py-1 text-left leading-4 text-amber-200">
              {text.badge}
            </Badge>
            <h3 className="racing-title mt-3 text-xl leading-tight text-white sm:text-2xl">
              {text.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {text.text}
            </p>
            <div className="mt-3 flex items-start gap-2 border-t border-amber-300/15 pt-3 text-xs font-bold leading-5 text-amber-100/85">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <span>{text.footer}</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="container pt-4" data-testid="catalog-verification">
      <div className="panel-edge grid gap-2 rounded-[3px] border border-amber-400/25 bg-[linear-gradient(110deg,rgba(245,158,11,.1),rgba(255,255,255,.025)_48%,rgba(0,0,0,.32))] p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-3 sm:p-4 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="hidden h-10 w-10 items-center justify-center rounded-[3px] border border-amber-400/30 bg-amber-400/10 text-amber-300 sm:flex">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <Badge className="max-w-full whitespace-normal rounded-[3px] border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-left text-[11px] leading-4 text-amber-200">
            {text.badge}
          </Badge>
          <h2 className="mt-1.5 text-base font-black leading-tight text-white sm:text-lg">
            {text.title}
          </h2>
          <p className="mt-1 max-w-4xl text-[13px] leading-5 text-slate-300 sm:text-sm">
            {text.text}
          </p>
        </div>
        <div className="flex items-start gap-2 border-t border-amber-300/15 pt-2 text-[11px] font-semibold leading-4 text-amber-100/80 sm:col-start-2 md:col-start-auto md:max-w-52 md:border-l md:border-t-0 md:py-1 md:pl-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <span>{text.footer}</span>
        </div>
      </div>
    </section>
  );
}
