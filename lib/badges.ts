// ─────────────────────────────────────────────────────────────────────────────
// Jalons culturels littéraires ("badges" si on parle aux millennials).
//
// On ne fait PAS de gamification toxique : ni XP, ni streak agressif, ni
// notifications "reviens vite sinon tu perds ta série". Les jalons se
// débloquent en silence pendant les quiz, en hommage au patrimoine que tu
// viens de croiser. C'est un clin d'œil, pas un algorithme d'addiction.
//
// Principe : après chaque quiz on met à jour un compteur local (localStorage),
// on compare aux conditions de chaque jalon, et on renvoie la liste des
// jalons nouvellement débloqués — à afficher une fois, discrètement.
// ─────────────────────────────────────────────────────────────────────────────

import type { LitCategory, LitEra } from "./quiz-literature";

// ─── Stats trackées ─────────────────────────────────────────────────────────
export type BadgeStats = {
  /** Nombre total de questions répondues (bonnes + mauvaises). */
  totalAnswered: number;
  /** Nombre total de bonnes réponses. */
  totalCorrect: number;
  /** Bonnes réponses par catégorie. */
  correctByCategory: Partial<Record<LitCategory, number>>;
  /** Bonnes réponses par époque. */
  correctByEra: Partial<Record<LitEra, number>>;
  /** Bonnes réponses par œuvre (bookId). */
  correctByBook: Partial<Record<string, number>>;
  /** Nombre de parties terminées à 100 %. */
  perfectRounds: number;
  /** Nombre de parties terminées (quel que soit le score). */
  sessionsCompleted: number;
  /** Meilleure série (bonnes réponses d'affilée) jamais atteinte. */
  bestStreak: number;
  /** Catégories différentes touchées (distinct count). */
  distinctCategoriesHit: number;
  /** Époques différentes touchées. */
  distinctErasHit: number;
};

export const DEFAULT_STATS: BadgeStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  correctByCategory: {},
  correctByEra: {},
  correctByBook: {},
  perfectRounds: 0,
  sessionsCompleted: 0,
  bestStreak: 0,
  distinctCategoriesHit: 0,
  distinctErasHit: 0,
};

// ─── Définitions des jalons ─────────────────────────────────────────────────
export type Badge = {
  id: string;
  name: string;
  /** Phrase flavor pour l'affichage (ton littéraire, pas FPS). */
  tagline: string;
  /** Condition de déblocage (description lisible, pour la liste). */
  criteria: string;
  /** Check sur les stats pour savoir si débloqué. */
  check: (s: BadgeStats) => boolean;
  /** Mot-symbole court pour l'affichage — pas d'emojis standardisés. */
  mark: string;
};

export const BADGES: Badge[] = [
  {
    id: "premiere-page",
    name: "Première page",
    tagline: "Le seuil franchi, une première bonne réponse.",
    criteria: "Réponds correctement à ta première question.",
    mark: "I",
    check: (s) => s.totalCorrect >= 1,
  },
  {
    id: "oeil-stendhal",
    name: "L'œil de Stendhal",
    tagline: "Précision de tireur, comme Julien Sorel au séminaire.",
    criteria: "Termine une partie avec un score parfait (8/8).",
    mark: "★",
    check: (s) => s.perfectRounds >= 1,
  },
  {
    id: "lecteur-xix",
    name: "Lecteur du XIXᵉ",
    tagline: "De Hugo à Zola, tu t'y retrouves sans GPS.",
    criteria: "Cumule 10 bonnes réponses sur des œuvres du XIXᵉ siècle.",
    mark: "XIX",
    check: (s) => (s.correctByEra.XIXe ?? 0) >= 10,
  },
  {
    id: "lecteur-xx",
    name: "Lecteur du XXᵉ",
    tagline: "Proust, Camus, Céline : vous vous connaissez.",
    criteria: "Cumule 10 bonnes réponses sur des œuvres du XXᵉ siècle.",
    mark: "XX",
    check: (s) => (s.correctByEra.XXe ?? 0) >= 10,
  },
  {
    id: "archeologue",
    name: "L'archéologue",
    tagline: "Les Lumières, le Grand Siècle : tu remontes au texte.",
    criteria: "Trouve au moins 3 bonnes réponses sur des œuvres avant 1800.",
    mark: "◈",
    check: (s) => (s.correctByEra["avant-1800"] ?? 0) >= 3,
  },
  {
    id: "encyclopediste",
    name: "L'encyclopédiste",
    tagline: "Tu circules entre les siècles et les genres — Diderot approuve.",
    criteria: "Réponds juste dans au moins 4 catégories différentes.",
    mark: "∞",
    check: (s) => s.distinctCategoriesHit >= 4,
  },
  {
    id: "stylisticien",
    name: "Le stylisticien",
    tagline: "Oxymore, chiasme, litote — tu les vois venir.",
    criteria: "Trouve 5 figures de style correctement.",
    mark: "∿",
    check: (s) => (s.correctByCategory.device ?? 0) >= 5,
  },
  {
    id: "voltairien",
    name: "Le voltairien",
    tagline: "« Il faut cultiver notre jardin. »",
    criteria: "Réponds juste à 3 questions liées à Candide.",
    mark: "V",
    check: (s) => (s.correctByBook.candide ?? 0) >= 3,
  },
  {
    id: "proustien",
    name: "Le proustien",
    tagline: "Longtemps, tu as pris des notes.",
    criteria: "Réponds juste à 3 questions liées à Proust (Swann).",
    mark: "P",
    check: (s) => (s.correctByBook.swann ?? 0) >= 3,
  },
  {
    id: "ouvre-livre",
    name: "L'ouvre-livre",
    tagline: "Les incipits te trahissent leur titre en sept mots.",
    criteria: "Reconnais 5 incipits correctement.",
    mark: "«",
    check: (s) => (s.correctByCategory.opening ?? 0) >= 5,
  },
  {
    id: "serie-noire",
    name: "La belle série",
    tagline: "Cinq d'affilée, sans trembler.",
    criteria: "Atteins une série de 5 bonnes réponses consécutives.",
    mark: "▬",
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: "habitue",
    name: "L'habitué",
    tagline: "Tu reviens. C'est bien.",
    criteria: "Termine 5 parties de quiz.",
    mark: "✓",
    check: (s) => s.sessionsCompleted >= 5,
  },
];

