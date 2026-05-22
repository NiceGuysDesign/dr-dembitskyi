import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toInternalPathname } from "./i18n/routing";

// Rate limiting configuration
const RATE_LIMIT = 100; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Store for rate limiting (note: per-instance, not shared across regions/functions)
const ipRequests = new Map<string, { count: number; timestamp: number }>();

function applySecurityHeaders(
  response: NextResponse,
  publicPathname: string,
): NextResponse {
  response.headers.set("x-pathname", publicPathname);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "connect-src 'self' https://ancient-compassion-c978f136b7.strapiapp.com http://localhost:1337 https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://va.vercel-scripts.com https://*.cloudinary.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://va.vercel-scripts.com; " +
      "style-src 'self' 'unsafe-inline' https://*.google.com https://*.gstatic.com; " +
      "img-src 'self' data: https: blob: https://*.google.com https://*.gstatic.com https://*.cloudinary.com; " +
      "font-src 'self' data: https://*.google.com https://*.gstatic.com; " +
      "object-src 'none'; " +
      "media-src 'self' https://*.cloudinary.com; " +
      "frame-src 'self' https://*.google.com https://*.gstatic.com https://www.googletagmanager.com; " +
      "worker-src 'self' blob:;",
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("Permissions-Policy", "interest-cohort=()");
  return response;
}

function buildUrl(request: NextRequest, path: string): URL {
  const hostname = request.headers.get("host") || request.nextUrl.hostname;
  const isLocalhost =
    hostname?.startsWith("localhost") || hostname?.startsWith("127.0.0.1");

  if (isLocalhost) {
    return new URL(path, `http://${hostname}`);
  }
  return new URL(path, request.url);
}

function handleLocaleRouting(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
  // Legacy /uk URLs → public paths without prefix (301 for SEO)
  if (pathname === "/uk" || pathname.startsWith("/uk/")) {
    const publicPath = pathname === "/uk" ? "/" : pathname.slice(3) || "/";
    const redirect = NextResponse.redirect(buildUrl(request, publicPath), 301);
    return applySecurityHeaders(redirect, publicPath);
  }

  // English: public URL matches internal [lang]=en
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return null;
  }

  // Default locale (uk): rewrite to internal /uk/... without changing the URL
  const internalPath = toInternalPathname(pathname);
  return NextResponse.rewrite(buildUrl(request, internalPath));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const localeResponse = handleLocaleRouting(request, pathname);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const now = Date.now();

  for (const [key, value] of ipRequests.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      ipRequests.delete(key);
    }
  }

  const requestData = ipRequests.get(ip);
  if (requestData) {
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
      ipRequests.set(ip, { count: 1, timestamp: now });
    } else if (requestData.count >= RATE_LIMIT) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain",
        },
      });
    } else {
      ipRequests.set(ip, {
        count: requestData.count + 1,
        timestamp: requestData.timestamp,
      });
    }
  } else {
    ipRequests.set(ip, { count: 1, timestamp: now });
  }

  const response = localeResponse ?? NextResponse.next();
  return applySecurityHeaders(response, pathname);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|icons|video).*)",
  ],
};
