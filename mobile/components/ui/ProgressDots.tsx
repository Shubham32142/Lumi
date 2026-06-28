// Onboarding step indicator. Dots (not buttons) may use full radius.
import { View } from 'react-native';
import { theme } from '@/theme';

interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`rounded-full ${i <= current ? 'bg-primary' : 'bg-neutral-200'}`}
          style={{ width: i === current ? 20 : 8, height: 8 }}
        />
      ))}
    </View>
  );
}
