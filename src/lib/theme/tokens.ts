/**
 * Milaan design tokens — the single source of truth for color, type, spacing.
 *
 * Direction: "Midnight Editorial". A warm near-black canvas, ivory serif
 * display (Fraunces) and one deep-crimson accent. Photos glow against the dark;
 * mature, intimate, premium — the opposite of a bright swipe app.
 */

/** Dark, editorial palette. Warm near-black grounds (never pure black). */
export const palette = {
  // Warm near-black grounds + lifted surfaces
  canvas: '#100C0B',
  surface: '#1B1513',
  surfaceAlt: '#241C19',
  hairline: '#352B26',

  // Ivory text (warm off-white, never pure white)
  ivory: '#F4EDE4',
  ivory70: '#B7ACA0',
  ivory50: '#8B8076',
  ivory30: '#5E554E',

  // Brand accent — deep crimson
  crimson: '#C8364B',
  crimsonDeep: '#9E2233',
  crimsonSoft: '#2A1418',

  // Gold — secondary warmth, used sparingly
  gold: '#C9A24B',
  goldSoft: '#241C12',

  // Action hues (on dark)
  like: '#36C98D', // ♥ like — luminous green
  likeSoft: '#11251D',
  nope: '#CABFB4', // ✕ pass — light neutral (visible on dark)
  star: '#5AA2FF', // ★ super-like — blue
  starSoft: '#101A2A',

  // Verified motif
  verified: '#36C98D',

  // States
  danger: '#E5556A',
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
