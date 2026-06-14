import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Card, Screen, StepProgress, Text } from '@/components/ui';
import { getBiometricProvider } from '@/lib/providers';

/**
 * Step 2 — Live selfie + liveness. Spec §4.4.
 *
 * INTEGRATION POINT: BiometricProvider. Phase 1 adds the in-app camera +
 * randomized liveness challenge (native module — the reason we ship a custom
 * dev client). We store only a face TEMPLATE reference and discard raw frames.
 *
 * LEGAL: confirm with counsel before production (Spec §3.4).
 */
export default function Liveness() {
  const { t } = useTranslation();

  async function onCapture() {
    const bio = getBiometricProvider();
    const session = await bio.startLiveness({ userId: 'mock-user' });
    if (!session.ok) return;
    const liveness = await bio.completeLiveness({ sessionId: session.data.sessionId });
    if (liveness.ok && liveness.data.passed) {
      router.push('/(onboarding)/verifying');
    }
  }

  return (
    <Screen>
      <StepProgress current={2} />
      <Text variant="title">{t('onboarding.livenessTitle')}</Text>
      <Card>
        <Text variant="body" color="textSecondary">
          {t('onboarding.livenessBody')}
        </Text>
      </Card>
      <Button title={t('auth.continue')} onPress={onCapture} />
    </Screen>
  );
}
