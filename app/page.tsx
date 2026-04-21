import Link from "next/link";
import { cookies } from "next/headers";
import { BOOKS } from "@/lib/mock-data";
import DailyIncipit from "@/components/DailyIncipit";
import ResumeCard from "@/components/ResumeCard";
import WelcomeBanner from "@/components/WelcomeBanner";
import PersonalizedPitchFeed from "@/components/PersonalizedPitchFeed";
import {
  GENRES_COOKIE_NAME,
  parseGenresCookie,
} from "@/lib/prefs";
import type { Book } from "@/lib/types";

// Tri stable : matches d'abord (dans l'ordre éditorial), reste derrière.
// Dupliqué intentionnellement côté serveur pour rendre le feed pré-trié dès
// le premier paint (fix flash d'hydratation remonté par panel beta v3).
function orderByGenres(books: Book[], genres: string[]): Book[] {
  if (genres.length === 0) return books;
  const set = new Set(genres);
  const matches: Book[] = [];
  const rest: Book[] = [];
  for (const b of books) {
    if (set.has(b.genre)) matches.push(b);
    else rest.push(b);
  }
  return [...matches, ...rest];
}

export default function HomePage() {
  // Lu côté serveur : si le cookie est présent (onboarding déjà fait), on
  // sert directement le feed personnalisé, sans flash au client.
  const genresCookie = cookies().get(GENRES_COOKIE_NAME)?.value;
  const genres = parseGenresCookie(genresCookie);
  const ordered = orderByGenres(BOOKS, genres);

  // Heuristique "premier visiteur" côté serveur : pas de cookie genres =
  // très probablement pas onboardé. On réordonne pour que l'utilisateur
  // voie d'abord "ce qu'est l'app" (WelcomeBanner) avant l'incipit du
  // jour en plein écran. Pour les retours, on garde l'ordre historique
  // (incipit en premier, il signe l'app).
  const isProbablyNewVisitor = !genresCookie;

  return (
    <div className="relative">
      {/* Header flottant */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-5 pt-4 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <Link
            href="/"
            className="flex items-baseline gap-1 px-3 py-1.5 rounded-full bg-paper/70 backdrop-blur-md border border-ink/10 shadow-sm"
          >
            <span className="font-serif font-black text-xl tracking-tight text-ink">
              Incipit
            </span>
            <span className="text-bordeaux text-lg leading-none">.</span>
          </Link>
          <Link
            href="/onboarding"
            className="text-[11px] uppercase tracking-widest font-semibold text-ink/80 bg-paper/70 backdrop-blur-md border border-ink/10 px-3 py-2 rounded-full shadow-sm"
          >
            Préférences
          </Link>
        </div>
      </div>

      {/* Carrousel vertical de pitches (scroll snap) */}
      <main className="snap-y snap-mandatory overflow-y-scroll h-screen no-scrollbar -mt-0">
        {/* Ordre du haut de feed :
            - Nouveau visiteur (pas de cookie) → WelcomeBanner d'abord, pour
              comprendre ce qu'est l'app avant de se prendre un Beckett ou
              un Proust plein écran (retour panel beta v6, Marion).
            - Retour → DailyIncipit d'abord, c'est la signature éditoriale. */}
        {isProbablyNewVisitor ? (
          <>
            <WelcomeBanner />
            <DailyIncipit />
          </>
        ) : (
          <>
            <DailyIncipit />
            <WelcomeBanner />
          </>
        )}

        {/* "Je reprends" — uniquement si un livre est en cours */}
        <ResumeCard />

        {/* Feed de pitches re-priorisé par genre : tri serveur via cookie
            (pas de flash au premier paint), avec un second pass client qui
            recolle en cas de changement tardif. Les interludes (Quiz du
            jour, Rap & Lit, Quiz full) restent à des positions fixes dans
            le flow. */}
        <PersonalizedPitchFeed books={ordered} />

        {/* Fin de feed */}
        <section className="snap-start min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-cream text-ink px-8 text-center">
          <div className="text-5xl mb-6">📚</div>
          <h2 className="font-serif text-3xl font-bold mb-3">
            Tu as tout lu pour aujourd'hui.
          </h2>
          <p className="text-ink/70 max-w-sm">
            Reviens demain pour un nouvel incipit. Ou rejoins un book club pour
            continuer la conversation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-bordeaux text-paper px-5 py-3 rounded-full text-sm font-semibold hover:bg-ink transition"
            >
              Jouer au quiz →
            </Link>
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-full text-sm font-semibold"
            >
              Découvrir les clubs →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
