// ─────────────────────────────────────────────────────────────────────────────
// Fabricants d'ID de favoris — module SANS directive "use client", utilisable
// depuis un server component (ex. /incipit-du-jour pour pré-calculer l'ID
// avant de passer les props au FavoriteButton client).
//
// Le reste de la logique (state, hook, toggle, remove) reste dans
// lib/favorites.ts qui lui est "use client".
// ─────────────────────────────────────────────────────────────────────────────

export type FavoriteKind =
  | "incipit"
  | "quote"
  | "punchline"
  | "passage"
  | "book";

export type Favorite = {
  id: string;
  kind: FavoriteKind;
  label: string;
  sub?: string;
  href: string;
  addedAt: string;
};

export const favId = {
  incipit: (bookId: string, dateISO: string) =>
    `incipit:${bookId}:${dateISO.slice(0, 10)}`,
  quote: (quoteId: string) => `quote:${quoteId}`,
  punchline: (punchlineId: string) => `punchline:${punchlineId}`,
  passage: (bookId: string, order: number) => `passage:${bookId}:${order}`,
  book: (bookId: string) => `book:${bookId}`,
};
