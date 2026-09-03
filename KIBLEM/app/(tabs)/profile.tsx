import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';
export default function Profile() {
  return <SafeAreaView style={styles.screen}><View style={styles.content}>
    <Text style={styles.eyebrow}>PROFILE</Text><Text style={styles.title}>Profil & Ayarlar</Text>
    {['Mezhep tercihi', 'Bildirimler', 'Ezan ve ses', 'Görsel deneyim', 'Gizlilik', 'Dil'].map(x=><View key={x} style={styles.row}><Text style={styles.text}>{x}</Text><Text style={styles.chevron}>›</Text></View>)}
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.background.primary},content:{padding:spacing.xl,gap:10},eyebrow:{color:colors.accent.cyan,fontSize:11,fontWeight:'800',letterSpacing:2},title:{color:colors.text.primary,fontSize:32,fontWeight:'800',marginBottom:18},row:{backgroundColor:colors.surface.primary,borderRadius:16,padding:18,flexDirection:'row',justifyContent:'space-between',borderWidth:1,borderColor:'#18F0DF22'},text:{color:colors.text.primary,fontSize:16,fontWeight:'600'},chevron:{color:colors.accent.cyan,fontSize:24}});
