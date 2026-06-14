import { describe, expect, it } from 'vitest';

import { MOCK_IDENTITY_FAIL_TOKEN, MockIdentityProvider } from '@/lib/providers/identity';

const provider = new MockIdentityProvider();

describe('MockIdentityProvider', () => {
  it('is deterministic: same token → identical VerifiedIdentity', async () => {
    const a = await provider.confirmVerification({ sessionId: 's', token: 'tok-123' });
    const b = await provider.confirmVerification({ sessionId: 'different', token: 'tok-123' });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.data).toEqual(b.data);
  });

  it('different tokens generally produce different identities', async () => {
    const a = await provider.confirmVerification({ sessionId: 's', token: 'alpha' });
    const b = await provider.confirmVerification({ sessionId: 's', token: 'beta' });
    if (a.ok && b.ok) expect(a.data.aadhaarHash).not.toEqual(b.data.aadhaarHash);
  });

  it('never exposes a full Aadhaar number: masked is exactly 4 digits', async () => {
    const r = await provider.confirmVerification({ sessionId: 's', token: 'tok-xyz' });
    if (r.ok) expect(r.data.maskedAadhaar).toMatch(/^\d{4}$/);
  });

  it('enforces the 18+ gate: mock ages are always >= 18', async () => {
    for (const token of ['a', 'b', 'c', 'd', 'e', 'longer-token-value', 'x']) {
      const r = await provider.confirmVerification({ sessionId: 's', token });
      if (r.ok) expect(r.data.age).toBeGreaterThanOrEqual(18);
    }
  });

  it('returns an error for the reserved FAIL token', async () => {
    const r = await provider.confirmVerification({ sessionId: 's', token: MOCK_IDENTITY_FAIL_TOKEN });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('IDENTITY_MISMATCH');
  });
});
