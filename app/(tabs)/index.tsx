import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import HomeHero from '@/components/home/HomeHero';
import HomeSection from '@/components/home/HomeSection';
import HomeModuleCard, { type HomeModuleStatus } from '@/components/home/HomeModuleCard';
import HomeErrorBoundary from '@/components/home/HomeErrorBoundary';
import { homeColors } from '@/components/home/theme';

export const H_PADDING = 16;
export const V_PADDING = 70;
export const GAP = 12;

function FmModuleCard({ style }: { style?: StyleProp<ViewStyle> }) {
  const { currentTrack, isPlaying, isLoading } = useAudioPlayer();
  const isCurrentStream = currentTrack?.id === FM_STREAM.id;

  const status: HomeModuleStatus =
    isLoading && isCurrentStream
      ? { label: 'Connecting…', tone: 'loading' }
      : isPlaying && isCurrentStream
        ? { label: 'Live now', tone: 'live' }
        : { label: 'Tap to listen', tone: 'idle' };

  return (
    <HomeModuleCard
      icon="podcast"
      title="Swahilipot FM"
      description={FM_STREAM.subtitle ?? FM_STREAM.description ?? ''}
      ctaLabel="Listen live"
      href="/fm"
      status={status}
      style={style}
    />
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isMultiColumn = width >= 700;

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <HomeHero />

        <HomeSection
          title="Explore the app"
          subtitle="Jump into any module below. You can always come back here from the Home tab.">
          <View style={[styles.cardGrid, isMultiColumn && styles.cardGridMultiColumn]}>
            <HomeErrorBoundary fallbackLabel="Swahilipot FM is unavailable right now. Try the FM tab directly.">
              <FmModuleCard style={isMultiColumn && styles.cardMultiColumn} />
            </HomeErrorBoundary>

            <HomeModuleCard
              icon="building"
              title="Foundation"
              description="Programs, community events, and youth upskilling."
              ctaLabel="Explore Foundation"
              href="/foundation"
              style={isMultiColumn && styles.cardMultiColumn}
            />

            <HomeModuleCard
              icon="calendar"
              title="Events"
              description="Schedules and happenings across the Swahilipot ecosystem."
              ctaLabel="View events"
              href="/events"
              style={isMultiColumn && styles.cardMultiColumn}
            />
          </View>
        </HomeSection>

        <HomeSection title="More">
          <HomeModuleCard
            icon="cog"
            title="Settings"
            description="Manage your app preferences."
            ctaLabel="Open settings"
            href="/settings"
          />
        </HomeSection>

        <HomeSection title="Key information">
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Website</ThemedText>
              <ThemedText style={styles.infoValue}>https://swahilipot.org</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Contact email</ThemedText>
              <ThemedText style={styles.infoValue}>info@swahilipot.org</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Location</ThemedText>
              <ThemedText style={styles.infoValue}>Mombasa, Kenya</ThemedText>
            </View>
          </View>
        </HomeSection>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    rowGap: GAP * 2,
  },
  cardGrid: {
    gap: GAP,
  },
  cardGridMultiColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardMultiColumn: {
    flexBasis: '31%',
    flexGrow: 1,
    minWidth: 260,
  },
  infoCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: homeColors.border,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
});
