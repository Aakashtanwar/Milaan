import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

/**
 * The "verified ✓" motif, used consistently anywhere a user's verification is
 * surfaced (Spec §10). Phase 0: a simple pill; swap glyph for an icon later.
 */
export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: theme.colors.verifiedSoft, borderRadius: theme.radii.pill },
      ]}
    >
      <Text variant="caption" style={{ color: theme.colors.verified }}>
        ✓ {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
