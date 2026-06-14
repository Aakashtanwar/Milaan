import { config } from '@/config';

import { MockModerationProvider } from './mock';
import type { ModerationProvider } from './types';

export type { ModerationProvider, ModerationResult, ModerationDecision } from './types';
export { MockModerationProvider } from './mock';

/**
 * Factory keyed by config.providers.moderation. `live` (Rekognition/Hive)
 * lands in Phase 4.
 */
export function getModerationProvider(): ModerationProvider {
  if (config.providers.moderation === 'mock') return new MockModerationProvider();
  throw new Error('Live ModerationProvider not implemented yet (Phase 4).');
}
