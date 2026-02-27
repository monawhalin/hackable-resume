"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import resume from "@/content/resume.json";
import { completionReady, getCommandNames, pathSuggestions } from "@/terminal/autocomplete";
import { parseCommand } from "@/terminal/parser";
import { applyUnlock, runCommand } from "@/terminal/registry";
import { loadState, saveState } from "@/terminal/state";
import { AchievementPayload, Layer, PersistedState, TerminalLine } from "@/terminal/types";
import { createInitialVfs, normalizePath } from "@/terminal/vfs";
import OutputRenderer from "./OutputRenderer";

export default function Terminal({ onAchievement }: { onAchievement: (payload: AchievementPayload) => void }) {
  const root = useMemo(() => createInitialVfs(), []);
  const [persisted, setPersisted] = useState<PersistedState>(() => loadState());
  const [lines, setLines] = useState<TerminalLine[]>([{ id: crypto.randomUUID(), type: "system", text: "Type `help` to begin. Recruiter fast path: `resume`." }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [commandsCount, setCommandsCount] = useState(0);
  const [startAt, setStartAt] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    persisted.unlockedLayers.forEach((layer) => applyUnlock(root, new Set<Layer>(), layer));
  }, [persisted.unlockedLayers, root]);

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  const execute = (raw: string) => {
    const parsed = parseCommand(raw);
    if (!parsed.command) return;
    if (!startAt) setStartAt(Date.now());
    setCommandsCount((v) => v + 1);
    const currentUnlocked = new Set<Layer>(persisted.unlockedLayers);
    const result = runCommand(
      {
        root,
        cwd: persisted.cwd,
        unlocked: currentUnlocked,
        matrixOn: persisted.preferences.matrix,
        setCwd: (cwd) => setPersisted((s) => ({ ...s, cwd })),
        unlock: (layer) => {
          applyUnlock(root, currentUnlocked, layer);
          setPersisted((s) => ({ ...s, unlockedLayers: Array.from(new Set([...s.unlockedLayers, layer])) }));
        },
        onClear: () => setLines([]),
        setTheme: (theme) => setPersisted((s) => ({ ...s, preferences: { ...s.preferences, theme } })),
        setGlow: (glow) => setPersisted((s) => ({ ...s, preferences: { ...s.preferences, glow } })),
        setGrid: (gridOn, gridIntensity) => setPersisted((s) => ({ ...s, preferences: { ...s.preferences, gridOn, gridIntensity: gridIntensity ?? s.preferences.gridIntensity } })),
        setMatrix: (matrix) => setPersisted((s) => ({ ...s, preferences: { ...s.preferences, matrix } })),
        markResumeUnlocked: () => {
          const done = Date.now() - (startAt ?? Date.now());
          const payload: AchievementPayload = { name: resume.basics.name, completionMs: done, commands: commandsCount + 1, timestamp: new Date().toISOString() };
          setPersisted((s) => ({ ...s, unlockedLayers: ["identity", "skills", "projects", "vision"], bestTimeMs: Math.min(s.bestTimeMs ?? done, done), lastCompletionMs: done }));
          onAchievement(payload);
        }
      },
      parsed.command,
      parsed.args
    );

    if (parsed.command === "download") window.open("/Monalisa_Whalin_CV_PLACEHOLDER.txt", "_blank", "noopener");
    if (parsed.command === "print") window.location.href = "/print";

    setHistory((h) => [...h, raw]);
    setHIndex(-1);
    setLines((l) => [...l, { id: crypto.randomUUID(), type: "input", text: `guest@grid:${persisted.cwd.replace("/home/guest", "~")}$ ${raw}` }, ...result]);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") return void (execute(input), setInput(""));
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(history.length - 1, hIndex + 1);
      setHIndex(next);
      setInput(history[history.length - 1 - next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(-1, hIndex - 1);
      setHIndex(next);
      setInput(next === -1 ? "" : history[history.length - 1 - next] ?? "");
      return;
    }
    if (e.key !== "Tab") return;
    e.preventDefault();
    const parsed = parseCommand(input);
    if (!parsed.command) return;
    if (parsed.args.length === 0 && !input.endsWith(" ")) {
      const match = getCommandNames().find((name) => name.startsWith(parsed.command));
      if (match) setInput(`${match} `);
      return;
    }
    const arg = parsed.args[parsed.args.length - 1] ?? "";
    const suggestions = pathSuggestions(root, persisted.cwd, arg);
    if (suggestions[0]) {
      const base = input.slice(0, input.lastIndexOf(arg));
      setInput(`${base}${suggestions[0].replace("/home/guest", "~")} `);
    }
  };

  useEffect(() => {
    const style = document.documentElement.style;
    const themeMap = {
      cyan: { neon: "#39d0ff", neon2: "#6ef2ff", fg: "#d9f7ff", grid: "rgba(57,208,255,0.22)" },
      magenta: { neon: "#ff42d0", neon2: "#ff8af2", fg: "#ffe4fa", grid: "rgba(255,66,208,0.22)" },
      amber: { neon: "#ffbf47", neon2: "#ffe58e", fg: "#fff3d0", grid: "rgba(255,191,71,0.24)" }
    } as const;
    const theme = themeMap[persisted.preferences.theme];
    style.setProperty("--neon", theme.neon);
    style.setProperty("--neon2", theme.neon2);
    style.setProperty("--fg", theme.fg);
    style.setProperty("--grid", theme.grid);
    style.setProperty("--glow", `${persisted.preferences.glow}`);
    style.setProperty("--grid-intensity", `${persisted.preferences.gridIntensity}`);
  }, [persisted.preferences]);

  return (
    <div className="neon-border w-full max-w-5xl rounded-lg bg-black/50 p-4 backdrop-blur-sm md:p-6" onClick={() => inputRef.current?.focus()}>
      <div className="mb-2 text-neon2">guest@grid:{normalizePath("/home/guest", persisted.cwd).replace("/home/guest", "~")}$</div>
      <div className="h-[58vh] space-y-2 overflow-y-auto pr-2 md:h-[64vh]">
        {lines.map((line) => (
          <div key={line.id} className={line.type === "input" ? "text-neon" : "text-fg"}>
            <OutputRenderer line={line} />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent pt-3">
        <span>guest@grid:{persisted.cwd.replace("/home/guest", "~")}$</span>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} className="flex-1 bg-transparent outline-none" autoCapitalize="off" autoComplete="off" autoCorrect="off" />
        <span className="cursor" />
      </div>
      {!completionReady(new Set<Layer>(persisted.unlockedLayers)) && <p className="mt-2 text-xs opacity-80">Need a hint? Run <code>hint</code>. Need speed? Run <code>resume</code>.</p>}
      <div className="mt-3 text-xs opacity-70">
        <Link href="/print">Printable resume</Link> · <a href="/api/resume" target="_blank" rel="noopener">JSON API</a>
      </div>
    </div>
  );
}
