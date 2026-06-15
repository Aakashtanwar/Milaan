import { Redirect } from 'expo-router';

import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Route gate. Sends the user to the right place based on persisted state:
 *   signed-out → (auth)/welcome
 *   onboarding → the exact step they last reached (resume, Spec §4.11)
 *   verified   → the swipe deck
 */
export default function Index() {
  const phase = useOnboarding((s) => s.phase);
  const step = useOnboarding((s) => s.step);

  if (phase === 'signed-out') return <Redirect href="/(auth)/welcome" />;
  if (phase === 'onboarding') return <Redirect href={routeForStep(step) as never} />;
  return <Redirect href="/(main)/swipe" />;
}
