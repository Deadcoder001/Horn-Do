"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PlayerContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  isPlaying: false,
  setIsPlaying: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlayerContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
