import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import type { Phase } from '@/lib/types';
import { PHASE_ORDER, phaseMeta, phaseColors } from '@/theme/phases';
import { phaseInfoFor } from '@/lib/cycle';
import { ARTICLES, type Article, categoryMeta } from '@/content/education';
import { AppText, Card, FadeIn, Screen } from '@/components/ui';

type Filter = Phase | 'saved';

export default function Learn() {
  const theme = useTheme();
  const profile = useStore((s) => s.profile);
  const bookmarks = useStore((s) => s.bookmarks);
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  const current = phaseInfoFor(profile)?.phase ?? 'menstruation';
  const [filter, setFilter] = useState<Filter>(current);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list: Article[] =
      filter === 'saved'
        ? ARTICLES.filter((a) => bookmarks.includes(a.id))
        : ARTICLES.filter((a) => a.phase === filter);
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.body.join(' ').toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, query, bookmarks]);

  return (
    <Screen>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <AppText variant="h1">Learn</AppText>

        {/* Search */}
        <View
          className="flex-row items-center rounded-md border border-line-input bg-page px-3"
          style={{ height: theme.size.inputH, gap: theme.space[2] }}
        >
          <Search size={theme.size.iconMd} color={theme.color.text.secondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search the library"
            placeholderTextColor={theme.color.text.secondary}
            className="flex-1 text-base text-ink"
          />
        </View>

        {/* Phase filter */}
        <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
          {PHASE_ORDER.map((p) => {
            const m = phaseMeta(p);
            const PhaseIcon = m.icon;
            const { accent, soft } = phaseColors(theme.color, p);
            const active = filter === p;
            return (
              <Pressable
                key={p}
                onPress={() => setFilter(p)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="flex-row items-center rounded-md border px-3 py-2"
                style={{
                  gap: theme.space[1],
                  backgroundColor: active ? soft : theme.color.surface.page,
                  borderColor: active ? accent : theme.color.border.input,
                }}
              >
                <PhaseIcon
                  size={theme.size.iconSm}
                  color={active ? accent : theme.color.text.label}
                />
                <AppText variant="bodySm" style={{ color: active ? accent : theme.color.text.label }}>
                  {m.name}
                </AppText>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setFilter('saved')}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === 'saved' }}
            className={`flex-row items-center rounded-md border px-3 py-2 ${
              filter === 'saved' ? 'border-primary bg-primary-light' : 'border-line-input bg-page'
            }`}
            style={{ gap: theme.space[1] }}
          >
            <Bookmark
              size={theme.size.iconSm}
              color={filter === 'saved' ? theme.color.text.primary : theme.color.text.label}
            />
            <AppText variant="bodySm" className={filter === 'saved' ? 'text-ink' : 'text-ink-label'}>
              Saved
            </AppText>
          </Pressable>
        </View>

        {/* Article list */}
        {results.length === 0 ? (
          <Card>
            <AppText variant="secondary">
              {filter === 'saved'
                ? 'No bookmarks yet. Tap the ribbon on any article to save it.'
                : 'Nothing matches that search. Try another word?'}
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: theme.space[3] }}>
            {results.map((a, i) => {
              const cat = categoryMeta(a.category);
              const CatIcon = cat.icon;
              const isOpen = expanded === a.id;
              const isSaved = bookmarks.includes(a.id);
              return (
                <FadeIn key={a.id} delay={Math.min(i, 8) * 45}>
                <Card>
                  <View style={{ gap: theme.space[2] }}>
                    <View className="flex-row items-start justify-between" style={{ gap: theme.space[2] }}>
                      <View className="flex-1" style={{ gap: theme.space[1] }}>
                        <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
                          <CatIcon size={theme.size.iconSm} color={theme.color.text.secondary} />
                          <AppText variant="caption">{cat.label.toUpperCase()}</AppText>
                        </View>
                        <AppText variant="title">{a.title}</AppText>
                      </View>
                      <Pressable
                        onPress={() => toggleBookmark(a.id)}
                        accessibilityRole="button"
                        accessibilityLabel={isSaved ? 'Remove bookmark' : 'Bookmark'}
                        className="p-1"
                      >
                        {isSaved ? (
                          <BookmarkCheck size={theme.size.iconMd} color={theme.color.primary.base} />
                        ) : (
                          <Bookmark size={theme.size.iconMd} color={theme.color.text.secondary} />
                        )}
                      </Pressable>
                    </View>

                    <AppText variant="secondary">{a.summary}</AppText>

                    {isOpen ? (
                      <View style={{ gap: theme.space[2], marginTop: theme.space[1] }}>
                        {a.body.map((para, i) => (
                          <AppText key={i} variant="body">{para}</AppText>
                        ))}
                      </View>
                    ) : null}

                    <Pressable
                      onPress={() => setExpanded(isOpen ? null : a.id)}
                      className="flex-row items-center"
                      style={{ gap: theme.space[1] }}
                      accessibilityRole="button"
                    >
                      <AppText variant="label" className="text-ink-label">
                        {isOpen ? 'Show less' : `Read more · ${a.readTimeMinutes} min`}
                      </AppText>
                      {isOpen ? (
                        <ChevronUp size={theme.size.iconSm} color={theme.color.text.label} />
                      ) : (
                        <ChevronDown size={theme.size.iconSm} color={theme.color.text.label} />
                      )}
                    </Pressable>
                  </View>
                </Card>
                </FadeIn>
              );
            })}
          </View>
        )}
      </View>
    </Screen>
  );
}
