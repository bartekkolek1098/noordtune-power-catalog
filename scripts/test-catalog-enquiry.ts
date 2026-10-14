import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getCatalogEnquiryContext} from '../src/lib/catalog-enquiry-context.ts';
import {parseCatalogEnquiryHash, parseCatalogEnquiryParams, catalogEnquiryHref, passengerEngineEnquiryId, validCatalogEnquiryContext} from '../src/lib/catalog-enquiry-contract.ts';
import {nlVanEngines} from '../src/data/nl-van-engines-seo.ts';
import {nlStage1EngineProfiles} from '../src/data/nl-stage1-engine-seo.ts';
import {nlModelFamilyHubs} from '../src/data/nl-model-family-seo.ts';
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
test('every indexed Dutch passenger engine has a prefilled contact with verified model and technical year', () => {
  const existingVanSlugs=new Set(nlVanEngines.map(e=>e.slug));
  assert.equal(nlStage1EngineProfiles.length,68);
  for (const engine of nlStage1EngineProfiles) {
    const reference={kind:'engine' as const,id:passengerEngineEnquiryId(engine.slug)};
    assert.ok(!existingVanSlugs.has(reference.id),engine.slug+': handoff identifier must not collide with commercial van profile');
    const context=getCatalogEnquiryContext(reference);
    assert.ok(validCatalogEnquiryContext(context,reference),engine.slug);
    assert.equal(context.label,engine.headline.slice(0,160),engine.slug);
    assert.equal(context.yearFrom,Math.min(...engine.applications.map(a=>a.yearFrom)));
    assert.equal(context.yearTo,Math.max(...engine.applications.map(a=>a.yearTo)));
    assert.doesNotMatch(JSON.stringify(context), /email|address|plate|kenteken|vin|price|torque|powerRange|stages/i);
    const firstYear=engine.applications[0].yearFrom;
    const withYear={...reference,year:firstYear};
    const resolved=getCatalogEnquiryContext(withYear);
    assert.ok(validCatalogEnquiryContext(resolved,withYear));
    assert.ok(resolved.label.endsWith(' · '+firstYear));
    for(let year=context.yearFrom;year<=context.yearTo;year++){
      if(!engine.applications.some(a=>a.yearFrom<=year&&a.yearTo>=year))
        assert.equal(getCatalogEnquiryContext({...reference,year}),undefined,engine.slug+': unreviewed year '+year);
    }
    assert.equal(getCatalogEnquiryContext({...reference,year:context.yearFrom-1}),undefined);
    assert.equal(getCatalogEnquiryContext({...reference,year:context.yearTo+1}),undefined);
    const url=new URL(catalogEnquiryHref(reference,'nl'));
    assert.equal(url.pathname,'/nl/contact');
    assert.equal(url.search,'');
    assert.deepEqual(parseCatalogEnquiryHash(url.hash),reference);
  }
  assert.equal(nlModelFamilyHubs.length,19);
  for(const hub of nlModelFamilyHubs){
    for(const engine of hub.engines){
      const ref={kind:'engine' as const,id:passengerEngineEnquiryId(engine.slug)};
      assert.ok(validCatalogEnquiryContext(getCatalogEnquiryContext(ref),ref),hub.slug+' '+engine.slug);
    }
  }
});
test('legacy passenger and van slugs with the same text remain different public engine references', () => {
  const vanSlugs=new Set(nlVanEngines.map(e=>e.slug));
  const overlaps=nlStage1EngineProfiles.filter(e=>vanSlugs.has(e.slug));
  assert.ok(overlaps.length>0,'Collision regression sample must not silently disappear');
  for(const e of overlaps){
    const vanRef={kind:'engine' as const,id:e.slug};
    const passengerRef={kind:'engine' as const,id:passengerEngineEnquiryId(e.slug)};
    assert.ok(validCatalogEnquiryContext(getCatalogEnquiryContext(vanRef),vanRef));
    assert.equal(getCatalogEnquiryContext(passengerRef)?.label,e.headline.slice(0,160));
    assert.equal(getCatalogEnquiryContext(vanRef)?.label,nlVanEngines.find(v=>v.slug===e.slug)?.title.slice(0,160));
    assert.notEqual(vanRef.id,passengerRef.id);
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
  assert.equal(getCatalogEnquiryContext({kind:'engine',id:'volkswagen-niet-bestaande-motor'}),undefined);
  assert.equal(getCatalogEnquiryContext({kind:'engine',id:'auto-bmw-320i-g20-g21-b48-184',year:1900}),undefined);
  assert.equal(getCatalogEnquiryContext({kind:'engine',id:'auto-does-not-exist-motor'}),undefined);
  assert.equal(getCatalogEnquiryContext({kind:'manual',id:taxonomy.id,year:1900}), undefined);
});
console.log('CONTACT_CONTEXT_COUNTS', JSON.stringify({vanPages:nlVanEngines.length, reviewedProfiles:verifiedRdwApplications.length,passengerEnginePages:nlStage1EngineProfiles.length, modelHubs:nlModelFamilyHubs.length,manualVanFamilies:reviewedVanSelectorItems().length}));
