import Link from "next/link";
import {
  getDailyIncipit,
  incipitTeaser,
  formatDate,
} from "@/lib/daily-incipit";
import { ritualKindForDate, ritualLabel } from "@/lib/daily-ritual";
import { pickOfTheDay } from "@/lib/daily-content";
import { QUOTES, RAP_PUNCHLINES, KEY_PASSAGES, BOOKS } from "@/lib/mock-data";
import {
  LIT_QUESTIONS,
  buildOptions,
  CATEGORY_LABELS,
} from "@/lib/quiz-literature";
import StreakBadge from "@/components/StreakBadge";

// ─────────────────────────────────────────────────────────────────────────────
// DailyRitual — écran d'ouverture qui change selon le jour de la semaine.
//
// Refonte radicale (panel test in-app, mai 2026) : trop de polices, trop
// de niveaux de hiérarchie. Toutes les variantes (incipit, citation,
// punchline, mini-quiz, carte, passage, weekbook) suivent maintenant
// EXACTEMENT le même layout :
//
//   [Overline horizontal : kind · date]                     ← sans, xs, opacity
//
//   [Le pitch / La pensée / Le passage…]                    ← overline bordeaux
//   Commentaire éditorial direct, sans guillemets.          ← serif, sans italique
//
//   [La citation qui claque]                                ← overline bordeaux
//   « extrait de l'œuvre, entre guillemets typo »           ← serif italique
//
//   Titre, Auteur                                           ← serif petit
//   [CTA]                                                   ← bouton ink
//
// Règles :
//   1. Une seule famille serif (Playfair) pour tout le contenu éditorial.
//      Une seule famille sans (Inter) pour overlines + signature + meta.
//   2. Max 3 tailles texte : overline xs / contenu lg-2xl / signature sm.
//   3. Pas de gros guillemets décoratifs (style « " »). Les vraies citations
//      sont marquées par les chevrons typo « … » uniquement.
//   4. Pas de chip catégorie supplémentaire au-dessus du contenu.
//   5. Le "pitch" est notre commentaire éditorial direct (pas de guillemets).
//      La "citation" est l'extrait brut de l'œuvre (entre guillemets).
//
// Server Component → SEO + cache CDN cohérent. Variantes server par défaut.
// ─────────────────────────────────────────────────────────────────────────────

export default function DailyRitual() {
  const kind = ritualKindForDate();

  return (
    <section className="snap-start h-screen flex flex-col justify-between px-6 pt-20 pb-28 bg-gradient-to-b from-paper via-cream to-dust relative overflow-hidden">
      <div className="absolute top-24 right-6 w-40 h-40 rounded-full bg-bordeaux/10 blur-3xl pointer-events-none" />

      {/* Streak en top — slot stable pour ne pas jump à l'hydratation */}
      <div className="relative">
        <StreakBadge />
      </div>

      <div className="relative">{renderVariant(kind)}</div>

      <div className="relative text-center text-ink/40 text-xs animate-bounce">
        ↓
      </div>
    </section>
  );
}

function renderVariant(kind: string) {
  switch (kind) {
    case "incipit":
      return <IncipitVariant />;
    case "quote":
      return <QuoteVariant />;
    case "punchline":
      return <PunchlineVariant />;
    case "miniquiz":
      return <MiniQuizVariant />;
    case "card":
      return <CardVariant />;
    case "passage":
      return <PassageVariant />;
    case "weekbook":
      return <WeekBookVariant />;
    default:
      return <IncipitVariant />;
  }
}

// ─── Helpers de signature ──────────────────────────────────────────────────
function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

function truncate(text: string, max = 220): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.lastIndexOf(",", max);
  return (cut > 80 ? t.slice(0, cut) : t.slice(0, max)).trim() + "…";
}

