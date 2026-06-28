// Runtime theme. Picks the active palette (light/dark, optionally following the
// system), exposes it via useTheme() for inline colours, and sets the CSS
// variables (via NativeWind vars()) so `className` colour utilities flip too.
import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme, View } from 'react-native';
import { vars } from 'nativewind';
import { cssVars, darkColor, lightColor, theme as base } from './tokens';
import type { Theme } from './tokens';
import { useThemeStore } from './themeStore';

export type ActiveTheme = Theme & { isDark: boolean };

const ThemeContext = createContext<ActiveTheme>({ ...base, isDark: false });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme(); // 'light' | 'dark' | null
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const color = isDark ? darkColor : lightColor;

  const value: ActiveTheme = { ...base, color, isDark };
  const styleVars = vars(cssVars(color));

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, styleVars]}>{children}</View>
    </ThemeContext.Provider>
  );
}

/** Reactive design tokens. Use for inline colours so they follow the theme. */
export function useTheme(): ActiveTheme {
  return useContext(ThemeContext);
}
