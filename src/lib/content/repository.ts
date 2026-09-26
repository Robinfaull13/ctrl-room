import 'server-only';
import { readContentConfig } from './config';
import { createFixtureRepository } from './fixtures';
import { createSanityRepository } from './sanity-provider';
import type { ContentRepository } from './types';
export function getContentRepository(): ContentRepository {
  const config = readContentConfig(process.env);
  return config.source === 'fixtures' ? createFixtureRepository() : createSanityRepository({ ...config, token: process.env.SANITY_READ_TOKEN });
}
export function isFixtureMode(): boolean { return readContentConfig(process.env).source === 'fixtures'; }
