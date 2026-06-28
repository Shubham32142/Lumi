// NativeWind / Tailwind theme generated FROM the design tokens.
// This file does not invent values — it maps tokens.js into utility classes so
// `className="bg-page text-ink p-4 rounded-lg border border-line"` stays in sync
// with the single source of truth.
const { theme } = require('./theme/tokens');

const px = (n) => `${n}px`;
const mapPx = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, px(v)]));

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Colours map to CSS variables (set at runtime by ThemeProvider via vars())
      // so utility classes like `bg-page text-ink` flip between light and dark.
      colors: {
        primary: {
          light: 'var(--c-primary-light)',
          DEFAULT: 'var(--c-primary)',
          dark: 'var(--c-primary-dark)',
        },
        accent: { DEFAULT: 'var(--c-accent)', soft: 'var(--c-accent-soft)' },
        neutral: {
          50: 'var(--c-neutral-50)',
          100: 'var(--c-neutral-100)',
          200: 'var(--c-neutral-200)',
          300: 'var(--c-neutral-300)',
          500: 'var(--c-neutral-500)',
          700: 'var(--c-neutral-700)',
          900: 'var(--c-neutral-900)',
        },
        success: 'var(--c-success)',
        error: { DEFAULT: 'var(--c-error)', dark: 'var(--c-error-dark)' },
        warning: 'var(--c-warning)',
        info: 'var(--c-info)',
        // surfaces
        app: 'var(--c-app)',
        page: 'var(--c-page)',
        muted: 'var(--c-muted)',
        hover: 'var(--c-hover)',
        // borders (named `line` to avoid clashing with the `border` utility)
        line: 'var(--c-line)',
        'line-input': 'var(--c-line-input)',
        // text colors
        ink: {
          DEFAULT: 'var(--c-ink)',
          secondary: 'var(--c-ink-secondary)',
          label: 'var(--c-ink-label)',
          on: 'var(--c-ink-on)',
        },
        // phase accents
        'phase-flow': 'var(--c-phase-flow)',
        'phase-flow-soft': 'var(--c-phase-flow-soft)',
        'phase-glow': 'var(--c-phase-glow)',
        'phase-glow-soft': 'var(--c-phase-glow-soft)',
        'phase-peak': 'var(--c-phase-peak)',
        'phase-peak-soft': 'var(--c-phase-peak-soft)',
        'phase-dip': 'var(--c-phase-dip)',
        'phase-dip-soft': 'var(--c-phase-dip-soft)',
      },
      spacing: mapPx(theme.space),
      borderRadius: {
        sm: px(theme.radius.sm),
        md: px(theme.radius.md),
        lg: px(theme.radius.lg),
        full: '9999px',
      },
      fontSize: mapPx(theme.font.size),
      fontWeight: {
        normal: theme.font.weight.normal,
        medium: theme.font.weight.medium,
        semibold: theme.font.weight.semibold,
        bold: theme.font.weight.bold,
      },
      borderWidth: { DEFAULT: px(theme.borderWidth), 0: '0px', 1: px(theme.borderWidth) },
      maxWidth: { content: px(theme.size.contentMax) },
    },
  },
  plugins: [],
};
