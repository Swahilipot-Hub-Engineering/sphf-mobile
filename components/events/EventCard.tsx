import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text as ThemedText } from '@/components/Themed';

import { formatEventWhenShort } from './format';
import type { EventItem } from './types';

type EventCardProps = {
  event: EventItem;
  onPress: (event: EventItem) => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
  const whenLabel = formatEventWhenShort(event);
  const locationLabel = event.location?.venue ?? event.location?.address;
  const accessibilityLabel = [
    event.title,
    event.status === 'upcoming' ? 'Upcoming event' : 'Past event',
    whenLabel,
    locationLabel,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={() => onPress(event)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons name="calendar-outline" size={28} color="#94a3b8" />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {event.title}
          </ThemedText>
          <View
            style={[
              styles.statusPill,
              event.status === 'upcoming' ? styles.statusPillUpcoming : styles.statusPillPast,
            ]}>
            <ThemedText
              style={[
                styles.statusText,
                event.status === 'upcoming' ? styles.statusTextUpcoming : styles.statusTextPast,
              ]}>
              {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <ThemedText style={styles.metaText} numberOfLines={1}>
            {whenLabel}
          </ThemedText>
        </View>

        {locationLabel ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <ThemedText style={styles.metaText} numberOfLines={1}>
              {locationLabel}
            </ThemedText>
          </View>
        ) : null}

        <ThemedText style={styles.summary} numberOfLines={2}>
          {event.summary}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#e2e8f0',
  },
  imageFallback: {
    width: '100%',
    height: 140,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillUpcoming: {
    backgroundColor: '#dcfce7',
  },
  statusPillPast: {
    backgroundColor: '#e2e8f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextUpcoming: {
    color: '#15803d',
  },
  statusTextPast: {
    color: '#475569',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
    flexShrink: 1,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginTop: 2,
  },
});
