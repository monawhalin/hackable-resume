"use client";

import { AchievementPayload } from "@/terminal/types";
import { encodeAchievement } from "@/terminal/share";

type Props = { payload: AchievementPayload; onClose?: () => void };

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function AchievementOverlay({ payload, onClose }: Props) {
  const shareToken = encodeAchievement(payload);
  const shareUrl = typeof window === "undefined" ? "" : `${window.location.origin}/?ach=${shareToken}`;
  const shareText = `GRID ACCESS GRANTED | ${payload.name} | ${fmt(payload.completionMs)} | ${payload.commands} cmds`;

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
      <div className="neon-border neon-text rounded-lg p-6 max-w-lg w-full bg-[#040915] text-center space-y-3">
        <h2 className="text-2xl font-bold">GRID ACCESS GRANTED</h2>
        <p>You breached MONA_SYS</p>
        <p>Completion time: {fmt(payload.completionMs)}</p>
        <p>Commands used: {payload.commands}</p>
        <p>Date: {new Date(payload.timestamp).toLocaleString()}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="border border-neon px-3 py-1" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy Share Link</button>
          <button className="border border-neon px-3 py-1" onClick={() => navigator.clipboard.writeText(shareText)}>Copy Result</button>
          <a className="border border-neon px-3 py-1" href={`https://x.com/intent/post?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener">Share on X</a>
          <a className="border border-neon px-3 py-1" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener">Share on LinkedIn</a>
        </div>
        {onClose && <button onClick={onClose} className="underline">Close</button>}
      </div>
    </div>
  );
}
