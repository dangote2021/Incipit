// ─────────────────────────────────────────────────────────────────────────────
// POST /api/beta/approve — change le status d'un candidat beta tester.
//
// Protection : cookie incipit_admin === process.env.INCIPIT_ADMIN_TOKEN.
// Body : { id: string, status: 'approved' | 'rejected' | 'active' }
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["approved", "rejected", "active"] as const;

export async function POST(request: Request) {
  const adminToken = process.env.INCIPIT_ADMIN_TOKEN;
  const cookieToken = cookies().get("incipit_admin")?.value;
  if (!adminToken || cookieToken !== adminToken) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseAdmin()) {
    return NextResponse.json(
      { error: "service_not_configured" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!id || !(ALLOWED_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const admin = adminSupabase()!;
  const update: { status: string; approved_at?: string } = { status };
  if (status === "approved" || status === "active") {
    update.approved_at = new Date().toISOString();
  }
  const { error } = await admin
    .from("incipit_beta_testers")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("[beta/approve]", error);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
