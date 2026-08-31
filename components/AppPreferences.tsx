import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import {
  CURRENT_ONBOARDING_VERSION,
  DEFAULT_PREFERENCES,
  clearCacheNamespace,
  getStoredPreferences,
  setStoredPreferences,
  type PersistedPreferences,
  type ThemePreference,
} from '@/components/appStorage';

type AppPreferencesContextValue = PersistedPreferences & {
  colorScheme: 'light' | 'dark';
  hasCompletedOnboarding: boolean;
  ready: boolean;
  completeOnboarding: () => Promise<void>;
  setThemePreference: (next: ThemePreference) => Promise<void>;
  clearContentCache: () => Promise<number>;
};

const defaultContext: AppPreferencesContextValue = {
  ...DEFAULT_PREFERENCES,
  colorScheme: 'light',
  hasCompletedOnboarding: false,
  ready: false,
  completeOnboarding: async () => {},
  setThemePreference: async () => {},
  clearContentCache: async () => 0,
};

const AppPreferencesContext = createContext<AppPreferencesContextValue>(defaultContext);

const resolveColorScheme = (
  themePreference: ThemePreference,
  systemColorScheme: ReturnType<typeof useSystemColorScheme>
): 'light' | 'dark' => {
  if (themePreference === 'system') {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }
  return themePreference;
};

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<PersistedPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    let mounted = true;

    const loadPreferences = async () => {
      try {
        const stored = await getStoredPreferences();
        if (mounted) {
          setPreferences(stored);
        }
      } catch (error) {
        console.warn('[AppPreferences] Failed to read stored preferences', error);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    void loadPreferences();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemePreference = useCallback(async (next: ThemePreference) => {
    setPreferences((current) => {
      const updated = { ...current, themePreference: next };
      void setStoredPreferences(updated).catch((error) => {
        console.warn('[AppPreferences] Failed to persist theme preference', error);
      });
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    const updated = {
      ...preferences,
      onboardingVersion: CURRENT_ONBOARDING_VERSION,
    };
    try {
      await setStoredPreferences(updated, { requireDurable: true });
    } catch (error) {
      console.warn('[AppPreferences] Failed to durably persist onboarding completion', error);
    }
    setPreferences(updated);
  }, [preferences]);

  const colorScheme = resolveColorScheme(preferences.themePreference, systemColorScheme);
  const hasCompletedOnboarding = preferences.onboardingVersion >= CURRENT_ONBOARDING_VERSION;

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      ...preferences,
      colorScheme,
      hasCompletedOnboarding,
      ready,
      completeOnboarding,
      setThemePreference,
      clearContentCache: clearCacheNamespace,
    }),
    [
      preferences,
      colorScheme,
      hasCompletedOnboarding,
      ready,
      completeOnboarding,
      setThemePreference,
    ]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export const useAppPreferences = () => useContext(AppPreferencesContext);
