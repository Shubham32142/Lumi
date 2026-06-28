// 1px solid separator (never a shadow divider).
import { View } from 'react-native';
import { theme } from '@/theme';

export function Divider({ spacing = theme.space[4] }: { spacing?: number }) {
  return <View className="h-px bg-line w-full" style={{ marginVertical: spacing }} />;
}
