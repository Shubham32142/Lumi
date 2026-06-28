// Tactile press-scale used by Button and ChoiceChip (Reanimated).
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function usePressScale(to = 0.96) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return {
    style,
    onPressIn: () => {
      scale.value = withTiming(to, { duration: 90 });
    },
    onPressOut: () => {
      scale.value = withTiming(1, { duration: 130 });
    },
  };
}
