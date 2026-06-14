import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

import { Card, Screen, Text } from '@/components/ui';

/**
 * Chat thread (Spec §4.9).
 *
 * INTEGRATION POINT: ChatProvider (subscribe/sendMessage/history). Phase 3 wires
 * realtime messages, moderated images, read receipts, typing, report/block.
 * Phase 0 is the stub.
 */
export default function ChatThread() {
  const { t } = useTranslation();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  return (
    <Screen>
      <Text variant="title">{t('chat.title')}</Text>
      <Card>
        <Text variant="caption" color="textSecondary">
          match: {matchId}
        </Text>
        <Text variant="body" color="textSecondary">
          Realtime chat lands in Phase 3 (ChatProvider).
        </Text>
      </Card>
    </Screen>
  );
}
