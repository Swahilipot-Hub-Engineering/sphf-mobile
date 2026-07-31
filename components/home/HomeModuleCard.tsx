import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text as ThemedText } from '@/components/Themed';
import { homeColors, homeSpacing } from './theme';

export type HomeModuleStatus = {
  label: string;
  tone: 'live' | 'loading' | 'idle';
};

type HomeModuleCardProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  description: string;
  ctaLabel: string;
  href: Href;
  status?: HomeModuleStatus;
  style?: StyleProp<ViewStyle>;
};

export default function HomeModuleCard({
  icon,
  title,
  description,
  ctaLabel,
  href,
  status,
  style,
}: HomeModuleCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint={ctaLabel}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}>
      <View style={styles.iconWrap} accessible={false}>
        <FontAwesome name={icon} size={18} color={homeColors.primary} accessible={false} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {status ? (
            <View style={[styles.statusBadge, status.tone === 'live' && styles.statusBadgeLive]}>
              {status.tone === 'live' ? <View style={styles.liveDot} /> : null}
              <ThemedText
                style={[styles.statusText, status.tone === 'live' && styles.statusTextLive]}>
                {status.label}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.description}>{description}</ThemedText>

        <View style={styles.ctaRow}>
          <ThemedText style={styles.ctaLabel}>{ctaLabel}</ThemedText>
          <FontAwesome
            name="chevron-right"
            size={12}
            color={homeColors.primary}
            accessible={false}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: homeSpacing.md,
    padding: homeSpacing.lg,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: homeColors.border,
    backgroundColor: homeColors.card,
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: homeColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: homeSpacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: homeSpacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: homeColors.muted,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: homeSpacing.xs,
  },
  ctaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: homeColors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: homeColors.surface,
  },
  statusBadgeLive: {
    backgroundColor: homeColors.liveBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: homeColors.muted,
  },
  statusTextLive: {
    color: homeColors.liveText,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: homeColors.live,
  },
});
