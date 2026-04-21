import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import { BOOKS } from "@/lib/mock-data";
import { buildConnectors } from "@/lib/connectors";

export const metadata = {
  title: "Domaine public · Incipit",
  description:
    "Des chefs-d'œuvre tombés dans le domaine public, accessibles gratuitement et légalement. Flaubert, Zola, Hugo, Baudelaire, Proust, Balzac et d'autres, en ligne.",
};

export default function DomainePublicPage() {
  const publicBooks = BOOKS.filter((b) => b.publicDomain);

  return (
    <div className="min-h-screen">
      <AppHeader title="Domaine public" subtitle="Lecture gratuite & légale" back />

      <section className="px-6 pt-6 pb-8 bg-cream border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Manifeste lecture libre
        </div>
        <p className="font-serif text-xl leading-relaxed text-ink/90">
          Quand un auteur est mort depuis plus de 70 ans, son œuvre appartient à
          tout le monde. Gratuit, légal, sans pub. Tu peux lire Flaubert ce soir
          sans dépenser un euro.
        </p>
        <p className="text-sm text-ink/60 mt-4 leading-relaxed">
          On liste ici les {publicBooks.length} classiques de notre catalogue
          dont le texte intégral est dispo en ligne. On te renvoie vers les
          meilleures bibliothèques numériques : Project Gutenberg,
          Wikisource, Gallica (BNF). Tu choisis la tienne.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <SourceTile
            name="Gutenberg"
            subtitle="70 000 livres libres"
            accent="bg-stone-800 text-cream"
          />
          <SourceTile
            name="Wikisource"
            subtitle="Version annotée"
            accent="bg-ink text-paper"
          />
          <SourceTile
            name="Gallica · BNF"
            subtitle="Éditions originales"
            accent="bg-indigo-900 text-paper"
          />
        </div>
      </section>

      <main className="px-5 py-8 pb-28 space-y-4">
        <div className="text-[11px] uppercase tracking-[0.3em] text-ink/50 font-bold">
          {publicBooks.length} œuvres disponibles
        </div>

        <ul className="space-y-3">
          {publicBooks.map((book) => {
            const connectors = buildConnectors(book).filter(
              (c) => c.publicDomainOnly
            );
            return (
              <li
                key={book.id}
                className="rounded-2xl border border-ink/10 bg-paper/70 overflow-hidden"
              >
                <Link
                  href={`/book/${book.id}`}
                  className="flex gap-4 p-4 hover:bg-cream/50 transition"
                >
                  <div className="shrink-0">
                    <BookCover book={book} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                      {book.year}
                    </div>
                    <h3 className="font-serif text-lg font-black text-ink leading-tight mt-0.5">
                      {book.title}
                    </h3>
                    <p className="text-[13px] text-ink/65 italic">
                      {book.author}
                    </p>
                    <p className="text-[13px] text-ink/80 mt-2 leading-snug line-clamp-2">
                      {book.hook}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4 -mt-1 flex flex-wrap gap-1.5">
                  {connectors.map((c) => (
                    <a
                      key={c.kind}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition hover:opacity-85 ${c.accent}`}
                    >
                      {c.label.replace("Lire sur ", "").replace("Lire ", "")}{" "}
                      <span className="opacity-70">↗</span>
                    </a>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-2xl bg-gold/10 border border-gold/30 p-5 text-center">
          <p className="text-[13px] text-ink/80 leading-relaxed">
            Si tu préfères soutenir les auteurs vivants, pense au libraire du
            coin ou aux plateformes payantes — le choix est dans chaque fiche
            livre.
          </p>
        </div>
      </main>
    </div>
  );
}

function SourceTile({
  name,
  subtitle,
  accent,
}: {
  name: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl p-3 ${accent}`}>
      <div className="font-serif font-bold text-sm leading-tight">{name}</div>
      <div className="text-[10px] opacity-75 uppercase tracking-widest mt-0.5">
        {subtitle}
      </div>
    </div>
  );
}
