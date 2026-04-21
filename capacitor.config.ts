import type { CapacitorConfig } from "@capacitor/cli";

// Config Capacitor pour packager l'app web Incipit en iOS + Android.
// On pointe vers le déploiement Vercel tant qu'on n'a pas un export static —
// Next.js App Router avec cookies() + SSR n'est pas compatible `next export`,
// donc on wrappe la PWA en WebView "remote URL" plutôt qu'en assets locaux.
// Dès qu'on aura un backend Supabase, on basculera sur un mode offline-first
// avec `webDir: "out"` + export.
const config: CapacitorConfig = {
  appId: "app.incipit.reader",
  appName: "Incipit",
  webDir: "public",
  server: {
    url: "https://incipit-navy.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
    // On laisse le SafeAreaView de l'app gérer encoches + home indicator.
    limitsNavigationsToAppBoundDomains: false,
    preferredContentMode: "mobile",
  },
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
