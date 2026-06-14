import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Card, Screen, StepProgress, Text } from '@/components/ui';
import { thresholds } from '@/config';

/**
 * Step 4 — Profile photos, each auto-verified. Spec §4.4.
 *
 * INTEGRATION POINT: each uploaded photo runs face-detect → match to the selfie
 * template (≥ photoToSelfie) → ModerationProvider screen → green tick or a clear
 * reason. Phase 1 wires the picker + per-photo result UI; Phase 0 is the stub.
 */
export default function Photos() {
  const { t } = useTranslation();
  return (
    <Screen>
      <StepProgress current={4} />
      <Text variant="title">{t('onboarding.photosTitle')}</Text>
      <Card>
        <Text variant="body" color="textSecondary">
          {t('onboarding.photosBody')}
        </Text>
        <Text variant="caption" color="textSecondary">
          {thresholds.photos.min}–{thresholds.photos.max} photos
        </Text>
      </Card>
      <Button title={t('auth.continue')} onPress={() => router.push('/(onboarding)/profile-setup')} />
    </Screen>
  );
}
