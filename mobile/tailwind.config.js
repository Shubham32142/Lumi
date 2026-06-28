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
      colors: {
        primary: {
          light: theme.color.primary.light,
          DEFAULT: theme.color.primary.base,
          dark: theme.color.primary.dark,
        },
        neutral: theme.color.neutral,
        success: theme.color.status.success,
        error: { DEFAULT: theme.color.status.error, dark: theme.color.status.errorDark },
        warning: theme.color.status.warning,
        info: theme.color.status.info,
        // surfaces
        page: theme.color.surface.page,
        muted: theme.color.surface.muted,
        hover: theme.color.surface.hover,
        // borders (named `line` to avoid clashing with the `border` utility)
        line: theme.color.border.default,
        'line-input': theme.color.border.input,
        // text colors
        ink: {
          DEFAULT: theme.color.text.primary,
          secondary: theme.color.text.secondary,
          label: theme.color.text.label,
          on: theme.color.text.onPrimary,
        },
        // phase accents
        'phase-flow': theme.color.phase.flow.base,
        'phase-flow-soft': theme.color.phase.flow.soft,
        'phase-glow': theme.color.phase.glow.base,
        'phase-glow-soft': theme.color.phase.glow.soft,
        'phase-peak': theme.color.phase.peak.base,
        'phase-peak-soft': theme.color.phase.peak.soft,
        'phase-dip': theme.color.phase.dip.base,
        'phase-dip-soft': theme.color.phase.dip.soft,
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
