// ─────────────────────────────────────────────────────────────────────────────
// Client Supabase pour le navigateur. Utilise les cookies gérés par @supabase/ssr.
// Retourne `null` si les env vars ne sont pas définies (mode V1 localStorage).
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasSupabase } from "./env";

// Singleton — créé à la demande pour éviter de l'instancier côté SSR.
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function browserSupabase() {
  if (!hasSupabase()) return null;
  if (cached) return cached;
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return cached;
}
