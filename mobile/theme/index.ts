// Typed entry point for the design tokens. Import everywhere as:
//   import { theme } from '@/theme';
export { theme } from './tokens';
export type { Theme, PhaseKey } from './tokens';

import { theme } from './tokens';

/** Absolute line height in px for a given font size + named multiplier. */
export function lineHeight(
  fontSize: number,
  kind: keyof typeof theme.font.lineHeight = 'normal',
): number {
  return Math.round(fontSize * theme.font.lineHeight[kind]);
}
