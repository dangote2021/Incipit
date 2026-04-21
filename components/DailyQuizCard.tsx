import Link from "next/link";
import { pickOfTheDay, todayUTC } from "@/lib/daily-content";
import {
  LIT_QUESTIONS,
  CATEGORY_LABELS,
  buildOptions,
} from "@/lib/quiz-literature";

// ─────────────────────────────────────────────────────────────────────────────
// Quiz du jour — une question tirée chaque jour du corpus LIT_QUESTIONS, de
// manière déterministe (pas de random, pas de drift SSR/client). L'utilisateur
// voit la question + les 4 propositions sans pouvoir répondre ici : on le
// pousse vers /quiz pour jouer le round complet (et retrouver ce tirage).
//
// Pourquoi un server component : le tirage vit côté serveur, donc le crawler
// et les caches CDN voient tous la même question (bon pour le SEO + le
// partage). Le jour de rotation s'aligne sur UTC (minuit UTC = reset).
// ─────────────────────────────────────────────────────────────────────────────

export default function DailyQuizCard() {
  const question = pickOfTheDay(LIT_QUESTIONS);
  const options = buildOptions(question);
  const cat = CATEGORY_LABELS[question.category];

  return (
    <section className="snap-start min-h-screen flex flex-col justify-center px-6 py-14 bg-paper relative overflow-hidden">
      <div className="absolute top-20 -left-16 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-bordeaux/10 blur-3xl" />

      <div className="relative max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-black">
            Quiz du jour
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
            {todayUTC()}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-[9px] uppercase tracking-[0.2em] font-black text-ink/70 mb-5">
          <span className="font-serif text-base leading-none">{cat.emoji}</span>
          {cat.title}
        </div>

        {question.category === "opening" && (
          <div className="font-serif text-6xl text-bordeaux/25 leading-none mb-1">
            “
          </div>
        )}

        <blockquote className="font-serif text-2xl font-black text-ink italic leading-snug mb-6">
          {question.prompt}
        </blockquote>

        <div className="space-y-2 mb-6">
          {options.map((opt) => (
            <div
              key={opt}
              className="rounded-2xl border border-ink/15 bg-cream/60 px-4 py-3 text-ink/80 font-serif text-sm"
            >
              {opt}
            </div>
          ))}
        </div>

        <Link
          href="/quiz"
          className="block w-full text-center py-4 rounded-full bg-ink text-paper text-xs uppercase tracking-widest font-black hover:bg-bordeaux transition"
        >
          Jouer la partie complète →
        </Link>
        <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
          8 questions · reset demain
        </div>
      </div>
    </section>
  );
}
