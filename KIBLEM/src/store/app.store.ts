import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
}
export const useAppStore = create<AppState>()(persist(
  (set) => ({ onboardingCompleted: false, completeOnboarding: () => set({ onboardingCompleted: true }) }),
  { name: 'kiblem-app', storage: createJSONStorage(() => AsyncStorage) }
));
