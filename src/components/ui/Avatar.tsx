import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/lib/theme';

export type AvatarProps = {
  uri: string;
  size?: number;
  /** Show a small verified tick badge on the avatar. */
  verified?: boolean;
};

/** Rounded avatar with optional verified badge. */
export function Avatar({ uri, size = 56, verified = false }: AvatarProps) {
  const theme = useTheme();
  return (
    <View>
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.backgroundDim }}
        contentFit="cover"
        transition={200}
      />
      {verified ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.verified,
              borderColor: theme.colors.surface,
              right: -1,
              bottom: -1,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
  },
});
