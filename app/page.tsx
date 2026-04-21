import { Fragment } from "react";
import Link from "next/link";
import { BOOKS } from "@/lib/mock-data";
import PitchCard from "@/components/PitchCard";
import DailyIncipit from "@/components/DailyIncipit";
import ResumeCard from "@/components/ResumeCard";
import RapLitTeaser from "@/components/RapLitTeaser";
import WelcomeBanner from "@/components/WelcomeBanner";
import QuizTeaser from "@/components/QuizTeaser";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Header flottant */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-5 pt-4 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <Link
            href="/onboarding"
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
        {/* Ouverture du feed : l'incipit du jour, une première ligne qui donne
            envie. C'est la signature de l'app : on commence par la littérature,
            pas par un écran d'accueil. */}
        <DailyIncipit />

        {/* Message d'accueil contextuel (nouveau vs retour) */}
        <WelcomeBanner />

        {/* "Je reprends" — uniquement si un livre est en cours */}
        <ResumeCard />

        {BOOKS.map((b, i) => (
          <Fragment key={b.id}>
            <PitchCard book={b} />
            {/* On glisse l'interlude Rap & Lit après le 4e pitch pour casser le
                rythme et surprendre. */}
            {i === 3 && <RapLitTeaser />}
            {/* Le quiz apparaît en milieu de feed, comme un défi entre deux
                pitches : rafraîchit l'attention. */}
            {i === 7 && <QuizTeaser />}
          </Fragment>
        ))}

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
