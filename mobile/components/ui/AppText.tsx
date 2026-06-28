// Typography primitive. Every text style is a token-backed variant — screens
// never set raw font sizes/weights/colors.
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

const VARIANT_CLASS: Record<TextVariant, string> = {
  h1: 'text-2xl font-bold text-ink',
  h2: 'text-xl font-semibold text-ink',
  h3: 'text-lg font-semibold text-ink',
  title: 'text-base font-semibold text-ink',
  body: 'text-base text-ink',
  bodySm: 'text-sm text-ink',
  secondary: 'text-sm text-ink-secondary',
  label: 'text-sm font-medium text-ink-label',
  caption: 'text-xs text-ink-secondary',
};

const VARIANT_LINE: Record<TextVariant, number> = {
  h1: lineHeight(theme.font.size['2xl'], 'tight'),
  h2: lineHeight(theme.font.size.xl, 'tight'),
  h3: lineHeight(theme.font.size.lg, 'tight'),
  title: lineHeight(theme.font.size.base, 'tight'),
  body: lineHeight(theme.font.size.base, 'normal'),
  bodySm: lineHeight(theme.font.size.sm, 'normal'),
  secondary: lineHeight(theme.font.size.sm, 'normal'),
  label: lineHeight(theme.font.size.sm, 'normal'),
  caption: lineHeight(theme.font.size.xs, 'normal'),
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  className?: string;
}

export function AppText({
  variant = 'body',
  className,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={`${VARIANT_CLASS[variant]} ${className ?? ''}`}
      style={[{ lineHeight: VARIANT_LINE[variant] }, style]}
      {...rest}
    />
  );
}
