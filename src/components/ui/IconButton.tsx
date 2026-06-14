import { Ionicons } from '@expo/vector-icons';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/lib/theme';

export type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  /** Circular size in px. */
  size?: number;
  iconColor?: string;
  /** Background fill; defaults to white surface. */
  background?: string;
  /** Show a soft shadow (default true). */
  elevated?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular icon button — the swipe action buttons (pass/star/like) and header
 * controls. The signature round, shadowed control of a dating UI.
 */
export function IconButton({
  icon,
  onPress,
  size = 56,
  iconColor,
  background,
  elevated = true,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={(state) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background ?? theme.colors.surface,
          transform: [{ scale: state.pressed ? 0.92 : 1 }],
        },
        elevated ? theme.shadow.button : null,
        style,
      ]}
    >
      <Ionicons name={icon} size={size * 0.44} color={iconColor ?? theme.colors.text} />
    </Pressable>
  );
}
