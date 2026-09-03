import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const steps = ['Kıyam', 'Rükû', 'Doğrulma', 'Secde', 'Oturuş', 'İkinci Secde'];
export default function Guide() {
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>NAMAZ ÖĞREN</Text><Text style={styles.title}>Namaz Rehberi</Text>
    <Text style={styles.body}>Bu başlangıç ekranı, mezhep farklılıklarını güvenilir kaynaklarla ayrı ve tarafsız biçimde sunacak rehber mimarisinin temelidir.</Text>
    {steps.map((s,i)=><View key={s} style={styles.card}><Text style={styles.number}>0{i+1}</Text><View><Text style={styles.name}>{s}</Text><Text style={styles.sub}>Adım açıklaması ve kaynak burada yer alacak.</Text></View></View>)}
    <Text style={styles.disclaimer}>Dini içerikler yayınlanmadan önce güvenilir kaynaklar ve uzman değerlendirmesiyle doğrulanmalıdır.</Text>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
screen:{flex:1,backgroundColor:colors.background.primary},content:{padding:spacing.xl,gap:12},eyebrow:{color:colors.accent.cyan,fontSize:11,fontWeight:'800',letterSpacing:2},title:{color:colors.text.primary,fontSize:32,fontWeight:'800'},body:{color:colors.text.secondary,lineHeight:22,marginBottom:8},
card:{backgroundColor:colors.surface.primary,borderWidth:1,borderColor:'#18F0DF22',borderRadius:18,padding:18,flexDirection:'row',gap:16,alignItems:'center'},number:{color:colors.accent.cyan,fontSize:16,fontWeight:'800'},name:{color:colors.text.primary,fontSize:17,fontWeight:'700'},sub:{color:colors.text.secondary,fontSize:12,marginTop:4},disclaimer:{color:'#A7C7C6',fontSize:12,lineHeight:18,marginTop:12}
});
