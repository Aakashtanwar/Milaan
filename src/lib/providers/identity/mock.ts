import { err, hash32, ok, pick } from '../shared';
import type { IdentityProvider, VerifiedIdentity } from './types';

const NAMES = [
  'Aarav Sharma',
  'Vivaan Patel',
  'Aditya Reddy',
  'Diya Nair',
  'Ananya Iyer',
  'Saanvi Gupta',
  'Ishaan Khan',
  'Kabir Singh',
] as const;

const GENDERS = ['male', 'female', 'other'] as const;

/** Reserved token that always fails — lets the UI/tests exercise the error path. */
export const MOCK_IDENTITY_FAIL_TOKEN = 'FAIL';

/**
 * Deterministic mock identity provider. Same `token` → same VerifiedIdentity,
 * always. No network, no Math.random, no Date.now (Spec §13).
 */
export class MockIdentityProvider implements IdentityProvider {
  readonly mode = 'mock' as const;

  async startVerification({ phone }: { phone: string }) {
    return ok({ sessionId: `mock-id-${hash32(phone).toString(16)}` });
  }

  async confirmVerification({ token }: { sessionId: string; token: string }) {
    if (token === MOCK_IDENTITY_FAIL_TOKEN) {
      return err('IDENTITY_MISMATCH', 'Mock identity verification failed for reserved token.');
    }

    const h = hash32(token);
    // Deterministic adult age in [18, 45].
    const age = 18 + (h % 28);
    const birthYear = 2026 - age; // fixed reference year (no Date.now)
    const month = String((h % 12) + 1).padStart(2, '0');
    const day = String((h % 28) + 1).padStart(2, '0');

    const identity: VerifiedIdentity = {
      name: pick(NAMES, token),
      age,
      gender: pick(GENDERS, `${token}:g`),
      dob: `${birthYear}-${month}-${day}`,
      photoRef: `mock-id-photo:${h.toString(16)}`,
      maskedAadhaar: String(h % 10000).padStart(4, '0'),
      // LEGAL: live mode must substitute a real one-way hash of the Aadhaar number.
      aadhaarHash: `sha256-mock:${h.toString(16)}`,
    };
    return ok(identity);
  }
}
