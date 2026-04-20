"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/types";
import VibeBadge from "./VibeBadge";

export default function PitchCard({ book }: { book: Book }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <article
      className={`snap-start relative min-h-[calc(100vh-6rem)] flex flex-col justify-end bg-gradient-to-br ${book.cover} overflow-hidden`}
    >
      {/* Texture subtile */}
      <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)",
        }}
      />
      {/* Dégradé sombre pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="relative flex-1 flex flex-col justify-between px-6 py-8 text-paper">
        {/* Header — meta */}
        <div className="flex items-start justify-between animate-fade-up">
          <div className="flex flex-col gap-3">
            <VibeBadge vibe={book.vibe} />
            <div className="text-xs uppercase tracking-[0.2em] opacity-70 font-semibold">
              {book.year} · {book.pages} pages
            </div>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <button
              onClick={() => setLiked((v) => !v)}
              aria-label="J'aime"
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition ${
                liked
                  ? "bg-bordeaux text-paper scale-110"
                  : "bg-paper/15 backdrop-blur-sm hover:bg-paper/25"
              }`}
            >
              {liked ? "♥" : "♡"}
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              aria-label="Ajouter à la bibliothèque"
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition ${
                saved
                  ? "bg-gold text-ink scale-110"
                  : "bg-paper/15 backdrop-blur-sm hover:bg-paper/25"
              }`}
            >
              {saved ? "✓" : "+"}
            </button>
          </div>
        </div>

        {/* Cœur — hook + pitch */}
        <div className="mt-auto animate-fade-up">
          <div className="mb-3">
            <div className="text-[11px] uppercase tracking-[0.25em] font-bold opacity-80 mb-1">
              Incipit
            </div>
            <h2 className="font-serif text-4xl font-black leading-[1.05] ink-drop">
              {book.title}
            </h2>
            <p className="text-paper/80 mt-1 text-sm font-medium">
              {book.author}
            </p>
          </div>

          <p className="text-xl font-serif italic text-paper leading-snug mb-4">
            « {book.hook} »
          </p>

          <p className="text-[15px] leading-relaxed text-paper/90 mb-5">
            {book.pitch}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {book.themes.map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-paper/10 backdrop-blur-sm border border-paper/20"
              >
                #{t}
              </span>
            ))}
          </div>

          <Link
            href={`/book/${book.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-paper bg-paper/15 backdrop-blur-sm px-4 py-2.5 rounded-full hover:bg-paper/25 transition"
          >
            Voir la fiche →
          </Link>
        </div>
      </div>
    </article>
  );
}
