export type Genre =
  | "classique"
  | "contemporain"
  | "poesie"
  | "polar"
  | "sf-fantastique"
  | "philosophie"
  | "theatre"
  | "bd-graphique";

export type ReadingStatus = "to-read" | "reading" | "read";

export type Vibe =
  | "dark"
  | "romantic"
  | "political"
  | "absurd"
  | "epic"
  | "wild"
  | "mystique";

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: Genre;
  pages: number;
  cover: string;           // gradient tailwind classes
  pitch: string;           // pitch long
  hook: string;            // 1 phrase punchline
  openingLines: string;    // premiers paragraphes (domaine public)
  themes: string[];
  vibe: Vibe;
  moods: Mood[];           // parcours thématiques transversaux
};

export type Mood =
  | "romance"
  | "aventure"
  | "histoire"
  | "psychologique"
  | "social"
  | "voyage-initiatique"
  | "noir"
  | "metaphysique";

export type User = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatar: string;
  booksRead: number;
  joinedClubs: string[];
};

export type ReadingNote = {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  text: string;
  rating?: number;
};

export type LibraryEntry = {
  bookId: string;
  status: ReadingStatus;
  addedAt: string;
  noteId?: string;
  progress?: number;        // 0..100, pour livres en cours
  minutesRead?: number;     // temps total passé sur le livre
  lastReadAt?: string;      // dernier moment de lecture
  lastChapter?: string;     // pour le mode "je reprends"
};

export type BookClub = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  currentBookId: string;
  members: number;
  vibe: "casual" | "intense" | "intellectuel" | "chill";
  nextMeeting?: string;
};

export type FeedItem = {
  id: string;
  userId: string;
  type: "started" | "finished" | "note" | "joined-club" | "added";
  bookId?: string;
  clubId?: string;
  noteText?: string;
  createdAt: string;
};

// ─── V1 ─────────────────────────────────────────────────────────────────────

export type Quote = {
  id: string;
  bookId: string;
  text: string;
  context?: string;   // chapitre, scène
};

export type Challenge = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  season: "printemps" | "ete" | "automne" | "hiver" | "intemporel";
  startsAt: string;
  endsAt: string;
  bookIds: string[];    // livres suggérés pour le défi
  participants: number;
  myProgress?: number;  // 0..bookIds.length
  accent: string;       // tailwind gradient for hero
};

export type Badge = {
  id: string;
  label: string;
  emoji: string;
  description: string;  // une phrase
  earned: boolean;
  earnedAt?: string;
  rarity: "commun" | "rare" | "légendaire";
};

export type Annotation = {
  id: string;
  userId: string;
  bookId: string;
  excerpt: string;        // passage surligné
  note?: string;          // réaction perso (optionnel)
  createdAt: string;
  public: boolean;
};

export type Recommendation = {
  sourceBookId: string;
  targetBookId: string;
  reason: string;         // "parce que tu as aimé l'ironie froide de X"
};

export type ReadingSession = {
  date: string;           // YYYY-MM-DD
  minutes: number;
  bookId: string;
};

export type BuddyRead = {
  id: string;
  bookId: string;
  participants: {
    userId: string;
    progress: number;     // 0..100
  }[];
  startedAt: string;
  messages: BuddyMessage[];
};

export type BuddyMessage = {
  id: string;
  userId: string;
  text: string;
  atProgress: number;     // % de lecture au moment du message (pour spoiler-guard)
  createdAt: string;
};

export type Librairie = {
  name: string;
  distanceKm: number;
  city: string;
  url: string;            // lien vers disponibilité (mocké)
};

export type RecapBlock = {
  bookId: string;
  upToChapter: string;
  summary: string;        // rappel façon "précédemment dans…"
};

export type KeyPassage = {
  id: string;
  bookId: string;
  order: number;          // 1..n pour l'ordre de lecture
  title: string;          // titre de mise en contexte, ex. "La première gifle"
  context: string;        // pitch court — où on est dans le livre, pourquoi lire ça
  excerpt: string;        // extrait AUTHENTIQUE (domaine public), court et puissant
  chapter?: string;       // repère dans l'œuvre
  readingMinutes: number; // estimation
};

export type Character = {
  id: string;
  bookId: string;
  name: string;
  role: "protagoniste" | "antagoniste" | "secondaire" | "narrateur";
  avatar: string;                // emoji stylisé
  oneLiner: string;              // pitch d'une phrase, Incipit-style
  description: string;           // 2-3 phrases, sans spoiler majeur
  relations?: { to: string; link: string }[]; // "père de", "maîtresse de"…
  keyQuote?: string;             // phrase-signature
};

export type CaptureResult = {
  id: string;
  bookId?: string;
  capturedAt: string;
  text: string;                  // texte "OCRisé"
  status: "processing" | "done";
};

// ─────────────────────────────────────────────────────────────────────────────
// RAP & LIT — punchlines de rap analysées littérairement
// ─────────────────────────────────────────────────────────────────────────────

export type RapEra = "90s" | "00s" | "10s" | "20s";

export type LiteraryDevice =
  | "métaphore filée"
  | "allitération"
  | "assonance"
  | "anaphore"
  | "chiasme"
  | "antithèse"
  | "oxymore"
  | "hyperbole"
  | "paronomase"
  | "hypotypose"
  | "synesthésie"
  | "énumération"
  | "polyptote"
  | "calembour"
  | "personnification";

export type RapPunchline = {
  id: string;
  artist: string;         // ex. "Booba"
  song: string;           // ex. "Ouest Side"
  album?: string;
  year: number;
  era: RapEra;
  // Description thématique de la punchline (on ne reproduit PAS les paroles,
  // on en explique la portée — on ramène le lecteur vers l'œuvre).
  punchlineTheme: string; // 2-3 phrases : ce que dit la punchline, son image centrale
  devices: LiteraryDevice[];
  // Analyse Boloss-littéraire : pourquoi c'est du grand travail d'écriture
  analysis: string;       // 3-4 phrases, ton tranchant mais précis
  // Pont vers le classique
  literaryParallel: {
    author: string;       // ex. "Baudelaire"
    workTitle?: string;   // ex. "Le Spleen de Paris"
    bookId?: string;      // lien vers BOOKS si dispo
    bridge: string;       // 1-2 phrases : ce qui relie les deux
  };
  // Lien d'écoute (optionnel — cherche sur Deezer)
  listenUrl?: string;
  // Palette / vibe visuelle
  vibe: "street" | "mélancolique" | "politique" | "virtuose" | "mystique";
};
