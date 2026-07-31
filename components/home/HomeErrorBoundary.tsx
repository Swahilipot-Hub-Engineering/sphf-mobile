import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text as ThemedText } from '@/components/Themed';
import { homeColors, homeSpacing } from './theme';

type Props = {
  children: React.ReactNode;
  fallbackLabel: string;
};

type State = {
  hasError: boolean;
};

// Keeps a failure inside one Home section (e.g. a module that can't read its
// live state) from taking down the rest of the Home dashboard.
export default class HomeErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[Home] section failed to render', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <ThemedText style={styles.fallbackText}>{this.props.fallbackLabel}</ThemedText>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    padding: homeSpacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: homeColors.border,
    backgroundColor: homeColors.surface,
  },
  fallbackText: {
    fontSize: 13,
    color: homeColors.error,
  },
});
