/**
 * Numeric thresholds that govern verification, matching and scoring.
 * Centralised so product can tune them without hunting through code.
 */
export const thresholds = {
  /** Face-match score gates (0..1). See Spec §4.3 / §4.4. */
  faceMatch: {
    selfieToId: 0.85, // Step 3: live selfie ↔ ID photo
    photoToSelfie: 0.8, // Step 4: each profile photo ↔ verified selfie
  },

  /** The defining product rule: at most 5 active matches (Spec §7). */
  match: {
    maxActive: 5,
    /** No reply from either side within this window → match goes stale. */
    staleAfterHours: 48,
  },

  /** quality_score component weights (sum = 1.0). Rewards participation,
   *  NOT appearance — see Spec §6. */
  score: {
    weights: {
      profileCompleteness: 0.3,
      verificationStrength: 0.15,
      responsiveness: 0.35,
      photoQuality: 0.2,
    },
    /** Over-exposure decay: profiles shown a lot get temporarily down-weighted. */
    decay: { halfLifeDays: 14, floor: 0.25 },
  },

  /** Profile photo bounds (Spec §4.4). */
  photos: { min: 3, max: 6 },

  /** Hard age gate (Spec §3 / §4.4). */
  minAgeYears: 18,
} as const;

export type Thresholds = typeof thresholds;
