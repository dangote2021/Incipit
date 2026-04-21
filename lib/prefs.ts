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
  /** Genres sélectionnés à l'onboarding */
  genres: Genre[];
  /** Ton narratif choisi */
  tone: IncipitTone;
  /** Nombre total de visites */
  visits: number;
};

const KEY = "incipit:prefs:v1";

export const DEFAULT_PREFS: IncipitPrefs = {
  onboarded: false,
  onboardedAt: "",
  lastSeenAt: "",
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
 * Finalise l'onboarding avec les choix de l'utilisateur.
 */
export function completeOnboarding(input: {
  genres: Genre[];
  tone: IncipitTone;
}): IncipitPrefs {
  const current = getPrefs();
  const now = new Date().toISOString();
  const next: IncipitPrefs = {
    ...current,
    onboarded: true,
    onboardedAt: current.onboardedAt || now,
    lastSeenAt: now,
    genres: input.genres,
    tone: input.tone,
  };
  safeSet(next);
  return next;
}

/**
 * Met à jour partiellement les préférences (ex. changement de ton depuis
 * le profil, ajout/retrait d'un genre).
 */
export function updatePrefs(patch: Partial<IncipitPrefs>): IncipitPrefs {
  const next: IncipitPrefs = { ...getPrefs(), ...patch };
  safeSet(next);
  return next;
}

/**
 * Efface les préférences (debug / reset manuel).
 */
export function clearPrefs() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

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
