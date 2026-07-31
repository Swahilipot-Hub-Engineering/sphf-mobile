import Constants from 'expo-constants';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';

export default function AboutScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const sdkVersion = Constants.expoConfig?.sdkVersion ?? 'Unknown';

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>About SPHF Mobile</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedTextColor }]}>
          SPHF Mobile connects the community to foundation resources, FM, and events in one app.
        </ThemedText>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>App details</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>Version</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              v{appVersion}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>Expo SDK</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              {sdkVersion}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>Platform support</ThemedText>
            <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
              Android, iOS, Web
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Technology</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Built with Expo Router, React Native, and TypeScript.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Audio playback is powered by Expo Audio.
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
  row: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
  },
});
