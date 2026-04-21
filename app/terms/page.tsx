import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Conditions générales d'utilisation d'Incipit : usage personnel et non-commercial, respect du droit d'auteur, pas de garantie de service.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const updated = "21 avril 2026";
  return (
    <div className="min-h-screen">
      <AppHeader title="Conditions" subtitle="Utilisation de l'app" back />
      <section className="px-6 py-10 max-w-xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Contrat simple
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-6">
          Conditions d'utilisation
        </h1>

        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          Dernière mise à jour
        </div>
        <div className="text-sm text-ink/70 mb-10 italic">{updated}</div>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          1. Acceptation
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          En utilisant l'application Incipit (ci-après « l'Application »),
          accessible sur le web et via les stores (App Store, Google Play), tu
          acceptes les présentes conditions. Si tu n'es pas d'accord, merci de
          ne pas utiliser l'Application.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          2. Éditeur
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          L'Application est éditée par Guillaume Coulon (ci-après « nous »),
          domicilié en France. Contact :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          .
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          3. Usage personnel
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          L'Application est mise à ta disposition pour un usage personnel et
          non-commercial. Tu t'engages à ne pas l'utiliser à des fins
          illicites, à ne pas tenter d'en contourner les limites techniques
          (plafonds quotidiens du quiz, paywall Premium), et à ne pas extraire
          massivement son contenu pour le rediffuser.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          4. Contenu des œuvres
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Les extraits d'œuvres littéraires proposés dans l'Application (incipits,
          passages clés, citations) sont issus du domaine public ou sont
          utilisés dans le cadre de la courte citation autorisée par le Code de
          la propriété intellectuelle (article L122-5). Les pitches, quiz,
          commentaires et analyses sont rédigés par notre équipe et sont notre
          propriété exclusive. Tu ne peux pas les reproduire hors du cadre
          d'une citation privée.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          5. Liens tiers
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          L'Application redirige vers des services tiers (libraires
          indépendants via <code>placedeslibraires.fr</code>, Audible, Kindle,
          Kobo, Apple Books, Project Gutenberg, Wikisource). Nous ne sommes pas
          responsables du contenu, de la disponibilité ou des pratiques
          commerciales de ces services.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          6. Premium (essai démo)
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          En v1, le bouton « Activer Premium » déclenche un essai mock de 7
          jours, stocké uniquement sur ton appareil. Aucun paiement réel n'est
          prélevé. Lorsque la monétisation sera activée, cette section sera
          mise à jour et aucun abonnement ne sera souscrit sans ton accord
          explicite dans l'interface de paiement du store concerné.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          7. Absence de garantie
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          L'Application est fournie « en l'état ». Nous faisons de notre mieux
          pour qu'elle soit disponible et exempte de bugs, mais nous ne pouvons
          garantir une disponibilité ininterrompue ni l'absence totale
          d'erreurs. Dans toute la mesure permise par la loi, notre
          responsabilité est limitée aux dommages directs et prouvés.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          8. Modifications
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Nous pouvons faire évoluer l'Application, ses fonctionnalités et ces
          conditions. Les changements seront annoncés via l'écran d'accueil ou
          par une mise à jour de cette page. La poursuite de l'utilisation vaut
          acceptation de la nouvelle version.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          9. Droit applicable
        </h2>
        <p className="text-ink/75 leading-relaxed mb-10">
          Ces conditions sont régies par le droit français. En cas de litige,
          les tribunaux compétents sont ceux du ressort du domicile de
          l'éditeur, sauf disposition légale contraire en faveur du
          consommateur.
        </p>

        <div className="border-t border-ink/10 pt-6 text-sm text-ink/60">
          Voir aussi :{" "}
          <Link href="/privacy" className="text-bordeaux underline">
            Politique de confidentialité
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="text-bordeaux underline">
            À propos
          </Link>
        </div>
      </section>
    </div>
  );
}
