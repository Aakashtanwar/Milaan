import { hash32, hashUnit, ok } from '../shared';
import type { BiometricProvider } from './types';

/** Refs containing this marker force a sub-threshold compare score (test hook). */
export const MOCK_LOW_MATCH_MARKER = 'nomatch';
/** Session ids containing this marker fail liveness (test hook). */
export const MOCK_LIVENESS_FAIL_MARKER = 'fail';

/**
 * Deterministic mock biometric provider. compareFaces is a pure function of the
 * two refs; equal refs always return ~0.99 so selfie↔selfie trivially passes.
 */
export class MockBiometricProvider implements BiometricProvider {
  readonly mode = 'mock' as const;

  async startLiveness({ userId }: { userId: string }) {
    return ok({
      sessionId: `mock-liveness-${hash32(userId).toString(16)}`,
      expiresAt: '2026-01-01T00:00:00.000Z', // fixed, deterministic
    });
  }

  async completeLiveness({ sessionId }: { sessionId: string }) {
    const passed = !sessionId.includes(MOCK_LIVENESS_FAIL_MARKER);
    return ok({
      sessionId,
      passed,
      templateRef: `mock-template:${hash32(sessionId).toString(16)}`,
    });
  }

  async compareFaces({ refA, refB }: { refA: string; refB: string }) {
    if (refA.includes(MOCK_LOW_MATCH_MARKER) || refB.includes(MOCK_LOW_MATCH_MARKER)) {
      return ok({ score: 0.4, templateRef: refA });
    }
    if (refA === refB) {
      return ok({ score: 0.99, templateRef: refA });
    }
    // Deterministic, order-independent score biased high (0.80–0.99) so typical
    // mock pairs pass the photo↔selfie gate.
    const key = [refA, refB].sort().join('|');
    const score = 0.8 + hashUnit(key) * 0.19;
    return ok({ score: Number(score.toFixed(3)), templateRef: refA });
  }
}
