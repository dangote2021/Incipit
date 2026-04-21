// ─────────────────────────────────────────────────────────────────────────────
// Préférences utilisateur stockées localement (aucun serveur).
// On garde simple : un seul objet JSON sérialisé dans localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import type { Genre } from "./types";

export type IncipitTone = "boloss" | "neutre";

export type IncipitPrefs = {
  /** Marqueur : l'utilisateur a terminé l'onboarding au moins une fois */
  onboarded: boolean;
  /** ISO date du premier onboarding */
  onboardedAt: string;
  /** ISO date de la dernière visite (mise à jour à l'entrée) */
  lastSeenAt: string;
  /** Prénom saisi à l'onboarding (peut être vide si passé) */
  firstName: string;
  /** Genres sélectionnés à l'onboarding */
  genres: Genre[];
  /** Ton narratif choisi */
  tone: IncipitTone;
  /** Nombre total de visites */
  visits: number;
};

const KEY = "incipit:prefs:v1";

// Cookie miroir des genres choisis — permet au server component (home) de
// trier le feed avant le premier paint, donc plus de jump d'hydratation
// (retour panel beta v3 — Inès : "flash ~200ms après re-order client").
const GENRES_COOKIE = "incipit_genres";

function writeGenresCookie(genres: Genre[]) {
  if (typeof document === "undefined") return;
  try {
    const value = genres.join(",");
    // 1 an, samesite lax, pas de secure car on est en dev aussi http.
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${GENRES_COOKIE}=${encodeURIComponent(
      value
    )}; max-age=${maxAge}; path=/; samesite=lax`;
  } catch {
    // ignore
  }
}

export const DEFAULT_PREFS: IncipitPrefs = {
  onboarded: false,
  onboardedAt: "",
  lastSeenAt: "",
  firstName: "",
  genres: [],
  tone: "boloss",
  visits: 0,
};

function safeGet(): IncipitPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IncipitPrefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return null;
  }
}

function safeSet(prefs: IncipitPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // ignore (quota, mode privé, etc.)
  }
}

/**
 * Retourne les préférences actuelles. Si aucune n'existe, renvoie
 * `DEFAULT_PREFS` (non persisté).
 */
export function getPrefs(): IncipitPrefs {
  return safeGet() ?? DEFAULT_PREFS;
}

/**
 * Indique si l'utilisateur a déjà terminé l'onboarding. Utilisé pour
 * différencier "nouveau" vs "retour" sur la home.
 */
export function isOnboarded(): boolean {
  return getPrefs().onboarded;
}

/**
 * Met à jour le marqueur de visite. À appeler côté client à l'entrée de
 * l'app. Retourne les prefs mises à jour.
 */
export function markVisit(): IncipitPrefs {
  const current = getPrefs();
  const next: IncipitPrefs = {
    ...current,
    lastSeenAt: new Date().toISOString(),
    visits: current.visits + 1,
  };
  safeSet(next);
  return next;
}

/**
 * Finalise l'onboarding avec les choix de l'utilisateur. `firstName` est
 * optionnel — si l'utilisateur a skippé l'étape, on garde la valeur
 * précédente (ou "").
 */
export function completeOnboarding(input: {
  genres: Genre[];
  tone: IncipitTone;
  firstName?: string;
}): IncipitPrefs {
  const current = getPrefs();
  const now = new Date().toISOString();
  const trimmed = (input.firstName ?? current.firstName ?? "").trim();
  const next: IncipitPrefs = {
    ...current,
    onboarded: true,
    onboardedAt: current.onboardedAt || now,
    lastSeenAt: now,
    firstName: trimmed,
    genres: input.genres,
    tone: input.tone,
  };
  safeSet(next);
  writeGenresCookie(input.genres);
  return next;
}

/**
 * Met à jour partiellement les préférences (ex. changement de ton depuis
 * le profil, ajout/retrait d'un genre).
 */
export function updatePrefs(patch: Partial<IncipitPrefs>): IncipitPrefs {
  const next: IncipitPrefs = { ...getPrefs(), ...patch };
  safeSet(next);
  if (patch.genres) writeGenresCookie(patch.genres);
  return next;
}

/**
 * Efface les préférences (debug / reset manuel).
 */
export function clearPrefs() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    if (typeof document !== "undefined") {
      document.cookie = `${GENRES_COOKIE}=; max-age=0; path=/; samesite=lax`;
    }
  } catch {
    // ignore
  }
}

/**
 * Parse le cookie genres côté serveur. Retourne un tableau vide si le cookie
 * est absent ou contient des valeurs inconnues. Utilisé par le server
 * component home pour trier le feed avant le premier paint.
 */
export function parseGenresCookie(raw: string | undefined): Genre[] {
  if (!raw) return [];
  const allowed: Genre[] = [
    "classique",
    "contemporain",
    "poesie",
    "polar",
    "sf-fantastique",
    "philosophie",
    "theatre",
    "bd-graphique",
  ];
  const set = new Set<Genre>(allowed);
  return decodeURIComponent(raw)
    .split(",")
    .map((g) => g.trim())
    .filter((g): g is Genre => set.has(g as Genre));
}

export const GENRES_COOKIE_NAME = GENRES_COOKIE;

/**
 * Helpers de lisibilité pour la home.
 */
export function daysSince(iso: string): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const diff = Date.now() - then;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
