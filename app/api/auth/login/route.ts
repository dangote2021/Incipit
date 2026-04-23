// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login — envoie un magic link par email.
//
// Body : { email: string }
// Réponse : { ok: true } même si l'email n'existe pas (anti énumération).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { siteUrl, hasSupabase } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 }
    );
  }

  let body: { email?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  // Validation minimale (on laisse Supabase faire la vraie validation).
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 }
    );
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      // Crée un compte si nécessaire (comportement attendu : on ne distingue
      // pas signup/signin, on envoie toujours un magic link).
      shouldCreateUser: true,
    },
  });

  if (error) {
    // On log côté serveur mais on ne leake pas au client (anti-énum).
    console.error("[auth/login] signInWithOtp failed:", error.message);
  }

  // Toujours 200 pour ne pas laisser deviner si l'email existe.
  return NextResponse.json({ ok: true });
}
