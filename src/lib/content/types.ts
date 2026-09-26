export type ContentKind = "event" | "session" | "release" | "archiveEntry";
export type Section =
  "invites" | "studios" | "records" | "archive" | "about" | "contact";
export type Artist = {
  id: string;
  slug: string;
  name: string;
  biography?: string;
};
export type Media = {
  url: string;
  alt: string;
  decorative: boolean;
  width?: number;
  height?: number;
};
export type ExternalLink = { label: string; url: string };
export type ContentBase = {
  id: string;
  slug: string;
  title: string;
  date: string;
  artists: Artist[];
  media: Media[];
};
export type Event = ContentBase & {
  kind: "event";
  timezone: string;
  venue: string;
  location: string;
  status: "upcoming" | "past" | "cancelled";
  ticketUrl?: string;
};
export type Session = ContentBase & {
  kind: "session";
  number: string;
  location: string;
  durationSeconds?: number;
  youtubeId?: string;
  format: "DJ set" | "Live";
};
export type Release = ContentBase & {
  kind: "release";
  catalogueNumber: string;
  tracks: { title: string; durationSeconds?: number }[];
  credits?: string;
  links: ExternalLink[];
};
export type ArchiveEntry = ContentBase & {
  kind: "archiveEntry";
  category: string;
  body: string;
  relatedIds: string[];
};
export type ContentItem = Event | Session | Release | ArchiveEntry;
export type SiteSettings = {
  title: string;
  description: string;
  about: string;
  contactLinks: ExternalLink[];
  socialLinks: ExternalLink[];
};
export type ContentQuery = {
  section: Section;
  q?: string;
  format?: "DJ set" | "Live";
};
export interface ContentRepository {
  list(query: ContentQuery): Promise<ContentItem[]>;
  get(kind: ContentKind, slug: string): Promise<ContentItem | null>;
  related(id: string): Promise<ContentItem[]>;
  settings(): Promise<SiteSettings>;
}
