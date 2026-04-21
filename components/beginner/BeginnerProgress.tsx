"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBook } from "@/lib/mock-data";
import { getJourneyState } from "@/lib/reading-journey";
import {
  BEGINNER_PATH,
  beginnerProgress,
  nextBeginnerStep,
} from "@/lib/beginner-path";

/**
 * Bandeau de progression du mode débutant — "X/10 découverts" + livre
 * suivant recommandé. Réutilise la clé localStorage du parcours de
 * lecture (pas de double source de vérité).
 *
 * Skeleton stable (h-48) pour éviter le layout shift au premier paint.
 */
export default function BeginnerProgress() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nextBookId, setNextBookId] = useState<string | null>(null);

  useEffect(() => {
    const s = getJourneyState();
    setProgress(beginnerProgress(s.readIds));
    const next = nextBeginnerStep(s.readIds);
    setNextBookId(next?.bookId ?? null);
    setReady(true);
  }, []);

  const total = BEGINNER_PATH.length;
  const nextBook = nextBookId ? getBook(nextBookId) : null;

  return (
    <section className="bg-gradient-to-br from-cream via-paper to-dust border-2 border-ink/10 rounded-3xl p-6 min-h-[12rem]">
      {!ready ? (
        // Skeleton : on réserve la place pour ne pas pousser la liste en
        // dessous au moment de l'hydratation. Pas d'animation : sobre.
        <div className="space-y-3">
          <div className="h-3 w-24 bg-ink/5 rounded-full" />
          <div className="h-7 w-48 bg-ink/5 rounded-full" />
          <div className="h-2 w-full bg-ink/5 rounded-full" />
          <div className="h-10 w-full bg-ink/5 rounded-full mt-4" />
        </div>
      ) : (
        <>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
            Ton avancée
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-serif text-5xl font-black text-ink leading-none">
              {progress}
            </span>
            <span className="text-sm text-ink/60 font-medium">
              / {total} découverts
            </span>
          </div>

          {/* Barre de progression segmentée — 10 carrés, signal "on avance
              marche après marche" plus parlant qu'une barre continue. */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < progress ? "bg-bordeaux" : "bg-ink/10"
                }`}
              />
            ))}
          </div>

          {progress === 0 && nextBook && (
            <>
              <p className="text-sm text-ink/75 leading-relaxed mb-3">
                On commence doucement. Voltaire t'attend — cent-soixante
                pages, des chapitres courts, et un rire discret sur chaque
                page.
              </p>
              <Link
                href={`/book/${nextBook.id}`}
                className="block w-full text-center bg-ink text-paper py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
              >
                Commencer par {nextBook.title} →
              </Link>
            </>
          )}

          {progress > 0 && progress < total && nextBook && (
            <>
              <p className="text-sm text-ink/75 leading-relaxed mb-3">
                Prochaine étape : <strong>{nextBook.title}</strong> de{" "}
                {nextBook.author}. {nextBook.pages} pages.
              </p>
              <Link
                href={`/book/${nextBook.id}`}
                className="block w-full text-center bg-ink text-paper py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition"
              >
                Ouvrir {nextBook.title} →
              </Link>
            </>
          )}

          {progress === total && (
            <p className="text-sm text-ink/80 leading-relaxed italic">
              Tu as parcouru les dix. Tu n'es plus débutant — tu es un
              lecteur. Le reste du corpus t'attend.
            </p>
          )}
        </>
      )}
    </section>
  );
}
