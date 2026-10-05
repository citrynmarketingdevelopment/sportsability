import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!process.env.SITE_URL || process.env.VERCEL_ENV !== "production") return [];
  const origin = process.env.SITE_URL.replace(/\/$/, "");
  return ["", "/programs", "/about", "/contact", "/privacy"].map(path => ({ url: `${origin}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : .7 }));
}
