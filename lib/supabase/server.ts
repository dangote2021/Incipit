// ─────────────────────────────────────────────────────────────────────────────
// Client Supabase côté serveur (route handlers, server components, middleware).
//
// Deux variantes :
//  - `serverSupabase()` : lit la session via les cookies (RLS appliqué avec le
//    token de l'utilisateur). À utiliser dans les routes /api normales.
//  - `adminSupabase()` : utilise SERVICE_ROLE_KEY, bypasse RLS. À utiliser
//    UNIQUEMENT dans les routes protégées (webhook Stripe, cron, callback
//    push) où on a déjà authentifié par un autre moyen.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { hasSupabase, hasSupabaseAdmin } from "./env";

/**
 * Client lié à la session utilisateur (cookie). Retourne `null` si la conf
 * Supabase n'est pas présente — les appelants doivent vérifier.
 */
export function serverSupabase() {
  if (!hasSupabase()) return null;
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // setAll peut échouer dans un server component — ignoré
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // idem
          }
        },
      },
    }
  );
}

/**
 * Client admin (bypasse RLS). N'utiliser QUE dans des routes où on a validé
 * l'authentification par un autre moyen (webhook signé, cron secret…).
 */
export function adminSupabase() {
  if (!hasSupabaseAdmin()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
