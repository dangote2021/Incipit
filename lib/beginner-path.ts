// ─────────────────────────────────────────────────────────────────────────────
// Mode débutant — parcours gradué de 10 classiques en 30 jours.
//
// Retour panel v8, Yanis (22 ans, étudiant droit) et Camille D. (28 ans,
// infirmière) : « je voudrais m'y mettre mais je sais pas par où commencer,
// et je ne veux pas me casser les dents sur Proust dès le premier livre ».
//
// Principe :
//  - 10 classiques du corpus, ordonnés par accessibilité (pages + densité
//    stylistique + intrigue immédiate), pas par ordre chronologique.
//  - 30 jours de parcours, répartis en 4 semaines + 2 jours bonus. Aucune
//    contrainte temporelle dans l'app : le cadre est indicatif, pas un
//    mur à franchir. On ne met pas d'alerte "t'as pris du retard" — c'est
//    anti-rétention pour ce profil.
//  - Chaque livre a une "why" : pourquoi il est à cette position dans le
//    parcours. C'est la pédagogie : on ne balance pas 10 titres, on justifie.
//  - Progression trackée via lib/reading-journey.ts (réutilisé, pas de
//    nouvelle clé localStorage).
// ─────────────────────────────────────────────────────────────────────────────

export type BeginnerStep = {
  position: number; // 1..10
  weekLabel: string; // "Semaine 1", "Semaine 4", "Jours bonus"
  dayRange: string; // "Jour 1 → 3"
  bookId: string;
  /**
   * Phrase courte : "pourquoi ce livre ici, et pas un autre".
   * Édito, pas marketing.
   */
  why: string;
};

/**
 * Séquence 10 livres. Ordre choisi à la main, défendu ligne par ligne.
 * Critères de gradation :
 *   - pages (160 → 600)
 *   - immédiateté de l'intrigue (Candide épisodique → Proust mémoire pure)
 *   - densité stylistique (Camus sec → Proust phrase-fleuve)
 *   - forme (roman linéaire → épistolaire → introspection)
 *
 * Le corpus Incipit a 12 livres. On en écarte 2 du mode débutant :
 *   - Notre-Dame de Paris (720p, digressions architecturales) : lourd
 *     pour un premier parcours. On le garde pour après.
 *   - Les Fleurs du Mal (poésie) : forme différente, ne se "lit" pas au
 *     sens narratif, on ne mélange pas les genres dans une initiation.
 */
export const BEGINNER_PATH: BeginnerStep[] = [
  {
    position: 1,
    weekLabel: "Semaine 1",
    dayRange: "Jour 1 → 3",
    bookId: "candide",
    why: "160 pages, chapitres courts, humour. Voltaire se lit comme un conte — on rit, on tourne les pages, on finit.",
  },
  {
    position: 2,
    weekLabel: "Semaine 1",
    dayRange: "Jour 4 → 7",
    bookId: "etranger",
    why: "186 pages, phrases courtes, voix blanche. Camus a fait exprès de désosser le français pour qu'on y entre sans effort.",
  },
  {
    position: 3,
    weekLabel: "Semaine 2",
    dayRange: "Jour 8 → 10",
    bookId: "pere-goriot",
    why: "Le roman qui t'apprend à lire Balzac. Pension Vauquer, Rastignac, Paris XIXᵉ — trois-cents pages d'ambition pure.",
  },
  {
    position: 4,
    weekLabel: "Semaine 2",
    dayRange: "Jour 11 → 14",
    bookId: "bel-ami",
    why: "Duroy arrive à Paris sans un sou, veut tout. Maupassant écrit comme un feuilleton moderne — rythme de série.",
  },
  {
    position: 5,
    weekLabel: "Semaine 3",
    dayRange: "Jour 15 → 17",
    bookId: "rouge-noir",
    why: "Julien Sorel est un des héros les plus magnétiques du XIXᵉ. Stendhal a un style sec, direct, ironique — on le suit.",
  },
  {
    position: 6,
    weekLabel: "Semaine 3",
    dayRange: "Jour 18 → 21",
    bookId: "bovary",
    why: "Flaubert te fait travailler. Chaque phrase est ciselée — mais si tu as lu les cinq précédents, tu es prêt. Emma t'attend.",
  },
  {
    position: 7,
    weekLabel: "Semaine 4",
    dayRange: "Jour 22 → 24",
    bookId: "germinal",
    why: "Zola, grande machinerie. Tu vas descendre dans la mine avec Étienne, tu vas en ressortir politisé. Souffle romanesque total.",
  },
  {
    position: 8,
    weekLabel: "Semaine 4",
    dayRange: "Jour 25 → 28",
    bookId: "liaisons",
    why: "Roman par lettres. La forme demande 20 pages d'adaptation — après, tu ne peux plus décrocher. Valmont et Merteuil, duo cruel.",
  },
  {
    position: 9,
    weekLabel: "Jours bonus",
    dayRange: "Jour 29",
    bookId: "voyage",
    why: "Céline, la langue écorchée. Long et noir — mais tu tiens si le reste est passé. Style parlé, argot, coups de gueule.",
  },
  {
    position: 10,
    weekLabel: "Jours bonus",
    dayRange: "Jour 30",
    bookId: "swann",
    why: "Le dernier palier. Phrase longue, mémoire involontaire, madeleine. À ce stade, tu as les outils — Proust récompense l'attention.",
  },
];

/**
 * Retourne le prochain livre à découvrir selon les readIds connus. Prend
 * le premier livre du parcours qui n'est pas déjà marqué comme lu. Si
 * l'utilisateur a tout lu, retourne null (et on affiche "parcours complet").
 */
export function nextBeginnerStep(
  readIds: string[]
): BeginnerStep | null {
  const readSet = new Set(readIds);
  for (const step of BEGINNER_PATH) {
    if (!readSet.has(step.bookId)) return step;
  }
  return null;
}

/**
 * Nombre de livres du parcours déjà marqués comme lus.
 */
export function beginnerProgress(readIds: string[]): number {
  const set = new Set(readIds);
  return BEGINNER_PATH.filter((s) => set.has(s.bookId)).length;
}
