// POST /api/push/unsubscribe — retire un abonnement par endpoint.
import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasSupabaseAdmin()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { endpoint?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!body.endpoint) {
    return NextResponse.json({ error: "missing_endpoint" }, { status: 400 });
  }

  const admin = adminSupabase()!;
  await admin.from("incipit_push_subscriptions").delete().eq("endpoint", body.endpoint);
  return NextResponse.json({ ok: true });
}
