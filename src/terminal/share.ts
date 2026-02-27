import { AchievementPayload } from "./types";

const checksum = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash + value.charCodeAt(i) * (i + 1)) % 1000003;
  return hash.toString(36);
};

const encodeBase64Url = (value: string): string => {
  const base = btoa(unescape(encodeURIComponent(value)));
  return base.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
};

export const encodeAchievement = (payload: AchievementPayload): string => {
  const encoded = encodeBase64Url(JSON.stringify(payload));
  return `${encoded}.${checksum(encoded)}`;
};

export const decodeAchievement = (input: string): AchievementPayload | null => {
  const [encoded, sig] = input.split(".");
  if (!encoded || !sig || checksum(encoded) !== sig) return null;
  try {
    return JSON.parse(decodeBase64Url(encoded)) as AchievementPayload;
  } catch {
    return null;
  }
};
