import FontAwesome from '@expo/vector-icons/FontAwesome';
import type React from 'react';

import { sphfColors, swahilipotFmColors } from '@/theme';

export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  accentColor: string;
  actionColor: string;
  lightBackground: string;
  darkBackground: string;
};

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: 'welcome',
    eyebrow: 'Everything Swahilipot',
    title: 'Your community, in one place',
    description:
      'Discover opportunities, stories, events, and live radio from the Swahilipot ecosystem.',
    detail: 'Stay connected to the people and programs shaping East Africa.',
    icon: 'compass',
    accentColor: sphfColors.primary[700],
    actionColor: sphfColors.primary[700],
    lightBackground: sphfColors.primary[50],
    darkBackground: sphfColors.primary[900],
  },
  {
    id: 'foundation',
    eyebrow: 'Swahilipot Hub Foundation',
    title: 'Grow skills and ideas',
    description:
      'Explore programs that empower young people through technology, arts, and entrepreneurship.',
    detail: 'Find pathways to learn, create, collaborate, and build your future.',
    icon: 'building',
    accentColor: sphfColors.secondary[600],
    actionColor: sphfColors.secondary[700],
    lightBackground: sphfColors.secondary[50],
    darkBackground: sphfColors.secondary[900],
  },
  {
    id: 'fm',
    eyebrow: 'Swahilipot FM',
    title: 'Hear the coast live',
    description: 'Tune in to community voices, culture, music, and conversations wherever you are.',
    detail: 'Keep listening with the mini player while you explore the rest of the app.',
    icon: 'podcast',
    accentColor: swahilipotFmColors.primary[600],
    actionColor: swahilipotFmColors.primary[700],
    lightBackground: swahilipotFmColors.primary[50],
    darkBackground: swahilipotFmColors.primary[900],
  },
  {
    id: 'events',
    eyebrow: 'Events and opportunities',
    title: 'Never miss what is next',
    description:
      'See upcoming workshops, meetups, performances, and community experiences in one calendar.',
    detail: 'Open an event for the details you need to plan your next visit.',
    icon: 'calendar',
    accentColor: sphfColors.accent[600],
    actionColor: sphfColors.accent[700],
    lightBackground: sphfColors.accent[50],
    darkBackground: sphfColors.accent[900],
  },
];
