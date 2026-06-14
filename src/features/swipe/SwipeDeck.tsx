import { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { IconButton, Text } from '@/components/ui';
import { useTheme } from '@/lib/theme';

import { sampleCandidates, type Candidate } from './profiles';
import { SwipeCard } from './SwipeCard';

export type SwipeDirection = 'like' | 'pass' | 'superlike';

type Props = {
  candidates?: Candidate[];
  onSwipe?: (candidate: Candidate, direction: SwipeDirection) => void;
};

/**
 * Gesture-driven card stack. The top card follows the finger (translate +
 * rotate), shows LIKE/NOPE/SUPER stamps, and flings off past a threshold; the
 * card behind scales up as you drag. Action buttons trigger the same motion.
 */
export function SwipeDeck({ candidates = sampleCandidates, onSwipe }: Props) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const SWIPE_X = width * 0.28;
  const SWIPE_UP = 140;

  const advance = useCallback(
    (dir: SwipeDirection) => {
      const c = candidates[index];
      if (c) onSwipe?.(c, dir);
      setIndex((i) => i + 1);
      tx.value = 0;
      ty.value = 0;
    },
    [candidates, index, onSwipe, tx, ty],
  );

  const fling = useCallback(
    (dir: SwipeDirection) => {
      if (dir === 'superlike') {
        ty.value = withTiming(-height, { duration: 280 }, () => runOnJS(advance)('superlike'));
      } else {
        const to = dir === 'like' ? width * 1.5 : -width * 1.5;
        tx.value = withTiming(to, { duration: 280 }, () => runOnJS(advance)(dir));
      }
    },
    [advance, height, ty, tx, width],
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_X) {
        tx.value = withTiming(width * 1.5, { duration: 240 }, () => runOnJS(advance)('like'));
      } else if (e.translationX < -SWIPE_X) {
        tx.value = withTiming(-width * 1.5, { duration: 240 }, () => runOnJS(advance)('pass'));
      } else if (e.translationY < -SWIPE_UP) {
        ty.value = withTiming(-height, { duration: 260 }, () => runOnJS(advance)('superlike'));
      } else {
        tx.value = withSpring(0, { damping: 18 });
        ty.value = withSpring(0, { damping: 18 });
      }
    });

  const topStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${interpolate(tx.value, [-width / 2, 0, width / 2], [-9, 0, 9], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const likeStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, SWIPE_X], [0, 1], Extrapolation.CLAMP),
  }));
  const nopeStamp = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-SWIPE_X, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const superStamp = useAnimatedStyle(() => ({
    opacity: interpolate(ty.value, [-SWIPE_UP, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const behindStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(tx.value) / SWIPE_X, 1);
    return {
      transform: [{ scale: interpolate(progress, [0, 1], [0.94, 1]) }],
      opacity: interpolate(progress, [0, 1], [0.7, 1]),
    };
  });

  const current = candidates[index];
  const next = candidates[index + 1];

  if (!current) {
    return (
      <View style={styles.empty}>
        <Text variant="serifLg" style={{ textAlign: 'center' }}>
          You’re all caught up
        </Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
          New verified people nearby will appear here soon.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.deck}>
        {next ? (
          <Animated.View style={[StyleSheet.absoluteFill, behindStyle]}>
            <SwipeCard candidate={next} />
          </Animated.View>
        ) : null}

        <GestureDetector gesture={pan}>
          <Animated.View style={[StyleSheet.absoluteFill, topStyle]}>
            <SwipeCard candidate={current} />

            <Animated.View style={[styles.stamp, styles.stampLeft, { borderColor: theme.colors.like }, likeStamp]}>
              <Text variant="heading" style={{ color: theme.colors.like, letterSpacing: 2 }}>
                LIKE
              </Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampRight, { borderColor: theme.colors.danger }, nopeStamp]}>
              <Text variant="heading" style={{ color: theme.colors.danger, letterSpacing: 2 }}>
                NOPE
              </Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampTop, { borderColor: theme.colors.star }, superStamp]}>
              <Text variant="heading" style={{ color: theme.colors.star, letterSpacing: 2 }}>
                SUPER
              </Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <IconButton icon="close" size={58} iconColor={theme.colors.nope} onPress={() => fling('pass')} accessibilityLabel="Pass" />
        <IconButton icon="star" size={48} iconColor={theme.colors.star} onPress={() => fling('superlike')} accessibilityLabel="Super like" />
        <IconButton icon="heart" size={64} iconColor={theme.colors.like} onPress={() => fling('like')} accessibilityLabel="Like" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 18 },
  deck: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, paddingBottom: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  stamp: {
    position: 'absolute',
    top: 40,
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  stampLeft: { left: 24, transform: [{ rotate: '-16deg' }] },
  stampRight: { right: 24, transform: [{ rotate: '16deg' }] },
  stampTop: { alignSelf: 'center', top: 70 },
});
