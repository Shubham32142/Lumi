// Typography primitive. Headlines use the editorial serif (Fraunces); UI and body
// use the warm grotesque (Hanken). Colour comes from theme-able classes so it
// follows light/dark. Screens never set raw font sizes/families/colours.
import { Text, type TextProps } from 'react-native';
import { lineHeight, theme } from '@/theme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'bodySm'
  | 'secondary'
  | 'label'
  | 'caption';

const f = theme.font.family;
const s = theme.font.size;

type Spec = { family: string; size: number; lh: 'tight' | 'normal'; color: string };

const VARIANT: Record<TextVariant, Spec> = {
  h1: { family: f.displayBold, size: s['2xl'], lh: 'tight', color: 'text-ink' },
  h2: { family: f.display, size: s.xl, lh: 'tight', color: 'text-ink' },
  h3: { family: f.display, size: s.lg, lh: 'tight', color: 'text-ink' },
  title: { family: f.sansSemibold, size: s.base, lh: 'tight', color: 'text-ink' },
  body: { family: f.sans, size: s.base, lh: 'normal', color: 'text-ink' },
  bodySm: { family: f.sans, size: s.sm, lh: 'normal', color: 'text-ink' },
  secondary: { family: f.sans, size: s.sm, lh: 'normal', color: 'text-ink-secondary' },
  label: { family: f.sansMedium, size: s.sm, lh: 'normal', color: 'text-ink-label' },
  caption: { family: f.sans, size: s.xs, lh: 'normal', color: 'text-ink-secondary' },
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  className?: string;
}

export function AppText({ variant = 'body', className, style, ...rest }: AppTextProps) {
  const v = VARIANT[variant];
  return (
    <Text
      className={`${v.color} ${className ?? ''}`}
      style={[{ fontFamily: v.family, fontSize: v.size, lineHeight: lineHeight(v.size, v.lh) }, style]}
      {...rest}
    />
  );
}
