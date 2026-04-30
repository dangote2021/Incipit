// ─────────────────────────────────────────────────────────────────────────────
// GET /api/health — état de santé du backend.
//
// Renvoie un JSON synthétique qui permet de vérifier d'un coup d'œil quels
// modules sont configurés en prod (Supabase, Stripe, Push, Cron). Aucun
// secret ne fuit — seulement des booléens.
//
// Utilisé par :
//  - Status pages externes (UptimeRobot, BetterStack…)
//  - Smoke test post-deploy
//  - Debug rapide ("pourquoi le push ne part pas ?")
//
// On NE révèle PAS le contenu des env vars, juste leur présence. C'est une
// surface intentionnellement bavarde sur la config mais muette sur les
// valeurs.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import {
  hasSupabase,
  hasSupabaseAdmin,
  hasStripe,
  hasVapid,
} from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const config = {
    supabase: hasSupabase(),
    supabase_admin: hasSupabaseAdmin(),
    stripe: hasStripe(),
    push_vapid: hasVapid(),
    cron_secret: Boolean(process.env.CRON_SECRET),
    site_url: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  };

  // L'app reste ok même si rien n'est configuré (V1 mode dégradé).
  // Le statut "warning" signale juste que des modules sont off.
  const allOk = Object.values(config).every(Boolean);
  const noneOk = Object.values(config).every((v) => !v);

  return NextResponse.json({
    ok: true,
    status: allOk ? "all_configured" : noneOk ? "v1_mode" : "partial",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
    config,
  });
}
