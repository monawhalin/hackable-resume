import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  return ["", "/print"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
