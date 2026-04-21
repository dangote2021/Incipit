"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPrefs, markVisit, daysSince } from "@/lib/prefs";

type Mode = "loading" | "new" | "returning" | "hidden";

export default function WelcomeBanner() {
  const [mode, setMode] = useState<Mode>("loading");
  const [visits, setVisits] = useState(0);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    // Lit les prefs AVANT de les mettre à jour pour savoir si c'est une
    // première visite ou un retour.
    const before = getPrefs();
    const updated = markVisit();

    if (!before.onboarded) {
      setMode("new");
    } else {
      setMode("returning");
    }
    setVisits(updated.visits);
    setDays(daysSince(before.lastSeenAt));
  }, []);

  if (mode === "loading" || mode === "hidden") return null;

  if (mode === "new") {
    return (
      <section className="snap-start min-h-[60vh] flex flex-col items-center justify-center px-6 py-14 bg-gradient-to-b from-cream via-paper to-dust text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Première fois ici
        </div>
        <h2 className="font-serif text-4xl font-black text-ink leading-tight mb-3 max-w-sm">
          Bienvenue<span className="text-bordeaux">.</span>
        </h2>
        <p className="font-serif italic text-ink/80 text-lg max-w-xs mb-8">
          Tu peux scroller pour découvrir le feed, ou calibrer ton expérience en 2 étapes.
        </p>
        <div className="flex gap-3 w-full max-w-sm">
          <Link
            href="/onboarding"
            className="flex-1 py-3.5 rounded-full bg-ink text-paper font-serif font-bold text-sm hover:bg-bordeaux transition"
          >
            Calibrer mon feed
          </Link>
          <button
            type="button"
            onClick={() => setMode("hidden")}
            className="flex-1 py-3.5 rounded-full border-2 border-ink text-ink font-serif font-bold text-sm hover:bg-ink/5 transition"
          >
            Plus tard
          </button>
        </div>
      </section>
    );
  }

  // returning
  return (
    <section className="snap-start flex flex-col justify-center px-6 py-10 bg-paper border-b border-ink/5">
      <div className="max-w-xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          {visits >= 10
            ? "Fidèle lecteur"
            : visits >= 3
              ? "Content de te revoir"
              : "Rebonjour"}
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink leading-tight mb-1">
          {days === 0
            ? "Encore un tour ?"
            : days === 1
              ? "Tu étais là hier."
              : days !== null && days < 7
                ? `Absent·e depuis ${days} jours.`
                : days !== null && days < 30
                  ? "Ça fait un moment."
                  : "De retour."}
        </h2>
        <p className="text-sm text-ink/60 leading-relaxed">
          {days !== null && days >= 7
            ? "Tant que t'es là, on a de quoi raconter."
            : "Un nouvel incipit t'attend plus bas."}
        </p>
      </div>
    </section>
  );
}
