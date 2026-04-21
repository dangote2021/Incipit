# Screenshots plan — Incipit v1.0.0

5 screenshots par store, choisis pour couvrir la promesse produit en moins de 3s chacun.

## Ordre canonique (le même sur iOS & Android)

### 1. Home feed — « Les classiques qui donnent envie »
URL : `/`
Frame iPhone 6.7" (1290×2796), Android (1080×1920).
Contenu visible :
- Header Incipit + baseline
- Pitch Boloss #1 (Madame Bovary ou L'Étranger selon choix onboarding)
- Amorce visible de l'Incipit du jour en card 2
- Bottom nav avec icônes line sobres

Légende overlay (FR / EN) :
- « Les classiques racontés comme par un pote »
- "Classics, the way friends actually talk about them"

### 2. Pitch Boloss plein écran
URL : `/book/bovary` (ou etranger/germinal — on teste visuellement celle qui passe le mieux)
Contenu :
- Titre serif + auteur + année
- 1re ligne du pitch Boloss déroulée
- Rating « Pitch » + genre + public domain badge

Légende :
- « Zéro blabla. Du style, du punch, du pitch. »
- "Zero blah-blah. All style, all punch."

### 3. Quiz Littérature — écran de jeu
URL : `/quiz` (écran après lancement d'une partie)
Contenu :
- Question type « Qui a écrit… ? » avec 4 options
- Timer discret
- Compteur X/5

Légende :
- « Quiz sans stress : 3 parties par jour, pas une de plus. »
- "Quiz without stress. 3 rounds a day, no more."

### 4. Incipit du jour
URL : `/incipit-du-jour`
Contenu :
- Date en kicker
- Incipit mis en page sur fond paper
- Bouton « Partager » + bouton « Voir le livre »

Légende :
- « Un nouvel incipit chaque matin. 30 secondes, partageable. »
- "A new opening line every morning."

### 5. Rap & Lit
URL : `/punchlines`
Contenu :
- Header « Rap & Lit »
- Carte punchline : Booba + citation + explication littéraire

Légende :
- « Booba cite Baudelaire. SCH travaille Céline. On relie. »
- "Booba quotes Baudelaire. SCH reads Céline. We connect the dots."

## Outils de capture

- Sur iOS : Safari responsive design mode (Cmd+Opt+R) réglé sur iPhone 6.7" puis screenshot.
- Sur Android : Chrome DevTools Device Mode 412×915 (Pixel 7 ratio), screenshot.
- Fond paper #FAF7F0 préservé.
- Pas d'overlays de tiers (pas de status bar Android encombrée, pas de notifs iOS).
- Puis enrichissement en overlay texte dans Figma avec la légende (format : kicker gold serif + titre bordeaux, ou inverse).

## Feature graphic Google Play (1024×500)

Background : `#FAF7F0`
Left : « Incipit » en Playfair 140pt `#1A1A2E`
Right : illustration — première ligne d'un classique en calligraphie discrète, ex. « C'était la ville merciale… » (Madame Bovary) en Playfair italic 36pt.
Tagline en bas : « Les classiques qui donnent envie » en Inter 24pt `#8B1E3F`.
