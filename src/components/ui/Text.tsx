import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TypographyVariant } from '@/lib/theme';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: 'text' | 'textSecondary' | 'textOnAccent' | 'accent' | 'verified' | 'danger';
};

/**
 * Themed text primitive. Always wraps (no fixed width / no truncation by
 * default) so longer Hindi strings render correctly (Spec §10).
 */
export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      style={[theme.typography[variant], { color: theme.colors[color] }, style]}
      {...rest}
    />
  );
}
