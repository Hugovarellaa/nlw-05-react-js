/* eslint-disable jsx-a11y/alt-text */
import { usePlayer } from "../../context/usePlayer";
import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useRef, useState } from "react";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    clearPlayState,
    playNext,
    playPrevious,
    setPlayingState,
    toggleShuffling,
    isShuffling,
    hasNext,
    isLooping,
    hasPrevious,
    toggleLop,
  } = usePlayer();

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }
  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayState();
    }
  }

  //play e pause
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{ background: "#04d361" }}
                railStyle={{ background: "#9f57ff" }}
                onChange={handleSeek}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptSlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffling}
            className={isShuffling ? styles.active : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.player}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLop}
            className={isLooping ? styles.active : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
