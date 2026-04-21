# Beta panel v5 — post-legal + PWA + scaffolds

Simulation : 8 testeurs 20-40 ans, installation PWA + app packagée (iOS/Android mock), session 20 min, feedback structuré.

---

## Panel

| ID | Prénom | 👤 Persona | Device | Context |
| --- | --- | --- | --- | --- |
| T1 | Karim | lecteur casual, lit 3 livres/an | iPhone 13 | installe la PWA |
| T2 | Chloé | lit beaucoup de dev perso | Pixel 7 | installe la PWA |
| T3 | Mehdi | exigeant design, suit plein de newsletters lit | iPhone 15 Pro | teste en PWA puis en iOS native mock |
| T4 | Inès | prof de français lycée | iPad Air | cherche mode prof |
| T5 | Aboubacar | fan de rap, bac+3 | Galaxy S23 | rentre par /punchlines |
| T6 | Léa | déco + book club IRL | iPhone SE | écran le plus petit — stress test safe-area |
| T7 | Noé | designer produit | Mac + Safari | attention pixel-perfect |
| T8 | Sofia | lit en EN, IT, FR | iPhone 12 mini | teste les URL de store |

---

## T1 — Karim (iPhone 13, PWA)
> « J'ajoute à l'écran d'accueil, l'icône est propre, pas de coin biscornu, pas de texte par-dessus. Le splash s'ouvre en mode app, on dirait pas du web. »

**+** Icônes propres sur home screen iOS (ex-blocker levé).
**+** Pas de tab bar Safari → vrai feeling app.
**—** Premier scroll, il voit les pitches mais s'attend à pouvoir « liker ». Il n'y a pas de bouton like.
→ **Décision produit** : on n'ajoute pas de like. Anti-gamif. Mais on pourrait ajouter un bookmark discret en v1.1.

## T2 — Chloé (Pixel 7)
> « J'installe depuis Chrome, l'icône Android est bien adaptative : fond paper, pas de gros cadre blanc forcé. Mais dans les réglages, le lien "Confidentialité & conditions" est nickel, j'aime qu'il soit direct dans le profile. »

**+** Adaptive icon fonctionne.
**+** Lien `/legal` dans `/profile` découvrable.
**+** Privacy page lisible même sans couleurs de surcharge.
**—** Elle n'installe pas vraiment : elle reste sur Chrome. C'est ok (PWA), mais si on veut du Play Store il faut qu'on pousse un .aab.

## T3 — Mehdi (iPhone 15 Pro)
> « J'ai fait lire la page /privacy à un pote juriste. Il confirme : « 0 collecte », c'est rare et c'est bien dit. Et ton /terms tient sur un écran, pas de bla-bla RGPD. »

**+** Copy légale lisible, pas juridictionnalisé à outrance.
**+** `incipit_genres` cookie mentionné explicitement → transparent.
**—** Il zoome sur le pitch Bovary sur iPhone 15 Pro : en mode paysage (quand il tourne son tel), l'app reste en portrait — on n'a pas géré landscape. → OK, c'est dans le plan iOS (lockedPortrait), on doit l'enforcer dans Info.plist (déjà dans le patch Info.plist.patch). **Action** : vérifier qu'on applique bien le patch au moment du build.

## T4 — Inès (iPad Air, prof)
> « Je n'ai pas l'export PDF que tu m'avais teasé. Je comprends que ce soit v1.1, mais je voudrais au moins pouvoir partager un lien vers une question spécifique du quiz. »

**—** Partage de question quiz : pas encore de deep-link `quiz?q=ID`. Ajout v1.1.
**Décision** : on crée pas une nouvelle feature maintenant, on note pour v1.1.

## T5 — Aboubacar (Galaxy S23, rentre par /punchlines)
> « J'arrive direct par le lien SCH/Baudelaire. La page charge en 200ms, je peux scroll. Puis je touche le bouton retour du tel — je reste dans l'app, je reviens sur la home. Nickel. »

**+** `CapacitorBridge` back button — fonctionne théoriquement. À valider sur une vraie build APK.
**+** Entry point Rap & Lit tient la promesse (on ne fait pas sa culture, on la respecte).

## T6 — Léa (iPhone SE)
> « Sur SE, la BottomNav ne passe plus sous le home indicator. Et les cartes du home sont bien marginées. »

**+** Safe area OK. `pb-[calc(6rem+env(safe-area-inset-bottom))]` fait son job.
**—** Sur `/incipit-du-jour`, le CTA "Voir le livre" mord encore un peu sur le gesture bar. → Audit supplémentaire.

## T7 — Noé (Mac Safari)
> « Je teste le sitemap. `/privacy`, `/terms`, `/legal` y sont. Le canonical est bien `incipit-navy.vercel.app`. robots.txt autorise tout sauf `/api/`. Propre. »

**+** SEO cohérent.
**+** `next build` ne génère pas de warning bloquant.

## T8 — Sofia (iPhone 12 mini, multilingue)
> « La version EN des stores marche bien, même si c'est une traduction auto. Faudra qu'un·e EN native valide "All hooked classics, zero school vibe" ou équivalent. »

**—** Copy EN à faire relire. Pas blocker pour soumission FR, mais blocker pour soumission US.
**+** L'app reste en FR (lang="fr"), ce qui est cohérent — on ne promet pas une app EN.

---

## Synthèse blockers / non-blockers

### ✅ Résolus depuis v4
- Icônes iOS/Android propres (adaptive + PNG + maskable)
- Lien /legal dans /profile (découvrabilité)
- Privacy Manifest iOS préparé
- Back button Android (via CapacitorBridge)
- Safe-area BottomNav OK sur SE
- Pages légales complètes (privacy, terms, legal index)
- Store listings FR complets, EN à relire

### 🚧 Restants avant submit
1. **Audit CTA safe-area sur `/incipit-du-jour`** — ajouter pb-safe sur le CTA sticky.
2. **Relecture copy EN store** — à faire par un humain EN.
3. **Capture screenshots** — pipeline Chrome DevTools + Figma overlay.
4. **Feature graphic 1024×500** — Figma à créer.
5. **.aab Android + .ipa iOS** — uniquement faisable sur machine Android Studio + Xcode.
6. **Keystore Android** — à générer + sauvegarder dans un vault sécurisé hors repo.

### 🎯 Priorité : fix safe-area sur CTA `/incipit-du-jour`
