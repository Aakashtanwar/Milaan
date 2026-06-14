import { palette, radii, spacing, typography } from './tokens';

/**
 * Semantic theme assembled from raw tokens. Components reference these
 * role-based names (`theme.colors.accent`) rather than raw palette values,
 * so a future dark theme or rebrand is a single-file change.
 */
export const lightTheme = {
  colors: {
    accent: palette.saffron500,
    accentPressed: palette.saffron600,
    accentSoft: palette.saffron50,
    secondary: palette.plum500,

    verified: palette.verified500,
    verifiedSoft: palette.verified100,

    danger: palette.danger500,
    dangerSoft: palette.danger100,
    warning: palette.warning500,

    text: palette.ink900,
    textSecondary: palette.ink500,
    textOnAccent: '#FFFFFF',
    textDisabled: palette.ink300,

    background: palette.surfaceAlt,
    surface: palette.surface,
    surfaceAlt: palette.surfaceAlt,
    border: palette.border,
  },
  spacing,
  radii,
  typography,
} as const;

export type Theme = typeof lightTheme;
