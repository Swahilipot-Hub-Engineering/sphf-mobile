import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { V_PADDING, H_PADDING, GAP } from '.';

import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { appColors, fmTypography, radius, spacing, swahilipotFmColors, typography } from '@/theme';

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

type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

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
  const [isOffline, setIsOffline] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayKey;
  const [selectedDay, setSelectedDay] = useState<DayKey>(today);

  const fetchSchedule = async () => {
    setScheduleLoading(true);
    setScheduleError(null);
    setIsOffline(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
      setScheduleError('Failed to load schedule. Please try again later.');
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; fetchSchedule's own setState calls are intentional here.
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
          <Ionicons name="radio" size={26} color={swahilipotFmColors.button.primaryText} />
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

      {/* Explicit playback-error state — separate banner, doesn't touch the buttons below */}
      {playbackError ? (
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Ionicons name="warning" size={20} color={swahilipotFmColors.accent[600]} />
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
              <ActivityIndicator color={swahilipotFmColors.button.primaryText} />
            ) : (
              <Ionicons
                name={playingLive ? 'pause' : 'play'}
                size={20}
                color={swahilipotFmColors.button.primaryText}
              />
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
            <Ionicons name="stop" size={18} color={swahilipotFmColors.button.secondaryText} />
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
            <ActivityIndicator size="large" color={appColors.light.textSecondary} />
            <ThemedText style={styles.stateText}>Loading today&apos;s programming…</ThemedText>
          </View>
        ) : /* STATE 2: Offline */
        scheduleError && isOffline ? (
          <View style={styles.stateContainer} accessibilityLiveRegion="polite">
            <Ionicons name="cloud-offline-outline" size={40} color={appColors.light.textMuted} />
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
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={swahilipotFmColors.accent[600]}
            />
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
            <Ionicons name="calendar-clear-outline" size={40} color={appColors.light.textMuted} />
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
    gap: spacing.xs + 2,
    paddingVertical: spacing.sm,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: swahilipotFmColors.player.backgroundActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fmTypography.heroTitle.fontSize,
    fontWeight: fmTypography.heroTitle.fontWeight,
    letterSpacing: fmTypography.heroTitle.letterSpacing,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.relaxed,
    color: appColors.light.textSecondary,
    textAlign: 'center',
  },
  nowPlayingCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: appColors.light.border,
    backgroundColor: swahilipotFmColors.player.panel,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: appColors.light.border,
    backgroundColor: swahilipotFmColors.player.panel,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  cardBody: {
    fontSize: fmTypography.body.fontSize,
    lineHeight: fmTypography.body.lineHeight,
    color: appColors.light.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.pill,
    backgroundColor: swahilipotFmColors.button.primaryBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonActive: {
    backgroundColor: swahilipotFmColors.button.primaryBackgroundActive,
  },
  primaryButtonLabel: {
    color: swahilipotFmColors.button.primaryText,
    fontSize: fmTypography.label.fontSize,
    fontWeight: fmTypography.label.fontWeight,
  },
  secondaryButton: {
    flexBasis: 120,
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: swahilipotFmColors.button.secondaryBorder,
    backgroundColor: swahilipotFmColors.button.secondaryBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonLabel: {
    color: swahilipotFmColors.button.secondaryText,
    fontSize: fmTypography.label.fontSize,
    fontWeight: fmTypography.label.fontWeight,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  helperText: {
    fontSize: typography.size.xs,
    color: appColors.light.textMuted,
  },
  streamErrorText: {
    color: swahilipotFmColors.accent[500],
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: swahilipotFmColors.player.liveBadge,
  },
  liveBadgeOffline: {
    backgroundColor: appColors.light.border,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: swahilipotFmColors.player.liveDot,
  },
  liveDotOffline: {
    backgroundColor: appColors.light.textMuted,
  },
  liveText: {
    fontSize: fmTypography.badge.fontSize,
    fontWeight: fmTypography.badge.fontWeight,
    letterSpacing: fmTypography.badge.letterSpacing,
    color: swahilipotFmColors.player.liveText,
  },
  liveTextOffline: {
    color: appColors.light.textSecondary,
  },
  errorBanner: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: swahilipotFmColors.accent[200],
    backgroundColor: swahilipotFmColors.accent[50],
    alignItems: 'flex-start',
  },
  errorBannerTextWrap: {
    flex: 1,
  },
  errorBannerTitle: {
    fontSize: typography.size.sm - 1,
    fontWeight: typography.weight.bold,
    color: swahilipotFmColors.accent[700],
  },
  errorBannerBody: {
    fontSize: typography.size.sm - 1,
    color: swahilipotFmColors.accent[900],
    marginTop: 2,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md + 4,
    borderWidth: 1,
    borderColor: appColors.light.border,
    backgroundColor: swahilipotFmColors.player.panelMuted,
  },
  previewLabel: {
    fontSize: typography.size.xs - 1,
    color: appColors.light.textMuted,
    marginBottom: 2,
  },
  previewShow: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: appColors.light.text,
  },
  dayTabsScroll: {
    marginBottom: spacing.xs,
  },
  dayTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dayTab: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: appColors.light.borderStrong,
    backgroundColor: appColors.light.surface,
  },
  dayTabSelected: {
    backgroundColor: swahilipotFmColors.button.primaryBackground,
    borderColor: swahilipotFmColors.button.primaryBackground,
  },
  dayTabLabel: {
    fontSize: typography.size.sm - 1,
    color: appColors.light.textSecondary,
    fontWeight: typography.weight.medium,
  },
  dayTabLabelSelected: {
    color: swahilipotFmColors.button.primaryText,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.x3l,
    gap: spacing.sm,
  },
  stateText: {
    fontSize: typography.size.sm,
    color: appColors.light.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: appColors.light.borderStrong,
  },
  retryButtonLabel: {
    fontSize: typography.size.sm - 1,
    fontWeight: typography.weight.semibold,
    color: appColors.light.text,
  },
  timelineContainer: {
    marginTop: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineTimeCol: {
    width: 56,
    alignItems: 'center',
    marginRight: spacing.sm + 2,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: appColors.light.border,
    marginTop: spacing.xs,
  },
  timelineCard: {
    flex: 1,
    padding: spacing.sm + 2,
    borderRadius: radius.md + 2,
    backgroundColor: swahilipotFmColors.player.panelMuted,
  },
  scheduleTime: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: appColors.light.textSecondary,
  },
  scheduleShow: {
    fontSize: typography.size.sm,
    color: appColors.light.text,
  },
});
