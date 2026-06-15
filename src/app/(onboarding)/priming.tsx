import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, StepProgress, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding } from '@/state/onboarding';

/**
 * Permission priming (Spec §4.3). Explain WHY we need the camera before the OS
 * prompt — priming first measurably reduces denials. We proceed to consent
 * regardless of the outcome (the live selfie step re-checks).
 */
export default function Priming() {
  const { t } = useTranslation();
  const theme = useTheme();
  const setStep = useOnboarding((s) => s.setStep);
  const [, requestPermission] = useCameraPermissions();

  async function onAllow() {
    await requestPermission();
    setStep('consent');
    router.push(routeForStep('consent') as never);
  }

  return (
    <Screen scroll={false}>
      <StepProgress current={1} />
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentSoft }]}>
          <Ionicons name="camera" size={36} color={theme.colors.accent} />
        </View>
        <Text variant="title">{t('priming.title')}</Text>
        <Text variant="body" color="textSecondary">
          {t('priming.body')}
        </Text>
      </View>
      <View style={styles.cta}>
        <Button title={t('priming.allow')} onPress={onAllow} />
        <Text variant="caption" color="textMuted" style={styles.center}>
          {t('priming.why')}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 14, marginTop: 16 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  cta: { gap: 10, marginTop: 'auto' },
  center: { textAlign: 'center' },
});
