export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  id: string;
  prayer: PrayerName;
  label: string;
  date: string;
  time: string;
  timezone: string;
  timestamp: number;
}

export type GenderPreference = 'female' | 'male' | 'unspecified';
export type Madhhab = 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'general';

export interface User {
  id: string;
  name?: string;
  gender: GenderPreference;
  madhhab: Madhhab;
  onboardingCompleted: boolean;
}
