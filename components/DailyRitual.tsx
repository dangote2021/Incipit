import Link from "next/link";
import {
  getDailyIncipit,
  incipitTeaser,
  formatDate,
} from "@/lib/daily-incipit";
import { ritualKindForDate, ritualLabel } from "@/lib/daily-ritual";
import { pickOfTheDay } from "@/lib/daily-content";
import { QUOTES, RAP_PUNCHLINES, KEY_PASSAGES, BOOKS } from "@/lib/mock-data";
import {
  LIT_QUESTIONS,
  buildOptions,
  CATEGORY_LABELS,
} from "@/lib/quiz-literature";
import StreakBadge from "@/components/StreakBadge";

// ─────────────────────────────────────────────────────────────────────────────
// DailyRitual — écran d'ouverture qui change selon le jour de la semaine.
// Remplace l'ancien DailyIncipit toujours identique (retour panel v8).
//
// Server Component pour que le crawler voie le bon contenu (SEO + partage).
// Chaque variante a le même "squelette" visuel (fond, overline, CTA) pour
// maintenir la reconnaissance — on varie le CONTENU, pas la grammaire.
// ─────────────────────────────────────────────────────────────────────────────

export default function DailyRitual() {
  const kind = ritualKindForDate();

  return (
    <section className="snap-start h-screen flex flex-col justify-between px-6 pt-20 pb-28 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
      <div className="absolute top-24 right-6 w-40 h-40 rounded-full bg-bordeaux/10 blur-3xl pointer-events-none" />

      {/* Streak en top — se monte après hydrate, slot stable pour ne pas jump */}
      <div className="relative">
        <StreakBadge />
      </div>

      {/* Contenu principal — pattern partagé : overline + hero + CTA */}
      <div className="relative">
        {renderVariant(kind)}
      </div>

      <div className="relative text-center text-ink/40 text-xs animate-bounce">
        ↓
      </div>
    </section>
  );
}

function renderVariant(kind: string) {
  switch (kind) {
    case "incipit":
      return <IncipitVariant />;
    case "quote":
      return <QuoteVariant />;
    case "punchline":
      return <PunchlineVariant />;
    case "miniquiz":
      return <MiniQuizVariant />;
    case "card":
      return <CardVariant />;
    case "passage":
      return <PassageVariant />;
    case "weekbook":
      return <WeekBookVariant />;
    default:
      return <IncipitVariant />;
  }
}

// ── Overline réutilisable ──────────────────────────────────────────────────
function Overline({ kindLabel, date }: { kindLabel: string; date: Date }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
          {kindLabel}
        </div>
        <div className="text-xs text-ink/50 mt-1 italic first-letter:uppercase">
          {formatDate(date)}
        </div>
      </div>
      <Link
        href="/incipit-du-jour"
        className="text-[10px] uppercase tracking-[0.25em] text-ink/60 font-bold bg-paper/80 backdrop-blur-md border border-ink/10 px-3 py-2 rounded-full hover:text-bordeaux transition"
      >
        Archive →
      </Link>
    </div>
  );
}

// ── LUNDI — Incipit ────────────────────────────────────────────────────────
function IncipitVariant() {
  const { book, date } = getDailyIncipit(0);
  const teaser = incipitTeaser(book, 200);
  return (
    <>
      <Overline kindLabel={ritualLabel("incipit")} date={date} />
      <div className="max-w-md mx-auto text-center">
        <div className="font-serif text-7xl text-bordeaux/30 leading-none mb-2">
          “
        </div>
        <blockquote className="font-serif text-[24px] leading-[1.3] text-ink italic">
          {teaser}
        </blockquote>
        <div className="mt-6 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
          {book.title} · {book.author} · {book.year}
        </div>
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Ouvrir {book.title}
        </Link>
      </div>
    </>
  );
}

// ── MARDI — Citation ───────────────────────────────────────────────────────
function QuoteVariant() {
  const quote = pickOfTheDay(QUOTES);
  const book = BOOKS.find((b) => b.id === quote.bookId) ?? BOOKS[0];
  return (
    <>
      <Overline kindLabel={ritualLabel("quote")} date={new Date()} />
      <div className="max-w-md mx-auto text-center">
        <div className="font-serif text-7xl text-gold/60 leading-none mb-2">
          “
        </div>
        <blockquote className="font-serif text-[26px] leading-[1.3] text-ink italic">
          {quote.text}
        </blockquote>
        {quote.context && (
          <div className="mt-3 text-[12px] text-ink/50 italic">
            — {quote.context}
          </div>
        )}
        <div className="mt-6 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
          {book.title} · {book.author}
        </div>
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Découvrir le livre
        </Link>
      </div>
    </>
  );
}

