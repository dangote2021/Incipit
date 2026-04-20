"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import CharacterSheet from "@/components/CharacterSheet";
import {
  getBook,
  getCharactersForBook,
  getPassagesForBook,
} from "@/lib/mock-data";

export default function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const book = getBook(id);
  if (!book) notFound();

  const characters = getCharactersForBook(id);
  const passages = getPassagesForBook(id);
  const [passageIdx, setPassageIdx] = useState(0);
  const [charsOpen, setCharsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

  const p = passages[passageIdx];
  const fontClass =
    fontSize === "sm"
      ? "text-[15px] leading-[1.7]"
      : fontSize === "md"
      ? "text-[17px] leading-[1.75]"
      : "text-[20px] leading-[1.8]";

  return (
    <div className="min-h-screen bg-paper paper-texture relative">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md border-b border-ink/10 px-4 py-3 flex items-center justify-between">
        <Link
          href={`/book/${book.id}`}
          className="text-xs uppercase tracking-widest text-ink/60 font-bold px-2 py-1"
        >
          ← Sortir
        </Link>
        <div className="text-center min-w-0 px-2">
          <div className="font-serif font-bold text-ink text-sm truncate">
            {book.title}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink/50">
            {p?.chapter ?? "Passage"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFontSize(s)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                fontSize === s
                  ? "bg-ink text-paper"
                  : "bg-ink/5 text-ink/60"
              }`}
            >
              A{s === "sm" ? "-" : s === "lg" ? "+" : ""}
            </button>
          ))}
        </div>
      </header>

      {/* Passage en cours de lecture */}
      <main className="max-w-[620px] mx-auto px-6 py-8 pb-32">
        {p && (
          <article>
            <div className="mb-8">
              <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mb-2">
                Passage {p.order} · {p.readingMinutes} min de lecture
              </div>
              <h1 className="font-serif text-3xl font-black text-ink leading-tight">
                {p.title}
              </h1>
              <p className="text-sm text-ink/70 italic mt-3 leading-relaxed">
                {p.context}
              </p>
            </div>

            <div className="h-px bg-ink/10 my-8" />

            <blockquote
              className={`font-serif text-ink ${fontClass} whitespace-pre-line`}
            >
              {p.excerpt}
            </blockquote>

            <div className="mt-10 text-[11px] uppercase tracking-widest text-ink/50 font-bold text-center">
              — {book.author}, {book.title}
            </div>
          </article>
        )}

        {/* Nav passages */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => setPassageIdx((i) => Math.max(0, i - 1))}
            disabled={passageIdx === 0}
            className="text-xs uppercase tracking-widest font-bold text-ink/60 disabled:opacity-30 px-3 py-2"
          >
            ← Précédent
          </button>
          <span className="text-xs text-ink/50">
            {passageIdx + 1} / {passages.length}
          </span>
          <button
            onClick={() =>
              setPassageIdx((i) => Math.min(passages.length - 1, i + 1))
            }
            disabled={passageIdx === passages.length - 1}
            className="text-xs uppercase tracking-widest font-bold text-bordeaux disabled:opacity-30 px-3 py-2"
          >
            Suivant →
          </button>
        </div>
      </main>

      {/* Bouton flottant Personnages */}
      {characters.length > 0 && (
        <button
          onClick={() => setCharsOpen(true)}
          className="fixed bottom-8 right-6 z-20 bg-sage text-paper rounded-full shadow-xl px-5 py-3 flex items-center gap-2 hover:scale-105 transition"
        >
          <span className="text-xl">🎭</span>
          <span className="text-xs uppercase tracking-widest font-bold">
            Personnages
          </span>
        </button>
      )}

      <CharacterSheet
        characters={characters}
        open={charsOpen}
        onClose={() => setCharsOpen(false)}
      />
    </div>
  );
}
