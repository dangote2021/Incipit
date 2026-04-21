"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/mock-data";
import type { Genre } from "@/lib/types";
import { completeOnboarding, getPrefs } from "@/lib/prefs";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<Genre>>(new Set());
  const [step, setStep] = useState<
    "name" | "welcome" | "genres" | "tone"
  >("name");
  const [tone, setTone] = useState<"boloss" | "neutre">("boloss");

  // Pré-remplit avec les prefs existantes si l'utilisateur revient
  // modifier ses choix.
  useEffect(() => {
    const prefs = getPrefs();
    if (prefs.onboarded) {
      setSelected(new Set(prefs.genres));
      setTone(prefs.tone);
    }
  }, []);

  const finish = () => {
    completeOnboarding({ genres: Array.from(selected), tone });
    router.push("/");
  };

  const toggle = (g: Genre) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  if (step === "name") {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 py-10 bg-paper">
        <div className="max-w-sm mx-auto text-center">
          <div className="font-serif text-[68px] sm:text-[84px] font-black text-ink leading-none tracking-tight">
            Incipit
          </div>

          <div className="mt-4 inline-flex items-baseline gap-2 text-ink/50 font-mono text-sm">
            <span className="text-[10px] uppercase tracking-widest">se dit</span>
            <span className="text-ink font-sans tracking-wider text-base">
              [in-ki-pit]
            </span>
          </div>

          <div className="my-10 h-px w-16 mx-auto bg-bordeaux/40" />

          <p className="font-serif italic text-ink/80 text-lg leading-snug">
            Du latin <em>incipere</em>, « commencer ».
          </p>
          <p className="mt-3 font-serif italic text-ink text-xl leading-snug">
            Les premières lignes qui donnent envie.
          </p>

          <button
            onClick={() => setStep("welcome")}
            className="mt-12 w-full bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-bordeaux transition"
          >
            Entrer
          </button>

          <p className="mt-4 text-[11px] text-ink/40 italic">
            (Oui, ça se prononce bien « in-ki-pit ». C'est du latin.)
          </p>
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-gradient-to-b from-paper via-cream to-dust">
        <div />
        <div className="text-center animate-fade-up">
          <div className="font-serif text-6xl font-black text-ink leading-none">
            Incipit<span className="text-bordeaux">.</span>
          </div>
          <p className="mt-6 text-lg font-serif italic text-ink/80 max-w-xs mx-auto">
            « Longtemps, je me suis couché de bonne heure. »
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-ink/50">
            Proust, 1913
          </p>

          <div className="mt-14 max-w-sm mx-auto space-y-4">
            <h1 className="font-serif text-3xl font-bold text-ink">
              Les premières lignes qui donnent envie.
            </h1>
            <p className="text-ink/70 text-[15px] leading-relaxed">
              Chaque pitch te raconte un chef-d'œuvre en 90 secondes, ton
              tranchant, sans chichi. Tu trouves ta bibliothèque, tes notes,
              tes clubs, un compagnon pour t'accompagner. On redonne envie.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep("genres")}
          className="mt-10 w-full max-w-sm mx-auto bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-bordeaux transition"
        >
          Commencer
        </button>
      </div>
    );
  }

  if (step === "genres") {
    return (
      <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
        <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
          Étape 1 / 2 · Univers
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Qu'est-ce qui te parle ?
        </h1>
        <p className="text-ink/60 text-sm mb-6">
          Choisis au moins deux univers. On calibrera ton feed.
        </p>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {GENRES.map((g) => {
            const active = selected.has(g.key);
            return (
              <button
                key={g.key}
                onClick={() => toggle(g.key)}
                className={`relative text-left p-4 rounded-2xl border-2 transition ${
                  active
                    ? "border-bordeaux bg-bordeaux text-paper shadow-lg scale-[1.02]"
                    : "border-ink/10 bg-paper hover:border-ink/30"
                }`}
              >
                <div className="text-3xl mb-2">{g.emoji}</div>
                <div
                  className={`font-serif text-lg font-bold leading-tight ${
                    active ? "text-paper" : "text-ink"
                  }`}
                >
                  {g.label}
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    active ? "text-paper/80" : "text-ink/50"
                  }`}
                >
                  {g.blurb}
                </div>
                {active && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-paper text-bordeaux flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-ink/50 font-semibold"
          >
            Passer
          </Link>
          <button
            onClick={() => setStep("tone")}
            disabled={selected.size < 1}
            className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-30"
          >
            Suivant ({selected.size})
          </button>
        </div>
      </div>
    );
  }

  // step === "tone"
  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
      <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
        Étape 2 / 2 · Ton
      </div>
      <h1 className="font-serif text-3xl font-bold text-ink mb-2">
        Quel ton tu préfères ?
      </h1>
      <p className="text-ink/60 text-sm mb-6">
        Tu pourras changer à tout moment dans ton profil.
      </p>

      <div className="flex-1 space-y-4">
        <button
          onClick={() => setTone("boloss")}
          className={`w-full text-left p-5 rounded-2xl border-2 transition ${
            tone === "boloss"
              ? "border-bordeaux bg-bordeaux text-paper shadow-lg"
              : "border-ink/10 bg-paper"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="font-serif text-xl font-bold">Tranchant 🔪</div>
            {tone === "boloss" && (
              <span className="text-xs bg-paper text-bordeaux px-2 py-0.5 rounded-full font-bold">
                Choisi
              </span>
            )}
          </div>
          <div className={`text-sm ${tone === "boloss" ? "text-paper/90" : "text-ink/70"}`}>
            Argot assumé, irrévérence, punchlines. Les classiques comme tu
            ne les as jamais entendus. (Recommandé.)
          </div>
        </button>

        <button
          onClick={() => setTone("neutre")}
          className={`w-full text-left p-5 rounded-2xl border-2 transition ${
            tone === "neutre"
              ? "border-ink bg-ink text-paper shadow-lg"
              : "border-ink/10 bg-paper"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="font-serif text-xl font-bold">Classique 📜</div>
            {tone === "neutre" && (
              <span className="text-xs bg-paper text-ink px-2 py-0.5 rounded-full font-bold">
                Choisi
              </span>
            )}
          </div>
          <div className={`text-sm ${tone === "neutre" ? "text-paper/90" : "text-ink/70"}`}>
            Style sobre et littéraire. Pour ceux qui préfèrent la lecture
            comme un cérémonial.
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={finish}
        className="mt-8 bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest text-center hover:bg-bordeaux transition"
      >
        Entrer dans Incipit →
      </button>
    </div>
  );
}
