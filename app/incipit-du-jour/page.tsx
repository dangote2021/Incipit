import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
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
              className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux transition"
            >
              Ouvrir la fiche
            </Link>
            <a
              href={`/api/incipit-card/${today.book.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-bordeaux text-bordeaux px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux hover:text-paper transition"
            >
              Télécharger la carte ↓
            </a>
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

      {/* Liste archive */}
      <section className="px-5 pb-16 space-y-3">
        {archive.slice(1).map(({ book, date }, i) => {
          const teaser = incipitTeaser(book, 160);
          return (
            <article
              key={i}
              className={`bg-paper border border-ink/10 rounded-2xl p-5 hover:border-ink/25 transition`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-ink/45 font-bold">
                    Il y a {i + 1} jour{i === 0 ? "" : "s"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mt-0.5">
                    {formatShortDate(date)}
                  </div>
                </div>
                <a
                  href={`/api/incipit-card/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-widest font-bold text-bordeaux shrink-0"
                  aria-label={`Télécharger la carte pour ${book.title}`}
                >
                  Carte ↓
                </a>
              </div>

              <Link href={`/book/${book.id}`} className="block group">
                <blockquote className="font-serif text-[17px] italic text-ink/90 leading-snug border-l-2 border-bordeaux/60 pl-3 mb-3 group-hover:border-bordeaux transition">
                  « {teaser} »
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif text-base font-bold text-ink">
                      {book.title}
                    </div>
                    <div className="text-xs text-ink/60">
                      {book.author} · {book.year}
                    </div>
                  </div>
                  <span className="text-ink/40 group-hover:text-bordeaux transition">
                    →
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </section>

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
