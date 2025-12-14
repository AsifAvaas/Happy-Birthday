import { useEffect, useRef } from "react";

export default function BackgroundMusic({
  tracks,
  trackIndex,
  isPlaying,
  isMuted,
}) {
  const audioRef = useRef(new Audio());
  const fadeInterval = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    // Cleanup function: Stops music when component unmounts (leaving the page)
    return () => {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fadeInterval.current);
    };
  }, []); // Run once on mount to set up cleanup

  useEffect(() => {
    if (!isPlaying) return;

    const audio = audioRef.current;
    const newTrack = tracks[trackIndex];

    if (!newTrack) return;

    if (audio.src === "" || audio.paused) {
      audio.src = newTrack;
      audio.loop = true;
      audio.volume = isMuted ? 0 : 1;
      audio.play().catch((e) => console.log("Autoplay prevented:", e));
    } else if (!audio.src.includes(newTrack)) {
      fadeOutAndSwitch(audio, newTrack);
    }
  }, [trackIndex, isPlaying]);

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const fadeIn = (audio) => {
    clearInterval(fadeInterval.current);
    audio.volume = 0;
    fadeInterval.current = setInterval(() => {
      if (audio.volume < 0.9) {
        audio.volume = Math.min(1, audio.volume + 0.1);
      } else {
        clearInterval(fadeInterval.current);
      }
    }, 200);
  };

  const fadeOutAndSwitch = (audio, newSrc) => {
    clearInterval(fadeInterval.current);
    fadeInterval.current = setInterval(() => {
      if (audio.volume > 0.1) {
        audio.volume = Math.max(0, audio.volume - 0.1);
      } else {
        clearInterval(fadeInterval.current);
        audio.pause();
        audio.src = newSrc;
        audio.play().catch((e) => console.log("Play error", e));
        fadeIn(audio);
      }
    }, 200);
  };

  return null;
}
