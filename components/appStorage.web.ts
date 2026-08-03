export type ThemePreference = 'system' | 'light' | 'dark';

export type PersistedPreferences = {
  themePreference: ThemePreference;
  onboardingVersion: number;
};

export const CURRENT_ONBOARDING_VERSION = 1;

export const DEFAULT_PREFERENCES: PersistedPreferences = {
  themePreference: 'system',
  onboardingVersion: 0,
};

export const STORAGE_KEYS = {
  preferences: 'prefs:v1',
};

export const STORAGE_PREFIXES = {
  cache: 'cache:v1:',
  identity: 'identity:v1:',
};

export const CACHE_SCOPE_DESCRIPTION =
  'Clears app content cache.This keeps account identity and app preferences.';

type WebStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  key: (index: number) => string | null;
  length: number;
};

const memoryStorage = new Map<string, string>();

const getWebStorage = (): WebStorageLike | null => {
  const candidate = (globalThis as { localStorage?: WebStorageLike }).localStorage;
  if (!candidate) {
    return null;
  }
  return candidate;
};

const canUseWebStorage = (): boolean => {
  const storage = getWebStorage();
  if (!storage) {
    return false;
  }

  const probeKey = '__sphf_probe__';
  try {
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

const readKey = async (key: string): Promise<string | null> => {
  const storage = getWebStorage();
  if (storage && canUseWebStorage()) {
    try {
      return storage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  return memoryStorage.get(key) ?? null;
};

const writeKey = async (key: string, value: string, requireDurable = false): Promise<void> => {
  const storage = getWebStorage();
  if (storage && canUseWebStorage()) {
    try {
      storage.setItem(key, value);
      return;
    } catch {
      if (requireDurable) {
        throw new Error('Durable app storage is unavailable.');
      }
      memoryStorage.set(key, value);
      return;
    }
  }

  if (requireDurable) {
    throw new Error('Durable app storage is unavailable.');
  }
  memoryStorage.set(key, value);
};

const removeKey = async (key: string): Promise<void> => {
  const storage = getWebStorage();
  if (storage && canUseWebStorage()) {
    try {
      storage.removeItem(key);
      return;
    } catch {
      memoryStorage.delete(key);
      return;
    }
  }

  memoryStorage.delete(key);
};

const listKeys = async (): Promise<string[]> => {
  const storage = getWebStorage();
  if (storage && canUseWebStorage()) {
    const keys: string[] = [];
    try {
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch {
      return Array.from(memoryStorage.keys());
    }
  }

  return Array.from(memoryStorage.keys());
};

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

const isOnboardingVersion = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

const parsePreferences = (raw: string | null): PersistedPreferences => {
  if (!raw) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedPreferences>;
    return {
      themePreference: isThemePreference(parsed.themePreference)
        ? parsed.themePreference
        : DEFAULT_PREFERENCES.themePreference,
      onboardingVersion: isOnboardingVersion(parsed.onboardingVersion)
        ? parsed.onboardingVersion
        : DEFAULT_PREFERENCES.onboardingVersion,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const getStoredPreferences = async (): Promise<PersistedPreferences> => {
  const raw = await readKey(STORAGE_KEYS.preferences);
  return parsePreferences(raw);
};

export const setStoredPreferences = async (
  next: PersistedPreferences,
  options?: { requireDurable?: boolean }
): Promise<void> => {
  await writeKey(STORAGE_KEYS.preferences, JSON.stringify(next), options?.requireDurable ?? false);
};

export const createCacheKey = (name: string): string => `${STORAGE_PREFIXES.cache}${name}`;

export const getCachedJson = async <T>(name: string): Promise<T | null> => {
  const key = createCacheKey(name);
  try {
    const raw = await readKey(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setCachedJson = async <T>(name: string, value: T): Promise<void> => {
  const key = createCacheKey(name);
  try {
    await writeKey(key, JSON.stringify(value));
  } catch {
    // Keep app resilient when storage is unavailable.
  }
};

export const clearCacheNamespace = async (): Promise<number> => {
  try {
    const keys = await listKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(STORAGE_PREFIXES.cache));
    if (cacheKeys.length === 0) {
      return 0;
    }

    const results = await Promise.allSettled(cacheKeys.map(async (key) => removeKey(key)));
    return results.filter((result) => result.status === 'fulfilled').length;
  } catch {
    return 0;
  }
};

export const isStorageAvailable = async (): Promise<boolean> => {
  return canUseWebStorage();
};
