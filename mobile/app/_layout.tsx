import '../global.css';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { ToastHost } from '@/components/ui';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootContent() {
  const theme = useTheme();
  const hydrated = useStore((s) => s.hydrated);
  const [introDone, setIntroDone] = useState(false);
  // Fonts (Fraunces + Hanken) are bundled as native assets in
  // android/app/src/main/assets/fonts, so they resolve by family name with no
  // runtime loading. (Do NOT use expo-font useFonts here: its native module is
  // not linked in this prebuilt project and would hang the app.)
  const ready = hydrated;

  // Belt-and-suspenders: if rehydration somehow doesn't fire, don't hang forever.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!useStore.getState().hydrated) useStore.setState({ hydrated: true });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Once hydrated, pull any cloud changes if the user is signed in.
  useEffect(() => {
    if (!hydrated) return;
    const s = useStore.getState();
    if (s.session) void s.cloudSync(false).catch(() => {});
  }, [hydrated]);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      {ready ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.color.surface.app },
            headerStyle: { backgroundColor: theme.color.surface.page },
            headerTintColor: theme.color.text.primary,
            headerTitleStyle: { color: theme.color.text.primary },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="onboarding" />
          <Stack.Screen
            name="auth"
            options={{ headerShown: false, presentation: 'card', animation: 'fade' }}
          />
          <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings', presentation: 'card' }} />
          <Stack.Screen name="partner" options={{ headerShown: true, title: 'Partner View' }} />
          <Stack.Screen name="insights" options={{ headerShown: true, title: 'Insights' }} />
        </Stack>
      ) : null}

      {/* Toasts overlay the app (but sit below the launch splash). */}
      <ToastHost />

      {/* Launch animation — plays start-to-end, then fades to reveal the app. */}
      {!introDone ? (
        <AnimatedSplash ready={ready} onFinish={() => setIntroDone(true)} />
      ) : null}
    </>
  );
}
