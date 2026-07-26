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

type PlayerContextValue = {
  currentTrack: StreamTrack | null;
  status: AudioStatus | null;
  isLoading: boolean;
  isPlaying: boolean;
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
  url: 'https://swahilipotfm.out.airtime.pro/swahilipotfm_a?_ga=2.140975346.1118176404.1720613685-1678527295.1702105127',
};

const noop = async () => {};

const defaultPlayerContext: PlayerContextValue = {
  currentTrack: null,
  status: null,
  isLoading: false,
  isPlaying: false,
  play: noop,
  pause: noop,
  stop: noop,
  togglePlayback: noop,
};

const AudioPlayerContext = createContext<PlayerContextValue>(defaultPlayerContext);

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioConfiguredRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState<StreamTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const player = useExpoAudioPlayer(null, { updateInterval: 1000, keepAudioSessionActive: true });
  const status = useAudioPlayerStatus(player);

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

  useEffect(() => {
    if (status?.isLoaded) {
      setIsLoading(false);
    }
  }, [status?.isLoaded]);

  const play = useCallback(
    async (track?: StreamTrack) => {
      const targetTrack = track ?? currentTrack ?? FM_STREAM;
      setCurrentTrack(targetTrack);
      setIsLoading(true);
      try {
        await ensureAudioMode();
        const needsSource = currentTrack?.id !== targetTrack.id || !status?.isLoaded;
        if (needsSource) {
          player.replace({ uri: targetTrack.url });
        }
        if (!status?.playing) {
          player.play();
        }
      } catch (error) {
        console.warn('Failed to start Swahilipot FM stream', error);
      }
    },
    [currentTrack, ensureAudioMode, player, status?.isLoaded, status?.playing],
  );

  const pause = useCallback(async () => {
    player.pause();
  }, [player]);

  const stop = useCallback(async () => {
    player.pause();
    try {
      await player.seekTo(0);
    } catch (error) {
      console.warn('Unable to reset stream progress', error);
    }
    player.replace(null);
    setCurrentTrack(null);
    setIsLoading(false);
  }, [player]);

  const togglePlayback = useCallback(
    async (track?: StreamTrack) => {
      if (status?.playing) {
        await pause();
      } else {
        await play(track);
      }
    },
    [pause, play, status?.playing],
  );

  const contextValue = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      status,
      isLoading,
      isPlaying: !!status?.playing,
      play,
      pause,
      stop,
      togglePlayback,
    }),
    [currentTrack, status, isLoading, play, pause, stop, togglePlayback],
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
  
