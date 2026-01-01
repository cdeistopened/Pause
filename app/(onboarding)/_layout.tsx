import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="name" />
      <Stack.Screen name="focus" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
