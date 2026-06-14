/**
 * Milaan design tokens — the single source of truth for color, type, spacing.
 *
 * Direction: Hinge-style premium. Light, warm, editorial. A serif display face
 * (Fraunces) paired with a clean geometric sans (DM Sans). Restraint over
 * decoration — the photos and typography carry the product, not chrome.
 */

/** Warm, editorial palette. One confident accent; meaning-carrying action hues. */
export const palette = {
  // Warm paper grounds (never flat white, never cream-card-on-cream)
  paper: '#FBF7F2',
  paperDim: '#F3ECE2',
  surface: '#FFFFFF',

  // Warm near-black ink + greys (text never pure black)
  ink: '#1E1B17',
  ink70: '#5C554C',
  ink50: '#8A8278',
  ink30: '#BDB6AC',
  hairline: '#EBE3D8',

  // Brand accent — refined terracotta-saffron (India-warm, not neon)
  accent: '#E2552E',
  accentDeep: '#C2421F',
  accentSoft: '#FBE7DD',

  // Marigold — secondary warmth (chips, highlights)
  marigold: '#F2A93B',
  marigoldSoft: '#FDF0D9',

  // Action hues (dating-app semantics)
  like: '#16B364', // ♥ like — fresh green
  likeSoft: '#DAF5E6',
  nope: '#5C554C', // ✕ pass — neutral ink
  star: '#3A8DFF', // ★ super-like — blue
  starSoft: '#E1EEFF',

  // Verified motif
  verified: '#16B364',

  // States
  danger: '#E5484D',
  white: '#FFFFFF',
} as const;

/** Spacing scale (4pt base), generous for an airy editorial feel. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Radii — generous, soft. Cards read as objects, not boxes. */
export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/**
 * Font families map to the exact loaded font names (weight is baked into the
 * family name for custom fonts; RN ignores fontWeight for these). Loaded in
 * src/app/_layout.tsx via the map in ./fonts.
 */
export const fonts = {
  display: 'Fraunces_700Bold',
  displayBlack: 'Fraunces_900Black',
  serif: 'Fraunces_600SemiBold',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
} as const;

/**
 * Type scale. Display/title use the serif (Fraunces) for editorial weight;
 * everything functional uses DM Sans. No fixed widths — Hindi runs longer.
 */
export const typography = {
  hero: { fontFamily: fonts.displayBlack, fontSize: 40, lineHeight: 44 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38 },
  title: { fontFamily: fonts.display, fontSize: 25, lineHeight: 31 },
  serifLg: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 28 },
  heading: { fontFamily: fonts.sansBold, fontSize: 18, lineHeight: 25 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
