import { Redirect } from 'expo-router';

import { useSession } from '@/state/session';

/**
 * Route gate. Sends the user to the right place based on session phase:
 *   signed-out  → (auth)        — phone/OTP
 *   onboarding  → (onboarding)  — the 4-step verification flow
 *   verified    → (main)        — the swipe deck
 *
 * Phase 0 reads a mocked session (src/state/session). Phase 1 swaps the source
 * for Supabase Auth + users.status without changing this gate.
 */
export default function Index() {
  const phase = useSession((s) => s.phase);

  if (phase === 'signed-out') return <Redirect href="/(auth)/welcome" />;
  if (phase === 'onboarding') return <Redirect href="/(onboarding)/identity" />;
  return <Redirect href="/(main)/swipe" />;
}
