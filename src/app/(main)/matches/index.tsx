import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Avatar, Text } from '@/components/ui';
import { thresholds } from '@/config';
import { useTheme } from '@/lib/theme';

const photo = (n: number) => `https://i.pravatar.cc/300?img=${n}`;

const newMatches = [
  { id: 'm1', name: 'Ananya', photo: photo(5) },
  { id: 'm2', name: 'Diya', photo: photo(9) },
  { id: 'm3', name: 'Meera', photo: photo(16) },
];

const conversations = [
  { id: 'm1', name: 'Ananya', photo: photo(5), last: 'That café sounds perfect ☕', time: '2m', unread: true },
  { id: 'm2', name: 'Diya', photo: photo(9), last: 'Haha same! Which trail?', time: '1h', unread: false },
];

/**
 * Matches (Spec §4.9). New matches as a horizontal avatar rail, then active
 * conversations. Phase 3 adds archived section, stale-slot nudges, and the 48h
 * responsiveness refund.
 */
export default function Matches() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text variant="title">{t('matches.title')}</Text>
        <Text variant="label" color="textSecondary">
          {t('swipe.slots', { count: conversations.length, max: thresholds.match.maxActive })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="overline" color="textMuted" style={styles.sectionLabel}>
          New matches
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {newMatches.map((m) => (
            <Pressable key={m.id} style={styles.railItem} onPress={() => router.push(`/(main)/matches/${m.id}`)}>
              <Avatar uri={m.photo} size={68} verified />
              <Text variant="caption" numberOfLines={1}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text variant="overline" color="textMuted" style={styles.sectionLabel}>
          Messages
        </Text>
        <View style={styles.list}>
          {conversations.map((c) => (
            <Pressable
              key={c.id}
              style={styles.row}
              onPress={() => router.push(`/(main)/matches/${c.id}`)}
            >
              <Avatar uri={c.photo} size={58} verified />
              <View style={styles.rowText}>
                <Text variant="heading">{c.name}</Text>
                <Text
                  variant="body"
                  color={c.unread ? 'text' : 'textSecondary'}
                  numberOfLines={1}
                  style={c.unread ? styles.unread : undefined}
                >
                  {c.last}
                </Text>
              </View>
              <View style={styles.rowMeta}>
                <Text variant="caption" color="textMuted">
                  {c.time}
                </Text>
                {c.unread ? <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} /> : null}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, gap: 2 },
  scroll: { paddingBottom: 24 },
  sectionLabel: { paddingHorizontal: 20, marginTop: 16, marginBottom: 10 },
  rail: { paddingHorizontal: 20, gap: 16 },
  railItem: { alignItems: 'center', gap: 6, width: 72 },
  list: { paddingHorizontal: 12, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 8 },
  rowText: { flex: 1, gap: 3 },
  unread: { fontFamily: 'DMSans_500Medium' },
  rowMeta: { alignItems: 'flex-end', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
