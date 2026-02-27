"use client";

import { Preferences, Theme } from "@/terminal/types";

type Props = {
  prefs: Preferences;
  onTheme: (theme: Theme) => void;
  onGlow: (value: number) => void;
  onGridToggle: (enabled: boolean) => void;
  onGridIntensity: (value: number) => void;
  onMatrix: (enabled: boolean) => void;
  onSound: (enabled: boolean) => void;
  onShare: () => void;
  canShare: boolean;
};

export default function SystemMenu({
  prefs,
  onTheme,
  onGlow,
  onGridToggle,
  onGridIntensity,
  onMatrix,
  onSound,
  onShare,
  canShare
}: Props) {
  return (
    <aside className="neon-border rounded-md p-3 text-xs space-y-2 backdrop-blur-sm bg-black/40">
      <div>
        <label>Theme</label>
        <select className="ml-2 bg-black border border-neon" value={prefs.theme} onChange={(e) => onTheme(e.target.value as Theme)}>
          <option value="cyan">cyan</option>
          <option value="magenta">magenta</option>
          <option value="amber">amber</option>
        </select>
      </div>
      <div>Glow <input type="range" min={0} max={100} value={prefs.glow} onChange={(e) => onGlow(Number(e.target.value))} /></div>
      <div>
        Grid <button onClick={() => onGridToggle(!prefs.gridOn)}>{prefs.gridOn ? "on" : "off"}</button>
      </div>
      <div>Grid intensity <input type="range" min={0} max={100} value={prefs.gridIntensity} onChange={(e) => onGridIntensity(Number(e.target.value))} /></div>
      <div>
        Matrix <button onClick={() => onMatrix(!prefs.matrix)}>{prefs.matrix ? "on" : "off"}</button>
      </div>
      <div>
        Sound <button onClick={() => onSound(!prefs.sound)}>{prefs.sound ? "on" : "off"}</button>
      </div>
      <button disabled={!canShare} onClick={onShare} className="border border-neon px-2 py-1 disabled:opacity-40">Share</button>
    </aside>
  );
}
