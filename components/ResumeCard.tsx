"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MY_LIBRARY, getBook } from "@/lib/mock-data";

/**
 * "Je reprends" — petite carte discrète affichée en haut du feed
 * quand l'utilisateur a un livre en cours. Pas de streak, pas de pression :
 * juste une main tendue pour retrouver sa page.
 */
export default function ResumeCard() {
  const resume = useMemo(() => {
    const current = MY_LIBRARY
      .filter((e) => e.status === "reading")
      .sort((a, b) => (b.lastReadAt ?? "").localeCompare(a.lastReadAt ?? ""))[0];
    if (!current) return null;
    const book = getBook(current.bookId);
    if (!book) return null;
    return { book, entry: current };
  }, []);

  if (!resume) return null;

  const { book, entry } = resume;

  return (
    <section className="snap-start relative min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 bg-cream">
      <Link
        href={`/book/${book.id}/read`}
        className={`group relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${book.cover} p-6 text-paper block`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/80 mb-3">
            Tu étais en train de lire
          </div>
          <h3 className="font-serif text-3xl font-black leading-tight ink-drop">
            {book.title}
          </h3>
          <p className="text-paper/80 text-sm mt-1">{book.author}</p>

          {entry.lastChapter && (
            <p className="mt-6 text-[13px] text-paper/90 italic">
              Reprise à {entry.lastChapter}
            </p>
          )}

          {typeof entry.progress === "number" && (
            <div className="mt-3">
              <div className="h-1 rounded-full bg-paper/20 overflow-hidden">
                <div
                  className="h-full bg-gold"
                  style={{ width: `${entry.progress}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-paper/70 tracking-wide">
                {entry.progress}% · {entry.minutesRead ?? 0} min de lecture
              </div>
            </div>
          )}

          <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold bg-paper/15 backdrop-blur-sm px-4 py-2.5 rounded-full group-hover:bg-paper/25 transition">
            Reprendre là où tu en étais →
          </div>
        </div>
      </Link>

      <div className="absolute bottom-6 left-0 right-0 text-center text-ink/40 text-xs animate-bounce pointer-events-none">
        ↓ ou passe au feed du jour
      </div>
    </section>
  );
}
