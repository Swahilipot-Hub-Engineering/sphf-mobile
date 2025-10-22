import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Modal, Text, View } from 'react-native';

// A tiny reusable Loader component that uses a spinning PIW favicon image.
// Usage:
//   <Loader visible={isLoading} message="Loading..." />
// - visible: show/hide the loader
// - message: optional text below the spinner
// - fullscreen: if true (default) renders as a centered overlay Modal
//               if false, renders inline (no overlay), useful inside lists/cards
export type LoaderProps = {
  visible: boolean;
  message?: string;
  fullscreen?: boolean;
  size?: 'small' | 'large';
  color?: string; // kept for backward compatibility (no effect on image color)
};

export const Loader = ({ visible, message, fullscreen = true, size = 'large' }: LoaderProps) => {
  // Mapping RN ActivityIndicator sizes to pixel dimensions for the image
  const dim = size === 'small' ? 40 : 64;

  // Rotation animation setup
  const rotate = useRef(new Animated.Value(0)).current;
  const spin = useMemo(
    () =>
      rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotate]
  );

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    if (visible) {
      rotate.setValue(0);
      loop = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
    }
    return () => {
      if (loop) loop.stop();
      rotate.stopAnimation();
    };
  }, [visible, rotate]);

  const ImageSpinner = (
    <Animated.Image
      source={require('../assets/piw_favicon.png')}
      style={{ width: dim, height: dim, transform: [{ rotate: spin }] }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );

  if (!visible && !fullscreen) return null;

  if (!fullscreen) {
    return (
      <View className="items-center justify-center py-6">
        {ImageSpinner}
        {message ? <Text className="mt-2 text-gray-600 text-sm">{message}</Text> : null}
      </View>
    );
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/25">
        <View className="items-center justify-center rounded-xl bg-white px-6 py-5 shadow-lg">
          {ImageSpinner}
          {message ? <Text className="mt-3 text-gray-700">{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
