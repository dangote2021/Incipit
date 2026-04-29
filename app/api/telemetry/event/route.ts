// ─────────────────────────────────────────────────────────────────────────────
// POST /api/telemetry/event — enregistre un événement anonyme.
//
// Body : { event: string, session_id: string, metadata?: Record<string, any> }
// Pas de PII, pas d'IP stockée, session_id tourne toutes les 24h côté client.
//
// Events tolérés (allowlist explicite pour limiter l'exposition) :
//   - "incipit_viewed"
//   - "quiz_completed"
//   - "daily_quiz_completed"
//   - "share_clicked"
//   - "premium_view_paywall"
//   - "premium_checkout_started"
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin } from "@/lib/supabase/env";
import { checkRate, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "incipit_viewed",
  "quiz_completed",
  "daily_quiz_completed",
  "share_clicked",
  "premium_view_paywall",
  "premium_checkout_started",
  "favorite_toggled",
  "onboarding_completed",
]);

export async function POST(req: Request) {
  if (!hasSupabaseAdmin()) {
    // Pas de DB → on ignore silencieusement (mode V1).
    return NextResponse.json({ ok: true, skipped: "no_db" });
  }

  // Rate limit : 300 events/h par IP (couvre largement un usage normal).
  const ip = clientIp(req);
  const rl = await checkRate(`telemetry:${ip}`, 300);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: {
    event?: string;
    session_id?: string;
    metadata?: unknown;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const event = body.event;
  const sessionId = body.session_id;
  if (!event || !sessionId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: "unknown_event" }, { status: 400 });
  }

  // metadata : on accepte un objet plat simple (anti-injection).
  let metadata: Record<string, unknown> = {};
  if (body.metadata && typeof body.metadata === "object") {
    for (const [k, v] of Object.entries(body.metadata as Record<string, unknown>)) {
      if (typeof k !== "string" || k.length > 40) continue;
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        metadata[k] = typeof v === "string" ? v.slice(0, 120) : v;
      }
    }
  }

  const admin = adminSupabase()!;
  const { error } = await admin.from("incipit_telemetry_events").insert({
    event,
    session_id: sessionId.slice(0, 64),
    metadata,
  });

  if (error) {
    console.warn("[telemetry] insert error:", error.message);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
