import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';

const CONTACT = {
  website: 'https://swahilipot.org',
  email: 'mailto:info@swahilipot.org',
  phone: 'tel:+254700000000',
};

export default function HelpScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');

  const openExternal = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn('[HelpScreen] Failed to open link', error);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Help and onboarding</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedTextColor }]}>
          Use this checklist to get started quickly and find support when you need it.
        </ThemedText>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>First-time checklist</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            1. Open the FM tab and test live playback.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            2. Check events and foundation tabs for current information.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            3. Set your preferred theme in Settings.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            4. Use the mini player to control FM while browsing tabs.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Contact support</ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Email support"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.rowPressed : null]}
            onPress={() => {
              void openExternal(CONTACT.email);
            }}>
            <ThemedText style={styles.rowLabel}>Email</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              info@swahilipot.org
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Call customer care"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.rowPressed : null]}
            onPress={() => {
              void openExternal(CONTACT.phone);
            }}>
            <ThemedText style={styles.rowLabel}>Phone</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              +254 700 000 000
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open website"
            style={({ pressed }) => [styles.linkRow, pressed ? styles.rowPressed : null]}
            onPress={() => {
              void openExternal(CONTACT.website);
            }}>
            <ThemedText style={styles.rowLabel}>Website</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              swahilipot.org
            </ThemedText>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  linkRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  rowPressed: {
    opacity: 0.85,
  },
});
