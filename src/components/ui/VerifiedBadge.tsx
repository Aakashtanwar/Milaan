import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

/**
 * The "verified ✓" motif, used consistently wherever verification is surfaced
 * (Spec §10). Two tones: a soft pill, or a compact tick for use over photos.
 */
export function VerifiedBadge({
  label = 'Verified',
  tone = 'soft',
}: {
  label?: string;
  tone?: 'soft' | 'onPhoto';
}) {
  const theme = useTheme();
  if (tone === 'onPhoto') {
    return <Ionicons name="checkmark-circle" size={20} color={theme.colors.verified} />;
  }
  return (
    <View style={[styles.pill, { backgroundColor: theme.colors.likeSoft, borderRadius: theme.radii.pill }]}>
      <Ionicons name="checkmark-circle" size={14} color={theme.colors.verified} />
      <Text variant="caption" style={{ color: theme.colors.verified }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
