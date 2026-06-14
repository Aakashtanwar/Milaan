import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card, Screen, Text, VerifiedBadge } from '@/components/ui';
import { thresholds } from '@/config';

/**
 * Swipe deck (Spec §4.7). Phase 0 stub: a single placeholder card + the
 * always-visible match-slot indicator. Phase 2 brings the real card stack, the
 * fair-feed algorithm, and swipe gestures.
 */
export default function Swipe() {
  const { t } = useTranslation();
  const activeMatches = 0; // Phase 2: from the matches store / Redis counter
  return (
    <Screen scroll={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="title">{t('swipe.title')}</Text>
        <Text variant="label" color="accent">
          {t('swipe.slots', { count: activeMatches, max: thresholds.match.maxActive })}
        </Text>
      </View>
      <Card style={{ flex: 1, justifyContent: 'flex-end' }}>
        <VerifiedBadge />
        <Text variant="heading">Aarav, 27</Text>
        <Text variant="body" color="textSecondary">
          2 km away · loves music, travel
        </Text>
      </Card>
    </Screen>
  );
}
