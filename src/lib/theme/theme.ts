import { palette, radii, spacing, typography } from './tokens';

/**
 * Semantic theme assembled from raw tokens. Components reference role names
 * (theme.colors.accent), never raw palette values — so a rebrand is one file.
 */
export const lightTheme = {
  colors: {
    // brand
    accent: palette.accent,
    accentDeep: palette.accentDeep,
    accentSoft: palette.accentSoft,
    marigold: palette.marigold,
    marigoldSoft: palette.marigoldSoft,

    // action semantics
    like: palette.like,
    likeSoft: palette.likeSoft,
    nope: palette.nope,
    star: palette.star,
    starSoft: palette.starSoft,
    verified: palette.verified,
    danger: palette.danger,

    // text
    text: palette.ink,
    textSecondary: palette.ink70,
    textMuted: palette.ink50,
    textOnAccent: palette.white,
    textOnPhoto: palette.white,

    // surfaces
    background: palette.paper,
    backgroundDim: palette.paperDim,
    surface: palette.surface,
    border: palette.hairline,
  },
  spacing,
  radii,
  typography,
  /** Soft, low elevation — Hinge-style depth comes from light shadow + photos. */
  shadow: {
    card: {
      shadowColor: '#2A1D12',
      shadowOpacity: 0.1,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    button: {
      shadowColor: '#2A1D12',
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof lightTheme;