// ── MERCREDI — Punchline rap ───────────────────────────────────────────────
function PunchlineVariant() {
  const p = pickOfTheDay(RAP_PUNCHLINES);
  const parallel = p.literaryParallel;
  return (
    <>
      <Overline kindLabel={ritualLabel("punchline")} date={new Date()} />
      <div className="max-w-md mx-auto text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
          {p.artist} · {p.song} · {p.year}
        </div>
        <blockquote className="font-serif text-[20px] leading-[1.35] text-ink italic px-2">
          {p.punchlineTheme}
        </blockquote>
        {parallel && (
          <div className="mt-5 text-[12px] text-ink/70 leading-relaxed italic">
            Écho&nbsp;:{" "}
            <span className="font-semibold text-ink">
              {parallel.author} · {parallel.workTitle}
            </span>
          </div>
        )}
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <Link
          href="/punchlines"
          className="block w-full text-center bg-ink text-gold py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux hover:text-paper transition"
        >
          Lire l'analyse complète →
        </Link>
      </div>
    </>
  );
}

// ── JEUDI — Mini-quiz 1 question teaser ────────────────────────────────────
function MiniQuizVariant() {
  const q = pickOfTheDay(LIT_QUESTIONS);
  const opts = buildOptions(q);
  const cat = CATEGORY_LABELS[q.category];
  return (
    <>
      <Overline kindLabel={ritualLabel("miniquiz")} date={new Date()} />
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-[9px] uppercase tracking-[0.2em] font-black text-ink/70 mb-4">
          <span className="font-serif text-base leading-none">{cat.emoji}</span>
          {cat.title}
        </div>
        <blockquote className="font-serif text-xl font-black text-ink italic leading-snug mb-5 text-center">
          {q.prompt}
        </blockquote>
        <div className="space-y-2 mb-4">
          {opts.slice(0, 4).map((opt) => (
            <div
              key={opt}
              className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-2.5 text-ink/80 font-serif text-sm text-center"
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 max-w-sm mx-auto w-full">
        <Link
          href="/quiz"
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Jouer le quiz du jour →
        </Link>
      </div>
    </>
  );
}

// ── VENDREDI — Carte à partager ────────────────────────────────────────────
function CardVariant() {
  const quote = pickOfTheDay(QUOTES);
  const book = BOOKS.find((b) => b.id === quote.bookId) ?? BOOKS[0];
  return (
    <>
      <Overline kindLabel={ritualLabel("card")} date={new Date()} />
      <div className="max-w-md mx-auto text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Ta story de vendredi
        </div>
        <blockquote className="font-serif text-[22px] leading-[1.3] text-ink italic">
          « {quote.text} »
        </blockquote>
        <div className="mt-5 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
          {book.author} · {book.title}
        </div>
        <p className="mt-6 text-sm text-ink/65 italic max-w-xs mx-auto leading-relaxed">
          Génère la carte format story en un tap. Format 1080×1920, prêt pour
          Instagram, TikTok, WhatsApp.
        </p>
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <a
          href={`/api/incipit-card/${book.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Télécharger la carte ↓
        </a>
      </div>
    </>
  );
}

// ── SAMEDI — Passage clé ───────────────────────────────────────────────────
function PassageVariant() {
  const passage = KEY_PASSAGES.length > 0 ? pickOfTheDay(KEY_PASSAGES) : null;
  const book = passage
    ? BOOKS.find((b) => b.id === passage.bookId) ?? BOOKS[0]
    : BOOKS[0];
  return (
    <>
      <Overline kindLabel={ritualLabel("passage")} date={new Date()} />
      <div className="max-w-md mx-auto text-center">
        {passage ? (
          <>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
              {passage.title}
            </div>
            <p className="text-sm text-ink/75 leading-relaxed italic mb-4">
              {passage.context}
            </p>
            <blockquote className="font-serif text-[20px] leading-[1.35] text-ink italic">
              {passage.excerpt.length > 220
                ? `${passage.excerpt.slice(0, 220)}…`
                : passage.excerpt}
            </blockquote>
            <div className="mt-5 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
              {book.title} · {book.author}
            </div>
          </>
        ) : (
          <div className="text-ink/60 text-sm italic">
            Passage en préparation.
          </div>
        )}
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Lire tout le livre →
        </Link>
      </div>
    </>
  );
}

// ── DIMANCHE — Classique de la semaine ─────────────────────────────────────
function WeekBookVariant() {
  // Un livre "phare" par semaine, rotation déterministe sur tout le corpus.
  const book = pickOfTheDay(BOOKS);
  const teaser = incipitTeaser(book, 180);
  return (
    <>
      <Overline kindLabel={ritualLabel("weekbook")} date={new Date()} />
      <div className="max-w-md mx-auto text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Cette semaine on lit
        </div>
        <h2 className="font-serif text-3xl font-black text-ink leading-tight">
          {book.title}
        </h2>
        <div className="mt-1 text-[12px] uppercase tracking-widest text-ink/60 font-bold">
          {book.author} · {book.year}
        </div>
        <blockquote className="mt-5 font-serif text-[18px] leading-[1.35] text-ink/80 italic">
          « {teaser} »
        </blockquote>
      </div>
      <div className="mt-8 max-w-sm mx-auto w-full">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Commencer {book.title} →
        </Link>
      </div>
    </>
  );
}
