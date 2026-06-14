import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';

/**
 * Welcome carousel (Spec §4.1). Phase 0: the three value cards stacked; a
 * swipeable pager comes later. Explains value before asking for any friction.
 */
export default function Welcome() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="display">{t('appName')}</Text>
      <View style={{ gap: 12 }}>
        <Card>
          <Text variant="heading">✓ {t('welcome.tagline')}</Text>
        </Card>
        <Card>
          <Text variant="heading">{t('welcome.quality')}</Text>
        </Card>
        <Card>
          <Text variant="heading">{t('welcome.privacy')}</Text>
        </Card>
      </View>
      <Button title={t('welcome.getStarted')} onPress={() => router.push('/(auth)/sign-in')} />
    </Screen>
  );
}
