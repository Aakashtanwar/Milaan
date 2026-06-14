import { describe, expect, it } from 'vitest';

import { thresholds } from '@/config';
import {
  MOCK_LIVENESS_FAIL_MARKER,
  MOCK_LOW_MATCH_MARKER,
  MockBiometricProvider,
} from '@/lib/providers/biometric';

const provider = new MockBiometricProvider();

describe('MockBiometricProvider', () => {
  it('compareFaces is deterministic and order-independent', async () => {
    const a = await provider.compareFaces({ refA: 'x', refB: 'y' });
    const b = await provider.compareFaces({ refA: 'y', refB: 'x' });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.data.score).toEqual(b.data.score);
  });

  it('equal refs return ~0.99 (selfie↔selfie trivially passes)', async () => {
    const r = await provider.compareFaces({ refA: 'same', refB: 'same' });
    if (r.ok) expect(r.data.score).toBeGreaterThanOrEqual(thresholds.faceMatch.selfieToId);
  });

  it('typical mock pairs clear the photo↔selfie gate', async () => {
    const r = await provider.compareFaces({ refA: 'selfie-tpl', refB: 'photo-1' });
    if (r.ok) expect(r.data.score).toBeGreaterThanOrEqual(thresholds.faceMatch.photoToSelfie);
  });

  it('the low-match marker forces a sub-threshold score', async () => {
    const r = await provider.compareFaces({ refA: `selfie-${MOCK_LOW_MATCH_MARKER}`, refB: 'p' });
    if (r.ok) expect(r.data.score).toBeLessThan(thresholds.faceMatch.photoToSelfie);
  });

  it('liveness passes by default and fails on the fail marker', async () => {
    const okSession = await provider.completeLiveness({ sessionId: 'live-123' });
    const badSession = await provider.completeLiveness({
      sessionId: `live-${MOCK_LIVENESS_FAIL_MARKER}`,
    });
    if (okSession.ok) expect(okSession.data.passed).toBe(true);
    if (badSession.ok) expect(badSession.data.passed).toBe(false);
  });
});
