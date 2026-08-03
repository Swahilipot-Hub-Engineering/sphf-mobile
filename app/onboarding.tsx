import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useAppPreferences } from '@/components/AppPreferences';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function OnboardingScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const { ready, hasCompletedOnboarding, completeOnboarding } = useAppPreferences();
  const isReplay = source === 'settings';

  if (!ready) {
    return null;
  }

  if (hasCompletedOnboarding && !isReplay) {
    return <Redirect href="/(tabs)" />;
  }

  const handleExit = async () => {
    if (isReplay) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/settings');
      }
      return;
    }

    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return <OnboardingFlow onExit={handleExit} />;
}
