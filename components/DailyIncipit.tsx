import Link from "next/link";
import {
  getDailyIncipit,
  incipitTeaser,
  formatDate,
} from "@/lib/daily-incipit";

// Server Component : rendu côté serveur pour que le crawler voie directement
// l'incipit du jour (SEO + partage social). La logique déterministe est
// partagée avec l'archive et le générateur de carte dans lib/daily-incipit.ts.
export default function DailyIncipit() {
  const { book, date } = getDailyIncipit(0);
  const teaser = incipitTeaser(book, 200);

  return (
    <section className="snap-start h-screen flex flex-col justify-between px-6 pt-20 pb-28 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
      <div className="absolute top-24 right-6 w-40 h-40 rounded-full bg-bordeaux/10 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            Incipit du jour
          </div>
          <div className="text-xs text-ink/50 mt-1 italic first-letter:uppercase">
            {formatDate(date)}
          </div>
        </div>
        <Link
          href="/incipit-du-jour"
          className="text-[10px] uppercase tracking-[0.25em] text-ink/60 font-bold bg-paper/80 backdrop-blur-md border border-ink/10 px-3 py-2 rounded-full hover:text-bordeaux transition"
        >
          30 jours →
        </Link>
      </div>

      <div className="relative max-w-md mx-auto text-center">
        <div className="font-serif text-7xl text-bordeaux/30 leading-none mb-2">
          “
        </div>
        <blockquote className="font-serif text-[26px] leading-[1.3] text-ink italic">
          {teaser}
        </blockquote>

        <div className="mt-8 text-[11px] uppercase tracking-widest text-ink/60 font-bold">
          {book.title} · {book.author} · {book.year}
        </div>
      </div>

      <div className="relative max-w-sm mx-auto w-full space-y-3">
        <Link
          href={`/book/${book.id}`}
          className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
        >
          Ouvrir {book.title}
        </Link>
        <a
          href={`/api/incipit-card/${book.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center border-2 border-ink/20 text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-bold bg-paper/60 backdrop-blur-sm hover:border-bordeaux hover:text-bordeaux transition"
        >
          Télécharger la carte ↓
        </a>
        <div className="flex items-center justify-center gap-2 text-[11px] text-ink/50">
          <span className="h-px w-8 bg-ink/20" />
          <span>ou continue vers les pitches du jour</span>
          <span className="h-px w-8 bg-ink/20" />
        </div>
        <div className="text-center text-ink/40 text-xs animate-bounce">↓</div>
      </div>
    </section>
  );
}
