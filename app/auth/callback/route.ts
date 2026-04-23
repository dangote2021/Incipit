// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/callback?code=... — Supabase redirige ici après le clic sur le
// magic link. On échange le code contre une session (cookies), puis on
// redirige vers la home (ou la page "next" passée en paramètre).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.redirect(`${siteUrl()}/auth/login?error=missing_code`);
  }

  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.redirect(`${siteUrl()}/?auth=not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(`${siteUrl()}/auth/login?error=exchange`);
  }

  // Redirection relative sécurisée (empêche open redirect).
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return NextResponse.redirect(`${siteUrl()}${safeNext}`);
}
