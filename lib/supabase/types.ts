// ─────────────────────────────────────────────────────────────────────────────
// Types des lignes Postgres (manuels — on évite la génération automatique
// pour ne pas introduire un script de build supplémentaire).
//
// Ces types MIROIRENT les migrations SQL dans `supabase/migrations/`.
// Si tu modifies une table, mets à jour ici.
// ─────────────────────────────────────────────────────────────────────────────

import type { FavoriteKind } from "@/lib/favorites-ids";
import type { Genre } from "@/lib/types";
import type { IncipitTone } from "@/lib/prefs";

/** Une ligne de `profiles` — 1 par utilisateur auth. */
export type ProfileRow = {
  id: string; // = auth.users.id (uuid)
  first_name: string;
  genres: Genre[];
  tone: IncipitTone;
  hide_streak: boolean;
  onboarded_at: string | null;
  last_seen_at: string | null;
  visits: number;
  created_at: string;
  updated_at: string;
};

/** Un favori (n par utilisateur). */
export type FavoriteRow = {
  id: string; // uuid interne DB
  user_id: string;
  fav_id: string; // ID métier (voir favId dans lib/favorites-ids)
  kind: FavoriteKind;
  label: string;
  sub: string | null;
  href: string;
  added_at: string;
};

/** État du streak (1 par utilisateur). */
export type StreakRow = {
  user_id: string;
  current: number;
  longest: number;
  last_open: string; // yyyy-mm-dd
  total_days: number;
  celebrated: number[]; // jalons atteints
  updated_at: string;
};

/** État premium (1 par utilisateur) — source de vérité vient de Stripe. */
export type PremiumRow = {
  user_id: string;
  is_premium: boolean;
  activated_at: string | null;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  updated_at: string;
};

/** Abonnement Web Push (n par utilisateur — multi-device possible). */
export type PushSubscriptionRow = {
  id: string;
  user_id: string | null; // null si anonyme (avant login)
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
};

/** Événement télémétrie agrégée (pas de PII). */
export type TelemetryEventRow = {
  id: string;
  event: string; // ex. "quiz_completed", "incipit_viewed"
  session_id: string; // hash anonyme, rotate 24h
  metadata: Record<string, unknown>;
  created_at: string;
};
