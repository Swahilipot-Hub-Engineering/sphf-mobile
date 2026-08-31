import React, { useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { V_PADDING, H_PADDING, GAP } from '.';
import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { openExternalLink, type LinkKind } from '@/components/events/links';
import { radius, sphfColors, spacing, typography } from '@/theme';

const CONTACT = {
  website: 'https://www.swahilipothub.co.ke',
  websiteDisplay: 'swahilipothub.co.ke',
  email: 'info@swahilipothub.co.ke',
  phone: '+254114635505',
  phoneDisplay: '+254 114 635 505',
  address: "Swahili Cultural Centre, Mombasa Hospital Road, Opp. Governor's Office, Mombasa, Kenya",
};

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`;

const PROGRAMS: { name: string; description: string; url: string }[] = [
  {
    name: 'Case Management',
    description: 'Personalized youth support & guidance.',
    url: 'https://www.swahilipothub.co.ke/programs/case-management',
  },
  {
    name: 'Youth Hub Network',
    description: 'Connecting youth across the region.',
    url: 'https://www.swahilipothub.co.ke/programs/youth-hub-network',
  },
  {
    name: 'Digital Literacy',
    description: 'Building digital skills for the future.',
    url: 'https://www.swahilipothub.co.ke/programs/digital-literacy',
  },
  {
    name: 'Heritage',
    description: 'Bridging culture and digital practices.',
    url: 'https://www.swahilipothub.co.ke/programs/heritage',
  },
  {
    name: 'V2T (Vijana To Thrive)',
    description: 'Vijana To Thrive program.',
    url: 'https://www.swahilipothub.co.ke/programs/v2t',
  },
  {
    name: 'Creatives',
    description: 'Music, film, dance & visual arts.',
    url: 'https://www.swahilipothub.co.ke/department/creatives',
  },
  {
    name: 'Scale Up',
    description: 'Accelerating youth entrepreneurship.',
    url: 'https://www.swahilipothub.co.ke/programs/scale-up',
  },
];

const IMPACT_STATS: { value: string; label: string }[] = [
  { value: '5,000+', label: 'Youth reached since founding' },
  { value: '10+', label: 'Community hubs established' },
  { value: '87%', label: 'Find employment within 6 months' },
  { value: '90%', label: 'Startups survive beyond 2 years' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const CONTACT_ROWS: {
  key: string;
  title: string;
  value: string;
  label: string;
  kind: LinkKind;
  target: string;
}[] = [
  {
    key: 'directions',
    title: 'Get directions',
    value: CONTACT.address,
    label: `Get directions to ${CONTACT.address}`,
    kind: 'url',
    target: DIRECTIONS_URL,
  },
  {
    key: 'email',
    title: 'Email us',
    value: CONTACT.email,
    label: `Email Swahilipot Hub at ${CONTACT.email}`,
    kind: 'email',
    target: CONTACT.email,
  },
  {
    key: 'phone',
    title: 'Call us',
    value: CONTACT.phoneDisplay,
    label: `Call Swahilipot Hub at ${CONTACT.phoneDisplay}`,
    kind: 'tel',
    target: CONTACT.phone,
  },
  {
    key: 'website',
    title: 'Visit website',
    value: CONTACT.websiteDisplay,
    label: 'Visit the Swahilipot Hub Foundation website',
    kind: 'url',
    target: CONTACT.website,
  },
];

export default function FoundationScreen() {
  const cardBorderColor = useThemeColor({ light: '#e5e7eb', dark: '#334155' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#0f172a' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#475569', dark: '#cbd5e1' }, 'text');
  const tintColor = useThemeColor({ light: '#306eb7', dark: '#93c5fd' }, 'tint');
  const onTintColor = useThemeColor(
    { light: sphfColors.text.inverseLight, dark: sphfColors.text.inverseDark },
    'text'
  );
  const cardStyle = { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor };

  const [linkBusyKey, setLinkBusyKey] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleOpenLink = useCallback(async (key: string, value: string, kind: LinkKind = 'url') => {
    setLinkError(null);
    setLinkBusyKey(key);
    const result = await openExternalLink(value, kind);
    setLinkBusyKey(null);
    if (!result.ok) {
      setLinkError(result.message);
    }
  }, []);

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Image
            source={require('@/assets/images/sph-logo.png')}
            style={styles.logo}
            contentFit="contain"
            accessible
            accessibilityLabel="Swahilipot Hub Foundation logo"
          />
          <ThemedText style={styles.title} accessibilityRole="header">
            Swahilipot Hub Foundation
          </ThemedText>
          <ThemedText style={[styles.paragraph, { color: mutedTextColor }]}>
            Swahilipot Hub Foundation nurtures youth talent through technology, arts, and
            entrepreneurship in the heart of East Africa.
          </ThemedText>
        </View>

        <Section title="About">
          <ThemedText style={styles.paragraph}>
            Swahilipot Hub Foundation is a community-based organization focused on empowering youth
            in East Africa through technology, arts, and entrepreneurship. We provide a
            collaborative space where young innovators can learn, create, and grow their ideas into
            sustainable ventures.
          </ThemedText>
        </Section>

        <Section title="Mission & Vision">
          <View style={[styles.card, cardStyle]}>
            <ThemedText style={styles.cardLabel}>Mission</ThemedText>
            <ThemedText style={styles.paragraph}>
              To empower and transform youth by providing access to safe spaces, building their
              capacity, promoting collaboration and linking them to opportunities for their holistic
              growth and development.
            </ThemedText>
          </View>
          <View style={[styles.card, cardStyle]}>
            <ThemedText style={styles.cardLabel}>Vision</ThemedText>
            <ThemedText style={styles.paragraph}>
              Transformed youth, thriving communities.
            </ThemedText>
          </View>
        </Section>

        <Section title="Focus areas & programs">
          <View style={[styles.card, styles.listCard, cardStyle]}>
            {PROGRAMS.map((program, index) => (
              <Pressable
                key={program.name}
                accessibilityRole="button"
                accessibilityLabel={`${program.name}. ${program.description} Opens the program page in your browser.`}
                disabled={linkBusyKey !== null}
                style={({ pressed }) => [
                  styles.programRow,
                  index > 0 ? [styles.rowDivider, { borderTopColor: cardBorderColor }] : null,
                  pressed ? styles.rowPressed : null,
                ]}
                onPress={() => handleOpenLink(program.name, program.url, 'url')}>
                <View style={styles.programText}>
                  <ThemedText style={styles.rowTitle}>{program.name}</ThemedText>
                  <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
                    {program.description}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={mutedTextColor} />
              </Pressable>
            ))}
          </View>
          {linkError ? <ThemedText style={styles.errorText}>{linkError}</ThemedText> : null}
        </Section>

        <Section title="Impact">
          <View style={styles.statGrid}>
            {IMPACT_STATS.map((stat) => (
              <View key={stat.label} style={[styles.statTile, cardStyle]}>
                <ThemedText style={[styles.title, { color: tintColor }]}>{stat.value}</ThemedText>
                <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
                  {stat.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Visit & contact">
          <View style={[styles.card, styles.listCard, cardStyle]}>
            {CONTACT_ROWS.map((row, index) => (
              <Pressable
                key={row.key}
                accessibilityRole="button"
                accessibilityLabel={row.label}
                disabled={linkBusyKey !== null}
                style={({ pressed }) => [
                  styles.contactRow,
                  index > 0 ? [styles.rowDivider, { borderTopColor: cardBorderColor }] : null,
                  pressed ? styles.rowPressed : null,
                ]}
                onPress={() => handleOpenLink(row.key, row.target, row.kind)}>
                <ThemedText style={styles.rowTitle}>{row.title}</ThemedText>
                <ThemedText style={[styles.rowValue, { color: mutedTextColor }]}>
                  {row.value}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {linkError ? <ThemedText style={styles.errorText}>{linkError}</ThemedText> : null}
        </Section>

        <Section title="Ways to engage">
          <View style={styles.section}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View upcoming and past Swahilipot events"
              style={({ pressed }) => [
                styles.ctaButton,
                { backgroundColor: tintColor },
                pressed ? styles.rowPressed : null,
              ]}
              onPress={() => router.push('/events')}>
              <Ionicons name="calendar-outline" size={18} color={onTintColor} />
              <ThemedText style={[styles.buttonLabel, { color: onTintColor }]}>
                View events
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Listen to Swahilipot FM live"
              style={({ pressed }) => [
                styles.ctaButton,
                styles.ctaButtonOutlined,
                cardStyle,
                pressed ? styles.rowPressed : null,
              ]}
              onPress={() => router.push('/fm')}>
              <Ionicons name="radio-outline" size={18} color={tintColor} />
              <ThemedText style={[styles.buttonLabel, { color: tintColor }]}>
                Listen to Swahilipot FM
              </ThemedText>
            </Pressable>
          </View>
        </Section>
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
  logo: {
    width: 220,
    height: 44,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: typography.size.x2l,
    fontWeight: '700',
  },
  section: {
    rowGap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.relaxed,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    rowGap: spacing.xs,
  },
  listCard: {
    padding: 0,
    rowGap: 0,
  },
  cardLabel: {
    fontSize: typography.size.sm,
    fontWeight: '700',
    letterSpacing: typography.letterSpacing.overline,
    textTransform: 'uppercase',
  },
  programRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    padding: spacing.md,
  },
  programText: {
    flex: 1,
    rowGap: 2,
  },
  rowDivider: {
    borderTopWidth: 1,
  },
  rowPressed: {
    opacity: 0.85,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statTile: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    rowGap: spacing.xxs,
  },
  contactRow: {
    minHeight: 48,
    justifyContent: 'center',
    padding: spacing.md,
    rowGap: 2,
  },
  rowTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.base,
  },
  errorText: {
    fontSize: typography.size.sm,
    color: '#ef4444',
  },
  ctaButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonOutlined: {
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: typography.size.md,
    fontWeight: '600',
  },
});
