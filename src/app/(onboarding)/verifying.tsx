import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Screen, Text } from '@/components/ui';
import { thresholds } from '@/config';
import { getBiometricProvider } from '@/lib/providers';
import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Step 3 — Face match (invisible/automatic). Spec §4.4. Compares the Step-2
 * selfie template to the Step-1 ID photo server-side; the user just sees a brief
 * "Verifying you…". On pass (≥ selfieToId) we advance automatically.
 */
export default function Verifying() {
  const { t } = useTranslation();
  const identity = useOnboarding((s) => s.identity);
  const selfieTemplate = useOnboarding((s) => s.selfieTemplate);
  const setStep = useOnboarding((s) => s.setStep);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const bio = getBiometricProvider();
      const cmp = await bio.compareFaces({
        refA: selfieTemplate ?? 'mock-template:selfie',
        refB: identity?.photoRef ?? 'mock-id-photo:reference',
      });
      if (cancelled) return;
      // Mock scores clear the threshold; the fail path (retry) is wired for live.
      const passed = cmp.ok && cmp.data.score >= thresholds.faceMatch.selfieToId;
      setStep(passed ? 'photos' : 'liveness');
      router.replace(routeForStep(passed ? 'photos' : 'liveness') as never);
    })();
    return () => {
      cancelled = true;
    };
  }, [identity, selfieTemplate, setStep]);

  return (
    <Screen center scroll={false}>
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text variant="serifLg">{t('onboarding.verifying')}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 18 },
});
