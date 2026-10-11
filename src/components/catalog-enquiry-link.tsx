import {catalogEnquiryHref, type CatalogEnquiryRef} from '@/lib/catalog-enquiry-contract';
import type {Locale} from '@/i18n/routing';
export function CatalogEnquiryLink({reference, locale, business = false, className = ''}: {
  reference: CatalogEnquiryRef; locale: Locale; business?: boolean; className?: string;
}) {
  let href: string;
  try {href = catalogEnquiryHref(reference, locale, business);} catch {return null;}
  return <a href={href} rel="noreferrer" data-testid="catalog-enquiry-link" className={'inline-flex min-h-11 items-center justify-center rounded-md border border-white/30 px-4 py-3 text-center text-sm font-bold text-white transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ' + className}>
    {{nl: 'Offerteformulier voor deze motor', en: 'Enquiry form for this engine', pl: 'Formularz wyceny tego silnika'}[locale]}
  </a>;
}
