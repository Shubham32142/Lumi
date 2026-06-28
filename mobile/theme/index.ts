// Typed entry point for the design tokens.
//   import { useTheme } from '@/theme';  // reactive — colours follow light/dark
//   import { theme } from '@/theme';     // static LIGHT — only for non-colour tokens
export { theme } from './tokens';
export type { Theme, PhaseKey } from './tokens';
export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ActiveTheme } from './ThemeProvider';
export { useThemeStore } from './themeStore';
export type { ThemeMode } from './themeStore';

import { theme } from './tokens';

/** Absolute line height in px for a given font size + named multiplier. */
export function lineHeight(
  fontSize: number,
  kind: keyof typeof theme.font.lineHeight = 'normal',
): number {
  return Math.round(fontSize * theme.font.lineHeight[kind]);
}
