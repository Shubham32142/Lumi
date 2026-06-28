// Type mirror for tokens.js (values live only in tokens.js — this declares shape).
export type PhaseKey = 'flow' | 'glow' | 'peak' | 'dip';

export interface Theme {
  color: {
    primary: { light: string; base: string; dark: string };
    neutral: Record<50 | 100 | 200 | 300 | 500 | 700 | 900, string>;
    status: {
      success: string;
      error: string;
      errorDark: string;
      warning: string;
      info: string;
    };
    surface: { page: string; muted: string; hover: string };
    border: { default: string; input: string };
    text: { primary: string; secondary: string; label: string; onPrimary: string };
    phase: Record<PhaseKey, { base: string; soft: string }>;
  };
  space: Record<1 | 2 | 3 | 4 | 6 | 8 | 12 | 16, number>;
  radius: { sm: number; md: number; lg: number; full: number };
  font: {
    family: { base: string; mono: string };
    size: { xs: number; sm: number; base: number; lg: number; xl: number; '2xl': number };
    weight: { normal: string; medium: string; semibold: string; bold: string };
    lineHeight: { tight: number; normal: number; relaxed: number };
  };
  size: {
    iconSm: number;
    iconMd: number;
    iconLg: number;
    inputH: number;
    buttonH: number;
    contentMax: number;
  };
  borderWidth: number;
  z: { dropdown: number; sticky: number; modal: number; toast: number };
  duration: { fast: number; normal: number };
  easing: { default: string };
}

export const theme: Theme;
