import React from 'react';
import { Stack } from 'expo-router';

export default function SettingsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="help" options={{ title: 'Help and Onboarding' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="terms" options={{ title: 'Terms of Use' }} />
      <Stack.Screen name="about" options={{ title: 'About SPHF Mobile' }} />
    </Stack>
  );
}
