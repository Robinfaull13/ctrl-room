import type { Artist, ContentItem, ContentRepository, SiteSettings } from './types';
import { filterItems, relatedItems } from './relationships';
const jaide: Artist = { id: 'artist-jaide', slug: 'jaide', name: 'JAIDE', biography: 'Sample artist record.' };
const guest: Artist = { id: 'artist-guest', slug: 'guest', name: 'Sample live artist' };
const base = { date: '2026-01-01T18:00:00Z', artists: [jaide], media: [] };
export const fixtureItems: ContentItem[] = [
  { ...base, id: 'session-jaide', slug: 'jaide', title: 'JAIDE', kind: 'session', number: 'Sample session 001', location: 'Sample studio', format: 'DJ set', youtubeId: 'dQw4w9WgXcQ' },
  { ...base, id: 'session-live', slug: 'live-session', title: 'Sample live session', kind: 'session', artists: [guest], number: 'Sample session 002', location: 'Sample studio', format: 'Live' },
  { ...base, id: 'event-001', slug: 'ctrl-room-invites', title: 'CTRL ROOM Invites', kind: 'event', venue: 'Sample venue', location: 'Sample location', timezone: 'Africa/Windhoek', status: 'past' },
  { ...base, id: 'release-ctrl001', slug: 'ctrl001', title: 'CTRL001', kind: 'release', catalogueNumber: 'Sample CTRL001', tracks: [{ title: 'Sample track', durationSeconds: 240 }], credits: 'Sample release credits.', links: [] },
  { ...base, id: 'archive-001', slug: 'first-transmission', title: 'Sample first transmission', kind: 'archiveEntry', category: 'Journal', body: 'Sample archive entry. This catalogue demonstrates connected editorial content.', relatedIds: ['session-jaide', 'missing-record'] },
];
export const fixtureSettings: SiteSettings = { title: 'CTRL ROOM', description: 'Sound. Vision. Culture. Community.', about: 'Sample content: CTRL ROOM is a space for sound, vision, culture and community. Editorial copy will be added through the CMS.', contactLinks: [], socialLinks: [] };
export function createFixtureRepository(): ContentRepository {
  return { async list(query) { return filterItems(fixtureItems, query); }, async get(kind, slug) { return fixtureItems.find(x => x.kind === kind && x.slug === slug) || null; }, async related(id) { return relatedItems(id, fixtureItems); }, async settings() { return fixtureSettings; } };
}
