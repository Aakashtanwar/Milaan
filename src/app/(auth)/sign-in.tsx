import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Screen, Text, TextField } from '@/components/ui';
import { useOnboarding } from '@/state/onboarding';

/**
 * Phone entry (Spec §4.2). Real +91 input with light validation. In mock mode
 * "sending" the OTP is instant; Phase 2 wires Supabase phone auth here.
 */
export default function SignIn() {
  const { t } = useTranslation();
  const setPhone = useOnboarding((s) => s.setPhone);
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string>();

  const valid = /^[6-9]\d{9}$/.test(digits);

  function onContinue() {
    if (!valid) {
      setError(t('auth.invalidPhone'));
      return;
    }
    setPhone(`+91 ${digits}`);
    router.push('/(auth)/otp');
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.body}>
          <Text variant="title">{t('auth.signInTitle')}</Text>
          <Text variant="body" color="textSecondary">
            {t('auth.signInSubtitle')}
          </Text>
          <TextField
            prefix="+91"
            keyboardType="number-pad"
            autoFocus
            maxLength={10}
            value={digits}
            onChangeText={(v) => {
              setDigits(v.replace(/\D/g, ''));
              if (error) setError(undefined);
            }}
            placeholder={t('auth.phonePlaceholder')}
            error={error}
            returnKeyType="done"
            onSubmitEditing={onContinue}
          />
        </View>
        <Button title={t('auth.continue')} disabled={!valid} onPress={onContinue} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'space-between' },
  body: { gap: 14 },
});
