"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// PitchCard — version "magazine littéraire" (refonte mai 2026, panel test
// in-app après plusieurs allers-retours sur la lisibilité).
//
// Principe charte révisée :
//   1. Le texte est TOUJOURS sur fond paper #FAF7F0 avec couleur ink #1A1A2E.
//      Plus jamais de texte clair sur couverture imprévisible.
//   2. La couverture colorée (gradient) reste comme ILLUSTRATION en haut,
//      séparée du bloc texte par un fade.
//   3. Accent éditorial = bordeaux #8B1E3F sur les overlines uniquement.
//
// Pattern : Penguin Modern Classics / Netflix card / La Belle Vie magazine.
// Tiers haut visuel, 2/3 bas éditorial. Sépare clairement l'identité
// visuelle du livre (cover gradient) du discours sur le livre (texte).
// ─────────────────────────────────────────────────────────────────────────────

function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

function pickPunchQuote(opening: string, maxChars = 220): string {
  if (!opening) return "";
  const text = opening.replace(/\s+/g, " ").trim();
  const m = text.match(/^.*?[.!?:](?=\s|$)/);
  let candidate = (m ? m[0] : text).trim();
  if (candidate.length > maxChars) {
    const cut = candidate.lastIndexOf(",", maxChars);
    candidate = candidate.slice(0, cut > 80 ? cut : maxChars).trim() + "…";
  }
  return candidate;
}

export default function PitchCard({ book }: { book: Book }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const punch = pickPunchQuote(book.openingLines);

  return (
    <article className="snap-start relative min-h-[calc(100vh-6rem)] flex flex-col bg-paper overflow-hidden">
      {/* ─── ZONE 1 : illustration de couverture (haut, ~38vh) ─────────────
          Gradient cover du livre + grain papier + actions. Pas de texte ici,
          on garde la zone visuelle propre et reconnaissable. */}
      <div
        className={`relative h-[38vh] min-h-[280px] bg-gradient-to-br ${book.cover} overflow-hidden`}
      >
        {/* Grain léger */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
          }}
        />

        {/* Actions ♥ et + en haut droite */}
        <div className="relative flex items-start justify-end gap-3 px-6 pt-6 z-10">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Retirer le coup de cœur" : "Marquer coup de cœur"}
            aria-pressed={liked}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition shadow-lg ${
              liked
                ? "bg-bordeaux text-paper scale-110"
                : "bg-paper/90 backdrop-blur-md text-ink hover:bg-paper"
            }`}
          >
            {liked ? "♥" : "♡"}
          </button>
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-label={saved ? "Retirer de la bibliothèque" : "Ajouter à la bibliothèque"}
            aria-pressed={saved}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition shadow-lg ${
              saved
                ? "bg-gold text-ink scale-110"
                : "bg-paper/90 backdrop-blur-md text-ink hover:bg-paper"
            }`}
          >
            {saved ? "✓" : "+"}
          </button>
        </div>

        {/* Fade vers le bas pour transition douce avec la zone texte */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,247,240,0) 0%, rgba(250,247,240,0.6) 60%, rgba(250,247,240,1) 100%)",
          }}
        />
      </div>

      {/* ─── ZONE 2 : éditorial sur paper (bas, prend le reste) ────────────
          Fond paper, texte ink. Lisibilité garantie. */}
      <div className="flex-1 px-6 pt-6 pb-8 bg-paper text-ink">
        {/* BLOC 1 — Le pitch */}
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
          Le pitch
        </div>
        <p className="font-serif text-2xl sm:text-[26px] font-medium text-ink leading-[1.2] tracking-tight">
          {book.hook}
        </p>

        {/* BLOC 2 — La citation qui claque */}
        {punch && (
          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
              La citation qui claque
            </div>
            <p className="font-serif text-base italic text-ink/80 leading-snug">
              « {punch} »
            </p>
          </div>
        )}

        {/* BLOC 3 — Signature */}
        <p className="mt-6 font-serif text-sm font-bold text-ink/90 tracking-wide">
          <span className="italic">{book.title}</span>, {lastName(book.author)}
        </p>

        <Link
          href={`/book/${book.id}`}
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-paper bg-ink px-4 py-2.5 rounded-full hover:bg-bordeaux transition"
        >
          Lire la fiche →
        </Link>
      </div>
    </article>
  );
}
