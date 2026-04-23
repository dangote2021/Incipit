import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import IncipitArchiveList, {
  type ArchiveEntry,
} from "@/components/IncipitArchiveList";
import FavoriteButton from "@/components/FavoriteButton";
import { favId } from "@/lib/favorites-ids";
import {
  getDailyIncipit,
  getRecentDailyIncipits,
  incipitTeaser,
  formatDate,
  formatShortDate,
} from "@/lib/daily-incipit";

export const metadata: Metadata = {
  title: "Incipit du jour · 30 derniers jours",
  description:
    "Un classique par jour, par sa première phrase. Archive des 30 derniers incipits : Flaubert, Camus, Hugo, Proust, Baudelaire… À relire, à partager en story.",
  openGraph: {
    title: "Incipit du jour · 30 derniers jours",
    description:
      "Un classique par jour, par sa première phrase. L'archive Incipit.",
    type: "website",
  },
};

// L'archive est pré-générée au build pour ISR. On revalide toutes les heures
// au cas où la page serait servie autour du passage de minuit UTC.
export const revalidate = 3600;

export default function IncipitArchivePage() {
  const today = getDailyIncipit(0);
  const archive = getRecentDailyIncipits(30);

  return (
    <>
      <AppHeader back subtitle="Archive · 30 jours" />

      {/* Hero : incipit d'aujourd'hui, mis en avant */}
      <section className="bg-gradient-to-b from-paper via-cream to-dust px-6 pt-10 pb-12 border-b border-ink/5 relative overflow-hidden">
        <div className="absolute top-12 right-8 w-48 h-48 rounded-full bg-bordeaux/10 blur-3xl" />

        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            Aujourd'hui
          </div>
          <div className="text-xs text-ink/50 mt-1 italic first-letter:uppercase">
            {formatDate(today.date)}
          </div>

          <div className="font-serif text-6xl text-bordeaux/30 leading-none mt-6 mb-2">
            “
          </div>
          <blockquote className="font-serif text-[22px] leading-[1.35] text-ink italic max-w-xl">
            {incipitTeaser(today.book, 220)}
          </blockquote>

          <div className="mt-6 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
            {today.book.title} · {today.book.author} · {today.book.year}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/book/${today.book.id}`}
              className="inline-flex items-center justify-center min-h-[44px] gap-2 bg-ink text-paper px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux transition"
            >
              Ouvrir la fiche
            </Link>
            <a
              href={`/api/incipit-card/${today.book.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] gap-2 border-2 border-bordeaux text-bordeaux px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux hover:text-paper transition"
            >
              Télécharger la carte ↓
            </a>
            <FavoriteButton
              fav={{
                id: favId.incipit(today.book.id, today.date.toISOString()),
                kind: "incipit",
                label: `Incipit de ${today.book.title}`,
                sub: `${today.book.author} · ${formatShortDate(today.date)}`,
                href: `/book/${today.book.id}`,
              }}
              variant="icon"
            />
          </div>
        </div>
      </section>

      {/* Intro archive */}
      <section className="px-6 pt-10 pb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          30 derniers jours
        </div>
        <h2 className="font-serif text-2xl font-black text-ink leading-tight mb-3">
          Un classique par jour.{" "}
          <span className="text-bordeaux">Par sa première phrase.</span>
        </h2>
        <p className="text-sm text-ink/70 leading-relaxed max-w-xl">
          Tu as loupé l'incipit d'hier ? De la semaine dernière ? Tout est là.
          Chaque carte est téléchargeable en format story pour Insta — pas
          besoin de screenshot, pas besoin de filtre.
        </p>
      </section>

      {/* Liste archive — calculée côté serveur, rendue côté client pour le gate. */}
      <IncipitArchiveList
        entries={archive.slice(1).map<ArchiveEntry>(({ book, date }, i) => ({
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          bookYear: book.year,
          teaser: incipitTeaser(book, 160),
          shortDate: formatShortDate(date),
          daysAgo: i + 1,
        }))}
        freeVisible={2}
      />

      <section className="px-6 pb-12">
        <div className="bg-cream border border-dust rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
            Partage · le geste quotidien
          </div>
          <p className="text-sm text-ink/75 leading-relaxed mb-3">
            Pas de notification, pas de streak, pas de friction. Un incipit
            chaque matin, une carte si ça te parle, un livre si ça te tient.
            Tu reviens quand tu veux.
          </p>
          <Link
            href="/about"
            className="text-[11px] uppercase tracking-widest font-bold text-bordeaux"
          >
            Pourquoi on fait ça →
          </Link>
        </div>
      </section>
    </>
  );
}
