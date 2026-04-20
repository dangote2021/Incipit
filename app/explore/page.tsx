"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import QuoteStoryCard from "@/components/QuoteStoryCard";
import {
  BOOKS,
  MOODS,
  QUOTES,
  CHALLENGES,
  KEY_PASSAGES,
  getBook,
} from "@/lib/mock-data";
import type { Mood } from "@/lib/types";

type Tab = "themes" | "quotes" | "passages" | "challenges";

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "themes", label: "Thèmes", emoji: "🧭" },
  { key: "quotes", label: "Citations", emoji: "✦" },
  { key: "passages", label: "Passages clés", emoji: "📖" },
  { key: "challenges", label: "Défis", emoji: "🏆" },
];

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("themes");

  return (
    <>
      <AppHeader
        title="Explorer"
        subtitle="Des angles pour entrer dans les livres"
      />

      <main className="px-5 pt-3 pb-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full transition ${
                tab === t.key
                  ? "bg-ink text-paper"
                  : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              <span className="mr-1.5">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "themes" && <ThemesTab />}
        {tab === "quotes" && <QuotesTab />}
        {tab === "passages" && <PassagesTab />}
        {tab === "challenges" && <ChallengesTab />}
      </main>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// THEMES — parcours thématiques transversaux
// ──────────────────────────────────────────────────────────────────────────────

function ThemesTab() {
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  const booksForMood = useMemo(
    () =>
      activeMood
        ? BOOKS.filter((b) => b.moods.includes(activeMood))
        : [],
    [activeMood]
  );

  return (
    <section>
      <Link
        href="/punchlines"
        className="block relative overflow-hidden rounded-2xl p-5 mb-5 bg-ink text-paper border border-gold/30 hover:border-gold/60 transition group"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(218,165,32,0.5) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(139,0,0,0.6) 0%, transparent 50%)",
          }}
        />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">
            Nouveau · Rap & Lit
          </div>
          <h3 className="font-serif text-xl font-bold leading-tight mb-1">
            Booba cite Baudelaire. Damso écrit comme Céline.
          </h3>
          <p className="text-sm text-paper/85 leading-relaxed">
            Punchlines de rap français décortiquées : figures de style, parallèles avec les classiques. La littérature est aussi punchy que le rap.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-gold group-hover:underline">
            Lire les analyses →
          </div>
        </div>
      </Link>

      <div className="bg-gradient-to-br from-bordeaux to-ink text-paper rounded-2xl p-5 mb-5">
        <div className="text-[10px] uppercase tracking-widest text-paper/70 font-bold mb-1">
          L'envie du jour
        </div>
        <h3 className="font-serif text-xl font-bold leading-tight mb-1">
          Quelle est ton envie du jour ?
        </h3>
        <p className="text-sm text-paper/85 leading-relaxed">
          Choisis une tonalité ci-dessous. On te propose les livres qui
          accompagnent le mieux ton état d'esprit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((m) => {
          const count = BOOKS.filter((b) => b.moods.includes(m.key)).length;
          return (
            <button
              key={m.key}
              onClick={() =>
                setActiveMood((prev) => (prev === m.key ? null : m.key))
              }
              className={`group relative overflow-hidden rounded-2xl p-4 text-left border transition ${
                activeMood === m.key
                  ? "border-ink/40 bg-ink text-paper"
                  : "border-ink/10 bg-paper hover:border-ink/25"
              }`}
            >
              <div className="text-2xl mb-1.5">{m.emoji}</div>
              <div className="font-serif text-lg font-bold leading-tight">
                {m.label}
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeMood === m.key ? "text-paper/70" : "text-ink/50"
                }`}
              >
                {count} livre{count > 1 ? "s" : ""}
              </div>
            </button>
          );
        })}
      </div>

      {activeMood && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-xl font-bold text-ink">
              {MOODS.find((m) => m.key === activeMood)?.label}
            </h3>
            <button
              onClick={() => setActiveMood(null)}
              className="text-xs uppercase tracking-widest text-ink/50 font-bold"
            >
              Fermer
            </button>
          </div>
          <ul className="space-y-3">
            {booksForMood.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/book/${b.id}`}
                  className="flex gap-3 items-center bg-paper border border-ink/10 rounded-2xl p-3 hover:border-ink/25 transition"
                >
                  <BookCover book={b} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-base font-bold text-ink truncate">
                      {b.title}
                    </div>
                    <div className="text-xs text-ink/60 mb-1">
                      {b.author} · {b.year}
                    </div>
                    <div className="text-xs text-ink/70 line-clamp-2 italic">
                      « {b.hook} »
                    </div>
                  </div>
                  <span className="text-ink/40">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// QUOTES — cartes swipeables
