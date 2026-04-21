"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { BOOKS } from "@/lib/mock-data";
import {
  QUIZ_INCIPITS,
  BY_LEVEL,
  LEVEL_LABELS,
  type QuizIncipit,
  type QuizLevel,
} from "@/lib/quiz-incipits";

type Question = {
  book: QuizIncipit;
  options: QuizIncipit[];
};

const ROUND_SIZE = 8;

// Les 12 fiches Incipit : seuls ces ids ont une /book/[id] dédiée.
// Utilisé dans le corrigé pour n'afficher le lien "Ouvrir la fiche" que quand
// on a vraiment quelque chose à montrer.
const FICHE_IDS = new Set(BOOKS.map((b) => b.id));

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeRound(level: QuizLevel | "all"): Question[] {
  const pool = level === "all" ? QUIZ_INCIPITS : BY_LEVEL[level];
  const picked = shuffle(pool).slice(0, Math.min(ROUND_SIZE, pool.length));
  // Les distracteurs viennent du même niveau si possible, sinon on élargit.
  const distractorPool =
    pool.length >= 4 ? pool : QUIZ_INCIPITS;
  return picked.map((book) => {
    const distractors = shuffle(
      distractorPool.filter((b) => b.id !== book.id)
    ).slice(0, 3);
    const options = shuffle([book, ...distractors]);
    return { book, options };
  });
}

function firstLines(book: QuizIncipit): string {
  const sentences = book.openingLines.split(/\. |\n/).filter(Boolean);
  const out = sentences.slice(0, 2).join(". ").replace(/\.*$/, "");
  return out + ".";
}

type State =
  | { phase: "intro" }
  | {
      phase: "playing";
      level: QuizLevel | "all";
      questions: Question[];
      index: number;
      picked: string | null;
      score: number;
      streak: number;
      bestStreak: number;
      answers: { bookId: string; pickedId: string; correct: boolean }[];
    }
  | {
      phase: "done";
      level: QuizLevel | "all";
      questions: Question[];
      score: number;
      bestStreak: number;
      answers: { bookId: string; pickedId: string; correct: boolean }[];
    };

