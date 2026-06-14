import { Stack } from 'expo-router';

/** Linear verification flow (Spec §4.4). Each step pushes the next. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
