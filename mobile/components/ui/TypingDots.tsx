// Luna's "typing…" indicator — three pulsing dots.
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/theme';

function Dot({ delay }: { delay: number }) {
  const o = useSharedValue(0.3);
  useEffect(() => {
    o.value = withDelay(delay, withRepeat(withTiming(1, { duration: 480 }), -1, true));
  }, [delay, o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View
      style={[
        anim,
        { width: 7, height: 7, borderRadius: 9999, backgroundColor: theme.color.primary.base },
      ]}
    />
  );
}

export function TypingDots() {
  return (
    <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
      <Dot delay={0} />
      <Dot delay={160} />
      <Dot delay={320} />
    </View>
  );
}
