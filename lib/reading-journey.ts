// ─────────────────────────────────────────────────────────────────────────────
// Parcours de lecture — suggestion "après X, lis Y".
//
// Retour panel v8, Mehdi (« j'ai lu Bovary grâce à Incipit, je reviens plus »).
// Victoire habit, défaite app : il faut refermer la boucle en proposant un
// livre connexe quelques jours après le marquage "lu".
//
// Approche pragmatique (pas d'algo) : carte éditoriale curée. Chaque fiche
// a UN livre connexe identifié. Quand on marque "lu", on stocke l'ID local,
// on attend 24h (pour laisser respirer), puis on propose le suivant sur la
// home. Si l'utilisateur ignore, on réessaie le lendemain, puis on passe.
//
// Stockage : localStorage only, pas de serveur.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "incipit:journey:v1";

export type JourneyState = {
  /** Tous les bookIds marqués comme lus, plus récent en premier. */
  readIds: string[];
  /** Suggestions déjà acceptées / ignorées / lues — pour ne pas boucler. */
  dismissed: string[];
  /** Dernière date à laquelle on a affiché une suggestion (yyyy-mm-dd local). */
  lastShown: string;
};

const DEFAULT_STATE: JourneyState = {
  readIds: [],
  dismissed: [],
  lastShown: "",
};

// Carte curée "après X, lis Y". Connexité éditoriale assumée — on ne
// recommande pas un chef-d'œuvre après un chef-d'œuvre, on essaie de
// faire bouger le curseur (genre, époque, ton).
//
// Règle : le second livre doit rester dans le corpus Incipit (12 fiches).
const NEXT_MAP: Record<string, string> = {
  // Camus → Céline : si tu as aimé l'absurde, passe au grand noir.
  etranger: "voyage",
  // Flaubert → Maupassant : élève de, même air vicié.
  bovary: "bel-ami",
  // Stendhal → Balzac : même XIXe, même Paris, plus de souffle.
  "rouge-noir": "pere-goriot",
  // Proust → Flaubert : moderne après classique, ou l'inverse.
  swann: "bovary",
  // Voltaire → Stendhal : ironie siècle à ironie siècle.
  candide: "rouge-noir",
  // Hugo → Zola : fresque sociale à fresque sociale.
  "notre-dame": "germinal",
  // Baudelaire → Proust : prose poétique, temps, mémoire.
  "fleurs-mal": "swann",
  // Laclos → Stendhal : l'amour comme stratégie.
  liaisons: "rouge-noir",
  // Zola → Hugo : grandes machines narratives.
  germinal: "notre-dame",
  // Balzac → Stendhal : deux ambitieux à Paris.
  "pere-goriot": "rouge-noir",
  // Maupassant → Flaubert : disciple et maître.
  "bel-ami": "bovary",
  // Céline → Camus : l'absurde après le désespoir.
  voyage: "etranger",
};

function safeRead(): JourneyState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<JourneyState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      readIds: parsed.readIds ?? [],
      dismissed: parsed.dismissed ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function safeWrite(s: JourneyState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getJourneyState(): JourneyState {
  return safeRead();
}

export function markBookAsRead(bookId: string): JourneyState {
  const s = safeRead();
  if (s.readIds.includes(bookId)) return s;
  const next: JourneyState = {
    ...s,
    readIds: [bookId, ...s.readIds],
  };
  safeWrite(next);
  return next;
}

export function hasMarkedAsRead(bookId: string): boolean {
  return safeRead().readIds.includes(bookId);
}

/**
 * Dismiss une suggestion (l'utilisateur a cliqué "plus tard" ou déjà lu).
 * Elle ne réapparaîtra plus pour ce bookId-cible.
 */
export function dismissSuggestion(targetBookId: string): JourneyState {
  const s = safeRead();
  if (s.dismissed.includes(targetBookId)) return s;
  const next: JourneyState = {
    ...s,
    dismissed: [...s.dismissed, targetBookId],
  };
  safeWrite(next);
  return next;
}

/**
 * Marque la suggestion comme affichée aujourd'hui — évite de spammer la
 * même suggestion plusieurs fois par jour.
 */
export function markSuggestionShown(): JourneyState {
  const s = safeRead();
  if (s.lastShown === todayLocal()) return s;
  const next: JourneyState = { ...s, lastShown: todayLocal() };
  safeWrite(next);
  return next;
}

export type Suggestion = {
  /** Le livre juste terminé qui déclenche la recommandation. */
  fromBookId: string;
  /** Le livre conseillé. */
  toBookId: string;
};

/**
 * Retourne la prochaine suggestion à proposer, ou null si rien de pertinent.
 * Règles :
 *   - prend le livre lu le plus récent qui a un "next" défini
 *   - ignore si le "next" est déjà lu ou déjà dismissé
 *   - ignore si l'utilisateur n'a encore rien lu (profite de la découverte)
 */
export function getNextSuggestion(): Suggestion | null {
  const s = safeRead();
  if (s.readIds.length === 0) return null;

  for (const fromId of s.readIds) {
    const toId = NEXT_MAP[fromId];
    if (!toId) continue;
    if (s.readIds.includes(toId)) continue;
    if (s.dismissed.includes(toId)) continue;
    return { fromBookId: fromId, toBookId: toId };
  }
  return null;
}

export const NEXT_BOOK_MAP = NEXT_MAP;
