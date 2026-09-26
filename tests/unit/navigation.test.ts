import { it, expect } from "vitest";
import { contentHref, parseBrowseQuery, querySuffix } from "@/lib/navigation";
it("encodes slugs and gives aggregate archive results their canonical routes", () => {
  expect(contentHref({ kind: "event", slug: "a/b space" })).toBe(
    "/invites/a%2Fb%20space",
  );
  expect(contentHref({ kind: "archiveEntry", slug: "journal" })).toBe(
    "/archive/journal",
  );
});
it("round-trips query text and ignores invalid formats", () => {
  expect(
    parseBrowseQuery(new URLSearchParams("q=A%26B&format=unknown")),
  ).toEqual({ q: "A&B", format: undefined });
  expect(querySuffix({ q: "A&B", format: "DJ set" })).toBe(
    "?q=A%26B&format=DJ+set",
  );
});
