import type { Metadata } from "next";
import { getClub, getBook } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const club = getClub(id);

  if (!club) {
    return { title: "Club introuvable · Incipit" };
  }

  const currentBook = getBook(club.currentBookId);
  const title = `${club.name} · Club de lecture Incipit`;
  const description = currentBook
    ? `${club.description} · Ce mois-ci on lit ${currentBook.title} de ${currentBook.author}.`
    : club.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/clubs/${club.id}`,
      siteName: "Incipit",
      type: "website",
      locale: "fr_FR",
    },
    twitter: { card: "summary", title, description },
  };
}

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
