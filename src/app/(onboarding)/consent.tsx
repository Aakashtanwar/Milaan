import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, StepProgress, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Plain-language DPDP consent (Spec §3.6) shown before any ID capture: what we
 * collect, why, how long, and how to delete it. This is a hard product
 * requirement, not boilerplate.
 *
 * LEGAL: confirm with counsel before production. Copy must reflect the actual
 * licensed KYC integration and retention policy.
 */
export default function Consent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const setStep = useOnboarding((s) => s.setStep);

  const points = [
    { icon: 'document-text-outline' as const, text: t('consent.collect') },
    { icon: 'shield-checkmark-outline' as const, text: t('consent.why') },
    { icon: 'lock-closed-outline' as const, text: t('consent.retention') },
    { icon: 'trash-outline' as const, text: t('consent.deletion') },
  ];

  function onAgree() {
    setStep('identity');
    router.push(routeForStep('identity') as never);
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <StepProgress current={2} />
        <Text variant="title">{t('consent.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="body" color="textSecondary">
          {t('consent.intro')}
        </Text>
        {points.map((p) => (
          <View key={p.icon} style={styles.point}>
            <Ionicons name={p.icon} size={22} color={theme.colors.accent} />
            <Text variant="body" style={styles.flex}>
              {p.text}
            </Text>
          </View>
        ))}
        <Text variant="caption" color="textMuted" style={styles.legal}>
          {t('consent.legalNote')}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('consent.agree')} onPress={onAgree} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, gap: 16 },
  scroll: { padding: 24, gap: 18 },
  point: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  legal: { marginTop: 4 },
  footer: { padding: 24, paddingTop: 8 },
});
