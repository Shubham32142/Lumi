// The Home hero: one big cycle ring. The track is the whole cycle, the coloured
// arc fills to where you are today, a dot marks your exact spot, and a soft halo
// breathes behind it. The centre shows the one number that matters (days to your
// period, or the day of your period while you're bleeding) plus a phase pill.
// Tapping it opens the calendar. Motion is gentle and respects reduce-motion.
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { Profile } from '@/lib/types';
import { phaseColors, phaseMeta } from '@/theme/phases';
import { daysUntilNextPeriod, phaseInfoFor } from '@/lib/cycle';
import { AppText } from '@/components/ui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BOX = 300;
const CENTER = BOX / 2;
const R = 130;
const STROKE = 14;
const C = 2 * Math.PI * R;

/** Renders only when the profile has an anchor date (caller guarantees it). */
export function CycleRing({ profile }: { profile: Profile }) {
  const theme = useTheme();
  const info = phaseInfoFor(profile);
  const day = info?.dayOfCycle ?? 1;
  const len = info?.cycleLength ?? profile.cycleLength;
  const phase = info?.phase ?? 'menstruation';
  const { accent, soft } = phaseColors(theme.color, phase);
  const meta = phaseMeta(phase);
  const PhaseIcon = meta.icon;
  const progress = Math.min(1, Math.max(0, day / len));
  const daysUntil = daysUntilNextPeriod(profile);

  // The one number in the middle.
  let big = String(day);
  let label = 'cycle day';
  if (phase === 'menstruation') {
    big = String(day);
    label = day === 1 ? 'first day of your period' : 'day of your period';
  } else if (daysUntil != null) {
    big = String(daysUntil);
    label = daysUntil === 1 ? 'day until your period' : 'days until your period';
  }

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduceMotion(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Count the centre number up from zero on mount (a small moment of delight).
  const target = parseInt(big, 10);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (reduceMotion || Number.isNaN(target) || target <= 0) {
      setShown(Number.isNaN(target) ? 0 : target);
      return;
    }
    const steps = Math.min(target, 20);
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setShown(Math.min(target, Math.round((target / steps) * frame)));
      if (frame >= steps) clearInterval(id);
    }, 36);
    return () => clearInterval(id);
  }, [target, reduceMotion]);

  // Arc fills from empty to `progress` on mount / when the day changes.
  const arc = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      arc.value = progress;
      return;
    }
    arc.value = 0;
    arc.value = withTiming(progress, { duration: 1300, easing: Easing.out(Easing.cubic) });
  }, [progress, reduceMotion, arc]);
  const arcProps = useAnimatedProps(() => ({ strokeDashoffset: C * (1 - arc.value) }));

  // Slow breathing halo behind the ring.
  const breathe = useSharedValue(reduceMotion ? 0.5 : 0);
  useEffect(() => {
    if (reduceMotion) {
      breathe.value = 0.5;
      return;
    }
    breathe.value = withRepeat(
      withTiming(1, { duration: 3800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [reduceMotion, breathe]);
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + 0.3 * breathe.value,
    transform: [{ scale: 1 + 0.05 * breathe.value }],
  }));

  // Today dot, at the head of the filled arc.
  const theta = ((-90 + 360 * progress) * Math.PI) / 180;
  const markerX = CENTER + R * Math.cos(theta);
  const markerY = CENTER + R * Math.sin(theta);

  return (
    <Pressable
      onPress={() => router.push('/calendar')}
      accessibilityRole="button"
      accessibilityLabel="Open your cycle calendar"
      style={{ width: BOX, height: BOX, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: BOX - 14,
            height: BOX - 14,
            borderRadius: (BOX - 14) / 2,
            backgroundColor: soft,
          },
          haloStyle,
        ]}
      />

      <Svg width={BOX} height={BOX}>
        <G rotation={-90} origin={`${CENTER}, ${CENTER}`}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke={theme.color.neutral[200]}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke={accent}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            animatedProps={arcProps}
          />
        </G>
        {/* today marker: a dot with a gap so it reads on the arc */}
        <Circle cx={markerX} cy={markerY} r={9} fill={theme.color.surface.app} />
        <Circle cx={markerX} cy={markerY} r={6} fill={accent} />
      </Svg>

      <View style={{ position: 'absolute', alignItems: 'center', paddingHorizontal: 24 }}>
        <Text
          style={{
            fontSize: 70,
            fontFamily: theme.font.family.displayBold,
            color: theme.color.text.primary,
            lineHeight: 76,
          }}
        >
          {Number.isNaN(target) ? big : shown}
        </Text>
        <AppText variant="secondary" style={{ marginTop: 2 }}>
          {label}
        </AppText>
        <View
          style={{
            marginTop: theme.space[2],
            backgroundColor: soft,
            borderRadius: theme.radius.full,
            paddingHorizontal: theme.space[3],
            paddingVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <PhaseIcon size={14} color={accent} />
          <Text
            style={{ color: accent, fontFamily: theme.font.family.sansSemibold, fontSize: theme.font.size.sm }}
          >
            {meta.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
