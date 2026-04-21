import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "À propos · Incipit",
  description:
    "Incipit, c'est un pitch Boloss pour chaque classique. Pas de gamification, pas de notifs qui harcèlent, pas de pub. Juste les premières lignes qui donnent envie.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AppHeader title="À propos" subtitle="Manifeste & crédits" back />

      {/* Hero manifeste */}
      <section className="px-6 pt-6 pb-10 bg-cream border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          Manifeste
        </div>
        <h2 className="font-serif text-3xl font-black text-ink leading-tight mb-4">
          On veut te rendre les classiques.
        </h2>
        <p className="font-serif text-lg leading-relaxed text-ink/90">
          Pas dans une version scolaire, austère, culpabilisante. Dans leur
          version vivante, brutale, drôle. Flaubert qui démonte la bourgeoisie.
          Zola qui filme les mineurs. Baudelaire qui invente le spleen. Ces
          textes ne sont pas morts. Ils attendent juste qu'on arrête d'en parler
          comme d'un devoir.
        </p>
      </section>

      {/* Les principes */}
      <section className="px-6 py-10 border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-5">
          Nos principes
        </div>

        <div className="space-y-6">
          <Principle
            title="Pas de gamification toxique."
            body="Pas de streak qui harcèle, pas d'XP à farmer, pas de classement. Les quiz existent pour le plaisir de reconnaître un auteur, pas pour t'empêcher de dormir. Les jalons qu'on débloque sont des clins d'œil littéraires — Œil de Stendhal, Voltairien, Encyclopédiste — pas des médailles à collectionner."
          />
          <Principle
            title="Pas de notifs qui harcèlent."
            body="Zéro push agressif. Incipit t'attend, Incipit ne te relance pas. Tu viens quand tu veux."
          />
          <Principle
            title="Pas de pub."
            body="On ne vend pas ton attention. On ne vend rien du tout, pour l'instant. Et si on monétise un jour, ce sera pas sur le dos de ta tranquillité."
          />
          <Principle
            title="Du domaine public en priorité."
            body="Quand un auteur est mort +70 ans, son œuvre est à tout le monde. On te donne le lien direct vers Gutenberg, Wikisource, Gallica. Gratuit et légal."
          />
          <Principle
            title="Du rap comme porte d'entrée."
            body="Booba cite Baudelaire. Nekfeu lit Rimbaud. Damso flirte avec Céline. On relie les deux, sans condescendance ni forçage scolaire."
          />
          <Principle
            title="Pas de lecture dans l'app."
            body="Incipit c'est un pitch, un passage clé, une envie. La lecture, elle, se passe dans ton liseur, ton Audible, ton libraire indé, ton exemplaire corné. On te renvoie au bon endroit."
          />
        </div>
      </section>

      {/* Crédits & sources */}
      <section className="px-6 py-10 border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-5">
          Crédits & sources
        </div>

        <p className="text-sm text-ink/70 leading-relaxed mb-5">
          Incipit s'appuie sur des bibliothèques numériques publiques et des
          plateformes tierces. On les cite, on les respecte, on les remercie.
        </p>

        <div className="space-y-4">
          <CreditRow
            name="Project Gutenberg"
            role="Textes intégraux du domaine public"
            url="https://www.gutenberg.org/"
          />
          <CreditRow
            name="Wikisource"
            role="Version annotée & collaborative"
            url="https://fr.wikisource.org/"
          />
          <CreditRow
            name="Gallica · BNF"
            role="Éditions originales numérisées"
            url="https://gallica.bnf.fr/"
          />
          <CreditRow
            name="Genius"
            role="Paroles de rap annotées"
            url="https://genius.com/"
          />
          <CreditRow
            name="Place des Libraires"
            role="Réseau des libraires indépendants"
            url="https://www.placedeslibraires.fr/"
          />
          <CreditRow
            name="Audible, Kindle, Kobo, Apple Books, Google Play Books"
            role="Plateformes de lecture & audio partenaires"
          />
        </div>
      </section>

      {/* À qui ça s'adresse */}
      <section className="px-6 py-10 border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-5">
          Pour qui
        </div>

        <div className="space-y-3 text-sm text-ink/75 leading-relaxed">
          <p>
            <span className="font-serif font-bold text-ink">Les curieux </span>
            qui veulent lire les classiques mais qui trouvent les 4e de
            couverture cheloues.
          </p>
          <p>
            <span className="font-serif font-bold text-ink">Les anciens lecteurs </span>
            qui ont décroché depuis le bac et qui cherchent un pitch franc pour
            relancer.
          </p>
          <p>
            <span className="font-serif font-bold text-ink">Les profs </span>
            qui veulent accrocher leurs élèves autrement qu'avec un commentaire
            composé.
          </p>
          <p>
            <span className="font-serif font-bold text-ink">Les amoureux du rap </span>
            qui veulent remonter les sources des punchlines qu'ils écoutent.
          </p>
        </div>
      </section>

      {/* Mentions légales */}
      <section className="px-6 py-10 border-b border-ink/5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-5">
          Mentions légales
        </div>

        <div className="space-y-4 text-xs text-ink/60 leading-relaxed">
          <p>
            <span className="font-bold text-ink/80">Éditeur · </span>
            Incipit est un projet indépendant, à but de démonstration éditoriale
            et produit. Pour toute question, contact :{" "}
            <a
              href="mailto:hello@incipit.app"
              className="underline decoration-dotted hover:text-bordeaux"
            >
              hello@incipit.app
            </a>
            .
          </p>
          <p>
            <span className="font-bold text-ink/80">Propriété intellectuelle · </span>
            Les textes classiques cités sont du domaine public. Les paroles de
            rap ne sont pas reproduites : on renvoie vers Genius. Les pitches,
            passages clés sélectionnés et éditoriaux sont la propriété
            d'Incipit. Les marques et logos cités (Audible, Kindle, Kobo,
            Apple, Google, Gallica, Gutenberg, Wikisource, Genius, Place des
            Libraires) appartiennent à leurs détenteurs respectifs.
          </p>
          <p>
            <span className="font-bold text-ink/80">Données personnelles · </span>
            Incipit ne collecte aucune donnée personnelle identifiante sans
            consentement. Les préférences d'onboarding sont stockées localement
            sur ton appareil (localStorage), jamais envoyées à un serveur.
          </p>
          <p>
            <span className="font-bold text-ink/80">Hébergement · </span>
            Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
          </p>
        </div>
      </section>

      {/* CTA retour */}
      <section className="px-6 py-10">
        <p className="text-sm text-ink/60 mb-5 text-center">
          Prêt·e à t'y remettre ?
        </p>
        <div className="flex gap-3">
          <Link
            href="/explore"
            className="flex-1 py-4 text-center rounded-2xl bg-ink text-paper font-serif text-base font-bold hover:bg-ink/90 transition"
          >
            Explorer le catalogue
          </Link>
          <Link
            href="/domaine-public"
            className="flex-1 py-4 text-center rounded-2xl border-2 border-ink text-ink font-serif text-base font-bold hover:bg-ink/5 transition"
          >
            Lecture gratuite
          </Link>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-ink/40 text-center mt-10">
          Incipit · v1 · {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-serif text-lg font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink/70 leading-relaxed">{body}</p>
    </div>
  );
}

function CreditRow({
  name,
  role,
  url,
}: {
  name: string;
  role: string;
  url?: string;
}) {
  const inner = (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-ink/5 last:border-0">
      <div>
        <div className="font-serif font-bold text-ink text-sm">{name}</div>
        <div className="text-xs text-ink/55">{role}</div>
      </div>
      {url && <span className="text-ink/40 text-xs">↗</span>}
    </div>
  );
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-ink/5 px-3 -mx-3 rounded-lg transition"
      >
        {inner}
      </a>
    );
  }
  return <div className="px-3 -mx-3">{inner}</div>;
}
