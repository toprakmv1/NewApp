import { getPrayerTimes } from '@/services/prayer/prayer-engine';

test('prayer engine returns six daily events', () => {
  const items = getPrayerTimes(new Date('2026-09-03T12:00:00'), 38.4192, 27.1287);
  expect(items).toHaveLength(6);
  expect(items.every((x) => Number.isFinite(x.timestamp))).toBe(true);
});
