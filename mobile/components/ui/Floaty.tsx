// Gentle perpetual float — used for hero emojis so nothing feels static.
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface FloatyProps {
  children: ReactNode;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function Floaty({ children, distance = 6, duration = 1600, style }: FloatyProps) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withTiming(-distance, { duration }), -1, true);
  }, [distance, duration, y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}
