import type { Book } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD pour la fiche livre (#124).
//
// On injecte deux blocs structurés :
// - Book schema : décrit l'œuvre (auteur, année, genre…) → enrichit
//   les résultats Google avec un knowledge panel et permet l'affichage
//   en "rich result" (image + métadonnées).
// - BreadcrumbList : Incipit → Pitches → {Titre} → améliore le fil
//   d'Ariane affiché par Google et iOS Safari Reader.
//
// Les deux balises sont SSR (server component), donc visibles aux crawlers
// dès le premier paint. On évite next/script car le JSON-LD doit être
// ingéré avant l'indexation, pas exécuté côté JS.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://incipit-navy.vercel.app";

type Props = {
  book: Book;
};

export default function BookJsonLd({ book }: Props) {
  const bookUrl = `${SITE_URL}/book/${book.id}`;

  // Map de notre genre interne vers les schema.org Book genres usuels
  const genreLabel: Record<string, string> = {
    classique: "Classic literature",
    contemporain: "Contemporary fiction",
    poesie: "Poetry",
    polar: "Mystery",
    "sf-fantastique": "Science Fiction",
    philosophie: "Philosophy",
    theatre: "Drama",
    "bd-graphique": "Graphic novel",
  };

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": bookUrl,
    name: book.fullTitle ?? book.title,
    alternateName: book.title !== book.fullTitle ? book.title : undefined,
    author: {
      "@type": "Person",
      name: book.author,
    },
    datePublished: String(book.year),
    inLanguage: "fr",
    genre: genreLabel[book.genre] ?? book.genre,
    numberOfPages: book.pages,
    description: book.hook,
    abstract: book.pitch,
    bookFormat: "https://schema.org/EBook",
    isAccessibleForFree: book.publicDomain ? true : undefined,
    url: bookUrl,
    image: `${SITE_URL}/api/incipit-card/${book.id}`,
    publisher: book.referenceEdition
      ? {
          "@type": "Organization",
          name: book.referenceEdition.split(",")[0].trim(),
        }
      : undefined,
    translator: book.translator
      ? {
          "@type": "Person",
          name: book.translator,
        }
      : undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Incipit",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pitches",
        item: SITE_URL + "/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: book.fullTitle ?? book.title,
        item: bookUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stripUndefined(bookSchema)),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

// JSON.stringify garde les `undefined` en jetant la clé, mais pour les objets
// imbriqués (publisher, translator) on veut omettre tout l'objet si undefined.
// Cette helper nettoie récursivement les `undefined` avant sérialisation.
function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(stripUndefined) as unknown as T;
  }
  if (typeof obj !== "object") return obj;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (v === undefined) continue;
    result[k] = stripUndefined(v);
  }
  return result as T;
}
