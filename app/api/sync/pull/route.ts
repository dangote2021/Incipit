// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sync/pull — renvoie tout l'état serveur de l'utilisateur connecté.
//
// Le client appelle ça après login pour rapatrier les données, puis merge
// avec localStorage (last-write-wins par addedAt/updated_at).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Appels parallèles — chaque table est RLS-filtrée.
  const [profileRes, favRes, streakRes, premiumRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("favorites")
      .select("*")
      .order("added_at", { ascending: false }),
    supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("premium").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null },
    profile: profileRes.data ?? null,
    favorites: favRes.data ?? [],
    streak: streakRes.data ?? null,
    premium: premiumRes.data ?? null,
  });
}