export default function QuizPage() {
  const [state, setState] = useState<State>({ phase: "intro" });

  const start = (level: QuizLevel | "all") => {
    const questions = makeRound(level);
    setState({
      phase: "playing",
      level,
      questions,
      index: 0,
      picked: null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answers: [],
    });
  };

  const pick = (opt: QuizIncipit) => {
    if (state.phase !== "playing" || state.picked) return;
    const current = state.questions[state.index];
    const correct = opt.id === current.book.id;
    const nextScore = state.score + (correct ? 1 : 0);
    const nextStreak = correct ? state.streak + 1 : 0;
    const nextBest = Math.max(state.bestStreak, nextStreak);
    setState({
      ...state,
      picked: opt.id,
      score: nextScore,
      streak: nextStreak,
      bestStreak: nextBest,
      answers: [
        ...state.answers,
        { bookId: current.book.id, pickedId: opt.id, correct },
      ],
    });
  };

  const next = () => {
    if (state.phase !== "playing") return;
    const isLast = state.index >= state.questions.length - 1;
    if (isLast) {
      setState({
        phase: "done",
        level: state.level,
        questions: state.questions,
        score: state.score,
        bestStreak: state.bestStreak,
        answers: state.answers,
      });
    } else {
      setState({ ...state, index: state.index + 1, picked: null });
    }
  };

  if (state.phase === "intro") return <Intro onStart={start} />;
  if (state.phase === "done")
    return (
      <Done
        level={state.level}
        questions={state.questions}
        score={state.score}
        bestStreak={state.bestStreak}
        answers={state.answers}
        onReplay={() => start(state.level)}
        onPickLevel={() => setState({ phase: "intro" })}
      />
    );

  return (
    <Playing state={state} onPick={pick} onNext={next} total={ROUND_SIZE} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: (level: QuizLevel | "all") => void }) {
  return (
    <div className="min-h-screen">
      <AppHeader title="Devine l'incipit" subtitle="Jeu littéraire" back />

      <section className="px-6 pt-10 pb-8 bg-cream border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Règle du jeu
        </div>
        <h2 className="font-serif text-3xl font-black text-ink leading-tight mb-4">
          On te montre les premières lignes.{" "}
          <span className="text-bordeaux">Tu devines le livre.</span>
        </h2>
        <p className="text-ink/70 text-[15px] leading-relaxed">
          {ROUND_SIZE} incipits tirés au sort dans un corpus de {QUIZ_INCIPITS.length}.
          Quatre propositions par question. Tu valides, on te dit si tu as eu
          l'œil. Un bon score ? Tu partages. Un mauvais ? On te donne 12 pitches
          pour rattraper.
        </p>
      </section>

      <section className="px-6 py-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Choisis ton niveau
        </div>
        <div className="space-y-3">
          <LevelCard
            kicker="01"
            level="easy"
            count={BY_LEVEL.easy.length}
            onStart={onStart}
          />
          <LevelCard
            kicker="02"
            level="medium"
            count={BY_LEVEL.medium.length}
            onStart={onStart}
          />
          <LevelCard
            kicker="03"
            level="hard"
            count={BY_LEVEL.hard.length}
            onStart={onStart}
          />
          <button
            onClick={() => onStart("all")}
            className="w-full text-left bg-ink text-paper rounded-2xl p-4 hover:bg-bordeaux transition"
          >
            <div className="text-[10px] uppercase tracking-widest font-bold text-gold mb-1">
              Mode libre
            </div>
            <div className="font-serif font-bold text-lg leading-tight">
              Tout le corpus mélangé
            </div>
            <div className="text-xs text-paper/70 mt-1">
              {QUIZ_INCIPITS.length} incipits, tirage au hasard, tous niveaux confondus.
            </div>
          </button>
        </div>
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

function LevelCard({
  kicker,
  level,
  count,
  onStart,
}: {
  kicker: string;
  level: QuizLevel;
  count: number;
  onStart: (level: QuizLevel) => void;
}) {
  const meta = LEVEL_LABELS[level];
  return (
    <button
      onClick={() => onStart(level)}
      className="w-full text-left bg-paper border-2 border-ink/10 hover:border-bordeaux rounded-2xl p-4 transition flex items-start gap-4"
    >
      <div className="font-serif text-2xl font-black text-bordeaux leading-none shrink-0 mt-0.5 w-10">
        {kicker}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-lg font-bold text-ink">
          {meta.title}
        </div>
        <div className="text-sm text-ink/65 leading-snug mt-0.5">
          {meta.sub}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-ink/45 font-bold mt-2">
          {count} incipits
        </div>
      </div>
      <span className="text-ink/30 text-xl shrink-0 mt-1">→</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Playing({
  state,
  onPick,
  onNext,
  total,
}: {
  state: Extract<State, { phase: "playing" }>;
  onPick: (b: QuizIncipit) => void;
  onNext: () => void;
  total: number;
}) {
  const { questions, index, picked, score, streak } = state;
  const q = questions[index];
  const answered = picked !== null;
  const lines = useMemo(() => firstLines(q.book), [q.book]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        title={`Question ${index + 1} / ${total}`}
        subtitle={
          streak >= 3
            ? `${streak} d'affilée`
            : score > 0
              ? `${score} / ${index}`
              : "À toi de jouer"
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
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-4">
            Qui a écrit ça ?
          </div>
          <div className="font-serif text-6xl text-bordeaux/30 leading-none mb-2">
            “
          </div>
          <blockquote className="font-serif text-[22px] leading-[1.4] text-ink italic">
            {lines}
          </blockquote>
        </div>
      </section>

      <section className="px-5 pb-8 pt-4 space-y-3">
        {q.options.map((opt) => {
          const isPicked = picked === opt.id;
          const isCorrect = opt.id === q.book.id;
          const showAsRight = answered && isCorrect;
          const showAsWrong = answered && isPicked && !isCorrect;

          return (
            <button
              key={opt.id}
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
                <div className="font-serif font-bold text-base truncate">
                  {opt.title}
                </div>
                <div className="text-xs text-ink/60 truncate">
                  {opt.author} · {opt.year}
                </div>
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
              picked === q.book.id
                ? "border-sage/40 bg-sage/5"
                : "border-bordeaux/30 bg-bordeaux/5"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/60 mb-1">
              {picked === q.book.id ? "Bien vu" : "Raté"}
            </div>
            <p className="font-serif text-lg font-bold text-ink leading-snug">
              {q.book.title} — {q.book.author}
            </p>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed italic">
              {q.book.hook}
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
  level,
  questions,
  score,
  bestStreak,
  answers,
  onReplay,
  onPickLevel,
}: {
  level: QuizLevel | "all";
  questions: Question[];
  score: number;
  bestStreak: number;
  answers: { bookId: string; pickedId: string; correct: boolean }[];
  onReplay: () => void;
  onPickLevel: () => void;
}) {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const levelLabel =
    level === "all" ? "Mode libre" : LEVEL_LABELS[level].title;

  const verdict =
    pct === 100
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
                title: "On débute.",
                sub: "Normal. Tu vas nous rattraper ça avec 12 pitches.",
              }
            : {
                title: "Aïe.",
                sub: "Aucun souci, c'est pour ça qu'Incipit existe. Scroll et apprends.",
              };

  const shareGrid = answers
    .map((a) => (a.correct ? "🟥" : "⬜"))
    .join("");

  const shareText = `Incipit Quiz (${levelLabel}) — ${score}/${total} · ${shareGrid} · streak ${bestStreak}`;

  const share = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/quiz`;
    const payload = {
      title: "Incipit Quiz",
      text: shareText,
      url,
    };
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
            Verdict · {levelLabel}
          </div>
          <div className="font-serif text-8xl font-black leading-none">
            {score}
            <span className="text-paper/50">/{total}</span>
          </div>
          <p className="mt-6 font-serif text-3xl font-black">
            {verdict.title}
          </p>
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

      <section className="px-6 py-6 space-y-3">
        <button
          onClick={share}
          className="w-full py-4 rounded-full bg-bordeaux text-paper font-serif font-bold text-sm uppercase tracking-widest hover:bg-ink transition"
        >
          Partager mon score
        </button>
        <button
          onClick={onReplay}
          className="w-full py-4 rounded-full border-2 border-ink text-ink font-serif font-bold text-sm uppercase tracking-widest hover:bg-ink/5 transition"
        >
          Rejouer · {levelLabel}
        </button>
        <button
          onClick={onPickLevel}
          className="w-full py-3 text-xs uppercase tracking-widest text-ink/55 font-bold hover:text-ink transition"
        >
          Changer de niveau
        </button>
      </section>

      <section className="px-6 py-4 border-t border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Corrigé
        </div>
        <ul className="space-y-3">
          {answers.map((a, i) => {
            const q = questions[i];
            const pickedBook = q.options.find((o) => o.id === a.pickedId)!;
            const bookFicheId = FICHE_IDS.has(q.book.id) ? q.book.id : null;
            // Certains ids du quiz sont préfixés "q-" — on tente aussi la
            // correspondance sans préfixe pour lier vers /book/[id] si elle
            // existe parmi les 12 fiches.
            const stripped = q.book.id.replace(/^q-/, "");
            const matchedFiche =
              bookFicheId ?? (FICHE_IDS.has(stripped) ? stripped : null);

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
                    Q{i + 1}
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
                    {q.book.title} — {q.book.author}
                  </div>
                  {!a.correct && (
                    <div className="text-xs text-ink/60 mt-1">
                      Tu avais répondu : {pickedBook.title}
                    </div>
                  )}
                  <p className="text-xs text-ink/65 mt-2 italic leading-snug">
                    {q.book.hook}
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
          href="/explore"
          className="block text-center text-xs uppercase tracking-widest text-ink/50 font-semibold"
        >
          Retour à l'exploration
        </Link>
      </section>
    </div>
  );
}
