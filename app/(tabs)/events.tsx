import { StyleSheet, View } from 'react-native';
import { V_PADDING, H_PADDING, GAP } from '.';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import React from 'react';

export default function EventsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Events</ThemedText>
      <ThemedText style={styles.subtitle}>Schedules and happenings across the Swahilipot ecosystem.</ThemedText>
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
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
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
