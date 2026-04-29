// ─────────────────────────────────────────────────────────────────────────────
// GET /api/cron/daily-push — appelé par Vercel Cron chaque matin.
//
// Envoie l'incipit du jour à tous les abonnés Web Push.
// Authentifié par header `Authorization: Bearer ${CRON_SECRET}`.
//
// Limites :
//  - Les sends sont faits par batch de 50 pour éviter les timeouts.
//  - Les endpoints qui renvoient 404/410 sont nettoyés (abonnement mort).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import webpush from "web-push";
import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin, hasVapid } from "@/lib/supabase/env";
import { getDailyIncipit, incipitTeaser } from "@/lib/daily-incipit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BATCH_SIZE = 50;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!hasVapid() || !hasSupabaseAdmin()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:contact@incipit.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const admin = adminSupabase()!;
  const { book } = getDailyIncipit(0);

  const payload = JSON.stringify({
    title: "Incipit du jour",
    body: incipitTeaser(book, 120),
    url: `/book/${book.id}`,
    tag: `incipit-${new Date().toISOString().slice(0, 10)}`,
  });

  // On itère en pages pour ne pas tout charger en mémoire.
  let offset = 0;
  let sent = 0;
  let cleaned = 0;

  while (true) {
    const { data: subs, error } = await admin
      .from("incipit_push_subscriptions")
      .select("endpoint, p256dh, auth")
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      console.error("[cron/daily-push] db error:", error.message);
      break;
    }
    if (!subs || subs.length === 0) break;

    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: s.endpoint,
              keys: { p256dh: s.p256dh, auth: s.auth },
            },
            payload
          );
          sent++;
        } catch (err) {
          const code =
            (err as { statusCode?: number })?.statusCode ?? 0;
          // 404/410 = abonnement mort, on le supprime.
          if (code === 404 || code === 410) {
            await admin
              .from("incipit_push_subscriptions")
              .delete()
              .eq("endpoint", s.endpoint);
            cleaned++;
          } else {
            console.warn("[cron/daily-push] send failed:", code);
          }
        }
      })
    );

    if (subs.length < BATCH_SIZE) break;
    offset += BATCH_SIZE;
  }

  return NextResponse.json({ ok: true, sent, cleaned, bookId: book.id });
}