// ──────────────────────────────────────────────────────────────────────────────

function QuotesTab() {
  const [i, setI] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);
  const q = QUOTES[i];
  const book = getBook(q.bookId);
  if (!book) return null;

  return (
    <section>
      <p className="text-sm text-ink/70 leading-relaxed mb-5">
        Des phrases qui tiennent seules. Swipe pour en avoir une autre, ou
        partage-la en story.
      </p>

      <div
        className={`relative rounded-3xl p-7 pb-6 bg-gradient-to-br ${book.cover} text-paper book-shadow min-h-[360px] flex flex-col justify-between`}
      >
        <div>
          <div className="text-paper/70 text-4xl font-serif leading-none mb-3">
            “
          </div>
          <p className="font-serif text-xl leading-snug italic">
            {q.text}
          </p>
          {q.context && (
            <div className="mt-3 text-xs text-paper/60 uppercase tracking-widest">
              {q.context}
            </div>
          )}
        </div>
        <div className="mt-8 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-paper/60 font-bold">
              Extrait de
            </div>
            <div className="font-serif text-lg font-bold">{book.title}</div>
            <div className="text-xs text-paper/80">
              {book.author}
            </div>
          </div>
          <Link
            href={`/book/${book.id}`}
            className="bg-paper/20 backdrop-blur border border-paper/30 text-paper text-xs uppercase tracking-widest font-bold px-3 py-2 rounded-full hover:bg-paper/30 transition"
          >
            Le livre →
          </Link>
        </div>
      </div>

      {/* CTA Story */}
      <button
        onClick={() => setStoryOpen(true)}
        className="mt-4 w-full bg-ink text-paper rounded-2xl py-4 flex items-center justify-center gap-3 hover:bg-bordeaux transition group"
      >
        <span className="text-xl">📲</span>
        <span className="text-xs uppercase tracking-widest font-bold">
          Partager en story
        </span>
        <span className="text-paper/60 text-xs group-hover:translate-x-1 transition">
          →
        </span>
      </button>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setI((prev) => (prev - 1 + QUOTES.length) % QUOTES.length)}
          className="text-xs uppercase tracking-widest font-bold text-ink/60 px-3 py-2"
          aria-label="Précédent"
        >
          ← Précédent
        </button>
        <span className="text-xs text-ink/50">
          {i + 1} / {QUOTES.length}
        </span>
        <button
          onClick={() => setI((prev) => (prev + 1) % QUOTES.length)}
          className="text-xs uppercase tracking-widest font-bold text-bordeaux px-3 py-2"
          aria-label="Suivant"
        >
          Suivante →
        </button>
      </div>

      <QuoteStoryCard
        quote={q}
        book={book}
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
      />
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PASSAGES — extraits authentiques + pitch de mise en contexte
// ──────────────────────────────────────────────────────────────────────────────

