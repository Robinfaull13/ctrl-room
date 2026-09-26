import type {
  Artist,
  ContentItem,
  ExternalLink,
  Media,
  SiteSettings,
} from "./types";
import {
  outboundUrl,
  youtubeId,
  imageAccessibility,
  timezone,
} from "@/sanity/validation";
type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Malformed content record");
  return value as RecordValue;
}
function required(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim())
    throw Error("Malformed required content: " + label);
  return value;
}
function optional(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
export function publishedId(value: unknown): boolean {
  return (
    typeof value === "string" &&
    !value.startsWith("drafts.") &&
    !value.startsWith("versions.")
  );
}
export function plainText(value: unknown): string {
  if (typeof value === "string") return value;
  return array(value)
    .filter(Boolean)
    .map((block) =>
      array(record(block).children)
        .filter(Boolean)
        .map((span) => optional(record(span).text) || "")
        .join(""),
    )
    .join("\n\n");
}
function artists(value: unknown): Artist[] {
  return array(value)
    .filter(Boolean)
    .map(record)
    .filter((a) => publishedId(a._id))
    .map((a) => ({
      id: required(a._id, "artist ID"),
      slug: required(a.slug, "artist slug"),
      name: required(a.name, "artist name"),
      biography: plainText(a.biography),
    }));
}
function media(value: unknown): Media[] {
  return array(value)
    .filter(Boolean)
    .map(record)
    .filter(
      (m) =>
        typeof m.url === "string" &&
        outboundUrl(m.url) === true &&
        imageAccessibility(m) === true,
    )
    .map((m) => ({
      url: m.url as string,
      alt: m.decorative === true ? "" : (m.alt as string),
      decorative: m.decorative === true,
      width: typeof m.width === "number" ? m.width : undefined,
      height: typeof m.height === "number" ? m.height : undefined,
    }));
}
function links(value: unknown, contact = false): ExternalLink[] {
  return array(value)
    .filter(Boolean)
    .map(record)
    .filter(
      (l) =>
        typeof l.url === "string" &&
        !!l.url &&
        outboundUrl(l.url, contact) === true,
    )
    .map((l) => ({
      label: required(l.label, "link label"),
      url: l.url as string,
    }));
}
function duration(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}
export function normalizeItem(value: unknown): ContentItem | null {
  const r = record(value);
  required(r._id, "ID");
  if (!publishedId(r._id)) return null;
  if (
    r._type === "release" &&
    (!Array.isArray(r.tracks) || r.tracks.length === 0)
  )
    throw Error("Malformed required content: tracks");
  const date = required(r.date, "date");
  if (!Number.isFinite(Date.parse(date))) throw Error("Malformed content date");
  const base = {
    id: required(r._id, "ID"),
    slug: required(r.slug, "slug"),
    title: required(r.title, "title"),
    date,
    artists: artists(r.artists),
    media: media(r.media),
  };
  switch (r._type) {
    case "event": {
      const tz = required(r.timezone, "timezone"),
        status = r.status;
      if (timezone(tz) !== true) throw Error("Malformed event timezone");
      if (status !== "past" && status !== "upcoming" && status !== "cancelled")
        throw Error("Malformed event status");
      return {
        ...base,
        kind: "event",
        timezone: tz,
        status,
        venue: required(r.venue, "venue"),
        location: required(r.location, "location"),
        ticketUrl:
          outboundUrl(r.ticketUrl) === true ? optional(r.ticketUrl) : undefined,
      };
    }
    case "session": {
      const format = r.format;
      if (format !== "DJ set" && format !== "Live")
        throw Error("Malformed session format");
      return {
        ...base,
        kind: "session",
        number: required(r.number, "number"),
        location: required(r.location, "location"),
        format,
        durationSeconds: duration(r.durationSeconds),
        youtubeId:
          youtubeId(r.youtubeId) === true ? optional(r.youtubeId) : undefined,
      };
    }
    case "release":
      return {
        ...base,
        kind: "release",
        catalogueNumber: required(r.catalogueNumber, "catalogue number"),
        tracks: array(r.tracks)
          .filter(Boolean)
          .map(record)
          .map((t) => ({
            title: required(t.title, "track title"),
            durationSeconds: duration(t.durationSeconds),
          })),
        credits: optional(r.credits),
        links: links(r.links),
      };
    case "archiveEntry":
      return {
        ...base,
        kind: "archiveEntry",
        category: required(r.category, "category"),
        body: plainText(r.body),
        relatedIds: array(r.relatedIds).filter((id): id is string =>
          publishedId(id),
        ),
      };
    default:
      throw Error("Unknown content type");
  }
}
export function normalizeItems(value: unknown): ContentItem[] {
  if (!Array.isArray(value)) throw Error("Malformed content collection");
  return value.map(normalizeItem).filter((x): x is ContentItem => x !== null);
}
export function normalizeSettings(value: unknown): SiteSettings {
  const r = record(value);
  if (!publishedId(r._id)) throw Error("Published site settings required");
  return {
    title: required(r.title, "site title"),
    description: required(r.description, "description"),
    about: plainText(r.about),
    contactLinks: links(r.contactLinks, true),
    socialLinks: links(r.socialLinks),
  };
}
