import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Presse · media kit",
  description:
    "Logos, descriptions et visuels Incipit pour journalistes, podcasteurs, libraires et institutions. Tout est libre d'utilisation pour parler de l'app.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Presse · Incipit",
    description:
      "Media kit Incipit — logos HD, descriptions courtes et longues, palette, contact.",
    type: "website",
  },
};

// Page presse / media kit. SSR statique, crawlable, vise les journalistes,
// podcasteurs littéraires et libraires qui voudraient parler d'Incipit.
// Tout est en libre téléchargement — pas de gate, pas de formulaire.
export default function PressePage() {
  return (
    <>
      <AppHeader title="Presse" subtitle="Media kit" back />

      <main className="px-6 py-8 space-y-10 pb-20">
        {/* Hero */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <Logo size={72} />
            <div>
              <h1 className="font-serif text-3xl font-black text-ink leading-tight">
                Tu parles d'Incipit&nbsp;?
              </h1>
              <p className="text-sm text-ink/70 mt-1">
                Voici tout ce qu'il te faut. Sans demande préalable.
              </p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-ink/85">
            Tu es journaliste, libraire, professeur, podcasteur ou tu animes une
            communauté qui parle de littérature&nbsp;? Tu peux télécharger
            librement nos logos et reprendre nos descriptifs. Pas besoin de
            nous demander&nbsp;: c'est la moindre des choses pour qu'on puisse
            faire vivre les classiques ensemble.
          </p>
        </section>

        {/* Pitch court */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Pitch court (1 phrase)
          </h2>
          <blockquote className="font-serif text-xl italic text-ink leading-snug border-l-4 border-bordeaux pl-4 py-2">
            Incipit, c'est l'app qui rebranche les classiques de la littérature
            sur l'envie de lire — pitch court, première phrase, contexte
            historique, et pont avec le rap français pour que la magie reprenne.
          </blockquote>
        </section>

        {/* Pitch long */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Pitch long (3 phrases)
          </h2>
          <p className="text-[15px] leading-relaxed text-ink/85 mb-3">
            Incipit présente chaque jour un classique français par sa première
            phrase, avec un pitch en 30 secondes qui parle aux 18-40 ans sans
            condescendre. La fiche livre déroule le contexte historique, les
            personnages, les passages clés, l'avis du libraire indépendant et
            les ponts vers le rap français — Booba qui cite Baudelaire, Damso
            qui écrit comme Céline.
          </p>
          <p className="text-[15px] leading-relaxed text-ink/85">
            L'app reste sobre&nbsp;: pas de pub, pas de gamification agressive,
            pas de notifications harcelantes. Le mode prof permet à un
            enseignant de générer un quiz littéraire imprimable en 30 secondes,
            avec licence Creative Commons.
          </p>
        </section>

        {/* Logos téléchargeables */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Logos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <LogoCard
              href="/icon-1024.png"
              label="PNG 1024×1024"
              sub="Bg paper, transparent"
              variant="light"
            />
            <LogoCard
              href="/icon-512.svg"
              label="SVG vectoriel"
              sub="Modifiable, scalable"
              variant="light"
            />
            <LogoCard
              href="/icon-512.png"
              label="PNG 512×512"
              sub="Réseaux sociaux"
              variant="light"
            />
            <LogoCard
              href="/icon-192.png"
              label="PNG 192×192"
              sub="Avatar, signature"
              variant="light"
            />
          </div>
          <p className="text-[11px] text-ink/55 italic mt-3 leading-relaxed">
            Clique sur un fichier pour le télécharger. Tu peux le réutiliser
            librement pour parler d'Incipit&nbsp;: presse, billet de blog,
            réseaux, support pédagogique.
          </p>
        </section>

        {/* Palette */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Palette éditoriale
          </h2>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <Swatch hex="#FAF7F0" name="Paper" />
            <Swatch hex="#1A1A2E" name="Ink" />
            <Swatch hex="#8A1234" name="Bordeaux" />
            <Swatch hex="#C9A961" name="Gold" />
          </div>
          <p className="text-[11px] text-ink/55 italic mt-3 leading-relaxed">
            Typographie&nbsp;: Playfair Display (titres), Inter (corps), IBM
            Plex Mono (chiffres &amp; codes).
          </p>
        </section>

        {/* Faits & chiffres */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Quelques chiffres
          </h2>
          <ul className="space-y-2 text-[15px] text-ink/85 leading-relaxed">
            <li>· 12 classiques français en fiche complète, qui s'enrichissent.</li>
            <li>· Un incipit du jour, archivé sur 30 jours.</li>
            <li>· Quiz littéraire avec 40+ questions multi-niveaux.</li>
            <li>
              · 12 punchlines de rap français analysées comme de la
              littérature, avec leurs ponts classiques.
            </li>
            <li>
              · Mode prof avec quiz imprimable Creative Commons (BY-NC).
            </li>
            <li>
              · Capsules vidéo France 5 « La P'tite Librairie » de François
              Busnel sur 9+ classiques du corpus.
            </li>
          </ul>
        </section>

        {/* Approches éditoriales */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Ce qu'Incipit n'est pas
          </h2>
          <ul className="space-y-2 text-[15px] text-ink/85 leading-relaxed">
            <li>
              · <strong>Pas un Audible bis</strong>&nbsp;: on n'héberge pas les
              livres. On renvoie vers Audible, Kindle, Kobo, Apple Books,
              Google Play, libraires indépendants, et le domaine public quand
              c'est dispo gratuitement (Gutenberg, Wikisource, Gallica).
            </li>
            <li>
              · <strong>Pas une plateforme de gamification</strong>&nbsp;: pas
              de XP, pas de niveaux, pas de jauges. Un streak doux, des badges
              culturels, et tu peux les masquer si tu veux.
            </li>
            <li>
              · <strong>Pas un Babelio</strong>&nbsp;: on cure le contenu
              éditorial nous-mêmes, pas de note utilisateur sur 5 étoiles.
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-cream border border-dust rounded-2xl p-5">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-2">
            Contact presse
          </h2>
          <p className="text-[15px] leading-relaxed text-ink/85 mb-2">
            Pour une interview, un test, un partenariat éditorial ou un sujet
            qui dépasse ce que tu vois ici&nbsp;:
          </p>
          <a
            href="mailto:guillaumecoulon1@gmail.com?subject=Presse%20Incipit"
            className="font-serif text-lg font-bold text-bordeaux hover:underline"
          >
            guillaumecoulon1@gmail.com
          </a>
        </section>

        {/* Liens utiles */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bordeaux mb-3">
            Liens utiles
          </h2>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              ·{" "}
              <Link href="/" className="text-bordeaux underline">
                Page d'accueil
              </Link>
            </li>
            <li>
              ·{" "}
              <Link href="/about" className="text-bordeaux underline">
                À propos &amp; manifeste
              </Link>
            </li>
            <li>
              ·{" "}
              <Link href="/legal" className="text-bordeaux underline">
                Mentions légales &amp; sources
              </Link>
            </li>
            <li>
              ·{" "}
              <Link href="/privacy" className="text-bordeaux underline">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}

function LogoCard({
  href,
  label,
  sub,
  variant,
}: {
  href: string;
  label: string;
  sub: string;
  variant: "light" | "dark";
}) {
  return (
    <a
      href={href}
      download
      className="group flex flex-col items-center gap-2 bg-paper border border-ink/10 rounded-2xl p-4 hover:border-bordeaux/40 transition"
      aria-label={`Télécharger ${label} — ${sub}`}
    >
      <Logo size={56} variant={variant} />
      <div className="text-center">
        <div className="text-[12px] font-bold text-ink">{label}</div>
        <div className="text-[10px] text-ink/55">{sub}</div>
      </div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-bordeaux/70 group-hover:text-bordeaux">
        Télécharger ↓
      </div>
    </a>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  const isLight = hex === "#FAF7F0";
  return (
    <div className="rounded-xl overflow-hidden border border-ink/10">
      <div
        className="h-16 flex items-end justify-end p-2"
        style={{ backgroundColor: hex }}
      >
        <span
          className="font-mono text-[10px] font-bold"
          style={{ color: isLight ? "#1A1A2E" : "#FAF7F0" }}
        >
          {hex}
        </span>
      </div>
      <div className="bg-paper px-2 py-1.5 text-[11px] font-bold text-ink">
        {name}
      </div>
    </div>
  );
}
