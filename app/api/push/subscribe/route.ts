// POST /api/push/subscribe — enregistre un PushSubscription navigateur.
//
// Body : { endpoint, keys: { p256dh, auth } }
// L'utilisateur peut être anonyme (user_id=null) ou connecté.
// Rattrape le user_id au login via un trigger côté client si besoin.

import { NextResponse } from "next/server";
import { serverSupabase, adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin, hasVapid } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasVapid() || !hasSupabaseAdmin()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const endpoint = body.endpoint;
  const p256dh = body.keys?.p256dh;
  const auth = body.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "missing_keys" }, { status: 400 });
  }

  // Validation de l'endpoint : on n'accepte que des URLs https provenant d'un
  // service push connu (FCM côté Chrome/Edge/Firefox, Apple Push). Évite de
  // polluer la table avec des entrées malformées qui rateront ensuite leur
  // envoi silencieusement.
  let endpointUrl: URL;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }
  if (endpointUrl.protocol !== "https:") {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }
  const allowedHosts = [
    "fcm.googleapis.com",
    "updates.push.services.mozilla.com",
    "updates-autopush.stage.mozaws.net",
    "updates-autopush.dev.mozaws.net",
  ];
  const okHost =
    allowedHosts.includes(endpointUrl.hostname) ||
    endpointUrl.hostname.endsWith(".push.apple.com") ||
    endpointUrl.hostname.endsWith(".notify.windows.com");
  if (!okHost) {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }

  // Optionnel : lie au user_id si connecté.
  let userId: string | null = null;
  const supabase = serverSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  const admin = adminSupabase()!;
  const ua = req.headers.get("user-agent") ?? null;

  const { error } = await admin.from("incipit_push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint,
      p256dh,
      auth,
      user_agent: ua?.slice(0, 200) ?? null,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("[push/subscribe] error:", error.message);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
