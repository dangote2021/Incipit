// ─────────────────────────────────────────────────────────────────────────────
// Connecteurs plateformes — Audible / Kindle / Kobo / Apple Books / Gutenberg…
//
// Philosophie Incipit : on ne devient PAS une plateforme de lecture.
// On donne envie, on centralise l'inspiration, et on pousse le lecteur vers
// son écosystème préféré pour lire ou écouter l'œuvre.
//
// Pour les œuvres du domaine public, on propose EN PLUS une lecture intégrale
// via Project Gutenberg, Wikisource et Gallica (BNF).
//
// On utilise des URLs de recherche plutôt que des IDs précis pour chaque
// plateforme commerciale — plus robuste, moins de maintenance.
// ─────────────────────────────────────────────────────────────────────────────

import type { Book, BookConnector } from "./types";

const encode = (s: string) => encodeURIComponent(s);

export function buildConnectors(book: Book): BookConnector[] {
  const q = encode(`${book.title} ${book.author}`);
  const titleOnly = encode(book.title);

  const connectors: BookConnector[] = [
    {
      kind: "audible",
      label: "Écouter sur Audible",
      format: "audio",
      url: `https://www.audible.fr/search?keywords=${q}`,
      accent: "bg-orange-500/90 text-white",
    },
    {
      kind: "apple-books",
      label: "Apple Books",
      format: "ebook",
      url: `https://books.apple.com/fr/search?term=${q}`,
      accent: "bg-gray-900 text-white",
    },
    {
      kind: "kindle",
      label: "Kindle",
      format: "ebook",
      url: `https://www.amazon.fr/s?k=${q}&i=digital-text`,
      accent: "bg-amber-600 text-white",
    },
    {
      kind: "kobo",
      label: "Kobo",
      format: "ebook",
      url: `https://www.kobo.com/fr/fr/search?query=${q}`,
      accent: "bg-sky-700 text-white",
    },
    {
      kind: "google-books",
      label: "Google Play Livres",
      format: "ebook",
      url: `https://play.google.com/store/search?q=${q}&c=books`,
      accent: "bg-emerald-600 text-white",
    },
    {
      kind: "libraires",
      label: "Papier · libraire indé",
      format: "papier",
      url: `https://www.placedeslibraires.fr/recherche/?q=${q}`,
      accent: "bg-bordeaux text-paper",
    },
  ];

  if (book.publicDomain) {
    connectors.push(
      {
        kind: "gutenberg",
        label: "Lire sur Project Gutenberg",
        format: "ebook",
        url: book.gutenbergId
          ? `https://www.gutenberg.org/ebooks/${book.gutenbergId}`
          : `https://www.gutenberg.org/ebooks/search/?query=${titleOnly}`,
        accent: "bg-stone-800 text-cream",
        publicDomainOnly: true,
      },
      {
        kind: "wikisource",
        label: "Lire sur Wikisource",
        format: "ebook",
        url: book.wikisourcePath
          ? `https://fr.wikisource.org/wiki/${book.wikisourcePath}`
          : `https://fr.wikisource.org/w/index.php?search=${titleOnly}&title=Special:Search&go=Lire`,
        accent: "bg-ink text-paper",
        publicDomainOnly: true,
      },
      {
        kind: "gallica",
        label: "Gallica · BNF",
        format: "ebook",
        url: `https://gallica.bnf.fr/services/engine/search/advancedsearch?reset=true&ordre=pertinence&lang=FR&tri=&query=%28dc.title+all+%22${titleOnly}%22%29+and+%28dc.creator+all+%22${encode(book.author)}%22%29`,
        accent: "bg-indigo-900 text-paper",
        publicDomainOnly: true,
      }
    );
  }

  return connectors;
}

// Regroupement par format, pour l'UI.
export function groupConnectors(connectors: BookConnector[]) {
  return {
    audio: connectors.filter((c) => c.format === "audio"),
    ebook: connectors.filter((c) => c.format === "ebook"),
    papier: connectors.filter((c) => c.format === "papier"),
  };
}
