// ─────────────────────────────────────────────────────────────────────────────
// Rotation quotidienne de contenu.
//
// Le pari d'Incipit : revenir chaque jour vaut quelque chose. Pour ça, il
// faut que le feed change — mais de manière déterministe (pas de random,
// pas de drift SSR/client). On s'appuie sur l'epoch UTC (ISO yyyy-mm-dd)
// pour indexer les différents contenus tournants.
//
// Ici on centralise :
//   - dailySeed() : clé stable de la journée ("2026-04-21")
//   - dayOffset() : nombre de jours depuis un epoch interne fixe
//   - pickOfTheDay(list) : élément du jour dans une liste déterministe
//   - getQuizRoundCounter() / bumpQuizRoundCounter() : compteur journalier
//     (remplace le sessionStorage qui était contournable en fermant l'onglet)
//
// Règle d'or : tout ce qui s'affiche côté serveur (SSR) doit utiliser
// `todayUTC()` — pas de Date locale, sinon les caches CDN divergent.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Date du jour en UTC, format ISO (yyyy-mm-dd). Stable partout.
 */
export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

// Epoch interne : 1er janvier 2025. Donne un offset positif et simple.
const EPOCH_ISO = "2025-01-01";

/**
 * Nombre de jours écoulés depuis l'epoch Incipit.
 * Utile pour indexer des listes de contenus sur la journée.
 */
export function dayOffset(now: Date = new Date()): number {
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const epoch = Date.UTC(2025, 0, 1);
  const diff = Math.floor((today - epoch) / 86_400_000);
  return Math.max(0, diff);
}

/**
 * Pick déterministe du jour dans une liste non-vide. Si la liste est
 * modifiée, les utilisateurs voient la même rotation.
 */
export function pickOfTheDay<T>(list: readonly T[], now: Date = new Date()): T {
  if (list.length === 0) {
    throw new Error("pickOfTheDay: empty list");
  }
  return list[dayOffset(now) % list.length];
}

/**
 * Pick stable de N éléments du jour (sans doublons) dans une liste.
 * Utilisé pour promouvoir plusieurs items par jour (3 punchlines, etc.).
 */
export function pickNOfTheDay<T>(
  list: readonly T[],
  n: number,
  now: Date = new Date()
): T[] {
  if (list.length === 0) return [];
  const start = dayOffset(now) % list.length;
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, list.length); i++) {
    out.push(list[(start + i) % list.length]);
  }
  return out;
}

/** Pour info / débogage. */
export const EPOCH_DATE = EPOCH_ISO;

// ─── Compteur quiz journalier ──────────────────────────────────────────────
//
// Ancien : sessionStorage → fermer l'onglet reset → paywall fuite.
// Nouveau : localStorage indexé par jour → 3 parties / jour max en free,
// avec reset automatique le lendemain (et rien d'autre à faire).
//
// Structure stockée : `{ "2026-04-21": 2 }`. On ne stocke pas d'historique
// pour ne pas grossir — l'ancien jour est écrasé.

const QUIZ_COUNTER_KEY = "incipit:quiz:daily:v1";

type DailyCounter = { date: string; played: number };

function safeReadCounter(): DailyCounter {
  if (typeof window === "undefined") {
    return { date: todayUTC(), played: 0 };
  }
  try {
    const raw = window.localStorage.getItem(QUIZ_COUNTER_KEY);
    if (!raw) return { date: todayUTC(), played: 0 };
    const parsed = JSON.parse(raw) as DailyCounter;
    // Si on a changé de jour, on redémarre à 0 (le reset attendu).
    if (parsed?.date !== todayUTC()) {
      return { date: todayUTC(), played: 0 };
    }
    return { date: parsed.date, played: Math.max(0, parsed.played | 0) };
  } catch {
    return { date: todayUTC(), played: 0 };
  }
}

function safeWriteCounter(c: DailyCounter) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUIZ_COUNTER_KEY, JSON.stringify(c));
  } catch {
    // ignore (quota, etc.)
  }
}

export function getQuizRoundCounter(): number {
  return safeReadCounter().played;
}

export function bumpQuizRoundCounter(): number {
  const cur = safeReadCounter();
  const next: DailyCounter = { date: cur.date, played: cur.played + 1 };
  safeWriteCounter(next);
  return next.played;
}

/**
 * Reset manuel (utile pour les tests ou un bouton admin). Pas branché dans
 * l'UI pour l'instant.
 */
export function resetQuizCounter() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(QUIZ_COUNTER_KEY);
  } catch {
    // ignore
  }
}

/**
 * Joli label relatif ("aujourd'hui", "hier", "X jours") à partir d'un ISO.
 */
export function relativeDayLabel(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate + "T00:00:00Z");
  const today = new Date(todayUTC(now) + "T00:00:00Z");
  const diff = Math.floor((today.getTime() - then.getTime()) / 86_400_000);
  if (diff <= 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff} jours`;
  return `Il y a ${Math.floor(diff / 7)} semaine${diff >= 14 ? "s" : ""}`;
}
