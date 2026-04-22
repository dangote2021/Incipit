import Link from "next/link";
import { cookies } from "next/headers";
import { BOOKS } from "@/lib/mock-data";
import DailyRitual from "@/components/DailyRitual";
import ResumeCard from "@/components/ResumeCard";
import WelcomeBanner from "@/components/WelcomeBanner";
import PersonalizedPitchFeed from "@/components/PersonalizedPitchFeed";
import NextSuggestion from "@/components/NextSuggestion";
import ReEngagementBanner from "@/components/ReEngagementBanner";
import NotifOptIn from "@/components/NotifOptIn";
import DailyNotifKicker from "@/components/DailyNotifKicker";
import BrandPronunciation from "@/components/BrandPronunciation";
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
          <BrandPronunciation />
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
        {/* Banner "bon retour" — se monte uniquement si l'utilisateur a
            été absent ≥ 3 jours (signal posé par recordOpen, consommé au
            dismiss). Placé en toute première section pour être vu — c'est
            le levier #10 du panel v8. */}
        <ReEngagementBanner />

        {/* Ordre du haut de feed :
            - Nouveau visiteur (pas de cookie) → WelcomeBanner d'abord, pour
              comprendre ce qu'est l'app avant de se prendre un rituel plein
              écran (retour panel beta v6, Marion).
            - Retour → DailyRitual d'abord. Le rituel change selon le jour
              de la semaine (retour panel v8, Thibault) : lundi incipit,
              mardi citation, mercredi punchline, jeudi quiz, vendredi carte,
              samedi passage clé, dimanche classique de la semaine. Même
              squelette visuel, contenu différent → reconnaissance + variété. */}
        {isProbablyNewVisitor ? (
          <>
            <WelcomeBanner />
            <DailyRitual />
          </>
        ) : (
          <>
            <DailyRitual />
            <WelcomeBanner />
          </>
        )}

        {/* "Je reprends" — uniquement si un livre est en cours */}
        <ResumeCard />

        {/* Parcours de lecture — suggestion "après X, lis Y" (v8 #6).
            Se monte uniquement si l'utilisateur a marqué ≥1 livre comme lu,
            sinon le composant retourne null (pas de slot vide). */}
        <NextSuggestion />

        {/* Opt-in notification (v8 #3) — gated sur streak ≥ 3 et n'apparaît
            qu'une fois acceptée/refusée. Pilotée 100% côté client. */}
        <NotifOptIn />

        {/* Déclencheur muet de la notif quotidienne — tire dès qu'on est
            passé l'heure cible + pas déjà notifié aujourd'hui. Filet de
            rattrapage web (Capacitor fait la vraie planif offline). */}
        <DailyNotifKicker />

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
          {/* Porte d'entrée explicite pour les débutants — retour panel v8,
              Yanis/Camille D. ("par où je commence ?"). On le place en
              pied de feed plutôt qu'en haut pour ne pas polluer le rituel
              quotidien des habitués, mais au moins il existe. */}
          <Link
            href="/debutant"
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-ink/60 hover:text-bordeaux transition"
          >
            Pas sûr par où commencer ? Parcours débutant →
          </Link>
        </section>
      </main>
    </div>
  );
}
