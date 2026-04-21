// ─────────────────────────────────────────────────────────────────────────────
// Rituel quotidien — rotation sur 7 jours.
//
// Le problème (panel v8, Thibault) : l'app propose TOUJOURS le même format
// d'écran d'ouverture (incipit du jour). Au bout de J3-J7, le rituel s'use.
//
// La solution : varier l'objet culturel selon le jour de la semaine, en
// gardant la promesse centrale ("2 minutes de lecture de qualité par jour").
//
//   Lundi    → incipit           (rentrée dans la semaine, grand classique)
//   Mardi    → citation           (une phrase marquante, partageable)
//   Mercredi → punchline rap      (pont culturel vers le contemporain)
//   Jeudi    → mini-quiz          (3 questions, dopamine + mémoire)
//   Vendredi → carte partageable  (le moment story IG / WhatsApp)
//   Samedi   → passage clé        (un bout d'œuvre plus long, pour un WE)
//   Dimanche → classique de la semaine (prochain livre suggéré)
//
// Règle SSR : tout est déterministe. On prend le jour UTC (todayUTC()) pour
// rester aligné CDN et crawler. Le jour local pour le streak est un autre
// sujet (voir lib/streak.ts).
// ─────────────────────────────────────────────────────────────────────────────

export type RitualKind =
  | "incipit"
  | "quote"
  | "punchline"
  | "miniquiz"
  | "card"
  | "passage"
  | "weekbook";

const ROTATION: RitualKind[] = [
  "incipit",   // 0 = dimanche ? Non — on cale sur lundi = 0 via shift
  "quote",
  "punchline",
  "miniquiz",
  "card",
  "passage",
  "weekbook",
];

/**
 * Renvoie le "kind" du rituel pour une date donnée (UTC). Lundi = index 0.
 * JS Date.getUTCDay() : dimanche=0, lundi=1, …, samedi=6.
 * On shift pour que lundi=0, dimanche=6 (calendrier français et lecteur FR).
 */
export function ritualKindForDate(d: Date = new Date()): RitualKind {
  const jsDay = d.getUTCDay(); // 0..6, dim..sam
  const shifted = (jsDay + 6) % 7; // lundi=0 ... dimanche=6
  return ROTATION[shifted];
}

/**
 * Label éditorial court (utilisé en overline de la home).
 */
export function ritualLabel(kind: RitualKind): string {
  switch (kind) {
    case "incipit":
      return "Incipit du jour";
    case "quote":
      return "Citation du jour";
    case "punchline":
      return "Punchline du jour";
    case "miniquiz":
      return "Quiz du jour";
    case "card":
      return "Carte à partager";
    case "passage":
      return "Passage clé du samedi";
    case "weekbook":
      return "Classique de la semaine";
  }
}

/**
 * Jour suivant — utilisé pour le teaser J+1 en fin d'onboarding.
 */
export function nextRitualKind(d: Date = new Date()): RitualKind {
  const next = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
  );
  return ritualKindForDate(next);
}

/**
 * Joli label du jour de la semaine ("lundi", "mardi" …) pour le rituel.
 */
export function weekdayLabel(d: Date = new Date()): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long" });
}
