import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n/config";

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  const locale = acceptLanguage?.split(",")[0].split("-")[0];
  return locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
}

// Rate limiting configuration
const RATE_LIMIT = 100; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Store for rate limiting (note: per-instance, not shared across regions/functions)
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const now = Date.now();

  // Clean up old entries
  for (const [key, value] of ipRequests.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      ipRequests.delete(key);
    }
  }

  // Check rate limit
  const requestData = ipRequests.get(ip);
  if (requestData) {
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
      // Reset if window has passed
      ipRequests.set(ip, { count: 1, timestamp: now });
    } else if (requestData.count >= RATE_LIMIT) {
      // Rate limit exceeded
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain",
        },
      });
    } else {
      // Increment request count
      ipRequests.set(ip, {
        count: requestData.count + 1,
        timestamp: requestData.timestamp,
      });
    }
  } else {
    // First request from this IP
    ipRequests.set(ip, { count: 1, timestamp: now });
  }

  // Add security headers
  const response = NextResponse.next();

  // Add pathname to headers for Schema.org
  response.headers.set("x-pathname", pathname);

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "connect-src 'self' https://sds-strapi-1c16f892193c.herokuapp.com http://localhost:1337 https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://va.vercel-scripts.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://va.vercel-scripts.com; " +
      "style-src 'self' 'unsafe-inline' https://*.google.com https://*.gstatic.com; " +
      "img-src 'self' data: https: blob: https://*.google.com https://*.gstatic.com; " +
      "font-src 'self' data: https://*.google.com https://*.gstatic.com; " +
      "object-src 'none'; " +
      "media-src 'self'; " +
      "frame-src 'self' https://*.google.com https://*.gstatic.com https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
      "worker-src 'self' blob:;"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("Permissions-Policy", "interest-cohort=()");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
