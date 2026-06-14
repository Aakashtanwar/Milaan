import { create } from 'zustand';

/**
 * Mocked session state for Phase 0. Mirrors the real lifecycle the route gate
 * will eventually read from Supabase Auth + users.status:
 *   signed-out → onboarding (after OTP) → verified (after the 4-step flow).
 *
 * Phase 1 replaces these actions with real auth + verification calls; the shape
 * stays the same so the gate (src/app/index.tsx) doesn't change.
 */
export type SessionPhase = 'signed-out' | 'onboarding' | 'verified';

interface SessionState {
  phase: SessionPhase;
  userId: string | null;
  /** Pretend an OTP succeeded → enter onboarding. */
  signIn: (userId?: string) => void;
  /** Pretend the 4-step verification completed → verified, into the app. */
  completeVerification: () => void;
  signOut: () => void;
}

export const useSession = create<SessionState>((set) => ({
  phase: 'signed-out',
  userId: null,
  signIn: (userId = 'mock-user') => set({ phase: 'onboarding', userId }),
  completeVerification: () => set({ phase: 'verified' }),
  signOut: () => set({ phase: 'signed-out', userId: null }),
}));
