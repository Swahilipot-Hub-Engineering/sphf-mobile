import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text as ThemedText } from '@/components/Themed';
import { homeColors, homeSpacing } from './theme';

type HomeSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function HomeSection({ title, subtitle, children }: HomeSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.title} accessibilityRole="header">
        {title}
      </ThemedText>
      {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: homeSpacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: homeColors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: homeColors.muted,
  },
  content: {
    gap: homeSpacing.md,
    marginTop: homeSpacing.xs,
  },
});
