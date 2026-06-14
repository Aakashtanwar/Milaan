import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

/**
 * Persistent "Step X of N" progress used across the verification funnel
 * (Spec §4.4). Keeping progress visible is what keeps people moving.
 */
export function StepProgress({ current, total = 4 }: { current: number; total?: number }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text variant="label" color="textSecondary">
        {t('onboarding.stepOf', { current, total })}
      </Text>
      <View style={styles.track}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: i < current ? theme.colors.accent : theme.colors.border,
                borderRadius: theme.radii.pill,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 6 },
});
