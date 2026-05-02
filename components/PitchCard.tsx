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

export default function PitchCard({ book }: { book: Book }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  // 'La citation qui claque' = vraie citation iconique du livre (PAS l'incipit).
  // L'incipit vit sur la fiche /book/[id] — cohérent avec le nom de l'app.
  // Si signatureQuote pas encore renseignée pour ce livre, on n'affiche
  // simplement pas le bloc citation (mieux qu'une phrase lambda).
  const punch = book.signatureQuote;

  return (
    <article className="snap-start relative min-h-[calc(100vh-6rem)] flex flex-col bg-paper overflow-hidden">
      {/* ─── ZONE 1 : illustration de couverture (haut, ~38vh) ─────────────
          Gradient cover du livre + grain papier + actions. Pas de texte ici,
          on garde la zone visuelle propre et reconnaissable. */}
      <div
        className={`relative h-[22vh] min-h-[160px] bg-gradient-to-br ${book.cover} overflow-hidden`}
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
          className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,247,240,0) 0%, rgba(250,247,240,0.7) 50%, rgba(250,247,240,1) 100%)",
          }}
        />
      </div>

      {/* ─── ZONE 2 : éditorial sur paper (bas, prend le reste) ────────────
          Fond paper, texte ink. Lisibilité garantie. Espace mieux occupé
          (panel test : 'espace vide en haut, déplacer le pitch en haut') :
          le pitch démarre dès le début du panneau, taille hero plus grosse,
          la citation qui claque est rehaussée juste sous le pitch. */}
      <div className="flex-1 px-6 pt-7 pb-8 bg-paper text-ink flex flex-col">
        {/* BLOC 1 — Le pitch (hero, taille augmentée pour remplir l'écran) */}
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
          Le pitch
        </div>
        <p className="font-serif text-[28px] sm:text-[32px] font-medium text-ink leading-[1.18] tracking-tight">
          {book.hook}
        </p>

        {/* BLOC 2 — La citation qui claque (rehaussée, plus près du pitch) */}
        {punch && (
          <div className="mt-7">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
              La citation qui claque
            </div>
            <p className="font-serif text-[17px] sm:text-lg italic text-ink/80 leading-snug">
              « {punch} »
            </p>
          </div>
        )}

        {/* BLOC 3 — Signature (poussée en bas via mt-auto) */}
        <p className="mt-auto pt-7 font-serif text-sm font-bold text-ink/90 tracking-wide">
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
