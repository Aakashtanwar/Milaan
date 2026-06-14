import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

export type ChipProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Visual tone. */
  tone?: 'neutral' | 'accent' | 'onPhoto';
};

/** Pill chip for interests / metadata. Soft, rounded, editorial. */
export function Chip({ label, icon, tone = 'neutral' }: ChipProps) {
  const theme = useTheme();

  const bg =
    tone === 'accent'
      ? theme.colors.marigoldSoft
      : tone === 'onPhoto'
        ? 'rgba(255,255,255,0.22)'
        : theme.colors.backgroundDim;
  const fg = tone === 'onPhoto' ? theme.colors.textOnPhoto : theme.colors.textSecondary;

  return (
    <View style={[styles.chip, { backgroundColor: bg, borderRadius: theme.radii.pill }]}>
      {icon ? <Ionicons name={icon} size={13} color={fg} /> : null}
      <Text variant="caption" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
});
