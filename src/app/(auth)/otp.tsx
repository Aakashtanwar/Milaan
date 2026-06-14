import { useTranslation } from 'react-i18next';

import { Button, Screen, Text } from '@/components/ui';
import { useSession } from '@/state/session';

/**
 * OTP entry (Spec §4.2). Phase 0 stub — verifying moves the mocked session into
 * `onboarding`, so the route gate routes on to the verification flow.
 */
export default function Otp() {
  const { t } = useTranslation();
  const signIn = useSession((s) => s.signIn);
  return (
    <Screen center>
      <Text variant="title">{t('auth.otpTitle')}</Text>
      <Button title={t('auth.verify')} onPress={() => signIn()} />
    </Screen>
  );
}
