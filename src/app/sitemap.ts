import type { MetadataRoute } from "next";
import { getContentRepository } from "@/lib/content/repository";
import { sections, contentHref } from "@/lib/navigation";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const items = await getContentRepository().list({ section: "archive" });
  return ["/", ...sections.map((s) => "/" + s), ...items.map(contentHref)].map(
    (path) => ({ url: new URL(path, base).href }),
  );
}
