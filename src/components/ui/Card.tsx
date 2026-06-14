import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/lib/theme';

export type CardProps = ViewProps & {
  children: ReactNode;
  /** Add a soft elevation shadow (default true). */
  elevated?: boolean;
};

/** Soft, rounded white surface — the core container of the design system. */
export function Card({ children, elevated = true, style, ...rest }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
        },
        elevated ? theme.shadow.card : { borderWidth: 1, borderColor: theme.colors.border },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
