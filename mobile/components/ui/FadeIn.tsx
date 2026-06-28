// Entrance animation wrapper. Children carry their own className; this only
// animates position/opacity so it composes cleanly with NativeWind.
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FadeInProps {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeIn({ children, delay = 0, duration = 380, style }: FadeInProps) {
  return (
    <Animated.View entering={FadeInDown.duration(duration).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}
