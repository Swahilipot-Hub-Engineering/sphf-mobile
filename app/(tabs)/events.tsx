import { StyleSheet, View } from 'react-native';
import { V_PADDING, H_PADDING, GAP } from '.';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import React from 'react';
import { appColors, radius, spacing, typography } from '@/theme';

export default function EventsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Events</ThemedText>
      <ThemedText style={styles.subtitle}>
        Schedules and happenings across the Swahilipot ecosystem.
      </ThemedText>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Upcoming</ThemedText>
        <ThemedText style={styles.cardBody}>List dates, venues, and registration links.</ThemedText>
      </View>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Past Highlights</ThemedText>
        <ThemedText style={styles.cardBody}>Recaps, photos, and recordings.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    rowGap: GAP,
  },
  title: {
    fontSize: typography.size.x2l,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.relaxed,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: appColors.light.border,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.base,
  },
});
