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
          // Hairline border defines the lifted surface against the dark canvas.
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        elevated ? theme.shadow.card : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
