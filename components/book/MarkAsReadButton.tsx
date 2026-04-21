"use client";

import { useEffect, useState } from "react";
import {
  hasMarkedAsRead,
  markBookAsRead,
} from "@/lib/reading-journey";

/**
 * Bouton "Marquer comme lu" sur la fiche livre. Déclenche la mécanique de
 * parcours de lecture : au prochain chargement de la home, une suggestion
 * connexe apparaîtra (cf. components/NextSuggestion.tsx).
 *
 * Client-only : persistance en localStorage.
 */
export default function MarkAsReadButton({ bookId }: { bookId: string }) {
  const [read, setRead] = useState(false);
  const [ack, setAck] = useState(false);

  useEffect(() => {
    setRead(hasMarkedAsRead(bookId));
  }, [bookId]);

  const handleClick = () => {
    markBookAsRead(bookId);
    setRead(true);
    setAck(true);
    // Retire le message d'ack au bout de 3s pour laisser le bouton dans son
    // état final (discret, coché).
    setTimeout(() => setAck(false), 3000);
  };

  // Rendu sur fond sombre (Hero avec gradient) : on assume paper/ink inversé
  // dans l'état "à lire", et un ton sage translucide pour l'état "lu" qui
  // passe aussi bien sur fond clair que foncé.
  if (read) {
    return (
      <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/30 border border-sage text-paper text-[11px] uppercase tracking-widest font-bold">
        <span>✓</span>
        {ack ? "Marqué comme lu — bien joué" : "Déjà lu"}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper/95 border border-paper text-ink text-[11px] uppercase tracking-widest font-bold hover:bg-paper transition"
    >
      <span className="text-sm leading-none">○</span>
      J'ai lu ce livre
    </button>
  );
}
