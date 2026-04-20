# Incipit — V1.1

> L'app qui te fait kiffer Balzac comme TikTok t'a fait kiffer la danse.

**Baseline :** *Les premières lignes qui donnent envie.*

Pitches punchy de grands classiques de la littérature, bibliothèque perso, notes de lecture publiques, feed social, book clubs interactifs, parcours thématiques, citations swipeables **partageables en Stories**, passages clés authentiques, défis saisonniers, reading buddies, compagnon IA, **fiches personnages accessibles en mode lecture**, **scanner OCR de livres papier**, **redirection prioritaire vers Placedeslibraires.fr**, badges et stats intimes. Ton tranchant, irrévérencieux — mais respect absolu du texte.

## Stack

- Next.js 14 (App Router, Server Components)
- TypeScript 5
- Tailwind CSS
- PWA : `manifest.json` + service worker minimaliste (cache-first)
- Déploiement Vercel — projet `incipit` distinct d'Adventurer
- V2 prévue : Supabase (auth, DB, realtime), génération de pitches via Claude avec relecture humaine

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvre http://localhost:3000.

## Déploiement

Le projet est prêt à être déployé en standalone sur Vercel. Aucune variable d'environnement n'est requise pour la V1 — toutes les données sont mockées dans `lib/mock-data.ts`.

> Important : le projet est déployé sous le nom `incipit`, indépendant d'Adventurer. Les deux projets sont strictement séparés côté Vercel.

## Les 12 classiques du MVP

Pitches 100 % originaux, incipits et passages clés en droit de courte citation (art. L.122-5 CPI), œuvres dans le domaine public.

1. **L'Étranger** — Camus
2. **Madame Bovary** — Flaubert
3. **Germinal** — Zola
4. **Les Liaisons dangereuses** — Laclos
5. **Le Rouge et le Noir** — Stendhal
6. **Bel-Ami** — Maupassant
7. **Notre-Dame de Paris** — Hugo
8. **Voyage au bout de la nuit** — Céline
9. **Candide** — Voltaire
10. **Le Père Goriot** — Balzac
11. **Les Fleurs du Mal** — Baudelaire
12. **Du côté de chez Swann** — Proust

## Routes & écrans

```
incipit/
├── /                              → Feed de pitches en carrousel vertical
├── /onboarding                    → Choix genres + ton
├── /explore                       → 4 onglets : Thèmes / Citations / Passages clés / Défis
├── /library                       → Bibliothèque perso
├── /book/[id]                     → Fiche livre (pitch, incipit, passages clés, reco, annotations,
│                                    compagnon IA, libraires, buddy, mode "je reprends")
├── /book/[id]/read                → Mode lecture : passages clés + tailles de typo + fiches perso
├── /buddy/[bookId]                → Lecture partagée avec spoiler-guard
├── /scan                          → Incipit Lens : OCR livre papier (couverture ou passage)
├── /clubs                         → Liste des book clubs
├── /clubs/[id]                    → Détail club : livre du mois + discussions
├── /feed                          → Feed social (activités de la communauté)
└── /profile                       → Profil : stats intimes, badges, étagère 3D, annotations
```

## Features V1

### Paquet 1 — exploration intelligente
- **Feed de pitches** : carrousel vertical scroll-snap (signature).
- **Incipits** : premières lignes dépliables sur chaque fiche livre.
- **Passages clés** : 3 à 5 extraits authentiques par livre (domaine public) accompagnés d'un pitch de mise en contexte. Tu lis du vrai texte, pas une paraphrase.
- **Parcours thématiques** : 8 moods transversaux (Romance / Aventure / Histoire / Psychologique / Social / Voyage initiatique / Noir / Métaphysique).
- **Recommandations** : « si tu aimes X, tente Y » avec raison éditoriale.
- **Citations swipeables** : phrases qui tiennent seules.
- **Défis saisonniers** : 4 parcours thématiques (4 livres max), sans logique de streak.

