import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl
  const paths = [
    "",
    "/dashboard",
    "/onboarding",
    "/workouts",
    "/nutrition",
    "/habits",
    "/progress",
    "/coach",
    "/shop",
  ]
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "weekly",
    priority: p === "" ? 1 : 0.8,
  }))
}
