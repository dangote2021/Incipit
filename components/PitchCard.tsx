"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// PitchCard — version 'panneau insta' (refonte mai 2026, panel test in-app).
//
// Problème résolu : sur les couvertures pastel claires (Bovary lavande,
// Germinal blanc, Notre-Dame paper), le texte blanc devenait illisible —
// même avec un voile dégradé. Solution : sortir tous les textes dans un
// PANNEAU SOMBRE dédié en bas de la card, avec couverture pleine en haut.
//
// Layout :
//   - Tiers supérieur : couverture en couleur pleine (identité visuelle)
//   - Tiers inférieur : panneau ink/85 backdrop-blur avec tous les textes
//
// Le panneau garantit la lisibilité quelle que soit la couverture, et
// donne un look 'carte éditoriale' qui colle au ton Incipit.
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
    <article
      className={`snap-start relative min-h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-br ${book.cover} overflow-hidden`}
    >
      {/* Texture grain léger */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
        }}
      />

      {/* Actions ♥ et + en haut droite — sur la zone couverture pleine */}
      <div className="relative flex items-start justify-end gap-3 px-6 pt-6 z-10">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? "Retirer le coup de cœur" : "Marquer coup de cœur"}
          aria-pressed={liked}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition shadow-lg ${
            liked
              ? "bg-bordeaux text-paper scale-110"
              : "bg-paper/85 backdrop-blur-md text-ink hover:bg-paper"
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
              : "bg-paper/85 backdrop-blur-md text-ink hover:bg-paper"
          }`}
        >
          {saved ? "✓" : "+"}
        </button>
      </div>

      {/* Spacer flexible — pousse le panneau texte vers le bas */}
      <div className="flex-1" />

      {/* PANNEAU SOMBRE — contient TOUS les textes. Garanti lisible quelle
          que soit la couverture en haut. Backdrop-blur pour adoucir la
          transition avec la couverture. */}
      <div
        className="relative bg-ink/92 backdrop-blur-md px-6 pt-7 pb-8"
        style={{
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Fade haut du panneau pour transition douce avec la couverture */}
        <div
          className="absolute -top-12 left-0 right-0 h-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(26,26,46,0) 0%, rgba(26,26,46,0.92) 100%)",
          }}
        />

        <div className="relative">
          {/* BLOC 1 — Le pitch */}
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/55 mb-2">
            Le pitch
          </div>
          <p className="font-serif text-2xl sm:text-[26px] font-medium text-paper leading-[1.2] tracking-tight">
            {book.hook}
          </p>

          {/* BLOC 2 — La citation qui claque */}
          {punch && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
                La citation qui claque
              </div>
              <p className="font-serif text-base italic text-paper/85 leading-snug">
                « {punch} »
              </p>
            </div>
          )}

          {/* BLOC 3 — Signature */}
          <p className="mt-6 font-serif text-sm font-bold text-paper/90 tracking-wide">
            <span className="italic">{book.title}</span>, {lastName(book.author)}
          </p>

          <Link
            href={`/book/${book.id}`}
            className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-ink bg-paper px-4 py-2.5 rounded-full hover:bg-gold transition"
          >
            Lire la fiche →
          </Link>
        </div>
      </div>
    </article>
  );
}
