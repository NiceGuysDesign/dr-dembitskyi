/** Production site base URL (no trailing slash). */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    url = url.replace(/^https:\/\/https:\/\//, "https://");
    url = url.replace(/^http:\/\/http:\/\//, "http://");
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  if (process.env.VERCEL_URL) {
    let vercelUrl = process.env.VERCEL_URL.trim();
    vercelUrl = vercelUrl.replace(/^https:\/\/https:\/\//, "https://");
    vercelUrl = vercelUrl.replace(/^http:\/\/http:\/\//, "http://");
    if (vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")) {
      return vercelUrl.endsWith("/") ? vercelUrl.slice(0, -1) : vercelUrl;
    }
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}
