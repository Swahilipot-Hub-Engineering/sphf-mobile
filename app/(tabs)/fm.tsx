import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { V_PADDING, H_PADDING, GAP } from '.';

import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import { getCachedJson, setCachedJson } from '@/components/appStorage';
import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';

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

const SCHEDULE_CACHE_KEY = 'fm:schedule';

export default function FmScreen() {
  const { currentTrack, isPlaying, isLoading, playbackError, togglePlayback, stop } =
    useAudioPlayer();
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');
  const secondaryButtonBackgroundColor = useThemeColor(
    { light: '#f8fafc', dark: '#111827' },
    'background'
  );
  const secondaryButtonBorderColor = useThemeColor({ light: '#e2e8f0', dark: '#334155' }, 'text');
  const secondaryButtonTextColor = useThemeColor({ light: '#0f172a', dark: '#e2e8f0' }, 'text');
  const scheduleDividerColor = useThemeColor({ light: '#f1f5f9', dark: '#334155' }, 'text');
  const scheduleShowColor = useThemeColor({ light: '#1e293b', dark: '#e2e8f0' }, 'text');
  const helperTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const isCurrentStream = currentTrack?.id === FM_STREAM.id;
  const playingLive = isCurrentStream && isPlaying;

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setScheduleLoading(true);
      setScheduleError(null);

      let cachedSchedule: ScheduleItem[] | null = null;
      try {
        cachedSchedule = await getCachedJson<ScheduleItem[]>(SCHEDULE_CACHE_KEY);
      } catch (error) {
        console.warn('[FM] Failed to read schedule cache', error);
      }

      if (cachedSchedule && cachedSchedule.length > 0) {
        setSchedule(cachedSchedule);
        setScheduleLoading(false);
        return;
      }

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
        setSchedule(mockSchedule);
        try {
          await setCachedJson(SCHEDULE_CACHE_KEY, mockSchedule);
        } catch (error) {
          console.warn('[FM] Failed to write schedule cache', error);
        }
      } catch (error) {
        console.error('Failed to load schedule:', error);
        setScheduleError('Failed to load schedule. Please try again later.');
      } finally {
        setScheduleLoading(false);
      }
    };

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

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{FM_STREAM.title}</ThemedText>
      <ThemedText style={[styles.subtitle, { color: mutedTextColor }]}>
        {FM_STREAM.subtitle}
      </ThemedText>

      <View
        style={[
          styles.card,
          {
            borderColor: cardBorderColor,
            backgroundColor: cardBackgroundColor,
          },
        ]}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Now Playing</ThemedText>
          {playingLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <ThemedText style={styles.liveText}>Live</ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText
          style={[
            styles.cardBody,
            { color: mutedTextColor },
            playbackError ? styles.streamErrorText : null,
          ]}>
          {statusCopy}
        </ThemedText>

        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { borderColor: secondaryButtonBorderColor },
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
              {
                backgroundColor: secondaryButtonBackgroundColor,
                borderColor: secondaryButtonBorderColor,
              },
              !isCurrentStream || isLoading ? styles.secondaryButtonDisabled : null,
              pressed ? styles.buttonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Stop Swahilipot FM stream"
            onPress={handleStop}
            disabled={!isCurrentStream || isLoading}>
            <Ionicons name="stop" size={18} color={secondaryButtonTextColor} />
            <ThemedText style={[styles.secondaryButtonLabel, { color: secondaryButtonTextColor }]}>
              Stop
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText style={[styles.helperText, { color: helperTextColor }]}>
          Use the floating mini player for quick access anywhere in the app.
        </ThemedText>
      </View>

      <View
        style={[
          styles.card,
          {
            borderColor: cardBorderColor,
            backgroundColor: cardBackgroundColor,
          },
        ]}>
        <ThemedText style={styles.cardTitle}>Today&apos;s Schedule</ThemedText>
        {scheduleLoading ? (
          <ActivityIndicator size="small" color={mutedTextColor} />
        ) : scheduleError ? (
          <ThemedText style={styles.errorText}>{scheduleError}</ThemedText>
        ) : schedule.length > 0 ? (
          <View style={styles.scheduleContainer}>
            {schedule.map((item, index) => (
              <View
                key={index}
                style={[styles.scheduleItem, { borderBottomColor: scheduleDividerColor }]}>
                <ThemedText style={[styles.scheduleTime, { color: mutedTextColor }]}>
                  {item.time}
                </ThemedText>
                <ThemedText style={[styles.scheduleShow, { color: scheduleShowColor }]}>
                  {item[today as keyof ScheduleItem] || 'No show'}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : (
          <ThemedText style={styles.cardBody}>No schedule available.</ThemedText>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 999,
    borderWidth: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  helperText: {
    fontSize: 12,
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
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },
  scheduleContainer: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    flexBasis: '35%',
  },
  scheduleShow: {
    fontSize: 14,
    flexBasis: '60%',
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
  },
});
