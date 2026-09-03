import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) =>
  <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent.cyan,
      tabBarInactiveTintColor: '#6D8C8B',
      tabBarStyle: { backgroundColor: '#071214', borderTopColor: '#123637', height: 82, paddingBottom: 12 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Ana Sayfa', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="qibla" options={{ title: 'Kıble', tabBarIcon: icon('compass-outline') }} />
      <Tabs.Screen name="prayers" options={{ title: 'Vakitler', tabBarIcon: icon('time-outline') }} />
      <Tabs.Screen name="guide" options={{ title: 'Rehber', tabBarIcon: icon('book-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
