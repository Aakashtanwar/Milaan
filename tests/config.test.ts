import { describe, expect, it } from 'vitest';

import { config, thresholds } from '@/config';

describe('config', () => {
  it('defaults every provider to mock (zero paid calls in Phase 0)', () => {
    expect(config.providers.identity).toBe('mock');
    expect(config.providers.biometric).toBe('mock');
    expect(config.providers.moderation).toBe('mock');
    expect(config.providers.chat).toBe('mock');
  });

  it('pins the core product thresholds (Spec §6/§7)', () => {
    expect(thresholds.match.maxActive).toBe(5);
    expect(thresholds.faceMatch.selfieToId).toBe(0.85);
    expect(thresholds.faceMatch.photoToSelfie).toBe(0.8);
    expect(thresholds.minAgeYears).toBe(18);
  });

  it('quality_score component weights sum to 1.0 (no appearance gating)', () => {
    const w = thresholds.score.weights;
    const sum = w.profileCompleteness + w.verificationStrength + w.responsiveness + w.photoQuality;
    expect(sum).toBeCloseTo(1.0, 5);
  });
});
