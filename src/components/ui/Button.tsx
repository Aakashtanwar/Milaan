import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
};

/**
 * Themed pressable button with large tap target (accessibility, Spec §10).
 */
export function Button({
  title,
  variant = 'primary',
  loading = false,
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
          borderRadius: theme.radii.md,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.colors.border,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text variant="label" style={{ color: fg }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, // large tap target
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
