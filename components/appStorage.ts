import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';

export type PersistedPreferences = {
  themePreference: ThemePreference;
};

export const DEFAULT_PREFERENCES: PersistedPreferences = {
  themePreference: 'system',
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

type StorageBackend = 'async-storage' | 'local-storage' | 'memory';

type WebStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  key: (index: number) => string | null;
  length: number;
};

const memoryStorage = new Map<string, string>();

let detectedBackend: StorageBackend | null = null;
let warnedAboutAsyncStorage = false;

const getWebStorage = (): WebStorageLike | null => {
  const candidate = (globalThis as { localStorage?: WebStorageLike }).localStorage;
  if (!candidate) {
    return null;
  }
  return candidate;
};

const probeWebStorage = (): boolean => {
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

const detectStorageBackend = async (): Promise<StorageBackend> => {
  if (detectedBackend) {
    return detectedBackend;
  }

  try {
    await AsyncStorage.getAllKeys();
    detectedBackend = 'async-storage';
    return detectedBackend;
  } catch {
    if (!warnedAboutAsyncStorage) {
      warnedAboutAsyncStorage = true;
      console.warn('[appStorage] AsyncStorage unavailable, using fallback backend.');
    }
  }

  if (probeWebStorage()) {
    detectedBackend = 'local-storage';
    return detectedBackend;
  }

  detectedBackend = 'memory';
  return detectedBackend;
};

const readKey = async (key: string): Promise<string | null> => {
  const backend = await detectStorageBackend();

  if (backend === 'async-storage') {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      const storage = getWebStorage();
      if (storage) {
        try {
          return storage.getItem(key);
        } catch {
          return memoryStorage.get(key) ?? null;
        }
      }
      return memoryStorage.get(key) ?? null;
    }
  }

  if (backend === 'local-storage') {
    const storage = getWebStorage();
    if (!storage) {
      return memoryStorage.get(key) ?? null;
    }
    try {
      return storage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  return memoryStorage.get(key) ?? null;
};

const writeKey = async (key: string, value: string): Promise<void> => {
  const backend = await detectStorageBackend();

  if (backend === 'async-storage') {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch {
      const storage = getWebStorage();
      if (storage) {
        try {
          storage.setItem(key, value);
          return;
        } catch {
          memoryStorage.set(key, value);
          return;
        }
      }
      memoryStorage.set(key, value);
      return;
    }
  }

  if (backend === 'local-storage') {
    const storage = getWebStorage();
    if (!storage) {
      memoryStorage.set(key, value);
      return;
    }
    try {
      storage.setItem(key, value);
      return;
    } catch {
      memoryStorage.set(key, value);
      return;
    }
  }

  memoryStorage.set(key, value);
};

const removeKey = async (key: string): Promise<void> => {
  const backend = await detectStorageBackend();

  if (backend === 'async-storage') {
    try {
      await AsyncStorage.removeItem(key);
      return;
    } catch {
      const storage = getWebStorage();
      if (storage) {
        try {
          storage.removeItem(key);
        } catch {
          memoryStorage.delete(key);
        }
      } else {
        memoryStorage.delete(key);
      }
      return;
    }
  }

  if (backend === 'local-storage') {
    const storage = getWebStorage();
    if (!storage) {
      memoryStorage.delete(key);
      return;
    }
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
  const backend = await detectStorageBackend();

  if (backend === 'async-storage') {
    try {
      return [...(await AsyncStorage.getAllKeys())];
    } catch {
      const storage = getWebStorage();
      if (storage) {
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
    }
  }

  if (backend === 'local-storage') {
    const storage = getWebStorage();
    if (!storage) {
      return Array.from(memoryStorage.keys());
    }

    try {
      const keys: string[] = [];
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
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const getStoredPreferences = async (): Promise<PersistedPreferences> => {
  const raw = await readKey(STORAGE_KEYS.preferences);
  return parsePreferences(raw);
};

export const setStoredPreferences = async (next: PersistedPreferences): Promise<void> => {
  await writeKey(STORAGE_KEYS.preferences, JSON.stringify(next));
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
  } catch (error) {
    console.warn(`[appStorage] Failed to read cache for ${name}`, error);
    return null;
  }
};

export const setCachedJson = async <T>(name: string, value: T): Promise<void> => {
  const key = createCacheKey(name);
  try {
    await writeKey(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[appStorage] Failed to write cache for ${name}`, error);
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
  } catch (error) {
    console.warn('[appStorage] Failed to clear cache namespace', error);
    return 0;
  }
};

export const isStorageAvailable = async (): Promise<boolean> => {
  try {
    const backend = await detectStorageBackend();
    return backend !== 'memory';
  } catch (error) {
    console.warn('[appStorage] Storage APIs are unavailable', error);
    return false;
  }
};
