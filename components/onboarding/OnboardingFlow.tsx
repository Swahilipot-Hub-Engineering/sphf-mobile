import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppPreferences } from '@/components/AppPreferences';
import { ONBOARDING_SLIDES } from '@/components/onboarding/slides';
import { appColors } from '@/theme';

type OnboardingFlowProps = {
  onExit: () => Promise<void>;
};

export default function OnboardingFlow({ onExit }: OnboardingFlowProps) {
  const { colorScheme } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const slide = ONBOARDING_SLIDES[currentIndex];
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;
  const colors = appColors[colorScheme];
  const illustrationBackground =
    colorScheme === 'dark' ? slide.darkBackground : slide.lightBackground;
  const errorColor = colorScheme === 'dark' ? '#ef4444' : '#b91c1c';

  useEffect(() => {
    if (currentIndex > 0) {
      AccessibilityInfo.announceForAccessibility(
        `Step ${currentIndex + 1} of ${ONBOARDING_SLIDES.length}. ${slide.title}`
      );
    }
  }, [currentIndex, slide.title]);

  const finish = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onExit();
    } catch (error) {
      console.warn('[Onboarding] Failed to finish onboarding', error);
      setErrorMessage('Could not save your progress. Please try again.');
      setSubmitting(false);
    }
  };

  const goNext = () => {
    setErrorMessage(null);
    setCurrentIndex((index) => Math.min(index + 1, ONBOARDING_SLIDES.length - 1));
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.container,
          {
            minHeight: Math.max(height, 560),
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Image
            source={require('@/assets/images/sph-logo.png')}
            style={styles.logo}
            contentFit="contain"
            accessible
            accessibilityLabel="Swahilipot Hub Foundation"
          />
          {!isLastSlide ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              accessibilityState={{ disabled: submitting }}
              disabled={submitting}
              hitSlop={8}
              onPress={() => void finish()}
              style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
              <Text style={[styles.skipLabel, { color: colors.textSecondary }]}>Skip</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.content}>
          <View
            style={[styles.illustration, { backgroundColor: illustrationBackground }]}
            accessible
            accessibilityLabel={`${slide.eyebrow} illustration`}>
            <View style={[styles.iconCircle, { backgroundColor: slide.accentColor }]}>
              <FontAwesome name={slide.icon} size={58} color="#ffffff" />
            </View>
          </View>

          <View style={styles.copy}>
            <Text style={[styles.eyebrow, { color: slide.accentColor }]}>{slide.eyebrow}</Text>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
              {slide.title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {slide.description}
            </Text>
            <Text style={[styles.detail, { color: colors.textMuted }]}>{slide.detail}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View
            style={styles.progress}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Onboarding progress, step ${currentIndex + 1} of ${ONBOARDING_SLIDES.length}`}
            accessibilityValue={{
              min: 1,
              max: ONBOARDING_SLIDES.length,
              now: currentIndex + 1,
            }}>
            {ONBOARDING_SLIDES.map((item, index) => (
              <View
                key={item.id}
                accessible={false}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentIndex ? slide.accentColor : colors.border,
                  },
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {errorMessage ? (
            <Text accessibilityRole="alert" style={[styles.errorText, { color: errorColor }]}>
              {errorMessage}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLastSlide ? 'Get started' : 'Next onboarding screen'}
            accessibilityState={{ busy: submitting, disabled: submitting }}
            disabled={submitting}
            onPress={isLastSlide ? () => void finish() : goNext}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: slide.actionColor },
              pressed && styles.pressed,
              submitting && styles.disabled,
            ]}>
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.primaryButtonLabel}>
                  {isLastSlide ? 'Get Started' : 'Next'}
                </Text>
                <FontAwesome name="arrow-right" size={16} color="#ffffff" />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  topBar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  logo: {
    width: 180,
    height: 40,
  },
  skipButton: {
    minWidth: 48,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  illustration: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1.35,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    borderCurve: 'continuous',
  },
  iconCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  footer: {
    gap: 16,
  },
  progress: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.7,
  },
});
