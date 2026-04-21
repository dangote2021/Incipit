"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { listBadgesWithStatus, readStats } from "@/lib/badges";

export default function BadgesPage() {
  const [items, setItems] = useState<ReturnType<typeof listBadgesWithStatus>>(
    []
  );
  const [stats, setStats] = useState(() => ({
    sessionsCompleted: 0,
    totalCorrect: 0,
    bestStreak: 0,
  }));

  useEffect(() => {
    const refresh = () => {
      setItems(listBadgesWithStatus());
      const s = readStats();
      setStats({
        sessionsCompleted: s.sessionsCompleted,
        totalCorrect: s.totalCorrect,
        bestStreak: s.bestStreak,
      });
    };
    refresh();
    const onChange = () => refresh();
    window.addEventListener("incipit:badges:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("incipit:badges:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const unlockedCount = items.filter((b) => b.unlocked).length;

  return (
    <>
      <AppHeader title="Jalons culturels" subtitle="Ton parcours littéraire" back />

      <section className="px-6 pt-10 pb-8 bg-gradient-to-b from-paper via-cream to-dust border-b border-ink/5 relative overflow-hidden">
        <div className="absolute top-12 right-8 w-48 h-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            Pas des badges. Des clins d'œil.
          </div>
          <h2 className="font-serif text-3xl font-black text-ink leading-tight mt-3">
            On ne garde pas de score.{" "}
            <span className="text-bordeaux">On salue le patrimoine croisé.</span>
          </h2>
          <p className="text-sm text-ink/70 mt-3 leading-relaxed max-w-xl">
            Tu réponds juste à une question sur Candide ? Voltaire te tire son
            chapeau. Tu reconnais un oxymore ? On te décerne le jalon
            Stylisticien. Pas d'XP, pas de streak, pas de classement. Juste le
            plaisir d'une complicité.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCell label="Débloqués" value={`${unlockedCount}/${items.length}`} />
            <StatCell label="Parties" value={stats.sessionsCompleted} />
            <StatCell label="Série max" value={stats.bestStreak} />
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Les {items.length} jalons
        </div>
        <ul className="space-y-3">
          {items.map((b) => (
            <li
              key={b.id}
              className={`rounded-2xl p-4 border-2 flex items-start gap-4 transition ${
                b.unlocked
                  ? "bg-gold/10 border-gold"
                  : "bg-paper/60 border-ink/10"
              }`}
            >
              <div
                className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-serif text-2xl font-black ${
                  b.unlocked
                    ? "bg-gold text-ink"
                    : "bg-ink/5 text-ink/30"
                }`}
              >
                {b.mark}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`font-serif text-lg font-black leading-tight ${
                      b.unlocked ? "text-ink" : "text-ink/40"
                    }`}
                  >
                    {b.name}
                  </div>
                  {b.unlocked && (
                    <span className="text-[9px] uppercase tracking-widest font-black text-bordeaux">
                      débloqué
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-0.5 italic leading-snug ${
                    b.unlocked ? "text-ink/75" : "text-ink/40"
                  }`}
                >
                  {b.tagline}
                </p>
                <p
                  className={`text-[11px] uppercase tracking-widest font-bold mt-2 ${
                    b.unlocked ? "text-ink/55" : "text-ink/35"
                  }`}
                >
                  {b.criteria}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 pb-12">
        <Link
          href="/quiz"
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-bordeaux transition"
        >
          Reprendre une partie →
        </Link>
      </section>
    </>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-paper rounded-xl border border-ink/10 p-3 text-center">
      <div className="font-serif text-2xl font-black text-ink leading-none">
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-ink/50 font-bold mt-1">
        {label}
      </div>
    </div>
  );
}
