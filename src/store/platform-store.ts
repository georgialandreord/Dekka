import { create } from "zustand";
import type { PLATFORM } from "~/server/lib/file-system-client";

interface PlatformStore {
  isFetching: boolean;
  currentPlatform: PLATFORM | null;
  setFetching: (isFetching: boolean) => void;
  setCurrentPlatform: (platform: PLATFORM | null) => void;
  startPlatformSwitch: (platform: PLATFORM) => void;
  endPlatformSwitch: () => void;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
  isFetching: false,
  currentPlatform: null,

  setFetching: (isFetching) => set({ isFetching }),

  setCurrentPlatform: (platform) => set({ currentPlatform: platform }),

  startPlatformSwitch: (platform) =>
    set({
      isFetching: true,
      currentPlatform: platform,
    }),

  endPlatformSwitch: () =>
    set({
      isFetching: false,
    }),
}));
