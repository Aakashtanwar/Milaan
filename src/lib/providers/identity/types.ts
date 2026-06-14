import type { BaseProvider, Outcome } from '../shared';

/**
 * Verified identity returned by a licensed KYC provider via DigiLocker / Aadhaar
 * Offline e-KYC. We consume the provider's CONSENTED, verified output — we never
 * touch UIDAI or OCR an Aadhaar card ourselves (Spec §3).
 *
 * LEGAL: confirm with counsel before production. Storage rules (Spec §3):
 *  - NEVER persist the full 12-digit Aadhaar number or the card image.
 *  - Store only `aadhaarHash` (one-way, for duplicate detection) and
 *    `maskedAadhaar` (last 4, for display).
 *  - `photoRef` is an opaque reference to the ID portrait used transiently for
 *    face-match — never the raw image bytes.
 */
export interface VerifiedIdentity {
  name: string;
  /** Derived age in years (provider returns verified DOB). */
  age: number;
  gender: 'male' | 'female' | 'other';
  /** ISO date (YYYY-MM-DD). */
  dob: string;
  /** Opaque reference to the ID portrait, NOT raw bytes. */
  photoRef: string;
  /** Last 4 digits only, e.g. "1234". */
  maskedAadhaar: string;
  /** One-way hash of the Aadhaar number for duplicate detection. */
  aadhaarHash: string;
}

export interface IdentityProvider extends BaseProvider {
  /** Begin a verification session (e.g. opens the DigiLocker consent flow). */
  startVerification(input: { phone: string }): Promise<Outcome<{ sessionId: string }>>;
  /**
   * Exchange the provider's consented token for verified fields.
   * `token` stands in for a DigiLocker code / signed e-KYC XML in live mode.
   */
  confirmVerification(input: {
    sessionId: string;
    token: string;
  }): Promise<Outcome<VerifiedIdentity>>;
}
