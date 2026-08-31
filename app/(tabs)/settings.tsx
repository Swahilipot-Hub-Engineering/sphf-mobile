import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { H_PADDING, V_PADDING, GAP } from '.';

import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { useAppPreferences } from '@/components/AppPreferences';
import {
  CACHE_SCOPE_DESCRIPTION,
  isStorageAvailable,
  type ThemePreference,
} from '@/components/appStorage';

type CacheFeedback = {
  type: 'success' | 'error';
  message: string;
};

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const SUPPORT_CONTACT = {
  website: 'https://swahilipot.org',
  email: 'mailto:info@swahilipot.org',
  phone: 'tel:+254700000000',
};

export default function SettingsScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');
  const tintColor = useThemeColor({ light: '#306eb7', dark: '#93c5fd' }, 'tint');
  const chipBorderColor = useThemeColor({ light: '#cbd5e1', dark: '#475569' }, 'text');
  const chipSelectedTextColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');

  const { ready, themePreference, setThemePreference, clearContentCache } = useAppPreferences();

  const [clearingCache, setClearingCache] = useState(false);
  const [cacheFeedback, setCacheFeedback] = useState<CacheFeedback | null>(null);
  const successFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  useEffect(() => {
    return () => {
      if (successFeedbackTimerRef.current) {
        clearTimeout(successFeedbackTimerRef.current);
      }
    };
  }, []);

  const openExternal = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        setCacheFeedback({
          type: 'error',
          message: 'Unable to open that link on this device right now.',
        });
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.warn('[Settings] Failed to open external link', error);
      setCacheFeedback({
        type: 'error',
        message: 'Unable to open that link on this device right now.',
      });
    }
  };

  const handleClearCache = async () => {
    if (successFeedbackTimerRef.current) {
      clearTimeout(successFeedbackTimerRef.current);
      successFeedbackTimerRef.current = null;
    }
    setClearingCache(true);
    setCacheFeedback(null);
    try {
      const removed = await clearContentCache();
      if (removed === 0) {
        const storageAvailable = await isStorageAvailable();
        if (!storageAvailable) {
          setCacheFeedback({
            type: 'error',
            message: 'Storage unavailable right now. Cache could not be verified or cleared.',
          });
          return;
        }
      }

      setCacheFeedback({
        type: 'success',
        message:
          removed > 0
            ? `Cache cleared. Removed ${removed} cached entr${removed === 1 ? 'y' : 'ies'}.`
            : 'Cache already clear. No cached content was found.',
      });
      successFeedbackTimerRef.current = setTimeout(() => {
        setCacheFeedback(null);
        successFeedbackTimerRef.current = null;
      }, 2500);
    } catch (error) {
      console.warn('[Settings] Failed to clear cache', error);
      setCacheFeedback({
        type: 'error',
        message: 'Could not clear cache. Please try again.',
      });
    } finally {
      setClearingCache(false);
    }
  };

  const confirmClearCache = () => {
    Alert.alert(
      'Clear app cache?',
      `${CACHE_SCOPE_DESCRIPTION}\n\nThis action does not sign you out.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear cache',
          style: 'destructive',
          onPress: () => {
            void handleClearCache();
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage app behavior, storage, support, and product information.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            {
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
            },
          ]}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Account management is unavailable in this build because no authentication backend is
            connected yet.
          </ThemedText>
          <View style={styles.readOnlyRow}>
            <ThemedText style={styles.rowTitle}>Account status</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              Not connected
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
            },
          ]}>
          <ThemedText style={styles.sectionTitle}>App Preferences</ThemedText>

          <View style={styles.preferenceBlock}>
            <ThemedText style={styles.rowTitle}>Theme</ThemedText>
            <ThemedText style={[styles.rowDescription, { color: mutedTextColor }]}>
              Choose how the app appears on your device.
            </ThemedText>
            <View style={styles.chipGroup}>
              {THEME_OPTIONS.map((option) => {
                const selected = themePreference === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={`${option.label} theme`}
                    accessibilityState={{ selected, disabled: !ready }}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: selected ? tintColor : chipBorderColor,
                        backgroundColor: selected ? tintColor : 'transparent',
                      },
                      pressed ? styles.chipPressed : null,
                    ]}
                    onPress={() => {
                      void setThemePreference(option.value);
                    }}
                    disabled={!ready}>
                    <ThemedText
                      style={[
                        styles.chipLabel,
                        {
                          color: selected ? chipSelectedTextColor : mutedTextColor,
                        },
                      ]}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
            },
          ]}>
          <ThemedText style={styles.sectionTitle}>Storage</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            {CACHE_SCOPE_DESCRIPTION}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.destructiveButton,
              { borderColor: cardBorderColor },
              pressed ? styles.buttonPressed : null,
              clearingCache ? styles.buttonDisabled : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Clear app cache"
            accessibilityState={{ busy: clearingCache, disabled: clearingCache }}
            onPress={confirmClearCache}
            disabled={clearingCache}>
            {clearingCache ? (
              <ActivityIndicator size="small" color={tintColor} />
            ) : (
              <ThemedText style={[styles.destructiveButtonText, { color: tintColor }]}>
                Clear cache
              </ThemedText>
            )}
          </Pressable>

          {cacheFeedback ? (
            <ThemedText
              style={[
                styles.feedback,
                cacheFeedback.type === 'success' ? styles.successText : styles.errorText,
              ]}>
              {cacheFeedback.message}
            </ThemedText>
          ) : null}
        </View>

        <View
          style={[
            styles.card,
            {
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
            },
          ]}>
          <ThemedText style={styles.sectionTitle}>Support</ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Replay app onboarding"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() =>
              router.push({
                pathname: '/onboarding',
                params: { source: 'settings' },
              })
            }>
            <ThemedText style={styles.rowTitle}>Onboarding</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>Replay</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open help"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => router.push('/settings/help')}>
            <ThemedText style={styles.rowTitle}>Help</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>Open</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Contact support by email"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => {
              void openExternal(SUPPORT_CONTACT.email);
            }}>
            <ThemedText style={styles.rowTitle}>Email support</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              info@swahilipot.org
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Call customer care"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => {
              void openExternal(SUPPORT_CONTACT.phone);
            }}>
            <ThemedText style={styles.rowTitle}>Customer care</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              +254 700 000 000
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Visit Swahilipot website"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => {
              void openExternal(SUPPORT_CONTACT.website);
            }}>
            <ThemedText style={styles.rowTitle}>Website</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              swahilipot.org
            </ThemedText>
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            {
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
            },
          ]}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <View style={styles.readOnlyRow}>
            <ThemedText style={styles.rowTitle}>App version</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              v{appVersion}
            </ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open privacy policy"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => router.push('/settings/privacy')}>
            <ThemedText style={styles.rowTitle}>Privacy policy</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>Open</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open terms of use"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => router.push('/settings/terms')}>
            <ThemedText style={styles.rowTitle}>Terms of use</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>Open</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open about this app"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.buttonPressed : null]}
            onPress={() => router.push('/settings/about')}>
            <ThemedText style={styles.rowTitle}>About this app</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>Open</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    rowGap: GAP,
  },
  header: {
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  readOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  preferenceBlock: {
    gap: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  destructiveButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  linkRow: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  feedback: {
    fontSize: 13,
    lineHeight: 18,
  },
  successText: {
    color: '#15803d',
  },
  errorText: {
    color: '#b91c1c',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
