// The Lumi launch animation, played start-to-end on every cold start:
//   1. the crescent strokes itself in
//   2. the dot pops into the crescent's cradle and begins a soft pulse
//   3. the "Lumi" wordmark rises and fades up
//   4. a cheering quote fades in while the app finishes loading
//   5. the whole screen fades out to reveal the app
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { theme, lineHeight } from '@/theme';
import { QUOTES } from '@/content/quotes';
import { LOGO } from './Logo';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const MIN_DURATION = 2000; // let the intro finish even if the app loads instantly

interface AnimatedSplashProps {
  /** App is hydrated and ready to be revealed. */
  ready: boolean;
  onFinish: () => void;
}

export function AnimatedSplash({ ready, onFinish }: AnimatedSplashProps) {
  const draw = useSharedValue(0); // 0 → 1 crescent draw
  const dot = useSharedValue(0); // 0 → 1 dot pop
  const pulse = useSharedValue(0); // dot pulse loop
  const word = useSharedValue(0); // wordmark rise/fade
  const quote = useSharedValue(0); // quote fade
  const container = useSharedValue(1); // whole-screen fade-out
  const [minElapsed, setMinElapsed] = useState(false);
  const [quoteText] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const fading = useRef(false);

  useEffect(() => {
    draw.value = withTiming(1, { duration: 850, easing: Easing.out(Easing.cubic) });
    dot.value = withDelay(650, withTiming(1, { duration: 380, easing: Easing.out(Easing.back(2)) }));
    pulse.value = withDelay(
      1050,
      withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
    word.value = withDelay(900, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
    quote.value = withDelay(1400, withTiming(1, { duration: 520 }));
    const t = setTimeout(() => setMinElapsed(true), MIN_DURATION);
    return () => clearTimeout(t);
  }, [draw, dot, pulse, word, quote]);

  useEffect(() => {
    if (minElapsed && ready && !fading.current) {
      fading.current = true;
      container.value = withDelay(
        150,
        withTiming(0, { duration: 480, easing: Easing.in(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(onFinish)();
        }),
      );
    }
  }, [minElapsed, ready, container, onFinish]);

  const crescentProps = useAnimatedProps(() => ({
    strokeDashoffset: LOGO.C - (LOGO.C - LOGO.gapLen) * draw.value,
  }));
  const dotProps = useAnimatedProps(() => ({
    r: dot.value * (LOGO.dotR + 1.4 * pulse.value),
    opacity: dot.value,
  }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: word.value,
    transform: [{ translateY: (1 - word.value) * 12 }],
  }));
  const quoteStyle = useAnimatedStyle(() => ({ opacity: quote.value }));
  const containerStyle = useAnimatedStyle(() => ({ opacity: container.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, containerStyle]}>
      <Svg width={132} height={132} viewBox={`0 0 ${LOGO.box} ${LOGO.box}`}>
        <G rotation={LOGO.rot} origin={`${LOGO.cx}, ${LOGO.cy}`}>
          <AnimatedCircle
            cx={LOGO.cx}
            cy={LOGO.cy}
            r={LOGO.r}
            stroke={theme.color.primary.base}
            strokeWidth={LOGO.stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={LOGO.C}
            animatedProps={crescentProps}
          />
        </G>
        <AnimatedCircle
          cx={LOGO.dotCx}
          cy={LOGO.dotCy}
          r={LOGO.dotR}
          fill={theme.color.primary.base}
          animatedProps={dotProps}
        />
      </Svg>

      <Animated.View style={[{ marginTop: theme.space[6] }, wordStyle]}>
        <Text style={styles.word}>Lumi</Text>
      </Animated.View>

      <Animated.View style={[styles.quoteWrap, quoteStyle]}>
        <Text style={styles.quote}>{quoteText}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.color.surface.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.color.text.primary,
    letterSpacing: 2,
  },
  quoteWrap: {
    position: 'absolute',
    bottom: 84,
    paddingHorizontal: theme.space[8],
  },
  quote: {
    textAlign: 'center',
    color: theme.color.text.secondary,
    fontSize: theme.font.size.sm,
    lineHeight: lineHeight(theme.font.size.sm),
  },
});
