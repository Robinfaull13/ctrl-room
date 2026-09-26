import { it, expect } from "vitest";
import { parse, evaluate } from "groq-js";
import {
  listQuery,
  detailQuery,
  relatedQuery,
  settingsQuery,
} from "@/lib/content/queries";
import { normalizeItems, normalizeItem } from "@/lib/content/normalize";
const artist = {
  _id: "artist",
  _type: "artist",
  slug: { current: "artist" },
  name: "Artist",
};
const session = {
  _id: "session",
  _type: "session",
  slug: { current: "set" },
  title: "A set",
  date: "2026-01-01",
  format: "Live",
  number: "001",
  location: "Studio",
  artists: [{ _ref: "artist" }, { _ref: "deleted" }],
};
const event = {
  _id: "event",
  _type: "event",
  slug: { current: "event" },
  title: "Event",
  date: "2026-01-01",
  timezone: "Africa/Windhoek",
  venue: "Venue",
  location: "City",
  status: "past",
  artists: [{ _ref: "artist" }],
};
const archive = {
  _id: "archive",
  _type: "archiveEntry",
  slug: { current: "note" },
  title: "Note",
  date: "2026-01-01",
  category: "Journal",
  related: [{ _ref: "session" }],
};
const dataset = [
  artist,
  session,
  event,
  archive,
  { ...session, _id: "drafts.private" },
  { ...session, _id: "versions.release.private" },
  { _id: "siteSettings", _type: "siteSettings", title: "CTRL ROOM" },
];
async function run(query: string, params: Record<string, string> = {}) {
  return (await evaluate(parse(query), { dataset, params })).get();
}
it("executes published GROQ projections and omits missing artists", async () => {
  const items = normalizeItems(await run(listQuery));
  expect(items.map((x) => x.id)).toEqual(["session", "event", "archive"]);
  expect(items[0].artists.map((x) => x.id)).toEqual(["artist"]);
  expect((await run(detailQuery, { kind: "session", slug: "set" }))._id).toBe(
    "session",
  );
  expect((await run(settingsQuery))._id).toBe("siteSettings");
});
it("executes shared and reverse relationship queries", async () => {
  expect(
    (await run(relatedQuery, { id: "session" })).map(
      (x: { _id: string }) => x._id,
    ),
  ).toEqual(["session", "event", "archive"]);
  expect(
    (await run(relatedQuery, { id: "archive" })).map(
      (x: { _id: string }) => x._id,
    ),
  ).toEqual(["session", "archive"]);
});
it("rejects missing required identity and release tracks", () => {
  expect(() =>
    normalizeItem({ ...session, _id: undefined, slug: "set" }),
  ).toThrow();
  expect(() =>
    normalizeItem({
      _id: "release",
      _type: "release",
      slug: "release",
      title: "Release",
      date: "2026-01-01",
      catalogueNumber: "001",
    }),
  ).toThrow();
});
