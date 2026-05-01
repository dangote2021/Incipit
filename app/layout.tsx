import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import CapacitorBridge from "@/components/CapacitorBridge";
import SyncProvider from "@/components/SyncProvider";
import AppShell from "@/components/AppShell";
import "./globals.css";

// ─── Polices self-hosted via next/font/google ──────────────────────────
// next/font télécharge les polices au build, les inline dans le bundle
// CSS, et expose chaque police comme variable CSS. Avantages vs
// @import url(googleapis) :
//   - 0 requête runtime vers fonts.googleapis.com (perf + RGPD)
//   - Pas de FOIT (flash of invisible text) ni FOUT
//   - Pas de leak d'IP utilisateur vers Google côté UE
const fontSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://incipit-navy.vercel.app"),
  title: {
    default: "Incipit — Les premières lignes qui donnent envie",
    template: "%s · Incipit",
  },
  description:
    "L'app qui redonne envie de lire les classiques. Pitches Boloss, passages clés, book clubs, reading buddies, Rap & Lit, domaine public. Sobre, anti-gamification, pro-plaisir.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Incipit",
    statusBarStyle: "black-translucent",
    // Splash screens iOS — affichées au lancement de la PWA installée.
    // Tailles requises pour chaque modèle iPhone récent (portrait).
    // Génération suggérée : https://progressier.com/pwa-icons-and-ios-splash-screen-generator
    // Les fichiers sont attendus dans /public/splash/ — fallback : Safari
    // affiche un écran blanc jusqu'au 1er paint si fichier absent.
    startupImage: [
      { url: "/splash/iphone-se.png",          media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash/iphone-x.png",           media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/iphone-xr.png",          media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash/iphone-xs-max.png",      media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/iphone-12.png",          media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/iphone-12-pro-max.png",  media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/iphone-14-pro.png",      media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/iphone-14-pro-max.png",  media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
    ],
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "Incipit — Les premières lignes qui donnent envie",
    description:
      "Les classiques pitchés comme ils méritent. Pitches Boloss, passages clés, book clubs, punchlines rap décortiquées, lecture gratuite domaine public.",
    url: "/",
    siteName: "Incipit",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Incipit — Les classiques qui donnent envie de lire",
    description:
      "Booba cite Baudelaire. Flaubert c'est Desperate Housewives avant l'heure. Les classiques t'attendent.",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "littérature",
    "classiques français",
    "book club",
    "lecture",
    "Flaubert",
    "Zola",
    "Hugo",
    "Baudelaire",
    "Rimbaud",
    "domaine public",
  ],
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen paper-texture">
        {/* Skip-link global — premier focus au tab depuis l'URL bar.
            Rapporté par Théo (panel beta v6, NVDA + clavier) : sur les pages
            avec header, il fallait tabuler 5+ fois avant d'atteindre le
            contenu. Le lien est masqué visuellement (sr-only) tant qu'il
            n'a pas le focus, puis vient se poser en haut à gauche en
            écriture sobre. Cible #main-content que toutes les pages
            (App Router) résolvent vers leur premier <main>.
            Note : on cible aussi par fragment URL — un partage de lien
            avec #main-content amène directement au contenu. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:rounded-full focus:text-[11px] focus:uppercase focus:tracking-widest focus:font-bold focus:shadow-2xl focus:outline focus:outline-2 focus:outline-gold"
        >
          Aller au contenu
        </a>
        <AppShell>{children}</AppShell>
        <BottomNav />
        <ServiceWorkerRegister />
        <CapacitorBridge />
        <SyncProvider />
      </body>
    </html>
  );
}
