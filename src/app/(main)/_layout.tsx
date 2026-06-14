import { useTranslation } from 'react-i18next';
import { Tabs } from 'expo-router';

import { useTheme } from '@/lib/theme';

/** Main app tabs (Spec §4.7–§4.10): Discover · Matches · Profile. */
export default function MainLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen name="swipe" options={{ title: t('tabs.swipe') }} />
      <Tabs.Screen name="matches" options={{ title: t('tabs.matches') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
