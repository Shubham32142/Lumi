// Lightweight dropdown (no native picker dep). Flat, bordered, animated open.
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { FadeIn } from './FadeIn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ value, options, onChange, placeholder = 'Select…' }: SelectProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        className="flex-row items-center justify-between rounded-md border border-line-input bg-page px-3 active:bg-hover"
        style={{ height: theme.size.inputH }}
      >
        <AppText variant="body" className={current ? 'text-ink' : 'text-ink-secondary'}>
          {current?.label ?? placeholder}
        </AppText>
        <ChevronDown size={theme.size.iconMd} color={theme.color.text.secondary} />
      </Pressable>

      {open ? (
        <FadeIn>
          <View
            className="rounded-md border border-line bg-page"
            style={{ marginTop: theme.space[1], overflow: 'hidden' }}
          >
            {options.map((o, idx) => (
              <Pressable
                key={o.value}
                onPress={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: o.value === value }}
                className={`px-3 py-3 active:bg-hover ${idx > 0 ? 'border-t border-line' : ''}`}
              >
                <AppText
                  variant="body"
                  className={o.value === value ? 'font-medium text-ink' : 'text-ink-label'}
                >
                  {o.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </FadeIn>
      ) : null}
    </View>
  );
}
