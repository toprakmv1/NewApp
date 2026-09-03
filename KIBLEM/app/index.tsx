import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/app.store';

export default function Index() {
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
  return <Redirect href={onboardingCompleted ? '/(tabs)/home' : '/onboarding'} />;
}
