import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Avatar, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';

/**
 * Chat thread (Spec §4.9).
 *
 * INTEGRATION POINT: ChatProvider (subscribe / sendMessage / history). Phase 3
 * wires realtime messages, moderated images, read receipts, typing, report/block.
 * Phase 0 renders a styled sample conversation.
 */
const sample = [
  { id: '1', mine: false, body: 'Hey! Loved that you’re into trekking 🏔️' },
  { id: '2', mine: true, body: 'Right? Did Triund last month. You?' },
  { id: '3', mine: false, body: 'On my list! That café near Lodhi though ☕' },
  { id: '4', mine: true, body: 'That café sounds perfect ☕' },
];

export default function ChatThread() {
  const { t } = useTranslation();
  const theme = useTheme();
  useLocalSearchParams<{ matchId: string }>();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
        </Pressable>
        <Avatar uri="https://i.pravatar.cc/200?img=5" size={38} verified />
        <Text variant="heading" style={styles.flex}>
          Ananya
        </Text>
        <Pressable hitSlop={10}>
          <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          <Text variant="caption" color="textMuted" style={styles.matchedNote}>
            You matched with Ananya · say hello 👋
          </Text>
          {sample.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.mine
                  ? { backgroundColor: theme.colors.accent, alignSelf: 'flex-end', borderBottomRightRadius: 6 }
                  : { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
              ]}
            >
              <Text variant="body" color={m.mine ? 'textOnAccent' : 'text'}>
                {m.body}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputBar, { borderTopColor: theme.colors.border }]}>
          <View style={[styles.input, { backgroundColor: theme.colors.backgroundDim, borderRadius: theme.radii.pill }]}>
            <Text variant="body" color="textMuted">
              {t('chat.title')}…
            </Text>
          </View>
          <View style={[styles.send, { backgroundColor: theme.colors.accent }]}>
            <Ionicons name="arrow-up" size={20} color={theme.colors.textOnAccent} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  messages: { padding: 16, gap: 10 },
  matchedNote: { textAlign: 'center', marginBottom: 8 },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
