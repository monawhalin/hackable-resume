import resume from "@/content/resume.json";

export type ResumeData = typeof resume;

export type Theme = "cyan" | "magenta" | "amber";

export type Layer = "identity" | "skills" | "projects" | "vision";

export type VNode = {
  name: string;
  type: "file" | "dir";
  path: string;
  hidden?: boolean;
  lockedBy?: Layer;
  content?: string;
  children?: Record<string, VNode>;
};

export type AchievementPayload = {
  name: string;
  completionMs: number;
  commands: number;
  timestamp: string;
};

export type TerminalLine = {
  id: string;
  type: "input" | "output" | "system";
  text: string;
  html?: boolean;
};

export type Preferences = {
  theme: Theme;
  glow: number;
  gridOn: boolean;
  gridIntensity: number;
  matrix: boolean;
  sound: boolean;
};

export type PersistedState = {
  bootShown: boolean;
  unlockedLayers: Layer[];
  cwd: string;
  bestTimeMs?: number;
  lastCompletionMs?: number;
  preferences: Preferences;
};
