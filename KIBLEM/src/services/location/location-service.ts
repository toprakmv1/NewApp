import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') return null;
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
}
