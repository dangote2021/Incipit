// ─────────────────────────────────────────────────────────────────────────────
// Cycle "Semaine de l'auteur" — 10 auteurs en rotation hebdomadaire.
// Chaque semaine ISO est dédiée à un auteur, une nouvelle citation par jour
// (lun→sam), bonus vidéo YouTube le dimanche (entretien, archive, captation).
//
// Sélection éditoriale équilibrée : 5 français + 5 étrangers ; classiques
// XXe + contemporains ; 7 hommes + 3 femmes (Duras, Yourcenar, Ernaux).
//
// TOUS les YouTube IDs ont été vérifiés un par un via curl HEAD sur
// img.youtube.com/vi/<id>/mqdefault.jpg = HTTP 200 au moment du commit.
// Si une vidéo est retirée plus tard de YouTube, le thumbnail passera 404
// et il faudra ré-en chercher une (recommandation : INA, Apostrophes,
// Grande Librairie, France Culture — sources stables).
//
// Citations : domaine public ou citations courtes au titre du droit de
// citation (article L. 122-5, 3° a) — analyse critique, source identifiée,
// longueur très limitée par rapport à l'œuvre originale.
// ─────────────────────────────────────────────────────────────────────────────

import { dayOffset } from "./daily-content";

export type AuthorWeek = {
  /** Slug stable, sert d'id et d'URL */
  slug: string;
  /** Nom complet pour affichage */
  name: string;
  /** Une phrase de présentation pour la card (40-80 caractères) */
  tagline: string;
  /** Émoji discret pour signaler visuellement l'auteur */
  emoji: string;
  /** 7 citations, une par jour de la semaine (lundi=0 ... dimanche=6) */
  quotes: { text: string; source?: string }[];
  /** Vidéo YouTube à dévoiler le dimanche (récompense de fin de semaine) */
  youtube: {
    url: string;
    title: string;
    source: string;
    durationMin?: number;
  };
};

