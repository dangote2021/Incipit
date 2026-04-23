// ─────────────────────────────────────────────────────────────────────────────
// Détection de la config Supabase.
//
// Tout le backend v2 est "progressive enhancement" : si les env vars sont
// absentes (ex. prévisualisations Vercel, dev local sans setup), l'app tombe
// en mode V1 (localStorage only). Ce module centralise la détection pour
// éviter d'avoir `if (process.env.X)` partout.
// ─────────────────────────────────────────────────────────────────────────────

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function hasSupabaseAdmin(): boolean {
  return hasSupabase() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasStripe(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  );
}

export function hasVapid(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
  );
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}
