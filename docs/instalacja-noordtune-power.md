# Instrukcja instalacji NoordTune Power Catalog na `noordtune.nl/power`

Ten projekt jest osobną aplikacją Next.js. Może działać niezależnie od WordPressa, a WordPress może nadal obsługiwać główną stronę `noordtune.nl`. Najwygodniejszy wariant produkcyjny to Vercel + reverse proxy dla ścieżki `/power`.

## 1. Co jest w paczce

- Aplikacja Next.js z katalogiem mocy, RDW lookup i ręcznym wyborem auta.
- Obsługa języków: NL, EN, PL.
- Wspólny brandowy logotyp: `public/brand/v8/header-logo-dark.png`.
- Rozszerzona baza katalogowa: 58 586 rekordów pojazdów.
- Konfiguracja SEO, sitemap, robots.txt i schema.org.
- Endpoint RDW: `/api/rdw-lookup`, a po montażu pod `/power`: `/power/api/rdw-lookup`.

## 2. Wymagania

- Konto GitHub lub GitLab z repozytorium projektu.
- Konto Vercel.
- Dostęp do DNS domeny `noordtune.nl`.
- Dostęp do hostingu WordPress albo Cloudflare/Nginx/Apache, aby ustawić reverse proxy.
- Token RDW Open Data/Socrata z profilu RDW.

## 3. Zmienne środowiskowe

W Vercel ustaw:

```bash
RDW_APP_TOKEN=twoj_token_rdw
RDW_CACHE_TTL_SECONDS=172800
RDW_RATE_LIMIT_PER_HOUR=60
NEXT_PUBLIC_SITE_URL=https://noordtune.nl
NEXT_PUBLIC_BASE_PATH=/power
```

Do testów lokalnych można użyć:

```bash
RDW_APP_TOKEN=
RDW_CACHE_TTL_SECONDS=172800
RDW_RATE_LIMIT_PER_HOUR=60
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
```

## 4. Test lokalny

W folderze projektu uruchom:

```bash
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm install
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm dev --hostname localhost --port 3000
```

Otwórz:

```text
http://localhost:3000/nl
http://localhost:3000/en
http://localhost:3000/pl
```

Sprawdź:

- Czy logo w nagłówku jest poprawne.
- Czy RDW kenteken lookup działa.
- Czy ręczny wybór auta prowadzi do strony pojazdu.
- Czy FAQ się rozwija.
- Czy języki nie mieszają tekstów.

## 5. Kontrola przed wdrożeniem

Przed publikacją uruchom:

```bash
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm typecheck
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm lint
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm build
```

Jeśli build przejdzie, aplikacja jest gotowa do wdrożenia.

## 6. Wdrożenie na Vercel

1. Wgraj projekt do repozytorium GitHub/GitLab.
2. W Vercel kliknij `Add New Project`.
3. Wybierz repozytorium z projektem.
4. Framework powinien zostać wykryty jako `Next.js`.
5. Ustaw komendy:

```bash
Install Command: pnpm install
Build Command: pnpm build
Output Directory: .next
```

6. Dodaj zmienne środowiskowe z sekcji 3.
7. Kliknij `Deploy`.
8. Po wdrożeniu skopiuj domenę Vercel, np.:

```text
https://noordtune-power.vercel.app
```

## 7. Montaż pod `noordtune.nl/power`

WordPress zostaje na głównej domenie. Tylko ścieżka `/power` ma być kierowana do aplikacji Vercel.

Docelowe adresy:

```text
https://noordtune.nl/power/nl
https://noordtune.nl/power/en
https://noordtune.nl/power/pl
https://noordtune.nl/power/api/rdw-lookup
```

### Opcja A: Cloudflare Worker

Użyj Workera, jeśli DNS domeny jest w Cloudflare.

Przykład:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/power") {
      url.pathname = "/power/nl";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith("/power/")) {
      const target = new URL(request.url);
      target.hostname = "noordtune-power.vercel.app";

      return fetch(target.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "manual"
      });
    }

    return fetch(request);
  }
};
```

W przykładzie zamień `noordtune-power.vercel.app` na prawdziwą domenę projektu w Vercel.

### Opcja B: Nginx

Jeśli hosting ma Nginx:

```nginx
location /power/ {
  proxy_pass https://noordtune-power.vercel.app/power/;
  proxy_set_header Host noordtune-power.vercel.app;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Proto https;
  proxy_set_header X-Real-IP $remote_addr;
}

