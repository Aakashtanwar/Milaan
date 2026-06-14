import { hashUnit, ok } from '../shared';
import type { ModerationProvider } from './types';

/**
 * Deterministic mock moderation. Decision is a pure function of the path:
 *  - contains "nsfw"   → rejected (nudity)
 *  - contains "review" → pending (manual review)
 *  - otherwise         → approved
 */
export class MockModerationProvider implements ModerationProvider {
  readonly mode = 'mock' as const;

  async screenImage({ storagePath }: { storagePath: string }) {
    if (storagePath.includes('nsfw')) {
      return ok({ decision: 'rejected' as const, labels: ['nudity'], confidence: 0.98 });
    }
    if (storagePath.includes('review')) {
      return ok({ decision: 'pending' as const, labels: ['suggestive'], confidence: 0.6 });
    }
    return ok({
      decision: 'approved' as const,
      labels: [],
      confidence: Number((0.9 + hashUnit(storagePath) * 0.1).toFixed(3)),
    });
  }
}
