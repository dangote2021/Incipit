import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Mentions légales & documents",
  description:
    "Accès rapide aux mentions légales, à la politique de confidentialité et aux conditions d'utilisation d'Incipit.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <AppHeader title="Mentions légales" back />
      <section className="px-6 py-10 max-w-xl">
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-6">
          Mentions légales
        </h1>

        <div className="space-y-4 mb-10">
          <Card
            href="/privacy"
            title="Politique de confidentialité"
            sub="Ce qui est stocké, où, et pourquoi."
          />
          <Card
            href="/terms"
            title="Conditions d'utilisation"
            sub="Le contrat simple qui nous lie."
          />
          <Card
            href="/about"
            title="À propos"
            sub="Manifeste, principes éditoriaux, équipe."
          />
        </div>

        <h2 className="font-serif text-xl font-black text-ink mb-3">Éditeur</h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Incipit est édité par Guillaume Coulon, 7 rue de la République, 75011
          Paris, France.
        </p>
        <p className="text-ink/75 leading-relaxed mb-3">
          Contact :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
        </p>

        <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
          Hébergement
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA —{" "}
          <a
            href="https://vercel.com"
            className="text-bordeaux underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          .
        </p>

        <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
          Propriété intellectuelle
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Les textes originaux (pitches, quiz, punchlines, analyses) sont
          protégés par le droit d'auteur. Les extraits d'œuvres littéraires
          sont issus du domaine public ou utilisés dans le cadre de la courte
          citation autorisée par l'article L122-5 du Code de la propriété
          intellectuelle.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
          Sources, éditions & traductions
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Tous les incipits et passages reproduits dans l'application sont
          issus d'œuvres entrées dans le domaine public français (auteur
          décédé depuis plus de 70 ans, prorogations de guerre incluses le
          cas échéant). Les éditions de référence utilisées sont indiquées
          sur chaque fiche livre.
        </p>
        <p className="text-ink/75 leading-relaxed mb-3">
          Pour les œuvres traduites, nous indiquons systématiquement le
          traducteur et l'année de traduction. Les traductions elles-mêmes
          doivent avoir rejoint le domaine public pour figurer dans
          l'application. Lorsque plusieurs traductions sont disponibles, le
          choix éditorial est précisé sur la fiche concernée.
        </p>
        <p className="text-ink/75 leading-relaxed mb-3">
          Si vous êtes ayant droit et estimez qu'un extrait ne devrait pas
          figurer ici, ou qu'une attribution est incorrecte, écrivez-nous à
          l'adresse ci-dessus — nous retirons ou corrigeons sous 48 heures.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
          Pitches, résumés & ton éditorial
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Les pitches, hooks et passages analytiques rédigés par la
          rédaction d'Incipit sont des <strong>propositions de lecture</strong>,
          écrites dans un ton assumé (« direct » ou « classique », au choix
          du lecteur dans ses préférences). Il ne s'agit pas de résumés
          officiels des œuvres, ni de contenus autorisés ou validés par les
          ayants droit.
        </p>
        <p className="text-ink/75 leading-relaxed mb-3">
          Notre démarche est éditoriale, pas représentative : nous proposons
          un angle pour donner envie de lire l'œuvre originale, jamais pour
          s'y substituer. Les ayants droit qui souhaitent qu'un pitch soit
          révisé, précisé ou retiré peuvent nous contacter — la rédaction
          examine chaque demande.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
          Librairies indépendantes
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Incipit ne vend pas de livres et ne perçoit aucune commission sur
          les achats. Les renvois vers des librairies indépendantes
          passent par{" "}
          <a
            href="https://www.placedeslibraires.fr"
            className="text-bordeaux underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Placedeslibraires.fr
          </a>
          . Les libraires cités dans les encarts « L'avis du libraire » sont
          des partenaires éditoriaux volontaires, non rémunérés.
        </p>

        <div className="border-t border-ink/10 mt-10 pt-6 text-sm text-ink/60">
          Dernière mise à jour : 21 avril 2026
        </div>
      </section>
    </div>
  );
}

function Card({
  href,
  title,
  sub,
}: {
  href: string;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border-2 border-ink/10 bg-paper px-5 py-4 hover:border-bordeaux transition"
    >
      <div className="font-serif text-lg font-black text-ink">{title}</div>
      <div className="text-sm text-ink/65 leading-snug mt-0.5">{sub}</div>
    </Link>
  );
}
