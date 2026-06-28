// Full-screen loading state: a floating moon, a spinner, and a rotating
// cheer-up quote. Used on hydration and any longer wait.
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeIn as RFadeIn } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { QUOTES } from '@/content/quotes';
import { AppText } from './AppText';
import { Floaty } from './Floaty';
import { Logo } from '@/components/Logo';

export function Loading({ label }: { label?: string }) {
  const theme = useTheme();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % QUOTES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-app px-6" style={{ gap: theme.space[6] }}>
      <Floaty distance={10} duration={1800}>
        <Logo size={56} />
      </Floaty>
      <ActivityIndicator color={theme.color.primary.base} />
      <Animated.View key={i} entering={RFadeIn.duration(500)} style={{ minHeight: 48 }}>
        <AppText variant="body" className="text-center text-ink-label">
          {label ?? QUOTES[i]}
        </AppText>
      </Animated.View>
    </View>
  );
}
