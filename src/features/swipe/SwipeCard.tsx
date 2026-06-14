import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Chip, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';

import type { Candidate } from './profiles';

/**
 * A single swipe card: full-bleed photo, a dark gradient scrim at the foot, and
 * editorial name/age + meta + interest chips over the photo. Hinge-style.
 */
export function SwipeCard({ candidate }: { candidate: Candidate }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { borderRadius: theme.radii.xl, backgroundColor: theme.colors.backgroundDim }]}>
      <Image source={{ uri: candidate.photo }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />

      {/* top scrim for status legibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'transparent']}
        style={styles.topScrim}
        pointerEvents="none"
      />

      {/* bottom scrim + content */}
      <LinearGradient
        colors={['transparent', 'rgba(20,12,6,0.0)', 'rgba(20,12,6,0.86)']}
        locations={[0, 0.45, 1]}
        style={styles.bottomScrim}
        pointerEvents="none"
      />

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text variant="display" color="textOnPhoto" style={styles.name}>
            {candidate.name} {candidate.age}
          </Text>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.verified} />
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.9)" />
          <Text variant="label" color="textOnPhoto" style={{ opacity: 0.95 }}>
            {candidate.distanceKm} km away
          </Text>
        </View>

        <Text variant="body" color="textOnPhoto" style={styles.bio} numberOfLines={2}>
          {candidate.bio}
        </Text>

        <View style={styles.chips}>
          {candidate.interests.map((i) => (
            <Chip key={i} label={i} tone="onPhoto" />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, overflow: 'hidden' },
  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 90 },
  bottomScrim: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  content: { position: 'absolute', left: 20, right: 20, bottom: 22, gap: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: '#fff' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bio: { opacity: 0.95 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
});
