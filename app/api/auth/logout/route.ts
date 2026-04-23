// POST /api/auth/logout — ferme la session côté serveur.
import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = serverSupabase();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
