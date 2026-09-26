import { describe, it, expect } from "vitest";
import {
  outboundUrl,
  youtubeId,
  imageAccessibility,
} from "@/sanity/validation";
describe("editorial safety", () => {
  it("rejects executable outbound URLs", () => {
    expect(outboundUrl("javascript:alert(1)")).not.toBe(true);
    expect(outboundUrl("https://example.org")).toBe(true);
  });
  it("permits email links only in contacts", () => {
    expect(outboundUrl("mailto:hello@example.org")).not.toBe(true);
    expect(outboundUrl("mailto:hello@example.org", true)).toBe(true);
  });
  it("accepts only video identifiers, not arbitrary embed URLs", () => {
    expect(youtubeId("too-short")).not.toBe(true);
    expect(youtubeId("dQw4w9WgXcQ")).toBe(true);
    expect(youtubeId("https://youtu.be/example")).not.toBe(true);
  });
  it("requires alternative text unless explicitly decorative", () => {
    expect(imageAccessibility({})).not.toBe(true);
    expect(imageAccessibility({ alt: "   " })).not.toBe(true);
    expect(imageAccessibility({ alt: "Artist performing" })).toBe(true);
    expect(imageAccessibility({ decorative: true })).toBe(true);
  });
});
