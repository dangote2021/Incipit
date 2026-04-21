import Link from "next/link";
import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import BeginnerProgress from "@/components/beginner/BeginnerProgress";
import BeginnerStepStatus from "@/components/beginner/BeginnerStepStatus";
import { BEGINNER_PATH } from "@/lib/beginner-path";
import { getBook } from "@/lib/mock-data";

// Métadonnées : page crawlable, une vraie porte d'entrée SEO pour les
// recherches "par où commencer les classiques", "classiques accessibles",
// "lire les grands auteurs quand on débute" — intention forte, peu
// servie correctement sur le web francophone.
export const metadata: Metadata = {
  title: "Mode débutant · 10 classiques en 30 jours · Incipit",
  description:
    "Une feuille de route pour apprivoiser dix grands classiques en trente jours — du plus accessible au plus exigeant. Pas de pression, pas de punition : un ordre raisonné, des raisons claires.",
  alternates: {
    canonical: "https://incipit.app/debutant",
  },
  openGraph: {
    title: "10 classiques en 30 jours — mode débutant",
    description:
      "Par où commencer quand on veut lire les classiques ? Une feuille de route graduée, du plus court au plus dense.",
    type: "article",
  },
};

export default function DebutantPage() {
  return (
    <>
      <AppHeader back subtitle="Mode débutant" />

      <main className="max-w-xl mx-auto px-5 py-8 space-y-10">
        {/* En-tête édito : pose le cadre et désamorce l'angoisse d'entrée.
            Demandé par Yanis (v8) : "rassure-moi avant que je commence". */}
        <section>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
            Par où commencer ?
          </div>
          <h1 className="font-serif text-4xl font-black text-ink leading-[1.05] mb-4">
            Dix classiques en trente jours.
            <br />
            <span className="text-bordeaux">Dans l'ordre qui marche.</span>
          </h1>
          <p className="text-[15px] text-ink/75 leading-relaxed">
            On a classé dix grands romans du corpus Incipit du plus accessible
            au plus exigeant. Pas chronologique, pas thématique :{" "}
            <em>apprivoisable</em>. On démarre par 160 pages de Voltaire qui se
            lisent en bus, on finit sur Proust — et entre les deux, un
            escalier marche à marche. Le cadre 30 jours est indicatif : lis
            ceux qui t'appellent, saute un livre, reviens-y plus tard. Pas
            de punition.
          </p>
        </section>

        {/* Barre de progression — client. Montre combien sur 10 ont été
            marqués comme lus (via la mécanique "J'ai lu ce livre" de la
            fiche livre). */}
        <BeginnerProgress />

        {/* Liste des 10 étapes, SSR. Chaque carte : week + day range +
            livre + "pourquoi ici". Le statut (à découvrir / déjà lu) est
            un ilot client qui hydrate depuis localStorage. */}
        <section>
          <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-bold mb-5">
            La progression
          </div>

          <ol className="space-y-4">
            {BEGINNER_PATH.map((step, i) => {
              const book = getBook(step.bookId);
              if (!book) return null;
              const isNewWeek =
                i === 0 ||
                BEGINNER_PATH[i - 1].weekLabel !== step.weekLabel;

              return (
                <li key={step.bookId}>
                  {isNewWeek && (
                    <div className="mb-3 mt-2 first:mt-0 text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
                      {step.weekLabel}
                    </div>
                  )}
                  <Link
                    href={`/book/${book.id}`}
                    className="group flex gap-4 items-start bg-paper border-2 border-ink/10 rounded-3xl p-4 hover:border-bordeaux/40 transition"
                  >
                    {/* Chiffre : repère visuel fort pour se situer dans la séquence. */}
                    <div className="flex-shrink-0 w-10 flex flex-col items-center gap-1">
                      <div className="font-serif text-3xl font-black text-bordeaux/60 leading-none">
                        {String(step.position).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-ink/40 font-bold">
                        {step.dayRange}
                      </div>
                    </div>

                    <BookCover book={book} size="sm" />

                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg font-black text-ink leading-tight">
                        {book.title}
                      </div>
                      <div className="text-[11px] uppercase tracking-widest text-ink/60 font-bold mt-0.5">
                        {book.author} · {book.year} · {book.pages} p
                      </div>
                      <p className="mt-2 text-[13px] text-ink/70 leading-relaxed italic">
                        {step.why}
                      </p>
                      {/* Badge statut — s'hydrate côté client. */}
                      <div className="mt-2">
                        <BeginnerStepStatus bookId={book.id} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Pied de page édito : honore la règle "pas de punition, pas de
            gamification" qu'on a tenue sur tout le reste de l'app. */}
        <section className="bg-cream/60 border border-dust rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
            La règle du jeu
          </div>
          <p className="text-[14px] text-ink/80 leading-relaxed">
            Aucune alerte si tu « prends du retard ». Aucun score. Si tu en
            lis deux sur dix en trois mois, c'est deux livres gagnés. Si tu
            lâches à mi-parcours, tu reprendras un jour. On est là pour ça.
          </p>
        </section>

        <div className="pt-2">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-widest font-bold text-ink/50"
          >
            ← Retour au feed
          </Link>
        </div>
      </main>
    </>
  );
}
