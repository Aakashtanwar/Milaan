import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding } from '@/state/onboarding';

const LENGTH = 6;

/**
 * OTP entry (Spec §4.2). Six-cell code input + resend timer. Mock mode accepts
 * any 6 digits and verifies instantly; verifying enters onboarding and the gate
 * routes on to the first step.
 */
export default function Otp() {
  const { t } = useTranslation();
  const theme = useTheme();
  const phone = useOnboarding((s) => s.phone);
  const enterOnboarding = useOnboarding((s) => s.enterOnboarding);

  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    if (code.length === LENGTH) {
      // Mock verify → onboarding. Phase 2 verifies the real OTP via Supabase.
      enterOnboarding();
      router.replace(routeForStep('priming') as never);
    }
  }, [code, enterOnboarding]);

  return (
    <Screen>
      <Text variant="title">{t('auth.otpTitle')}</Text>
      <Text variant="body" color="textSecondary">
        {t('auth.otpSubtitle', { phone: phone ?? '' })}
      </Text>

      <Pressable style={styles.cells} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: LENGTH }).map((_, i) => {
          const filled = i < code.length;
          const active = i === code.length;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  borderColor: active ? theme.colors.accent : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.md,
                },
              ]}
            >
              <Text variant="title">{filled ? code[i] : ''}</Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        autoFocus
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={LENGTH}
        style={styles.hidden}
      />

      {seconds > 0 ? (
        <Text variant="label" color="textMuted">
          {t('auth.resendIn', { seconds })}
        </Text>
      ) : (
        <Pressable onPress={() => setSeconds(30)}>
          <Text variant="label" color="accent">
            {t('auth.resend')}
          </Text>
        </Pressable>
      )}
      <Text variant="caption" color="textMuted">
        {t('auth.otpHint')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cells: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cell: { flex: 1, aspectRatio: 0.85, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});
