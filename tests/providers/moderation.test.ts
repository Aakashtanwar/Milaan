import { describe, expect, it } from 'vitest';

import { MockModerationProvider } from '@/lib/providers/moderation';

const provider = new MockModerationProvider();

describe('MockModerationProvider', () => {
  it('approves normal paths deterministically', async () => {
    const a = await provider.screenImage({ storagePath: 'users/1/photo-1.jpg' });
    const b = await provider.screenImage({ storagePath: 'users/1/photo-1.jpg' });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.data.decision).toBe('approved');
      expect(a.data).toEqual(b.data);
    }
  });

  it('rejects paths flagged nsfw', async () => {
    const r = await provider.screenImage({ storagePath: 'users/1/nsfw-pic.jpg' });
    if (r.ok) {
      expect(r.data.decision).toBe('rejected');
      expect(r.data.labels).toContain('nudity');
    }
  });

  it('routes "review" paths to pending', async () => {
    const r = await provider.screenImage({ storagePath: 'users/1/review-this.jpg' });
    if (r.ok) expect(r.data.decision).toBe('pending');
  });
});
