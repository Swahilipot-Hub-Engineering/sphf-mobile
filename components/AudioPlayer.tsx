import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type AudioStatus,
  setAudioModeAsync,
  useAudioPlayer as useExpoAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { Platform } from 'react-native';

type StreamTrack = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  artwork?: string;
};

class StreamValidationError extends Error {}

type PlayerContextValue = {
  currentTrack: StreamTrack | null;
  status: AudioStatus | null;
  isLoading: boolean;
  isPlaying: boolean;
  playbackError: string | null;
  play: (track?: StreamTrack) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlayback: (track?: StreamTrack) => Promise<void>;
};

export const FM_STREAM: StreamTrack = {
  id: 'swahilipot-fm',
  title: 'Swahilipot FM',
  subtitle: 'Live coastal stories, music, and culture.',
  description: '24/7 stream direct from Swahilipot FM studios.',
  url: 'https://swahilipotfm.out.airtime.pro/swahilipotfm_a',
};

const noop = async () => {};

const defaultPlayerContext: PlayerContextValue = {
  currentTrack: null,
  status: null,
  isLoading: false,
  isPlaying: false,
  playbackError: null,
  play: noop,
  pause: noop,
  stop: noop,
  togglePlayback: noop,
};

const AudioPlayerContext = createContext<PlayerContextValue>(defaultPlayerContext);

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioConfiguredRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState<StreamTrack | null>(null);
  const [isAttemptingPlayback, setIsAttemptingPlayback] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const player = useExpoAudioPlayer(null, { updateInterval: 1000, keepAudioSessionActive: true });
  const status = useAudioPlayerStatus(player);
  // Derived rather than synced via effect: loading is "true" only while a
  // play() attempt is in flight and neither resolved (isLoaded) nor failed.
  const isLoading = isAttemptingPlayback && !status?.isLoaded && !playbackError;

  const resolveSafeStreamUrl = useCallback((url: string) => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new StreamValidationError('Stream URL is invalid.');
    }
    if (parsedUrl.protocol !== 'https:') {
      throw new StreamValidationError('Stream URL protocol must be HTTPS.');
    }
    parsedUrl.searchParams.delete('_ga');
    return parsedUrl.toString();
  }, []);

  const ensureAudioMode = useCallback(async () => {
    if (Platform.OS === 'web' || audioConfiguredRef.current) {
      return;
    }
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        interruptionMode: 'mixWithOthers',
        interruptionModeAndroid: 'doNotMix',
        shouldPlayInBackground: true,
        shouldRouteThroughEarpiece: false,
      });
      audioConfiguredRef.current = true;
    } catch (error) {
      console.warn('[AudioPlayer] Unable to configure audio mode', error);
    }
  }, []);

  useEffect(() => {
    void ensureAudioMode();
  }, [ensureAudioMode]);

  const play = useCallback(
    async (track?: StreamTrack) => {
      const targetTrack = track ?? currentTrack ?? FM_STREAM;
      setCurrentTrack(targetTrack);
      setIsAttemptingPlayback(true);
      setPlaybackError(null);
      try {
        await ensureAudioMode();
        const needsSource = currentTrack?.id !== targetTrack.id || !status?.isLoaded;
        if (needsSource) {
          player.replace({ uri: resolveSafeStreamUrl(targetTrack.url) });
        }
        if (!status?.playing) {
          player.play();
        }
      } catch (error) {
        console.warn('Failed to start Swahilipot FM stream', error);
        setIsAttemptingPlayback(false);
        setPlaybackError(
          error instanceof StreamValidationError
            ? 'Stream configuration is invalid. Please try again later.'
            : 'Stream connection failed. Please try again in a moment.'
        );
      }
    },
    [currentTrack, ensureAudioMode, player, resolveSafeStreamUrl, status]
  );

  const pause = useCallback(async () => {
    player.pause();
  }, [player]);

  const stop = useCallback(async () => {
    try {
      player.pause();
      await player.seekTo(0);
    } catch (error) {
      console.warn('Unable to reset stream progress', error);
    }
    // Note: player.replace(null) is intentionally avoided — the iOS native
    // module cannot cast null to AudioSource and throws. Clearing
    // currentTrack makes the next play() reload the stream source instead.
    setCurrentTrack(null);
    setIsAttemptingPlayback(false);
    setPlaybackError(null);
  }, [player]);

  const togglePlayback = useCallback(
    async (track?: StreamTrack) => {
      if (status?.playing) {
        await pause();
      } else {
        await play(track);
      }
    },
    [pause, play, status?.playing]
  );

  const contextValue = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      status,
      isLoading,
      isPlaying: !!status?.playing,
      playbackError,
      play,
      pause,
      stop,
      togglePlayback,
    }),
    [currentTrack, status, isLoading, playbackError, play, pause, stop, togglePlayback]
  );

  return <AudioPlayerContext.Provider value={contextValue}>{children}</AudioPlayerContext.Provider>;
}

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === defaultPlayerContext) {
    throw new Error('useAudioPlayer must be used inside PlayerProvider');
  }
  return context;
};
