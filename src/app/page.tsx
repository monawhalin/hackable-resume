import { Suspense } from "react";
import TerminalShell from "@/components/TerminalShell";

export default function HomePage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center">Loading terminal…</main>}>
      <TerminalShell />
    </Suspense>
  );
}
