import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { thresholds } from '@/config';
import { SwipeDeck } from '@/features/swipe/SwipeDeck';
import { useTheme } from '@/lib/theme';

/**
 * Discover (Spec §4.7). Editorial header + the animated swipe deck. The
 * match-slot indicator is always visible; swiping itself is never blocked.
 */
export default function Swipe() {
  const { t } = useTranslation();
  const theme = useTheme();
  const activeMatches = 2; // Phase 2: live from the matches store / Redis counter

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text variant="title">{t('swipe.title')}</Text>
        <View style={[styles.slots, { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radii.pill }]}>
          <Ionicons name="flame" size={15} color={theme.colors.accent} />
          <Text variant="label" color="accent">
            {t('swipe.slots', { count: activeMatches, max: thresholds.match.maxActive })}
          </Text>
        </View>
      </View>

      <View style={styles.deck}>
        <SwipeDeck />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  slots: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7 },
  deck: { flex: 1, paddingHorizontal: 16, paddingBottom: 10 },
});
