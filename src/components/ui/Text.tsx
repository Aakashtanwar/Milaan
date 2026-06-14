import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TypographyVariant } from '@/lib/theme';

type ColorKey =
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'textOnAccent'
  | 'textOnPhoto'
  | 'accent'
  | 'verified'
  | 'like'
  | 'danger';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorKey;
};

/**
 * Themed text primitive. Each variant carries its own font family (weight is
 * baked into the Fraunces/DM Sans family names). Wraps by default so longer
 * Hindi strings render correctly (Spec §10).
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
