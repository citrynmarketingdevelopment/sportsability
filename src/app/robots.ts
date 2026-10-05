import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.VERCEL_ENV === "production" && Boolean(process.env.SITE_URL);
  return { rules: { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) }, ...(indexable ? { sitemap: `${process.env.SITE_URL!.replace(/\/$/, "")}/sitemap.xml` } : {}) };
}
