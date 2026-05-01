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
  /** Si la capsule ne porte PAS sur le livre courant mais sur une autre
   *  œuvre du même auteur (cas Hugo Misérables sur la fiche Notre-Dame,
   *  ou les autres Flaubert sur la fiche Bovary), on annote explicitement
   *  pour ne pas tromper le lecteur. Laissé vide quand c'est la capsule
   *  pile-poil sur le livre du corpus. */
  relationNote?: string;
};

// Mapping book.id → liste de VideoFeature. Un livre peut avoir 0, 1 ou
// plusieurs capsules ; on respecte l'ordre éditorial de la liste.
export const VIDEO_FEATURES: Record<string, VideoFeature[]> = {
  // ───────────────────────────────────────────────────────────────────────
  // Camus — L'Étranger (3 capsules : œuvre + 2 pour aller plus loin)
  // ───────────────────────────────────────────────────────────────────────
  etranger: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "ALBERT CAMUS / L'ÉTRANGER / LA P'TITE LIBRAIRIE",
      youtubeId: "c0T_3xSiTzs",
      durationMin: 3,
      year: 2023,
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "ALBERT CAMUS / LA PESTE / LA P'TITE LIBRAIRIE",
      youtubeId: "jjBfZ9axEJ8",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Pour aller plus loin chez Camus : la métaphore politique de la peste — Vichy, totalitarismes, et déjà la pandémie comme mode du monde.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "ALBERT CAMUS / NOCES / LA P'TITE LIBRAIRIE",
      youtubeId: "Ez1Um77yNh4",
      durationMin: 3,
      year: 2023,
      relationNote:
        "L'autre Camus : Algérie solaire, lyrique, fraternel — face B de l'Étranger.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Flaubert — Madame Bovary (6 capsules — le dossier le plus complet)
  // ───────────────────────────────────────────────────────────────────────
  bovary: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / MADAME BOVARY / LA P'TITE LIBRAIRIE",
      youtubeId: "2gKc75Po9oM",
      durationMin: 3,
      year: 2023,
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title:
        "GUSTAVE FLAUBERT / L'EDUCATION SENTIMENTALE / LA P'TITE LIBRAIRIE",
      youtubeId: "5fV9hS7Gv40",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Pour aller plus loin chez Flaubert : la grande désillusion sentimentale et politique de 1848.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / SALAMMBÔ / LA P'TITE LIBRAIRIE",
      youtubeId: "gCvK-bEB2lI",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le roman antique et orientaliste de Flaubert — face B de Bovary.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / UN COEUR SIMPLE / LA P'TITE LIBRAIRIE",
      youtubeId: "fgSF3lI8PIM",
      durationMin: 3,
      year: 2023,
      relationNote: "La nouvelle qui pardonne tout, dans Trois Contes (1877).",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / CORRESPONDANCE / LA P'TITE LIBRAIRIE",
      youtubeId: "yAFEbJeoMo4",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Les lettres à Louise Colet pendant l'écriture de Bovary — tout l'atelier mis à nu.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUSTAVE FLAUBERT / VOYAGE EN ORIENT / LA P'TITE LIBRAIRIE",
      youtubeId: "jcRT0G9gxlQ",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le carnet de voyage qui nourrira Salammbô — Flaubert reporter en Égypte avec Maxime Du Camp.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Zola — Germinal
  // ───────────────────────────────────────────────────────────────────────
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
  // ───────────────────────────────────────────────────────────────────────
  // Stendhal — Le Rouge et le Noir (3 capsules)
  // ───────────────────────────────────────────────────────────────────────
  "rouge-noir": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "STENDHAL / LE ROUGE ET LE NOIR / LA P'TITE LIBRAIRIE",
      youtubeId: "IYBwduI46WE",
      durationMin: 3,
      year: 2023,
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "STENDHAL / LA CHARTREUSE DE PARME / LA P'TITE LIBRAIRIE",
      youtubeId: "ihOBNavaOJA",
      durationMin: 3,
      year: 2023,
      relationNote:
        "L'autre grand roman de Stendhal — Italie napoléonienne, intrigues de cour, amour fou.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "JEAN RACINE / PHÈDRE / LA P'TITE LIBRAIRIE",
      youtubeId: "wdccMA10Ias",
      durationMin: 3,
      year: 2023,
      relationNote:
        "La passion tragique selon Racine — source classique de l'amour-désir chez Stendhal.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Maupassant — Bel-Ami
  // ───────────────────────────────────────────────────────────────────────
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
  // ───────────────────────────────────────────────────────────────────────
  // Voltaire — Candide
  // ───────────────────────────────────────────────────────────────────────
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
  // ───────────────────────────────────────────────────────────────────────
  // Balzac — Le Père Goriot (3 capsules : Comédie humaine en 3 entrées)
  // ───────────────────────────────────────────────────────────────────────
  "pere-goriot": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "HONORÉ DE BALZAC / LE PÈRE GORIOT / LA P'TITE LIBRAIRIE",
      youtubeId: "e3yyE1qf4x0",
      durationMin: 3,
      year: 2023,
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "HONORÉ DE BALZAC / ILLUSIONS PERDUES / LA P'TITE LIBRAIRIE",
      youtubeId: "BzGt_AnR2oU",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le grand roman parisien de Balzac — Lucien de Rubempré, le journalisme corrompu, suite logique du Père Goriot.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "HONORÉ DE BALZAC / LA PEAU DE CHAGRIN / LA P'TITE LIBRAIRIE",
      youtubeId: "xXDfjK_rCyo",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le fantastique chez Balzac — un talisman qui rétrécit à chaque désir exaucé. Le pacte faustien revisité Restauration.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Proust — Du côté de chez Swann
  // ───────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────
  // Proust — Du côté de chez Swann
  // Note 1er mai 2026 : la capsule originale (Y917qR3YgXA) a été retirée
  // de la chaîne. On garde le slot avec deux capsules sur les
  // contemporains modernistes de Proust (Faulkner, Joyce) en attendant
  // qu'une capsule sur Proust lui-même soit republiée.
  // ─────────────────────────────────────────────────────────────────────
  swann: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "WILLIAM FAULKNER / LE BRUIT ET LA FUREUR / LA P'TITE LIBRAIRIE",
      youtubeId: "2qure5y8cUQ",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le moderniste américain qui invente le stream-of-consciousness — contemporain et héritier indirect de la Recherche.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "JAMES JOYCE / GENS DE DUBLIN / LA P'TITE LIBRAIRIE",
      youtubeId: "nNXyuM51MGE",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Joyce, l'autre face de la révolution moderniste de 1922 — pendant que Proust achève la Recherche, Joyce livre Ulysse.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Céline — Voyage au bout de la nuit
  // ───────────────────────────────────────────────────────────────────────
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
  // ───────────────────────────────────────────────────────────────────────
  // Hugo — Notre-Dame de Paris (capsule sur Misérables + Chateaubriand)
  // ───────────────────────────────────────────────────────────────────────
  "notre-dame": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "VICTOR HUGO / LES MISÉRABLES / LA P'TITE LIBRAIRIE",
      youtubeId: "__w1gwpPg9A",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Pas de capsule sur Notre-Dame de Paris à ce jour ; voici Busnel sur Les Misérables, autre roman du même auteur — utile pour saisir le geste hugolien.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "CHATEAUBRIAND / MÉMOIRES D'OUTRE-TOMBE / LA P'TITE LIBRAIRIE",
      youtubeId: "Q6OIkRWuhZE",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le grand contemporain romantique de Hugo — Chateaubriand voit s'effondrer un monde, Hugo refait celui d'avant la cathédrale.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Laclos — Les Liaisons dangereuses (4 capsules contemporaines XVIIIe)
  // Pas de capsule directe sur Laclos à ce jour ; on lie vers les grands
  // contemporains et héritiers (psychologie, marivaudage, philo des Lumières).
  // ───────────────────────────────────────────────────────────────────────
  liaisons: [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "MADAME DE LAFAYETTE / LA PRINCESSE DE CLÈVES / LA P'TITE LIBRAIRIE",
      youtubeId: "tgYGQLQp184",
      durationMin: 3,
      year: 2023,
      relationNote:
        "L'autre grand roman psychologique français — Mme de Lafayette pose le canevas que Laclos perfectionne un siècle plus tard.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "MARIVAUX / LA DOUBLE INCONSTANCE / LA P'TITE LIBRAIRIE",
      youtubeId: "XsIlzvMvk5c",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le marivaudage — manipulation des sentiments à la cour, contemporaine de Laclos, mais en comédie.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "MADAME DU CHÂTELET / L'ART D'ÊTRE HEUREUX / LA P'TITE LIBRAIRIE",
      youtubeId: "I-dDeDpeL80",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Voix philosophique féminine du XVIIIe — l'amante de Voltaire pense le bonheur à l'âge de Merteuil.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title:
        "JEAN-JACQUES ROUSSEAU / LES RÊVERIES DU PROMENEUR SOLITAIRE / LA P'TITE LIBRAIRIE",
      youtubeId: "_5k0eSuBrdc",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Rousseau, contemporain immédiat de Laclos — versant intime et solitaire de la même époque qui produit les Liaisons.",
    },
  ],
  // ───────────────────────────────────────────────────────────────────────
  // Baudelaire — Les Fleurs du Mal (4 capsules — postérité poétique)
  // Pas de capsule directe sur Baudelaire à ce jour ; on convoque ses
  // héritiers immédiats (Rimbaud, Apollinaire) et une précurseure
  // (Desbordes-Valmore, que Baudelaire admirait).
  // ───────────────────────────────────────────────────────────────────────
  "fleurs-mal": [
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "ARTHUR RIMBAUD / UNE SAISON EN ENFER / LA P'TITE LIBRAIRIE",
      youtubeId: "8Gt1QX2oL4Q",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le poète qui prend le relais de Baudelaire — la saison en enfer comme suite logique des Fleurs du Mal.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "GUILLAUME APOLLINAIRE / ALCOOLS / LA P'TITE LIBRAIRIE",
      youtubeId: "tApFWSOceGM",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Modernisme poétique post-Baudelaire — Apollinaire fait éclater la ponctuation, garde le spleen.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title:
        "MARCELINE DESBORDES-VALMORE / POÉSIES / LA P'TITE LIBRAIRIE",
      youtubeId: "5u_8p2Yf6hM",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Précurseure que Baudelaire admirait explicitement (préface des Fleurs du Mal) — la première voix lyrique féminine moderne en français.",
    },
    {
      source: "p-tite-librairie",
      presenter: "busnel",
      title: "COLETTE / SIDO / LA P'TITE LIBRAIRIE",
      youtubeId: "3MuiMEbVn44",
      durationMin: 3,
      year: 2023,
      relationNote:
        "Le sensible et le matériel selon Colette — un autre régime poétique en prose, à mille lieues du spleen baudelairien.",
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
