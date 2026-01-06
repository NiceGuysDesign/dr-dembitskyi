import { MetadataRoute } from "next";

function getBaseUrl(): string {
  // Check NEXT_PUBLIC_SITE_URL first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    // Fix double https:// if present
    url = url.replace(/^https:\/\/https:\/\//, "https://");
    url = url.replace(/^http:\/\/http:\/\//, "http://");
    // Remove trailing slash if present
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  // Fallback to VERCEL_URL
  if (process.env.VERCEL_URL) {
    let vercelUrl = process.env.VERCEL_URL.trim();
    // Fix double https:// if present
    vercelUrl = vercelUrl.replace(/^https:\/\/https:\/\//, "https://");
    vercelUrl = vercelUrl.replace(/^http:\/\/http:\/\//, "http://");
    // VERCEL_URL doesn't include protocol, so add https://
    // But check if it already has protocol
    if (vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")) {
      return vercelUrl.endsWith("/") ? vercelUrl.slice(0, -1) : vercelUrl;
    }
    return `https://${vercelUrl}`;
  }

  // Default to localhost for development
  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
