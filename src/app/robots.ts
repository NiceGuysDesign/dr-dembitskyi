import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_api/",
          "/login/",
          "/preview/",
          "/draft/",
          "/dev/",
          "/test/",
          "/staging/",
          "/*?*utm_",
          "/*?*gclid=",
          "/*?*fbclid=",
          "/*?*yclid=",
          "/*?*sort=",
          "/*?*filter=",
          "/*?*page=",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
