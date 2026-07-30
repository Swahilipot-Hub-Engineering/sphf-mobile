import { StyleSheet, View } from 'react-native';
import { V_PADDING, H_PADDING, GAP } from '.';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import React from 'react';

export default function FoundationScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Swahilipot Hub Foundation</ThemedText>
      <ThemedText style={styles.subtitle}>Programs, community events, and youth upskilling.</ThemedText>

      <ThemedText style={styles.overline}>About</ThemedText>
      <ThemedText style={styles.description}>
        Swahilipot Hub Foundation is a community-based organization focused on empowering youth in East Africa 
        through technology, arts, and entrepreneurship. Founded with the mission to bridge the gap between talented 
        youth and opportunities in the digital economy, we provide a collaborative space where young innovators can 
        learn, create, and grow their ideas into sustainable ventures.
      </ThemedText>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Initiatives</ThemedText>
        <ThemedText style={styles.cardBody}>Surface featured programs or projects.</ThemedText>
      </View>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Get Involved</ThemedText>
        <ThemedText style={styles.cardBody}>Calls-to-action for volunteering or membership.</ThemedText>
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
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  overline: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
