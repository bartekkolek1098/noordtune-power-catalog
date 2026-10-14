# NoordTune Power Catalog — powrót do usług właściwej marki, 14.10.2026

## Punkt wyjścia
- Produkcja Power Catalog: cf0af77dbb5f8480fe72fa8d9a3cd2624de052b6 (PR #67).
- Produkcja głównej strony: 728648ffd246b60b731db4df41b9f3c843d0da62 (PR #27).
- Utrzymujemy 435 zweryfikowanych adresów w sitemapie katalogu; nie tworzymy nowych stron ani liczb Stage 1.

## Zmiana
- 68 holenderskich kart silników oraz 19 stron porównujących modele kieruje klienta do strony chiptuningu konkretnej marki (BMW, Audi, Volkswagen, Ford lub Toyota) na www.noordtune.nl, gdy istnieje opublikowana strona marki.
- Dla marek bez osobnej strony warsztatu zachowany został ogólny, poprawny odnośnik /nl/chiptuning — bez wymyślania adresów.
- 100 stron silników vanów, 25 stron ich modeli i holenderski indeks bedrijfswagens kieruje do właściwej oferty https://www.noordtune.nl/nl/bedrijfswagens.
- Oryginalne CTA do RDW, przekazanie silnika do formularza, WhatsApp, sitemap, canonical, wartości Stage 1 i cennik pozostają bez zmian.
- Wprowadzono test statyczny danych docelowych i przeglądarkowe QA z kontrolą publicznych WWW endpoints.

## Walidacja
- node --no-warnings scripts/test-nl-workshop-context-links.ts
- pnpm typecheck; pnpm test:seo; pnpm lint; pnpm build
- RDW_QA_URL=http://127.0.0.1:3135 pnpm qa:seo:nl-workshop-links
- Po scaleniu sprawdzić produkcyjny SHA i publiczne CTA oraz liczbę adresów sitemap.

## Uwaga
Linkowanie wewnętrzne i między domenami ułatwia dotarcie do wybranej usługi, ale nie gwarantuje zaindeksowania ani pozycji Google. Dane Google Search Console należy mierzyć w bezpłatnej usłudze Search Console; subskrypcja GSC Wizard jest nieaktywna.
