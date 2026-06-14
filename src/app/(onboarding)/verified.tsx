import { useTranslation } from 'react-i18next';

import { Button, Screen, Text, VerifiedBadge } from '@/components/ui';
import { useSession } from '@/state/session';

/**
 * First-run payoff (Spec §4.6). The reward for finishing verification is
 * immediate access — completing here flips the session to `verified`, and the
 * route gate lands the user on the swipe deck.
 */
export default function Verified() {
  const { t } = useTranslation();
  const completeVerification = useSession((s) => s.completeVerification);
  return (
    <Screen center>
      <VerifiedBadge />
      <Text variant="display">{t('onboarding.verifiedTitle')}</Text>
      <Text variant="body" color="textSecondary">
        {t('onboarding.verifiedBody')}
      </Text>
      <Button title={t('onboarding.startSwiping')} onPress={() => completeVerification()} />
    </Screen>
  );
}
