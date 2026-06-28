import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Send } from 'lucide-react-native';
import { lineHeight, useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { phaseInfoFor } from '@/lib/cycle';
import { buildLunaSystem } from '@/lib/ai/prompt';
import { chatWithProvider, type ChatMsg } from '@/lib/ai/chat';
import { PROVIDERS } from '@/lib/ai/providers';
import { AppText, Button, Card, ChoiceChip, TypingDots } from '@/components/ui';

const GREETING: ChatMsg = {
  role: 'assistant',
  content:
    "Hey, I'm Luna. Ask me anything about your cycle, how you're feeling, or what might help today. I'm here to explain and support, never to judge.",
};

export default function Luna() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const aiConfig = useStore((s) => s.aiConfig);

  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'support' | 'listen'>('support');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const hasKey = aiConfig.apiKey.trim().length > 0;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const userMsg: ChatMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    const info = phaseInfoFor(profile);
    const recentLogs = Object.values(logs)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 3);
    const system = buildLunaSystem(
      {
        phase: info?.phase ?? null,
        dayOfCycle: info?.dayOfCycle ?? null,
        experienceLevel: profile.experienceLevel,
        recentLogs,
      },
      mode,
    );

    try {
      const reply = await chatWithProvider(
        aiConfig,
        system,
        next.filter((m) => m !== GREETING),
      );
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-page" style={{ paddingTop: insets.top + theme.space[2] }}>
        {/* Header */}
        <View
          className="border-b border-line px-4"
          style={{ paddingBottom: theme.space[3], gap: theme.space[2] }}
        >
          <View className="flex-row items-center" style={{ gap: theme.space[2] }}>
            <AppText variant="h2">Luna</AppText>
            <BetaBadge />
          </View>
          {hasKey ? (
            <View className="flex-row" style={{ gap: theme.space[2] }}>
              <ChoiceChip label="Help me" selected={mode === 'support'} onPress={() => setMode('support')} />
              <ChoiceChip label="Just listen" selected={mode === 'listen'} onPress={() => setMode('listen')} />
            </View>
          ) : (
            <AppText variant="secondary">Connect an AI provider to start chatting.</AppText>
          )}
        </View>

        {!hasKey ? (
          <ScrollView contentContainerStyle={{ padding: theme.space[4], gap: theme.space[4] }}>
            <Card roomy>
              <View style={{ gap: theme.space[3] }}>
                <AppText variant="h3">Bring your own AI</AppText>
                <AppText variant="secondary">
                  Luna runs on the AI provider you choose: Claude, Gemini, OpenAI, or OpenRouter.
                  Add your own API key and pick a model. Your key stays on this device.
                </AppText>
                <Button title="Set up Luna in Settings" onPress={() => router.push('/settings')} />
              </View>
            </Card>
          </ScrollView>
        ) : (
          <>
            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              className="flex-1"
              contentContainerStyle={{ padding: theme.space[4], gap: theme.space[3] }}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((m, i) => (
                <Bubble key={i} message={m} index={i} />
              ))}
              {loading ? (
                <Animated.View
                  entering={FadeInDown.duration(220)}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: theme.radius.lg,
                    borderWidth: theme.borderWidth,
                    borderColor: theme.color.border.default,
                    backgroundColor: theme.color.surface.muted,
                    paddingHorizontal: theme.space[4],
                    paddingVertical: theme.space[3],
                  }}
                >
                  <TypingDots />
                </Animated.View>
              ) : null}
              {error ? (
                <View className="rounded-lg border px-3 py-2" style={{ borderColor: theme.color.status.error }}>
                  <AppText variant="bodySm" style={{ color: theme.color.status.error }}>{error}</AppText>
                </View>
              ) : null}
              <AppText variant="caption" style={{ marginTop: theme.space[2] }}>
                Luna shares general information and support, not a medical diagnosis. If something
                feels worrying, please talk to a doctor. Via {PROVIDERS[aiConfig.provider].label}.
              </AppText>
            </ScrollView>

            {/* Input bar */}
            <View
              className="flex-row items-end border-t border-line bg-page px-4"
              style={{ paddingTop: theme.space[2], paddingBottom: insets.bottom + theme.space[2], gap: theme.space[2] }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={mode === 'listen' ? 'Tell me what’s on your mind…' : 'Ask Luna anything…'}
                placeholderTextColor={theme.color.text.secondary}
                multiline
                className="flex-1 rounded-md border border-line-input bg-page px-3 py-2 text-base text-ink"
                style={{ maxHeight: 120, lineHeight: lineHeight(theme.font.size.base) }}
              />
              <Pressable
                onPress={send}
                disabled={loading || !input.trim()}
                accessibilityRole="button"
                accessibilityLabel="Send"
                className={`items-center justify-center rounded-md ${
                  loading || !input.trim() ? 'bg-muted' : 'bg-primary active:bg-primary-dark'
                }`}
                style={{ height: theme.size.buttonH, width: theme.size.buttonH }}
              >
                <Send
                  size={theme.size.iconMd}
                  color={loading || !input.trim() ? theme.color.text.secondary : theme.color.text.onPrimary}
                />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function BetaBadge() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.color.accent.soft,
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.space[2],
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          color: theme.color.accent.base,
          fontFamily: theme.font.family.sansSemibold,
          fontSize: 11,
          letterSpacing: 1,
        }}
      >
        BETA
      </Text>
    </View>
  );
}

function Bubble({ message, index }: { message: ChatMsg; index: number }) {
  const theme = useTheme();
  const isUser = message.role === 'user';
  return (
    <Animated.View
      entering={FadeInDown.duration(260).delay(Math.min(index, 1) * 40)}
      style={{
        maxWidth: '85%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        borderRadius: theme.radius.lg,
        paddingHorizontal: theme.space[3],
        paddingVertical: theme.space[2],
        backgroundColor: isUser ? theme.color.primary.base : theme.color.surface.muted,
        borderWidth: isUser ? 0 : theme.borderWidth,
        borderColor: theme.color.border.default,
      }}
    >
      <AppText
        variant="body"
        style={{ color: isUser ? theme.color.text.onPrimary : theme.color.text.primary }}
      >
        {message.content}
      </AppText>
    </Animated.View>
  );
}