// ─── Layout unifié — toutes les variantes passent par là ───────────────────
function DailyLayout({
  kindLabel,
  date,
  pitchLabel,
  pitchText,
  quoteLabel,
  quoteText,
  signature,
  cta,
  shareBookId,
}: {
  kindLabel: string;
  date: Date;
  /** Overline du commentaire éditorial (ex: 'Le pitch', 'La pensée du jour', 'Le passage') */
  pitchLabel?: string;
  /** Commentaire éditorial direct, sans guillemets */
  pitchText?: string;
  /** Overline de la citation brute (ex: 'La citation qui claque', "L'incipit") */
  quoteLabel?: string;
  /** Texte de la citation, sera affiché entre guillemets « ... » */
  quoteText?: string;
  /** Signature : '{title}, {lastName(author)}' (peut être vide pour quiz) */
  signature?: string;
  /** Bouton CTA bas */
  cta: { href: string; label: string; external?: boolean };
  /** Si présent : ajoute le bouton "⬇ Carte" dans la rangée chips */
  shareBookId?: string;
}) {
  return (
    <>
      {/* Overline horizontal compact : kind · date · chips droite */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/55">
          {kindLabel} · <span className="text-ink/40 normal-case font-medium tracking-wide italic">{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {shareBookId && (
            <a
              href={`/api/incipit-card/${shareBookId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-ink/55 font-bold border border-ink/15 px-3 py-1.5 rounded-full hover:text-bordeaux hover:border-bordeaux/40 transition"
              aria-label="Télécharger la carte à partager"
            >
              ⬇ Carte
            </a>
          )}
          <Link
            href="/incipit-du-jour"
            className="text-[10px] uppercase tracking-[0.2em] text-ink/55 font-bold border border-ink/15 px-3 py-1.5 rounded-full hover:text-bordeaux hover:border-bordeaux/40 transition"
          >
            Archive →
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* BLOC 1 — Le pitch (commentaire éditorial, sans guillemets) */}
        {pitchLabel && pitchText && (
          <>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
              {pitchLabel}
            </div>
            <p className="font-serif text-2xl text-ink leading-[1.2] tracking-tight">
              {pitchText}
            </p>
          </>
        )}

        {/* BLOC 2 — La citation qui claque (extrait œuvre, entre guillemets) */}
        {quoteLabel && quoteText && (
          <div className={pitchText ? "mt-6" : ""}>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
              {quoteLabel}
            </div>
            <p className="font-serif text-base italic text-ink/85 leading-snug">
              « {quoteText} »
            </p>
          </div>
        )}

        {/* BLOC 3 — Signature */}
        {signature && (
          <p className="mt-6 font-serif text-sm font-bold text-ink/80 tracking-wide">
            {signature}
          </p>
        )}
      </div>

      {/* CTA en pied */}
      <div className="mt-8 max-w-sm mx-auto w-full">
        {cta.external ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
          >
            {cta.label}
          </a>
        ) : (
          <Link
            href={cta.href}
            className="block w-full text-center bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-bordeaux transition"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </>
  );
}

// ── LUNDI — Incipit ────────────────────────────────────────────────────────
function IncipitVariant() {
  const { book, date } = getDailyIncipit(0);
  const teaser = truncate(incipitTeaser(book, 220), 220);
  return (
    <DailyLayout
      kindLabel={ritualLabel("incipit")}
      date={date}
      pitchLabel="Le pitch"
      pitchText={book.hook}
      quoteLabel="La citation qui claque"
      quoteText={teaser}
      signature={`${book.title}, ${lastName(book.author)}`}
      cta={{ href: `/book/${book.id}`, label: `Ouvrir ${book.title}` }}
      shareBookId={book.id}
    />
  );
}

// ── MARDI — Citation ───────────────────────────────────────────────────────
function QuoteVariant() {
  const quote = pickOfTheDay(QUOTES);
  const book = BOOKS.find((b) => b.id === quote.bookId) ?? BOOKS[0];
  // Pour la citation, on saute le pitch (la citation EST le contenu central).
  return (
    <DailyLayout
      kindLabel={ritualLabel("quote")}
      date={new Date()}
      quoteLabel="La citation qui claque"
      quoteText={truncate(quote.text, 280)}
      signature={`${book.title}, ${lastName(book.author)}`}
      cta={{ href: `/book/${book.id}`, label: "Découvrir le livre" }}
      shareBookId={book.id}
    />
  );
}

// ── MERCREDI — Punchline rap ───────────────────────────────────────────────
function PunchlineVariant() {
  const p = pickOfTheDay(RAP_PUNCHLINES);
  const parallel = p.literaryParallel;
  const sig = parallel
    ? `${parallel.workTitle}, ${lastName(parallel.author)}`
    : `${p.song}, ${p.artist}`;
  return (
    <DailyLayout
      kindLabel={ritualLabel("punchline")}
      date={new Date()}
      pitchLabel="L'écho littéraire"
      pitchText={
        parallel
          ? `${p.artist} dit la même chose que ${parallel.author}, en dix mots.`
          : `${p.artist}, ${p.song} — la punchline du jour.`
      }
      quoteLabel="La punchline qui claque"
      quoteText={truncate(p.punchlineTheme, 220)}
      signature={sig}
      cta={{ href: "/punchlines", label: "Lire l'analyse complète →" }}
    />
  );
}

// ── JEUDI — Mini-quiz 1 question teaser ────────────────────────────────────
function MiniQuizVariant() {
  const q = pickOfTheDay(LIT_QUESTIONS);
  const cat = CATEGORY_LABELS[q.category];
  return (
    <DailyLayout
      kindLabel={ritualLabel("miniquiz")}
      date={new Date()}
      pitchLabel="Le quiz du jour"
      pitchText={`${cat.title} — 3 questions pour passer pour agrégé en 90 secondes.`}
      quoteLabel="La question qui pique"
      quoteText={q.prompt}
      cta={{ href: "/quiz/daily", label: "Jouer (3 questions) →" }}
    />
  );
}

// ── VENDREDI — Carte à partager ────────────────────────────────────────────
function CardVariant() {
  const quote = pickOfTheDay(QUOTES);
  const book = BOOKS.find((b) => b.id === quote.bookId) ?? BOOKS[0];
  return (
    <DailyLayout
      kindLabel={ritualLabel("card")}
      date={new Date()}
      pitchLabel="Ta story de vendredi"
      pitchText="Génère la carte format story en un tap. Format 1080×1920, prêt pour Instagram, TikTok, WhatsApp."
      quoteLabel="La citation qui claque"
      quoteText={truncate(quote.text, 220)}
      signature={`${book.title}, ${lastName(book.author)}`}
      cta={{
        href: `/api/incipit-card/${book.id}`,
        label: "Télécharger la carte ↓",
        external: true,
      }}
    />
  );
}

// ── SAMEDI — Passage clé ───────────────────────────────────────────────────
function PassageVariant() {
  const passage = KEY_PASSAGES.length > 0 ? pickOfTheDay(KEY_PASSAGES) : null;
  const book = passage
    ? BOOKS.find((b) => b.id === passage.bookId) ?? BOOKS[0]
    : BOOKS[0];

  if (!passage) {
    return (
      <DailyLayout
        kindLabel={ritualLabel("passage")}
        date={new Date()}
        pitchLabel="Le passage"
        pitchText="Passage en préparation."
        cta={{ href: `/book/${book.id}`, label: "Lire le livre →" }}
      />
    );
  }

  return (
    <DailyLayout
      kindLabel={ritualLabel("passage")}
      date={new Date()}
      pitchLabel="Le passage"
      pitchText={passage.context}
      quoteLabel="La citation qui claque"
      quoteText={truncate(passage.excerpt, 240)}
      signature={`${book.title}, ${lastName(book.author)}`}
      cta={{ href: `/book/${book.id}`, label: "Lire le livre →" }}
      shareBookId={book.id}
    />
  );
}

// ── DIMANCHE — Classique de la semaine ─────────────────────────────────────
function WeekBookVariant() {
  const book = pickOfTheDay(BOOKS);
  const teaser = truncate(incipitTeaser(book, 200), 200);
  return (
    <DailyLayout
      kindLabel={ritualLabel("weekbook")}
      date={new Date()}
      pitchLabel="Cette semaine on lit"
      pitchText={book.hook}
      quoteLabel="La citation qui claque"
      quoteText={teaser}
      signature={`${book.title}, ${lastName(book.author)}`}
      cta={{ href: `/book/${book.id}`, label: `Commencer ${book.title} →` }}
      shareBookId={book.id}
    />
  );
}
