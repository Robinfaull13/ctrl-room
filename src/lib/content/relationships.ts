import type { ContentItem, ContentQuery, ContentKind, Section } from './types';
export const sectionKind: Partial<Record<Section, ContentKind>> = { invites: 'event', studios: 'session', records: 'release' };
export function filterItems(items: ContentItem[], query: ContentQuery): ContentItem[] {
  const q = query.q?.trim().toLowerCase() || '';
  return [...new Map(items.map(x => [x.id, x])).values()].filter(x =>
    (query.section === 'archive' || x.kind === sectionKind[query.section]) &&
    (!query.format || x.kind === 'session' && x.format === query.format) &&
    (!q || [x.title, ...x.artists.map(a => a.name), x.kind === 'session' ? x.number : ''].join(' ').toLowerCase().includes(q))
  ).sort((a, b) => b.date.localeCompare(a.date));
}
export function relatedItems(id: string, items: ContentItem[]): ContentItem[] {
  const source = items.find(x => x.id === id);
  if (!source) return [];
  const artists = new Set(source.artists.map(a => a.id));
  const explicit = new Set(source.kind === 'archiveEntry' ? source.relatedIds : []);
  return [...new Map(items.map(x => [x.id, x])).values()].filter(x => x.id !== id && (
    x.artists.some(a => artists.has(a.id) || explicit.has(a.id)) || explicit.has(x.id) ||
    x.kind === 'archiveEntry' && x.relatedIds.some(ref => ref === id || artists.has(ref))
  ));
}
