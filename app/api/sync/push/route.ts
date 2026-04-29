// ─────────────────────────────────────────────────────────────────────────────
// POST /api/sync/push — merge des deltas client → serveur.
//
// Body (tous les champs optionnels) :
//   {
//     profile: Partial<ProfileRow>,
//     favorites: Array<Favorite>,     // remplace complètement le set (upsert)
//     streak: StreakState,            // merge last-write-wins
//   }
//
// Stratégie : on fait confiance au client pour le contenu (RLS filtre), mais
// on valide la forme pour éviter les injections côté DB.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import type { FavoriteKind } from "@/lib/favorites-ids";

export const dynamic = "force-dynamic";

const VALID_KINDS: FavoriteKind[] = [
  "incipit",
  "quote",
  "punchline",
  "passage",
  "book",
];
const VALID_TONES = ["boloss", "neutre"] as const;

export async function POST(req: Request) {
  const supabase = serverSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const results: Record<string, "ok" | "skipped" | "error"> = {};

  // ─── profile ──────────────────────────────────────────────────────────
  if (body.profile && typeof body.profile === "object") {
    const p = body.profile as Record<string, unknown>;
    const patch: Record<string, unknown> = { id: user.id };
    if (typeof p.first_name === "string") patch.first_name = p.first_name.slice(0, 64);
    if (Array.isArray(p.genres)) {
      patch.genres = (p.genres as unknown[])
        .filter((g): g is string => typeof g === "string")
        .slice(0, 20);
    }
    if (typeof p.tone === "string" && (VALID_TONES as readonly string[]).includes(p.tone)) {
      patch.tone = p.tone;
    }
    if (typeof p.hide_streak === "boolean") patch.hide_streak = p.hide_streak;
    if (typeof p.visits === "number" && Number.isFinite(p.visits)) {
      patch.visits = Math.max(0, Math.floor(p.visits));
    }
    patch.last_seen_at = new Date().toISOString();

    const { error } = await supabase
      .from("incipit_profiles")
      .upsert(patch, { onConflict: "id" });
    results.profile = error ? "error" : "ok";
    if (error) console.error("[sync/push] profile:", error.message);
  } else {
    results.profile = "skipped";
  }

  // ─── favorites ────────────────────────────────────────────────────────
  if (Array.isArray(body.favorites)) {
    const list = (body.favorites as unknown[])
      .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
      .map((f) => {
        const kind = f.kind;
        if (typeof kind !== "string" || !VALID_KINDS.includes(kind as FavoriteKind)) {
          return null;
        }
        const fav_id = typeof f.id === "string" ? f.id : null;
        if (!fav_id) return null;
        return {
          user_id: user.id,
          fav_id,
          kind,
          label:
            typeof f.label === "string" ? f.label.slice(0, 200) : "(sans titre)",
          sub: typeof f.sub === "string" ? f.sub.slice(0, 200) : null,
          href: typeof f.href === "string" ? f.href.slice(0, 500) : "/",
          added_at:
            typeof f.addedAt === "string" ? f.addedAt : new Date().toISOString(),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (list.length > 0) {
      const { error } = await supabase
        .from("incipit_favorites")
        .upsert(list, { onConflict: "user_id,fav_id" });
      results.favorites = error ? "error" : "ok";
      if (error) console.error("[sync/push] favorites:", error.message);
    } else {
      results.favorites = "ok";
    }
  } else {
    results.favorites = "skipped";
  }

  // ─── streak ───────────────────────────────────────────────────────────
  if (body.streak && typeof body.streak === "object") {
    const s = body.streak as Record<string, unknown>;
    const { error } = await supabase.rpc("upsert_incipit_streak", {
      p_current: typeof s.current === "number" ? Math.max(0, Math.floor(s.current)) : 0,
      p_longest: typeof s.longest === "number" ? Math.max(0, Math.floor(s.longest)) : 0,
      p_last_open:
        typeof s.lastOpen === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.lastOpen)
          ? s.lastOpen
          : new Date().toISOString().slice(0, 10),
      p_total_days:
        typeof s.totalDays === "number" ? Math.max(0, Math.floor(s.totalDays)) : 0,
      p_celebrated: Array.isArray(s.celebrated)
        ? (s.celebrated as unknown[])
            .filter((n): n is number => typeof n === "number")
            .slice(0, 20)
        : [],
    });
    results.streak = error ? "error" : "ok";
    if (error) console.error("[sync/push] streak:", error.message);
  } else {
    results.streak = "skipped";
  }

  return NextResponse.json({ ok: true, results });
}
