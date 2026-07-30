import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAudioPlayer } from './AudioPlayer';

const TAB_BAR_HEIGHT_FALLBACK = 64;

export default function FloatingPlayer() {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, isLoading, togglePlayback, stop } = useAudioPlayer();

  const bottomOffset = useMemo(() => Math.max(insets.bottom, 12) + TAB_BAR_HEIGHT_FALLBACK, [insets.bottom]);

  if (!currentTrack) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomOffset }]}>
      <View style={styles.container} accessibilityRole="adjustable" accessibilityLabel={`${currentTrack.title} player`}>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          {currentTrack.subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {currentTrack.subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.controls}>
          <Pressable
            style={styles.controlButton}
            onPress={() => togglePlayback(currentTrack)}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause live stream' : 'Play live stream'}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <FontAwesome name={isPlaying ? 'pause' : 'play'} size={16} color="#111827" />
            )}
          </Pressable>
          <Pressable style={styles.controlButton} onPress={stop} accessibilityRole="button" accessibilityLabel="Stop live stream">
            <FontAwesome name="stop" size={16} color="#111827" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffffee',
    shadowColor: '#111827',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 20,
  },
  meta: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
