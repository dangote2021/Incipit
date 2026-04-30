# Beta panel v6 — sweep a11y/UX post-#117

Simulation : 6 testeurs profils variés, focus sur les frictions réelles
post-sweep a11y (#114-#117). Session 25 min. Production live (`incipit-navy.vercel.app`,
build `f6e529f`).

L'objectif : trouver les vraies frictions qui restent malgré l'a11y déjà fait.

---

## Panel

| ID | Prénom | 👤 Persona                                          | Device                | Context                                |
| -- | ------ | --------------------------------------------------- | --------------------- | -------------------------------------- |
| T1 | Sarah  | prof lettres collège, 34 ans                        | iPad Pro (Safari)     | veut utiliser /prof en classe          |
| T2 | Théo   | étudiant L1 Lettres Modernes, 19 ans, malvoyant     | Pixel 8 + NVDA        | navigue au clavier + lecteur d'écran   |
| T3 | Marion | lectrice 5+ livres/mois, 35 ans                     | MacBook Air + Safari  | desktop, vient de Twitter              |
| T4 | Mehdi  | "j'ai pas lu un livre depuis le bac", 27 ans        | iPhone SE 2020        | curieux, scrolle par habitude          |
| T5 | Claire | 54 ans, lit sur Kindle, pas tech                    | iPad Air + Safari     | tape la TV box d'abord, atterrit ici   |
| T6 | Karim  | dev senior, sceptique des apps "boloss"             | Firefox 134 desktop   | inspecte le code source, perf-obsédé   |

---

## T1 — Sarah (iPad Safari, /prof)

> « Le mode prof est génial, je peux générer une fiche de quiz pour ma 4e en 30
> secondes. Mais quand je rafraîchis la page, je perds tous mes choix de
> catégories. Et je dois recliquer 12 cases. Pas pratique en pleine prépa. »

**+** Le mode prof tient ses promesses : Cmd+P, fiche prête, licence CC.
**+** L'aperçu "questions tirées" est rassurant — elle voit ce qu'elle imprime.
**—** Aucune persistance des choix de quiz prof entre rafraîchissements.
**—** Le bouton "Imprimer" reste actif quand `selected.length === 0` ne marche
   plus parce que le min est 3, pas 0 — UX correcte mais le label pourrait dire
   "minimum 3 questions" plutôt que disabled muet.

→ **Décision produit** : persistance prof via `localStorage` + label
explicite quand bouton désactivé. Hors scope panel (post-fix).

## T2 — Théo (Pixel 8 + NVDA, navigation clavier)

> « Je lance NVDA, je tabule depuis l'URL bar. Il faut que je tabule 5 fois
> avant d'atteindre le premier contenu utile : logo, Préférences, et 3 boutons
> de filtres. C'est beaucoup. Sur Wikipédia il y a un "Aller au contenu" en
> premier focus. Ici non. »

**+** `aria-current="page"` dans la BottomNav, NVDA annonce "Quiz, page actuelle".
**+** Le bouton retour de l'AppHeader a un `aria-label` clair.
**+** Toast `aria-live="polite"` sur le quiz fonctionne — il entend "Score
   copié dans le presse-papier" sans changement de focus.
**—** **Pas de skip-link** : aucun moyen de sauter le header pour atteindre
   `<main>` directement. Bloquant pour navigation clavier sérieuse.
**—** Sur `/book/[id]/read`, la page n'a pas de `<main>` — c'est un `<div>`,
   et un `<main>` interne enveloppe le contenu de lecture mais le `<header>`
   sticky est en dehors. NVDA lit le tout comme un seul "region".
**—** Sur `/punchlines`, la page n'a pas de `<main>` non plus — section + main
   manquent.

→ **Priorité haute** : skip-link global + audit `<main>` sur toutes les pages.

## T3 — Marion (MacBook Safari, desktop)

> « Sur desktop, le scroll en carrousel snap-y est très désorientant : j'ai une
> Magic Mouse, je fais glisser un peu, je me retrouve catapultée d'une section
> à l'autre. C'est pensé mobile. Sur grand écran, j'aimerais que ça scrolle
> normalement. »

**+** Les pitches sont vraiment bons — elle s'arrête sur Camus.
**+** L'incipit du jour est un bel ancrage.
**—** `snap-mandatory` desktop = pénible. Mobile : OK, le geste swipe est natif.
   Desktop : la roulette est continue, pas discrète, et le snap force des sauts.
**—** Le header `fixed` en haut + le carrousel snap full-screen = elle ne sait
   plus si elle scrolle dans la page ou dans le doc.

