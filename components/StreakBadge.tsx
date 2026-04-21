"use client";

import { useEffect, useState } from "react";
import { recordOpen, streakLabel, type StreakState } from "@/lib/streak";

/**
 * Badge streak affiché en haut de la home. À chaque ouverture :
 *  - incrémente ou reset le streak (lib/streak.ts)
 *  - affiche un compteur avec flamme (à partir de 3 jours)
 *  - célèbre discrètement un nouveau jalon (3, 7, 30, 100)
 *
 * Jamais de guilt-trip : si le streak casse, on affiche un message
 * bienveillant ("on reprend") plutôt qu'une punition.
 *
 * Client-only : pas de rendu SSR (évite flash inéquation), apparaît après
 * le premier paint dans un slot avec hauteur stable pour ne pas décaler.
 */
export default function StreakBadge() {
  const [state, setState] = useState<StreakState | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [broken, setBroken] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const res = recordOpen();
    setState(res.state);
    setMilestone(res.milestoneReached);
    setBroken(res.broken);
  }, []);

  if (!state) {
    // Slot stable pendant le chargement pour ne pas push le contenu.
    return <div className="h-10" />;
  }

  if (state.current <= 0) return <div className="h-10" />;

  const showFlame = state.current >= 3;
  const label = streakLabel(state.current);

  return (
    <div className="h-10 flex items-center justify-center">
      {milestone && !dismissed ? (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="inline-flex items-center gap-2 bg-gold text-ink px-4 py-2 rounded-full shadow-lg animate-fade-up"
          aria-label="Jalon atteint"
        >
          <span className="text-base leading-none">🎉</span>
          <span className="text-[11px] uppercase tracking-widest font-black">
            {milestone} jours · {label}
          </span>
          <span className="text-ink/60 text-xs font-bold">×</span>
        </button>
      ) : broken && !dismissed ? (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="inline-flex items-center gap-2 bg-paper/80 backdrop-blur-md border border-ink/15 px-4 py-2 rounded-full"
          aria-label="Nouveau cycle"
        >
          <span className="text-[11px] uppercase tracking-widest font-bold text-ink/70">
            On reprend · jour 1
          </span>
          <span className="text-ink/40 text-xs font-bold">×</span>
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 bg-paper/80 backdrop-blur-md border border-ink/10 px-3 py-1.5 rounded-full shadow-sm">
          {showFlame && <span className="text-sm leading-none">🔥</span>}
          <span className="text-[11px] uppercase tracking-widest font-black text-ink">
            {state.current} jour{state.current > 1 ? "s" : ""}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-ink/50 font-bold hidden sm:inline">
            · {label}
          </span>
        </div>
      )}
    </div>
  );
}
