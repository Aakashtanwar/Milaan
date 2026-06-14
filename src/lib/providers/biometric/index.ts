import { config } from '@/config';

import { MockBiometricProvider } from './mock';
import type { BiometricProvider } from './types';

export type {
  BiometricProvider,
  FaceCompareResult,
  LivenessResult,
  LivenessSession,
} from './types';
export {
  MockBiometricProvider,
  MOCK_LOW_MATCH_MARKER,
  MOCK_LIVENESS_FAIL_MARKER,
} from './mock';

/**
 * Factory keyed by config.providers.biometric. `live` (AWS Rekognition) lands
 * in Phase 4. LEGAL: confirm with counsel before enabling live mode.
 */
export function getBiometricProvider(): BiometricProvider {
  if (config.providers.biometric === 'mock') return new MockBiometricProvider();
  throw new Error('Live BiometricProvider not implemented yet (Phase 4).');
}
