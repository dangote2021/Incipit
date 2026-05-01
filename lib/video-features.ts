// ─────────────────────────────────────────────────────────────────────────────
// Video features — capsules vidéo de référence pour un livre.
//
// Pour la première vague (#119) on branche "La P'tite Librairie" de François
// Busnel : 9 capsules de 1'30 à 5' produites par Rosebud Productions pour
// France Télévisions, diffusées en accès libre sur la chaîne YouTube
// officielle "La Grande Librairie - France Télévisions".
//
// Légalité : on ne fait que lier (anchor target=_blank) vers une vidéo
// publique mise en ligne par l'ayant droit (France TV). C'est la pratique
// web standard validée par la jurisprudence européenne (CJUE Svensson 2014,
// GS Media 2016) — un lien vers contenu déjà rendu public licitement n'est
// pas une nouvelle communication au public. La récup de la thumbnail via
// img.youtube.com/vi/<id>/mqdefault.jpg est explicitement autorisée par
// les ToS YouTube dans le cadre d'un lien sortant. Aucun stockage local,
// aucune transcription, attribution claire (logo France 5 + présentateur).
//
// Pattern identique à celui utilisé pour Genius (paroles rap) et Spotify
// (écoute) sur Rap & Lit.
// ─────────────────────────────────────────────────────────────────────────────

export type VideoSource = "p-tite-librairie" | "grande-librairie";
export type VideoPresenter = "busnel" | "trapenard";

export type VideoFeature = {
  /** Source éditoriale */
  source: VideoSource;
  /** Présentateur — Busnel a quitté La Grande Librairie en 2022, mais
   *  anime toujours La P'tite Librairie. Trapenard présente La Grande
   *  Librairie depuis le 500e épisode (sept. 2022). */
  presenter: VideoPresenter;
  /** Titre exact tel qu'il apparaît sur YouTube (utile pour l'attribution
   *  et pour faire confiance aux ayants droit). */
  title: string;
  /** ID YouTube — utilisé pour construire l'URL et la thumbnail. On stocke
   *  l'ID pas l'URL complète pour éviter les variantes /watch?v= vs youtu.be
   *  vs short URL. */
  youtubeId: string;
  /** Durée approximative en minutes ("3 min de pitch", "12 min d'interview").
   *  Indicatif, non bloquant si manquant. */
  durationMin?: number;
  /** Année de mise en ligne — utile pour signaler "Busnel 2023" vs "Busnel
   *  2018" quand on aura plusieurs capsules par livre. */
  year?: number;
};

// Mapping book.id → liste de VideoFeature. Un livre peut avoir 0, 1 ou
// plusieurs capsules ; on respecte l'ordre éditorial de la liste.
export const VIDEO_FEATURES: Record<string, VideoFeature[]> = {
  // Camus — L'Étranger
  etranger: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "ALBERT CAMUS / L'ÉTRANGER / LA P'TITE LIBRAIRIE",
      youtubeId: "c0T_3xSiTzs",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Flaubert — Madame Bovary
  bovary: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / MADAME BOVARY / LA P'TITE LIBRAIRIE",
      youtubeId: "2gKc75Po9oM",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Zola — Germinal
  germinal: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "EMILE ZOLA / GERMINAL / LA P'TITE LIBRAIRIE",
      youtubeId: "0Dt4IG6A9Sc",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Stendhal — Le Rouge et le Noir
  "rouge-noir": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "STENDHAL / LE ROUGE ET LE NOIR / LA P'TITE LIBRAIRIE",
      youtubeId: "IYBwduI46WE",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Maupassant — Bel-Ami
  "bel-ami": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUY DE MAUPASSANT / BEL-AMI / LA P'TITE LIBRAIRIE",
      youtubeId: "QBpSZjYP_6Y",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Voltaire — Candide
  candide: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "VOLTAIRE / CANDIDE / LA P'TITE LIBRAIRIE",
      youtubeId: "HFXI2KJE3Mw",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Balzac — Le Père Goriot
  "pere-goriot": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "HONORÉ DE BALZAC / LE PÈRE GORIOT / LA P'TITE LIBRAIRIE",
      youtubeId: "e3yyE1qf4x0",
      durationMin: 3,
      year: 2023,
    },
  ],
  // Proust — Du côté de chez Swann
  swann: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "MARCEL PROUST / DU CÔTÉ DE CHEZ SWANN / LA P'TITE LIBRAIRIE",
      youtubeId: "Y917qR3YgXA",
      durationMin: 4,
      year: 2023,
    },
  ],
  // Céline — Voyage au bout de la nuit
  voyage: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title:
        "LOUIS-FERDINAND CÉLINE / VOYAGE AU BOUT DE LA NUIT / LA P'TITE LIBRAIRIE",
      youtubeId: "0wexD_fI394",
      durationMin: 4,
      year: 2023,
    },
  ],
  // Hugo — Notre-Dame de Paris : pas de capsule dédiée trouvée à ce jour ;
  // on lie vers Les Misérables, capsule du même auteur sur le geste hugolien
  // (annotation explicite dans le composant pour ne pas tromper le lecteur).
  "notre-dame": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "VICTOR HUGO / LES MISÉRABLES / LA P'TITE LIBRAIRIE",
      youtubeId: "__w1gwpPg9A",
      durationMin: 3,
      year: 2023,
    },
  ],
};

// ─── URL helpers ───────────────────────────────────────────────────────────

/** URL YouTube canonique pour ouvrir la vidéo dans un nouvel onglet. */
export function youtubeUrl(v: VideoFeature): string {
  return `https://www.youtube.com/watch?v=${v.youtubeId}`;
}

/** URL de la thumbnail YouTube — 320×180 mqdefault est le bon compromis
 *  qualité/poids pour une carte de fiche livre. hqdefault (480×360) est
 *  trop lourd, default (120×90) trop pixellisé. */
export function youtubeThumb(v: VideoFeature): string {
  return `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`;
}

/** Récupère les capsules vidéo d'un livre (vide si aucune). */
export function getVideoFeatures(bookId: string): VideoFeature[] {
  return VIDEO_FEATURES[bookId] ?? [];
}

/** Libellé humain de la source pour l'attribution UI. */
export function sourceLabel(source: VideoSource): string {
  return source === "p-tite-librairie"
    ? "La P'tite Librairie"
    : "La Grande Librairie";
}

/** Libellé humain du présentateur. */
export function presenterLabel(presenter: VideoPresenter): string {
  return presenter === "busnel" ? "François Busnel" : "Augustin Trapenard";
}
