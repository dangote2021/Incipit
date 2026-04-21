// ─────────────────────────────────────────────────────────────────────────────
// Re-engagement J3 / J7 / J30.
//
// Retour panel v8, #10 : quand un utilisateur disparaît pendant plusieurs
// jours, il a besoin d'un accueil *bienveillant* qui reconnaît l'absence
// plutôt qu'un flux identique à n'importe quel jour. Un "bon retour"
// explicite augmente la chance qu'il reste ce jour-là + revienne demain.
//
// Pas de serveur → pas de push mail. On détecte l'absence à l'ouverture,
// on pose un drapeau qu'on consomme côté home (ReEngagementBanner).
//
// Règles :
//   - J3+ : ton bienveillant, pas accusateur ("ça nous a manqué, voici ce
//     que tu as raté").
//   - J7+ : ton de reprise, on propose une relance douce (Candide, 160p).
//   - J30+ : ton de retrouvailles, on présente ce qui est nouveau depuis.
//   - Une seule fois par épisode d'absence : une fois consommé, le drapeau
//     est effacé, ne revient qu'à la prochaine vraie absence.
//
// Stockage : une clé dédiée, posée au moment de l'ouverture dans streak.ts.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "incipit:reengagement:v1";

export type ReEngagementKind = "j3" | "j7" | "j30";

export type ReEngagementSignal = {
  kind: ReEngagementKind;
  days: number; // nombre de jours manqués
  postedAt: string; // yyyy-mm-dd local
};

function classify(days: number): ReEngagementKind | null {
  if (days >= 30) return "j30";
  if (days >= 7) return "j7";
  if (days >= 3) return "j3";
  return null;
}

function safeRead(): ReEngagementSignal | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReEngagementSignal;
  } catch {
    return null;
  }
}

function safeWrite(s: ReEngagementSignal) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function safeClear() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Appelée par recordOpen() dans streak.ts quand un jour a été manqué.
 * Pose un signal si la durée franchit un seuil J3/J7/J30.
 */
export function postReEngagement(daysAbsent: number, todayLocal: string) {
  const kind = classify(daysAbsent);
  if (!kind) return;
  safeWrite({ kind, days: daysAbsent, postedAt: todayLocal });
}

/**
 * Récupère un signal en attente sans le consommer. Permet au banner de
 * s'afficher sur plusieurs pages / re-rendus tant que l'utilisateur ne
 * l'a pas dismissé.
 */
export function peekReEngagement(): ReEngagementSignal | null {
  return safeRead();
}

/**
 * À appeler quand l'utilisateur ferme le banner ou clique sur son CTA —
 * on considère l'épisode traité, on ne le re-jouera pas.
 */
export function dismissReEngagement() {
  safeClear();
}
