import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/locales";

export const LOCALE_COOKIE = "construkt-locale";

/** Picks a locale from a saved preference or the browser's Accept-Language header. */
function preferredLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { language: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .filter((item) => item.language && !Number.isNaN(item.q))
    .sort((a, b) => b.q - a.q);

  // The market comes from the default locale; only the language is negotiated.
  const defaultMarket = defaultLocale.split("-")[1];
  for (const { language } of ranked) {
    const match = `${language}-${defaultMarket}`;
    if (isLocale(match)) return match;
  }
  return defaultLocale;
}

/**
 * Every page lives under a locale prefix (/en-ae/…, /ar-ae/…). Requests
 * without one — including old links such as /services — are redirected.
 * A bare language segment (/ar/services) maps to that language's default
 * market. Unknown prefixes fall through to the default locale's 404 page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = ""] = pathname.split("/");
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  const bareLanguage = locales.find((locale) => locale.split("-")[0] === first.toLowerCase());
  if (bareLanguage) {
    url.pathname = `/${bareLanguage}${pathname.slice(first.length + 1)}`;
  } else {
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  }
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals, metadata routes and files with an extension.
  matcher: ["/((?!api|_next|images|icon.svg|sitemap.xml|robots.txt|.*\\..*).*)"],
};
