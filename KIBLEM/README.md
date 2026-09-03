# KIBLEM

Premium cinematic Islamic spiritual companion — Expo + React Native + TypeScript.

## Requirements

- Node.js LTS
- Android Studio for Android emulator, or Xcode on macOS for iOS
- Expo SDK 57

Expo's current documentation recommends the SDK 57 default template for new projects.

## Run

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS, or scan the QR code.

## Validate

```bash
npm run typecheck
npm run lint
npm test
```

## Architecture

- `app/` — Expo Router screens
- `src/theme/` — design tokens
- `src/store/` — Zustand state
- `src/services/prayer/` — prayer calculation foundation
- `src/services/qibla/` — Qibla bearing foundation
- `src/services/location/` — location permission/location
- `src/services/notifications/` — local notification foundation
- `src/components/` — reusable premium UI

## Important

This starter intentionally does not fake GPS, prayer times, Qibla direction, mosque data, or religious sources. The prayer engine uses the `adhan` calculation library and device/location data when available.

Notification reliability, audio/azan behavior, background execution, map providers, 3D assets, religious content sources, and production QA require a development build and device testing before release.
