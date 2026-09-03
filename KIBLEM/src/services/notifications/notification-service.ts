import * as Notifications from 'expo-notifications';
import { PrayerTime } from '@/types/domain';

export async function requestNotificationPermission() {
  const result = await Notifications.requestPermissionsAsync();
  return result.status === 'granted';
}

export async function schedulePrayerReminder(prayer: PrayerTime, offsetMinutes: number) {
  const triggerDate = new Date(prayer.timestamp - offsetMinutes * 60_000);
  if (triggerDate.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${prayer.label} namazına ${offsetMinutes} dakika kaldı.`,
      body: 'Müsait olduğunda namaza yönelmek için güzel bir an.',
      data: { prayerId: prayer.id },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
}

export async function cancelAllKiblemNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
