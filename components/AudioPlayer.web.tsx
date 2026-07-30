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
  status: null;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<StreamTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensureAudio = useCallback((track: StreamTrack): HTMLAudioElement => {
    const audio = audioRef.current ?? new Audio();
    audio.preload = 'none';
    if (audio.src !== track.url) {
      audio.src = track.url;
    }
    audioRef.current = audio;
    return audio;
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.warn('[AudioPlayer.web] Failed to play audio stream.');
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(
    async (track?: StreamTrack) => {
      const targetTrack = track ?? currentTrack ?? FM_STREAM;
      setCurrentTrack(targetTrack);
      setIsLoading(true);
      const audio = ensureAudio(targetTrack);
      try {
        await audio.play();
      } catch (error) {
        setIsLoading(false);
        setIsPlaying(false);
        console.warn('[AudioPlayer.web] Browser blocked playback or stream failed.', error);
      }
    },
    [currentTrack, ensureAudio]
  );

  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const stop = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTrack(null);
  }, []);

  const togglePlayback = useCallback(
    async (track?: StreamTrack) => {
      if (isPlaying) {
        await pause();
        return;
      }
      await play(track);
    },
    [isPlaying, pause, play]
  );

  const contextValue = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      status: null,
      isLoading,
      isPlaying,
      play,
      pause,
      stop,
      togglePlayback,
    }),
    [currentTrack, isLoading, isPlaying, play, pause, stop, togglePlayback]
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
