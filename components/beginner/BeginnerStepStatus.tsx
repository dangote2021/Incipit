"use client";

import { useEffect, useState } from "react";
import { hasMarkedAsRead } from "@/lib/reading-journey";

/**
 * Micro-badge "À découvrir / Déjà lu" sur chaque étape du parcours
 * débutant. Évite au lecteur d'avoir à se rappeler où il en est.
 *
 * Skeleton stable (h-4 w-20) pour éviter le jump d'hydratation sous
 * chaque carte de la liste.
 */
export default function BeginnerStepStatus({
  bookId,
}: {
  bookId: string;
}) {
  const [ready, setReady] = useState(false);
  const [read, setRead] = useState(false);

  useEffect(() => {
    setRead(hasMarkedAsRead(bookId));
    setReady(true);
  }, [bookId]);

  if (!ready) {
    return <span className="inline-block h-4 w-20 bg-ink/5 rounded-full" />;
  }

  if (read) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-sage">
        <span>✓</span> Déjà lu
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-ink/40">
      À découvrir
    </span>
  );
}
