import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { fetchEventById } from '@/components/events/data';
import { formatEventWhen } from '@/components/events/format';
import { openExternalLink } from '@/components/events/links';
import type { EventItem } from '@/components/events/types';

type ScreenState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'not-found' }
  | { kind: 'loaded'; event: EventItem };

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<ScreenState>({ kind: 'loading' });
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkBusy, setLinkBusy] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setState({ kind: 'not-found' });
        return;
      }

      setState({ kind: 'loading' });
      try {
        const event = await fetchEventById(id);
        if (cancelled) return;
        setState(event ? { kind: 'loaded', event } : { kind: 'not-found' });
      } catch (err) {
        console.error('Failed to load event:', err);
        if (!cancelled) {
          setState({ kind: 'error', message: 'Failed to load this event. Please try again.' });
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  const handleOpenLink = useCallback(
    async (label: string, value: string, kind: 'url' | 'email' | 'tel' = 'url') => {
      setLinkError(null);
      setLinkBusy(label);
      const result = await openExternalLink(value, kind);
      setLinkBusy(null);
      if (!result.ok) {
        setLinkError(result.message);
      }
    },
    []
  );

  const handleShare = useCallback(async (event: EventItem) => {
    setLinkError(null);
    try {
      const whenLabel = formatEventWhen(event);
      const location = event.location?.venue ?? event.location?.address;
      const messageParts = [event.title, whenLabel, location].filter(Boolean);
      await Share.share({
        message: [messageParts.join(' — '), event.shareUrl].filter(Boolean).join('\n'),
        url: event.shareUrl,
      });
    } catch (err) {
      console.error('Failed to share event:', err);
      setLinkError('Something went wrong sharing this event.');
    }
  }, []);

  return (
    <ThemedView style={styles.page}>
      <Stack.Screen
        options={{
          title: state.kind === 'loaded' ? state.event.title : 'Event',
          headerBackTitle: 'Events',
        }}
      />

      {state.kind === 'loading' ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#306eb7" />
          <ThemedText style={styles.stateText}>Loading event…</ThemedText>
        </View>
      ) : state.kind === 'error' ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
          <ThemedText style={styles.stateText}>{state.message}</ThemedText>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed ? styles.retryButtonPressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Retry loading this event"
            onPress={retry}>
            <ThemedText style={styles.retryButtonText}>Try again</ThemedText>
          </Pressable>
        </View>
      ) : state.kind === 'not-found' ? (
        <View style={styles.stateContainer}>
          <Ionicons name="calendar-clear-outline" size={32} color="#94a3b8" />
          <ThemedText style={styles.stateText}>
            We couldn&apos;t find that event. It may have been removed.
          </ThemedText>
          <Link href="/events" style={styles.backLink}>
            <ThemedText style={styles.backLinkText}>Back to Events</ThemedText>
          </Link>
        </View>
      ) : (
        <EventDetailsContent
          event={state.event}
          linkError={linkError}
          linkBusy={linkBusy}
          onOpenLink={handleOpenLink}
          onShare={handleShare}
        />
      )}
    </ThemedView>
  );
}

function EventDetailsContent({
  event,
  linkError,
  linkBusy,
  onOpenLink,
  onShare,
}: {
  event: EventItem;
  linkError: string | null;
  linkBusy: string | null;
  onOpenLink: (label: string, value: string, kind?: 'url' | 'email' | 'tel') => void;
  onShare: (event: EventItem) => void;
}) {
  const { organizer, location } = event;
  const organizerEmail = organizer?.email;
  const organizerPhone = organizer?.phone;
  const registrationUrl = event.registrationUrl;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons name="calendar-outline" size={40} color="#94a3b8" />
        </View>
      )}

      <View style={styles.body}>
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

        <ThemedText style={styles.title}>{event.title}</ThemedText>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <ThemedText style={styles.metaText}>{formatEventWhen(event)}</ThemedText>
        </View>

        {location?.venue || location?.address ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color="#64748b" />
            <View style={{ flexShrink: 1 }}>
              {location?.venue ? <ThemedText style={styles.metaText}>{location.venue}</ThemedText> : null}
              {location?.address ? (
                <ThemedText style={styles.metaSubText}>{location.address}</ThemedText>
              ) : null}
            </View>
          </View>
        ) : null}

        <Section title="About">
          <ThemedText style={styles.paragraph}>{event.description ?? event.summary}</ThemedText>
        </Section>

        {event.schedule && event.schedule.length > 0 ? (
          <Section title="Schedule">
            <View style={styles.scheduleList}>
              {event.schedule.map((item, index) => (
                <View key={`${item.time}-${index}`} style={styles.scheduleItem}>
                  <ThemedText style={styles.scheduleTime}>{item.time}</ThemedText>
                  <ThemedText style={styles.scheduleLabel}>{item.label}</ThemedText>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {organizer ? (
          <Section title="Organizer">
            <ThemedText style={styles.paragraph}>{organizer.name}</ThemedText>
            <View style={styles.contactRow}>
              {organizerEmail ? (
                <ContactChip
                  icon="mail-outline"
                  label={organizerEmail}
                  busy={linkBusy === 'organizer-email'}
                  onPress={() => onOpenLink('organizer-email', organizerEmail, 'email')}
                />
              ) : null}
              {organizerPhone ? (
                <ContactChip
                  icon="call-outline"
                  label={organizerPhone}
                  busy={linkBusy === 'organizer-phone'}
                  onPress={() => onOpenLink('organizer-phone', organizerPhone, 'tel')}
                />
              ) : null}
            </View>
          </Section>
        ) : null}

        {linkError ? <ThemedText style={styles.linkErrorText}>{linkError}</ThemedText> : null}

        <View style={styles.ctaRow}>
          {registrationUrl ? (
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed ? styles.buttonPressed : null]}
              accessibilityRole="button"
              accessibilityLabel="Register for this event"
              disabled={linkBusy === 'registration'}
              onPress={() => onOpenLink('registration', registrationUrl, 'url')}>
              {linkBusy === 'registration' ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="open-outline" size={18} color="#fff" />
                  <ThemedText style={styles.primaryButtonLabel}>Register</ThemedText>
                </>
              )}
            </Pressable>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.buttonPressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Share this event"
            onPress={() => onShare(event)}>
            <Ionicons name="share-social-outline" size={18} color="#0f172a" />
            <ThemedText style={styles.secondaryButtonLabel}>Share</ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function ContactChip({
  icon,
  label,
  busy,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  busy: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.contactChip, pressed ? styles.buttonPressed : null]}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={busy}
      onPress={onPress}>
      {busy ? (
        <ActivityIndicator size="small" color="#0f172a" />
      ) : (
        <Ionicons name={icon} size={14} color="#0f172a" />
      )}
      <ThemedText style={styles.contactChipText} numberOfLines={1}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  backLink: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backLinkText: {
    color: '#306eb7',
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
  },
  imageFallback: {
    width: '100%',
    height: 220,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    rowGap: 12,
  },
  statusPill: {
    alignSelf: 'flex-start',
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  metaText: {
    fontSize: 15,
    color: '#334155',
    flexShrink: 1,
  },
  metaSubText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 1,
  },
  section: {
    rowGap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
  },
  scheduleList: {
    rowGap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    flexBasis: '35%',
  },
  scheduleLabel: {
    fontSize: 13,
    color: '#1e293b',
    flexShrink: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    maxWidth: '100%',
  },
  contactChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
  },
  linkErrorText: {
    fontSize: 13,
    color: '#ef4444',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flexBasis: 120,
    minHeight: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonLabel: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
