import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { Screen, Text } from '@/components/ui';
import { thresholds } from '@/config';
import { getBiometricProvider } from '@/lib/providers';

/**
 * Step 3 — Face match (invisible/automatic). Spec §4.4. Compares the Step-2
 * selfie template to the Step-1 ID photo server-side; the user just sees a brief
 * "Verifying you…". On pass (score ≥ selfieToId) we move on automatically.
 */
export default function Verifying() {
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const bio = getBiometricProvider();
      // Mock template refs; live mode uses the real selfie + ID templates.
      const cmp = await bio.compareFaces({
        refA: 'mock-template:selfie',
        refB: 'mock-id-photo:reference',
      });
      if (cancelled) return;
      if (cmp.ok && cmp.data.score >= thresholds.faceMatch.selfieToId) {
        router.replace('/(onboarding)/photos');
      } else {
        // Phase 1: up to 3 retries with tips, then a support fallback (no wall).
        router.replace('/(onboarding)/photos');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen center scroll={false}>
      <ActivityIndicator size="large" />
      <Text variant="heading">{t('onboarding.verifying')}</Text>
    </Screen>
  );
}
