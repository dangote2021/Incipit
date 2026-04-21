"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import PitchCard from "./PitchCard";
import RapLitTeaser from "./RapLitTeaser";
import QuizTeaser from "./QuizTeaser";
import DailyQuizCard from "./DailyQuizCard";
import { getPrefs } from "@/lib/prefs";
import type { Book, Genre } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Feed personnalisé — même pool de pitches, ordre remodelé selon les genres
// choisis à l'onboarding. Trois règles :
//
//   1. Tant qu'on n'a pas lu localStorage (SSR + premier render), on affiche
//      l'ordre serveur (BOOKS). Zéro hydration mismatch : la liste renvoyée
//      est identique côté serveur et côté client au premier tick.
//   2. Une fois hydraté, si l'utilisateur a choisi des genres, on remonte les
//      livres qui matchent ses genres (stable) — les autres restent derrière
//      dans leur ordre d'origine. On ne supprime rien : on re-priorise.
//   3. Les interludes (DailyQuizCard, RapLitTeaser, QuizTeaser) restent à
//      leurs positions fixes par index (1, 3, 7) — on ne veut pas que le quiz
//      saute à la fin juste parce qu'on a sélectionné 3 genres.
//
// Pourquoi côté client : les prefs vivent en localStorage et n'ont pas de
// source serveur. Refondre ça côté serveur nécessiterait Supabase + auth —
// c'est planifié mais pas bloquant pour la personnalisation de base.
// ─────────────────────────────────────────────────────────────────────────────

export default function PersonalizedPitchFeed({ books }: { books: Book[] }) {
  const [genres, setGenres] = useState<Genre[] | null>(null);

  useEffect(() => {
    const prefs = getPrefs();
    setGenres(prefs.onboarded ? prefs.genres : []);
  }, []);

  const ordered = useMemo(() => {
    if (!genres || genres.length === 0) return books;
    const set = new Set(genres);
    // Partition stable : matches d'abord, puis le reste, en conservant
    // l'ordre d'origine dans chaque groupe. Évite le jump visuel d'un tri
    // complet et préserve la lisibilité de la séquence éditoriale.
    const matches: Book[] = [];
    const rest: Book[] = [];
    for (const b of books) {
      if (set.has(b.genre)) matches.push(b);
      else rest.push(b);
    }
    return [...matches, ...rest];
  }, [books, genres]);

  return (
    <>
      {ordered.map((b, i) => (
        <Fragment key={b.id}>
          <PitchCard book={b} />
          {i === 1 && <DailyQuizCard />}
          {i === 3 && <RapLitTeaser />}
          {i === 7 && <QuizTeaser />}
        </Fragment>
      ))}
    </>
  );
}
