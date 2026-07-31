import { appColors, sphfColors, swahilipotFmColors } from './colors';
import { fmTypography, typography } from './typography';

export const sphfBranding = {
  name: 'Swahilipot Hub Foundation',
  shortName: 'SPHF',
  colors: sphfColors,
  appTheme: appColors,
  typography,
  assets: {
    logoPrimary: '@/assets/logos/sphf/sphf-logo-primary.png',
    appIcon: '@/assets/icons/app-icon.png',
    splash: '@/assets/branding/sphf/splash.png',
  },
} as const;

export const swahilipotFmBranding = {
  name: 'Swahilipot FM',
  shortName: 'FM',
  colors: swahilipotFmColors,
  typography: fmTypography,
  icons: {
    tab: 'podcast',
    play: 'play',
    pause: 'pause',
    stop: 'stop',
    live: 'radio',
  },
  buttons: {
    primary: {
      backgroundColor: swahilipotFmColors.button.primaryBackground,
      textColor: swahilipotFmColors.button.primaryText,
    },
    secondary: {
      backgroundColor: swahilipotFmColors.button.secondaryBackground,
      borderColor: swahilipotFmColors.button.secondaryBorder,
      textColor: swahilipotFmColors.button.secondaryText,
    },
  },
  assets: {
    logoPrimary: '@/assets/logos/swahilipot-fm/fm-logo-placeholder.png',
  },
} as const;
