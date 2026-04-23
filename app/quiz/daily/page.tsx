"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  LIT_QUESTIONS,
  buildOptions,
  CATEGORY_LABELS,
} from "@/lib/quiz-literature";
import { dayOffset, todayUTC } from "@/lib/daily-content";

// ─────────────────────────────────────────────────────────────────────────────
// Mini-quiz du jour — 3 questions courtes, rotation quotidienne déterministe.
//
// Retour panel v8 (Yanis, Thibault) : le quiz de 8 questions est un rituel
// "quand j'ai 5 minutes devant moi". Il manque un format 2 minutes, attaché
// au rituel quotidien. On tire 3 questions à la suite dans LIT_QUESTIONS à
// partir du dayOffset — chaque jour = nouveau triplet, mêmes 3 questions
// pour tout le monde, pas de drift.
//
// Pas de paywall ici : le mini-quiz est le hook quotidien gratuit. Le grand
// quiz (8 Q, limité en free) reste à /quiz.
// ─────────────────────────────────────────────────────────────────────────────

type Status = "pending" | "correct" | "wrong";

export default function DailyMiniQuizPage() {
  // Tirage déterministe du jour : 3 questions consécutives à partir de l'offset
  const triad = useMemo(() => {
    const start = dayOffset() % LIT_QUESTIONS.length;
    const out = [0, 1, 2].map((i) => {
      const q = LIT_QUESTIONS[(start + i) % LIT_QUESTIONS.length];
      return { q, options: buildOptions(q) };
    });
    return out;
  }, []);

  const [answers, setAnswers] = useState<Status[]>([
    "pending",
    "pending",
    "pending",
  ]);
  const [selected, setSelected] = useState<(string | null)[]>([null, null, null]);
  const [index, setIndex] = useState(0);

  const done = answers.every((a) => a !== "pending");
  const score = answers.filter((a) => a === "correct").length;

  const current = triad[index];
  const cat = CATEGORY_LABELS[current.q.category];

  const choose = (opt: string) => {
    if (answers[index] !== "pending") return;
    const isRight = opt === current.q.answer;
    const nextAnswers = [...answers];
    nextAnswers[index] = isRight ? "correct" : "wrong";
    const nextSel = [...selected];
    nextSel[index] = opt;
    setAnswers(nextAnswers);
    setSelected(nextSel);
  };

  const advance = () => {
    if (index < triad.length - 1) setIndex(index + 1);
  };

  const verdict =
    score === 3
      ? "Sans faute."
      : score === 2
      ? "Deux sur trois — propre."
      : score === 1
      ? "Un point. Demain on remet ça."
      : "Rien de grave. Tu connaîtras les réponses demain.";

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <AppHeader title="Mini-quiz du jour" back />

      <section className="flex-1 px-6 py-6 max-w-lg w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            3 questions · {todayUTC()}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
            {Math.min(index + 1, triad.length)} / 3
          </div>
        </div>

        {/* Barre de progression */}
        <div className="flex gap-1.5 mb-8">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                a === "correct"
                  ? "bg-bordeaux"
                  : a === "wrong"
                  ? "bg-ink/60"
                  : i === index
                  ? "bg-ink/40"
                  : "bg-ink/10"
              }`}
            />
          ))}
        </div>

        {!done ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-[9px] uppercase tracking-[0.2em] font-black text-ink/70 mb-5">
              <span className="font-serif text-base leading-none">
                {cat.emoji}
              </span>
              {cat.title}
            </div>

            {current.q.category === "opening" && (
              <div className="font-serif text-6xl text-bordeaux/25 leading-none mb-1">
                “
              </div>
            )}

            <blockquote className="font-serif text-[22px] font-black text-ink italic leading-snug mb-6">
              {current.q.prompt}
            </blockquote>

            <div className="space-y-2">
              {current.options.map((opt) => {
                const isSelected = selected[index] === opt;
                const resolved = answers[index] !== "pending";
                const isCorrect = opt === current.q.answer;
                const state =
                  !resolved
                    ? "idle"
                    : isCorrect
                    ? "correct"
                    : isSelected
                    ? "wrong"
                    : "dim";
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={resolved}
                    onClick={() => choose(opt)}
                    className={`w-full min-h-[44px] text-left rounded-2xl border-2 px-4 py-3 font-serif text-[15px] transition ${
                      state === "idle"
                        ? "border-ink/15 bg-cream/60 text-ink hover:border-bordeaux"
                        : state === "correct"
                        ? "border-bordeaux bg-bordeaux text-paper"
                        : state === "wrong"
                        ? "border-ink bg-ink/10 text-ink/80 line-through"
                        : "border-ink/10 bg-paper text-ink/40"
                    }`}
                  >
                    {opt}
                    {state === "correct" && (
                      <span className="float-right text-[11px] uppercase tracking-widest font-bold">
                        ✓ bonne réponse
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {current.q.explanation && answers[index] !== "pending" && (
              <div className="mt-5 bg-cream border-l-4 border-bordeaux px-4 py-3 rounded-r-xl text-sm text-ink/80 leading-relaxed">
                {current.q.explanation}
              </div>
            )}

            {answers[index] !== "pending" && (
              <button
                type="button"
                onClick={advance}
                className="mt-6 w-full bg-ink text-paper py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
              >
                {index < triad.length - 1 ? "Question suivante →" : "Voir le score →"}
              </button>
            )}
          </>
        ) : (
          <div className="text-center pt-6 animate-fade-up">
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
              Mini-quiz terminé
            </div>
            <div className="font-serif text-7xl font-black text-ink leading-none mt-3">
              {score}
              <span className="text-ink/30 text-4xl"> / 3</span>
            </div>
            <p className="mt-4 font-serif italic text-lg text-ink/80">{verdict}</p>
            <p className="mt-6 text-sm text-ink/60 leading-relaxed">
              Reviens demain pour un nouveau triplet. Les 40+ questions du
              corpus tournent sur plusieurs semaines.
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href="/quiz"
                className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
              >
                Jouer la partie complète (8 questions) →
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center w-full min-h-[44px] text-center border-2 border-ink/15 text-ink py-3.5 rounded-full text-xs uppercase tracking-widest font-bold bg-paper hover:border-bordeaux transition"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
