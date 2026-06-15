import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Avatar, Text, VerifiedBadge } from '@/components/ui';
import { useOnboarding } from '@/state/onboarding';
import { useTheme } from '@/lib/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string };

const rows: Row[] = [
  { icon: 'create-outline', label: 'Edit profile & photos' },
  { icon: 'options-outline', label: 'Discovery preferences' },
  { icon: 'lock-closed-outline', label: 'Privacy & data' },
  { icon: 'shield-checkmark-outline', label: 'Safety center' },
  { icon: 'help-circle-outline', label: 'Help & support' },
];

/**
 * Profile / settings (Spec §4.10). Phase 0: identity header + settings rows +
 * sign-out. Later phases wire edit photos (re-verified), preferences, privacy &
 * data (export / delete), and the safety center.
 */
export default function Profile() {
  const { t } = useTranslation();
  const theme = useTheme();
  const reset = useOnboarding((s) => s.reset);

  function onSignOut() {
    reset(); // phase → signed-out, clears onboarding draft
    router.replace('/'); // re-run the gate → welcome
  }
  const profile = useOnboarding((s) => s.profile);
  const photos = useOnboarding((s) => s.photos);

  const avatar = photos.find((p) => p.status === 'approved')?.uri ?? 'https://i.pravatar.cc/400?img=14';
  const displayName = profile.name
    ? `${profile.name}${profile.age ? `, ${profile.age}` : ''}`
    : 'Your profile';

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar uri={avatar} size={104} verified />
          <Text variant="display">{displayName}</Text>
          <VerifiedBadge label="ID verified" />
        </View>

        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          {rows.map((r, i) => (
            <Pressable
              key={r.label}
              style={[styles.row, i < rows.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}
            >
              <Ionicons name={r.icon} size={21} color={theme.colors.accent} />
              <Text variant="body" style={styles.flex}>
                {r.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={onSignOut} style={styles.signOut}>
          <Text variant="label" color="danger">
            {t('profile.signOut')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, gap: 24 },
  head: { alignItems: 'center', gap: 10, paddingTop: 12 },
  group: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  signOut: { alignItems: 'center', paddingVertical: 8 },
});
