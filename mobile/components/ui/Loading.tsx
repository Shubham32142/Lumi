// Full-screen loading state: a floating moon, a spinner, and a rotating
// cheer-up quote. Used on hydration and any longer wait.
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { FadeIn as RFadeIn } from 'react-native-reanimated';
import { theme } from '@/theme';
import { QUOTES } from '@/content/quotes';
import { AppText } from './AppText';
import { Floaty } from './Floaty';

export function Loading({ label }: { label?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % QUOTES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-page px-6" style={{ gap: theme.space[6] }}>
      <Floaty distance={10} duration={1800}>
        <AppText style={{ fontSize: 56 }}>🌙</AppText>
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
