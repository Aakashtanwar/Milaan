import type { BaseProvider, Outcome } from '../shared';

/**
 * Liveness + face-match abstraction (Spec §2/§4). Live impl targets AWS
 * Rekognition (StartFaceLivenessSession + CompareFaces); swappable for Azure
 * Face or an on-device model.
 *
 * LEGAL: confirm with counsel before production. Selfie/liveness frames are used
 * only for matching then DISCARDED — we retain only an opaque face TEMPLATE
 * reference (never raw images), encrypted at rest (Spec §3.4 / §12).
 */
export interface LivenessSession {
  sessionId: string;
  /** ISO timestamp; mock uses a fixed value (no Date.now). */
  expiresAt: string;
}

export interface LivenessResult {
  sessionId: string;
  passed: boolean;
  /** Opaque template reference derived from the live selfie — NOT an image. */
  templateRef: string;
}

export interface FaceCompareResult {
  /** Similarity in [0, 1]. Compared against config thresholds. */
  score: number;
  templateRef: string;
}

export interface BiometricProvider extends BaseProvider {
  startLiveness(input: { userId: string }): Promise<Outcome<LivenessSession>>;
  completeLiveness(input: { sessionId: string }): Promise<Outcome<LivenessResult>>;
  /** Compare two opaque template refs (selfie↔id, photo↔selfie). */
  compareFaces(input: { refA: string; refB: string }): Promise<Outcome<FaceCompareResult>>;
}
