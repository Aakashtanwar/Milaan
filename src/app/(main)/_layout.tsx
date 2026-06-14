import { Ionicons } from '@expo/vector-icons';
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
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 86,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: 'DMSans_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="swipe"
        options={{
          title: t('tabs.swipe'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: t('tabs.matches'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
