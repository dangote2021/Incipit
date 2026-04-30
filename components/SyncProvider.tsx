"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/supabase/use-auth";
import { pullAndMerge, schedulePush } from "@/lib/sync/engine";

// ─────────────────────────────────────────────────────────────────────────────
// <SyncProvider /> — composant silencieux monté dans layout.tsx.
//
// À monter une seule fois, il :
//   1. Au login : déclenche pullAndMerge (DB → local avec merge).
//   2. Écoute les events de mutation (favoris, streak, prefs, premium) et
//      schedule un push vers le serveur (debounced).
//   3. No-op si Supabase n'est pas configuré.
// ─────────────────────────────────────────────────────────────────────────────

export default function SyncProvider() {
  const { user, ready, configured } = useAuth();

  useEffect(() => {
    if (!ready || !configured || !user) return;

    // Pull une fois par session ET par user (clé inclut user.id pour
    // re-puller si on change de compte sur le même appareil).
    const flagKey = `incipit:sync:user:${user.id}`;
    if (!sessionStorage.getItem(flagKey)) {
      pullAndMerge().then((ok) => {
        if (ok) sessionStorage.setItem(flagKey, "1");
      });
    }

    // Écoute les events de mutation → push serveur (debounced).
    const triggerPush = () => schedulePush();
    window.addEventListener("incipit:favorites:change", triggerPush);
    window.addEventListener("storage", triggerPush);
    // Custom events émis par updatePrefs, markVisit, updateStreak…
    window.addEventListener("incipit:prefs:change", triggerPush);
    window.addEventListener("incipit:streak:change", triggerPush);

    return () => {
      window.removeEventListener("incipit:favorites:change", triggerPush);
      window.removeEventListener("storage", triggerPush);
      window.removeEventListener("incipit:prefs:change", triggerPush);
      window.removeEventListener("incipit:streak:change", triggerPush);
    };
  }, [ready, configured, user]);

  return null;
}
