import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { getPrayerTimes } from '@/services/prayer/prayer-engine';
import { PrayerTime } from '@/types/domain';
import { colors, spacing } from '@/theme/tokens';

export default function Prayers() {
  const [items, setItems] = useState<PrayerTime[]>([]);
  useEffect(() => {
    (async () => {
      const p = await Location.getForegroundPermissionsAsync();
      if (p.status !== 'granted') return;
      const l = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setItems(getPrayerTimes(new Date(), l.coords.latitude, l.coords.longitude));
    })();
  }, []);

  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>TODAY</Text><Text style={styles.title}>Namaz Vakitleri</Text>
    {items.map((p) => <View key={p.id} style={styles.row}><View><Text style={styles.name}>{p.label}</Text><Text style={styles.sub}>{p.date}</Text></View><Text style={styles.time}>{p.time}</Text></View>)}
    {!items.length && <Text style={styles.empty}>Vakitleri hesaplamak için konum izni ver.</Text>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.background.primary},content:{padding:spacing.xl,gap:12},
  eyebrow:{color:colors.accent.cyan,fontSize:11,fontWeight:'800',letterSpacing:2},title:{color:colors.text.primary,fontSize:32,fontWeight:'800',marginBottom:12},
  row:{backgroundColor:colors.surface.primary,borderWidth:1,borderColor:'#18F0DF22',borderRadius:18,padding:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  name:{color:colors.text.primary,fontSize:17,fontWeight:'700'},sub:{color:colors.text.secondary,fontSize:12,marginTop:4},time:{color:colors.accent.cyan,fontSize:20,fontWeight:'800'},empty:{color:colors.text.secondary,textAlign:'center',marginTop:30}
});
