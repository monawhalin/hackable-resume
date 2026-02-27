"use client";

import { useEffect, useState } from "react";

const lines = ["Initializing GRID…", "Authenticating identity disk…", "Loading modules…"];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= lines.length) {
      const timer = setTimeout(onDone, 450);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCount((v) => v + 1), 700);
    return () => clearTimeout(timer);
  }, [count, onDone]);

  return (
    <div className="neon-border rounded-lg p-6 neon-text max-w-2xl w-full">
      {lines.slice(0, count).map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p>guest@grid:~$ {count >= lines.length ? <span className="cursor" /> : null}</p>
    </div>
  );
}
