"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { RAP_PUNCHLINES, getBook } from "@/lib/mock-data";
import type { RapEra, RapPunchline } from "@/lib/types";

const ERAS: { key: RapEra | "all"; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "90s", label: "90s" },
  { key: "00s", label: "00s" },
  { key: "10s", label: "10s" },
  { key: "20s", label: "20s" },
];

const VIBE_ACCENT: Record<RapPunchline["vibe"], string> = {
  street: "bg-bordeaux/90",
  mélancolique: "bg-indigo-900/80",
  politique: "bg-emerald-900/80",
  virtuose: "bg-gold/90 text-ink",
  mystique: "bg-purple-900/80",
};

export default function PunchlinesPage() {
  const [era, setEra] = useState<RapEra | "all">("all");

  const items = useMemo(
    () =>
      era === "all"
        ? RAP_PUNCHLINES
        : RAP_PUNCHLINES.filter((p) => p.era === era),
    [era]
  );

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="bg-ink">
        <AppHeader
          title="Rap & Lit"
          subtitle="Les punchlines sont de la littérature. Prouvons-le."
          back
        />
      </div>

      {/* Hero intro */}
      <section className="px-6 pt-6 pb-8">
        <div className="max-w-xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
            Manifeste
          </div>
          <p className="font-serif text-xl leading-relaxed text-paper/90">
            Booba cite Baudelaire. Damso écrit comme Céline. Kery James plaide comme Hugo. On t'a raconté que la littérature, c'était un truc mort, sage, bien rangé — c'est faux. Le rap français est son enfant direct : mêmes figures de style, même urgence, même travail d'écriture.
          </p>
          <p className="text-sm text-paper/60 mt-4 leading-relaxed">
            Chaque punchline ici est décortiquée comme un poème : figures repérées, image centrale, parallèle avec un auteur classique. Tu cliques, tu écoutes, tu retournes lire.
          </p>
        </div>
      </section>

      {/* Filtres ères */}
      <div className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-paper/10">
        <div className="max-w-xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {ERAS.map((e) => (
            <button
              key={e.key}
              onClick={() => setEra(e.key)}
              className={`shrink-0 text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full transition ${
                era === e.key
                  ? "bg-gold text-ink"
                  : "bg-paper/10 text-paper/70 hover:bg-paper/20"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <main className="px-5 py-6 pb-28">
        <div className="max-w-xl mx-auto space-y-6">
          {items.map((p) => (
            <PunchlineCard key={p.id} p={p} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PunchlineCard({ p }: { p: RapPunchline }) {
  const parallelBook = p.literaryParallel.bookId
    ? getBook(p.literaryParallel.bookId)
    : null;

  return (
    <article className="rounded-3xl bg-paper/5 border border-paper/10 overflow-hidden backdrop-blur-sm">
      {/* Header : artiste + morceau */}
      <header className={`px-6 py-5 ${VIBE_ACCENT[p.vibe]}`}>
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80 mb-1">
          {p.artist}
        </div>
        <h2 className="font-serif text-2xl font-black leading-tight">
          {p.song}
        </h2>
        <div className="text-xs opacity-80 mt-1 tracking-wide">
          {p.album ? `${p.album} · ` : ""}
          {p.year}
        </div>
      </header>

      <div className="px-6 py-5 space-y-5">
        {/* Thème de la punchline */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-2">
            La punchline
          </div>
          <p className="font-serif text-[17px] leading-relaxed text-paper/95 italic">
            {p.punchlineTheme}
          </p>
        </div>

        {/* Figures de style */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-paper/50 font-bold mb-2">
            Figures de style
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.devices.map((d) => (
              <span
                key={d}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-paper/10 border border-paper/15 text-paper/85"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Analyse */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-paper/50 font-bold mb-2">
            Pourquoi c'est de la littérature
          </div>
          <p className="text-[14px] leading-relaxed text-paper/85">
            {p.analysis}
          </p>
        </div>

        {/* Pont classique */}
        <div className="rounded-2xl bg-cream/10 border border-paper/10 p-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-2">
            Parallèle classique
          </div>
          <div className="font-serif text-lg font-bold text-paper">
            {p.literaryParallel.author}
            {p.literaryParallel.workTitle && (
              <span className="text-paper/60 font-normal italic">
                {" · "}
                {p.literaryParallel.workTitle}
              </span>
            )}
          </div>
          <p className="text-[14px] text-paper/80 mt-2 leading-relaxed">
            {p.literaryParallel.bridge}
          </p>
          {parallelBook && (
            <Link
              href={`/book/${parallelBook.id}`}
              className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-gold hover:underline"
            >
              Ouvrir {parallelBook.title} →
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {p.listenUrl && (
            <a
              href={p.listenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-ink text-sm font-bold px-4 py-3 rounded-full hover:bg-gold/90 transition"
            >
              Écouter le morceau ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
