import { PersistedState } from "./types";

export const STORAGE_KEY = "tron_resume_state_v1";

export const defaultState: PersistedState = {
  bootShown: false,
  unlockedLayers: [],
  cwd: "/home/guest",
  preferences: {
    theme: "cyan",
    glow: 65,
    gridOn: true,
    gridIntensity: 40,
    matrix: false,
    sound: false
  }
};

export const loadState = (): PersistedState => {
  if (typeof window === "undefined") return defaultState;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return { ...defaultState, ...parsed, preferences: { ...defaultState.preferences, ...parsed?.preferences } };
  } catch {
    return defaultState;
  }
};

export const saveState = (state: PersistedState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
