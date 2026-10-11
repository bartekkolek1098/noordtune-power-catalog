/** Versioned public-engine handoff. Never carries registration, VIN, free text or prices. */
export type CatalogEnquiryKind = 'manual' | 'profile' | 'engine';
export type CatalogEnquiryRef = {kind: CatalogEnquiryKind; id: string; year?: number};
export type CatalogEnquiryContext = CatalogEnquiryRef & {
  version: 1; label: string; yearFrom: number; yearTo: number;
};
export const catalogEnquiryPrefix = '#catalog-v1?';
const kinds = new Set(['manual', 'profile', 'engine']);
const idPattern = /^[a-z0-9][a-z0-9_-]{3,179}$/;
const validYear = (n: unknown): n is number => Number.isInteger(n) && Number(n) >= 1886 && Number(n) <= 2100;

export function parseCatalogEnquiryParams(params: URLSearchParams): CatalogEnquiryRef | undefined {
  if ([...params.keys()].some(k => !['kind', 'id', 'year'].includes(k))) return;
  if (['kind', 'id', 'year'].some(k => params.getAll(k).length > 1)) return;
  const kind = params.get('kind'), id = params.get('id'), year = params.get('year');
  if (!kind || !kinds.has(kind) || !id || !idPattern.test(id)) return;
  if (kind === 'manual' && !/^(tax-[a-f0-9]{16}|reviewed-van-[a-z0-9][a-z0-9-]+)$/.test(id)) return;
  if (kind === 'profile' && !/^rdw-[a-z0-9][a-z0-9-]+$/.test(id)) return;
  if (kind === 'engine' && !/^[a-z][a-z0-9]*(?:-[a-z0-9]+){2,}$/.test(id)) return;
  if (year !== null && (!/^\d{4}$/.test(year) || !validYear(Number(year)))) return;
  return {kind: kind as CatalogEnquiryKind, id, ...(year !== null ? {year: Number(year)} : {})};
}
export function catalogEnquiryParams(ref: CatalogEnquiryRef): URLSearchParams {
  const params = new URLSearchParams({kind: ref.kind, id: ref.id});
  if (ref.year !== undefined) params.set('year', String(ref.year));
  if (!parseCatalogEnquiryParams(params)) throw new Error('Invalid public catalog reference');
  return params;
}
export function parseCatalogEnquiryHash(hash: string): CatalogEnquiryRef | undefined {
  if (!hash.startsWith(catalogEnquiryPrefix) || hash.length > 400) return;
  return parseCatalogEnquiryParams(new URLSearchParams(hash.slice(catalogEnquiryPrefix.length)));
}
export function catalogEnquiryHref(ref: CatalogEnquiryRef, locale: 'nl' | 'en' | 'pl', business = false): string {
  const path = business && locale === 'nl' ? '/nl/bedrijfswagens' : '/' + locale + (locale === 'pl' ? '/kontakt' : '/contact');
  return 'https://www.noordtune.nl' + path + catalogEnquiryPrefix + catalogEnquiryParams(ref).toString();
}
export function validCatalogEnquiryContext(value: unknown, ref: CatalogEnquiryRef): value is CatalogEnquiryContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const d = value as Record<string, unknown>;
  if (Object.keys(d).some(k => !['version', 'kind', 'id', 'year', 'label', 'yearFrom', 'yearTo'].includes(k))) return false;
  return d.version === 1 && d.id === ref.id && d.kind === ref.kind && d.year === ref.year &&
    validYear(d.yearFrom) && validYear(d.yearTo) && d.yearFrom <= d.yearTo &&
    (ref.year === undefined || (ref.year >= d.yearFrom && ref.year <= d.yearTo)) &&
    typeof d.label === 'string' && d.label.length > 3 && d.label.length <= 160 &&
    !/[<>@\r\n\u0000-\u001f\u007f]/.test(d.label) && !/https?:\/\//i.test(d.label);
}
