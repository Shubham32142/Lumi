// Selectable option chip for logging & onboarding. Selected = primary border +
// soft primary surface (solid token, not opacity). Flat, bordered, md radius,
// with a tactile press-scale.
import { Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { lineHeight, useTheme } from '@/theme';
import { AnimatedPressable, usePressScale } from './pressScale';

interface ChoiceChipProps {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onPress: () => void;
}

export function ChoiceChip({ label, icon: Icon, selected, onPress }: ChoiceChipProps) {
  const theme = useTheme();
  const press = usePressScale(0.94);
  const tint = selected ? theme.color.primary.base : theme.color.text.label;
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          minHeight: 44,
          paddingHorizontal: theme.space[3],
          borderRadius: theme.radius.md,
          borderWidth: theme.borderWidth,
          gap: theme.space[1],
          borderColor: selected ? theme.color.primary.base : theme.color.border.input,
          backgroundColor: selected ? theme.color.primary.light : theme.color.surface.page,
        },
        press.style,
      ]}
    >
      {Icon ? <Icon size={theme.size.iconSm} color={tint} /> : null}
      <Text
        style={{
          color: selected ? theme.color.text.primary : theme.color.text.label,
          fontSize: theme.font.size.sm,
          fontWeight: (selected ? theme.font.weight.medium : theme.font.weight.normal) as '500',
          lineHeight: lineHeight(theme.font.size.sm),
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
