import { Platform } from 'react-native';

export const shadows = {
  soft:
    Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
      default: {
        elevation: 2,
      },
    }) ?? {},
} as const;
