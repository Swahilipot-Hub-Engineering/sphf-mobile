import { useAppPreferences } from '@/components/AppPreferences';

export function useColorScheme(): 'light' | 'dark' {
  return useAppPreferences().colorScheme;
}
