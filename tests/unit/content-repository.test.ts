import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createFixtureRepository } from "@/lib/content/fixtures";
import { readContentConfig } from "@/lib/content/config";
import { createSanityRepository } from "@/lib/content/sanity-provider";
const repo = createFixtureRepository();
describe("content contract", () => {
  it("filters sections, artist search, and session formats", async () => {
    expect(
      (await repo.list({ section: "studios", q: "JAIDE" })).map((x) => x.id),
    ).toEqual(["session-jaide"]);
    expect(
      (await repo.list({ section: "studios", format: "Live" })).map(
        (x) => x.id,
      ),
    ).toEqual(["session-live"]);
    expect(await repo.list({ section: "studios", q: "absent" })).toEqual([]);
  });
  it("uses canonical kinds and returns null for unknown slugs", async () => {
    expect((await repo.get("session", "jaide"))?.id).toBe("session-jaide");
    expect(await repo.get("event", "jaide")).toBeNull();
    expect(await repo.get("session", "missing")).toBeNull();
  });
  it("aggregates without duplicate archive documents", async () => {
    const all = await repo.list({ section: "archive" });
    expect(all).toHaveLength(5);
    expect(new Set(all.map((x) => x.id)).size).toBe(5);
  });
  it("requires explicit content selection and configured live identifiers", () => {
    expect(() => readContentConfig({})).toThrow();
    expect(() => readContentConfig({ CONTENT_SOURCE: "other" })).toThrow();
    expect(() => readContentConfig({ CONTENT_SOURCE: "sanity" })).toThrow();
    expect(() =>
      createSanityRepository({ projectId: "", dataset: "test" }),
    ).toThrow();
    expect(readContentConfig({ CONTENT_SOURCE: "fixtures" }).source).toBe(
      "fixtures",
    );
  });
});
const session = {
  _id: "real-session",
  _type: "session",
  slug: "real",
  title: "Real set",
  date: "2026-01-01T00:00:00Z",
  number: "001",
  location: "Windhoek",
  format: "DJ set",
  artists: [null],
  media: null,
};
describe("live provider boundary", () => {
  it("requests published data with a 60-second cache and omits drafts and missing references", async () => {
    const transport: typeof fetch = async (input, init) => {
      const url = new URL(String(input));
      expect(url.searchParams.get("perspective")).toBe("published");
      expect(url.searchParams.get("query")).toContain("drafts.**");
      expect(
        (init as RequestInit & { next: { revalidate: number } }).next
          .revalidate,
      ).toBe(60);
      return Response.json({
        result: [session, { ...session, _id: "drafts.secret" }],
      });
    };
    const live = createSanityRepository(
      { projectId: "project1", dataset: "production" },
      transport,
    );
    const items = await live.list({ section: "studios" });
    expect(items).toHaveLength(1);
    expect(items[0].artists).toEqual([]);
    expect(items[0].media).toEqual([]);
    expect(items[0].id).toBe("real-session");
  });
  it("preserves network and HTTP errors without sample fallback", async () => {
    const failed = createSanityRepository(
      { projectId: "project1", dataset: "production" },
      async () => {
        throw Error("outage");
      },
    );
    await expect(failed.list({ section: "archive" })).rejects.toThrow("outage");
    const bad = createSanityRepository(
      { projectId: "project1", dataset: "production" },
      async () => new Response("unavailable", { status: 503 }),
    );
    await expect(bad.get("session", "jaide")).rejects.toThrow();
  });
  it("reports malformed required content", async () => {
    const live = createSanityRepository(
      { projectId: "project1", dataset: "production" },
      async () => Response.json({ result: [{ ...session, title: null }] }),
    );
    await expect(live.list({ section: "studios" })).rejects.toThrow();
  });
});
