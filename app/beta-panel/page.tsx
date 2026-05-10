import type { Metadata } from "next";
import BetaSignupForm from "./signup-form";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Programme beta",
  description:
    "Rejoins les premiers lecteurs à découvrir Incipit avant le lancement public sur le Play Store. Accès anticipé Android + iOS PWA, contact direct avec l'équipe.",
  alternates: { canonical: "/beta-panel" },
};

export default function BetaPanelPage({
  searchParams,
}: {
  searchParams: { invite?: string };
}) {
  return (
    <div className="min-h-screen">
      <AppHeader title="Beta" subtitle="Tester avant tout le monde" back />
      <section className="px-6 py-10 max-w-2xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Programme beta · 30 places
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-4">
          Découvre Incipit avant tout le monde
        </h1>

        <p className="text-base text-ink/75 leading-relaxed mb-8">
          Incipit ouvre une beta privée avant le lancement public sur le
          Google Play Store. Les testeurs reçoivent un accès complet à
          l&apos;app, échangent directement avec l&apos;équipe, et façonnent
          les premières versions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          <Card
            title="📚 Catalogue complet"
            body="Accès illimité aux livres curés, aux capsules vidéo et aux quiz."
          />
          <Card
            title="🎬 Capsules en avant-première"
            body="Les capsules La P'tite Librairie de Busnel arrivent ici en premier."
          />
          <Card
            title="🛠 Influence directe"
            body="Tes retours sont lus et orientent la roadmap. Pas un placebo."
          />
          <Card
            title="🚀 Badge fondateur"
            body="Profil 'Beta tester' à vie + tarif réduit si Premium s'active."
          />
        </div>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Ce qu&apos;on attend de toi
        </h2>
        <ul className="list-disc pl-6 space-y-1.5 text-ink/75 leading-relaxed mb-10">
          <li>Installer l&apos;app Android (lien Play Console envoyé par mail)</li>
          <li>L&apos;utiliser au moins une fois par semaine pendant 3 semaines</li>
          <li>
            Remplir un feedback de 5 minutes après 1, 2 et 3 semaines (3 questions
            courtes)
          </li>
          <li>Signaler les bugs (crash, contenu manquant, faute) en 1 clic</li>
        </ul>

        <div className="rounded-2xl border-2 border-bordeaux/30 bg-paper p-6">
          <h2 className="font-serif text-xl font-black text-ink mb-4">
            Candidate
          </h2>
          <BetaSignupForm inviteCode={searchParams?.invite} />
        </div>

        <p className="mt-6 text-xs text-ink/50 leading-relaxed text-center italic">
          30 places pour la phase 1. Tu reçois un email sous 48 h.
        </p>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-ink/15 p-4">
      <h3 className="font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink/70">{body}</p>
    </div>
  );
}
