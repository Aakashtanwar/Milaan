import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/lib/theme';

export type CardProps = ViewProps & { children: ReactNode };

/** Rounded, bordered surface — the core container of the design system. */
export function Card({ children, style, ...rest }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
