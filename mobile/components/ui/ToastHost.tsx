// Renders the toast queue at the top of the screen. Flat + token-styled, with
// Reanimated enter/exit. Auto-dismisses; tap to dismiss early. Mounted once at
// the app root so any screen can call toast.success/error/info.
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { Check, Info, X } from 'lucide-react-native';
import { theme } from '@/theme';
import { useToastStore, type ToastType } from '@/lib/toast';
import { AppText } from './AppText';

const ACCENT: Record<ToastType, string> = {
  success: theme.color.status.success,
  error: theme.color.status.error,
  info: theme.color.primary.base,
};

function ToastIcon({ type }: { type: ToastType }) {
  const color = ACCENT[type];
  const size = theme.size.iconMd;
  if (type === 'success') return <Check size={size} color={color} />;
  if (type === 'error') return <X size={size} color={color} />;
  return <Info size={size} color={color} />;
}

function ToastRow({
  id,
  type,
  message,
  duration,
}: {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const t = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, dismiss]);

  return (
    <Animated.View
      entering={FadeInUp.duration(260)}
      exiting={FadeOutUp.duration(200)}
      layout={LinearTransition.duration(200)}
      style={{
        width: '100%',
        maxWidth: theme.size.contentMax,
        alignSelf: 'center',
      }}
    >
      <Pressable
        onPress={() => dismiss(id)}
        accessibilityRole="alert"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space[2],
          backgroundColor: theme.color.surface.page,
          borderColor: ACCENT[type],
          borderWidth: theme.borderWidth,
          borderRadius: theme.radius.lg,
          paddingVertical: theme.space[3],
          paddingHorizontal: theme.space[4],
        }}
      >
        <ToastIcon type={type} />
        <AppText variant="bodySm" className="flex-1 text-ink">
          {message}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + theme.space[2],
        left: theme.space[4],
        right: theme.space[4],
        zIndex: theme.z.toast,
        gap: theme.space[2],
      }}
    >
      {toasts.map((t) => (
        <ToastRow key={t.id} id={t.id} type={t.type} message={t.message} duration={t.duration} />
      ))}
    </View>
  );
}
