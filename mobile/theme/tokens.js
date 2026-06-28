// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — SINGLE SOURCE OF TRUTH
//
// Every color, space, radius, font size, and dimension in the app lives here.
// Components never hardcode visual values — they reference these tokens (either
// via NativeWind classes, which are generated from this file in tailwind.config.js,
// or via the typed `theme` object imported from "@/theme".
//
// Authored as CommonJS so tailwind.config.js (Node) and the TS app share one file.
// See tokens.d.ts for the typed shape.
//
// Visual rules (ui-standards.md): flat design, no shadows, no gradients, 1px solid
// borders, dark text on light backgrounds, 4px/8px spacing grid. The playful brand
// (warm palette, phase accents) lives in COLOR + content, never in effects.
// ─────────────────────────────────────────────────────────────────────────────

const color = {
  // Primary — warm violet brand accent (one accent per screen)
  primary: {
    light: '#EEEAFE',
    base: '#7A5AF8',
    dark: '#5B3FD6',
  },

  // Neutral — grays for text, borders, backgrounds (50 lightest → 900 darkest)
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    500: '#71717A',
    700: '#3F3F46',
    900: '#18181B',
  },

  // Status — semantic feedback only (contrast-safe on light backgrounds)
  status: {
    success: '#15803D',
    error: '#DC2626',
    errorDark: '#B91C1C', // danger button hover
    warning: '#B45309',
    info: '#2563EB',
  },

  // Surface — solid backgrounds (no transparency, no gradients)
  surface: {
    page: '#FFFFFF',
    muted: '#FAFAFA',
    hover: '#F4F4F5',
  },

  // Border — solid 1px separators
  border: {
    default: '#E4E4E7',
    input: '#D4D4D8',
  },

  // Text
  text: {
    primary: '#18181B',
    secondary: '#71717A',
    label: '#3F3F46',
    onPrimary: '#FFFFFF',
  },

  // Cycle phase accents — flat solid colors used for tags, dots, labels.
  // Each phase has a strong `base` (for text/borders/dots) and a soft `soft`
  // (for tinted-but-solid backgrounds). Never gradients.
  phase: {
    flow: { base: '#E11D48', soft: '#FFE4E6' }, // 🩸 Menstruation — Flow Days
    glow: { base: '#0D9488', soft: '#CCFBF1' }, // ✨ Follicular   — Glow Week
    peak: { base: '#D97706', soft: '#FEF3C7' }, // 💫 Ovulation    — Peak Days
    dip: { base: '#4F46E5', soft: '#E0E7FF' }, //  🌧️ Luteal/PMS   — The Dip
  },
};

// Spacing — 4px / 8px grid (numbers = React Native px)
const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 };

// Border radius — buttons use `md`; `full` is for dots/avatars only (no pill buttons)
const radius = { sm: 4, md: 8, lg: 12, full: 9999 };

const font = {
  family: { base: 'System', mono: 'monospace' },
  size: { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28 },
  weight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
  // multipliers — multiply by font size for an absolute RN lineHeight
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.7 },
};

const size = {
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  inputH: 48,
  buttonH: 48,
  contentMax: 480,
};

const borderWidth = 1;

const z = { dropdown: 1000, sticky: 1100, modal: 1200, toast: 1300 };

const duration = { fast: 100, normal: 200 };
const easing = { default: 'ease-in-out' };

const theme = {
  color,
  space,
  radius,
  font,
  size,
  borderWidth,
  z,
  duration,
  easing,
};

module.exports = { theme };
