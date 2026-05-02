"use client";

import { useEffect, useState } from "react";

/**
 * Error boundary racine — évite l'écran blanc en cas de crash runtime.
 * Ton éditorial Incipit : on rate, on l'avoue, on propose une sortie.
 *
 * Comportement du bouton 'Recharger la page' (panel test Android, mai 2026)
 * Avant : appelait juste reset() de Next, qui re-mount le segment en
 * erreur. Si l'erreur est persistante (server component qui crashe,
 * state corrompu, asset stale du SW), reset() re-rend immédiatement
 * la même erreur → l'utilisateur a l'impression de se prendre un mur.
 *
 * Maintenant : window.location.reload() (vrai hard reload du document)
 * APRÈS purge du cache du Service Worker. Cas typique résolu : nouveau
 * commit déployé, le SW sert encore l'ancien bundle, le composant client
 * tente d'appeler une API qui n'existe plus → reset() ne change rien,
 * seul un hard reload + cache clear remet l'app à neuf.
 *
 * Le bouton 'Réessayer sans recharger' (secondaire) reste exposé pour
 * les cas où l'erreur est légère (ex : un fetch qui a timeout sur une
 * connexion intermittente — un retry suffit).
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    // Pas de télémétrie en MVP, on laisse juste un log console.
    // eslint-disable-next-line no-console
    console.error("[Incipit] runtime error:", error);
  }, [error]);

  const handleHardReload = async () => {
    setWorking(true);
    try {
      // 1. Purge les caches HTTP du Service Worker (s'il y en a). Le SW
      //    Incipit cache pour l'offline mais peut servir un bundle obsolète
      //    après un déploiement — c'est la cause #1 des erreurs 'Loading
      //    chunk failed' / 'unable to fetch dynamically imported module'.
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // 2. Désenregistre les SW (force un re-register au prochain load).
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {
      // Tant pis, on tente le reload quand même.
    } finally {
      // Hard reload — bypass cache navigateur via cache-buster.
      const url = new URL(window.location.href);
      url.searchParams.set("_t", String(Date.now()));
      window.location.replace(url.toString());
    }
  };

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
          Une erreur technique s'est glissée dans la page. Recharger purge
          aussi le cache, ça résout 9 erreurs sur 10.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleHardReload}
            disabled={working}
            className="inline-flex items-center justify-center bg-ink text-paper text-sm font-bold uppercase tracking-widest min-h-[44px] px-6 py-3.5 rounded-full hover:bg-bordeaux transition disabled:opacity-60"
          >
            {working ? "Nettoyage…" : "Recharger la page"}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={working}
            className="inline-flex items-center justify-center text-[13px] font-semibold text-ink/70 hover:text-bordeaux transition disabled:opacity-50"
          >
            Réessayer sans recharger
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center text-[13px] font-semibold text-bordeaux hover:underline mt-2"
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
