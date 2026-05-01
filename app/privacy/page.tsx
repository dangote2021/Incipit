import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Incipit traite tes données : minimum vital, hébergement européen, droit à l'effacement, sub-processors listés. Conforme RGPD, Apple App Privacy et Google Data Safety.",
  alternates: { canonical: "/privacy" },
};

// Politique de confidentialité — version 2026 alignée RGPD + App Store
// App Privacy + Google Play Data Safety. La page est référencée par les
// stores comme URL stable obligatoire et doit lister précisément les
// données collectées, les finalités, les durées et les sous-traitants.
export default function PrivacyPage() {
  const updated = "1er mai 2026";
  const version = "v2.0";
  return (
    <div className="min-h-screen">
      <AppHeader title="Confidentialité" subtitle={`Politique ${version}`} back />
      <section className="px-6 py-10 max-w-2xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          En une phrase
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-6">
          On garde le minimum, on l'héberge en Europe, tu peux tout effacer en
          un clic.
        </h1>
        <p className="text-ink/80 leading-relaxed mb-8">
          Incipit fonctionne sans compte par défaut — tes préférences, ton
          historique de lecture et tes scores au quiz restent sur ton appareil.
          Si tu choisis de créer un compte (pour synchroniser entre ton iPhone
          et ton Mac, par exemple), on stocke alors le minimum nécessaire chez
          notre hébergeur Supabase, infrastructure dans l'Union européenne.
        </p>

        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          Dernière mise à jour
        </div>
        <div className="text-sm text-ink/70 mb-10 italic">
          {updated} · version {version}
        </div>

        <h2 className="font-serif text-xl font-black text-ink mb-3">
          Qui édite Incipit
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Incipit est édité par Guillaume Coulon, Paris, France. Contact pour
          toute question relative à tes données :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          . Délai de réponse cible : 7 jours ouvrés.
        </p>

        {/* ─── Section centrale : ce qu'on collecte ─────────────────────── */}
        <h2 className="font-serif text-2xl font-black text-ink mb-3 mt-10">
          Ce qu'on collecte (et ce qu'on ne collecte pas)
        </h2>

        <h3 className="font-serif text-lg font-bold text-ink mb-2 mt-6">
          Sans compte (utilisation par défaut)
        </h3>
        <p className="text-ink/75 leading-relaxed mb-3">
          Aucune donnée personnelle ne quitte ton appareil. On stocke
          localement, dans le navigateur ou le WebView de l'app :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-ink/75 leading-relaxed mb-6">
          <li>
            tes préférences d'onboarding (genres choisis, ton de lecture),
            via un cookie first-party <code>incipit_genres</code> ;
          </li>
          <li>
            tes badges culturels débloqués au quiz et le compteur de parties
            jouées aujourd'hui ;
          </li>
          <li>
            ton état de lecture (livres ouverts, passages annotés) ;
          </li>
          <li>
            tes favoris ;
          </li>
          <li>ton statut Premium démo si tu l'as activé sans paiement réel.</li>
        </ul>
        <p className="text-ink/75 leading-relaxed mb-6">
          Tu peux tout effacer à tout moment via les réglages navigateur (
          <em>Effacer les données du site</em>) ou via le bouton{" "}
          <em>Réinitialiser</em> de la page Profil.
        </p>

        <h3 className="font-serif text-lg font-bold text-ink mb-2 mt-6">
          Avec compte (auth optionnelle)
        </h3>
        <p className="text-ink/75 leading-relaxed mb-3">
          Si tu décides de créer un compte (magic link email, Google Sign In ou
          Apple Sign In), on stocke chez notre hébergeur Supabase :
        </p>
        <div className="border border-ink/10 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-ink/70 text-[11px] uppercase tracking-wider">
                  Donnée
                </th>
                <th className="px-4 py-3 font-bold text-ink/70 text-[11px] uppercase tracking-wider">
                  Finalité
                </th>
                <th className="px-4 py-3 font-bold text-ink/70 text-[11px] uppercase tracking-wider">
                  Durée
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Email
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Identification, magic link, support
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Durée du compte
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Provider OAuth (Google/Apple) ID
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Lier ton compte au provider tiers
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Durée du compte
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Favoris, streak, préférences
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Synchronisation multi-appareils
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Durée du compte
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Stripe customer ID
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Si tu actives Premium, lier ton compte au paiement
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Durée du compte + obligations comptables (10 ans)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Endpoint push notification
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Si tu actives la notif quotidienne, t'envoyer l'incipit
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Jusqu'à désinscription
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold text-ink">
                  Événements telemetry anonymes
                </td>
                <td className="px-4 py-3 text-ink/75">
                  Comprendre les usages agrégés (compteurs)
                </td>
                <td className="px-4 py-3 text-ink/75">
                  90 jours
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-serif text-lg font-bold text-ink mb-2 mt-6">
          Ce qu'on ne collecte JAMAIS
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-ink/75 leading-relaxed mb-6">
          <li>aucune adresse IP, aucune donnée de géolocalisation ;</li>
          <li>aucune information de paiement directement (Stripe gère) ;</li>
          <li>
            aucun contact, photo, fichier, historique de navigation ou de
            recherche ;
          </li>
          <li>aucun identifiant publicitaire, aucun fingerprint ;</li>
          <li>aucune donnée biométrique, médicale, ou sensible ;</li>
          <li>
            aucune donnée d'enfants de moins de 13 ans — Incipit est destiné
            à un public adulte et adolescent (13+).
          </li>
        </ul>

        {/* ─── Sub-processors ─────────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Nos sous-traitants (sub-processors)
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Pour faire fonctionner Incipit, on utilise un nombre minimal de
          prestataires. Aucun n'a accès à tes données pour son propre compte —
          chacun agit uniquement comme sous-traitant au sens du RGPD.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-ink/75 leading-relaxed mb-6">
          <li>
            <strong>Supabase</strong> (Singapour, infrastructure UE) — base de
            données + auth + stockage push subscriptions. Données chiffrées
            in-transit (HTTPS) et au repos. {" "}
            <a
              href="https://supabase.com/legal/dpa"
              className="text-bordeaux underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DPA Supabase ↗
            </a>
          </li>
          <li>
            <strong>Vercel</strong> (USA) — hébergement de l'application web.
            CDN + edge functions. Aucune donnée personnelle stockée chez Vercel
            au-delà des logs serveur (anonymisés, IP non conservée).{" "}
            <a
              href="https://vercel.com/legal/dpa"
              className="text-bordeaux underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DPA Vercel ↗
            </a>
          </li>
          <li>
            <strong>Stripe</strong> (Irlande, USA) — paiements Premium si tu
            actives l'abonnement. Tu transmets tes coordonnées bancaires
            directement à Stripe, on n'y a jamais accès.{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-bordeaux underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politique Stripe ↗
            </a>
          </li>
          <li>
            <strong>Apple</strong> et <strong>Google</strong> (USA) — si tu
            utilises Sign In with Apple ou Continuer avec Google, l'identité te
            concernant est partagée par Apple/Google avec Incipit selon les
            scopes (email + nom usuel).
          </li>
          <li>
            <strong>Web Push providers</strong> (FCM Google, Mozilla, Apple
            Push) — si tu actives les notifications push, ton endpoint est
            résolu par le service push de ton navigateur. Aucune donnée
            applicative n'est partagée au-delà du payload de la notification.
          </li>
        </ul>
        <p className="text-ink/75 leading-relaxed mb-6 text-[14px] italic">
          Note : aucune donnée n'est partagée avec des tiers à des fins
          publicitaires. Les transferts hors UE (Vercel USA, Stripe USA, Apple
          USA) sont couverts par les Clauses Contractuelles Types adoptées par
          la Commission européenne.
        </p>

        {/* ─── Liens externes ─────────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Liens vers des services tiers
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Certaines pages renvoient vers des libraires indépendants
          (Place des Libraires), des plateformes de lecture (Audible, Kindle,
          Kobo, Apple Books, Google Play Books, Project Gutenberg, Wikisource,
          Gallica), des services musicaux (Spotify, YouTube, Genius), et la
          chaîne YouTube officielle de France Télévisions pour les capsules La
          P'tite Librairie. Ces services ont leurs propres politiques de
          confidentialité — consulte-les avant d'y interagir.
        </p>

        {/* ─── Analytics & cookies ────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Cookies et analytics
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Cookies first-party uniquement, aucun cookie publicitaire :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-ink/75 leading-relaxed mb-6">
          <li>
            <code>incipit_genres</code> — préférences d'onboarding, durée 1 an
            glissant.
          </li>
          <li>
            Cookies de session Supabase Auth — uniquement si tu es connecté(e),
            durée 1 heure renouvelable.
          </li>
        </ul>
        <p className="text-ink/75 leading-relaxed mb-6">
          Pour les analytics, on utilise une telemetry événementielle minimale
          et anonyme (compteurs d'usage agrégés, conservés 90 jours dans
          <code> incipit_telemetry_events</code> sur Supabase). Aucun outil
          externe type Google Analytics, Plausible, Mixpanel ou autre.
        </p>

        {/* ─── Notifications push ─────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Notifications push
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Activées uniquement après opt-in explicite (toggle dans la page
          Profil). Une seule notification par jour maximum (l'incipit du jour).
          Tu peux te désinscrire à tout moment via le même toggle ou les
          réglages OS de ton appareil.
        </p>

        {/* ─── Tes droits ─────────────────────────────────────────────── */}
        <h2 className="font-serif text-2xl font-black text-ink mb-3 mt-10">
          Tes droits
        </h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Conformément au RGPD (UE) et au CCPA (Californie), tu disposes des
          droits suivants :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-ink/75 leading-relaxed mb-6">
          <li>
            <strong>Accès</strong> — savoir quelles données on a sur toi
          </li>
          <li>
            <strong>Rectification</strong> — corriger des données inexactes
          </li>
          <li>
            <strong>Effacement</strong> — supprimer ton compte et toutes les
            données associées (sauf obligations comptables Stripe)
          </li>
          <li>
            <strong>Portabilité</strong> — récupérer tes données dans un format
            JSON exploitable
          </li>
          <li>
            <strong>Opposition</strong> — refuser certains traitements (ex.
            telemetry)
          </li>
          <li>
            <strong>Limitation</strong> — geler le traitement le temps d'une
            contestation
          </li>
        </ul>
        <p className="text-ink/75 leading-relaxed mb-3">
          Pour exercer un de ces droits, écris à{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com?subject=RGPD%20-%20Incipit"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>{" "}
          en précisant l'email associé à ton compte. On répond sous 30 jours
          maximum (engagement RGPD), généralement sous 7 jours ouvrés.
        </p>
        <p className="text-ink/75 leading-relaxed mb-6">
          Tu peux aussi adresser une réclamation à la CNIL :{" "}
          <a
            href="https://www.cnil.fr/fr/plaintes"
            className="text-bordeaux underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr/fr/plaintes ↗
          </a>
        </p>

        {/* ─── Sécurité ──────────────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Sécurité
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Tout transite en HTTPS (TLS 1.3). Les données stockées chez Supabase
          sont chiffrées au repos. Les sessions sont protégées par des cookies
          httpOnly + secure. Les mots de passe ne sont pas stockés (auth par
          magic link ou OAuth uniquement). En cas de violation de données, on
          notifie la CNIL sous 72 heures et les utilisateurs concernés sans
          délai injustifié.
        </p>

        {/* ─── Enfants ───────────────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Public et âge minimum
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6">
          Incipit est destiné à un public de 13 ans et plus. Le contenu
          littéraire (classiques, rap français analysé) peut traiter de
          thématiques adultes — adultère, mort, drogue, politique — qui
          nécessitent une maturité de lecture. On ne collecte pas sciemment de
          données auprès de mineurs de moins de 13 ans. Si on découvre qu'un
          tel compte existe, on le supprime sous 24 heures.
        </p>

        {/* ─── Modifications ─────────────────────────────────────────── */}
        <h2 className="font-serif text-xl font-black text-ink mb-3 mt-10">
          Modifications de cette politique
        </h2>
        <p className="text-ink/75 leading-relaxed mb-10">
          On met à jour cette page chaque fois que les pratiques changent. La
          version en vigueur est toujours affichée en haut. Les changements
          substantiels sont annoncés par email aux utilisateurs ayant un
          compte, et par bandeau dans l'application.
        </p>

        <div className="border-t border-ink/10 pt-6 text-sm text-ink/60">
          Voir aussi :{" "}
          <Link href="/terms" className="text-bordeaux underline">
            Conditions d'utilisation
          </Link>{" "}
          ·{" "}
          <Link href="/legal" className="text-bordeaux underline">
            Mentions légales
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
