"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listBadgesWithStatus } from "@/lib/badges";

// Panneau réutilisable (profile, home) affichant l'état des jalons culturels.
// Lit le localStorage en direct + écoute les événements de changement pour
// rester à jour sans avoir besoin de recharger la page.
export default function BadgePanel({
  variant = "block",
}: {
  variant?: "block" | "strip";
}) {
  const [items, setItems] = useState<ReturnType<typeof listBadgesWithStatus>>(
    []
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setItems(listBadgesWithStatus());
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener("incipit:badges:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("incipit:badges:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (!hydrated) return null;

  const unlocked = items.filter((b) => b.unlocked);

  if (variant === "strip") {
    return (
      <div className="flex items-center gap-3">
        <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold shrink-0">
          Jalons · {unlocked.length} / {items.length}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {items.slice(0, 6).map((b) => (
            <div
              key={b.id}
              className={`shrink-0 w-7 h-7 rounded-md font-serif text-xs font-black flex items-center justify-center ${
                b.unlocked
                  ? "bg-gold text-ink"
                  : "bg-ink/5 text-ink/30"
              }`}
              title={b.name}
            >
              {b.mark}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper border border-ink/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            Jalons culturels
          </div>
          <div className="font-serif text-base font-bold text-ink leading-tight mt-0.5">
            {unlocked.length} / {items.length} débloqués
          </div>
        </div>
        <Link
          href="/quiz/badges"
          className="text-[11px] uppercase tracking-widest text-bordeaux font-bold"
        >
          Voir →
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {items.map((b) => (
          <div
            key={b.id}
            className={`shrink-0 w-14 h-14 rounded-xl font-serif text-xl font-black flex items-center justify-center ${
              b.unlocked
                ? "bg-gold text-ink"
                : "bg-ink/5 text-ink/30"
            }`}
            title={`${b.name} · ${b.criteria}`}
          >
            {b.mark}
          </div>
        ))}
      </div>
    </div>
  );
}
