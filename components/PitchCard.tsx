"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// PitchCard — version carrousel insta (refonte mai 2026 panel test Android).
//
// Avant : trop de texte (pitch long, tags themes, overline 'Incipit', VibeBadge,
// méta année/pages), trop de polices (4 tailles serif + 4 tailles sans).
// Après : hook en hero (la punchline qui doit faire arrêter le scroll), titre
// + auteur en pied, 2 boutons d'action discrets, 1 CTA fiche. Une seule famille
// serif + une famille sans pour la meta. Le détail (pitch long, tags, contexte,
// passages, capsules vidéo) vit sur la fiche livre /book/[id].
//
// Règle d'or : si quelqu'un voit la carte 1.5 sec en swipant, il doit retenir
// (1) le hook, (2) le titre. Tout le reste est du bruit.
// ─────────────────────────────────────────────────────────────────────────────

export default function PitchCard({ book }: { book: Book }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <article
      className={`snap-start relative min-h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-br ${book.cover} overflow-hidden`}
    >
      {/* Texture subtile — donne du grain à la couverture, signe l'identité
          'papier ancien' d'Incipit même sur les fonds saturés. */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.25) 0%, transparent 50%)",
        }}
      />

      {/* Voile sombre bas → haut. Concentré dans le tiers inférieur pour
          libérer le hero (centre) qui doit respirer. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />

      <div className="relative flex-1 flex flex-col px-6 py-7 text-paper">
        {/* Actions discrètes en haut à droite — pas de meta à gauche */}
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

        {/* HERO — le hook prend tout l'espace central. Une seule typo (serif),
            italique, taille géante, lettrage tassé. C'est ce qui doit faire
            stopper le scroll. */}
        <div className="flex-1 flex items-center animate-fade-up">
          <p className="font-serif text-3xl sm:text-4xl italic font-medium text-paper leading-[1.15] tracking-tight">
            « {book.hook} »
          </p>
        </div>

        {/* PIED — titre + auteur · année en brut, 2 polices max.
            La typo serif signe le titre, la sans porte la meta. */}
        <div className="animate-fade-up">
          <h2 className="font-serif text-3xl font-black leading-[1.05] mb-1 ink-drop">
            {book.title}
          </h2>
          <p className="text-[13px] text-paper/75 font-medium tracking-wide">
            {book.author} · {book.year}
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
