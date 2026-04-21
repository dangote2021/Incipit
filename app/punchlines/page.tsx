"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { RAP_PUNCHLINES, getBook } from "@/lib/mock-data";
import type { RapEra, RapPunchline } from "@/lib/types";
import { usePremium, FREE_QUOTAS } from "@/lib/premium";

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
  const { isPremium, hydrated } = usePremium();

  const filtered = useMemo(
    () =>
      era === "all"
        ? RAP_PUNCHLINES
        : RAP_PUNCHLINES.filter((p) => p.era === era),
    [era]
  );

  // Free : on affiche seulement les N premières cartes après filtre,
  // Premium : tout. Ça laisse le plaisir de découvrir, mais on fait miroiter.
  const cap = FREE_QUOTAS.punchlineCards;
  const isGated = hydrated && !isPremium && filtered.length > cap;
  const items = isGated ? filtered.slice(0, cap) : filtered;
  const hiddenCount = filtered.length - items.length;

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

          {isGated && (
            <div className="rounded-3xl bg-gradient-to-br from-gold/20 to-bordeaux/30 border border-gold/40 p-6 backdrop-blur">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
                Encore {hiddenCount} punchlines analysées
              </div>
              <div className="font-serif text-xl font-black text-paper mt-2 leading-snug">
                Passe Premium pour dérouler tout le crate.
              </div>
              <p className="text-sm text-paper/75 mt-2 leading-relaxed">
                Booba, Damso, SCH, Kery James, Diam's, IAM — on a les
                punchlines, les figures de style, les ponts classiques.
                Gratuit : {FREE_QUOTAS.punchlineCards} par session. Premium :
                zéro limite, et on en rajoute chaque semaine.
              </p>
              <Link
                href="/premium"
                className="mt-4 inline-block w-full text-center bg-gold text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-paper transition"
              >
                Débloquer les {hiddenCount} autres →
              </Link>
            </div>
          )}
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
        <div className="flex flex-col gap-2 pt-1">
          {p.geniusUrl && (
            <div className="rounded-2xl bg-paper/5 border border-paper/10 p-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-paper/50 font-bold mb-1.5">
                Les paroles
              </div>
              <p className="text-[13px] text-paper/75 leading-relaxed mb-3">
                On ne reproduit pas les paroles ici — droits d'auteur oblige. Mais Genius les annote ligne par ligne, avec les références que les fans décryptent depuis des années.
              </p>
              <a
                href={p.geniusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] font-bold text-gold hover:underline"
              >
                Lire les paroles annotées sur Genius ↗
              </a>
            </div>
          )}
          <div className="flex gap-2">
            {p.listenUrl && (
              <a
                href={p.listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-ink text-sm font-bold px-4 py-3 rounded-full hover:bg-gold/90 transition"
              >
                Écouter sur Spotify ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
