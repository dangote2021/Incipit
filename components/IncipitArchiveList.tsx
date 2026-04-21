"use client";

import Link from "next/link";
import { usePremium } from "@/lib/premium";

// ─── Type sérialisable pour passer du Server Component (page) au Client.
// ─── On précalcule le teaser + la date formatée côté serveur pour éviter
// ─── les fuseaux horaires client et garder le HTML stable.
export type ArchiveEntry = {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookYear: number;
  teaser: string;
  shortDate: string;
  daysAgo: number;
};

type Props = {
  entries: ArchiveEntry[];
  /** Nombre d'entrées visibles en gratuit. Le reste passe derrière le paywall. */
  freeVisible?: number;
};

export default function IncipitArchiveList({ entries, freeVisible = 2 }: Props) {
  const { isPremium, hydrated } = usePremium();
  const gated = hydrated && !isPremium && entries.length > freeVisible;
  const visible = gated ? entries.slice(0, freeVisible) : entries;
  const hiddenCount = entries.length - visible.length;

  return (
    <>
      <section className="px-5 pb-10 space-y-3">
        {visible.map((e) => (
          <article
            key={e.bookId + e.daysAgo}
            className="bg-paper border border-ink/10 rounded-2xl p-5 hover:border-ink/25 transition"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-ink/45 font-bold">
                  Il y a {e.daysAgo} jour{e.daysAgo > 1 ? "s" : ""}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mt-0.5">
                  {e.shortDate}
                </div>
              </div>
              <a
                href={`/api/incipit-card/${e.bookId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-widest font-bold text-bordeaux shrink-0"
                aria-label={`Télécharger la carte pour ${e.bookTitle}`}
              >
                Carte ↓
              </a>
            </div>

            <Link href={`/book/${e.bookId}`} className="block group">
              <blockquote className="font-serif text-[17px] italic text-ink/90 leading-snug border-l-2 border-bordeaux/60 pl-3 mb-3 group-hover:border-bordeaux transition">
                « {e.teaser} »
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-base font-bold text-ink">
                    {e.bookTitle}
                  </div>
                  <div className="text-xs text-ink/60">
                    {e.bookAuthor} · {e.bookYear}
                  </div>
                </div>
                <span className="text-ink/40 group-hover:text-bordeaux transition">
                  →
                </span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      {gated && (
        <section className="px-6 pb-10">
          <div className="relative rounded-3xl p-6 bg-ink text-paper shadow-xl overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
                Archive · {hiddenCount} jours verrouillés
              </div>
              <div className="font-serif text-xl font-black mt-2 leading-snug">
                Remonte dans le temps, un incipit par jour.
              </div>
              <p className="text-sm text-paper/75 mt-2 leading-relaxed">
                Passe Premium pour dérouler les {hiddenCount} derniers jours,
                télécharger les cartes HD sans watermark, et ne plus jamais
                louper un matin.
              </p>
              <Link
                href="/premium"
                className="mt-4 inline-block w-full text-center bg-gold text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-paper transition"
              >
                Débloquer l'archive complète →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
