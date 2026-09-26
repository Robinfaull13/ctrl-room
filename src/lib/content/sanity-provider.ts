import "server-only";
import type { ContentRepository } from "./types";
import { validSanityIdentifiers } from "./config";
import { normalizeItem, normalizeItems, normalizeSettings } from "./normalize";
import { filterItems, relatedItems } from "./relationships";
import { listQuery, detailQuery, relatedQuery, settingsQuery } from "./queries";
export function createSanityRepository(
  config: { projectId: string; dataset: string; token?: string },
  transport: typeof fetch = fetch,
): ContentRepository {
  if (!validSanityIdentifiers(config.projectId, config.dataset))
    throw Error("Sanity requires valid project and dataset identifiers");
  async function query(query: string, params: Record<string, string> = {}) {
    const url = new URL(
      "https://" +
        config.projectId +
        ".api.sanity.io/v2026-09-01/data/query/" +
        config.dataset,
    );
    url.searchParams.set("query", query);
    url.searchParams.set("perspective", "published");
    for (const [k, v] of Object.entries(params))
      url.searchParams.set("$" + k, JSON.stringify(v));
    const response = await transport(url, {
      headers: config.token ? { Authorization: "Bearer " + config.token } : {},
      next: { revalidate: 60 },
    });
    if (!response.ok)
      throw Error("Content service unavailable (" + response.status + ")");
    const body = await response.json();
    if (body.error) throw Error("Content query failed");
    return body.result as unknown;
  }
  return {
    async list(q) {
      return filterItems(normalizeItems(await query(listQuery)), q);
    },
    async get(kind, slug) {
      const result = await query(detailQuery, { kind, slug });
      return result === null ? null : normalizeItem(result);
    },
    async related(id) {
      return relatedItems(
        id,
        normalizeItems(await query(relatedQuery, { id })),
      );
    },
    async settings() {
      return normalizeSettings(await query(settingsQuery));
    },
  };
}
