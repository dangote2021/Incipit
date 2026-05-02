"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// PitchCard — version 'carrousel insta' v2 (panel test Android, mai 2026).
//
// Structure demandée :
//   Notre pitch
//     [hook brut, sans guillemets]
//
//   La citation qui claque
//     « [première phrase de openingLines, entre guillemets] »
//
//   Titre, Auteur (nom de famille)
//
// Règles d'écriture :
//   - Nos commentaires (notre pitch) : ton direct, sans guillemets, juste le
//     texte
//   - Les citations brutes (extraites de l'œuvre originale) : toujours entre
//     guillemets typographiques « … »
//   - L'overline 'Notre pitch' / 'La citation qui claque' introduit chaque
//     bloc et lui donne sa fonction éditoriale
//
// Visuel :
//   - Voile sombre concentré sur le tiers inférieur (le tiers supérieur garde
//     la couverture claire — retour 'card trop sombre en haut' ×2 du panel
//     test Android)
//   - Une seule typo serif Playfair pour tout l'éditorial, avec hiérarchie
//     par taille uniquement
//   - Overlines sans (Inter), petite, uppercase, opacité — pour annoncer la
//     fonction de chaque bloc sans voler la lumière au texte
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extrait le nom de famille d'un nom complet pour la signature courte
 * du pitch. Cas testés : 'Pierre Choderlos de Laclos' → 'Laclos',
 * 'Honoré de Balzac' → 'Balzac', 'Louis-Ferdinand Céline' → 'Céline',
 * 'Albert Camus' → 'Camus'. Le dernier 'mot' fait l'affaire pour le
 * corpus français qu'on a.
 */
function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

/**
 * Extrait la première phrase d'un incipit (jusqu'au premier '. ', '! ',
 * '? ' ou ': '), tronquée à ~220 caractères max si elle dépasse — Proust
 * ne sera pas content sinon. On garde la ponctuation finale si elle
 * existait, sinon on ajoute une ellipse.
 */
function pickPunchQuote(opening: string, maxChars = 220): string {
  if (!opening) return "";
  const text = opening.replace(/\s+/g, " ").trim();
  // Cherche la fin de la première vraie phrase
  const m = text.match(/^.*?[.!?:](?=\s|$)/);
  let candidate = (m ? m[0] : text).trim();
  if (candidate.length > maxChars) {
    // Coupe à la dernière virgule avant maxChars, ou à maxChars - puis '…'
    const cut = candidate.lastIndexOf(",", maxChars);
    candidate =
      candidate.slice(0, cut > 80 ? cut : maxChars).trim() + "…";
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
      {/* Texture grain léger — donne du papier à toutes les couvertures */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
        }}
      />

      {/* Voile sombre LOCALISÉ en bas (tiers inférieur uniquement). Le tiers
          supérieur reste avec la couleur de couverture pleine, claire. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.55) 35%, rgba(26,26,46,0) 60%)",
        }}
      />

      <div className="relative flex-1 flex flex-col px-6 py-7 text-paper">
        {/* Actions discrètes en haut à droite */}
        <div className="flex items-start justify-end gap-3 animate-fade-up">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Retirer le coup de cœur" : "Marquer coup de cœur"}
            aria-pressed={liked}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition ${
              liked
                ? "bg-bordeaux text-paper scale-110"
                : "bg-paper/15 backdrop-blur-sm hover:bg-paper/25"
            }`}
          >
            {liked ? "♥" : "♡"}
          </button>
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-label={saved ? "Retirer de la bibliothèque" : "Ajouter à la bibliothèque"}
            aria-pressed={saved}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition ${
              saved
                ? "bg-gold text-ink scale-110"
                : "bg-paper/15 backdrop-blur-sm hover:bg-paper/25"
            }`}
          >
            {saved ? "✓" : "+"}
          </button>
        </div>

        {/* Spacer flexible — pousse le contenu vers le bas */}
        <div className="flex-1 min-h-[8vh]" />

        {/* BLOC 1 — Notre pitch (commentaire direct, sans guillemets) */}
        <div className="animate-fade-up">
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/60 mb-2">
            Notre pitch
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-medium text-paper leading-[1.18] tracking-tight">
            {book.hook}
          </p>
        </div>

        {/* BLOC 2 — La citation qui claque (extrait de l'œuvre, entre guillemets) */}
        {punch && (
          <div className="mt-6 animate-fade-up">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
              La citation qui claque
            </div>
            <p className="font-serif text-base sm:text-lg italic text-paper/90 leading-snug">
              « {punch} »
            </p>
          </div>
        )}

        {/* BLOC 3 — Signature : titre + auteur (nom de famille uniquement) */}
        <div className="mt-6 animate-fade-up">
          <p className="font-serif text-sm font-bold text-paper/85 tracking-wide">
            <span className="italic">{book.title}</span>, {lastName(book.author)}
          </p>

          <Link
            href={`/book/${book.id}`}
            className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-paper bg-paper/15 backdrop-blur-sm px-4 py-2.5 rounded-full hover:bg-paper/25 transition"
          >
            Lire la fiche →
          </Link>
        </div>
      </div>
    </article>
  );
}
