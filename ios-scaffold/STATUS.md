# iOS scaffold — STATUT : EN PAUSE

**Mai 2026** : la stratégie de packaging Apple a été révisée.
Les utilisateurs Apple installent Incipit comme **PWA** depuis Safari
(Partager → Sur l'écran d'accueil) — pas d'app native iOS au launch v1.

## Pourquoi

- Économie de **99 $/an** Apple Developer Program
- Pas de cycle de review iOS (~3 semaines en moyenne)
- Pas de double maintenance natif iOS + natif Android
- 100 % du périmètre fonctionnel d'Incipit est couvert par PWA :
  lecture, quiz, push web (limité mais fonctionnel iOS 16.4+),
  Stripe via Safari, sync Supabase, mode standalone

## Comment l'iOS reste exploitable

- Le **manifest PWA** (`public/manifest.json`) est complet
- Les **meta Apple** (apple-touch-icon, apple-mobile-web-app-*) sont
  configurées dans `app/layout.tsx` (`appleWebApp.startupImage`)
- La page **`/install`** explique la procédure Safari aux utilisateurs

## Comment réactiver l'iOS natif (v2.x)

Si la stratégie évolue plus tard (ex : besoin natif type sync background,
ARKit pour Incipit Lens, IAP App Store) :

1. Décommenter la section `ios:` de `capacitor.config.ts`
2. Restaurer dans `package.json` :
   - `cap:setup` → ajouter `@capacitor/ios`
   - `cap:add-ios` → `npx cap add ios`
3. Suivre le `README.md` voisin pour les étapes Xcode + App Store Connect
4. Activer le compte Apple Developer (99 $/an)
5. Préparer les screenshots iOS (4 tailles : 6.7", 6.5", 5.5", iPad)

Le scaffold (`App/App/Info.plist`, `PrivacyInfo.xcprivacy`) reste là tel
quel — il fonctionnera avec des ajustements mineurs.

## Décision documentée

Voir aussi `outputs/incipit-tldr.md` (livrable Cowork mai 2026) pour
le contexte complet et le tableau coût/temps comparé.
