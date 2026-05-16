# Build Android AAB — Incipit

L'AAB Android est généré automatiquement par GitHub Actions à chaque
push qui touche `public/manifest.json` ou `android/twa-manifest.json`,
ou manuellement via l'onglet **Actions → Build Android AAB → Run workflow**.

## Récupérer l'AAB

1. Va sur https://github.com/dangote2021/Incipit/actions
2. Clique sur le dernier run "Build Android AAB" (status ✅ vert)
3. Section **Artifacts** en bas → télécharge `incipit-android-aab-<sha>`
4. Le ZIP contient `app-release-bundle.aab` à uploader sur Play Console

## Signature AAB (Production)

Pour que l'AAB soit signé avec ton keystore (et donc utilisable pour
upload Play Store update), ajoute ces 4 secrets dans **Settings →
Secrets and variables → Actions** :

| Secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 incipit.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du keystore |
| `ANDROID_KEY_ALIAS` | `incipit` (l'alias choisi dans le keystore) |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé |

⚠️ Le keystore DOIT être le même que celui utilisé pour l'upload initial
sur Play Store (sinon Google rejette les updates). Récupère le keystore
généré par PWABuilder lors du premier setup.

Sans ces secrets, le workflow build un AAB **non signé** utilisable
uniquement pour test local via `bundletool` ou `adb install`.

## Manual dispatch — bump version

Pour publier une nouvelle version :

1. Bump dans `android/twa-manifest.json` :
   - `"appVersionName": "1.0.1"`
   - `"appVersionCode": 2` (entier strictement croissant)
2. Commit + push → workflow auto
3. OU : utilise **Run workflow** dans l'onglet Actions et entre la version
   manuellement (override sans commit)

## Config TWA

`android/twa-manifest.json` contient la config Bubblewrap (package ID,
couleurs, splash, shortcuts). Ne pas modifier sans comprendre — un
changement de `packageId` casserait l'association Play Store + le
`assetlinks.json` déposé.
