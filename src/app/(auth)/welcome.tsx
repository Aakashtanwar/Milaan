import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';

/**
 * Welcome (Spec §4.1). Premium, editorial first impression: warm gradient
 * ground, big serif hero, and the three product promises as quiet icon rows —
 * value before any friction.
 */
export default function Welcome() {
  const { t } = useTranslation();
  const theme = useTheme();

  const values = [
    { icon: 'shield-checkmark' as const, text: t('welcome.tagline') },
    { icon: 'heart' as const, text: t('welcome.quality') },
    { icon: 'lock-closed' as const, text: t('welcome.privacy') },
  ];

  return (
    <LinearGradient colors={[theme.colors.accentSoft, theme.colors.background]} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.top}>
            <Text variant="overline" color="accent">
              {t('welcome.eyebrow')}
            </Text>
            <Text variant="hero" style={styles.hero}>
              {t('welcome.heroTitle')}
            </Text>
          </View>

          <View style={styles.values}>
            {values.map((v) => (
              <View key={v.icon} style={styles.valueRow}>
                <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface }]}>
                  <Ionicons name={v.icon} size={20} color={theme.colors.accent} />
                </View>
                <Text variant="heading" style={styles.valueText}>
                  {v.text}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.cta}>
            <Button title={t('welcome.getStarted')} onPress={() => router.push('/(auth)/sign-in')} />
            <Pressable onPress={() => router.push('/(auth)/sign-in')} style={styles.signIn}>
              <Text variant="label" color="textSecondary">
                {t('welcome.haveAccount')}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 20, justifyContent: 'space-between' },
  top: { gap: 14, marginTop: 36 },
  hero: { marginTop: 4 },
  values: { gap: 20 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  valueText: { flex: 1 },
  cta: { gap: 14 },
  signIn: { alignItems: 'center', paddingVertical: 6 },
});
