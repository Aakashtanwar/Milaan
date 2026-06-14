import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
};

/**
 * Primary CTA: filled accent pill with a soft lift. Secondary: outlined.
 * Ghost: text-only. Large tap target for accessibility (Spec §10).
 */
export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const bg =
    variant === 'primary' ? theme.colors.accent : variant === 'secondary' ? theme.colors.surface : 'transparent';
  const fg = variant === 'primary' ? theme.colors.textOnAccent : theme.colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: theme.radii.pill,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderColor: theme.colors.accent,
          alignSelf: fullWidth ? 'stretch' : 'center',
          paddingHorizontal: fullWidth ? 24 : 36,
          opacity: isDisabled ? 0.45 : 1,
          transform: [{ scale: state.pressed ? 0.98 : 1 }],
        },
        variant === 'primary' && !isDisabled ? theme.shadow.button : null,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text variant="heading" style={{ color: fg, fontSize: 16 }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
