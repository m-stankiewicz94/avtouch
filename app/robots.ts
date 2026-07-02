import type { MetadataRoute } from "next";
import { SITE, INDEXABLE } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  // Staging: block all crawlers until indexing is enabled at launch.
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
    // Host directive expects a bare hostname (no scheme).
    host: new URL(SITE.domain).host,
  };
}
