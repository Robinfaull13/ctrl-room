export type ContentConfig = { source: 'fixtures' } | { source: 'sanity'; projectId: string; dataset: string };
export function validSanityIdentifiers(projectId?: string, dataset?: string): boolean {
  return !!projectId && /^[a-z0-9]+$/.test(projectId) && !!dataset && /^[a-z0-9][a-z0-9_-]*$/.test(dataset);
}
export function readContentConfig(env: Record<string, string | undefined>): ContentConfig {
  if (env.CONTENT_SOURCE === 'fixtures') return { source: 'fixtures' };
  if (env.CONTENT_SOURCE !== 'sanity') throw Error('Set CONTENT_SOURCE explicitly to fixtures or sanity');
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset = env.NEXT_PUBLIC_SANITY_DATASET;
  if (!validSanityIdentifiers(projectId, dataset)) throw Error('Sanity requires valid project and dataset identifiers');
  return { source: 'sanity', projectId: projectId!, dataset: dataset! };
}
