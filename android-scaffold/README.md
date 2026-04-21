# Incipit — Android scaffold

## Setup (à faire sur une machine avec Android Studio)

```bash
npm install @capacitor/android
npx cap add android
```

## Fichiers à injecter

- `app/src/main/res/values/strings.xml` → nom de l'app + thème
- `app/src/main/res/values/colors.xml` → palette Incipit
- `app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` → adaptive icon (foreground + background)
- `app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` → idem round

## Commandes

```bash
# Sync + build debug
npx cap sync android
npx cap open android

# Dans Android Studio : Build → Generate Signed App Bundle / APK → Android App Bundle (.aab)
# Keystore : à générer la première fois avec `keytool -genkey -v -keystore incipit.keystore -alias incipit -keyalg RSA -keysize 2048 -validity 10000`
```

## Checklist Google Play Console

- [ ] `applicationId = app.incipit.reader`
- [ ] `versionCode = 1`, `versionName = "1.0.0"`
- [ ] minSdk 22, targetSdk 34 (requis par Play en 2024)
- [ ] Adaptive icon 432×432 (safe zone 264×264)
- [ ] Icône Play Store 512×512 PNG
- [ ] Feature graphic 1024×500 PNG
- [ ] Screenshots phone : 4 minimum (1080×1920 recommandé)
- [ ] Data Safety : "Aucune donnée collectée ou partagée"
- [ ] Content Rating : Everyone (IARC questionnaire : pas de violence, pas d'user-generated content public en v1)
- [ ] Target Audience : 13+
- [ ] Back button géré (voir `components/CapacitorBridge.tsx`)
- [ ] `android:supportsRtl="true"` dans AndroidManifest (par défaut avec Capacitor)

## Data Safety form — réponses prêtes

| Question | Réponse |
| --- | --- |
| Collecte de données ? | Non |
| Partage avec des tiers ? | Non |
| Données chiffrées en transit ? | N/A (rien n'est envoyé) |
| Possibilité de demander la suppression ? | Oui — via les réglages du navigateur / WebView (localStorage) |
| Auditée par un tiers indépendant ? | Non |
