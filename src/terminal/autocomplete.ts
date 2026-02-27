import { commandHandlers } from "./registry";
import { VNode, Layer } from "./types";
import { getNode, normalizePath } from "./vfs";

export const getCommandNames = () => Object.keys(commandHandlers).sort();

export const pathSuggestions = (root: VNode, cwd: string, partial: string): string[] => {
  const absolute = normalizePath(cwd, partial || ".");
  const base = absolute.endsWith("/") ? absolute : absolute.slice(0, absolute.lastIndexOf("/") + 1);
  const prefix = absolute.split("/").pop() ?? "";
  const node = getNode(root, base || "/");
  if (!node || node.type !== "dir") return [];
  return Object.keys(node.children ?? {})
    .filter((name) => name.startsWith(prefix))
    .map((name) => `${base}${name}`)
    .sort();
};

export const completionReady = (unlocked: Set<Layer>) => unlocked.size >= 4;
