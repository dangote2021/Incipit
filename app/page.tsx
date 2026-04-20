import Link from "next/link";
import { BOOKS } from "@/lib/mock-data";
import PitchCard from "@/components/PitchCard";
import DailyIncipit from "@/components/DailyIncipit";

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
        {/* Rituel matinal — Incipit du jour */}
        <DailyIncipit />

        {BOOKS.map((b) => (
          <PitchCard key={b.id} book={b} />
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
          <Link
            href="/clubs"
            className="mt-6 inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-full text-sm font-semibold"
          >
            Découvrir les clubs →
          </Link>
        </section>
      </main>
    </div>
  );
}
