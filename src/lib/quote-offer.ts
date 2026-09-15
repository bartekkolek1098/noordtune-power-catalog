import {formatQuote, formatQuoteScope, type QuoteResolution} from "../data/pricing.ts";
import type {Locale} from "../i18n/routing.ts";

/** Structured prices describe the same VAT-inclusive from-price shown in the UI. */
export function quoteOfferFields(quote: QuoteResolution, locale: Locale) {
  if (quote.kind === "on-request") {
    return {description: formatQuote(quote, locale)};
  }

  return {
    price: (quote.amountCents / 100).toFixed(2),
    priceCurrency: quote.currency,
    description: `${formatQuote(quote, locale)}. ${formatQuoteScope(quote, locale)}`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      minPrice: (quote.amountCents / 100).toFixed(2),
      priceCurrency: quote.currency,
      valueAddedTaxIncluded: quote.taxBasis === "inclusive"
    }
  };
}
