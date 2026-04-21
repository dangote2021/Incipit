// ─────────────────────────────────────────────────────────────────────────────
// Corpus de questions littéraires multi-types pour le quiz v2.
//
// On ne se limite plus à "devine l'incipit" : le quiz devient un vrai jeu
// culturel avec plusieurs catégories. Objectif : augmenter la rejouabilité
// et surfacer différentes dimensions du savoir littéraire (auteur, époque,
// personnage, figure de style, mouvement).
//
// Chaque question porte :
//  - un `prompt` (ce qu'on demande au joueur)
//  - une `answer` (la bonne réponse)
//  - trois `distractors` crédibles
//  - un `explanation` court (s'affiche en correction, pour apprendre)
//  - une `category` (filtre + badge)
//  - un `era` (filtre + badge)
// ─────────────────────────────────────────────────────────────────────────────

export type LitCategory =
  | "author"        // « Qui a écrit ___ ? »
  | "character"     // « Dans quelle œuvre apparaît ___ ? »
  | "date"          // « Quelle est la date de parution de ___ ? »
  | "movement"      // « À quel mouvement appartient ___ ? »
  | "device"        // « Quelle figure de style est ___ ? »
  | "opening";      // « De quelle œuvre est cet incipit ? »

export type LitEra = "avant-1800" | "XIXe" | "XXe" | "XXIe";

export type LitQuestion = {
  id: string;
  category: LitCategory;
  era: LitEra;
  prompt: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  /** id de fiche associée si disponible — pour lier vers /book/[id]. */
  bookId?: string;
};

// ─── Métadonnées d'affichage ────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<
  LitCategory,
  { title: string; sub: string; emoji: string }
> = {
  opening: {
    title: "Incipits",
    sub: "Reconnais le livre à ses premières lignes",
    emoji: "«",
  },
  author: {
    title: "Auteurs",
    sub: "À qui sont ces œuvres et ces phrases",
    emoji: "✍",
  },
  character: {
    title: "Personnages",
    sub: "Qui est qui dans les grands romans",
    emoji: "☰",
  },
  date: {
    title: "Dates",
    sub: "Quand ça a été publié",
    emoji: "◯",
  },
  movement: {
    title: "Mouvements",
    sub: "Romantisme, naturalisme, surréalisme…",
    emoji: "▲",
  },
  device: {
    title: "Figures de style",
    sub: "Métaphore, oxymore, chiasme : c'est lequel",
    emoji: "∿",
  },
};

export const ERA_LABELS: Record<LitEra, string> = {
  "avant-1800": "Avant 1800",
  XIXe: "XIXᵉ siècle",
  XXe: "XXᵉ siècle",
  XXIe: "XXIᵉ siècle",
};

