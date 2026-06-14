import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/theme';

export type ScreenProps = {
  children: ReactNode;
  /** When true (default) content scrolls; set false for full-bleed screens. */
  scroll?: boolean;
  /** Center children vertically + horizontally (handy for stub screens). */
  center?: boolean;
};

/**
 * Standard screen wrapper: safe-area aware, themed background, consistent
 * padding. Every screen renders inside one of these.
 */
export function Screen({ children, scroll = true, center = false }: ScreenProps) {
  const theme = useTheme();
  const inner = (
    <View
      style={[
        styles.content,
        { padding: theme.spacing.xl, gap: theme.spacing.lg },
        center && styles.center,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={center ? styles.grow : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  content: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
});
