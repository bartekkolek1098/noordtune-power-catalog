import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const middleware=readFileSync("src/middleware.ts","utf8");
const routing=readFileSync("src/i18n/routing.ts","utf8");
const selector=readFileSync("src/components/language-switcher.tsx","utf8");
const header=readFileSync("src/components/catalog-header.tsx","utf8");
const menu=readFileSync("src/components/catalog-mobile-menu.tsx","utf8");

test("catalog honors shared parent-domain preference ahead of stale NEXT_LOCALE",()=>{
 assert.match(routing,/sharedLocaleCookieName = "noordtune_preferred_locale"/);
 assert.match(middleware,/request\.cookies\.get\(sharedLocaleCookieName\)/);
 assert.match(middleware,/isLocale\(crossDomainLocale\)[\s\S]*?crossDomainLocale[\s\S]*?isLocale\(legacyLocale\)/);
 assert.match(middleware,/detectPreferredLocale\(request\.headers\.get\("accept-language"\)\)/);
 assert.match(middleware,/url\.pathname = `\/\$\{locale\}`/);
 assert.match(middleware,/response\.cookies\.set\(localeCookie, pathLocale, cookieOptions\)/);
 assert.match(middleware,/matcher: \["\/", "\/\(nl\|en\|pl\)\/:path\*"\]/);
});

test("one labeled high-contrast compact switcher plus readable menu options on every device",()=>{
 assert.match(selector,/data-testid="language-switcher-trigger"/);
 assert.match(selector,/<Globe2/);
 assert.match(selector,/aria-expanded=\{open\}/);
 assert.match(selector,/data-testid="language-switcher-options"/);
 assert.match(selector,/aria-controls=\{menuId\}/);
 assert.match(selector,/min-h-11/);
 assert.match(selector,/Taal \/ Language \/ Język/);
 assert.match(selector,/event\.key === "Escape"/);
 assert.match(selector,/document\.addEventListener\("pointerdown"/);
 assert.match(selector,/hrefLang=\{candidate\}/);
 assert.match(selector,/sitePath\(`\/\$\{candidate\}\$\{path\}`\)/);
 assert.match(header,/<LanguageSwitcher compact/);
 assert.match(menu,/<LanguageSwitcher className="mt-4" expanded/);
 assert.match(selector,/grid-cols-3/);
 for(const code of ["nl","en","pl"])assert.ok(selector.includes(code+":"),"Missing language "+code);
});

test("manual language choice is persisted for both WWW and catalog without personal data",()=>{
 assert.match(selector,/\$\{sharedLocaleCookieName\}=\$\{language\}/);
 assert.match(selector,/Domain=\.noordtune\.nl/);
 assert.match(selector,/Max-Age=31536000; SameSite=Lax/);
 assert.match(selector,/noordtune_locale=\$\{language\}/);
 assert.doesNotMatch(selector,/kenteken|customerId|vin|email|trackConversion|analytics/i);
});
