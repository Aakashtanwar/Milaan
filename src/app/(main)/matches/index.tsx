import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';
import { thresholds } from '@/config';

/**
 * Matches list (Spec §4.9). Phase 0 stub: shows the active-slot count and a
 * sample row that opens the chat thread. Phase 3 adds active vs archived
 * sections, stale-slot nudges, and the 48h responsiveness refund.
 */
export default function Matches() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="title">{t('matches.title')}</Text>
      <Text variant="label" color="textSecondary">
        {t('swipe.slots', { count: 1, max: thresholds.match.maxActive })}
      </Text>
      <Card>
        <Text variant="heading">Diya</Text>
        <Text variant="body" color="textSecondary">
          Tap to open your conversation
        </Text>
        <Button
          title={t('chat.title')}
          variant="secondary"
          onPress={() => router.push('/(main)/matches/sample-match')}
        />
      </Card>
    </Screen>
  );
}
