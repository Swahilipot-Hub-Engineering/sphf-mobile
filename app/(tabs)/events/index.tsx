import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { EventCard } from '@/components/events/EventCard';
import { fetchEvents } from '@/components/events/data';
import type { EventItem, EventStatus } from '@/components/events/types';

import { V_PADDING, H_PADDING, GAP } from '..';

type Filter = EventStatus;

type ReloadRequest = {
  token: number;
  isRefresh: boolean;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [reload, setReload] = useState<ReloadRequest>({ token: 0, isRefresh: false });

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      if (reload.isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
        if (!cancelled) {
          setError('Failed to load events. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [reload]);

  const retry = useCallback(() => {
    setReload((current) => ({ token: current.token + 1, isRefresh: false }));
  }, []);

  const refresh = useCallback(() => {
    setReload((current) => ({ token: current.token + 1, isRefresh: true }));
  }, []);

  const handleOpenEvent = useCallback((event: EventItem) => {
    router.push(`/events/${event.id}`);
  }, []);

  const visibleEvents = (events ?? []).filter((event) => event.status === filter);

  return (
    <ThemedView style={styles.page}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Events</ThemedText>
        <ThemedText style={styles.subtitle}>
          Schedules and happenings across the Swahilipot ecosystem.
        </ThemedText>

        <View style={styles.filterRow} accessibilityRole="tablist">
          <FilterTab
            label="Upcoming"
            active={filter === 'upcoming'}
            onPress={() => setFilter('upcoming')}
          />
          <FilterTab label="Past" active={filter === 'past'} onPress={() => setFilter('past')} />
        </View>
      </View>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#306eb7" />
          <ThemedText style={styles.stateText}>Loading events…</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
          <ThemedText style={styles.stateText}>{error}</ThemedText>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed ? styles.retryButtonPressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Retry loading events"
            onPress={retry}>
            <ThemedText style={styles.retryButtonText}>Try again</ThemedText>
          </Pressable>
        </View>
      ) : visibleEvents.length === 0 ? (
        <View style={styles.stateContainer}>
          <Ionicons name="calendar-clear-outline" size={32} color="#94a3b8" />
          <ThemedText style={styles.stateText}>
            {filter === 'upcoming'
              ? 'No upcoming events right now. Check back soon.'
              : 'No past events to show yet.'}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={visibleEvents}
          keyExtractor={(event) => event.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <EventCard event={item} onPress={handleOpenEvent} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

function FilterTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} events`}
      style={[styles.filterTab, active ? styles.filterTabActive : null]}>
      <ThemedText style={[styles.filterTabText, active ? styles.filterTabTextActive : null]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  header: {
    paddingHorizontal: H_PADDING,
    paddingTop: V_PADDING,
    paddingBottom: 4,
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterTabActive: {
    backgroundColor: '#306eb7',
    borderColor: '#306eb7',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: GAP,
    paddingBottom: V_PADDING,
    rowGap: GAP,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
    rowGap: 10,
  },
  stateText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
