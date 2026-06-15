import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';

/**
 * First-run payoff (Spec §4.6). The reward for finishing verification is
 * immediate access — finishVerification() flips the persisted phase to
 * `verified`, and the route gate lands the user on the swipe deck.
 */
export default function Verified() {
  const { t } = useTranslation();
  const theme = useTheme();
  const finishVerification = useOnboarding((s) => s.finishVerification);

  function onStart() {
    finishVerification(); // phase → verified
    router.replace('/'); // re-run the gate → swipe deck
  }

  return (
    <LinearGradient colors={[theme.colors.likeSoft, theme.colors.background]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={[styles.badge, { backgroundColor: theme.colors.verified }]}>
              <Ionicons name="checkmark" size={56} color="#fff" />
            </View>
            <Text variant="display" style={styles.center}>
              {t('onboarding.verifiedTitle')}
            </Text>
            <Text variant="body" color="textSecondary" style={styles.center}>
              {t('onboarding.verifiedBody')}
            </Text>
          </View>
          <Button title={t('onboarding.startSwiping')} onPress={onStart} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, paddingVertical: 24, justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  badge: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});
