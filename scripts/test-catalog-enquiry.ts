import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getCatalogEnquiryContext} from '../src/lib/catalog-enquiry-context.ts';
import {parseCatalogEnquiryHash, parseCatalogEnquiryParams, catalogEnquiryHref, validCatalogEnquiryContext} from '../src/lib/catalog-enquiry-contract.ts';
import {nlVanEngines} from '../src/data/nl-van-engines-seo.ts';
import {catalogTaxonomyV2} from '../src/data/catalog-taxonomy-v2.ts';
import {reviewedVanSelectorItems} from '../src/data/reviewed-van-selector.ts';
import {verifiedRdwApplications} from '../src/data/verified-rdw-applications.ts';

const taxonomy = catalogTaxonomyV2.find(v => v.brand === 'BMW' && v.engine.includes('118i') && v.stockPowerHp === 140 && v.yearFrom <= 2021 && v.yearTo >= 2021)!;
assert.ok(taxonomy);
test('manual handoff resolves the same BMW engine and selected year, without claims or identifiers', () => {
  const ref = {kind: 'manual' as const, id: taxonomy.id, year: 2021};
  const context = getCatalogEnquiryContext(ref)!;
  assert.ok(validCatalogEnquiryContext(context, ref));
  assert.match(context.label, /BMW.*118i.*2021/);
  assert.doesNotMatch(JSON.stringify(context), /tuned|torque|plate|kenteken|vin|stage1|quote|price/i);
  for (const locale of ['nl','en','pl'] as const) {
    const url = new URL(catalogEnquiryHref(ref, locale));
    assert.equal(url.origin, 'https://www.noordtune.nl');
    assert.equal(url.search, '');
    assert.deepEqual(parseCatalogEnquiryHash(url.hash), ref);
    assert.equal(url.pathname, '/' + locale + (locale === 'pl' ? '/kontakt' : '/contact'));
  }
});
test('every published van-engine page resolves its own public catalogue label', () => {
  for (const e of nlVanEngines) {
    const ref = {kind: 'engine' as const, id: e.slug};
    const context = getCatalogEnquiryContext(ref);
    assert.ok(validCatalogEnquiryContext(context, ref), e.slug);
    assert.equal(context.label, e.title.slice(0,160));
    assert.equal(new URL(catalogEnquiryHref(ref, 'nl', true)).pathname, '/nl/bedrijfswagens');
  }
});
test('all registered reviewed profile references resolve within their own year range', () => {
  for (const app of verifiedRdwApplications) {
    const ref = {kind: 'profile' as const, id: app.id, year: app.yearFrom};
    assert.ok(validCatalogEnquiryContext(getCatalogEnquiryContext(ref), ref), app.id);
    assert.equal(getCatalogEnquiryContext({...ref, year: app.yearFrom-1}), undefined);
    assert.equal(getCatalogEnquiryContext({...ref, year: app.yearTo+1}), undefined);
  }
});
test('reviewed manual vans retain a selected-year label without an invented registration', () => {
  for (const item of reviewedVanSelectorItems()) {
    const ref = {kind: 'manual' as const, id: item.id};
    assert.ok(validCatalogEnquiryContext(getCatalogEnquiryContext(ref), ref), item.id);
  }
});
test('unknown IDs, mixed namespaces and unsafe input cannot create a quote context', () => {
  for (const q of ['kind=manual&id=VLG97F','kind=manual&id=test@example.com','kind=profile&id=tax-a390ba5b5ed30da2',
    'kind=engine&id=abc&url=https://evil.invalid','kind=manual&id=tax-a390ba5b5ed30da2&year=2021&year=2020',
    'kind=manual&id=tax-a390ba5b5ed30da2&plate=QA0000','kind=engine&id=volkswagen-caddy-test&year=NaN',
    'kind=profile&id=rdw-test&year=2021.5','kind=manual&id=tax-a390ba5b5ed30da2&id=tax-305cf09159efea21']) {
    assert.equal(parseCatalogEnquiryParams(new URLSearchParams(q)), undefined, q);
  }
  assert.equal(parseCatalogEnquiryHash('#offerte'), undefined);
  assert.equal(parseCatalogEnquiryHash('#catalog-v1?' + 'x'.repeat(500)), undefined);
  assert.equal(getCatalogEnquiryContext({kind:'profile',id:'rdw-does-not-exist'}), undefined);
  assert.equal(getCatalogEnquiryContext({kind:'manual',id:taxonomy.id,year:1900}), undefined);
});
console.log('CONTACT_CONTEXT_COUNTS', JSON.stringify({vanPages:nlVanEngines.length, reviewedProfiles:verifiedRdwApplications.length, manualVanFamilies:reviewedVanSelectorItems().length}));