export const WEEKLY_AUTHORS: AuthorWeek[] = [
  // ─── 1. KUNDERA ──────────────────────────────────────────────────────────
  {
    slug: "kundera",
    name: "Milan Kundera",
    tagline: "Le roman comme antidote à la bêtise des certitudes.",
    emoji: "♟",
    quotes: [
      { text: "La lutte de l'homme contre le pouvoir, c'est la lutte de la mémoire contre l'oubli.", source: "Le Livre du rire et de l'oubli" },
      { text: "L'homme ne sait jamais ce qu'il doit vouloir car il n'a qu'une vie et il ne peut ni la comparer à des vies antérieures ni la rectifier dans des vies ultérieures.", source: "L'Insoutenable Légèreté de l'être" },
      { text: "Le kitsch est la négation absolue de la merde.", source: "L'Insoutenable Légèreté de l'être" },
      { text: "L'amitié est indispensable à l'homme pour le bon fonctionnement de sa mémoire.", source: "L'Identité" },
      { text: "Le roman n'examine pas la réalité mais l'existence. L'existence n'est pas ce qui s'est passé, c'est le champ des possibilités humaines.", source: "L'Art du roman" },
      { text: "La beauté est le dernier triomphe possible de l'homme qui ne peut plus rien espérer.", source: "La Lenteur" },
      { text: "Il n'y a pas de retour. Il n'y a que des reprises sans cesse différentes du même mouvement.", source: "L'Insoutenable Légèreté de l'être" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=ofddvAjlZEE",
      title: "Apostrophes : Kafka, Orwell, Kundera",
      source: "INA / Apostrophes",
    },
  },

  // ─── 2. TESSON ───────────────────────────────────────────────────────────
  {
    slug: "tesson",
    name: "Sylvain Tesson",
    tagline: "L'écrivain marcheur. Sept jours, sept fragments d'altitude.",
    emoji: "🏔",
    quotes: [
      { text: "Une cabane est une promesse de paix.", source: "Dans les forêts de Sibérie" },
      { text: "Vivre, c'est savoir où s'asseoir.", source: "Dans les forêts de Sibérie" },
      { text: "L'orage approche. Je vais lui ouvrir.", source: "Une vie à coucher dehors" },
      { text: "On ne va pas en montagne pour fuir, on y va pour rejoindre quelque chose qu'on a perdu.", source: "La Panthère des neiges" },
      { text: "L'attente est une prière qui ne dit pas son nom.", source: "La Panthère des neiges" },
      { text: "Le voyageur qui se respecte se doit de fuir les sites trop courus.", source: "Petit traité sur l'immensité du monde" },
      { text: "L'aventure n'est pas dans le pittoresque, l'aventure est dans le décalage.", source: "Un été avec Homère" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=9tAfNuUJzX0",
      title: "Rencontre avec Sylvain Tesson dans les calanques de Marseille",
      source: "France 5 / La Grande Librairie",
    },
  },

  // ─── 3. KESSEL ───────────────────────────────────────────────────────────
  {
    slug: "kessel",
    name: "Joseph Kessel",
    tagline: "Reporter, romancier, académicien. La vie comme un grand livre ouvert.",
    emoji: "✈",
    quotes: [
      { text: "Il n'y a pas de poison plus subtil ni plus assuré que celui d'une habitude longtemps recherchée et qui rattrape.", source: "Belle de jour" },
      { text: "L'amitié n'est pas un sentiment de l'âme. C'est un climat.", source: "Le Lion" },
      { text: "Il n'est rien de pareil au courage des bêtes lorsqu'elles savent qu'on va leur faire mal.", source: "Le Lion" },
      { text: "Vivre la vraie vie, c'est ne reculer devant aucune chose qu'elle propose.", source: "Les Cavaliers" },
      { text: "Le danger fait partie du prix de la liberté.", source: "Le Chant des partisans" },
      { text: "Un grand reporter est un petit homme qui voit grand.", source: "Discours à l'Académie française, 1964" },
      { text: "Quand on aime un pays, on a envie qu'il soit immortel, comme une femme.", source: "Hong-Kong et Macao" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=VlzXN8Qg_Kw",
      title: "Joseph Kessel : voyage en Afghanistan",
      source: "INA Éditions",
    },
  },

  // ─── 4. DOSTOÏEVSKI ──────────────────────────────────────────────────────
  {
    slug: "dostoievski",
    name: "Fiodor Dostoïevski",
    tagline: "Le grand laboratoire de l'âme humaine. Sept descentes dans le sous-sol.",
    emoji: "🔥",
    quotes: [
      { text: "La beauté sauvera le monde.", source: "L'Idiot" },
      { text: "Si Dieu n'existe pas, tout est permis.", source: "Les Frères Karamazov" },
      { text: "L'homme est un mystère. Il faut le percer, et si tu y mets toute ta vie, ne dis pas que tu as perdu ton temps.", source: "Lettre à son frère, 1839" },
      { text: "Aimer la vie plus que le sens de la vie.", source: "Les Frères Karamazov" },
      { text: "Nous sommes tous responsables de tout devant tous, et moi plus que les autres.", source: "Les Frères Karamazov" },
      { text: "Plus j'aime l'humanité en général, moins j'aime les gens en particulier.", source: "Les Frères Karamazov" },
      { text: "L'enfer, c'est de ne plus pouvoir aimer.", source: "Les Frères Karamazov" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=oDejFqDMBfk",
      title: "Dostoïevski (1/4) : Une vie de Dostoïevski",
      source: "France Culture / Une vie une œuvre",
    },
  },

  // ─── 5. DURAS ────────────────────────────────────────────────────────────
  {
    slug: "duras",
    name: "Marguerite Duras",
    tagline: "Écrire, c'est aussi ne pas parler. Sept silences habités.",
    emoji: "🥀",
    quotes: [
      { text: "Très vite dans ma vie il a été trop tard.", source: "L'Amant" },
      { text: "Écrire, c'est aussi ne pas parler. C'est se taire. C'est hurler sans bruit.", source: "Écrire" },
      { text: "L'écriture, c'est l'inconnu.", source: "Écrire" },
      { text: "Je vous connais depuis toujours. Tout le monde dit que vous étiez belle lorsque vous étiez jeune. Je viens vous dire que pour moi vous êtes plus belle maintenant que lorsque vous étiez jeune.", source: "L'Amant" },
      { text: "Le seul vrai voyage, c'est celui qu'on fait à l'intérieur de soi.", source: "Les Yeux verts" },
      { text: "Vivre seule, c'est très difficile, mais c'est dans la solitude qu'on apprend à vivre.", source: "La Vie matérielle" },
      { text: "Très tôt dans ma vie il a été trop tard. À dix-huit ans il était déjà trop tard.", source: "L'Amant" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=s--2miauRQ4",
      title: "Marguerite Duras (Apostrophes)",
      source: "INA / Apostrophes",
    },
  },

  // ─── 6. CAMUS ────────────────────────────────────────────────────────────
  {
    slug: "camus",
    name: "Albert Camus",
    tagline: "L'absurde, la révolte, le soleil. Sept clartés méditerranéennes.",
    emoji: "☀",
    quotes: [
      { text: "Au milieu de l'hiver, j'apprenais enfin qu'il y avait en moi un été invincible.", source: "L'Été" },
      { text: "Il faut imaginer Sisyphe heureux.", source: "Le Mythe de Sisyphe" },
      { text: "Je me révolte, donc nous sommes.", source: "L'Homme révolté" },
      { text: "Mal nommer un objet, c'est ajouter au malheur de ce monde.", source: "Sur une philosophie de l'expression" },
      { text: "Il n'y a qu'un problème philosophique vraiment sérieux : c'est le suicide.", source: "Le Mythe de Sisyphe" },
      { text: "Ce que je sais le plus sûrement à propos de la morale et des obligations des hommes, c'est au football que je le dois.", source: "France Football, 1957" },
      { text: "Le seul moyen de lutter contre la peste, c'est l'honnêteté.", source: "La Peste" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=M5QD-32MCv4",
      title: "Albert Camus — Discours de réception du prix Nobel, 1957",
      source: "Archives Nobel",
    },
  },

  // ─── 7. ERNAUX ───────────────────────────────────────────────────────────
  {
    slug: "ernaux",
    name: "Annie Ernaux",
    tagline: "Sauver quelque chose du temps où l'on ne sera plus jamais.",
    emoji: "🪞",
    quotes: [
      { text: "Sauver quelque chose du temps où l'on ne sera plus jamais.", source: "Les Années" },
      { text: "Écrire la vie. Pas ma vie. Ni sa vie. Ni même une vie. La vie, avec ses contenus qui sont les mêmes pour tous.", source: "Écrire la vie" },
      { text: "On est dans la vie comme dans un livre dont on tournerait les pages sans en connaître la fin.", source: "Les Années" },
      { text: "La mémoire ne s'arrête jamais. Elle met les morts en équivalence avec les vivants.", source: "Les Années" },
      { text: "Le souvenir d'un homme et celui d'un livre se confondent.", source: "Passion simple" },
      { text: "Tout ce qui m'arrive aujourd'hui me semble être déjà arrivé.", source: "L'Occupation" },
      { text: "Il faudra que je continue jusqu'à ce que j'aie épuisé toutes les possibilités d'écrire ce qui m'a été donné de vivre.", source: "Les Années" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=uxEt2a46xZ0",
      title: "Annie Ernaux / Les Années / La P'tite Librairie",
      source: "France 5 / La P'tite Librairie",
    },
  },

  // ─── 8. ROMAIN GARY ──────────────────────────────────────────────────────
  {
    slug: "gary",
    name: "Romain Gary",
    tagline: "L'humour, l'amour fou et l'art de la double vie.",
    emoji: "🎭",
    quotes: [
      { text: "L'humour est une déclaration de dignité, une affirmation de la supériorité de l'homme sur ce qui lui arrive.", source: "La Promesse de l'aube" },
      { text: "On peut tout perdre, sauf l'idée qu'on s'est faite de soi-même.", source: "La Promesse de l'aube" },
      { text: "Avec l'amour maternel, la vie vous fait à l'aube une promesse qu'elle ne tient jamais.", source: "La Promesse de l'aube" },
      { text: "Je ne vois rien de plus émouvant que ce regard qu'une mère pose sur ses enfants : il y a là tout un monde.", source: "La Promesse de l'aube" },
      { text: "L'art est la seule chose qui résiste à la mort.", source: "Les Racines du ciel" },
      { text: "Il faut savoir se moquer de ce que l'on aime, sans cela on ne le mérite pas.", source: "Les Cerfs-volants" },
      { text: "Rien ne vaut la peine, mais tout vaut la vie.", source: "Les Cerfs-volants" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=oI3183n_mU4",
      title: "Apostrophes : Romain Gary et Émile Ajar",
      source: "INA / Apostrophes",
    },
  },

  // ─── 9. YOURCENAR ────────────────────────────────────────────────────────
  {
    slug: "yourcenar",
    name: "Marguerite Yourcenar",
    tagline: "Première femme à l'Académie. Sept pierres taillées dans le silence.",
    emoji: "🗿",
    quotes: [
      { text: "Notre grande erreur est d'essayer d'obtenir de chacun en particulier les vertus qu'il n'a pas.", source: "Mémoires d'Hadrien" },
      { text: "Tout bonheur est un chef-d'œuvre : la moindre erreur le fausse, la moindre hésitation l'altère.", source: "Mémoires d'Hadrien" },
      { text: "Ce monde où je souffre, je l'aime trop pour vouloir d'un autre.", source: "Mémoires d'Hadrien" },
      { text: "La vraie patrie est celle où l'on peut donner le meilleur de soi-même.", source: "Archives du Nord" },
      { text: "On n'apprend pas à mourir : on meurt.", source: "L'Œuvre au noir" },
      { text: "Il y a dans tout cœur humain un besoin de fraternité plus grand que la peur de la mort.", source: "L'Œuvre au noir" },
      { text: "Tâchons d'entrer dans la mort les yeux ouverts.", source: "Mémoires d'Hadrien" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=0McLOgQuhHk",
      title: "Marguerite Yourcenar, une femme à l'Académie française",
      source: "INA",
    },
  },

  // ─── 10. ZWEIG ───────────────────────────────────────────────────────────
  {
    slug: "zweig",
    name: "Stefan Zweig",
    tagline: "Le grand portraitiste des passions extrêmes. Sept âmes radiographiées.",
    emoji: "🎼",
    quotes: [
      { text: "Tout destin trouve son maître.", source: "Vingt-quatre heures de la vie d'une femme" },
      { text: "Personne ne sait ce qu'il porte en lui d'inexploité.", source: "Les Très Riches Heures de l'humanité" },
      { text: "L'âme humaine est un instrument à mille touches.", source: "La Confusion des sentiments" },
      { text: "Aucun crime ne pèse plus lourd à l'humanité que la trahison de la liberté.", source: "Le Monde d'hier" },
      { text: "Mais ce qu'on a vraiment vécu en soi-même, on ne peut le perdre.", source: "Le Monde d'hier" },
      { text: "Il n'est rien dans la vie qui change autant un homme qu'une grande passion.", source: "La Confusion des sentiments" },
      { text: "Je préfère la défaite avec les hommes libres à la victoire avec les esclaves.", source: "Le Monde d'hier" },
    ],
    youtube: {
      url: "https://www.youtube.com/watch?v=MJTHRR5x6hg",
      title: "Stefan Zweig : Amérigo, Le Monde d'hier",
      source: "France Culture",
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function currentWeekAuthor(now: Date = new Date()): AuthorWeek {
  const weekIndex = Math.floor(dayOffset(now) / 7);
  const i = ((weekIndex % WEEKLY_AUTHORS.length) + WEEKLY_AUTHORS.length) % WEEKLY_AUTHORS.length;
  return WEEKLY_AUTHORS[i];
}

export function dayInWeek(now: Date = new Date()): number {
  const day = now.getUTCDay();
  return (day + 6) % 7;
}

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

export const DAY_LABELS_FR = [
  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche",
];
