// ─────────────────────────────────────────────────────────────────────────────
// POST /api/me/delete — suppression de compte utilisateur (RGPD + Apple
// guideline 5.1.1(v)).
//
// Apple impose depuis juin 2022 que toute app proposant la création d'un
// compte propose aussi un mécanisme in-app de suppression. Sans cet
// endpoint, refus de review garanti.
//
// Comportement :
// 1. Vérifier que l'utilisateur est authentifié (sinon 401)
// 2. Supprimer toutes les rangées des tables incipit_* liées à user_id
// 3. Supprimer l'utilisateur de auth.users (cascade)
// 4. Côté Stripe : marquer le customer comme "deleted" (on garde le
//    customer pour les obligations comptables — facturation, contrôle
//    fiscal, mais on le détache du user_id)
// 5. Renvoyer 200 — le client doit ensuite logout + clear localStorage
//
// On ne fait PAS de soft-delete : la demande RGPD (article 17) impose
// une suppression effective, pas une mise à la corbeille.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase, adminSupabase } from "@/lib/supabase/server";
import { hasSupabase, hasSupabaseAdmin, hasStripe } from "@/lib/supabase/env";
import { stripeServer } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

// Les tables incipit_* qui contiennent une colonne user_id à nettoyer.
// Ordre d'importance : on commence par les tables référençant user_id
// directement, on finit par incipit_premium (qui peut référencer un
// stripe_customer_id qu'on traite à part).
const USER_TABLES = [
  "incipit_favorites",
  "incipit_streak",
  "incipit_prefs",
  "incipit_push_subscriptions",
  "incipit_telemetry_events",
  "incipit_premium",
];

export async function POST() {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 }
    );
  }

  // 1. Authentification — on lit la session via le cookie httpOnly.
  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = userData.user;
  const userId = user.id;

  // 2. Pour les opérations destructives on utilise le service_role (RLS
  //    bypass) — c'est ICI le seul cas légitime côté Incipit puisqu'on
  //    veut supprimer dans toutes les tables liées y compris auth.users.
  if (!hasSupabaseAdmin()) {
    console.error("[me/delete] no admin key — cannot complete deletion");
    return NextResponse.json(
      { error: "deletion_not_configured" },
      { status: 503 }
    );
  }
  const admin = adminSupabase();
  if (!admin) {
    return NextResponse.json(
      { error: "deletion_not_configured" },
      { status: 503 }
    );
  }

  // 3. Récup le stripe_customer_id avant suppression pour pouvoir traiter
  //    Stripe ensuite (le marquer deleted côté Stripe — pour les
  //    obligations comptables on garde le customer 10 ans, mais détaché).
  let stripeCustomerId: string | null = null;
  try {
    const { data } = await admin
      .from("incipit_premium")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();
    stripeCustomerId = data?.stripe_customer_id ?? null;
  } catch {
    // Tant pis si la lookup échoue — on continue, le webhook Stripe
    // peut nettoyer plus tard.
  }

  // 4. Suppression de toutes les rangées user_id dans les tables incipit_*.
  //    On ne fait PAS de transaction parce que Supabase REST ne le
  //    supporte pas hors RPC — on accepte qu'un échec partiel laisse
  //    quelques rangées orphelines (logguées, à nettoyer manuellement).
  const errors: string[] = [];
  for (const table of USER_TABLES) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);
    if (error) {
      console.error(
        `[me/delete] delete ${table} for ${userId} failed:`,
        error.message
      );
      errors.push(`${table}: ${error.message}`);
    }
  }

  // 5. Annulation de l'abonnement Stripe + marquage customer deleted.
  //    On garde le customer pour la traçabilité comptable (10 ans en France)
  //    mais on annule l'abonnement actif et on met les metadata à "deleted".
  if (stripeCustomerId && hasStripe()) {
    const stripe = stripeServer();
    if (stripe) {
      try {
        // Annule tous les abonnements actifs.
        const subs = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: "active",
        });
        for (const sub of subs.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
        // Marque le customer comme deleted côté metadata.
        await stripe.customers.update(stripeCustomerId, {
          metadata: {
            deleted_at: new Date().toISOString(),
            deleted_reason: "user_account_deletion_request",
          },
        });
      } catch (e) {
        console.error("[me/delete] stripe cleanup failed:", e);
        errors.push(
          `stripe: ${e instanceof Error ? e.message : "unknown"}`
        );
      }
    }
  }

  // 6. Suppression du user dans auth.users via l'admin API. C'est l'étape
  //    irréversible — après ça l'email peut être réutilisé pour créer un
  //    nouveau compte.
  const { error: deleteUserErr } = await admin.auth.admin.deleteUser(userId);
  if (deleteUserErr) {
    console.error(
      "[me/delete] admin.deleteUser failed:",
      deleteUserErr.message
    );
    return NextResponse.json(
      {
        error: "auth_delete_failed",
        details: deleteUserErr.message,
        partial_errors: errors,
      },
      { status: 500 }
    );
  }

  // 7. Logout — on efface aussi les cookies de session côté client.
  await supabase.auth.signOut();

  return NextResponse.json({
    ok: true,
    user_id: userId,
    deleted_at: new Date().toISOString(),
    partial_errors: errors.length > 0 ? errors : undefined,
  });
}
