import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { H_PADDING, V_PADDING, GAP } from '.';

export default function SettingsScreen(){
    return(
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PADDING,   
    paddingVertical: V_PADDING,
    rowGap: GAP,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
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
