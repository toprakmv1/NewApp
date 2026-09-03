import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { getQiblaBearing, angleDifference } from '@/services/qibla/qibla-engine';
import { colors, radius, spacing } from '@/theme/tokens';

export default function QiblaScreen() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await Location.requestForegroundPermissionsAsync();
      setPermission(p.status === 'granted');
      if (p.status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setBearing(getQiblaBearing(loc.coords.latitude, loc.coords.longitude));
      }
    })();
  }, []);

  useEffect(() => {
    if (!permission) return;
    Magnetometer.setUpdateInterval(200);
    const sub = Magnetometer.addListener(({ x, y }) => {
      let angle = Math.atan2(y, x) * 180 / Math.PI;
      angle = (angle + 360) % 360;
      setHeading(angle);
    });
    return () => sub.remove();
  }, [permission]);

  const diff = bearing == null ? null : angleDifference(bearing, heading);
  const aligned = diff != null && diff <= 5;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PREMIUM HOLOGRAPHIC QIBLA</Text>
        <Text style={styles.title}>Kıbleyi Bul</Text>

        <View style={[styles.compass, aligned && styles.compassAligned]}>
          <View style={styles.outer} />
          <View style={styles.inner} />
          <View style={[styles.needle, { transform: [{ rotate: `${bearing ?? 0}deg` }] }]} />
          <View style={[styles.phone, { transform: [{ rotate: `${heading}deg` }] }]} />
          <Text style={styles.center}>{aligned ? 'KIBLE BULUNDU' : 'YÖNÜNÜ DÜZELT'}</Text>
        </View>

        <View style={styles.dataCard}>
          <Data label="Kıble" value={bearing == null ? '—' : `${bearing.toFixed(1)}°`} />
          <Data label="Telefon" value={`${heading.toFixed(1)}°`} />
          <Data label="Fark" value={diff == null ? '—' : `${diff.toFixed(1)}°`} />
        </View>

        {!permission && <Text style={styles.warning}>Kıbleyi hesaplamak için konum izni gerekli.</Text>}
        <Pressable style={styles.button} onPress={() => Location.requestForegroundPermissionsAsync()}>
          <Text style={styles.buttonText}>Konum İznini Kontrol Et</Text>
        </Pressable>
        <Text style={styles.note}>Sensör doğruluğu cihaz modeline ve manyetik ortama göre değişebilir. Üretim sürümünde kalibrasyon ve manyetik parazit uyarıları ayrıca doğrulanmalıdır.</Text>
      </View>
    </SafeAreaView>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return <View style={styles.data}><Text style={styles.dataLabel}>{label}</Text><Text style={styles.dataValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, padding: spacing.xl, alignItems: 'center' },
  eyebrow: { color: colors.accent.cyan, fontSize: 10, fontWeight: '800', letterSpacing: 1.7, marginTop: 10 },
  title: { color: colors.text.primary, fontSize: 34, fontWeight: '800', marginTop: 8 },
  compass: { width: 300, height: 300, borderRadius: 150, marginVertical: 35, borderWidth: 1, borderColor: '#18F0DF44', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D282933' },
  compassAligned: { borderColor: colors.accent.cyan, shadowColor: colors.accent.cyan, shadowOpacity: 0.6, shadowRadius: 30 },
  outer: { position: 'absolute', width: 255, height: 255, borderRadius: 128, borderWidth: 1, borderColor: '#00E5D433' },
  inner: { position: 'absolute', width: 145, height: 145, borderRadius: 73, borderWidth: 1, borderColor: '#00E5D444' },
  needle: { position: 'absolute', width: 2, height: 245, backgroundColor: colors.accent.cyan, opacity: 0.8 },
  phone: { position: 'absolute', width: 3, height: 190, backgroundColor: '#F5FFFF66' },
  center: { color: colors.text.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  dataCard: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: colors.surface.primary, borderRadius: radius.lg, borderWidth: 1, borderColor: '#18F0DF22' },
  data: { alignItems: 'center', flex: 1 },
  dataLabel: { color: colors.text.secondary, fontSize: 12 },
  dataValue: { color: colors.text.primary, fontSize: 18, fontWeight: '800', marginTop: 5 },
  warning: { color: '#FFD38A', marginTop: 18, textAlign: 'center' },
  button: { marginTop: 18, padding: 15, borderRadius: 16, backgroundColor: colors.accent.cyan, width: '100%', alignItems: 'center' },
  buttonText: { color: '#031011', fontWeight: '800' },
  note: { color: colors.text.secondary, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 18 },
});
