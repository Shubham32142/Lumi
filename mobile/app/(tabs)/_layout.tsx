import { Redirect, Tabs } from 'expo-router';
import { BookOpen, CalendarDays, Home, MessageCircle, PlusCircle } from 'lucide-react-native';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';

export default function TabsLayout() {
  const onboarded = useStore((s) => s.onboarded);
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.primary.base,
        tabBarInactiveTintColor: theme.color.text.secondary,
        tabBarLabelStyle: {
          fontSize: theme.font.size.xs,
          fontWeight: theme.font.weight.medium as '500',
        },
        // Flat tab bar: solid bg, 1px top border, no shadow/elevation.
        tabBarStyle: {
          backgroundColor: theme.color.surface.page,
          borderTopColor: theme.color.border.default,
          borderTopWidth: theme.borderWidth,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Home size={theme.size.iconLg} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <CalendarDays size={theme.size.iconLg} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ color }) => <PlusCircle size={theme.size.iconLg} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <BookOpen size={theme.size.iconLg} color={color} />,
        }}
      />
      <Tabs.Screen
        name="luna"
        options={{
          title: 'Luna',
          tabBarIcon: ({ color }) => <MessageCircle size={theme.size.iconLg} color={color} />,
        }}
      />
    </Tabs>
  );
}
