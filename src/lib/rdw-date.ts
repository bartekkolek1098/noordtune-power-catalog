/** RDW calendar dates are civil dates, never converted through the local timezone. */
export function parseRdwDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(value) ??
    /^(\d{4})-(\d{2})-(\d{2})(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/.exec(value);
  if (!match) return undefined;
  const [, y, m, d] = match;
  const year = Number(y), month = Number(m), day = Number(d);
  if (year < 1886 || month < 1 || month > 12 || day < 1) return undefined;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= days ? `${y}-${m}-${d}` : undefined;
}

export function firstAdmissionYear(value: string | undefined): number | undefined {
  const date = parseRdwDate(value);
  return date ? Number(date.slice(0, 4)) : undefined;
}

export function formatRegistrationDate(value: string | undefined, locale: "nl" | "en" | "pl") {
  const date = parseRdwDate(value);
  if (!date) return locale === "nl" ? "Niet beschikbaar" : locale === "pl" ? "Brak danych" : "Unavailable";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
