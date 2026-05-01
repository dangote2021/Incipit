// ─────────────────────────────────────────────────────────────────────────────
// GET /api/me/export — export complet des données utilisateur (RGPD article 20).
//
// Le RGPD article 20 (droit à la portabilité) impose qu'un utilisateur puisse
// récupérer dans un format structuré, couramment utilisé et lisible par
// machine, l'ensemble des données personnelles qu'il a fournies. JSON
// remplit ces 3 critères.
//
// Symétrique de /api/me/delete : on lit les mêmes tables incipit_*.
// L'utilisateur récupère tout ce qui SERAIT supprimé s'il appuyait sur
// "Supprimer mon compte". Format auto-suffisant : un autre dev pourrait
// recharger ces données dans un autre service avec ce seul fichier.
//
// Sécurité :
// - Auth check via cookie session (RLS s'applique → `select('*')` ne ramène
//   QUE les rows du user authentifié).
// - On utilise `serverSupabase()` (pas l'admin) : la portabilité ne nécessite
//   aucun privilège élevé, l'utilisateur a accès à ses propres données par
//   définition.
// - Header `Content-Disposition: attachment` → téléchargement direct.
// - `Cache-Control: no-store` → pas de mise en cache (données sensibles).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tables alignées sur /api/me/delete pour cohérence : tout ce qui est
// supprimable est exportable. Ordre = ordre de lecture, peu important.
// On inclut aussi `incipit_profiles` qui n'est pas listé côté delete (le
// trigger `auth.users` cascade le supprime en automatique) mais qui est
// pertinent pour la portabilité.
const USER_TABLES = [
  "incipit_profiles",
  "incipit_favorites",
  "incipit_streaks",
  "incipit_prefs",
  "incipit_premium",
  "incipit_push_subscriptions",
  "incipit_telemetry_events",
] as const;

export async function GET() {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 }
    );
  }

  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }

  // 1. Auth check — getUser() valide le token côté serveur (vs getSession()
  //    qui se contente de lire le cookie sans vérifier auprès de Supabase).
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = userData.user;
  const userId = user.id;

  // 2. Lecture parallèle des tables incipit_*. Avec RLS activée, chaque
  //    SELECT renverra automatiquement uniquement les rows correspondant à
  //    l'utilisateur courant. On garde un .eq('user_id', userId) explicite
  //    en defense-in-depth (au cas où une RLS policy serait mal configurée).
  const fetches = USER_TABLES.map(async (table) => {
    // incipit_profiles a une colonne `user_id` qui est aussi sa primary key.
    // Les autres tables ont une colonne `user_id` foreign key. Même pattern.
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.warn(`[me/export] fetch ${table}:`, error.message);
        return { table, rows: [], error: error.message };
      }
      return { table, rows: data ?? [] };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown";
      console.error(`[me/export] fetch ${table} threw:`, msg);
      return { table, rows: [], error: msg };
    }
  });

  const results = await Promise.all(fetches);

  // Construction du payload final. On groupe par table pour que le format
  // soit auto-descriptif et reste valide même si une table est vide ou en
  // erreur partielle.
  const data: Record<string, unknown> = {};
  const partialErrors: Record<string, string> = {};
  for (const r of results) {
    data[r.table] = r.rows;
    if (r.error) partialErrors[r.table] = r.error;
  }

  const payload = {
    meta: {
      format: "incipit-export-v1",
      exported_at: new Date().toISOString(),
      legal_basis: "Article 20 GDPR — right to data portability",
      issuer: "Incipit (https://incipit-navy.vercel.app)",
      contact: "guillaumecoulon1@gmail.com",
      partial_errors:
        Object.keys(partialErrors).length > 0 ? partialErrors : undefined,
    },
    account: {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      provider: user.app_metadata?.provider ?? "email",
      providers: user.app_metadata?.providers ?? [],
      user_metadata: user.user_metadata ?? null,
    },
    data,
  };

  // Téléchargement direct : nom de fichier daté + user id raccourci pour
  // éviter d'exposer le full UUID dans le filename si partage écran.
  const shortId = userId.slice(0, 8);
  const date = new Date().toISOString().split("T")[0];
  const filename = `incipit-export-${shortId}-${date}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
