import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tensec-check.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: "2026-04-04",
    },
  ];
}
