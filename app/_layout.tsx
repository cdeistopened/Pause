import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from './providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { COLORS } from '@/constants/colors';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ErrorBoundary>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </AuthProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
