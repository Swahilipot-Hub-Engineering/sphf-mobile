import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

export default function FmScreen() {
  const { currentTrack, isPlaying, isLoading, togglePlayback, stop } = useAudioPlayer();
  const isCurrentStream = currentTrack?.id === FM_STREAM.id;
  const playingLive = isCurrentStream && isPlaying;

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
        <ThemedText style={styles.cardTitle}>Shows</ThemedText>
        <ThemedText style={styles.cardBody}>
          Catch the Morning Tide, Coastline Countdown, and weekend culture specials live right here soon.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
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
});
