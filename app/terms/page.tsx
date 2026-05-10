import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Conditions générales d'utilisation d'Incipit V1 gratuite : usage personnel, droit de la propriété intellectuelle, responsabilités, contact RGPD.",
  alternates: { canonical: "/terms" },
};

// ─────────────────────────────────────────────────────────────────────────────
// /terms — Conditions Générales d'Utilisation V1.0
//
// Version V1 gratuite, éditeur personne physique. Pas de Stripe activé donc
// pas de section paiement / rétractation / TVA. Une formule payante pourra
// être ajoutée en V1.5 — la section 6 prévoit explicitement le mode d'emploi
// (préavis 30 jours, accord explicite via interface paiement, tarif réduit
// à vie pour les early users).
//
// Pour faire évoluer ces CGU :
//   1. bumper updated = "1ᵉʳ … 2026"
//   2. notifier les users existants par email + bandeau in-app 30 jours avant
//   3. pour Stripe : ajouter section 7 Tarification + 8 Rétractation + 9
//      Médiation conso (médiateur agréé CECMC, ex: FEVAD)
// ─────────────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  const updated = "1ᵉʳ mai 2026";
  const version = "1.0";

  return (
    <div className="min-h-screen">
      <AppHeader title="Conditions" subtitle="Le contrat simple qui nous lie" back />
      <section className="px-6 py-10 max-w-2xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Version {version}
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-6">
          Conditions générales d&apos;utilisation
        </h1>

        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-2">
          En vigueur depuis
        </div>
        <div className="text-sm text-ink/70 mb-10 italic">{updated}</div>

        {/* ─────────────────────────────────────── */}
        <H2>Préambule</H2>
        <P>
          Les présentes Conditions Générales d&apos;Utilisation (« CGU ») régissent
          l&apos;accès et l&apos;utilisation de l&apos;application Incipit, accessible
          depuis incipit-navy.vercel.app (et son futur domaine custom), depuis
          la PWA installée sur appareil Apple via Safari, et depuis l&apos;application
          Android distribuée via Google Play. L&apos;ensemble est ci-après désigné
          « l&apos;Application ». L&apos;utilisation de l&apos;Application implique
          l&apos;acceptation pleine et entière de ces CGU.
        </P>

        <H2>1. Éditeur</H2>
        <P>
          L&apos;Application est éditée par <strong>Guillaume Coulon</strong>,
          personne physique domiciliée en France, en qualité de fondateur et
          responsable éditorial. Contact :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          . Coordonnées complètes consultables sur la page{" "}
          <Link href="/legal" className="text-bordeaux underline">
            Mentions légales
          </Link>
          .
        </P>

        <H2>2. Hébergement</H2>
        <P>
          L&apos;Application est hébergée sur Vercel Inc., 440 N Barranca Ave
          #4133, Covina, CA 91723, États-Unis (
          <a
            href="https://vercel.com"
            className="text-bordeaux underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          ). Les données utilisateurs (compte, favoris, préférences) sont stockées
          sur Supabase (Frankfurt, eu-central-1, Allemagne) — voir{" "}
          <Link href="/privacy" className="text-bordeaux underline">
            Politique de confidentialité
          </Link>
          .
        </P>

        <H2>3. Acceptation et modifications</H2>
        <P>
          En utilisant l&apos;Application, tu acceptes ces CGU. Si tu n&apos;es
          pas d&apos;accord, n&apos;utilise pas l&apos;Application. Nous pouvons
          faire évoluer ces CGU. Toute modification substantielle sera annoncée
          au moins <strong>trente (30) jours</strong> avant son entrée en vigueur,
          via un bandeau dans l&apos;Application et un email aux utilisateurs
          inscrits. La poursuite de l&apos;utilisation après cette période vaut
          acceptation. Tu peux à tout moment supprimer ton compte si tu refuses
          les nouvelles conditions.
        </P>

        <H2>4. Compte utilisateur</H2>
        <P>
          La consultation de l&apos;Application est libre et ne nécessite pas de
          compte. Pour synchroniser tes favoris, tes notes et ton profil entre
          appareils, tu peux créer un compte via Supabase Auth (lien magique par
          email ou Google OAuth). Tu es responsable de la confidentialité de ton
          accès. Le compte est strictement personnel. À tout moment, tu peux :
        </P>
        <ul className="list-disc pl-6 space-y-1 text-ink/75 leading-relaxed mb-6">
          <li>
            <strong>Exporter tes données</strong> au format JSON depuis{" "}
            <em>Profil → Exporter mes données</em> (article 20 du RGPD).
          </li>
          <li>
            <strong>Supprimer ton compte</strong> et toutes les données associées
            depuis <em>Profil → Supprimer mon compte</em> (article 17 du RGPD).
            Action irréversible, effective sous 30 jours maximum (purge des
            sauvegardes incluses).
          </li>
        </ul>

        <H2>5. Usage personnel et limites</H2>
        <P>
          L&apos;Application est mise à ta disposition pour un usage personnel
          et non-commercial. Tu t&apos;engages à :
        </P>
        <ul className="list-disc pl-6 space-y-1 text-ink/75 leading-relaxed mb-6">
          <li>ne pas l&apos;utiliser à des fins illicites ou portant atteinte à des tiers,</li>
          <li>
            ne pas tenter d&apos;en contourner les limites techniques (quotas
            quotidiens du quiz, rate limits API),
          </li>
          <li>
            ne pas extraire massivement le contenu (scraping automatisé, miroirs)
            sans autorisation écrite préalable,
          </li>
          <li>
            ne pas chercher à compromettre la sécurité (intrusion, déni de service,
            ingénierie sociale).
          </li>
        </ul>
        <P>
          Le non-respect peut entraîner la suspension ou la suppression du compte
          sans préavis ni indemnité. Le mode <strong>Prof</strong> (
          <Link href="/prof" className="text-bordeaux underline">
            /prof
          </Link>
          ) déroge à la limite « non-commercial » : les contenus pédagogiques
          (quiz imprimables, fiches) y sont publiés sous licence{" "}
          <strong>Creative Commons BY-NC 4.0</strong> et utilisables en classe.
        </P>

        <H2>6. Tarification — V1 gratuite</H2>
        <P>
          La <strong>version 1 d&apos;Incipit est entièrement gratuite</strong>.
          Aucune fonctionnalité n&apos;est payante, aucun moyen de paiement
          n&apos;est collecté ni demandé. Tu peux utiliser l&apos;intégralité
          de l&apos;Application sans rien débourser ni renseigner de carte
          bancaire.
        </P>
        <P>
          Une formule Premium par abonnement pourra être proposée
          ultérieurement (sync cloud avancée, mode prof complet, fonctionnalités
          enseignants, mode hors ligne enrichi…). Si tel était le cas :
        </P>
        <ul className="list-disc pl-6 space-y-1 text-ink/75 leading-relaxed mb-6">
          <li>
            tu en serais informé·e par email et dans l&apos;Application au moins{" "}
            <strong>30 jours avant activation</strong>,
          </li>
          <li>
            <strong>aucun prélèvement n&apos;aurait lieu sans ton accord
            explicite</strong> via l&apos;interface de paiement (Stripe, Apple
            Pay, Google Pay),
          </li>
          <li>
            les utilisateurs inscrits avant le passage payant
            <strong> garderont leur accès gratuit </strong>aux fonctionnalités
            déjà disponibles à la date d&apos;activation, et bénéficieront d&apos;
            un <strong>tarif réduit à vie</strong> sur la nouvelle formule (early
            user reward),
          </li>
          <li>
            les CGU seront mises à jour à cette date pour intégrer les sections
            tarification, droit de rétractation (article L. 221-18 du Code de la
            consommation) et médiation de la consommation.
          </li>
        </ul>

        <H2>7. Propriété intellectuelle</H2>
        <P>
          Les <strong>textes éditoriaux originaux</strong> d&apos;Incipit (pitches,
          punchlines, analyses, quiz, manifestes) sont la propriété exclusive de
          l&apos;éditeur et protégés par le droit d&apos;auteur (articles L. 111-1
          et suivants du Code de la propriété intellectuelle). Toute reproduction
          ou rediffusion hors usage privé strict est interdite sans autorisation
          écrite préalable.
        </P>
        <P>
          Les <strong>extraits d&apos;œuvres littéraires</strong> proposés
          (incipits, citations, passages clés) sont :
        </P>
        <ul className="list-disc pl-6 space-y-1 text-ink/75 leading-relaxed mb-6">
          <li>
            soit issus du <strong>domaine public</strong> (auteur décédé depuis
            plus de 70 ans, prorogations de guerre incluses le cas échéant) — c&apos;
            est le cas pour la quasi-totalité du catalogue actuel ;
          </li>
          <li>
            soit utilisés dans le cadre de la <strong>courte citation</strong>{" "}
            autorisée par l&apos;article L. 122-5, 3° a) du Code de la propriété
            intellectuelle, à des fins critiques, pédagogiques ou éditoriales,
            avec mention claire de la source.
          </li>
        </ul>
        <P>
          Si tu es ayant droit et estimes qu&apos;un extrait ne devrait pas
          figurer dans l&apos;Application, ou qu&apos;une attribution est
          incorrecte, écris à{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>{" "}
          : retrait sous 7 jours ouvrés.
        </P>

        <H2>8. Vidéos et liens tiers</H2>
        <P>
          L&apos;Application affiche des <strong>capsules vidéo</strong>
          (notamment La P&apos;tite Librairie de François Busnel) sous forme de{" "}
          <em>liens et thumbnails YouTube</em>. Ces contenus restent hébergés
          chez leurs ayants droit (France Télévisions, INA, etc.) — Incipit ne
          fait que pointer vers la chaîne officielle. Aucun stockage ou
          rediffusion n&apos;est effectué sur les serveurs Incipit. Cette pratique
          est conforme à la jurisprudence européenne sur les liens (CJUE
          Svensson, 13 février 2014).
        </P>
        <P>
          L&apos;Application redirige également vers des services tiers
          (libraires indépendants via{" "}
          <code className="text-[13px] bg-ink/5 px-1 rounded">
            placedeslibraires.fr
          </code>
          , Audible, Kindle, Kobo, Apple Books, Project Gutenberg, Wikisource,
          INA Madelen). Nous ne sommes pas responsables du contenu, de la
          disponibilité ou des pratiques commerciales de ces services tiers.
        </P>

        <H2>9. Données personnelles</H2>
        <P>
          Le traitement des données personnelles est régi par notre{" "}
          <Link href="/privacy" className="text-bordeaux underline">
            Politique de confidentialité
          </Link>
          , qui fait partie intégrante des présentes CGU. En résumé : minimum
          vital, hébergement européen (Supabase Frankfurt), aucune publicité,
          aucun courtier de données, droit de portabilité (export JSON) et
          droit à l&apos;effacement (suppression compte) accessibles en un clic
          depuis l&apos;Application.
        </P>

        <H2>10. Disponibilité et absence de garantie</H2>
        <P>
          L&apos;Application est fournie « <strong>en l&apos;état</strong> ». Nous
          faisons de notre mieux pour qu&apos;elle soit disponible et exempte de
          bugs, mais nous ne pouvons garantir une disponibilité ininterrompue
          ni l&apos;absence totale d&apos;erreurs. Des opérations de maintenance,
          mises à jour ou interruptions techniques peuvent survenir, avec ou
          sans préavis.
        </P>
        <P>
          Dans toute la mesure permise par la loi, et sauf en cas de faute lourde
          ou intentionnelle, notre <strong>responsabilité</strong> est limitée
          aux dommages directs, prouvés et raisonnablement prévisibles. Nous ne
          saurions être tenus responsables des dommages indirects (perte de
          chance, perte de données causée par un tiers, dommages immatériels).
        </P>

        <H2>11. Force majeure</H2>
        <P>
          Aucune des parties ne pourra être tenue responsable des manquements
          résultant d&apos;un cas de force majeure tel que défini à l&apos;
          article 1218 du Code civil — incluant, sans s&apos;y limiter,
          défaillance des fournisseurs d&apos;hébergement, attaque informatique
          massive, décision administrative ou judiciaire imposant la suspension
          du Service.
        </P>

        <H2>12. Droit applicable et juridiction</H2>
        <P>
          Les présentes CGU sont régies par le <strong>droit français</strong>.
          En cas de litige, et après tentative de résolution amiable préalable
          (contact à{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          ), les tribunaux français seront seuls compétents. Si tu agis en qualité
          de consommateur, tu conserves le bénéfice des dispositions impératives
          du Code de la consommation, et notamment le droit de saisir la
          juridiction du lieu de ton domicile.
        </P>

        <H2>13. Contact</H2>
        <P>
          Toute question relative à ces CGU :{" "}
          <a
            href="mailto:guillaumecoulon1@gmail.com"
            className="text-bordeaux underline"
          >
            guillaumecoulon1@gmail.com
          </a>
          . Réponse sous 7 jours ouvrés en moyenne.
        </P>

        {/* Footer mini-nav */}
        <div className="mt-12 pt-6 border-t border-ink/10 text-sm text-ink/60">
          Voir aussi :{" "}
          <Link href="/privacy" className="text-bordeaux underline">
            Politique de confidentialité
          </Link>{" "}
          ·{" "}
          <Link href="/legal" className="text-bordeaux underline">
            Mentions légales
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="text-bordeaux underline">
            À propos & manifeste
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-ink/40 italic">
          CGU v{version} · {updated} · personne physique éditeur · V1 gratuite
        </p>
      </section>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl font-black text-ink mt-8 mb-3">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink/75 leading-relaxed mb-6">{children}</p>
  );
}
