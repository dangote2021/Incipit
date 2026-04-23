// ─────────────────────────────────────────────────────────────────────────────
// Rate limit simple, backend-agnostic.
//
// Stratégie : fenêtre fixe de 1h par clé (IP+route), stockée en Postgres si
// Supabase admin dispo, sinon en mémoire (best-effort, multi-instance pas
// garanti mais déjà mieux que rien).
//
// Usage (dans une route) :
//    const rl = await checkRate("incipit-card:" + ip, 60);
//    if (!rl.ok) return new Response("too many", { status: 429 });
// ─────────────────────────────────────────────────────────────────────────────

import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin } from "@/lib/supabase/env";

const WINDOW_MS = 60 * 60 * 1000; // 1h

// Fallback mémoire (best-effort — reset au redéploiement).
const memStore = new Map<string, { count: number; start: number }>();

export async function checkRate(
  key: string,
  limit: number
): Promise<{ ok: boolean; remaining: number }> {
  const admin = hasSupabaseAdmin() ? adminSupabase() : null;
  const now = Date.now();

  // ─── Backend persistant (préféré) ──────────────────────────────────────
  if (admin) {
    const { data } = await admin
      .from("rate_limits")
      .select("count, window_start")
      .eq("key", key)
      .maybeSingle();

    if (!data) {
      await admin
        .from("rate_limits")
        .insert({ key, count: 1, window_start: new Date(now).toISOString() });
      return { ok: true, remaining: limit - 1 };
    }

    const winStart = new Date(data.window_start).getTime();
    if (now - winStart > WINDOW_MS) {
      // Reset fenêtre
      await admin
        .from("rate_limits")
        .update({ count: 1, window_start: new Date(now).toISOString() })
        .eq("key", key);
      return { ok: true, remaining: limit - 1 };
    }

    if (data.count >= limit) {
      return { ok: false, remaining: 0 };
    }

    await admin
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("key", key);
    return { ok: true, remaining: limit - data.count - 1 };
  }

  // ─── Fallback mémoire ──────────────────────────────────────────────────
  const entry = memStore.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    memStore.set(key, { count: 1, start: now });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: limit - entry.count };
}

/** Extrait l'IP client du request (Vercel set x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
