import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { appColors, radius, spacing, typography } from '@/theme';

export const H_PADDING = 16;
export const V_PADDING = 70;
export const GAP = 12;

export default function HomeScreen() {
  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.topBar}>
            <Image source={require('@/assets/logos/sphf/sphf-logo-primary.png')} style={styles.logo} />
          </View>
          <ThemedText style={styles.title}>Choose where to go</ThemedText>
          <ThemedText style={styles.subtitle}>
            Pick a module to jump into. You can always return here from the Home tab.
          </ThemedText>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>Key information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Website</ThemedText>
              <ThemedText style={styles.infoValue}>https://swahilipot.org</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Contact email</ThemedText>
              <ThemedText style={styles.infoValue}>info@swahilipot.org</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Customer care</ThemedText>
              <ThemedText style={styles.infoValue}>+254 700 000 000</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Location</ThemedText>
              <ThemedText style={styles.infoValue}>Mombasa, Kenya</ThemedText>
            </View>
          </View>
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
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 300,
    height: 50,
    borderRadius: radius.sm,
  },
  infoCard: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: appColors.light.border,
    gap: spacing.sm,
  },
  infoTitle: {
    fontSize: typography.size.md,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.size.sm,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: typography.size.sm,
    flexShrink: 1,
    textAlign: 'right',
  },
  title: {
    fontSize: typography.size.x2l,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.relaxed,
  },
});
