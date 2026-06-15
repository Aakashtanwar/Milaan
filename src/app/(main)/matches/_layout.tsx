import { Stack } from 'expo-router';

/**
 * Nested stack for the Matches tab: the list (index) pushes the chat thread
 * ([matchId]). Without this, the dynamic chat route leaks into the tab bar as a
 * separate tab.
 */
export default function MatchesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
