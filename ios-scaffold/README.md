# Incipit — iOS scaffold

Ce dossier contient les fichiers iOS à injecter dans le projet Xcode une fois Capacitor exécuté en local (Vercel / MCP ne peut pas lancer `xcodebuild` ici).

## Étapes côté machine macOS

```bash
npm install -D @capacitor/cli
npm install @capacitor/core @capacitor/ios @capacitor/app @capacitor/status-bar @capacitor/splash-screen
npx cap init Incipit app.incipit.reader --web-dir=public
npx cap add ios
```

Puis copier les fichiers suivants **à l'intérieur du projet Xcode généré** (`ios/App/App/`) :

- `App/App/PrivacyInfo.xcprivacy` → requis par Apple depuis mai 2024.
- `App/App/Info.plist` → clés `CFBundleDisplayName = Incipit`, `UIBackgroundModes` vide, `NSAppTransportSecurity.NSAllowsArbitraryLoads = NO`.

### Commandes de build

```bash
# Sync les assets web → iOS
npx cap sync ios

# Build release avec Xcode
npx cap open ios
# Dans Xcode : Product → Archive → Distribute App → App Store Connect
```

### Checklist avant soumission

- [ ] Icône 1024×1024 PNG **sans canal alpha**, sans coins arrondis (Apple les ajoute).
- [ ] Splash screen via `@capacitor/splash-screen` (config dans `capacitor.config.ts`).
- [ ] PrivacyInfo.xcprivacy présent dans le bundle principal.
- [ ] Schema "Release" en `Optimize for Speed`, bitcode OFF (déprécié depuis Xcode 14).
- [ ] `UILaunchStoryboard` pointant vers `Splash.storyboard` généré par Capacitor.
- [ ] Version et build number alignés (`1.0.0` / `1`).
- [ ] `ITSAppUsesNonExemptEncryption = NO` dans Info.plist (on n'utilise pas de crypto custom).

## Data & Privacy (App Store Connect)

Dans **App Information → App Privacy** :

- **Data Collected** : *None*. (L'app ne transmet aucune donnée aux serveurs Incipit.)
- **Tracking** : *No*.
- **Third-Party SDKs** : aucun SDK (pas de Firebase, pas d'analytics).

Si un reviewer insiste : le contenu web est chargé depuis `https://incipit-navy.vercel.app` et `localStorage` reste dans le sandbox du WebView, non partagé avec l'app ni avec des tiers.
