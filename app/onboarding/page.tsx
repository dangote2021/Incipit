"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/mock-data";
import type { Genre } from "@/lib/types";
import { completeOnboarding, getPrefs } from "@/lib/prefs";
import { setFlash } from "@/lib/flash";
import {
  getDailyIncipit,
  incipitTeaser,
  formatDate,
} from "@/lib/daily-incipit";

type Step =
  | "splash"
  | "welcome"
  | "firstName"
  | "genres"
  | "tone"
  | "tomorrow";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<Genre>>(new Set());
  const [step, setStep] = useState<Step>("splash");
  const [tone, setTone] = useState<"boloss" | "neutre">("boloss");
  const [firstName, setFirstName] = useState("");

  // Pré-remplit avec les prefs existantes si l'utilisateur revient
  // modifier ses choix. Dans ce cas on saute le splash + le welcome + le
  // firstName (intro marketing) pour atterrir directement sur les genres :
  // c'est la raison qui ramène un utilisateur déjà onboardé, pas la
  // découverte de la marque. Retour panel : "le bouton Préférences me
  // ramène à l'intro, c'est bizarre".
  useEffect(() => {
    const prefs = getPrefs();
    if (prefs.onboarded) {
      setSelected(new Set(prefs.genres));
      setTone(prefs.tone);
      setFirstName(prefs.firstName || "");
      setStep("genres");
    }
  }, []);

  const finish = () => {
    const selectedGenres = Array.from(selected);
    completeOnboarding({
      genres: selectedGenres,
      tone,
      firstName: firstName.trim(),
    });
    const n = selectedGenres.length;
    setFlash({
      message:
        n > 0
          ? `Préférences mises à jour — ${n} univers sélectionné${n > 1 ? "s" : ""}.`
          : "Préférences mises à jour.",
    });
    router.push("/");
  };

  // Variante "je débute" : même complétion d'onboarding, mais on atterrit
  // sur la feuille de route débutant au lieu du feed. Retour panel v8 :
  // Yanis demandait qu'on l'oriente explicitement à la sortie de
  // l'onboarding ("je viens de m'inscrire, je fais quoi maintenant ?").
  const finishAsBeginner = () => {
    completeOnboarding({
      genres: Array.from(selected),
      tone,
      firstName: firstName.trim(),
    });
    router.push("/debutant");
  };

  // "Passer" : onboarding minimal — on persiste quand même le fait que
  // l'utilisateur est passé par là pour que WelcomeBanner ne l'appelle
  // pas éternellement "première fois ici".
  const skipAll = () => {
    completeOnboarding({
      genres: [],
      tone: "boloss",
      firstName: firstName.trim(),
    });
    setFlash({
      message: "On commence léger — tu pourras affiner plus tard.",
      tone: "info",
    });
    router.push("/");
  };

  const toggle = (g: Genre) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  if (step === "splash") {
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
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-gradient-to-b from-paper via-cream to-dust">
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setStep("splash")}
            className="text-[11px] uppercase tracking-widest text-ink/60 font-semibold hover:text-ink transition"
          >
            ← Retour
          </button>
        </div>
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
              Chaque pitch te raconte un chef-d&apos;œuvre en 90 secondes, ton
              tranchant, sans chichi. Tu trouves ta bibliothèque, tes notes,
              tes clubs, un compagnon pour t&apos;accompagner. On redonne envie.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep("firstName")}
          className="mt-10 w-full max-w-sm mx-auto bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-bordeaux transition"
        >
          Commencer
        </button>
      </div>
    );
  }

  if (step === "firstName") {
    return (
      <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setStep("welcome")}
            className="text-[11px] uppercase tracking-widest text-ink/60 font-semibold hover:text-ink transition"
          >
            ← Retour
          </button>
          <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
            Bienvenue
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="font-serif text-3xl font-bold text-ink mb-2">
            Comment tu t&apos;appelles ?
          </h1>
          <p className="text-ink/60 text-sm mb-8">
            Juste ton prénom. Rien n&apos;est envoyé, tout reste sur ton
            appareil.
          </p>

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ton prénom"
            autoFocus
            autoComplete="given-name"
            maxLength={40}
            className="w-full px-5 py-4 text-lg font-serif bg-paper border-2 border-ink/15 rounded-2xl focus:border-bordeaux focus:outline-none text-ink placeholder:text-ink/30"
            onKeyDown={(e) => {
              if (e.key === "Enter" && firstName.trim().length > 0) {
                setStep("genres");
              }
            }}
          />

          <button
            type="button"
            onClick={() => setStep("genres")}
            disabled={firstName.trim().length === 0}
            className="mt-8 w-full bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-bordeaux transition"
          >
            Suivant
          </button>

          <button
            type="button"
            onClick={() => {
              setFirstName("");
              setStep("genres");
            }}
            className="mt-4 text-xs uppercase tracking-widest text-ink/50 font-semibold hover:text-ink transition"
          >
            Rester anonyme
          </button>
        </div>
      </div>
    );
  }

  if (step === "genres") {
    return (
      <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setStep("firstName")}
            className="text-[11px] uppercase tracking-widest text-ink/60 font-semibold hover:text-ink transition"
          >
            ← Retour
          </button>
          <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
            Étape 1 / 2 · Univers
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Qu&apos;est-ce qui te parle ?
        </h1>
        <p className="text-ink/60 text-sm mb-6">
          Choisis au moins deux univers. On orientera ta boussole.
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
          <button
            type="button"
            onClick={skipAll}
            className="text-xs uppercase tracking-widest text-ink/50 font-semibold hover:text-ink transition"
          >
            Passer
          </button>
          <button
            onClick={() => setStep("tone")}
            disabled={selected.size < 1}
            className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-bordeaux transition"
          >
            Suivant ({selected.size})
          </button>
        </div>
      </div>
    );
  }

  if (step === "tomorrow") {
    return (
      <TomorrowTeaser
        onFinish={finish}
        onFinishAsBeginner={finishAsBeginner}
        onBack={() => setStep("tone")}
      />
    );
  }

  // step === "tone"
  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setStep("genres")}
          className="text-[11px] uppercase tracking-widest text-ink/60 font-semibold hover:text-ink transition"
        >
          ← Retour
        </button>
        <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
          Étape 2 / 2 · Ton
        </div>
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
            <div className="font-serif text-xl font-bold">Direct</div>
            {tone === "boloss" && (
              <span className="text-xs bg-paper text-bordeaux px-2 py-0.5 rounded-full font-bold">
                Choisi
              </span>
            )}
          </div>
          <div className={`text-sm ${tone === "boloss" ? "text-paper/90" : "text-ink/70"}`}>
            Argot assumé, irrévérence, punchlines. Les classiques comme tu
            ne les as jamais entendus.
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
            <div className="font-serif text-xl font-bold">Classique</div>
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
        onClick={() => setStep("tomorrow")}
        className="mt-8 bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest text-center hover:bg-bordeaux transition"
      >
        Suivant →
      </button>
    </div>
  );
}

