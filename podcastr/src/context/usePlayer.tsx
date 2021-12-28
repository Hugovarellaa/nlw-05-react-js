import { createContext, ReactNode, useContext, useState } from "react";

interface PlayerProviderProps {
  children: ReactNode;
}

type Episode = {
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  togglePlay: () => void;
  playPrevious: () => void;
  toggleShuffling: () => void;
  playNext: () => void;
  toggleLop: () => void;
  clearPlayState: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  play: (episode: Episode) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PayerProvider({ children }: PlayerProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffling() {
    setIsShuffling(!isShuffling);
  }
  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function clearPlayState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodieList = Math.floor(
        Math.random() * episodeList.length
      );
      setCurrentEpisodeIndex(nextRandomEpisodieList);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        playList,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        toggleLop,
        isLooping,
        toggleShuffling,
        clearPlayState,
        isShuffling,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  return context;
}
