// ─────────────────────────────────────────────────────────────────────────────
// Cycle "Semaine de l'auteur" — chaque semaine ISO est dédiée à un auteur,
// avec une citation différente chaque jour de la semaine et, le dimanche,
// un lien vers une vidéo YouTube avec/sur cet auteur (entretien, lecture,
// reportage…).
//
// Objectif rétention (panel test in-app) : créer un rendez-vous
// hebdomadaire qui dépasse le cycle quotidien existant. Chaque dimanche,
// la "boucle" se referme avec la vidéo récapitulative et une nouvelle
// semaine commence avec un nouvel auteur — effet "ouverture du livre" /
// "feuilleton littéraire".
//
// Sélection des citations : domaine public ou citations courtes citables
// au titre du droit de citation (article L. 122-5, 3° a) — analyse,
// critique, illustration éditoriale, source identifiée, longueur très
// limitée par rapport à l'œuvre originale.
// ─────────────────────────────────────────────────────────────────────────────

import { dayOffset } from "./daily-content";

export type AuthorWeek = {
  /** Slug stable, sert d'id et d'URL (ex: 'kundera') */
  slug: string;
  /** Nom complet pour affichage (ex: 'Milan Kundera') */
  name: string;
  /** Une phrase de présentation pour la card (40-80 caractères) */
  tagline: string;
  /** Émoji discret pour signaler visuellement l'auteur */
  emoji: string;
  /** 7 citations, une par jour de la semaine (lundi=0 ... dimanche=6) */
  quotes: { text: string; source?: string }[];
  /** Vidéo YouTube à dévoiler le dimanche */
  youtube: {
    /** URL canonique YouTube (watch?v=…) */
    url: string;
    /** Titre exact de la vidéo (attribution) */
    title: string;
    /** Source / chaîne (INA, France Culture, La Grande Librairie, etc.) */
    source: string;
    /** Durée approximative en minutes (indicatif) */
    durationMin?: number;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Pool des semaines d'auteurs. Cycle qui se rejoue indéfiniment — on
// indexe l'auteur courant via dayOffset() % WEEKLY_AUTHORS.length.
// On peut ajouter un auteur à tout moment, le cycle l'absorbe au prochain
// roulement.
// ─────────────────────────────────────────────────────────────────────────────
export const WEEKLY_AUTHORS: AuthorWeek[] = [
  // ─── KUNDERA — l'insoutenable légèreté de la pensée ──────────────────────
  {
    slug: "kundera",
    name: "Milan Kundera",
    tagline:
      "Le roman comme antidote à la bêtise des certitudes. 7 phrases pour la semaine.",
    emoji: "♟",
    quotes: [
      {
        text: "La lutte de l'homme contre le pouvoir, c'est la lutte de la mémoire contre l'oubli.",
        source: "Le Livre du rire et de l'oubli",
      },
      {
        text: "L'homme ne sait jamais ce qu'il doit vouloir car il n'a qu'une vie et il ne peut ni la comparer à des vies antérieures ni la rectifier dans des vies ultérieures.",
        source: "L'Insoutenable Légèreté de l'être",
      },
      {
        text: "Le kitsch est la négation absolue de la merde.",
        source: "L'Insoutenable Légèreté de l'être",
      },
      {
        text: "L'amitié est indispensable à l'homme pour le bon fonctionnement de sa mémoire.",
        source: "L'Identité",
      },
      {
        text: "Le roman n'examine pas la réalité mais l'existence. Et l'existence n'est pas ce qui s'est passé, l'existence est le champ des possibilités humaines.",
        source: "L'Art du roman",
      },
      {
        text: "La beauté est le dernier triomphe possible de l'homme qui ne peut plus rien espérer.",
        source: "La Lenteur",
      },
      {
        text: "Il n'y a pas de retour. Il n'y a que des reprises sans cesse différentes du même mouvement.",
        source: "L'Insoutenable Légèreté de l'être",
      },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=qB1QQp3RhBA",
      title: "Milan Kundera — Apostrophes (1984)",
      source: "INA / Apostrophes",
      durationMin: 7,
    },
  },

  // ─── TESSON — l'aventure littéraire et la haute solitude ─────────────────
  {
    slug: "tesson",
    name: "Sylvain Tesson",
    tagline:
      "L'écrivain marcheur. Sept jours, sept fragments d'altitude.",
    emoji: "🏔",
    quotes: [
      {
        text: "Une cabane est une promesse de paix.",
        source: "Dans les forêts de Sibérie",
      },
      {
        text: "Vivre, c'est savoir où s'asseoir.",
        source: "Dans les forêts de Sibérie",
      },
      {
        text: "L'orage approche. Je vais lui ouvrir.",
        source: "Une vie à coucher dehors",
      },
      {
        text: "On ne va pas en montagne pour fuir, on y va pour rejoindre quelque chose qu'on a perdu.",
        source: "La Panthère des neiges",
      },
      {
        text: "L'attente est une prière qui ne dit pas son nom.",
        source: "La Panthère des neiges",
      },
      {
        text: "Le voyageur qui se respecte se doit de fuir les sites trop courus.",
        source: "Petit traité sur l'immensité du monde",
      },
      {
        text: "L'aventure n'est pas dans le pittoresque, l'aventure est dans le décalage.",
        source: "Un été avec Homère",
      },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=eShgqPWrJaw",
      title: "Sylvain Tesson — La Grande Librairie (2019)",
      source: "France 5 / La Grande Librairie",
      durationMin: 12,
    },
  },

  // ─── KESSEL — le journalisme comme matière du roman ─────────────────────
  {
    slug: "kessel",
    name: "Joseph Kessel",
    tagline:
      "Reporter, romancier, académicien. La vie comme un grand livre ouvert.",
    emoji: "✈",
    quotes: [
      {
        text: "Il n'y a pas de poison plus subtil ni plus assuré que celui d'une habitude longtemps recherchée et qui rattrape.",
        source: "Belle de jour",
      },
      {
        text: "L'amitié n'est pas un sentiment de l'âme. C'est un climat.",
        source: "Le Lion",
      },
      {
        text: "Il n'est rien de pareil au courage des bêtes lorsqu'elles savent qu'on va leur faire mal.",
        source: "Le Lion",
      },
      {
        text: "Vivre la vraie vie, c'est ne reculer devant aucune chose qu'elle propose.",
        source: "Les Cavaliers",
      },
      {
        text: "Le danger fait partie du prix de la liberté.",
        source: "Le Chant des partisans (texte d'introduction)",
      },
      {
        text: "Un grand reporter est un petit homme qui voit grand.",
        source: "discours à l'Académie française, 1964",
      },
      {
        text: "Quand on aime un pays, on a envie qu'il soit immortel, comme une femme.",
        source: "Hong-Kong et Macao",
      },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=k_2Wv9_Vw3M",
      title: "Joseph Kessel — Le Lion / portrait (INA archive)",
      source: "INA",
      durationMin: 8,
    },
  },
];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Retourne l'auteur de la semaine en cours, calé sur l'epoch interne.
 * Stable pour toute la semaine, déterministe SSR/client.
 */
export function currentWeekAuthor(now: Date = new Date()): AuthorWeek {
  const weekIndex = Math.floor(dayOffset(now) / 7);
  const i = ((weekIndex % WEEKLY_AUTHORS.length) + WEEKLY_AUTHORS.length) % WEEKLY_AUTHORS.length;
  return WEEKLY_AUTHORS[i];
}

/**
 * Retourne l'index 0..6 du jour dans la semaine en cours (lundi=0,
 * dimanche=6). On utilise le jour ISO européen — pas le getDay() US qui
 * met dimanche=0.
 */
export function dayInWeek(now: Date = new Date()): number {
  const day = now.getUTCDay(); // 0 dim, 1 lun ... 6 sam
  return (day + 6) % 7;        // 0 lun, 1 mar ... 6 dim
}

/**
 * Citation du jour pour l'auteur de la semaine. Si on est dimanche
 * (dayInWeek === 6), on retourne aussi la vidéo à dévoiler.
 */
export function quoteOfTheDay(now: Date = new Date()): {
  author: AuthorWeek;
  dayIndex: number;
  quote: { text: string; source?: string };
  youtubeRevealed: boolean;
} {
  const author = currentWeekAuthor(now);
  const dayIndex = dayInWeek(now);
  const quote = author.quotes[Math.min(dayIndex, author.quotes.length - 1)];
  return {
    author,
    dayIndex,
    quote,
    youtubeRevealed: dayIndex === 6,
  };
}

/** Nom des jours pour affichage UI (lun=0 ... dim=6) */
export const DAY_LABELS_FR = [
  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche",
];
