import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Screen, StepProgress, Text } from '@/components/ui';
import { thresholds } from '@/config';
import { getIdentityProvider } from '@/lib/providers';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Step 1 — Identity (Aadhaar via DigiLocker / Offline e-KYC). Spec §4.4.
 *
 * Mock identity returns a deterministic verified identity; we PREFILL the
 * profile from it and move on. The 18+ gate is enforced here too.
 *
 * LEGAL: confirm with counsel before production. NEVER store the full Aadhaar
 * number or ID image — only masked last-4 + a one-way hash (Spec §3).
 */
export default function Identity() {
  const { t } = useTranslation();
  const theme = useTheme();
  const phone = useOnboarding((s) => s.phone);
  const setIdentity = useOnboarding((s) => s.setIdentity);
  const setStep = useOnboarding((s) => s.setStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function onConnect() {
    setLoading(true);
    setError(undefined);
    const identity = getIdentityProvider();
    const started = await identity.startVerification({ phone: phone ?? '+910000000000' });
    if (!started.ok) {
      setError(started.message);
      setLoading(false);
      return;
    }
    const result = await identity.confirmVerification({
      sessionId: started.data.sessionId,
      token: 'mock-consented-token',
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (result.data.age < thresholds.minAgeYears) {
      setError(t('onboarding.underageError'));
      return;
    }
    setIdentity(result.data); // prefills name/age/gender
    setStep('liveness');
    router.push(routeForStep('liveness') as never);
  }

  return (
    <Screen scroll={false}>
      <StepProgress current={3} />
      <View style={styles.body}>
        <Text variant="title">{t('onboarding.identityTitle')}</Text>
        <Text variant="body" color="textSecondary">
          {t('onboarding.identityBody')}
        </Text>
        <Card>
          <View style={styles.row}>
            <Ionicons name="finger-print" size={22} color={theme.colors.accent} />
            <Text variant="heading">DigiLocker</Text>
          </View>
          <Text variant="caption" color="textMuted">
            {t('consent.legalNote')}
          </Text>
        </Card>
        {error ? (
          <Text variant="label" color="danger">
            {error}
          </Text>
        ) : null}
      </View>
      <Button title={t('onboarding.connect')} loading={loading} onPress={onConnect} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: 14, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
