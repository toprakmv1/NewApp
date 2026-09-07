# Add CI/CD GitHub Actions workflow and test configuration" 

## Overview
Bu dokümanda NewApp projesi için kurulmuş olan GitHub Actions CI/CD pipeline ve test framework'ü açıklanmaktadır.

## Dosya Yapısı

### 1. GitHub Actions Workflow (`.github/workflows/ci.yml`)
Otomatik olarak şu görevleri gerçekleştirir:

- **push** ve **pull_request** eventlerinde tetiklenir (main ve develop branch'leri)
- **Build and Test Job**:
  - Node.js 18.x ve 20.x sürümleriyle test eder
  - Bağımlılıkları kurar
  - TypeScript type checking yapır
  - ESLint linting çalıştırır
  - Jest testlerini çalıştırır
  - Build komutunu çalıştırır

- **Code Quality Job**:
  - Güvenlik açıkları için kontrol eder
  - Kod formatını kontrol eder

### 2. Jest Configuration (`KIBLEM/jest.config.js`)
- Expo projesi için uygun konfigürasyon
- Path mapping desteği (@/ alias)
- Coverage reporting

### 3. Jest Setup (`KIBLEM/jest.setup.js`)
- Mock'lar konfigürasyonu
- Console uyarılarının yönetimi

### 4. ESLint Configuration (`KIBLEM/.eslintrc.json`)
- Expo standartları kullanır
- React Hooks kuralları kontrol eder
- Console uyarıları aktif

### 5. Babel Configuration (`KIBLEM/.babelrc`)
- Jest testleri için TypeScript/JSX transpilation

## Kullanım

### Lokal Test Çalıştırma
```bash
cd KIBLEM

# Tüm testleri çalıştır
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Başlama
npm start
```

### Lokal CI Simulation
Pipeline'ı lokal olarak benzetmek için:
```bash
cd KIBLEM
npm ci
npm run typecheck
npm run lint
npm run test
```

## GitHub Actions Sonuçları
Workflow sonuçlarını görmek için:
1. Repository'ye gidin
2. "Actions" sekmesine tıklayın
3. Son workflow run'ı kontrol edin

Her başarısız testi hemen göreceksiniz ve gerekli düzeltmeleri yapabilirsiniz.

## Test Yazma
Yeni testler yazmak için:
- `__tests__` klasörüne `.test.ts` veya `.test.tsx` uzantılı dosyalar ekleyin
- Veya test edilecek dosyanın yanına `.test.ts` dosyası oluşturun

Örnek:
```typescript
// src/utils/__tests__/helpers.test.ts
describe('helpers', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Sonraki Adımlar
1. Gerçek test dosyalarını `__tests__` klasörüne ekleyin
2. Uygulamanın build komutunu `package.json`'a ekleyin
3. Production deployment configuration'ını ayarlayın

## Troubleshooting

### Testler başarısız oluyor
- Bağımlılıkları kontrol edin: `npm ci`
- Jest ayarlarını kontrol edin: `jest.config.js`

### ESLint hatası
- Kuralları `.eslintrc.json` dosyasında ayarlayın
- `npm run lint -- --fix` ile otomatik düzelt

### TypeScript hatası
- `tsconfig.json` kontrol edin
- Type tanımlarını ekleyin
