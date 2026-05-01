import {
  getVideoFeatures,
  presenterLabel,
  sourceLabel,
  youtubeThumb,
  youtubeUrl,
  type VideoFeature,
} from "@/lib/video-features";

// ─────────────────────────────────────────────────────────────────────────────
// Section "Vu à la télé" sur la fiche livre.
//
// Affiche les capsules vidéo de référence pour le livre (La P'tite Librairie
// de François Busnel sur France 5 pour la première vague). Chaque carte est
// un lien sortant vers YouTube — pas d'embed iframe pour respecter la patte
// minimaliste et le poids de la page.
//
// Pattern aligné sur ReadElsewhere (connecteurs Audible/Kindle/...) et sur
// les liens Genius/Spotify de Rap & Lit. target=_blank + rel=noopener +
// aria-label "ouvre dans un nouvel onglet" pour les lecteurs d'écran
// (correction Claire, panel beta v6).
//
// Une capsule peut être annotée par un `relationNote` quand elle ne porte
// pas pile-poil sur le livre du corpus (autre œuvre du même auteur, etc.).
// On affiche alors la note sous la carte pour ne pas tromper le lecteur.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  bookId: string;
};

export default function VideoFeatures({ bookId }: Props) {
  const features = getVideoFeatures(bookId);
  if (features.length === 0) return null;

  return (
    <section aria-labelledby="video-features-heading">
      <h2
        id="video-features-heading"
        className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3"
      >
        Vu à la télé{features.length > 1 ? ` · ${features.length}` : ""}
      </h2>
      <ul className="space-y-3">
        {features.map((v) => (
          <li key={v.youtubeId} className="space-y-2">
            <VideoCard v={v} />
            {v.relationNote ? (
              <p className="text-[12px] italic text-ink/60 leading-relaxed pl-3 border-l-2 border-bordeaux/30">
                {v.relationNote}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {/* Source / mentions — discret, pour la transparence éditoriale.
          Service public, accès libre, attribution claire. */}
      <p className="text-[11px] text-ink/45 mt-3 italic leading-relaxed">
        Capsules produites par Rosebud Productions pour France Télévisions
        (France 5), accessibles librement sur la chaîne YouTube officielle
        de La Grande Librairie. Incipit ne fait que renvoyer.
      </p>
    </section>
  );
}

function VideoCard({ v }: { v: VideoFeature }) {
  const url = youtubeUrl(v);
  const thumb = youtubeThumb(v);
  const source = sourceLabel(v.source);
  const presenter = presenterLabel(v.presenter);
  // Titre lisible — on dégrade le titre YouTube tout-caps en quelque chose
  // de plus présentable (l'auteur dans les majuscules de France 5 est un
  // peu rude pour notre maquette éditoriale).
  const cleanTitle = humanizeTitle(v.title);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${cleanTitle} — capsule ${source} présentée par ${presenter}, ouvre dans un nouvel onglet sur YouTube`}
      className="group flex gap-3 items-stretch bg-paper border border-ink/10 rounded-2xl p-3 hover:border-bordeaux/40 hover:shadow-md transition"
    >
      {/* Thumbnail YouTube + overlay play. La thumb est servie par YouTube
          directement, donc next/image n'est pas nécessaire (et compliquerait
          la config remotePatterns sans bénéfice perceptible ici). */}
      <div className="relative shrink-0 w-32 h-[72px] rounded-lg overflow-hidden bg-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt=""
          width={128}
          height={72}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition" />
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-paper/95 shadow-md flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-bordeaux ml-0.5"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-bordeaux mb-1">
            {source} · France 5
          </div>
          <div className="font-serif text-[15px] font-bold text-ink leading-tight line-clamp-2">
            {cleanTitle}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink/55 mt-1">
          <span>par {presenter}</span>
          {v.durationMin ? (
            <>
              <span className="text-ink/25">·</span>
              <span>{v.durationMin} min</span>
            </>
          ) : null}
          <span className="ml-auto text-bordeaux/70 group-hover:text-bordeaux font-bold tracking-widest uppercase text-[10px]">
            YouTube ↗
          </span>
        </div>
      </div>
    </a>
  );
}

// "GUSTAVE FLAUBERT / MADAME BOVARY / LA P'TITE LIBRAIRIE" →
// "Madame Bovary, par Gustave Flaubert"
function humanizeTitle(raw: string): string {
  const parts = raw.split("/").map((s) => s.trim());
  if (parts.length >= 2) {
    const author = toTitleCase(parts[0]);
    const work = toTitleCase(parts[1]);
    return `${work}, par ${author}`;
  }
  return toTitleCase(raw);
}

function toTitleCase(s: string): string {
  // Conserve les accents, lowercase puis upperCase la première lettre de
  // chaque mot. Évite de transformer "DE" en "De" pour les particules
  // courantes (de, du, des, le, la, les, et, à, en).
  const lower = s.toLocaleLowerCase("fr-FR");
  const PARTICLES = new Set([
    "de",
    "du",
    "des",
    "le",
    "la",
    "les",
    "et",
    "à",
    "en",
    "au",
    "aux",
    "d",
    "l",
  ]);
  return lower
    .split(/(\s+|-)/)
    .map((tok, i) => {
      if (/^\s+|-$/.test(tok)) return tok;
      if (i > 0 && PARTICLES.has(tok)) return tok;
      return tok.charAt(0).toLocaleUpperCase("fr-FR") + tok.slice(1);
    })
    .join("");
}
