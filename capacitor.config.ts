import type { CapacitorConfig } from "@capacitor/cli";

// Stratégie de packaging révisée (mai 2026) : PWA Apple + Android natif.
//
// On ne packagera PAS l'app pour iOS via Apple Developer Program. Les
// utilisateurs Apple installent Incipit comme PWA depuis Safari (Partager →
// Sur l'écran d'accueil), ce qui couvre 100% du périmètre fonctionnel
// d'Incipit (lecture, quiz, push web limité, Stripe via Safari).
//
// Économies : 99 $/an Apple Developer + ~3 semaines de review iOS + ~8h de
// setup Xcode/Fastlane. La config iOS est conservée commentée pour pouvoir
// réactiver sans rework si la stratégie évolue (v2.x).
//
// Android : on wrappe la PWA en WebView remote (server.url). Avantages :
//   - Push d'update front sans nouvelle release Play Store
//   - Bundle léger (~5 Mo)
//   - Pas besoin de `next export` (incompatible avec Server Actions et
//     cookies() qu'on utilise dans /api/me/* et /api/auth/*)
const config: CapacitorConfig = {
  appId: "app.incipit.reader",
  appName: "Incipit",
  webDir: "public",
  server: {
    url: "https://incipit-navy.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  // ┌──────────────────────────────────────────────────────────────────────┐
  // │ iOS natif désactivé — voir ios-scaffold/STATUS.md.                   │
  // │ Conservé en commentaire pour réactivation éventuelle (v2.x).         │
  // └──────────────────────────────────────────────────────────────────────┘
  // ios: {
  //   contentInset: "always",
  //   limitsNavigationsToAppBoundDomains: false,
  //   preferredContentMode: "mobile",
  // },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#FAF7F0",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1A1A2E",
      overlaysWebView: false,
    },
    App: {
      // On écoute backButton depuis le bridge web (components/CapacitorBridge).
    },
  },
};

export default config;
