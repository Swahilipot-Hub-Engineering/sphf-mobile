import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';

export default function PrivacyScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Privacy policy</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedTextColor }]}>
          This summary explains the privacy approach for the current app experience.
        </ThemedText>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Data we use</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            The app streams public FM audio and shows public content modules.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            No account sign-in is available in this build.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Preferences like theme and audio behavior are saved on your device.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Local storage and cache</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Cached content can be removed from Settings using Clear cache.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Clearing cache does not remove essential app preferences.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Contact</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            For privacy questions, contact info@swahilipot.org.
          </ThemedText>
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
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
