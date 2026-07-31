import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { V_PADDING, H_PADDING, GAP } from '.';

import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

// Define a type for the schedule item
type ScheduleItem = {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

type DayKey =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

const DAY_TABS: { key: DayKey; label: string }[] = [
  { key: 'sunday', label: 'Sun' },
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
];

// Parses "HH:MM - HH:MM" into start/end hour numbers for comparison against the clock
function parseSlotHours(time: string): { start: number; end: number } {
  const [startStr, endStr] = time.split(' - ');
  const start = parseInt(startStr.split(':')[0], 10);
  const endRaw = parseInt(endStr.split(':')[0], 10);
  const end = endRaw === 0 ? 24 : endRaw;
  return { start, end };
}

export default function FmScreen() {
  const { currentTrack, isPlaying, isLoading, playbackError, togglePlayback, stop } =
    useAudioPlayer();
  const isCurrentStream = currentTrack?.id === FM_STREAM.id;
  const playingLive = isCurrentStream && isPlaying;

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  // NEW: distinguishes "no connection" from a generic fetch failure, so we can
  // show a different icon/message/retry flow for each.
  const [isOffline, setIsOffline] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayKey;
  const [selectedDay, setSelectedDay] = useState<DayKey>(today);

  const fetchSchedule = async () => {
    setScheduleLoading(true);
    setScheduleError(null);
    setIsOffline(false);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock schedule data based on the structure observed from the URL
      const mockSchedule: ScheduleItem[] = [
        {
          time: '00:00 - 06:00',
          monday: 'Night Shift',
          tuesday: 'Night Shift',
          wednesday: 'Night Shift',
          thursday: 'Night Shift',
          friday: 'Night Shift',
          saturday: 'Night Shift',
          sunday: 'Night Shift',
        },
        {
          time: '06:00 - 10:00',
          monday: 'Morning Tide',
          tuesday: 'Morning Tide',
          wednesday: 'Morning Tide',
          thursday: 'Morning Tide',
          friday: 'Morning Tide',
          saturday: 'Weekend Warmup',
          sunday: 'Sunday Gospel',
        },
        {
          time: '10:00 - 14:00',
          monday: 'Midday Groove',
          tuesday: 'Midday Groove',
          wednesday: 'Midday Groove',
          thursday: 'Midday Groove',
          friday: 'Midday Groove',
          saturday: 'Saturday Mix',
          sunday: 'Inspirational Hour',
        },
        {
          time: '14:00 - 18:00',
          monday: 'Afternoon Drive',
          tuesday: 'Afternoon Drive',
          wednesday: 'Afternoon Drive',
          thursday: 'Afternoon Drive',
          friday: 'Afternoon Drive',
          saturday: 'Sports Zone',
          sunday: 'Culture Special',
        },
        {
          time: '18:00 - 22:00',
          monday: 'Evening Chill',
          tuesday: 'Evening Chill',
          wednesday: 'Evening Chill',
          thursday: 'Evening Chill',
          friday: 'Evening Chill',
          saturday: 'Nightlife Beats',
          sunday: 'Relaxation Sounds',
        },
        {
          time: '22:00 - 00:00',
          monday: 'Late Night Talk',
          tuesday: 'Late Night Talk',
          wednesday: 'Late Night Talk',
          thursday: 'Late Night Talk',
          friday: 'Late Night Talk',
          saturday: 'Midnight Stories',
          sunday: 'Calm Reflections',
        },
      ];

      // --- DEV TESTING TIPS (remove or comment out before merging) ---
      // To test EMPTY state:            setSchedule([]); return;
      // To test OFFLINE state:           setIsOffline(true); setScheduleError('No internet connection.'); return;
      // To test generic ERROR state:     setScheduleError('Unable to reach the schedule server.'); return;
      // -----------------------------------------------------------

      setSchedule(mockSchedule);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
      setScheduleError('Failed to load schedule. Please try again later.');
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const statusCopy = playbackError
    ? playbackError
    : isLoading
      ? 'Connecting to the studio feed...'
      : playingLive
        ? 'Live — Swahilipot FM'
        : isCurrentStream
          ? 'Stream idle. Tap play to listen live.'
          : 'Another audio source is active. Stop it to tune in here.';

  const handlePrimaryAction = () => {
    void togglePlayback(FM_STREAM);
  };

  const handleStop = () => {
    void stop();
  };

  const nowHour = new Date().getHours();
  const currentSlotIndex = useMemo(() => {
    if (schedule.length === 0) return -1;
    return schedule.findIndex((item) => {
      const { start, end } = parseSlotHours(item.time);
      return nowHour >= start && nowHour < end;
    });
  }, [schedule, nowHour]);

  const currentShow =
    currentSlotIndex >= 0 ? schedule[currentSlotIndex][today as keyof ScheduleItem] : null;
  const nextShow =
    currentSlotIndex >= 0 && schedule.length > 0
      ? schedule[(currentSlotIndex + 1) % schedule.length][today as keyof ScheduleItem]
      : null;

  return (
    <ThemedView style={styles.container}>
      {/* Hero section */}
      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Ionicons name="radio" size={26} color="#fff" />
        </View>
        <ThemedText style={styles.title}>{FM_STREAM.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{FM_STREAM.subtitle}</ThemedText>
        <View style={[styles.liveBadge, !playingLive && styles.liveBadgeOffline]}>
          <View style={[styles.liveDot, !playingLive && styles.liveDotOffline]} />
          <ThemedText style={[styles.liveText, !playingLive && styles.liveTextOffline]}>
            {playingLive ? 'Live' : 'Offline'}
          </ThemedText>
        </View>
      </View>

      {/* NEW: Explicit playback-error state — separate banner, doesn't touch the buttons below */}
      {playbackError ? (
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Ionicons name="warning" size={20} color="#dc2626" />
          <View style={styles.errorBannerTextWrap}>
            <ThemedText style={styles.errorBannerTitle}>Playback error</ThemedText>
            <ThemedText style={styles.errorBannerBody}>{playbackError}</ThemedText>
          </View>
        </View>
      ) : null}

      {/* Now Playing card — buttons unchanged from original */}
      <View style={styles.nowPlayingCard}>
        <ThemedText style={[styles.cardBody, playbackError ? styles.streamErrorText : null]}>
          {statusCopy}
        </ThemedText>

        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              playingLive ? styles.primaryButtonActive : null,
              pressed ? styles.buttonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              playingLive ? 'Pause Swahilipot FM stream' : 'Play Swahilipot FM stream'
            }
            onPress={handlePrimaryAction}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name={playingLive ? 'pause' : 'play'} size={20} color="#fff" />
            )}
            <ThemedText style={styles.primaryButtonLabel}>
              {playingLive ? 'Pause' : 'Play'}
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              !isCurrentStream || isLoading ? styles.secondaryButtonDisabled : null,
              pressed ? styles.buttonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Stop Swahilipot FM stream"
            onPress={handleStop}
            disabled={!isCurrentStream || isLoading}>
            <Ionicons name="stop" size={18} color="#0f172a" />
            <ThemedText style={styles.secondaryButtonLabel}>Stop</ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.helperText}>
          Audio continues playing while you browse other tabs or switch apps. Use the floating mini
          player for quick access anywhere.
        </ThemedText>
      </View>

      {/* Up next preview — only shown once schedule has actually loaded successfully */}
      {!scheduleLoading && !scheduleError && currentShow && (
        <View style={styles.previewRow}>
          <View style={styles.previewCard}>
            <ThemedText style={styles.previewLabel}>On air now</ThemedText>
            <ThemedText style={styles.previewShow}>{currentShow}</ThemedText>
          </View>
          {nextShow ? (
            <View style={styles.previewCard}>
              <ThemedText style={styles.previewLabel}>Up next</ThemedText>
              <ThemedText style={styles.previewShow}>{nextShow}</ThemedText>
            </View>
          ) : null}
        </View>
      )}

      {/* Schedule card */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Schedule</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabsScroll}>
          <View style={styles.dayTabs}>
            {DAY_TABS.map((day) => {
              const selected = day.key === selectedDay;
              return (
                <Pressable
                  key={day.key}
                  onPress={() => setSelectedDay(day.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Show schedule for ${day.label}`}
                  style={[styles.dayTab, selected ? styles.dayTabSelected : null]}>
                  <ThemedText
                    style={[styles.dayTabLabel, selected ? styles.dayTabLabelSelected : null]}>
                    {day.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* STATE 1: Loading */}
        {scheduleLoading ? (
          <View style={styles.stateContainer} accessibilityLiveRegion="polite">
            <ActivityIndicator size="large" color="#475569" />
            <ThemedText style={styles.stateText}>Loading today&apos;s programming…</ThemedText>
          </View>
        ) : /* STATE 2: Offline */
        scheduleError && isOffline ? (
          <View style={styles.stateContainer} accessibilityLiveRegion="polite">
            <Ionicons name="cloud-offline-outline" size={40} color="#94a3b8" />
            <ThemedText style={styles.stateText}>
              You&apos;re offline. Showing may be out of date.
            </ThemedText>
            <Pressable
              onPress={fetchSchedule}
              style={styles.retryButton}
              accessibilityRole="button"
              accessibilityLabel="Retry loading the schedule">
              <ThemedText style={styles.retryButtonLabel}>Tap to retry</ThemedText>
            </Pressable>
          </View>
        ) : /* STATE 3: Generic error */
        scheduleError ? (
          <View style={styles.stateContainer} accessibilityLiveRegion="polite">
            <Ionicons name="alert-circle-outline" size={40} color="#dc2626" />
            <ThemedText style={styles.stateText}>{scheduleError}</ThemedText>
            <Pressable
              onPress={fetchSchedule}
              style={styles.retryButton}
              accessibilityRole="button"
              accessibilityLabel="Retry loading the schedule">
              <ThemedText style={styles.retryButtonLabel}>Tap to retry</ThemedText>
            </Pressable>
          </View>
        ) : /* STATE 4: Empty */
        schedule.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons name="calendar-clear-outline" size={40} color="#94a3b8" />
            <ThemedText style={styles.stateText}>No shows scheduled right now.</ThemedText>
          </View>
        ) : (
          /* Normal state: full timeline */
          <View style={styles.timelineContainer}>
            {schedule.map((item, index) => (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineTimeCol}>
                  <ThemedText style={styles.scheduleTime}>{item.time.split(' - ')[0]}</ThemedText>
                  {index !== schedule.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineCard}>
                  <ThemedText style={styles.scheduleShow}>
                    {item[selectedDay as keyof ScheduleItem] || 'No show'}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}
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
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
  },
  nowPlayingCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonActive: {
    backgroundColor: '#0f172a',
  },
  primaryButtonLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flexBasis: 120,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonLabel: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
  },
  streamErrorText: {
    color: '#ef4444',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fee2e2',
  },
  liveBadgeOffline: {
    backgroundColor: '#e5e7eb',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  liveDotOffline: {
    backgroundColor: '#6b7280',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },
  liveTextOffline: {
    color: '#374151',
  },
  // NEW: playback-error banner
  errorBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    alignItems: 'flex-start',
  },
  errorBannerTextWrap: {
    flex: 1,
  },
  errorBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
  },
  errorBannerBody: {
    fontSize: 13,
    color: '#7f1d1d',
    marginTop: 2,
  },
  // Up next preview row
  previewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previewCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  previewLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
  },
  previewShow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  // Day tabs
  dayTabsScroll: {
    marginBottom: 4,
  },
  dayTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  dayTabSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  dayTabLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  dayTabLabelSelected: {
    color: '#fff',
  },
  // NEW: shared state container (loading / offline / error / empty)
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  stateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  retryButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  // Timeline (normal state)
  timelineContainer: {
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineTimeCol: {
    width: 56,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#e5e7eb',
    marginTop: 4,
  },
  timelineCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  scheduleShow: {
    fontSize: 14,
    color: '#1e293b',
  },
});