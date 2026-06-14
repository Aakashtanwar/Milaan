import type { BaseProvider, Outcome } from '../shared';

/**
 * Image moderation abstraction (Spec §2/§5). Live impl targets AWS Rekognition
 * Content Moderation (or Hive) for nudity/abuse screening on every upload.
 */
export type ModerationDecision = 'approved' | 'rejected' | 'pending';

export interface ModerationResult {
  decision: ModerationDecision;
  /** Labels that drove the decision, e.g. ['nudity', 'violence']. */
  labels: string[];
  /** Confidence in [0, 1]. */
  confidence: number;
}

export interface ModerationProvider extends BaseProvider {
  /** Screen an already-uploaded image referenced by its storage path. */
  screenImage(input: { storagePath: string }): Promise<Outcome<ModerationResult>>;
}
