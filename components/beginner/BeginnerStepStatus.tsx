"use client";

import { useEffect, useState } from "react";
import { hasMarkedAsRead, markBookAsRead } from "@/lib/reading-journey";

/**
 * Statut + CTA "Je l'ai lu" sur chaque étape du parcours débutant.
 *
 * Q6 panel v9 : les débutants retrouvaient l'action uniquement sur la
 * fiche livre, et elle se confondait avec le hero. Ici on la rend visible
 * et directe depuis la liste — deux taps au lieu de quatre, et on ne
 * perd jamais sa place dans le parcours.
 *
 * Clic → marque comme lu côté client + met à jour le statut local. Le
 * bouton est volontairement plus grand (tap target ≥ 44px) et plus
 * contrasté que l'ancien micro-badge.
 *
 * Attention : ce composant est rendu dans un <Link> parent qui pointe
 * vers la fiche livre. On doit donc preventDefault + stopPropagation
 * pour ne pas naviguer quand on clique le bouton.
 */
export default function BeginnerStepStatus({
  bookId,
}: {
  bookId: string;
}) {
  const [ready, setReady] = useState(false);
  const [read, setRead] = useState(false);
  const [justMarked, setJustMarked] = useState(false);

  useEffect(() => {
    setRead(hasMarkedAsRead(bookId));
    setReady(true);
  }, [bookId]);

  // Skeleton stable pour éviter le jump d'hydratation.
  if (!ready) {
    return <span className="inline-block h-10 w-40 bg-ink/5 rounded-full" />;
  }

  if (read) {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/15 border border-sage/40 text-sage text-[11px] uppercase tracking-widest font-black min-h-[36px]">
        <span>✓</span>
        {justMarked ? "Bien joué" : "Déjà lu"}
      </span>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markBookAsRead(bookId);
    setRead(true);
    setJustMarked(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Marquer comme lu"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-bordeaux text-paper text-[11px] uppercase tracking-widest font-black min-h-[44px] shadow-sm hover:bg-ink transition"
    >
      <span className="text-base leading-none">✓</span>
      Je l&apos;ai lu
    </button>
  );
}
