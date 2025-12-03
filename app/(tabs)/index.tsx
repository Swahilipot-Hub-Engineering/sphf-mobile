import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

export const H_PADDING = 16;
export const V_PADDING = 70;
export const GAP = 12;

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const columns = useMemo(() => {
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    if (width >= 700) return 3;
    if (width >= 520) return 2;
    return 1;
  }, [width]);

  const cardWidth = useMemo(() => {
    const totalGaps = GAP * (columns - 1);
    return (width - H_PADDING * 2 - totalGaps) / columns;
  }, [columns, width]);

  return (
    <ThemedView style={styles.page}>
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topBar}>
              <Image source={require('@/assets/images/sph-logo.png')} style={styles.logo} />
            </View>
            <ThemedText style={styles.title}>Choose where to go</ThemedText>
            <ThemedText style={styles.subtitle}>
              Pick a module to jump into. You can always return here 
              from the Home tab.
            </ThemedText>
            <View style={styles.infoCard}>
              <ThemedText style={styles.infoTitle}>Key information</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Website</ThemedText>
                <ThemedText style={styles.infoValue}>https://swahilipot.org</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Contact email</ThemedText>
                <ThemedText style={styles.infoValue}>info@swahilipot.org</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Customer care</ThemedText>
                <ThemedText style={styles.infoValue}>+254 700 000 000</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Location</ThemedText>
                <ThemedText style={styles.infoValue}>Mombasa, Kenya</ThemedText>
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        showsVerticalScrollIndicator={false}
      />
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
    rowGap: GAP,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 300,
    height: 50,
    borderRadius: 8,
  },
  infoCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  overline: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  item: {
    flexGrow: 1,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
