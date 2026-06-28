// Lumi mark: a crescent (an open ring with a soft gap) cradling a glowing dot.
// Geometry is exported so the animated splash can reuse the exact same shape.
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@/theme';

const R = 34;
const STROKE = 12;
const GAP_ANGLE = 82; // degrees of the crescent opening
const C = 2 * Math.PI * R;

export const LOGO = {
  box: 120,
  cx: 60,
  cy: 60,
  r: R,
  stroke: STROKE,
  C,
  gapLen: (C * GAP_ANGLE) / 360,
  rot: GAP_ANGLE / 2, // centers the opening on the right (3 o'clock), facing the dot
  dotCx: 84,
  dotCy: 60,
  dotR: 6.5,
};

interface LogoProps {
  size?: number;
  color?: string;
}

export function Logo({ size = 120, color }: LogoProps) {
  const theme = useTheme();
  const stroke = color ?? theme.color.primary.base;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${LOGO.box} ${LOGO.box}`}>
      <G rotation={LOGO.rot} origin={`${LOGO.cx}, ${LOGO.cy}`}>
        <Circle
          cx={LOGO.cx}
          cy={LOGO.cy}
          r={LOGO.r}
          stroke={stroke}
          strokeWidth={LOGO.stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${LOGO.C}`}
          strokeDashoffset={LOGO.gapLen}
        />
      </G>
      <Circle cx={LOGO.dotCx} cy={LOGO.dotCy} r={LOGO.dotR} fill={stroke} />
    </Svg>
  );
}
