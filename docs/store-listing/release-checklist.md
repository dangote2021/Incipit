# Incipit — Release checklist (v1.0.0)

## Blockers avant soumission

### Code / PWA
- [x] Manifest complet (icons any + maskable, shortcuts, theme_color)
- [x] Icônes PNG 16/32/192/512/1024 + apple-touch-icon 180
- [x] `appleWebApp` meta (capable, title, status bar)
- [x] `viewportFit: "cover"` + safe-area
- [x] Pages légales (`/privacy`, `/terms`, `/legal`)
- [x] Lien /legal depuis /profile
- [x] Canonical `incipit-navy.vercel.app` partout
- [x] Robots + sitemap incluant les pages légales
- [x] Composant `CapacitorBridge` (back button Android)
- [ ] Build `next build` passant sans warnings critiques
- [ ] Commit + push final

### iOS
- [x] `PrivacyInfo.xcprivacy` prêt (mono-source, pas de tracking, pas de collecte)
- [x] Patch Info.plist prêt (ITSAppUsesNonExemptEncryption, display name, orientations)
- [ ] `npx cap add ios` exécuté sur machine macOS
- [ ] Icône 1024 sans alpha validée dans Xcode
- [ ] Archive + upload TestFlight
- [ ] Formulaire App Privacy rempli (all "No")
- [ ] Reviewer notes : "Aucune collecte, WebView affichant un site public FR, comptes = localStorage"

### Android
- [x] `capacitor.config.ts` avec appId `app.incipit.reader`
- [x] Adaptive icon XML (mipmap-anydpi-v26)
- [x] colors.xml + strings.xml
- [ ] `npx cap add android` exécuté
- [ ] Keystore généré + sauvegardé hors repo
- [ ] .aab buildé
- [ ] Data Safety rempli (all "No")
- [ ] Content rating IARC rempli

### Store listings
- [x] App Store FR/EN rédigé (`docs/store-listing/app-store.md`)
- [x] Google Play FR/EN rédigé (`docs/store-listing/google-play.md`)
- [ ] 5 screenshots phone iPhone 6.7" capturés
- [ ] 5 screenshots phone Android 1080×1920 capturés
- [ ] Feature graphic 1024×500 pour Play
- [ ] Support URL testée (→ /about)
- [ ] Privacy URL testée (→ /privacy)

## Post-submission

- Attendre review iOS (24-72h habituel).
- Attendre review Google (24h-7j pour une première soumission, IARC inclus).
- Garder la PWA Vercel online : les reviewers testent l'URL distante.
- Préparer une réponse type si Apple demande "is this a web wrapper?" → oui, mais l'app ajoute (1) un bridge natif back-button Android, (2) des icônes adaptives, (3) un SplashScreen natif, (4) un StatusBar natif customisé, (5) un PrivacyInfo manifest. Elle offre une expérience native cohérente et n'est pas un simple lien Safari.

## v1.1 (post-launch)

- Vrai paiement Stripe / RevenueCat pour Premium.
- Ajout Supabase auth optionnelle pour synchro badges multi-device.
- Mode prof (PDF export quiz + CC).
- Renommage domaine → incipit.app (acheter DN une fois les revenus Premium en place).
