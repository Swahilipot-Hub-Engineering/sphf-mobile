import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppPreferencesProvider, useAppPreferences } from '@/components/AppPreferences';
import PlayerProvider from '@/components/AudioPlayer';
import FloatingPlayer from '@/components/FloatingPlayer';
import { useColorScheme } from '@/components/useColorScheme';

import '../global.css';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AppPreferencesProvider>
      <SafeAreaProvider>
        <RootLayoutContent />
      </SafeAreaProvider>
    </AppPreferencesProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { ready, hasCompletedOnboarding } = useAppPreferences();

  if (!ready) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PlayerProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Protected guard={hasCompletedOnboarding}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="+not-found" />
            </Stack.Protected>
            <Stack.Screen
              name="onboarding"
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack>
          {pathname === '/onboarding' ? null : <FloatingPlayer />}
        </View>
      </PlayerProvider>
    </ThemeProvider>
  );
}