→ **Décision produit** : passer à `snap-proximity` sur desktop (pointer:fine)
ou désactiver le snap sur grand viewport. Mobile garde snap-mandatory.

## T4 — Mehdi (iPhone SE 2020, curieux)

> « Je clique "Activer Premium" pour voir, et là j'ai une page d'erreur Stripe
> en anglais qui dit "Failed to create checkout session". C'est moche, ça donne
> l'impression que c'est cassé. Si c'est pas activé, dis-le. »

**+** Le pricing 4,90 €/mois est lisible et honnête.
**+** Le bouton n'a pas de "GRATUIT 7 JOURS!!!" gimmick.
**—** **Bug réel** : en `v1_mode` (sans Stripe configuré côté env), le clic sur
   "Activer Premium" appelle `/api/billing/checkout` qui retourne 500. L'app
   suit le Location header → page Stripe d'erreur. Confusion totale.

→ **Priorité haute** : si Stripe n'est pas activé côté config, désactiver le
bouton avec un message clair "Bientôt disponible" plutôt que renvoyer une 500.

## T5 — Claire (iPad Safari, 54 ans)

> « Je clique "Lire chez Kindle" sur la fiche de Camus, ça m'ouvre une autre
> app sans me prévenir. J'ai cru que j'avais quitté Incipit. Je n'aime pas
> qu'une app ouvre une autre app sans demander. »

**+** Le contenu lui plaît, le ton est lisible (pas trop "djeuns").
**+** Les tap targets sont confortables sur iPad.
**—** Liens `target="_blank"` sans annonce vocale ni indication visuelle qu'ils
   ouvrent un nouvel onglet/app. Pour utilisatrice peu tech : désorientation.
**—** Aucun `rel="noopener noreferrer"` annoncé — risque sécurité tabnabbing
   et fuite de referer.

→ **Priorité moyenne** : ajouter `aria-label` "ouvre dans un nouvel onglet" +
audit systématique des `target="_blank"` pour `rel="noopener noreferrer"`.

## T6 — Karim (Firefox desktop, dev sceptique)

> « Le code est propre. Pas de dark patterns. Mais en lighthouse j'ai 89 perf
> sur la home, à cause du LCP : la `BookCover` du premier item est rendue avec
> un gradient en CSS, c'est rapide, mais l'incipit du jour charge un emoji 🌅
> qui n'a pas d'équivalent système sobre. Et les `aria-hidden` sur les emojis
> que vous avez ajoutés rendent NVDA muet sur certaines lignes — c'est OK
> sémantiquement, mais le compteur "1/5" du carrousel n'a pas
> `aria-live="polite"` partout, donc quand ça change, NVDA ne dit rien. »

**+** Aucune pub, aucun tracker tiers visible. Crédible.
**+** Build SSG, robots.txt + sitemap propres.
**—** Compteurs de carrousel sans `aria-live` : panel #114 a corrigé /explore,
   mais pas la home elle-même (FeedProgress).
**—** Liens externes : il a regardé le source, vu qu'on a `target="_blank"`
   mais pas systématiquement `rel`. Petit mais pas zéro.

→ **Priorité moyenne** : `aria-live="polite"` sur les compteurs encore
manquants + refonte rel des liens externes.

---

## Synthèse — actions à prendre

| # | Friction                                                | Priorité | Effort | Décision        |
|---|---------------------------------------------------------|----------|--------|-----------------|
| 1 | Pas de skip-link global (T2)                            | HAUTE    | XS     | **FIX MAINTENANT** |
| 2 | Stripe v1_mode → 500 affreux (T4)                       | HAUTE    | S      | **FIX MAINTENANT** |
| 3 | `<main>` manquant sur read view + punchlines (T2)       | HAUTE    | XS     | **FIX MAINTENANT** |
| 4 | Liens externes : `rel="noopener noreferrer"` + aria (T5,T6) | MOYENNE | S      | **FIX MAINTENANT** |
| 5 | Carrousel desktop : `snap-mandatory` désorientant (T3)  | MOYENNE  | S      | **FIX** (media query)|
| 6 | Persistance choix prof (T1)                             | MOYENNE  | M      | post-fix          |
| 7 | Indicateur "scroll ↓" pour nouveaux visiteurs           | BASSE    | S      | post-fix          |

---

## Mantra du panel

> « L'a11y de surface est faite. Le travail qui reste c'est la **navigation au
> clavier sérieuse** + la **clarté des transitions hors-app** (Stripe, libs
> externes). C'est une affaire de respect du parcours, pas de jolis attributs. »
