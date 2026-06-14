import { createContext, useContext } from 'react';

import { lightTheme, type Theme } from './theme';

/**
 * Theme context. Phase 0 ships a single light theme; the provider exists so a
 * dark theme can drop in later without touching consumers.
 */
const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeContextProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export { lightTheme };
export type { Theme };
export * from './tokens';
