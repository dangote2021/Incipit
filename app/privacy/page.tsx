import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Incipit ne collecte aucune donnée personnelle sur ses serveurs. Détail de ce qui est stocké localement sur ton appareil.",
  alternates: { canonical: "/privacy" },
};

// Page requise pour la soumission App Store + Google Play. Doit être
// accessible publiquement (URL stable) AVANT toute review. On pose ici la
// vérité technique : aucune collecte serveur, tout vit en localStorage +
// cookie first-party non-tracking.
export default function PrivacyPage() {
  const updated = "21 avril 2026";
  return (
    <div className="min-h-screen">
      <AppHeader title="Confidentialité" subtitle="Politique claire, courte" back />
      <section className="px-6 py-10 max-w-xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          En un coup d'œil
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-6">
          Incipit ne collecte aucune donnée personnelle.
        </h1>
        <p className="text-ink/80 leading-relaxed mb-8">
          Pas de compte à créer, pas de mot de passe à retenir, pas d'adresse
          e-mail à fournir. Tes préférences, ton historique de lecture et ton
          score au quiz restent <strong>sur ton appareil</strong>. Ils ne
          transitent jamais vers un serveur Incipit.
        </p>

        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          Dernière mise à jour
        </div>
        <div className="text-sm text-ink/70 mb-10 italic">{updated}</div>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Qui sommes-nous
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Incipit est édité par Guillaume Coulon, 7 rue de la République, 75011
          Paris, France. Contact :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          .
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Les données stockées sur ton appareil
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Incipit utilise le stockage local de ton navigateur ou du WebView de
          l'app (localStorage + un cookie first-party non-tracking) pour se
          souvenir de :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-ink/75 leading-relaxed mb-6">
          <li>tes préférences d'onboarding (genres, ton de lecture) ;</li>
          <li>
            tes jalons culturels débloqués au quiz (les « badges » littéraires)
            et le compteur de parties jouées aujourd'hui ;
          </li>
          <li>
            ton état de lecture (livres ouverts, passages annotés) quand tu
            utilises la bibliothèque ou le Reading Buddy ;
          </li>
          <li>
            ton statut Premium mock (si tu actives l'essai démo — aucun
            paiement réel n'est prélevé).
          </li>
        </ul>
        <p className="text-ink/75 leading-relaxed mb-6">
          Tu peux effacer toutes ces données à tout moment depuis les réglages
          de ton navigateur (« Effacer les données du site ») ou via le bouton
          « Réinitialiser » sur la page Profil.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Cookies
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Un unique cookie first-party nommé <code>incipit_genres</code> est
          écrit localement pour pré-trier le fil d'accueil selon tes goûts, dès
          le premier chargement. Il ne contient que la liste des genres
          littéraires que tu as choisis, n'est pas partagé avec des tiers, et sa
          durée de vie est d'un an glissant. Aucun cookie publicitaire, aucun
          pixel de tracking.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Liens vers des services tiers
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Certaines pages renvoient vers des libraires indépendants (via{" "}
          <code>placedeslibraires.fr</code>) ou vers des plateformes de lecture
          (Audible, Kindle, Gutenberg, Wikisource). Nous ne contrôlons pas les
          données que ces services collectent lorsque tu les visites. Merci de
          consulter leurs propres politiques.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Analytics
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Nous n'utilisons <strong>aucun outil d'analytics</strong> en v1 : ni
          Google Analytics, ni Plausible, ni Mixpanel. Si cela change, nous
          mettrons à jour cette page et te demanderons un consentement
          explicite avant toute collecte.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Notifications push
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Incipit n'envoie pas de notifications push. Si tu reçois un jour une
          notification de notre part (par exemple pour l'incipit du jour), ce
          sera uniquement après un opt-in explicite dans les réglages de
          l'application.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Tes droits (RGPD)
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Comme nous ne détenons aucune donnée te concernant sur nos serveurs,
          tes droits d'accès, de rectification, d'effacement et de portabilité
          s'exercent directement sur ton appareil. Pour toute question, tu peux
          nous écrire à{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          . Tu peux aussi adresser une réclamation à la CNIL (
          <a
            href="https://www.cnil.fr"
            className="text-bordeaux underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          ).
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Enfants
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Incipit est conçue pour un public adulte et adolescent (13+). Nous ne
          collectons pas sciemment de données auprès d'enfants de moins de 13
          ans.
        </p>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Modifications
        </h2>
        <p className="text-ink/75 leading-relaxed mb-10">
          Nous pouvons mettre à jour cette politique pour refléter l'évolution
          de l'application. La date de dernière mise à jour apparaît en haut de
          cette page. Les changements substantiels seront annoncés dans
          l'application.
        </p>

        <div className="border-t border-ink/10 pt-6 text-sm text-ink/60">
          Voir aussi :{" "}
          <Link href="/terms" className="text-bordeaux underline">
            Conditions d'utilisation
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
