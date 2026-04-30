# Incipit

> *Les premières lignes qui donnent envie.*

L'app qui redonne envie de lire les classiques. Pitches Boloss-style, passages
clés authentiques, quiz, book clubs, reading buddies, Rap & Lit, lecture
intégrale du domaine public, mode prof imprimable. Sobre, anti-gamification,
pro-plaisir.

---

## Stack

- Next.js 14 (App Router, Server Components, Edge Functions)
- TypeScript 5 strict
- Tailwind CSS
- Supabase (auth magic link, Postgres, RLS) — DB partagée avec Adventurer,
  tables préfixées `incipit_*`
- Stripe Checkout + Customer Portal + webhooks pour le Premium
- Web Push API + Service Worker + VAPID pour les notifications quotidiennes
- PWA + Capacitor (cible iOS / Android, en cours)
- Déploiement Vercel — projet `incipit` distinct d'Adventurer

L'app fonctionne **sans** backend (mode V1 localStorage). Le backend est
purement additif : si une variable d'environnement manque, la feature
correspondante se désactive sans casser le reste. Voir `SETUP.md` pour câbler
auth, Stripe et push en ~20 minutes.

## Lancer en local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build prod
```

## Routes principales

```
/                     → Home : incipit du jour + carrousel
/onboarding           → Choix genres + ton (persistés localement)
/explore              → Thèmes / Citations / Passages clés / Défis
/punchlines           → Rap & Lit — punchlines annotées
/domaine-public       → Catalogue libre + liens Gutenberg/Wikisource/Gallica
/library              → Bibliothèque perso
/book/[id]            → Fiche livre complète (pitch, incipit, passages,
                        contexte, bio, libraire, recos, connecteurs lecture,
                        OG image dynamique avec l'incipit)
/book/[id]/read       → Mode lecture (passages clés + fiches personnages)
/buddy/[bookId]       → Lecture partagée avec spoiler-guard
/scan                 → Incipit Lens — OCR livre papier
/clubs · /clubs/[id]  → Book clubs
/feed                 → Activités communauté
/profile              → Stats, badges, étagère, annotations
/quiz                 → Quiz littérature multi-modes
/quiz/daily           → Quiz quotidien (3 questions sur l'incipit du jour)
/quiz/badges          → Galerie des jalons culturels débloqués
/incipit-du-jour      → Incipit du jour + archive 30 jours
/debutant             → Parcours gradué 30 jours pour démarrer
/premium              → Paywall + Stripe checkout
/prof                 → Mode prof : quiz imprimable A4 + fiche classe (CC BY-NC)
/auth/login           → Magic link
/about · /legal · /privacy · /terms
/api/health           → Santé : booléens config (sans fuiter les valeurs)
/robots.txt · /sitemap.xml
```

## Ce qui est dans l'app aujourd'hui

### Lecture & exploration
- **Feed de pitches** : carrousel vertical scroll-snap.
- **Incipits** : premières lignes dépliables sur chaque fiche.
- **Passages clés** : 3-5 extraits authentiques par livre (domaine public),
  pitchés en contexte. On lit du vrai texte, pas une paraphrase.
- **Parcours thématiques** : 8 moods transversaux.
- **Recommandations éditoriales** : « si tu aimes X, tente Y ».
- **Citations swipeables** + cartes Stories 1080×1920 partageables.
- **Mode lecture** : typo ajustable, fiches personnages en drawer.

### Social & guidance
- **Reading buddies** : progression synchronisée + spoiler-guard.
- **Book clubs** : livre du mois, discussions, événements.
- **Annotations publiques** + feed social.
- **Compagnon IA** : modale Q/R relue avant publication.
- **Mode "je reprends"** : recap pour les livres en cours.
- **Mode débutant** : 10 incipits gradués sur 30 jours.

### Quiz & engagement
- **Quiz littérature** multi-types (incipit, auteur, personnage, date,
  figures de style) — corpus 40+ incipits.
- **Quiz quotidien** : 3 questions sur l'incipit du jour.
- **Badges** : jalons culturels (sans XP ni streak Duolingo).
- **Streak** avec flamme + jalons 7/30/100 jours, masquable.
- **Re-engagement** J+3/J+7 pour les absents.
- **Mode prof** : génère un quiz A4 imprimable, options mélangées
  déterministe, corrigé optionnel, licence CC BY-NC 4.0.

### Hub d'inspiration
- **Rap & Lit** : punchlines de rap analysées en figures de style + lien
  Genius timecodé. On ne reproduit pas les paroles (copyright).
- **Connecteurs lecture** : Audible, Kindle, Kobo, Apple Books, Google Play,
  + libraires indépendants (priorité Placedeslibraires.fr, **aucun** lien
  Amazon/Fnac).
- **Domaine public** : page dédiée + lecture intégrale via Gutenberg /
  Wikisource / Gallica.

### Backend v2 (optionnel, désactivable feature par feature)
- **Auth** Supabase magic link, sessions sécurisées via cookies.
- **Sync** favoris / streak / préférences / premium entre appareils.
- **Premium** Stripe Checkout + Customer Portal + webhooks signés.
- **Push** notifications quotidiennes (cron Vercel `/api/cron/daily-push`).
- **Telemetry** anonyme (onboarding, quiz, partage, favoris, premium).
- **Rate limiting** côté DB.

### SEO & polish
- `generateMetadata` dynamique par livre / club.
- **OG images dynamiques** générées à l'edge : image par défaut
  (`/opengraph-image`) + image par livre (`/book/[id]/opengraph-image`)
  qui met en scène l'incipit, l'auteur et l'année.
- `robots.ts` + `sitemap.ts` (39+ URLs).
- Headers de sécurité (X-Frame-Options, HSTS, Permissions-Policy, etc.) via
  `next.config.js`.
- `/api/health` pour vérifier la config en prod.
- Pages 404/500 éditorialisées (ton Proust / ton Camus).

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

Typographies : **Playfair Display** (titres, serif littéraire) + **Inter**
(corps).

## Principes produit

1. **L'app sert la lecture, pas l'inverse.** Pas de streak Duolingo, pas de
   compteurs creux.
2. **Le ton est un moat.** Boloss assumé dans les pitches, littéraire ailleurs.
3. **Respect absolu du texte.** Vrai Zola, pas du Zola remâché. Passages
   clés authentiques (art. L.122-5 CPI), encadrés d'un contexte éditorial.
4. **Social organique.** Les rencontres naissent autour des livres.
5. **Mobile-first absolu.** Si ça marche pas sur iPhone SE, c'est pas bon.
6. **Ajouter ≠ casser.** Le backend est additif — sans variables d'env,
   l'app reste 100 % fonctionnelle en mode local.

## Documentation

- `SETUP.md` — câblage Supabase / Stripe / VAPID en ~20 min, règles de
  cohabitation avec la base Adventurer.
- `supabase/migrations/0001_incipit_init.sql` — schéma DB Incipit.

## Crédits

Pitches Boloss-style 100 % originaux, écrits pour Incipit.
Incipits et passages clés en droit de courte citation (art. L.122-5 CPI),
œuvres majoritairement dans le domaine public.

Guillaume Coulon · Incipit · 2026
