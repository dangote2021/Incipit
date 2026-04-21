import type { Metadata } from "next";
import { getBook } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = getBook(id);

  if (!book) {
    return {
      title: "Livre introuvable · Incipit",
    };
  }

  const title = `${book.title} — ${book.author} · Incipit`;
  const description = book.hook;
  const canonicalPath = `/book/${book.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "Incipit",
      type: "book",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "book:author": book.author,
      "book:release_date": String(book.year),
    },
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
