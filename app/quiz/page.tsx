"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { BOOKS } from "@/lib/mock-data";
import {
  LIT_QUESTIONS,
  BY_CATEGORY,
  CATEGORY_LABELS,
  buildOptions,
  type LitCategory,
  type LitQuestion,
} from "@/lib/quiz-literature";
import { usePremium, FREE_QUOTAS } from "@/lib/premium";
import {
  applyRound,
  listBadgesWithStatus,
  readStats,
  type Badge,
  type RoundAnswer,
} from "@/lib/badges";
import {
  getQuizRoundCounter,
  bumpQuizRoundCounter,
} from "@/lib/daily-content";
import { track } from "@/lib/telemetry";

// Ancien : sessionStorage → reset à la fermeture de l'onglet, paywall
// contournable en 2 clics. Remonté par Mehdi (panel beta).
// Nouveau : compteur journalier localStorage indexé par date UTC, via
// lib/daily-content.ts — 3 parties / jour free, reset auto à minuit UTC.

type Question = {
  lit: LitQuestion;
  options: string[];
};

const ROUND_SIZE = 8;
type ModeId = LitCategory | "mix";

const MODE_ORDER: ModeId[] = [
  "mix",
  "opening",
  "author",
  "character",
  "date",
  "movement",
  "device",
];

const MODE_META: Record<ModeId, { title: string; sub: string; mark: string }> =
  {
    mix: {
      title: "Mélange",
      sub: "Toutes catégories, difficulté variable",
      mark: "∞",
    },
    opening: {
      title: CATEGORY_LABELS.opening.title,
      sub: CATEGORY_LABELS.opening.sub,
      mark: CATEGORY_LABELS.opening.emoji,
    },
    author: {
      title: CATEGORY_LABELS.author.title,
      sub: CATEGORY_LABELS.author.sub,
      mark: CATEGORY_LABELS.author.emoji,
    },
    character: {
      title: CATEGORY_LABELS.character.title,
      sub: CATEGORY_LABELS.character.sub,
      mark: CATEGORY_LABELS.character.emoji,
    },
    date: {
      title: CATEGORY_LABELS.date.title,
      sub: CATEGORY_LABELS.date.sub,
      mark: CATEGORY_LABELS.date.emoji,
    },
    movement: {
      title: CATEGORY_LABELS.movement.title,
      sub: CATEGORY_LABELS.movement.sub,
      mark: CATEGORY_LABELS.movement.emoji,
    },
    device: {
      title: CATEGORY_LABELS.device.title,
      sub: CATEGORY_LABELS.device.sub,
      mark: CATEGORY_LABELS.device.emoji,
    },
  };

// Les 12 fiches Incipit : seuls ces ids ont une /book/[id] dédiée.
const FICHE_IDS = new Set(BOOKS.map((b) => b.id));

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function poolFor(mode: ModeId): LitQuestion[] {
  if (mode === "mix") return LIT_QUESTIONS;
  return BY_CATEGORY[mode] ?? [];
}

function makeRound(mode: ModeId): Question[] {
  const pool = poolFor(mode);
  if (pool.length === 0) return [];
  const picked = shuffle(pool).slice(0, Math.min(ROUND_SIZE, pool.length));
  return picked.map((lit) => ({ lit, options: buildOptions(lit) }));
}

type State =
  | { phase: "intro" }
  | {
      phase: "playing";
      mode: ModeId;
      questions: Question[];
      index: number;
      picked: string | null;
      score: number;
      streak: number;
      bestStreak: number;
      answers: { litId: string; picked: string; correct: boolean }[];
    }
  | {
      phase: "done";
      mode: ModeId;
      questions: Question[];
      score: number;
      bestStreak: number;
      answers: { litId: string; picked: string; correct: boolean }[];
      newlyUnlocked: Badge[];
      isFirstSession: boolean;
    };