location = /power {
  return 301 /power/nl;
}
```

### Opcja C: Apache

Jeśli hosting ma Apache z `mod_proxy`:

```apache
ProxyPreserveHost Off
ProxyPass "/power/" "https://noordtune-power.vercel.app/power/"
ProxyPassReverse "/power/" "https://noordtune-power.vercel.app/power/"
RedirectMatch 301 "^/power$" "/power/nl"
```

Jeśli hosting WordPress nie pozwala na reverse proxy pod ścieżką, użyj łatwiejszej opcji: `power.noordtune.nl` jako osobna domena Vercel i link z menu WordPress.

## 8. Konfiguracja Vercel dla domeny

Dla montażu pod `/power` Vercel może działać na technicznej domenie `*.vercel.app`, a publiczny ruch idzie przez reverse proxy.

Jeśli wybierzesz subdomenę `power.noordtune.nl`:

1. W Vercel wejdź w `Project Settings -> Domains`.
2. Dodaj `power.noordtune.nl`.
3. W DNS ustaw rekord CNAME według instrukcji Vercel.
4. Zmień zmienne:

```bash
NEXT_PUBLIC_SITE_URL=https://power.noordtune.nl
NEXT_PUBLIC_BASE_PATH=
```

## 9. RDW token

1. Wejdź na profil RDW Open Data/Socrata.
2. Wygeneruj darmowy App Token.
3. Wklej go w Vercel jako `RDW_APP_TOKEN`.
4. Nie dodawaj tokena do kodu ani do publicznego repozytorium.

## 10. Cache i limity RDW

Aktualna wersja ma cache w pamięci procesu i rate limiting. To wystarczy na start i testy.

Dla większego ruchu zalecane jest dodanie jednego z rozwiązań:

- Vercel KV / Upstash Redis.
- Supabase Postgres.
- Neon Postgres.

Przykładowa tabela:

```sql
create table rdw_lookup_cache (
  kenteken text primary key,
  response jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 11. Checklist po wdrożeniu

Sprawdź w przeglądarce:

- `https://noordtune.nl/power/nl`
- `https://noordtune.nl/power/en`
- `https://noordtune.nl/power/pl`
- Ręczny wybór auta, np. `BMW 320d`, `Golf GTI`, `Audi 2.0 TDI`.
- RDW lookup dla prawdziwego kentekenu.
- Przejście do strony pojazdu.
- Kalkulator ceny i opcje dodatkowe.
- Sitemap: `https://noordtune.nl/power/sitemap.xml`
- Robots: `https://noordtune.nl/power/robots.txt`

## 12. Najczęstsze problemy

Jeśli obrazy lub linki mają zły adres:

- Sprawdź, czy `NEXT_PUBLIC_BASE_PATH=/power`.
- Zrób redeploy w Vercel po zmianie zmiennych.

Jeśli RDW nie działa:

- Sprawdź `RDW_APP_TOKEN`.
- Sprawdź, czy endpoint działa pod `/power/api/rdw-lookup`.
- Sprawdź limity requestów.

Jeśli WordPress przechwytuje `/power`:

- Wyklucz `/power/*` z routingu WordPress.
- Ustaw reverse proxy przed WordPressem, np. Cloudflare Worker albo Nginx.

## 13. Rekomendacja końcowa

Najczystsza konfiguracja produkcyjna:

1. Vercel hostuje aplikację Next.js.
2. WordPress zostaje na `noordtune.nl`.
3. Cloudflare Worker lub Nginx kieruje tylko `/power/*` do Vercel.
4. W Vercel ustawione są `NEXT_PUBLIC_SITE_URL=https://noordtune.nl` i `NEXT_PUBLIC_BASE_PATH=/power`.
5. Link w menu WordPress prowadzi do `https://noordtune.nl/power/nl`.
