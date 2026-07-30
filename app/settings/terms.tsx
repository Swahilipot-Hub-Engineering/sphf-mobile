import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';

export default function TermsScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Terms of use</ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedTextColor }]}>
          By using this app, you agree to the following terms for this release.
        </ThemedText>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Service scope</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            The app provides informational sections and access to the FM stream.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Features may change as the product evolves.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Acceptable use</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Use the app lawfully and avoid misuse that affects service availability.
          </ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            Content and branding remain the property of their respective owners.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor },
          ]}>
          <ThemedText style={styles.cardTitle}>Contact</ThemedText>
          <ThemedText style={[styles.cardBody, { color: mutedTextColor }]}>
            For terms inquiries, contact info@swahilipot.org.
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
