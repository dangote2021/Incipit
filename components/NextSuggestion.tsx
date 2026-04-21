"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  dismissSuggestion,
  getNextSuggestion,
  markSuggestionShown,
  type Suggestion,
} from "@/lib/reading-journey";
import { BOOKS } from "@/lib/mock-data";

/**
 * Carte "Parcours de lecture" — proposée sur la home quand l'utilisateur
 * a marqué au moins un livre comme lu. Rend une suggestion curée ("après
 * Flaubert, lis Maupassant"). Permet à Mehdi (v8) de revenir après son
 * premier classique terminé.
 *
 * Client-only : les "readIds" vivent en localStorage, on ne peut pas SSR
 * la suggestion.
 */
export default function NextSuggestion() {
  const [sugg, setSugg] = useState<Suggestion | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const s = getNextSuggestion();
    setSugg(s);
    if (s) markSuggestionShown();
  }, []);

  if (!sugg || dismissed) return null;

  const from = BOOKS.find((b) => b.id === sugg.fromBookId);
  const to = BOOKS.find((b) => b.id === sugg.toBookId);
  if (!from || !to) return null;

  const handleDismiss = () => {
    dismissSuggestion(to.id);
    setDismissed(true);
  };

  return (
    <section className="snap-start min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-10 bg-gradient-to-b from-cream via-paper to-dust">
      <div className="max-w-md w-full mx-auto">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2 text-center">
          Parcours de lecture
        </div>
        <h2 className="font-serif text-3xl font-black text-ink leading-tight text-center mb-6">
          Tu as aimé <span className="italic">{from.title}</span> ?
        </h2>

        <div className="bg-paper border-2 border-ink/10 rounded-3xl p-6 shadow-sm">
          <div className="text-xs uppercase tracking-widest text-ink/50 font-bold mb-1 text-center">
            La rédaction te conseille
          </div>
          <div className="font-serif text-2xl font-black text-ink leading-tight text-center">
            {to.title}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-widest text-ink/60 font-bold text-center">
            {to.author} · {to.year}
          </div>
          <p className="mt-5 text-sm text-ink/75 leading-relaxed text-center italic">
            {bridgeLine(from.id, to.id, from.author, to.author)}
          </p>

          <div className="mt-6 space-y-2">
            <Link
              href={`/book/${to.id}`}
              className="block w-full text-center bg-ink text-paper py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
            >
              Ouvrir {to.title} →
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full text-center py-2.5 rounded-full text-[11px] uppercase tracking-widest font-bold text-ink/50 hover:text-ink transition"
            >
              Plus tard / déjà lu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Phrase de liaison courte ; défauts génériques si pas de mapping spécifique.
function bridgeLine(
  fromId: string,
  toId: string,
  fromAuthor: string,
  toAuthor: string
): string {
  const map: Record<string, string> = {
    "etranger->voyage":
      "Si Camus t'a saisi par son silence, Céline va te prendre par la gorge. Même noirceur, écriture en feu.",
    "bovary->bel-ami":
      "Maupassant a été l'élève de Flaubert. La même mécanique — Emma rêve, Duroy calcule — un monde plus tard.",
    "rouge-noir->pere-goriot":
      "Stendhal peint un ambitieux de province, Balzac en peint cent à la pension Vauquer. Le Paris qui t'a happé va te dévorer.",
    "swann->bovary":
      "De la mémoire au désir. Flaubert avant Proust, la matrice — mais le style s'est déjà affûté.",
    "candide->rouge-noir":
      "Voltaire ironise, Stendhal arme. Même lucidité, roman plus charnu.",
    "notre-dame->germinal":
      "Hugo cathédrale, Zola mine. Même époque française, même ambition panoramique.",
    "fleurs-mal->swann":
      "Baudelaire t'a tissé le temps — Proust va le démêler pendant trois mille pages.",
    "liaisons->rouge-noir":
      "Valmont, Julien : deux hommes qui font de l'amour un terrain de combat. Stendhal est l'héritier.",
    "germinal->notre-dame":
      "Après la mine, la cathédrale. Hugo précède Zola et lui trace la fresque.",
    "pere-goriot->rouge-noir":
      "Rastignac et Julien sont cousins. Balzac à Paris, Stendhal en province — complémentaires.",
    "bel-ami->bovary":
      "Duroy monte, Emma tombe. Maupassant a appris chez Flaubert — on remonte à la source.",
    "voyage->etranger":
      "Céline hurle, Camus chuchote. Même constat, deux registres — l'un rugit, l'autre tranche.",
  };
  const key = `${fromId}->${toId}`;
  return (
    map[key] ??
    `Si tu as aimé ${fromAuthor}, ${toAuthor} va te parler. Choix éditorial de la rédaction.`
  );
}