// ─── Persistance localStorage ───────────────────────────────────────────────
const STATS_KEY = "incipit:badge:stats:v1";
const UNLOCKED_KEY = "incipit:badge:unlocked:v1";
const EVENT = "incipit:badges:change";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readStats(): BadgeStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    return { ...DEFAULT_STATS, ...safeParse<Partial<BadgeStats>>(raw, {}) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function readUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(UNLOCKED_KEY);
    return safeParse<string[]>(raw, []);
  } catch {
    return [];
  }
}

function writeStats(s: BadgeStats) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function writeUnlocked(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function emitChange() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

// ─── Reducer : application d'un résultat de round ───────────────────────────
export type RoundAnswer = {
  correct: boolean;
  category: LitCategory;
  era: LitEra;
  bookId?: string;
};

export type RoundOutcome = {
  score: number;
  total: number;
  bestStreak: number;
  answers: RoundAnswer[];
};

/**
 * Applique le résultat d'un round sur les stats persistées, puis calcule les
 * jalons nouvellement débloqués. Retourne ces jalons pour que l'UI les montre
 * une seule fois.
 */
export function applyRound(outcome: RoundOutcome): Badge[] {
  const prev = readStats();
  const prevUnlocked = new Set(readUnlocked());

  const correctByCategory = { ...(prev.correctByCategory || {}) };
  const correctByEra = { ...(prev.correctByEra || {}) };
  const correctByBook = { ...(prev.correctByBook || {}) };

  for (const a of outcome.answers) {
    if (!a.correct) continue;
    correctByCategory[a.category] = (correctByCategory[a.category] ?? 0) + 1;
    correctByEra[a.era] = (correctByEra[a.era] ?? 0) + 1;
    if (a.bookId) {
      correctByBook[a.bookId] = (correctByBook[a.bookId] ?? 0) + 1;
    }
  }

  const distinctCategoriesHit = Object.values(correctByCategory).filter(
    (n) => (n ?? 0) > 0
  ).length;
  const distinctErasHit = Object.values(correctByEra).filter(
    (n) => (n ?? 0) > 0
  ).length;

  const next: BadgeStats = {
    totalAnswered: prev.totalAnswered + outcome.answers.length,
    totalCorrect: prev.totalCorrect + outcome.score,
    correctByCategory,
    correctByEra,
    correctByBook,
    perfectRounds:
      prev.perfectRounds +
      (outcome.total > 0 && outcome.score === outcome.total ? 1 : 0),
    sessionsCompleted: prev.sessionsCompleted + 1,
    bestStreak: Math.max(prev.bestStreak, outcome.bestStreak),
    distinctCategoriesHit,
    distinctErasHit,
  };

  writeStats(next);

  const newly: Badge[] = [];
  const unlockedNow = new Set(prevUnlocked);
  for (const b of BADGES) {
    if (!prevUnlocked.has(b.id) && b.check(next)) {
      newly.push(b);
      unlockedNow.add(b.id);
    }
  }
  if (newly.length > 0) {
    writeUnlocked(Array.from(unlockedNow));
  }

  emitChange();
  return newly;
}

/** Liste des jalons avec leur statut de déverrouillage (pour affichage /quiz/badges). */
export function listBadgesWithStatus(): Array<Badge & { unlocked: boolean }> {
  const unlocked = new Set(readUnlocked());
  return BADGES.map((b) => ({ ...b, unlocked: unlocked.has(b.id) }));
}

/** Reset total (admin ou profil). */
export function resetBadges() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STATS_KEY);
    window.localStorage.removeItem(UNLOCKED_KEY);
    emitChange();
  } catch {
    // ignore
  }
}
