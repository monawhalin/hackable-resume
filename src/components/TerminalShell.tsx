"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AchievementOverlay from "./AchievementOverlay";
import BootSequence from "./BootSequence";
import GridBackground from "./GridBackground";
import SystemMenu from "./SystemMenu";
import Terminal from "./Terminal";
import { loadState, saveState } from "@/terminal/state";
import { AchievementPayload, PersistedState, Preferences } from "@/terminal/types";
import { decodeAchievement } from "@/terminal/share";

export default function TerminalShell() {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const [achievement, setAchievement] = useState<AchievementPayload | null>(null);
  const searchParams = useSearchParams();
  const sharedAchievement = useMemo(() => {
    const ach = searchParams.get("ach");
    return ach ? decodeAchievement(ach) : null;
  }, [searchParams]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = (patch: Partial<PersistedState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const updatePrefs = (prefs: Partial<Preferences>) => {
    update({ preferences: { ...state.preferences, ...prefs } });
  };

  if (!state.bootShown && !sharedAchievement) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <GridBackground enabled={state.preferences.gridOn} intensity={state.preferences.gridIntensity} matrix={state.preferences.matrix} />
        <BootSequence onDone={() => update({ bootShown: true })} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <GridBackground enabled={state.preferences.gridOn} intensity={state.preferences.gridIntensity} matrix={state.preferences.matrix} />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-3 flex justify-end">
          <SystemMenu
            prefs={state.preferences}
            onTheme={(theme) => updatePrefs({ theme })}
            onGlow={(glow) => updatePrefs({ glow })}
            onGridToggle={(gridOn) => updatePrefs({ gridOn })}
            onGridIntensity={(gridIntensity) => updatePrefs({ gridIntensity })}
            onMatrix={(matrix) => updatePrefs({ matrix })}
            onSound={(sound) => updatePrefs({ sound })}
            canShare={Boolean(state.lastCompletionMs || sharedAchievement || achievement)}
            onShare={() => setAchievement(achievement ?? sharedAchievement)}
          />
        </div>
        <Terminal
          state={state}
          setState={setState}
          onAchievement={(payload) => {
            setAchievement(payload);
            update({ lastCompletionMs: payload.completionMs, unlockedLayers: ["identity", "skills", "projects", "vision"] });
          }}
        />
      </div>
      {(achievement || sharedAchievement) && (
        <AchievementOverlay payload={(achievement || sharedAchievement)!} onClose={sharedAchievement ? undefined : () => setAchievement(null)} />
      )}
    </main>
  );
}
