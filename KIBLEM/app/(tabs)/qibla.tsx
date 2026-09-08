import { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { getQiblaBearing, angleDifference } from '@/services/qibla/qibla-engine';
import { colors, radius, spacing } from '@/theme/tokens';

const normalize = (value: number) => ((value % 360) + 360) % 360;
const shortestDelta = (from: number, to: number) => ((to - from + 540) % 360) - 180;

export default function QiblaScreen() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [permission, setPermission] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const headingValue = useSharedValue(0);
  const pulseValue = useSharedValue(0);
  const lastHeading = useRef(0);
  const lastUiUpdate = useRef(0);

  useEffect(() => {
    (async () => {
      const p = await Location.requestForegroundPermissionsAsync();
      setPermission(p.status === 'granted');
      if (p.status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setBearing(getQiblaBearing(loc.coords.latitude, loc.coords.longitude));
      }
      const available = await Magnetometer.isAvailableAsync();
      setSensorAvailable(available);
    })();
  }, []);

  useEffect(() => {
    pulseValue.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
    return () => {
      pulseValue.value = 0;
    };
  }, [pulseValue]);

  useEffect(() => {
    if (!permission || !sensorAvailable) return;
    Magnetometer.setUpdateInterval(16);
    const sub = Magnetometer.addListener(({ x, y }) => {
      const raw = normalize(Math.atan2(y, x) * 180 / Math.PI);
      const next = normalize(lastHeading.current + shortestDelta(lastHeading.current, raw));
      lastHeading.current = next;
      headingValue.value = withSpring(next, { damping: 22, stiffness: 190, mass: 0.35 });
      const now = Date.now();
      if (now - lastUiUpdate.current > 120) {
        lastUiUpdate.current = now;
        setHeading(next);
      }
    });
    return () => sub.remove();
  }, [permission, sensorAvailable, headingValue]);

  const diff = bearing == null ? null : angleDifference(bearing, heading);
  const aligned = diff != null && diff <= 5;
  const qiblaRotation = useDerivedValue(() => (bearing == null ? 0 : bearing - headingValue.value));
  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-headingValue.value}deg` }],
  }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${qiblaRotation.value}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + pulseValue.value * 0.35,
    transform: [{ scale: 1 + pulseValue.value * 0.08 }],
  }));

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient colors={['#050A0B', '#071C1E', '#041012']} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>KIBLEM • PRECISION NAV</Text>
            <Text style={styles.title}>Kıbleyi Bul</Text>
          </View>
          <NeonIcon name="navigate" color={colors.accent.cyan} />
        </View>

        <View style={styles.heroCard}>
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['#18F0DF18', '#00E5D406', '#06101166']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.compassShell}>
            <Animated.View style={[styles.pulseRing, pulseStyle, aligned && styles.pulseAligned]} />
            <Animated.View style={[styles.compass, dialStyle, aligned && styles.compassAligned]}>
              <View style={styles.hudGrid} />
              <View style={styles.outer} />
              <View style={styles.middle} />
              <View style={styles.inner} />
              <View style={[styles.cardinal, styles.north]}><Text style={styles.cardinalText}>N</Text></View>
              <View style={[styles.cardinal, styles.east]}><Text style={styles.cardinalText}>E</Text></View>
              <View style={[styles.cardinal, styles.south]}><Text style={styles.cardinalText}>S</Text></View>
              <View style={[styles.cardinal, styles.west]}><Text style={styles.cardinalText}>W</Text></View>
              <View style={[styles.tick, styles.tickTop]} />
              <View style={[styles.tick, styles.tickRight]} />
              <View style={[styles.tick, styles.tickBottom]} />
              <View style={[styles.tick, styles.tickLeft]} />
            </Animated.View>
            <Animated.View style={[styles.arrowLayer, arrowStyle]}>
              <LinearGradient colors={['#FFFFFF', colors.accent.cyan, '#008D91']} style={styles.qiblaArrow} />
              <View style={styles.arrowHead} />
            </Animated.View>
            <View style={[styles.centerOrb, aligned && styles.centerOrbAligned]}>
              <View style={styles.orbGlow} />
              <Ionicons name={aligned ? 'checkmark' : 'locate'} size={27} color={aligned ? '#031011' : colors.text.primary} />
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, aligned && styles.statusDotAligned]} />
            <Text style={styles.statusText}>{aligned ? 'KIBLE HİZALANDI' : 'TELEFONU YAVAŞÇA DÖNDÜR'}</Text>
          </View>
          <Text style={styles.subStatus}>{aligned ? 'Mükemmel yön. Namaza hazır.' : 'Neon işaret kıble yönünü gösterir.'}</Text>
        </View>

        <View style={styles.metricsCard}>
          <Metric icon="compass" label="KIBLE" value={bearing == null ? '—' : `${bearing.toFixed(1)}°`} />
          <Metric icon="phone-portrait" label="TELEFON" value={`${heading.toFixed(1)}°`} />
          <Metric icon="speedometer" label="FARK" value={diff == null ? '—' : `${diff.toFixed(1)}°`} />
        </View>

        {!permission && <Text style={styles.warning}>Kıble yönünü hesaplamak için konum izni gerekli.</Text>}
        {!sensorAvailable && <Text style={styles.warning}>Bu cihazda manyetometre sensörü bulunamadı.</Text>}
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={() => Location.requestForegroundPermissionsAsync()}>
          <LinearGradient colors={[colors.accent.cyan, '#56FFF0']} style={styles.buttonGradient}>
            <Ionicons name="sparkles" size={18} color="#031011" />
            <Text style={styles.buttonText}>Konum İznini Kontrol Et</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.note}>Hassasiyet cihaz sensörüne ve manyetik ortama bağlıdır. En iyi sonuç için telefonu metal yüzeylerden uzak tutun.</Text>
      </View>
    </SafeAreaView>
  );
}

function NeonIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return (
    <View style={styles.icon3d}>
      <View style={[styles.iconExtrusion, { backgroundColor: `${color}44` }]} />
      <LinearGradient colors={[`${color}88`, `${color}18`]} style={styles.iconFace}>
        <Ionicons name={name} size={24} color={color} />
      </LinearGradient>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={15} color={colors.accent.cyan} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  eyebrow: { color: colors.accent.cyan, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text.primary, fontSize: 32, fontWeight: '900', marginTop: 5, letterSpacing: -0.8 },
  icon3d: { width: 54, height: 54, position: 'relative' },
  iconExtrusion: { position: 'absolute', width: 46, height: 46, borderRadius: 16, top: 7, left: 5, transform: [{ rotate: '8deg' }] },
  iconFace: { width: 48, height: 48, borderRadius: 15, borderWidth: 1, borderColor: '#70FFF444', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }] },
  heroCard: { flex: 1, minHeight: 425, overflow: 'hidden', borderRadius: 30, borderWidth: 1, borderColor: '#18F0DF38', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, backgroundColor: '#071617AA' },
  compassShell: { width: 310, height: 310, alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', width: 292, height: 292, borderRadius: 146, borderWidth: 2, borderColor: colors.accent.cyan, shadowColor: colors.accent.cyan, shadowOpacity: 0.8, shadowRadius: 24 },
  pulseAligned: { borderColor: '#B8FFF5' },
  compass: { width: 270, height: 270, borderRadius: 135, borderWidth: 1, borderColor: '#61FFF044', alignItems: 'center', justifyContent: 'center', backgroundColor: '#061113CC', shadowColor: '#00E5D4', shadowOpacity: 0.35, shadowRadius: 35, elevation: 12 },
  compassAligned: { borderColor: '#A8FFF4', shadowOpacity: 0.8 },
  hudGrid: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: '#18F0DF17' },
  outer: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1, borderColor: '#00E5D455' },
  middle: { position: 'absolute', width: 204, height: 204, borderRadius: 102, borderWidth: 1, borderColor: '#18F0DF33' },
  inner: { position: 'absolute', width: 132, height: 132, borderRadius: 66, borderWidth: 1, borderColor: '#00E5D455' },
  cardinal: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  north: { top: 13 }, east: { right: 13 }, south: { bottom: 13 }, west: { left: 13 },
  cardinalText: { color: '#9BFFF2', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  tick: { position: 'absolute', backgroundColor: '#7BFFF055' },
  tickTop: { width: 1, height: 16, top: 34 }, tickRight: { width: 16, height: 1, right: 34 }, tickBottom: { width: 1, height: 16, bottom: 34 }, tickLeft: { width: 16, height: 1, left: 34 },
  arrowLayer: { position: 'absolute', width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  qiblaArrow: { width: 4, height: 184, borderRadius: 3, shadowColor: colors.accent.cyan, shadowOpacity: 1, shadowRadius: 18, elevation: 8 },
  arrowHead: { position: 'absolute', top: 31, width: 0, height: 0, borderLeftWidth: 9, borderRightWidth: 9, borderBottomWidth: 24, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#D5FFFA' },
  centerOrb: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B2C2D', borderWidth: 1, borderColor: '#85FFF477', shadowColor: colors.accent.cyan, shadowOpacity: 0.75, shadowRadius: 20, elevation: 10 },
  centerOrbAligned: { backgroundColor: colors.accent.cyan, borderColor: '#D5FFFA' },
  orbGlow: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: '#A7FFF522' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: '#041012AA', borderWidth: 1, borderColor: '#18F0DF2A' },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFD38A', marginRight: 8, shadowColor: '#FFD38A', shadowOpacity: 0.8, shadowRadius: 6 },
  statusDotAligned: { backgroundColor: '#83FFF1', shadowColor: '#83FFF1' },
  statusText: { color: colors.text.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  subStatus: { color: colors.text.secondary, fontSize: 11, marginTop: 8 },
  metricsCard: { flexDirection: 'row', marginTop: spacing.md, paddingVertical: 13, borderRadius: radius.lg, backgroundColor: '#0D2829DD', borderWidth: 1, borderColor: '#18F0DF25' },
  metric: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#A7C7C615' },
  metricLabel: { color: colors.text.secondary, fontSize: 9, letterSpacing: 1, marginTop: 3 },
  metricValue: { color: colors.text.primary, fontSize: 16, fontWeight: '900', marginTop: 3 },
  warning: { color: '#FFD38A', marginTop: 12, textAlign: 'center', fontSize: 12 },
  button: { width: '100%', marginTop: 12, borderRadius: 17, overflow: 'hidden' },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  buttonGradient: { paddingVertical: 15, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#031011', fontWeight: '900', letterSpacing: 0.2 },
  note: { color: colors.text.secondary, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 10 },
});
