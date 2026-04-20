"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BOOKS } from "@/lib/mock-data";

function dayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export default function DailyIncipit() {
  const book = useMemo(() => BOOKS[dayIndex() % BOOKS.length], []);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="snap-start h-screen flex flex-col justify-between px-6 pt-20 pb-28 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
      <div className="absolute top-24 right-6 w-40 h-40 rounded-full bg-bordeaux/10 blur-3xl" />

      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
          Incipit du jour
        </div>
        <div className="text-xs text-ink/50 mt-1 italic first-letter:uppercase">
          {today}
        </div>
      </div>

      <div className="relative max-w-md mx-auto text-center">
        <div className="font-serif text-7xl text-bordeaux/30 leading-none mb-2">
          “
        </div>
        <blockquote className="font-serif text-[26px] leading-[1.3] text-ink italic">
          {book.openingLines.split(". ").slice(0, 2).join(". ") + "."}
        </blockquote>

        <div className="mt-8 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
          {book.title} · {book.author} · {book.year}
        </div>
      </div>

      <div className="relative max-w-sm mx-auto w-full space-y-3">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Ouvrir {book.title}
        </Link>
        <div className="flex items-center justify-center gap-2 text-[11px] text-ink/50">
          <span className="h-px w-8 bg-ink/20" />
          <span>ou continue vers les pitches du jour</span>
          <span className="h-px w-8 bg-ink/20" />
        </div>
        <div className="text-center text-ink/40 text-xs animate-bounce">↓</div>
      </div>
    </section>
  );
}
