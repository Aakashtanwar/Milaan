import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Text, TextField, VerifiedBadge } from '@/components/ui';
import { featureFlags } from '@/config';
import { useTheme } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';

const INTEREST_OPTIONS = [
  'Music', 'Travel', 'Food', 'Films', 'Fitness', 'Books', 'Art', 'Coffee',
  'Hiking', 'Dance', 'Gaming', 'Cricket', 'Photography', 'Startups',
];
const MAX_INTERESTS = 5;

/**
 * Profile details (Spec §4.5). Name/age/gender come prefilled from the verified
 * ID (read-only here); the user adds a bio, up to 5 interests, and optional
 * socials. Chips over text fields — minimal typing. Then the verified payoff.
 */
export default function ProfileSetup() {
  const { t } = useTranslation();
  const theme = useTheme();
  const profile = useOnboarding((s) => s.profile);
  const updateProfile = useOnboarding((s) => s.updateProfile);

  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [instagram, setInstagram] = useState(profile.instagram);

  function toggleInterest(tag: string) {
    setInterests((cur) =>
      cur.includes(tag) ? cur.filter((i) => i !== tag) : cur.length < MAX_INTERESTS ? [...cur, tag] : cur,
    );
  }

  function onSave() {
    updateProfile({ bio, interests, instagram });
    router.push('/(onboarding)/verified');
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headRow}>
          <View style={styles.flex}>
            <Text variant="title">{t('onboarding.profileTitle')}</Text>
            <Text variant="body" color="textSecondary">
              {t('onboarding.profileBody')}
            </Text>
          </View>
        </View>

        {/* Prefilled, verified basics */}
        <View style={[styles.prefill, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <View style={styles.prefillRow}>
            <Text variant="heading">
              {profile.name || '—'}
              {profile.age ? `, ${profile.age}` : ''}
            </Text>
            <VerifiedBadge label={t('onboarding.photoApproved')} />
          </View>
          {profile.gender ? (
            <Text variant="caption" color="textMuted">
              {profile.gender}
            </Text>
          ) : null}
        </View>

        <TextField
          label={t('onboarding.bio')}
          value={bio}
          onChangeText={setBio}
          placeholder={t('onboarding.bioPlaceholder')}
          multiline
          maxLength={300}
        />

        <View style={{ gap: 10 }}>
          <Text variant="label" color="textSecondary">
            {t('onboarding.interests')} ({interests.length}/{MAX_INTERESTS})
          </Text>
          <View style={styles.chips}>
            {INTEREST_OPTIONS.map((tag) => {
              const on = interests.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleInterest(tag)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: on ? theme.colors.accent : theme.colors.surface,
                      borderColor: on ? theme.colors.accent : theme.colors.border,
                      borderRadius: theme.radii.pill,
                    },
                  ]}
                >
                  <Text variant="label" style={{ color: on ? theme.colors.textOnAccent : theme.colors.textSecondary }}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {featureFlags.enableInstagramLink ? (
          <TextField
            label={t('onboarding.socials')}
            prefix="@"
            value={instagram}
            onChangeText={setInstagram}
            placeholder="instagram"
            autoCapitalize="none"
          />
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('onboarding.save')} onPress={onSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 24, gap: 20 },
  headRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  prefill: { padding: 16, gap: 4 },
  prefillRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5 },
  footer: { padding: 24, paddingTop: 8 },
});
