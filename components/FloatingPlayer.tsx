import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAudioPlayer } from './AudioPlayer';
import { appColors, radius, shadows, spacing, swahilipotFmColors, typography } from '@/theme';

const TAB_BAR_HEIGHT_FALLBACK = 64;

export default function FloatingPlayer() {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, isLoading, togglePlayback, stop } = useAudioPlayer();

  const bottomOffset = useMemo(
    () => Math.max(insets.bottom, 12) + TAB_BAR_HEIGHT_FALLBACK,
    [insets.bottom]
  );

  if (!currentTrack) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomOffset }]}>
      <View
        style={styles.container}
        accessibilityRole="adjustable"
        accessibilityLabel={`${currentTrack.title} player`}>
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
              <ActivityIndicator size="small" color={swahilipotFmColors.player.controlIcon} />
            ) : (
              <FontAwesome
                name={isPlaying ? 'pause' : 'play'}
                size={16}
                color={swahilipotFmColors.player.controlIcon}
              />
            )}
          </Pressable>
          <Pressable
            style={styles.controlButton}
            onPress={stop}
            accessibilityRole="button"
            accessibilityLabel="Stop live stream">
            <FontAwesome name="stop" size={16} color={swahilipotFmColors.player.controlIcon} />
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
    paddingHorizontal: spacing.lg,
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.light.borderStrong,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    backgroundColor: appColors.light.surfaceRaised,
    ...shadows.soft,
    zIndex: 20,
  },
  meta: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: appColors.light.text,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: appColors.light.textSecondary,
    marginTop: spacing.xxs,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    height: 36,
    width: 36,
    borderRadius: radius.round,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.light.borderStrong,
    backgroundColor: swahilipotFmColors.player.panelMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
