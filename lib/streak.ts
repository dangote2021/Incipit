// ─────────────────────────────────────────────────────────────────────────────
// Streak quotidien.
//
// Retour panel beta v8 (Sarah, Yanis, Thibault) : sans mécanique de streak
// visible, l'utilisateur n'a pas de raison de revenir demain. On reprend les
// codes éprouvés (Duolingo, NYT Games, Strava) MAIS sans XP ni gamification
// cheap : on célèbre un rituel culturel, pas un score.
//
// Règles :
//   - Un "jour de streak" = une ouverture de l'app dans la fenêtre
//     00:00-23:59 locale de l'utilisateur (on prend le timezone du navigateur,
//     pas UTC, pour coller au rituel réel — "tous les matins au café").
//   - Ouverture J+1 → streak +1.
//   - Ouverture J+2 (jour manqué) → streak remis à 1. Message bienveillant.
//   - Deux ouvertures le même jour → rien (idempotent).
//
// Stockage : un seul localStorage key, simple JSON. Pas d'envoi serveur.
// Jalons : 3 (flamme), 7, 30, 100 — badges culturels, pas points.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "incipit:streak:v1";

export type StreakState = {
  /** Jours consécutifs en cours (1+). 0 si jamais ouvert. */
  current: number;
  /** Record historique. */
  longest: number;
  /** Dernier jour d'ouverture (yyyy-mm-dd, local). */
  lastOpen: string;
  /** Nombre total de jours distincts où l'app a été ouverte. */
  totalDays: number;
  /** Jalons déjà célébrés (évite de rejouer l'animation) — 3,7,30,100. */
  celebrated: number[];
};

const DEFAULT_STATE: StreakState = {
  current: 0,
  longest: 0,
  lastOpen: "",
  totalDays: 0,
  celebrated: [],
};

// On utilise la date *locale* (timezone du navigateur) parce qu'un streak
// est une expérience vécue : ouvrir l'app "ce matin" à Paris et "ce soir"
// à Montréal, pour la même personne, c'est deux jours. Un cookie SSR ne
// serait pas fiable pour ça, on reste client-side only.
function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function diffDays(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const ta = Date.UTC(ay, am - 1, ad);
  const tb = Date.UTC(by, bm - 1, bd);
  return Math.round((tb - ta) / 86_400_000);
}

function safeRead(): StreakState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    return { ...DEFAULT_STATE, ...parsed, celebrated: parsed.celebrated ?? [] };
  } catch {
    return DEFAULT_STATE;
  }
}

function safeWrite(s: StreakState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function getStreak(): StreakState {
  return safeRead();
}

/**
 * À appeler à chaque ouverture de l'app côté client. Met à jour le streak
 * en fonction du dernier jour d'ouverture. Retourne le nouvel état + un
 * éventuel jalon nouvellement atteint (pour animation/célébration).
 */
export function recordOpen(): {
  state: StreakState;
  milestoneReached: number | null;
  broken: boolean;
} {
  const today = todayLocal();
  const prev = safeRead();
  let broken = false;

  // Même jour → idempotent.
  if (prev.lastOpen === today) {
    return { state: prev, milestoneReached: null, broken: false };
  }

  let current: number;
  if (!prev.lastOpen) {
    // Première ouverture jamais.
    current = 1;
  } else {
    const gap = diffDays(prev.lastOpen, today);
    if (gap === 1) {
      // Jour consécutif → streak +1.
      current = prev.current + 1;
    } else if (gap > 1) {
      // Jour manqué → redémarrage bienveillant à 1.
      current = 1;
      broken = true;
    } else {
      // Cas limite (horloge reculée) : on ne décrémente pas.
      current = prev.current || 1;
    }
  }

  const longest = Math.max(prev.longest, current);
  const totalDays = prev.totalDays + 1;

  // Détection jalon nouvellement atteint.
  const milestones = [3, 7, 30, 100];
  let milestoneReached: number | null = null;
  for (const m of milestones) {
    if (current === m && !prev.celebrated.includes(m)) {
      milestoneReached = m;
      break;
    }
  }
  const celebrated = milestoneReached
    ? [...prev.celebrated, milestoneReached]
    : prev.celebrated;

  const next: StreakState = {
    current,
    longest,
    lastOpen: today,
    totalDays,
    celebrated,
  };
  safeWrite(next);
  return { state: next, milestoneReached, broken };
}

/**
 * Reset manuel (debug / profil). Pas utilisé en prod normal.
 */
export function resetStreak() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Label éditorial du niveau de streak. Pas de XP ni de points — des mots
 * qui reconnaissent un rituel.
 */
export function streakLabel(current: number): string {
  if (current <= 0) return "Nouveau lecteur";
  if (current < 3) return "Premières pages";
  if (current < 7) return "Lecteur régulier";
  if (current < 30) return "Rituel installé";
  if (current < 100) return "Compagnon quotidien";
  return "Lecteur de fond";
}
