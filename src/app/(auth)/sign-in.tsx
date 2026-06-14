import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Screen, Text } from '@/components/ui';

/**
 * Phone entry (Spec §4.2). Phase 0 stub — no real input yet; Phase 1 adds the
 * +91 field, SMS autofill and Supabase phone OTP. Tapping continue advances to
 * the OTP screen.
 */
export default function SignIn() {
  const { t } = useTranslation();
  return (
    <Screen center>
      <Text variant="title">{t('auth.signInTitle')}</Text>
      <Text variant="body" color="textSecondary">
        {t('auth.signInSubtitle')}
      </Text>
      <Button title={t('auth.continue')} onPress={() => router.push('/(auth)/otp')} />
    </Screen>
  );
}
