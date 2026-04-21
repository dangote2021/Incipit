// Corpus étendu pour le quiz "Devine l'incipit".
//
// Les 12 BOOKS éditorialisés restent la colonne vertébrale du feed (pitches,
// passages clés, fiches personnages). Le quiz, lui, tire dans un corpus plus
// large pour que :
// — un lecteur exigeant ne connaisse pas déjà les 12 par cœur
// — l'app couvre aussi le lycée et le collège (La Fontaine, Molière, Sagan…)
// — on introduise poésie, théâtre et XXe siècle plus récent
//
// Tous les incipits sont dans le domaine public OU cités brièvement
// (fair use court extrait) pour les œuvres encore sous droits. Longueur
// volontairement courte pour éviter toute reproduction substantielle.

export type QuizLevel = "easy" | "medium" | "hard";

export type QuizIncipit = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  openingLines: string;
  level: QuizLevel;
  // hook court pour le corrigé
  hook: string;
};

export const QUIZ_INCIPITS: QuizIncipit[] = [
  // ═══════════════ EASY — incipits hyper-connus ═══════════════
  {
    id: "q-etranger",
    title: "L'Étranger",
    author: "Albert Camus",
    year: 1942,
    genre: "roman",
    openingLines:
      "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas.",
    level: "easy",
    hook: "La phrase-choc de l'absurde. Meursault ouvre la littérature moderne.",
  },
  {
    id: "q-bovary",
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    year: 1857,
    genre: "roman",
    openingLines:
      "Nous étions à l'Étude, quand le Proviseur entra, suivi d'un nouveau habillé en bourgeois.",
    level: "easy",
    hook: "Le « nous » énigmatique qui disparaîtra. Un incipit-piège.",
  },
  {
    id: "q-recherche",
    title: "Du côté de chez Swann",
    author: "Marcel Proust",
    year: 1913,
    genre: "roman",
    openingLines:
      "Longtemps, je me suis couché de bonne heure.",
    level: "easy",
    hook: "Sept mots qui ouvrent 3 000 pages. La matrice de toute la Recherche.",
  },
  {
    id: "q-candide",
    title: "Candide",
    author: "Voltaire",
    year: 1759,
    genre: "conte philosophique",
    openingLines:
      "Il y avait en Westphalie, dans le château de Monsieur le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces.",
    level: "easy",
    hook: "Conte cruel maquillé en conte de fées. Voltaire arme l'ironie.",
  },
  {
    id: "q-petit-prince",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    year: 1943,
    genre: "conte",
    openingLines:
      "Lorsque j'avais six ans j'ai vu, une fois, une magnifique image, dans un livre sur la forêt vierge qui s'appelait Histoires vécues.",
    level: "easy",
    hook: "L'adulte qui se souvient de l'enfant qu'il a été. Universel.",
  },
  {
    id: "q-peste",
    title: "La Peste",
    author: "Albert Camus",
    year: 1947,
    genre: "roman",
    openingLines:
      "Les curieux événements qui font le sujet de cette chronique se sont produits en 194., à Oran.",
    level: "easy",
    hook: "Une épidémie dans une ville fermée. L'Algérie en allégorie du mal.",
  },
  {
    id: "q-bonjour-tristesse",
    title: "Bonjour tristesse",
    author: "Françoise Sagan",
    year: 1954,
    genre: "roman",
    openingLines:
      "Sur ce sentiment inconnu dont l'ennui, la douceur m'obsèdent, j'hésite à apposer le nom, le beau nom grave de tristesse.",
    level: "easy",
    hook: "18 ans, un été sur la Côte d'Azur, une tragédie qu'on couve. Sagan avait 18 ans aussi.",
  },

  // ═══════════════ MEDIUM — classiques standards ═══════════════
  {
    id: "q-rouge-noir",
    title: "Le Rouge et le Noir",
    author: "Stendhal",
    year: 1830,
    genre: "roman",
    openingLines:
      "La petite ville de Verrières peut passer pour l'une des plus jolies de la Franche-Comté.",
    level: "medium",
    hook: "Julien Sorel. L'ambition érigée en art. Le XIXe vu d'en bas.",
  },
  {
    id: "q-germinal",
    title: "Germinal",
    author: "Émile Zola",
    year: 1885,
    genre: "roman",
    openingLines:
      "Dans la plaine rase, sous la nuit sans étoiles, d'une obscurité et d'une épaisseur d'encre, un homme suivait seul la grande route de Marchiennes à Montsou.",
    level: "medium",
    hook: "Descente aux enfers miniers. Zola avec une lampe de mineur.",
  },
  {
    id: "q-notre-dame",
    title: "Notre-Dame de Paris",
    author: "Victor Hugo",
    year: 1831,
    genre: "roman",
    openingLines:
      "Il y a aujourd'hui trois cent quarante-huit ans six mois et dix-neuf jours que les Parisiens s'éveillèrent au bruit de toutes les cloches sonnant à grande volée.",
    level: "medium",
    hook: "Paris médiéval comme personnage principal. Avant Quasimodo, il y a la ville.",
  },
  {
    id: "q-pere-goriot",
    title: "Le Père Goriot",
    author: "Honoré de Balzac",
    year: 1835,
    genre: "roman",
    openingLines:
      "Madame Vauquer, née de Conflans, est une vieille femme qui, depuis quarante ans, tient à Paris une pension bourgeoise.",
    level: "medium",
    hook: "Le Roi Lear parisien. Un père qui donne tout, des filles qui oublient.",
  },
  {
    id: "q-bel-ami",
    title: "Bel-Ami",
    author: "Guy de Maupassant",
    year: 1885,
    genre: "roman",
    openingLines:
      "Quand la caissière lui eut rendu la monnaie de sa pièce de cent sous, Georges Duroy sortit du restaurant.",
    level: "medium",
    hook: "L'ascension d'un arriviste à Paris. L'ambition sans morale.",
  },
  {
    id: "q-liaisons",
    title: "Les Liaisons dangereuses",
    author: "Choderlos de Laclos",
    year: 1782,
    genre: "roman épistolaire",
    openingLines:
      "Vous voyez, ma bonne amie, que je vous tiens parole, et que les bonnets et les pompons ne prennent pas tout mon temps.",
    level: "medium",
    hook: "Deux libertins orchestrent la perte des innocents. Par lettres.",
  },
  {
    id: "q-voyage",
    title: "Voyage au bout de la nuit",
    author: "Louis-Ferdinand Céline",
    year: 1932,
    genre: "roman",
    openingLines:
      "Ça a débuté comme ça. Moi, j'avais jamais rien dit. Rien.",
    level: "medium",
    hook: "Céline invente une langue : l'argot hissé au rang de littérature.",
  },
  {
    id: "q-fleurs-mal",
    title: "Les Fleurs du Mal",
    author: "Charles Baudelaire",
    year: 1857,
    genre: "poésie",
    openingLines:
      "La sottise, l'erreur, le péché, la lésine, occupent nos esprits et travaillent nos corps.",
    level: "medium",
    hook: "Au Lecteur : Baudelaire t'insulte et te tend la main.",
  },
  {
    id: "q-boule-suif",
    title: "Boule de Suif",
    author: "Guy de Maupassant",
    year: 1880,
    genre: "nouvelle",
    openingLines:
      "Pendant plusieurs jours de suite des lambeaux d'armée en déroute avaient traversé la ville.",
    level: "medium",
    hook: "Guerre de 1870. Une prostituée sacrifiée par des « honnêtes gens ».",
  },
  {
    id: "q-misérables",
    title: "Les Misérables",
    author: "Victor Hugo",
    year: 1862,
    genre: "roman",
    openingLines:
      "En 1815, M. Charles-François-Bienvenu Myriel était évêque de Digne.",
    level: "medium",
    hook: "Avant Jean Valjean, il y a l'évêque. Le roman commence par un saint.",
  },
  {
    id: "q-dangereux",
    title: "Le Grand Meaulnes",
    author: "Alain-Fournier",
    year: 1913,
    genre: "roman",
    openingLines:
      "Il arriva chez nous un dimanche de novembre 189…",
    level: "medium",
    hook: "L'adolescence comme paradis perdu. Un domaine mystérieux, une fête, une disparition.",
  },
  {
    id: "q-tartuffe",
    title: "Tartuffe",
    author: "Molière",
    year: 1664,
    genre: "théâtre",
    openingLines:
      "Allons, Flipote, allons, que d'eux je me délivre.",
    level: "medium",
    hook: "Madame Pernelle entre en trombe. La pièce qu'on a interdite à sa création.",
  },
  {
    id: "q-cid",
    title: "Le Cid",
    author: "Pierre Corneille",
    year: 1637,
    genre: "théâtre",
    openingLines:
      "Elvire, m'as-tu fait un rapport bien sincère ? Ne déguises-tu rien de ce qu'a dit mon père ?",
    level: "medium",
    hook: "Tragédie ? Tragi-comédie ? La querelle qui a fondé la règle des trois unités.",
  },

  // ═══════════════ HARD — pointus / moins connus ═══════════════
  {
    id: "q-nadja",
    title: "Nadja",
    author: "André Breton",
    year: 1928,
    genre: "récit",
    openingLines:
      "Qui suis-je ? Si par exception je m'en rapportais à un adage : en effet pourquoi tout ne reviendrait-il pas à savoir qui je hante ?",
    level: "hard",
    hook: "Breton et la folie d'une femme rencontrée dans la rue. Le surréalisme autobiographique.",
  },
  {
    id: "q-ecume",
    title: "L'Écume des jours",
    author: "Boris Vian",
    year: 1947,
    genre: "roman",
    openingLines:
      "Colin terminait sa toilette. Il s'était enveloppé, au sortir du bain, dans une ample serviette de tissu bouclé.",
    level: "hard",
    hook: "Une fleur pousse dans le poumon de Chloé. L'amour étranglé par le réel.",
  },
  {
    id: "q-manon",
    title: "Manon Lescaut",
    author: "Abbé Prévost",
    year: 1731,
    genre: "roman",
    openingLines:
      "Je suis obligé de faire remonter mon lecteur au temps de ma vie où je rencontrai pour la première fois le chevalier des Grieux.",
    level: "hard",
    hook: "La passion destructrice avant les romantiques. Des Grieux ruine tout par amour.",
  },
  {
    id: "q-princesse-cleves",
    title: "La Princesse de Clèves",
    author: "Madame de La Fayette",
    year: 1678,
    genre: "roman",
    openingLines:
      "La magnificence et la galanterie n'ont jamais paru en France avec tant d'éclat que dans les dernières années du règne de Henri second.",
    level: "hard",
    hook: "Premier roman moderne français. L'aveu qui ouvre la psychologie.",
  },
  {
    id: "q-gargantua",
    title: "Gargantua",
    author: "François Rabelais",
    year: 1534,
    genre: "roman",
    openingLines:
      "Buveurs très illustres, et vous, vérolés très précieux — car à vous, non à d'autres, sont dédiés mes écrits.",
    level: "hard",
    hook: "Rabelais s'adresse aux ivrognes et aux syphilitiques. La Renaissance rit fort.",
  },
  {
    id: "q-essais",
    title: "Les Essais",
    author: "Michel de Montaigne",
    year: 1580,
    genre: "essai",
    openingLines:
      "C'est ici un livre de bonne foi, lecteur.",
    level: "hard",
    hook: "Premier penseur à dire « je » en français. L'invention de la subjectivité.",
  },
  {
    id: "q-memoires-outre",
    title: "Mémoires d'outre-tombe",
    author: "François-René de Chateaubriand",
    year: 1849,
    genre: "mémoires",
    openingLines:
      "Depuis quatre ans que j'habite la Vallée-aux-Loups, avec quel charme n'ai-je pas écrit ces Mémoires !",
    level: "hard",
    hook: "Chateaubriand écrit sa vie pour la postérité. Fresque du XIXe naissant.",
  },
  {
    id: "q-bouvard",
    title: "Bouvard et Pécuchet",
    author: "Gustave Flaubert",
    year: 1881,
    genre: "roman",
    openingLines:
      "Comme il faisait une chaleur de 33 degrés, le boulevard Bourdon se trouvait absolument désert.",
    level: "hard",
    hook: "Deux copistes se lancent dans l'encyclopédie universelle. Le ratage comme système.",
  },
  {
    id: "q-salammbo",
    title: "Salammbô",
    author: "Gustave Flaubert",
    year: 1862,
    genre: "roman",
    openingLines:
      "C'était à Mégara, faubourg de Carthage, dans les jardins d'Hamilcar.",
    level: "hard",
    hook: "Flaubert en archéologue : Carthage reconstruite à la phrase près.",
  },
  {
    id: "q-fables",
    title: "Fables",
    author: "Jean de La Fontaine",
    year: 1668,
    genre: "poésie",
    openingLines:
      "La cigale, ayant chanté tout l'été, se trouva fort dépourvue quand la bise fut venue.",
    level: "easy",
    hook: "Le premier cours de morale déguisé en comptine. On l'a tous récité.",
  },
  {
    id: "q-chartreuse",
    title: "La Chartreuse de Parme",
    author: "Stendhal",
    year: 1839,
    genre: "roman",
    openingLines:
      "Le 15 mai 1796, le général Bonaparte fit son entrée dans Milan à la tête de cette jeune armée.",
    level: "hard",
    hook: "Waterloo vu du côté du perdant. Fabrice del Dongo dans le chaos.",
  },
  {
    id: "q-hernani",
    title: "Hernani",
    author: "Victor Hugo",
    year: 1830,
    genre: "théâtre",
    openingLines:
      "Serait-ce déjà lui ? C'est bien à l'escalier dérobé.",
    level: "hard",
    hook: "La bataille d'Hernani : romantiques contre classiques, à coups de poing.",
  },
  {
    id: "q-lorenzaccio",
    title: "Lorenzaccio",
    author: "Alfred de Musset",
    year: 1834,
    genre: "théâtre",
    openingLines:
      "Entrez dans cette allée ; et tenez-vous prêts. La voiture doit passer ici avant une heure.",
    level: "hard",
    hook: "Florence 1537. Un jeune homme fatigué de jouer les pervers finit par vraiment tuer.",
  },
  {
    id: "q-colomba",
    title: "Colomba",
    author: "Prosper Mérimée",
    year: 1840,
    genre: "nouvelle",
    openingLines:
      "Dans les premiers jours du mois d'octobre 181., le colonel sir Thomas Nevil, Irlandais, officier distingué de l'armée anglaise, descendit avec sa fille à l'hôtel Beauvau, à Marseille.",
    level: "hard",
    hook: "La Corse, la vendetta, l'honneur. Mérimée en ethnologue du Sud.",
  },
  {
    id: "q-adolphe",
    title: "Adolphe",
    author: "Benjamin Constant",
    year: 1816,
    genre: "roman",
    openingLines:
      "J'avais, à vingt-deux ans, terminé mes études à l'université de Göttingen.",
    level: "hard",
    hook: "Autopsie clinique d'une rupture. Le premier roman analytique moderne.",
  },
  {
    id: "q-thérèse-raquin",
    title: "Thérèse Raquin",
    author: "Émile Zola",
    year: 1867,
    genre: "roman",
    openingLines:
      "Au bout de la rue Guénégaud, lorsqu'on vient des quais, on trouve le passage du Pont-Neuf, une sorte de corridor étroit et sombre qui va de la rue Mazarine à la rue de Seine.",
    level: "hard",
    hook: "Avant Germinal, Zola teste le naturalisme sur un adultère criminel.",
  },
  {
    id: "q-dom-juan",
    title: "Dom Juan",
    author: "Molière",
    year: 1665,
    genre: "théâtre",
    openingLines:
      "Quoi que puisse dire Aristote et toute la philosophie, il n'est rien d'égal au tabac.",
    level: "hard",
    hook: "Sganarelle ouvre la pièce en éloge… du tabac. Molière commence toujours par une provocation.",
  },
  {
    id: "q-phedre",
    title: "Phèdre",
    author: "Jean Racine",
    year: 1677,
    genre: "théâtre",
    openingLines:
      "Le dessein en est pris, je pars, cher Théramène, et quitte le séjour de l'aimable Trézène.",
    level: "medium",
    hook: "« C'est Vénus toute entière à sa proie attachée ». Le sommet de la tragédie classique.",
  },
  {
    id: "q-antigone",
    title: "Antigone",
    author: "Jean Anouilh",
    year: 1944,
    genre: "théâtre",
    openingLines:
      "Voilà. Ces personnages vont vous jouer l'histoire d'Antigone.",
    level: "medium",
    hook: "Le Prologue parle au public. Sophocle relu sous l'Occupation.",
  },
  {
    id: "q-silence-mer",
    title: "Le Silence de la mer",
    author: "Vercors",
    year: 1942,
    genre: "nouvelle",
    openingLines:
      "Il fut précédé par un grand déploiement d'appareil militaire.",
    level: "hard",
    hook: "Un officier allemand loge chez un Français. Résistance par le silence.",
  },
  {
    id: "q-condition",
    title: "La Condition humaine",
    author: "André Malraux",
    year: 1933,
    genre: "roman",
    openingLines:
      "Tchen tenterait-il de lever la moustiquaire ? Frapperait-il au travers ?",
    level: "hard",
    hook: "Shanghai 1927. Un attentat, une heure, un choix. L'engagement comme condition.",
  },
];

export const BY_LEVEL: Record<QuizLevel, QuizIncipit[]> = {
  easy: QUIZ_INCIPITS.filter((q) => q.level === "easy"),
  medium: QUIZ_INCIPITS.filter((q) => q.level === "medium"),
  hard: QUIZ_INCIPITS.filter((q) => q.level === "hard"),
};

export const LEVEL_LABELS: Record<QuizLevel, { title: string; sub: string }> = {
  easy: {
    title: "Classiques du lycée",
    sub: "Les incipits qu'on a tous entendus au moins une fois.",
  },
  medium: {
    title: "Lecteur averti",
    sub: "Les standards du canon français, XIXe et XXe.",
  },
  hard: {
    title: "Rat de bibliothèque",
    sub: "Poésie, théâtre, classiques moins fréquentés.",
  },
};
