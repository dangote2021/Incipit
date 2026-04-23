// ─────────────────────────────────────────────────────────────────────────────
// Sync engine client — orchestre le pull initial (DB → local) et le push
// incrémental (local → DB) après chaque mutation.
//
// Règles :
//  - Le client reste source de vérité tant qu'il n'est pas connecté.
//  - Au login : on pull, on merge "union" (favoris), "max" (streak.longest,
//    totalDays), "server-wins" (premium) et "client-wins-if-recent" (profile).
//  - Après chaque toggle/update local : on push en debounced.
//  - Si l'API est down ou l'utilisateur n'est pas connecté, on no-op.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import type { Favorite } from "@/lib/favorites-ids";
import type { IncipitPrefs } from "@/lib/prefs";

const PUSH_DEBOUNCE_MS = 1200;
const SYNC_KEY = "incipit:sync:v1"; // flag "déjà pull-mergé cette session"

type PullResponse = {
  user: { id: string; email: string | null };
  profile: {
    first_name: string;
    genres: string[];
    tone: string;
    hide_streak: boolean;
    visits: number;
    onboarded_at: string | null;
    last_seen_at: string | null;
  } | null;
  favorites: Array<{
    fav_id: string;
    kind: Favorite["kind"];
    label: string;
    sub: string | null;
    href: string;
    added_at: string;
  }>;
  streak: {
    current: number;
    longest: number;
    last_open: string | null;
    total_days: number;
    celebrated: number[];
  } | null;
  premium: {
    is_premium: boolean;
    activated_at: string | null;
    trial_ends_at: string | null;
  } | null;
};

// ─── Push debounced ───────────────────────────────────────────────────────

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function schedulePush() {
  if (typeof window === "undefined") return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    doPush().catch(() => {
      // silent : on retentera au prochain trigger
    });
  }, PUSH_DEBOUNCE_MS);
}

async function doPush() {
  const favoritesRaw = localStorage.getItem("incipit:favorites:v1");
  const streakRaw = localStorage.getItem("incipit:streak:v1");
  const prefsRaw = localStorage.getItem("incipit:prefs:v1");

  const favorites = favoritesRaw ? safeParse<Favorite[]>(favoritesRaw, []) : [];
  const streak = streakRaw ? safeParse<Record<string, unknown>>(streakRaw, {}) : null;
  const prefs = prefsRaw ? safeParse<IncipitPrefs>(prefsRaw, null as unknown as IncipitPrefs) : null;

  const body: Record<string, unknown> = { favorites };
  if (streak) body.streak = streak;
  if (prefs) {
    body.profile = {
      first_name: prefs.firstName,
      genres: prefs.genres,
      tone: prefs.tone,
      hide_streak: prefs.hideStreak,
      visits: prefs.visits,
    };
  }

  try {
    const res = await fetch("/api/sync/push", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    // 401 / 503 = on n'est pas connecté ou Supabase absent : OK, c'est silencieux.
    if (!res.ok && res.status !== 401 && res.status !== 503) {
      console.warn("[sync/push] failed", res.status);
    }
  } catch {
    // offline : on retry plus tard naturellement
  }
}

// ─── Pull initial (post-login) ────────────────────────────────────────────

export async function pullAndMerge(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/sync/pull", { credentials: "include" });
    if (res.status === 503 || res.status === 401) return false;
    if (!res.ok) return false;

    const data = (await res.json()) as PullResponse;
    mergeFavorites(data.favorites);
    if (data.streak) mergeStreak(data.streak);
    if (data.profile) mergeProfile(data.profile);
    if (data.premium) mergePremium(data.premium);

    sessionStorage.setItem(SYNC_KEY, "1");
    window.dispatchEvent(new CustomEvent("incipit:sync:done"));
    return true;
  } catch {
    return false;
  }
}

// ─── Merge strategies ─────────────────────────────────────────────────────

function mergeFavorites(serverFavs: PullResponse["favorites"]) {
  const raw = localStorage.getItem("incipit:favorites:v1");
  const local: Favorite[] = raw ? safeParse<Favorite[]>(raw, []) : [];

  const byId = new Map<string, Favorite>();
  // server d'abord…
  for (const s of serverFavs) {
    byId.set(s.fav_id, {
      id: s.fav_id,
      kind: s.kind,
      label: s.label,
      sub: s.sub ?? undefined,
      href: s.href,
      addedAt: s.added_at,
    });
  }
  // …puis local écrase si plus récent (pour le label/sub qui ont pu changer)
  for (const l of local) {
    const existing = byId.get(l.id);
    if (!existing) {
      byId.set(l.id, l);
    } else if (new Date(l.addedAt) > new Date(existing.addedAt)) {
      byId.set(l.id, l);
    }
  }
  const merged = [...byId.values()].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
  localStorage.setItem("incipit:favorites:v1", JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("incipit:favorites:change"));
}

function mergeStreak(server: NonNullable<PullResponse["streak"]>) {
  const raw = localStorage.getItem("incipit:streak:v1");
  const local = raw ? safeParse<Record<string, unknown>>(raw, {}) : {};
  const merged = {
    current: pickMax(local.current, server.current),
    longest: pickMax(local.longest, server.longest),
    lastOpen: pickLatestDate(local.lastOpen as string, server.last_open ?? ""),
    totalDays: pickMax(local.totalDays, server.total_days),
    celebrated: unionNumbers(local.celebrated, server.celebrated),
  };
  localStorage.setItem("incipit:streak:v1", JSON.stringify(merged));
}

function mergeProfile(server: NonNullable<PullResponse["profile"]>) {
  const raw = localStorage.getItem("incipit:prefs:v1");
  const local = raw
    ? safeParse<IncipitPrefs>(raw, null as unknown as IncipitPrefs)
    : null;
  const merged: Partial<IncipitPrefs> = {
    firstName: local?.firstName || server.first_name,
    genres: (local?.genres && local.genres.length > 0
      ? local.genres
      : (server.genres as IncipitPrefs["genres"])) ?? [],
    tone: (local?.tone as IncipitPrefs["tone"]) ||
      (server.tone as IncipitPrefs["tone"]),
    hideStreak:
      typeof local?.hideStreak === "boolean"
        ? local.hideStreak
        : server.hide_streak,
    visits: Math.max(local?.visits ?? 0, server.visits ?? 0),
    onboarded: Boolean(server.onboarded_at) || Boolean(local?.onboarded),
    onboardedAt: server.onboarded_at || local?.onboardedAt || "",
    lastSeenAt: new Date().toISOString(),
  };
  localStorage.setItem(
    "incipit:prefs:v1",
    JSON.stringify({ ...(local ?? {}), ...merged })
  );
}

function mergePremium(server: NonNullable<PullResponse["premium"]>) {
  // Premium = serveur-autoritaire (Stripe webhook).
  localStorage.setItem(
    "incipit:premium:v1",
    JSON.stringify({
      isPremium: server.is_premium,
      activatedAt: server.activated_at,
      trialEndsAt: server.trial_ends_at,
    })
  );
  window.dispatchEvent(new CustomEvent("incipit:premium:change"));
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function pickMax(a: unknown, b: unknown): number {
  const na = typeof a === "number" ? a : 0;
  const nb = typeof b === "number" ? b : 0;
  return Math.max(na, nb);
}

function pickLatestDate(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function unionNumbers(a: unknown, b: unknown): number[] {
  const set = new Set<number>();
  if (Array.isArray(a)) for (const x of a) if (typeof x === "number") set.add(x);
  if (Array.isArray(b)) for (const x of b) if (typeof x === "number") set.add(x);
  return [...set].sort((x, y) => x - y);
}
