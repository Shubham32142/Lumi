// Small label chip. Solid background (no opacity), 1px border, md radius.
import { View } from 'react-native';
import { AppText } from './AppText';

interface TagProps {
  label: string;
  /** Optional accent (text/border) + soft (background) token colors. */
  accent?: string;
  soft?: string;
}

export function Tag({ label, accent, soft }: TagProps) {
  if (accent && soft) {
    return (
      <View
        className="self-start rounded-md border px-2 py-1"
        style={{ backgroundColor: soft, borderColor: accent }}
      >
        <AppText variant="caption" className="font-medium" style={{ color: accent }}>
          {label}
        </AppText>
      </View>
    );
  }
  return (
    <View className="self-start rounded-md border border-line bg-muted px-2 py-1">
      <AppText variant="caption" className="font-medium text-ink-label">
        {label}
      </AppText>
    </View>
  );
}
