import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Screen, StepProgress, Text } from '@/components/ui';
import { thresholds } from '@/config';
import { getBiometricProvider, getModerationProvider } from '@/lib/providers';
import { useTheme } from '@/lib/theme';
import { routeForStep, useOnboarding, type PhotoDraft } from '@/state/onboarding';

const SLOTS = thresholds.photos.max;

/**
 * Step 4 — Profile photos, each auto-verified. Spec §4.4.
 *
 * Each picked photo is matched to the verified selfie template (≥ photoToSelfie)
 * and screened by the moderation provider, then shows a green tick or a clear,
 * specific reason. Need at least `photos.min` approved to continue.
 */
export default function Photos() {
  const { t } = useTranslation();
  const theme = useTheme();
  const selfieTemplate = useOnboarding((s) => s.selfieTemplate);
  const storePhotos = useOnboarding((s) => s.photos);
  const setPhotos = useOnboarding((s) => s.setPhotos);
  const setStep = useOnboarding((s) => s.setStep);
  const [photos, setLocal] = useState<PhotoDraft[]>(storePhotos);

  const approved = photos.filter((p) => p.status === 'approved').length;
  const canContinue = approved >= thresholds.photos.min;

  function sync(next: PhotoDraft[]) {
    setLocal(next);
    setPhotos(next);
  }

  async function verify(uri: string) {
    const moderation = getModerationProvider();
    const bio = getBiometricProvider();
    const [mod, match] = await Promise.all([
      moderation.screenImage({ storagePath: uri }),
      bio.compareFaces({ refA: selfieTemplate ?? 'mock-template:selfie', refB: `photo:${uri}` }),
    ]);

    const score = match.ok ? match.data.score : 0;
    let status: PhotoDraft['status'] = 'approved';
    let reason: string | undefined;
    if (mod.ok && mod.data.decision === 'rejected') {
      status = 'rejected';
      reason = t('onboarding.photoModeration');
    } else if (score < thresholds.faceMatch.photoToSelfie) {
      status = 'rejected';
      reason = t('onboarding.photoRejected');
    }

    setLocal((cur) => {
      const next = cur.map((p) => (p.uri === uri ? { ...p, status, reason, faceMatchScore: score } : p));
      setPhotos(next);
      return next;
    });
  }

  async function onAdd() {
    const remaining = SLOTS - photos.length;
    if (remaining <= 0) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
    });
    if (res.canceled) return;
    const added: PhotoDraft[] = res.assets.map((a) => ({ uri: a.uri, status: 'verifying' }));
    const next = [...photos, ...added];
    sync(next);
    added.forEach((p) => void verify(p.uri));
  }

  function onContinue() {
    setStep('profile');
    router.push(routeForStep('profile') as never);
  }

  const tiles = Array.from({ length: SLOTS }).map((_, i) => photos[i]);

  return (
    <Screen scroll={false}>
      <StepProgress current={4} />
      <Text variant="title">{t('onboarding.photosTitle')}</Text>
      <Text variant="body" color="textSecondary">
        {t('onboarding.photosBody')}
      </Text>

      <View style={styles.grid}>
        {tiles.map((photo, i) => (
          <View key={i} style={styles.cell}>
            {photo ? (
              <View style={[styles.tile, { borderRadius: theme.radii.md }]}>
                <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <View style={styles.badgeWrap}>
                  {photo.status === 'verifying' ? (
                    <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                      <ActivityIndicator color="#fff" size="small" />
                    </View>
                  ) : photo.status === 'approved' ? (
                    <Ionicons name="checkmark-circle" size={26} color={theme.colors.verified} />
                  ) : (
                    <Ionicons name="close-circle" size={26} color={theme.colors.danger} />
                  )}
                </View>
                {photo.status === 'rejected' ? (
                  <View style={styles.reason}>
                    <Text variant="caption" color="textOnPhoto">
                      {photo.reason}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <Pressable
                onPress={onAdd}
                style={[styles.tile, styles.empty, { borderColor: theme.colors.border, borderRadius: theme.radii.md }]}
              >
                <Ionicons name="add" size={30} color={theme.colors.accent} />
              </Pressable>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        {!canContinue ? (
          <Text variant="caption" color="textMuted" style={styles.center}>
            {t('onboarding.minPhotos', { min: thresholds.photos.min })}
          </Text>
        ) : null}
        <Button title={t('common.continue')} disabled={!canContinue} onPress={onContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  cell: { width: '31.5%', aspectRatio: 0.8 },
  tile: { flex: 1, overflow: 'hidden' },
  empty: { borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  badgeWrap: { position: 'absolute', top: 6, right: 6 },
  badge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  reason: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 6, backgroundColor: 'rgba(20,12,6,0.82)' },
  footer: { marginTop: 'auto', gap: 10 },
  center: { textAlign: 'center' },
});
