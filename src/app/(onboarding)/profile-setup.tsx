import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';

/**
 * Profile details (Spec §4.5) — mostly prefilled from the verified ID; the user
 * confirms name/age/gender and adds interests/socials (chips over text fields).
 * Phase 0 stub; advancing leads to the "You're verified" payoff.
 */
export default function ProfileSetup() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="title">{t('onboarding.profileTitle')}</Text>
      <Card>
        <Text variant="body" color="textSecondary">
          Confirm your prefilled basics and add a few interests. (Phase 1)
        </Text>
      </Card>
      <Button title={t('onboarding.finish')} onPress={() => router.push('/(onboarding)/verified')} />
    </Screen>
  );
}
