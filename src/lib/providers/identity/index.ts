import { config } from '@/config';

import { MockIdentityProvider } from './mock';
import type { IdentityProvider } from './types';

export type { IdentityProvider, VerifiedIdentity } from './types';
export { MockIdentityProvider, MOCK_IDENTITY_FAIL_TOKEN } from './mock';

/**
 * Factory keyed by config.providers.identity. `live` throws until a licensed
 * KYC provider (Setu / Digio / Signzy) is wired in a later phase (Spec §2/§3).
 * LEGAL: confirm with counsel before enabling live mode.
 */
export function getIdentityProvider(): IdentityProvider {
  if (config.providers.identity === 'mock') return new MockIdentityProvider();
  throw new Error('Live IdentityProvider not implemented yet (Phase 4).');
}
