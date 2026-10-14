// Server-only: build an enquiry label exclusively from existing public catalog records.
import {getManualCatalogResult} from './manual-catalog-result.ts';
import {verifiedRdwApplications} from '../data/verified-rdw-applications.ts';
import {nlVanEngineBySlug} from '../data/nl-van-engines-seo.ts';
import {nlStage1BySlug} from '../data/nl-stage1-engine-seo.ts';
import {passengerEngineEnquiryId,validCatalogEnquiryContext, type CatalogEnquiryRef, type CatalogEnquiryContext} from './catalog-enquiry-contract.ts';
const byProfile = new Map(verifiedRdwApplications.map(a => [a.id, a]));

export function getCatalogEnquiryContext(ref: CatalogEnquiryRef): CatalogEnquiryContext | undefined {
  let title: string, from: number, to: number;
  if (ref.kind === 'manual') {
    const result = getManualCatalogResult(ref.id, ref.year);
    if (!result) return;
    const v = result.vehicle;
    title = [v.brand + ' ' + v.model, v.generation, v.engine].filter(Boolean).join(' · ');
    from = v.yearFrom; to = v.yearTo;
  } else if (ref.kind === 'profile') {
    const a = byProfile.get(ref.id);
    if (!a) return;
    title = [a.make + ' ' + a.model, a.engineLabel, a.registeredPowerKw ? a.registeredPowerKw + ' kW' : undefined].filter(Boolean).join(' · ');
    from = a.yearFrom; to = a.yearTo;
  } else {
    const van = nlVanEngineBySlug.get(ref.id);
    const passengerSlug=ref.id.startsWith('auto-')?ref.id.slice(5):undefined;
    const passenger = passengerSlug?nlStage1BySlug.get(passengerSlug):undefined;
    // Only published, explicitly namespaced passenger topics may be submitted.
    if ((!van && !passenger) || (van && passenger) || (passenger && passengerEngineEnquiryId(passenger.slug)!==ref.id)) return;
    const applications = van ? van.applications : passenger!.applications;
    if (ref.year !== undefined && !applications.some(a => ref.year! >= a.yearFrom && ref.year! <= a.yearTo)) return;
    title = van ? van.title : passenger!.headline;
    from = Math.min(...applications.map(a => a.yearFrom));
    to = Math.max(...applications.map(a => a.yearTo));
  }
  if (ref.year !== undefined && (ref.year < from || ref.year > to)) return;
  const suffix = ref.year !== undefined ? ' · ' + ref.year : '';
  const cleaned = title.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();
  const label = cleaned.slice(0, 160 - suffix.length) + suffix;
  const context: CatalogEnquiryContext = {...ref, version: 1, label, yearFrom: from, yearTo: to};
  return validCatalogEnquiryContext(context, ref) ? context : undefined;
}
