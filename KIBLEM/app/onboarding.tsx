import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '@/store/app.store';
import { colors, spacing } from '@/theme/tokens';

const pages = [
  { title: 'Kıbleni bul.', body: 'Yönünü bul. Vaktini kaçırma. Kalbine iyi bak.' },
  { title: 'Namaz vaktini kaçırma.', body: 'Konumuna göre hesaplanan vakitleri ve sıradaki namazı tek bakışta gör.' },
  { title: 'Yakınındaki camileri keşfet.', body: 'Konum izni verdiğinde çevrendeki camileri harita deneyimine bağlayabiliriz.' },
  { title: 'Sana uygun bir deneyim.', body: 'Mezhep, bildirim ve ses tercihlerini daha sonra Profil’den değiştirebilirsin.' },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const complete = useAppStore((s) => s.completeOnboarding);

  const finish = async () => {
    await Location.requestForegroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
    complete();
    router.replace('/(tabs)/home');
  };

  const current = pages[page];

  return (
    <LinearGradient colors={['#050A0B', '#071214', '#0D2829']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.brand}>
          <View style={styles.logoOrb} />
          <Text style={styles.logo}>KIBLEM</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.hologram}>
            <View style={styles.ringOuter} />
            <View style={styles.ringInner} />
            <View style={styles.beam} />
            <Text style={styles.qibla}>QIBLA</Text>
          </View>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.body}>{current.body}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {pages.map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotActive]} />)}
          </View>
          <Pressable
            style={styles.button}
            onPress={() => page < pages.length - 1 ? setPage(page + 1) : finish()}
          >
            <Text style={styles.buttonText}>{page < pages.length - 1 ? 'Devam' : 'KIBLEM’i Başlat'}</Text>
          </Pressable>
          {page > 0 && (
            <Pressable onPress={() => setPage(page - 1)}>
              <Text style={styles.skip}>Geri</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  logoOrb: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent.cyan, shadowColor: colors.accent.cyan, shadowOpacity: 0.9, shadowRadius: 12 },
  logo: { color: colors.text.primary, fontSize: 18, fontWeight: '800', letterSpacing: 5 },
  hero: { alignItems: 'center', gap: 18 },
  hologram: { width: 250, height: 250, borderRadius: 125, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#18F0DF55' },
  ringOuter: { position: 'absolute', width: 210, height: 210, borderRadius: 105, borderWidth: 1, borderColor: '#00E5D455' },
  ringInner: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 1, borderColor: '#18F0DF88' },
  beam: { width: 2, height: 180, backgroundColor: colors.accent.cyan, opacity: 0.5, transform: [{ rotate: '42deg' }] },
  qibla: { position: 'absolute', color: colors.text.primary, fontSize: 16, letterSpacing: 4, fontWeight: '700' },
  title: { color: colors.text.primary, fontSize: 34, fontWeight: '800', textAlign: 'center' },
  body: { color: colors.text.secondary, fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 330 },
  footer: { gap: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A7C7C633' },
  dotActive: { width: 24, backgroundColor: colors.accent.cyan },
  button: { backgroundColor: colors.accent.cyan, paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  buttonText: { color: '#031011', fontSize: 16, fontWeight: '800' },
  skip: { color: colors.text.secondary, textAlign: 'center' },
});
