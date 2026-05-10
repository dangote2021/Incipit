// ─────────────────────────────────────────────────────────────────────────────
// POST /api/beta/signup — création d'une candidature beta tester.
//
// Insère dans incipit_beta_testers via le client SSR (RLS policy 'public
// insert' active sur la table). Pas d'auth requise (formulaire public).
// Conflit unique sur email → 409 already_registered.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasSupabase()) {
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

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = serverSupabase()!;

  // Lookup parrain (optionnel) — on ne renvoie pas d'erreur si invalide,
  // on perd juste la traçabilité du parrainage
  let invited_by: string | null = null;
  if (body.invited_by_code) {
    const { data } = await supabase
      .from("incipit_beta_testers")
      .select("id")
      .eq("invite_code", String(body.invited_by_code))
      .maybeSingle();
    invited_by = data?.id ?? null;
  }

  const { error } = await supabase.from("incipit_beta_testers").insert({
    email,
    full_name: String(body.full_name || "").trim() || null,
    motivation: String(body.motivation || "").trim() || null,
    device_android: !!body.device_android,
    device_ios: !!body.device_ios,
    google_play_email:
      String(body.google_play_email || "").trim().toLowerCase() || null,
    invited_by,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "already_registered" },
        { status: 409 }
      );
    }
    console.error("[beta/signup]", error);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
