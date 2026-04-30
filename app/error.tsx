"use client";

import { useEffect } from "react";

/**
 * Error boundary racine — évite l'écran blanc en cas de crash runtime.
 * Ton éditorial Incipit : on rate, on l'avoue, on propose une sortie.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Pas de télémétrie en MVP, on laisse juste un log console.
    // eslint-disable-next-line no-console
    console.error("[Incipit] runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-16 bg-paper">
      <div className="max-w-md w-full text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-4">
          Page erreur
        </div>
        <h1 className="font-serif text-4xl font-black text-ink leading-[1.05] mb-4">
          On s'est pris un mur.
        </h1>
        <p className="font-serif text-lg text-ink/70 italic leading-relaxed mb-6">
          « L'absurde, c'est le divorce entre l'homme qui appelle et le monde
          qui se tait. » — Camus, à sa manière.
        </p>
        <p className="text-sm text-ink/60 mb-8 leading-relaxed">
          Une erreur technique s'est glissée dans la page. Tu peux retenter —
          souvent ça passe au second essai — ou revenir à l'accueil.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-ink text-paper text-sm font-bold uppercase tracking-widest min-h-[44px] px-6 py-3.5 rounded-full hover:bg-ink/90 transition"
          >
            Recharger la page
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center text-[13px] font-semibold text-bordeaux hover:underline"
          >
            Retour à l'accueil
          </a>
        </div>

        {error.digest && (
          <div className="mt-10 text-[10px] uppercase tracking-widest text-ink/30">
            Code: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}
