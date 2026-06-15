import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, StepProgress, Text } from '@/components/ui';
import { getBiometricProvider } from '@/lib/providers';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Step 2 — Live selfie + liveness. Spec §4.4.
 *
 * Shows the front-camera preview inside a face frame. Capture runs the
 * BiometricProvider liveness flow; in mock mode this succeeds deterministically
 * and works even on a simulator with no camera. We keep only a face TEMPLATE
 * reference and discard raw frames.
 *
 * LEGAL: confirm with counsel before production (Spec §3.4).
 */
export default function Liveness() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [permission] = useCameraPermissions();
  const setSelfieTemplate = useOnboarding((s) => s.setSelfieTemplate);
  const setStep = useOnboarding((s) => s.setStep);
  const [capturing, setCapturing] = useState(false);

  const granted = permission?.granted ?? false;

  async function onCapture() {
    setCapturing(true);
    const bio = getBiometricProvider();
    const session = await bio.startLiveness({ userId: 'mock-user' });
    if (!session.ok) return setCapturing(false);
    const liveness = await bio.completeLiveness({ sessionId: session.data.sessionId });
    setCapturing(false);
    if (liveness.ok && liveness.data.passed) {
      setSelfieTemplate(liveness.data.templateRef);
      setStep('verifying');
      router.push(routeForStep('verifying') as never);
    }
  }

  return (
    <Screen scroll={false}>
      <StepProgress current={3} />
      <View style={styles.body}>
        <Text variant="title">{t('onboarding.livenessTitle')}</Text>
        <Text variant="body" color="textSecondary">
          {t('onboarding.livenessBody')}
        </Text>

        <View style={[styles.frame, { borderColor: theme.colors.accent, backgroundColor: '#000' }]}>
          {granted ? (
            <CameraView style={StyleSheet.absoluteFill} facing="front" />
          ) : (
            <View style={styles.noCam}>
              <Ionicons name="person" size={88} color="rgba(255,255,255,0.5)" />
            </View>
          )}
          <View style={[styles.ring, { borderColor: theme.colors.surface }]} />
        </View>

        <Text variant="caption" color="textMuted" style={styles.center}>
          {t('onboarding.cameraGuide')}
        </Text>
      </View>

      <Button title={t('onboarding.capture')} loading={capturing} onPress={onCapture} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: 14, marginTop: 8, alignItems: 'center', flex: 1 },
  frame: {
    width: '78%',
    aspectRatio: 0.8,
    borderRadius: 200,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  noCam: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 200, borderWidth: 6, opacity: 0.25 },
  center: { textAlign: 'center' },
});
