import createMiddleware from "next-intl/middleware";
import {NextRequest, NextResponse} from "next/server";
import {isLocale, routing, type Locale} from "@/i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false
});

const localeCookie = "NEXT_LOCALE";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLocale = pathname.split("/")[1];

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(localeCookie)?.value;
    const locale = isLocale(cookieLocale)
      ? cookieLocale
      : detectPreferredLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(localeCookie, locale, cookieOptions);

    return response;
  }

  const response = intlMiddleware(request);

  if (isLocale(pathLocale)) {
    response.cookies.set(localeCookie, pathLocale, cookieOptions);
  }

  return response;
}

function detectPreferredLocale(acceptLanguage: string | null): Locale {
  const primaryLanguage = acceptLanguage
    ?.split(",")[0]
    ?.trim()
    ?.split(";")[0]
    ?.toLowerCase()
    ?.split("-")[0];

  return isLocale(primaryLanguage) ? primaryLanguage : routing.defaultLocale;
}

const cookieOptions = {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const
};

export const config = {
  matcher: ["/", "/(nl|en|pl)/:path*"]
};
