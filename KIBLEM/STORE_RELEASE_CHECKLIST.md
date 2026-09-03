# KIBLEM Mağaza Yayın Hazırlığı

## Uygulama özeti

**KIBLEM**, kullanıcının konumunu kullanarak Kâbe yönünü hesaplayan, günlük namaz vakitlerini gösteren ve isteğe bağlı bildirimler sunan Türkçe bir mobil uygulamadır.

## Teknik teslim durumu

| Alan | Durum |
|---|---|
| Android application ID | `com.kiblem.app` |
| iOS bundle identifier | `com.kiblem.app` |
| Expo/EAS production profile | Hazır |
| Android production artifact | `.aab` olarak yapılandırıldı |
| iOS production artifact | App Store dağıtımı için yapılandırıldı |
| Uygulama ikonu | `assets/icon.png` |
| Android adaptive icon | `assets/adaptive-icon.png` |
| Splash screen | `assets/splash.png` |
| Konum izni metni | Yapılandırıldı |
| Bildirim izni | Yapılandırıldı |
| EAS project ID | Kullanıcı hesabından alınmalı |

## Önerilen mağaza metni

### Kısa açıklama

Kıble yönünü, namaz vakitlerini ve günlük ibadet rehberini tek yerde keşfedin.

### Uzun açıklama

KIBLEM, günlük ibadet planınızı kolaylaştırmak için tasarlanmış sade ve Türkçe bir yardımcıdır. Konumunuzu kullanarak Kâbe yönünü hesaplar, bulunduğunuz bölgeye göre günlük namaz vakitlerini gösterir ve rehber içerikleriyle temel bilgileri tek ekranda sunar.

Uygulama özellikleri:

- Kıble yönünü pusula görünümüyle takip etme.
- Günlük imsak, güneş, öğle, ikindi, akşam ve yatsı vakitlerini görüntüleme.
- Konum izni verildiğinde bulunduğunuz noktaya göre hesaplama.
- Namaz vakitleri için isteğe bağlı bildirimler.
- Türkçe, karanlık tema odaklı sade arayüz.

Namaz vakitleri ve kıble hesapları bilgilendirme amaçlıdır. Yerel uygulama ve diyanet tercihlerinize göre yöntem, mezhep ve dakika farklarını kontrol ediniz.

## Gizlilik ve izinler

Uygulama konum bilgisini kıble yönünü ve namaz vakitlerini hesaplamak için kullanır. Bildirim izni yalnızca kullanıcı namaz vakti hatırlatmaları istediğinde kullanılmalıdır. Mağaza başvurusu öncesinde herkese açık bir gizlilik politikası URL’si eklenmeli ve uygulama içindeki veri güvenliği beyanları bu politika ile tutarlı olmalıdır.

## Gerçek yayın öncesi gerekli bilgiler

EAS hesabı üzerinden bir proje oluşturulmalı ve `app.json` içindeki `extra.eas.projectId` alanı gerçek proje kimliğiyle değiştirilmelidir. Google Play Console için geliştirici hesabı, uygulama mağaza kaydı, içerik derecelendirmesi, veri güvenliği formu, gizlilik politikası URL’si ve imzalama bilgileri gerekir. App Store Connect için Apple Developer hesabı, uygulama kaydı, yaş derecelendirmesi, gizlilik beslenme etiketi, destek URL’si, gizlilik politikası URL’si ve ekran görüntüleri gerekir.

## EAS komutları

```bash
npm install
npx expo doctor
npm run typecheck
npm test
npx eas login
npx eas init
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
npx eas submit --platform android --profile production
npx eas submit --platform ios --profile production
```

Gerçek mağaza gönderimi öncesinde üretim imzalama anahtarları, mağaza hesapları ve son metadata kullanıcı tarafından sağlanmalı veya EAS hesabında yetkilendirilmelidir.
