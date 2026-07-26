import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
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

export default function FmScreen() {
  const { currentTrack, isPlaying, isLoading, togglePlayback, stop } = useAudioPlayer();
  const isCurrentStream = currentTrack?.id === FM_STREAM.id;
  const playingLive = isCurrentStream && isPlaying;

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setScheduleLoading(true);
      setScheduleError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock schedule data based on the structure observed from the URL
        const mockSchedule: ScheduleItem[] = [
          { time: '00:00 - 06:00', monday: 'Night Shift', tuesday: 'Night Shift', wednesday: 'Night Shift', thursday: 'Night Shift', friday: 'Night Shift', saturday: 'Night Shift', sunday: 'Night Shift' },
          { time: '06:00 - 10:00', monday: 'Morning Tide', tuesday: 'Morning Tide', wednesday: 'Morning Tide', thursday: 'Morning Tide', friday: 'Morning Tide', saturday: 'Weekend Warmup', sunday: 'Sunday Gospel' },
          { time: '10:00 - 14:00', monday: 'Midday Groove', tuesday: 'Midday Groove', wednesday: 'Midday Groove', thursday: 'Midday Groove', friday: 'Midday Groove', saturday: 'Saturday Mix', sunday: 'Inspirational Hour' },
          { time: '14:00 - 18:00', monday: 'Afternoon Drive', tuesday: 'Afternoon Drive', wednesday: 'Afternoon Drive', thursday: 'Afternoon Drive', friday: 'Afternoon Drive', saturday: 'Sports Zone', sunday: 'Culture Special' },
          { time: '18:00 - 22:00', monday: 'Evening Chill', tuesday: 'Evening Chill', wednesday: 'Evening Chill', thursday: 'Evening Chill', friday: 'Evening Chill', saturday: 'Nightlife Beats', sunday: 'Relaxation Sounds' },
          { time: '22:00 - 00:00', monday: 'Late Night Talk', tuesday: 'Late Night Talk', wednesday: 'Late Night Talk', thursday: 'Late Night Talk', friday: 'Late Night Talk', saturday: 'Midnight Stories', sunday: 'Calm Reflections' },
        ];
        setSchedule(mockSchedule);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setScheduleError("Failed to load schedule. Please try again later.");
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);


  const statusCopy = isLoading
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
      <ThemedText style={styles.subtitle}>{FM_STREAM.subtitle}</ThemedText>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Now Playing</ThemedText>
          {playingLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <ThemedText style={styles.liveText}>Live</ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.cardBody}>{statusCopy}</ThemedText>

        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              playingLive ? styles.primaryButtonActive : null,
              pressed ? styles.buttonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={playingLive ? 'Pause Swahilipot FM stream' : 'Play Swahilipot FM stream'}
            onPress={handlePrimaryAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name={playingLive ? 'pause' : 'play'} size={20} color="#fff" />
            )}
            <ThemedText style={styles.primaryButtonLabel}>{playingLive ? 'Pause' : 'Play'}</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              (!isCurrentStream || isLoading) ? styles.secondaryButtonDisabled : null,
              pressed ? styles.buttonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Stop Swahilipot FM stream"
            onPress={handleStop}
            disabled={!isCurrentStream || isLoading}
          >
            <Ionicons name="stop" size={18} color="#0f172a" />
            <ThemedText style={styles.secondaryButtonLabel}>Stop</ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.helperText}>
          Audio continues playing while you browse other tabs or switch apps. Use the floating mini player for quick access
          anywhere.
        </ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Today's Schedule</ThemedText>
        {scheduleLoading ? (
          <ActivityIndicator size="small" color="#475569" />
        ) : scheduleError ? (
          <ThemedText style={styles.errorText}>{scheduleError}</ThemedText>
        ) : schedule.length > 0 ? (
          <View style={styles.scheduleContainer}>
            {schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <ThemedText style={styles.scheduleTime}>{item.time}</ThemedText>
                <ThemedText style={styles.scheduleShow}>
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
    color: '#475569',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
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
    borderBottomColor: '#f1f5f9',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    flexBasis: '35%',
  },
  scheduleShow: {
    fontSize: 14,
    color: '#1e293b',
    flexBasis: '60%',
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
  },
});
