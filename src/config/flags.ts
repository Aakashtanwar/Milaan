/**
 * Feature flags. Phase-gated capabilities default off until their phase lands.
 */
export const featureFlags = {
  // Social handles (Spec §4.5)
  enableInstagramLink: true,
  enableLinkedinLink: true,
  enableSnapchatLink: true,

  // Phase 3+
  enableImageMessages: false,
  enableSuperlike: false,

  // Onboarding behaviour
  requireLivenessBeforeProfile: true,
  /** Resume an abandoned verification at the exact step (Spec §4.11). */
  enableResumeOnboarding: true,
} as const;

export type FeatureFlags = typeof featureFlags;
