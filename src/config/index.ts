import { featureFlags, type FeatureFlags } from './flags';
import { thresholds, type Thresholds } from './thresholds';

/**
 * Central app configuration & mock-mode switch (Spec §13).
 *
 * Every external service is reached through a typed provider interface and can
 * run in `mock` or `live` mode INDEPENDENTLY. In Phase 0 every service defaults
 * to `mock`, so the whole app runs end-to-end with zero paid API calls.
 */
export type ProviderMode = 'mock' | 'live';

export type ProviderName = 'identity' | 'biometric' | 'moderation' | 'chat';

export interface AppConfig {
  /** Single rename point for the whole product (Spec preamble). */
  appName: string;
  env: 'local' | 'preview' | 'production';
  providers: Record<ProviderName, ProviderMode>;
  thresholds: Thresholds;
  flags: FeatureFlags;
  /**
   * COMPLIANCE_MODE gates sensitive Aadhaar/biometric handling (Spec §3/§5).
   * `strict` is the only production-safe value; `dev` relaxes nothing about
   * storage rules — it only signals we are running against mock providers.
   */
  complianceMode: 'strict' | 'dev';
}

const mode = (raw: string | undefined): ProviderMode => (raw === 'live' ? 'live' : 'mock');

export const config: AppConfig = {
  appName: 'Milaan',
  env: (process.env.EXPO_PUBLIC_ENV as AppConfig['env']) ?? 'local',
  providers: {
    identity: mode(process.env.EXPO_PUBLIC_PROVIDER_IDENTITY),
    biometric: mode(process.env.EXPO_PUBLIC_PROVIDER_BIOMETRIC),
    moderation: mode(process.env.EXPO_PUBLIC_PROVIDER_MODERATION),
    chat: mode(process.env.EXPO_PUBLIC_PROVIDER_CHAT),
  },
  thresholds,
  flags: featureFlags,
  complianceMode: process.env.EXPO_PUBLIC_ENV === 'production' ? 'strict' : 'dev',
};

export { thresholds, featureFlags };
export type { Thresholds, FeatureFlags };
