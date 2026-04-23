"use client";

import { useEffect, useState } from "react";
import { getPrefs, updatePrefs } from "@/lib/prefs";

// ─── Toggle "Masquer la flamme" (Q4 panel v9).
// ─── La série tourne quand même en arrière-plan : si on ré-active, on
// ─── retrouve son compte. Pas de culpabilité, pas de perte.

export default function HideStreakToggle() {
  const [hidden, setHidden] = useState<boolean | null>(null);

  useEffect(() => {
    setHidden(getPrefs().hideStreak === true);
  }, []);

  if (hidden === null) {
    // Avant hydratation, on réserve le slot pour éviter le flash.
    return (
      <div className="h-[60px] rounded-2xl border border-ink/10 bg-paper/60" />
    );
  }

  const toggle = () => {
    const next = !hidden;
    setHidden(next);
    updatePrefs({ hideStreak: next });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hidden}
      className="w-full flex items-center justify-between gap-4 px-5 py-3 border border-ink/10 rounded-full bg-paper hover:border-ink/30 transition"
    >
      <span className="flex items-center gap-2 text-left">
        <span className="text-base">{hidden ? "" : "🔥"}</span>
        <span className="flex flex-col">
          <span className="text-xs uppercase tracking-widest font-bold text-ink/80">
            {hidden ? "Afficher la flamme" : "Masquer la flamme"}
          </span>
          <span className="text-[10px] text-ink/50 normal-case tracking-normal leading-tight mt-0.5">
            La série tourne quand même en arrière-plan.
          </span>
        </span>
      </span>
      <span
        className={`shrink-0 w-10 h-6 rounded-full relative transition ${
          hidden ? "bg-ink/20" : "bg-bordeaux"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-paper rounded-full shadow transition-transform ${
            hidden ? "translate-x-0.5" : "translate-x-[18px]"
          }`}
        />
      </span>
    </button>
  );
}
