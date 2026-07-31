import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { Text as ThemedText } from '@/components/Themed';
import { homeColors, homeSpacing } from './theme';

export default function HomeHero() {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@/assets/images/sph-logo.png')}
        style={styles.logo}
        contentFit="contain"
        accessible
        accessibilityLabel="Swahilipot Hub Foundation logo"
      />
      <ThemedText style={styles.title} accessibilityRole="header">
        Welcome to Swahilipot Hub
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Swahilipot Hub Foundation is a community-based organization focused on empowering youth in
        East Africa through technology, arts, and entrepreneurship.
      </ThemedText>
      <ThemedText style={styles.hint}>Pick a module below to get started.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: homeSpacing.sm,
  },
  logo: {
    width: 220,
    height: 44,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: homeColors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: homeColors.muted,
  },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: homeColors.primary,
  },
});
