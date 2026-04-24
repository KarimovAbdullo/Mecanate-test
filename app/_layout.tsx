import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { QueryProvider } from '../src/providers/QueryProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="post/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
