import { Coordinates, CalculationMethod, CalculationParameters, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { PrayerTime, PrayerName } from '@/types/domain';

const labels: Record<PrayerName, string> = {
  fajr: 'İmsak', sunrise: 'Güneş', dhuhr: 'Öğle', asr: 'İkindi', maghrib: 'Akşam', isha: 'Yatsı'
};

export function getPrayerTimes(date: Date, latitude: number, longitude: number): PrayerTime[] {
  validateCoordinates(latitude, longitude);
  const coordinates = new Coordinates(latitude, longitude);
  // Türkiye default foundation: Muslim World League + Hanafi Asr is a configurable
  // starting point. Production should expose method/madhhab/high-latitude/offset config.
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = 'Hanafi';
  const times = new AdhanPrayerTimes(coordinates, date, params);

  const values: Array<[PrayerName, Date]> = [
    ['fajr', times.fajr], ['sunrise', times.sunrise], ['dhuhr', times.dhuhr],
    ['asr', times.asr], ['maghrib', times.maghrib], ['isha', times.isha]
  ];

  return values.map(([prayer, value]) => ({
    id: `${date.toISOString().slice(0,10)}-${prayer}`,
    prayer,
    label: labels[prayer],
    date: value.toLocaleDateString('tr-TR'),
    time: value.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: value.getTime(),
  }));
}

function validateCoordinates(latitude: number, longitude: number) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new Error('Invalid latitude');
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error('Invalid longitude');
}
