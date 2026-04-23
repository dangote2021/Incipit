// ─────────────────────────────────────────────────────────────────────────────
// Flash messages — messages one-shot posés sur une page, consommés sur la
// suivante. Parfait pour les toasts post-redirection (onboarding → home).
//
// On utilise sessionStorage pour que le message ne survive pas à une
// nouvelle session, et ne s'exporte pas entre onglets (contrairement à
// localStorage). On consomme le message au premier read pour éviter
// qu'il réapparaisse si l'utilisateur revient sur la page.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "incipit:flash:v1";

export type Flash = {
  /** Texte affiché dans le toast. */
  message: string;
  /** Optionnel : accent visuel (succès par défaut). */
  tone?: "success" | "info";
};

/**
 * Pose un message flash dans la session, consommable une fois.
 * No-op côté serveur.
 */
export function setFlash(flash: Flash): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(flash));
  } catch {
    // ignore
  }
}

/**
 * Lit et efface le message flash en attente, ou renvoie null.
 */
export function consumeFlash(): Flash | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as Flash;
  } catch {
    return null;
  }
}
