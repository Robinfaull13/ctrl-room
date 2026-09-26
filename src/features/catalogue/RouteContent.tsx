import { notFound } from "next/navigation";
import type { ContentKind, Section } from "@/lib/content/types";
import { getContentRepository } from "@/lib/content/repository";
import { parseBrowseQuery, labels, contentHref } from "@/lib/navigation";
import CatalogueView from "./CatalogueView";
import { siteMetadata } from "@/lib/content/metadata";
export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;
const kinds: Partial<Record<Section, ContentKind>> = {
  invites: "event",
  studios: "session",
  records: "release",
  archive: "archiveEntry",
};
async function browseQuery(searchParams: SearchParams, section: Section) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    if (typeof v === "string") params.set(k, v);
  }
  const query = parseBrowseQuery(params);
  return { ...query, format: section === "studios" ? query.format : undefined };
}
export async function RouteContent({
  section,
  slug,
  searchParams,
}: {
  section: Section;
  slug?: string;
  searchParams: SearchParams;
}) {
  const repo = getContentRepository();
  const query = await browseQuery(searchParams, section);
  const selected = slug ? await repo.get(kinds[section]!, slug) : null;
  if (slug && !selected) notFound();
  const [items, related] = await Promise.all([
    repo.list({ section, ...query }),
    selected ? repo.related(selected.id) : Promise.resolve([]),
  ]);
  return (
    <CatalogueView
      section={section}
      items={items}
      selected={selected}
      related={related}
      {...query}
    />
  );
}
export async function routeMetadata(section: Section, slug?: string) {
  const item = slug
    ? await getContentRepository().get(kinds[section]!, slug)
    : null;
  if (slug && !item) notFound();
  return siteMetadata(
    item?.title || labels[section],
    item ? contentHref(item) : "/" + section,
  );
}
