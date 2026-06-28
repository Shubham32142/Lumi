// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — SINGLE SOURCE OF TRUTH ("Moonlit Editorial")
//
// A committed warm world: oat-paper day and aubergine-moonlight night, a dominant
// claret rose, and a sharp gold "light" accent (Lumi = light). Type pairs a soft
// editorial serif (Fraunces) for headlines with a warm grotesque (Hanken) for UI.
//
// Components reference tokens via NativeWind classes (CSS vars set by
// ThemeProvider) or the reactive useTheme() hook. Two palettes share one shape.
// ─────────────────────────────────────────────────────────────────────────────

// ── Light palette — "Paper Day" ──
const lightColor = {
  primary: { light: '#F3DCE2', base: '#A83254', dark: '#882843' },
  accent: { base: '#B47A16', soft: '#F6E7C7' }, // gold "light"
  neutral: {
    50: '#FBF6EE',
    100: '#F4EADF',
    200: '#E7D8CC',
    300: '#D8C4B8',
    500: '#9A8088',
    700: '#5A4248',
    900: '#2A1A20',
  },
  status: {
    success: '#2E7D52',
    error: '#C0413A',
    errorDark: '#9E332D',
    warning: '#A66A1F',
    info: '#3A6EA5',
  },
  surface: { app: '#F6EFE3', page: '#FCF7EE', muted: '#F1E6DA', hover: '#ECDFD0' },
  border: { default: '#E7D8CC', input: '#D8C4B8' },
  text: { primary: '#2A1A20', secondary: '#9A8088', label: '#5A4248', onPrimary: '#FFF9F0' },
  phase: {
    flow: { base: '#B23A5C', soft: '#F3DBE2' },
    glow: { base: '#C2703F', soft: '#F4E1D1' },
    peak: { base: '#B98F23', soft: '#F4E8C6' },
    dip: { base: '#7E5C9E', soft: '#E9DEF1' },
  },
};

// ── Dark palette — "Moonlight" ──
const darkColor = {
  primary: { light: '#3A2230', base: '#D75C82', dark: '#B84668' },
  accent: { base: '#ECB45A', soft: '#3A2E18' }, // gold "light"
  neutral: {
    50: '#1F1626',
    100: '#261A2E',
    200: '#3A2A3C',
    300: '#4C384E',
    500: '#A78D9A',
    700: '#CBB6C2',
    900: '#F3E9EC',
  },
  status: {
    success: '#4ADE80',
    error: '#F87171',
    errorDark: '#EF4444',
    warning: '#FBBF24',
    info: '#7FB0E8',
  },
  surface: { app: '#17101D', page: '#221829', muted: '#2B1F31', hover: '#34253A' },
  border: { default: '#352539', input: '#46324A' },
  text: { primary: '#F3E9EC', secondary: '#A78D9A', label: '#CBB6C2', onPrimary: '#FFF9F0' },
  phase: {
    flow: { base: '#E66E8E', soft: '#3A2230' },
    glow: { base: '#E0966A', soft: '#382616' },
    peak: { base: '#E6BE5C', soft: '#352C14' },
    dip: { base: '#B79AD6', soft: '#2C2438' },
  },
};

// Spacing — 4px / 8px grid (numbers = React Native px)
const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 };
const radius = { sm: 4, md: 10, lg: 16, full: 9999 };

// Type — Fraunces (editorial serif) for display, Hanken Grotesk for UI. Names match
// the @expo-google-fonts modules loaded in app/_layout.tsx.
const font = {
  family: {
    base: 'HankenGrotesk_400Regular',
    sans: 'HankenGrotesk_400Regular',
    sansMedium: 'HankenGrotesk_500Medium',
    sansSemibold: 'HankenGrotesk_600SemiBold',
    sansBold: 'HankenGrotesk_700Bold',
    display: 'Fraunces_500Medium',
    displayBold: 'Fraunces_600SemiBold',
    mono: 'monospace',
  },
  size: { xs: 12, sm: 14, base: 16, lg: 19, xl: 24, '2xl': 30, '3xl': 40 },
  weight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: 1.15, normal: 1.5, relaxed: 1.7 },
};

const size = { iconSm: 16, iconMd: 20, iconLg: 24, inputH: 50, buttonH: 52, contentMax: 480 };
const borderWidth = 1;
const z = { dropdown: 1000, sticky: 1100, modal: 1200, toast: 1300 };
const duration = { fast: 100, normal: 200 };
const easing = { default: 'ease-in-out' };

// `theme` defaults to LIGHT — for static importers and module-level reads.
const theme = { color: lightColor, space, radius, font, size, borderWidth, z, duration, easing };

// Flatten a palette into the CSS-variable map NativeWind reads. Names match the
// var() references in tailwind.config.js.
function cssVars(c) {
  return {
    '--c-primary': c.primary.base,
    '--c-primary-light': c.primary.light,
    '--c-primary-dark': c.primary.dark,
    '--c-accent': c.accent.base,
    '--c-accent-soft': c.accent.soft,
    '--c-neutral-50': c.neutral[50],
    '--c-neutral-100': c.neutral[100],
    '--c-neutral-200': c.neutral[200],
    '--c-neutral-300': c.neutral[300],
    '--c-neutral-500': c.neutral[500],
    '--c-neutral-700': c.neutral[700],
    '--c-neutral-900': c.neutral[900],
    '--c-success': c.status.success,
    '--c-error': c.status.error,
    '--c-error-dark': c.status.errorDark,
    '--c-warning': c.status.warning,
    '--c-info': c.status.info,
    '--c-app': c.surface.app,
    '--c-page': c.surface.page,
    '--c-muted': c.surface.muted,
    '--c-hover': c.surface.hover,
    '--c-line': c.border.default,
    '--c-line-input': c.border.input,
    '--c-ink': c.text.primary,
    '--c-ink-secondary': c.text.secondary,
    '--c-ink-label': c.text.label,
    '--c-ink-on': c.text.onPrimary,
    '--c-phase-flow': c.phase.flow.base,
    '--c-phase-flow-soft': c.phase.flow.soft,
    '--c-phase-glow': c.phase.glow.base,
    '--c-phase-glow-soft': c.phase.glow.soft,
    '--c-phase-peak': c.phase.peak.base,
    '--c-phase-peak-soft': c.phase.peak.soft,
    '--c-phase-dip': c.phase.dip.base,
    '--c-phase-dip-soft': c.phase.dip.soft,
  };
}

module.exports = { theme, lightColor, darkColor, cssVars };
