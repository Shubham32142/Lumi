// Button: token sizing, radius.md (never pill), no shadow, no gradient.
// Adds a tactile press-scale so taps feel alive (ui-standards' "minimal
// animation" is intentionally relaxed per product direction).
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { theme, lineHeight } from '@/theme';
import { AnimatedPressable, usePressScale } from './pressScale';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const SURFACE: Record<Variant, { bg: string; border: string; text: string }> = {
  primary: {
    bg: theme.color.primary.base,
    border: theme.color.primary.base,
    text: theme.color.text.onPrimary,
  },
  secondary: {
    bg: theme.color.surface.page,
    border: theme.color.border.input,
    text: theme.color.text.label,
  },
  danger: {
    bg: theme.color.status.error,
    border: theme.color.status.error,
    text: theme.color.text.onPrimary,
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  icon,
}: ButtonProps) {
  const press = usePressScale();
  const s = disabled
    ? {
        bg: theme.color.surface.muted,
        border: theme.color.border.default,
        text: theme.color.text.secondary,
      }
    : SURFACE[variant];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[
        {
          height: theme.size.buttonH,
          borderRadius: theme.radius.md,
          borderWidth: theme.borderWidth,
          borderColor: s.border,
          backgroundColor: s.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.space[4],
          gap: theme.space[2],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          width: fullWidth ? '100%' : undefined,
        },
        press.style,
      ]}
    >
      {icon ? <View>{icon}</View> : null}
      <Text
        style={{
          color: s.text,
          fontSize: theme.font.size.sm,
          fontWeight: theme.font.weight.medium as '500',
          lineHeight: lineHeight(theme.font.size.sm, 'tight'),
        }}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}
