import resume from "@/content/resume.json";
import { getNode, listDir, normalizePath, unlockLayer } from "./vfs";
import { Layer, TerminalLine, VNode } from "./types";

export type TerminalContext = {
  root: VNode;
  cwd: string;
  unlocked: Set<Layer>;
  matrixOn: boolean;
  setCwd: (cwd: string) => void;
  unlock: (layer: Layer) => void;
  onClear: () => void;
  setTheme: (t: "cyan" | "magenta" | "amber") => void;
  setGlow: (n: number) => void;
  setGrid: (on: boolean, intensity?: number) => void;
  setMatrix: (on: boolean) => void;
  markResumeUnlocked: () => void;
  resumeUnlocked: boolean;
};

export type CommandHandler = (ctx: TerminalContext, args: string[]) => TerminalLine[];

const text = (t: string): TerminalLine => ({ id: crypto.randomUUID(), type: "output", text: t });
const lockedMsg = "Access denied: module locked. Run scan/hint for guidance.";

export const commandHandlers: Record<string, CommandHandler> = {
  help: () => [text("Commands: help, clear, scan, hint, connect <target>, decrypt <module>, unlock <target>, ls [path] [-a], cd <dir>, pwd, cat <file>, open <file|dir>, projects, experience, skills, timeline, contact, download, print, theme [cyan|magenta|amber], glow [0-100], grid [on|off|0-100], matrix, fortune, coffee, resume")],
  hint: () => [text("Fast path: run `resume`. Puzzle path: connect mona -> decrypt skills -> decrypt projects -> unlock future")],
  clear: (ctx) => (ctx.onClear(), []),
  scan: () => [text("SCAN RESULT: identity.lock, skills.enc, projects/*.md, .future/vision.md are protected")],
  connect: (ctx, args) => (args[0]?.toLowerCase() === "mona" ? (ctx.unlock("identity"), [text("Identity disk handshake complete. identity.txt unlocked.")]) : [text("Unknown target.")]),
  decrypt: (ctx, args) => {
    const target = (args[0] ?? "").toLowerCase();
    if (target === "skills") {
      ctx.unlock("skills");
      return [text("skills.enc decrypted. skills.txt materialized.")];
    }
    if (target === "projects") {
      ctx.unlock("projects");
      return [text("Project vault decrypted. /projects/*.md unlocked.")];
    }
    return [text("Decrypt failed.")];
  },
  unlock: (ctx, args) => ((args[0] ?? "").toLowerCase() === "future" ? (ctx.unlock("vision"), [text("Future module unlocked: .future/vision.md")]) : [text("Unlock failed.")]),
  ls: (ctx, args) => {
    const showAll = args.includes("-a");
    const pathArg = args.find((a) => a !== "-a");
    return [text(listDir(ctx.root, ctx.cwd, pathArg, showAll).join("  "))];
  },
  cd: (ctx, args) => {
    const node = getNode(ctx.root, normalizePath(ctx.cwd, args[0]));
    if (!node || node.type !== "dir") return [text("cd: directory not found")];
    ctx.setCwd(node.path);
    return [text(`cwd => ${node.path}`)];
  },
  pwd: (ctx) => [text(ctx.cwd)],
  cat: (ctx, args) => {
    const node = getNode(ctx.root, normalizePath(ctx.cwd, args[0]));
    if (!node || node.type !== "file") return [text("cat: file not found")];
    if (node.lockedBy) return [text(lockedMsg)];
    return [text(node.content ?? "")];
  },
  open: (ctx, args) => {
    const node = getNode(ctx.root, normalizePath(ctx.cwd, args[0]));
    if (!node) return [text("open: target not found")];
    if (node.lockedBy) return [text(lockedMsg)];
    if (node.type === "dir") return [text(`Directory ${node.path}\n${Object.keys(node.children ?? {}).join("\n")}`)];
    return [{ id: crypto.randomUUID(), type: "output", html: true, text: `<article><h3>${node.name}</h3><pre>${(node.content ?? "").replace(/</g, "&lt;")}</pre></article>` }];
  },
  projects: (ctx) => commandHandlers.open(ctx, ["/home/guest/projects"]),
  experience: () => [text(resume.experience.map((e) => `${e.role} @ ${e.company} (${e.dates})`).join("\n"))],
  skills: (ctx) => (ctx.unlocked.has("skills") ? [text(Object.entries(resume.skills).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n"))] : [text(lockedMsg)]),
  timeline: () => [text(resume.experience.map((e) => `${e.dates}: ${e.role}`).join("\n"))],
  contact: () => [{ id: crypto.randomUUID(), type: "output", html: true, text: `Email: <a href="mailto:${resume.contact.email}">${resume.contact.email}</a><br/>LinkedIn: <a target="_blank" rel="noopener" href="${resume.contact.socials.linkedin}">${resume.contact.socials.linkedin}</a><br/>GitHub: <a target="_blank" rel="noopener" href="${resume.contact.socials.github}">${resume.contact.socials.github}</a>` }],
  download: () => [text("Download triggered: /Monalisa_Whalin_CV_PLACEHOLDER.txt")],
  print: () => [text("Navigate to /print")],
  theme: (ctx, args) => {
    const v = (args[0] ?? "") as "cyan" | "magenta" | "amber";
    if (!["cyan", "magenta", "amber"].includes(v)) return [text("theme: choose cyan|magenta|amber")];
    ctx.setTheme(v);
    return [text(`Theme switched to ${v}`)];
  },
  glow: (ctx, args) => {
    const n = Number(args[0]);
    if (Number.isNaN(n) || n < 0 || n > 100) return [text("glow 0-100")];
    ctx.setGlow(n);
    return [text(`Glow=${n}`)];
  },
  grid: (ctx, args) => {
    if (args[0] === "on") return (ctx.setGrid(true), [text("Grid enabled")]);
    if (args[0] === "off") return (ctx.setGrid(false), [text("Grid disabled")]);
    const n = Number(args[0]);
    if (Number.isNaN(n) || n < 0 || n > 100) return [text("grid on|off|0-100")];
    ctx.setGrid(true, n);
    return [text(`Grid intensity=${n}`)];
  },
  matrix: (ctx) => (ctx.setMatrix(!ctx.matrixOn), [text(`Matrix ${!ctx.matrixOn ? "enabled" : "disabled"}`)]),
  fortune: () => [text(["The best product strategy is clarity under pressure.", "Ship learning, not assumptions.", "Culture is the operating system of execution."][Math.floor(Math.random() * 3)])],
  coffee: () => [text("  ( (\n   ) )\n........\n|      |]\n\\      /\n `----'")],
  sudo: (_ctx, args) => [text(args.join(" ").toLowerCase() === "hire mona" ? "Permission granted. Welcome to the team." : "sudo: command denied")],
  resume: (ctx) => {
    ["identity", "skills", "projects", "vision"].forEach((layer) => ctx.unlock(layer as Layer));
    return [text("Full resume unlocked. Run experience, projects, skills, timeline, contact.")];
  }
};

export const runCommand = (ctx: TerminalContext, command: string, args: string[]): TerminalLine[] => {
  const handler = commandHandlers[command.toLowerCase()];
  if (!handler) return [text(`Unknown command: ${command}. Try help`)];
  const wasComplete = ctx.resumeUnlocked || ctx.unlocked.size >= 4;
  const lines = handler(ctx, args);
  const isComplete = ctx.unlocked.size >= 4;
  if (!wasComplete && isComplete) ctx.markResumeUnlocked();
  return lines;
};

export const applyUnlock = (root: VNode, unlocked: Set<Layer>, layer: Layer): Set<Layer> => {
  unlockLayer(root, layer);
  unlocked.add(layer);
  return new Set(unlocked);
};
