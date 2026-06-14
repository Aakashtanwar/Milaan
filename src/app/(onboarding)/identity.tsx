import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Button, Card, Screen, StepProgress, Text } from '@/components/ui';
import { getIdentityProvider } from '@/lib/providers';

/**
 * Step 1 — Identity (Aadhaar via DigiLocker / Offline e-KYC). Spec §4.4.
 *
 * INTEGRATION POINT: IdentityProvider. In mock mode this returns a deterministic
 * verified identity used to PREFILL the profile (name/age/gender) — framing
 * verification as saving the user work, not just costing effort.
 *
 * LEGAL: confirm with counsel before production. Show the plain-language consent
 * screen (what we collect, why, how long, how to delete) before launching the
 * provider flow. NEVER store the full Aadhaar number or ID image (Spec §3).
 */
export default function Identity() {
  const { t } = useTranslation();

  async function onVerify() {
    const identity = getIdentityProvider();
    const started = await identity.startVerification({ phone: '+910000000000' });
    if (!started.ok) return;
    // Mock token; live mode supplies a DigiLocker code / signed e-KYC payload.
    const result = await identity.confirmVerification({
      sessionId: started.data.sessionId,
      token: 'mock-consented-token',
    });
    if (result.ok) {
      // Phase 1: persist masked_aadhaar + aadhaar_hash, prefill profile draft.
      router.push('/(onboarding)/liveness');
    }
  }

  return (
    <Screen>
      <StepProgress current={1} />
      <Text variant="title">{t('onboarding.identityTitle')}</Text>
      <Card>
        <Text variant="body" color="textSecondary">
          {t('onboarding.identityBody')}
        </Text>
      </Card>
      <Button title={t('auth.continue')} onPress={onVerify} />
    </Screen>
  );
}
