"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import PitchCard from "./PitchCard";
import RapLitTeaser from "./RapLitTeaser";
import QuizTeaser from "./QuizTeaser";
import DailyQuizCard from "./DailyQuizCard";
import BusnelCapsuleTeaser from "./BusnelCapsuleTeaser";
import { getPrefs, updatePrefs, GENRES_COOKIE_NAME } from "@/lib/prefs";
import type { Book, Genre } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Feed de pitches — la personnalisation par genres vit principalement côté
// serveur (cookie `incipit_genres` → tri stable avant le premier paint, donc
// pas de flash d'hydratation). Ce composant client a trois rôles :
//
//   1. Afficher le feed dans l'ordre reçu du serveur. Dans le cas nominal
//      (cookie présent), aucun tri supplémentaire.
//   2. Edge case "pas encore de cookie" (users d'avant ce déploiement) :
//      lire localStorage, trier, et écrire le cookie pour que la prochaine
//      visite soit server-ordered dès le premier paint.
//   3. Garder les interludes (Quiz du jour, Rap & Lit, Capsule Busnel,
//      Quiz full) à des positions d'index fixes (1, 3, 5, 7) quel que soit
//      l'ordre effectif.
// ─────────────────────────────────────────────────────────────────────────────

function hasGenresCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) =>
    c.trim().startsWith(`${GENRES_COOKIE_NAME}=`)
  );
}

export default function PersonalizedPitchFeed({
  books,
  dailyRitualSlot,
}: {
  books: Book[];
  /** Slot Server Component (DailyRitual) injecté à un index élevé du feed.
      Voir app/page.tsx — DailyRitual a été déplacé hors de l'ouverture
      pour mettre WeeklyAuthorCard en premier (panel test in-app). */
  dailyRitualSlot?: React.ReactNode;
}) {
  const [localGenres, setLocalGenres] = useState<Genre[] | null>(null);

  useEffect(() => {
    // Si le cookie existe déjà, le serveur a fait son job — on reste sur
    // l'ordre servi, pas de re-tri, pas de flash.
    if (hasGenresCookie()) return;

    const prefs = getPrefs();
    if (!prefs.onboarded || prefs.genres.length === 0) return;

    // Edge case : user onboardé avant ce déploiement, pas de cookie. On
    // réplique les genres en cookie (effet : prochain chargement = tri
    // serveur), et on applique une réorg locale pour cette visite-ci.
    updatePrefs({ genres: prefs.genres });
    setLocalGenres(prefs.genres);
  }, []);

  const ordered = useMemo(() => {
    if (!localGenres || localGenres.length === 0) return books;
    const set = new Set(localGenres);
    const matches: Book[] = [];
    const rest: Book[] = [];
    for (const b of books) {
      if (set.has(b.genre)) matches.push(b);
      else rest.push(b);
    }
    return [...matches, ...rest];
  }, [books, localGenres]);

  return (
    <>
      {ordered.map((b, i) => (
        <Fragment key={b.id}>
          <PitchCard book={b} />
          {i === 1 && <DailyQuizCard />}
          {i === 3 && <RapLitTeaser />}
          {/* Capsule Busnel — levier rétention #1 (panel test Android) */}
          {i === 5 && <BusnelCapsuleTeaser />}
          {i === 7 && <QuizTeaser />}
          {/* DailyRitual (incipit/citation/punchline/passage clé samedi…)
              déplacé ICI plutôt qu'en ouverture — l'user voulait que le
              passage clé du samedi notamment arrive bien plus loin dans
              le feed, après plusieurs pitches (panel test in-app). */}
          {i === 10 && dailyRitualSlot}
        </Fragment>
      ))}
    </>
  );
}
