import { angleDifference, getQiblaBearing } from '@/services/qibla/qibla-engine';

test('Makkah bearing is approximately north for a point south of Makkah', () => {
  const bearing = getQiblaBearing(20, 39.826206);
  expect(bearing).toBeCloseTo(0, 5);
});

test('angle difference wraps around 360 degrees', () => {
  expect(angleDifference(359, 1)).toBe(2);
});