// ─── Corpus ─────────────────────────────────────────────────────────────────
export const LIT_QUESTIONS: LitQuestion[] = [
  // ─── AUTEUR ──────────────────────────────────────────────────────────────
  {
    id: "au-1",
    category: "author",
    era: "XXe",
    prompt: "Qui a écrit L'Étranger ?",
    answer: "Albert Camus",
    distractors: ["Jean-Paul Sartre", "André Malraux", "Louis-Ferdinand Céline"],
    explanation:
      "1942. Le roman qui ouvre le cycle de l'absurde — avec Le Mythe de Sisyphe et Caligula.",
    bookId: "etranger",
  },
  {
    id: "au-2",
    category: "author",
    era: "XIXe",
    prompt: "Qui a écrit Madame Bovary ?",
    answer: "Gustave Flaubert",
    distractors: ["Émile Zola", "Honoré de Balzac", "Stendhal"],
    explanation:
      "1857. Procès pour immoralité, acquitté — et un des romans fondateurs du réalisme.",
    bookId: "bovary",
  },
  {
    id: "au-3",
    category: "author",
    era: "XIXe",
    prompt: "Qui a écrit Germinal ?",
    answer: "Émile Zola",
    distractors: ["Victor Hugo", "Gustave Flaubert", "Alphonse Daudet"],
    explanation:
      "1885. Treizième roman du cycle des Rougon-Macquart. Le manifeste naturaliste sur la classe ouvrière.",
    bookId: "germinal",
  },
  {
    id: "au-4",
    category: "author",
    era: "avant-1800",
    prompt: "Qui a écrit Candide ?",
    answer: "Voltaire",
    distractors: ["Diderot", "Rousseau", "Montesquieu"],
    explanation:
      "1759. Conte philosophique écrit après le tremblement de terre de Lisbonne. « Il faut cultiver notre jardin. »",
    bookId: "candide",
  },
  {
    id: "au-5",
    category: "author",
    era: "XIXe",
    prompt: "Qui a écrit Les Fleurs du Mal ?",
    answer: "Charles Baudelaire",
    distractors: ["Arthur Rimbaud", "Paul Verlaine", "Victor Hugo"],
    explanation:
      "1857. Recueil également poursuivi pour outrage aux mœurs la même année que Bovary.",
    bookId: "fleurs-du-mal",
  },
  {
    id: "au-6",
    category: "author",
    era: "XXe",
    prompt: "Qui a écrit Du côté de chez Swann ?",
    answer: "Marcel Proust",
    distractors: ["André Gide", "Paul Valéry", "François Mauriac"],
    explanation:
      "1913. Premier tome de À la recherche du temps perdu. La madeleine, c'est là.",
    bookId: "swann",
  },
  {
    id: "au-7",
    category: "author",
    era: "XXe",
    prompt: "Qui a écrit Voyage au bout de la nuit ?",
    answer: "Louis-Ferdinand Céline",
    distractors: ["Henri Barbusse", "Jean Genet", "Antoine Blondin"],
    explanation:
      "1932. Prix Renaudot. Une révolution stylistique — la langue parlée, les trois points, la rage.",
    bookId: "voyage",
  },
  {
    id: "au-8",
    category: "author",
    era: "XIXe",
    prompt: "Qui a écrit Notre-Dame de Paris ?",
    answer: "Victor Hugo",
    distractors: ["Alexandre Dumas", "Eugène Sue", "Théophile Gautier"],
    explanation: "1831. Hugo a 29 ans. Le roman sauve la cathédrale.",
    bookId: "notre-dame",
  },

  // ─── PERSONNAGES ─────────────────────────────────────────────────────────
  {
    id: "ch-1",
    category: "character",
    era: "XXe",
    prompt: "Dans quelle œuvre rencontre-t-on Meursault ?",
    answer: "L'Étranger",
    distractors: ["La Peste", "La Chute", "Le Mythe de Sisyphe"],
    explanation:
      "Meursault, narrateur inexpressif du roman qui tue sur la plage — le personnage de l'absurde par excellence.",
    bookId: "etranger",
  },
  {
    id: "ch-2",
    category: "character",
    era: "XIXe",
    prompt: "Qui est Julien Sorel ?",
    answer: "Le héros du Rouge et le Noir",
    distractors: [
      "Un personnage de Balzac",
      "Le protagoniste de Germinal",
      "L'amant dans Bel-Ami",
    ],
    explanation:
      "Le Rouge et le Noir (Stendhal, 1830) — fils de charpentier ambitieux qui navigue entre soutane et uniforme.",
    bookId: "rouge-noir",
  },
  {
    id: "ch-3",
    category: "character",
    era: "XIXe",
    prompt: "Qui est Georges Duroy ?",
    answer: "Bel-Ami",
    distractors: ["Le père Goriot", "Rastignac", "Frédéric Moreau"],
    explanation:
      "Bel-Ami (Maupassant, 1885) — journaliste opportuniste qui grimpe l'échelle sociale par les femmes.",
    bookId: "bel-ami",
  },
  {
    id: "ch-4",
    category: "character",
    era: "XIXe",
    prompt: "Qui est Étienne Lantier ?",
    answer: "Le mineur héros de Germinal",
    distractors: [
      "Un personnage de Bel-Ami",
      "Le narrateur de Bovary",
      "Le fils Rougon",
    ],
    explanation:
      "Étienne Lantier mène la grève dans la mine du Voreux — fils aîné de Gervaise Macquart.",
    bookId: "germinal",
  },
  {
    id: "ch-5",
    category: "character",
    era: "XIXe",
    prompt: "Qui est Quasimodo ?",
    answer: "Le sonneur de cloches de Notre-Dame",
    distractors: [
      "Un personnage de Dumas",
      "Un brigand des Misérables",
      "Un noble de La Chartreuse",
    ],
    explanation:
      "Notre-Dame de Paris (Hugo, 1831). Hugo invente la figure du monstre sensible — Disney viendra après.",
    bookId: "notre-dame",
  },
  {
    id: "ch-6",
    category: "character",
    era: "avant-1800",
    prompt: "Qui est Pangloss ?",
    answer: "Le précepteur de Candide",
    distractors: [
      "Un personnage de Molière",
      "Un héros de Rousseau",
      "Le valet de Dom Juan",
    ],
    explanation:
      "Voltaire incarne en Pangloss l'optimisme leibnizien qu'il démonte : « Tout est pour le mieux dans le meilleur des mondes possibles. »",
    bookId: "candide",
  },
  {
    id: "ch-7",
    category: "character",
    era: "XIXe",
    prompt: "Qui est Emma Bovary ?",
    answer: "L'héroïne de Flaubert",
    distractors: [
      "Un personnage de George Sand",
      "L'amante d'un roman de Balzac",
      "La mère dans Germinal",
    ],
    explanation:
      "Madame Bovary (1857). Emma meurt de s'être crue dans un roman d'amour — le bovarysme est un diagnostic.",
    bookId: "bovary",
  },

  // ─── DATES ───────────────────────────────────────────────────────────────
  {
    id: "dt-1",
    category: "date",
    era: "XIXe",
    prompt: "En quelle année Madame Bovary a-t-il été publié ?",
    answer: "1857",
    distractors: ["1842", "1865", "1873"],
    explanation:
      "1857 : même année que Les Fleurs du Mal. Deux procès, même parquet.",
    bookId: "bovary",
  },
  {
    id: "dt-2",
    category: "date",
    era: "XXe",
    prompt: "Quand L'Étranger a-t-il été publié ?",
    answer: "1942",
    distractors: ["1938", "1945", "1951"],
    explanation:
      "En pleine Occupation. Le roman sort chez Gallimard après plusieurs refus d'éditeurs.",
    bookId: "etranger",
  },
  {
    id: "dt-3",
    category: "date",
    era: "avant-1800",
    prompt: "Quand Candide a-t-il été publié ?",
    answer: "1759",
    distractors: ["1741", "1778", "1789"],
    explanation:
      "Après le tremblement de terre de Lisbonne (1755), qui achève la foi de Voltaire en la Providence.",
    bookId: "candide",
  },
  {
    id: "dt-4",
    category: "date",
    era: "XIXe",
    prompt: "Quand Germinal paraît-il ?",
    answer: "1885",
    distractors: ["1871", "1893", "1902"],
    explanation:
      "Treizième roman du cycle Rougon-Macquart. Zola se documente sur le terrain à Anzin.",
    bookId: "germinal",
  },
  {
    id: "dt-5",
    category: "date",
    era: "XXe",
    prompt: "Quand Voyage au bout de la nuit a-t-il paru ?",
    answer: "1932",
    distractors: ["1923", "1940", "1945"],
    explanation:
      "Prix Renaudot la même année. Le Goncourt lui échappe de justesse.",
    bookId: "voyage",
  },
  {
    id: "dt-6",
    category: "date",
    era: "XXe",
    prompt: "En quelle année Du côté de chez Swann a-t-il été publié ?",
    answer: "1913",
    distractors: ["1905", "1920", "1927"],
    explanation:
      "Proust publie à compte d'auteur chez Grasset après le refus de la NRF. Gide regrettera.",
    bookId: "swann",
  },

  // ─── MOUVEMENTS ──────────────────────────────────────────────────────────
  {
    id: "mv-1",
    category: "movement",
    era: "XIXe",
    prompt: "À quel mouvement appartient Germinal ?",
    answer: "Naturalisme",
    distractors: ["Réalisme magique", "Romantisme", "Symbolisme"],
    explanation:
      "Le naturalisme de Zola : appliquer la méthode scientifique au roman, documenter la condition sociale.",
    bookId: "germinal",
  },
  {
    id: "mv-2",
    category: "movement",
    era: "XIXe",
    prompt:
      "À quel mouvement rattache-t-on Les Fleurs du Mal de Baudelaire ?",
    answer: "Symbolisme",
    distractors: ["Naturalisme", "Classicisme", "Dadaïsme"],
    explanation:
      "Baudelaire, précurseur du symbolisme : donner à voir l'invisible à travers des correspondances.",
    bookId: "fleurs-du-mal",
  },
  {
    id: "mv-3",
    category: "movement",
    era: "XIXe",
    prompt: "De quel mouvement Notre-Dame de Paris est-il emblématique ?",
    answer: "Romantisme",
    distractors: ["Réalisme", "Classicisme", "Naturalisme"],
    explanation:
      "Hugo, chef de file du romantisme — la préface de Cromwell (1827) est le manifeste.",
    bookId: "notre-dame",
  },
  {
    id: "mv-4",
    category: "movement",
    era: "XXe",
    prompt: "À quel mouvement appartient Nadja d'André Breton ?",
    answer: "Surréalisme",
    distractors: ["Existentialisme", "Nouveau Roman", "Oulipo"],
    explanation:
      "1928. Breton est le fondateur du mouvement — Manifeste du surréalisme en 1924.",
  },
  {
    id: "mv-5",
    category: "movement",
    era: "avant-1800",
    prompt: "À quel courant intellectuel Voltaire appartient-il ?",
    answer: "Siècle des Lumières",
    distractors: ["Pléiade", "Romantisme", "Classicisme"],
    explanation:
      "Les Lumières — Voltaire, Diderot, Rousseau, Montesquieu — la raison contre l'obscurantisme.",
    bookId: "candide",
  },

  // ─── FIGURES DE STYLE ────────────────────────────────────────────────────
  {
    id: "dv-1",
    category: "device",
    era: "XIXe",
    prompt: "« Cette obscure clarté qui tombe des étoiles » : quelle figure ?",
    answer: "Oxymore",
    distractors: ["Litote", "Métonymie", "Euphémisme"],
    explanation:
      "Corneille, Le Cid. L'oxymore accole deux mots contradictoires — obscure / clarté.",
  },
  {
    id: "dv-2",
    category: "device",
    era: "XIXe",
    prompt:
      "« Je vis, je meurs ; je me brûle et me noie » : quelle figure domine ?",
    answer: "Antithèse",
    distractors: ["Hyperbole", "Métaphore", "Chiasme"],
    explanation:
      "Louise Labé, Sonnet VIII. L'antithèse oppose des termes de sens contraire dans un parallélisme.",
  },
  {
    id: "dv-3",
    category: "device",
    era: "XIXe",
    prompt: "« Le navire était pavé de soleil » : quelle figure ?",
    answer: "Métaphore",
    distractors: ["Comparaison", "Synecdoque", "Prosopopée"],
    explanation:
      "Pas de « comme » : c'est une métaphore (identification directe), pas une comparaison.",
  },
  {
    id: "dv-4",
    category: "device",
    era: "avant-1800",
    prompt: "« Il n'est pas mauvais » pour dire qu'il est très bon : quelle figure ?",
    answer: "Litote",
    distractors: ["Euphémisme", "Ironie", "Hyperbole"],
    explanation:
      "La litote atténue pour mieux affirmer — contraire de l'hyperbole qui amplifie.",
  },
  {
    id: "dv-5",
    category: "device",
    era: "XIXe",
    prompt: "« Une voile au loin » pour désigner un bateau : quelle figure ?",
    answer: "Synecdoque",
    distractors: ["Métonymie", "Périphrase", "Métaphore"],
    explanation:
      "La synecdoque désigne le tout par une partie (la voile pour le bateau). Proche parente de la métonymie.",
  },
  {
    id: "dv-6",
    category: "device",
    era: "avant-1800",
    prompt: "« Il faut manger pour vivre, et non vivre pour manger » : quelle figure ?",
    answer: "Chiasme",
    distractors: ["Anaphore", "Antithèse", "Asyndète"],
    explanation:
      "Molière, L'Avare. Le chiasme croise les termes (ABBA) — ici manger / vivre // vivre / manger.",
  },

  // ─── OPENING — bonus avec les incipits les plus iconiques ────────────────
  {
    id: "op-1",
    category: "opening",
    era: "XXe",
    prompt:
      "De quelle œuvre est cet incipit : « Aujourd'hui, maman est morte. » ?",
    answer: "L'Étranger",
    distractors: ["La Peste", "La Chute", "Bel-Ami"],
    explanation: "Camus, 1942. Sept mots qui installent l'absurde.",
    bookId: "etranger",
  },
  {
    id: "op-2",
    category: "opening",
    era: "XXe",
    prompt:
      "« Longtemps, je me suis couché de bonne heure. » — qui écrit ?",
    answer: "Marcel Proust",
    distractors: ["Gustave Flaubert", "Albert Camus", "André Gide"],
    explanation: "Du côté de chez Swann, 1913. L'ouverture canonique.",
    bookId: "swann",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export const BY_CATEGORY: Record<LitCategory, LitQuestion[]> = {
  author: LIT_QUESTIONS.filter((q) => q.category === "author"),
  character: LIT_QUESTIONS.filter((q) => q.category === "character"),
  date: LIT_QUESTIONS.filter((q) => q.category === "date"),
  movement: LIT_QUESTIONS.filter((q) => q.category === "movement"),
  device: LIT_QUESTIONS.filter((q) => q.category === "device"),
  opening: LIT_QUESTIONS.filter((q) => q.category === "opening"),
};

export function getCategoryLabel(cat: LitCategory) {
  return CATEGORY_LABELS[cat];
}

/**
 * Produit les 4 options d'une question, mélangées.
 */
export function buildOptions(q: LitQuestion): string[] {
  const all = [q.answer, ...q.distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}