### Paquet 2 — social & lecture
- **Reading buddies** : progression synchronisée + messages avec spoiler-guard (filtre sur l'avancée).
- **Book clubs** : livre du mois, discussions, événements.
- **Annotations publiques** : passages soulignés + réaction.
- **Feed social** : activités de la communauté.
- **Compagnon IA** : modale de questions sur le livre (bêta, relecture humaine avant publication).
- **Mode "je reprends"** : recap « Précédemment dans… » pour les livres en cours.
- **Badges & stats intimes** : temps de lecture, histogramme 30 jours, badges rares sans streak Duolingo.
- **Étagère 3D** : vitrine des livres lus.

### Paquet 3 — V1.1 : lecture immersive + partage + scan + indés
- **Fiches personnages** : drawer bottom-sheet accessible en un clic pendant la lecture. Pitch d'une phrase, description sans spoiler, citation-signature, relations. 22 fiches déjà écrites pour les 6 romans majeurs (Goriot, Bovary, Notre-Dame, Swann, Liaisons, Germinal).
- **Cartes citations Stories** : chaque citation se transforme en image 1080×1920 en un tap. Gradient du livre, Playfair Display, wordmark Incipit, URL watermark. Téléchargement PNG + `navigator.share` natif si supporté.
- **Incipit Lens (OCR)** : scanner via `/scan`. Photo de couverture → reconnaissance + fiche livre. Photo de passage → extraction + sauvegarde dans les annotations. Flow complet avec state `idle` / `processing` (barre de progression + scan-line animée) / `book-found` / `passage-found`.
- **Placedeslibraires.fr en priorité** : modale "Chez ton libraire" refondue. Bannière bordeaux-gold CTA principal qui envoie vers placedeslibraires.fr (2 800 libraires indés). Liste des librairies proches avec deep-links vers le réseau. Autres plateformes éthiques (Lalibrairie.com, Leslibraires.fr, Mollat) repliées dans `<details>`. **Aucun lien Amazon, aucun lien Fnac.**

## Design system

Palette éditoriale inspirée des vieux livres reliés :

| Nom       | Hex        | Usage                           |
|-----------|------------|---------------------------------|
| ink       | `#1A1A2E`  | Texte principal, encre          |
| paper     | `#FAF7F0`  | Fond général, papier ivoire     |
| bordeaux  | `#8B1E3F`  | Accent principal, actions       |
| gold      | `#C9A961`  | Accent secondaire, badges       |
| sage      | `#6B7F5C`  | Accent vert bibliothèque        |
| cream     | `#F3E9D2`  | Fond secondaire                 |
| dust      | `#E8DFC9`  | Bordures discrètes              |

Typographies : **Playfair Display** (titres, serif littéraire) + **Inter** (corps).

## Principes produit

1. **L'app sert la lecture, pas l'inverse.** Pas de streak Duolingo, pas de compteurs creux.
2. **Le ton est un moat.** Boloss assumé dans les pitches, littéraire ailleurs.
3. **Respect absolu du texte.** On donne à lire du vrai Zola, pas du Zola remâché. Les Passages clés sont authentiques (art. L.122-5 CPI), encadrés d'un contexte éditorial.
4. **Social organique.** Les rencontres naissent autour des livres (clubs, buddies, notes).
5. **Mobile-first absolu.** Si ça marche pas sur iPhone SE, c'est pas bon.

## Roadmap V2

- Auth Supabase + bibliothèque persistée par utilisateur
- Génération de pitches via Claude avec garde-fous éditoriaux (un humain relit avant publication)
- 100 classiques au lancement
- Notifications push pour sessions book club
- Integration publique librairies (liens d'achat, disponibilité en temps réel)
- Feature "extraits quotidiens" : un passage beau à lire chaque matin

## Crédits

Guillaume Coulon · Incipit · 2026
