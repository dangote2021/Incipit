import Link from "next/link";
import { pickOfTheDay, todayUTC } from "@/lib/daily-content";
import {
  VIDEO_FEATURES,
  youtubeUrl,
  youtubeThumb,
  presenterLabel,
  sourceLabel,
  type VideoFeature,
} from "@/lib/video-features";
import { BOOKS } from "@/lib/mock-data";

// ─────────────────────────────────────────────────────────────────────────────
// BusnelCapsuleTeaser — carte plein écran qui met en avant une capsule vidéo
// La P'tite Librairie de François Busnel, dans le feed des pitches.
//
// Pourquoi : levier de rétention #1 du panel test Android. Les capsules
// vidéo (3 min, ton Busnel reconnaissable, lien direct vers une œuvre du
// catalogue) crèvent le plafond de l'engagement passif — l'user se dit
// 'tiens je vais voir ce qu'il dit de Bovary' et reste 5 min de plus.
//
// Sélection : pickOfTheDay sur l'aplatissement du dictionnaire VIDEO_FEATURES.
// Stable par jour UTC, pas de drift SSR/client. Le book associé est
// retrouvé via le bookId clé du dictionnaire pour proposer la fiche livre
// correspondante (route /book/[id]).
//
// Layout : alignement avec DailyQuizCard / RapLitTeaser (snap-start min-h-screen)
// pour que le scroll vertical du feed reste cohérent.
// ─────────────────────────────────────────────────────────────────────────────

type CapsuleEntry = {
  bookId: string;
  capsule: VideoFeature;
};

function flattenCapsules(): CapsuleEntry[] {
  const out: CapsuleEntry[] = [];
  for (const [bookId, list] of Object.entries(VIDEO_FEATURES)) {
    for (const cap of list) {
      out.push({ bookId, capsule: cap });
    }
  }
  return out;
}

export default function BusnelCapsuleTeaser() {
  const all = flattenCapsules();
  const pick = pickOfTheDay(all);
  const { bookId, capsule } = pick;
  const book = BOOKS.find((b) => b.id === bookId);
  const thumb = youtubeThumb(capsule);
  const ytUrl = youtubeUrl(capsule);
  const presenter = presenterLabel(capsule.presenter);
  const source = sourceLabel(capsule.source);

  // Titre cleané : enlève "/ LA P'TITE LIBRAIRIE" en fin pour l'affichage,
  // qu'on rappelle déjà via le badge source.
  const cleanTitle = capsule.title
    .replace(/\s*\/\s*LA\s+P[''’]?TITE\s+LIBRAIRIE\s*$/i, "")
    .trim();
  const [authorPart, workPart] = cleanTitle.split(" / ").map((s) => s.trim());

  return (
    <section className="snap-start min-h-screen flex flex-col justify-center px-6 py-14 bg-gradient-to-b from-bordeaux/10 via-paper to-cream relative overflow-hidden">
      <div className="absolute top-16 -right-20 w-72 h-72 rounded-full bg-bordeaux/15 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative max-w-md mx-auto w-full">
        {/* Overline */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-black">
            Capsule du jour
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">
            {todayUTC()}
          </div>
        </div>

        {/* Source badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/90 text-paper text-[9px] uppercase tracking-[0.2em] font-black mb-5">
          <span className="text-base leading-none">▶</span>
          {source} · {presenter}
        </div>

        {/* Thumbnail */}
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative rounded-2xl overflow-hidden bg-ink/5 aspect-video mb-4 group shadow-xl"
          aria-label={`Voir la capsule sur YouTube : ${cleanTitle}`}
        >
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-paper/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
              <span className="text-bordeaux text-2xl ml-1">▶</span>
            </div>
          </div>
          {capsule.durationMin && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-ink/90 text-paper text-[10px] font-bold">
              {capsule.durationMin} min
            </div>
          )}
        </a>

        {/* Titre œuvre + auteur */}
        {workPart ? (
          <>
            <h2 className="font-serif text-3xl font-black text-ink leading-tight mb-1">
              {workPart}
            </h2>
            <div className="text-sm text-ink/60 font-serif italic mb-3">
              {authorPart}
            </div>
          </>
        ) : (
          <h2 className="font-serif text-2xl font-black text-ink leading-tight mb-3">
            {cleanTitle}
          </h2>
        )}

        {/* Note de relation (capsule sur autre œuvre du même auteur) */}
        {capsule.relationNote && (
          <p className="text-xs text-ink/65 font-serif italic leading-relaxed mb-4 border-l-2 border-bordeaux/40 pl-3">
            {capsule.relationNote}
          </p>
        )}

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3.5 rounded-full bg-ink text-paper text-[11px] uppercase tracking-widest font-black hover:bg-bordeaux transition"
          >
            Voir la capsule
          </a>
          {book ? (
            <Link
              href={`/book/${book.id}`}
              className="block text-center py-3.5 rounded-full bg-paper border-2 border-ink text-ink text-[11px] uppercase tracking-widest font-black hover:bg-ink hover:text-paper transition"
            >
              Fiche livre
            </Link>
          ) : (
            <Link
              href="/"
              className="block text-center py-3.5 rounded-full bg-paper border-2 border-ink/20 text-ink/60 text-[11px] uppercase tracking-widest font-bold"
            >
              Retour
            </Link>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/explore?tab=capsules"
            className="text-[10px] uppercase tracking-widest text-ink/55 hover:text-bordeaux font-bold transition"
          >
            Voir les 31 capsules →
          </Link>
        </div>
      </div>
    </section>
  );
}
