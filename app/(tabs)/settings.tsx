import React from 'react';
import { StyleSheet } from 'react-native';
import { H_PADDING, V_PADDING, GAP } from '.';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { appColors, radius, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Settings</ThemedText>
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
    fontSize: typography.size.x2l,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.relaxed,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: appColors.light.border,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.base,
  },
});
