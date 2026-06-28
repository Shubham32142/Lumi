// A soft radial "aura" of light, tinted to the current phase. Sits behind the
// home hero to give the screen atmosphere and depth instead of a flat fill.
// Pure SVG (no extra deps). Decorative only.
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export function Aura({
  color,
  size = 420,
  intensity = 0.5,
}: {
  color: string;
  size?: number;
  intensity?: number;
}) {
  return (
    <Svg width={size} height={size} pointerEvents="none">
      <Defs>
        <RadialGradient id="aura" cx="50%" cy="46%" r="55%">
          <Stop offset="0%" stopColor={color} stopOpacity={intensity} />
          <Stop offset="55%" stopColor={color} stopOpacity={intensity * 0.4} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width={size} height={size} fill="url(#aura)" />
    </Svg>
  );
}