function PassagesTab() {
  const bookIds = Array.from(new Set(KEY_PASSAGES.map((p) => p.bookId)));
  const [activeBookId, setActiveBookId] = useState<string>(bookIds[0]);
  const book = getBook(activeBookId);
  const passages = KEY_PASSAGES.filter((p) => p.bookId === activeBookId).sort(
    (a, b) => a.order - b.order
  );

  return (
    <section>
      <div className="bg-cream/60 border border-dust rounded-2xl p-4 mb-5">
        <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mb-1">
          Le principe
        </div>
        <p className="text-sm text-ink/80 leading-relaxed">
          On sélectionne 3 à 5 extraits <em className="font-serif">authentiques</em>,
          courts et puissants. On te dit pourquoi ce passage compte. Tu lis du
          vrai texte — pas une paraphrase. On t'accompagne, on ne te remplace
          pas.
        </p>
      </div>

      {/* Sélecteur de livre */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar -mx-5 px-5">
        {bookIds.map((id) => {
          const b = getBook(id);
          if (!b) return null;
          return (
            <button
              key={id}
              onClick={() => setActiveBookId(id)}
              className={`shrink-0 text-xs uppercase tracking-widest font-bold px-3 py-2 rounded-full transition ${
                activeBookId === id
                  ? "bg-bordeaux text-paper"
                  : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              {b.title}
            </button>
          );
        })}
      </div>

      {book && (
        <div className="flex items-center gap-3 mb-5">
          <BookCover book={book} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="font-serif text-xl font-bold text-ink leading-tight">
              {book.title}
            </div>
            <div className="text-xs text-ink/60">
              {book.author} · {book.year}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-ink/50 font-bold">
              {passages.length} passages · env.{" "}
              {passages.reduce((s, p) => s + p.readingMinutes, 0)} min
            </div>
          </div>
        </div>
      )}

      <ol className="space-y-5">
        {passages.map((p) => (
          <li
            key={p.id}
            className="bg-paper border border-ink/10 rounded-2xl overflow-hidden"
          >
            <div className="px-5 pt-4 pb-3 border-b border-ink/10 bg-cream/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
                    Passage {p.order} · {p.readingMinutes} min
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink leading-tight mt-1">
                    {p.title}
                  </h3>
                  {p.chapter && (
                    <div className="text-[11px] text-ink/50 mt-0.5 italic">
                      {p.chapter}
                    </div>
                  )}
                </div>
                <div className="text-2xl text-ink/30 font-serif leading-none">
                  0{p.order}
                </div>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mt-3">
                {p.context}
              </p>
            </div>
            <blockquote className="px-5 py-5 font-serif text-[17px] leading-relaxed text-ink relative">
              <span className="absolute top-0 left-3 text-5xl text-bordeaux/20 font-serif leading-none">
                “
              </span>
              <span className="relative">{p.excerpt}</span>
            </blockquote>
          </li>
        ))}
      </ol>

      {book && (
        <Link
          href={`/book/${book.id}`}
          className="mt-5 block text-center bg-ink text-paper text-xs uppercase tracking-widest font-bold px-5 py-3 rounded-full hover:bg-ink/90 transition"
        >
          Aller à la fiche de {book.title} →
        </Link>
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// CHALLENGES — défis saisonniers
// ──────────────────────────────────────────────────────────────────────────────

function ChallengesTab() {
  return (
    <section>
      <p className="text-sm text-ink/70 leading-relaxed mb-5">
        Des défis pensés comme des parcours, pas comme des compteurs. On lit
        pour de vrai — ensemble.
      </p>

      <ul className="space-y-4">
        {CHALLENGES.map((c) => (
          <li
            key={c.id}
            className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${c.accent} text-paper book-shadow`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-paper/20 backdrop-blur px-2 py-0.5 rounded-full">
                    {c.season}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold leading-tight">
                  {c.title}
                </h3>
                <p className="font-serif italic text-sm text-paper/85 mt-1">
                  « {c.tagline} »
                </p>
              </div>
            </div>

            <p className="text-sm text-paper/85 leading-relaxed mt-3">
              {c.description}
            </p>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              {c.bookIds.map((id) => {
                const b = getBook(id);
                if (!b) return null;
                return (
                  <Link
                    key={id}
                    href={`/book/${id}`}
                    className="shrink-0 bg-paper/15 backdrop-blur border border-paper/20 rounded-xl px-3 py-2 text-xs font-serif hover:bg-paper/25 transition"
                  >
                    {b.title}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-paper/70">
                {c.participants.toLocaleString("fr-FR")} participants
                {typeof c.myProgress === "number" && (
                  <>
                    {" · "}
                    <span className="text-paper font-bold">
                      {c.myProgress} / {c.bookIds.length}
                    </span>
                  </>
                )}
              </div>
              <button className="bg-paper text-ink text-xs uppercase tracking-widest font-bold px-3 py-2 rounded-full hover:bg-paper/90 transition">
                {typeof c.myProgress === "number" ? "Continuer" : "Rejoindre"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
