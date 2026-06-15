import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/lib/theme';

import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  /** Fixed prefix shown inside the field, e.g. "+91". */
  prefix?: string;
  error?: string;
};

/** Themed text input with optional label, prefix and error line. */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, prefix, error, style, multiline, ...rest },
  ref,
) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radii.md,
            alignItems: multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        {prefix ? (
          <Text variant="body" color="textSecondary" style={styles.prefix}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors.textMuted}
          multiline={multiline}
          style={[
            styles.input,
            { color: theme.colors.text, fontFamily: 'DMSans_400Regular', minHeight: multiline ? 88 : undefined },
            style,
          ]}
          {...rest}
        />
      </View>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { flexDirection: 'row', borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4 },
  prefix: { paddingRight: 8, paddingVertical: 14 },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
});