export default function QuizPage() {
  const [state, setState] = useState<State>({ phase: "intro" });
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const { isPremium, hydrated } = usePremium();

  useEffect(() => {
    setRoundsPlayed(getQuizRoundCounter());
  }, []);

  const reachedFreeCap =
    hydrated && !isPremium && roundsPlayed >= FREE_QUOTAS.quizRounds;

  const start = (mode: ModeId) => {
    if (reachedFreeCap) return;
    const questions = makeRound(mode);
    if (questions.length === 0) return;
    const played = bumpQuizRoundCounter();
    setRoundsPlayed(played);
    setState({
      phase: "playing",
      mode,
      questions,
      index: 0,
      picked: null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answers: [],
    });
  };

  const pick = (opt: string) => {
    if (state.phase !== "playing" || state.picked) return;
    const current = state.questions[state.index];
    const correct = opt === current.lit.answer;
    const nextScore = state.score + (correct ? 1 : 0);
    const nextStreak = correct ? state.streak + 1 : 0;
    const nextBest = Math.max(state.bestStreak, nextStreak);
    setState({
      ...state,
      picked: opt,
      score: nextScore,
      streak: nextStreak,
      bestStreak: nextBest,
      answers: [
        ...state.answers,
        { litId: current.lit.id, picked: opt, correct },
      ],
    });
  };

  const next = () => {
    if (state.phase !== "playing") return;
    const isLast = state.index >= state.questions.length - 1;
    if (isLast) {
      // Applique le round sur les stats → on récupère les nouveaux jalons.
      const roundAnswers: RoundAnswer[] = state.answers.map((a, i) => {
        const q = state.questions[i].lit;
        return {
          correct: a.correct,
          category: q.category,
          era: q.era,
          bookId: q.bookId,
        };
      });
      const newlyUnlocked = applyRound({
        score: state.score,
        total: state.questions.length,
        bestStreak: state.bestStreak,
        answers: roundAnswers,
      });
      track("quiz_completed", {
        mode: state.mode,
        score: state.score,
        total: state.questions.length,
        best_streak: state.bestStreak,
        unlocked_count: newlyUnlocked.length,
      });
      // Pour adoucir le ton du verdict lors de la toute première partie :
      // après applyRound(), sessionsCompleted a déjà été incrémenté, donc
      // c'est « 1 » qui marque la première session.
      const isFirstSession = readStats().sessionsCompleted <= 1;
      setState({
        phase: "done",
        mode: state.mode,
        questions: state.questions,
        score: state.score,
        bestStreak: state.bestStreak,
        answers: state.answers,
        newlyUnlocked,
        isFirstSession,
      });
    } else {
      setState({ ...state, index: state.index + 1, picked: null });
    }
  };

  if (state.phase === "intro")
    return (
      <Intro
        onStart={start}
        reachedFreeCap={reachedFreeCap}
        isPremium={isPremium}
        roundsPlayed={roundsPlayed}
      />
    );
  if (state.phase === "done")
    return (
      <Done
        mode={state.mode}
        questions={state.questions}
        score={state.score}
        bestStreak={state.bestStreak}
        answers={state.answers}
        newlyUnlocked={state.newlyUnlocked}
        isFirstSession={state.isFirstSession}
        onReplay={() => start(state.mode)}
        onPickMode={() => setState({ phase: "intro" })}
        reachedFreeCap={reachedFreeCap}
        isPremium={isPremium}
      />
    );

  return (
    <Playing
      state={state}
      onPick={pick}
      onNext={next}
      total={state.questions.length}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Intro({
  onStart,
  reachedFreeCap,
  isPremium,
  roundsPlayed,
}: {
  onStart: (mode: ModeId) => void;
  reachedFreeCap: boolean;
  isPremium: boolean;
  roundsPlayed: number;
}) {
  const badges = useBadgeOverview();

  return (
    <div className="min-h-screen">
      <AppHeader title="Quiz littéraire" subtitle="Jeu culturel" back />

      <section className="px-6 pt-10 pb-8 bg-cream border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Règle du jeu
        </div>
        <h2 className="font-serif text-3xl font-black text-ink leading-tight mb-4">
          Incipits, auteurs, dates, personnages, figures.{" "}
          <span className="text-bordeaux">Tu choisis le terrain.</span>
        </h2>
        <p className="text-ink/70 text-[15px] leading-relaxed">
          {ROUND_SIZE} questions par partie, quatre propositions à chaque fois.
          Chaque bonne réponse alimente tes jalons culturels — pas d'XP, pas de
          streak, juste des clins d'œil quand tu croises un auteur, un siècle
          ou une figure de style.
        </p>

        {isPremium ? (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] uppercase tracking-widest text-gold font-black">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Premium · parties illimitées
          </div>
        ) : (
          <div className="mt-4 space-y-1">
            <div className="text-[11px] uppercase tracking-widest text-ink/50 font-bold">
              Aujourd'hui :{" "}
              {Math.min(roundsPlayed, FREE_QUOTAS.quizRounds)} /{" "}
              {FREE_QUOTAS.quizRounds} parties
            </div>
            <div className="text-[10px] text-ink/40 italic leading-snug max-w-sm">
              3 parties, c'est assez pour une pause — on ne vend pas ton temps.
            </div>
          </div>
        )}
      </section>

      {/* Panneau jalons — visible dès le début, même sans badges débloqués */}
      <section className="px-6 pt-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold">
              Tes jalons
            </div>
            <div className="font-serif text-lg font-black text-ink leading-tight">
              {badges.unlocked} / {badges.total} débloqués
            </div>
          </div>
          <Link
            href="/quiz/badges"
            className="text-[11px] uppercase tracking-widest text-bordeaux font-bold"
          >
            Tout voir →
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
          {badges.items.slice(0, 8).map((b) => (
            <div
              key={b.id}
              className={`shrink-0 w-24 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-center p-2 snap-start ${
                b.unlocked
                  ? "border-gold bg-gold/10 text-ink"
                  : "border-ink/10 bg-paper/60 text-ink/40"
              }`}
            >
              <div className="font-serif text-2xl font-black leading-none">
                {b.mark}
              </div>
              <div className="text-[9px] uppercase tracking-widest font-bold mt-1.5 leading-tight">
                {b.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {reachedFreeCap && (
        <section className="px-6 pt-6 pb-2">
          <div className="bg-ink text-paper rounded-3xl p-5 shadow-xl">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
              Plafond atteint
            </div>
            <div className="font-serif text-xl font-black mt-2 leading-snug">
              Tu as joué tes {FREE_QUOTAS.quizRounds} parties gratuites
              d'aujourd'hui.
            </div>
            <p className="text-sm text-paper/75 mt-2 leading-relaxed">
              Reviens demain pour une nouvelle journée — ou passe Premium pour
              enchaîner sans fin, débloquer le Mode série, et te mesurer à tout
              le corpus sans pause.
            </p>
            <Link
              href="/premium"
              className="mt-4 inline-block w-full text-center bg-gold text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-paper transition"
            >
              Activer Premium · 7 jours offerts
            </Link>
          </div>
        </section>
      )}

      <section className="px-6 py-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Choisis ta catégorie
        </div>
        <div className="space-y-3">
          {MODE_ORDER.map((mode, i) => {
            const count = poolFor(mode).length;
            return (
              <ModeCard
                key={mode}
                kicker={String(i + 1).padStart(2, "0")}
                mode={mode}
                count={count}
                onStart={onStart}
                // Pool vide (pas encore de questions sur cette catégorie) =
                // bouton désactivé visuellement plutôt qu'un clic sans effet.
                disabled={reachedFreeCap || count === 0}
                highlight={mode === "mix"}
              />
            );
          })}
        </div>
      </section>

      {/* Carte mode prof — discrete, à la fin pour ne pas distraire les
          joueurs casual mais visible pour les enseignants qui scrollent. */}
      <section className="px-6 pt-2">
        <Link
          href="/prof"
          className="block bg-cream/40 border border-ink/10 rounded-2xl p-4 hover:border-bordeaux transition"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-bordeaux font-bold">
                Tu enseignes ?
              </div>
              <div className="font-serif text-base font-bold text-ink leading-snug mt-1">
                Génère un quiz à imprimer pour ta classe
              </div>
              <div className="text-xs text-ink/60 mt-1">
                CC BY-NC 4.0 · libre de réutilisation
              </div>
            </div>
            <span className="text-ink/40 text-lg">→</span>
          </div>
        </Link>
      </section>

      <section className="px-6 pb-12">
        <Link
          href="/explore"
          className="block text-center mt-2 text-xs uppercase tracking-widest text-ink/50 font-semibold"
        >
          Pas prêt·e ? Va explorer les pitches
        </Link>
      </section>
    </div>
  );
}

function ModeCard({
  kicker,
  mode,
  count,
  onStart,
  disabled = false,
  highlight = false,
}: {
  kicker: string;
  mode: ModeId;
  count: number;
  onStart: (mode: ModeId) => void;
  disabled?: boolean;
  highlight?: boolean;
}) {
  const meta = MODE_META[mode];
  return (
    <button
      onClick={() => onStart(mode)}
      disabled={disabled}
      className={`w-full text-left rounded-2xl p-4 transition flex items-start gap-4 border-2 ${
        disabled
          ? "bg-paper/60 border-ink/5 text-ink/40 cursor-not-allowed"
          : highlight
            ? "bg-ink text-paper border-ink hover:bg-bordeaux hover:border-bordeaux"
            : "bg-paper border-ink/10 hover:border-bordeaux"
      }`}
    >
      <div
        className={`font-serif text-2xl font-black leading-none shrink-0 mt-0.5 w-10 ${
          disabled
            ? "text-ink/30"
            : highlight
              ? "text-gold"
              : "text-bordeaux"
        }`}
      >
        {kicker}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-lg font-bold">{meta.title}</div>
        <div className={`text-sm leading-snug mt-0.5 ${highlight ? "opacity-80" : "opacity-80"}`}>
          {meta.sub}
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold mt-2 opacity-60">
          {count} question{count > 1 ? "s" : ""}
        </div>
      </div>
      <span className={`text-2xl shrink-0 leading-none mt-1 ${highlight ? "text-gold" : "text-bordeaux/50"}`}>
        {meta.mark}
      </span>
    </button>
  );
}

function useBadgeOverview() {
  const [items, setItems] = useState<ReturnType<typeof listBadgesWithStatus>>(
    []
  );
  useEffect(() => {
    const refresh = () => setItems(listBadgesWithStatus());
    refresh();
    const onChange = () => refresh();
    window.addEventListener("incipit:badges:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("incipit:badges:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return {
    items,
    total: items.length,
    unlocked: items.filter((b) => b.unlocked).length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

function Playing({
  state,
  onPick,
  onNext,
  total,
}: {
  state: Extract<State, { phase: "playing" }>;
  onPick: (opt: string) => void;
  onNext: () => void;
  total: number;
}) {
  const { questions, index, picked, score, streak } = state;
  const q = questions[index];
  const answered = picked !== null;
  const meta = MODE_META[state.mode];
  const catMeta = CATEGORY_LABELS[q.lit.category];

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        title={`Question ${index + 1} / ${total}`}
        subtitle={
          streak >= 3
            ? `${streak} d'affilée`
            : score > 0
              ? `${score} / ${index}`
              : meta.title
        }
        back
      />

      <div className="h-1 bg-ink/5">
        <div
          className="h-full bg-bordeaux transition-all duration-500"
          style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <section className="flex-1 px-6 pt-8 pb-6 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
        <div className="absolute top-10 -right-10 w-48 h-48 rounded-full bg-bordeaux/10 blur-3xl" />
        <div className="relative max-w-md mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-[9px] uppercase tracking-[0.2em] font-black text-ink/70 mb-4">
            <span className="font-serif text-base leading-none">
              {catMeta.emoji}
            </span>
            {catMeta.title}
          </div>
          {q.lit.category === "opening" && (
            <div className="font-serif text-6xl text-bordeaux/30 leading-none mb-1">
              “
            </div>
          )}
          <blockquote className="font-serif text-[22px] leading-[1.35] text-ink italic px-2">
            {q.lit.prompt}
          </blockquote>
        </div>
      </section>

      <section className="px-5 pb-8 pt-4 space-y-3">
        {q.options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = opt === q.lit.answer;
          const showAsRight = answered && isCorrect;
          const showAsWrong = answered && isPicked && !isCorrect;

          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => onPick(opt)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 ${
                showAsRight
                  ? "border-sage bg-sage/10 text-ink"
                  : showAsWrong
                    ? "border-bordeaux bg-bordeaux/10 text-ink"
                    : answered
                      ? "border-ink/10 bg-paper text-ink/60"
                      : "border-ink/15 bg-paper text-ink hover:border-ink/50 active:scale-[0.99]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-base">{opt}</div>
              </div>
              {showAsRight && (
                <span className="text-sage text-xl shrink-0">✓</span>
              )}
              {showAsWrong && (
                <span className="text-bordeaux text-xl shrink-0">✗</span>
              )}
            </button>
          );
        })}
      </section>

      {answered && (
        <section className="px-6 pb-10 animate-fade-up">
          <div
            className={`rounded-2xl p-5 border ${
              picked === q.lit.answer
                ? "border-sage/40 bg-sage/5"
                : "border-bordeaux/30 bg-bordeaux/5"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/60 mb-1">
              {picked === q.lit.answer ? "Bien vu" : "Raté"}
            </div>
            <p className="font-serif text-lg font-bold text-ink leading-snug">
              {q.lit.answer}
            </p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed italic">
              {q.lit.explanation}
            </p>
          </div>
          <button
            onClick={onNext}
            className="mt-5 w-full py-4 rounded-full bg-ink text-paper font-serif text-sm uppercase tracking-widest font-bold hover:bg-bordeaux transition"
          >
            {index >= total - 1 ? "Voir mon score →" : "Question suivante →"}
          </button>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Done({
  mode,
  questions,
  score,
  bestStreak,
  answers,
  newlyUnlocked,
  isFirstSession,
  onReplay,
  onPickMode,
  reachedFreeCap,
  isPremium,
}: {
  mode: ModeId;
  questions: Question[];
  score: number;
  bestStreak: number;
  answers: { litId: string; picked: string; correct: boolean }[];
  newlyUnlocked: Badge[];
  isFirstSession: boolean;
  onReplay: () => void;
  onPickMode: () => void;
  reachedFreeCap: boolean;
  isPremium: boolean;
}) {
  const total = questions.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const modeLabel = MODE_META[mode].title;

  // Mehdi (panel beta) : "se faire rentrer dedans au premier essai, c'est la
  // sortie garantie". On adoucit la première partie — même verdict, tonalité
  // d'accueil. Les mauvais scores restent signalés, mais sans condescendance.
  const verdict = isFirstSession
    ? pct === 100
      ? {
          title: "Incroyable pour une première.",
          sub: "Score parfait sur ta partie d'intro. Respect.",
        }
      : pct >= 75
        ? {
            title: "Sacrée première.",
            sub: "Tu arrives avec des bagages. Reviens, on a tout pour nourrir.",
          }
        : pct >= 50
          ? {
              title: "Belle première.",
              sub: "Tu as l'œil, et c'est déjà beaucoup. On fait le reste ensemble.",
            }
          : pct >= 25
            ? {
                title: "On démarre ensemble.",
                sub: "Première partie : normal. Le corpus est à toi — chaque scroll compte.",
              }
            : {
                title: "Bienvenue.",
                sub: "Personne ne connaît tout, surtout pas à la première partie. Incipit est fait pour ça.",
              }
    : pct === 100
      ? {
          title: "Parfait.",
          sub: "T'as lu, ou t'as du flair d'anthologie. Respect.",
        }
      : pct >= 75
        ? {
            title: "Solide.",
            sub: "Tu connais tes classiques. On n'a rien à t'apprendre.",
          }
        : pct >= 50
          ? {
              title: "Pas mal.",
              sub: "Tu as l'œil. Il reste des titres à découvrir — on a ce qu'il faut.",
            }
          : pct >= 25
            ? {
                title: "On reprend.",
                sub: "Rien de grave. Un scroll de pitches et tu remontes la pente.",
              }
            : {
                title: "Jour sans.",
                sub: "Ça arrive. Reviens demain, le corpus ne bouge pas.",
              };

  const shareGrid = answers.map((a) => (a.correct ? "🟥" : "⬜")).join("");
  const shareText = `Incipit Quiz (${modeLabel}) — ${score}/${total} · ${shareGrid} · streak ${bestStreak}`;

  const share = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/quiz`;
    const payload = { title: "Incipit Quiz", text: shareText, url };
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share(payload);
        return;
      }
    } catch {
      // fallback
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      alert("Score copié dans le presse-papier.");
    } catch {
      window.prompt("Copie ton score :", `${shareText}\n${url}`);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Ton résultat" back />

      <section className="px-6 pt-10 pb-8 bg-gradient-to-b from-ink to-bordeaux text-paper text-center relative overflow-hidden">
        <div className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-4">
            Verdict · {modeLabel}
          </div>
          <div className="font-serif text-8xl font-black leading-none">
            {score}
            <span className="text-paper/50">/{total}</span>
          </div>
          <p className="mt-6 font-serif text-3xl font-black">{verdict.title}</p>
          <p className="mt-2 text-sm text-paper/80 italic leading-relaxed max-w-sm mx-auto">
            {verdict.sub}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-paper/10 border border-paper/20 text-xs uppercase tracking-widest font-bold">
            <span>Meilleure série · {bestStreak}</span>
            <span className="w-1 h-1 rounded-full bg-paper/50" />
            <span>{pct}%</span>
          </div>

          <div className="mt-6 font-mono text-xl tracking-widest">
            {shareGrid}
          </div>
        </div>
      </section>

      {/* Jalons nouvellement débloqués — s'il y en a */}
      {newlyUnlocked.length > 0 && (
        <section className="px-6 pt-6 pb-2">
          <div className="rounded-3xl bg-gold/15 border-2 border-gold p-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-black">
              Jalon{newlyUnlocked.length > 1 ? "s" : ""} débloqué
              {newlyUnlocked.length > 1 ? "s" : ""}
            </div>
            <div className="mt-3 space-y-3">
              {newlyUnlocked.map((b) => (
                <div key={b.id} className="flex items-start gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gold text-ink font-serif text-xl font-black flex items-center justify-center">
                    {b.mark}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-lg font-black text-ink leading-tight">
                      {b.name}
                    </div>
                    <div className="text-sm text-ink/75 italic leading-snug">
                      {b.tagline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/quiz/badges"
              className="inline-block mt-4 text-[11px] uppercase tracking-widest font-bold text-bordeaux"
            >
              Voir tous les jalons →
            </Link>
          </div>
        </section>
      )}

      <section className="px-6 py-6 space-y-3">
        <button
          onClick={share}
          className="w-full py-4 rounded-full bg-bordeaux text-paper font-serif font-bold text-sm uppercase tracking-widest hover:bg-ink transition"
        >
          Partager mon score
        </button>
        {reachedFreeCap ? (
          <Link
            href="/premium"
            className="block w-full py-4 rounded-full bg-gold text-ink font-serif font-black text-sm uppercase tracking-widest hover:bg-gold/90 transition text-center"
          >
            Passer Premium pour rejouer
          </Link>
        ) : (
          <button
            onClick={onReplay}
            className="w-full py-4 rounded-full border-2 border-ink text-ink font-serif font-bold text-sm uppercase tracking-widest hover:bg-ink/5 transition"
          >
            Rejouer · {modeLabel}
            {!isPremium && (
              <span className="ml-2 text-ink/40 text-xs">(gratuit)</span>
            )}
          </button>
        )}
        <button
          onClick={onPickMode}
          className="w-full min-h-[44px] py-3 text-xs uppercase tracking-widest text-ink/55 font-bold hover:text-ink transition"
        >
          Changer de catégorie
        </button>
      </section>

      <section className="px-6 py-4 border-t border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Corrigé
        </div>
        <ul className="space-y-3">
          {answers.map((a, i) => {
            const q = questions[i].lit;
            const matchedFiche =
              q.bookId && FICHE_IDS.has(q.bookId) ? q.bookId : null;

            return (
              <li
                key={i}
                className={`rounded-xl p-3 border ${
                  a.correct
                    ? "border-sage/30 bg-sage/5"
                    : "border-bordeaux/25 bg-bordeaux/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-ink/50">
                    Q{i + 1} · {CATEGORY_LABELS[q.category].title}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      a.correct ? "text-sage" : "text-bordeaux"
                    }`}
                  >
                    {a.correct ? "Correct" : "Raté"}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <div className="font-serif font-bold text-ink">
                    {q.prompt}
                  </div>
                  <div className="text-xs text-ink/70 mt-1">
                    Réponse :{" "}
                    <span className="font-bold text-ink">{q.answer}</span>
                  </div>
                  {!a.correct && (
                    <div className="text-xs text-ink/60 mt-0.5">
                      Tu avais répondu : {a.picked}
                    </div>
                  )}
                  <p className="text-xs text-ink/65 mt-2 italic leading-snug">
                    {q.explanation}
                  </p>
                </div>
                {matchedFiche && (
                  <Link
                    href={`/book/${matchedFiche}`}
                    className="inline-block mt-2 text-[11px] uppercase tracking-widest font-bold text-bordeaux"
                  >
                    Ouvrir la fiche →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-6 pt-4 pb-12">
        <Link
          href="/quiz/badges"
          className="block text-center text-xs uppercase tracking-widest text-bordeaux font-bold"
        >
          Voir mes jalons culturels →
        </Link>
      </section>
    </div>
  );
}
