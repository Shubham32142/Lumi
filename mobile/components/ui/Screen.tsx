// Page shell: safe-area aware, centered max-width column, token page padding.
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Extra bottom padding (e.g. above a sticky footer). */
  contentBottom?: number;
}

export function Screen({ children, scroll = true, contentBottom = 0 }: ScreenProps) {
  const insets = useSafeAreaInsets();

  const inner = (
    <View
      className="w-full self-center px-4"
      style={{ maxWidth: theme.size.contentMax }}
    >
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-page"
        style={{ paddingTop: insets.top + theme.space[2] }}
      >
        {inner}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-page"
      contentContainerStyle={{
        paddingTop: insets.top + theme.space[2],
        paddingBottom: insets.bottom + theme.space[8] + contentBottom,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}
