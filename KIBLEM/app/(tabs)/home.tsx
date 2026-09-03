import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { getPrayerTimes } from '@/services/prayer/prayer-engine';
import { getQiblaBearing } from '@/services/qibla/qibla-engine';
import { PrayerTime } from '@/types/domain';
import { colors, radius, spacing } from '@/theme/tokens';

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
      setPrayers(getPrayerTimes(new Date(), loc.coords.latitude, loc.coords.longitude));
    })();
  }, []);

  const next = useMemo(() => prayers.find((p) => p.timestamp > now) ?? prayers[0], [prayers, now]);
  const countdown = next ? formatCountdown(Math.max(0, next.timestamp - now)) : '--:--:--';
  const qibla = location ? getQiblaBearing(location.coords.latitude, location.coords.longitude) : null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>KIBLEM</Text>
            <Text style={styles.location}>{location ? 'Konum bulundu' : 'Konum bekleniyor'}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>K</Text></View>
        </View>

        <View style={styles.scene}>
          <View style={styles.globe}><View style={styles.globeLine} /><View style={styles.globeLine2} /></View>
          <View style={styles.energyLine} />
          <Text style={styles.sceneLabel}>QIBLA • {qibla?.toFixed(0) ?? '—'}°</Text>
        </View>

        <View style={styles.nextCard}>
          <Text style={styles.eyebrow}>NEXT PRAYER</Text>
          <Text style={styles.nextName}>{next?.label ?? 'Namaz vakitleri'}</Text>
          <Text style={styles.nextTime}>{next ? next.time : '--:--'}</Text>
          <Text style={styles.countdown}>{countdown}</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/qibla')}>
            <Text style={styles.primaryText}>Kıbleyi Göster</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Bugünün Vakitleri</Text><Pressable onPress={() => router.push('/(tabs)/prayers')}><Text style={styles.link}>Tümü</Text></Pressable></View>
        <View style={styles.timeline}>
          {prayers.map((p) => <View key={p.id} style={[styles.prayerRow, p.id === next?.id && styles.activeRow]}>
            <View><Text style={styles.prayerName}>{p.label}</Text><Text style={styles.prayerStatus}>{p.timestamp > now ? 'Bekliyor' : 'Geçti'}</Text></View>
            <Text style={styles.prayerTime}>{p.time}</Text>
          </View>)}
        </View>

        <View style={styles.miniCard}>
          <Text style={styles.eyebrow}>YAKINDAKİ CAMİLER</Text>
          <Text style={styles.miniTitle}>Konum izni ile keşfet</Text>
          <Text style={styles.miniBody}>Harita entegrasyonu sonraki fazda güvenilir veri kaynağıyla bağlanacak.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatCountdown(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: colors.accent.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  location: { color: colors.text.secondary, marginTop: 5 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.accent.cyan, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.text.primary, fontWeight: '800' },
  scene: { height: 250, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  globe: { width: 210, height: 210, borderRadius: 105, borderWidth: 1, borderColor: '#18F0DF55', backgroundColor: '#0D282955', alignItems: 'center', justifyContent: 'center' },
  globeLine: { position: 'absolute', width: 180, height: 90, borderRadius: 90, borderWidth: 1, borderColor: '#00E5D433' },
  globeLine2: { position: 'absolute', width: 100, height: 210, borderRadius: 100, borderWidth: 1, borderColor: '#00E5D433' },
  energyLine: { position: 'absolute', width: 2, height: 235, backgroundColor: colors.accent.cyan, transform: [{ rotate: '38deg' }], opacity: 0.65 },
  sceneLabel: { position: 'absolute', bottom: 5, color: colors.text.secondary, letterSpacing: 1.5, fontSize: 11 },
  nextCard: { backgroundColor: colors.surface.primary, borderRadius: radius.xl, borderWidth: 1, borderColor: '#18F0DF33', padding: spacing.xl, alignItems: 'center' },
  nextName: { color: colors.text.primary, fontSize: 32, fontWeight: '800', marginTop: 8 },
  nextTime: { color: colors.accent.cyan, fontSize: 22, fontWeight: '700', marginTop: 2 },
  countdown: { color: colors.text.primary, fontSize: 36, fontWeight: '300', letterSpacing: 2, marginVertical: 14 },
  primaryButton: { width: '100%', backgroundColor: colors.accent.cyan, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  primaryText: { color: '#031011', fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text.primary, fontSize: 18, fontWeight: '800' },
  link: { color: colors.accent.cyan },
  timeline: { gap: 8 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 16, backgroundColor: colors.surface.secondary },
  activeRow: { borderWidth: 1, borderColor: '#00E5D477', backgroundColor: '#123637' },
  prayerName: { color: colors.text.primary, fontSize: 15, fontWeight: '700' },
  prayerStatus: { color: colors.text.secondary, fontSize: 12, marginTop: 3 },
  prayerTime: { color: colors.text.primary, fontSize: 17, fontWeight: '700' },
  miniCard: { padding: spacing.xl, backgroundColor: colors.surface.primary, borderRadius: radius.lg, borderWidth: 1, borderColor: '#18F0DF22' },
  miniTitle: { color: colors.text.primary, fontSize: 20, fontWeight: '800', marginTop: 7 },
  miniBody: { color: colors.text.secondary, lineHeight: 21, marginTop: 6 },
});