function TomorrowTeaser({
  onFinish,
  onFinishAsBeginner,
  onBack,
}: {
  onFinish: () => void;
  onFinishAsBeginner: () => void;
  onBack: () => void;
}) {
  // Teaser de l'incipit de J+1 (flouté) — pour donner une raison concrète
  // de revenir demain (retour panel v8, Inès et Camille). Rendu client-side
  // à l'instant T : si on ouvre l'onboarding à 23h59, on voit bien l'incipit
  // de demain une minute plus tard.
  const { book, date } = getDailyIncipit(-1); // -1 jour "de retard" = demain
  const teaser = incipitTeaser(book, 140);

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-paper">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] uppercase tracking-widest text-ink/60 font-semibold hover:text-ink transition"
        >
          ← Retour
        </button>
        <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-semibold">
          Demain
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
          Ton prochain incipit
        </div>
        <div className="text-xs text-ink/50 mb-6 italic first-letter:uppercase">
          {formatDate(date)}
        </div>

        <div className="relative bg-gradient-to-b from-cream to-dust rounded-3xl p-6 mb-8 border border-ink/10 shadow-sm">
          <div
            className="font-serif text-7xl text-bordeaux/25 leading-none mb-2 select-none"
            aria-hidden
          >
            “
          </div>
          <blockquote
            className="font-serif text-[22px] leading-[1.3] text-ink italic blur-sm select-none"
            aria-label="Incipit flouté pour demain"
          >
            {teaser}
          </blockquote>
          <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
            <div className="text-[11px] uppercase tracking-widest text-ink/70 font-bold bg-paper/90 px-3 py-1.5 rounded-full shadow">
              🔒 Reviens demain
            </div>
          </div>
        </div>

        <h1 className="font-serif text-2xl font-bold text-ink mb-2 leading-snug">
          Un classique par jour, 2 minutes.
        </h1>
        <p className="text-ink/70 text-[15px] leading-relaxed mb-2">
          Chaque matin, un nouveau rituel t'attend. Le lundi un incipit,
          le mardi une citation, le mercredi une punchline de rap décortiquée,
          le jeudi un quiz, le vendredi une carte à partager.
        </p>
        <p className="text-ink/50 text-[13px] italic mb-4">
          Pas de notification imposée. Juste une promesse : ça vaut le détour.
        </p>

        <button
          type="button"
          onClick={onFinish}
          className="mt-4 bg-ink text-paper py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-bordeaux transition"
        >
          Entrer dans Incipit →
        </button>
        {/* Sortie alternative pour les lecteurs qui débutent vraiment.
            Panel v8 (Yanis) : "je me suis inscrit, je voulais qu'on me
            prenne par la main". On ouvre une porte discrète, pas une
            arche triomphale — pour ne pas infantiliser les autres. */}
        <button
          type="button"
          onClick={onFinishAsBeginner}
          className="mt-3 w-full text-[11px] uppercase tracking-widest text-ink/55 font-semibold hover:text-bordeaux transition"
        >
          Je débute avec les classiques — guide-moi
        </button>
      </div>
    </div>
  );
}
