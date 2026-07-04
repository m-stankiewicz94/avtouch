import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

function negotiateLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    for (const code of preferred) {
      if ((locales as readonly string[]).includes(code)) return code;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = negotiateLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url);
  // The redirect target depends on Accept-Language, so shared caches/CDNs must
  // key on it rather than serving one locale's redirect to everyone.
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = {
  // Run on everything except API routes, Next internals, static assets and files with an extension.
  matcher: ["/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
