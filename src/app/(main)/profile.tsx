import { useTranslation } from 'react-i18next';

import { Button, Card, Screen, Text, VerifiedBadge } from '@/components/ui';
import { useSession } from '@/state/session';

/**
 * Profile / settings entry (Spec §4.10). Phase 0 stub: shows the verified badge
 * and a sign-out that returns to the auth flow. Phase 1+ adds edit photos/
 * details, preferences, privacy & data (export / delete), safety center.
 */
export default function Profile() {
  const { t } = useTranslation();
  const signOut = useSession((s) => s.signOut);
  return (
    <Screen>
      <Text variant="title">{t('profile.title')}</Text>
      <Card>
        <VerifiedBadge />
        <Text variant="heading">You</Text>
        <Text variant="body" color="textSecondary">
          Edit profile, preferences, privacy & data, and safety center arrive in later phases.
        </Text>
      </Card>
      <Button title={t('profile.signOut')} variant="ghost" onPress={() => signOut()} />
    </Screen>
  );
}
