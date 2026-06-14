/**
 * Milaan design tokens — the single source of truth for color, spacing,
 * radii and type scale. India-first, warm and trustworthy.
 *
 * Keep this the ONLY place raw values live; components consume the assembled
 * `theme` (see ./theme.ts), never these tokens directly.
 */

/** Warm, India-first palette. `verified` is the trust motif used app-wide. */
export const palette = {
  // Brand — warm marigold/saffron accent
  saffron50: '#FFF4E6',
  saffron100: '#FFE3BF',
  saffron500: '#F5821F', // primary accent
  saffron600: '#D96E12',
  saffron700: '#B2570B',

  // Deep plum — secondary, conveys depth/trust
  plum500: '#6D2E5B',
  plum600: '#572449',

  // Verified motif (the green ✓ used consistently)
  verified500: '#1FA463',
  verified100: '#DCF3E7',

  // Status
  danger500: '#D64545',
  danger100: '#FBE3E3',
  warning500: '#E0A100',

  // Neutrals (warm-tinted greys)
  ink900: '#1C1A17',
  ink700: '#46423B',
  ink500: '#6B655B',
  ink300: '#A8A299',
  ink100: '#ECE8E1',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF7F1',
  border: '#E7E1D8',
} as const;

/** Spacing scale (4pt base). Generous by default for breathing room. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Corner radii — rounded cards are part of the brand. */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Type scale. NOTE: no fixed widths anywhere — Hindi strings run longer than
 * English, so type must wrap and containers must flex (see Spec §10).
 */
export const typography = {
  display: { fontSize: 30, lineHeight: 38, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  heading: { fontSize: 19, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
} as const;

export type TypographyVariant = keyof typeof typography;
