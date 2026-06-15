import { palette, radii, spacing, typography } from './tokens';

/**
 * Semantic theme assembled from raw tokens. Components reference role names
 * (theme.colors.accent), never raw palette values — so a rebrand is one file.
 *
 * "Midnight Editorial": dark, warm, intimate. Depth comes from lifted surfaces
 * + hairline borders + a soft crimson glow, not from heavy drop shadows.
 */
export const lightTheme = {
  colors: {
    // brand
    accent: palette.crimson,
    accentDeep: palette.crimsonDeep,
    accentSoft: palette.crimsonSoft,
    marigold: palette.gold,
    marigoldSoft: palette.goldSoft,

    // action semantics
    like: palette.like,
    likeSoft: palette.likeSoft,
    nope: palette.nope,
    star: palette.star,
    starSoft: palette.starSoft,
    verified: palette.verified,
    danger: palette.danger,

    // text
    text: palette.ivory,
    textSecondary: palette.ivory70,
    textMuted: palette.ivory50,
    textOnAccent: palette.white,
    textOnPhoto: palette.white,

    // surfaces
    background: palette.canvas,
    backgroundDim: palette.surfaceAlt,
    surface: palette.surface,
    border: palette.hairline,
  },
  spacing,
  radii,
  typography,
  /** Restrained elevation. On dark, a soft crimson-tinted glow reads as lift. */
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    button: {
      shadowColor: palette.crimsonDeep,
      shadowOpacity: 0.55,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
  },
} as const;

export type Theme = typeof lightTheme;
