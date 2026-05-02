import type {
  Book,
  User,
  BookClub,
  FeedItem,
  ReadingNote,
  LibraryEntry,
  Quote,
  Challenge,
  Badge,
  Annotation,
  Recommendation,
  ReadingSession,
  BuddyRead,
  Librairie,
  RecapBlock,
  KeyPassage,
  Character,
  RapPunchline,
  RapEra,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// BOOKS
// Tous les pitches sont originaux, écrits pour Incipit — aucun emprunt à des
// sources tierces.
// Les premiers paragraphes (openingLines) sont des citations courtes des textes
// (droit de courte citation, art. L.122-5 CPI ; œuvres majoritairement tombées
// dans le domaine public).
// ─────────────────────────────────────────────────────────────────────────────

export const BOOKS: Book[] = [
  {
    id: "etranger",
    title: "L'Étranger",
    fullTitle: "L'Étranger",
    author: "Albert Camus",
    year: 1942,
    genre: "classique",
    pages: 186,
    cover: "from-amber-100 via-orange-200 to-yellow-300",
    hook: "Il a tué quelqu'un. On le juge pour ne pas avoir pleuré.",
    pitch:
      "Meursault enterre sa mère sans verser une larme. Le lendemain il se baigne, drague, va voir une comédie avec Fernandel. Puis, sur une plage d'Alger écrasée de soleil, il flingue un Arabe. Cinq balles. Au procès, tout le monde s'en tape du meurtre — ce qui dérange, c'est son absence totale d'émotions. L'absurde selon Camus : la société te condamne pour ce que tu ne ressens pas, pas pour ce que tu fais.",
    openingLines:
      "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. J'ai reçu un télégramme de l'asile : « Mère décédée. Enterrement demain. Sentiments distingués. » Cela ne veut rien dire. C'était peut-être hier.",
    signatureQuote: "Que m'importaient la mort des autres, l'amour d'une mère, que m'importaient son Dieu, les vies qu'on choisit, les destins qu'on élit.",
    themes: ["absurde", "solitude", "procès", "soleil"],
    vibe: "absurd",
    moods: ["metaphysique", "noir"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Gallimard, 1942 · Folio n°2 (1972)",
    historicalContext:
      "Paru en mai 1942, en pleine Occupation, chez Gallimard sous contrôle allemand (la maison continuait de publier avec accord de la censure). Camus a 29 ans, il est pied-noir, fragile de santé, et pose avec ce court roman une pierre centrale de l'« absurde » — cycle qu'il théorisera dans Le Mythe de Sisyphe la même année. Le livre deviendra, après-guerre, l'un des romans les plus lus du XXᵉ siècle francophone.",
    authorBio:
      "Albert Camus (1913-1960) est né dans une famille pauvre à Mondovi, en Algérie française. Orphelin de père à un an, élevé par une mère analphabète, il doit à un instituteur (Louis Germain) d'avoir poursuivi l'école.\n\nJournaliste engagé, résistant pendant la guerre (rédacteur en chef de Combat clandestin), il rompt retentissante avec Sartre en 1952 à propos du stalinisme. Prix Nobel de littérature en 1957, à 44 ans. Meurt à 46 dans un accident de voiture en Bourgogne, manuscrit du Premier Homme inachevé dans la sacoche.",
    goingFurther: [
      {
        kind: "essai",
        title: "Le Mythe de Sisyphe",
        author: "Albert Camus",
        year: 1942,
        note: "Le versant philosophique publié la même année, qui donne la clé du cycle de l'absurde.",
      },
      {
        kind: "biographie",
        title: "Albert Camus, une vie",
        author: "Olivier Todd",
        year: 1996,
        note: "La biographie de référence, 900 pages, accès aux archives familiales.",
      },
      {
        kind: "roman",
        title: "Meursault, contre-enquête",
        author: "Kamel Daoud",
        year: 2013,
        note: "Le frère de « l'Arabe » prend la parole. Réponse post-coloniale essentielle.",
      },
    ],
    libraireEndorsement: {
      libraire: "Clarisse M.",
      librairie: "Ombres Blanches, Toulouse",
      text: "On croit l'avoir lu parce qu'on l'a étudié. Relisez-le adulte : la sécheresse du style est un choix radical, le soleil d'Alger devient un personnage à part entière. Cent cinquante pages qui ne vieillissent pas.",
    },
    // Camus mort en 1960 → domaine public en 2031. Pas encore.
    publicDomain: false,
  },
  {
    id: "bovary",
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    year: 1857,
    genre: "classique",
    pages: 464,
    cover: "from-rose-200 via-pink-300 to-red-300",
    hook: "Une desperate housewife normande qui s'achève à l'arsenic.",
    pitch:
      "Emma a épousé un médecin de campagne un peu mou. Elle s'ennuie à mourir. Alors elle se shoote aux romances bon marché, se tape un dandy, puis un clerc de notaire, s'endette en robes de soie et rideaux pompeux. Quand les créanciers débarquent, elle avale de l'arsenic devant son portrait. Flaubert a été traîné en justice pour immoralité. Aujourd'hui on dit juste : c'est Desperate Housewives avant l'heure.",
    openingLines:
      "Nous étions à l'étude, quand le Proviseur entra, suivi d'un nouveau habillé en bourgeois et d'un garçon de classe qui portait un grand pupitre. Ceux qui dormaient se réveillèrent, et chacun se leva comme surpris dans son travail.",
    signatureQuote: "Elle confondait, dans son désir, les sensualités du luxe avec les joies du cœur, l'élégance des habitudes et les délicatesses du sentiment.",
    themes: ["adultère", "ennui", "province", "désir"],
    vibe: "romantic",
    moods: ["romance", "psychologique"],
    tier: "chef-oeuvre",
    fullTitle: "Madame Bovary — Mœurs de province",
    referenceEdition: "Édition originale Revue de Paris (1856) puis Michel Lévy frères (1857) · Folio classique",
    historicalContext:
      "Publié en feuilleton dans la Revue de Paris fin 1856, puis en volume en 1857. Procès pour outrage aux bonnes mœurs la même année — Flaubert est acquitté. Le procès marque la naissance du roman moderne : Flaubert travaille cinq ans sur le livre, invente le style indirect libre, vise le « roman sur rien » tenu uniquement par la force du style.",
    authorBio:
      "Gustave Flaubert (1821-1880) naît à Rouen, fils d'un chirurgien en chef à l'Hôtel-Dieu. Études de droit écourtées par une crise nerveuse à 23 ans — il rentre à Croisset, près de Rouen, où il passera l'essentiel de sa vie à écrire, en ermite.\n\nObsession du mot juste (le « mot dans la phrase comme une pierre dans un mur »), jusqu'à 12 heures d'écriture par jour, épreuves corrigées jusqu'à la nausée. Correspondance monumentale avec Louise Colet, George Sand, Tourgueniev. Laisse cinq romans majeurs, un testament critique dans Bouvard et Pécuchet, inachevé.",
    goingFurther: [
      {
        kind: "correspondance",
        title: "Correspondance avec Louise Colet",
        author: "Gustave Flaubert",
        note: "Les lettres pendant l'écriture de Bovary — laboratoire d'écriture en direct, cinq ans de lutte avec la phrase.",
      },
      {
        kind: "essai",
        title: "La Perruche et la Sirène",
        author: "Mario Vargas Llosa",
        year: 1975,
        note: "Lecture passionnée par un Prix Nobel qui avoue avoir relu Bovary dix fois.",
      },
      {
        kind: "adaptation",
        title: "Madame Bovary",
        author: "Claude Chabrol (film)",
        year: 1991,
        note: "Avec Isabelle Huppert. Adaptation fidèle, glaciale, très flaubertienne.",
      },
    ],
    libraireEndorsement: {
      libraire: "Raphaël D.",
      librairie: "Le Divan, Paris 15ᵉ",
      text: "Emma Bovary n'est pas une victime, et Flaubert ne la juge pas — c'est cette neutralité qui a choqué en 1857. On sort du livre sans savoir de quel côté se ranger. Essayer d'écrire aussi bien reste le grand test.",
    },
    publicDomain: true,
    gutenbergId: "14155",
    wikisourcePath: "Madame_Bovary",
  },
  {
    id: "germinal",
    title: "Germinal",
    author: "Émile Zola",
    year: 1885,
    genre: "classique",
    pages: 591,
    cover: "from-stone-600 via-stone-800 to-black",
    hook: "Les mineurs du Nord face au patronat. Ça finit pas chez Disney.",
    pitch:
      "Étienne Lantier débarque dans le Nord, corons noirs, charbon partout, gamins qui crachent du poumon à 14 ans. Il lit Marx en cachette. Il allume la mèche : grève générale. La répression arrive, les fusils chantent, un gosse nommé Jeanlin égorge un soldat dans un couloir souterrain. À la fin tout a brûlé, les mineurs redescendent au fond — mais quelque chose a germé dans les têtes. Zola a écrit la lutte des classes en roman d'action.",
    openingLines:
      "Dans la plaine rase, sous la nuit sans étoiles, d'une obscurité et d'une épaisseur d'encre, un homme suivait seul la grande route de Marchiennes à Montsou, dix kilomètres de pavé coupant tout droit, à travers les champs de betteraves.",
    signatureQuote: "Une armée noire, vengeresse, qui germait lentement dans les sillons, grandissant pour les récoltes du siècle futur.",
    themes: ["luttes sociales", "grève", "mines", "révolte"],
    vibe: "political",
    moods: ["histoire", "social"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Charpentier, 1885 · Folio classique / Livre de Poche",
    historicalContext:
      "Publié en 1885, Germinal est le 13ᵉ des 20 tomes du cycle des Rougon-Macquart. Zola s'est documenté sur place à Anzin pendant la grève de 1884, est descendu au fond, a rempli des carnets entiers. Le livre paraît pendant que le mouvement ouvrier français s'organise (CGT en 1895, loi sur le syndicat en 1884). C'est devenu le roman ouvrier par excellence, au point que « Germinal » est scandé dans les manifs un siècle plus tard.",
    authorBio:
      "Émile Zola (1840-1902) débute dans la misère à Paris, employé aux éditions Hachette, journaliste pigiste, avant le succès avec L'Assommoir (1877).\n\nArchitecte du cycle des Rougon-Macquart (20 romans, 1871-1893) qu'il pense comme l'« histoire naturelle et sociale d'une famille sous le Second Empire ». Naturaliste convaincu, il documente à outrance, descend dans les mines, visite les abattoirs, lit Claude Bernard. En 1898, il publie J'accuse dans L'Aurore à propos de l'affaire Dreyfus — procès, condamnation, exil à Londres. Meurt en 1902 asphyxié dans sa chambre par un conduit de cheminée bouché (accident ou attentat antidreyfusard — jamais élucidé).",
    goingFurther: [
      {
        kind: "essai",
        title: "Le Roman expérimental",
        author: "Émile Zola",
        year: 1880,
        note: "Le manifeste naturaliste par Zola lui-même — clé de voûte de sa méthode.",
      },
      {
        kind: "biographie",
        title: "Zola",
        author: "Henri Mitterand",
        year: 2002,
        note: "La biographie de référence en trois tomes, par le grand spécialiste zolien.",
      },
      {
        kind: "adaptation",
        title: "Germinal",
        author: "Claude Berri (film)",
        year: 1993,
        note: "Avec Renaud et Depardieu. La reconstitution du coron est saisissante.",
      },
    ],
    libraireEndorsement: {
      libraire: "Malika K.",
      librairie: "La Machine à Lire, Bordeaux",
      text: "On dit « document social » comme si c'était un reproche. Germinal est d'abord un roman d'une puissance romanesque brutale — la mort de Maheu, la catastrophe du Voreux, Chaval dans le boyau noir. On vous le vendait ado au lycée ? Reprenez-le à 35 ans.",
    },
    publicDomain: true,
    gutenbergId: "19861",
    wikisourcePath: "Germinal",
  },
  {
    id: "liaisons",
    title: "Les Liaisons dangereuses",
    author: "Pierre Choderlos de Laclos",
    year: 1782,
    genre: "classique",
    pages: 400,
    cover: "from-purple-900 via-violet-800 to-indigo-900",
    hook: "Deux toxiques du XVIIIe jouent avec les cœurs comme à FIFA.",
    pitch:
      "La marquise de Merteuil et le vicomte de Valmont, ex-amants devenus complices, s'amusent à détruire des vies pour le sport. Pari : corrompre une ado sortie du couvent et une jeune mariée pieuse. Ça marche. Puis ça dérape. Valmont tombe amoureux de sa proie. Merteuil le trahit. Duel, scandale, vérole. Laclos a écrit le thriller psychologique ultime avec juste des lettres. Flex intellectuel absolu.",
    openingLines:
      "Vous voyez, ma chère amie, que je vous tiens parole et que les bonnets et les pompons ne prennent pas tout mon temps : il m'en restera toujours pour vous. J'ai pourtant vu plus de parure dans cette seule journée que dans les quatre années que nous avons passées ensemble.",
    signatureQuote: "On s'ennuie de tout, mon ange, c'est une loi de la nature ; ce n'est pas ma faute.",
    themes: ["manipulation", "séduction", "vengeance", "épistolaire"],
    vibe: "dark",
    moods: ["romance", "psychologique"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Durand neveu, Amsterdam/Paris, 1782 · Folio classique",
    historicalContext:
      "Publié en 1782, sept ans avant la Révolution, à la fin de l'Ancien Régime. Laclos, officier d'artillerie de 41 ans, en tire un scandale retentissant — Marie-Antoinette lit l'ouvrage sous couverture neutre. L'aristocratie s'y reconnaît sous les pseudos. Le livre sera banni sous la Restauration, puis sous le Second Empire. C'est un roman-mécanique, le premier où le mal est traité avec une virtuosité formelle absolue.",
    authorBio:
      "Pierre Choderlos de Laclos (1741-1803) n'est pas un écrivain professionnel. Officier d'artillerie de carrière, il écrit Les Liaisons à 41 ans pendant une garnison ennuyeuse à Valence — « il a voulu faire un ouvrage qui sortît de la route ordinaire ».\n\nRallié à la Révolution puis au duc d'Orléans (Philippe Égalité), il sert sous Bonaparte, devient général sous l'Empire. Meurt du paludisme à Tarente, enterré anonymement par ordre des Bourbons lors du retour à la monarchie. Les Liaisons sont son seul roman.",
    goingFurther: [
      {
        kind: "essai",
        title: "Lectures de Laclos",
        author: "Laurent Versini",
        note: "La référence universitaire sur l'œuvre et sa réception.",
      },
      {
        kind: "adaptation",
        title: "Les Liaisons dangereuses",
        author: "Stephen Frears (film)",
        year: 1988,
        note: "Glenn Close, John Malkovich, Michelle Pfeiffer. Probablement la meilleure adaptation.",
      },
      {
        kind: "adaptation",
        title: "Cruel Intentions",
        author: "Roger Kumble (film)",
        year: 1999,
        note: "Transposition teen movie 90's. Oui vraiment. Ça marche.",
      },
    ],
    libraireEndorsement: {
      libraire: "Jeanne L.",
      librairie: "Librairie Kléber, Strasbourg",
      text: "Le roman épistolaire le plus parfait de la langue française. Merteuil est un personnage sans équivalent — elle ouvre une brèche féministe paradoxale dans un texte qui la punit à la fin. On n'a rien écrit d'aussi chirurgical sur le pouvoir du désir depuis.",
    },
    publicDomain: true,
    gutenbergId: "24076",
    wikisourcePath: "Les_Liaisons_dangereuses",
  },
  {
    id: "rouge-noir",
    title: "Le Rouge et le Noir",
    author: "Stendhal",
    year: 1830,
    genre: "classique",
    pages: 576,
    cover: "from-red-700 via-red-900 to-neutral-900",
    hook: "Un fils de scieur veut devenir quelqu'un. Il finit décapité.",
    pitch:
      "Julien Sorel, gamin pauvre, dévore Rousseau et rêve Napoléon. Il entre comme précepteur chez les Rênal — il se tape la bourgeoise. Monte à Paris, devient secrétaire d'un marquis — il se tape la fille. Il a les deux femmes, il a tout. Et quand il lâche tout pour tirer sur l'une d'elles à l'église, il se condamne exprès. Stendhal dissèque la mécanique du parvenu sous la Restauration avec une froideur quasi chirurgicale.",
    openingLines:
      "La petite ville de Verrières peut passer pour l'une des plus jolies de la Franche-Comté. Ses maisons blanches avec leurs toits pointus de tuiles rouges s'étendent sur la pente d'une colline, dont des touffes de vigoureux châtaigniers marquent les moindres sinuosités.",
    signatureQuote: "Jamais cette tête n'avait été aussi poétique qu'au moment où elle allait tomber.",
    themes: ["ambition", "amour", "ascension sociale", "hypocrisie"],
    vibe: "dark",
    moods: ["psychologique", "histoire"],
    tier: "chef-oeuvre",
    fullTitle: "Le Rouge et le Noir — Chronique de 1830",
    referenceEdition: "Édition originale Levavasseur, 1830 · Folio classique",
    historicalContext:
      "Publié en novembre 1830, quatre mois après les Trois Glorieuses qui ont chassé Charles X. Le sous-titre « Chronique de 1830 » n'est pas innocent : Stendhal écrit au ras de son époque, celle où l'ascension sociale par l'armée (le rouge) a été remplacée par l'ascension par l'Église (le noir). Le fait-divers Berthet, lu dans la Gazette des tribunaux, inspire la trame : un jeune précepteur condamné pour avoir tiré sur sa maîtresse à l'église.",
    authorBio:
      "Henri Beyle, dit Stendhal (1783-1842), est Grenoblois, suit Napoléon en Italie et jusqu'à Moscou, écrit sur la peinture, la musique, l'amour. Il attend la reconnaissance de ses romans « pour 1880 environ » — il voyait juste.\n\nDiplomate de carrière (consul à Civitavecchia, États pontificaux), il écrit compulsivement, dicte La Chartreuse de Parme en 52 jours. Peu lu de son vivant (1750 exemplaires du Rouge en 18 mois), admiré par Balzac, célébré post-mortem par Taine et Nietzsche. Épitaphe qu'il s'est composée : « Arrigo Beyle, Milanese, visse, scrisse, amò. »",
    goingFurther: [
      {
        kind: "essai",
        title: "De l'amour",
        author: "Stendhal",
        year: 1822,
        note: "Le traité qui invente la « cristallisation » amoureuse — éclaire toute la psychologie de Julien.",
      },
      {
        kind: "biographie",
        title: "Stendhal",
        author: "Michel Crouzet",
        note: "La somme biographique de référence, passionnante et exigeante.",
      },
    ],
    libraireEndorsement: {
      libraire: "Pierre V.",
      librairie: "Librairie Mollat, Bordeaux",
      text: "Le plus moderne des classiques français. La sécheresse stendhalienne, c'est du Tarantino avant l'heure — phrases courtes, psychologie en direct, ironie permanente. Julien Sorel est un des premiers héros vraiment ambigus de la littérature.",
    },
    publicDomain: true,
    gutenbergId: "798",
    wikisourcePath: "Le_Rouge_et_le_Noir",
  },
  {
    id: "bel-ami",
    title: "Bel-Ami",
    author: "Guy de Maupassant",
    year: 1885,
    genre: "classique",
    pages: 436,
    cover: "from-amber-400 via-yellow-500 to-amber-700",
    hook: "Un mec couche avec toutes les femmes de Paris et devient quelqu'un.",
    pitch:
      "Georges Duroy, ex-soldat d'Algérie fauché, débarque à Paris avec zéro talent sauf son sourire et ses moustaches. Il choppe un taf dans un journal grâce à un pote. Il sait qu'il n'écrit pas — alors il couche. Avec la femme de son collègue. Avec la femme de son patron. Avec la fille de son patron. À la fin il se marie en grande pompe à la Madeleine, politicien en devenir. Maupassant a écrit LinkedIn version XIXe.",
    openingLines:
      "Quand la caissière lui eut rendu la monnaie de sa pièce de cent sous, Georges Duroy sortit du restaurant. Comme il portait beau par nature et par pose d'ancien sous-officier, il cambra sa taille, frisa sa moustache d'un geste militaire et familier, et jeta sur les dîneurs attardés un regard rapide et circulaire, un de ces coups d'œil de joli garçon qui s'étendent comme des coups d'épervier.",
    signatureQuote: "Il sentait monter en lui un besoin furieux d'être tout, partout, en haut, le plus haut, plus haut que les autres.",
    themes: ["ambition", "séduction", "presse", "arrivisme"],
    vibe: "wild",
    moods: ["social", "romance"],
    tier: "classique",
    referenceEdition: "Édition originale Victor Havard, 1885 · Folio classique",
    historicalContext:
      "Paru en 1885, la même année que Germinal. Maupassant, disciple de Flaubert, dissèque la Troisième République triomphante — colonisation algérienne, spéculation financière, presse à scandale (La Vie française est inspirée du Gil Blas, où Maupassant écrit). C'est un roman sur la fabrique du pouvoir par la presse, terriblement actuel.",
    authorBio:
      "Guy de Maupassant (1850-1893) commence comme petit fonctionnaire au ministère de l'Instruction publique, protégé de Flaubert qui le forme pendant sept ans avant de le laisser publier Boule de Suif à 30 ans.\n\nDix années d'une productivité stupéfiante : six romans, 300 nouvelles, récits de voyage. Il rame en yole sur la Seine, collectionne les maîtresses, soigne une syphilis contractée à 20 ans qui finira par lui détruire l'esprit. Interné en 1892 au Dr Blanche à Passy, il meurt un an plus tard à 43 ans. Maître de la nouvelle réaliste française.",
    goingFurther: [
      {
        kind: "essai",
        title: "Maupassant ou le Bel-Ami",
        author: "Armand Lanoux",
        note: "Biographie littéraire qui relit l'œuvre à la lumière de la vie.",
      },
      {
        kind: "adaptation",
        title: "Bel Ami",
        author: "Declan Donnellan (film)",
        year: 2012,
        note: "Avec Robert Pattinson. Reconstitution soignée.",
      },
    ],
    libraireEndorsement: {
      libraire: "Théo B.",
      librairie: "Le Phare, Montreuil",
      text: "Le roman politique le plus drôle du XIXᵉ. On comprend en lisant Bel-Ami comment fonctionnent encore aujourd'hui les carrières fulgurantes : un peu de charme, beaucoup de bas, pas de scrupules, et une presse complice. Rafraîchissant et désespérant à la fois.",
    },
    publicDomain: true,
    gutenbergId: "18567",
    wikisourcePath: "Bel-Ami",
  },
  {
    id: "notre-dame",
    title: "Notre-Dame de Paris",
    author: "Victor Hugo",
    year: 1831,
    genre: "classique",
    pages: 720,
    cover: "from-slate-700 via-gray-800 to-zinc-900",
    hook: "Un bossu, une gitane, un prêtre obsédé. Fin : squelettes enlacés.",
    pitch:
      "Quasimodo, sonneur bossu, moche de chez moche, aime silencieusement Esmeralda, danseuse gitane. Problème : Frollo, archidiacre, la veut aussi — version harceleur psychopathe. Comme il peut pas l'avoir, il la fait condamner pour sorcellerie. Pendue. Quasimodo balance Frollo du haut de la tour et va mourir couché sur le cadavre de sa bien-aimée. Hugo intercale 150 pages d'archi gothique juste parce qu'il peut.",
    openingLines:
      "Il y a aujourd'hui trois cent quarante-huit ans six mois et dix-neuf jours que les parisiens s'éveillèrent au bruit de toutes les cloches sonnant à grande volée dans la triple enceinte de la Cité, de l'Université et de la Ville.",
    signatureQuote: "Ceci tuera cela. Le livre tuera l'édifice.",
    themes: ["amour impossible", "monstruosité", "médiéval", "fanatisme"],
    vibe: "epic",
    moods: ["aventure", "histoire", "romance"],
    tier: "chef-oeuvre",
    fullTitle: "Notre-Dame de Paris — 1482",
    referenceEdition: "Édition originale Charles Gosselin, 1831 · Folio classique",
    historicalContext:
      "Hugo écrit Notre-Dame de Paris en 1830-1831, dans l'urgence (son contrat avec Gosselin le menace d'une amende énorme). Le roman contribue décisivement au sauvetage de la cathédrale, délabrée et promise à la démolition — c'est après la publication que Viollet-le-Duc entreprend sa restauration. Le livre pose aussi Hugo comme champion du romantisme historique, huit ans avant la rupture politique qui fera de lui le proscrit républicain.",
    authorBio:
      "Victor Hugo (1802-1885), né à Besançon, est sans doute l'écrivain français dont la vie a le plus épousé son siècle. Académicien à 38 ans, pair de France, il rompt avec Louis-Napoléon Bonaparte en 1851 — 19 ans d'exil à Jersey puis Guernesey, où il écrit Les Contemplations, Les Misérables, La Légende des siècles.\n\nRentré en triomphe en 1870, il devient de son vivant un mythe républicain. Funérailles nationales en 1885 — deux millions de personnes suivent le cortège jusqu'au Panthéon. Poète, romancier, dramaturge, dessinateur, père meurtri (Léopoldine), il a laissé derrière lui plus de 153 000 pages manuscrites.",
    goingFurther: [
      {
        kind: "essai",
        title: "Victor Hugo",
        author: "Graham Robb",
        year: 1997,
        note: "Biographie de référence, ample et vivante, par un anglophone amoureux de Hugo.",
      },
      {
        kind: "adaptation",
        title: "Notre-Dame de Paris",
        author: "Comédie musicale Plamondon/Cocciante",
        year: 1998,
        note: "Oui, c'est kitsch. Oui, c'est efficace. « Belle » marche toujours.",
      },
    ],
    libraireEndorsement: {
      libraire: "Anne-Laure T.",
      librairie: "Librairie Gibert, Nantes",
      text: "On se souvient de Quasimodo et d'Esmeralda. On oublie que Hugo a consacré des centaines de pages à l'architecture gothique, à Paris vu de haut, à l'imprimerie qui tue la cathédrale. C'est aussi ça, le livre : un essai sur la fin d'un monde, camouflé en roman.",
    },
    publicDomain: true,
    gutenbergId: "19657",
    wikisourcePath: "Notre-Dame_de_Paris",
  },
  {
    id: "voyage",
    title: "Voyage au bout de la nuit",
    author: "Louis-Ferdinand Céline",
    year: 1932,
    genre: "classique",
    pages: 505,
    cover: "from-neutral-800 via-stone-900 to-black",
    hook: "La guerre, les colonies, l'Amérique, Paris : tour du monde de la noirceur.",
    pitch:
      "Bardamu, anti-héros total, s'engage par connerie en 14-18, voit la boucherie des tranchées. Fuit en Afrique coloniale — pourri, moite, corrompu. Fuit à Detroit — les usines Ford, Molly la prostituée qu'il trahit. Rentre à Paris, devient médecin de banlieue, confronté à la misère ordinaire. Céline explose la langue : argot, trois points, colères hallucinées. L'homme derrière est odieux. Le roman, lui, est un monument.",
    openingLines:
      "Ça a débuté comme ça. Moi, j'avais jamais rien dit. Rien. C'est Arthur Ganate qui m'a fait parler. Arthur, un étudiant, un carabin lui aussi, un camarade.",
    signatureQuote: "Tout ce qui est intéressant se passe dans l'ombre, décidément. On ne sait rien de la véritable histoire des hommes.",
    themes: ["guerre", "désillusion", "errance", "argot"],
    vibe: "dark",
    moods: ["voyage-initiatique", "noir"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Denoël & Steele, 1932 · Folio",
    historicalContext:
      "Paru en 1932, Voyage loupe le Goncourt de trois voix (il ira au Renaudot). Céline, médecin de banlieue à Clichy, a 38 ans. Le roman est d'abord salué par la gauche pour sa dénonciation de la guerre et du colonialisme, puis Céline, antisémite forcené dans ses pamphlets (1937-1941), devient l'objet d'un débat éthique permanent que la critique française traverse encore aujourd'hui : comment lire un écrivain majeur qui fut aussi un homme abject.",
    authorBio:
      "Louis-Ferdinand Destouches, dit Louis-Ferdinand Céline (1894-1961), vétéran décoré de 1914, médecin des pauvres à Clichy puis Meudon, inventeur d'une langue parlée qui bouleverse le roman français.\n\nLes pamphlets antisémites de 1937-1938 (Bagatelles pour un massacre) le placent durablement hors littérature « respectable ». Collabore sous l'Occupation, fuit en 1944 vers Sigmaringen avec Pétain, puis Danemark où il est emprisonné. Amnistié en 1951, il rentre en France et écrit sa grande trilogie allemande (D'un château l'autre, Nord, Rigodon). Reste l'un des stylistes les plus radicaux du XXᵉ siècle. Son nom reste brûlant.",
    goingFurther: [
      {
        kind: "biographie",
        title: "Céline",
        author: "Henri Godard",
        year: 2011,
        note: "La biographie du grand spécialiste célinien, éditeur de la Pléiade. Indispensable et lucide.",
      },
      {
        kind: "essai",
        title: "La Langue de Céline",
        author: "Henri Godard",
        year: 1985,
        note: "Pour comprendre techniquement ce qui se joue dans la « petite musique » célinienne.",
      },
      {
        kind: "correspondance",
        title: "Lettres",
        author: "Louis-Ferdinand Céline",
        year: 2009,
        note: "Édition Pléiade. Les lettres révèlent l'homme — pour le meilleur et pour le pire.",
      },
    ],
    libraireEndorsement: {
      libraire: "Youssef R.",
      librairie: "Librairie Comme un roman, Paris 3ᵉ",
      text: "Voyage est un grand livre. Céline est un homme qu'on ne peut pas défendre. Il faut tenir les deux en tension, sans tricher. La langue du Voyage — cette « émotion transposée dans le langage écrit » qu'il revendique — a libéré la prose française. Lisez-le en sachant ce qu'il est devenu ensuite.",
    },
    // Céline mort en 1961 → domaine public en 2032. Pas encore.
    publicDomain: false,
  },
  {
    id: "candide",
    title: "Candide",
    author: "Voltaire",
    year: 1759,
    genre: "classique",
    pages: 160,
    cover: "from-lime-300 via-emerald-400 to-teal-500",
    hook: "Conte philosophique roadtrip qui défonce l'optimisme en 150 pages.",
    pitch:
      "Candide, naïf absolu, est élevé par le prof Pangloss qui lui répète que 'tout est pour le mieux dans le meilleur des mondes possibles'. Puis il se fait virer du château, embarque dans une guerre, survit au tremblement de terre de Lisbonne, croise l'Inquisition, atterrit en Eldorado, perd tout, retrouve sa Cunégonde devenue moche. Conclusion : 'il faut cultiver notre jardin'. Voltaire a écrit un middle finger de 150 pages à Leibniz. Lisible en un aprem.",
    openingLines:
      "Il y avait en Westphalie, dans le château de monsieur le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces. Sa physionomie annonçait son âme.",
    signatureQuote: "Il faut cultiver notre jardin.",
    themes: ["optimisme", "satire", "philosophie", "voyage"],
    vibe: "absurd",
    moods: ["voyage-initiatique", "aventure"],
    tier: "chef-oeuvre",
    fullTitle: "Candide, ou l'Optimisme",
    referenceEdition: "Édition originale anonyme, Genève, 1759 · Folio classique",
    historicalContext:
      "Publié clandestinement en janvier 1759, quelques années après le tremblement de terre de Lisbonne (1755) qui avait ébranlé la foi optimiste des Lumières — « tout est pour le mieux » devenait intenable. Voltaire répond à Leibniz (mort depuis 1716) et, plus directement, aux pasteurs et philosophes qui défendaient la « théodicée ». Le conte est condamné, saisi, réimprimé vingt fois en un an. Archétype du conte philosophique du siècle des Lumières.",
    authorBio:
      "François-Marie Arouet, dit Voltaire (1694-1778), est le plus célèbre écrivain européen de son siècle, et probablement le plus infatigable polémiste de l'histoire. Embastillé deux fois, exilé en Angleterre (1726-1729), où il découvre la tolérance anglicane et le parlementarisme.\n\nRetiré à Ferney sur la frontière suisse, il correspond avec Catherine II, Frédéric II, l'Europe entière — 20 000 lettres conservées. Défenseur de Calas, de Sirven, du chevalier de La Barre. Retour triomphal à Paris à 83 ans, couronné à la Comédie-Française, il y meurt trois mois plus tard.",
    goingFurther: [
      {
        kind: "essai",
        title: "Voltaire ou la royauté de l'esprit",
        author: "Jean Orieux",
        year: 1966,
        note: "Biographie vivante et drôle, façon roman — reste une des plus agréables entrées.",
      },
      {
        kind: "essai",
        title: "Dictionnaire philosophique",
        author: "Voltaire",
        year: 1764,
        note: "Complément direct de Candide — la même pensée, en articles courts et vifs.",
      },
    ],
    libraireEndorsement: {
      libraire: "Clarisse M.",
      librairie: "Ombres Blanches, Toulouse",
      text: "Le livre le plus court à conseiller à un ado qui « n'aime pas lire ». Cent cinquante pages, cent vingt éclats de rire, et une des plus belles fins de la littérature française : « il faut cultiver notre jardin ». Modestie, lucidité, action. Tout est là.",
    },
    publicDomain: true,
    gutenbergId: "4650",
    wikisourcePath: "Candide,_ou_l'Optimisme",
  },
  {
    id: "pere-goriot",
    title: "Le Père Goriot",
    author: "Honoré de Balzac",
    year: 1835,
    genre: "classique",
    pages: 320,
    cover: "from-orange-300 via-amber-500 to-red-600",
    hook: "Un père se ruine pour ses filles ingrates. Roi Lear en pension parisienne.",
    pitch:
      "Pension Vauquer, Paris 1819, un ramassis de losers. Parmi eux, Rastignac, étudiant ambitieux. Et Goriot, vieux vermicellier qui se dépouille pour ses deux filles mariées riches — elles viennent lui pomper le cash, même pas à son enterrement. Vautrin, le bandit, explique à Rastignac la vraie loi de Paris : prédateur ou proie. À la fin, Rastignac fixe la ville depuis le Père-Lachaise et balance : 'À nous deux maintenant.' Balzac pose le code triche de la société moderne.",
    openingLines:
      "Madame Vauquer, née de Conflans, est une vieille femme qui, depuis quarante ans, tient à Paris une pension bourgeoise établie rue Neuve-Sainte-Geneviève, entre le quartier latin et le faubourg Saint-Marceau.",
    signatureQuote: "À nous deux maintenant !",
    themes: ["Paris", "ambition", "famille", "argent"],
    vibe: "epic",
    moods: ["psychologique", "social"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Revue de Paris, 1834 · Werdet, 1835 · Folio classique",
    historicalContext:
      "Publié en feuilleton fin 1834, puis en volume en 1835. Le roman marque l'invention du système balzacien : Rastignac, Vautrin, Delphine de Nucingen y apparaissent — ils traverseront des dizaines de romans. Balzac a 35 ans, il écrit 16 heures par jour, stimulé au café. Paris post-1830 est la scène : monarchie de Juillet, bourgeois au pouvoir, aristocratie ruinée, « machine à faire de l'argent » comme dira Marx qui lisait Balzac.",
    authorBio:
      "Honoré de Balzac (1799-1850) accumule les échecs (imprimerie, fonderie, mine) avant de trouver sa voie dans le roman. La Comédie humaine, pensée comme fresque totale de la société française, compte 91 romans, près de 2 500 personnages, des cycles (Scènes de la vie privée, de la vie de province, de la vie parisienne, etc.).\n\nProduction surhumaine, endettement chronique, noctambule fameux. Correspondance de 17 ans avec la comtesse Hanska (Ukraine), épousée trois mois avant sa mort à 51 ans. Enterré au Père-Lachaise — oraison funèbre prononcée par Victor Hugo : « Tous ses livres ne forment qu'un livre, livre vivant, lumineux, profond. »",
    goingFurther: [
      {
        kind: "essai",
        title: "Balzac, mythe et mystification",
        author: "Michel Butor",
        note: "Butor relit Balzac en structuraliste — stimulant pour comprendre la mécanique de la Comédie humaine.",
      },
      {
        kind: "biographie",
        title: "Balzac",
        author: "Stefan Zweig",
        year: 1946,
        note: "Inachevée mais superbe, par un Zweig qui admirait Balzac avec passion.",
      },
    ],
    libraireEndorsement: {
      libraire: "Pierre V.",
      librairie: "Librairie Mollat, Bordeaux",
      text: "Pour entrer dans Balzac, commencez ici. C'est le roman qui donne la matrice : Paris comme champ de bataille, l'argent comme moteur, la famille comme piège. Vautrin est un des personnages les plus drôles et inquiétants de la littérature française.",
    },
    publicDomain: true,
    gutenbergId: "1422",
    wikisourcePath: "Le_Père_Goriot",
  },
  {
    id: "fleurs-mal",
    title: "Les Fleurs du Mal",
    author: "Charles Baudelaire",
    year: 1857,
    genre: "poesie",
    pages: 240,
    cover: "from-red-950 via-rose-900 to-black",
    hook: "Poésie noire, sexe, vin, spleen. Censurée, idolâtrée.",
    pitch:
      "Baudelaire prend le romantisme et le plonge dans l'absinthe. Il chante les prostituées, les chambres sales, le spleen qui te tue à petit feu, l'idéal inaccessible, la femme vampire. 'Anywhere out of the world.' Le recueil est condamné en 1857 pour outrage aux bonnes mœurs — six poèmes interdits jusqu'en 1949. Aujourd'hui Baudelaire c'est le grand-père de tout ce qui s'appelle 'dark' dans la culture : du black metal à Lana Del Rey. Lis-en trois, tu comprends.",
    openingLines:
      "La sottise, l'erreur, le péché, la lésine,\nOccupent nos esprits et travaillent nos corps,\nEt nous alimentons nos aimables remords,\nComme les mendiants nourrissent leur vermine.",
    signatureQuote: "Hypocrite lecteur, — mon semblable, — mon frère !",
    themes: ["spleen", "idéal", "érotisme", "modernité"],
    vibe: "dark",
    moods: ["metaphysique", "noir"],
    tier: "chef-oeuvre",
    referenceEdition: "Édition originale Poulet-Malassis et de Broise, 1857 · Édition définitive 1868 (posthume) · Poésie/Gallimard",
    historicalContext:
      "Parues en juin 1857 (la même année que Madame Bovary), Les Fleurs du Mal sont condamnées pour outrage aux bonnes mœurs en août — six pièces (Lesbos, Femmes damnées, Le Léthé, À celle qui est trop gaie, Les Bijoux, Les Métamorphoses du vampire) sont retirées et ne seront réintégrées officiellement qu'en 1949 par cassation. Baudelaire, ruiné, syphilitique, meurt dix ans plus tard à 46 ans sans avoir reçu la reconnaissance qu'il attendait.",
    authorBio:
      "Charles Baudelaire (1821-1867), fils d'un veuf âgé qui meurt quand il a six ans, ne pardonne jamais à sa mère son remariage avec le général Aupick. Dilapide rapidement l'héritage paternel, placé sous tutelle judiciaire — source d'amertume à vie.\n\nIntroduit Edgar Poe en France (ses traductions font école), écrit sur Delacroix, Manet, Wagner, Guys. Vit avec Jeanne Duval, « Vénus noire », sa muse chaotique. Ruiné, rongé par la syphilis, muet après une attaque en 1866, il meurt à 46 ans dans les bras de sa mère. Reconnu posthume comme fondateur de la modernité poétique — Rimbaud, Mallarmé, Valéry lui doivent tout.",
    goingFurther: [
      {
        kind: "essai",
        title: "Le Peintre de la vie moderne",
        author: "Charles Baudelaire",
        year: 1863,
        note: "Le manifeste de la modernité — à lire avec les Fleurs pour comprendre la théorie derrière la pratique.",
      },
      {
        kind: "biographie",
        title: "Baudelaire",
        author: "Claude Pichois",
        year: 1996,
        note: "La somme biographique de référence, par l'éditeur de la Pléiade.",
      },
      {
        kind: "essai",
        title: "Charles Baudelaire, un poète lyrique à l'apogée du capitalisme",
        author: "Walter Benjamin",
        note: "La lecture politique et urbaine la plus fulgurante jamais écrite sur Baudelaire.",
      },
    ],
    libraireEndorsement: {
      libraire: "Nina Z.",
      librairie: "Librairie La Petite Égypte, Paris 2ᵉ",
      text: "Le recueil à relire à chaque âge de la vie. À 20 ans on préfère « L'Albatros » et « L'Invitation au voyage ». À 40 on découvre « Recueillement » et « Le Goût du néant ». Baudelaire est la poésie française même — il a fixé pour longtemps ce qui, en nous, doit se dire en vers.",
    },
    publicDomain: true,
    gutenbergId: "6099",
    wikisourcePath: "Les_Fleurs_du_mal",
  },
  {
    id: "swann",
    title: "Du côté de chez Swann",
    author: "Marcel Proust",
    year: 1913,
    genre: "classique",
    pages: 528,
    cover: "from-sky-200 via-indigo-300 to-violet-400",
    hook: "Une madeleine dans du thé, et 3000 pages commencent.",
    pitch:
      "Le narrateur trempe une madeleine dans du thé — et d'un coup son enfance à Combray lui revient tout entière. Puis Proust raconte Swann, l'amour jaloux et maladif que ce snob a pour Odette, une demi-mondaine. La phrase proustienne s'étire, se déploie, te fait vivre une seule pensée qui dure quatre minutes. Proust invente la mémoire involontaire, la psychologie moderne, le roman-fleuve. Commence par la madeleine. Tu verras où ça te mène.",
    openingLines:
      "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire : « Je m'endors. »",
    signatureQuote: "Et tout d'un coup le souvenir m'est apparu. Ce goût, c'était celui du petit morceau de madeleine que le dimanche matin à Combray ma tante Léonie m'offrait.",
    themes: ["mémoire", "temps", "jalousie", "aristocratie"],
    vibe: "mystique",
    moods: ["romance", "psychologique"],
    tier: "chef-oeuvre",
    fullTitle: "Du côté de chez Swann (À la recherche du temps perdu, I)",
    referenceEdition: "Édition originale Grasset, 1913 · Gallimard, 1919 · Folio classique",
    historicalContext:
      "Premier volume de la Recherche, publié à compte d'auteur chez Grasset en novembre 1913 après le refus de Gallimard (André Gide, qui reconnaîtra sa « plus grande erreur » de lecteur). Proust a 42 ans, il est asthmatique, reclus boulevard Haussmann dans une chambre tapissée de liège. La Grande Guerre reporte la suite, qui paraît de 1919 (Goncourt pour À l'ombre des jeunes filles en fleurs) à 1927 pour Le Temps retrouvé, posthume. Sept volumes, 2 400 personnages, une œuvre-monde.",
    authorBio:
      "Marcel Proust (1871-1922), fils d'un grand médecin (Adrien Proust, pionnier de l'hygiène internationale) et d'une mère juive qu'il idolâtre, grandit entre Illiers (l'avenir Combray) et Paris. Mondain, snob, homosexuel caché, il écrit des textes courts avant de trouver, après la mort de sa mère, la nécessité absolue de la Recherche.\n\nSe cloître dans sa chambre du 102 boulevard Haussmann puis rue Hamelin, travaille la nuit, se lève à 15h. Correspondance de 5 400 lettres conservées. Meurt à 51 ans d'une pneumonie, la dictée du Temps retrouvé achevée à deux heures du matin. La Recherche est devenue le grand roman de la langue française — comparable à l'Odyssée pour le grec.",
    goingFurther: [
      {
        kind: "biographie",
        title: "Marcel Proust",
        author: "Jean-Yves Tadié",
        year: 1996,
        note: "La biographie de référence, 950 pages, par l'éditeur en chef de la Pléiade.",
      },
      {
        kind: "essai",
        title: "Comment Proust peut changer votre vie",
        author: "Alain de Botton",
        year: 1997,
        note: "Entrée douce et drôle dans la Recherche, sans jargon universitaire.",
      },
      {
        kind: "correspondance",
        title: "Correspondance",
        author: "Marcel Proust",
        note: "21 tomes édités par Philip Kolb. Pour voir l'œuvre s'écrire au présent.",
      },
    ],
    libraireEndorsement: {
      libraire: "Françoise D.",
      librairie: "Librairie Tschann, Paris 6ᵉ",
      text: "Ne cherchez pas à « lire Proust ». Ouvrez au hasard, quinze minutes par jour, pendant un an. La phrase fait le travail seule — elle vous habite. Swann est la porte d'entrée la plus naturelle. La madeleine, oui, mais surtout : la petite sonate de Vinteuil, la mort de la grand-mère, la jalousie pour Odette.",
    },
    publicDomain: true,
    gutenbergId: "2650",
    wikisourcePath: "Du_côté_de_chez_Swann",
  },
];

export const getBook = (id: string) => BOOKS.find((b) => b.id === id);

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: "u-me",
    handle: "@guillaume",
    name: "Guillaume",
    bio: "Explorateur de pages et de sentiers. Adventurer le jour, Incipit la nuit.",
    avatar: "🦉",
    booksRead: 4,
    joinedClubs: ["club-russes", "club-decadence"],
  },
  {
    id: "u-lise",
    handle: "@lisedlc",
    name: "Lise Delacour",
    bio: "Prof de lettres repentie. Préfère Colette à Instagram.",
    avatar: "📖",
    booksRead: 47,
    joinedClubs: ["club-russes"],
  },
  {
    id: "u-karim",
    handle: "@karim.lit",
    name: "Karim Benali",
    bio: "Je lis entre deux rames de métro. Dans l'ordre : Céline, Duras, Houellebecq.",
    avatar: "🚇",
    booksRead: 23,
    joinedClubs: ["club-decadence", "club-nouveaux-classiques"],
  },
  {
    id: "u-nora",
    handle: "@noralatourneuse",
    name: "Nora Segal",
    bio: "Tatouée Baudelaire. Fan de la Série noire.",
    avatar: "🖤",
    booksRead: 61,
    joinedClubs: ["club-decadence", "club-polars"],
  },
  {
    id: "u-tom",
    handle: "@tommoreau",
    name: "Tom Moreau",
    bio: "Lit du Zola quand il prend le RER D. Pro-grève éternel.",
    avatar: "⛏️",
    booksRead: 12,
    joinedClubs: ["club-nouveaux-classiques"],
  },
];

export const ME = USERS[0];
export const getUser = (id: string) => USERS.find((u) => u.id === id);

// ─────────────────────────────────────────────────────────────────────────────
// BIBLIOTHÈQUE PERSO
// ─────────────────────────────────────────────────────────────────────────────

export const MY_LIBRARY: LibraryEntry[] = [
  {
    bookId: "etranger",
    status: "read",
    addedAt: "2025-09-12",
    noteId: "n-1",
    minutesRead: 312,
  },
  {
    bookId: "germinal",
    status: "read",
    addedAt: "2025-10-03",
    noteId: "n-2",
    minutesRead: 890,
  },
  { bookId: "candide", status: "read", addedAt: "2024-11-20", minutesRead: 198 },
  {
    bookId: "pere-goriot",
    status: "read",
    addedAt: "2024-06-08",
    minutesRead: 542,
  },
  {
    bookId: "bovary",
    status: "reading",
    addedAt: "2026-03-28",
    progress: 42,
    minutesRead: 267,
    lastReadAt: "2026-04-19",
    lastChapter: "Partie II, ch. 8",
  },
  { bookId: "liaisons", status: "to-read", addedAt: "2026-04-02" },
  { bookId: "swann", status: "to-read", addedAt: "2026-04-15" },
  { bookId: "fleurs-mal", status: "to-read", addedAt: "2026-04-18" },
];

export const getLibraryEntry = (bookId: string) =>
  MY_LIBRARY.find((e) => e.bookId === bookId);

// ─────────────────────────────────────────────────────────────────────────────
// NOTES DE LECTURE
// ─────────────────────────────────────────────────────────────────────────────

export const NOTES: ReadingNote[] = [
  {
    id: "n-1",
    userId: "u-me",
    bookId: "etranger",
    createdAt: "2025-09-18",
    text: "Je l'ai relu à 32 ans après l'avoir lu au lycée, et c'est un autre livre. Ce qui m'avait paru froid sonne maintenant comme une sincérité radicale. Meursault n'est pas insensible, il est juste allergique au mensonge social. Le vrai scandale du roman c'est pas le meurtre — c'est qu'il refuse de jouer le jeu.",
    rating: 5,
  },
  {
    id: "n-2",
    userId: "u-me",
    bookId: "germinal",
    createdAt: "2025-10-14",
    text: "Le Voreux qui respire comme un monstre, la descente dans la fosse, le cheval Bataille enterré vivant dans le noir… Zola écrit avec la puissance d'un cinéaste cinquante ans avant le cinéma. Politique, oui, mais surtout hypnotique.",
    rating: 5,
  },
  {
    id: "n-3",
    userId: "u-lise",
    bookId: "bovary",
    createdAt: "2026-02-11",
    text: "On continue de donner Bovary en commentaire composé de terminale alors que c'est un roman sur l'addiction. L'addiction aux histoires, à la promesse d'un ailleurs. Emma n'est pas frivole, elle est junkie de fiction. Ça parle directement à notre époque d'écrans.",
    rating: 5,
  },
  {
    id: "n-4",
    userId: "u-karim",
    bookId: "voyage",
    createdAt: "2026-04-02",
    text: "Céline te met une claque linguistique dès la page 3. Tu lis plus un roman, tu entends quelqu'un te parler dans l'oreille à 3h du matin. Dommage qu'il soit devenu ce qu'il est devenu — il faut lire le livre en sachant.",
    rating: 4,
  },
  {
    id: "n-5",
    userId: "u-nora",
    bookId: "fleurs-mal",
    createdAt: "2026-03-25",
    text: "Je l'ai toujours sur ma table de nuit. Trois poèmes avant de dormir. 'Recueillement' reste celui qui me calme le mieux les nuits où j'arrive pas à m'endormir. Baudelaire c'est de la médecine.",
    rating: 5,
  },
  {
    id: "n-6",
    userId: "u-tom",
    bookId: "germinal",
    createdAt: "2026-01-09",
    text: "Lu dans le RER D en direction de La Courneuve. Pas mieux que de lire Zola en allant bosser. Le combat d'Étienne Lantier est notre combat, 140 ans plus tard.",
    rating: 5,
  },
];

export const getNotesForBook = (bookId: string) =>
  NOTES.filter((n) => n.bookId === bookId);
export const getNotesByUser = (userId: string) =>
  NOTES.filter((n) => n.userId === userId);

// ─────────────────────────────────────────────────────────────────────────────
// BOOK CLUBS
// ─────────────────────────────────────────────────────────────────────────────

export const CLUBS: BookClub[] = [
  {
    id: "club-russes",
    name: "Les Russes",
    emoji: "❄️",
    description:
      "Dostoïevski, Tolstoï, Tchekhov, Boulgakov. On lit long, on lit froid, on lit fort. Un livre par mois, discussion en visio.",
    currentBookId: "etranger",
    members: 142,
    vibe: "intellectuel",
    nextMeeting: "2026-04-28T20:00:00",
  },
  {
    id: "club-decadence",
    name: "Décadence & Spleen",
    emoji: "🖤",
    description:
      "Baudelaire, Huysmans, Verlaine, Rimbaud. Le fin du fin de la noirceur poétique. On se retrouve dans des bars.",
    currentBookId: "fleurs-mal",
    members: 87,
    vibe: "intense",
    nextMeeting: "2026-04-25T19:30:00",
  },
  {
    id: "club-nouveaux-classiques",
    name: "Les Nouveaux Classiques",
    emoji: "📚",
    description:
      "Relire les grands classiques français avec des yeux de 2026. Débats libres, tout le monde peut proposer. Club chill.",
    currentBookId: "germinal",
    members: 318,
    vibe: "casual",
    nextMeeting: "2026-05-02T18:00:00",
  },
  {
    id: "club-polars",
    name: "Cercle Noir",
    emoji: "🔪",
    description:
      "Du roman noir au thriller littéraire. Simenon, Manchette, Izzo, Vargas. Chaque mois un polar qui dérange.",
    currentBookId: "voyage",
    members: 64,
    vibe: "intense",
    nextMeeting: "2026-05-05T20:30:00",
  },
];

export const getClub = (id: string) => CLUBS.find((c) => c.id === id);

// ─────────────────────────────────────────────────────────────────────────────
// FEED SOCIAL
// ─────────────────────────────────────────────────────────────────────────────

export const FEED: FeedItem[] = [
  {
    id: "f-1",
    userId: "u-nora",
    type: "note",
    bookId: "fleurs-mal",
    noteText:
      "Je l'ai toujours sur ma table de nuit. Trois poèmes avant de dormir…",
    createdAt: "2026-04-19T22:14:00",
  },
  {
    id: "f-2",
    userId: "u-karim",
    type: "finished",
    bookId: "voyage",
    createdAt: "2026-04-19T18:02:00",
  },
  {
    id: "f-3",
    userId: "u-lise",
    type: "started",
    bookId: "liaisons",
    createdAt: "2026-04-19T09:31:00",
  },
  {
    id: "f-4",
    userId: "u-tom",
    type: "joined-club",
    clubId: "club-nouveaux-classiques",
    createdAt: "2026-04-18T20:10:00",
  },
  {
    id: "f-5",
    userId: "u-nora",
    type: "added",
    bookId: "swann",
    createdAt: "2026-04-18T12:05:00",
  },
  {
    id: "f-6",
    userId: "u-karim",
    type: "note",
    bookId: "voyage",
    noteText: "Céline te met une claque linguistique dès la page 3…",
    createdAt: "2026-04-17T23:42:00",
  },
  {
    id: "f-7",
    userId: "u-lise",
    type: "finished",
    bookId: "bovary",
    createdAt: "2026-04-17T17:18:00",
  },
  {
    id: "f-8",
    userId: "u-tom",
    type: "started",
    bookId: "germinal",
    createdAt: "2026-04-16T08:40:00",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GENRES (onboarding)
// ─────────────────────────────────────────────────────────────────────────────

export const GENRES: {
  key: import("./types").Genre;
  label: string;
  emoji: string;
  blurb: string;
}[] = [
  { key: "classique", label: "Classiques", emoji: "📜", blurb: "Les monuments qui ont traversé les siècles" },
  { key: "contemporain", label: "Contemporain", emoji: "📡", blurb: "Les voix d'aujourd'hui" },
  { key: "poesie", label: "Poésie", emoji: "🕊️", blurb: "Baudelaire, Rimbaud, Apollinaire" },
  { key: "polar", label: "Polar & Thriller", emoji: "🔪", blurb: "Enquêtes, crimes, noirceur" },
  { key: "sf-fantastique", label: "SF & Fantastique", emoji: "🪐", blurb: "Ailleurs possibles" },
  { key: "philosophie", label: "Philosophie", emoji: "🧠", blurb: "Penser le monde" },
  { key: "theatre", label: "Théâtre", emoji: "🎭", blurb: "Molière, Racine, Beckett" },
  { key: "bd-graphique", label: "BD & Graphique", emoji: "✏️", blurb: "Romans graphiques et BD littéraires" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOODS / PARCOURS THÉMATIQUES
// ─────────────────────────────────────────────────────────────────────────────

export const MOODS: {
  key: import("./types").Mood;
  label: string;
  emoji: string;
  blurb: string;
  cover: string;
}[] = [
  { key: "romance",           label: "Romance",             emoji: "❤️", blurb: "Passions, jalousies, trahisons", cover: "from-rose-300 via-pink-400 to-red-500" },
  { key: "aventure",          label: "Aventure",            emoji: "🗺️", blurb: "Du souffle et des kilomètres", cover: "from-amber-300 via-orange-400 to-red-500" },
  { key: "histoire",          label: "Histoire",            emoji: "📜", blurb: "Révolutions, guerres, sociétés", cover: "from-stone-400 via-stone-600 to-neutral-800" },
  { key: "psychologique",     label: "Psychologique",       emoji: "🧠", blurb: "Les mécaniques intimes", cover: "from-indigo-300 via-purple-500 to-violet-700" },
  { key: "social",            label: "Social",              emoji: "⚒️", blurb: "Classes, travail, révoltes", cover: "from-orange-400 via-red-600 to-bordeaux" },
  { key: "voyage-initiatique",label: "Voyage initiatique",  emoji: "🧭", blurb: "Partir et se trouver", cover: "from-emerald-300 via-teal-500 to-cyan-700" },
  { key: "noir",              label: "Noir",                emoji: "🖤", blurb: "Crimes, errances, obsessions", cover: "from-neutral-700 via-zinc-800 to-black" },
  { key: "metaphysique",      label: "Métaphysique",        emoji: "✨", blurb: "Le sens, l'absurde, le sacré", cover: "from-sky-300 via-indigo-400 to-violet-600" },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUOTES — citations swipeables (courtes citations, usage pédagogique)
// ─────────────────────────────────────────────────────────────────────────────

export const QUOTES: Quote[] = [
  { id: "q-1",  bookId: "etranger",    text: "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas." },
  { id: "q-2",  bookId: "swann",       text: "Longtemps, je me suis couché de bonne heure." },
  { id: "q-3",  bookId: "pere-goriot", text: "À nous deux maintenant !", context: "Rastignac, dernières pages" },
  { id: "q-4",  bookId: "candide",     text: "Il faut cultiver notre jardin." },
  { id: "q-5",  bookId: "fleurs-mal",  text: "Je suis belle, ô mortels ! comme un rêve de pierre.", context: "La Beauté" },
  { id: "q-6",  bookId: "notre-dame",  text: "Ceci tuera cela.", context: "Livre V, ch. 2" },
  { id: "q-7",  bookId: "rouge-noir",  text: "Un roman est un miroir qui se promène sur une grande route." },
  { id: "q-8",  bookId: "bovary",      text: "Il fallait, par un effort, se ramener aux choses palpables." },
  { id: "q-9",  bookId: "liaisons",    text: "La guerre est déclarée.", context: "Merteuil à Valmont, lettre 153" },
  { id: "q-10", bookId: "germinal",    text: "Germinal ! germinal ! des graines levaient." },
  { id: "q-11", bookId: "bel-ami",     text: "Il faut être fort, plus fort que les autres. Quand on sait, on est fort." },
  { id: "q-12", bookId: "fleurs-mal",  text: "Anywhere out of the world — N'importe où, hors du monde.", context: "Petits Poèmes en prose" },
  { id: "q-13", bookId: "swann",       text: "Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux." },
  { id: "q-14", bookId: "etranger",    text: "J'ai senti alors que j'étais heureux, et que je l'étais encore." },
  { id: "q-15", bookId: "candide",     text: "Optimisme, c'est la rage de soutenir que tout est bien quand on est mal." },
  { id: "q-16", bookId: "voyage",      text: "Notre voyage à nous est entièrement imaginaire. Voilà sa force." },
  { id: "q-17", bookId: "voyage",      text: "La vérité de ce monde c'est la mort. Il faut choisir, mourir ou mentir." },
  { id: "q-18", bookId: "rouge-noir",  text: "L'hypocrisie était sa seule ressource.", context: "Julien à Verrières" },
  { id: "q-19", bookId: "bel-ami",     text: "On est emporté par des courants qu'on ne maîtrise pas." },
  { id: "q-20", bookId: "notre-dame",  text: "Les grands édifices, comme les grandes montagnes, sont l'ouvrage des siècles.", context: "Livre III, ch. 1" },
  { id: "q-21", bookId: "germinal",    text: "Le travail, ça ne doit pas être une peine. Ça doit être une joie.", context: "Étienne à Souvarine" },
  { id: "q-22", bookId: "pere-goriot", text: "Paris est un véritable océan. Jetez-y la sonde, vous n'en connaîtrez jamais la profondeur." },
  { id: "q-23", bookId: "bovary",      text: "Elle confondait, dans son désir, les sensualités du luxe avec les joies du cœur." },
  { id: "q-24", bookId: "liaisons",    text: "Il n'est pas de plus court chemin pour arriver à la tendresse que le dépit.", context: "Valmont à Merteuil" },
  { id: "q-25", bookId: "swann",       text: "Nous ne tremblons que pour nous, que pour ceux que nous aimons." },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGES — défis saisonniers
// ─────────────────────────────────────────────────────────────────────────────

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-tranchants",
    title: "Classiques tranchants",
    emoji: "🔪",
    tagline: "Trois chefs-d'œuvre courts qui frappent fort",
    description:
      "Le printemps est bref, les pages aussi. Trois classiques sous 250 pages qui vont te marquer en une semaine : L'Étranger, Candide, Les Liaisons dangereuses. Tranchant, drôle, vicieux.",
    season: "printemps",
    startsAt: "2026-03-20",
    endsAt: "2026-06-20",
    bookIds: ["etranger", "candide", "liaisons"],
    participants: 412,
    myProgress: 1,
    accent: "from-bordeaux via-red-700 to-orange-600",
  },
  {
    id: "ch-ete-noir",
    title: "Été noir",
    emoji: "🖤",
    tagline: "Juillet-août, temps sombre, lecture dense",
    description:
      "Trois romans qui t'empêcheront de dormir et qui valent bien une canicule : L'Étranger, Voyage au bout de la nuit, Les Fleurs du Mal. Noirceur radicale, prose lumineuse.",
    season: "ete",
    startsAt: "2026-07-01",
    endsAt: "2026-08-31",
    bookIds: ["etranger", "voyage", "fleurs-mal"],
    participants: 83,
    myProgress: 0,
    accent: "from-neutral-800 via-stone-900 to-black",
  },
  {
    id: "ch-naturalisme",
    title: "Le grand naturalisme",
    emoji: "⚒️",
    tagline: "Trois monuments du XIXe social",
    description:
      "Zola, Maupassant, Balzac : trois points de vue sur la machine sociale du XIXe. Germinal pour les mines, Bel-Ami pour la presse, Le Père Goriot pour la pension.",
    season: "automne",
    startsAt: "2026-09-01",
    endsAt: "2026-10-31",
    bookIds: ["germinal", "bel-ami", "pere-goriot"],
    participants: 146,
    myProgress: 2,
    accent: "from-orange-500 via-red-700 to-bordeaux",
  },
  {
    id: "ch-incipits",
    title: "Le tour des incipits",
    emoji: "📖",
    tagline: "Lis le premier paragraphe des 12 classiques Incipit",
    description:
      "Un défi sans fin : découvre les premiers paragraphes des 12 grands classiques présents sur Incipit. Trois minutes par jour, douze commencements iconiques. Après, tu choisis.",
    season: "intemporel",
    startsAt: "2026-01-01",
    endsAt: "2099-12-31",
    bookIds: [
      "etranger",
      "bovary",
      "germinal",
      "liaisons",
      "rouge-noir",
      "bel-ami",
      "notre-dame",
      "voyage",
      "candide",
      "pere-goriot",
      "fleurs-mal",
      "swann",
    ],
    participants: 1248,
    myProgress: 7,
    accent: "from-gold via-amber-500 to-orange-600",
  },
];

export const getChallenge = (id: string) => CHALLENGES.find((c) => c.id === id);

// ─────────────────────────────────────────────────────────────────────────────
// BADGES — rares et significatifs (3-4 max gagnés, pas 50 pour tout)
// ─────────────────────────────────────────────────────────────────────────────

export const BADGES: Badge[] = [
  {
    id: "b-premier-classique",
    label: "Premier classique",
    emoji: "🌱",
    description: "Tu as terminé ton premier grand classique sur Incipit.",
    earned: true,
    earnedAt: "2024-06-20",
    rarity: "commun",
  },
  {
    id: "b-germination",
    label: "Germination",
    emoji: "⚒️",
    description: "Tu as traversé Germinal jusqu'au bout. Respect.",
    earned: true,
    earnedAt: "2025-10-14",
    rarity: "rare",
  },
  {
    id: "b-absurde",
    label: "L'Absurde",
    emoji: "☀️",
    description: "Tu as lu L'Étranger et tu n'as pas pleuré.",
    earned: true,
    earnedAt: "2025-09-18",
    rarity: "rare",
  },
  {
    id: "b-trinite-balzac",
    label: "Trinité Balzac",
    emoji: "🏛️",
    description: "Trois romans de la Comédie humaine.",
    earned: false,
    rarity: "légendaire",
  },
  {
    id: "b-cycle-proust",
    label: "Cycle Proust",
    emoji: "🥐",
    description: "La Recherche du temps perdu, complète.",
    earned: false,
    rarity: "légendaire",
  },
  {
    id: "b-noctambule",
    label: "Lecteur nocturne",
    emoji: "🌙",
    description: "20 heures de lecture après minuit.",
    earned: false,
    rarity: "rare",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANNOTATIONS — passages surlignés + notes
// ─────────────────────────────────────────────────────────────────────────────

export const ANNOTATIONS: Annotation[] = [
  {
    id: "a-1",
    userId: "u-me",
    bookId: "etranger",
    excerpt: "J'ai senti alors que j'étais heureux, et que je l'étais encore.",
    note: "Cette phrase à quelques pages de la fin m'a mis une claque. Meursault heureux dans sa cellule. Tout le roman est ramassé là.",
    createdAt: "2025-09-17",
    public: true,
  },
  {
    id: "a-2",
    userId: "u-me",
    bookId: "germinal",
    excerpt:
      "Des hommes poussaient, une armée noire, vengeresse, qui germait lentement dans les sillons.",
    note: "La dernière page. Les grains sous la terre. La phrase la plus optimiste d'un livre dévastateur.",
    createdAt: "2025-10-14",
    public: true,
  },
  {
    id: "a-3",
    userId: "u-me",
    bookId: "bovary",
    excerpt: "Elle voulait en même temps mourir et habiter Paris.",
    note: "Tout Emma est dans cette phrase. Contradiction pure, désir et mort dans le même souffle.",
    createdAt: "2026-04-10",
    public: true,
  },
  {
    id: "a-4",
    userId: "u-nora",
    bookId: "fleurs-mal",
    excerpt: "Anywhere out of the world — N'importe où, hors du monde.",
    createdAt: "2026-03-25",
    public: true,
  },
];

export const getAnnotationsForBook = (bookId: string) =>
  ANNOTATIONS.filter((a) => a.bookId === bookId);

export const getAnnotationsByUser = (userId: string) =>
  ANNOTATIONS.filter((a) => a.userId === userId);

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATIONS — si tu as aimé X, tu aimeras Y
// ─────────────────────────────────────────────────────────────────────────────

export const RECOS: Recommendation[] = [
  { sourceBookId: "etranger",   targetBookId: "voyage",      reason: "Tu as aimé la solitude radicale de Meursault ? Bardamu va plus loin encore." },
  { sourceBookId: "etranger",   targetBookId: "candide",     reason: "Même ironie froide face au monde absurde, en version XVIIIe." },
  { sourceBookId: "germinal",   targetBookId: "pere-goriot", reason: "Le Paris de Balzac après les corons de Zola : même machine sociale, autre étage." },
  { sourceBookId: "germinal",   targetBookId: "bel-ami",     reason: "Le pendant urbain de la lutte des classes : l'arrivisme comme sport." },
  { sourceBookId: "bovary",     targetBookId: "rouge-noir",  reason: "Autre provincial dévoré par ses rêves — version masculine et bien plus cynique." },
  { sourceBookId: "bovary",     targetBookId: "liaisons",    reason: "Si Emma te fascine, Merteuil va te stupéfier. Femmes du désir, mais maîtresses." },
  { sourceBookId: "liaisons",   targetBookId: "bel-ami",     reason: "Autre prédateur de salon, cette fois au masculin." },
  { sourceBookId: "liaisons",   targetBookId: "rouge-noir",  reason: "Manipulation, sexe et ascension sociale — même roman un demi-siècle plus tard." },
  { sourceBookId: "rouge-noir", targetBookId: "bel-ami",     reason: "Julien Sorel et Georges Duroy : deux jumeaux, deux stratégies, même objectif." },
  { sourceBookId: "bel-ami",    targetBookId: "pere-goriot", reason: "Même Paris, même machine à broyer — Bel-Ami en sort vainqueur, Goriot non." },
  { sourceBookId: "notre-dame", targetBookId: "germinal",    reason: "Foules, décors massifs, souffle épique : deux grandes machines romanesques." },
  { sourceBookId: "voyage",     targetBookId: "etranger",    reason: "Même saloperie du siècle, autre rythme — Céline hurle, Camus soupire." },
  { sourceBookId: "voyage",     targetBookId: "fleurs-mal",  reason: "Poésie du spleen urbain — Bardamu aurait pu être personnage de Baudelaire." },
  { sourceBookId: "candide",    targetBookId: "etranger",    reason: "Satire philosophique contre absurde philosophique : deux façons de rire du pire." },
  { sourceBookId: "pere-goriot",targetBookId: "bovary",      reason: "L'argent qui dévore, la province contre Paris, l'ambition blessée." },
  { sourceBookId: "fleurs-mal", targetBookId: "voyage",      reason: "Paris sombre, maladies, insomnies. Céline en a gardé quelque chose." },
  { sourceBookId: "fleurs-mal", targetBookId: "swann",       reason: "Même Paris, même mélancolie — mais la phrase proustienne berce là où Baudelaire cogne." },
  { sourceBookId: "swann",      targetBookId: "bovary",      reason: "Deux grands romans de l'amour malade. Flaubert est le maître de Proust." },
  { sourceBookId: "swann",      targetBookId: "fleurs-mal",  reason: "Proust cite Baudelaire à chaque page — commence par le recueil." },
];

export const getRecosForBook = (bookId: string) =>
  RECOS.filter((r) => r.sourceBookId === bookId);

// ─────────────────────────────────────────────────────────────────────────────
// READING SESSIONS — historique de lecture (pour stats intimes)
// ─────────────────────────────────────────────────────────────────────────────

export const READING_SESSIONS: ReadingSession[] = [
  // 30 derniers jours pour Guillaume
  { date: "2026-04-19", minutes: 42, bookId: "bovary" },
  { date: "2026-04-18", minutes: 28, bookId: "bovary" },
  { date: "2026-04-17", minutes: 55, bookId: "bovary" },
  { date: "2026-04-16", minutes: 0,  bookId: "bovary" },
  { date: "2026-04-15", minutes: 33, bookId: "bovary" },
  { date: "2026-04-14", minutes: 21, bookId: "bovary" },
  { date: "2026-04-13", minutes: 48, bookId: "bovary" },
  { date: "2026-04-12", minutes: 60, bookId: "bovary" },
  { date: "2026-04-11", minutes: 0,  bookId: "bovary" },
  { date: "2026-04-10", minutes: 40, bookId: "bovary" },
  { date: "2026-04-09", minutes: 25, bookId: "bovary" },
  { date: "2026-04-08", minutes: 30, bookId: "bovary" },
  { date: "2026-04-07", minutes: 45, bookId: "bovary" },
  { date: "2026-04-06", minutes: 50, bookId: "bovary" },
  { date: "2026-04-05", minutes: 0,  bookId: "bovary" },
  { date: "2026-04-04", minutes: 22, bookId: "bovary" },
  { date: "2026-04-03", minutes: 38, bookId: "bovary" },
  { date: "2026-04-02", minutes: 45, bookId: "bovary" },
  { date: "2026-04-01", minutes: 31, bookId: "bovary" },
  { date: "2026-03-31", minutes: 19, bookId: "bovary" },
  { date: "2026-03-30", minutes: 27, bookId: "bovary" },
  { date: "2026-03-29", minutes: 15, bookId: "bovary" },
  { date: "2026-03-28", minutes: 0,  bookId: "bovary" },
  { date: "2026-03-27", minutes: 0,  bookId: "bovary" },
  { date: "2026-03-26", minutes: 0,  bookId: "bovary" },
  { date: "2026-03-25", minutes: 18, bookId: "germinal" },
  { date: "2026-03-24", minutes: 34, bookId: "germinal" },
  { date: "2026-03-23", minutes: 27, bookId: "germinal" },
  { date: "2026-03-22", minutes: 52, bookId: "germinal" },
  { date: "2026-03-21", minutes: 41, bookId: "germinal" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BUDDY READS
// ─────────────────────────────────────────────────────────────────────────────

export const BUDDY_READS: BuddyRead[] = [
  {
    id: "buddy-bovary",
    bookId: "bovary",
    startedAt: "2026-03-28",
    participants: [
      { userId: "u-me",    progress: 42 },
      { userId: "u-lise",  progress: 68 },
      { userId: "u-karim", progress: 35 },
    ],
    messages: [
      {
        id: "m-1",
        userId: "u-lise",
        atProgress: 28,
        text: "Le bal de la Vaubyessard est LE moment où tout bascule. Elle rentre chez elle et elle sait qu'elle peut pas continuer cette vie.",
        createdAt: "2026-04-02T21:30:00",
      },
      {
        id: "m-2",
        userId: "u-me",
        atProgress: 31,
        text: "Complètement d'accord. Je viens de le lire. Elle ramasse le porte-cigare du Vicomte comme une relique, c'est tragicomique.",
        createdAt: "2026-04-03T08:15:00",
      },
      {
        id: "m-3",
        userId: "u-karim",
        atProgress: 35,
        text: "Je suis en retard sur vous. Pas de spoilers ! Je commence juste la partie II.",
        createdAt: "2026-04-10T23:45:00",
      },
      {
        id: "m-4",
        userId: "u-lise",
        atProgress: 68,
        text: "Attention Karim, arrivé à la pharmacie Homais tu vas halluciner sur le personnage, c'est pure caricature.",
        createdAt: "2026-04-15T19:20:00",
      },
    ],
  },
];

export const getBuddyForBook = (bookId: string) =>
  BUDDY_READS.find((b) => b.bookId === bookId);

// ─────────────────────────────────────────────────────────────────────────────
// LIBRAIRES — mocks (géoloc plus tard via l'API place-des-libraires)
// ─────────────────────────────────────────────────────────────────────────────

// Panel de 20 libraires indépendantes à travers la France, avec code postal
// principal. Utilisé par /book/[id] pour une géolocalisation simple : on
// fait matcher les deux premiers chiffres du code postal saisi par le
// lecteur. Pas d'API, pas de tracking — juste une liste éditoriale tenue
// à jour à la main. Demandé par Jean-Baptiste (panel v7).
export const LIBRAIRIES: Librairie[] = [
  // ── Paris
  { name: "Librairie Delamain",       distanceKm: 0.8, city: "Paris 1ᵉʳ",  postalCode: "75001", url: "https://www.librairie-delamain.com" },
  { name: "L'Écume des pages",        distanceKm: 1.4, city: "Paris 6ᵉ",   postalCode: "75006", url: "https://www.ecumedespages.com" },
  { name: "Tschann",                  distanceKm: 1.8, city: "Paris 6ᵉ",   postalCode: "75006", url: "https://www.tschann.fr" },
  { name: "La Petite Égypte",         distanceKm: 2.6, city: "Paris 2ᵉ",   postalCode: "75002", url: "https://www.lapetiteegypte.fr" },
  { name: "Comme un roman",           distanceKm: 3.4, city: "Paris 3ᵉ",   postalCode: "75003", url: "https://www.commeunroman.com" },
  { name: "Le Phare",                 distanceKm: 4.1, city: "Montreuil",  postalCode: "93100", url: "https://www.librairielephare.fr" },
  // ── Île-de-France / Grand Ouest
  { name: "Librairie Gibert",         distanceKm: 0,   city: "Nantes",     postalCode: "44000", url: "https://www.gibert.com" },
  { name: "Librairie L'Atalante",     distanceKm: 0,   city: "Nantes",     postalCode: "44000", url: "https://www.librairie-latalante.fr" },
  { name: "Librairie Le Divan",       distanceKm: 0,   city: "Paris 15ᵉ",  postalCode: "75015", url: "https://www.librairie-ledivan.com" },
  // ── Sud-Ouest
  { name: "Mollat",                   distanceKm: 0,   city: "Bordeaux",   postalCode: "33000", url: "https://www.mollat.com" },
  { name: "La Machine à Lire",        distanceKm: 0,   city: "Bordeaux",   postalCode: "33000", url: "https://www.machinealire.com" },
  { name: "Ombres Blanches",          distanceKm: 0,   city: "Toulouse",   postalCode: "31000", url: "https://www.ombres-blanches.fr" },
  // ── Est
  { name: "Librairie Kléber",         distanceKm: 0,   city: "Strasbourg", postalCode: "67000", url: "https://www.librairie-kleber.com" },
  { name: "Le Hall du Livre",         distanceKm: 0,   city: "Nancy",      postalCode: "54000", url: "https://www.halldulivre.com" },
  // ── Sud-Est
  { name: "Le Bleuet",                distanceKm: 0,   city: "Banon",      postalCode: "04150", url: "https://www.lebleuet.fr" },
  { name: "La Maison des Passages",   distanceKm: 0,   city: "Lyon 5ᵉ",    postalCode: "69005", url: "https://www.maisondespassages.com" },
  // ── Nord
  { name: "Le Furet du Nord",         distanceKm: 0,   city: "Lille",      postalCode: "59000", url: "https://www.furet.com" },
  // ── Bretagne / Normandie
  { name: "Dialogues",                distanceKm: 0,   city: "Brest",      postalCode: "29200", url: "https://www.librairiedialogues.fr" },
  { name: "L'Armitière",              distanceKm: 0,   city: "Rouen",      postalCode: "76000", url: "https://www.armitiere.com" },
  // ── Outre-mer
  { name: "Présence Kréol",           distanceKm: 0,   city: "Saint-Denis", postalCode: "97400", url: "https://www.presencekreol.com" },
];

/**
 * Retourne la librairie la plus "proche" d'un code postal saisi.
 * Match simple :
 *  1. même code postal exact
 *  2. sinon, même département (2 premiers chiffres)
 *  3. sinon, même région (1er chiffre)
 *  4. sinon, 3 par défaut (Paris / Toulouse / Lyon)
 * Pas d'API, pas de géoloc réelle — c'est pour donner une direction
 * prescriptive, pas un GPS.
 */
export function findLibrairiesByPostalCode(postalCode: string, limit = 3): Librairie[] {
  const normalized = (postalCode || "").trim().replace(/\s+/g, "");
  if (!/^\d{5}$/.test(normalized)) {
    return LIBRAIRIES.slice(0, limit);
  }
  const dep = normalized.slice(0, 2);
  const region = normalized.slice(0, 1);

  const exact = LIBRAIRIES.filter((l) => l.postalCode === normalized);
  if (exact.length >= limit) return exact.slice(0, limit);

  const byDep = LIBRAIRIES.filter(
    (l) => l.postalCode?.startsWith(dep) && !exact.includes(l)
  );
  const combined1 = [...exact, ...byDep];
  if (combined1.length >= limit) return combined1.slice(0, limit);

  const byRegion = LIBRAIRIES.filter(
    (l) =>
      l.postalCode?.startsWith(region) &&
      !combined1.includes(l)
  );
  const combined2 = [...combined1, ...byRegion];
  if (combined2.length >= limit) return combined2.slice(0, limit);

  const fillers = LIBRAIRIES.filter((l) => !combined2.includes(l));
  return [...combined2, ...fillers].slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// RECAP BLOCKS — mode "je reprends"
// ─────────────────────────────────────────────────────────────────────────────

export const RECAPS: RecapBlock[] = [
  {
    bookId: "bovary",
    upToChapter: "Partie II, ch. 8",
    summary:
      "Précédemment à Yonville… Emma s'ennuie ferme. Charles l'a emmenée voir un opéra à Rouen, où elle a recroisé Léon, le clerc de notaire. Entre les deux, la tension est palpable. Le Vicomte est un souvenir qui s'estompe. Rodolphe Boulanger, le hobereau local, a commencé à tourner autour d'Emma aux comices agricoles — scène magistrale où Flaubert coupe ses déclarations avec les annonces du jury. À la page où tu reprends, Rodolphe vient de la séduire pour la première fois dans la forêt.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// KEY PASSAGES — "Passages clés"
// 3 à 5 extraits authentiques par livre (domaine public, droit de courte
// citation art. L.122-5 CPI), présentés avec un pitch de mise en contexte.
// Le principe : tu lis du vrai Zola, pas du Zola remâché, mais on
// t'accompagne. C'est le coeur éditorial d'Incipit.
// ─────────────────────────────────────────────────────────────────────────────

export const KEY_PASSAGES: KeyPassage[] = [
  // ─── L'Étranger ──
  {
    id: "kp-etranger-1",
    bookId: "etranger",
    order: 1,
    title: "Le télégramme qui ne fait rien",
    context:
      "Ouverture du roman. Meursault vient d'apprendre la mort de sa mère. Tout le roman tient déjà dans ces trois lignes : Camus te colle le héros sous les yeux, et tu ne sais pas encore si c'est un monstre ou un saint. Tu trancheras.",
    excerpt:
      "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. J'ai reçu un télégramme de l'asile : « Mère décédée. Enterrement demain. Sentiments distingués. » Cela ne veut rien dire. C'était peut-être hier.",
    chapter: "Partie I, ch. 1",
    readingMinutes: 1,
  },
  {
    id: "kp-etranger-2",
    bookId: "etranger",
    order: 2,
    title: "Le coup de feu sur la plage",
    context:
      "Plein soleil, sur la plage d'Alger. Meursault croise l'Arabe. Aucune logique, aucune haine personnelle — juste la chaleur, la lumière, un corps qui appuie. C'est LA scène pivot du roman, celle qui fait basculer tout le reste.",
    excerpt:
      "C'est alors que tout a vacillé. La mer a charrié un souffle épais et ardent. Il m'a semblé que le ciel s'ouvrait sur toute son étendue pour laisser pleuvoir du feu. Tout mon être s'est tendu et j'ai crispé ma main sur le revolver. La gâchette a cédé.",
    chapter: "Partie I, ch. 6",
    readingMinutes: 1,
  },
  {
    id: "kp-etranger-3",
    bookId: "etranger",
    order: 3,
    title: "La tendre indifférence du monde",
    context:
      "Dernières pages. Meursault attend la guillotine. Il vient d'exploser contre l'aumônier. Puis il se calme et livre la phrase finale — une des plus belles fins de tout le XXe siècle. Lis-la lentement.",
    excerpt:
      "Comme si cette grande colère m'avait purgé du mal, vidé d'espoir, devant cette nuit chargée de signes et d'étoiles, je m'ouvrais pour la première fois à la tendre indifférence du monde. De l'éprouver si pareil à moi, si fraternel enfin, j'ai senti que j'avais été heureux, et que je l'étais encore.",
    chapter: "Partie II, ch. 5",
    readingMinutes: 1,
  },

  // ─── Madame Bovary ──
  {
    id: "kp-bovary-1",
    bookId: "bovary",
    order: 1,
    title: "La casquette de Charles",
    context:
      "Première scène. Un gamin entre au collège avec une casquette ridicule. C'est Charles Bovary — le futur mari d'Emma. Flaubert consacre un paragraphe entier à cette coiffure. Tu penses qu'il se moque ? Il pose tout le livre : le sérieux raté, la laideur sociale, le détail qui tue.",
    excerpt:
      "C'était une de ces coiffures d'ordre composite, où l'on retrouve les éléments du bonnet à poil, du chapska, du chapeau rond, de la casquette de loutre et du bonnet de coton, une de ces pauvres choses, enfin, dont la laideur muette a des profondeurs d'expression comme le visage d'un imbécile.",
    chapter: "Partie I, ch. 1",
    readingMinutes: 1,
  },
  {
    id: "kp-bovary-2",
    bookId: "bovary",
    order: 2,
    title: "Les comices agricoles",
    context:
      "Scène d'anthologie. Rodolphe drague Emma au premier étage de la mairie. En bas, le jury des comices distribue les prix aux vaches et aux fumiers. Flaubert alterne les deux — déclarations passionnées / primes de bétail. Le premier montage alterné de la littérature.",
    excerpt:
      "— Cent fois même j'ai voulu partir, et je vous ai suivie, je suis resté. — Fumiers. — Comme je resterais ce soir, demain, les autres jours, toute ma vie ! — À M. Caron d'Argueil, une médaille d'or ! — Car jamais je n'ai trouvé dans la société de personne un charme aussi complet.",
    chapter: "Partie II, ch. 8",
    readingMinutes: 2,
  },
  {
    id: "kp-bovary-3",
    bookId: "bovary",
    order: 3,
    title: "L'arsenic",
    context:
      "Emma est criblée de dettes, ses amants l'ont lâchée. Elle file chez le pharmacien Homais et avale de l'arsenic. La description de l'agonie est clinique, insupportable. Flaubert a écrit cette scène en pleurant, paraît-il.",
    excerpt:
      "Bientôt elle vomit du sang. Ses lèvres se serrèrent davantage. Elle avait les membres crispés, le corps couvert de taches brunes, et son pouls glissait sous les doigts comme un fil tendu, comme une corde de harpe près de se rompre.",
    chapter: "Partie III, ch. 8",
    readingMinutes: 1,
  },

  // ─── Germinal ──
  {
    id: "kp-germinal-1",
    bookId: "germinal",
    order: 1,
    title: "La descente au Voreux",
    context:
      "Étienne Lantier arrive dans le Nord, sans boulot. On lui propose de descendre au fond. Zola te fait descendre avec lui dans la cage, 554 mètres sous terre. C'est une plongée aux enfers. Garde ton souffle.",
    excerpt:
      "Et, brusquement, lorsqu'il quitta les roches ténébreuses du puits, il fut inondé d'une vive clarté. La cage venait de s'arrêter. Il se trouvait à l'accrochage, une vaste salle taillée dans le roc, voûtée d'une maçonnerie de briques, éclairée par trois grosses lampes à feu libre.",
    chapter: "Partie I, ch. 3",
    readingMinutes: 1,
  },
  {
    id: "kp-germinal-2",
    bookId: "germinal",
    order: 2,
    title: "La grève, le cri de la horde",
    context:
      "La colère monte. Les mineurs marchent sur les puits voisins pour les fermer. Zola filme une foule qu'on dirait préhistorique. Personne n'a jamais décrit la colère ouvrière avec cette force-là. Lecture obligatoire.",
    excerpt:
      "Les femmes avaient paru, près d'un millier de femmes, aux cheveux épars, dépeignés par la course, aux guenilles montrant la peau nue, des nudités de femelles lasses d'enfanter des meurt-de-faim. Quelques-unes tenaient leur petit entre les bras, le soulevaient, l'agitaient, ainsi qu'un drapeau de deuil et de vengeance.",
    chapter: "Partie V, ch. 5",
    readingMinutes: 1,
  },
  {
    id: "kp-germinal-3",
    bookId: "germinal",
    order: 3,
    title: "La dernière phrase",
    context:
      "Étienne quitte le Nord, la grève a échoué, les morts sont enterrés. Il marche vers Paris. Zola clôt le roman sur une image agricole — la germination. C'est de là que vient le titre. Une des plus belles fins de roman du XIXe.",
    excerpt:
      "Des hommes poussaient, une armée noire, vengeresse, qui germait lentement dans les sillons, grandissant pour les récoltes du siècle futur, et dont la germination allait faire bientôt éclater la terre.",
    chapter: "Partie VII, ch. 6",
    readingMinutes: 1,
  },

  // ─── Les Liaisons dangereuses ──
  {
    id: "kp-liaisons-1",
    bookId: "liaisons",
    order: 1,
    title: "Merteuil déclare la guerre",
    context:
      "Lettre 81. La marquise de Merteuil explique à Valmont comment elle s'est fabriquée, seule, contre une société qui écrase les femmes. Le manifeste féministe le plus glaçant du XVIIIe siècle — et il sort de la bouche d'une garce.",
    excerpt:
      "Que m'offrirez-vous qui puisse compenser ? Descendue dans mon coeur, j'y ai étudié celui des autres. J'y ai vu qu'il n'est personne qui n'y conserve un secret qu'il lui importe qui ne soit point dévoilé. Née pour venger mon sexe et maîtriser le vôtre, j'avais su me créer des moyens inconnus jusqu'à moi.",
    chapter: "Lettre 81",
    readingMinutes: 2,
  },
  {
    id: "kp-liaisons-2",
    bookId: "liaisons",
    order: 2,
    title: "« Ce n'est pas ma faute »",
    context:
      "Valmont rompt avec Mme de Tourvel en dictant une lettre Atroce. Chaque paragraphe se termine par la même formule, glaçante. L'arme rhétorique la plus cruelle de toute la littérature française.",
    excerpt:
      "On s'ennuie de tout, mon Ange, c'est une Loi de la Nature ; ce n'est pas ma faute. Si donc je m'ennuie aujourd'hui d'une aventure qui m'a occupé entièrement depuis quatre mortels mois, ce n'est pas ma faute.",
    chapter: "Lettre 141",
    readingMinutes: 1,
  },
  {
    id: "kp-liaisons-3",
    bookId: "liaisons",
    order: 3,
    title: "La chute de Merteuil",
    context:
      "Dernière lettre du roman. Mme de Volanges décrit la marquise ravagée par la petite vérole, défigurée, démasquée publiquement. Le châtiment des manipulateurs. Laclos ne fait pas de cadeau.",
    excerpt:
      "La maladie dont elle a été attaquée a été une petite vérole confluente et de la plus mauvaise espèce. On peut dire, à la vérité, qu'elle a été heureuse d'en mourir ; mais elle en est restée affreusement défigurée, et surtout elle a perdu un oeil.",
    chapter: "Lettre 175",
    readingMinutes: 1,
  },

  // ─── Le Rouge et le Noir ──
  {
    id: "kp-rouge-1",
    bookId: "rouge-noir",
    order: 1,
    title: "La main de Mme de Rênal",
    context:
      "Premier geste amoureux du roman. Julien s'impose de prendre la main de Mme de Rênal avant que dix heures ne sonnent — comme un défi militaire à lui-même. Stendhal transforme la drague en bataille napoléonienne.",
    excerpt:
      "Sur les dix heures moins quelques minutes, il jeta les yeux sur la pendule. Il fallait saisir cette main. Il prit enfin cette main, qui lui fut abandonnée, mais sans qu'on parût songer à lui. Des chevaux de la voiture faisaient du bruit dans l'écurie.",
    chapter: "Livre I, ch. 8",
    readingMinutes: 1,
  },
  {
    id: "kp-rouge-2",
    bookId: "rouge-noir",
    order: 2,
    title: "Les coups de pistolet à l'église",
    context:
      "Julien a appris que Mme de Rênal l'a dénoncé à Mathilde. Il retourne à Verrières, achète deux pistolets, entre dans l'église pendant la messe et tire. Scène foudroyante, coupée net. Stendhal déjà cinématographe.",
    excerpt:
      "L'élévation sonna ; tout le monde baissa la tête. Julien n'eut plus que la peine de la reconnaître sous la mante, qu'elle portait avec grâce. Il la vit un peu penchée en avant et absorbée par la prière. Son bras trembla, et il lâcha le coup et la manqua ; il tira un second coup, elle tomba.",
    chapter: "Livre II, ch. 35",
    readingMinutes: 1,
  },
  {
    id: "kp-rouge-3",
    bookId: "rouge-noir",
    order: 3,
    title: "Le discours au tribunal",
    context:
      "Julien sait qu'il va mourir. Face aux jurés, il craque et balance la vérité nue : il n'est pas jugé pour un meurtre, mais pour un crime social — avoir été un pauvre qui a osé viser haut. Le vrai testament du livre.",
    excerpt:
      "Messieurs, je n'ai point l'honneur d'appartenir à votre classe, vous voyez en moi un paysan qui s'est révolté contre la bassesse de sa fortune. Mais, quand je serais moins coupable, je vois des hommes qui voudront punir en moi et décourager à jamais cette classe de jeunes gens qui, nés dans une classe inférieure, ont eu le bonheur de se procurer une bonne éducation.",
    chapter: "Livre II, ch. 41",
    readingMinutes: 2,
  },

  // ─── Bel-Ami ──
  {
    id: "kp-belami-1",
    bookId: "bel-ami",
    order: 1,
    title: "Trois francs quarante",
    context:
      "Première page. Georges Duroy compte sa monnaie sur un boulevard parisien. Trois francs quarante dans la poche, la bouche qui cherche une bière. Maupassant installe le héros en deux phrases : un affamé qui va tout dévorer.",
    excerpt:
      "Quand la caissière lui eut rendu la monnaie de sa pièce de cent sous, Georges Duroy sortit du restaurant. Comme il portait beau, par nature et par pose d'ancien sous-officier, il cambra sa taille, frisa sa moustache d'un geste militaire et familier, et jeta sur les dîneurs attardés un regard rapide et circulaire.",
    chapter: "Partie I, ch. 1",
    readingMinutes: 1,
  },
  {
    id: "kp-belami-2",
    bookId: "bel-ami",
    order: 2,
    title: "L'article de Madeleine",
    context:
      "Duroy est censé écrire une chronique. Il est incapable d'aligner trois phrases. Madeleine Forestier la lui dicte en dix minutes. Toute l'imposture du personnage est dans cette scène — sa carrière est faite sur le dos des femmes qu'il baise.",
    excerpt:
      "Elle relevait de temps en temps la tête et regardait pensivement au plafond, puis elle reprenait son travail en écrivant sans hésitation, comme si les phrases lui venaient toutes faites dans l'esprit, coulaient d'elles-mêmes sur le papier.",
    chapter: "Partie I, ch. 4",
    readingMinutes: 1,
  },
  {
    id: "kp-belami-3",
    bookId: "bel-ami",
    order: 3,
    title: "La Madeleine — mariage triomphal",
    context:
      "Dernière page. Duroy épouse la fille de son patron, on le bénit à la Madeleine, tout Paris défile. Maupassant finit sur une pique grinçante : le héros pense déjà à son prochain coup politique. La fin la plus cynique du XIXe.",
    excerpt:
      "Et Georges Du Roy, descendant les marches avec lenteur, pensait à sa prochaine candidature à la députation de Rouen. Il ne voyait plus personne : il ne pensait qu'à lui.",
    chapter: "Partie II, ch. 10",
    readingMinutes: 1,
  },

  // ─── Notre-Dame de Paris ──
  {
    id: "kp-notre-dame-1",
    bookId: "notre-dame",
    order: 1,
    title: "Esmeralda danse sur le parvis",
    context:
      "Premier aperçu de l'héroïne. Hugo filme la scène comme un spot publicitaire — torches, foule, chèvre, danseuse. Tu comprends pourquoi tout le monde va tomber amoureux d'elle.",
    excerpt:
      "Autour d'un grand feu qui brûlait sur le pavé, une jeune fille dansait. C'était une créature si surnaturelle qu'en ce moment Gringoire lui-même ne savait si c'était une femme, une fée, ou un ange. Elle n'était pas grande, mais elle le semblait, tant sa taille fine s'élançait hardiment.",
    chapter: "Livre II, ch. 3",
    readingMinutes: 1,
  },
  {
    id: "kp-notre-dame-2",
    bookId: "notre-dame",
    order: 2,
    title: "Asile ! Asile !",
    context:
      "Esmeralda va être pendue. Quasimodo saute du haut de la cathédrale, l'arrache au bourreau, la monte dans les tours et hurle le mot qui tétanise tout le monde : asile. Scène qui a marqué toute la littérature française.",
    excerpt:
      "Au moment même où ils la touchaient, un grand cri s'éleva du haut de la façade. Le sourd, courbé sur le parapet, avec des yeux enflammés, dévorait la place du regard. Il venait d'apercevoir les deux soldats qui saisissaient l'égyptienne. Il tomba sur eux et les roula à terre avec la rapidité d'un tigre.",
    chapter: "Livre VIII, ch. 6",
    readingMinutes: 1,
  },
  {
    id: "kp-notre-dame-3",
    bookId: "notre-dame",
    order: 3,
    title: "Les deux squelettes de Montfaucon",
    context:
      "Des années plus tard, on retrouve deux squelettes enlacés dans le charnier. L'un autour du cou de l'autre. Quand on les sépare, ils tombent en poussière. Hugo ne signe pas : il te laisse comprendre. Fin ravageuse.",
    excerpt:
      "L'un de ces squelettes, qui était celui d'une femme, avait encore quelques lambeaux de robe d'une étoffe qui avait été blanche, et l'on voyait autour de son cou un collier de grains d'adrézarach. Quant à l'autre squelette qui tenait celui-ci étroitement embrassé, c'était un squelette d'homme. Quand on voulut le détacher de celui qu'il embrassait, il tomba en poussière.",
    chapter: "Livre XI, ch. 4",
    readingMinutes: 1,
  },

  // ─── Voyage au bout de la nuit ──
  {
    id: "kp-voyage-1",
    bookId: "voyage",
    order: 1,
    title: "La place Clichy",
    context:
      "Première page, un dialogue. Bardamu et Arthur Ganate au café, mai 1914. Un régiment passe, un colonel les salue, Bardamu part à la guerre sur un coup de tête. Céline te colle un cadeau empoisonné dès la deuxième phrase.",
    excerpt:
      "Ça a débuté comme ça. Moi, j'avais jamais rien dit. Rien. C'est Arthur Ganate qui m'a fait parler. Arthur, un étudiant, un carabin lui aussi, un camarade. On se rencontre donc place Clichy. C'était après le déjeuner. Il veut me parler.",
    chapter: "Incipit",
    readingMinutes: 1,
  },
  {
    id: "kp-voyage-2",
    bookId: "voyage",
    order: 2,
    title: "La guerre, scène inaugurale",
    context:
      "Bardamu est en mission. Un obus tombe, tout explose, il comprend d'un coup. Céline invente une langue pour dire la terreur : phrases qui halètent, ponctuation en miettes. La scène qui a fait basculer le roman français moderne.",
    excerpt:
      "Je n'avais pas jusqu'alors pensé qu'au feu on tirât pour de bon. Ah ! Mais si, ils tiraient ! J'étais donc devenu lâche en somme ? Entre les morceaux de fer et de lumière, on n'y voyait plus rien. On se couchait pour ne pas voir. Ça ne servait à rien quand même.",
    chapter: "Partie I",
    readingMinutes: 1,
  },
  {
    id: "kp-voyage-3",
    bookId: "voyage",
    order: 3,
    title: "« Qu'on n'en parle plus »",
    context:
      "Dernière ligne du livre. Bardamu a vu mourir Robinson, son double noir. Il sort dans Paris, marche, et clôt sur une phrase qui tient tout le roman : l'épuisement absolu. Une des plus grandes fins de la littérature mondiale.",
    excerpt:
      "De loin, le remorqueur a sifflé ; son appel a passé le pont, encore une arche, une autre, l'écluse, un autre pont, loin, plus loin… Il appelait vers lui toutes les péniches du fleuve toutes, et la ville entière, et le ciel et la campagne, et nous, tout qu'il emmenait, la Seine aussi, tout, qu'on n'en parle plus.",
    chapter: "Explicit",
    readingMinutes: 1,
  },

  // ─── Candide ──
  {
    id: "kp-candide-1",
    bookId: "candide",
    order: 1,
    title: "Le coup de pied au cul",
    context:
      "Chapitre 1. Candide embrasse Cunégonde derrière un paravent. Le baron les voit et expulse Candide à grands coups de pied au cul. Voltaire fait tenir tout le moteur du livre dans ces trois paragraphes : le monde est déréglé, on t'éjecte.",
    excerpt:
      "Monsieur le baron de Thunder-ten-tronckh passa auprès du paravent, et voyant cette cause et cet effet, chassa Candide du château à grands coups de pied dans le derrière. Cunégonde s'évanouit : elle fut souffletée par madame la baronne dès qu'elle fut revenue à elle-même.",
    chapter: "Chapitre 1",
    readingMinutes: 1,
  },
  {
    id: "kp-candide-2",
    bookId: "candide",
    order: 2,
    title: "L'esclave de Surinam",
    context:
      "Chapitre 19. Candide rencontre un esclave noir mutilé dans la canne à sucre. La scène la plus politique du livre — Voltaire arrête de rigoler cinq minutes et colle un uppercut moral à l'Europe coloniale.",
    excerpt:
      "— Quand nous travaillons aux sucreries, et que la meule nous attrape le doigt, on nous coupe la main ; quand nous voulons nous enfuir, on nous coupe la jambe : je me suis trouvé dans les deux cas. C'est à ce prix que vous mangez du sucre en Europe.",
    chapter: "Chapitre 19",
    readingMinutes: 1,
  },
  {
    id: "kp-candide-3",
    bookId: "candide",
    order: 3,
    title: "Cultiver notre jardin",
    context:
      "Dernière phrase du conte. Après avoir fait le tour du monde et du pire, Candide trouve le bon mot. Six mots qui ont traversé les siècles. Tu devrais les tatouer quelque part.",
    excerpt:
      "— Cela est bien dit, répondit Candide, mais il faut cultiver notre jardin.",
    chapter: "Chapitre 30",
    readingMinutes: 1,
  },

  // ─── Le Père Goriot ──
  {
    id: "kp-goriot-1",
    bookId: "pere-goriot",
    order: 1,
    title: "La pension Vauquer",
    context:
      "Ouverture. Balzac décrit la pension bourgeoise où va se jouer le drame. Tu crois que c'est du décor ? C'est l'âme des personnages. Chaque meuble prédit une trahison. Lis-le comme une carte au trésor.",
    excerpt:
      "Cette pièce exhale une odeur sans nom dans la langue, et qu'il faudrait appeler l'odeur de pension. Elle sent le renfermé, le moisi, le rance ; elle donne froid, elle est humide au nez, elle pénètre les vêtements ; elle a le goût d'une salle où l'on a dîné ; elle pue le service, l'office, l'hospice.",
    chapter: "Une pension bourgeoise",
    readingMinutes: 2,
  },
  {
    id: "kp-goriot-2",
    bookId: "pere-goriot",
    order: 2,
    title: "Vautrin pose le contrat",
    context:
      "Le forçat évadé Vautrin propose à Rastignac un deal diabolique : séduire une héritière, se débarrasser de son frère, devenir riche d'un coup. Le monologue le plus cynique de Balzac — et c'est dans Balzac, donc c'est du niveau boss.",
    excerpt:
      "Savez-vous comment on fait son chemin ici ? par l'éclat du génie ou par l'adresse de la corruption. Il faut entrer dans cette masse d'hommes comme un boulet de canon, ou s'y glisser comme une peste. L'honnêteté ne sert à rien.",
    chapter: "L'entrée dans le monde",
    readingMinutes: 2,
  },
  {
    id: "kp-goriot-3",
    bookId: "pere-goriot",
    order: 3,
    title: "« À nous deux, Paris ! »",
    context:
      "Dernière ligne du roman. Père Goriot est enterré, ses filles n'ont pas daigné venir. Rastignac, du haut du Père-Lachaise, regarde la ville et balance son cri de guerre. Naissance d'un héros balzacien — en quatre mots.",
    excerpt:
      "Et pour premier acte du défi qu'il portait à la Société, Rastignac alla dîner chez madame de Nucingen.",
    chapter: "La mort du père",
    readingMinutes: 1,
  },

  // ─── Les Fleurs du Mal ──
  {
    id: "kp-fleurs-1",
    bookId: "fleurs-mal",
    order: 1,
    title: "« Hypocrite lecteur »",
    context:
      "Poème liminaire. Baudelaire ouvre son recueil en t'accusant, toi, de tout ce que le livre va raconter. C'est cash, c'est frontal, et c'est une des adresses au lecteur les plus célèbres de la poésie française.",
    excerpt:
      "— Hypocrite lecteur, — mon semblable, — mon frère !",
    chapter: "Au lecteur",
    readingMinutes: 1,
  },
  {
    id: "kp-fleurs-2",
    bookId: "fleurs-mal",
    order: 2,
    title: "L'Albatros",
    context:
      "Le poète est comme l'albatros : sublime dans les airs, ridicule sur le pont des marins. Métaphore simple, évidente, et pourtant elle continue de fonctionner 170 ans plus tard. À connaître par cœur, sincèrement.",
    excerpt:
      "Ce voyageur ailé, comme il est gauche et veule ! Lui, naguère si beau, qu'il est comique et laid ! L'un agace son bec avec un brûle-gueule, L'autre mime, en boitant, l'infirme qui volait !",
    chapter: "Spleen et Idéal, II",
    readingMinutes: 1,
  },
  {
    id: "kp-fleurs-3",
    bookId: "fleurs-mal",
    order: 3,
    title: "À une passante",
    context:
      "Sonnet légendaire. Baudelaire croise une femme en deuil dans la rue, leurs regards se touchent, elle disparaît. Le tout en 14 vers. Le premier texte qui a dit la ville moderne — les amours ratés en deux secondes.",
    excerpt:
      "Un éclair… puis la nuit ! — Fugitive beauté Dont le regard m'a fait soudainement renaître, Ne te verrai-je plus que dans l'éternité ? Ailleurs, bien loin d'ici ! trop tard ! jamais peut-être !",
    chapter: "Tableaux parisiens, XCIII",
    readingMinutes: 1,
  },

  // ─── Du côté de chez Swann ──
  {
    id: "kp-swann-1",
    bookId: "swann",
    order: 1,
    title: "Longtemps je me suis couché de bonne heure",
    context:
      "L'incipit le plus célèbre de la littérature française. Sept mots qui t'annoncent que tu entres dans un livre où le temps va plier en tous sens. Respire un coup et lance-toi.",
    excerpt:
      "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire : « Je m'endors. »",
    chapter: "Combray, I",
    readingMinutes: 1,
  },
  {
    id: "kp-swann-2",
    bookId: "swann",
    order: 2,
    title: "La madeleine",
    context:
      "La scène la plus pillée de la littérature mondiale. Le narrateur trempe une madeleine dans son thé et une vague de souvenirs lui explose à la figure. C'est de là que vient TOUT le roman. Tu lis trois paragraphes, tu comprends Proust.",
    excerpt:
      "À peine la gorgée mêlée des miettes du gâteau eut-elle touché mon palais que je tressaillis, attentif à ce qui se passait d'extraordinaire en moi. Un plaisir délicieux m'avait envahi, isolé, sans la notion de sa cause. Il m'avait aussitôt rendu les vicissitudes de la vie indifférentes, ses désastres inoffensifs.",
    chapter: "Combray, I",
    readingMinutes: 2,
  },
  {
    id: "kp-swann-3",
    bookId: "swann",
    order: 3,
    title: "Swann jaloux d'Odette",
    context:
      "Swann aime Odette. Il la soupçonne de lui mentir. Il passe des nuits à reconstituer ses emplois du temps. Proust invente ici le roman psychologique moderne — et démonte la jalousie comme personne.",
    excerpt:
      "Il fut surpris par un bruit de grille qu'on ouvrait, puis d'une voiture qui entrait. De peur d'être entendu, il s'éloigna vivement. Il souffrit ainsi plusieurs fois la même impression, qui pour lui revenait à dire qu'Odette était rentrée.",
    chapter: "Un amour de Swann",
    readingMinutes: 1,
  },
];

export const getPassagesForBook = (bookId: string) =>
  KEY_PASSAGES.filter((kp) => kp.bookId === bookId).sort((a, b) => a.order - b.order);

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTERS — fiches personnages accessibles d'un swipe pendant la lecture
// Surtout utile sur Balzac, Hugo, Zola, Proust, Laclos.
// ─────────────────────────────────────────────────────────────────────────────

export const CHARACTERS: Character[] = [
  // ─── Le Père Goriot ──
  {
    id: "ch-goriot-1",
    bookId: "pere-goriot",
    name: "Eugène de Rastignac",
    role: "protagoniste",
    avatar: "🎩",
    oneLiner: "Provincial arriviste, boussole morale instable, héros balzacien archétype.",
    description:
      "Étudiant en droit fraîchement débarqué d'Angoulême, pensionnaire chez Mme Vauquer. Ambitieux, séduisant, à mi-chemin entre dégoût du monde et envie d'y briller. Son éducation sentimentale se fait entre Goriot, Vautrin et Mme de Beauséant.",
    relations: [
      { to: "Père Goriot", link: "a loué une chambre au-dessus de la sienne" },
      { to: "Vautrin", link: "tentateur diabolique" },
      { to: "Mme de Nucingen", link: "maîtresse, fille de Goriot" },
    ],
    keyQuote: "À nous deux, Paris !",
  },
  {
    id: "ch-goriot-2",
    bookId: "pere-goriot",
    name: "Jean-Joachim Goriot",
    role: "protagoniste",
    avatar: "👴",
    oneLiner: "Ancien vermicellier qui se ruine pour ses deux filles ingrates.",
    description:
      "Veuf, riche à 62 ans, vermicellier retiré. Il a fait de ses deux filles Anastasie et Delphine des comtesses et baronnes en les dotant royalement — et meurt seul dans une soupente, sans qu'elles daignent venir. Figure christique de l'amour paternel absolu.",
    relations: [
      { to: "Anastasie de Restaud", link: "fille aînée" },
      { to: "Delphine de Nucingen", link: "fille cadette" },
    ],
    keyQuote: "Mes filles, mes filles, mes pauvres filles…",
  },
  {
    id: "ch-goriot-3",
    bookId: "pere-goriot",
    name: "Jacques Collin, dit Vautrin",
    role: "antagoniste",
    avatar: "🐍",
    oneLiner: "Forçat évadé, tentateur, génie du crime et prof de cynisme.",
    description:
      "Pensionnaire mystérieux chez Mme Vauquer. En réalité Trompe-la-Mort, évadé du bagne. Propose à Rastignac un pacte : épouse Victorine Taillefer, son frère meurt en duel arrangé, tu deviens riche. Sera démasqué et arrêté.",
    keyQuote: "L'honnêteté ne sert à rien.",
  },
  {
    id: "ch-goriot-4",
    bookId: "pere-goriot",
    name: "Anastasie de Restaud",
    role: "secondaire",
    avatar: "💍",
    oneLiner: "Fille aînée de Goriot, comtesse jetant l'argent par les fenêtres.",
    description:
      "Mariée au comte de Restaud. Ruinée par l'amant Maxime de Trailles, elle pille son père. Ne viendra pas à son enterrement.",
  },
  {
    id: "ch-goriot-5",
    bookId: "pere-goriot",
    name: "Delphine de Nucingen",
    role: "secondaire",
    avatar: "🌹",
    oneLiner: "Cadette de Goriot, baronne, future maîtresse de Rastignac.",
    description:
      "Mariée au banquier alsacien Nucingen, malheureuse, elle trouve en Rastignac l'amant dont elle rêve. Elle non plus ne viendra pas à l'enterrement du père.",
  },

  // ─── Madame Bovary ──
  {
    id: "ch-bovary-1",
    bookId: "bovary",
    name: "Emma Bovary",
    role: "protagoniste",
    avatar: "🌺",
    oneLiner: "Provinciale romanesque qui se ruine et se tue pour échapper à l'ennui.",
    description:
      "Élevée au couvent sur les romans sentimentaux, Emma rêve d'une vie grandiose et atterrit avec Charles en campagne. S'invente des amants (Rodolphe, Léon), des dettes, une mort par l'arsenic.",
    relations: [
      { to: "Charles Bovary", link: "mari" },
      { to: "Rodolphe Boulanger", link: "premier amant" },
      { to: "Léon Dupuis", link: "second amant" },
    ],
    keyQuote: "J'ai un amant ! j'ai un amant !",
  },
  {
    id: "ch-bovary-2",
    bookId: "bovary",
    name: "Charles Bovary",
    role: "protagoniste",
    avatar: "🎓",
    oneLiner: "Officier de santé moyen, mari moyen, amoureux absolu et aveugle.",
    description:
      "Médecin médiocre mais débonnaire. Adore Emma d'un amour plat qu'elle méprise. Après la mort d'Emma, découvre les lettres des amants. Finit par en mourir, écrasé.",
    keyQuote: "C'est la faute de la fatalité.",
  },
  {
    id: "ch-bovary-3",
    bookId: "bovary",
    name: "Homais",
    role: "secondaire",
    avatar: "💊",
    oneLiner: "Pharmacien d'Yonville, parangon de la bêtise bourgeoise triomphante.",
    description:
      "Progressiste de salon, anticlérical, médaillé à la fin. Flaubert en fait la figure emblématique du nouveau monde — celui qui gagne.",
  },
  {
    id: "ch-bovary-4",
    bookId: "bovary",
    name: "Rodolphe Boulanger",
    role: "antagoniste",
    avatar: "🐎",
    oneLiner: "Hobereau normand, séducteur roué, premier amant d'Emma.",
    description:
      "Propriétaire terrien désœuvré. Séduit Emma aux comices agricoles, la largue par lettre au moment où elle prépare leur fuite. Sa lettre glaciale contient la phrase qui hante Emma : « ce n'est pas ma faute ».",
  },

  // ─── Notre-Dame de Paris ──
  {
    id: "ch-notre-dame-1",
    bookId: "notre-dame",
    name: "Esmeralda",
    role: "protagoniste",
    avatar: "💃",
    oneLiner: "Jeune bohémienne de seize ans qui danse sur le parvis avec sa chèvre.",
    description:
      "Rayonnante, naïve, objet de convoitise de tous les hommes du roman. Aime Phoebus au point de perdre la raison. Sera pendue innocente — et Quasimodo la retrouvera aux charniers.",
    relations: [
      { to: "Quasimodo", link: "sonneur amoureux d'elle" },
      { to: "Claude Frollo", link: "archidiacre obsédé par elle" },
      { to: "Phoebus", link: "capitaine qu'elle aime" },
    ],
    keyQuote: "Phoebus ! mon Phoebus !",
  },
  {
    id: "ch-notre-dame-2",
    bookId: "notre-dame",
    name: "Quasimodo",
    role: "protagoniste",
    avatar: "🔔",
    oneLiner: "Sonneur bossu, sourd et borgne, âme pure dans un corps de monstre.",
    description:
      "Abandonné sur le parvis de Notre-Dame, recueilli par Frollo, il n'aime que les cloches. Jusqu'au jour où Esmeralda lui tend un verre d'eau — à lui, le monstre pilorisé. Il lui donnera sa vie, puis sa mort.",
    keyQuote: "Asile ! Asile !",
  },
  {
    id: "ch-notre-dame-3",
    bookId: "notre-dame",
    name: "Claude Frollo",
    role: "antagoniste",
    avatar: "🕯️",
    oneLiner: "Archidiacre dévoré par le désir interdit d'Esmeralda.",
    description:
      "Savant, alchimiste, père adoptif de Quasimodo. Sa passion sensuelle pour Esmeralda le pousse à la trahison et au crime. Figure tragique, au bord de la folie. Quasimodo finira par le précipiter du haut des tours.",
  },
  {
    id: "ch-notre-dame-4",
    bookId: "notre-dame",
    name: "Phoebus de Châteaupers",
    role: "antagoniste",
    avatar: "⚔️",
    oneLiner: "Capitaine des archers, beau gosse sans scrupules, le pire amant possible.",
    description:
      "Fiancé à sa cousine, il drague Esmeralda pour le sport. Blessé par Frollo lors d'un rendez-vous, il ne témoignera pas pour sauver la bohémienne. Survivra et épousera sa cousine — Hugo finit par une ligne assassine.",
  },

  // ─── Du côté de chez Swann ──
  {
    id: "ch-swann-1",
    bookId: "swann",
    name: "Le Narrateur",
    role: "narrateur",
    avatar: "🧒",
    oneLiner: "Enfant sensible à Combray, qui devient l'œil du roman entier.",
    description:
      "Attend chaque soir le baiser de sa mère. Goûte une madeleine et y retrouve son enfance. C'est lui qui raconte — mais Proust brouille en permanence la frontière entre lui et son narrateur.",
    keyQuote: "Longtemps, je me suis couché de bonne heure.",
  },
  {
    id: "ch-swann-2",
    bookId: "swann",
    name: "Charles Swann",
    role: "protagoniste",
    avatar: "🎩",
    oneLiner: "Mondain élégant, amateur d'art, détruit par sa passion pour Odette.",
    description:
      "Juif assimilé, familier des Guermantes, homme cultivé. Tombe amoureux d'une femme « qui n'est même pas son genre ». Sa jalousie devient un laboratoire romanesque entier (« Un amour de Swann »).",
    keyQuote: "Dire que j'ai gâché des années de ma vie pour une femme qui n'était pas mon genre.",
  },
  {
    id: "ch-swann-3",
    bookId: "swann",
    name: "Odette de Crécy",
    role: "protagoniste",
    avatar: "🌷",
    oneLiner: "Demi-mondaine à la beauté pré-raphaélite, muse ambiguë de Swann.",
    description:
      "Courtisane en transition. Swann la soupçonne de coucher avec tout Paris, y compris avec des femmes. Finira par l'épouser malgré tout, d'un amour refroidi.",
  },
  {
    id: "ch-swann-4",
    bookId: "swann",
    name: "Tante Léonie",
    role: "secondaire",
    avatar: "🫖",
    oneLiner: "Tante de Combray qui ne quitte plus sa chambre et dont la madeleine déclenche tout.",
    description:
      "Figure d'une vieillesse rituelle. C'est elle qui trempait les madeleines dans le tilleul — souvenir déclencheur de la mémoire involontaire.",
  },

  // ─── Les Liaisons dangereuses ──
  {
    id: "ch-liaisons-1",
    bookId: "liaisons",
    name: "Marquise de Merteuil",
    role: "protagoniste",
    avatar: "👑",
    oneLiner: "Veuve féministe clandestine, stratège diabolique, prédatrice du XVIIIe.",
    description:
      "S'est fabriquée seule contre la société. Utilise les hommes comme des instruments. Tient Valmont en laisse. Tombera à la fin, défigurée par la petite vérole.",
    relations: [
      { to: "Vicomte de Valmont", link: "ex-amant et complice rival" },
    ],
    keyQuote: "Née pour venger mon sexe et maîtriser le vôtre.",
  },
  {
    id: "ch-liaisons-2",
    bookId: "liaisons",
    name: "Vicomte de Valmont",
    role: "protagoniste",
    avatar: "🐺",
    oneLiner: "Libertin virtuose, prédateur de salon, finira par aimer et perdre.",
    description:
      "Aristocrate désœuvré qui séduit par défi. Mène deux opérations parallèles (Tourvel et Cécile) pour plaire à Merteuil. Tombe vraiment amoureux, la trahit, meurt en duel.",
    keyQuote: "Ce n'est pas ma faute.",
  },
  {
    id: "ch-liaisons-3",
    bookId: "liaisons",
    name: "Madame de Tourvel",
    role: "protagoniste",
    avatar: "🕊️",
    oneLiner: "Présidente dévote, cible du pari Merteuil-Valmont, victime absolue.",
    description:
      "Mariée, pieuse, vertueuse. Valmont parie de la séduire. Elle cède après une résistance héroïque, puis meurt de la rupture dictée.",
  },
  {
    id: "ch-liaisons-4",
    bookId: "liaisons",
    name: "Cécile de Volanges",
    role: "secondaire",
    avatar: "🎀",
    oneLiner: "Jeune fille de quinze ans fraîchement sortie du couvent.",
    description:
      "Naïve, promise à Gercourt. Utilisée comme pion par Merteuil qui la fait séduire par Valmont. Finira au couvent.",
  },

  // ─── Germinal ──
  {
    id: "ch-germinal-1",
    bookId: "germinal",
    name: "Étienne Lantier",
    role: "protagoniste",
    avatar: "⛏️",
    oneLiner: "Mécano chômeur arrivé dans le Nord qui devient leader de la grève.",
    description:
      "Fils de Gervaise (de L'Assommoir). Lecteur d'ouvrages socialistes, il s'improvise meneur des mineurs, déclenche la grève, assiste au massacre. Quitte le Nord à la fin, cap sur Paris.",
  },
  {
    id: "ch-germinal-2",
    bookId: "germinal",
    name: "Catherine Maheu",
    role: "protagoniste",
    avatar: "🪨",
    oneLiner: "Jeune herscheuse de quinze ans, aimée d'Étienne et maltraitée par Chaval.",
    description:
      "Travaille au fond depuis l'enfance. Se donne à Chaval, brute jalouse. Entre elle et Étienne, un amour tu, qui éclatera — trop tard — dans la galerie inondée, juste avant qu'elle meure dans ses bras.",
  },
  {
    id: "ch-germinal-3",
    bookId: "germinal",
    name: "Toussaint Maheu",
    role: "secondaire",
    avatar: "🧔",
    oneLiner: "Chef de famille, mineur de fond, figure de la dignité ouvrière.",
    description:
      "Père de Catherine et Zacharie. Taciturne, rompu à la mine. Meurt d'une balle des soldats pendant la grève — scène clé du roman.",
  },
  {
    id: "ch-germinal-4",
    bookId: "germinal",
    name: "Souvarine",
    role: "antagoniste",
    avatar: "🪓",
    oneLiner: "Anarchiste russe, ingénieur réfugié, sabote le puits à la fin.",
    description:
      "Ancien noble russe, nihiliste froid. Boit une absinthe et sabote la cage du Voreux : le puits s'effondre, les mineurs meurent. Part ensuite dans la nuit, sans un mot.",
  },

  // ─── L'Étranger ──
  {
    id: "ch-etranger-1",
    bookId: "etranger",
    name: "Meursault",
    role: "protagoniste",
    avatar: "🕶️",
    oneLiner: "Employé algérois, réfractaire à toute émotion convenue.",
    description:
      "Narrateur et héros négatif de Camus. Il dit ce qu'il ressent — et c'est pas grand chose. La mort de sa mère ne le fait pas pleurer, il flingue un Arabe sur la plage sans haine particulière. Au procès, c'est son manque d'émotion qui le condamne, pas le meurtre. Pur produit de l'absurde.",
    relations: [
      { to: "Marie Cardona", link: "liaison sans amour déclaré" },
      { to: "Raymond Sintès", link: "voisin sulfureux qui l'entraîne" },
    ],
    keyQuote: "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas.",
  },
  {
    id: "ch-etranger-2",
    bookId: "etranger",
    name: "Marie Cardona",
    role: "protagoniste",
    avatar: "👩",
    oneLiner: "Ex-dactylo, amante de Meursault, joyeuse et solaire.",
    description:
      "Retrouve Meursault à la plage le lendemain de l'enterrement. Veut se marier. Meursault accepte, indifférent. Témoigne au procès, maladroite, contre son gré. Incarne la vie qui continue, étrangère à l'absurde.",
  },
  {
    id: "ch-etranger-3",
    bookId: "etranger",
    name: "Raymond Sintès",
    role: "secondaire",
    avatar: "🥊",
    oneLiner: "Voisin louche, probable proxénète, entraîne Meursault dans le drame.",
    description:
      "Tabasse sa maîtresse, demande à Meursault d'écrire une lettre pour la piéger. Entraîne Meursault sur la plage où la confrontation tourne au meurtre. Le détonateur narratif du roman.",
  },

  // ─── Candide ──
  {
    id: "ch-candide-1",
    bookId: "candide",
    name: "Candide",
    role: "protagoniste",
    avatar: "🧳",
    oneLiner: "Jeune naïf westphalien, cobaye du roman philosophique.",
    description:
      "Fils bâtard supposé du baron de Thunder-ten-tronckh. Éjecté du château pour avoir embrassé Cunégonde, il traverse guerres, tremblements de terre, inquisition, Eldorado — pour finalement planter des choux avec elle. Voltaire en fait la cible et l'œil candide du lecteur.",
    relations: [
      { to: "Pangloss", link: "précepteur optimiste" },
      { to: "Cunégonde", link: "amour obstiné, devenu moche" },
      { to: "Martin", link: "compagnon pessimiste lucide" },
    ],
    keyQuote: "Il faut cultiver notre jardin.",
  },
  {
    id: "ch-candide-2",
    bookId: "candide",
    name: "Pangloss",
    role: "secondaire",
    avatar: "🎓",
    oneLiner: "Précepteur leibnizien, convaincu que tout va pour le mieux.",
    description:
      "Docteur en métaphysico-théologo-cosmolo-nigologie. Répète que 'tout est pour le mieux dans le meilleur des mondes possibles' pendant qu'il attrape la vérole, est pendu, dissequé, condamné aux galères. Voltaire dézingue Leibniz à travers lui.",
  },
  {
    id: "ch-candide-3",
    bookId: "candide",
    name: "Cunégonde",
    role: "protagoniste",
    avatar: "👸",
    oneLiner: "Objet d'amour de Candide, passée par tous les malheurs possibles.",
    description:
      "Fille du baron, d'abord idéalisée. Violée par les Bulgares, vendue, devenue maîtresse d'un juif et d'un grand inquisiteur en parts égales. Quand Candide la retrouve enfin, elle est laide et acariâtre. Il l'épouse quand même.",
  },

  // ─── Le Rouge et le Noir ──
  {
    id: "ch-rouge-1",
    bookId: "rouge-noir",
    name: "Julien Sorel",
    role: "protagoniste",
    avatar: "⚔️",
    oneLiner: "Fils de scieur, précepteur, séminariste, secrétaire, condamné à mort.",
    description:
      "Lecteur fanatique de Napoléon et de Rousseau. Monté à l'ambition comme d'autres au militantisme. Séduit Mme de Rênal sous la Restauration, puis Mathilde de La Mole à Paris. Tire sur Mme de Rênal à l'église de Verrières, se laisse condamner exprès. Archétype du parvenu romantique.",
    relations: [
      { to: "Mme de Rênal", link: "premier amour, victime du coup de feu" },
      { to: "Mathilde de La Mole", link: "amour d'orgueil à Paris" },
      { to: "L'abbé Chélan", link: "protecteur ecclésiastique" },
    ],
    keyQuote: "L'hypocrisie était sa seule ressource.",
  },
  {
    id: "ch-rouge-2",
    bookId: "rouge-noir",
    name: "Mme de Rênal",
    role: "protagoniste",
    avatar: "🌹",
    oneLiner: "Épouse du maire de Verrières, premier amour vrai de Julien.",
    description:
      "Mariée à un bourgeois vaniteux, mère de trois enfants. Tombe amoureuse du précepteur Julien. Dénonce leur liaison sous l'emprise d'un confesseur, déclenchant la chute. Meurt trois jours après l'exécution de Julien. Incarne la sincérité contre l'ambition.",
  },
  {
    id: "ch-rouge-3",
    bookId: "rouge-noir",
    name: "Mathilde de La Mole",
    role: "protagoniste",
    avatar: "💎",
    oneLiner: "Aristocrate parisienne, amour d'orgueil.",
    description:
      "Fille du marquis de La Mole. S'ennuie dans son salon, cherche l'exceptionnel. Tombe amoureuse de Julien comme on cite Corneille. Après l'exécution, elle rachète la tête tranchée et l'enterre elle-même — en hommage à son ancêtre Boniface.",
  },

  // ─── Bel-Ami ──
  {
    id: "ch-belami-1",
    bookId: "bel-ami",
    name: "Georges Duroy",
    role: "protagoniste",
    avatar: "👔",
    oneLiner: "Ex-sous-officier séducteur, devient magnat de presse par canapé-stratégie.",
    description:
      "Maupassant le décrit pauvre, beau, vide. Il monte à Paris, plagie sa première femme Madeleine, séduit l'épouse de son patron, puis sa fille. Se marie à la Madeleine en clou de roman. Incarne l'arrivisme cynique de la IIIe République.",
    relations: [
      { to: "Madeleine Forestier", link: "épouse puis ex, cerveau politique" },
      { to: "Clotilde de Marelle", link: "maîtresse récurrente" },
      { to: "Mme Walter", link: "femme de son patron, manipulée" },
      { to: "Suzanne Walter", link: "fille du patron, enlevée et mariée" },
    ],
    keyQuote: "Il faut être fort, plus fort que les autres.",
  },
  {
    id: "ch-belami-2",
    bookId: "bel-ami",
    name: "Madeleine Forestier",
    role: "protagoniste",
    avatar: "✒️",
    oneLiner: "Journaliste fantôme, plume de Duroy, esprit politique aiguisé.",
    description:
      "Veuve de Charles Forestier, elle écrit en réalité les articles de Duroy. Brève épouse de Duroy. Répudiée quand il vise plus haut. Figure rare chez Maupassant : une femme intellectuelle sans illusion.",
  },
  {
    id: "ch-belami-3",
    bookId: "bel-ami",
    name: "Clotilde de Marelle",
    role: "secondaire",
    avatar: "🍷",
    oneLiner: "Maîtresse libre, seule à aimer Duroy pour lui-même.",
    description:
      "Bourgeoise mariée, libre d'esprit, la seule femme que Duroy n'arrive pas à jeter. Ils se retrouvent de rupture en rupture. Sait qui il est et couche quand même avec lui — lucidité tragique.",
  },

  // ─── Voyage au bout de la nuit ──
  {
    id: "ch-voyage-1",
    bookId: "voyage",
    name: "Ferdinand Bardamu",
    role: "protagoniste",
    avatar: "🌑",
    oneLiner: "Médecin raté, anti-héros absolu, voix célinienne crue.",
    description:
      "S'engage par bêtise en 14-18, fuit les tranchées. Traverse l'Afrique coloniale, les USA de Ford, le Paris des banlieues misérables. Médecin de pauvres à Clichy. Trahit Molly, trahit Robinson, trahit lui-même. Son parcours est un effondrement méthodique de l'idéalisme.",
    relations: [
      { to: "Léon Robinson", link: "double maléfique qu'il croise partout" },
      { to: "Molly", link: "prostituée américaine qui l'aime, qu'il quitte" },
      { to: "Lola", link: "Américaine patriote qu'il exaspère" },
    ],
    keyQuote: "La vérité de ce monde c'est la mort.",
  },
  {
    id: "ch-voyage-2",
    bookId: "voyage",
    name: "Léon Robinson",
    role: "antagoniste",
    avatar: "🎭",
    oneLiner: "Ombre de Bardamu, tueur raté, miroir du ratage.",
    description:
      "Rencontré sur le front, retrouvé en Afrique puis en Amérique puis à Paris. Essaie de tuer une vieille pour de l'argent, finit par être tué par sa fiancée Madelon qui lui tire dessus dans un taxi. Bardamu assiste à sa mort sans pouvoir rien faire — sinon partir.",
  },
  {
    id: "ch-voyage-3",
    bookId: "voyage",
    name: "Molly",
    role: "secondaire",
    avatar: "💐",
    oneLiner: "Prostituée américaine, seule incarnation de bonté du roman.",
    description:
      "Rencontrée à Detroit. Elle veut garder Bardamu près d'elle, paye ses dépenses. Il la quitte sans raison claire — juste pour ne pas être sauvé. Elle reste, dans le livre, comme la seule figure que Céline épargne.",
  },

  // ─── Les Fleurs du Mal — pas de personnages de roman mais des figures poétiques
  {
    id: "ch-fleurs-1",
    bookId: "fleurs-mal",
    name: "Le Spleen",
    role: "secondaire",
    avatar: "🌫️",
    oneLiner: "Ennemi intime du poète, figure centrale du recueil.",
    description:
      "Personnification baudelairienne du mal-être moderne. Dépasse la mélancolie romantique : c'est un ciel de plomb qui écrase, un couvercle. 'Quand le ciel bas et lourd pèse comme un couvercle.' Figure récurrente, nommée dans quatre poèmes éponymes.",
  },
  {
    id: "ch-fleurs-2",
    bookId: "fleurs-mal",
    name: "L'Idéal",
    role: "secondaire",
    avatar: "⚡",
    oneLiner: "Pendant lumineux du spleen, élévation et pure beauté.",
    description:
      "Moitié de la première section 'Spleen et Idéal'. Accessible par la poésie, l'amour exalté, la beauté absolue. Jamais atteint durablement — Baudelaire oscille entre les deux pôles dans tout le recueil.",
  },
  {
    id: "ch-fleurs-3",
    bookId: "fleurs-mal",
    name: "Jeanne Duval",
    role: "protagoniste",
    avatar: "👁️",
    oneLiner: "Muse noire, compagne tourmentée, objet de la 'Vénus noire'.",
    description:
      "Actrice haïtienne, maîtresse de Baudelaire pendant plus de vingt ans. Inspire le cycle des poèmes de la 'Vénus noire' : 'La Chevelure', 'Parfum exotique', 'Sed non satiata'. Ambivalence totale : adoration et dégoût, présence charnelle et menace.",
  },
];

export const getCharactersForBook = (bookId: string) =>
  CHARACTERS.filter((c) => c.bookId === bookId);

// ─────────────────────────────────────────────────────────────────────────────
// RAP & LIT — punchlines de rap français analysées littérairement
// On ne reproduit PAS les paroles (copyright) — on décrit l'image, on nomme
// les figures de style, et on trace le pont vers les classiques. Le lecteur
// clique pour écouter le morceau et relire l'auteur.
// ─────────────────────────────────────────────────────────────────────────────

export const RAP_PUNCHLINES: RapPunchline[] = [
  {
    id: "p-booba-ouest-side",
    artist: "Booba",
    song: "Ouest Side",
    album: "Ouest Side",
    year: 2006,
    era: "00s",
    punchlineTheme:
      "Une série de métaphores urbaines où Paris devient à la fois décor, proie et ennemi. L'écriture empile les images lumineuses et sales — parfums de luxe et béton fissuré dans la même phrase.",
    devices: ["métaphore filée", "allitération", "antithèse"],
    analysis:
      "Booba construit sa ville comme Baudelaire la sienne : un organisme vivant qui te bouffe en même temps qu'il te sublime. Les allitérations en dentales frappent comme des coups secs, l'antithèse luxe/misère est la même colonne vertébrale que Le Spleen de Paris. C'est du parnassien en Jordan.",
    literaryParallel: {
      author: "Charles Baudelaire",
      workTitle: "Le Spleen de Paris",
      bridge:
        "Même Paris à deux visages : celui qui enivre et celui qui recrache. Baudelaire flâne, Booba roule — mais la rétine est la même.",
    },
    listenUrl: "https://open.spotify.com/search/Booba%20Ouest%20Side",
    geniusUrl: "https://genius.com/Booba-ouest-side-lyrics",
    vibe: "street",
  },
  {
    id: "p-nekfeu-on-verra",
    artist: "Nekfeu",
    song: "On verra",
    album: "Feu",
    year: 2015,
    era: "10s",
    punchlineTheme:
      "Un refrain interrogatif qui pose l'avenir comme une énigme ouverte. L'écriture oscille entre aveu d'incertitude et élan vital : on ne sait pas mais on avance.",
    devices: ["antithèse", "anaphore", "polyptote"],
    analysis:
      "Ce doute mis en vers, c'est Rimbaud qui dit « La vraie vie est absente » — sauf qu'au lieu de partir au Harrar, Nekfeu reste dans le RER. L'anaphore du « on verra » est une manière très classique (héritée de Villon) de transformer la peur en posture. Tu rappes ton insécurité, elle devient un refrain — elle ne te contrôle plus.",
    literaryParallel: {
      author: "Arthur Rimbaud",
      workTitle: "Une Saison en enfer",
      bridge:
        "Même urgence d'un jeune homme qui interroge sa propre existence à voix haute. Rimbaud a 19 ans, Nekfeu 23 : âge de la question sans réponse.",
    },
    listenUrl: "https://open.spotify.com/search/Nekfeu%20On%20verra",
    geniusUrl: "https://genius.com/Nekfeu-on-verra-lyrics",
    vibe: "mélancolique",
  },
  {
    id: "p-damso-smog",
    artist: "Damso",
    song: "Smog",
    album: "Ipséité",
    year: 2017,
    era: "10s",
    punchlineTheme:
      "Un autoportrait en spirale noire : Damso met en scène la honte, le sexe, la mort avec une précision clinique. Pas de métaphore décorative — l'image est toujours organique.",
    devices: ["hypotypose", "chiasme", "oxymore"],
    analysis:
      "Damso écrit comme Céline : la phrase est courte, cassée, et pourtant musicale. L'hypotypose (cette façon de rendre une scène VISIBLE jusqu'à la gêne) est exactement la technique du Voyage au bout de la nuit. Quand il chiasme « je / moi », c'est Rimbaud qui dit « Je est un autre » — sauf qu'il le prouve dans le beat.",
    literaryParallel: {
      author: "Louis-Ferdinand Céline",
      workTitle: "Voyage au bout de la nuit",
      bookId: "voyage",
      bridge:
        "Même crudité, même musique noire, même refus de la jolie phrase. Céline invente l'argot littéraire, Damso invente le français de studio : deux violences du langage.",
    },
    listenUrl: "https://open.spotify.com/search/Damso%20Smog",
    geniusUrl: "https://genius.com/Damso-smog-lyrics",
    vibe: "mystique",
  },
  {
    id: "p-orelsan-basique",
    artist: "Orelsan",
    song: "Basique",
    album: "La fête est finie",
    year: 2017,
    era: "10s",
    punchlineTheme:
      "Un inventaire des lieux communs de la société française, déroulé en énumération massive. Chaque ligne est une vérité évidente — et pourtant l'effet cumulé est chirurgical.",
    devices: ["anaphore", "énumération", "antithèse"],
    analysis:
      "C'est La Bruyère au XXIe : l'art de faire une satire en disant des banalités avec le bon rythme. L'énumération crée un effet de bande transporteuse morale — chaque cliché est un étage du même immeuble. Orelsan ne dit rien de neuf, il dit tout ce qu'on pense et que personne ne nomme. C'est exactement la méthode des Caractères.",
    literaryParallel: {
      author: "Jean de La Bruyère",
      workTitle: "Les Caractères",
      bridge:
        "Même ambition : cataloguer les travers d'une époque sans juger, juste en montrant. La Bruyère écrivait pour la cour, Orelsan pour Twitter — même geste.",
    },
    listenUrl: "https://open.spotify.com/search/Orelsan%20Basique",
    geniusUrl: "https://genius.com/Orelsan-basique-lyrics",
    vibe: "politique",
  },
  {
    id: "p-kery-banlieusards",
    artist: "Kery James",
    song: "Banlieusards",
    album: "À l'ombre du show business",
    year: 2008,
    era: "00s",
    punchlineTheme:
      "Un discours qui prend la défense des quartiers populaires en alignant rhétorique classique et colère contenue. Le texte monte comme un plaidoyer d'avocat devant un tribunal qui n'a jamais voulu l'écouter.",
    devices: ["anaphore", "chiasme", "hyperbole"],
    analysis:
      "Kery James fait du Hugo pur jus. « J'ai vu les salles de classe… » c'est une anaphore qu'on pourrait retrouver dans Les Misérables. Il n'y a pas de différence structurelle entre son morceau et un discours de la Chambre : c'est de la rhétorique républicaine, en ADIDAS.",
    literaryParallel: {
      author: "Victor Hugo",
      workTitle: "Les Misérables",
      bridge:
        "Même croyance : que la parole peut déplacer les murs. Hugo plaidait pour les miséreux, Kery pour les banlieusards — c'est une seule et même voix française du bas.",
    },
    listenUrl: "https://open.spotify.com/search/Kery%20James%20Banlieusards",
    geniusUrl: "https://genius.com/Kery-james-banlieusards-lyrics",
    vibe: "politique",
  },
  {
    id: "p-iam-demain",
    artist: "IAM",
    song: "Demain c'est loin",
    album: "L'École du micro d'argent",
    year: 1997,
    era: "90s",
    punchlineTheme:
      "Une fresque marseillaise de neuf minutes qui déroule la vie du quartier comme un roman : personnages, rues, trajectoires, drames minuscules. Pas de refrain — un texte fleuve.",
    devices: ["hypotypose", "énumération", "métaphore filée"],
    analysis:
      "C'est Zola en 1997. Akhenaton et Shurik'n font de l'Estaque ce que Zola fait des Rougon : une plongée naturaliste où chaque détail sert le tableau global. Neuf minutes sans refrain, c'est le choix du roman contre la chanson. Tu écoutes, tu vois, tu comprends un territoire — c'est de la littérature de terrain.",
    literaryParallel: {
      author: "Émile Zola",
      workTitle: "Germinal",
      bookId: "germinal",
      bridge:
        "Même méthode : descendre dans un quartier, noter, restituer sans jolir. Zola dans les mines du Nord, IAM dans les cités de Marseille — l'ambition documentaire est identique.",
    },
    listenUrl: "https://open.spotify.com/search/IAM%20Demain%20c%27est%20loin",
    geniusUrl: "https://genius.com/Iam-demain-cest-loin-lyrics",
    vibe: "street",
  },
  {
    id: "p-lomepal-palpal",
    artist: "Lomepal",
    song: "Yeux disent",
    album: "Flip",
    year: 2017,
    era: "10s",
    punchlineTheme:
      "Une écriture amoureuse où les sensations passent par le regard plutôt que par la parole. Le texte glisse du physique au métaphysique sans prévenir — comme un rêve qui change de pièce.",
    devices: ["synesthésie", "oxymore", "métaphore filée"],
    analysis:
      "Lomepal rappe comme Verlaine écrit : de la musique avant toute chose. La synesthésie (voir un son, entendre un regard) est exactement ce que Verlaine appelait « la chose envolée ». L'oxymore (« triste joie », « douce violence ») est la grammaire du Romantisme tardif. C'est du symbolisme en adidas.",
    literaryParallel: {
      author: "Paul Verlaine",
      workTitle: "Romances sans paroles",
      bridge:
        "Même art de ne PAS dire les choses frontalement. Verlaine murmure, Lomepal aussi — le texte passe par l'évocation, jamais la déclaration.",
    },
    listenUrl: "https://open.spotify.com/search/Lomepal%20Yeux%20disent",
    geniusUrl: "https://genius.com/Lomepal-yeux-disent-lyrics",
    vibe: "mélancolique",
  },
  {
    id: "p-mc-solaar-caroline",
    artist: "MC Solaar",
    song: "Caroline",
    album: "Qui sème le vent récolte le tempo",
    year: 1991,
    era: "90s",
    punchlineTheme:
      "Un jeu de mots filé sur un prénom féminin, où chaque rime devient une petite surprise phonétique. L'écriture est élégante, cursive, presque dansante.",
    devices: ["paronomase", "calembour", "assonance"],
    analysis:
      "MC Solaar reprend exactement la technique des Grands Rhétoriqueurs (XVe siècle) : faire rimer les sons pour faire rimer les idées. La paronomase (mots proches qui ne disent pas la même chose) est sa signature — c'est du Desnos rapé. Quand il joue « Caroline / carabine », c'est Raymond Queneau qui applaudirait depuis le café de Flore.",
    literaryParallel: {
      author: "Raymond Queneau",
      workTitle: "Exercices de style",
      bridge:
        "Même plaisir fou de la langue qu'on fait tourner dans tous les sens. Queneau invente 99 façons de raconter la même scène, Solaar invente 16 façons de rimer un prénom. Le jeu littéraire est identique.",
    },
    listenUrl: "https://open.spotify.com/search/MC%20Solaar%20Caroline",
    geniusUrl: "https://genius.com/Mc-solaar-caroline-lyrics",
    vibe: "virtuose",
  },
  {
    id: "p-sch-julius",
    artist: "SCH",
    song: "Cabo",
    album: "JVLIVS",
    year: 2018,
    era: "10s",
    punchlineTheme:
      "Un opéra mafieux qui transpose la mythologie marseillaise en épopée solaire et noire. Le narrateur avance dans une lumière dorée et une violence rentrée — il raconte la famille, la trahison, le port, le Sud.",
    devices: ["métaphore filée", "énumération", "hypotypose"],
    analysis:
      "SCH ne rappe pas une histoire : il écrit un roman-feuilleton en musique. JVLIVS, c'est Le Comte de Monte-Cristo version trap : un héros marqué par une blessure originelle, un retour méthodique, un décor méditerranéen chargé de signes. L'hypotypose (faire voir une scène) est sa signature — chaque couplet est un plan-séquence, chaque refrain une bascule de chapitre. Dumas écrivait pour le feuilleton ; SCH sort ses albums comme des saisons, avec prolepses et arcs narratifs tenus sur 45 minutes.",
    literaryParallel: {
      author: "Alexandre Dumas",
      workTitle: "Le Comte de Monte-Cristo",
      bridge:
        "Même matrice : un héros du Sud, blessé par la trahison, qui revient régler ses comptes dans une langue à la fois populaire et opératique. Dumas publiait en feuilleton pour tenir le lecteur d'épisode en épisode ; SCH tient ses auditeurs d'album en album avec le même art du cliffhanger.",
    },
    listenUrl: "https://open.spotify.com/search/SCH%20Cabo%20JVLIVS",
    geniusUrl: "https://genius.com/Sch-cabo-lyrics",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=SCH+Cabo+JVLIVS",
    vibe: "mystique",
  },
  // ─── Vague 2024-2025 (retour panel v9 Q7 : "les punchlines s'arrêtent en
  // ─── 2018, il manque la génération qui écoute vraiment en 2025"). Trois
  // ─── entrées récentes avec, pour chacune, un pont classique solide et un
  // ─── youtubeUrl qui pointera (en prod) sur la seconde exacte de la
  // ─── punchline. Ici, faute de video IDs stables, on met des URLs de
  // ─── recherche — l'UI traite les deux cas de la même façon.
  {
    id: "p-ninho-ni",
    artist: "Ninho",
    song: "NI",
    album: "NI",
    year: 2024,
    era: "20s",
    punchlineTheme:
      "Un autoportrait froid d'homme arrivé. Ninho aligne les signes extérieurs de sa réussite — argent, loyauté, distance — sans jubilation : c'est un constat, pas une fête. Le luxe est là, la paix n'y est pas.",
    devices: ["énumération", "antithèse", "métaphore filée"],
    analysis:
      "Ninho écrit comme Balzac raconte Rastignac dans Le Père Goriot : la trajectoire du gamin des Yvelines qui monte, observe, et découvre que Paris est un système. L'énumération clinique des marques et des sommes n'est pas de l'étalage, c'est une comptabilité morale — chaque ligne est un « combien ça m'a coûté ». Balzac faisait exactement ça avec ses descriptions d'intérieurs bourgeois : le décor est le personnage.",
    literaryParallel: {
      author: "Honoré de Balzac",
      workTitle: "Le Père Goriot",
      bridge:
        "Même matrice : un jeune homme venu d'ailleurs qui lit Paris comme un code, apprend les règles, les applique, et en sort riche mais abîmé. Rastignac regarde la ville depuis le cimetière, Ninho depuis un Mercedes — même panorama, même vertige.",
    },
    listenUrl: "https://open.spotify.com/search/Ninho%20NI",
    geniusUrl: "https://genius.com/Ninho-ni-lyrics",
    youtubeUrl: "https://www.youtube.com/results?search_query=Ninho+NI",
    vibe: "street",
  },
  {
    id: "p-sdm-liens-du-100",
    artist: "SDM",
    song: "Liens du 100",
    album: "Liens du 100",
    year: 2024,
    era: "20s",
    punchlineTheme:
      "Un retour au quartier comme on retourne sur le lieu d'un pacte. SDM énumère les fidèles, les disparus, les règles tacites — le texte est un serment à voix basse plus qu'un récit. On sent la vieille loyauté qui pèse, et la peur de la rompre.",
    devices: ["anaphore", "hypotypose", "énumération"],
    analysis:
      "C'est Zola avant d'être du rap : l'idée que ton milieu te forme plus que ton nom. Dans L'Assommoir, Gervaise voit défiler les gens du quartier comme une galerie de destins — SDM fait pareil, couplet après couplet. L'anaphore du « tu te rappelles » rejoue la mémoire collective que Zola met dans la bouche des lavandières. Le rap des Hauts-de-Seine retrouve le naturalisme sans le savoir.",
    literaryParallel: {
      author: "Émile Zola",
      workTitle: "L'Assommoir",
      bridge:
        "Même observation précise d'une communauté populaire écrite depuis l'intérieur. Zola prenait des notes dans les bars de la Goutte-d'Or, SDM dans les halls de Clamart — méthode identique, patience identique.",
    },
    listenUrl: "https://open.spotify.com/search/SDM%20Liens%20du%20100",
    geniusUrl: "https://genius.com/Sdm-liens-du-100-lyrics",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=SDM+Liens+du+100",
    vibe: "mélancolique",
  },
  {
    id: "p-damso-jai-menti",
    artist: "Damso",
    song: "J'ai menti",
    album: "J'AI MENTI",
    year: 2025,
    era: "20s",
    punchlineTheme:
      "Un aveu, mais pas celui qu'on attendait. Damso revient non pas pour raconter ce qu'il a fait, mais pour défaire ce qu'il avait dit de lui-même. Le texte se construit comme une rétractation : chaque phrase prétend corriger une phrase ancienne, sans jamais dire laquelle.",
    devices: ["chiasme", "polyptote", "antithèse"],
    analysis:
      "C'est Rousseau des Confessions et Montaigne des Essais fusionnés dans un refrain. L'aveu chez Rousseau (« Je forme une entreprise qui n'eut jamais d'exemple… ») et le retrait chez Montaigne (« Je suis moi-même la matière de mon livre ») sont exactement le geste de Damso : se raconter en creux, en démentis successifs. Le chiasme (« j'ai dit que… alors que… ») est la figure par excellence de l'homme qui reprend son propre procès. C'est du classique français pur — la tradition de l'auto-examen — déguisée en trap.",
    literaryParallel: {
      author: "Jean-Jacques Rousseau",
      workTitle: "Les Confessions",
      bridge:
        "Même paradoxe : on avoue pour mieux contrôler ce qu'on dit de soi. Rousseau écrit mille pages pour qu'on ne le juge pas sur des rumeurs ; Damso publie un album pour défaire les siennes. L'aveu moderne n'a pas changé de structure depuis 1782.",
    },
    listenUrl: "https://open.spotify.com/search/Damso%20J%27ai%20menti",
    geniusUrl: "https://genius.com/Damso-jai-menti-lyrics",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=Damso+J%27ai+menti",
    vibe: "mystique",
  },
];

export const getPunchlinesByEra = (era: RapEra) =>
  RAP_PUNCHLINES.filter((p) => p.era === era);

export const getPunchline = (id: string) =>
  RAP_PUNCHLINES.find((p) => p.id === id);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  const w = Math.floor(d / 7);
  if (w < 4) return `il y a ${w} sem`;
  const mo = Math.floor(d / 30);
  return `il y a ${mo} mois`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
